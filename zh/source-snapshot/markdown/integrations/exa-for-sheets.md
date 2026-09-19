> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 建议先通过该文件了解所有可用页面，再进一步浏览。

<div id="exa-for-google-sheets">
  # Exa for Google Sheets
</div>

> 在 Google Sheets 中使用 Exa Agent 和 Exa 公式。

<Warning>
  **多个 Google 账号：** 该 add-on 必须在浏览器配置文件的第一个 (默认) Google 账号下运行。如果你登录了多个账号，可能无法保存或加载 API key。要解决此问题，请在只登录一个账号的无痕窗口中打开 Sheets，或退出多余的账号，让你要使用的账号成为默认账号。[了解更多](https://developers.google.com/apps-script/guides/projects#fix_issues_with_multiple_google_accounts)。
</Warning>

在 Google Sheets 中使用 Exa，可以检索网络信息、生成表格并补全缺失数据。

该 add-on 提供两种使用方式：

* **Exa Agent**：处理完整表格和跨单元格的任务
* **`=EXA(...)`**：在单个单元格中得到一个答案

<div id="install">
  ## 安装
</div>

<Steps>
  <Step title="安装插件">
    前往 Google Workspace Marketplace 中的 [Exa AI add-on](https://workspace.google.com/marketplace/app/exa_ai/465545439521)，点击 **Install**。
  </Step>

  <Step title="打开 Google Sheets">
    新建或打开一个已有的电子表格。
  </Step>

  <Step title="打开侧边栏">
    依次点击 **Extensions → Exa AI → Open Sidebar**。
  </Step>

  <Step title="添加你的 API key">
    <Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建一个 key。新账户可获得免费积分。
    </Card>

    将该 key 粘贴到侧边栏中。
  </Step>

  <Step title="开始使用 Exa">
    打开 **Exa Agent**，即可在表格中使用 Exa。
  </Step>
</Steps>

<div id="exa-agent">
  ## Exa Agent
</div>

Exa Agent 让你能在 Google Sheets 的多个单元格中使用 Exa。

适用场景：

* 用一条提示词生成完整表格
* 补全现有表格中缺失的单元格
* 为表格追加新行以继续扩展
* 用网页数据丰富列表内容

<div id="generate-a-table">
  ### 生成表格
</div>

如果想让 Exa 创建一个新表格，请使用 **Generate table**。

1. 打开侧边栏。
2. 进入 **Exa Agent**。
3. 选择 **Generate table**。
4. 写下你的需求。
5. 点击 **Generate table**。

示例提示词：

```text theme={null}
查找排名前 40 的 AI 公司，并返回公司名称、网站地址、首席执行官、成立日期、总部所在地以及简短介绍。
```

Exa 会在网络上进行调研，并将表格写入你的工作表。

默认情况下，表格从所选单元格开始生成。你也可以在**更多选项**中指定其他起始单元格。

<div id="fill-cells">
  ### 填充单元格
</div>

如果你已有一张表格，想让 Exa 补全其中缺失的数据，就可以使用**填充单元格**。

1. 在工作表中选中空白单元格。
2. 打开 **Exa Agent**。
3. 选择**填充单元格**。
4. 点击**填充所选单元格**。

Exa 会参考所选区域周围的表格内容，并填补空白。

使用**填充单元格**前，请确保表格已有清晰的表头，然后再选中空白单元格。

示例：

| 公司     | 网站                                       | CEO           | 总部            |
| ------ | ---------------------------------------- | ------------- | ------------- |
| Apple  | [https://apple.com](https://apple.com)   |               |               |
| Google | [https://google.com](https://google.com) | Sundar Pichai | Mountain View |

选中 Apple 所在行的空白单元格，然后点击**填充所选单元格**。Exa 会把公司名称和相邻行作为上下文。

<div id="continue-rows">
  ### 续写行
</div>

你也可以选中表格下方的空白行。

如果表格到第 55 行 (rank 55) 结束，而你选中了接下来的两个空白行，Exa 就能接着补全第 56 行和第 57 行。

Exa 会参考已有的行作为示例，保持相同的列，并避免重复表格中已有的项目。

<div id="exa">
  ## `=EXA(...)`
</div>

如果你想在单个单元格中获得一个答案，请使用 `=EXA(...)`。它会搜索网页、读取排名靠前的结果，并返回简洁的答案。

```text theme={null}
=EXA("what you want", cell)
```

| 参数        | 是否必填 | 说明                                          |
| --------- | ---- | ------------------------------------------- |
| `prompt`  | 是    | 你想获取的信息 (例如 `"Return only the CEO name"`) 。 |
| `context` | 否    | 用于补充上下文的单元格引用或文本 (例如 `A2` 中的公司名称) 。         |

示例：

```text theme={null}
=EXA("Return only the company website URL", A2)
=EXA("Return only the CEO name", A2)
=EXA("Return only the headquarters", A2)
=EXA("Return the Amazon rating of this product", A2)
```

第二个参数是上下文。你可以将公式沿列向下拖动，从而对多行批量执行。

如果只需单个单元格的简单答案，请使用 `=EXA(...)`；如果要创建或填充整个表格，请使用 **Exa Agent**。

<div id="exa_answer">
  ## `=EXA_ANSWER(...)`
</div>

高级 AI 回答，可完全控制输出格式。当你需要系统提示词、结构化 JSON 输出、引用来源或特定搜索类型时，请使用此函数。

```text theme={null}
=EXA_ANSWER(prompt, [prefix], [suffix], [includeCitations], [systemPrompt], [outputSchema], [returnRawJson], [type])
```

| 参数                 | 是否必填 | 默认值      | 说明                                                                              |
| ------------------ | ---- | -------- | ------------------------------------------------------------------------------- |
| `prompt`           | 是    | —        | 主要的问题或提示词。                                                                      |
| `prefix`           | 否    | `""`     | 添加在提示词之前的文本。                                                                    |
| `suffix`           | 否    | `""`     | 添加在提示词之后的文本。                                                                    |
| `includeCitations` | 否    | `FALSE`  | 若为 `TRUE`，则附加带编号的来源引用。                                                          |
| `systemPrompt`     | 否    | `""`     | 用于控制输出格式的系统指令 (例如 `"only return a number"`) 。                                   |
| `outputSchema`     | 否    | `""`     | 用于结构化输出的 JSON schema。[点此生成 schema](https://dashboard.exa.ai/playground/answer)。 |
| `returnRawJson`    | 否    | `FALSE`  | 若为 `TRUE` 且已设置 `outputSchema`，则返回完整 JSON，而不提取其中的值。                              |
| `type`             | 否    | `"deep"` | 搜索类型：`"auto"`、`"neural"`、`"fast"` 或 `"deep"`。                                   |

示例：

```text theme={null}
=EXA_ANSWER("OpenAI CEO", "", "", FALSE, "only return a name")
=EXA_ANSWER("Modal AI headcount", "", "", FALSE, "only return a number")
=EXA_ANSWER("ceo of exa.ai", "", "", FALSE, "", "{""type"":""object"",""properties"":{""name"":{""type"":""string""}}}")
```

<div id="exa_search">
  ## `=EXA_SEARCH(...)`
</div>

搜索网页并以纵向列表形式返回 URL。支持域名过滤、类别过滤、内容 highlights，以及通过 `outputSchema` 输出结构化的合成结果。

```text theme={null}
=EXA_SEARCH(query, [numResults], [searchType], [prefix], [suffix], [includeDomainsStr], [excludeDomainsStr], [category], [highlightsMaxChars], [outputSchemaJson])
```

| 参数                   | 必填 | 默认值      | 说明                                                                                                             |
| -------------------- | -- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `query`              | 是  | —        | 搜索查询。                                                                                                          |
| `numResults`         | 否  | `1`      | 返回结果数量 (1–10) 。                                                                                                |
| `searchType`         | 否  | `"auto"` | `"auto"`、`"neural"` 或 `"keyword"`。                                                                             |
| `prefix`             | 否  | `""`     | 添加在查询前的文本。                                                                                                     |
| `suffix`             | 否  | `""`     | 添加在查询后的文本。                                                                                                     |
| `includeDomainsStr`  | 否  | `""`     | 要包含的域名，以逗号分隔 (例如 `"linkedin.com,crunchbase.com"`) 。                                                            |
| `excludeDomainsStr`  | 否  | `""`     | 要排除的域名，以逗号分隔。                                                                                                  |
| `category`           | 否  | `""`     | 按类型筛选：`"company"`、`"publication"`、`"news"`、`"personal site"`、`"financial report"`、`"people"`。                  |
| `highlightsMaxChars` | 否  | `0`      | 若 &gt; 0，则请求内容 highlights，每条结果按此字符数上限返回。                                                                       |
| `outputSchemaJson`   | 否  | `""`     | 用于 `outputSchema` 的 JSON 字符串 (例如 `"{""type"":""text"",""description"":""summarize""}"`) 。设置后将返回合成的输出文本，而非 URL。 |

示例：

```text theme={null}
=EXA_SEARCH("AI startups", 5, "auto", "", "", "linkedin.com,crunchbase.com")
=EXA_SEARCH("transformer architecture", 5, "auto", "", "", "", "", "publication")
```

<div id="exa_contents">
  ## `=EXA_CONTENTS(...)`
</div>

从 URL 中提取文本内容。

```text theme={null}
=EXA_CONTENTS(url)
```

| 参数    | 是否必填 | 说明                               |
| ----- | ---- | -------------------------------- |
| `url` | 是    | 完整 URL(必须以 `http` 或 `https` 开头)。 |

<div id="exa_findsimilar">
  ## `=EXA_FINDSIMILAR(...)`
</div>

查找与参考 URL 相似的 URL，并可选择应用域名和文本过滤条件。

```text theme={null}
=EXA_FINDSIMILAR(url, [numResults], [includeDomainsStr], [excludeDomainsStr], [includeTextStr], [excludeTextStr])
```

| 参数                  | 必填 | 默认值  | 说明              |
| ------------------- | -- | ---- | --------------- |
| `url`               | 是  | —    | 参考 URL。         |
| `numResults`        | 否  | `1`  | 返回结果数量 (1–10) 。 |
| `includeDomainsStr` | 否  | `""` | 需包含的域名，以逗号分隔。   |
| `excludeDomainsStr` | 否  | `""` | 需排除的域名，以逗号分隔。   |
| `includeTextStr`    | 否  | `""` | 结果中必须出现的短语。     |
| `excludeTextStr`    | 否  | `""` | 结果中不得出现的短语。     |

<div id="batch">
  ## Batch
</div>

需要一次性处理多个 Exa 公式单元格时，请使用 **Batch**。

Batch 可以：

* 刷新选中的 Exa 公式单元格
* 将选中的 Exa 公式转换为普通值

如果你想保留当前结果、不让公式再次运行，可以将公式转换为值。

<div id="when-to-use-what">
  ## 何时使用哪种功能
</div>

| 任务                | 使用                         |
| ----------------- | -------------------------- |
| 根据提示词生成整张表格       | Exa Agent → Generate table |
| 填充表格中的空白单元格       | Exa Agent → 填充单元格     |
| 为表格续写新行           | Exa Agent → 填充单元格     |
| 获取单个单元格的值         | `=EXA(...)`                |
| 通过系统提示词或结构化输出获取答案 | `=EXA_ANSWER(...)`         |
| 搜索并获取 URL 列表      | `=EXA_SEARCH(...)`         |
| 从 URL 提取文本        | `=EXA_CONTENTS(...)`       |
| 查找与某个 URL 相似的页面   | `=EXA_FINDSIMILAR(...)`    |
| 批量刷新多个 Exa 公式     | Batch                      |
| 将公式结果保存为纯文本       | Batch → Convert to values  |

<div id="notes">
  ## 说明
</div>

* Exa API 请求会计入你的用量额度。使用 **Batch → Convert to values** 可将结果固化为静态值，避免公式反复重算。
* 遇到速率限制 (HTTP 429) 时，add-on 会按指数退避策略自动重试，最多 3 次。
* 建议先从小批量 (10–20 行) 开始，再逐步扩展到数百行。

<div id="links">
  ## 链接
</div>

* [安装 Exa AI for Google Sheets](https://workspace.google.com/marketplace/app/exa_ai/465545439521)
* [获取 Exa API key](https://dashboard.exa.ai/api-keys)
* [GitHub 仓库](https://github.com/exa-labs/exa-for-sheets)
* [隐私政策](https://exa.ai/exa-for-sheets/privacy-policy)