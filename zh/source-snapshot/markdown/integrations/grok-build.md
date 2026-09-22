> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# Grok Build {#grok-build}

> 在 Grok Build 中使用 Exa 网页搜索。从 Grok Build 插件市场安装 Exa 插件，并使用你的 Exa 账户登录。

Exa 已作为插件上架 [Grok Build](https://docs.x.ai/build/overview) 插件市场，可为 Grok 提供实时网页搜索、网页读取和深度研究技能。

## 安装 {#installation}

<Steps>
  <Step title="安装 Grok Build">
    安装 Grok CLI (详见 [Grok Build 文档](https://docs.x.ai/build/overview)) ：

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    然后登录你的 xAI 账户：

    ```bash theme={null}
    grok login
    ```
  </Step>

  <Step title="打开插件市场">
    运行 `grok` 启动 Grok Build，然后打开插件市场：

    ```text theme={null}
    /marketplace
    ```
  </Step>

  <Step title="安装 Exa 插件">
    在列表中找到 **exa**，按 `i` 安装。
  </Step>

  <Step title="登录 Exa">
    使用 `/mcp` 打开 MCP server 标签页，选择 **exa**，按 `i` 登录。浏览器会打开 Exa 登录页面。新账户注册即可获得免费积分。
  </Step>
</Steps>

当 exa 显示 **ready** 后，就可以向 Grok 提出任何需要联网的问题了。

## 你将获得什么 {#what-you-get}

* **web&#95;search&#95;exa**：实时网页搜索。支持自然语言查询，以及新闻、公司、人物、研究论文、GitHub 等类别筛选。
* **web&#95;fetch&#95;exa**：读取任意 URL，并以整洁的 markdown 格式返回页面内容。
* **exa-search skill**：一项深度研究技能。让 Grok 深入研究某个主题，它会执行多次 search、阅读最优质的来源，并给出带引用来源的回答。

## 示例 prompt {#example-prompts}

* “搜索 xAI 的最新新闻”
* “阅读 [https://exa.ai](https://exa.ai) 并总结其内容”
* “对开源推理引擎做一次深入调研”