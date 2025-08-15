import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ルートの実行環境を Node.js に固定（Edge ではなく）
export const runtime = 'nodejs'
// 常に最新を取得（キャッシュ無効）
export const revalidate = 0

export async function GET(request: Request) {
  console.log('API Route: GET request received for /api/performance');
  try {
    // フロントエンドから送られてきたパラメータを取得
    const { searchParams } = new URL(request.url);
    const media = searchParams.get('media');
    const objective = searchParams.get('objective');
    
    console.log('API Route: media =', media);
    console.log('API Route: objective =', objective);

    // パラメータの検証を緩和
    if (!media) {
      return NextResponse.json(
        { error: 'Media parameter is required' },
        { status: 400 }
      );
    }

    // objectiveが空の場合は、より多くのデータを返す
    const hasObjective = objective && objective.trim() !== '';

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
        .select('*')
        .limit(200); // より多くのデータを取得

      // 媒体でフィルタリング（実際のカラム名「媒体」を使用）
      if (media !== 'all') {
        query = query.eq('媒体', media);
      }

      // 目的でフィルタリング（実際のカラム名「目的」を使用）
      if (hasObjective) {
        query = query.eq('目的', objective);
      }

      const { data, error } = await query;

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

      console.log('API Route: Found', data?.length || 0, 'records from Supabase');
      
      // データが少ない場合でも、モックデータは補完しない
      if (!data || data.length === 0) {
        console.log('No data found from Supabase');
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
