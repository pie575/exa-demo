> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="vercel-ai-gateway">
  # Vercel AI Gateway
</div>

> AI SDK와 Vercel AI Gateway를 통해 Exa web search를 사용하세요.

`ai` package의 `gateway.tools.exaSearch()`로 [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)를 통해 Exa web search를 사용할 수 있습니다. Exa API key는 필요하지 않으며, 해당 요청 요금은 Vercel이 AI Gateway를 통해 청구합니다. 전체 레퍼런스는 Vercel의 [web search 문서](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)를 참고하세요.

<div id="install">
  ## 설치
</div>

AI SDK 5 이상을 설치합니다:

```bash install.sh theme={null}
npm install ai
```

<div id="authentication">
  ## 인증
</div>

<Info>
  AI Gateway를 사용하려면 API key 또는 OIDC 토큰이 필요합니다. Vercel dashboard의 **AI Gateway &gt; API Keys**에서 `AI_GATEWAY_API_KEY`를 생성한 뒤 환경 변수에 추가하세요.
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

Vercel에 애플리케이션을 배포하는 경우, 자동으로 제공되는 `VERCEL_OIDC_TOKEN`을 대신 사용할 수 있습니다. Vercel의 [인증 및 BYOK 문서](https://vercel.com/docs/ai-gateway/authentication-and-byok)를 참고하세요.

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
  ## Streaming
</div>

`streamText`를 사용해 생성된 텍스트와 search 도구 이벤트를 수신되는 즉시 처리하세요:

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

Next.js 라우트 handler에서는 `return result.toUIMessageStreamResponse()`로 스트림을 클라이언트에 반환합니다.

<div id="configuration">
  ## configuration
</div>

`gateway.tools.exaSearch()`에 옵션을 전달하여 search를 원하는 대로 조정하세요:

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
| `type`                                                 | search mode: `auto`(기본값), `fast`, `instant` 중 선택. |
| `numResults`                                           | 반환할 결과 수로, 1에서 100까지 지정합니다. 기본값은 10입니다.           |
| `category`                                             | 콘텐츠 카테고리.                                         |
| `includeDomains` / `excludeDomains`                    | 특정 도메인을 포함하거나 제외합니다.                              |
| `startPublishedDate` / `endPublishedDate`              | 게시일 기준으로 결과를 필터링합니다.                              |
| `userLocation`                                         | 위치 기반 search를 위한 두 자리 ISO 국가 코드.                  |
| `contents.text`                                        | 추출된 페이지 텍스트를 반환합니다.                               |
| `contents.highlights`                                  | 관련성 높은 페이지 highlights를 반환합니다.                     |
| `contents.maxAgeHours`                                 | 캐시된 콘텐츠의 최대 보관 기간을 설정합니다.                         |
| `contents.livecrawlTimeout`                            | 라이브크롤 타임아웃을 설정합니다.                                |
| `contents.subpages` / `contents.subpageTarget`         | 하위 페이지를 크롤링하고, 필요하면 특정 하위 페이지를 지정합니다.             |
| `contents.extras.links` / `contents.extras.imageLinks` | 결과에서 링크 또는 이미지 링크를 반환합니다.                         |

전체 매개변수 목록과 동작은 Vercel의 [Exa web search 레퍼런스](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)를 참고하세요.

<div id="vercel-eve-agents">
  ## Vercel eve agents
</div>

[eve](https://eve.dev)로 만든 agent에는 `web_search` 도구가 기본 내장되어 있으며, AI Gateway 모델은 별도의 configuration이나 Exa API key 없이도 기본적으로 이 도구를 Exa에서 실행합니다. provider를 명시적으로 고정하려면 `agent/tools/web_search.ts`에서 다음과 같이 내보내세요:

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

AI Gateway를 거치지 않고 provider를 통해 직접 호출되는 모델은 자체 web search를 그대로 사용합니다. 전체 도구 세트는 eve의 [harness 문서](https://eve.dev/docs/concepts/default-harness#built-in-tools)를 참고하세요.

<div id="pricing">
  ## 가격
</div>

<Tip>
  Exa web search는 AI Gateway와 eve에서 **8월 31일까지 무료**이므로, 오늘 바로 비용 없이 사용해 개발할 수 있습니다.
</Tip>

이후부터는 Vercel이 [web search 문서](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)에 명시된 요금으로 AI Gateway를 통한 요청에 대해 청구합니다.

<Note>
  이 통합은 현재 Exa의 표준 search mode와 콘텐츠 extraction 제어를 지원합니다. deep synthesis 모드와 생성된 summaries는 아직 지원되지 않습니다.
</Note>

<Columns cols={2}>
  <Card title="Exa AI SDK 사용하기" icon="code" href="/ko/docs/integrations/vercel/ai-sdk" cta="가이드 열기" arrow="true">
    `@exalabs/ai-sdk`를 통해 Exa API key로 Exa를 직접 call하세요.
  </Card>

  <Card title="Vercel의 web search 레퍼런스 읽기" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="레퍼런스 열기" arrow="true">
    AI Gateway의 전체 configuration 및 가격 레퍼런스를 확인하세요.
  </Card>
</Columns>