import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field'); // 取得したいフィールド名
    const media = searchParams.get('media'); // 媒体フィルター
    const objective = searchParams.get('objective'); // 目的フィルター
    const modelCategory = searchParams.get('modelCategory'); // モデルカテゴリフィルター
    const productGenre = searchParams.get('productGenre'); // 商品ジャンルフィルター

    if (!field) {
      return NextResponse.json({ error: 'field parameter is required' }, { status: 400 });
    }

    let query = supabase.from('casfeed').select(field);

    // 連動フィルタリングを適用
    if (media && media !== 'all') {
      query = query.eq('媒体', media);
    }
    if (objective && objective !== 'all') {
      query = query.eq('目的', objective);
    }
    if (modelCategory && modelCategory !== 'all') {
      query = query.eq('モデルカテゴリ', modelCategory);
    }
    if (productGenre && productGenre !== 'all') {
      query = query.eq('商材ジャンル', productGenre);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Schema API Route: Supabaseエラー:', error);
      return NextResponse.json({ error: 'データベースエラー', details: error.message }, { status: 500 });
    }

    // 重複を除去してユニークな値のみを返す
    const uniqueValues = Array.from(new Set(data?.map((item: any) => item[field]).filter(Boolean))).sort();

    return NextResponse.json({ 
      success: true, 
      data: uniqueValues,
      count: uniqueValues.length 
    });

  } catch (error) {
    console.error('Schema API Route Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
