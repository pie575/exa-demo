> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="tempo-mpp-gtm-enrichment-cookbook">
  # Tempo MPP GTM Enrichment 쿡북
</div>

> Tempo MPP로 Exa의 search 및 contents 요청마다 건당 비용을 지불하는 GTM enrichment 워크플로우를 구축하세요 — API key가 필요하지 않습니다.

이 쿡북을 활용해 Exa의 `/search` 및 `/contents` endpoint를 기반으로 GTM enrichment agent나 파이프라인을 구축하고, Machine Payments Protocol(MPP)을 통해 요청 단위로 비용을 지불해 보세요. MPP는 여러 결제 수단을 지원하며, 여기의 예제에서는 [Tempo](https://tempo.xyz)의 스테이블코인을 사용합니다. 월 구독료도, API key도, 좌석 기반 요금제도 없습니다. wallet에 USDC.e를 충전한 뒤 리드나 기업을 enrich하는 만큼만 지불하면 됩니다.

<Info>
  MPP는 현재 Exa의 `/search` 및 `/contents` endpoint에서만 지원됩니다.
  Agent API(`/agent/runs`)와 `/answer`는 Exa API key가 필요하며 표준 API key billing 절차를 따릅니다.
</Info>

<div id="what-youll-build">
  ## 무엇을 만드나요
</div>

회사 이름 목록이나 타깃 설명을 입력받아 동작하는 경량 enrichment 파이프라인입니다:

1. Exa `/search`에 `type: "deep"`과 `outputSchema`를 사용해 공식 회사 페이지를 찾고 핵심 메타데이터를 추출합니다.
2. 반환된 결과에 `contents.highlights`를 사용해 투자 유치, 본사, 임직원 수, 제품에 대한 출처 스니펫을 가져옵니다.
3. 입력 항목마다 CSV 또는 JSON 형식의 enrichment 레코드를 생성합니다.

이 패턴은 리드 목록 enrichment, 계정 리서치, 아웃바운드 개인화에 활용할 수 있습니다. 개별적인 `/search` + `/contents` 호출로 구성되어 있으므로 모든 단계를 MPP로 결제할 수 있습니다.

<div id="prerequisites">
  ## 사전 준비 사항
</div>

* Tempo mainnet에서 **USDC.e**가 입금된 Tempo 호환 wallet.
* 런타임에 wallet private key를 안전하게 불러올 수 있는 방법(아래 참고, key를 커밋하거나 소스 코드에 노출하지 마세요).
* `mppx`(TypeScript) 또는 `pympp`(Python) 설치.

<Info>
  raw private key 없이 명령줄에서 설정하려면 [Tempo Wallet CLI](/ko/docs/integrations/payments/mpp/quickstart#pay-from-the-command-line)를 사용하세요. `tempo wallet login`을 실행하면 wallet이 생성되거나 연결되며, 신규 가입자에게는 무료 MPP Credits가 제공될 수 있습니다.
</Info>

<div id="mpp-setup">
  ## MPP 설정
</div>

<div id="install-the-client">
  ### 클라이언트 설치
</div>

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

<div id="load-your-private-key-safely">
  ### private key를 안전하게 불러오기
</div>

private key를 절대 하드코딩하지 마세요. 아래 예제는 런타임 환경에서 `WALLET_PRIVATE_KEY`를 읽어오며, 로컬 개발 환경에서만 사용해야 합니다. 프로덕션에서는 1Password, AWS Secrets Manager, HashiCorp Vault 같은 시크릿 매니저에서 불러오세요.

<CodeGroup>
  ```bash TypeScript theme={null}
  # 셸 또는 CI secrets 저장소에 설정하세요. 이 값은 절대 커밋하지 마세요
  export WALLET_PRIVATE_KEY="0x..."
  ```

  ```bash Python theme={null}
  # 셸 또는 CI secrets 저장소에 설정하세요. 이 값은 절대 커밋하지 마세요
  export WALLET_PRIVATE_KEY="0x..."
  ```
</CodeGroup>

<div id="make-a-paid-search-request">
  ### 유료 search 요청 보내기
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  // 운영 환경에서는 시크릿 매니저에서 불러오세요 — 원본 값을 절대 커밋하지 마세요.
  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      numResults: 5,
      contents: { highlights: true },
    }),
  });

  const data = (await response.json()) as { results: { title: string; url: string }[] };
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      # 운영 환경에서는 시크릿 매니저에서 불러오세요 — 원본 값을 절대 커밋하지 마세요.
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": "Series A fintech companies with 50-200 employees",
                  "numResults": 5,
                  "contents": {"highlights": True},
              },
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

요청이 성공하면 Exa 결과와 함께 온체인 트랜잭션 해시가 담긴 `Payment-Receipt` header가
반환됩니다.

