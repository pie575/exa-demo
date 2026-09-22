> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Exa for Google Sheets {#exa-for-google-sheets}

> Google Sheets에서 Exa Agent와 Exa 수식을 사용하세요.

<Warning>
  **Google 계정이 여러 개인 경우:** add-on은 브라우저 프로필의 첫 번째(기본) Google 계정으로 실행되어야 합니다. 여러 계정에 로그인되어 있으면 API 키를 저장하거나 불러오지 못할 수 있습니다. 이 경우 계정이 하나만 로그인된 시크릿 창에서 Sheets를 열거나, 사용하려는 계정이 기본 계정이 되도록 나머지 계정에서 로그아웃하세요. [자세히 알아보기](https://developers.google.com/apps-script/guides/projects#fix_issues_with_multiple_google_accounts).
</Warning>

Google Sheets에서 Exa를 사용해 웹을 리서치하고, 표를 생성하고, 누락된 데이터를 채워보세요.

add-on은 두 가지 작업 방식을 제공합니다:

* 전체 표와 여러 셀에 걸친 작업을 위한 **Exa Agent**
* 한 셀에서 하나의 답변을 얻는 **`=EXA(...)`**

## 설치 {#install}

<Steps>
  <Step title="add-on 설치">
    Google Workspace 마켓플레이스에서 [Exa AI add-on](https://workspace.google.com/marketplace/app/exa_ai/465545439521)으로 이동한 뒤 **설치**를 클릭하세요.
  </Step>

  <Step title="Google Sheet 열기">
    새 스프레드시트나 기존 스프레드시트를 여세요.
  </Step>

  <Step title="sidebar 열기">
    **Extensions → Exa AI → Open Sidebar**로 이동하세요.
  </Step>

  <Step title="API 키 추가">
    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>

    발급받은 키를 sidebar에 붙여넣으세요.
  </Step>

  <Step title="Exa 사용 시작">
    **Exa Agent**를 열고 sheet에서 Exa를 사용해 보세요.
  </Step>
</Steps>

## Exa Agent {#exa-agent}

Exa Agent를 사용하면 Google Sheets의 여러 셀에 걸쳐 Exa를 활용할 수 있습니다.

다음과 같은 경우에 사용하세요:

* 하나의 prompt로 표 전체를 생성하고 싶을 때
* 기존 표의 빈 셀을 채우고 싶을 때
* 새 행을 추가해 표를 이어가고 싶을 때
* 웹 데이터로 목록을 enrich하고 싶을 때

### 표 생성하기 {#generate-a-table}

Exa로 새 표를 만들고 싶을 때 **Generate table**을 사용하세요.

1. sidebar를 엽니다.
2. **Exa Agent**로 이동합니다.
3. **Generate table**을 선택합니다.
4. 원하는 내용을 입력합니다.
5. **Generate table**을 클릭합니다.

예시 prompt:

```text theme={null}
상위 40개 AI 기업을 찾아서 회사명, 웹사이트 URL, CEO, 설립일, 본사 위치, 간단한 설명을 알려줘.
```

Exa가 웹을 리서치한 뒤 시트에 표를 작성합니다.

기본적으로 표는 선택한 셀에서 시작합니다. **More options**에서 다른 시작 셀을 지정할 수 있습니다.

### Fill cells {#fill-cells}

이미 표가 있고 비어 있는 데이터를 Exa가 채워주길 원할 때 **Fill cells**를 사용하세요.

1. 시트에서 빈 셀을 선택합니다.
2. **Exa Agent**를 엽니다.
3. **Fill cells**를 선택합니다.
4. **Fill selected cells**를 클릭합니다.

Exa는 선택 영역 주변의 표를 파악해 빈 칸을 채웁니다.

**Fill cells**를 사용하기 전에 헤더가 명확한 표에서 빈 셀을 선택하세요.

예시:

| 회사     | 웹사이트                                     | CEO           | 본사            |
| ------ | ---------------------------------------- | ------------- | ------------- |
| Apple  | [https://apple.com](https://apple.com)   |               |               |
| Google | [https://google.com](https://google.com) | Sundar Pichai | Mountain View |

Apple 행의 빈 셀을 선택한 다음 **Fill selected cells**를 클릭하세요. Exa는 회사 이름과 주변 행을 컨텍스트로 활용합니다.

### 행 이어서 채우기 {#continue-rows}

표 아래의 빈 행을 선택할 수도 있습니다.

표가 55위에서 끝날 때 그 아래 빈 행 두 개를 선택하면, Exa가 56위와 57위를 채워 표를 이어갑니다.

Exa는 기존 행을 예시로 삼아 동일한 열 구성을 유지하며, 이미 표에 있는 항목이 중복되지 않도록 합니다.

## `=EXA(...)` {#exa}

셀 하나에 답변 하나만 필요할 때는 `=EXA(...)`를 사용하세요. 웹을 검색해 상위 결과를 읽은 뒤 간결한 답변을 반환합니다.

```text theme={null}
=EXA("what you want", cell)
```

| 매개변수      | 필수 여부 | 설명                                          |
| --------- | ----- | ------------------------------------------- |
| `prompt`  | 예     | 얻고자 하는 정보(예: `"Return only the CEO name"`). |
| `context` | 아니요   | enrich할 셀 참조 또는 텍스트(예: `A2`에 있는 회사명).       |

예시:

```text theme={null}
=EXA("Return only the company website URL", A2)
=EXA("Return only the CEO name", A2)
=EXA("Return only the headquarters", A2)
=EXA("Return the Amazon rating of this product", A2)
```

두 번째 인자는 컨텍스트입니다. 수식을 열 아래로 드래그하면 여러 행에 대해 한 번에 실행할 수 있습니다.

한 셀에 간단한 답변만 필요할 때는 `=EXA(...)`를 사용하세요. 표 전체를 만들거나 채우려면 **Exa Agent**를 사용하세요.

## `=EXA_ANSWER(...)` {#exa_answer}

output 형식을 완벽하게 제어할 수 있는 고급 AI 답변 기능입니다. system prompt, 구조화된 JSON output, citations, 특정 search type이 필요한 경우에 사용하세요.

```text theme={null}
=EXA_ANSWER(prompt, [prefix], [suffix], [includeCitations], [systemPrompt], [outputSchema], [returnRawJson], [type])
```

| 매개변수               | 필수  | 기본값      | 설명                                                                                                    |
| ------------------ | --- | -------- | ----------------------------------------------------------------------------------------------------- |
| `prompt`           | 예   | —        | 핵심 질문 또는 prompt입니다.                                                                                   |
| `prefix`           | 아니요 | `""`     | prompt 앞에 추가되는 텍스트입니다.                                                                                |
| `suffix`           | 아니요 | `""`     | prompt 뒤에 추가되는 텍스트입니다.                                                                                |
| `includeCitations` | 아니요 | `FALSE`  | `TRUE`이면 번호가 매겨진 소스 citations를 덧붙입니다.                                                                 |
| `systemPrompt`     | 아니요 | `""`     | 출력 형식을 제어하는 시스템 지시문입니다(예: `"only return a number"`).                                                  |
| `outputSchema`     | 아니요 | `""`     | structured output을 위한 JSON schema입니다. [여기에서 schema 생성하기](https://dashboard.exa.ai/playground/answer). |
| `returnRawJson`    | 아니요 | `FALSE`  | `TRUE`이고 `outputSchema`가 설정되어 있으면 값을 추출하지 않고 전체 JSON을 반환합니다.                                          |
| `type`             | 아니요 | `"deep"` | search type: `"auto"`, `"neural"`, `"fast"`, `"deep"` 중 하나입니다.                                        |

예시:

```text theme={null}
=EXA_ANSWER("OpenAI CEO", "", "", FALSE, "only return a name")
=EXA_ANSWER("Modal AI headcount", "", "", FALSE, "only return a number")
=EXA_ANSWER("ceo of exa.ai", "", "", FALSE, "", "{""type"":""object"",""properties"":{""name"":{""type"":""string""}}}")
```

## `=EXA_SEARCH(...)` {#exa_search}

웹을 검색하여 URL 목록을 세로 방향으로 반환합니다. 도메인 필터링, 카테고리 필터링, content highlights, `outputSchema`를 통한 합성 output을 지원합니다.

```text theme={null}
=EXA_SEARCH(query, [numResults], [searchType], [prefix], [suffix], [includeDomainsStr], [excludeDomainsStr], [category], [highlightsMaxChars], [outputSchemaJson])
```

| 매개변수                 | 필수  | 기본값      | 설명                                                                                                                         |
| -------------------- | --- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `query`              | 예   | —        | 검색 질의입니다.                                                                                                                  |
| `numResults`         | 아니요 | `1`      | 결과 개수(1~10).                                                                                                               |
| `searchType`         | 아니요 | `"auto"` | `"auto"`, `"neural"`, `"keyword"` 중 하나.                                                                                    |
| `prefix`             | 아니요 | `""`     | 질의 앞에 붙는 텍스트입니다.                                                                                                           |
| `suffix`             | 아니요 | `""`     | 질의 뒤에 붙는 텍스트입니다.                                                                                                           |
| `includeDomainsStr`  | 아니요 | `""`     | 포함할 도메인을 쉼표로 구분한 목록(예: `"linkedin.com,crunchbase.com"`).                                                                   |
| `excludeDomainsStr`  | 아니요 | `""`     | 제외할 도메인을 쉼표로 구분한 목록입니다.                                                                                                    |
| `category`           | 아니요 | `""`     | 유형별 필터: `"company"`, `"publication"`, `"news"`, `"personal site"`, `"financial report"`, `"people"`.                       |
| `highlightsMaxChars` | 아니요 | `0`      | 0보다 크면 결과당 이 글자 수를 limit으로 하여 content highlights를 요청합니다.                                                                   |
| `outputSchemaJson`   | 아니요 | `""`     | `outputSchema`에 사용할 JSON 문자열(예: `"{""type"":""text"",""description"":""summarize""}"`). 설정하면 URL 대신 합성된 output 텍스트를 반환합니다. |

예시:

```text theme={null}
=EXA_SEARCH("AI startups", 5, "auto", "", "", "linkedin.com,crunchbase.com")
=EXA_SEARCH("transformer architecture", 5, "auto", "", "", "", "", "publication")
```

## `=EXA_CONTENTS(...)` {#exa_contents}

URL에서 텍스트 콘텐츠를 추출합니다.

```text theme={null}
=EXA_CONTENTS(url)
```

| 매개변수  | 필수 | 설명                                   |
| ----- | -- | ------------------------------------ |
| `url` | 예  | 전체 URL(`http` 또는 `https`로 시작해야 합니다). |

## `=EXA_FINDSIMILAR(...)` {#exa_findsimilar}

기준 URL과 유사한 URL을 찾습니다. 도메인 및 텍스트 필터를 선택적으로 적용할 수 있습니다.

```text theme={null}
=EXA_FINDSIMILAR(url, [numResults], [includeDomainsStr], [excludeDomainsStr], [includeTextStr], [excludeTextStr])
```

| 매개변수                | 필수 여부 | 기본값  | 설명                          |
| ------------------- | ----- | ---- | --------------------------- |
| `url`               | 예     | —    | 기준이 되는 URL입니다.              |
| `numResults`        | 아니오   | `1`  | result 개수(1–10)입니다.         |
| `includeDomainsStr` | 아니오   | `""` | 포함할 도메인(쉼표로 구분)입니다.         |
| `excludeDomainsStr` | 아니오   | `""` | 제외할 도메인(쉼표로 구분)입니다.         |
| `includeTextStr`    | 아니오   | `""` | result에 반드시 포함되어야 하는 문구입니다. |
| `excludeTextStr`    | 아니오   | `""` | result에 포함되면 안 되는 문구입니다.    |

## Batch {#batch}

여러 Exa 수식 셀을 한 번에 처리하려면 **Batch**를 사용하세요.

Batch로 할 수 있는 작업:

* 선택한 셀의 Exa 수식 새로 고침
* 선택한 Exa 수식을 일반 값으로 변환

현재 결과를 그대로 유지하면서 수식이 다시 실행되지 않도록 하려면 수식을 값으로 변환하세요.

## 언제 무엇을 사용할까 {#when-to-use-what}

| 작업                                         | 사용                         |
| ------------------------------------------ | -------------------------- |
| prompt로 표 전체 만들기                           | Exa Agent → Generate table |
| 표의 빈 셀 채우기                                 | Exa Agent → Fill cells     |
| 표에 새 행 이어서 추가하기                            | Exa Agent → Fill cells     |
| 셀 하나에 값 하나 가져오기                            | `=EXA(...)`                |
| system prompt 또는 structured output으로 답변 얻기 | `=EXA_ANSWER(...)`         |
| 검색해서 URL 목록 가져오기                           | `=EXA_SEARCH(...)`         |
| URL에서 텍스트 추출하기                             | `=EXA_CONTENTS(...)`       |
| URL과 유사한 페이지 찾기                            | `=EXA_FINDSIMILAR(...)`    |
| 여러 Exa 수식 한 번에 새로 고치기                      | Batch                      |
| 수식 결과를 일반 텍스트로 저장하기                        | Batch → Convert to values  |

## 참고 사항 {#notes}

* Exa API 요청은 사용량 할당량에서 차감됩니다. **Batch → Convert to values**를 사용해 결과를 고정하면 수식이 다시 계산되지 않습니다.
* add-on은 속도 제한(HTTP 429)에 걸리면 exponential backoff 방식으로 최대 3회까지 자동으로 재시도합니다.
* 수백 행으로 늘리기 전에 작은 batch(10~20행)부터 시작하세요.

## 링크 {#links}

* [Google Sheets용 Exa AI 설치](https://workspace.google.com/marketplace/app/exa_ai/465545439521)
* [Exa API key 발급받기](https://dashboard.exa.ai/api-keys)
* [GitHub 리포지토리](https://github.com/exa-labs/exa-for-sheets)
* [개인정보 처리방침](https://exa.ai/exa-for-sheets/privacy-policy)