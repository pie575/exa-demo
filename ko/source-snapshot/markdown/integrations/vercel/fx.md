> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="fx-by-vercel-labs">
  # fx by Vercel Labs
</div>

> 호스팅형 Exa MCP server로 Vercel Labs의 네이티브 coding agent인 fx에 Exa web search를 추가하세요.

[fx](https://fx.sh)는 Vercel Labs에서 만든 네이티브 coding agent 겸 CLI이며, MCP 클라이언트이기도 합니다. Exa의 호스팅형 MCP server를 추가하면 실시간 web search와 페이지 읽기 기능을 사용할 수 있습니다.

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/vercel/fx/install-exa.gif?s=2e331148abdf5bdf083e6f651e3b8b75" alt="fx 설치, /mcp add로 Exa MCP server 추가, 실시간 Exa web search 실행" style={{width: "100%", height: "auto"}} width="800" height="393" data-path="images/integrations/vercel/fx/install-exa.gif" />
</Frame>

<div id="installation">
  ## 설치
</div>

<Steps>
  <Step title="fx 설치">
    ```bash theme={null}
    curl -fsSL https://fx.sh/setup.sh | bash
    ```

    그런 다음 `fx login`으로 로그인하세요. provider 옵션은 [fx 문서](https://fx.sh/docs)를 참고하세요.
  </Step>

  <Step title="Exa 추가">
    `fx`를 실행해 fx를 시작한 뒤, 대화형 셸에서 Exa MCP server를 추가하세요:

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    fx는 해당 서버를 `~/.fx/mcp.json`에 저장하고 MCP를 다시 로드합니다.
  </Step>

  <Step title="연결 확인">
    ```text theme={null}
    /mcp list
    ```
  </Step>
</Steps>

<div id="configure-by-hand">
  ## 직접 설정하기
</div>

fx는 `~/.fx/mcp.json`에서만 MCP server를 읽으므로, 이 파일에 Exa를 직접 추가할 수도 있습니다:

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

fx를 재시작하지 않고 변경 사항을 적용하려면 `/mcp reload`를 실행하세요.

무료 플랜은 가벼운 사용에 적합합니다. rate limits를 늘리려면 API key를 생성해 설정에 추가하세요.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp",
      "header_env": {
        "x-api-key": "EXA_API_KEY"
      }
    }
  }
}
```

`header_env`는 header 이름을 환경 변수에 매핑하므로, key를 설정 파일에 남기지 않아도 됩니다.

<div id="tool-discovery">
  ## 도구 탐색
</div>

fx는 MCP 도구를 지연 방식으로 탐색합니다. 서버의 도구는 해당 턴에서 필요해지기 전까지 모델 컨텍스트에 포함되지 않으므로, 웹을 검색하지 않는 턴에서는 Exa를 추가해도 비용이 발생하지 않습니다.

<Card title="Exa MCP" icon="plug" href="/ko/docs/get-started/exa-mcp" cta="가이드 열기" arrow="true">
  사용 가능한 도구, 설정 옵션, 기타 클라이언트를 살펴보세요.
</Card>