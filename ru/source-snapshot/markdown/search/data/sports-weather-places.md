> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

<div id="sports-weather-places">
  # Спорт, погода и места
</div>

> Находите актуальные спортивные данные, прогнозы погоды и места поблизости с помощью Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Открыть в песочнице API" aria-label={`Открыть "${query}" в песочнице API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Используйте Exa Search для получения спортивных данных в реальном времени, прогнозов погоды и локальной информации — без подключения отдельного API под каждую задачу. Задайте вопрос на естественном языке, указав команду, место и интересующий вас период.

<div id="write-better-queries">
  ## Как составлять более точные запросы
</div>

Точно указывайте место или команду и добавляйте дату всегда, когда ответ меняется со временем. Вместо общих формулировок добавьте условие или признак, который важен для вашей задачи.

<Tabs>
  <Tab title="Спорт" icon="trophy">
    <div id="included">
      ### Что доступно
    </div>

    Доступные спортивные данные:

    * **Счёт матчей**: игры лиги за день, включая команды, счёт, статус, время начала и место проведения
    * **Турнирные таблицы**: актуальные таблицы лиг с разбивкой по конференциям или дивизионам
    * **Расписания**: прошедшие результаты и предстоящие игры лиги или команды

    Охват включает NBA, WNBA, NFL, MLB, NHL, MLS, студенческий баскетбол и футбол, крупные европейские футбольные лиги и турниры УЕФА, крикет, Ф-1, UFC, теннис и гольф.

    <div id="ask-for-the-league-team-and-time">
      ### Указывайте лигу, команду и время
    </div>

    <PlaygroundQuery query="NBA scores last night" />

    <PlaygroundQuery query="Lakers schedule this week" />

    <div id="add-the-surrounding-story">
      ### Добавляйте контекст вокруг события
    </div>

    Запрашивайте нужные вам материалы прессы вместе с данными в реальном времени.

    <PlaygroundQuery query="NBA injury reports ahead of tonight's games" />
  </Tab>

  <Tab title="Погода" icon="cloud-sun">
    <div id="included-2">
      ### Что доступно
    </div>

    Прогнозы включают погодные условия, максимальную и минимальную температуру, осадки, ветер, влажность, УФ-индекс, а также время восхода и заката по местному времени.

    Запрос без даты возвращает прогноз на сегодня. Укажите конкретный день или диапазон, чтобы получить по странице на каждый день — до 16 дней вперёд или 92 дней назад.

    <div id="name-the-place-and-day">
      ### Называйте место и день
    </div>

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

    <div id="ask-about-the-condition-that-affects-your-plan">
      ### Спрашивайте о том, что влияет на ваши планы
    </div>

    <PlaygroundQuery query="will it rain in Austin this weekend" />

    <div id="combine-forecasts-with-reporting">
      ### Сочетайте прогнозы с новостями
    </div>

    <PlaygroundQuery query="hurricane forecast tracks for the Gulf Coast this week" />
  </Tab>

  <Tab title="Места" icon="map-pin">
    <div id="included-3">
      ### Что доступно
    </div>

    * Профили местных компаний с адресами, часами работы, удобствами и отзывами
    * Площадки, достопримечательности и точки интереса
    * Объявления о недвижимости и записи об объектах
    * Решения по зонированию, разрешения и градостроительные документы

    <div id="describe-the-place-like-you-would-ask-a-local">
      ### Описывайте место так, как спросили бы у местного жителя
    </div>

    Сочетайте категорию, район и важные для вас характеристики.

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />

    <div id="name-the-record-type-and-geography">
      ### Называйте тип записи и географию
    </div>

    <PlaygroundQuery query="multifamily zoning variances approved in Denver" />

    <div id="compare-places-against-practical-constraints">
      ### Сравнивайте места по практическим ограничениям
    </div>

    <PlaygroundQuery query="walkable neighborhoods in Austin with good public schools and under 30 minutes to downtown" />
  </Tab>
</Tabs>

<div id="make-a-request">
  ## Выполните запрос
</div>

Все три типа данных используют один и тот же эндпоинт Search.

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
  ## Получение структурированных данных с помощью Exa Agent
</div>

Если для получения структурированных данных нужно исследование по нескольким источникам, используйте [запуск задачи Exa Agent](/ru/docs/agent/quickstart). Опишите нужные места, команды, даты, критерии и поля вывода — и Agent вернёт результаты, проверенные по схеме, со ссылками на источники.

<Card title="Запустить задачу Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство по Agent" arrow="true">
  Сравнивайте места, готовьте сводку к игровому дню или объединяйте местные детали и условия в структурированные результаты.
</Card>