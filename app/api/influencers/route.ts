import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request: Request) {
  console.log('API Route: GET request received for /api/influencers');
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const media = searchParams.get('media');
    const objective = searchParams.get('objective');
    const sortBy = searchParams.get('sortBy'); // 'cpm' or 'cost'
    const order = searchParams.get('order'); // 'asc' or 'desc'

    // 環境変数チェック
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase environment variables not configured' }, { status: 500 });
    }

    let query = supabase.from('casfeed').select('*');

    // キーワードでのあいまい検索
    if (keyword) {
      query = query.or(`アカウント名.ilike.%${keyword}%,ハンドル名.ilike.%${keyword}%,モデルカテゴリ.ilike.%${keyword}%,媒体.ilike.%${keyword}%,目的.ilike.%${keyword}%`);
    }

    // 媒体での絞り込み
    if (media) {
      query = query.eq('媒体', media);
    }

    // 目的での絞り込み
    if (objective) {
      query = query.eq('目的', objective);
    }

    // 並び替え
    if (sortBy) {
      const sortColumn = sortBy === 'cpm' ? 'CPM' : '単価数値';
      const ascending = order === 'asc';
      query = query.order(sortColumn, { ascending: ascending });
    }

    query = query.limit(20); // 念のため結果を20件に制限

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database query failed', details: error.message }, { status: 500 });
    }

    console.log('API Route: Found', data?.length || 0, 'records from Supabase');
    return NextResponse.json(data || []);

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
