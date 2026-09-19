> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 받아보세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

<div id="exa-in-claude-code-web-and-desktop">
  # Claude Code, Web, Desktop에서 Exa 사용하기
</div>

> Claude에서 바로 Exa로 웹을 검색하고 원하는 페이지를 읽어보세요

Claude Code에 Exa를 설치하거나 Claude Web, Desktop, Cowork에 연결하면 Claude가 웹의 최신 정보를 활용할 수 있습니다. Claude는 자연어로 검색하고, 중요한 페이지를 읽고, 작업하면서 그 출처를 참고할 수 있습니다.

<div id="install-exa">
  ## Exa 설치
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web, Desktop & Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="커넥터 디렉터리 열기">
          새 Claude 채팅에서 더하기 버튼을 누르고 **Add connector**를 선택한 뒤 **Exa**를 검색하세요.
        </Step>

        <Step title="Exa 연결">
          Exa를 열고 **Connect to Claude**를 선택한 다음, 안내가 표시되면 액세스를 승인하세요.

          <Frame caption="Claude에서 커넥터 디렉터리를 열고 Exa를 찾아 연결한 뒤 액세스를 승인하는 과정">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Claude에서 커넥터 디렉터리를 열고 Exa를 찾아 연결한 뒤 액세스를 승인하는 과정" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Exa 사용">
          새 채팅을 시작해 웹의 최신 정보가 필요한 질문을 해보세요.
        </Step>
      </Steps>
    </Tab>

    <Tab title="Claude Code CLI" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude-code.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=f7f017b187974c56e5822d7baf8272fa" width="16" height="16" data-path="images/mcp-clients/claude-code.svg">
      <Steps>
        <Step title="플러그인 설치">
          터미널에서 Exa를 설치하세요:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Claude Code에서 `/plugin`을 입력한 뒤 **Exa**를 검색해 설치할 수도 있습니다.
        </Step>

        <Step title="새 세션 시작">
          플러그인이 로드되도록 새 Claude Code 세션을 연 다음, 웹 검색이 필요한 질문을 해보세요.

          <Frame caption="새 Claude Code 세션을 열고 웹 검색이 필요한 질문을 하는 과정">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="새 Claude Code 세션을 열고 웹 검색이 필요한 질문을 하는 과정" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

두 방법 모두 MCP configuration 파일을 편집하지 않고도 Exa를 사용할 수 있습니다.

<div id="work-with-whats-on-the-web-right-now">
  ## 지금 웹에 있는 정보로 작업하기
</div>

Claude Code에서 Exa는 repository 작업 중에도 최신 문서, 이슈, 변경 로그, 실제 사례를 검색할 수 있습니다. 동일한 연동으로 Claude Web, Desktop, Cowork에서도 아직 컨텍스트에 없는 최신 뉴스, 연구 자료, 기업 정보, 제품 상세 정보 등 다양한 출처를 활용할 수 있습니다.

```text theme={null}
지금 Tailwind v3를 쓰고 있어. Exa로 공식 Tailwind v4 업그레이드 가이드를
찾아서 읽은 다음, 이 프로젝트를 v4로 마이그레이션해줘.
```

Claude Code는 찾아낸 내용을 활용해 코드베이스를 직접 수정할 수 있습니다. 다른 Claude 클라이언트에서는 동일한 출처를 답변, 아티팩트, Cowork 작업에 활용할 수 있습니다.

답변이 최신 정보나 특정 웹 출처에 달려 있는 상황이라면 언제든 같은 방식을 쓸 수 있습니다.

* &quot;이 의존성의 최신 릴리스 노트를 찾아 호환성이 깨지는 변경 사항을 요약해 줘.&quot;
* &quot;추론 시점 스케일링에 관한 최근 1차 연구를 검색해서 방법론을 비교해 줘.&quot;
* &quot;현재 Stripe webhook 문서를 읽고 권장되는 재시도 동작을 설명해 줘.&quot;
* &quot;이 제품들의 공식 가격 페이지를 찾아 입문형 요금제를 비교해 줘.&quot;

<div id="search-read-and-research">
  ## 검색, 읽기, 리서치
</div>

Exa 연동은 Claude에 웹을 검색하고 읽는 도구를 제공하며, Claude는 이를 조합해 긴 호흡의 리서치 작업까지 수행할 수 있습니다.

<Columns cols={3}>
  <Card title="검색" icon="search">
    자연어로 검색하고 단순한 링크 목록이 아닌 관련 페이지 콘텐츠를 받아보세요.
  </Card>

  <Card title="읽기" icon="file-text">
    문서, 연구 자료, 변경 로그, 이슈, 기사 등 지정한 페이지를 읽습니다.
  </Card>

  <Card title="리서치" icon="compass">
    여러 번의 검색을 실행하고 유용한 페이지를 살펴본 뒤, 근거를 종합해 출처가 명시된 답변을 만듭니다.
  </Card>
</Columns>

<div id="research-without-leaving-claude">
  ## Claude를 벗어나지 않고 리서치하기
</div>

원하는 결과를 요청하고, 어떤 종류의 출처가 중요한지 Claude에게 알려주세요:

```text theme={null}
주요 오픈 소스 벡터 데이터베이스의 매니지드 서비스, 라이선스, 가격을
비교해 줘. 최신 1차 자료를 활용하고 출처를 인용해 줘.
```

Claude는 대화 전반에 걸쳐 Exa를 사용해 작업에 필요한 출처를 찾고 읽을 수 있습니다. 기술 리서치, 경쟁사 분석, 시장 지형 파악, 기업 조사 등 답이 웹 곳곳에 흩어져 있는 모든 질문에 활용해 보세요.

<div id="use-exa-in-cowork">
  ## Cowork에서 Exa 사용하기
</div>

Cowork에서도 동일한 커넥터를 사용할 수 있습니다. 외부 정보가 필요한 작업을 Claude에게 맡기면, 사용자의 파일 및 연결된 다른 도구를 함께 활용하면서 웹을 검색하거나 페이지를 읽을 수 있습니다.

```text theme={null}
이 경쟁사 분석 자료를 검토하고, Exa로 각 vendor의 최신 가격 페이지를 확인해
모든 가격 관련 주장을 검증한 다음, citations를 넣어 문서를 업데이트해 줘.
```

<div id="prefer-mcp-directly">
  ## MCP를 직접 사용하고 싶으신가요?
</div>

Claude를 수동으로 설정하거나 다른 MCP 클라이언트를 사용한다면, Exa가 호스팅하는 MCP server에 직접 연결할 수 있습니다:

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

다른 클라이언트, 구성 옵션, 사용 가능한 도구는 [Exa MCP](/ko/docs/get-started/exa-mcp)를 참고하세요.

<Card title="Exa 커넥터 열기" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Claude의 커넥터 디렉터리에서 Exa를 추가하세요.
</Card>