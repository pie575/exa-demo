> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

<div id="fx-by-vercel-labs">
  # fx by Vercel Labs
</div>

> 借助托管的 Exa MCP 服务器，为 Vercel Labs 的原生编码智能体 fx 添加 Exa 网页搜索能力。

[fx](https://fx.sh) 是 Vercel Labs 推出的原生编码智能体和 CLI 工具，同时也是一个 MCP 客户端。接入 Exa 托管的 MCP 服务器，即可让它具备实时网页搜索和网页读取能力。

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/vercel/fx/install-exa.gif?s=2e331148abdf5bdf083e6f651e3b8b75" alt="安装 fx，使用 /mcp add 添加 Exa MCP 服务器，并运行一次实时 Exa 网页搜索" style={{width: "100%", height: "auto"}} width="800" height="393" data-path="images/integrations/vercel/fx/install-exa.gif" />
</Frame>

<div id="installation">
  ## 安装
</div>

<Steps>
  <Step title="安装 fx">
    ```bash theme={null}
    curl -fsSL https://fx.sh/setup.sh | bash
    ```

    然后使用 `fx login` 登录。服务商选项详见 [fx 文档](https://fx.sh/docs)。
  </Step>

  <Step title="添加 Exa">
    运行 `fx` 启动，然后在交互式 shell 中添加 Exa MCP 服务器：

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    fx 会将该服务器保存到 `~/.fx/mcp.json` 并重新加载 MCP。
  </Step>

  <Step title="验证连接">
    ```text theme={null}
    /mcp list
    ```
  </Step>
</Steps>

<div id="configure-by-hand">
  ## 手动配置
</div>

fx 仅从 `~/.fx/mcp.json` 读取 MCP 服务器，因此你也可以直接在该文件中添加 Exa：

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

运行 `/mcp reload` 即可应用更改，无需重启 fx。

免费方案足以应对日常轻度使用。若要提高速率限制，请创建 API key 并将其添加到配置中：

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建一个 key。新账户可获得免费积分。
</Card>

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp",
      "header_env": {
        "x-api-key": "EXA_API_KEY"
      }
    }
  }
}
```

`header_env` 将 header 名称映射到环境变量，从而使 key 不必出现在配置文件中。

<div id="tool-discovery">
  ## 工具发现
</div>

fx 采用惰性方式发现 MCP 工具：只有当某一轮对话需要时，服务器的工具才会进入模型上下文，因此在无需联网搜索的轮次中，接入 Exa 不会带来任何额外开销。

<Card title="Exa MCP" icon="plug" href="/zh/docs/get-started/exa-mcp" cta="打开指南" arrow="true">
  了解可用的工具、配置选项以及其他客户端。
</Card>