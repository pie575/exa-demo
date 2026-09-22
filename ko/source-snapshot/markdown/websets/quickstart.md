> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="websets">
  # Websets
</div>

> 웹에서 검증되고 enrich된 데이터셋을 구축하세요.

<div id="what-are-websets">
  ## Websets란?
</div>

Webset은 자연어 query와 목표 item 개수로 시작합니다. 모든 result가 충족해야 할 criteria와, 승인된 각 item에 채울 enrichment field를 추가하세요. 결과는 dashboard, API 또는 웹훅을 통해 비동기적으로 전달됩니다.

코드 없이 [Dashboard](/ko/docs/websets/dashboard/get-started)에서 시각적으로 webset을 만들 수도
있습니다.

<Info>
  리스트 빌딩이나 enrichment 워크플로우를 새로 시작하시나요? [Exa Agent](/ko/docs/agent/quickstart)를 사용하세요.
  이 가이드는 기존 Websets 연동을 유지하거나 확장할 때 참고하세요.
  Websets API를 사용하려면 유료 Websets plan이 필요하며, Search API credits와 Websets credits는 별개입니다.
</Info>

<div id="how-it-works">
  ## 작동 방식
</div>

1. **search 정의:** 자연어 질의와 결과 개수를 지정하고, 필요하면 verification criteria와 enrichment를 함께 설정합니다.
2. **검색 및 verification:** Websets가 후보를 찾아 각 후보를 criteria와 대조해 검증합니다. 조건에 맞는 결과만 item이 됩니다.
3. **enrichment 실행:** verification을 통과한 각 item에 대해 Websets가 CEO 이름, 투자 금액, 연락처 정보 등 요청한 추가 데이터를 검색합니다.
4. **결과 수신:** 상태를 폴링하거나, 웹훅으로 업데이트를 받거나, item이 추가되는 대로 dashboard에서 확인하세요.

<div id="key-capabilities">
  ## 주요 기능
</div>

| 기능                        | 설명                                                     |
| ------------------------- | ------------------------------------------------------ |
| **Criteria verification** | 직접 정의한 규칙에 따라 각 result를 검증하므로 관련성 있는 일치 항목만 확보할 수 있습니다 |
| **Enrichments**           | 모든 result에서 특정 데이터 항목(텍스트, 숫자, 날짜, 불리언)을 추출합니다         |
| **Monitors**              | 반복 search 일정을 설정해 webset을 자동으로 최신 상태로 유지합니다            |
| **웹훅**                  | item이 추가되거나 enrich될 때 실시간 HTTP 콜백을 받습니다                |
| **Imports**               | 보유한 URL을 직접 가져와 enrichment를 실행합니다                      |

<div id="human-quickstart">
  ## Human Quickstart
</div>

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

SDK를 설치하세요:

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

그런 다음 첫 요청을 보내보세요:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa
  from exa_py.websets.types import CreateWebsetParameters, CreateEnrichmentParameters
  import os

  exa = Exa(api_key=os.getenv("EXA_API_KEY"))

  webset = exa.websets.create(
      params=CreateWebsetParameters(
          search={
              "query": "Top AI research labs focusing on large language models",
              "count": 5
          },
          enrichments=[
              CreateEnrichmentParameters(
                  description="LinkedIn profile of VP of Engineering or related role",
                  format="text",
              ),
          ],
      )
  )

  print(f"Webset created with ID: {webset.id}")
  print(f"View your Webset at: {webset.dashboard_url}")

  # Webset 처리가 완료될 때까지 대기
  webset = exa.websets.wait_until_idle(webset.id)

  # Webset Items 조회
  items = exa.websets.items.list(webset_id=webset.id)
  for item in items.data:
      print(f"Item: {item.model_dump_json(indent=2)}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa(process.env.EXA_API_KEY);

  const webset = await exa.websets.create({
    search: {
      query: "Top AI research labs focusing on large language models",
      count: 10
    },
    enrichments: [
      { description: "Estimate the company's founding year", format: "number" }
    ],
  });

  console.log(`Webset created with ID: ${webset.id}`);
  console.log(`View your Webset at: ${webset.dashboardUrl}`);

  const idleWebset = await exa.websets.waitUntilIdle(webset.id, {
    timeout: 60000,
    pollInterval: 2000,
    onPoll: (status) => console.log(`Current status: ${status}...`)
  });

  const items = await exa.websets.items.list(webset.id, { limit: 10 });
  for (const item of items.data) {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/" \
    -H "accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer ${EXA_API_KEY}" \
    -d '{
      "search": {
        "query": "Top AI research labs focusing on large language models",
        "count": 5
      },
      "enrichments": [
        {"description": "Find the company'\''s founding year", "format": "number"}
      ]
    }'
  ```
</CodeGroup>

<Note>
  제품별 지원 여부는 [Zero Data Retention](/ko/docs/admin/security/zero-data-retention)을 참고하세요.
</Note>

<div id="next">
  ## 다음 단계
</div>

* [**Dashboard 가이드**](./dashboard/get-started) - dashboard에서 Websets를 사용하는 단계별 가이드
* [**작동 방식**](./api/how-it-works) - 이벤트 기반 아키텍처 심층 분석
* [**Websets API reference**](./api/websets/create-a-webset) - 모든 엔드포인트에 대한 전체 API reference