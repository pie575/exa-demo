> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="sports-weather-places">
  # 体育、天气与地点
</div>

> 使用 Exa Search 查找实时体育数据、天气预报和本地地点。

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="在 API Playground 中打开" aria-label={`在 API Playground 中打开“${query}”`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

使用 Exa Search 获取实时体育数据、天气预报和本地信息，无需为每类数据单独接入一个 API。只需用自然语言提问，说明你关心的球队、地点和时间范围即可。

<div id="write-better-queries">
  ## 编写更好的 query
</div>

精确指明地点或球队名称，并在答案会随时间变化时加上日期。加入与任务相关的具体条件或属性，而不是泛泛地索取信息。

<Tabs>
  <Tab title="体育" icon="trophy">
    <div id="included">
      ### 包含内容
    </div>

    可用的体育数据：

    * **比分**：某个联赛某一天的比赛，包括参赛球队、比分、状态、开赛时间和场馆
    * **积分榜**：当前联赛排名，含分区或赛区划分
    * **赛程**：某个联赛或球队的历史战绩与即将进行的比赛

    覆盖范围包括 NBA、WNBA、NFL、MLB、NHL、MLS、大学篮球与橄榄球、欧洲主要足球联赛及欧足联赛事、板球、F1、UFC、网球和高尔夫。

    <div id="ask-for-the-league-team-and-time">
      ### 指明联赛、球队和时间
    </div>

    <PlaygroundQuery query="NBA scores last night" />

    <PlaygroundQuery query="Lakers schedule this week" />

    <div id="add-the-surrounding-story">
      ### 补充相关报道
    </div>

    在获取实时数据的同时，一并索取你需要的报道内容。

    <PlaygroundQuery query="NBA injury reports ahead of tonight's games" />
  </Tab>

  <Tab title="天气" icon="cloud-sun">
    <div id="included-2">
      ### 包含内容
    </div>

    预报包含天气状况、最高与最低气温、降水、风力、湿度、紫外线指数，以及按当地时间计的日出和日落时间。

    未指定日期的 query 会返回当天的预报。指定某一天或某个时间区间，则每天返回一页结果，最多可查询未来 16 天或过去 92 天。

    <div id="name-the-place-and-day">
      ### 指明地点和日期
    </div>

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

    <div id="ask-about-the-condition-that-affects-your-plan">
      ### 询问影响你行程安排的天气状况
    </div>

    <PlaygroundQuery query="will it rain in Austin this weekend" />

    <div id="combine-forecasts-with-reporting">
      ### 将预报与报道结合
    </div>

    <PlaygroundQuery query="hurricane forecast tracks for the Gulf Coast this week" />
  </Tab>

  <Tab title="地点" icon="map-pin">
    <div id="included-3">
      ### 包含内容
    </div>

    * 本地商户资料，含地址、营业时间、设施和评价
    * 场馆、景点和兴趣点
    * 房产房源与物业记录
    * 分区决议、许可证和规划记录

    <div id="describe-the-place-like-you-would-ask-a-local">
      ### 像向当地人打听一样描述地点
    </div>

    把类别、街区和你关心的属性组合起来。

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />

    <div id="name-the-record-type-and-geography">
      ### 指明记录类型和地理范围
    </div>

    <PlaygroundQuery query="multifamily zoning variances approved in Denver" />

    <div id="compare-places-against-practical-constraints">
      ### 按实际约束条件比较地点
    </div>

    <PlaygroundQuery query="walkable neighborhoods in Austin with good public schools and under 30 minutes to downtown" />
  </Tab>
</Tabs>

<div id="make-a-request">
  ## 发起请求
</div>

这三种数据类型都使用同一个 Search 端点。

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
  ## 使用 Exa Agent 获取结构化数据
</div>

如果结构化数据需要跨多个来源进行研究，可以使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。只需描述你需要的地点、球队、日期、criteria 和输出 fields，Agent 就会返回经过 schema 校验的结果并附上引用来源。

<Card title="启动 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  对比不同地点、整理比赛日简报，或将本地详情与天气状况汇总为结构化结果。
</Card>