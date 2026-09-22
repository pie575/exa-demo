> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

# AI SDK by Vercel {#ai-sdk-by-vercel}

> 使用 @exalabs/ai-sdk 包，为 AI SDK 应用添加 Exa 网页搜索能力。

使用 `@exalabs/ai-sdk` 包，可为基于 Vercel AI SDK 构建的应用添加 Exa 网页搜索。你只需提供 Exa API 密钥，`webSearch()` 工具便会为你的模型处理搜索请求。

## 安装 {#install}

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

## 快速开始 {#quick-start}

```typescript quickstart.ts theme={null}
import { generateText, stepCountIs } from 'ai';
import { webSearch } from '@exalabs/ai-sdk';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Tell me the latest developments in AI',
  system: 'Only use web search once per turn. Answer based on the information you have.',
  tools: {
    webSearch: webSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户会获赠免费积分。
</Card>

<Info>
  运行示例前，请将密钥设置到环境变量 `EXA_API_KEY` 中。该包会自动读取此环境变量。
</Info>

## 默认值 {#defaults}

`webSearch()` 使用以下默认值：

* `type`：`auto`
* `numResults`：`10`
* `contents.text`：每条结果 `3000` 个字符
* `maxAgeHours`：采用默认的缓存回退值；如需更严格的新鲜度，请显式设置该选项

## 配置搜索 {#configure-search}

使用以下选项调整搜索和内容提取：

```typescript configuration.ts theme={null}
const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Find the top AI companies in Europe founded after 2018',
  tools: {
    webSearch: webSearch({
      type: 'auto',
      numResults: 6,
      category: 'company',
      contents: {
        text: { maxCharacters: 1000 },
        maxAgeHours: 1,
        summary: true,
      },
    }),
  },
  stopWhen: stepCountIs(5),
});

console.log(text);
```

### 搜索选项 {#search-options}

| 选项                                        | 说明                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `type`                                    | 搜索模式：`auto`、`fast`、`instant`、`deep-lite`、`deep` 或 `deep-reasoning`。                |
| `category`                                | 内容类别：`company`、`publication`、`news`、`personal site`、`people` 或 `financial report`。 |
| `numResults`                              | 返回的结果数量。                                                                           |
| `includeDomains` / `excludeDomains`       | 包含或排除指定域名。                                                                         |
| `startPublishedDate` / `endPublishedDate` | 按发布日期筛选结果，使用 ISO 8601 格式。                                                          |
| `includeText` / `excludeText`             | 要求结果中包含或排除指定文本。                                                                    |
| `userLocation`                            | 两位字母国家代码，用于位置感知搜索。                                                                 |

### Content options {#content-options}

| 选项                                                     | 说明                                              |
| ------------------------------------------------------ | ----------------------------------------------- |
| `contents.text`                                        | 返回提取的文本。支持 `maxCharacters` 和 `includeHtmlTags`。 |
| `contents.summary`                                     | 返回 AI 生成的摘要。支持 `query`。                         |
| `contents.maxAgeHours`                                 | 仅当缓存内容在指定时效内时才使用缓存，否则使用实时抓取。                    |
| `contents.livecrawlTimeout`                            | 设置实时抓取的超时时间。                                    |
| `contents.subpages` / `contents.subpageTarget`         | 抓取子页面，并可指定目标子页面。                                |
| `contents.extras.links` / `contents.extras.imageLinks` | 返回结果中的链接或图片链接。                                  |

## TypeScript 支持 {#typescript-support}

该包内置了 TypeScript 类型定义：

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

## 相关页面 {#related-pages}

<Columns cols={2}>
  <Card title="使用 Vercel AI Gateway" icon="cloud" href="/zh/docs/integrations/vercel/ai-gateway" cta="打开指南" arrow="true">
    无需 Exa API 密钥，通过 Vercel 的 AI Gateway 使用 Exa 网页搜索。
  </Card>

  <Card title="了解 AI SDK 包" icon="git-branch" href="https://github.com/exa-labs/ai-sdk" cta="查看源文件" arrow="true">
    在 GitHub 上查看源代码和包的详细信息。
  </Card>
</Columns>

你也可以在 [npm](https://www.npmjs.com/package/@exalabs/ai-sdk) 上找到该包，并阅读 [Vercel AI SDK 网页搜索指南](https://ai-sdk.dev/cookbook/node/web-search-agent#exa)。