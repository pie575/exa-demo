> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

# 从 CSV 导入 {#import-from-csv}

> 将你现有的 CSV 数据转换为 Webset

<br />

## 概述 {#overview}

“从 CSV 导入”功能可以将你现有的、包含 URL 的 CSV 文件转换为功能完备的 Websets。如果你已经有一份网站、公司或资源清单，希望为其丰富更多数据，或应用 search criteria 进行筛选，这个功能再合适不过。

<br />

<div id="overview">
  ## 工作原理 {#how-it-works}
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="CSV import flow for creating a Webset" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. 点击 “Start from CSV”，选择你的 CSV 文件
2. 选择包含待分析 URL 的列
3. 继续操作前，先确认数据的导入方式
4. 你的 URL 将被转换为带有增强和元数据的 Webset

<br />

<div id="how-it-works">
  ## CSV 准备 {#csv-preparation}
</div>

确保你的 CSV 文件包含一个 URL 列

* 对于 People search：URL 必须是 LinkedIn 个人主页 URL (例如 [https://linkedin.com/in/username](https://linkedin.com/in/username))
* 对于 Company search：URL 必须是公司主页 URL (例如 [https://example.com](https://example.com))
* 对于其他 search：可使用任意类型的 URL

如果你没有 URL，Websets 会根据 CSV 每一行中的信息以及你提供的额外信息，尝试推断出 URL。

可导入的 result 数量上限取决于你的 plan。

<div id="csv-preparation">
  ## 接下来会发生什么？ {#what-happens-next}
</div>

导入完成后，你的 CSV 将成为一个完整的 Webset，你可以在其中：

### 使用自定义列进行增强 {#enrich-with-custom-columns}

为每个 URL 添加你需要的任意信息：

* 联系方式 (邮箱、电话号码) 
* 公司指标 (营收、员工人数) 
* 内容分析 (情感倾向、主题、摘要)
* 贴合你具体使用场景的自定义数据

<div id="enrich-with-custom-columns">
  ### 应用搜索条件 {#apply-search-criteria}
</div>

根据特定 criteria 筛选导入的 URL：

* 公司阶段或规模
* 行业或领域
* 地理位置
* 内容类型或主题