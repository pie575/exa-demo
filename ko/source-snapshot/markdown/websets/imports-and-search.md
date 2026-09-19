> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="how-to-use-imports">
  # Imports 사용 방법
</div>

> Websets로 URL을 가져오는 단계별 가이드 -- 목록을 보강하고, criteria에 따라 점수를 매기고, 새로운 일치 항목을 찾아내고, 이 세 가지를 모두 결합하는 방법을 다룹니다.

이미 URL 목록(회사, 인물, 제품 등)이 있다면 이를 Webset으로 **import**할 수 있습니다. Webset을 어떻게 설정하느냐에 따라 가져온 item을 보강하거나, criteria에 따라 평가하거나, Web Discovery 결과와 결합할 수 있습니다.

이 가이드에서는 복사해서 바로 붙여넣을 수 있는 API 호출 예시와 함께 모든 configuration을 살펴봅니다. `$EXA_API_KEY`만 본인의 API key로 바꿔 주면 됩니다.

<div id="our-example-5-it-consulting-suppliers">
  ## 예시: IT 컨설팅 공급업체 5곳
</div>

이 가이드 전반에서 동일한 5개 기업 목록을 import로 사용합니다:

| 기업           | URL                              | 비고                          |
| ------------ | -------------------------------- | --------------------------- |
| Accenture    | `https://www.accenture.com`      | 글로벌 IT 컨설팅, 미국 본사           |
| Infosys      | `https://www.infosys.com`        | IT 서비스, 미국 내 사업 규모 큼        |
| Wipro        | `https://www.wipro.com`          | IT 서비스, 미국에 사무소 보유          |
| EPAM Systems | `https://www.epam.com`           | 소프트웨어 엔지니어링, 미국 상장          |
| Persol Group | `https://www.persol-group.co.jp` | 인력 파견 기업, 일본 중심, 미국 내 입지 미미 |

이 목록을 고른 이유는 5곳 중 4곳이 일반적인 IT 컨설팅 criteria(미국 사무소, IT 서비스)에 명확히 부합하기 때문입니다. **Persol Group**만 예외인데, 미국 내 입지가 거의 없는 일본 인력 파견 기업이라 미국 중심 criteria는 충족하지 못해야 합니다.

아래 예시에서 사용할 criteria는 다음과 같습니다:

1. &quot;해당 기업은 미국에 사무소를 두고 있다&quot;
2. &quot;해당 기업은 IT 컨설팅 또는 인력 증원 서비스를 제공한다&quot;

***

<div id="config-1-import-only-enrich-without-filtering">
  ## 구성 1: Import Only -- 필터링 없이 enrich하기
</div>

