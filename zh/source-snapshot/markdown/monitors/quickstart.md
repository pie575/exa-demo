> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="monitors-api">
  # Monitors API
</div>

> 定期运行 search，并通过 webhook 接收新发现的结果。

Monitors 会按照设定的 schedule 定期运行 Exa search，并将结果投递到 webhook 端点。

可以使用 Monitors 持续跟踪新闻、竞争对手动态、融资轮次、监管变化、研究文献，或任何随时间变化的主题。

<div id="how-monitors-work">
  ## Monitors 的工作方式
</div>

每次运行时，Exa 会执行已配置的 search，按时间进行过滤，剔除该 monitor 此前已返回过的结果或发现内容，再将新的输出发送到你的 webhook。

每个 monitor 都有各自独立的运行历史，因此编写 query 时应围绕你想要持续追踪的信号，而不必自行添加不断变动的日期范围。

<div id="create-your-first-monitor">
  ## 创建你的第一个 monitor
</div>

创建 monitor 时，需指定搜索 query、interval，以及用于接收更新的 HTTPS 端点：

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  monitor = exa.monitors.create({
      "name": "Battery recycling expansion",
      "search": {
          "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
          "type": "interval",
          "period": "1d",
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"],
      },
  })

  print(monitor.id)
  print(monitor.webhook_secret)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const monitor = await exa.monitors.create({
    name: "Battery recycling expansion",
    search: {
      query: "new battery recycling facilities announced in North America"
    },
    trigger: {
      type: "interval",
      period: "1d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });

  console.log(monitor.id);
  console.log(monitor.webhookSecret);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "Battery recycling expansion",
      "search": {
        "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
        "type": "interval",
        "period": "1d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<Accordion title="响应示例">
  ```json theme={null}
  {
    "id": "01k4d9w6y3h7p2m8n5q1r0s4tv",
    "name": "Battery recycling expansion",
    "status": "active",
    "search": {
      "query": "new battery recycling facilities announced in North America"
    },
    "trigger": {
      "type": "interval",
      "period": "1d"
    },
    "outputSchema": null,
    "metadata": null,
    "webhook": {
      "url": "https://example.com/webhooks/exa",
      "events": ["monitor.run.completed"]
    },
    "nextRunAt": null,
    "createdAt": "2026-09-05T20:00:00.000Z",
    "updatedAt": "2026-09-05T20:00:00.000Z",
    "webhookSecret": "<one-time-webhook-signing-secret>"
  }
  ```
</Accordion>

创建 monitor 时请妥善保存 `webhookSecret`。它只返回一次，且是验证 webhook 签名的必要凭据。

<div id="configure-the-output">
  ## 配置输出
</div>

每次完成的运行都会在 `output.results` 中返回新发现的页面。

Exa 还会将每个页面的发现内容归纳汇总到 `output.content` 中：

| 输出形式     | 使用方式                 | 返回值                                 |
| -------- | -------------------- | ----------------------------------- |
| 文本摘要     | 默认                   | `output.content` 中的字符串              |
| 结构化 JSON | 添加 `outputSchema` 对象 | `output.content` 中符合该 schema 的 JSON |

归纳生成的 fields 所依据的 sources 会自动在 `output.grounding` 中返回。

当下游代码需要固定一致的 fields 时，请添加
`outputSchema`：

```json theme={null}
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "announcements": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "company": { "type": "string" },
            "location": { "type": "string" },
            "announcement": { "type": "string" }
          },
          "required": ["company", "location", "announcement"]
        }
      }
    },
    "required": ["announcements"]
  }
}
```

不要将引用来源和 confidence 写入 schema。它们会单独在
`output.grounding` 中返回。

<div id="add-page-content">
  ## 添加页面内容
</div>

`search` 接受与 [Exa Search](/zh/docs/search/quickstart) 相同的选项：用 `contents` 为每条结果附带 highlights、full text 或摘要，用 `includeDomains` 或 `excludeDomains` 限定来源范围。

<CodeGroup>
  ```python Python theme={null}
  monitor = exa.monitors.create({
      "name": "LLM Research Tracker",
      "search": {
          "query": "new large language model training techniques and architectures",
          "numResults": 10,
          "contents": {
              "highlights": True
          }
      },
      "trigger": {
          "type": "interval",
          "period": "7d"
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"]
      }
  })
  ```

  ```javascript JavaScript theme={null}
  const monitor = await exa.monitors.create({
    name: "LLM Research Tracker",
    search: {
      query: "new large language model training techniques and architectures",
      numResults: 10,
      contents: {
        highlights: true
      }
    },
    trigger: {
      type: "interval",
      period: "7d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "LLM Research Tracker",
      "search": {
        "query": "new large language model training techniques and architectures",
        "numResults": 10,
        "contents": {
          "highlights": true
        }
      },
      "trigger": {
        "type": "interval",
        "period": "7d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<div id="test-your-monitor">
  ## 测试你的 monitor
</div>

无需等待下一个计划时间，立即触发一次运行，然后列出该 monitor 的运行记录：

<CodeGroup>
  ```python Python theme={null}
  exa.monitors.trigger(monitor.id)

  runs = exa.monitors.runs.list(monitor.id, limit=1)
  latest = runs.data[0]
  print(latest.id, latest.status)
  ```

  ```javascript JavaScript theme={null}
  await exa.monitors.trigger(monitor.id);

  const runs = await exa.monitors.runs.list(monitor.id, { limit: 1 });
  const latest = runs.data[0];
  console.log(latest.id, latest.status);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors/$MONITOR_ID/trigger" \
    -H "Authorization: Bearer $EXA_API_KEY"

  curl -s "https://api.exa.ai/monitors/$MONITOR_ID/runs?limit=1" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

运行状态包括：

| 状态          | 含义                      |
| ----------- | ----------------------- |
| `pending`   | 运行已排队等待                 |
| `running`   | 运行正在执行                  |
| `completed` | 运行已完成；可按 ID 获取以读取其完整输出  |
| `failed`    | 运行失败；`failReason` 会说明原因 |
| `cancelled` | 运行已取消                   |

运行完成之前，`output` 均为 null。

<div id="schedule-runs">
  ## Schedule 运行
</div>

最小 interval 为一小时。请使用单一时长，例如 `1h`、`6h`、`1d` 或 `7d`。schedule 以 monitor 的创建时间为基准：下午 2:30 创建的每日 monitor 会在每天下午 2:30 左右运行，但每次运行最多可能延迟 30 分钟，因此请勿依赖精确的时钟送达时间。

省略 `trigger` 即可创建仅支持手动触发的 monitor。暂停已设置 schedule 的 monitor 会停止自动运行，但手动触发仍然可用。

<Note>
  Monitor 的运行不会重叠。如果下一次按 schedule 安排的运行开始时上一次运行仍在进行，Exa 会取消上一次运行。
</Note>

<div id="receive-webhook-updates">
  ## 接收 webhook 更新
</div>

如果你只需要已完成的运行，请订阅 `monitor.run.completed`。若省略 `events`，Exa
还会发送 monitor 生命周期事件和运行创建事件。

已完成运行的负载包含运行状态和输出。可选的 monitor `metadata` 会在 webhook 投递中
原样回传，便于你将更新路由回对应的客户、
工作区、频道或内部作业。

<Accordion title="已完成运行的 webhook 负载">
  下方的输出和时间戳已作缩略处理。

  ```json theme={null}
  {
    "id": "event_...",
    "object": "event",
    "type": "monitor.run.completed",
    "data": {
      "id": "01k...",
      "monitorId": "01k...",
      "status": "completed",
      "output": {
        "results": [
          {
            "title": "New battery recycling facility announced",
            "url": "https://example.com/announcement"
          }
        ],
        "content": "...",
        "grounding": [
          {
            "field": "content",
            "citations": [
              {
                "title": "New battery recycling facility announced",
                "url": "https://example.com/announcement"
              }
            ],
            "confidence": "high"
          }
        ]
      },
      "failReason": null,
      "metadata": {
        "workspace_id": "workspace_123"
      }
    },
    "createdAt": "2026-09-05T20:00:00.000Z"
  }
  ```
</Accordion>

<Warning>
  你的 webhook 必须使用 HTTPS，并且必须是最终目标地址，因为系统不会跟随重定向。
  处理事件前请先验证 `Exa-Signature`。
</Warning>

每次投递都会带有一个 `Exa-Signature` header，格式为 `t=<timestamp>,v1=<signature>`。
请构造 `<timestamp>.<raw-request-body>`，使用一次性的
`webhookSecret` 计算其 HMAC-SHA256 摘要，再以常量时间比较的方式将结果与 `v1` 进行比对。

<CodeGroup>
  ```python Python theme={null}
  import hashlib
  import hmac


  def verify_webhook(payload: bytes, signature_header: str, secret: str) -> bool:
      parts = dict(part.split("=", 1) for part in signature_header.split(","))
      signed_payload = parts["t"].encode() + b"." + payload
      expected = hmac.new(secret.encode(), signed_payload, hashlib.sha256).hexdigest()
      return hmac.compare_digest(expected, parts["v1"])
  ```

  ```javascript JavaScript theme={null}
  import crypto from "crypto";

  function verifyWebhook(payload, signatureHeader, secret) {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((part) => part.split("=", 2))
    );
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${parts.t}.`)
      .update(payload)
      .digest("hex");
    const actualBuffer = Buffer.from(parts.v1 ?? "", "hex");
    const expectedBuffer = Buffer.from(expected, "hex");

    return (
      actualBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    );
  }
  ```
</CodeGroup>

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="创建 monitor" icon="bell" href="/zh/docs/reference/monitors/create-a-monitor" cta="打开参考文档" arrow="true">
    了解 search、schedule、输出、元数据和 webhook 的全部 field。
  </Card>

  <Card title="Monitor 运行" icon="clock" href="/zh/docs/reference/monitors/runs/get-a-run" cta="打开参考文档" arrow="true">
    查看某次运行的状态、输出、grounding 和失败原因。
  </Card>

  <Card title="Search 指南" icon="search" href="/zh/docs/search/quickstart" cta="打开指南" arrow="true">
    配置查询、过滤条件、highlights、full text 和新鲜度。
  </Card>

  <Card title="Search 最佳实践" icon="sparkles" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    在保持输出聚焦的同时提升 retrieval 质量。
  </Card>
</Columns>