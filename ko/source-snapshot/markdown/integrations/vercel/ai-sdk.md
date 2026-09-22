> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="ai-sdk-by-vercel">
  # AI SDK by Vercel
</div>

> @exalabs/ai-sdk 패키지로 AI SDK 애플리케이션에 Exa web search를 추가하세요.

`@exalabs/ai-sdk` 패키지를 사용하면 Vercel의 AI SDK로 만든 애플리케이션에 Exa web search를 추가할 수 있습니다. Exa API key만 제공하면 `webSearch()` 도구가 모델의 search request를 대신 처리합니다.

<div id="install">
  ## 설치
</div>

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

<div id="quick-start">
  ## 빠른 시작
</div>

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

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Info>
  예제를 실행하기 전에 키를 `EXA_API_KEY`에 설정하세요. 패키지가 이 환경 변수를 자동으로 읽어옵니다.
</Info>

<div id="defaults">
  ## 기본값
</div>

`webSearch()`는 다음 기본값을 사용합니다:

* `type`: `auto`
* `numResults`: `10`
* `contents.text`: result당 `3000`자
* `maxAgeHours`: 기본 캐시 폴백 값이며, 더 엄격한 freshness가 필요하면 이 옵션을 설정하세요

<div id="configure-search">
  ## search 설정
</div>

아래 옵션으로 search와 콘텐츠 extraction을 조정하세요:

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

<div id="search-options">
  ### search 옵션
</div>

| 옵션                                        | 설명                                                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `type`                                    | search mode: `auto`, `fast`, `instant`, `deep-lite`, `deep`, `deep-reasoning` 중 하나입니다.             |
| `category`                                | 콘텐츠 카테고리: `company`, `publication`, `news`, `personal site`, `people`, `financial report` 중 하나입니다. |
| `numResults`                              | 반환할 결과 개수입니다.                                                                                      |
| `includeDomains` / `excludeDomains`       | 특정 도메인을 포함하거나 제외합니다.                                                                               |
| `startPublishedDate` / `endPublishedDate` | ISO 8601 형식의 발행일로 결과를 필터링합니다.                                                                      |
| `includeText` / `excludeText`             | 결과에 특정 텍스트를 반드시 포함하거나 제외합니다.                                                                       |
| `userLocation`                            | 위치를 반영한 검색에 사용할 두 자리 국가 코드입니다.                                                                     |

<div id="content-options">
  ### Content options
</div>

| 옵션                                                     | 설명                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| `contents.text`                                        | 추출된 텍스트를 반환합니다. `maxCharacters`와 `includeHtmlTags`를 지원합니다. |
| `contents.summary`                                     | AI가 생성한 summary를 반환합니다. `query`를 지원합니다.                    |
| `contents.maxAgeHours`                                 | 지정한 기간 이내인 경우에만 캐시된 콘텐츠를 사용하고, 그렇지 않으면 livecrawl을 사용합니다.   |
| `contents.livecrawlTimeout`                            | livecrawl 타임아웃을 설정합니다.                                     |
| `contents.subpages` / `contents.subpageTarget`         | 하위 페이지를 크롤링하고, 필요에 따라 특정 하위 페이지를 지정합니다.                    |
| `contents.extras.links` / `contents.extras.imageLinks` | 결과에서 링크 또는 이미지 링크를 반환합니다.                                  |

<div id="typescript-support">
  ## TypeScript 지원
</div>

이 패키지에는 TypeScript 타입이 포함되어 있습니다:

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

<div id="related-pages">
  ## 관련 페이지
</div>

<Columns cols={2}>
  <Card title="Vercel AI Gateway 사용하기" icon="cloud" href="/ko/docs/integrations/vercel/ai-gateway" cta="가이드 열기" arrow="true">
    Vercel의 AI Gateway를 통해 Exa API key 없이 Exa web search를 사용하세요.
  </Card>

  <Card title="AI SDK 패키지 살펴보기" icon="git-branch" href="https://github.com/exa-labs/ai-sdk" cta="소스 보기" arrow="true">
    GitHub에서 소스 코드와 패키지 상세 정보를 확인하세요.
  </Card>
</Columns>

패키지는 [npm](https://www.npmjs.com/package/@exalabs/ai-sdk)에서도 확인할 수 있으며, [Vercel AI SDK web search 가이드](https://ai-sdk.dev/cookbook/node/web-search-agent#exa)도 함께 참고하세요.