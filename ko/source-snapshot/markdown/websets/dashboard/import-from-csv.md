> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# CSV에서 가져오기 {#import-from-csv}

> 기존 CSV 데이터를 Webset으로 만들어 보세요

<br />

## 개요 {#overview}

CSV에서 가져오기 기능을 사용하면 URL이 담긴 기존 CSV 파일을 온전히 동작하는 Websets으로 변환할 수 있습니다. 이미 웹사이트, 회사, 리소스 목록을 보유하고 있고 여기에 추가 데이터를 enrich하거나 search criteria를 적용해 필터링하려는 경우에 특히 유용합니다.

<br />

## 작동 방식 {#how-it-works}

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="Webset 생성을 위한 CSV import 플로우" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. &quot;Start from CSV&quot;를 클릭해 CSV 파일을 선택합니다
2. 분석할 URL이 들어 있는 열을 선택합니다
3. 진행하기 전에 데이터가 어떻게 import되는지 검토합니다
4. URL이 enrichment와 metadata가 포함된 Webset으로 변환됩니다

<br />

## CSV 준비 {#csv-preparation}

CSV 파일에 URL 열이 있는지 확인하세요

* People search의 경우: URL은 LinkedIn 프로필 URL이어야 합니다(예: [https://linkedin.com/in/username](https://linkedin.com/in/username))
* Company search의 경우: URL은 회사 홈페이지 URL이어야 합니다(예: [https://example.com](https://example.com))
* 그 외 search의 경우: 어떤 종류의 URL이든 사용할 수 있습니다

URL이 없는 경우, Websets가 각 CSV 행의 정보와 추가로 제공한 정보를 바탕으로 URL을 추론합니다.

import할 수 있는 result의 최대 개수는 사용 중인 plan에 따라 결정됩니다.

## 다음 단계는? {#what-happens-next}

import이 완료되면 CSV는 다음 작업을 수행할 수 있는 완전한 Webset이 됩니다:

### 사용자 지정 열로 enrich하기 {#enrich-with-custom-columns}

각 URL에 대해 원하는 정보를 추가할 수 있습니다:

* 연락처 정보(이메일, 전화번호)
* 회사 지표(매출, 임직원 수)
* 콘텐츠 분석(감성, 주제, summary)
* 사용 사례에 맞는 맞춤 데이터

### search criteria 적용 {#apply-search-criteria}

import한 URL을 특정 criteria로 필터링합니다:

* 기업 단계 또는 규모
* 산업 또는 분야
* 지리적 위치
* content type 또는 주제