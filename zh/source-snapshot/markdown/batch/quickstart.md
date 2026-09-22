> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

# Batch API {#batch-api}

> 以批次形式异步运行 Exa API 请求。

<Info>
  Batch API 面向 Enterprise 客户开放，需由 Exa 为你的团队启用后方可使用。请联系 [sales@exa.ai](mailto:sales@exa.ai) 洽谈 Enterprise 访问与启用事宜。
</Info>

Batch API 让你一次性提交大量 Exa API 请求，并在稍后以 JSONL 文件形式获取结果。你无需逐个发送数千个请求，也无需自行管理速率限制和重试，只需提交一个批次、轮询其状态，然后一次性下载包含全部结果的文件。

它适用于离线增强、数据回填，或任何无需即时响应的作业。完整的请求和响应 schema 请参见 [API 参考](/zh/docs/reference/batches/create-a-batch)。

<Note>
  Batch API 目前处于 beta 阶段。请在每个请求中包含 `Exa-Beta: batches-2026-06-06` header。
</Note>

## 支持的请求 {#supported-requests}

批次中的每个项目必须是发送到以下路由之一的 `POST` 请求：

| 路由            | 适用场景               |
| ------------- | ------------------ |
| `/search`     | 异步运行 Exa search 请求 |
| `/agent/runs` | 异步运行 Exa Agent 请求  |

每个项目都需要一个在批次内唯一的 `customId`。结果文件中会返回相同的 `customId`，便于你将输出行对应回输入数据。

## 创建批次 {#create-a-batch}

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

<Accordion title="响应示例">
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

## 检查状态 {#check-status}

轮询该批次，直到其进入终止状态：

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

批次状态包括：

| 状态            | 含义                |
| ------------- | ----------------- |
| `in_progress` | 批次正在运行            |
| `completed`   | 所有请求均已完成，结果可供获取   |
| `cancelling`  | 已发起取消，正在处理完进行中的任务 |
| `cancelled`   | 该批次已取消            |
| `expired`     | 结果已不再可用           |

批次完成后，`resultsUrl` 会包含 JSONL 结果文件的下载 URL，`expiresAt` 则为结果保留期的截止时间。

<Warning>
  `resultsUrl` 是有效期很短的预签名 URL。每次需要重新下载结果时，请重新获取该批次以取得新的 URL。
</Warning>

## 列出批次 {#list-batches}

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

`completed` 是唯一支持的值；传入其他任何值都会返回错误。已完成的列表按过期时间排序，并使用独立的 cursor，因此每一页请求都需带上 `status=completed`——已完成状态的 cursor 与未过滤的 cursor 不可互换。

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

## 下载结果 {#download-results}

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

JSONL 的每一行都包含原始的 `customId`，以及 `response` 或 `error` 二者之一：

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

## 取消批次 {#cancel-a-batch}

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

## 删除批次 {#delete-a-batch}

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

## 访问权限 {#access}

如需为团队启用 Batch API，请联系 [sales@exa.ai](mailto:sales@exa.ai)。