> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件查看所有可用页面。

<div id="batch-api">
  # Batch API
</div>

> 以批量方式异步运行 Exa API 请求。

<Info>
  Batch API 仅面向企业客户开放，需由 Exa 为你的团队启用后方可使用。如需了解企业版访问与开通事宜，请联系 [sales@exa.ai](mailto:sales@exa.ai)。
</Info>

Batch API 让你一次性提交大量 Exa API 请求，并在稍后以 JSONL 文件的形式获取结果。你无需发送数千个单独请求、自行管理速率限制和重试，只需提交一个批次、轮询其状态，即可在单个文件中下载全部结果。

它适用于离线 enrichment、数据回填，以及任何无需即时响应的任务。完整的请求与响应结构详见 [API 参考](/zh/docs/reference/batches/create-a-batch)。

<Note>
  Batch API 目前处于 beta 阶段。请在每个请求中包含 `Exa-Beta: batches-2026-06-06` header。
</Note>

<div id="supported-requests">
  ## 支持的请求
</div>

批次中的每个项目都必须是发往以下路由之一的 `POST` 请求：

| 路由            | 使用场景               |
| ------------- | ------------------ |
| `/search`     | 异步运行 Exa search 请求 |
| `/agent/runs` | 异步运行 Exa Agent 请求  |

每个项目都需要一个在批次内唯一的 `customId`。结果文件中会返回相同的 `customId`，便于你将输出行对应回输入数据。

<div id="create-a-batch">
  ## 创建批次
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/batches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06" \
    -H "Content-Type: application/json" \
    -d '{
      "requests": [
        {
          "customId": "row-1",
          "method": "POST",
          "url": "/search",
          "body": {
            "query": "Latest AI infrastructure funding rounds"
          }
        },
        {
          "customId": "row-2",
          "method": "POST",
          "url": "/agent/runs",
          "body": {
            "query": "Summarize recent vector database launches"
          }
        }
      ],
      "metadata": {
        "project": "weekly-digest"
      }
    }'
  ```
</CodeGroup>

响应中包含批次 ID 和初始状态：

<Accordion title="示例响应">
  ```json theme={null}
  {
    "id": "batch_01j7x9v0m2n4p6q8r0s2t4v6w8",
    "object": "batch",
    "status": "in_progress",
    "requestCounts": {
      "total": 2,
      "completed": 0,
      "failed": 0
    },
    "createdAt": "2026-06-06T12:00:00.000Z",
    "expiresAt": null,
    "endedAt": null,
    "resultsUrl": null,
    "metadata": {
      "project": "weekly-digest"
    }
  }
  ```
</Accordion>

<div id="check-status">
  ## 查看状态
</div>

轮询该批次任务，直到其进入终止状态：

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

批次状态包括：

| 状态            | 含义                 |
| ------------- | ------------------ |
| `in_progress` | 批次正在运行            |
| `completed`   | 所有请求均已完成，结果可供下载    |
| `cancelling`  | 已发起取消，正在等待进行中的任务收尾 |
| `cancelled`   | 批次已取消             |
| `expired`     | 结果已不再可用            |

批次完成后，`resultsUrl` 会包含 JSONL 结果文件的下载链接，`expiresAt` 则为结果保留期的截止时间。

<Warning>
  `resultsUrl` 是有效期很短的预签名 URL。每次需要重新下载结果时，请重新获取该批次，以拿到新的 URL。
</Warning>

<div id="list-batches">
  ## 列出批次
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches?limit=100" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

响应采用 cursor 分页：`data` 中最多包含 `limit` 个批次；当 `hasMore` 为 `true` 时，将 `nextCursor` 作为 `cursor` 查询参数传入即可获取下一页。

传入 `status=completed` 可仅列出已完成的批次：

```bash theme={null}
curl -s "https://api.exa.ai/batches?status=completed" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Exa-Beta: batches-2026-06-06"
```

`completed` 是唯一受支持的值；传入其他任何值都会返回错误。已完成的条目按到期时间排序，并使用独立的 cursor，因此每一页请求都需带上 `status=completed`——已完成列表的 cursor 与未过滤列表的 cursor 不可互换。

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

<div id="download-results">
  ## 下载结果
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

JSONL 的每一行都包含原始的 `customId`，以及 `response` 或 `error` 之一：

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

<div id="cancel-a-batch">
  ## 取消批次任务
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="delete-a-batch">
  ## 删除批次
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="access">
  ## 访问权限
</div>

如需为团队启用 Batch API，请联系 [sales@exa.ai](mailto:sales@exa.ai)。