> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

<div id="n8n">
  # n8n
</div>

> n8n 워크플로우에서 Exa search와 contents를 사용하세요.

공식 [n8n용 Exa 노드](https://github.com/exa-labs/n8n-integration)는 web search, 콘텐츠 extraction, grounded answer, Exa Agent 실행 기능을 시각적 워크플로우에 추가해 줍니다. 일반 워크플로우 단계로 사용하거나 n8n AI Agent에 도구로 연결할 수 있습니다.

<div id="install-the-exa-node">
  ## Exa node 설치
</div>

package 이름은 `n8n-nodes-exa-official`입니다.

<Steps>
  <Step title="커뮤니티 node 추가">
    n8n node 선택기에서 **Exa**를 검색하세요. 사용 중인 instance에서 찾을 수 없다면, instance 소유자가 n8n의 [커뮤니티 node 설치 가이드](https://docs.n8n.io/integrations/community-nodes/installation/)를 참고해 `n8n-nodes-exa-official`을 설치할 수 있습니다.

    이 node를 사용하려면 n8n 1.60 이상, Node.js 20.15 이상이 필요합니다.
  </Step>

  <Step title="Exa API key 생성">
    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>
  </Step>

  <Step title="Exa credential 추가">
    n8n에서 **Exa API** credential을 추가하고 key를 붙여넣으세요. 해당 계정을 사용할 Exa node마다 그 credential을 선택하세요.
  </Step>
</Steps>

<div id="run-a-search">
  ## search 실행하기
</div>

1. 워크플로우에 트리거를 추가합니다.
2. **Exa** node를 추가합니다.
3. **Search**를 선택합니다.
4. 질의를 입력하고 search type을 선택합니다.
5. 응답 형식을 선택합니다:
   * 순위가 매겨진 페이지를 받으려면 **Results**
   * 종합된 답변을 받으려면 **Text**
   * schema에 맞는 JSON을 받으려면 **Structured**
6. node를 실행한 뒤 그 output을 다음 워크플로우 단계로 전달합니다.

search는 각 결과에서 텍스트, highlights, summaries, 링크, 이미지도 함께 반환할 수 있습니다. 도메인 필터, 발행일, 카테고리, `maxAgeHours`, 하위 페이지 크롤링은 node의 선택 필드에서 설정할 수 있습니다.

<div id="available-resources">
  ## 사용 가능한 리소스
</div>

| 리소스          | 작업                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **search**   | `auto`, `instant`, `fast`, `deep-lite`, `deep`, `deep-reasoning` 모드로 웹을 검색하며, 선택적으로 synthesis와 structured output을 지원합니다. |
| **Contents** | URL 목록에 대해 정제된 텍스트, highlights, summaries, 링크, 이미지를 가져옵니다.                                                               |
| **Answer**   | citations와 선택적 structured output을 포함한 grounded answer를 생성합니다.                                                            |
| **Agent**    | 여러 단계로 구성된 Agent 실행을 생성, 조회, 목록 조회, 스트리밍, poll, 취소합니다.                                                                   |

<div id="use-exa-with-an-n8n-ai-agent">
  ## n8n AI Agent에서 Exa 사용하기
</div>

Exa node를 **AI Agent** node의 tool 입력에 연결하세요. 모델이 값을 채워야 하는 매개변수에는 n8n의 `$fromAI()` 표현식을 사용할 수 있습니다:

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search와 Answer는 grounding 도구로 적합합니다. 여러 단계의 리서치, list building, 구조화된 enrichment, 또는 프리미엄 [Exa Connect](/ko/docs/agent/connect/overview) 데이터가 필요한 작업이라면 Agent 리소스를 사용하세요.

<div id="wait-for-an-agent-run">
  ## Agent 실행 대기
</div>

Agent 실행을 생성할 때 **Wait for Completion**은 다음을 지원합니다:

* **Stream**: 실행이 완료될 때까지 server-sent events 연결을 하나 열어 둡니다
* **Poll**: 일정 간격으로 실행 상태를 확인합니다

장시간 실행되거나 비동기로 처리되는 워크플로우라면 **Wait for Completion**을 끄고, 반환된 실행 `id`를 저장해 두었다가 나중에 **Get Run**을 사용하세요. n8n 단계가 끝난 뒤에도 실행은 Exa에서 계속 진행됩니다.

<div id="troubleshooting">
  ## 문제 해결
</div>

<AccordionGroup>
  <Accordion title="노드 선택기에 Exa 노드가 보이지 않습니다">
    인스턴스 소유자에게 검증된 커뮤니티 패키지 `n8n-nodes-exa-official` 설치를 요청하세요. 커뮤니티 노드 사용 가능 여부는 n8n 인스턴스의 호스팅 방식에 따라 달라질 수 있습니다.
  </Accordion>

  <Accordion title="Exa credential이 거부됩니다">
    선택한 credential에 [Exa dashboard](https://dashboard.exa.ai/api-keys)에서 발급한 활성 key가 들어 있는지, 그리고 해당 key에 사용 가능한 credits가 남아 있는지 확인하세요.
  </Accordion>

  <Accordion title="Agent 워크플로우가 시간 초과됩니다">
    **Wait for Completion**을 끄고 반환된 실행 `id`를 저장해 둔 뒤, 이후 단계에서 **Get Run**으로 결과를 가져오세요.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

<Columns cols={3}>
  <Card title="공식 Exa node" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="repository 보기" arrow="true">
    현재 지원되는 작업, 호환성, 소스를 확인하세요.
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/ko/docs/agent/quickstart" cta="가이드 읽기" arrow="true">
    다단계 리서치 및 enrichment 워크플로우를 구축하세요.
  </Card>

  <Card title="search 모범 사례" icon="search" href="/ko/docs/search/best-practices" cta="가이드 읽기" arrow="true">
    더 나은 질의를 작성하고 알맞은 search mode를 선택하세요.
  </Card>
</Columns>