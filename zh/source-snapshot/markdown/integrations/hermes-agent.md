> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="hermes-agent">
  # Hermes Agent
</div>

> 借助 Exa 为 Hermes Agent 提供实时网页搜索和页面内容。

[Hermes Agent](https://github.com/NousResearch/hermes-agent) 内置 Exa，作为其模型可调用的 `web_search` 和 `web_extract` 工具的原生后端。你可以用 Exa 同时支持这两项能力，也可以将其与 Hermes 支持的其他网页服务提供方搭配使用。

<div id="connect-your-exa-account">
  ## 连接你的 Exa 账户
</div>

<Steps>
  <Step title="获取 Exa API key">
    <Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建一个 key。新账户会获赠免费积分。
    </Card>
  </Step>

  <Step title="在 Hermes 中选择 Exa">
    运行工具配置向导：

    ```bash theme={null}
    hermes tools
    ```

    打开 **Web Search &amp; Extract**，选择 Exa，再选择基于 API key 的选项。出现提示时，输入你的 Exa API key。Hermes 会把密钥保存在 `~/.hermes/.env`，把提供方的选择保存在 `~/.hermes/config.yaml`。
  </Step>

  <Step title="测试网页访问">
    启动 Hermes，让它执行一次搜索，然后阅读其中一条结果：

    ```text theme={null}
    Search the web for the latest Exa product updates, then read the most relevant result.
    ```

    Hermes 应当调用 `web_search`，并在需要获取页面内容时接着调用 `web_extract`。
  </Step>
</Steps>

<div id="configure-manually">
  ## 手动配置
</div>

将你的 key 添加到 Hermes 环境文件中：

```bash ~/.hermes/.env theme={null}
EXA_API_KEY=your-exa-api-key
```

然后将两项网页功能都选择为 Exa：

```yaml ~/.hermes/config.yaml theme={null}
web:
  search_backend: "exa"
  extract_backend: "exa"
```

你也可以改用共享的回退方案：

```yaml ~/.hermes/config.yaml theme={null}
web:
  backend: "exa"
```

各项能力的单独设置优先级高于 `web.backend`。这样在组合多个提供方时，你可以只将 Exa 用于搜索，或只用于内容提取。

<div id="tools-hermes-gets">
  ## Hermes 可用的工具
</div>

| 工具            | Exa 行为                                  |
| ------------- | --------------------------------------- |
| `web_search`  | 使用 Exa 进行搜索，返回按相关性排序的页面，包含标题、URL 和文本片段。 |
| `web_extract` | 通过 Exa Contents 从一个或多个 URL 获取可读内容。      |

Hermes 会将提取到的长页面截断至配置的字符预算，并将完整文本保存到磁盘。可通过 `web.extract_char_limit` 修改默认值，也可以让 agent 在单次调用中请求更大的 `char_limit`。

<Note>
  无需 API key，Hermes 也能通过其免密钥的免费提供方池使用 Exa。该池存在速率限制，并且可能在多个提供方之间轮换。如果你希望请求始终走自己的 Exa 账户，请配置 `EXA_API_KEY` 并选择基于 API key 的 Exa 选项。
</Note>

<div id="troubleshooting">
  ## 故障排查
</div>

<AccordionGroup>
  <Accordion title="Hermes 未选择 Exa">
    运行 `hermes tools` 并手动选择 Exa。如果你是手动编辑配置文件，请检查 `web.search_backend`、`web.extract_backend` 或 `web.backend` 是否设置为 `exa`。
  </Accordion>

  <Accordion title="Hermes 提示缺少 EXA_API_KEY">
    将 key 添加到 `~/.hermes/.env`，然后重启 Hermes，使其重新加载环境变量。
  </Accordion>

  <Accordion title="search 正常，但提取使用了其他提供方">
    Hermes 的 search 和提取可以分别配置。请将 `web.search_backend` 和 `web.extract_backend` 都设置为 `exa`。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 资源
</div>

<Columns cols={3}>
  <Card title="Hermes 网页工具" icon="book-open" href="https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search" cta="阅读指南" arrow="true">
    了解 Hermes 的提供方选择、缓存与提取行为。
  </Card>

  <Card title="Exa Search" icon="search" href="/zh/docs/search/quickstart" cta="阅读指南" arrow="true">
    了解 Exa 如何搜索、筛选并返回页面内容。
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/zh/docs/contents/quickstart" cta="阅读指南" arrow="true">
    了解 `web_extract` 背后的提取 API。
  </Card>
</Columns>