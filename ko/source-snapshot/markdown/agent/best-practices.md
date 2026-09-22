> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="agent-best-practices">
  # Agent 모범 사례
</div>

> 프로덕션 Exa Agent 연동에 맞춰 질의 품질, structured output, effort, 비용을 조정하세요.

[Exa Agent quickstart](/ko/docs/agent/quickstart)를 마쳤다면 이 가이드를 통해 질의 품질을 높이고, output을 구조화하며, 실행 시간과 비용을 제어해 보세요. 완성된 형태의 요청은 [Agent 예제](/ko/docs/agent/examples)에서 시작하세요.

<div id="core-principles">
  ## 핵심 원칙
</div>

`query`는 작업 명세서라고 생각하세요. Agent가 무엇을 찾아야 하는지, 작업의 scope, 필요한 evidence, 그리고 완성된 결과의 모습이 어떠해야 하는지를 명시하세요.

<CodeGroup>
  ```python Python theme={null}
  run = exa.agent.runs.create(
      query="Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources.",
  )
  ```

  ```javascript JavaScript theme={null}
  const run = await exa.agent.runs.create({
    query:
      "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
    }'
  ```
</CodeGroup>

`outputSchema`가 없으면 Agent는 `output.text`에 서술형 텍스트를, `output.grounding`에 citations를 반환합니다. 다른 field는 명확한 역할이 있을 때만 추가하세요:

| Field                   | 사용 시점                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| `outputSchema`          | 후속 코드에서 구조화된 fields가 필요한 경우                                            |
| `input.data`            | enrich할 행이 이미 있는 경우                                                    |
| `input.exclusion`       | 반환하지 않아야 할 records가 정해져 있는 경우                                          |
| `dataSources`           | 특정 field를 [Exa Connect](/ko/docs/agent/connect/overview) 파트너에서 가져와야 하는 경우 |
| `previousRunId`         | 완료된 실행을 이어서 진행하는 요청인 경우                                                |
| `effort`                | 비용이나 리서치 깊이를 명시적으로 설정해야 하는 경우                                          |
| `budget.maxCostDollars` | `auto` 또는 `max` 실행에 확실한 비용 상한이 필요한 경우                                  |

행, exclusions, response 형태는 `query`에 포함하지 말고 각각의 전용 field에 두세요.

<div id="writing-list-building-and-enrichment-queries">
  ## 리스트 구축 및 enrichment 질의 작성하기
</div>

리스트 구축에서는 엔티티, 목표 개수, 자격 criteria, exclusions, evidence 기준을 정의하세요. enrichment에서는 기존 records를 `input.data`에 넣고 Agent가 새로 리서치해야 할 내용만 설명하세요.

자격 판정에 판단이 개입되는 경우에는 근거를 함께 요청하세요. 예시는 하나의 criterion에 여러 해석이 가능할 때만 제시하세요.

<CodeGroup>
  ```text Query theme={null}
  2026년 3월 1일부터 8월 31일 사이에 시리즈 A 또는 B를 발표한 미국 소재 AI 인프라 기업의
  현직 엔지니어링 리더를 최대 20명 찾아줘.

  CTO, VP of Engineering, Head of Engineering을 포함해줘. 실질적인 엔지니어링 역할을 맡지 않은
  창업자와 현재 재직 사실을 확인할 수 없는 사람은 제외해줘.
  각 인물에 대해 이름, 현재 직함, 회사, 회사 웹사이트, 펀딩 발표일, 그리고 해당 인물이 조건에
  부합하는 이유에 대한 짧은 설명을 반환해줘. 재직 여부는 회사 웹사이트나 다른 최신 소스에서
  확인하고, 펀딩은 회사 발표문이나 신뢰할 수 있는 비즈니스 매체에서 확인해줘.
  ```
</CodeGroup>

