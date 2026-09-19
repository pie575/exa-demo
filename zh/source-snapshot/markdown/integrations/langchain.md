> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="langchain">
  # LangChain
</div>

> 如何使用 Exa 与 LangChain 的集成来实现 RAG。

<Card title="编程 Agent 快速开始" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  初次使用 Exa？一分钟内即可上手。
</Card>

***

LangChain 是一个用于构建应用的框架，可将 LLM 与数据、API 及其他工具结合起来。使用 Exa 的 LangChain 集成来实现 RAG：

1. 配置 Exa 的 LangChain 集成，并使用 Exa 检索相关内容
2. 将这些内容接入使用 OpenAI LLM 进行生成的工具链

<Info> 点击[这里](https://www.youtube.com/watch?v=dA1cHGACXCo)观看 LangChain 团队制作的 YouTube 教程，其配置与此非常相似。 </Info>

<Info> 点击[这里](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/)查看 LangChain 的完整参考文档。 </Info>

***

<div id="get-started">
  ## 开始使用
</div>

<Steps>
  <Step title="前提条件和安装">
    安装核心的 OpenAI 和 Exa LangChain 库

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> 请确保 API key 已正确初始化。在 LangChain 库中，OpenAI 和 Exa 的 key 对应的环境变量名分别为 `OPENAI_API_KEY` 和 `EXA_API_KEY`。 </Note>

    <Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建一个 key。新账户可获得免费积分。
    </Card>
  </Step>

  <Step title="使用 Exa Search 驱动 LangChain Tool">
    使用 `ExaSearchRetriever` 设置一个 Retriever 工具。该检索器会连接 Exa Search，通过语义搜索查找相关文档。首先导入相关库，并实例化 ExaSearchRetriever。

    ```Python Python theme={null}
    # 加载环境变量
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # 定义使用 Exa Search 的 retriever，获取 3 条结果，并从每条结果中解析出 highlights
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="创建提示词模板（可选）">
    我们使用 LangChain 的 [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) 定义一个带占位符的模板，用于从 Exa 检索器返回的结果中解析出 URL 和 highlights。

    ```Python Python theme={null}
    # 使用类 XML 标签定义文档提示词模板
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="从 Exa 结果中解析 URL 和内容">
    我们使用 [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html) 从 Exa Search 结果中解析出 URL 和 Highlights 属性，再将其传入上面的提示词模板

    ```Python Python theme={null}
    # 创建一个 Runnable Lambda，从检索器结果中解析出 highlights 和 URL 属性，并传给上面定义的文档提示词模板
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="整合 Exa 搜索结果和内容，用于检索">
    将 Exa 检索器、解析器和一个简短的 lambda 函数串联起来，即可构建出完整的检索链——这一步至关重要，它能把结果以单个字符串的形式传递下去，作为下一步中 LLM 的上下文。

    ```Python Python theme={null}
    # 定义检索链 - Exa 搜索结果 => 提取属性并解析为 XML => 拼接成单个字符串，作为后续步骤的上下文
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="配置其余工具链，包括用于生成内容的 OpenAI">
    在这一步中，我们定义系统提示词，其中包含 Query 和 Context 两个模板输入，分别来自用户和 Exa Search。首先，再次从 LangChain 的库中导入相关库和组件

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    接着定义生成提示词——即结合 Exa 返回的上下文执行 RAG 时使用的提示词模板。

    ```Python Python theme={null}
    # 定义核心提示词模板
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

    我们将生成所用的 [LLM 设置为 OpenAI](https://python.langchain.com/v0.1/docs/integrations/chat/openai/)，然后通过 [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/) 并行连接把各部分组合起来。随后，包含 query 和上下文的生成提示会传递给 LLM，并经过[解析以获得更好的输出呈现效果](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html)。

    ```Python Python theme={null}
    # 使用 OpenAI 进行生成
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 对输出做简单的字符串解析
    output_parser = StrOutputParser()

    # 串联整条链，其中以并行方式接入用户传入的 query 和第 2 步 Exa 检索链输出的上下文。
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="运行完整的 RAG 工具链">
    下面来[调用](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke)这个链：

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    来看看输出结果 (换行符已解析) ：

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

  <Step title="（可选）以流式方式输出链的结果">
    你也可以选择以流式方式输出链的结果。

    ```Python Python theme={null}
    for chunk in chain.stream("Latest research on climate change innovation"):
      print(chunk, end="|", flush=True)

    # 或者使用异步方式
    async def run_async():
      async for chunk in chain.astream("Latest research on climate change innovation"):
        print(chunk, end="|", flush=True)

    import asyncio
    asyncio.run(run_async())
    ```

    以流式方式输出。[了解更多](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/) `.stream` 方法的相关信息，包括如何处理数据块和解析输出。
  </Step>
</Steps>