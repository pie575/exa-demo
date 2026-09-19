> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="enterprise-managed-auth-for-claude">
  # 面向 Claude 的企业托管身份验证
</div>

> 设置企业托管身份验证 (EMA) ，让 Claude 通过你的身份提供商连接 Exa MCP，支持 Okta Cross App Access (XAA) 。

默认情况下，每位成员都需要通过 OAuth 登录一次 Exa，才能在 Claude 中连接 [Exa 连接器](/zh/docs/get-started/exa-mcp)。启用**企业托管身份验证 (EMA) **后，成员改为通过 Okta 静默获得访问权限：没有 Exa 登录界面，没有授权确认提示，也无需四处分发 API key。

访问权限始终与你的目录保持一致：在 Okta 中取消某人的账号配置后，其通过 Claude 访问 Exa 的权限也会随之终止。EMA 即 MCP 的[企业托管授权扩展](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization)。

<div id="before-you-start">
  ## 开始之前
</div>

* 一个已连接身份提供商的 Claude Team 或 Enterprise 组织，且你拥有其管理员权限。
* 一个已启用 SSO 和目录同步的 Exa **组织** (而非个人团队) ，且你拥有其管理员权限。
* 使用 Okta 作为身份提供商，基于 Okta Identity Engine 并已启用 [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm)，且拥有该租户的超级管理员权限。目前仅支持 Okta 一种身份提供商。

<div id="exa-values-youll-need">
  ## 你需要的 Exa 配置值
</div>

| 字段                    | 值                        |
| --------------------- | ------------------------ |
| 颁发者 URL (Exa 的授权服务器)  | `https://auth.exa.ai`    |
| 资源 / MCP 服务器 URL      | `https://mcp.exa.ai/mcp` |
| Scope                 | `mcp:tools`              |

<div id="set-up-ema">
  ## 配置 EMA
</div>

<Steps>
  <Step title="在 Exa 中预置成员">
    每位要使用该连接器的成员都必须已存在于 Exa 中，并隶属于你 Exa 组织下的某个团队，其邮箱地址需与 Okta 断言的邮箱一致，且域名已在你的组织中完成验证。EMA 不会创建账户。请使用目录同步，或[邀请他们加入团队](/zh/docs/admin/team-management)。
  </Step>

  <Step title="在 Exa 中注册身份提供商">
    在 Exa 控制面板中打开 [Organization](https://dashboard.exa.ai/organization)，找到 **Enterprise-managed auth (Claude MCP)**，点击 **Register identity provider**。粘贴你的 Okta SSO / 应用嵌入 URL (`https://your-org.okta.com/app/.../sso/saml`) 。Exa 会在注册时校验该 URL。

    在首位已预置的成员通过 Okta 成功连接 Claude 之前，注册状态会一直显示为 **Pending verification**，之后会自动变为 **Active**，无需任何其他操作。由 Exa 为你配置的颁发者会显示为 **Managed by Exa**，如需更改请联系支持团队。如果 Exa 无法识别你的 URL，请联系 [support@exa.ai](mailto:support@exa.ai)。
  </Step>

  <Step title="在 Okta 中配置 Cross App Access">
    请参照 [Okta 针对 Claude EMA 的 Cross App Access 指南](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide)。针对 Exa：

    1. 在 Okta Admin Console 中打开 Exa 应用，进入 **Resource Server**，启用 XAA，并将 Resource URL 和 Issuer URL 设为 `https://auth.exa.ai`。Audience/租户 ID 留空。
    2. 如果 Exa 应用是自定义 SAML 应用，请确认其 **Name ID Format** 为 `EmailAddress`，因为 Exa 会用断言中的邮箱匹配成员的 Exa 账户。
    3. 在 **Directory → AI Agents** 下注册 Claude AI Agent，添加 Anthropic 提供的公钥，将 Claude 应用添加为委托调用方，并使用 Anthropic 提供的 Client ID 将 Exa 添加为 **Resource Connection**。
  </Step>

  <Step title="在 Claude 中开启托管授权">
    在 Claude 中进入 **Organization settings → Connectors**，选择 Exa 连接器，在 **Configuration** 标签页中点击 Managed authorization 旁的 **Set up**。确认 IdP 连接，运行测试，选择可继承该连接器的角色，然后保存。角色与 scope 选项详见 [Anthropic 的管理员指南](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization)。
  </Step>
</Steps>

成员会在下次登录时获得该连接器。你可以在启用托管授权的同时保留浏览器登录；Claude 会优先尝试托管授权，失败时回退到常规 OAuth 登录。

<Note>
  通过 Claude 产生的用量会计入该成员所属的 Exa 团队，按该团队的套餐和速率限制计费，与他们在该团队中运行的其他任务一致。
</Note>

<div id="revoking-access">
  ## 撤销访问权限
</div>

* **单个成员：** 在 Okta 中移除该成员，或将其从 Exa 中所属的团队移除。任一操作都会终止其通过 Claude 的访问权限。
* **全部成员：** 在 Organization 页面移除颁发者，或在 Claude 中关闭托管授权。新连接会立即中止，已建立的会话也会在稍后结束。你可以随时重新注册该颁发者。

<div id="troubleshooting">
  ## 故障排查
</div>

<AccordionGroup>
  <Accordion title="部分成员可用，部分成员不可用">
    出问题的成员在 Exa 中无法被识别。请确认该成员已存在于 Exa 中，且邮箱与 Okta 断言的邮箱完全一致，所在域名已在你的组织下完成验证，并且该成员隶属于该组织中的某个团队。通常问题出在目录同步的组映射上。
  </Accordion>

  <Accordion title="所有人都无法使用">
    在 Organization 页面查看颁发者 (Issuer) 的状态。若仍显示 **Pending verification**，说明尚未有任何连接成功。常见原因包括：Okta 配置未完成、Exa 应用中的 Issuer URL 与 `https://auth.exa.ai` 不一致，或尝试连接的成员尚未在 Exa 中完成预置。修复后，请以已预置的成员身份重新连接。
  </Accordion>

  <Accordion title="注册时提示该身份提供商已注册">
    一个颁发者只能归属于一个 Exa 组织。如果它未出现在你的 Organization 页面上，请联系 [support@exa.ai](mailto:support@exa.ai)。
  </Accordion>
</AccordionGroup>

<Note>
  如有其他问题，请联系 [support@exa.ai](mailto:support@exa.ai)，并提供你的 Exa 组织名称、受影响成员的邮箱，以及尝试操作的大致时间。
</Note>