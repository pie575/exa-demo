> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="crewai">
  # CrewAI
</div>

> 了解如何为你的 CrewAI agent 添加 Exa 检索能力。

<Card title="编程 Agent 快速入门" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  初次使用 Exa？一分钟内即可上手。
</Card>

***

[CrewAI](https://crewai.com/) 是一个用于编排 AI agent 协同完成复杂任务的框架。
在本指南中，我们将创建一个由两个 agent 组成的 crew，基于 Exa 的搜索结果生成一份新闻简报。我们将介绍如何：

1. 创建一个由 Exa 驱动的自定义 CrewAI 工具
2. 设置 agent，并为其分配使用该 Exa 搜索工具的具体角色
3. 将这些 agent 组织成一个负责撰写新闻简报的 crew

<Note>
  CrewAI 还内置了 [`ExaSearchTool`](https://docs.crewai.com/en/tools/search-research/exasearchtool)，无需编写自定义封装即可直接使用。如果你希望完全掌控结果的格式化方式，下面的自定义工具会很有用；两种方式都可行。
</Note>

***

<div id="get-started">
  ## 开始使用
</div>

<Steps>
  <Step title="准备工作与安装">
    安装 crewAI 核心库、crewAI tools 和 Exa Python SDK 库。

    ```Python Python theme={null}
    pip install crewai 'crewai[tools]' exa_py
    ```
  </Step>

  <Step title="在 crewAI 中定义自定义 Exa 工具">
    我们使用 crewAI 的 [@tool 装饰器](https://docs.crewai.com/concepts/tools#utilizing-the-tool-decorator)创建一个[自定义工具](https://docs.crewai.com/concepts/tools)。在该工具中，我们可以初始化 [Exa Python SDK](https://github.com/exa-labs/exa-py) 中的 Exa 类，发起请求，并返回解析后的结果。

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

    <Note> 请确保你的 API key 已正确初始化。在本示例中，OpenAI 和 Exa 的 key 对应的环境变量名分别为 `OPENAI_API_KEY` 和 `EXA_API_KEY`。 </Note>

    <Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建一个 key。新账户可获赠免费积分。
    </Card>
  </Step>

  <Step title="配置 crewAI agent">
    导入相关的 crewAI 模块，然后定义 `exa_tools`，引用上面定义的自定义搜索方法。

    ```Python Python theme={null}
    from crewai import Task, Crew, Agent

    exa_tools = search_and_get_contents_tool
    ```

    接着我们创建[两个 agent](https://docs.crewai.com/concepts/Agents/)，并把它们编入[同一个 crew](https://docs.crewai.com/concepts/Crews/)：

    * 一个负责用 Exa 做研究 (使用上面定义的自定义工具)
    * 另一个负责撰写新闻简报作为输出 (借助 LLM)

    ```Python Python theme={null}
    # 创建一个带记忆功能、开启详细输出模式的资深研究员 agent
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

  <Step title="为 agent 定义任务">
    接下来，我们将为每个 agent 定义[任务](https://docs.crewai.com/concepts/Tasks/)，并利用上面配置好的所有组件来创建完整的 crew。

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

  <Step title="启动 Crew">
    最后，我们传入一个研究主题作为输入 query，启动这个 crew。

    ```Python Python theme={null}
    response = crew.kickoff(inputs={'topic': 'Latest AI research'})

    print(response)
    ```

    crew 会根据 Exa 搜索工具返回的内容撰写这份新闻简报。
  </Step>
</Steps>