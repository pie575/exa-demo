> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжать изучение.

<div id="legal-public-records">
  # Юридические документы и публичные реестры
</div>

> Находите судебные решения, патенты, санкционные списки, государственные контракты и другие публичные данные с помощью Exa Search.

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

Используйте Exa Search для поиска первоисточников правовых документов и государственных records — вместе с комментариями к ним.

<div id="included">
  ## Что включено
</div>

* Судебные решения США с полным текстом и метаданными о суде, номере дела и цитировании
* Выданные патенты США с рефератом, формулой изобретения, описанием, изобретателями и правообладателями
* Законы, нормативные акты и разъяснения ведомств
* Санкционные списки и списки лиц под наблюдением
* Государственные контракты и данные о закупках
* Данные переписи населения и другая публичная статистика

<div id="use-it-for">
  ## Для чего использовать
</div>

* Исследование судебной практики и юридический RAG
* Мониторинг нормативных актов и политик
* Поиск предшествующего уровня техники и оценка свободы использования
* Комплаенс-проверки и due diligence
* Исследование рынка государственного сектора

<div id="example-queries">
  ## Примеры запросов
</div>

<div id="find-case-law">
  ### Поиск судебной практики
</div>

Опишите правовой вопрос и юрисдикцию простым языком, а не в виде ссылки на конкретное дело.

<PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

<div id="search-patents">
  ### Поиск патентов
</div>

Опишите, что делает изобретение, — так, как это сделали бы в патентной формуле.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="screen-against-sanctions">
  ### Проверка по санкционным спискам
</div>

Укажите название списка и класс проверяемых субъектов.

<PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

<div id="research-government-spending">
  ### Исследование государственных расходов
</div>

Укажите ведомство-заказчика или категорию услуг и временной интервал.

<PlaygroundQuery query="federal contracts awarded for cloud migration services" />

<div id="pull-public-statistics">
  ### Получение публичной статистики
</div>

Укажите набор данных и территорию.

<PlaygroundQuery query="census tract population change in the Austin metro area" />

<div id="make-a-request">
  ## Выполнение запроса
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "California appellate decisions on non-compete enforceability",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "California appellate decisions on non-compete enforceability",
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
      "query": "California appellate decisions on non-compete enforceability",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Получение структурированных данных с помощью Exa Agent
</div>

Если для получения структурированных данных нужно исследование по множеству источников, используйте [запуск задачи Exa Agent](/ru/docs/agent/quickstart). Опишите нужные юрисдикции, типы записей, критерии и поля вывода — и Agent вернёт результаты, проверенные по схеме, со ссылками на источники.

<Card title="Запустить задачу Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство по Agent" arrow="true">
  Проверьте организацию по разным типам записей или отследите изменение в регулировании по первоисточникам и публикациям.
</Card>