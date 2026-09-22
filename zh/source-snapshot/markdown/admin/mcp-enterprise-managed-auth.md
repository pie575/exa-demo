> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

# 面向 Claude 的 Enterprise Managed Auth {#enterprise-managed-auth-for-claude}

> 配置 Enterprise Managed Auth (EMA) ，让 Claude 通过你的身份提供商连接 Exa MCP，包括 Okta Cross App Access (XAA) 。

默认情况下，每位成员都要通过 OAuth 登录一次 Exa，才能在 Claude 中连接 [Exa 连接器](/zh/docs/get-started/exa-mcp)。启用 **Enterprise Managed Auth (EMA)&#x20;**&#x20;后，他们改为通过 Okta 静默完成连接：没有 Exa 登录页，没有授权确认，也不必到处传递 API 密钥。

访问权限随你的目录而变：在 Okta 中注销某人后，其通过 Claude 访问 Exa 的权限也随之终止。EMA 即 MCP 的 [enterprise managed authorization 扩展](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization)。

## 开始之前 {#before-you-start}

* 一个已连接身份提供商的 Claude Team 或 Enterprise organization，且你拥有其管理员权限。
* 一个已启用 SSO 和 directory sync 的 Exa **organization** (非个人团队) ，且你拥有其管理员权限。
* 使用 Okta 作为身份提供商，且运行在 Okta Identity Engine 上并已启用 [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm)，同时拥有该租户的超级管理员权限。目前仅支持 Okta 这一种身份提供商。

## 你需要的 Exa 值 {#exa-values-youll-need}

| 字段                        | 值                        |
| ------------------------- | ------------------------ |
| Issuer URL (Exa 的授权服务器)   | `https://auth.exa.ai`    |
| Resource / MCP server URL | `https://mcp.exa.ai/mcp` |
| Scope                     | `mcp:tools`              |

## 设置 EMA {#set-up-ema}

<Steps>
  <Step title="在 Exa 中预配成员">
    每位要使用该连接器的成员都必须已存在于 Exa 中，并隶属于你的 Exa organization 下的某个团队，其邮箱地址需与 Okta 断言的邮箱一致，且该域名已在你的 organization 上完成验证。EMA 不会创建账户。请使用 directory sync，或[邀请他们加入团队](/zh/docs/admin/team-management)。
  </Step>

  <Step title="在 Exa 中注册身份提供商">
    在 Exa 控制台中打开 [Organization](https://dashboard.exa.ai/organization)，找到 **Enterprise-managed auth (Claude MCP)**，点击 **Register identity provider**。粘贴你的 Okta SSO / 应用嵌入 URL (`https://your-org.okta.com/app/.../sso/saml`) 。注册时 Exa 会校验该 URL。

    在第一位已预配的成员通过 Okta 成功连接 Claude 之前，该注册登记会一直处于 **Pending verification** 状态，之后会自动转为 **Active**，无需任何额外操作。由 Exa 代为设置的颁发者会显示为 **Managed by Exa**；如需更改，请联系支持团队。如果 Exa 无法识别你的 URL，请联系 [support@exa.ai](mailto:support@exa.ai)。
  </Step>

  <Step title="在 Okta 中配置 Cross App Access">
    请参阅 [Okta 针对 Claude EMA 的 Cross App Access 指南](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide)。对于 Exa：

    1. 在 Okta Admin Console 中打开 Exa 应用，进入 **Resource Server**，启用 XAA，并将 Resource URL 和 Issuer URL 都设置为 `https://auth.exa.ai`。Audience/租户 ID 留空。
    2. 如果 Exa 应用是自定义 SAML 应用，请确认其 **Name ID Format** 为 `EmailAddress`，因为 Exa 会用断言中的邮箱来匹配该成员的 Exa 账户。
    3. 在 **Directory → AI Agents** 下注册 Claude AI Agent，添加 Anthropic 提供的公钥，将 Claude 应用添加为委派调用方，并使用 Anthropic 提供的 Client ID 将 Exa 添加为 **Resource Connection**。
  </Step>

  <Step title="在 Claude 中开启 managed authorization">
    在 Claude 中进入 **Organization settings → Connectors**，选择 Exa 连接器，在 **Configuration** 标签页中点击 Managed authorization 旁的 **Set up**。确认 IdP 连接，运行测试，选择继承该连接器的角色，然后保存。角色与 scope 选项请参阅 [Anthropic 的管理员指南](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization)。
  </Step>
</Steps>

成员会在下次登录时获得该连接器。你可以在启用 managed authorization 的同时保留浏览器登录；Claude 会优先尝试 managed authorization，失败后回退到常规的 OAuth 登录。

<Note>
  通过 Claude 产生的用量将计入该成员所属的 Exa 团队，按该团队的 plan 和速率限制计费，与他们在该团队下运行的其他任何内容一样。
</Note>

## 撤销访问权限 {#revoking-access}

* **单个成员：** 在 Okta 中移除该成员，或将其从 Exa 中所属团队移除。任一操作都会终止其通过 Claude 的访问权限。
* **所有人：** 在 Organization 页面移除颁发者，或在 Claude 中关闭 managed authorization。新建连接会立即被阻止，已打开的会话也会在短时间内结束。你可以随时重新注册该颁发者。

## 故障排查 {#troubleshooting}

<AccordionGroup>
  <Accordion title="部分成员可用，部分成员不可用">
    出问题的成员在 Exa 中无法解析。请确认该成员确实存在于 Exa 中，且其邮箱与 Okta 断言的邮箱完全一致、邮箱域名已在你的 organization 中完成验证，并且该成员隶属于该 organization 下的某个团队。通常问题出在 directory sync 的群组映射上。
  </Accordion>

  <Accordion title="所有人都无法使用">
    在 Organization page 上查看该颁发者的状态。若仍显示 **Pending verification**，说明尚无连接成功。常见原因包括：Okta 配置尚未完成、Exa 应用上的 Issuer URL 与 `https://auth.exa.ai` 不一致，或发起连接的成员未在 Exa 中预配。修复后，请以已预配的成员身份重新连接。
  </Accordion>

  <Accordion title="注册登记时提示该身份提供商已注册">
    一个颁发者只能归属于一个 Exa organization。如果它未出现在你的 Organization page 上，请联系 [support@exa.ai](mailto:support@exa.ai)。
  </Accordion>
</AccordionGroup>

<Note>
  如遇其他问题，请联系 [support@exa.ai](mailto:support@exa.ai)，并提供你的 Exa organization 名称、受影响成员的邮箱，以及大致的尝试时间。
</Note>