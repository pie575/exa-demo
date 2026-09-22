> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，请先通过该文件了解所有可用页面。

# Exa in Slack {#exa-in-slack}

> 在 Slack 中安装 Exa，在任意频道或消息串中 tag @Exa，即可获得带引用来源的研究、列表构建与增强答案。

把 Exa 引入团队的 Slack。在任意频道或消息串中 tag **@Exa**，提出研究问题、列表构建任务或增强请求。Exa 会搜索网络、阅读来源，并在消息串中回复带引用的答案。

## 开始使用 {#get-started}

### 安装 {#installation}

1. 前往 [控制台 &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack)，然后点击 **Install**。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="Exa 控制台中的 Exa in Slack 页面，带有 Install 按钮" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. 此时会打开 Slack 的 OAuth 授权流程。选择要安装 Exa 的工作区，然后点击 **Allow**。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="Exa 应用的 Slack OAuth 授权页面，显示 &#x22;App is not approved by Slack&#x22; 提示、工作区选择器、请求的权限以及 Allow 按钮" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  红色的 **“App is not approved by Slack”** 提示属于正常现象，可以忽略。它只是表示
  Exa 尚未上架 Slack 公共应用市场，并不意味着出了什么问题。
</Note>

3. 安装完成后，将 @Exa 邀请到频道 (或直接私信它) ，即可开始提问。

## 如何在 Slack 中使用 Exa {#how-to-use-exa-from-slack}

在任何已添加 Exa 的频道中，@Exa 并提出你的问题：

```text theme={null}
@Exa 查找旧金山所有获得 A 轮融资的金融科技初创公司
```

Exa 会在消息串中回复你的问题。

### 追问 {#follow-ups}

Exa 在某个消息串中回答后，直接在该消息串里回复即可继续对话，无需再次 @Exa。Exa 会记住对话内容，因此追问会基于上一条回答展开。消息串中的任何人都可以追问。

### 私信 {#direct-messages}

你也可以在私信中直接给 Exa 发消息，无需 @ 提及。你发送的每条消息都会发起一个新的请求，并在该消息下的消息串中回复。若要继续这段对话，请在该消息串中回复。

### 取消运行 {#cancelling-a-run}

运行进行中时，在消息串中回复并让 Exa 停止该次运行即可，无需 @Exa。

```text theme={null}
停止当前运行
```

### Exa Connect 提供方 {#exa-connect-providers}

当 [Exa Connect](/zh/docs/agent/connect/overview) 数据提供方与你的问题相关时，Exa 会自动调用它们。若要指定某个提供方，请在消息中提及它：

```text theme={null}
@Exa 用 Fiber.ai 帮我找出本季度获得融资的所有 AI 基础设施初创公司
```

想获取所有可用数据提供方的列表，直接问 Exa 即可。

## 示例 {#examples}

### 新闻与时事 {#news-and-current-events}

了解任何话题的最新资讯。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Exa 在 Slack 消息串中回答有关某个话题最新新闻的问题，并以表格形式展示带日期的结果" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

### 大规模列表构建 {#large-list-building}

在请求前加上 `!max`，即可进行详尽的列表构建。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Exa 在 Slack 消息串中运行 !max 列表构建请求并返回结果表格" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

## 关键词 {#keywords}

在 Exa 所在的消息串中使用这些关键词。命令可以跟在 `@Exa` mention 之后，也可以直接作为消息开头：

| 关键词               | 功能                                                 |
| ----------------- | -------------------------------------------------- |
| `!max <message>`  | 以最高 effort 运行此请求，适合构建超大规模列表。                       |
| `mute`            | 让 Exa 不再回复消息串中未 mention 它的消息，显式 @Exa mention 仍然有效。 |
| `unmute`          | 在 `mute` 之后恢复消息串中的追问。                              |
| `sleep`           | 让 Exa 在该消息串中完全停止工作，mention @Exa 即可将其唤醒。            |
| `aside <message>` | 发布一条 Exa 会忽略的旁注，便于在 Exa 关注的消息串中与队友交流。              |
| `help`            | 显示使用说明。                                            |

## 权限 {#permissions}

Slack 版 Exa 应用会请求以下权限范围：

| 权限                     | Slack 访问范围                | Exa 为何需要它                                |
| ---------------------- | ------------------------- | ---------------------------------------- |
| `app_mentions:read`    | 查看直接提及 @Exa 的消息           | 当有人在频道或消息串中提及 Exa 时发起请求                  |
| `assistant:write`      | 在 Slack 中以 App Agent 身份运行 | 使用 Slack 的 agent 体验，将回答以流式方式发送到私信和频道消息串中 |
| `channels:history`     | 查看 Exa 已加入的公开频道中的消息       | 接收公开频道的消息串回复，使追问无需再次提及即可生效               |
| `channels:read`        | 查看公开频道的基本信息               | 在选择网页会话的同步目标时，找出已包含 Exa 的公开频道            |
| `chat:write`           | 以 Exa 应用身份发送消息            | 发布消息串根消息、回答、进度更新、确认信息以及从网页同步的消息          |
| `chat:write.customize` | 自定义由应用发出的消息的名称和头像         | 在从网页应用同步过来的消息上显示网页参与者的名称和头像              |
| `files:read`           | 查看 Exa 已加入的会话中共享的文件       | 读取随问题附上的文件                               |
| `files:write`          | 以 Exa 应用身份上传、编辑和删除文件      | 将结果文件 (例如导出的表格) 附加到回答中                   |
| `groups:history`       | 查看 Exa 已加入的私有频道中的消息       | 接收私有频道的消息串回复，使追问无需再次提及即可生效               |
| `groups:read`          | 查看 Exa 已加入的私有频道的基本信息      | 在选择网页会话的同步目标时，找出符合条件的私有频道并验证成员身份         |
| `im:history`           | 查看与 Exa 的私信中的消息           | 接收私信请求和追问回复                              |
| `im:write`             | 发起私信                      | 当已验证用户选择将其 Exa 私信作为网页会话同步目标时，打开该私信       |
| `users:read`           | 查看成员及其基本 Slack 资料         | 将提及解析为名称，并在同步的消息上使用网页参与者的 Slack 头像       |
| `users:read.email`     | 查看工作区成员的电子邮件地址            | 匹配 Slack 与 Exa 账户，以便进行团队归属并自定义网页消息的头像    |

<Note>
  `channels:read`、`groups:read` 和 `im:write` 用于支持网页到 Slack 同步的目标发现。
  已有的安装可以在没有这些权限范围的情况下继续使用当前的 Slack 消息串，但
  在使用相应同步目标前必须重新连接。`chat:write.customize` 在运行时是可选的：
  若未授予，网页同步的消息将保留标准的 Exa 应用身份，并在消息正文中包含参与者的名称。
</Note>

Exa 仅接收来自它被明确邀请加入的频道以及自身私信中的消息。

## 定价 {#pricing}

从 Slack 发起的运行将计入你的 Exa 团队账单。详情请参阅[定价](https://exa.ai/pricing)。

## 隐私 {#privacy}

有关 Exa 如何处理你的数据，请参阅 [Exa 隐私政策](https://exa.ai/privacy-policy)。