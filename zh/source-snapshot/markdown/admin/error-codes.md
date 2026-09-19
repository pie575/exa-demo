> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="error-codes">
  # 错误代码
</div>

> Exa API 常见错误代码参考

Exa API 通过标准 HTTP 状态码和 JSON 错误响应体来表示请求失败。

<div id="http-status-codes">
  ## HTTP 状态码
</div>

| 状态码                         | 含义                                                  | 处理方式                                        |
| --------------------------- | --------------------------------------------------- | ------------------------------------------- |
| `400` Bad Request           | 请求体、查询参数、请求头或选项组合无效。                                | 根据返回的错误信息修正请求。                              |
| `401` Unauthorized          | API key 缺失或无效。                                      | 检查身份验证 header 和 API key。                    |
| `402` Payment Required      | 积分已耗尽或超出支出预算。                                       | [充值积分](https://dashboard.exa.ai)或联系团队管理员。   |
| `403` Forbidden             | 该 API key 无权访问所请求的功能，或请求被策略拦截。                      | 查看返回的错误信息，并确认所属套餐是否包含该功能。                   |
| `404` Not Found             | 路由或所请求的资源不存在。                                       | 检查端点和资源 ID。                                 |
| `409` Conflict              | 请求与现有状态冲突——例如已存在具有相同 `externalId` 的 Webset。         | 获取已有资源或改用其他标识符。                             |
| `422` Unprocessable Entity  | Websets 预览 query 无法拆解为有效的实体和 criteria。              | 重新表述预览 query。                               |
| `429` Too Many Requests     | 你的 API key、团队或网络超出了速率限制或 concurrency 限制。            | 降低请求速率；若返回了 `Retry-After`，请等待相应秒数，否则采用指数退避。 |
| `500` Internal Server Error | 发生了意外的服务器错误。                                        | 稍等片刻后重试。若问题持续，请联系支持团队。                      |
| `503` Service Unavailable   | Exa 暂时过载 (`SERVICE_OVERLOADED`) 或不可用。该请求未被处理，也不会计费。 | 采用指数退避重试。这与你的请求速率无关，因此降低速率无济于事——只能靠重试。      |
| `504` Gateway Timeout       | 请求超出了处理时限。                                          | 重试请求或缩小其 scope。                             |

<Note>
  `/contents` 中 URL 级别的失败会在成功的 `200` 响应的 `statuses` 字段中返回，而不是作为请求级别的错误返回。参见[内容抓取状态标记](#content-fetch-status-tags)。
</Note>

<div id="error-response-structure">
  ## 错误响应结构
</div>

错误响应会返回 `requestId`、便于人工阅读的 `error` 消息，以及便于程序解析的 `tag`：

```json theme={null}
{
  "requestId": "67207943fab9832d162b5317f4cca830",
  "error": "Invalid request body | Validation error: Invalid value for type",
  "tag": "INVALID_REQUEST_BODY"
}
```

<Note>
  联系支持团队时请附上 `requestId`，以便更快排查问题。
</Note>

标签集合是开放式的，标签名称本身即可说明其含义。请先根据 HTTP 状态码进行分支处理，并将无法识别的标签视为补充信息，而非解析失败。

<div id="common-error-tags">
  ## 常见错误标签
</div>

<div id="account-billing-and-access">
  ### 账户、计费与访问
</div>

| 标签                        | HTTP 状态码 | 说明                                                              |
| ------------------------- | -------- | --------------------------------------------------------------- |
| `INVALID_API_KEY`         | `401`    | API key 缺失、为空或无效。                                               |
| `NO_MORE_CREDITS`         | `402`    | 账户积分已用尽 —— 请前往 [dashboard.exa.ai](https://dashboard.exa.ai) 充值。 |
| `API_KEY_BUDGET_EXCEEDED` | `402`    | 该 API key 已超出其支出预算 —— 请联系团队管理员。                                 |
| `TEAM_BUDGET_EXCEEDED`    | `402`    | 团队已超出当前计费周期的支出预算。                                               |
| `FEATURE_DISABLED`        | `403`    | 所请求的端点、search 类型或选项未在你的套餐中启用。                                   |
| `PROHIBITED_CONTENT`      | `403`    | 请求被内容安全审核拒绝。                                                    |
| `CONTENT_FILTER_ERROR`    | `403`    | 内容在处理过程中被安全策略拒绝。                                                |
| `RATE_LIMIT_EXCEEDED`     | `429`    | 你的 API key、团队或网络已触及各自的速率限制 —— 请降低请求频率。                          |
| `SERVICE_OVERLOADED`      | `503`    | Exa 暂时超载，已在处理前丢弃该请求 —— 请使用指数退避策略重试。                             |

<div id="request-validation">
  ### 请求校验
</div>

| 标签                        | HTTP 状态码 | 说明                                           |
| ------------------------- | -------- | -------------------------------------------- |
| `INVALID_REQUEST_BODY`    | `400`    | JSON 请求体未通过 schema 校验。                       |
| `INVALID_REQUEST`         | `400`    | 选项之间相互冲突，或使用了 beta 功能但未附带 `Exa-Beta` header。 |
| `INVALID_NUM_RESULTS`     | `400`    | 请求 highlights 时，`numResults` 必须 ≤ 100。       |
| `NUM_RESULTS_EXCEEDED`    | `400`    | 请求的结果数量超出了你所在套餐的限制。                          |
| `INVALID_JSON_SCHEMA`     | `400`    | 提供的输出 schema 无效。                             |
| `SUBPAGES_LIMIT_EXCEEDED` | `400`    | `/contents` 每次请求最多支持 100 个子页面。               |

<div id="payment-protocols">
  ### 支付协议
</div>

通过 x402 或 MPP 支付的请求还可能返回：

| 标签                         | HTTP 状态码 | 描述                  |
| -------------------------- | -------- | ------------------- |
| `X402_PAYMENT_REQUIRED`    | `402`    | 需要付款。               |
| `X402_INVALID_SIGNATURE`   | `400`    | x402 支付签名无效。        |
| `X402_VERIFICATION_FAILED` | `402`    | 无法验证 x402 付款。       |
| `MPP_VERIFICATION_FAILED`  | `402`    | 无法验证 MPP 付款。        |
| `X402_TOO_MANY_UNPAID`     | `429`    | 等待付款的 x402 请求过多。    |
| `X402_WALLET_RATE_LIMITED` | `429`    | x402 钱包已超出速率限制。     |
| `X402_INTERNAL_ERROR`      | `500`    | Exa 无法创建 x402 支付要求。 |

<div id="content-fetch-status-tags">
  ## 内容抓取状态标记
</div>

当 `/contents` 接收多个 URL 时，可能出现部分 URL 失败、其余成功的情况。URL 级别的失败会通过 `statuses` 字段返回，不会导致整个请求失败：

```json theme={null}
{
  "results": [],
  "statuses": [
    {
      "id": "https://example.com",
      "status": "error",
      "error": {
        "tag": "CRAWL_NOT_FOUND",
        "httpStatusCode": 404
      }
    }
  ]
}
```

`httpStatusCode` 描述的是目标页面，而非 `/contents` 的响应。

| 标签                        | 说明                                | 处理方式                                     |
| ------------------------- | --------------------------------- | ---------------------------------------- |
| `CRAWL_NOT_FOUND`         | 未找到目标页面。                          | 确认 URL 正确且可访问。                           |
| `CRAWL_HTTP_{status}`     | 目标返回 HTTP 错误，例如 `CRAWL_HTTP_403`。 | 按标签中嵌入的目标状态码进行处理。                        |
| `CRAWL_TIMEOUT`           | 抓取目标页面时超时。                        | 重试请求或稍后再试。                               |
| `CRAWL_LIVECRAWL_TIMEOUT` | 实时抓取超出了你设置的 `livecrawlTimeout`。   | 调大 `livecrawlTimeout` 或调整 `maxAgeHours`。 |
| `SOURCE_NOT_AVAILABLE`    | 该源禁止访问，或该源不可用。                    | 检查该源是否需要身份验证或存在访问限制。                     |
| `UNSUPPORTED_URL`         | 内容抓取不支持该 URL 协议。                  | 请使用标准的 HTTP 或 HTTPS URL。                 |
| `CRAWL_UNKNOWN_ERROR`     | 抓取因其他原因失败。                        | 重试请求；若持续出现，请联系支持团队。                      |

这些状态标签仅适用于 `/contents`；`/search` 不会返回 `statuses` 字段。

<div id="getting-help">
  ## 获取帮助
</div>

* 当 `500`、`503` 或 `504` 错误持续出现时，请查看 [Exa Status](/zh/docs/admin/status)。
* 查看[速率限制](/zh/docs/admin/billing#rate-limits)了解当前的限制值。
* 查阅该端点的 [API 参考](/zh/docs/reference/search)，了解请求要求。
* 联系 [hello@exa.ai](mailto:hello@exa.ai)，并提供响应状态、错误响应体和 `requestId`。