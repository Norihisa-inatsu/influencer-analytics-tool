import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const revalidate = 0

// 媒体 → 参照ビュー名の対応（読み取り専用ビューを参照）
const MEDIA_TO_VIEW: Record<string, string> = {
  TikTok: 'v_tiktok_raw_data',
  Instagram: 'v_instagram_raw_data',
  X: 'v_x_raw_data',
}

// 目的の媒体別優先順（先頭に来るほど優先）
const OBJECTIVE_PRIORITY: Record<string, string[]> = {
  TikTok: ['リーチ', '動画視聴', 'トラフィック'],
  Instagram: ['リーチ', '完全視聴', 'トラフィック'],
  X: ['リーチ', 'ENG', 'トラフィック'],
}

// 最低限の正規化: 前後空白を削除し、空・nullを除外
function normalizeValue(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const s = String(value).trim()
  if (!s) return null
  // ここで必要に応じて全角/半角統一や大小統一などを拡張可能
  return s
}

function sortObjectivesByPriority(values: string[], media: string): string[] {
  const priority = OBJECTIVE_PRIORITY[media] || []
  const prioritySet = new Set(priority)
  const head: string[] = []
  const tail: string[] = []
  for (const v of values) {
    if (prioritySet.has(v)) head.push(v)
    else tail.push(v)
  }
  // head は priority に従って並べ替え（定義順）
  head.sort((a, b) => priority.indexOf(a) - priority.indexOf(b))
  // tail は名称順（日本語のロケール比較を使用）
  tail.sort((a, b) => a.localeCompare(b, 'ja'))
  return [...head, ...tail]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const field = searchParams.get('field') // 'objective' | 'model_category' | 'product_genre' | 'product'
    const media = searchParams.get('media') // 'TikTok' | 'Instagram' | 'X'
    const objective = searchParams.get('objective')
    const modelCategory = searchParams.get('modelCategory')
    const productGenre = searchParams.get('productGenre')

    if (!field) {
      return NextResponse.json({ error: 'field parameter is required' }, { status: 400 })
    }
    if (!media) {
      return NextResponse.json({ error: 'media parameter is required' }, { status: 400 })
    }

    const viewName = MEDIA_TO_VIEW[media]
    if (!viewName) {
      return NextResponse.json({ error: `unsupported media: ${media}` }, { status: 400 })
    }

    // クエリ構築
    let query = supabase.from(viewName).select(field)

    if (objective && objective !== 'all') {
      query = query.eq('objective', objective)
    }
    if (modelCategory && modelCategory !== 'all') {
      query = query.eq('model_category', modelCategory)
    }
    if (productGenre && productGenre !== 'all') {
      query = query.eq('product_genre', productGenre)
    }

    const { data, error } = await query
    if (error) {
      console.error('Influencer Schema API: Supabase error', error)
      return NextResponse.json({ error: 'database error', details: error.message }, { status: 500 })
    }

    const rawValues = (data || []).map((row: any) => row[field])
    const normalized = rawValues
      .map(normalizeValue)
      .filter((v): v is string => v !== null)

    // ユニーク化
    const unique = Array.from(new Set(normalized))

    let sorted = unique
    if (field === 'objective') {
      sorted = sortObjectivesByPriority(unique, media)
    } else {
      sorted = unique.sort((a, b) => a.localeCompare(b, 'ja'))
    }

    return NextResponse.json({ success: true, data: sorted, count: sorted.length })
  } catch (err: any) {
    console.error('Influencer Schema API: Unexpected error', err)
    return NextResponse.json({ error: 'Internal Server Error', details: err?.message || String(err) }, { status: 500 })
  }
}


