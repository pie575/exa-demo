> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="monitors-api">
  # Monitors API
</div>

> 定期运行 search，并通过 webhook 接收新发现的结果。

Monitor 会按设定的周期运行 Exa search，并将结果投递到 webhook 端点。

使用 Monitor 可持续跟踪新闻、竞品动态、融资轮次、监管变化、研究成果发布，或任何随时间变化的主题。

<div id="how-monitors-work">
  ## Monitors 的工作原理
</div>

每次运行时，Exa 会执行配置好的 search，按时间进行过滤，剔除该 monitor 此前已返回过的结果或发现，然后将新的输出发送到你的 webhook。

每个 monitor 都有各自独立的运行历史，因此请围绕你希望持续跟踪的信号来编写 query，而不必自己去设置滚动的日期范围。

<div id="create-your-first-monitor">
  ## 创建你的第一个 monitor
</div>

创建一个 monitor，指定 search query、运行间隔以及用于接收更新的 HTTPS 端点：

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

创建 monitor 时请妥善保存 `webhookSecret`。它只返回一次，验证 webhook 签名时必须用到。

<div id="configure-the-output">
  ## 配置输出
</div>

每次运行完成后，都会在 `output.results` 中返回新发现的页面。

Exa 还会将各个页面中的发现汇总到 `output.content` 中：

| 输出形态       | 使用方式                 | 返回值                                 |
| ---------- | -------------------- | ----------------------------------- |
| 文本 summary | 默认                   | `output.content` 中的字符串              |
| 结构化 JSON   | 添加 `outputSchema` 对象 | `output.content` 中符合该 schema 的 JSON |

汇总字段的来源会自动在 `output.grounding` 中返回。

若下游代码需要固定的字段结构，请添加 `outputSchema`：

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

不要将引用和置信度写入 schema。它们会单独在
`output.grounding` 中返回。

<div id="add-page-content">
  ## 添加页面内容
</div>

`search` 接受与 [Exa Search](/zh/docs/search/quickstart) 相同的选项：用 `contents` 为每条结果附带
highlights、全文或摘要，用 `includeDomains` 或 `excludeDomains`
限定来源范围。

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

无需等到下一次计划运行时间，可立即触发一次运行，然后列出该 monitor 的运行记录：

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

| 状态          | 含义                       |
| ----------- | ------------------------ |
| `pending`   | 运行已排队等待                  |
| `running`   | 运行正在执行                   |
| `completed` | 运行已完成；可按 ID 获取以读取完整输出    |
| `failed`    | 运行失败；`failReason` 说明失败原因 |
| `cancelled` | 运行已取消                    |

在运行完成之前，`output` 为 null。

<div id="schedule-runs">
  ## 调度运行
</div>

最小间隔为一小时。请使用单一时长，例如 `1h`、`6h`、`1d` 或 `7d`。调度以 monitor 的创建时间为基准——在下午 2:30 创建的每日 monitor 会在每天下午 2:30 前后运行——但每次运行可能会延迟最多 30 分钟，因此请勿依赖精确的实际执行时间。

省略 `trigger` 即可创建仅支持手动触发的 monitor。暂停已调度的 monitor 会停止自动运行，但手动触发仍然可用。

<Note>
  Monitor 的运行不会重叠。如果上一次运行尚未结束，下一次调度运行就已启动，Exa 会取消上一次运行。
</Note>

<div id="receive-webhook-updates">
  ## 接收 webhook 更新
</div>

如果你只关心已完成的运行，请订阅 `monitor.run.completed`。若省略 `events`，Exa
还会发送 monitor 生命周期事件以及运行创建事件。

已完成运行的 payload 包含运行状态和输出。monitor 的可选 `metadata` 会在 webhook
投递中原样返回，便于你将更新路由回对应的客户、工作区、频道或内部任务。

<Accordion title="已完成运行的 webhook payload">
  以下示例中的输出和时间戳已作精简。

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
  你的 webhook 必须使用 HTTPS，并且本身就是最终地址，因为系统不会跟随重定向。
  处理事件前请先验证 `Exa-Signature`。
</Warning>

每次投递都会包含一个 `Exa-Signature` header，格式为 `t=<timestamp>,v1=<signature>`。
请构造 `<timestamp>.<raw-request-body>`，用一次性的 `webhookSecret` 计算其
HMAC-SHA256 摘要，然后用常量时间比较将结果与 `v1` 比对。

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
  <Card title="创建 monitor" icon="bell" href="/zh/docs/reference/monitors/create-a-monitor" cta="查看参考文档" arrow="true">
    了解 search、调度、输出、元数据和 webhook 的全部字段。
  </Card>

  <Card title="Monitor 运行" icon="clock" href="/zh/docs/reference/monitors/runs/get-a-run" cta="查看参考文档" arrow="true">
    查看某次运行的状态、输出、grounding 和失败原因。
  </Card>

  <Card title="Search 指南" icon="search" href="/zh/docs/search/quickstart" cta="查看指南" arrow="true">
    配置查询、筛选条件、highlights、全文和时效性。
  </Card>

  <Card title="Search 最佳实践" icon="sparkles" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    在保持输出聚焦的同时提升检索质量。
  </Card>
</Columns>