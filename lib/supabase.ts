import { createClient } from '@supabase/supabase-js'

// 環境変数からのみ読み込む（フォールバックのハードコードは廃止）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// ビルド時にはエラーをスローせず、実行時にエラーチェックを行う
// 環境変数が未設定の場合でも、ダミークライアントを作成してビルドを通す
export const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        // サーバー側利用のためセッションは保持しない
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : // 環境変数が未設定の場合、プロキシで実行時にエラーをスロー
    new Proxy({} as ReturnType<typeof createClient>, {
      get() {
        throw new Error('Supabaseの環境変数が未設定です。NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。')
      }
    })
