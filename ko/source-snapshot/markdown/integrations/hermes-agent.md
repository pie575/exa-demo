> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="hermes-agent">
  # Hermes Agent
</div>

> Exa로 Hermes Agent에 실시간 web search와 page contents를 제공하세요.

[Hermes Agent](https://github.com/NousResearch/hermes-agent)는 모델이 호출할 수 있는 `web_search` 및 `web_extract` 도구의 네이티브 백엔드로 Exa를 지원합니다. 두 capability 모두 Exa를 사용해도 되고, 다른 Hermes 웹 provider와 함께 사용해도 됩니다.

<div id="connect-your-exa-account">
  ## Exa 계정 연결하기
</div>

<Steps>
  <Step title="Exa API key 발급받기">
    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>
  </Step>

  <Step title="Hermes에서 Exa 선택하기">
    도구 설정 마법사를 실행하세요:

    ```bash theme={null}
    hermes tools
    ```

    **Web Search &amp; Extract**를 열고 Exa를 선택한 뒤, API key 기반 옵션을 고르세요. 입력 요청이 표시되면 Exa API key를 입력합니다. Hermes는 secret을 `~/.hermes/.env`에, provider 선택 정보를 `~/.hermes/config.yaml`에 저장합니다.
  </Step>

  <Step title="웹 접근 테스트하기">
    Hermes를 실행한 뒤 search를 요청하고, 결과 중 하나를 읽어보도록 해보세요:

    ```text theme={null}
    최신 Exa 제품 업데이트를 웹에서 검색한 다음, 가장 관련성 높은 결과를 읽어줘.
    ```

    Hermes는 `web_search`를 call하고, 페이지 내용 자체가 필요하면 이어서 `web_extract`를 call합니다.
  </Step>
</Steps>

<div id="configure-manually">
  ## 수동으로 설정하기
</div>

Hermes 환경 파일에 key를 추가하세요:

```bash ~/.hermes/.env theme={null}
EXA_API_KEY=your-exa-api-key
```

그런 다음 두 웹 capabilities 모두에 Exa를 선택하세요:

```yaml ~/.hermes/config.yaml theme={null}
web:
  search_backend: "exa"
  extract_backend: "exa"
```

대신 공유 폴백을 사용할 수 있습니다:

```yaml ~/.hermes/config.yaml theme={null}
web:
  backend: "exa"
```

capability별 설정이 `web.backend`보다 우선 적용됩니다. 따라서 여러 provider를 함께 사용할 때 Exa를 search에만 또는 extraction에만 사용하도록 설정할 수 있습니다.

<div id="tools-hermes-gets">
  ## Hermes가 사용하는 도구
</div>

| 도구            | Exa 동작                                            |
| ------------- | ------------------------------------------------- |
| `web_search`  | Exa로 검색하여 제목, URL, 텍스트 스니펫이 포함된 순위별 페이지를 반환합니다.   |
| `web_extract` | Exa Contents를 통해 하나 이상의 URL에서 읽을 수 있는 콘텐츠를 가져옵니다. |

Hermes는 길게 추출된 페이지를 설정된 character budget에 맞게 잘라내고, 전체 텍스트는 디스크에 저장합니다. 기본값은 `web.extract_char_limit`로 변경할 수 있으며, agent가 개별 call에 대해 더 큰 `char_limit`을 요청하도록 할 수도 있습니다.

<Note>
  Hermes는 API key 없이도 키가 필요 없는 무료 provider 풀을 통해 Exa를 사용할 수 있습니다. 이 풀에는 속도 제한이 있으며 여러 provider 사이를 순환할 수 있습니다. 요청이 항상 본인의 Exa 계정을 사용하도록 하려면 `EXA_API_KEY`를 설정하고 API key 기반 Exa 옵션을 선택하세요.
</Note>

<div id="troubleshooting">
  ## 문제 해결
</div>

<AccordionGroup>
  <Accordion title="Hermes가 Exa를 선택하지 않는 경우">
    `hermes tools`를 실행한 뒤 Exa를 명시적으로 선택하세요. 파일을 직접 설정하는 경우 `web.search_backend`, `web.extract_backend` 또는 `web.backend`가 `exa`로 지정되어 있는지 확인하세요.
  </Accordion>

  <Accordion title="Hermes가 EXA_API_KEY가 없다고 표시하는 경우">
    `~/.hermes/.env`에 키를 추가한 다음, 환경 변수를 다시 불러오도록 Hermes를 재시작하세요.
  </Accordion>

  <Accordion title="검색은 되지만 extraction은 다른 provider를 사용하는 경우">
    Hermes는 검색과 extraction을 각각 독립적으로 설정할 수 있습니다. `web.search_backend`와 `web.extract_backend`를 모두 `exa`로 설정하세요.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

<Columns cols={3}>
  <Card title="Hermes 웹 도구" icon="book-open" href="https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search" cta="가이드 읽기" arrow="true">
    Hermes의 provider 선택, 캐싱, extraction 동작을 살펴보세요.
  </Card>

  <Card title="Exa Search" icon="search" href="/ko/docs/search/quickstart" cta="가이드 읽기" arrow="true">
    Exa가 검색하고 필터링해 page contents를 반환하는 방식을 알아보세요.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/ko/docs/contents/quickstart" cta="가이드 읽기" arrow="true">
    `web_extract`를 뒷받침하는 extraction API를 알아보세요.
  </Card>
</Columns>