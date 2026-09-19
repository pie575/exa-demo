> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение.

<div id="research-publications">
  # Научные публикации
</div>

> Находите научные статьи, патенты, гранты, клинические исследования и разрешения регуляторов с помощью Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Открыть в песочнице API" aria-label={`Открыть «${query}» в песочнице API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Используйте Exa Search для поиска научных публикаций и связанных с ними записей: заголовков, аннотаций, авторов, площадок публикации, цитирований, страниц издателей, препринтов и страниц репозиториев.

<Tip>
  Прочитайте [SOTA Search Over Academic Publications](https://exa.ai/blog/publications-search),
  чтобы узнать больше о качестве поиска по публикациям.
</Tip>

<div id="included">
  ## Что включено
</div>

* Научные статьи и препринты, включая фрагменты полного текста, если распознанный полный текст доступен
* Патенты с аннотациями, формулой изобретения, сведениями об изобретателях и правообладателях
* Гранты и объявления о финансировании
* Клинические исследования, инструкции к лекарственным препаратам и данные о лекарственных взаимодействиях
* Регуляторные разрешения и одобрения в сфере здравоохранения

<div id="use-it-for">
  ## Для чего использовать
</div>

* Обзор литературы и поиск цитирований
* Анализ предшествующего уровня техники и патентного ландшафта
* Клинические и фармацевтические исследования
* Поиск грантов и возможностей для финансирования

<div id="example-queries">
  ## Примеры запросов
</div>

<div id="find-papers-on-a-topic">
  ### Поиск статей по теме
</div>

Описывайте метод или результат, а не пытайтесь угадать ключевые слова в заголовке. Категория `publication` ограничивает выдачу научными статьями.

<PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" category="publication" />

<div id="search-clinical-evidence">
  ### Поиск клинических данных
</div>

Укажите фазу, вмешательство и популяцию пациентов, чтобы записи в реестрах исследований и страницы с результатами оказались выше общих публикаций.

<PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

<div id="track-regulatory-approvals">
  ### Отслеживание разрешений регуляторов
</div>

Укажите регулятора и класс устройств или препаратов, за которым вы следите.

<PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />

<div id="run-a-prior-art-search">
  ### Проведите поиск по предшествующему уровню техники
</div>

Опишите изобретение функционально, как в формуле изобретения, а не через название продукта.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="make-a-request">
  ## Выполните запрос
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "papers on evaluation benchmarks for retrieval-augmented generation",
      type="auto",
      category="publication",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "papers on evaluation benchmarks for retrieval-augmented generation",
    {
      type: "auto",
      category: "publication",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "papers on evaluation benchmarks for retrieval-augmented generation",
      "type": "auto",
      "category": "publication",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Получение структурированных данных с помощью Exa Agent
</div>

Если для получения структурированных данных нужно исследование по нескольким источникам, используйте [запуск задачи Exa Agent](/ru/docs/agent/quickstart). Опишите нужные публикации, критерии включения и поля результата — и Agent вернёт результаты, проверенные по схеме, вместе со ссылками на источники.

<Card title="Запустить задачу Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство по Agent" arrow="true">
  Постройте карту литературы, отберите статьи по критериям включения или соберите поля из нескольких публикаций в одну таблицу.
</Card>