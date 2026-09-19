> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="import-from-csv">
  # 从 CSV 导入
</div>

> 将已有的 CSV 数据转换为 Webset

<br />

<div id="overview">
  ## 概述
</div>

从 CSV 导入功能可将你现有的、包含 URL 的 CSV 文件转换为功能完备的 Websets。如果你已经有一份网站、公司或资源清单，想为其补充更多数据，或用 criteria 进行筛选，这个功能再合适不过。

<br />

<div id="how-it-works">
  ## 工作原理
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="CSV import flow for creating a Webset" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. 点击 &quot;Start from CSV&quot;，选择你的 CSV 文件
2. 选择包含待分析 URL 的列
3. 继续操作前，先确认数据的导入方式
4. 你的 URL 将被转换为一个 Webset，并附带 enrichment 和元数据

<br />

<div id="csv-preparation">
  ## CSV 准备
</div>

确保你的 CSV 文件包含 URL 列

* People 搜索：URL 必须是 LinkedIn 个人资料链接 (例如 [https://linkedin.com/in/username](https://linkedin.com/in/username)) 
* Company 搜索：URL 必须是公司主页链接 (例如 [https://example.com](https://example.com)) 
* 其他搜索：可使用任意类型的 URL

如果没有 URL，Websets 会根据 CSV 每一行中的信息以及你提供的额外信息尝试推断 URL。

可导入的结果数量上限取决于你的套餐。

<div id="what-happens-next">
  ## 接下来会发生什么？
</div>

导入完成后，你的 CSV 将成为一个完整的 Webset，你可以在其中：

<div id="enrich-with-custom-columns">
  ### 使用自定义列丰富数据
</div>

为每个 URL 添加你需要的任何信息：

* 联系方式 (邮箱、电话号码) 
* 公司指标 (营收、员工人数) 
* 内容分析 (情感、主题、摘要) 
* 贴合你具体使用场景的自定义数据

<div id="apply-search-criteria">
  ### 应用搜索 criteria
</div>

根据特定 criteria 筛选导入的 URL：

* 公司阶段或规模
* 行业或领域
* 地理位置
* 内容类型或主题