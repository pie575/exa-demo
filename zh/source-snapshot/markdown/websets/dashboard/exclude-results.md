> ## 文档索引 {#documentation-index}
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

# Exclude Results {#exclude-results}

> 通过排除以往 Websets 或 CSV 文件中的 URL，避免新的 search 出现重复结果。

<br />

## 概览 {#overview}

Exclude Results 功能可确保你在创建新 search 时不会出现重复的 result。通过基于以往的 Websets 或上传的 CSV 文件指定要排除的 URL，你可以专注于发现全新的、不重复的 result，作为现有数据的补充。

<br />

## 工作原理 {#how-it-works}

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/exclude-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=b28ac0441991bc4543571ffc2a900963" alt="Exclude results options when creating a Webset" width="1466" height="857" data-path="images/websets/exclude-flow.png" />

1. 开始创建一个新的 Webset
2. 在侧边面板的 criteria 下方，点击 &quot;Exclude&quot;
3. 从以往的 Websets 中选择，或上传包含待排除 URL 的 CSV 文件。可同时选择多个来源进行排除。
4. 启动 search，结果中只会包含未命中 exclusions 的新内容

可排除的结果数量上限取决于你的 plan。

<br />

## 何时使用 exclusions {#when-to-use-exclusions}

* 查找尚未录入 CRM 的潜在客户
* 用优化后的 criteria 对以往的 search 进行跟进
* 排除你已经知晓的结果