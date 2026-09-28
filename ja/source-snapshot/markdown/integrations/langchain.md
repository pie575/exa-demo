> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="langchain">
  # LangChain
</div>

> Exa の LangChain インテグレーションを使用して RAG を実行する方法。

<Card title="コーディングエージェント クイックスタート" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa を初めてお使いですか？1 分以内に使い始められます。
</Card>

***

LangChain は、LLM とデータ、API、その他のツールを組み合わせたアプリケーションを構築するためのフレームワークです。Exa の LangChain インテグレーションを使って RAG を実行する手順は次のとおりです。

1. Exa の LangChain インテグレーションをセットアップし、Exa で関連コンテンツを取得する
2. 取得したコンテンツを、OpenAI の LLM で生成を行うツールチェーンに渡す

<Info> LangChain チームが公開している、ほぼ同じ構成の YouTube チュートリアルは[こちら](https://www.youtube.com/watch?v=dA1cHGACXCo)でご覧いただけます。 </Info>

<Info> LangChain の完全なリファレンスは[こちら](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/)をご覧ください。 </Info>

***

<div id="get-started">
  ## はじめに
</div>

<Steps>
  <Step title="前提条件とインストール">
    OpenAI と Exa の主要な LangChain ライブラリをインストールします

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> API キーが正しく初期化されていることを確認してください。LangChain ライブラリでは、OpenAI と Exa のキーの環境変数名はそれぞれ `OPENAI_API_KEY` と `EXA_API_KEY` です。 </Note>

    <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Step>

  <Step title="Exa Searchを使ってLangChainのツールを構築する">
    `ExaSearchRetriever` を使用して Retriever ツールをセットアップします。これは Exa Search に接続し、セマンティック検索で関連ドキュメントを取得するリトリーバーです。まず、必要なライブラリをインポートし、ExaSearchRetriever をインスタンス化します。

    ```Python Python theme={null}
    # 環境変数を読み込む
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # Exa Search を使うリトリーバーを定義し、結果を 3 件取得して各結果からハイライトを抽出する
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="プロンプトテンプレートを作成する（任意）">
    LangChain の [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) を使って、Exa リトリーバーから取得した URL とハイライトを埋め込むためのプレースホルダーを持つテンプレートを定義します。

    ```Python Python theme={null}
    # XML形式のタグを使ってドキュメント用のプロンプトテンプレートを定義
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="Exaの検索結果からURLとコンテンツを解析する">
    [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html) を使って Exa Search の結果から URL 属性とハイライト属性を取り出し、上記のプロンプトテンプレートに渡します

    ```Python Python theme={null}
    # リトリーバーの結果からハイライトとURLの属性を抽出し、前述のドキュメントプロンプトに渡すRunnable Lambdaを作成
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="Exaの検索結果とコンテンツを結合して情報を取得する">
    Exa の retriever、パーサー、短い lambda 関数をつなぎ合わせて、検索チェーンを完成させます。これは、次のステップで結果を 1 つの文字列にまとめ、LLM にコンテキストとして渡すうえで欠かせない処理です。

    ```Python Python theme={null}
    # 検索チェーンを定義: Exa の検索結果 => 属性を取り出して XML にパース => 1 つの文字列に結合し、以降のステップでコンテキストとして渡す
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="生成に使用するOpenAIを含め、ツールチェーンの残りを設定します">
    このステップでは、ユーザーから受け取るQueryと、Exa Searchから取得するContextをテンプレート入力とするシステムプロンプトを定義します。まず、もう一度LangChainのライブラリから必要なライブラリとコンポーネントをインポートします

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    次に、生成用プロンプトを定義します。これは、Exa から取得したコンテキストと組み合わせて RAG を実行するためのプロンプトテンプレートです。

    ```Python Python theme={null}
    # 中核となるプロンプトテンプレートを定義する
    generation_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert research assistant. You use xml-formatted context to research people's questions."),
        ("human", """
    Please answer the following query based on the provided context. Please cite your sources at the end of your response.:

    Query: {query}
    ---
    <context>
    {context}
    </context>
    """)
    ])
    ```

    生成用の[LLMにはOpenAIを設定](https://python.langchain.com/v0.1/docs/integrations/chat/openai/)し、[RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/)で各要素を並列に接続します。続いて、クエリとコンテキストを含む生成用プロンプトをLLMに渡し、[出力を扱いやすい形式にパース](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html)します。

    ```Python Python theme={null}
    # 生成には OpenAI を使用
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 出力をシンプルな文字列としてパース
    output_parser = StrOutputParser()

    # チェーンを接続（ユーザーからのクエリと、ステップ 2 の Exa リトリーバーチェーンから得たコンテキストを並列に接続）
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="RAGのツールチェーン全体を実行する">
    チェーンを[invoke](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke)で実行してみましょう。

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    出力結果を確認してみましょう (改行は変換済み) ：

    ```Stdout Stdout theme={null}
    'Based on the provided context, the latest research on climate change innovation reveals several important findings:
    1. Innovation in response to climate change: A study examined how innovation responds to climate change by analyzing a panel dataset of 70 countries. The study found that the number of climate-change-related innovations is positively correlated with increasing levels of carbon dioxide emissions from gas and liquid fuels, mainly from natural gases and petroleum. However, it is negatively correlated with increases in carbon dioxide emissions from solid fuel consumption, mainly from coal, and other greenhouse gas emissions. The research also highlighted that government investment does not always influence decisions to develop and patent climate technologies. This study contributes to the environmental innovation literature by providing insights on how innovation reacts to changes in major climate change factors.
    2. Climate tech funding and attention: During the period of 2010-2022, outside of the US, China, EU, and India, only 8% of total climate venture capital activity came from the rest of the world. This concentration of funding and attention in specific regions may be hindering the reach of climate tech solutions to low-income communities and developing countries, which are already feeling the effects of climate change but lack the necessary resources to address them effectively.
    3. Research funding allocation: A study from the University of Sussex Business School analyzed research funding for climate and energy research from 1990 to 2020. The research found that 36% of funding was allocated to climate adaptation, while 28% went to studying how to clean up the energy system. Other significant shares of funding were allocated to transport and mobility (13%), geoengineering (12%), and industrial decarbonization (11%). The majority of the funding went to researchers in wealthy, Western countries, which may not be the most vulnerable to the immediate impacts of climate change.
    Sources:
    1. Study on innovation response to climate change: https://www.sciencedirect.com/science/article/pii/S0040162516302542
    2. Climate tech funding and attention: https://www.sbs.ox.ac.uk/oxford-answers/climate-tech-opportunity-save-planet
    3. Research funding allocation for climate and energy research: https://www.protocol.com/bulletins/climate-research-funding-adaptation'
    ```
  </Step>

  <Step title="必要に応じて、チェーンの出力をストリーミングする">
    必要に応じて、チェーンの出力をストリーミングすることもできます。

    ```Python Python theme={null}
    for chunk in chain.stream("Latest research on climate change innovation"):
      print(chunk, end="|", flush=True)

    # 非同期で実行する場合
    async def run_async():
      async for chunk in chain.astream("Latest research on climate change innovation"):
        print(chunk, end="|", flush=True)

    import asyncio
    asyncio.run(run_async())
    ```

    出力をストリーミングで返します。チャンクの処理や出力のパースなど、`.stream` メソッドの詳細については[こちら](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/)をご覧ください。
  </Step>
</Steps>