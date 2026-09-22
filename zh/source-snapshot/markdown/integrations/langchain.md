> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，请先通过该文件了解所有可用页面。

<div id="langchain">
  # LangChain
</div>

> 如何使用 Exa 与 LangChain 的 integration 来实现 RAG。

<Card title="编码智能体快速开始" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  初次使用 Exa？一分钟内即可上手。
</Card>

***

LangChain 是一个用于构建应用的框架，可将 LLM 与数据、API 及其他工具结合起来。使用 Exa 的 LangChain integration 来实现 RAG：

1. 配置 Exa 的 LangChain integration，并使用 Exa 检索相关内容
2. 将这些内容接入使用 OpenAI LLM 进行生成的工具链

<Info> LangChain 团队录制了一个非常相似的配置教程，可在 YouTube 上[观看](https://www.youtube.com/watch?v=dA1cHGACXCo)。 </Info>

<Info> LangChain 的完整参考文档请见[这里](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/)。 </Info>

***

<div id="get-started">
  ## 快速开始
</div>

<Steps>
  <Step title="前提条件与安装">
    安装核心的 OpenAI 和 Exa LangChain 库

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> 请确保 API 密钥已正确初始化。在 LangChain 库中，OpenAI 与 Exa 密钥对应的环境变量名分别为 `OPENAI_API_KEY` 和 `EXA_API_KEY`。 </Note>

    <Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建密钥。新账户可获赠免费积分。
    </Card>
  </Step>

  <Step title="使用 Exa Search 为 LangChain 工具赋能">
    使用 `ExaSearchRetriever` 设置一个 Retriever 工具。该检索器连接到 Exa Search，通过语义搜索查找相关文档。首先导入相关库并实例化 ExaSearchRetriever。

    ```Python Python theme={null}
    # 加载环境变量
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # 定义使用 Exa Search 的检索器，获取 3 条结果，并解析每条结果的 highlights
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="创建提示词模板（可选）">
    我们使用 LangChain 的 [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) 定义一个带占位符的模板，用于从 Exa 检索器返回的结果中解析出 URL 和 highlights。

    ```Python Python theme={null}
    # 使用类 XML 标签定义文档 prompt 模板
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="从 Exa 结果中提取 URL 和内容">
    我们使用 [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html) 从 Exa Search 结果中解析出 URL 和 Highlights 属性，再将其传入上面的 prompt 模板

    ```Python Python theme={null}
    # 创建一个 Runnable Lambda，从检索器结果中解析出 highlights 和 URL 属性，并传给上面定义的文档 prompt
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="结合 Exa 搜索结果和内容进行 retrieval">
    将 Exa retriever、解析器和一个简短的 lambda 函数串联起来，构建完整的 retrieval 链。这一步至关重要，它能把结果以单个字符串的形式传递，作为下一步中 LLM 的上下文。

    ```Python Python theme={null}
    # 定义 retrieval 链 - Exa search 结果 => 提取属性并解析为 XML => 拼接成单个字符串，作为后续步骤的上下文
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="配置其余工具链，包括用于生成内容的 OpenAI">
    在这一步中，我们定义 system prompt，其中的 Query 和 Context 模板输入分别来自用户和 Exa Search。首先，再次从 LangChain 的库中导入相关的库和组件

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    接下来我们定义一个生成 prompt，也就是结合 Exa 返回的上下文来执行 RAG 的 prompt 模板。

    ```Python Python theme={null}
    # 定义核心 prompt 模板
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

    我们将生成用的 [LLM 设置为 OpenAI](https://python.langchain.com/v0.1/docs/integrations/chat/openai/)，然后用 [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/) 并行连接把各部分串联起来。随后，包含 query 和上下文的生成 prompt 会传给 LLM，并[经过解析以获得更好的输出呈现](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html)。

    ```Python Python theme={null}
    # 使用 OpenAI 进行生成
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 对输出做简单的字符串解析
    output_parser = StrOutputParser()

    # 连接整条链，其中并行连接分别接入来自用户的 query 和步骤 2 中 Exa retriever 链提供的上下文。
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="运行完整的 RAG 工具链">
    下面来 [invoke](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke) (调用) 这个链：

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    然后查看输出 (换行符已解析) ：

    ```Stdout Stdout theme={null}
    '根据所提供的上下文，气候变化创新领域的最新研究揭示了以下几项重要发现：
    1. 创新对气候变化的响应：一项研究通过分析 70 个国家的面板数据，考察了创新如何响应气候变化。研究发现，与气候变化相关的创新数量与气体燃料和液体燃料（主要是天然气和石油）产生的二氧化碳排放量的上升呈正相关；但与固体燃料消耗（主要是煤炭）产生的二氧化碳排放量以及其他温室气体排放量的上升呈负相关。该研究还指出，政府投资并不总是会影响开发气候技术并为其申请专利的决策。这项研究通过揭示创新如何对主要气候变化因素的变动作出反应，为环境创新领域的文献作出了贡献。
    2. 气候科技的资金与关注度：在 2010 至 2022 年期间，在美国、中国、欧盟和印度之外，世界其他地区仅占全球气候领域风险投资活动总量的 8%。资金与关注度向特定区域集中，可能阻碍气候科技解决方案惠及低收入社区和发展中国家，而这些地区已经感受到气候变化的影响，却缺乏有效应对所需的资源。
    3. 研究资金分配：萨塞克斯大学商学院的一项研究分析了 1990 年至 2020 年气候与能源研究的资金投入情况。研究发现，36% 的资金投向气候适应，28% 用于研究如何实现能源系统的清洁化。其余较大份额的资金分别投向交通与出行（13%）、地球工程（12%）和工业脱碳（11%）。大部分资金流向了富裕西方国家的研究人员，而这些国家未必是最易受气候变化直接影响的地区。
    来源：
    1. 关于创新对气候变化响应的研究：https://www.sciencedirect.com/science/article/pii/S0040162516302542
    2. 气候科技的资金与关注度：https://www.sbs.ox.ac.uk/oxford-answers/climate-tech-opportunity-save-planet
    3. 气候与能源研究的资金分配：https://www.protocol.com/bulletins/climate-research-funding-adaptation'
    ```
  </Step>

  <Step title="可选择流式传输链的输出">
    你也可以选择以流式方式获取该链的输出。

    ```Python Python theme={null}
    for chunk in chain.stream("Latest research on climate change innovation"):
      print(chunk, end="|", flush=True)

    # 或者异步执行
    async def run_async():
      async for chunk in chain.astream("Latest research on climate change innovation"):
        print(chunk, end="|", flush=True)

    import asyncio
    asyncio.run(run_async())
    ```

    以流式方式输出。[了解更多](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/) `.stream` 方法的相关信息，包括如何处理数据块和解析输出。
  </Step>
</Steps>