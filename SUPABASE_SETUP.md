# Supabase設定手順

## 1. 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の内容を追加してください：

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://xewqkeympgweowrgtkwp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## 2. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com) にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト設定から以下を取得：
   - Project URL
   - Service Role Key (Settings > API > Project API keys > service_role)

## 3. データベーステーブルの確認

既存の`casfeed`テーブルを使用します。以下のカラムが存在することを確認してください：

- `アカウント名` (text)
- `ハンドル名` (text)
- `CPM` (numeric)
- `単価数値` (numeric)
- `集計元n数` (numeric)
- `モデルカテゴリ` (text)

## 4. アプリケーションの再起動

環境変数を設定した後、開発サーバーを再起動してください：

```bash
npm run dev
```

## 注意事項

- `SUPABASE_SERVICE_ROLE_KEY`は機密情報なので、`.env.local`ファイルにのみ保存し、Gitにコミットしないでください
- このキーはサーバーサイドでのみ使用され、クライアントサイドには公開されません
