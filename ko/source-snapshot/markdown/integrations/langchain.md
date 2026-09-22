> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# LangChain {#langchain}

> Exa의 LangChain 연동으로 RAG를 수행하는 방법.

<Card title="Coding Agent Quickstart" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa를 처음 사용하시나요? 1분 안에 시작해 보세요.
</Card>

***

LangChain은 LLM을 데이터, API 및 기타 도구와 결합해 애플리케이션을 구축할 수 있는 프레임워크입니다. Exa의 LangChain 연동으로 RAG를 수행해 보세요:

1. Exa의 LangChain 연동을 설정하고 Exa로 관련 content를 가져옵니다
2. 이 content를 OpenAI LLM으로 생성을 수행하는 도구 체인에 연결합니다

<Info> LangChain 팀이 만든 거의 동일한 설정의 YouTube 튜토리얼은 [여기](https://www.youtube.com/watch?v=dA1cHGACXCo)에서 확인할 수 있습니다. </Info>

<Info> LangChain의 전체 reference는 [여기](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/)에서 확인하세요. </Info>

***

## 시작하기 {#get-started}

<Steps>
  <Step title="사전 요구 사항 및 설치">
    핵심 OpenAI 및 Exa LangChain 라이브러리를 설치합니다

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> API 키가 올바르게 초기화되었는지 확인하세요. LangChain 라이브러리에서 OpenAI와 Exa 키의 environment variable 이름은 각각 `OPENAI_API_KEY`와 `EXA_API_KEY`입니다. </Note>

    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>
  </Step>

  <Step title="Exa Search를 LangChain 도구에 활용하기">
    `ExaSearchRetriever`를 사용해 Retriever 도구를 설정합니다. Exa Search에 연결해 의미 기반 검색으로 관련 문서를 찾아주는 retriever입니다. 먼저 필요한 라이브러리를 import하고 ExaSearchRetriever를 인스턴스화합니다.

    ```Python Python theme={null}
    # 환경 변수 로드
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # Exa Search를 사용하는 retriever를 정의하여 결과 3개를 가져오고 각 결과에서 highlights를 파싱합니다
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="prompt 템플릿 만들기(선택 사항)">
    LangChain [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate)을 사용해 Exa 리트리버에서 URL과 highlights를 추출하기 위한 플레이스홀더 템플릿을 정의합니다.

    ```Python Python theme={null}
    # XML 형태의 태그를 사용해 문서 prompt 템플릿을 정의합니다
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="Exa 결과에서 URL과 콘텐츠 추출">
    [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html)를 사용해 Exa Search 결과에서 URL과 highlights 속성을 추출한 뒤, 이를 위의 prompt 템플릿에 전달합니다

    ```Python Python theme={null}
    # retriever에서 highlights와 URL 속성을 파싱한 뒤 위에서 정의한 document prompt로 전달하는 Runnable Lambda 생성
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="검색을 위해 Exa 결과와 콘텐츠 결합">
    Exa retriever, 파서, 그리고 짧은 람다 함수를 이어 붙여 검색 체인을 완성합니다. 이 람다 함수는 다음 단계에서 결과를 LLM의 컨텍스트로 쓸 수 있도록 단일 문자열로 전달하는 데 꼭 필요합니다.

    ```Python Python theme={null}
    # 검색 체인 정의 - Exa search 결과 => 속성을 가져와 XML로 파싱 => 다음 단계에서 컨텍스트로 넘길 단일 문자열로 결합
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="생성에 사용할 OpenAI를 포함한 나머지 도구 모음을 설정합니다">
    이 단계에서는 각각 사용자와 Exa Search에서 가져올 Query와 Context 템플릿 입력을 포함하는 system prompt를 정의합니다. 먼저, 다시 한 번 LangChain 라이브러리에서 관련 라이브러리와 컴포넌트를 import합니다

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    그런 다음 생성 prompt를 정의합니다. 이는 Exa에서 가져온 컨텍스트와 함께 RAG를 수행하는 데 사용되는 prompt 템플릿입니다.

    ```Python Python theme={null}
    # 핵심 prompt 템플릿 정의
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

    생성에 사용할 [LLM을 OpenAI로](https://python.langchain.com/v0.1/docs/integrations/chat/openai/) 설정한 다음, [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/) 병렬 연결로 모든 구성 요소를 연결합니다. 질의와 컨텍스트가 담긴 생성 prompt는 LLM에 전달된 뒤, [output을 더 보기 좋게 표현하기 위해 파싱됩니다](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html).

    ```Python Python theme={null}
    # 생성에는 OpenAI 사용
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # output에 대한 간단한 문자열 파싱
    output_parser = StrOutputParser()

    # 체인 연결. 사용자 질의와 2단계 Exa retriever 체인의 컨텍스트를 위한 병렬 연결 포함.
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="전체 RAG 도구 모음 실행하기">
    이제 체인을 [invoke](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke)해 보겠습니다:

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    그리고 output을 확인해 보세요(줄바꿈이 적용된 상태):

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

  <Step title="선택적으로 체인의 output을 스트리밍합니다">
    필요하다면 체인의 output을 스트리밍할 수도 있습니다.

    ```Python Python theme={null}
    for chunk in chain.stream("Latest research on climate change innovation"):
      print(chunk, end="|", flush=True)

    # 또는 비동기 방식으로
    async def run_async():
      async for chunk in chain.astream("Latest research on climate change innovation"):
        print(chunk, end="|", flush=True)

    import asyncio
    asyncio.run(run_async())
    ```

    스트리밍 방식으로 output을 반환합니다. 청크 처리와 output 파싱 등 `.stream` 메서드에 대한 [자세한 내용](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/)을 확인하세요.
  </Step>
</Steps>