import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ルートの実行環境を Node.js に固定（Edge ではなく）
export const runtime = 'nodejs'
// 常に最新を取得（キャッシュ無効）
export const revalidate = 0

// モックデータ（テーブルが作成されるまでの間使用）
const mockData = [
  {
    'アカウント名': '@beauty_guru',
    'ハンドル名': 'Beauty Guru',
    'CPM': 450,
    '単価数値': 1200,
    '集計元n数': 15,
    'モデルカテゴリ': '美容'
  },
  {
    'アカウント名': '@tech_reviewer',
    'ハンドル名': 'Tech Reviewer',
    'CPM': 380,
    '単価数値': 890,
    '集計元n数': 22,
    'モデルカテゴリ': 'テック'
  },
  {
    'アカウント名': '@fashion_icon',
    'ハンドル名': 'Fashion Icon',
    'CPM': 520,
    '単価数値': 1450,
    '集計元n数': 18,
    'モデルカテゴリ': 'ファッション'
  },
  {
    'アカウント名': '@gaming_pro',
    'ハンドル名': 'Gaming Pro',
    'CPM': 350,
    '単価数値': 650,
    '集計元n数': 30,
    'モデルカテゴリ': 'ゲーム'
  }
];

export async function GET(request: Request) {
  console.log('API Route: GET request received for /api/influencers');
  try {
    // フロントエンドから送られてきたパラメータを取得
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    
    console.log('API Route: keyword =', keyword);

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword parameter is required' },
        { status: 400 }
      );
    }

    // 環境変数が設定されているかチェック
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Environment variables not set, returning mock data');
      const filteredMockData = mockData.filter(item => 
        item['アカウント名'].toLowerCase().includes(keyword.toLowerCase()) ||
        item['ハンドル名'].toLowerCase().includes(keyword.toLowerCase()) ||
        item['モデルカテゴリ'].toLowerCase().includes(keyword.toLowerCase())
      );
      return NextResponse.json(filteredMockData);
    }

    try {
      // Supabaseからデータを検索
      const { data, error } = await supabase
        .from('casfeed')
        .select('*')
        .or(`アカウント名.ilike.%${keyword}%,ハンドル名.ilike.%${keyword}%,モデルカテゴリ.ilike.%${keyword}%`)
        .limit(100);

      if (error) {
        console.error('Supabase error:', error);
        
        // テーブルが存在しない場合はモックデータを返す
        if (error.code === 'PGRST205') {
          console.log('Table not found, returning mock data');
          const filteredMockData = mockData.filter(item => 
            item['アカウント名'].toLowerCase().includes(keyword.toLowerCase()) ||
            item['ハンドル名'].toLowerCase().includes(keyword.toLowerCase()) ||
            item['モデルカテゴリ'].toLowerCase().includes(keyword.toLowerCase())
          );
          return NextResponse.json(filteredMockData);
        }
        
        return NextResponse.json(
          { error: 'Database query failed', details: error.message },
          { status: 500 }
        );
      }

      console.log('API Route: Found', data?.length || 0, 'records from Supabase');
      return NextResponse.json(data || []);

    } catch (dbError) {
      console.error('Database connection error:', dbError);
      console.log('Falling back to mock data');
      
      // データベース接続エラーの場合もモックデータを返す
      const filteredMockData = mockData.filter(item => 
        item['アカウント名'].toLowerCase().includes(keyword.toLowerCase()) ||
        item['ハンドル名'].toLowerCase().includes(keyword.toLowerCase()) ||
        item['モデルカテゴリ'].toLowerCase().includes(keyword.toLowerCase())
      );
      return NextResponse.json(filteredMockData);
    }

  } catch (error) {
    console.error('API Route Error:', error);
    // エラーが発生した場合は、500エラーを返す
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
