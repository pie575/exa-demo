> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="gumloop">
  # Gumloop
</div>

> Gumloop 플로우 안에서 Exa search와 contents를 사용하세요.

[Gumloop](https://www.gumloop.com/)은 Exa를 기본 제공 MCP 통합으로 지원합니다. agent나 Agent Node에 추가하면 workflow 안에서 웹을 검색하고, 페이지를 추출하고, 관련 소스를 찾고, 인용 기반 답변을 생성할 수 있습니다.

<div id="add-exa-to-a-gumloop-agent">
  ## Gumloop agent에 Exa 추가하기
</div>

<Steps>
  <Step title="agent 열기">
    agent의 configuration을 열고 **Add tools** → **Connect an app with MCP**를 선택합니다.
  </Step>

  <Step title="Exa 연결하기">
    **Exa**를 검색해 해당 통합을 선택한 뒤 인증 절차를 완료합니다.
  </Step>

  <Step title="도구 선택하기">
    연결된 Exa 통합을 열고 agent에 필요한 도구만 활성화합니다. 이렇게 하면 도구 선택이 명확해지고 agent가 관련 없는 작업을 call하는 일을 막을 수 있습니다.
  </Step>

  <Step title="연결 테스트하기">
    agent에 다음과 같이 요청해 보세요.

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    run을 검토해 agent가 Exa를 call하고 출처가 인용된 결과를 반환했는지 확인합니다.
  </Step>
</Steps>

<div id="available-tools">
  ## 사용 가능한 도구
</div>

| 도구                       | 용도                                       |
| ------------------------ | ---------------------------------------- |
| **Search**               | 뉴럴 검색 또는 키워드 검색으로 관련 페이지를 찾습니다.          |
| **Get Contents**         | 이미 알고 있는 URL에서 전체 텍스트, 요약, 메타데이터를 추출합니다. |
| **Find Similar**         | 소스 URL과 유사한 페이지를 찾습니다.                   |
| **Answer**               | 인용이 포함된 근거 기반 답변을 생성합니다.                 |
| **Create Research Task** | 장시간 실행되는 리서치를 시작합니다.                     |
| **Get Research Task**    | 리서치 작업의 상태와 결과를 조회합니다.                   |

대화형 agent라면 Search, Get Contents, Answer를 먼저 활성화하세요. 나머지 도구는 workflow에서 필요할 때만 추가하면 됩니다.

<div id="use-exa-in-a-workflow">
  ## workflow에서 Exa 사용하기
</div>

<div id="agent-node">
  ### Agent Node
</div>

결정론적 Gumloop 플로우에 **Agent Node**를 추가하고 Exa를 도구 중 하나로 attach하세요. 이 node는 search를 할지, 페이지 전체를 가져올지, 아니면 여러 Exa 호출을 연결할지 스스로 판단한 뒤 그 output을 다음 workflow 단계로 전달합니다.

다음과 같은 작업에 적합합니다:

* CRM이나 스프레드시트의 행을 최신 웹 evidence로 enrich
* 뉴스를 monitor하고 출처가 포함된 summary를 Slack이나 이메일로 전송
* 레코드를 영업 workflow로 넘기기 전에 기업 조사
* 제품을 비교하고 결과를 문서로 작성

<div id="reusable-custom-mcp-node">
  ### 재사용 가능한 커스텀 MCP node
</div>

반복적으로 수행할 단일 동작이라면 전용 node를 만드세요:

1. node 라이브러리를 열고 Exa를 찾습니다.
2. **Create a node with AI**를 선택합니다.
3. `Search for funding announcements from the past seven days`와 같이 하나의 동작을 설명합니다.
4. 생성된 node를 테스트해 입력과 출력을 확인한 뒤 저장합니다.

작업에 동적인 계획 수립이나 여러 도구가 필요하다면 Agent Node를 사용하세요. 동일한 Exa 작업을 모든 item에 대해 일관되게 실행해야 한다면 커스텀 MCP node를 사용하세요.

<div id="prompt-patterns">
  ## 프롬프트 패턴
</div>

<AccordionGroup>
  <Accordion title="검색 후 요약하기">
    ```text theme={null}
    이번 주에 게시된 [주제] 관련 공식 발표를 검색하세요.
    각 결과마다 날짜, 게시자, 요약, 출처 URL을 반환하세요.
    ```
  </Accordion>

  <Accordion title="기업 정보 보강하기">
    ```text theme={null}
    주어진 회사명과 도메인을 바탕으로 제품 설명,
    최신 투자 유치 발표, 최근 뉴스 출처 두 건을 찾으세요.
    ```
  </Accordion>

  <Accordion title="이미 알고 있는 페이지 읽기">
    ```text theme={null}
    이 URL의 전체 콘텐츠를 가져와 요금제 등급을 JSON으로 추출하세요.
    ```
  </Accordion>
</AccordionGroup>

<div id="troubleshooting">
  ## 문제 해결
</div>

<AccordionGroup>
  <Accordion title="agent에서 Exa를 사용할 수 없는 경우">
    agent의 MCP 도구를 다시 열어 Exa가 연결되어 있는지 확인한 뒤, 필요한 도구를 활성화하세요. 통합이 연결되어 있더라도 개별 도구는 비활성화된 상태일 수 있습니다.
  </Accordion>

  <Accordion title="agent가 잘못된 동작을 선택하는 경우">
    search를 수행할지, 이미 알고 있는 URL을 읽을지, 유사한 페이지를 찾을지, 출처를 기반으로 답변할지를 요청에 명확히 밝히세요. 해당 workflow에 필요하지 않은 Exa 도구는 비활성화하세요.
  </Accordion>

  <Accordion title="workflow에 예측 가능한 단일 call이 필요한 경우">
    범용 agent 단계를 입력과 작업이 고정된 커스텀 Exa MCP node로 교체하세요.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

<Columns cols={3}>
  <Card title="Gumloop Exa 통합" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="가이드 읽기" arrow="true">
    Gumloop에서 현재 제공하는 도구와 Agent Node workflow를 살펴보세요.
  </Card>

  <Card title="Exa MCP server" icon="plug" href="/ko/docs/get-started/exa-mcp" cta="가이드 읽기" arrow="true">
    MCP로 노출되는 Exa 도구를 알아보세요.
  </Card>

  <Card title="Exa Search" icon="search" href="/ko/docs/search/quickstart" cta="가이드 읽기" arrow="true">
    search 쿼리와 반환되는 contents를 원하는 대로 구성하는 방법을 알아보세요.
  </Card>
</Columns>