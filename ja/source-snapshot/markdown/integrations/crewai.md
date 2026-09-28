> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# CrewAI {#crewai}

> CrewAI のエージェントに Exa の検索機能を追加する方法を説明します。

<Card title="コーディングエージェント向けクイックスタート" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa を初めてお使いですか？1 分もかからずに使い始められます。
</Card>

***

[CrewAI](https://crewai.com/) は、複数の AI エージェントを連携させて複雑なタスクを遂行させるためのオーケストレーションフレームワークです。
このガイドでは、Exa の検索結果をもとにニュースレターを作成する 2 つのエージェントからなるクルーを構築します。具体的には、次の手順を説明します。

1. Exa を活用したカスタム CrewAI ツールを作成する
2. エージェントを設定し、Exa を活用した検索ツールを使う特定のロールを割り当てる
3. エージェントをクルーにまとめ、ニュースレターを作成させる

<Note>
  CrewAI には組み込みの [`ExaSearchTool`](https://docs.crewai.com/en/tools/search-research/exasearchtool) も用意されており、カスタムラッパーを書かずにそのまま組み込めます。以下のカスタムツールは、結果の整形方法を細かく制御したい場合に便利です。どちらの方法を選んでも構いません。
</Note>

***

## はじめに {#get-started}

<Steps>
  <Step title="前提条件とインストール">
    crewAI core、crewAI tools、Exa Python SDK の各ライブラリをインストールします。

    ```Python Python theme={null}
    pip install crewai 'crewai[tools]' exa_py
    ```
  </Step>

  <Step title="crewAIでExaベースのカスタムツールを定義する">
    crewAI の [@tool デコレーター ](https://docs.crewai.com/concepts/tools#utilizing-the-tool-decorator)を使って[カスタムツール](https://docs.crewai.com/concepts/tools)を作成します。ツール内では、[Exa Python SDK](https://github.com/exa-labs/exa-py) の Exa クラスを初期化してリクエストを送信し、結果を解析して返すことができます。

    ```Python Python theme={null}
    from crewai_tools import tool
    from exa_py import Exa
    import os

    exa_api_key = os.getenv("EXA_API_KEY")

    @tool("Exa search and get contents")
    def search_and_get_contents_tool(question: str) -> str:
        """Tool using Exa's Python SDK to run semantic search and return result highlights."""

        exa = Exa(api_key=exa_api_key)

        response = exa.search(
            question,
            type="auto",
            num_results=10,
            contents={"highlights": True}
        )

        parsedResult = ''.join([
          f'<Title id={idx}>{eachResult.title}</Title>'
          f'<URL id={idx}>{eachResult.url}</URL>'
          f'<Highlight id={idx}>{"".join(eachResult.highlights)}</Highlight>'
          for (idx, eachResult) in enumerate(response.results)
        ])

        return parsedResult
    ```

    <Note> APIキーが正しく初期化されていることを確認してください。このデモでは、OpenAIとExaのキーの環境変数名をそれぞれ `OPENAI_API_KEY` と `EXA_API_KEY` としています。 </Note>

    <Card title="Exa APIキーを取得" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Step>

  <Step title="crewAIエージェントの設定">
    必要な crewAI モジュールをインポートします。次に、先ほど定義したカスタム検索メソッドを参照するよう `exa_tools` を定義します。

    ```Python Python theme={null}
    from crewai import Task, Crew, Agent

    exa_tools = search_and_get_contents_tool
    ```

    次に、[2つのエージェント](https://docs.crewai.com/concepts/Agents/)を設定し、[1つのクルー](https://docs.crewai.com/concepts/Crews/)にまとめます。

    * 1つ目のエージェントは、Exa を使ってリサーチを行います (上で定義したカスタムツールを渡します)
    * もう1つのエージェントは、出力としてニュースレターを作成します (LLM を使用)

    ```Python Python theme={null}
    # メモリと詳細（verbose）モードを有効にしたシニアリサーチャーエージェントを作成
    researcher = Agent(
      role='Researcher',
      goal='Get the latest research on {topic}',
      verbose=True,
      memory=True,
      backstory=(
        "Driven by curiosity, you're at the forefront of"
        "innovation, eager to explore and share knowledge that could change"
        "the world."
      ),
      tools=[exa_tools],
      allow_delegation=False
    )

    article_writer = Agent(
      role='Writer',
      goal='Write a great newsletter article on {topic}',
      verbose=True,
      memory=True,
      backstory=(
        "Driven by a love of writing and passion for"
        "innovation, you are eager to share knowledge with"
        "the world."
      ),
      tools=[exa_tools],
      allow_delegation=False
    )
    ```
  </Step>

  <Step title="エージェントのタスクを定義する">
    次に、各エージェントの[タスク](https://docs.crewai.com/concepts/Tasks/)を定義し、ここまでに設定したすべてのコンポーネントを使ってクルー全体を作成します。

    ```Python Python theme={null}
    research_task = Task(
      description=(
        "Identify the latest research in {topic}."
        "Your final report should clearly articulate the key points,"
      ),
      expected_output='A comprehensive 3 paragraphs long report on the {topic}.',
      tools=[exa_tools],
      agent=researcher,
    )

    write_article = Task(
      description=(
        "Write a newsletter article on the latest research in {topic}."
        "Your article should be engaging, informative, and accurate."
        "The article should address the audience with a greeting to the newsletter audience \"Hi readers!\", plus a similar signoff"
      ),
      expected_output='A comprehensive 3 paragraphs long newsletter article on the {topic}.',
      agent=article_writer,
    )

    crew = Crew(
      agents=[researcher, article_writer],
      tasks=[research_task, write_article],
      memory=True,
      cache=True,
      max_rpm=100,
      share_crew=True
    )
    ```
  </Step>

  <Step title="クルーを実行する">
    最後に、リサーチトピックを入力クエリとして渡し、crew を実行します。

    ```Python Python theme={null}
    response = crew.kickoff(inputs={'topic': 'Latest AI research'})

    print(response)
    ```

    クルーは、Exa の検索ツールが返したコンテンツをもとにニュースレターを作成します。
  </Step>
</Steps>