> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="developer-quickstart">
  # 개발자 quickstart
</div>

> API 키를 발급받고, 직접 작성한 코드나 agent에서 Exa를 사용하세요.

<div className="docs-quickstart-section docs-quickstart-auth">
  <div id="1-get-an-api-key">
    ## 1. API 키 발급받기
  </div>

  <Steps>
    <Step title="Exa Dashboard 방문하기">
      <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
        dashboard에서 키를 생성하세요. 새 계정에는 무료 credits이 제공됩니다.
      </Card>
    </Step>

    <Step title="키를 environment variable로 설정하기">
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
  <div id="2-choose-how-youll-use-exa">
    ## 2. Exa 사용 방식 선택하기
  </div>

  Exa는 두 가지 방식으로 애플리케이션에 통합할 수 있습니다. 직접 작성한 코드에서 API를 호출하거나, 이미 사용 중인 agent를 연결하면 됩니다.

  <Columns cols={2}>
    <Card title="API 호출하기" icon="code" href="#3-install-an-sdk" cta="SDK 설치하기">
      직접 작성한 코드에서 Search, Contents, Exa Agent를 사용하세요. 아래에서 SDK를
      설치하고 첫 요청을 보내보세요.
    </Card>

    <Card title="agent 연결하기" icon="plug" href="/ko/docs/get-started/exa-mcp" cta="Exa MCP 설정하기">
      ChatGPT, Claude, Codex, Cursor를 Exa의 search 및 리서치
      도구에 연결하세요. API 키는 필요하지 않습니다.
    </Card>
  </Columns>

  API로 개발하시나요? 어디서부터 시작할지 선택하세요:

  | 시작 지점                                   | 용도                                                  |
  | --------------------------------------- | --------------------------------------------------- |
  | [Search](/ko/docs/search/quickstart)       | 관련 웹 페이지를 찾아 종합된 content를 2초 이내에 반환                 |
  | [Deep Search](/ko/docs/search/deep-search) | LLM이 반복적으로 더 나은 result를 찾아내는 고품질 search             |
  | [Agent](/ko/docs/agent/quickstart)         | 장시간 실행되는 비동기 리서치, 리스트 구축, enrichment 또는 리포트 작성 |
  | [Contents](/ko/docs/contents/quickstart)   | 이미 URL을 알고 있을 때 페이지 콘텐츠 추출                          |
</div>

<div className="docs-quickstart-section">
  <div id="3-install-an-sdk">
    ## 3. SDK 설치하기
  </div>

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
  <div id="4-make-your-first-request">
    ## 4. 첫 요청 보내기
  </div>

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

  <div id="next-steps">
    ## 다음 단계
  </div>

  <Columns cols={2}>
    <Card title="Search API" icon="search" href="/ko/docs/search/quickstart" cta="가이드 읽기" arrow="true">
      관련성 높은 페이지를 찾아 깔끔한 content 또는 structured output으로 반환합니다.
    </Card>

    <Card title="Agent API" icon="bot" href="/ko/docs/agent/quickstart" cta="가이드 읽기" arrow="true">
      장시간 실행되는 리서치, 리스트 빌딩, enrichment 워크플로우를 구축합니다.
    </Card>

    <Card title="Contents API" icon="file-text" href="/ko/docs/contents/quickstart" cta="가이드 읽기" arrow="true">
      이미 알고 있는 페이지에서 깔끔한 content를 추출합니다.
    </Card>

    <Card title="Exa MCP" icon="plug" href="/ko/docs/get-started/exa-mcp" cta="가이드 읽기" arrow="true">
      어떤 MCP 클라이언트든 Exa의 web search, 페이지 가져오기, Exa Agent
      도구에 연결하세요.
    </Card>
  </Columns>
</div>