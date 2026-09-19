> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="hipaa">
  # HIPAA
</div>

> 为符合条件的缓存检索请求启用 HIPAA 合规模式。

<Info>
  HIPAA 合规功能面向企业版客户提供，需由 Exa 为你的团队开通。如需了解企业版访问权限、BAA 要求及开通事宜，请联系 [sales@exa.ai](mailto:sales@exa.ai)。
</Info>

HIPAA 模式通过顶层 `compliance` 字段按请求控制：

```json theme={null}
{
  "compliance": "hipaa"
}
```

当符合条件的团队在请求中包含该字段时，Exa 会按照 HIPAA 合规控制要求处理该请求。如果你的团队未启用该功能，API 将返回 `403 FEATURE_DISABLED`。

HIPAA 模式会对这些请求启用[零数据保留](/zh/docs/admin/security/zero-data-retention)：Exa 不会留存 PHI。

<div id="supported-endpoints">
  ## 支持的端点
</div>

以下端点可识别 `compliance` 字段：

* [`/search`](/zh/docs/reference/search)
* [`/contents`](/zh/docs/reference/get-contents)

其他端点会拒绝该字段。

<div id="requirements">
  ## 要求
</div>

HIPAA 模式仅支持缓存检索。兼容的请求：

* 调用 `/search` 时，将 `type` 设为 `instant` 或 `fast`
* 请求 `text` 或 `highlights` (而非 `summary`)
* 仅使用缓存内容：省略新鲜度相关字段，或在 `/contents` 中设置 `maxAgeHours: -1`

不兼容的请求会返回 `400 INVALID_REQUEST_BODY`，包括：

* 在 `/contents` 中使用 `summary`，或在 `/search` 中使用 `contents.summary`
* 需要实时抓取的新鲜度设置，例如 `maxAgeHours: 0` 或正值的 `maxAgeHours`
* 未指定 `type`，或使用 `instant`、`fast` 以外类型的搜索请求

<div id="example">
  ## 示例
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "urls": ["https://example.com/article"],
      "compliance": "hipaa",
      "highlights": true,
      "maxAgeHours": -1
    }'
  ```
</CodeGroup>

<div id="access">
  ## 访问权限
</div>

如需为你的团队启用 HIPAA 模式，请联系 [sales@exa.ai](mailto:sales@exa.ai)。有关 Exa 的安全文档，请参阅 [Trust Center](https://trust.exa.ai)。