> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Imports 사용 방법 {#how-to-use-imports}

> URL을 Websets로 import하는 단계별 가이드 -- 목록을 enrich하고, criteria로 점수를 매기고, 새로운 일치 항목을 찾고, 이 세 가지를 모두 결합하는 방법을 다룹니다.

이미 URL 목록(회사, 인물, 제품 등)을 갖고 있다면 이를 Webset으로 **import**할 수 있습니다. Webset을 어떻게 설정하느냐에 따라 import한 item을 enrich하거나, criteria로 평가하거나, Web Discovery 결과와 결합할 수 있습니다.

이 가이드에서는 복사해서 바로 쓸 수 있는 API 호출과 함께 모든 구성을 하나씩 살펴봅니다. `$EXA_API_KEY`만 본인의 API 키로 바꾸면 됩니다.

## 예시: IT 컨설팅 공급업체 5곳 {#our-example-5-it-consulting-suppliers}

이 가이드 전반에서 동일한 5개 회사 목록을 import로 사용합니다:

| 회사           | URL                              | 비고                           |
| ------------ | -------------------------------- | ---------------------------- |
| Accenture    | `https://www.accenture.com`      | 글로벌 IT 컨설팅, 미국 본사            |
| Infosys      | `https://www.infosys.com`        | IT 서비스, 미국 내 대규모 입지          |
| Wipro        | `https://www.wipro.com`          | IT 서비스, 미국 내 사무소 보유          |
| EPAM Systems | `https://www.epam.com`           | 소프트웨어 엔지니어링, 미국 상장           |
| Persol Group | `https://www.persol-group.co.jp` | 인력 서비스 회사, 일본 중심, 미국 내 입지 미미 |

이 회사들을 고른 이유는 5곳 중 4곳이 전형적인 IT 컨설팅 criteria(미국 사무소, IT 서비스)에 명확히 부합하기 때문입니다. **Persol Group**은 예외로, 미국 내 입지가 거의 없는 일본 인력 서비스 회사이므로 미국 중심 criteria를 충족하지 못해야 합니다.

아래 예시에서 사용할 criteria는 다음과 같습니다:

1. &quot;해당 회사는 미국에 사무소를 두고 있다&quot;
2. &quot;해당 회사는 IT 컨설팅 또는 인력 증원 서비스를 제공한다&quot;

***

## Config 1: Import Only -- filtering 없이 enrich하기 {#config-1-import-only-enrich-without-filtering}

<Note>
  **실제 예시:** [dashboard에서 이 webset 보기](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**사용 시점:** URL 목록이 있고 이를 enrich하기만 하면 될 때. 점수 산정도 filtering도 없이 모든 item이 그대로 유지됩니다.

### API 호출 {#api-calls}

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
# response에는 `uploadUrl`과 import의 `id`가 포함됩니다

# 2단계: 1단계에서 받은 사전 서명된 URL에 CSV 업로드
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv 내용: url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# 3단계: 이 import를 사용하는 Webset 생성 (enrichment만, search/criteria 없음)
# Webset이 생성되면 import 처리가 자동으로 예약됩니다.
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

### 실제 Webset에서 확인되는 내용 {#what-we-see-in-the-live-webset}

**5개 item**이 모두 Webset에 나타납니다. criteria가 없으므로 filtering도 일어나지 않습니다.

| Supplier     | Webset 포함 여부? | Source   | Evaluations | Enrichments | 이유                       |
| ------------ | ------------- | -------- | ----------- | ----------- | ------------------------ |
| Accenture    | **예**         | `import` | 0           | 2           | import됨, 평가할 criteria 없음 |
| Infosys      | **예**         | `import` | 0           | 2           | import됨, 평가할 criteria 없음 |
| Wipro        | **예**         | `import` | 0           | 2           | import됨, 평가할 criteria 없음 |
| EPAM Systems | **예**         | `import` | 0           | 2           | import됨, 평가할 criteria 없음 |
| Persol Group | **예**         | `import` | 0           | 2           | import됨, 평가할 criteria 없음 |

모든 item의 값은 `source: "import"`, `evaluations: []`입니다. 이 config에는 criteria가 없기 때문에 criteria 통과 여부와 무관하게 5개 모두 유지되고 enrich됩니다.

<Note>
  Persol Group의 URL(`persol-group.co.jp`)은 엔터티 데이터에서 &quot;PERSOL Vietnam Japan Desk&quot;로 인식되었습니다. 그래도 시스템은 이를 그대로 import하고 enrich하며, 단지 지역 자회사 페이지로 인식되었을 뿐입니다.
</Note>

***

## Config 2: Search Only -- Web Discovery {#config-2-search-only-web-discovery}

<Note>
  **실제 예시:** [dashboard에서 이 webset 보기](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**사용 시점:** 보유한 목록이 없고, criteria에 맞는 새로운 회사를 웹에서 찾아내고 싶을 때.

### API 호출 {#api-call}

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

### 실제 Webset에서 확인되는 결과 {#what-we-see-in-the-live-webset-2}

시스템이 웹을 검색해 두 criteria를 모두 통과하는 **35개 기업**을 찾았습니다. 모든 item에는 `source: "search"`가 설정되어 있으며, 매칭된 이유를 설명하는 전체 evaluations가 함께 제공됩니다.

| 우리의 5개 Supplier | Webset에 포함? | 이유                                           |
| --------------- | ----------- | -------------------------------------------- |
| Accenture       | **예**       | web search가 독립적으로 Accenture를 조건에 맞는 기업으로 발견함 |
| Infosys         | **아니오**     | 이번 web search에서는 발견되지 않음                     |
| Wipro           | **아니오**     | 이번 web search에서는 발견되지 않음                     |
| EPAM Systems    | **아니오**     | 이번 web search에서는 발견되지 않음                     |
| Persol Group    | **아니오**     | 이번 web search에서는 발견되지 않음                     |
| *(그 외 34개 기업)*  | **예**       | web search로 발견되었고 두 criteria를 모두 통과함         |

web search가 35개 결과 중에 우연히 Accenture를 찾아내긴 했지만, 나머지 4개 Supplier는 발견되지 않았습니다. 이는 예상된 동작입니다. search만 사용하는 webset은 미리 정해진 목록이 아니라 웹 크롤링으로 찾아낸 결과만 반환하기 때문입니다. 그 밖에 발견된 기업으로는 Artech, TurnKey Staffing, DataArt, Insight Global 등이 있습니다.

***

## Config 3: Scoped Search -- criteria 기준으로 목록 score하기 {#config-3-scoped-search-score-your-list-against-criteria}

<Note>
  **실제 예시:** [dashboard에서 이 webset 보기](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**사용 시점:** 공급업체 목록이 있고 **각 항목을 criteria 기준으로 평가**하려는 경우에 사용합니다. 통과한 항목만 반환됩니다. 이른바 &quot;내 목록 score하기&quot; 사용 사례입니다.

### API 호출 {#api-calls-2}

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
  # ... (전체 import 흐름은 Config 1을 참고하세요)
  # <IMPORT_ID>를 돌려받게 됩니다

  # 2단계: scoped search로 Webset을 생성합니다 -- import된 각 URL을 criteria에 따라 평가합니다
  # Webset이 생성되면 import는 자동으로 처리 일정에 등록됩니다.
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

### 실제 Webset에서 확인되는 결과 {#what-we-see-in-the-live-webset-3}

webset에는 **4개의 item**이 있습니다. 5개 공급업체 각각을 criteria에 따라 평가했으며, 두 criteria를 모두 통과한 항목만 표시됩니다.

| Supplier     | Webset에 포함?    | Source   | Evaluations 있음? | 이유                                             |
| ------------ | -------------- | -------- | --------------- | ---------------------------------------------- |
| Accenture    | **예**          | `search` | 예 (2)           | 통과: 미국 사무소 보유, IT 컨설팅 제공                       |
| Infosys      | **예**          | `search` | 예 (2)           | 통과: 미국 사무소 보유, IT 서비스 제공                       |
| Wipro        | **예**          | `search` | 예 (2)           | 통과: 미국 사무소 보유, IT 서비스 제공                       |
| EPAM Systems | **예**          | `search` | 예 (2)           | 통과: 미국 상장, 소프트웨어 엔지니어링 서비스 제공                  |
| Persol Group | **아니요 -- 제외됨** | --       | --              | &quot;미국에 사무소 보유&quot; criteria 실패 -- 주로 일본 중심 |

공급업체 5개를 import했지만 결과에는 4개만 나타납니다. **Persol Group은 평가를 거쳤으나 통과하지 못해** 걸러졌습니다. 표시된 모든 item은 `source: "search"`이며, 각 criterion에 대한 판단 근거가 담긴 전체 `evaluations`를 포함합니다.

<Warning>
  criteria를 통과하지 못한 item은 **결과에서 제외됩니다**. 모든 item을 유지한 채 어떤 item이 통과하고 실패했는지만 확인하려면, Config 3과 함께 Config 1(import만, filtering 없음)을 별도의 webset으로 사용하세요.
</Warning>

***

## Config 4: Scoped Search + Web Discovery -- 내 리스트 score 매기기 + 신규 일치 항목 찾기 {#config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches}

<Note>
  **실제 예시:** [dashboard에서 이 webset 보기](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**사용 시점:** criteria에 따라 score를 매기고 싶은 공급업체 리스트가 있고, 동시에 같은 criteria에 부합하는 기업을 웹에서 추가로 발굴하고 싶을 때 사용합니다. 두 단계로 진행됩니다. 먼저 Scoped Search로 webset을 생성한 다음, 같은 webset에 일반 web search를 추가합니다.

### API 호출 {#api-calls-3}

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
  # <IMPORT_ID>를 반환받습니다

  # 2단계: scoped search를 포함한 Webset을 생성합니다 -- import된 각 URL을 criteria에 따라 평가합니다
  # Webset이 생성되면 import 처리 일정이 자동으로 잡힙니다.
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
  # response에는 webset `id`가 포함됩니다 -- <WEBSET_ID>로 저장해 두세요

  # 3단계: scoped search가 완료될 때까지 기다린 뒤, web search를 추가해 새로운 일치 항목을 찾습니다
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

### 실시간 Webset에서 확인할 수 있는 것 {#what-we-see-in-the-live-webset-4}

이 webset에는 **29개 item**이 들어 있습니다. import한 공급업체 중 4개(score를 받아 통과)와 웹에서 발견된 25개 기업입니다. 두 그룹 모두 criteria에 따라 평가됩니다.

| 공급업체               | Webset에 포함?    | Source   | Evaluations 있음? | 이유                                            |
| ------------------ | -------------- | -------- | --------------- | --------------------------------------------- |
| Accenture          | **예**          | `search` | 예 (2개)          | Scoped Search 통과: 미국 사무소 보유, IT consulting 제공 |
| Infosys            | **예**          | `search` | 예 (2개)          | Scoped Search 통과: 미국 사무소 보유, IT services 제공   |
| Wipro              | **예**          | `search` | 예 (2개)          | Scoped Search 통과: 미국 사무소 보유, IT services 제공   |
| EPAM Systems       | **예**          | `search` | 예 (2개)          | Scoped Search 통과: 미국 상장, 소프트웨어 엔지니어링 제공       |
| Persol Group       | **아니요 -- 제외됨** | --       | --              | Scoped Search 실패: 미국 사무소 없음                   |
| *(웹에서 발견된 25개 기업)* | **예**          | `search` | 예 (각 2개)        | web search로 발견, 두 criteria 모두 통과              |

Scoped Search는 import한 목록을 criteria에 따라 평가하고(Persol Group 제외), 뒤이어 추가된 web search는 25개 기업을 새로 발견합니다. 그 결과 score가 매겨진 import 항목과 새로 발견한 웹 결과가 하나의 webset에 함께 담깁니다.

<Note>
  web search는 `"behavior": "append"`를 사용하므로 기존 결과를 대체하지 않고 추가합니다. web search가 이미 Scoped Search 결과에 있던 기업(예: Accenture)을 발견하더라도 중복은 자동으로 처리됩니다.
</Note>

***

## 빠른 reference {#quick-reference}

| 구성                                   | 기능 설명                    | 모든 item 유지?             | item이 score됨?                   |
| ------------------------------------ | ------------------------ | ----------------------- | ------------------------------- |
| **1. Import Only**                   | 목록을 enrich               | 예 -- 모두 유지              | 아니요                             |
| **2. Search Only**                   | 웹에서 새로운 일치 항목 발견         | 해당 없음 (import 없음)       | 예 -- 통과한 item만 반환               |
| **3. Scoped Search**                 | criteria 기준으로 목록을 score  | 아니요 -- 실패한 항목은 제외       | 예                               |
| **4. Scoped Search + Web Discovery** | 목록을 score하고 새로운 일치 항목 발견 | 아니요 -- import 실패 항목은 제외 | 예 -- import 항목과 발견된 항목 모두 score |

## 어떤 Config를 사용해야 하나요? {#which-config-should-i-use}

* **&quot;필터링 없이 내 리스트를 enrich만 하고 싶어요&quot;** -- Config 1
* **&quot;리스트가 없어요, 회사를 찾아주세요&quot;** -- Config 2
* **&quot;내 리스트를 score해서 맞지 않는 항목은 빼주세요&quot;** -- Config 3
* **&quot;내 리스트를 score하고, 조건에 맞는 새로운 회사도 찾아주세요&quot;** -- Config 4