<div id="make-a-paid-contents-request">
  ### 유료 contents 요청 보내기
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  const contentsResponse = await mppx.fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: ["https://www.example.com"],
      text: true,
      summary: true,
    }),
  });

  const contentsData = (await contentsResponse.json()) as {
    results: { url: string; text?: string; summary?: string }[];
  };
  console.log(contentsData.results[0]);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/contents",
      json={
          "urls": ["https://www.example.com"],
          "text": True,
          "summary": True,
      },
  )
  print(response.json()["results"][0])
  ```
</CodeGroup>

<div id="gtm-enrichment-recipe">
  ## GTM Enrichment 레시피
</div>

<div id="enrich-a-list-of-companies">
  ### 회사 목록 enrich하기
</div>

회사 이름 목록이 주어지면 각 회사의 페이지를 search해 구조화된 세부 정보를
추출합니다.

<CodeGroup>
  ```typescript TypeScript theme={null}
  interface CompanyEnrichment {
    name: string;
    url: string;
    title: string;
    industry?: string;
    headquarters?: string;
    funding?: string;
    summary?: string;
    highlights: string[];
  }

  async function enrichCompanies(names: string[]): Promise<CompanyEnrichment[]> {
    const enriched: CompanyEnrichment[] = [];

    for (const name of names) {
      const response = await mppx.fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `${name} official company`,
          type: "deep",
          numResults: 1,
          contents: {
            highlights: { query: "funding, headquarters, employees, product" },
          },
          outputSchema: {
            type: "object",
            properties: {
              company: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  industry: { type: "string" },
                  headquarters: { type: "string" },
                  funding: { type: "string" },
                  summary: { type: "string" },
                },
                required: ["name", "url"],
              },
            },
            required: ["company"],
          },
        }),
      });

      const data = (await response.json()) as {
        output?: { company?: CompanyEnrichment & { summary?: string } };
        results?: { highlights?: string[] }[];
      };
      const company = data.output?.company;
      const highlights = data.results?.[0]?.highlights?.slice(0, 3) ?? [];
      if (!company) continue;

      enriched.push({
        ...company,
        title: company.name,
        highlights,
      });
    }

    return enriched;
  }
  ```

  ```python Python theme={null}
  async def enrich_companies(names):
      enriched = []
      for name in names:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": f"{name} official company",
                  "type": "deep",
                  "numResults": 1,
                  "contents": {
                      "highlights": {"query": "funding, headquarters, employees, product"}
                  },
                  "outputSchema": {
                      "type": "object",
                      "properties": {
                          "company": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "url": {"type": "string"},
                                  "industry": {"type": "string"},
                                  "headquarters": {"type": "string"},
                                  "funding": {"type": "string"},
                                  "summary": {"type": "string"},
                              },
                              "required": ["name", "url"],
                          }
                      },
                      "required": ["company"],
                  },
              },
          )
          data = response.json()
          company = data.get("output", {}).get("company")
          highlights = []
          if data.get("results"):
              highlights = data["results"][0].get("highlights", [])[:3]
          if not company:
              continue

          enriched.append({
              "name": company["name"],
              "url": company["url"],
              "title": company["name"],
              "industry": company.get("industry"),
              "headquarters": company.get("headquarters"),
              "funding": company.get("funding"),
              "summary": company.get("summary"),
              "highlights": highlights,
          })
      return enriched
  ```
</CodeGroup>

<div id="enrich-a-person-profile">
  ### 인물 프로필 enrich하기
</div>

이 레시피는 `type: "deep"`, `contents.highlights`, `outputSchema`를 사용해
인물을 조사하고 구조화된 프로필을 반환합니다.

<CodeGroup>
  ```typescript TypeScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Exa Labs founders contact and background",
      type: "deep",
      numResults: 5,
      contents: {
        highlights: { query: "email, title, education, work history, LinkedIn" },
      },
      outputSchema: {
        type: "object",
        properties: {
          people: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                title: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                linkedInUrl: { type: "string" },
                summary: { type: "string" },
              },
              required: ["name"],
            },
          },
        },
        required: ["people"],
      },
    }),
  });

  const data = (await response.json()) as {
    output?: { people: { name: string; title?: string; company?: string }[] };
  };
  console.log(data.output?.people);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Exa Labs founders contact and background",
          "type": "deep",
          "numResults": 5,
          "contents": {
              "highlights": {"query": "email, title, education, work history, LinkedIn"}
          },
          "outputSchema": {
              "type": "object",
              "properties": {
                  "people": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "title": {"type": "string"},
                              "company": {"type": "string"},
                              "email": {"type": "string"},
                              "linkedInUrl": {"type": "string"},
                              "summary": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["people"],
          },
      },
  )

  print(response.json().get("output", {}).get("people"))
  ```
</CodeGroup>

<Note>
  여기서는 더 풍부한 추론을 얻기 위해 `type: "deep"`을, 응답 형태를 지정하기 위해
  `outputSchema`를 사용합니다. deep search는 요청당 $0.012이며,
  `contents.highlights`는 결과당 $0.001이 추가됩니다.
</Note>

<div id="structured-output">
  ### 구조화된 출력
</div>

원시 텍스트 대신 JSON 필드를 받고 싶다면 search 요청에 `outputSchema`를 사용하세요.
Exa는 지정한 schema 형태에 맞춘 `output` 객체를 반환합니다.

<CodeGroup>
  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Series A fintech companies with 50-200 employees",
          "type": "deep-lite",
          "numResults": 5,
          "outputSchema": {
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "headcount": {"type": "string"},
                              "headquarters": {"type": "string"},
                              "fundingStage": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["companies"],
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      type: "deep-lite",
      numResults: 5,
      outputSchema: {
        type: "object",
        properties: {
          companies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                headcount: { type: "string" },
                headquarters: { type: "string" },
                fundingStage: { type: "string" }
              },
              required: ["name"]
            }
          }
        },
        required: ["companies"]
      }
    })
  });
  ```
