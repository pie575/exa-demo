> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Codex と ChatGPT で Exa を使う {#exa-in-codex-and-chatgpt}

> Codex や ChatGPT から直接 Exa を使って、ウェブ検索、任意のページの読み込み、リサーチを行えます。

Exa プラグインを一度インストールするだけで、Codex と ChatGPT が Exa 経由でリアルタイムのウェブにアクセスできるようになります。会話やコーディングセッションを中断することなく、最新情報の検索、重要なソースの読み込み、より詳細なリサーチの実行が可能です。

## Exa をインストールする {#install-exa}

<Steps>
  <Step title="プラグインを開く">
    [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app) にアクセスすると、OpenAI のプラグインディレクトリで **Exa** が開きます。このディレクトリは ChatGPT と Codex で共通です。
  </Step>

  <Step title="インストールする">
    プラスボタンを選択してインストールします。インストール時、または Codex や ChatGPT が初めて Exa を使用する際にサインインを求められたら、Exa にサインインしてください。

    <Frame caption="Codex でプラグインを開き、Exa を追加してアクセスを承認する">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Codex でプラグインを開き、Exa プラグインを表示してアクセスを承認する様子" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="新しいセッションを開始する">
    スキルは、インストール後に開始したチャットや CLI セッションでのみ読み込まれます。新しいセッションを開き、Web 検索が必要な依頼を試してみてください。
  </Step>
</Steps>

これで完了です。プラグインには Exa の MCP インテグレーションとスキルの両方が含まれているため、MCP やスキルを別途設定する必要はありません。

## 最新のウェブ情報を活用して開発する {#build-with-whats-on-the-web-right-now}

開発に使うライブラリ、API、ツールは日々変化しています。Exa をインストールすると、Codex は作業しながら最新のドキュメント、issue、変更履歴、実際のコード例を検索できるようになります。

リポジトリ内で次のコマンドを実行します。

```text theme={null}
現在は Tailwind v3 を使用しています。Tailwind v4 のアップグレードガイドを検索して読んだうえで、
このプロジェクトを v4 に移行してください。
```

Codex は Exa で検索し、関連するソースを読み込み、得られた情報をもとにコードベースに変更を加えることができます。

答えがリポジトリの外にありそうな場面なら、いつでも同じように活用できます。

* 「修正に取りかかる前に、`tokio-tungstenite` の issue と変更履歴でこのエラーを検索して」
* 「Rust で Postgres のアドバイザリロックを使っている実例を探して、このワーカープールに合うパターンを提案して」
* 「Stripe の最新の webhook ドキュメントを読んで、こちらの実装がそれに沿っているか確認して」
* 「この依存関係の最新の移行ガイドを検索してから、アップグレードして」

## 検索、閲覧、リサーチ {#search-read-and-research}

Exa プラグインを使うと、Codex と ChatGPT は 3 つの方法でウェブを活用できます。

<Columns cols={3}>
  <Card title="検索" icon="search">
    自然言語で検索し、リンクの一覧ではなく、最適なページのコンテンツそのものを取得します。
  </Card>

  <Card title="閲覧" icon="file-text">
    ドキュメント、変更履歴、issue、ブログ記事など、指定したページを読み取ります。
  </Card>

  <Card title="リサーチ" icon="compass">
    1 回の検索では答えが出ない質問を段階的に掘り下げ、引用付きで回答します。
  </Card>
</Columns>

## ChatGPT を離れずにリサーチ {#research-without-leaving-chatgpt}

Exa は ChatGPT でも使えます。最新の情報が必要な質問をすれば、会話から直接 Exa を使ってウェブを検索し、リサーチできます。

```text theme={null}
主要なオープンソースのベクトルデータベースについて、マネージドサービス、ライセンス、
料金体系を比較してください。最新の一次情報源にあたり、出典を明記してください。
```

ChatGPT は、すでにコンテキストにある情報だけに頼るのではなく、Exa を使ってタスクに必要なソースを見つけて読み込むことができます。

競合リサーチ、技術リサーチ、市場マッピング、企業リサーチなど、答えがウェブ上に散在しているあらゆる用途に活用できます。

## MCP とスキルの組み合わせ {#mcp-skills-together}

このプラグインは、Exa のエージェントスタックを構成する 2 つの要素を内部で組み合わせています。

[Exa MCP](/ja/docs/get-started/exa-mcp) は、Codex と ChatGPT に Exa へアクセスするためのツールを提供します。エージェントと Exa の検索機能やリサーチ機能をつなぐ役割を担います。

[Exa スキル](/ja/docs/get-started/agent-skills/overview) は、これらの機能を実用的なワークフローで活用するための追加の指示をエージェントに与えます。Web リサーチや [Exa Agent](/ja/docs/agent/quickstart) を使ったワークフローにも対応しています。

プラグインをインストールするだけで使えるため、どちらも個別に設定する必要はありません。

## MCP を直接使いたい場合 {#prefer-mcp-directly}

Codex と ChatGPT で Exa を使う場合は、プラグインの利用をおすすめします。Codex を手動で設定する場合や、他の MCP クライアントを使用する場合は、Exa がホストする MCP サーバーに直接接続できます：

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

その他のクライアント、設定オプション、利用可能なツールについては、[Exa MCP](/ja/docs/get-started/exa-mcp) を参照してください。

<Card title="ChatGPT と Codex に Exa をインストール" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  ChatGPT のマーケットプレイスから Exa プラグインを追加できます。
</Card>