> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="sports-weather-places">
  # 스포츠, 날씨 및 장소
</div>

> Exa Search로 실시간 스포츠 데이터, 날씨 예보, 주변 장소를 찾아보세요.

export const PlaygroundQuery = ({query, category, filters}) => {
  const PLAYGROUND = "https://dashboard.exa.ai/playground/search";
  const DEFAULT_FILTERS = {
    type: "auto",
    highlights: true
  };
  const params = [`q=${encodeURIComponent(query)}`];
  if (category) params.push(`c=${encodeURIComponent(category)}`);
  params.push(`filters=${encodeURIComponent(JSON.stringify({
    ...DEFAULT_FILTERS,
    ...filters
  }))}`);
  const href = `${PLAYGROUND}?${params.join("&")}`;
  return <div className="playground-query not-prose">
      <code className="playground-query-text">{query}</code>
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="API 플레이그라운드에서 열기" aria-label={`API 플레이그라운드에서 "${query}" 열기`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

실시간 스포츠 데이터, 날씨 예보, 지역 정보를 각각 별도의 API로 연동할 필요 없이 Exa Search 하나로 해결하세요. 원하는 팀, 장소, 기간을 담아 자연어로 질문하기만 하면 됩니다.

<div id="write-better-queries">
  ## 더 나은 질의 작성하기
</div>

지역이나 팀을 정확히 지정하고, 시점에 따라 답이 달라지는 경우에는 날짜를 함께 넣으세요. 두루뭉술한 정보를 요청하기보다 작업에 중요한 조건이나 속성을 덧붙이세요.

<Tabs>
  <Tab title="스포츠" icon="trophy">
    <div id="included">
      ### 포함 범위
    </div>

    이용 가능한 스포츠 데이터:

    * **경기 점수**: 특정 날짜의 리그 경기 정보로, 팀, 점수, 상태, 시작 시간, 경기장을 포함합니다
    * **순위**: 컨퍼런스 또는 디비전별로 구분된 현재 리그 순위표
    * **일정**: 리그 또는 팀의 지난 경기 결과와 예정된 경기

    NBA, WNBA, NFL, MLB, NHL, MLS, 대학 농구 및 미식축구, 주요 유럽 축구 리그와 UEFA 대회, 크리켓, F1, UFC, 테니스, 골프를 포함합니다.

    <div id="ask-for-the-league-team-and-time">
      ### 리그, 팀, 시점을 명시하세요
    </div>

    <PlaygroundQuery query="NBA scores last night" />

    <PlaygroundQuery query="Lakers schedule this week" />

    <div id="add-the-surrounding-story">
      ### 관련 소식까지 함께 요청하세요
    </div>

    실시간 데이터와 함께 필요한 보도 내용을 요청하세요.

    <PlaygroundQuery query="NBA injury reports ahead of tonight's games" />
  </Tab>

  <Tab title="날씨" icon="cloud-sun">
    <div id="included-2">
      ### 포함 범위
    </div>

    예보에는 기상 상태, 최고 및 최저 기온, 강수량, 바람, 습도, 자외선 지수, 해당 지역 현지 시간 기준 일출 및 일몰 시각이 포함됩니다.

    날짜를 지정하지 않은 질의는 오늘의 예보를 반환합니다. 특정 날짜나 기간을 요청하면 하루에 한 페이지씩 제공되며, 최대 16일 후까지 또는 92일 전까지 조회할 수 있습니다.

    <div id="name-the-place-and-day">
      ### 장소와 날짜를 명시하세요
    </div>

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

    <div id="ask-about-the-condition-that-affects-your-plan">
      ### 계획에 영향을 주는 기상 조건을 물어보세요
    </div>

    <PlaygroundQuery query="will it rain in Austin this weekend" />

    <div id="combine-forecasts-with-reporting">
      ### 예보와 보도를 함께 요청하세요
    </div>

    <PlaygroundQuery query="hurricane forecast tracks for the Gulf Coast this week" />
  </Tab>

  <Tab title="장소" icon="map-pin">
    <div id="included-3">
      ### 포함 범위
    </div>

    * 주소, 영업시간, 편의시설, 리뷰가 포함된 지역 업체 프로필
    * 명소, 관광지, 주요 지점
    * 부동산 매물 및 부동산 records
    * 용도지역 결정, 인허가, 도시계획 records

    <div id="describe-the-place-like-you-would-ask-a-local">
      ### 현지인에게 묻듯이 장소를 설명하세요
    </div>

    카테고리, 동네, 중요한 속성을 함께 조합하세요.

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />

    <div id="name-the-record-type-and-geography">
      ### records 유형과 지역을 명시하세요
    </div>

    <PlaygroundQuery query="multifamily zoning variances approved in Denver" />

    <div id="compare-places-against-practical-constraints">
      ### 실질적인 조건을 기준으로 장소를 비교하세요
    </div>

    <PlaygroundQuery query="walkable neighborhoods in Austin with good public schools and under 30 minutes to downtown" />
  </Tab>
</Tabs>

<div id="make-a-request">
  ## 요청 보내기
</div>

세 가지 데이터 유형 모두 동일한 Search 엔드포인트를 사용합니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "weather in San Francisco tomorrow",
      type="auto",
      num_results=5,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search("weather in San Francisco tomorrow", {
    type: "auto",
    numResults: 5,
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "weather in San Francisco tomorrow",
      "type": "auto",
      "numResults": 5
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Exa Agent로 구조화된 데이터 가져오기
</div>

여러 소스에 걸친 리서치가 필요한 구조화된 데이터라면 [Exa Agent task run](/ko/docs/agent/quickstart)을 사용하세요. 필요한 장소, 팀, 날짜, criteria, output field를 설명하면 Agent가 schema 검증을 거친 결과를 citations와 함께 반환합니다.

<Card title="Agent task 시작하기" icon="bot" href="/ko/docs/agent/quickstart" cta="Agent 가이드 열기" arrow="true">
  장소를 비교하거나, 경기 당일 브리핑을 구성하거나, 지역 정보와 현재 상황을 결합해 구조화된 결과로 만들어 보세요.
</Card>