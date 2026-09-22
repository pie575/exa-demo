> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# fx by Vercel Labs {#fx-by-vercel-labs}

> 호스팅형 Exa MCP 서버로 Vercel Labs의 네이티브 coding agent인 fx에 Exa web search를 추가하세요.

[fx](https://fx.sh)는 Vercel Labs에서 만든 네이티브 coding agent이자 CLI이며, MCP 클라이언트이기도 합니다. Exa의 호스팅형 MCP 서버를 추가하면 실시간 web search와 페이지 읽기 기능을 사용할 수 있습니다.

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/vercel/fx/install-exa.gif?s=2e331148abdf5bdf083e6f651e3b8b75" alt="fx 설치, /mcp add로 Exa MCP 서버 추가, 실시간 Exa web search 실행" style={{width: "100%", height: "auto"}} width="800" height="393" data-path="images/integrations/vercel/fx/install-exa.gif" />
</Frame>

## 설치 {#installation}

<Steps>
  <Step title="fx 설치">
    ```bash theme={null}
    curl -fsSL https://fx.sh/setup.sh | bash
    ```

    그런 다음 `fx login`으로 로그인하세요. 제공업체 옵션은 [fx 문서](https://fx.sh/docs)를 참고하세요.
  </Step>

  <Step title="Exa 추가">
    `fx`를 실행해 fx를 시작한 다음, 대화형 셸에서 Exa MCP 서버를 추가하세요:

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    fx는 서버 정보를 `~/.fx/mcp.json`에 저장하고 MCP를 다시 로드합니다.
  </Step>

  <Step title="연결 확인">
    ```text theme={null}
    /mcp list
    ```
  </Step>
</Steps>

## 직접 설정하기 {#configure-by-hand}

fx는 `~/.fx/mcp.json`에서만 MCP 서버를 읽어오므로, 이 파일에 Exa를 직접 추가할 수도 있습니다:

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

무료 plan은 가벼운 사용에 적합합니다. 속도 제한을 완화하려면 API 키를 생성해 config에 추가하세요:

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
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

`header_env`는 header 이름을 환경 변수에 매핑하므로, 키가 설정 파일에 남지 않습니다.

## 도구 디스커버리 {#tool-discovery}

fx는 MCP 도구를 지연 방식으로 검색합니다. 서버의 도구는 해당 턴에서 필요해지기 전까지 모델의 컨텍스트에 올라가지 않으므로, 웹을 search하지 않는 턴에서는 Exa를 추가해도 비용이 들지 않습니다.

<Card title="Exa MCP" icon="plug" href="/ko/docs/get-started/exa-mcp" cta="가이드 열기" arrow="true">
  사용 가능한 도구, 구성 옵션, 그 밖의 client를 살펴보세요.
</Card>