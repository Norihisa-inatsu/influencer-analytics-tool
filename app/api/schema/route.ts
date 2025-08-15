import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs'
export const revalidate = 0

export async function GET() {
  try {
    // 環境変数が設定されているかチェック
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase environment variables not configured' },
        { status: 500 }
      );
    }

    // テーブルの構造を確認するために、1件だけ取得してみる
    const { data, error } = await supabase
      .from('casfeed')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to query table', details: error.message },
        { status: 500 }
      );
    }

    if (data && data.length > 0) {
      // 最初のレコードのキーを取得してスキーマ情報として返す
      const sampleRecord = data[0];
      const columns = Object.keys(sampleRecord);
      
      return NextResponse.json({
        message: 'Table structure retrieved successfully',
        columns: columns,
        sampleData: sampleRecord,
        totalRecords: '1,141+ (as mentioned by user)'
      });
    } else {
      return NextResponse.json({
        message: 'Table exists but no data found',
        columns: [],
        totalRecords: 0
      });
    }

  } catch (error) {
    console.error('Schema API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
