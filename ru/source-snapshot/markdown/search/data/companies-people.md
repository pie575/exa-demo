> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="companies-people">
  # Компании и люди
</div>

> Находите компании, профессиональные профили и связи между ними с помощью Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Открыть в API Playground" aria-label={`Открыть "${query}" в API Playground`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Используйте Exa Search для поиска организаций и связанных с ними людей. Такие запросы лучше всего работают в связке: опишите характеристики компании, по которым человек считается подходящим, либо людей и роли, раскрывающие принципы работы компании.

<Columns cols={2}>
  <Card title="Бенчмарк поиска компаний" icon="building" href="https://exa.ai/blog/company-search-benchmarks">
    Узнайте, как Exa оценивает поиск компаний и извлечение фактов.
  </Card>

  <Card title="Бенчмарк поиска людей" icon="users" href="https://exa.ai/blog/people-search-benchmark">
    Узнайте, как Exa оценивает точечные запросы и поиск профилей.
  </Card>
</Columns>

<div id="use-it-for">
  ## Для чего использовать
</div>

* Поиск компаний, кандидатов и экспертов
* Исследование клиентов и составление карты стейкхолдеров
* Карты рынка, инвестиционная аналитика и поиск сделок
* Исследование руководства, найма и организационной структуры

<div id="write-better-queries">
  ## Пишите более качественные запросы
</div>

Начните с сущности, которая вам нужна, затем добавьте характеристики и связи, которые её уточняют. Указывайте тип источника, когда это важно: например, сайты компаний, профессиональные профили, вакансии или личные сайты.

<Tabs>
  <Tab title="Компании" icon="building">
    <div id="discover-companies-by-what-they-do">
      ### Находите компании по тому, чем они занимаются
    </div>

    Опишите клиента, продукт, возможности, стадию развития и географию, которые определяют рынок. Так вы найдёте подходящие компании по тому, чем они занимаются, а не по заранее составленному списку.

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    <div id="find-operating-signals">
      ### Находите операционные сигналы
    </div>

    Назовите сигнал и значимые характеристики компании. Search может находить вакансии, страницы с ценами, документацию продукта и отчётность наряду со страницами компаний.

    <PlaygroundQuery query="remote staff engineer roles at Series B fintech companies" />

    <div id="research-funding-activity">
      ### Исследуйте инвестиционную активность
    </div>

    Укажите раунд, отрасль, участника и временной интервал.

    <PlaygroundQuery query="investors who led seed rounds in robotics in the last year" />
  </Tab>

  <Tab title="Люди" icon="users">
    <div id="discover-people-by-role-and-skills">
      ### Находите людей по роли и навыкам
    </div>

    Сочетайте роль, уровень, местоположение, релевантные навыки и нужный тип источника.

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    <div id="qualify-people-by-company-traits">
      ### Отбирайте людей по характеристикам компании
    </div>

    Опишите, как человек связан с компанией, и характеристики, по которым эта компания вам подходит. Это работает лучше, чем сначала составлять список компаний.

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    <div id="find-personal-websites-and-public-work">
      ### Находите личные сайты и публичные работы
    </div>

    Назовите профессию или область исследований и явно запросите личные сайты, выступления, интервью или статьи.

    <PlaygroundQuery query="personal blogs of distributed systems researchers" />
  </Tab>
</Tabs>

<div id="search-both-together">
  ## Поиск по обоим сразу
</div>

Сформулируйте один запрос, отражающий нужную вам связь. Exa может вернуть страницы компаний, профили специалистов, страницы вакансий и публичные упоминания в одном наборе результатов.

<PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />

<div id="make-a-request">
  ## Отправка запроса
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "heads of security at Series B healthcare software companies that sell to hospitals",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "heads of security at Series B healthcare software companies that sell to hospitals",
    {
      type: "auto",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "heads of security at Series B healthcare software companies that sell to hospitals",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Получение структурированных данных с помощью Exa Agent
</div>

Если для получения структурированных данных нужно исследовать сразу несколько источников, используйте [запуск задачи Exa Agent](/ru/docs/agent/quickstart). Опишите компании, людей, критерии отбора и нужные поля результата — и Agent вернёт результаты, проверенные по схеме, со ссылками на источники.

<Card title="Запустить задачу Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство по Agent" arrow="true">
  Формируйте и отбирайте списки компаний или людей, а затем дополняйте каждую запись полями, собранными из нескольких источников.
</Card>