> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="grok-build">
  # Grok Build
</div>

> 在 Grok Build 中使用 Exa 网页搜索。从 Grok Build 插件市场安装 Exa 插件，并使用你的 Exa 账户登录。

Exa 已上架 [Grok Build](https://docs.x.ai/build/overview) 插件市场。它为 Grok 提供实时网页搜索、网页读取和深度研究技能。

<div id="installation">
  ## 安装
</div>

<Steps>
  <Step title="安装 Grok Build">
    安装 Grok CLI (详情参见 [Grok Build 文档](https://docs.x.ai/build/overview)) ：

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
    用 `/mcp` 打开 MCP 服务器标签页，选择 **exa**，按 `i` 登录。浏览器会打开 Exa 登录页面。新账户注册即可获得免费积分。
  </Step>
</Steps>

当 exa 显示 **ready** 后，就可以向 Grok 提出任何需要联网的问题了。

<div id="what-you-get">
  ## 你将获得什么
</div>

* **web&#95;search&#95;exa**：实时网页搜索。支持自然语言查询，以及新闻、公司、人物、研究论文、GitHub 等类别筛选。
* **web&#95;fetch&#95;exa**：读取任意 URL，将页面内容以干净的 markdown 格式返回。
* **exa-search skill**：深度研究技能。让 Grok 深入研究某个主题，它会执行多轮搜索、阅读最优质的来源，并给出带引用出处的回答。

<div id="example-prompts">
  ## 示例提示词
</div>

* “搜索 xAI 的最新新闻”
* “阅读 [https://exa.ai](https://exa.ai) 并总结内容”
* “深入调研开源推理引擎”