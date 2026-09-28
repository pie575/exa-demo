> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの完全版は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# 開発者向けクイックスタート {#developer-quickstart}

> API キーを取得して、コードやエージェントから Exa を利用しましょう。

<div className="docs-quickstart-section docs-quickstart-auth">
  ## 1. API キーを取得する {#1-get-an-api-key}

  <Steps>
    <Step title="Exa Dashboard にアクセスする">
      <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
        ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
      </Card>
    </Step>

    <Step title="キーを環境変数に設定する">
      <Tabs>
        <Tab title="macOS/Linux">
          ```bash theme={null}
          export EXA_API_KEY="your-api-key"
          ```
        </Tab>

        <Tab title="Windows">
          ```powershell theme={null}
          setx EXA_API_KEY "your-api-key"
          ```
        </Tab>
      </Tabs>
    </Step>
  </Steps>
</div>

<div className="docs-quickstart-section">
  ## 2. Exa の利用方法を選ぶ {#2-choose-how-youll-use-exa}

  Exa をアプリケーションに組み込む方法は 2 つあります。自分のコードから API を呼び出す方法と、普段使っているエージェントを接続する方法です。

  <Columns cols={2}>
    <Card title="API を呼び出す" icon="code" href="#3-install-an-sdk" cta="SDK をインストールする">
      自分のコードから Search、Contents、Exa Agent を利用します。下記の手順で SDK を
      インストールし、最初のリクエストを送信しましょう。
    </Card>

    <Card title="エージェントを接続する" icon="plug" href="/ja/docs/get-started/exa-mcp" cta="Exa MCP をセットアップする">
      ChatGPT、Claude、Codex、Cursor を Exa の検索ツールやリサーチ
      ツールに接続します。API キーは不要です。
    </Card>
  </Columns>

  API を使って開発する場合は、まずどこから始めるかを選びましょう。

  | 最初に使うもの                                 | 用途                                     |
  | --------------------------------------- | -------------------------------------- |
  | [Search](/ja/docs/search/quickstart)       | 関連する Web ページを検索し、統合されたコンテンツを 2 秒未満で返す  |
  | [Deep Search](/ja/docs/search/deep-search) | LLM が反復的により良い結果を探す、高品質な検索              |
  | [Agent](/ja/docs/agent/quickstart)         | 長時間実行される非同期のリサーチ、リスト作成、エンリッチメント、レポート作成 |
  | [Contents](/ja/docs/contents/quickstart)   | URL がすでに分かっている場合のページコンテンツの抽出           |
</div>

<div className="docs-quickstart-section">
  ## 3. SDK をインストールする {#3-install-an-sdk}

  <CodeGroup>
    ```bash Python theme={null}
    pip install exa-py
    ```

    ```bash JavaScript theme={null}
    npm install exa-js
    ```
  </CodeGroup>
</div>

<div className="docs-quickstart-section">
  ## 4. 最初のリクエストを送信する {#4-make-your-first-request}

  <CodeGroup>
    ```python Python theme={null}
    from exa_py import Exa

    exa = Exa()

    results = exa.search(
        "best blog posts about vector databases",
        contents={"highlights": True},
    )

    for result in results.results:
        print(result.title, result.url)
    ```

    ```javascript JavaScript theme={null}
    import Exa from "exa-js";

    const exa = new Exa();

    const { results } = await exa.search(
      "best blog posts about vector databases",
      { contents: { highlights: true } },
    );

    for (const result of results) {
      console.log(result.title, result.url);
    }
    ```

    ```bash cURL theme={null}
    curl -s -X POST "https://api.exa.ai/search" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $EXA_API_KEY" \
      -d '{
        "query": "best blog posts about vector databases",
        "contents": { "highlights": true }
      }'
    ```
  </CodeGroup>

  ## 次のステップ {#next-steps}

  <Columns cols={2}>
    <Card title="Search API" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを読む" arrow="true">
      関連性の高いページを検索し、整形済みのコンテンツや構造化出力を取得できます。
    </Card>

    <Card title="Agent API" icon="bot" href="/ja/docs/agent/quickstart" cta="ガイドを読む" arrow="true">
      長時間にわたるリサーチ、リスト作成、エンリッチメントのワークフローを構築できます。
    </Card>

    <Card title="Contents API" icon="file-text" href="/ja/docs/contents/quickstart" cta="ガイドを読む" arrow="true">
      URL が判明しているページから、整形済みのコンテンツを抽出できます。
    </Card>

    <Card title="Exa MCP" icon="plug" href="/ja/docs/get-started/exa-mcp" cta="ガイドを読む" arrow="true">
      任意の MCP クライアントから、Exa のウェブ検索、ページ取得、Exa Agent
      の各ツールを利用できます。
    </Card>
  </Columns>
</div>