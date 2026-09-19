> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="security-overview">
  # 安全概览
</div>

> Exa 的安全、合规与区域访问信息。

***

Exa 高度重视数据安全与隐私。我们已通过 SOC 2 Type II 认证，这体现了我们对严格的信息安全实践与管控措施的持续投入。

如果您对[零数据留存](/zh/docs/admin/security/zero-data-retention)、[HIPAA 合规](/zh/docs/admin/security/hipaa)或其他定制化数据安全方案感兴趣，欢迎通过 [sales@exa.ai](mailto:sales@exa.ai) 联系我们，洽谈企业版方案。

访问我们的[信任中心](https://trust.exa.ai)，即可查看 SOC 2 报告、数据处理协议及其他安全文档。

<div id="regional-access-restrictions">
  ## 区域访问限制
</div>

为遵守制裁与贸易管制规定，Exa 会阻止来自受制裁或其他受限国家和地区的 API 访问，包括克里米亚、古巴、伊朗、朝鲜、俄罗斯、叙利亚、乌克兰和委内瑞拉。

来自这些地区的请求可能在到达 Exa 之前就被 Cloudflare 拦截。此时返回的可能是带有 Ray ID 的 Cloudflare WAF 拦截页面，而非标准的 Exa API 错误 JSON。

如果你认为自己的流量存在地理定位错误，请发送邮件至 [hello@exa.ai](mailto:hello@exa.ai) 联系我们，并提供源 IP 地址、国家或地区、请求时间戳以及 Cloudflare Ray ID。