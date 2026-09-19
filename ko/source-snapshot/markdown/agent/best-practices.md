> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="agent-best-practices">
  # Agent 모범 사례
</div>

> 프로덕션 환경의 Exa Agent 연동을 위해 질의 품질, structured output, effort, 비용을 조정하세요.

[Exa Agent 퀵스타트](/ko/docs/agent/quickstart)를 마친 뒤 이 가이드를 참고해 질의 품질을 개선하고, 출력을 구조화하며, 실행 시간과 비용을 제어하세요. 완전한 요청 예시는 [Agent 예제](/ko/docs/agent/examples)에서 시작하세요.

<div id="core-principles">
  ## 핵심 원칙
</div>

`query`는 작업 명세라고 생각하세요. Agent가 무엇을 찾아야 하는지, 작업 범위는 어디까지인지, 어떤 evidence가 필요한지, 완성된 결과는 어떤 모습인지를 명시하세요.

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

`outputSchema`를 지정하지 않으면 Agent는 `output.text`에 서술형 결과를, `output.grounding`에 citations를 반환합니다. 다른 필드는 명확한 용도가 있을 때만 추가하세요:

| 필드                      | 사용 시점                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| `outputSchema`          | 후속 코드에 구조화된 필드가 필요할 때                                                 |
| `input.data`            | 이미 enrich할 행 데이터가 있을 때                                                |
| `input.exclusion`       | 이미 알고 있는 레코드는 반환하지 않아야 할 때                                            |
| `dataSources`           | 특정 필드를 [Exa Connect](/ko/docs/agent/connect/overview) partner에서 가져와야 할 때 |
| `previousRunId`         | 완료된 실행을 이어서 요청할 때                                                    |
| `effort`                | cost나 리서치 깊이를 명시적으로 설정해야 할 때                                          |
| `budget.maxCostDollars` | `auto` 또는 `max` 실행에 확실한 cost 상한이 필요할 때                               |

행 데이터, 제외 항목, 응답 형태는 `query`에 녹여 넣지 말고 각각의 전용 필드에 담으세요.

<div id="writing-list-building-and-enrichment-queries">
  ## list building 및 enrichment 질의 작성하기
</div>

list building의 경우 엔터티, 목표 개수, 자격 criteria, 제외 조건, evidence 기준을 정의하세요. enrichment의 경우 기존 레코드를 `input.data`에 넣고 Agent가 추가로 조사해야 할 내용만 설명하세요.

자격 판정에 판단이 필요한 경우 근거를 함께 요청하세요. 예시는 하나의 criteria를 여러 가지로 해석할 여지가 있을 때만 제시하세요.

<CodeGroup>
  ```text Query theme={null}
  2026년 3월 1일부터 8월 31일 사이에 시리즈 A 또는 B 투자를 발표한 미국 소재 AI 인프라
  기업의 현직 엔지니어링 리더를 최대 20명 찾아주세요.

  CTO, 엔지니어링 부사장, 엔지니어링 총괄을 포함하세요. 실질적인 엔지니어링 직책을 맡고 있지
  않은 창업자와 현재 재직 여부를 확인할 수 없는 사람은 제외하세요. 각 인물에 대해 이름, 현재 직책,
  회사, 회사 웹사이트, 투자 발표일, 그리고 해당 인물이 조건을 충족하는 이유에 대한 짧은 설명을
  반환하세요. 재직 여부는 회사 웹사이트나 다른 최신 출처로 확인하고, 투자 내역은 회사 발표나
  신뢰할 수 있는 비즈니스 매체를 통해 확인하세요.
  ```
</CodeGroup>

