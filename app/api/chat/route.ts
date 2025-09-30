import { NextResponse, NextRequest } from 'next/server';

export const runtime = 'nodejs';

// Dify両方式に自動対応
export async function POST(request: NextRequest) {
  const { message } = await request.json();

  const DIFY_API_URL = process.env.DIFY_API_URL;
  const DIFY_API_KEY = process.env.DIFY_API_KEY;

  if (!DIFY_API_URL || !DIFY_API_KEY) {
    console.error('Dify environment variables not configured');
    return NextResponse.json({ error: 'Dify environment variables not configured' }, { status: 500 });
  }

  const isWorkflow = /\/v1\/workflows\//.test(DIFY_API_URL);

  try {
    if (isWorkflow) {
      // Workflow: blockingで確実に最終出力を取得し、SSEで1回返す
      const wf = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DIFY_API_KEY}`,
        },
        body: JSON.stringify({ inputs: { input: message }, response_mode: 'blocking', user: 'casfeed-user' }),
      });

      if (!wf.ok) {
        const text = await wf.text().catch(() => '');
        console.error('Dify API non-200 (workflow blocking):', wf.status, text);
        return NextResponse.json({ error: 'Dify API request failed' }, { status: 500 });
      }

      const data = await wf.json().catch(() => ({} as any));
      const outputs = (data?.data?.outputs) || (data?.outputs) || {};
      const answer: string = outputs.text || outputs.answer || '';

      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ answer: answer || '（回答が取得できませんでした）' })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Chat API: streamingをそのまま中継
    const difyRes = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({ inputs: {}, query: message, response_mode: 'streaming', user: 'casfeed-user' }),
    });

    if (!difyRes.body) {
      const text = await difyRes.text().catch(() => '');
      console.error('Dify streaming API no body:', difyRes.status, text);
      return NextResponse.json({ error: 'No response body from Dify' }, { status: 500 });
    }

    return new Response(difyRes.body, {
      status: difyRes.status,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Dify API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
