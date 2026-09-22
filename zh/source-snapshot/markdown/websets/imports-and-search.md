> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="how-to-use-imports">
  # 如何使用导入
</div>

> 将 URL 导入 Websets 的分步指南：丰富列表、依据 criteria 评分、发现新的匹配项，以及将三者结合使用。

如果你已经有一份 URL 列表 (公司、人物、产品等) ，可以将它们**导入**到 Webset 中。根据 Webset 的设置方式，导入的项目可以被丰富、依据 criteria 进行评估，或与网络发现的结果相结合。

本指南将逐一介绍每种配置，并提供可直接复制粘贴的 API 调用示例。只需将 `$EXA_API_KEY` 替换为你的 API 密钥即可。

<div id="our-example-5-it-consulting-suppliers">
  ## 我们的示例：5 家 IT consulting 供应商
</div>

在本指南中，我们将始终使用这份包含 5 家公司的列表作为导入内容：

| 公司           | URL                              | 备注                      |
| ------------ | -------------------------------- | ----------------------- |
| Accenture    | `https://www.accenture.com`      | 全球 IT consulting，总部位于美国 |
| Infosys      | `https://www.infosys.com`        | IT services，在美国业务规模较大   |
| Wipro        | `https://www.wipro.com`          | IT services，在美国设有办公室    |
| EPAM Systems | `https://www.epam.com`           | 软件工程，在美国上市              |
| Persol Group | `https://www.persol-group.co.jp` | 人力资源公司，聚焦日本，美国业务极少      |

选择这几家是因为其中 4 家明显符合典型的 IT consulting criteria (在美国设有办公室、提供 IT services) 。**Persol Group** 则是个例外：它是一家日本人力资源公司，在美国几乎没有业务，因此应当无法通过以美国为侧重点的 criteria。

下面示例中使用的 criteria 如下：

1. “该公司在美国设有办公室”
2. “该公司提供 IT consulting 或人员外包服务”

***

<div id="config-1-import-only-enrich-without-filtering">
  ## Config 1：Import Only —— 仅丰富，不做过滤
</div>

