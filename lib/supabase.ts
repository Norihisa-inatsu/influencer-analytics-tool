import { createClient } from '@supabase/supabase-js'

// 環境変数からのみ読み込む（フォールバックのハードコードは廃止）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  // サーバー側のみで使われる想定のため、明確に起動時エラーにする
  throw new Error('Supabaseの環境変数が未設定です。NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // サーバー側利用のためセッションは保持しない
    autoRefreshToken: false,
    persistSession: false,
  },
})
