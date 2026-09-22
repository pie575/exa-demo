> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="hipaa">
  # HIPAA
</div>

> 为符合条件的缓存检索请求启用 HIPAA 合规模式。

<Info>
  HIPAA 合规功能面向 Enterprise 客户提供，需由 Exa 为你的团队开启。请联系 [sales@exa.ai](mailto:sales@exa.ai) 洽谈 Enterprise 权限、BAA 要求及开通事宜。
</Info>

HIPAA 模式通过顶层的 `compliance` field 按请求单独控制：

```json theme={null}
{
  "compliance": "hipaa"
}
```

当符合条件的团队在请求中包含该 field 时，Exa 会使用 HIPAA 合规控制措施来处理该请求。如果您的团队未启用此功能，API 将返回 `403 FEATURE_DISABLED`。

HIPAA 模式为这些请求提供 [Zero Data Retention](/zh/docs/admin/security/zero-data-retention)：Exa 不会保留 PHI。

<div id="supported-endpoints">
  ## 支持的端点
</div>

以下端点可识别 `compliance` field：

* [`/search`](/zh/docs/reference/search)
* [`/contents`](/zh/docs/reference/get-contents)

其他端点会拒绝该 field。

<div id="requirements">
  ## 要求
</div>

HIPAA 模式仅支持缓存检索。兼容的请求：

* 在 `/search` 上，将 `type` 设置为 `instant` 或 `fast`
* 请求 `text` 或 `highlights` (而非 `summary`)
* 仅使用缓存内容：省略新鲜度相关 field，或在 `/contents` 上设置 `maxAgeHours: -1`

不兼容的请求会返回 `400 INVALID_REQUEST_BODY`，包括：

* 在 `/contents` 上使用 `summary`，或在 `/search` 上使用 `contents.summary`
* 需要实时抓取的新鲜度设置，例如 `maxAgeHours: 0` 或正数的 `maxAgeHours`
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