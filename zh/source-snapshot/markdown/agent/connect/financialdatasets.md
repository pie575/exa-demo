> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="financial-datasets">
  # Financial Datasets
</div>

> 覆盖 27,000 多个美股股票代码的结构化金融与市场数据：价格、基本面、财报、SEC 备案文件、持股情况以及股票筛选。

[Financial Datasets](https://financialdatasets.ai) 为 AI agent 提供可直接被机器读取的
公司与市场数据。借助
[Exa Connect](/zh/docs/agent/connect/overview)，agent 可以获取
实时与历史价格、公司概况、财务报表与
估值指标、财报、内部人士与机构持股、SEC 备案文件
及其章节内容、公司新闻，还能按基本面
指标筛选美国市场。

在 [Exa Agent](/zh/docs/agent/quickstart) 运行中附加 `financial_datasets`，
agent 便会在进行 Exa 网页搜索的同时查询 Financial Datasets。

<div id="use-it-for">
  ## 适用场景
</div>

* 构建结构化的公司研究 快照。
* 分析财务表现、估值与历史趋势。
* 阅读 SEC 备案文件，提取风险因素、MD&amp;A 等章节内容。
* 分析内部人士交易与机构持股情况。
* 按基本面指标筛选美国市场标的。
* 跟踪公司新闻与相关动态。

<div id="data-available">
  ## 可用数据
</div>

以下每个数据集都可通过 `financial_datasets` 提供方获取；agent 会自行选择最适合当前任务的数据集：

| 数据集        | 返回内容                                                         |
| ---------- | ------------------------------------------------------------ |
| 受益所有权      | 来自 Schedule 13D/13G 的 5% 以上受益所有人，包括主动型和被动型持股。                |
| 公司概况       | 名称、板块、行业、交易所、所在地、SEC CIK、SIC 分类。                             |
| 公司新闻       | 某个股票代码的近期新闻报道。                                               |
| 财报         | 季度营收与每股收益，含同比变化以及超预期/不及预期情况。                                 |
| 财务指标       | 市值、企业价值、市盈率、市净率、市销率、EV/EBITDA、PEG、利润率、ROE/ROA/ROIC、增长率、每股收益。 |
| 财务报表       | 来自 SEC 备案文件的利润表、资产负债表和现金流量表。                                 |
| 历史股价       | 指定日期区间内的 OHLCV K 线，支持日/周/月/年粒度。                              |
| 指数基金持仓     | 按权重列出的 ETF/指数基金成分股，或持有某只证券的基金。                               |
| 内部人士持股     | 来自 SEC Form 3 和 Form 5 的内部人士持股 (高管、董事、10% 股东所持股份) 。          |
| 内部人士交易     | SEC Form 4 内部人士交易 (姓名、角色、类型、股数、金额) 。                         |
| 机构持股       | 13F 机构持有人、持股数量及申报价值。                                         |
| 利率         | 当前及历史央行政策利率 (美联储、欧洲央行、日本央行等) 。                               |
| SEC 备案文件条目 | 特定 10-K/10-Q/8-K 条目的抽取文本 (如风险因素、MD&amp;A) 。                  |
| SEC 备案文件   | 备案元数据及 EDGAR 直达链接，可按表格类型筛选。                                  |
| 分部财务数据     | 按产品、业务分部和地区拆分的营收、营业利润及其他财务科目。                                |
| 股价快照       | 当前实时价格、当日涨跌幅及报价时间。                                           |
| 选股器        | 符合基本面筛选 criteria 的公司。                                        |

<div id="provider-id">
  ## 提供方 ID
</div>

在 `dataSources` 中使用该值：

```text theme={null}
financial_datasets
```

<div id="example">
  ## 示例
</div>

为 NVIDIA 构建一份结构化的公司研究快照。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Analyze NVIDIA using its latest price, valuation metrics, most recent "
          "quarterly financial statements and earnings, institutional and insider "
          "activity, and material SEC filing sections. Return a structured "
          "company-research snapshot with reporting dates."
      ),
      data_sources=[{"provider": "financial_datasets"}],
      output_schema={
          "type": "object",
          "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
          "properties": {
              "ticker": {"type": "string"},
              "price": {
                  "type": "object",
                  "required": ["latest", "asOf"],
                  "properties": {
                      "latest": {"type": "number"},
                      "asOf": {"type": "string"},
                  },
              },
              "valuation": {
                  "type": "object",
                  "properties": {
                      "marketCap": {"type": "number"},
                      "peRatio": {"type": "number"},
                      "evToEbitda": {"type": "number"},
                  },
              },
              "financials": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "earnings": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "ownership": {
                  "type": "object",
                  "properties": {
                      "institutionalHighlights": {"type": "string"},
                      "insiderActivity": {"type": "string"},
                  },
              },
              "filings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": ["formType", "filedAt", "keySection"],
                      "properties": {
                          "formType": {"type": "string"},
                          "filedAt": {"type": "string"},
                          "keySection": {"type": "string"},
                      },
                  },
              },
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
    dataSources: [{ provider: "financial_datasets" }],
    outputSchema: {
      type: "object",
      required: ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
      properties: {
        ticker: { type: "string" },
        price: {
          type: "object",
          required: ["latest", "asOf"],
          properties: {
            latest: { type: "number" },
            asOf: { type: "string" },
          },
        },
        valuation: {
          type: "object",
          properties: {
            marketCap: { type: "number" },
            peRatio: { type: "number" },
            evToEbitda: { type: "number" },
          },
        },
        financials: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        earnings: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        ownership: {
          type: "object",
          properties: {
            institutionalHighlights: { type: "string" },
            insiderActivity: { type: "string" },
          },
        },
        filings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: ["formType", "filedAt", "keySection"],
            properties: {
              formType: { type: "string" },
              filedAt: { type: "string" },
              keySection: { type: "string" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
      "dataSources": [{ "provider": "financial_datasets" }],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
        "properties": {
          "ticker": { "type": "string" },
          "price": {
            "type": "object",
            "required": ["latest", "asOf"],
            "properties": {
              "latest": { "type": "number" },
              "asOf": { "type": "string" }
            }
          },
          "valuation": {
            "type": "object",
            "properties": {
              "marketCap": { "type": "number" },
              "peRatio": { "type": "number" },
              "evToEbitda": { "type": "number" }
            }
          },
          "financials": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "earnings": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "ownership": {
            "type": "object",
            "properties": {
              "institutionalHighlights": { "type": "string" },
              "insiderActivity": { "type": "string" }
            }
          },
          "filings": {
            "type": "array",
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["formType", "filedAt", "keySection"],
              "properties": {
                "formType": { "type": "string" },
                "filedAt": { "type": "string" },
                "keySection": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 搭配使用
</div>

* [Particle](/zh/docs/agent/connect/particle)：将已发布的报道与播客评论相互印证。
* [Baselayer](/zh/docs/agent/connect/baselayer)：核实股票代码背后的实际主体。
* [Fiber.ai](/zh/docs/agent/connect/fiber)：为上市公司补充增强私募市场同类企业及管理层联系方式等信息。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="附加到运行" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速开始" arrow="true">
    Exa Connect 快速开始介绍了 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在一次运行中最多接入五个合作伙伴，并设计好 query，让每个提供方都能被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制 effort 与费用。
  </Card>

  <Card title="获取 API 密钥" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建密钥" arrow="true">
    在控制台中创建密钥，即可直接运行本页的示例。新账户会获赠免费积分。
  </Card>
</Columns>