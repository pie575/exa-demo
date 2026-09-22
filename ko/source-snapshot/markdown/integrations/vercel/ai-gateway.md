> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="vercel-ai-gateway">
  # Vercel AI Gateway
</div>

> AI SDK와 함께 Vercel AI Gateway를 통해 Exa web search를 사용하세요.

`ai` 패키지의 `gateway.tools.exaSearch()`로 [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)를 통해 Exa web search를 사용할 수 있습니다. Exa API key는 필요하지 않으며, 해당 요청 비용은 Vercel이 AI Gateway를 통해 청구합니다. 전체 reference는 Vercel의 [web search 문서](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)를 참고하세요.

<div id="install">
  ## 설치
</div>

AI SDK 5 이상을 설치하세요:

```bash install.sh theme={null}
npm install ai
```

<div id="authentication">
  ## 인증
</div>

<Info>
  AI Gateway를 사용하려면 API 키 또는 OIDC 토큰이 필요합니다. Vercel dashboard의 **AI Gateway &gt; API Keys**에서 `AI_GATEWAY_API_KEY`를 생성한 뒤 환경 변수에 추가하세요.
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

Vercel에 애플리케이션을 배포하면 자동으로 제공되는 `VERCEL_OIDC_TOKEN`을 대신 사용할 수 있습니다. Vercel의 [authentication 및 BYOK 문서](https://vercel.com/docs/ai-gateway/authentication-and-byok)를 참고하세요.

<div id="quick-start">
  ## 빠른 시작
</div>

지원되는 모든 모델에서 Exa search를 사용할 수 있습니다:

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
  ## 스트리밍
</div>

`streamText`를 사용해 생성되는 텍스트와 search 도구 이벤트를 도착하는 대로 처리하세요:

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

Next.js 라우트 핸들러에서는 `return result.toUIMessageStreamResponse()`로 스트리밍을 client에 반환합니다.

<div id="configuration">
  ## 구성
</div>

`gateway.tools.exaSearch()`에 옵션을 전달해 search를 세부 조정하세요:

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

사용 가능한 옵션은 다음과 같습니다:

| 옵션                                                     | 설명                                                |
| ------------------------------------------------------ | ------------------------------------------------- |
| `type`                                                 | search mode: `auto`(기본값), `fast`, `instant` 중 하나. |
| `numResults`                                           | 반환할 결과 개수(1~100). 기본값은 10입니다.                     |
| `category`                                             | 콘텐츠 카테고리.                                         |
| `includeDomains` / `excludeDomains`                    | 특정 도메인 포함 또는 제외.                                  |
| `startPublishedDate` / `endPublishedDate`              | 발행일 기준으로 결과 필터링.                                  |
| `userLocation`                                         | 위치 기반 search에 사용할 두 글자 ISO 국가 코드.                 |
| `contents.text`                                        | 추출된 페이지 텍스트 반환.                                   |
| `contents.highlights`                                  | 관련 페이지 highlights 반환.                             |
| `contents.maxAgeHours`                                 | 캐시된 콘텐츠의 최대 보관 기간 설정.                             |
| `contents.livecrawlTimeout`                            | livecrawl 타임아웃 설정.                                |
| `contents.subpages` / `contents.subpageTarget`         | 하위 페이지 크롤링 및 특정 하위 페이지 지정(선택 사항).                 |
| `contents.extras.links` / `contents.extras.imageLinks` | 결과에서 링크 또는 이미지 링크 반환.                             |

parameters 전체 목록과 동작은 Vercel의 [Exa web search reference](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)를 참고하세요.

<div id="vercel-eve-agents">
  ## Vercel eve agents
</div>

[eve](https://eve.dev)로 만든 agent에는 `web_search` 도구가 기본 제공되며, AI Gateway 모델은 별도의 구성이나 Exa API key 없이도 기본적으로 이를 Exa에서 실행합니다. 제공업체를 명시적으로 고정하려면 `agent/tools/web_search.ts`에서 다음과 같이 내보내세요:

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

AI Gateway가 아닌 제공업체를 통해 직접 call되는 모델은 자체 web search를 그대로 유지합니다. 전체 도구 세트는 eve의 [harness 문서](https://eve.dev/docs/concepts/default-harness#built-in-tools)를 참고하세요.

<div id="pricing">
  ## Pricing
</div>

<Tip>
  Exa web search는 AI Gateway와 eve에서 **8월 31일까지 무료**이므로, 지금 바로 비용 부담 없이 사용해 볼 수 있습니다.
</Tip>

그 이후에는 AI Gateway를 통한 요청에 대해 Vercel이 [web search 문서](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)에 명시된 요금으로 청구합니다.

<Note>
  이 연동은 현재 Exa의 standard search mode와 content extraction 제어를 지원합니다. Deep synthesis 모드와 생성된 summary는 아직 제공되지 않습니다.
</Note>

<Columns cols={2}>
  <Card title="Exa AI SDK 사용하기" icon="code" href="/ko/docs/integrations/vercel/ai-sdk" cta="가이드 열기" arrow="true">
    `@exalabs/ai-sdk`를 통해 Exa API key로 Exa를 직접 call하세요.
  </Card>

  <Card title="Vercel의 web search reference 읽기" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="reference 열기" arrow="true">
    AI Gateway 구성 및 가격에 대한 전체 reference를 확인하세요.
  </Card>
</Columns>