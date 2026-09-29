> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="llamaindex">
  # LlamaIndex
</div>

> LlamaIndex の Agent アプリケーションに Exa の検索取得 (retrieval) 機能を追加する方法を解説するクイックスタートガイドです。

<Card title="コーディングエージェント クイックスタート" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa を初めてお使いですか？1 分もかからずに始められます。
</Card>

***

LlamaIndex は、構造化データを活用した LLM アプリケーションを構築するためのフレームワークです。このガイドでは、Exa の LlamaIndex インテグレーションを使用して、次の作業を行います。

1. Exa の Search and Retrieve Highlight Tool を LlamaIndex のリトリーバーとして設定する
2. このツールを使ってレスポンスを生成する OpenAI Agent をセットアップする

***

<div id="get-started">
  ## はじめに
</div>

<Steps>
  <Step title="前提条件とインストール">
    llama-index、llama-index core、llama-index-tools-exa の各ライブラリをインストールします。OpenAI の依存関係は core ライブラリに含まれているため、個別に指定する必要はありません。

    ```Python Python theme={null}
    pip install llama-index llama-index-core llama-index-tools-exa
    ```

    また、API キーが正しく初期化されていることも確認してください。以下のコードでは、環境変数名として `EXA_API_KEY` を使用しています。

    <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Step>

  <Step title="Exa ツールをインスタンス化する">
    Exa のインテグレーションライブラリをインポートし、LlamaIndex の `ExaToolSpec` をインスタンス化します。

    ```Python Python theme={null}
    from llama_index.tools.exa import ExaToolSpec
    import os

    exa_tool = ExaToolSpec(
        api_key=os.environ["EXA_API_KEY"],
    )
    ```
  </Step>

  <Step title="使用する Exa メソッドを選択する">
    この例ではエージェントに [search&#95;and&#95;retrieve&#95;highlights](https://docs.llamaindex.ai/en/stable/api_reference/tools/exa/) メソッドだけを渡すため、LlamaIndex の `.to_tool_list` メソッドで指定します。あわせて、エージェントが現在の日付を把握できるよう、簡単なユーティリティである `current_date` も渡します。

    ```Python Python theme={null}
    print('Tools that are provide by Exa LlamaIndex integration:')
    print('\n'.join(map(str, (exa_tool.spec_functions))))

    search_and_retrieve_highlights_tool = exa_tool.to_tool_list(
        spec_functions=["search_and_retrieve_highlights", "current_date"]
    )
    ```
  </Step>

  <Step title="OpenAI エージェントを設定し、Exa を活用したリクエストを実行する">
    前のステップで絞り込んだツールセットを渡して、[OpenAIAgent](https://docs.llamaindex.ai/en/stable/examples/agent/Chatbot%5FSEC/) を設定します。

    ```Python Python theme={null}
    from llama_index.agent.openai import OpenAIAgent

    agent = OpenAIAgent.from_tools(
        search_and_retrieve_highlights_tool,
        verbose=True,
    )
    ```

    あとは chat メソッドを使ってエージェントと対話できます。

    ```Python Python theme={null}
    agent.chat(
        "Can you summarize the news from the last month related to the US stock market?"
    )
    ```

    エージェントは与えられた Exa ツールを呼び出し、その結果をもとに回答します。実際の出力は、クエリや Exa が返すページの公開日によって異なります。
  </Step>
</Steps>

<Columns cols={2}>
  <Card title="Search API ガイド" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを読む" arrow="true">
    Exa の検索パラメータとレスポンスフィールドを確認できます。
  </Card>

  <Card title="LlamaIndex ツールリファレンス" icon="book" href="https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/" cta="リファレンスを開く" arrow="true">
    LlamaIndex のツールとエージェントの設定について詳しく確認できます。
  </Card>
</Columns>