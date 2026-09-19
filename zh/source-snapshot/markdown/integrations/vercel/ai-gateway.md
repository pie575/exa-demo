> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可借助该文件了解所有可用页面。

<div id="vercel-ai-gateway">
  # Vercel AI Gateway
</div>

> 借助 AI SDK，通过 Vercel AI Gateway 使用 Exa 网页搜索。

使用 `ai` 包中的 `gateway.tools.exaSearch()`，即可通过 [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) 调用 Exa 网页搜索。你无需 Exa API key，Vercel 会通过 AI Gateway 为这些请求计费。完整参考请查阅 Vercel 的[网页搜索文档](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)。

<div id="install">
  ## 安装
</div>

安装 AI SDK 5 或更高版本：

```bash install.sh theme={null}
npm install ai
```

<div id="authentication">
  ## 认证
</div>

<Info>
  AI Gateway 需要 API key 或 OIDC 令牌。在 Vercel 控制台的 **AI Gateway &gt; API Keys** 下创建一个 `AI_GATEWAY_API_KEY`，然后将其添加到你的环境变量中。
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

在 Vercel 上部署应用时，你可以改用自动提供的 `VERCEL_OIDC_TOKEN`。请参阅 Vercel 的[身份验证与 BYOK 文档](https://vercel.com/docs/ai-gateway/authentication-and-byok)。

<div id="quick-start">
  ## 快速开始
</div>

你可以在任意受支持的模型上使用 Exa search：

```typescript quickstart.ts theme={null}
import { gateway, generateText, stepCountIs } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<div id="streaming">
  ## 流式输出
</div>

使用 `streamText` 在生成的文本和 search 工具事件到达时实时处理：

```typescript stream.ts theme={null}
import { gateway, streamText } from 'ai';

const result = streamText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
});

for await (const part of result.fullStream) {
  if (part.type === 'text-delta') {
    process.stdout.write(part.text);
  } else if (part.type === 'tool-call') {
    console.log('Tool call:', part.toolName);
  } else if (part.type === 'tool-result') {
    console.log('Search results received');
  }
}
```

在 Next.js 路由处理程序中，通过 `return result.toUIMessageStreamResponse()` 将流返回给客户端。

<div id="configuration">
  ## 配置
</div>

向 `gateway.tools.exaSearch()` 传入选项即可调整搜索行为：

```typescript configuration.ts theme={null}
tools: {
  exa_search: gateway.tools.exaSearch({
    type: 'fast',
    numResults: 5,
    category: 'news',
    includeDomains: ['reuters.com', 'bbc.com', 'nytimes.com'],
    contents: {
      highlights: true,
      maxAgeHours: 24,
    },
  }),
},
```

可用选项包括：

| 选项                                                     | 说明                                    |
| ------------------------------------------------------ | ------------------------------------- |
| `type`                                                 | 搜索模式：`auto` (默认) 、`fast` 或 `instant`。 |
| `numResults`                                           | 返回的结果数量，范围为 1 到 100，默认值为 10。          |
| `category`                                             | 内容类别。                                 |
| `includeDomains` / `excludeDomains`                    | 包含或排除特定域名。                            |
| `startPublishedDate` / `endPublishedDate`              | 按发布日期筛选结果。                            |
| `userLocation`                                         | 两位字母的 ISO 国家代码，用于位置感知搜索。              |
| `contents.text`                                        | 返回提取的页面文本。                            |
| `contents.highlights`                                  | 返回页面中的相关 highlights。                  |
| `contents.maxAgeHours`                                 | 设置缓存内容的最长有效期。                         |
| `contents.livecrawlTimeout`                            | 设置实时抓取的超时时间。                          |
| `contents.subpages` / `contents.subpageTarget`         | 抓取子页面，并可指定目标子页面。                      |
| `contents.extras.links` / `contents.extras.imageLinks` | 返回结果中的链接或图片链接。                        |

完整的参数列表及其行为说明，请参阅 Vercel 的 [Exa 网页搜索参考文档](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)。

<div id="vercel-eve-agents">
  ## Vercel eve agents
</div>

使用 [eve](https://eve.dev) 构建的 agent 内置 `web_search` 工具，AI Gateway 模型默认通过 Exa 运行该工具，无需任何配置，也不需要 Exa API key。若要显式指定提供商，可在 `agent/tools/web_search.ts` 中导出：

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

直接通过提供商 (而非 AI Gateway) 调用的模型会保留其原生网页搜索能力。完整工具集请参阅 eve 的 [harness 文档](https://eve.dev/docs/concepts/default-harness#built-in-tools)。

<div id="pricing">
  ## 定价
</div>

<Tip>
  在 AI Gateway 和 eve 上，Exa 网页搜索 **在 8 月 31 日前均可免费使用**，你现在就可以零成本上手开发。
</Tip>

此后，Vercel 将按其[网页搜索文档](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)中列出的费率，对通过 AI Gateway 发起的请求计费。

<Note>
  该集成目前支持 Exa 的标准搜索模式和内容提取控制项。深度综合模式和生成式摘要尚未开放。
</Note>

<Columns cols={2}>
  <Card title="使用 Exa AI SDK" icon="code" href="/zh/docs/integrations/vercel/ai-sdk" cta="打开指南" arrow="true">
    通过 `@exalabs/ai-sdk`，使用 Exa API key 直接调用 Exa。
  </Card>

  <Card title="查看 Vercel 的网页搜索参考文档" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="打开参考文档" arrow="true">
    查阅完整的 AI Gateway 配置与定价参考文档。
  </Card>
</Columns>