> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳細を調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Stripe Projects {#stripe-projects}

> Stripe Projects CLI を使って、ターミナルから Exa を導入できます。

[Stripe Projects](https://projects.dev) を使えば、開発者自身やコーディングエージェントがターミナルからサードパーティのサービスをプロビジョニングできます。ダッシュボードを操作したり、キーをコピー＆ペーストしたりする必要はありません。コマンド 1 つで Exa アカウントが作成され、API キーがプロジェクトに同期されます。

## 前提条件 {#prerequisites}

Stripe CLI と Projects プラグインをインストールしてください。

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

その他のプラットフォームや CLI の詳しいセットアップ手順については、[Stripe Projects](https://projects.dev) を参照してください。

## はじめに {#get-started}

プロジェクトディレクトリで次のコマンドを実行し、プロジェクトの初期化、Exa の追加、認証情報の取得を行います。

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

`.env` に `EXA_API_KEY` が追加されました。[Exa SDK](/ja/docs/sdks/quickstart) と[クイックスタート](/ja/docs/search/quickstart)はこの変数を自動的に読み込むため、コードを変更せずにそのまま動作します。

<Info>
  キーは、お客様が所有する Exa アカウントにプロビジョニングされます。使用量、キー、課金は [Exa Dashboard](https://dashboard.exa.ai) からいつでも管理できます。
</Info>

## 既存の Exa チームをリンクする {#link-an-existing-exa-team}

すでに Exa アカウントをお持ちの場合は、先にアカウントを接続してください。接続すると、API キーは既存のチームに対してプロビジョニングされます。

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link` を実行すると Exa が開き、認証を行ってチームを Stripe アカウントに関連付けられます。連携済みの Exa Dashboard は、`stripe projects open exa` でいつでも開けます。

## コーディングエージェントからプロビジョニングする {#provision-from-your-coding-agent}

`stripe projects init` を実行すると、Stripe Projects の [Agent Skill](https://projects.dev) がプロジェクトに追加されます。これにより、エージェント (Claude Code、Cursor、Codex など) に一連の手順を任せることができます：

```text theme={null}
Stripe Projects で Exa を追加して、API キーを設定してください。
```

## 次のステップ {#next-steps}

* [クイックスタート](/ja/docs/search/quickstart): SDK を使って最初の Exa 検索を実行します。
* [Stripe Projects ドキュメント](https://docs.stripe.com/projects): CLI の完全なリファレンスのほか、環境や課金について説明しています。
* [Exa Dashboard](https://dashboard.exa.ai): API キー、使用量、課金を管理できます。
* [プロバイダーカタログ](https://projects.dev): Stripe Projects のすべてのプロバイダーを確認できます。