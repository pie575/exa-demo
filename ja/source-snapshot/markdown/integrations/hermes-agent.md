> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳細を確認する前に、このファイルで利用可能なすべてのページを把握してください。

<div id="hermes-agent">
  # Hermes Agent
</div>

> Exa を使って、Hermes Agent にリアルタイムのウェブ検索とページコンテンツ取得の機能を追加します。

[Hermes Agent](https://github.com/NousResearch/hermes-agent) は、モデルから呼び出せる `web_search` ツールと `web_extract` ツールのネイティブバックエンドとして Exa を組み込んでいます。両方の機能に Exa を使うことも、別の Hermes ウェブプロバイダーと組み合わせて使うこともできます。

<div id="connect-your-exa-account">
  ## Exa アカウントを接続する
</div>

<Steps>
  <Step title="Exa API キーを取得する">
    <Card title="Exa API キーを取得" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Step>

  <Step title="Hermes で Exa を選択する">
    ツールのセットアップウィザードを実行します。

    ```bash theme={null}
    hermes tools
    ```

    **Web Search &amp; Extract** を開いて Exa を選び、API キー認証のオプションを選択します。入力を求められたら Exa API キーを入力してください。Hermes はシークレットを `~/.hermes/.env` に、プロバイダーの選択を `~/.hermes/config.yaml` に保存します。
  </Step>

  <Step title="ウェブアクセスをテストする">
    Hermes を起動し、検索を実行して結果の 1 つを読み込むよう指示します。

    ```text theme={null}
    Search the web for the latest Exa product updates, then read the most relevant result.
    ```

    Hermes が `web_search` を呼び出し、ページ本文が必要な場合は続けて `web_extract` を呼び出せば成功です。
  </Step>
</Steps>

<div id="configure-manually">
  ## 手動で設定する
</div>

Hermes の環境ファイルにキーを追加します。

```bash ~/.hermes/.env theme={null}
EXA_API_KEY=your-exa-api-key
```

次に、両方のWeb機能でExaを選択します。

```yaml ~/.hermes/config.yaml theme={null}
web:
  search_backend: "exa"
  extract_backend: "exa"
```

代わりに、共有フォールバックを使用することもできます。

```yaml ~/.hermes/config.yaml theme={null}
web:
  backend: "exa"
```

ケイパビリティごとの設定は `web.backend` よりも優先されます。そのため、複数のプロバイダーを組み合わせる場合に、Exa を検索専用または抽出専用として使用できます。

<div id="tools-hermes-gets">
  ## Hermes で使えるツール
</div>

| ツール           | Exa での動作                                            |
| ------------- | --------------------------------------------------- |
| `web_search`  | Exa で検索し、タイトル、URL、テキストスニペットを含むページをランク順に返します。        |
| `web_extract` | Exa Contents を使用して、1 つ以上の URL から読み取り可能なコンテンツを取得します。 |

Hermes は、抽出したページが長い場合は設定された文字数上限で切り詰め、全文をディスクに保存します。デフォルト値は `web.extract_char_limit` で変更できます。また、個々の呼び出しでエージェントがより大きな `char_limit` をリクエストできるようにすることも可能です。

<Note>
  Hermes は、キー不要の無料プロバイダープールを通じて、API キーなしで Exa を利用できます。このプールにはレート制限があり、使用されるプロバイダーが切り替わる場合があります。リクエストで常に自分の Exa アカウントを使用したい場合は、`EXA_API_KEY` を設定し、API キー認証の Exa オプションを選択してください。
</Note>

<div id="troubleshooting">
  ## トラブルシューティング
</div>

<AccordionGroup>
  <Accordion title="Hermes で Exa が選択されない">
    `hermes tools` を実行し、Exa を明示的に選択してください。設定ファイルを手動で編集する場合は、`web.search_backend`、`web.extract_backend`、または `web.backend` が `exa` に設定されていることを確認してください。
  </Accordion>

  <Accordion title="Hermes で EXA_API_KEY が見つからないというエラーが出る">
    キーを `~/.hermes/.env` に追加してから Hermes を再起動し、環境変数を再読み込みさせてください。
  </Accordion>

  <Accordion title="検索は動作するが、抽出に別のプロバイダーが使われる">
    Hermes では検索と抽出を個別に設定できます。`web.search_backend` と `web.extract_backend` の両方を `exa` に設定してください。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## リソース
</div>

<Columns cols={3}>
  <Card title="Hermes のウェブツール" icon="book-open" href="https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search" cta="ガイドを読む" arrow="true">
    Hermes のプロバイダー選択、キャッシュ、抽出の動作について確認できます。
  </Card>

  <Card title="Exa Search" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを読む" arrow="true">
    Exa が検索、フィルタリングを行い、ページコンテンツを返す仕組みについて説明します。
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/ja/docs/contents/quickstart" cta="ガイドを読む" arrow="true">
    `web_extract` の基盤となる抽出 API について説明します。
  </Card>
</Columns>