> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

<div id="how-to-use-imports">
  # 如何使用 Imports
</div>

> 一份将 URL 导入 Websets 的分步指南——为列表做数据增强、按 criteria 打分、发现新的匹配项，以及将三者结合使用。

如果你已经有一份 URL 列表 (公司、人物、产品等) ，可以将它们 **import** 到 Webset 中。根据 Webset 的设置方式，导入的项目可以进行数据增强、按 criteria 评估，或与网络发现结果相结合。

本指南将逐一介绍每种 configuration，并给出可直接复制粘贴的 API 调用示例。只需将 `$EXA_API_KEY` 替换为你的 API key 即可。

<div id="our-example-5-it-consulting-suppliers">
  ## 示例场景：5 家 IT 咨询供应商
</div>

在本指南中，我们将始终使用同一份包含 5 家公司的列表作为 import：

| 公司           | URL                              | 备注                     |
| ------------ | -------------------------------- | ---------------------- |
| Accenture    | `https://www.accenture.com`      | 全球性 IT 咨询公司，总部位于美国     |
| Infosys      | `https://www.infosys.com`        | IT 服务，在美国业务规模大         |
| Wipro        | `https://www.wipro.com`          | IT 服务，在美国设有办公室         |
| EPAM Systems | `https://www.epam.com`           | 软件工程，在美国上市             |
| Persol Group | `https://www.persol-group.co.jp` | 人力派遣公司，聚焦日本市场，几乎没有美国业务 |

之所以选择这几家，是因为其中 4 家明显符合典型的 IT 咨询 criteria (在美国设有办公室、提供 IT 服务) 。**Persol Group** 则是个例外——它是一家日本人力派遣公司，在美国几乎没有业务，因此应当无法通过面向美国市场的 criteria。

以下示例所用的 criteria 为：

1. “该公司在美国设有办公室”
2. “该公司提供 IT 咨询或人力外包服务”

***

<div id="config-1-import-only-enrich-without-filtering">
  ## 配置 1：仅导入 —— 只做 enrich，不做筛选
</div>

