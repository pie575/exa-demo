> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，请先通过该文件了解所有可用页面。

<div id="websets">
  # Websets
</div>

> 从网络构建经过验证、内容丰富的数据集。

<div id="what-are-websets">
  ## 什么是 Websets？
</div>

一个 Webset 从一条自然语言 query 和目标项目数量开始。你可以添加每条 result 都必须满足的 criteria，并指定为每个已接受项目填充的增强 fields。结果会通过控制台、API 或 webhook 异步返回。

你也可以在[控制台](/zh/docs/websets/dashboard/get-started)中可视化地构建 webset，无需编写代码。

<Info>
  要开始新的列表构建或增强工作流？请使用 [Exa Agent](/zh/docs/agent/quickstart)。
  本指南适用于维护或扩展已有的 Websets integration。
  Websets API 需要付费的 Websets plan；Search API 积分与 Websets 积分相互独立。
</Info>

<div id="how-it-works">
  ## 工作原理
</div>

1. **定义 search：** 提供自然语言 query、结果数量，以及可选的验证 criteria 和增强。
2. **search 并验证：** Websets 找出候选结果，并逐一对照你的 criteria 进行检查,只有符合的结果才会成为项目。
3. **执行增强：** 针对每个通过验证的项目，Websets 会 search 你所需的额外数据，例如 CEO 姓名、融资金额或联系方式。
4. **获取结果：** 轮询状态、通过 webhook 接收更新，或在项目陆续产生时查看控制台。

<div id="key-capabilities">
  ## 核心能力
</div>

| 功能              | 作用                            |
| --------------- | ----------------------------- |
| **Criteria 验证** | 每条结果都会按你定义的规则进行校验，确保只返回相关的匹配项 |
| **增强**          | 为每条结果提取特定数据点 (文本、数字、日期、布尔值)   |
| **Monitors**    | 定期执行 search，自动保持 webset 最新    |
| **Webhooks**    | 在项目被添加或丰富时实时接收 HTTP 回调        |
| **导入**          | 导入你自己的 URL 并对其运行增强            |

<div id="human-quickstart">
  ## 人工快速开始
</div>

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户会赠送免费积分。
</Card>

安装 SDK：

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

然后发起你的第一个请求：

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

  # 等待 Webset 处理完成
  webset = exa.websets.wait_until_idle(webset.id)

  # 获取 Webset 中的项目
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
  有关产品可用性，请参阅 [Zero Data Retention](/zh/docs/admin/security/zero-data-retention)。
</Note>

<div id="next">
  ## 下一步
</div>

* [**控制台指南**](./dashboard/get-started) - 在控制台中使用 Websets 的分步指南
* [**工作原理**](./api/how-it-works) - 深入了解事件驱动架构
* [**Websets API 参考**](./api/websets/create-a-webset) - 涵盖所有端点的完整 API 参考