> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="stripe-projects">
  # Stripe Projects
</div>

> 通过 Stripe Projects CLI，直接在终端中集成 Exa。

借助 [Stripe Projects](https://projects.dev)，你和你的编码智能体无需打开控制台、无需复制粘贴密钥，就能在终端中开通第三方服务。一条命令即可创建 Exa 账户，并将 API 密钥同步到你的项目中。

<div id="prerequisites">
  ## 前置条件
</div>

安装 Stripe CLI 和 Projects 插件：

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

有关其他平台及完整的 CLI 设置，请参阅 [Stripe Projects](https://projects.dev)。

<div id="get-started">
  ## 开始使用
</div>

在项目目录中初始化项目、添加 Exa 并拉取凭据：

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

你的 `.env` 现在包含了 `EXA_API_KEY`。[Exa SDK](/zh/docs/sdks/quickstart) 和[快速开始](/zh/docs/search/quickstart)会自动读取该变量，因此你的代码无需任何改动即可运行。

<Info>
  该密钥预配在你自己的 Exa 账户中。你可以随时在 [Exa Dashboard](https://dashboard.exa.ai) 管理用量、密钥和计费。
</Info>

<div id="link-an-existing-exa-team">
  ## 关联已有的 Exa 团队
</div>

已经有 Exa 账户？请先完成关联，这样 API 密钥就会预配到你现有的团队下：

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link` 会打开 Exa，让你完成身份验证并将团队与你的 Stripe 账户关联。之后可随时使用 `stripe projects open exa` 打开已关联的 Exa Dashboard。

<div id="provision-from-your-coding-agent">
  ## 通过编码智能体进行预配
</div>

`stripe projects init` 会在你的项目中写入一个 Stripe Projects [Agent Skill](https://projects.dev)，这样你就可以让 agent (Claude Code、Cursor、Codex 等) 替你完成整个流程：

```text theme={null}
使用 Stripe Projects 添加 Exa 并接入 API 密钥。
```

<div id="next-steps">
  ## 后续步骤
</div>

* [快速开始](/zh/docs/search/quickstart)：使用我们的 SDK 完成第一次 Exa 搜索。
* [Stripe Projects 文档](https://docs.stripe.com/projects)：完整的 CLI 参考、环境和计费说明。
* [Exa Dashboard](https://dashboard.exa.ai)：管理 API 密钥、用量和计费。
* [提供方目录](https://projects.dev)：浏览所有 Stripe Projects 提供方。