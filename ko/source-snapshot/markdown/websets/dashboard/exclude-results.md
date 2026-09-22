> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="exclude-results">
  # Exclude Results
</div>

> 이전 Websets나 CSV 파일의 URL을 제외해 새로운 search에서 중복 result가 나오지 않도록 하세요.

<br />

<div id="overview">
  ## 개요
</div>

Exclude Results 기능을 사용하면 새로운 search를 생성할 때 중복된 result가 반환되지 않습니다. 이전 Websets이나 업로드한 CSV 파일을 기준으로 제외할 URL을 지정하면, 기존 데이터를 보완하는 새롭고 고유한 result를 찾는 데 집중할 수 있습니다.

<br />

<div id="how-it-works">
  ## 작동 방식
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/exclude-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=b28ac0441991bc4543571ffc2a900963" alt="Webset 생성 시 result 제외 옵션" width="1466" height="857" data-path="images/websets/exclude-flow.png" />

1. 새 Webset 생성을 시작합니다
2. 사이드 패널의 criteria 아래에서 &quot;Exclude&quot;를 클릭합니다
3. 이전 Websets에서 선택하거나 제외할 URL이 담긴 CSV를 업로드합니다. 여러 소스를 선택해 제외할 수 있습니다.
4. search를 시작하면 exclusions에 해당하지 않는 새로운 result만 표시됩니다

제외할 수 있는 최대 result 수는 사용 중인 plan에 따라 결정됩니다.

<br />

<div id="when-to-use-exclusions">
  ## exclusions을 사용하는 경우
</div>

* CRM에 아직 없는 리드 찾기
* 이전 search를 더 정교한 criteria로 이어서 실행하기
* 이미 알고 있는 result 제외하기