discovery 요청 예시는 [Find all GTM members](/ko/docs/agent/examples#find-all-code)를, 이에 대응하는 행 enrichment 패턴은 [Enrich input rows](/ko/docs/agent/examples#enrich-input-rows-code)를 참고하세요.

<div id="handle-asynchronous-runs">
  ## 비동기 실행 처리
</div>

Agent 실행은 검색하고, 읽고, 추론하는 동안 수 초에서 수 분이 걸릴 수 있습니다. 애플리케이션 요청을 열어둔 채 기다리지 말고, 실행 수명 주기를 중심으로 설계하세요.

<Steps>
  <Step title="생성 및 저장">
    실행을 생성한 뒤 반환된 `id`를 요청 metadata와 함께 저장하세요. 생성 response는 최종 결과가 아닙니다.
  </Step>

  <Step title="종료 상태까지 대기">
    SDK 폴링 헬퍼를 사용하거나, `GET /agent/runs/{id}`를 폴링하거나, SSE 스트리밍을 수신하세요. 실행이 `queued` 또는 `running`인 동안에는 계속 대기합니다.
  </Step>

  <Step title="결과 저장">
    `completed`, `failed`, `cancelled` 상태가 되면 대기를 중단하고, 최종 response와 grounding을 저장하세요.
  </Step>
</Steps>

실행 ID를 저장해 두면 애플리케이션이 재시작 후 복구하거나, 스트리밍에 다시 연결하거나, 실패 원인을 확인할 수 있습니다. scope를 좁히고, 결과 수를 제한하고, schema를 간결하게 유지하고, 완전성보다 속도가 중요하다면 `minimal` 또는 `low`를 선택해 latency를 낮추세요.

batch 작업의 경우, concurrency를 산정하거나 Agent를 동기 UI 경로에 넣기 전에 대표적인 작업으로 벤치마크를 수행하세요. 실행 시간은 item 수, schema 복잡도, 소스 가용성, effort에 따라 달라집니다.

Zero Data Retention team의 경우, 실시간 스트리밍을 수신하거나 보존 기간 내에 폴링하세요. `previousRunId`와 Connect `dataSources`는 사용할 수 없습니다. [Zero Data Retention](/ko/docs/admin/security/zero-data-retention)을 참조하세요.

<div id="write-custom-json-schemas-for-structured-output">
  ## structured output을 위한 커스텀 JSON schema 작성하기
</div>

후속 코드에서 기계 판독 가능한 field, 정규화된 값, 표 행, enrichment records가 필요할 때 `outputSchema`를 사용하세요. 서술형 답변으로 충분하다면 생략하고 `output.text`를 읽으면 됩니다. structured output은 형식화 작업이 추가로 필요하고 latency를 늘릴 수 있습니다.

리서치 지시는 `query`에, response 형태는 `outputSchema`에 담으세요. 명확한 속성 이름과 설명을 사용하고, 쓸모 있는 선에서 가장 좁은 타입을 선택하며, array는 `maxItems`로 제한하세요.

<CodeGroup>
  ```json Output schema expandable theme={null}
  {
    "type": "object",
    "properties": {
      "people": {
        "type": "array",
        "maxItems": 10,
        "description": "Current engineering leaders who satisfy every criterion in the query.",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The person's full name."
            },
            "job_title": {
              "type": "string",
              "description": "Their current title at the qualifying company."
            },
            "company": {
              "type": "string",
              "description": "The qualifying company's canonical name."
            },
            "qualification_rationale": {
              "type": "string",
              "description": "A concise explanation of how the person satisfies the query criteria."
            }
          },
          "required": ["name", "job_title", "company", "qualification_rationale"]
        }
      }
    },
    "required": ["people"]
  }
  ```
</CodeGroup>

schema 준수는 사실이 아니라 형태를 검증합니다. evidence가 특정 field를 뒷받침하지 못하면, 제출한 schema에서 해당 field를 필수 또는 non-nullable로 표시했더라도 Agent가 `null`을 반환할 수 있습니다. `stopReason: schema_satisfied`는 그러한 null을 허용한 상태에서 Agent가 기대한 형태가 완성되었다고 판단했다는 뜻이며, 제출한 schema에 대한 엄격한 검증을 보장하지는 않습니다.

Exa에 내장된 citations나 confidence를 schema에 중복으로 넣지 마세요. 각 item이 왜 조건을 충족하는지 설명해야 하는 경우에만 근거 field를 추가하고, structured 결과와 함께 `output.grounding`을 저장하세요. 중요한 주장은 소스와 대조해 검증하고, 배포 전에 대표적인 입력으로 schema 변경 사항을 테스트하세요.

[structured Agent 예시](/ko/docs/agent/examples)를 살펴보면서 리스트 구축, KYB, 채용 공고, exclusions, 이어서 진행하는 실행에 쓰이는 schema를 비교해 보세요.

<div id="agent-vs-search">
  ## Agent vs Search
</div>

| 필요한 작업                          | 시작할 곳                                   |
| ------------------------------- | --------------------------------------- |
| LLM에 제공할 웹 결과                   | [Search](/ko/docs/search/quickstart)       |
| 빠른 리서치와 synthesis               | [Deep Search](/ko/docs/search/deep-search) |
| 비동기 리스트 구축, 멀티홉 리서치, enrichment | [Agent](/ko/docs/agent/quickstart)         |

여러 단계의 검색, 엔티티별 verification, 또는 이미 확보한 records에 대한 enrichment가 필요한 작업이라면 Agent를 사용하세요. 페이지를 빠르게 가져오고 나머지 추론은 애플리케이션에서 처리할 경우에는 Search를 사용하세요.

<div id="tips-for-common-use-cases">
  ## 일반적인 사용 사례별 팁
</div>

| 필요한 것                  | 사용할 방법                                                           | 피해야 할 것                                |
| ---------------------- | ---------------------------------------------------------------- | -------------------------------------- |
| 규모를 알 수 없는 리서치 기반 목록   | `auto`와 범위를 제한한 `outputSchema`                                   | 저비용 effort 고정 및 제한 없는 array            |
| 이미 보유한 records의 enrichment | `input.data`와 추가할 fields                                         | 표를 `query`에 그대로 붙여넣기                   |
| 직전 결과 집합에 대한 후속 요청     | `previousRunId`                                                  | 이전 output 전체를 다시 전송                    |
| 다시 나타나면 안 되는 records       | `input.exclusion`과 후속 단계의 중복 제거                                  | exclusion을 엄격한 동일성 보장으로 간주             |
| 프리미엄 제공업체 데이터          | `dataSources`와 함께 [Exa Connect](/ko/docs/agent/connect/overview) 사용 | 제공업체 전용 fields를 공개 웹에서 추론하도록 Agent에 요청 |
| 요청당 예측 가능한 비용          | 고정된 `effort`                                                     | 예산 없이 `auto` 또는 `max` 사용               |
| latency와 비용보다 완전성 우선   | `xhigh` 또는 `max`                                                 | 질의를 다듬기 전에 effort부터 높이기                |

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="Agent 퀵스타트" icon="bot" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행을 생성하고, 이벤트를 스트리밍하고, effort를 설정하고, structured output을 읽어보세요.
  </Card>

  <Card title="Agent 예제" icon="layers" href="/ko/docs/agent/examples" cta="예제 둘러보기" arrow="true">
    리스트 빌딩, enrichment, KYB, 제외, 후속 요청의 전체 예제를 그대로 복사해 사용하세요.
  </Card>

  <Card title="Exa Connect" icon="database" href="/ko/docs/agent/connect/overview" cta="data partners 둘러보기" arrow="true">
    프리미엄 기업, 인물, 트래픽, 컴플라이언스, 금융 등 다양한 제공업체 데이터를 추가하세요.
  </Card>

  <Card title="Search 모범 사례" icon="sparkles" href="/ko/docs/search/best-practices" cta="가이드 읽기" arrow="true">
    search만으로 충분할 때의 검색 품질, latency, synthesis를 다룹니다.
  </Card>
</Columns>