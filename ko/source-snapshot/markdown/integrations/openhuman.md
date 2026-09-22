> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일을 사용해 사용 가능한 모든 페이지를 확인하세요.

<div id="openhuman">
  # OpenHuman
</div>

> OpenHuman agent에 Exa 기반 실시간 web search를 더해보세요. 관리형으로 사용하거나 직접 발급한 Exa API key를 쓸 수 있습니다.

TinyHumans의 [OpenHuman](https://tinyhumans.gitbook.io/openhuman)은 agent가 스스로 call하는 네이티브 web search 도구를 갖춘 데스크톱 AI 어시스턴트입니다. 이 도구의 search 제공업체가 바로 Exa입니다.

| 방식                    | 설정             | 실행 위치                                             |
| --------------------- | -------------- | ------------------------------------------------- |
| **OpenHuman Managed** | 없음             | Exa가 구동하는 OpenHuman 백엔드. API 키 불필요.               |
| **Exa provider**      | Exa API 키 붙여넣기 | 사용자 기기에서 본인 Exa 계정으로 `https://api.exa.ai`에 직접 연결. |

<div id="openhuman-managed">
  ## OpenHuman Managed
</div>

managed search가 기본값입니다. 온보딩 중에 **Simple**을 선택하면 agent가 바로 웹을 검색할 수 있습니다.

<Frame caption="Exa 기반 managed search를 사용하려면 온보딩에서 Simple을 선택하세요">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="OpenHuman onboarding asking how to run OpenHuman, with the Simple option selected" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **Managed는 Exa 결과를 가장 빠르게 받아보는 방법입니다.** 생성하거나 저장하거나 교체할 키가 없고, 사용자 컴퓨터에 credential을 보관하지 않으며, search 요금은 OpenHuman 구독으로 청구됩니다.
</Tip>

<div id="exa-provider">
  ## Exa provider
</div>

Exa를 직접 설정하여 본인의 Exa 계정으로 search를 실행하고, agent에 Exa의 search 및 페이지 contents 도구를 제공하세요.

<div id="get-your-exa-api-key">
  ### Exa API key 발급받기
</div>

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<div id="add-exa-in-openhuman">
  ### OpenHuman에서 Exa 추가하기
</div>

1. **Connections**를 열고 **API keys** 아래의 **Search engine**을 선택합니다.

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="API keys 아래에서 Search engine이 선택된 OpenHuman Connections 페이지로, OpenHuman Managed가 활성화된 검색 엔진 목록이 표시됨" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. **Exa**를 선택합니다.

<Frame caption="Exa가 선택되어 키 입력을 기다리는 상태">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="OpenHuman Search engine 패널에서 Exa 엔진 옵션이 선택되어 Needs API key 배지가 표시됨" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. **Exa API key**에 키를 붙여넣고 **Save**를 선택합니다.

<Frame caption="Exa API key 저장하기">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="키가 입력되고 Save 버튼이 보이는 OpenHuman의 Exa API key field" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="활성 검색 엔진으로 설정된 Exa">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="Exa가 선택되고 Configured로 표시된 OpenHuman Search engine 패널" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

<div id="configuration">
  ### 구성
</div>

이 패널은 OpenHuman의 `config.toml`에 값을 기록합니다. 패널 대신 파일이나 환경 변수에 동일한 값을 직접 설정할 수도 있습니다:

<Tabs>
  <Tab title="config.toml">
    ```toml config.toml theme={null}
    [search]
    engine = "exa"        # 필수
    max_results = 5       # 선택, 1-20
    timeout_secs = 15     # 선택

    [search.exa]
    api_key = "your-exa-api-key"   # 필수
    ```
  </Tab>

  <Tab title="환경 변수">
    ```bash theme={null}
    OPENHUMAN_SEARCH_ENGINE=exa
    EXA_API_KEY=your-exa-api-key
    ```

    <Note>
      `EXA_API_KEY`와 `OPENHUMAN_EXA_API_KEY`는 모두 `search.exa.api_key`를 재정의합니다. 둘 다 설정된 경우에는 `OPENHUMAN_EXA_API_KEY`가 우선합니다.
    </Note>
  </Tab>
</Tabs>

<div id="tools-the-agent-gets">
  ### agent가 사용할 수 있는 도구
</div>

| 도구                 | 반환값                                                   |
| ------------------ | ----------------------------------------------------- |
| `web_search_tool`  | Exa가 제공하는 web search.                                 |
| `exa_search`       | 제목, URL, 게시일, 선택적 텍스트가 포함된 순위별 페이지.                   |
| `exa_get_contents` | 지정한 URL의 전체 contents, 선택적으로 summary 또는 highlights 포함. |

agent는 call마다 Exa의 [search parameters](/ko/docs/search/quickstart)를 설정하므로, 간단한 지시만으로도 search mode, 도메인, 날짜, 카테고리를 제어할 수 있습니다.

<div id="troubleshooting">
  ## 문제 해결
</div>

<AccordionGroup>
  <Accordion title="Exa search를 사용할 수 없음: 설정된 API 키가 없음">
    OpenHuman이 **Search engine** 패널, `EXA_API_KEY` 및 `OPENHUMAN_EXA_API_KEY` 변수, `search.exa.api_key` 중 어디에서도 키를 찾지 못했습니다. 이 중 한 곳에 키를 설정하고, OpenHuman이 실행 중인 상태에서 `config.toml`을 수정했다면 OpenHuman을 재시작하세요.
  </Accordion>

  <Accordion title="Exa가 설정된 API 키를 거부함 (HTTP 401)">
    키가 유효하지 않거나 취소되었습니다. [Exa dashboard](https://dashboard.exa.ai/api-keys)에서 키를 확인한 다음, 저장된 키를 **Clear**하고 올바른 키를 저장하세요. 붙여넣을 때 공백이 함께 들어가지 않았는지 확인하세요.
  </Accordion>

  <Accordion title="Exa가 2xx가 아닌 상태를 반환함">
    `429`는 속도 제한 또는 할당량 소진을 의미합니다. [dashboard](https://dashboard.exa.ai)에서 사용량을 확인하세요. `5xx`의 경우 재시도한 후 [오류 코드](/ko/docs/admin/error-codes)를 참고하세요.
  </Accordion>

  <Accordion title="엔진 목록에 OpenHuman Managed가 없음">
    로컬 전용 세션에서는 managed search를 사용할 수 없습니다. 직접 발급한 키로 Exa provider를 설정하세요.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

<Columns cols={3}>
  <Card title="OpenHuman web search 문서" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search" cta="가이드 열기" arrow="true">
    OpenHuman이 직접 제공하는 검색 엔진 reference를 확인해 보세요.
  </Card>

  <Card title="Exa search API" icon="search" href="/ko/docs/search/quickstart" cta="가이드 읽기" arrow="true">
    Exa 도구의 기반이 되는 search mode, 필터, content options를 알아보세요.
  </Card>

  <Card title="Search 모범 사례" icon="sparkles" href="/ko/docs/search/best-practices" cta="가이드 읽기" arrow="true">
    모든 질의에서 더 나은 결과를 얻어보세요.
  </Card>
</Columns>