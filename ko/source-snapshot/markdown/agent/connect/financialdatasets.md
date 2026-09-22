> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Financial Datasets {#financial-datasets}

> 27,000개 이상의 미국 ticker에 대한 구조화된 금융 및 시장 데이터: 가격, 펀더멘털, 실적, SEC 공시 자료, 소유 현황, 종목 스크리닝.

[Financial Datasets](https://financialdatasets.ai)는 AI agent가 바로 활용할 수 있는
기업 및 시장 데이터를 제공합니다.
[Exa Connect](/ko/docs/agent/connect/overview)를 통해 agent는
실시간 및 과거 가격, 기업 정보, 재무제표와 밸류에이션 지표,
실적, insider 및 기관 소유 현황, SEC 공시 자료와 공시 섹션,
기업 뉴스를 조회하고, 펀더멘털 기준로 미국 시장을
스크리닝할 수 있습니다.

[Exa Agent](/ko/docs/agent/quickstart) 실행에 `financial_datasets`를 attach하면,
agent가 Exa web search와 함께 Financial Datasets를 조회합니다.

## 활용 사례 {#use-it-for}

* 구조화된 기업 리서치 스냅샷 구축
* 재무 성과, 밸류에이션, 과거 추이 분석
* SEC 공시 자료 열람 및 위험 요인, MD&amp;A 등 섹션 추출
* 내부자 거래 및 기관 소유 현황 분석
* 펀더멘털 기준에 따른 미국 시장 스크리닝
* 기업 뉴스 및 관련 동향 모니터링

## 사용 가능한 데이터 {#data-available}

다음 데이터셋은 모두 `financial_datasets` 제공업체에서 제공되며, agent가 작업에
맞는 것을 선택합니다:

| 데이터셋                    | 반환 내용                                                                |
| ----------------------- | -------------------------------------------------------------------- |
| Beneficial ownership    | Schedule 13D/13G에 보고된 5% 이상 실질 소유자(행동주의 지분 및 단순 투자 지분 포함).           |
| Company facts           | 기업명, 섹터, 산업, 거래소, 소재지, SEC CIK, SIC 분류.                              |
| 기업 뉴스            | 특정 ticker의 최근 뉴스 기사.                                                 |
| 실적                | 분기 매출과 EPS, 전년 동기 대비 변동률 및 예상치 상회/하회 여부.                             |
| Financial metrics       | 시가총액, EV, P/E, P/B, P/S, EV/EBITDA, PEG, 마진, ROE/ROA/ROIC, 성장률, EPS. |
| 재무제표    | SEC 공시 자료 기반 손익계산서, 재무상태표, 현금흐름표.                                    |
| Historical stock prices | 지정 기간의 OHLCV 데이터(일/주/월/연 단위).                                        |
| Index-fund holdings     | 비중별 ETF/인덱스 펀드 구성 종목, 또는 특정 증권을 보유한 펀드 목록.                           |
| Insider ownership       | SEC Form 3 및 5 기반 내부자 보유 현황(임원, 이사, 10% 이상 보유자의 보유 주식 수).            |
| Insider trades          | SEC Form 4 내부자 거래 내역(이름, 직위, 거래 유형, 주식 수, 금액).                       |
| Institutional ownership | 13F 기관 보유자, 보유 주식 수, 보고 금액.                                          |
| Interest rates          | 현재 및 과거 중앙은행 정책금리(Fed, ECB, BOJ 등).                                  |
| SEC filing items        | 특정 10-K/10-Q/8-K 항목의 추출 텍스트(예: 위험 요인, MD&amp;A).                     |
| SEC 공시 자료             | 공시 metadata와 EDGAR 바로가기 링크(양식 유형별 필터링 가능).                           |
| Segmented financials    | 제품, 사업 부문, 지역별로 구분된 매출, 영업이익 및 기타 항목.                                |
| Stock price snapshot    | 현재 실시간 가격, 일간 변동, quote 시각.                                          |
| Stock screener          | 기본 필터 criteria에 부합하는 기업.                                             |

## 제공업체 ID {#provider-id}

`dataSources`에 다음 값을 사용하세요:

```text theme={null}
financial_datasets
```

## 예시 {#example}

NVIDIA의 구조화된 기업 리서치 스냅샷을 만들어 보세요.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Analyze NVIDIA using its latest price, valuation metrics, most recent "
          "quarterly financial statements and earnings, institutional and insider "
          "activity, and material SEC filing sections. Return a structured "
          "company-research snapshot with reporting dates."
      ),
      data_sources=[{"provider": "financial_datasets"}],
      output_schema={
          "type": "object",
          "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
          "properties": {
              "ticker": {"type": "string"},
              "price": {
                  "type": "object",
                  "required": ["latest", "asOf"],
                  "properties": {
                      "latest": {"type": "number"},
                      "asOf": {"type": "string"},
                  },
              },
              "valuation": {
                  "type": "object",
                  "properties": {
                      "marketCap": {"type": "number"},
                      "peRatio": {"type": "number"},
                      "evToEbitda": {"type": "number"},
                  },
              },
              "financials": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "earnings": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "ownership": {
                  "type": "object",
                  "properties": {
                      "institutionalHighlights": {"type": "string"},
                      "insiderActivity": {"type": "string"},
                  },
              },
              "filings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": ["formType", "filedAt", "keySection"],
                      "properties": {
                          "formType": {"type": "string"},
                          "filedAt": {"type": "string"},
                          "keySection": {"type": "string"},
                      },
                  },
              },
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
    dataSources: [{ provider: "financial_datasets" }],
    outputSchema: {
      type: "object",
      required: ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
      properties: {
        ticker: { type: "string" },
        price: {
          type: "object",
          required: ["latest", "asOf"],
          properties: {
            latest: { type: "number" },
            asOf: { type: "string" },
          },
        },
        valuation: {
          type: "object",
          properties: {
            marketCap: { type: "number" },
            peRatio: { type: "number" },
            evToEbitda: { type: "number" },
          },
        },
        financials: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        earnings: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        ownership: {
          type: "object",
          properties: {
            institutionalHighlights: { type: "string" },
            insiderActivity: { type: "string" },
          },
        },
        filings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: ["formType", "filedAt", "keySection"],
            properties: {
              formType: { type: "string" },
              filedAt: { type: "string" },
              keySection: { type: "string" },
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
      "query": "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
      "dataSources": [{ "provider": "financial_datasets" }],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
        "properties": {
          "ticker": { "type": "string" },
          "price": {
            "type": "object",
            "required": ["latest", "asOf"],
            "properties": {
              "latest": { "type": "number" },
              "asOf": { "type": "string" }
            }
          },
          "valuation": {
            "type": "object",
            "properties": {
              "marketCap": { "type": "number" },
              "peRatio": { "type": "number" },
              "evToEbitda": { "type": "number" }
            }
          },
          "financials": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "earnings": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "ownership": {
            "type": "object",
            "properties": {
              "institutionalHighlights": { "type": "string" },
              "insiderActivity": { "type": "string" }
            }
          },
          "filings": {
            "type": "array",
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["formType", "filedAt", "keySection"],
              "properties": {
                "formType": { "type": "string" },
                "filedAt": { "type": "string" },
                "keySection": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## 함께 사용하면 좋은 데이터 제공업체 {#pairs-well-with}

* [Particle](/ko/docs/agent/connect/particle): 보도된 기사 내용을 팟캐스트 논평과 비교합니다.
* [Baselayer](/ko/docs/agent/connect/baselayer): ticker에 해당하는 실제 법인을 확인합니다.
* [Fiber.ai](/ko/docs/agent/connect/fiber): 상장 기업 정보를 비상장 시장의 동종 기업 및 경영진 연락처로 enrich합니다.

## 다음 단계 {#next-steps}

<Columns cols={2}>
  <Card title="실행에 attach하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서 `dataSources`, 가격, 전체 파트너 카탈로그를 확인할 수 있습니다.
  </Card>

  <Card title="제공업체 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 다섯 개의 파트너를 attach하고, 각 파트너가 호출되도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 익히기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행을 생성하고, 진행 상황을 스트리밍하고, output schema를 설계하고, effort와 비용을 제어해 보세요.
  </Card>

  <Card title="API 키 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="키 생성하기" arrow="true">
    dashboard에서 키를 생성하면 이 페이지의 예제를 그대로 실행해 볼 수 있습니다. 신규 계정에는 무료 credits이 제공됩니다.
  </Card>
</Columns>