<Note>
  **在线示例：** [在控制台中查看此 webset](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**适用场景：** 你已有一份 URL 列表，只想对其进行丰富。不评分、不过滤 —— 每一个项目都会保留。

<div id="api-calls">
  ### API 调用
</div>

```bash theme={null}
# 第 1 步：用你的供应商 URL 创建一个 CSV 导入
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
# 响应中包含 `uploadUrl` 和导入的 `id`

# 第 2 步：将 CSV 上传到第 1 步返回的预签名 URL
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv 内容为：url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# 第 3 步：创建一个使用该导入的 Webset（仅增强，不含 search/criteria）
# 创建 Webset 时，该导入会自动排入处理队列。
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
  ### 在实时 Webset 中看到的结果
</div>

全部 **5 个项目**都出现在 Webset 中。由于没有 criteria，因此不会执行任何过滤。

| Supplier     | 在 Webset 中？ | Source   | Evaluations | 增强 | 原因                   |
| ------------ | ----------- | -------- | ----------- | -- | -------------------- |
| Accenture    | **是**       | `import` | 0           | 2  | 已导入，没有可供评估的 criteria |
| Infosys      | **是**       | `import` | 0           | 2  | 已导入，没有可供评估的 criteria |
| Wipro        | **是**       | `import` | 0           | 2  | 已导入，没有可供评估的 criteria |
| EPAM Systems | **是**       | `import` | 0           | 2  | 已导入，没有可供评估的 criteria |
| Persol Group | **是**       | `import` | 0           | 2  | 已导入，没有可供评估的 criteria |

每个项目的 `source: "import"`，且 `evaluations: []`。这 5 个项目全部被保留并进行丰富，无论它们是否能通过某项 criteria，因为此 config 中根本没有 criteria。

<Note>
  Persol Group 的 URL (`persol-group.co.jp`) 在实体数据中解析为“PERSOL Vietnam Japan Desk”，系统仍会导入并丰富它，只是解析到了一个区域子公司页面。
</Note>

***

<div id="config-2-search-only-web-discovery">
  ## Config 2：Search Only —— 网络发现
</div>

<Note>
  **在线示例：**[在控制台中查看该 webset](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**适用场景：** 你没有现成的名单，希望直接从网络中发现符合 criteria 的新公司。

<div id="api-call">
  ### API 调用
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
  ### 在实时 Webset 中看到的结果
</div>

系统搜索网页后，找到 **35 家公司** 同时满足两项 criteria。每个项目都带有 `source: "search"`，并附有完整的评估结果，说明其匹配原因。

| 我们的 5 家 Supplier          | 是否在 Webset 中？ | 原因                       |
| ------------------------- | ------------- | ------------------------ |
| Accenture                 | **是**         | 网页搜索自行发现 Accenture 为匹配公司 |
| Infosys                   | **否**         | 本次网页搜索未发现                |
| Wipro                     | **否**         | 本次网页搜索未发现                |
| EPAM Systems              | **否**         | 本次网页搜索未发现                |
| Persol Group              | **否**         | 本次网页搜索未发现                |
| *&#x20;(其他 34 家公司)&#x20;* | **是**         | 由网页搜索找到，且满足两项 criteria   |

本次网页搜索恰好在 35 条结果中找到了 Accenture，但另外 4 家 Supplier 未被发现。这属于正常情况：纯搜索模式的 webset 只会返回网页抓取到的内容，而不是一份预先确定的列表。其他被发现的公司示例：Artech、TurnKey Staffing、DataArt、Insight Global 等。

***

<div id="config-3-scoped-search-score-your-list-against-criteria">
  ## Config 3：限定 scope 的 Search —— 用 criteria 给你的列表打分
</div>

<Note>
  **在线示例：**[在控制台中查看该 webset](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**适用场景：** 你已有一份供应商列表，想要**按 criteria 逐一评估**。只有通过评估的条目才会返回。这就是“给我的列表打分”这类用例。

<div id="api-calls-2">
  ### API 调用
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # 按 Config 1 所示创建并上传 CSV 导入，然后在此处使用其 ID。
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
  // 按 Config 1 所示创建并上传 CSV 导入，然后在此处使用其 ID。
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
  # 第 1 步：创建并上传 CSV 导入（与 Config 1 的第 1-2 步相同）
  # ...（完整导入流程参见 Config 1）
  # 你会得到一个 <IMPORT_ID>

  # 第 2 步：创建一个带有限定 scope 的 search 的 Webset —— 依据 criteria 评估每个导入的 URL
  # 创建 Webset 时会自动安排处理该导入。
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
  ### 在实时 Webset 中看到的结果
</div>

该 webset 包含 **4 个项目**。我们的 5 家供应商都按 criteria 做了评估——只有两项 criteria 都通过的才会出现。

| 供应商          | 在 Webset 中？ | Source   | 有 Evaluations？ | 原因？                      |
| ------------ | ----------- | -------- | -------------- | ------------------------ |
| Accenture    | **是**       | `search` | 是 (2)          | 通过：在美国设有办公室，提供 IT 咨询服务   |
| Infosys      | **是**       | `search` | 是 (2)          | 通过：在美国设有办公室，提供 IT 服务     |
| Wipro        | **是**       | `search` | 是 (2)          | 通过：在美国设有办公室，提供 IT 服务     |
| EPAM Systems | **是**       | `search` | 是 (2)          | 通过：在美国上市，提供软件工程服务        |
| Persol Group | **否——被剔除**  | --       | --             | 未通过“在美国设有办公室”——业务主要集中在日本 |

我们导入了 5 家供应商，但结果中只出现 4 家。**Persol Group 经过评估但未通过**，因此被过滤掉。每个可见项目的 `source` 都是 `"search"`，并带有完整的 `evaluations`，说明每条 criterion 的判断理由。

<Warning>
  未通过 criteria 的项目会**从结果中剔除**。如果你想保留全部项目，只是想看清哪些通过、哪些未通过，可以在 Config 3 之外另建一个使用 Config 1 (仅导入，不做过滤) 的 webset。
</Warning>

***

<div id="config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches">
  ## Config 4：限定 scope 的 Search + 网络发现 —— 既为你的列表打分，又发现新的匹配项
</div>

<Note>
  **在线示例：**[在控制台查看此 webset](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**适用场景：** 你有一份供应商列表，想对照 criteria 打分，同时还想从网络上发现符合相同 criteria 的其他公司。这需要分两步完成：先用限定 scope 的 Search 创建一个 webset，再向同一个 webset 添加一个常规的网页搜索。

<div id="api-calls-3">
  ### API 调用
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # 按 Config 1 的方式创建并上传 CSV 导入，然后在此处填入其 ID。
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
  // 参照 Config 1 创建并上传一个 CSV 导入，然后在此处使用它的 ID。
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
  # 步骤 1：创建 CSV 导入并上传（与 Config 1 的步骤 1-2 相同）
  # ...（完整导入流程见 Config 1）
  # 你会得到一个 <IMPORT_ID>

  # 步骤 2：创建一个带限定 scope 的 Search 的 Webset —— 按 criteria 评估每个导入的 URL
  # 创建 Webset 时，该导入会自动排入处理队列。
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
  # 响应中包含 webset 的 `id` —— 将其保存为 <WEBSET_ID>

  # 步骤 3：等待限定 scope 的 Search 完成，然后添加一个网页搜索来发现新的匹配项
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
  ### 在实时 Webset 中看到的内容
</div>

该 webset 包含 **29 个项目**：4 个来自我们导入的供应商 (已打分并通过) ，外加 25 家通过网页发现的公司。两部分都会依据 criteria 进行评估。

| 供应商                           | 在 Webset 中？  | Source   | 有 Evaluations 吗？ | 原因？                                         |
| ----------------------------- | ------------ | -------- | ---------------- | ------------------------------------------- |
| Accenture                     | **是**        | `search` | 是 (2 项)          | 通过限定 scope 的 Search：有美国办公室，提供 IT consulting |
| Infosys                       | **是**        | `search` | 是 (2 项)          | 通过限定 scope 的 Search：有美国办公室，提供 IT services   |
| Wipro                         | **是**        | `search` | 是 (2 项)          | 通过限定 scope 的 Search：有美国办公室，提供 IT services   |
| EPAM Systems                  | **是**        | `search` | 是 (2 项)          | 通过限定 scope 的 Search：在美国上市，提供软件工程服务          |
| Persol Group                  | **否 —— 已剔除** | --       | --               | 未通过限定 scope 的 Search：没有美国办公室                |
| *&#x20;(25 家通过网页发现的公司)&#x20;* | **是**        | `search` | 是 (各 2 项)        | 由网页搜索发现，通过了两项 criteria                      |

限定 scope 的 Search 会依据 criteria 评估你导入的列表 (剔除了 Persol Group) ，追加的网页搜索则发现了另外 25 家公司。最终得到一个 webset，其中既有已打分的导入项，也有新发现的网页结果。

<Note>
  网页搜索使用了 `"behavior": "append"`，因此会在已有结果上追加，而不是替换。如果网页搜索发现的公司已存在于限定 scope 的 Search 结果中 (例如 Accenture) ，系统会自动处理重复项。
</Note>

***

<div id="quick-reference">
  ## 快速参考
</div>

| 配置                                   | 作用                  | 是否保留所有项目？         | 项目是否打分？          |
| ------------------------------------ | ------------------- | ----------------- | ---------------- |
| **1. Import Only**                   | 丰富你的列表              | 是 —— 全部保留         | 否                |
| **2. Search Only**                   | 从网络中发现新的匹配项         | 不适用 (无导入)         | 是 —— 仅返回通过的项目    |
| **3. Scoped Search**                 | 依据 criteria 为你的列表打分 | 否 —— 未通过的会被剔除     | 是                |
| **4. Scoped Search + 网络发现** | 为你的列表打分 + 发现新的匹配项   | 否 —— 导入项中未通过的会被剔除 | 是 —— 导入项和发现项都会打分 |

<div id="which-config-should-i-use">
  ## 我该使用哪个 Config？
</div>

* **“我只想丰富我的列表，不需要过滤”** —— Config 1
* **“我没有列表，帮我找公司”** —— Config 2
* **“给我的列表打分，去掉不匹配的”** —— Config 3
* **“给我的列表打分，同时再找出匹配的新公司”** —— Config 4