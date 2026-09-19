> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="import-from-csv">
  # CSV에서 가져오기
</div>

> 기존 CSV 데이터를 Webset으로 만들어 보세요

<br />

<div id="overview">
  ## 개요
</div>

CSV에서 가져오기 기능을 사용하면 URL이 담긴 기존 CSV 파일을 완전한 기능을 갖춘 Webset으로 변환할 수 있습니다. 이미 웹사이트, 기업, 리소스 목록을 보유하고 있고, 여기에 추가 데이터를 enrich하거나 search criteria를 적용해 필터링하려는 경우에 특히 유용합니다.

<br />

<div id="how-it-works">
  ## 작동 방식
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="Webset 생성을 위한 CSV import 흐름" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. &quot;Start from CSV&quot;를 클릭해 CSV 파일을 선택합니다
2. 분석할 URL이 들어 있는 열을 선택합니다
3. 진행하기 전에 데이터가 어떻게 import되는지 확인합니다
4. URL이 enrichment와 메타데이터를 갖춘 Webset으로 변환됩니다

<br />

<div id="csv-preparation">
  ## CSV 준비
</div>

CSV 파일에 URL 열이 있는지 확인하세요

* People search의 경우: URL은 LinkedIn 프로필 URL이어야 합니다(예: [https://linkedin.com/in/username](https://linkedin.com/in/username))
* Company search의 경우: URL은 회사 홈페이지 URL이어야 합니다(예: [https://example.com](https://example.com))
* 그 외 search의 경우: 어떤 유형의 URL이든 사용할 수 있습니다

URL이 없는 경우, Websets가 각 CSV 행의 정보와 추가로 제공한 정보를 바탕으로 URL을 추론합니다.

import할 수 있는 최대 결과 수는 사용 중인 플랜에 따라 결정됩니다.

<div id="what-happens-next">
  ## 다음 단계는?
</div>

import가 완료되면 CSV는 온전한 Webset이 되며, 다음 작업을 수행할 수 있습니다:

<div id="enrich-with-custom-columns">
  ### 커스텀 열로 Enrich하기
</div>

각 URL에 대해 원하는 정보를 무엇이든 추가할 수 있습니다:

* 연락처 정보(이메일, 전화번호)
* 기업 지표(매출, 임직원 수)
* 콘텐츠 분석(감성, 주제, 요약)
* 사용 사례에 맞춘 커스텀 데이터

<div id="apply-search-criteria">
  ### search criteria 적용
</div>

가져온 URL을 특정 criteria에 따라 필터링합니다:

* 회사 단계 또는 규모
* 업종 또는 분야
* 지역
* 콘텐츠 유형 또는 주제