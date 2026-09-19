> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

<div id="financial-markets">
  # Финансовые рынки
</div>

> Находите рыночные данные, отчётность, стенограммы отчётных звонков и публикации экономических данных с помощью Exa Search.

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

Используйте Exa Search, чтобы одним запросом получить котировки, отчётность, стенограммы и связанные с ними публикации. В ответ на запрос по тикеру можно сразу получить котировку, последнюю квартальную конференц-колл и аналитические обзоры.

<div id="included">
  ## Что включено
</div>

* Котировки и недавняя история цен по акциям, криптовалютам, валютным парам, индексам, фьючерсам, опционам и сырьевым товарам
* Профили ценных бумаг с ключевыми показателями и дневной историей OHLCV
* Стенограммы отчётных звонков: подготовленные выступления и сессия вопросов и ответов с указанием спикеров
* Отчётность в SEC, публикуемая финансовая отчётность и отчётность на зарубежных рынках
* Прогнозы аналитиков, сообщения о раундах финансирования и публикации экономических данных

<div id="use-it-for">
  ## Где применять
</div>

* Анализ акций и кредитного рынка
* KYC, KYB и проверка на негативные упоминания в СМИ
* Мониторинг портфеля и регуляторных требований
* Поиск сделок и исследование частных рынков

<div id="example-queries">
  ## Примеры запросов
</div>

<div id="look-up-a-quote">
  ### Поиск котировки
</div>

Укажите тикер или название компании и нужный показатель. Кэштег вида `$NVDA` тоже подойдёт.

<PlaygroundQuery query="NVIDIA stock price and change today" />

<div id="read-an-earnings-call">
  ### Чтение стенограммы отчётного звонка
</div>

Укажите компанию и квартал, чтобы получить саму стенограмму, а не материалы о ней.

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

<div id="search-filings">
  ### Поиск по отчётности
</div>

Опишите, какое именно раскрытие информации вы ищете, а не только тип формы. Категория `financial report` ограничивает выдачу отчётами и документами регуляторной отчётности.

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

<div id="track-private-market-activity">
  ### Отслеживание активности на частном рынке
</div>

Укажите раунд, сектор и временной интервал.

<PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

<div id="follow-economic-data">
  ### Отслеживание экономических данных
</div>

Укажите публикацию и нужный показатель из неё.

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

<div id="make-a-request">
  ## Отправка запроса
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "10-K risk factors that mention dependency on third-party AI models",
      type="auto",
      category="financial report",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "10-K risk factors that mention dependency on third-party AI models",
    {
      type: "auto",
      category: "financial report",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "10-K risk factors that mention dependency on third-party AI models",
      "type": "auto",
      "category": "financial report",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Получение структурированных данных с помощью Exa Agent
</div>

Если для получения структурированных данных нужно исследование по нескольким источникам, используйте [запуск задачи Exa Agent](/ru/docs/agent/quickstart). Опишите нужные ценные бумаги, периоды, критерии и поля вывода — и Agent вернёт результаты, проверенные по схеме, вместе со ссылками на источники.

<Card title="Запустить задачу Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство по Agent" arrow="true">
  Отбирайте компании, сравнивайте отчётность или собирайте структурированную сводку по портфелю.
</Card>