<Note>
  **실제 예시:** [dashboard에서 이 webset 보기](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**사용 시점:** URL 목록이 있고 이를 enrich하기만 하면 될 때 사용합니다. 점수 산정도 필터링도 없이 모든 item이 그대로 유지됩니다.

<div id="api-calls">
  ### API 호출
</div>

```bash theme={null}
# 1단계: 공급업체 URL로 CSV import 생성
curl -s -X POST "https://api.exa.ai/websets/v0/imports" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "count": 5,
    "size": 128,
    "entity": { "type": "company" },
    "title": "IT Consulting Suppliers"
  }'
# 응답에는 `uploadUrl`과 import `id`가 포함됩니다

# 2단계: 1단계에서 받은 사전 서명된 URL에 CSV 업로드
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv의 내용: url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# 3단계: 이 import를 사용하는 Webset 생성 (enrichment만, search/criteria 없음)
# Webset을 생성하면 해당 import의 처리 작업이 자동으로 예약됩니다.
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "import": [
      { "source": "import", "id": "<IMPORT_ID>" }
    ],
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }'
```

<div id="what-we-see-in-the-live-webset">
  ### 실제 Webset에서 확인되는 결과
</div>

**5개 item**이 모두 Webset에 표시됩니다. criteria가 없으므로 필터링은 일어나지 않습니다.

| 공급업체         | Webset 포함 여부 | Source   | 평가 수 | Enrichment 수 | 이유                          |
| ------------ | ------------ | -------- | ---- | ------------ | --------------------------- |
| Accenture    | **예**        | `import` | 0    | 2            | import된 항목, 평가할 criteria 없음 |
| Infosys      | **예**        | `import` | 0    | 2            | import된 항목, 평가할 criteria 없음 |
| Wipro        | **예**        | `import` | 0    | 2            | import된 항목, 평가할 criteria 없음 |
| EPAM Systems | **예**        | `import` | 0    | 2            | import된 항목, 평가할 criteria 없음 |
| Persol Group | **예**        | `import` | 0    | 2            | import된 항목, 평가할 criteria 없음 |

모든 item의 값은 `source: "import"`, `evaluations: []`입니다. 이 config에는 criteria가 없으므로, 특정 criteria를 통과할지 여부와 관계없이 5개 모두 유지되고 enrich됩니다.

<Note>
  Persol Group의 URL(`persol-group.co.jp`)은 엔티티 데이터에서 &quot;PERSOL Vietnam Japan Desk&quot;로 확인되었습니다. 지역 자회사 페이지로 연결되었을 뿐, 시스템은 그대로 import하고 enrich합니다.
</Note>

***

<div id="config-2-search-only-web-discovery">
  ## 구성 2: search만 사용 -- Web Discovery
</div>

<Note>
  **실제 예시:** [dashboard에서 이 webset 보기](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**사용 시점:** 목록이 없고, criteria에 부합하는 새로운 기업을 웹에서 찾고자 할 때.

<div id="api-call">
  ### API 호출
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-2">
  ### 실제 Webset에서 확인되는 결과
</div>

시스템이 웹을 검색해 두 criteria를 모두 통과하는 **35개 기업**을 찾았습니다. 모든 item은 `source: "search"`이며, 왜 일치했는지 설명하는 전체 평가 결과가 함께 제공됩니다.

| 우리의 5개 공급업체    | Webset에 포함? | 이유                                          |
| -------------- | ----------- | ------------------------------------------- |
| Accenture      | **예**       | web search가 자체적으로 Accenture를 조건에 맞는 기업으로 발견 |
| Infosys        | **아니오**     | 이번 web search에서는 발견되지 않음                    |
| Wipro          | **아니오**     | 이번 web search에서는 발견되지 않음                    |
| EPAM Systems   | **아니오**     | 이번 web search에서는 발견되지 않음                    |
| Persol Group   | **아니오**     | 이번 web search에서는 발견되지 않음                    |
| *(그 외 34개 기업)* | **예**       | web search로 발견되어 두 criteria를 모두 통과          |

이번 web search는 35개 결과 중에 Accenture를 우연히 찾아냈지만, 나머지 4개 공급업체는 발견하지 못했습니다. 이는 예상된 동작입니다. search만 사용하는 webset은 미리 정해진 목록이 아니라 웹 크롤링이 찾아낸 결과만 반환하기 때문입니다. 그 밖에 발견된 기업으로는 Artech, TurnKey Staffing, DataArt, Insight Global 등이 있습니다.

***

<div id="config-3-scoped-search-score-your-list-against-criteria">
  ## 구성 3: Scoped Search — 내 목록을 criteria로 평가하기
</div>

<Note>
  **실제 예시:** [dashboard에서 이 webset 보기](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**사용 시점:** 공급업체 목록이 있고 **각 항목을 criteria에 따라 평가**하려는 경우입니다. 기준을 통과한 항목만 반환됩니다. &quot;내 목록에 점수 매기기&quot; 사용 사례에 해당합니다.

<div id="api-calls-2">
  ### API 호출
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Config 1에서 설명한 대로 CSV import를 생성하고 업로드한 뒤, 여기에 해당 ID를 사용하세요.
  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  // Config 1에서 설명한 대로 CSV import를 생성하고 업로드한 뒤, 여기에 해당 ID를 사용하세요.
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        scope: [
          { source: "import", id: "<IMPORT_ID>" }
        ]
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  # 1단계: CSV import를 생성하고 업로드합니다 (Config 1의 1~2단계와 동일)
  # ... (전체 import 과정은 Config 1 참고)
  # <IMPORT_ID>를 응답으로 받게 됩니다

  # 2단계: scoped search로 Webset을 생성합니다 -- 가져온 각 URL을 criteria에 따라 평가합니다
  # Webset이 생성되면 import는 자동으로 처리 대상으로 예약됩니다.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-3">
  ### 실제 Webset에서 확인되는 결과
</div>

해당 webset에는 **item 4개**가 있습니다. 5개 공급업체 각각이 criteria에 따라 평가되었고, 두 criteria를 모두 통과한 항목만 표시됩니다.

| 공급업체         | Webset에 포함?    | Source   | 평가 결과 있음? | 이유                                         |
| ------------ | -------------- | -------- | --------- | ------------------------------------------ |
| Accenture    | **예**          | `search` | 예 (2)     | 통과: 미국 사무소 보유, IT 컨설팅 제공                   |
| Infosys      | **예**          | `search` | 예 (2)     | 통과: 미국 사무소 보유, IT 서비스 제공                   |
| Wipro        | **예**          | `search` | 예 (2)     | 통과: 미국 사무소 보유, IT 서비스 제공                   |
| EPAM Systems | **예**          | `search` | 예 (2)     | 통과: 미국 상장, 소프트웨어 엔지니어링 서비스 제공              |
| Persol Group | **아니요 -- 제외됨** | --       | --        | &quot;미국에 사무소가 있음&quot; 조건 미충족 -- 주로 일본 중심 |

공급업체 5개를 import했지만 결과에는 4개만 나타납니다. **Persol Group은 평가를 거쳤지만 통과하지 못해** 필터링되었습니다. 표시되는 모든 item은 `source: "search"`를 가지며, 각 criterion에 대한 판단 근거가 담긴 전체 `evaluations`를 포함합니다.

<Warning>
  criteria를 통과하지 못한 item은 **결과에서 제외됩니다**. 모든 item을 유지한 채 어떤 항목이 통과하고 탈락했는지만 확인하려면, Config 3과 함께 별도의 webset으로 Config 1(import only, 필터링 없음)을 사용하세요.
</Warning>

***

<div id="config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches">
  ## 구성 4: Scoped Search + Web Discovery -- 보유 목록 점수 매기기와 신규 매칭 항목 발굴을 한 번에
</div>

<Note>
  **실제 예시:** [dashboard에서 이 webset 보기](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**사용 시점:** 보유한 공급업체 목록을 criteria에 따라 점수화하는 동시에, 동일한 criteria에 부합하는 기업을 웹에서 추가로 찾고 싶을 때 사용합니다. 이 과정은 두 단계로 진행됩니다. 먼저 scoped search로 webset을 생성한 다음, 같은 webset에 일반 web search를 추가합니다.

<div id="api-calls-3">
  ### API 호출
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Config 1에서 설명한 대로 CSV import를 생성해 업로드한 뒤, 그 ID를 여기에 사용하세요.
  headers = {"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"}
  webset_response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers=headers,
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  webset_response.raise_for_status()
  webset_id = webset_response.json()["id"]

  search_response = requests.post(
      f"https://api.exa.ai/websets/v0/websets/{webset_id}/searches",
      headers=headers,
      json={
          "query": "IT consulting and staff augmentation companies",
          "entity": {"type": "company"},
          "criteria": [
              {"description": "The company has an office in the United States"},
              {
                  "description": "The company provides IT consulting or staff augmentation services"
              },
          ],
          "count": 25,
          "behavior": "append",
      },
  )
  search_response.raise_for_status()
  ```

  ```javascript JavaScript theme={null}
  // Config 1에서 설명한 대로 CSV import를 생성해 업로드한 뒤, 그 ID를 여기에 사용하세요.
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXA_API_KEY}`
  };
  const websetResponse = await fetch(
    "https://api.exa.ai/websets/v0/websets",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        search: {
          query: "IT consulting and staff augmentation companies",
          entity: { type: "company" },
          criteria: [
            { description: "The company has an office in the United States" },
            {
              description: "The company provides IT consulting or staff augmentation services"
            }
          ],
          count: 25,
          scope: [
            { source: "import", id: "<IMPORT_ID>" }
          ]
        },
        enrichments: [
          {
            description: "What services does this company provide?",
            format: "text"
          },
          { description: "Number of employees", format: "number" }
        ]
      })
    }
  );

  if (!websetResponse.ok) {
    throw new Error(`Webset creation failed: ${websetResponse.status}`);
  }
  const webset = await websetResponse.json();

  const searchResponse = await fetch(
    `https://api.exa.ai/websets/v0/websets/${webset.id}/searches`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        behavior: "append"
      })
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Search creation failed: ${searchResponse.status}`);
  }
  ```

  ```bash cURL theme={null}
  # 1단계: CSV import를 생성하고 업로드합니다 (Config 1의 1~2단계와 동일)
  # ... (전체 import 흐름은 Config 1 참고)
  # 응답으로 <IMPORT_ID>를 받습니다

  # 2단계: scoped search를 포함한 Webset 생성 -- import된 각 URL을 criteria에 따라 평가합니다
  # Webset이 생성되면 해당 import는 자동으로 처리 대기열에 등록됩니다.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  # 응답에 webset `id`가 포함됩니다 -- <WEBSET_ID>로 저장해 두세요

  # 3단계: scoped search가 완료되면 web search를 추가해 새로운 일치 항목을 찾습니다
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/<WEBSET_ID>/searches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25,
      "behavior": "append"
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-4">
  ### 라이브 Webset에서 확인되는 결과
</div>

이 webset에는 **29개의 item**이 있습니다. import한 공급업체 4개(점수가 매겨져 통과)와 web에서 발견한 기업 25개입니다. 두 그룹 모두 criteria에 따라 평가됩니다.

| 공급업체                 | Webset 포함 여부   | Source   | 평가 결과 있음? | 이유                                      |
| -------------------- | -------------- | -------- | --------- | --------------------------------------- |
| Accenture            | **예**          | `search` | 예 (2개)    | Scoped Search 통과: 미국 사무소 보유, IT 컨설팅 제공  |
| Infosys              | **예**          | `search` | 예 (2개)    | Scoped Search 통과: 미국 사무소 보유, IT 서비스 제공  |
| Wipro                | **예**          | `search` | 예 (2개)    | Scoped Search 통과: 미국 사무소 보유, IT 서비스 제공  |
| EPAM Systems         | **예**          | `search` | 예 (2개)    | Scoped Search 통과: 미국 상장, 소프트웨어 엔지니어링 제공 |
| Persol Group         | **아니오 -- 제외됨** | --       | --        | Scoped Search 실패: 미국 사무소 없음             |
| *(web에서 발견한 25개 기업)* | **예**          | `search` | 예 (각 2개)  | Web search로 발견, 두 criteria 모두 통과        |

Scoped Search는 import한 목록을 criteria에 따라 평가하고(Persol Group 제외), 뒤이어 추가된 web search가 기업 25개를 새로 발견합니다. 그 결과 점수가 매겨진 import 항목과 새로 발견한 web 결과가 하나의 webset에 함께 담깁니다.

<Note>
  이 web search는 `"behavior": "append"`를 사용하므로 기존 결과를 대체하지 않고 거기에 덧붙입니다. Web search가 이미 Scoped Search 결과에 포함된 기업(예: Accenture)을 발견하더라도 중복은 자동으로 처리됩니다.
</Note>

***

<div id="quick-reference">
  ## 빠른 참조
</div>

| 구성                                   | 동작                      | 모든 항목 유지?                 | 항목 점수 매김?                       |
| ------------------------------------ | ----------------------- | ------------------------- | ------------------------------- |
| **1. Import Only**                   | 목록을 enrich              | 예 -- 전부 유지                | 아니요                             |
| **2. Search Only**                   | 웹에서 새로운 일치 항목 발견        | 해당 없음 (import 없음)         | 예 -- 통과한 항목만 반환                 |
| **3. Scoped Search**                 | 목록을 criteria 기준으로 점수 매김 | 아니요 -- 미통과 항목은 제외됨        | 예                               |
| **4. Scoped Search + Web Discovery** | 목록 점수 매김 + 새로운 일치 항목 발견 | 아니요 -- 미통과 import 항목은 제외됨 | 예 -- import 항목과 발견된 항목 모두 점수 매김 |

<div id="which-config-should-i-use">
  ## 어떤 구성을 사용해야 할까요?
</div>

* **&quot;필터링 없이 내 목록을 enrich만 하고 싶어요&quot;** -- 구성 1
* **&quot;목록이 없어요, 회사를 찾아주세요&quot;** -- 구성 2
* **&quot;내 목록에 점수를 매기고, 조건에 맞지 않는 항목은 제외해 주세요&quot;** -- 구성 3
* **&quot;내 목록에 점수를 매기고, 조건에 맞는 새로운 회사도 찾아주세요&quot;** -- 구성 4