탐색 요청 예시는 [모든 GTM 구성원 찾기](/ko/docs/agent/examples#find-all-code)를, 이에 대응하는 행 단위 enrichment 패턴은 [입력 행 enrich하기](/ko/docs/agent/examples#enrich-input-rows-code)를 참고하세요.

<div id="handle-asynchronous-runs">
  ## 비동기 실행 처리하기
</div>

Agent 실행은 검색하고, 읽고, 추론하는 동안 몇 초에서 몇 분까지 걸릴 수 있습니다. 애플리케이션 요청을 열어 둔 채 대기하지 말고, 실행 수명 주기를 중심으로 설계하세요.

<Steps>
  <Step title="생성하고 저장하기">
    실행을 생성한 뒤 반환된 `id`를 요청 메타데이터와 함께 저장하세요. 생성 응답은 최종 결과가 아닙니다.
  </Step>

  <Step title="종료 상태까지 대기하기">
    SDK의 폴링 헬퍼를 사용하거나, `GET /agent/runs/{id}`를 poll하거나, SSE 스트림을 소비하세요. 실행 상태가 `queued` 또는 `running`인 동안에는 계속 대기합니다.
  </Step>

  <Step title="결과 저장하기">
    `completed`, `failed`, `cancelled` 상태가 되면 대기를 멈추고, 종료 응답과 grounding을 저장하세요.
  </Step>
</Steps>

실행 ID를 저장해 두면 애플리케이션을 재시작한 뒤에도 복구하거나, 스트림에 다시 연결하거나, 실패 원인을 확인할 수 있습니다. scope를 좁히고, 결과 개수를 제한하고, schema를 간결하게 유지하며, 완전성보다 속도가 중요할 때는 `minimal` 또는 `low`를 선택해 지연 시간을 줄이세요.

batch 작업의 경우, concurrency를 추정하거나 Agent를 동기식 UI 경로에 배치하기 전에 대표적인 작업으로 벤치마크를 수행하세요. 실행 시간은 item 수, schema 복잡도, 소스 가용성, effort에 따라 달라집니다.

Zero Data Retention을 사용하는 team은 실시간 스트림을 소비하거나 보존 기간 내에 poll해야 합니다. `previousRunId`와 Connect `dataSources`는 사용할 수 없습니다. [Zero Data Retention](/ko/docs/admin/security/zero-data-retention)을 참고하세요.

<div id="write-custom-json-schemas-for-structured-output">
  ## structured output을 위한 커스텀 JSON schema 작성하기
</div>

다운스트림 코드에서 기계가 읽을 수 있는 필드, 정규화된 값, 테이블 행, enrichment 레코드가 필요할 때 `outputSchema`를 사용하세요. 서술형 답변으로 충분하다면 이를 생략하고 `output.text`를 읽으면 됩니다. structured output은 형식을 맞추는 작업이 추가되고 지연 시간이 늘어날 수 있습니다.

조사 지침은 `query`에, 응답 형태는 `outputSchema`에 담으세요. 속성 이름과 설명은 명확하게 작성하고, 쓸 수 있는 가장 좁은 타입을 선택하며, 배열은 `maxItems`로 제한하세요.

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

schema 준수는 사실이 아니라 형태를 검증합니다. evidence가 특정 필드를 뒷받침하지 못하면, 제출한 schema에서 그 필드를 필수 또는 non-nullable로 표시했더라도 Agent가 `null`을 반환할 수 있습니다. `stopReason: schema_satisfied`는 그러한 null을 허용한 상태로 기대한 형태가 완성되었다고 Agent가 판단했다는 뜻이며, 제출한 schema에 대한 엄격한 검증을 보장하지는 않습니다.

Exa가 기본 제공하는 citations나 신뢰도 값을 schema에 중복으로 넣지 마세요. 각 item이 왜 조건을 충족하는지 설명해야 하는 경우에만 근거 필드를 추가하고, structured 결과와 함께 `output.grounding`을 보관하세요. 중요한 주장은 출처와 대조해 검증하고, schema 변경 사항은 배포 전에 대표적인 입력으로 테스트하세요.

[구조화된 Agent 예제](/ko/docs/agent/examples)를 살펴보며 list building, KYB, 채용 공고, 제외 조건, 이어지는 실행에 대한 schema를 비교해 보세요.

<div id="agent-vs-search">
  ## Agent vs search
</div>

| 필요한 작업                                 | 시작점                                     |
| -------------------------------------- | --------------------------------------- |
| LLM에 넣을 웹 검색 결과                        | [Search](/ko/docs/search/quickstart)       |
| 빠른 리서치와 synthesis                      | [Deep Search](/ko/docs/search/deep-search) |
| 비동기 list building, 멀티홉 리서치, enrichment | [Agent](/ko/docs/agent/quickstart)         |

여러 단계의 retrieval, 엔티티별 verification, 또는 이미 확보한 레코드에 대한 enrichment가 필요할 때는 Agent를 사용하세요. 페이지를 빠르게 가져오고 나머지 추론은 애플리케이션에서 처리할 때는 search를 사용하세요.

<div id="tips-for-common-use-cases">
  ## 일반적인 사용 사례별 팁
</div>

| 필요한 작업                   | 사용                                                               | 피해야 할 것                                |
| ------------------------ | ---------------------------------------------------------------- | -------------------------------------- |
| 규모를 알 수 없는 리서치 결과 목록     | `auto`와 범위를 제한한 `outputSchema`                                   | 낮은 effort 고정과 제한 없는 배열                 |
| 이미 보유한 레코드의 Enrichment   | `input.data`와 추가할 필드                                             | 테이블을 `query`에 붙여넣기                     |
| 직전 결과 집합에 대한 후속 작업       | `previousRunId`                                                  | 이전 output 전체를 다시 전송                    |
| 다시 나타나면 안 되는 레코드         | `input.exclusion`과 이후 단계의 중복 제거                                  | 제외 항목을 엄격한 식별 보장으로 취급                  |
| 프리미엄 provider 데이터        | `dataSources`와 함께 [Exa Connect](/ko/docs/agent/connect/overview) 사용 | provider 전용 필드를 공개 웹에서 추론하도록 Agent에 요청 |
| 요청당 예측 가능한 cost          | 고정된 `effort`                                                     | 예산 없이 `auto` 또는 `max` 사용               |
| 지연 시간과 cost보다 완전성이 중요할 때 | `xhigh` 또는 `max`                                                 | query를 다듬기 전에 effort부터 높이기             |

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="Agent 퀵스타트" icon="bot" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행을 생성하고, 이벤트를 스트리밍하고, effort를 설정하고, structured output을 읽는 방법을 알아보세요.
  </Card>

  <Card title="Agent 예제" icon="layers" href="/ko/docs/agent/examples" cta="예제 둘러보기" arrow="true">
    리스트 구축, enrichment, KYB, 제외, 후속 요청에 대한 완성된 예제를 그대로 가져다 쓰세요.
  </Card>

  <Card title="Exa Connect" icon="database" href="/ko/docs/agent/connect/overview" cta="data partners 둘러보기" arrow="true">
    프리미엄 기업, 인물, 트래픽, 컴플라이언스, 금융 등 다양한 provider 데이터를 추가하세요.
  </Card>

  <Card title="search 모범 사례" icon="sparkles" href="/ko/docs/search/best-practices" cta="가이드 읽기" arrow="true">
    search만으로 충분한 경우의 retrieval 품질, 지연 시간, synthesis를 다룹니다.
  </Card>
</Columns>