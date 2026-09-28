> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく読み進める前に、このファイルで利用可能なすべてのページを確認してください。

# Browserbase {#browserbase}

> Exa の企業検索と Browserbase のブラウザ自動化を組み合わせて、求人応募のワークフローを構築します。

Exa で企業や採用ページを検索し、Browserbase と Stagehand でそれらのページを確認・操作します。

## インストール {#install}

Browserbase Exa テンプレートで使用するパッケージをインストールします。

```bash npm theme={null}
npm install @browserbasehq/stagehand dotenv exa-js zod
```

## 環境変数を設定する {#configure-environment-variables}

Exa と Browserbase で使用する API キーを設定します。

```bash .env theme={null}
BROWSERBASE_API_KEY=your-browserbase-api-key
EXA_API_KEY=your-exa-api-key
```

## ページを検索して操作する {#search-and-interact-with-a-page}

次の例では、テンプレートのワークフローに沿って、企業を検索し、採用ページを見つけて Browserbase セッションで開き、職務内容を抽出したうえで、Stagehand エージェントにページを操作させます。

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

このテンプレートには、求人情報の抽出から、求人ごとに最適化した回答の生成、応募フォームへの入力までを一貫して行うワークフローが含まれています。詳しくは [TypeScript 実装](https://github.com/browserbase/templates/tree/dev/typescript/exa-browserbase)または [Python 実装](https://github.com/browserbase/templates/tree/dev/python/exa-browserbase)を参照してください。