> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="openhuman">
  # OpenHuman
</div>

> 为 OpenHuman 智能体接入基于 Exa 的实时网络搜索，既可使用托管方案，也可使用你自己的 Exa API key。

TinyHumans 推出的 [OpenHuman](https://tinyhumans.gitbook.io/openhuman) 是一款桌面 AI 助手，内置原生网络搜索工具，由智能体自主调用。该工具背后的搜索提供方正是 Exa。

| 方案               | 配置               | 运行位置                                      |
| ---------------- | ---------------- | ----------------------------------------- |
| **OpenHuman Managed** | 无需配置             | OpenHuman 的后端，由 Exa 提供支持。无需 API key。      |
| **Exa 提供方**      | 粘贴一个 Exa API key | 你的本机，以你自己的 Exa 账户直连 `https://api.exa.ai`。 |

<div id="openhuman-managed">
  ## OpenHuman Managed
</div>

托管搜索是默认方式。在引导流程中选择 **Simple**，Agent 便可立即搜索网络。

<Frame caption="在引导流程中选择 Simple，即可使用由 Exa 驱动的托管搜索">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="OpenHuman onboarding asking how to run OpenHuman, with the Simple option selected" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **托管模式是获取 Exa 结果最快的方式。** 无需创建、存储或轮换 key，本机上不留存任何凭据，搜索费用直接计入你的 OpenHuman 订阅。
</Tip>

<div id="exa-provider">
  ## Exa 提供方
</div>

直接配置 Exa，即可使用你自己的 Exa 账户运行 search，并为 agent 提供 Exa 的 search 和页面 contents 工具。

<div id="get-your-exa-api-key">
  ### 获取你的 Exa API key
</div>

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建 key。新账户会赠送免费积分。
</Card>

<div id="add-exa-in-openhuman">
  ### 在 OpenHuman 中添加 Exa
</div>

1. 打开 **Connections**，然后在 **API keys** 下选择 **Search engine**。

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="OpenHuman 的 Connections 页面，在 API keys 下选中 Search engine，显示搜索引擎列表，其中 OpenHuman Managed 处于启用状态" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. 选择 **Exa**。

<Frame caption="已选择 Exa，等待填入密钥">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="在 OpenHuman 的 Search engine 面板中选中 Exa 引擎选项，显示 Needs API key 标记" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. 将你的密钥粘贴到 **Exa API key** 中，然后选择 **Save**。

<Frame caption="保存 Exa API key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="OpenHuman 中已填入密钥的 Exa API key 字段，并可见 Save 按钮" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="Exa 已配置为当前使用的搜索引擎">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="OpenHuman 的 Search engine 面板中已选择 Exa 并标记为 Configured" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

<div id="configuration">
  ### 配置
</div>

该面板会将设置写入 OpenHuman 的 `config.toml`。你也可以直接在该文件或环境变量中设置相同的值：

<Tabs>
  <Tab title="config.toml">
    ```toml config.toml theme={null}
    [search]
    engine = "exa"        # 必填
    max_results = 5       # 可选，1-20
    timeout_secs = 15     # 可选

    [search.exa]
    api_key = "your-exa-api-key"   # 必填
    ```
  </Tab>

  <Tab title="环境变量">
    ```bash theme={null}
    OPENHUMAN_SEARCH_ENGINE=exa
    EXA_API_KEY=your-exa-api-key
    ```

    <Note>
      `EXA_API_KEY` 和 `OPENHUMAN_EXA_API_KEY` 都会覆盖 `search.exa.api_key`。两者同时设置时，以 `OPENHUMAN_EXA_API_KEY` 为准。
    </Note>
  </Tab>
</Tabs>

<div id="tools-the-agent-gets">
  ### 智能体可用的工具
</div>

| 工具                 | 返回内容                                    |
| ------------------ | --------------------------------------- |
| `web_search_tool`  | 网页搜索，由 Exa 提供支持。                        |
| `exa_search`       | 排序后的页面，含标题、URL、发布日期以及可选的正文文本。           |
| `exa_get_contents` | 指定 URL 的完整 contents，可选附带摘要或 highlights。 |

智能体会在每次调用时设置 Exa 的[搜索参数](/zh/docs/search/quickstart)，因此只需用简单的指令即可控制搜索模式、域名、日期和类别。

<div id="troubleshooting">
  ## 故障排查
</div>

<AccordionGroup>
  <Accordion title="Exa 搜索不可用：未配置 API key">
    OpenHuman 在 **Search engine** 面板、`EXA_API_KEY` 和 `OPENHUMAN_EXA_API_KEY` 环境变量以及 `search.exa.api_key` 中均未找到 key。请在其中任意一处设置；如果你是在 OpenHuman 运行期间修改的 `config.toml`，请重启 OpenHuman。
  </Accordion>

  <Accordion title="Exa 拒绝了已配置的 API key（HTTP 401）">
    该 key 无效或已被吊销。请在 [Exa 控制台](https://dashboard.exa.ai/api-keys)中核对，然后点击 **Clear** 清除已存储的 key 并保存正确的 key。注意不要把粘贴时带入的空白字符一起保存。
  </Accordion>

  <Accordion title="Exa 返回了非 2xx 状态码">
    `429` 表示触发速率限制或配额已耗尽：请在[控制台](https://dashboard.exa.ai)中查看用量。遇到 `5xx` 时请先重试，若仍不成功，请参阅[错误码](/zh/docs/admin/error-codes)。
  </Accordion>

  <Accordion title="引擎列表中没有 OpenHuman Managed">
    纯本地会话无法使用托管搜索。请使用你自己的 key 配置 Exa 提供方。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 资源
</div>

<Columns cols={3}>
  <Card title="OpenHuman 网页搜索文档" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search" cta="查看指南" arrow="true">
    阅读 OpenHuman 官方的搜索引擎参考文档。
  </Card>

  <Card title="Exa Search API" icon="search" href="/zh/docs/search/quickstart" cta="阅读指南" arrow="true">
    了解 Exa 工具背后的搜索模式、过滤条件与内容选项。
  </Card>

  <Card title="搜索最佳实践" icon="sparkles" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    让每一次查询都获得更好的结果。
  </Card>
</Columns>