</CodeGroup>

<Note>
  `outputSchema`는 `deep-lite` 또는 `deep` search type과 함께 쓸 때 가장 효과적입니다. Exa 측에서
  LLM call이 추가로 발생하므로 요금은 `deep-lite`/`deep` 기준으로 부과됩니다.
</Note>

<div id="pricing-and-limits">
  ## 가격 및 limits
</div>

MPP는 API key billing과 동일한 요청당 가격 정책을 사용합니다. MPP search 요청는
결과가 최대 10개로 제한됩니다.

| 작업                                           | 가격          |
| -------------------------------------------- | ----------- |
| `type`이 `instant`, `auto`, `fast`인 `/search` | 요청당 $0.007  |
| `type`이 `deep-lite` 또는 `deep`인 `/search`     | 요청당 $0.012  |
| `type`이 `deep-reasoning`인 `/search`          | 요청당 $0.015  |
| `contents.text`                              | URL당 $0.001 |
| `contents.highlights`                        | URL당 $0.001 |
| `contents.summary`                           | 결과당 $0.001  |

rate limits, 네트워크 세부 정보, payment header 등 전체 레퍼런스는 [Pay with MPP (Tempo)](/ko/docs/integrations/payments/mpp/quickstart)를 참고하세요.

<div id="production-tips">
  ## 프로덕션 팁
</div>

* **wallet에는 USDC.e만 충전하세요.** Exa가 Tempo 네트워크 수수료를 부담하므로
  wallet에 별도의 가스 토큰을 보유할 필요가 없습니다.
* **`402` 응답을 처리하세요.** MPP SDK는 자동으로 재시도하지만, 직접 구현한
  클라이언트라면 `WWW-Authenticate: Payment` challenge를 사용해 `402`에 대해 재시도해야 합니다.
* **`/contents` 결과를 캐싱하세요.** contents는 URL 단위로 과금됩니다. 동일한 회사 페이지에
  두 번 비용을 지불하지 않도록 URL 기준으로 캐싱하세요.
* **결과 10개 제한에 유의하세요.** MPP search는 `numResults`를 최대 10으로 제한합니다.
* **private key는 절대 커밋하지 마세요.** `WALLET_PRIVATE_KEY`는 소스 관리 저장소가 아니라
  시크릿 매니저에서 불러오세요.

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Exa Agent API에서 MPP를 사용할 수 있나요?">
    아니요. Exa 코드베이스에서 MPP는 `/search`와 `/contents`에만 연결되어 있습니다.
    `/agent/runs`와 `/answer`는 Exa API key가 필요하며 표준 API key
    billing을 따릅니다.
  </Accordion>

  <Accordion title="한 요청에서 MPP와 Exa API key를 함께 쓸 수 있나요?">
    아니요. 요청에 `x-api-key` 또는 `Authorization: Bearer`가 포함되면 API
    key 방식이 우선 적용되고 MPP는 무시됩니다.
  </Accordion>

  <Accordion title="MPP settlement가 실패하면 어떻게 되나요?">
    Exa는 새로운 `WWW-Authenticate: Payment` challenge와 함께 `402`를 반환하며 결과는
    제공하지 않습니다. 클라이언트에서 새 payment로 재시도할 수 있습니다. settlement가 성공하기 전까지는
    결과가 반환되지 않습니다.
  </Accordion>

  <Accordion title="환경마다 별도의 Tempo wallet이 필요한가요?">
    동일한 wallet을 재사용해도 되지만, 개발용과 프로덕션용 wallet을 분리하는 것을 권장합니다.
    wallet당 QPS는 해당 wallet에서 보내는 모든 요청을 합쳐 초당 10건입니다.
  </Accordion>
</AccordionGroup>

<div id="next-steps">
  ## 다음 단계
</div>

* [MPP(Tempo)로 결제하기](/ko/docs/integrations/payments/mpp/quickstart): MPP 전체 레퍼런스
* [Exa Search API 가이드](/ko/docs/search/quickstart): search 파라미터 레퍼런스
* [Exa Contents API 가이드](/ko/docs/contents/quickstart): contents 파라미터 레퍼런스
* [Tempo MPP 문서](https://mpp.dev/protocol): 프로토콜 및 SDK 세부 정보