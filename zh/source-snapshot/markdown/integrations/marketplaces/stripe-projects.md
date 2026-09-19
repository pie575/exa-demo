> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="stripe-projects">
  # Stripe Projects
</div>

> 使用 Stripe Projects CLI，在终端中集成 Exa。

[Stripe Projects](https://projects.dev) 让你和你的编码 agent 直接在终端中开通第三方服务，无需打开控制台，也无需复制粘贴 key。只需一条命令，即可创建 Exa 账户，并将 API key 同步到你的项目中。

<div id="prerequisites">
  ## 前置条件
</div>

安装 Stripe CLI 和 Projects 插件：

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

其他平台及完整的 CLI 安装配置，请参阅 [Stripe Projects](https://projects.dev)。

<div id="get-started">
  ## 开始使用
</div>

在项目目录中，初始化项目、添加 Exa 并拉取凭据：

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

你的 `.env` 中现在已包含 `EXA_API_KEY`。[Exa SDK](/zh/docs/sdks/quickstart) 和[快速开始](/zh/docs/search/quickstart)会自动读取该变量，因此你的代码无需任何改动即可运行。

<Info>
  该 key 在你自己的 Exa 账户中开通。你可以随时在 [Exa Dashboard](https://dashboard.exa.ai) 管理用量、key 和账单。
</Info>

<div id="link-an-existing-exa-team">
  ## 关联已有的 Exa 团队
</div>

已经有 Exa 账户？请先完成关联，这样 API key 会在你现有的团队下创建：

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link` 会打开 Exa，让你完成身份验证并将团队与 Stripe 账户关联。之后可随时使用 `stripe projects open exa` 打开已关联的 Exa Dashboard。

<div id="provision-from-your-coding-agent">
  ## 通过编码 agent 进行预配
</div>

`stripe projects init` 会将 Stripe Projects [Agent Skill](https://projects.dev) 写入你的项目，这样你就可以让 agent (Claude Code、Cursor、Codex 等) 替你完成整个流程：

```text theme={null}
使用 Stripe Projects 添加 Exa 并配置好 API key。
```

<div id="next-steps">
  ## 后续步骤
</div>

* [快速开始](/zh/docs/search/quickstart)：使用我们的 SDK 发起第一次 Exa search。
* [Stripe Projects 文档](https://docs.stripe.com/projects)：完整的 CLI 参考、环境与账单说明。
* [Exa Dashboard](https://dashboard.exa.ai)：管理 API key、用量与账单。
* [提供商目录](https://projects.dev)：浏览所有 Stripe Projects 提供商。