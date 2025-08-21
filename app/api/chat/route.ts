import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { message, conversation_id } = await request.json();

  // .env.localからDifyのAPI情報を取得
  const DIFY_API_URL = process.env.DIFY_API_URL;
  const DIFY_API_KEY = process.env.DIFY_API_KEY;

  if (!DIFY_API_URL || !DIFY_API_KEY) {
    console.error('Dify environment variables not configured');
    return NextResponse.json({ error: 'Dify environment variables not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        user: "casfeed-user", // ユーザーを識別するID（固定または動的に変更）
        response_mode: "streaming", 
        conversation_id: conversation_id || "",
      }),
    });

    // Difyからのストリーミングレスポンスをクライアントに中継
    if (!response.body) {
      return NextResponse.json({ error: 'No response body from Dify' }, { status: 500 });
    }
    
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (error) {
    console.error('Dify API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
