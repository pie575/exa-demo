> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 본격적으로 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="financial-datasets">
  # Financial Datasets
</div>

> 27,000개 이상의 미국 ticker에 대한 구조화된 금융 및 시장 데이터: 가격, 재무 기초 지표, 실적, SEC filings, 지분 보유 현황, 주식 스크리닝.

[Financial Datasets](https://financialdatasets.ai)는 AI agents를 위한 기계 판독형
기업 및 시장 데이터를 제공합니다. [Exa Connect](/ko/docs/agent/connect/overview)를 통해
agent는 실시간 및 과거 가격, 기업 정보, 재무제표 및
가치 평가 지표, 실적, insider 및 institutional ownership, SEC filings와
filing 섹션, 기업 뉴스를 가져올 수 있고, 재무 기초 criteria로 미국 시장을
스크리닝할 수 있습니다.

[Exa Agent](/ko/docs/agent/quickstart) 실행에 `financial_datasets`를 attach하면
agent가 Exa web search와 함께 Financial Datasets를 조회합니다.

<div id="use-it-for">
  ## 활용 사례
</div>

* 구조화된 기업 리서치 스냅샷 구축
* 재무 성과, 밸류에이션, 과거 추세 분석
* SEC filings를 읽고 위험 요소, MD&amp;A 등의 섹션 추출
* insider 거래 및 institutional ownership 조사
* fundamental criteria 기반 미국 시장 스크리닝
* 기업 뉴스 및 주요 동향 모니터링

<div id="data-available">
  ## 사용 가능한 데이터
</div>

다음 데이터셋은 모두 `financial_datasets` provider에서 제공되며,
agent가 작업에 맞는 데이터셋을 선택합니다:

| 데이터셋                    | 반환 내용                                                                |
| ----------------------- | -------------------------------------------------------------------- |
| 실질 소유권                  | Schedule 13D/13G에 보고된 5% 이상 실질 소유자(행동주의 지분 및 수동적 지분 포함).             |
| 기업 정보                   | 회사명, 섹터, 산업, 거래소, 소재지, SEC CIK, SIC 분류.                              |
| 기업 뉴스                   | 특정 ticker의 최신 뉴스 기사.                                                 |
| 실적                      | 분기별 매출과 EPS, 전년 동기 대비 변동 및 예상치 상회/하회 서프라이즈.                          |
| 재무 지표                   | 시가총액, EV, P/E, P/B, P/S, EV/EBITDA, PEG, 마진, ROE/ROA/ROIC, 성장률, EPS. |
| 재무제표                    | SEC filings에서 추출한 손익계산서, 재무상태표, 현금흐름표.                               |
| 과거 주가                   | 일/주/월/년 단위의 기간별 OHLCV 봉 데이터.                                         |
| 인덱스 펀드 보유 종목            | 비중별 ETF/인덱스 펀드 구성 종목, 또는 특정 증권을 보유한 펀드 목록.                           |
| insider 소유 현황           | SEC Form 3 및 5 기준 insider 보유 현황(임원, 이사, 10% 이상 소유자의 보유 주식 수).        |
| insider 거래              | SEC Form 4 insider 거래 내역(이름, 직위, 거래 유형, 주식 수, 금액).                   |
| institutional ownership | 13F 기관 보유자, 보유 주식 수, 보고된 평가액.                                        |
| 금리                      | 중앙은행의 현재 및 과거 정책금리(Fed, ECB, BOJ 등).                                 |
| SEC filing 항목           | 10-K/10-Q/8-K의 특정 항목(예: 위험 요인, MD&amp;A) 추출 텍스트.                     |
| SEC filings             | filing 메타데이터와 EDGAR 직접 링크, 필요 시 서식 유형으로 필터링 가능.                      |
| 부문별 재무 정보               | 제품별, 사업 부문별, 지역별로 구분된 매출, 영업이익 및 기타 항목.                              |
| 주가 스냅샷                  | 현재 실시간 가격, 당일 변동, quote 시각.                                          |
| 종목 스크리너                 | 펀더멘털 필터 criteria에 부합하는 기업.                                           |

<div id="provider-id">
  ## Provider ID
</div>

`dataSources`에 다음 값을 사용하세요:

```text theme={null}
financial_datasets
```

<div id="example">
  ## 예시
</div>

NVIDIA에 대한 구조화된 기업 리서치 스냅샷을 만들어 보세요.

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

<div id="pairs-well-with">
  ## 함께 사용하면 좋은 도구
</div>

* [Particle](/ko/docs/agent/connect/particle): 보도된 기사 내용을 팟캐스트 논평과 비교합니다.
* [Baselayer](/ko/docs/agent/connect/baselayer): ticker에 해당하는 실제 법인을 확인합니다.
* [Fiber.ai](/ko/docs/agent/connect/fiber): 상장 기업 정보에 비상장 시장의 동종 기업과 경영진 연락처를 더해 enrich합니다.

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="실행에 attach하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서 `dataSources`, 가격, 전체 partner 카탈로그를 다룹니다.
  </Card>

  <Card title="provider 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 5개의 partner를 attach하고, 각 partner가 모두 동작하도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 익히기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행을 생성하고, 진행 상황을 스트리밍하고, output schema를 설계하고, effort와 cost를 제어해 보세요.
  </Card>

  <Card title="API key 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="key 생성하기" arrow="true">
    Dashboard에서 key를 생성한 뒤 이 페이지의 예제를 그대로 실행해 보세요. 신규 계정에는 무료 credits이 제공됩니다.
  </Card>
</Columns>