> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 먼저 확인하세요.

# Fiber.ai {#fiberai}

> Fiber.ai의 B2B 데이터베이스에서 기업, 인물, LinkedIn 프로필을 search하세요.

[Fiber.ai](https://fiber.ai)는 4천만 개 이상의 기업, 8억 5천만 명 이상의 인물,
3천만 개 이상의 채용 공고에 대한 최신 데이터를 보유한 B2B 데이터 플랫폼입니다.
실시간 기업, 인물, 채용 데이터를 search하고, 불완전한 레코드를 work email,
개인 이메일, 전화번호로 enrich할 수 있습니다.

[Exa Connect](/ko/docs/agent/connect/overview)를 통해 [Exa Agent](/ko/docs/agent/quickstart)
실행에 `fiber`를 attach하면, agent가 Exa web search와 함께 Fiber.ai에도 질의를 보냅니다.

## 활용 사례 {#use-it-for}

* work email 또는 개인 이메일로 인물을 역조회하거나, 일부만 채워진 회사/인물 레코드를 enrich하여
  CRM을 정리합니다.
* 실시간 LinkedIn 시그널 추적: 이직, 승진, 신규 입사,
  인원 변동, 자금 조달.
* LinkedIn, X, Instagram, TikTok, Reddit, YouTube 전반에서 관련 게시물을 찾아
  댓글과 반응을 수집한 뒤, 작성자의
  연락처 정보를 enrich합니다.
* 4,000만 개 이상의 회사와 8억 5,000만 명 이상의 인물을 search하고, 잠재 고객에
  work email, 개인 이메일, 전화번호를 enrich합니다.

## 제공업체 ID {#provider-id}

`dataSources`에 이 값을 사용하세요:

```text theme={null}
fiber
```

## Pricing {#pricing}

Fiber.ai는 `$0.02 / credit` 기준으로 credits를 청구하며, 각 call에는 Fiber가 보고한 credits만큼
과금됩니다:

| 작업              | Credits                   |
| --------------- | ------------------------- |
| search          | 2 + 반환된 result당 1         |
| 회사 조회           | 반환된 후보당 ~2                |
| 인물 조회 / 이메일 역조회 | 2                         |
| 연락처 공개          | 2 (work email) – 5 (전화번호) |

일치 항목이 없는 call(또는 Fiber가 과금을 환불하는 call)은 무료입니다. 매개변수를
어떻게 설정하느냐에 따라 가격이 달라집니다. 회사 조회에서는 `numResults`가 과금 대상 후보 수를 결정하고,
search에서는 result 개수가 비용의 대부분을 좌우합니다.

## 예시 {#example}

뉴욕에 있는 직원 50~200명 규모의 시리즈 A 핀테크 기업으로 B2B 잠재 고객 목록을 만들어 보세요.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
      data_sources=[{"provider": "fiber"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "employeeCount", "fundingStage"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "employeeCount": {"type": "number"},
                          "fundingStage": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
    dataSources: [{ provider: "fiber" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "employeeCount", "fundingStage"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              employeeCount: { type: "number" },
              fundingStage: { type: "string" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "I'\''m building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company'\''s LinkedIn profile, domain, employee count, and funding stage.",
      "dataSources": [{ "provider": "fiber" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "employeeCount", "fundingStage"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "employeeCount": { "type": "number" },
                "fundingStage": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## 함께 사용하면 좋은 도구 {#pairs-well-with}

* [Similarweb](/ko/docs/agent/connect/similarweb): 잠재 고객의 웹 입지와 경쟁사를 파악합니다.
* [Baselayer](/ko/docs/agent/connect/baselayer): 후보로 선정한 미국 기업의 임원과 등록 정보를 확인합니다.
* [Particle](/ko/docs/agent/connect/particle): 특정 기업이나 임원에 대해 팟캐스트에서 어떤 이야기가 오가는지 찾아봅니다.

## 다음 단계 {#next-steps}

<Columns cols={2}>
  <Card title="실행에 attach하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서 `dataSources`, 가격, 전체 파트너 카탈로그를 다룹니다.
  </Card>

  <Card title="제공업체 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 다섯 개의 파트너를 attach하고, 각 파트너가 모두 호출되도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 익히기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행 생성, 진행 상황 스트리밍, output schema 설계, effort와 비용 제어 방법을 알아보세요.
  </Card>

  <Card title="API 키 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="키 생성하기" arrow="true">
    dashboard에서 키를 생성하면 이 페이지의 예제를 그대로 실행해 볼 수 있습니다. 신규 계정에는 무료 credits이 제공됩니다.
  </Card>
</Columns>