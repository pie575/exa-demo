> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可先通过该文件查看所有可用页面。

<div id="browserbase">
  # Browserbase
</div>

> 将 Exa 的公司搜索与 Browserbase 浏览器自动化相结合，构建求职申请工作流。

使用 Exa 查找公司及其招聘页面，然后借助 Browserbase 和 Stagehand 检查这些页面并与之交互。

<div id="install">
  ## 安装
</div>

安装 Browserbase Exa 模板所需的依赖包：

```bash npm theme={null}
npm install @browserbasehq/stagehand dotenv exa-js zod
```

<div id="configure-environment-variables">
  ## 配置环境变量
</div>

设置 Exa 和 Browserbase 使用的 API key：

```bash .env theme={null}
BROWSERBASE_API_KEY=your-browserbase-api-key
EXA_API_KEY=your-exa-api-key
```

<div id="search-and-interact-with-a-page">
  ## 搜索并与页面交互
</div>

以下示例遵循该模板的工作流程：搜索公司、找到招聘页面、在 Browserbase 会话中打开该页面、提取职位描述，并让 Stagehand agent 与页面交互。

```typescript quickstart.ts theme={null}
import "dotenv/config";
import { Stagehand } from "@browserbasehq/stagehand";
import Exa from "exa-js";
import { z } from "zod";

const exa = new Exa(process.env.EXA_API_KEY);

const companies = await exa.search("AI startups in SF", {
  category: "company",
  type: "auto",
  numResults: 5,
  contents: { text: true },
});

const company = companies.results[0];
if (!company?.url) {
  throw new Error("No matching company found");
}

const companyDomain = new URL(company.url).hostname.replace("www.", "");
const careers = await exa.search(`${companyDomain} careers page`, {
  excludeDomains: ["linkedin.com"],
  type: "deep",
  numResults: 5,
  contents: { text: true },
});

const careersUrl = careers.results[0]?.url;
if (!careersUrl) {
  throw new Error("No careers page found");
}

const stagehand = new Stagehand({
  env: "BROWSERBASE",
  model: "google/gemini-2.5-pro",
});

try {
  await stagehand.init();
  const page = stagehand.context.pages()[0];
  await page.goto(careersUrl);

  const jobDescription = await stagehand.extract(
    "Extract the job title, requirements, responsibilities, and other important details from this page.",
    z.object({
      jobTitle: z.string(),
      requirements: z.array(z.string()),
      responsibilities: z.array(z.string()),
      details: z.string(),
    }),
  );

  const agent = stagehand.agent({
    mode: "hybrid",
    model: "google/gemini-3-flash-preview",
    systemPrompt: "Interact with the page without submitting an application.",
  });

  const result = await agent.execute({
    instruction: `Review this job posting and identify the next application step. Job details: ${JSON.stringify(jobDescription)}`,
    maxSteps: 10,
  });

  console.log(result);
} finally {
  await stagehand.close();
}
```

该模板包含提取职位详情、生成定制化回复以及填写申请表单的完整工作流。请参阅 [TypeScript 实现](https://github.com/browserbase/templates/tree/dev/typescript/exa-browserbase) 或 [Python 实现](https://github.com/browserbase/templates/tree/dev/python/exa-browserbase)。