> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="gumloop">
  # Gumloop
</div>

> Gumloop のフロー内で Exa の検索とコンテンツ取得を利用します。

[Gumloop](https://www.gumloop.com/) には、Exa が MCP インテグレーションとして標準で組み込まれています。エージェントまたは Agent Node に追加すると、ワークフロー内でウェブ検索、ページの抽出、関連ソースの検索、引用付きの回答生成を行えます。

<div id="add-exa-to-a-gumloop-agent">
  ## Gumloop のエージェントに Exa を追加する
</div>

<Steps>
  <Step title="エージェントを開く">
    エージェントの設定を開き、**Add tools** → **Connect an app with MCP** を選択します。
  </Step>

  <Step title="Exa を接続する">
    **Exa** を検索してインテグレーションを選択し、認証フローを完了します。
  </Step>

  <Step title="ツールを選択する">
    接続した Exa インテグレーションを開き、エージェントに必要なツールだけを有効にします。こうすることでツールの選択が明確になり、エージェントが無関係なアクションを呼び出すのを防げます。
  </Step>

  <Step title="接続をテストする">
    エージェントに次のように依頼します。

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    実行を確認し、エージェントが Exa を呼び出して、出典付きの結果を返していることを確かめます。
  </Step>
</Steps>

<div id="available-tools">
  ## 利用可能なツール
</div>

| ツール                      | 用途                            |
| ------------------------ | ----------------------------- |
| **Search**               | ニューラル検索またはキーワード検索で関連ページを探します。 |
| **Get Contents**         | 既知の URL から全文、要約、メタデータを抽出します。  |
| **Find Similar**         | ソース URL に関連するページを見つけます。       |
| **Answer**               | 根拠に基づいた回答を引用付きで生成します。         |
| **Create Research Task** | 時間のかかるリサーチを開始します。             |
| **Get Research Task**    | リサーチタスクのステータスと結果を取得します。       |

対話型エージェントでは、まず Search、Get Contents、Answer を有効にしてください。残りのツールは、ワークフローで必要になった場合にのみ追加します。

<div id="use-exa-in-a-workflow">
  ## ワークフローでExaを使用する
</div>

<div id="agent-node">
  ### Agent Node
</div>

決定論的な Gumloop のフローに **Agent Node** を追加し、ツールの 1 つとして Exa を接続します。このノードは、検索するか、ページ全体を取得するか、複数の Exa 呼び出しを連鎖させるかを自ら判断し、その出力をワークフローの次のステップに渡します。

主な用途は次のとおりです。

* CRM やスプレッドシートの行を、Web 上の最新の根拠情報で補完する
* ニュースをモニターし、出典付きの要約を Slack やメールに送信する
* レコードを営業ワークフローに振り分ける前に、企業をリサーチする
* 製品を比較し、その結果をドキュメントに書き出す

<div id="reusable-custom-mcp-node">
  ### 再利用可能なカスタム MCP ノード
</div>

1 つのアクションを繰り返し実行する場合は、専用のノードを作成します。

1. ノードライブラリを開き、Exa を検索します。
2. **Create a node with AI** を選択します。
3. `Search for funding announcements from the past seven days` のように、アクションを 1 つ記述します。
4. 生成されたノードをテストし、入力と出力を確認してから保存します。

タスクに動的な計画立案や複数のツールが必要な場合は、Agent Node を使用します。同じ Exa の操作をすべてのアイテムに対して一貫した動作で実行したい場合は、カスタム MCP ノードを使用します。

<div id="prompt-patterns">
  ## プロンプトのパターン
</div>

<AccordionGroup>
  <Accordion title="検索して要約する">
    ```text theme={null}
    Search for official announcements about [topic] published this week.
    Return the date, publisher, summary, and source URL for each result.
    ```
  </Accordion>

  <Accordion title="企業情報を補完する">
    ```text theme={null}
    Given this company name and domain, find its product description,
    latest funding announcement, and two recent news sources.
    ```
  </Accordion>

  <Accordion title="URLが既知のページを読み取る">
    ```text theme={null}
    Get the full contents of this URL and extract the pricing tiers as JSON.
    ```
  </Accordion>
</AccordionGroup>

<div id="troubleshooting">
  ## トラブルシューティング
</div>

<AccordionGroup>
  <Accordion title="エージェントが Exa を利用できない">
    エージェントの MCP ツール設定を開き直し、Exa が接続されていることを確認してから、必要なツールを有効にしてください。インテグレーションが接続されていても、個々のツールが無効になっている場合があります。
  </Accordion>

  <Accordion title="エージェントが誤ったアクションを選択する">
    検索、既知の URL の読み込み、類似ページの検索、ソースに基づく回答のうち、どれを行うべきかをリクエストで明示してください。また、そのワークフローでエージェントが使わない Exa ツールは無効にしてください。
  </Accordion>

  <Accordion title="ワークフローで予測どおりに動作する単一の呼び出しが必要">
    汎用のエージェントステップを、入力とタスクが固定されたカスタム Exa MCP ノードに置き換えてください。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## リソース
</div>

<Columns cols={3}>
  <Card title="Gumloop の Exa インテグレーション" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="ガイドを読む" arrow="true">
    Gumloop で現在利用できるツールと Agent Node のワークフローを確認できます。
  </Card>

  <Card title="Exa MCP サーバー" icon="plug" href="/ja/docs/get-started/exa-mcp" cta="ガイドを読む" arrow="true">
    MCP 経由で提供される Exa ツールについて説明します。
  </Card>

  <Card title="Exa Search" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを読む" arrow="true">
    検索クエリの組み立て方と、返されるコンテンツの調整方法を紹介します。
  </Card>
</Columns>