<Note>
  **在线示例：**[在控制台中查看此 webset](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**适用场景：** 你有一份 URL 列表，只想对它们做 enrich。不评分、不筛选 —— 所有项目都会保留。

<div id="api-calls">
  ### API 调用
</div>

```bash theme={null}
# 第 1 步：用你的供应商 URL 创建一个 CSV import
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
# 响应中包含 `uploadUrl` 和 import 的 `id`

# 第 2 步：将 CSV 上传到第 1 步返回的预签名 URL
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv 的内容为：url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# 第 3 步：创建一个使用该 import 的 Webset（只做 enrichments，不做 search/criteria）
# Webset 创建后，该 import 会自动进入处理队列。
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

全部 **5 个项目**都出现在 Webset 中。由于没有设置 criteria，不会进行任何筛选。

| 供应商          | 是否在 Webset 中？ | 来源       | 评估数 | Enrichment 数 | 原因                   |
| ------------ | ------------- | -------- | --- | ------------ | -------------------- |
| Accenture    | **是**         | `import` | 0   | 2            | 已导入，没有可供评估的 criteria |
| Infosys      | **是**         | `import` | 0   | 2            | 已导入，没有可供评估的 criteria |
| Wipro        | **是**         | `import` | 0   | 2            | 已导入，没有可供评估的 criteria |
| EPAM Systems | **是**         | `import` | 0   | 2            | 已导入，没有可供评估的 criteria |
| Persol Group | **是**         | `import` | 0   | 2            | 已导入，没有可供评估的 criteria |

每个项目的 `source: "import"`，且 `evaluations: []`。这 5 个项目全部被保留并完成 enrichment，无论它们能否通过任何 criteria——因为此配置中根本没有 criteria。

<Note>
  Persol Group 的 URL (`persol-group.co.jp`) 在实体数据中解析为“PERSOL Vietnam Japan Desk”——系统仍会导入并对其进行 enrichment，只是解析到了一个区域子公司页面。
</Note>

***

<div id="config-2-search-only-web-discovery">
  ## 配置 2：仅 Search —— 网络发现
</div>

<Note>
  **实时示例：**[在仪表板中查看此 webset](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**适用场景：**你没有现成的列表——希望从网络中发现符合 criteria 的新公司。

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
  ### 在实时 Webset 中我们看到了什么
</div>

系统搜索了网络，找到 **35 家公司** 同时满足两项 criteria。每个项目的 `source` 均为 `"search"`，并附有完整评估，说明其匹配原因。

| 我们的 5 家供应商                | 在 Webset 中？ | 原因                            |
| ------------------------- | ----------- | ----------------------------- |
| Accenture                 | **是**       | 网页搜索独立发现 Accenture 是一家符合条件的公司 |
| Infosys                   | **否**       | 本次网页搜索未发现                     |
| Wipro                     | **否**       | 本次网页搜索未发现                     |
| EPAM Systems              | **否**       | 本次网页搜索未发现                     |
| Persol Group              | **否**       | 本次网页搜索未发现                     |
| *&#x20;(其他 34 家公司)&#x20;* | **是**       | 由网页搜索找到，且满足两项 criteria        |

网页搜索恰好在这 35 条结果中找到了 Accenture——但其余 4 家供应商并未被发现。这属于正常情况：纯搜索的 webset 只会返回网络抓取到的内容，而不是一份预先设定的名单。其他被发现的公司示例：Artech、TurnKey Staffing、DataArt、Insight Global 等。

***

<div id="config-3-scoped-search-score-your-list-against-criteria">
  ## 配置 3：限定范围搜索 —— 按 criteria 为你的列表评分
</div>

<Note>
  **在线示例：**[在仪表盘中查看此 webset](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**适用场景：** 你已有一份供应商列表，希望**按 criteria 逐一进行评估**，只有通过评估的条目才会返回。这就是典型的“为我的列表评分”场景。

<div id="api-calls-2">
  ### API 调用
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # 按照 Config 1 的方式创建并上传一个 CSV import，然后在此处填入其 ID。
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
  // 按照 Config 1 的方式创建并上传一个 CSV import，然后在此处填入其 ID。
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
  # 第 1 步：创建并上传一个 CSV import（与 Config 1 的第 1-2 步相同）
  # ...（完整的 import 流程请参见 Config 1）
  # 你会拿到一个 <IMPORT_ID>

  # 第 2 步：创建一个带 scoped search 的 Webset —— 按 criteria 逐一评估导入的每个 URL
  # 创建 Webset 时会自动调度该 import 进行处理。
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

该 webset 包含 **4 个项目**。我们的 5 家供应商都按 criteria 做了评估——只有同时通过两项 criteria 的才会出现。

| 供应商          | 在 Webset 中？ | 来源       | 是否有评估？   | 原因                       |
| ------------ | ----------- | -------- | -------- | ------------------------ |
| Accenture    | **是**       | `search` | 是 (2 项)  | 通过：在美国设有办公室，提供 IT 咨询服务   |
| Infosys      | **是**       | `search` | 是 (2 项)  | 通过：在美国设有办公室，提供 IT 服务     |
| Wipro        | **是**       | `search` | 是 (2 项)  | 通过：在美国设有办公室，提供 IT 服务     |
| EPAM Systems | **是**       | `search` | 是 (2 项)  | 通过：在美国上市，提供软件工程服务        |
| Persol Group | **否——已剔除**  | --       | --       | 未通过“在美国设有办公室”——业务主要集中在日本 |

我们导入了 5 家供应商，但结果中只出现 4 家。**Persol Group 经评估未通过**，因此被过滤掉。每个可见项目的 `source` 均为 `"search"`，并带有完整的 `evaluations`，说明每条 criterion 的判断理由。

<Warning>
  未通过 criteria 的项目会**从结果中剔除**。如果你想保留全部项目，只是查看哪些通过、哪些未通过，可以在 Config 3 之外另建一个使用 Config 1 (仅导入，不做过滤) 的 webset。
</Warning>

***

<div id="config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches">
  ## 配置 4：限定范围搜索 + 网络发现 —— 为你的列表打分，同时发现新的匹配项
</div>

<Note>
  **实例：**[在控制台中查看此 webset](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**适用场景：** 你有一份供应商列表，想按 criteria 对其打分，同时还希望从网页上发现符合相同 criteria 的其他公司。这需要两步：先用限定范围搜索创建一个 webset，再向同一个 webset 添加一次常规的网页搜索。

<div id="api-calls-3">
  ### API 调用
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # 按照配置 1 的方式创建 CSV import 并上传，然后在此处使用它的 ID。
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
  // 按 Config 1 的方式创建并上传一个 CSV import，然后在此处填入它的 ID。
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
  # 第 1 步：创建 CSV import 并上传（与配置 1 的第 1-2 步相同）
  # ...（完整的 import 流程见配置 1）
  # 你将得到一个 <IMPORT_ID>

  # 第 2 步：用带 scope 的 search 创建 Webset —— 按 criteria 逐一评估导入的每个 URL
  # 创建 Webset 时会自动安排处理该 import。
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

  # 第 3 步：等待带 scope 的 search 完成后，再添加一次网页搜索来发现新的匹配项
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

该 webset 包含 **29 个项目** —— 其中 4 个来自我们导入的供应商 (已评分并通过) ，另外 25 个是通过网页发现的公司。两组都会按 criteria 进行评估。

| 供应商                           | 在 Webset 中？  | 来源       | 是否有评估？     | 原因                       |
| ----------------------------- | ------------ | -------- | ---------- | ------------------------ |
| Accenture                     | **是**        | `search` | 是 (2 项)    | 通过限定范围搜索：有美国办公室，提供 IT 咨询 |
| Infosys                       | **是**        | `search` | 是 (2 项)    | 通过限定范围搜索：有美国办公室，提供 IT 服务 |
| Wipro                         | **是**        | `search` | 是 (2 项)    | 通过限定范围搜索：有美国办公室，提供 IT 服务 |
| EPAM Systems                  | **是**        | `search` | 是 (2 项)    | 通过限定范围搜索：在美国上市，提供软件工程服务  |
| Persol Group                  | **否 —— 已剔除** | --       | --         | 未通过限定范围搜索：没有美国办公室        |
| *&#x20;(25 家通过网页发现的公司)&#x20;* | **是**        | `search` | 是 (各 2 项)  | 由网页搜索发现，通过了两项 criteria   |

限定范围搜索会按 criteria 评估你导入的列表 (剔除了 Persol Group) ，追加的网页搜索则另外发现了 25 家公司。最终得到一个 webset，既包含经过评分的导入数据，也包含新的网页发现结果。

<Note>
  网页搜索使用了 `"behavior": "append"`，因此它会在已有结果的基础上追加，而不是替换已有结果。如果网页搜索发现的公司已经出现在限定范围搜索的结果中 (例如 Accenture) ，系统会自动处理重复项。
</Note>

***

<div id="quick-reference">
  ## 快速参考
</div>

| 配置                              | 作用                  | 是否保留所有项目?             | 项目是否会被评分?                |
| ------------------------------- | ------------------- | --------------------- | ------------------------ |
| **1. 仅 import**                 | 丰富你的列表              | 是 —— 全部保留             | 否                        |
| **2. 仅 search**                 | 从网络中发现新的匹配结果        | 不适用(无 import)         | 是 —— 仅返回通过的项目            |
| **3. 限定范围搜索**        | 依据 criteria 为你的列表评分 | 否 —— 未通过的会被剔除         | 是                        |
| **4. 限定范围搜索 + 网络发现** | 为你的列表评分 + 发现新的匹配结果  | 否 —— 未通过的 import 会被剔除 | 是 —— import 与新发现的结果都会被评分 |

<div id="which-config-should-i-use">
  ## 我该用哪种配置？
</div>

* **“我只想丰富现有列表，不需要筛选”** —— 配置 1
* **“我没有列表，帮我找公司”** —— 配置 2
* **“给我的列表打分，并剔除不匹配的条目”** —— 配置 3
* **“既给我的列表打分，也找出符合条件的新公司”** —— 配置 4