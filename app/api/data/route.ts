import { NextResponse } from 'next/server';

// ルートの実行環境を Node.js に固定（Edge ではなく）
export const runtime = 'nodejs'
// 常に最新を取得（キャッシュ無効）
export const revalidate = 0

export async function GET(request: Request) {
  console.log('API Route: GET request received');
  try {
    // フロントエンドから送られてきたパラメータを取得
    const { searchParams } = new URL(request.url);
    const media = searchParams.get('media');
    const objective = searchParams.get('objective');
    
    console.log('API Route: media =', media);
    console.log('API Route: objective =', objective);

    // GASのウェブアプリURL（/a/macros/ ではなく公開用の /macros/s/ URL を使用）
    const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbzMYH3_LJT3srOFdq395aKtDQTC6Niv2YbNU_qwtB0V4Xmgn4Z6S5teAkPlh6SCfDNG/exec';

    const url = new URL(GAS_API_URL);
    if (media) url.searchParams.append('media', media);
    if (objective) url.searchParams.append('objective', objective);

    console.log('API Route: GAS URL =', url.toString());

    // ★重要：サーバーからGASへの直接通信なので、CORSエラーは発生しない
    // ここで、サーバーがGoogleアカウントとして認証する処理が必要になります（後述）
    const response = await fetch(url.toString(), {
      // 必要に応じて認証ヘッダーを追加
      // headers: { 'Authorization': `Bearer ${token}` },
      // Next.js のサーバーフェッチでキャッシュを無効化
      cache: 'no-store',
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
      redirect: 'follow',
    });

    console.log('API Route: GAS response status =', response.status);

    const rawBody = await response.text()
    if (!response.ok) {
      console.error('API Route: Upstream error body (snippet):', rawBody.slice(0, 500))
      return NextResponse.json(
        {
          error: 'Upstream error',
          status: response.status,
          bodySnippet: rawBody.slice(0, 1000),
        },
        { status: 502 }
      )
    }

    // JSON でない可能性（HTML などで返る）に備えてフォールバック
    let data: unknown
    try {
      data = JSON.parse(rawBody)
    } catch (e) {
      console.error('API Route: GAS returned non-JSON response (snippet):', rawBody.slice(0, 500))
      return NextResponse.json(
        { error: 'Upstream returned non-JSON', bodySnippet: rawBody.slice(0, 1000) },
        { status: 502 }
      )
    }

    // 取得したデータをフロントエンドに返す
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route Error:', error);
    // エラーが発生した場合は、500エラーを返す
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
