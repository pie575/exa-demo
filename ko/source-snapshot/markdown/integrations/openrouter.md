> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일을 활용해 사용 가능한 모든 페이지를 확인하세요.

<div id="openrouter">
  # OpenRouter
</div>

> openrouter:web&#95;search server tool로 모든 OpenRouter 모델에 Exa web search 기반의 근거를 더하세요.

Exa는 [OpenRouter](https://openrouter.ai) web search의 기반이 되는 검색 엔진입니다. OpenRouter는 하나의 API로 수백 개의 모델을 사용할 수 있게 해주고, Exa는 그 모델들에 실시간 웹 접근 능력을 더해줍니다. 자체 검색 기능이 없는 모델은 기본적으로 Exa를 통해 근거를 확보하며, 어떤 모델이든 명시적으로 Exa를 사용하도록 지정할 수 있습니다. Exa API key는 필요하지 않습니다. OpenRouter가 서버 측에서 검색을 실행하고 그 비용을 OpenRouter credits에서 청구합니다.

<div id="use-the-web-search-server-tool">
  ## web search server tool 사용하기
</div>

`tools` array에 `openrouter:web_search`를 추가하면 언제 search할지, 무엇을 search할지, 동일한 요청 내에서 다시 search할지 여부를 모델이 스스로 판단합니다. [Server tools](https://openrouter.ai/docs/guides/features/server-tools/web-search)는 OpenRouter에서 베타 단계이며, 지원 중단된 `web` 플러그인과 `:online` 모델 변형을 대체합니다. 둘 중 하나를 사용 중이라면 OpenRouter의 [마이그레이션 가이드](https://openrouter.ai/docs/guides/features/server-tools/web-search#migrating-from-the-web-search-plugin)를 참고하세요.

<CodeGroup>
  ```javascript JavaScript theme={null}
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer <OPENROUTER_API_KEY>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.2",
      messages: [
        { role: "user", content: "What were the major AI announcements this week?" },
      ],
      tools: [{ type: "openrouter:web_search" }],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      "https://openrouter.ai/api/v1/chat/completions",
      headers={
          "Authorization": "Bearer <OPENROUTER_API_KEY>",
          "Content-Type": "application/json",
      },
      json={
          "model": "openai/gpt-5.2",
          "messages": [
              {"role": "user", "content": "What were the major AI announcements this week?"}
          ],
          "tools": [{"type": "openrouter:web_search"}],
      },
  )

  print(response.json()["choices"][0]["message"]["content"])
  ```

  ```bash cURL theme={null}
  curl https://openrouter.ai/api/v1/chat/completions \
    -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "openai/gpt-5.2",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [{ "type": "openrouter:web_search" }]
    }'
  ```
</CodeGroup>

기본값인 `engine: "auto"`에서는 모델에 자체 search 기능이 있으면 해당 제공업체의 네이티브 search를 사용하고, 그 외에는 모두 Exa를 사용합니다. 모든 모델에서 동일한 search 동작을 유지하려면 `engine: "exa"`로 설정하세요.

```json theme={null}
{
  "type": "openrouter:web_search",
  "parameters": {
    "engine": "exa",
    "mode": "auto",
    "max_results": 5,
    "max_total_results": 20,
    "allowed_domains": ["arxiv.org"],
    "excluded_domains": ["reddit.com"]
  }
}
```

| 매개변수                                  | 용도                                                                                                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`                                | latency와 깊이를 절충: `instant`, `fast`, `auto`(기본값), `deep-lite`, `deep`, `deep-reasoning`. 각 모드는 Exa의 [search types](/ko/docs/search/quickstart)에 대응됩니다. |
| `max_results`                         | search call당 결과 수 제한(기본값 5)                                                                                                                        |
| `max_uses`                            | 한 요청에서 모델이 검색할 수 있는 횟수 제한                                                                                                                          |
| `max_total_results`                   | 한 요청 내 모든 searches의 누적 결과 수 제한                                                                                                                     |
| `max_characters`                      | highlights에 적용할 result별 정확한 character budget 설정                                                                                                    |
| `search_context_size`                 | 직접 지정하는 대신 사전 설정된 예산 사용: `low`, `medium`, `high`                                                                                                   |
| `allowed_domains`, `excluded_domains` | result 도메인 필터링. Exa는 동일한 요청에서 두 필터를 모두 지원합니다.                                                                                                      |

<div id="how-results-come-back">
  ## 결과가 반환되는 방식
</div>

OpenRouter는 각 result에 대해 전체 페이지 텍스트 대신 [Exa highlights](/ko/docs/search/highlights)를 요청합니다. 이는 길이가 자동으로 조정되는 추출형 발췌문으로, `max_characters`나 `search_context_size`를 설정하지 않으면 보통 result당 2,000~4,000자입니다. 모델은 이 발췌문을 읽고, API 호출자는 response 메시지의 표준화된 `url_citation` 주석 형태로 발췌문을 전달받습니다. 하나의 result 안에서는 `[...]` 표시가 페이지의 서로 다른 부분에서 가져온 발췌문을 구분해 줍니다.

<div id="pricing">
  ## Pricing
</div>

Exa search는 결과를 읽는 데 드는 모델의 토큰 비용과 별도로 OpenRouter credits에서 청구됩니다. `instant`, `fast`, `auto` 모드는 search당 $0.007, `deep-lite`와 `deep`은 $0.012, `deep-reasoning`은 $0.015입니다. 각 search에는 최대 10개의 결과가 포함되며, 그 이상의 결과는 개당 $0.001입니다. 현재 요금은 [OpenRouter의 web search 문서](https://openrouter.ai/docs/guides/features/server-tools/web-search)를 참고하세요.

response의 `usage` 객체에서는 모델이 실행한 search 횟수를 `server_tool_use.web_search_requests`로 확인할 수 있습니다.

<div id="resources">
  ## Resources
</div>

<Columns cols={2}>
  <Card title="Server tool 문서" icon="wrench" href="https://openrouter.ai/docs/guides/features/server-tools/web-search" cta="문서 열기" arrow="true">
    `openrouter:web_search`의 전체 구성 reference입니다.
  </Card>

  <Card title="고객 사례" icon="book-open" href="https://exa.ai/customers/openrouter" cta="사례 읽기" arrow="true">
    OpenRouter가 Exa를 활용해 수백 개의 모델에 web search를 제공하는 방법.
  </Card>
</Columns>