> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="n8n">
  # n8n
</div>

> n8n 워크플로우 안에서 Exa search와 contents를 사용하세요.

공식 [n8n용 Exa node](https://github.com/exa-labs/n8n-integration)를 사용하면 web search, content extraction, 근거 기반 답변, Exa Agent 실행을 시각적 워크플로우에 추가할 수 있습니다. 일반 워크플로우 단계로 사용하거나 n8n AI Agent에 도구로 연결하세요.

<div id="install-the-exa-node">
  ## Exa node 설치
</div>

패키지 이름은 `n8n-nodes-exa-official`입니다.

<Steps>
  <Step title="community node 추가">
    n8n node picker에서 **Exa**를 검색하세요. 사용 중인 instance에 없다면, instance 소유자가 n8n의 [community node 설치 가이드](https://docs.n8n.io/integrations/community-nodes/installation/)를 따라 `n8n-nodes-exa-official`을 설치할 수 있습니다.

    이 node는 n8n 1.60 이상, Node.js 20.15 이상이 필요합니다.
  </Step>

  <Step title="Exa API key 생성">
    <Card title="Exa API key 받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>
  </Step>

  <Step title="Exa credential 추가">
    n8n에서 **Exa API** credential을 추가하고 키를 붙여넣으세요. 해당 계정을 사용할 Exa node마다 그 credential을 선택하세요.
  </Step>
</Steps>

<div id="run-a-search">
  ## search 실행하기
</div>

1. 워크플로우에 트리거를 추가합니다.
2. **Exa** node를 추가합니다.
3. **Search**를 선택합니다.
4. 질의를 입력하고 search type을 선택합니다.
5. response 형식을 선택합니다:
   * 순위가 매겨진 페이지가 필요하면 **Results**
   * 종합된 답변이 필요하면 **Text**
   * schema에 맞는 JSON이 필요하면 **Structured**
6. node를 실행하고 그 output을 다음 워크플로우 단계로 전달합니다.

search는 각 result에서 텍스트, highlights, summary, 링크, 이미지도 함께 반환할 수 있습니다. 도메인 필터, 발행일, 카테고리, `maxAgeHours`, 하위 페이지 크롤링은 node의 선택적 field에서 설정할 수 있습니다.

<div id="available-resources">
  ## 사용 가능한 resource
</div>

| Resource     | 작업                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Search**   | `auto`, `instant`, `fast`, `deep-lite`, `deep`, `deep-reasoning` 중 하나로 웹을 검색하며, synthesis와 structured output을 선택적으로 사용할 수 있습니다. |
| **Contents** | URL 목록에서 정제된 텍스트, highlights, summary, 링크, 이미지를 가져옵니다.                                                                          |
| **Answer**   | citations와 선택적 structured output을 포함한 근거 기반 답변을 생성합니다.                                                                          |
| **Agent**    | 다단계 Agent 실행을 생성, 조회, 목록 조회, 스트리밍, 폴링, 취소합니다.                                                                                   |

<div id="use-exa-with-an-n8n-ai-agent">
  ## n8n AI Agent에서 Exa 사용하기
</div>

Exa node를 **AI Agent** node의 도구 입력에 연결하세요. 모델이 제공해야 하는 parameters에는 n8n의 `$fromAI()` 표현식을 사용할 수 있습니다:

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search와 Answer는 grounding 도구로 적합합니다. 다단계 리서치, 리스트 구축, 구조화된 enrichment, 또는 프리미엄 [Exa Connect](/ko/docs/agent/connect/overview) 데이터가 필요한 작업에는 Agent resource를 사용하세요.

<div id="wait-for-an-agent-run">
  ## Agent 실행 대기하기
</div>

Agent 실행을 생성할 때 **Wait for Completion**은 다음을 지원합니다.

* **스트리밍**: 실행이 끝날 때까지 server-sent events 연결을 하나 열어 둡니다
* **폴링**: 일정 주기로 실행 상태를 확인합니다

오래 걸리거나 비동기로 처리되는 워크플로우에서는 **Wait for Completion**을 끄고, 반환된 실행 `id`를 저장한 뒤 나중에 **Get Run**을 사용하세요. n8n 단계가 끝난 뒤에도 실행은 Exa에서 계속 진행됩니다.

<div id="troubleshooting">
  ## 문제 해결
</div>

<AccordionGroup>
  <Accordion title="node picker에 Exa node가 보이지 않습니다">
    instance 소유자에게 인증된 커뮤니티 패키지 `n8n-nodes-exa-official`을 설치해 달라고 요청하세요. community node를 사용할 수 있는지 여부는 n8n instance의 호스팅 방식에 따라 달라질 수 있습니다.
  </Accordion>

  <Accordion title="Exa credential이 거부됩니다">
    선택한 credential에 [Exa dashboard](https://dashboard.exa.ai/api-keys)에서 발급한 활성 키가 들어 있는지, 그리고 해당 키에 사용 가능한 credits이 있는지 확인하세요.
  </Accordion>

  <Accordion title="Agent 워크플로우가 시간 초과됩니다">
    **Wait for Completion**을 비활성화하고, 반환된 실행 `id`를 저장한 뒤 이후 단계에서 **Get Run**으로 결과를 가져오세요.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

<Columns cols={3}>
  <Card title="공식 Exa node" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="리포지토리 보기" arrow="true">
    현재 지원되는 작업, 호환성, 소스 코드를 확인하세요.
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/ko/docs/agent/quickstart" cta="가이드 읽기" arrow="true">
    여러 단계로 이루어진 리서치 및 enrichment 워크플로우를 구축하세요.
  </Card>

  <Card title="검색 모범 사례" icon="search" href="/ko/docs/search/best-practices" cta="가이드 읽기" arrow="true">
    더 나은 질의를 작성하고 알맞은 search mode를 선택하세요.
  </Card>
</Columns>