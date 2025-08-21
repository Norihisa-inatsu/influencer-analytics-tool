import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ルートの実行環境を Node.js に固定（Edge ではなく）
export const runtime = 'nodejs'
// 常に最新を取得（キャッシュ無効）
export const revalidate = 0

export async function GET(request: Request) {
  console.log('=== API Route: GET request received for /api/performance ===');
  try {
    // フロントエンドから送られてきたパラメータを取得
    const { searchParams } = new URL(request.url);
    const media = searchParams.get('media');
    const objective = searchParams.get('objective');
    
    console.log('API Route: Received media =', media);
    console.log('API Route: Received objective =', objective);

    // パラメータの検証を緩和
    if (!media) {
      console.log('API Route: Media parameter is missing, returning error');
      return NextResponse.json(
        { error: 'Media parameter is required' },
        { status: 400 }
      );
    }

    // objectiveが空の場合は、より多くのデータを返す
    const hasObjective = objective && objective.trim() !== '';
    console.log('API Route: Has objective =', hasObjective);

    // 環境変数が設定されているかチェック
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Environment variables not set, returning error');
      return NextResponse.json(
        { error: 'Supabase environment variables not configured' },
        { status: 500 }
      );
    }

    try {
      let query = supabase
        .from('casfeed')
        .select('*');

      // 媒体でフィルタリング（実際のカラム名「媒体」を使用）
      if (media !== 'all') {
        console.log(`API Route: Filtering by 媒体 = '${media}'`);
        query = query.eq('媒体', media);
      } else {
        console.log('API Route: Media is "all", not filtering by 媒体');
      }

      // 目的でフィルタリング（実際のカラム名「目的」を使用）
      if (hasObjective) {
        console.log(`API Route: Filtering by 目的 = '${objective}'`);
        query = query.eq('目的', objective);
      } else {
        console.log('API Route: Objective is empty, not filtering by 目的');
      }

      // クエリを実行
      console.log('API Route: Executing query...');
      const { data, error } = await query.limit(1000); // 取得上限を増やす

      if (error) {
        console.error('Supabase error:', error);
        
        // テーブルが存在しない場合やカラムが存在しない場合はエラーを返す
        if (error.code === 'PGRST205' || error.code === '42703') {
          console.log('Table or column not found, returning error');
          return NextResponse.json(
            { error: 'Database structure issue', details: error.message },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { error: 'Database query failed', details: error.message },
          { status: 500 }
        );
      }

      console.log('API Route: Supabaseから取得したレコード数:', data?.length || 0);
      
      // データの詳細ログ（最初の3件）
      if (data && data.length > 0) {
        console.log('API Route: 最初の3件のデータ:');
        data.slice(0, 3).forEach((item, index) => {
          console.log(`  ${index + 1}件目:`, {
            媒体: item['媒体'],
            目的: item['目的'],
            CPM: item['CPM'],
            単価数値: item['単価数値']
          });
        });
      }
      
      // データが少ない場合でも、モックデータは補完しない
      if (!data || data.length === 0) {
        console.log('API Route: No data found from Supabase');
        return NextResponse.json([]);
      }

      return NextResponse.json(data || []);

    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API Route Error:', error);
    // エラーが発生した場合は、500エラーを返す
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
