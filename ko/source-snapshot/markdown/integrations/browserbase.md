> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="browserbase">
  # Browserbase
</div>

> Exa 기업 검색과 Browserbase 브라우저 자동화를 결합해 입사 지원 워크플로우를 구현합니다.

Exa로 기업과 채용 페이지를 찾은 다음, Browserbase와 Stagehand로 해당 페이지를 분석하고 조작해 보세요.

<div id="install">
  ## 설치
</div>

Browserbase Exa 템플릿에서 사용하는 package를 설치합니다:

```bash npm theme={null}
npm install @browserbasehq/stagehand dotenv exa-js zod
```

<div id="configure-environment-variables">
  ## 환경 변수 설정
</div>

Exa와 Browserbase에서 사용할 API key를 설정하세요:

```bash .env theme={null}
BROWSERBASE_API_KEY=your-browserbase-api-key
EXA_API_KEY=your-exa-api-key
```

<div id="search-and-interact-with-a-page">
  ## 페이지 검색 및 상호작용
</div>

다음 예제는 템플릿의 워크플로우를 그대로 따릅니다. 회사를 search하고, careers page를 찾아 Browserbase 세션에서 연 다음, 채용 공고 내용을 추출하고 Stagehand agent가 해당 페이지와 상호작용하도록 합니다.

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

이 템플릿에는 채용 공고 상세 정보를 추출하고, 맞춤형 답변을 생성하며, 지원서 양식을 작성하는 전체 워크플로우가 포함되어 있습니다. [TypeScript 구현](https://github.com/browserbase/templates/tree/dev/typescript/exa-browserbase) 또는 [Python 구현](https://github.com/browserbase/templates/tree/dev/python/exa-browserbase)을 참고하세요.