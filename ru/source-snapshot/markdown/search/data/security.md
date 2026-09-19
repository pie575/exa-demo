> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжить изучение.

<div id="cybersecurity">
  # Кибербезопасность
</div>

> Находите уязвимости, бюллетени безопасности, отчёты об угрозах и документы о соответствии требованиям с помощью Exa Search.

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

Используйте Exa Search для поиска записей об уязвимостях, бюллетеней безопасности вендоров и исследований угроз в тех источниках, которые команды безопасности читают и так.

<div id="included">
  ## Что включено
</div>

* Записи об уязвимостях CVE и GHSA
* Бюллетени безопасности вендоров и описания патчей
* Отчёты аналитики угроз и разборы инцидентов
* Страницы доверия, списки субпроцессоров и документация по комплаенсу
* Блоги по безопасности, доклады с конференций и исследования

<div id="use-it-for">
  ## Сценарии использования
</div>

* Приоритизация уязвимостей и оценка поверхности атаки
* Аналитика угроз и отслеживание атакующих
* Оценка рисков вендоров и проверка безопасности третьих сторон
* Мониторинг безопасности и оповещения

<div id="example-queries">
  ## Примеры запросов
</div>

<div id="triage-a-vulnerability-class">
  ### Триаж класса уязвимостей
</div>

Укажите продукт, диапазон версий и уровень критичности.

<PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

<div id="find-vendor-advisories">
  ### Поиск бюллетеней безопасности от вендоров
</div>

Описывайте статус эксплуатации и класс продукта, а не конкретный идентификатор CVE.

<PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

<div id="review-a-vendors-security-posture">
  ### Оценка состояния безопасности вендора
</div>

Укажите тип документа и категорию вендора.

<PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />

<div id="research-an-adversary">
  ### Исследование злоумышленника
</div>

Укажите группировку или кампанию, а также интересующую вас технику или отрасль.

<PlaygroundQuery query="reports on ransomware groups targeting healthcare providers this year" />

<div id="make-a-request">
  ## Отправка запроса
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "critical CVEs affecting Apache Struts 6.x",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "critical CVEs affecting Apache Struts 6.x",
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
      "query": "critical CVEs affecting Apache Struts 6.x",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Получение структурированных данных с помощью Exa Agent
</div>

Если структурированные данные требуют исследования по нескольким источникам, используйте [запуск задачи Exa Agent](/ru/docs/agent/quickstart). Опишите продукты, критерии угроз и нужные поля вывода — и Agent вернёт результаты, проверенные по схеме, со ссылками на источники.

<Card title="Запустить задачу Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство по Agent" arrow="true">
  Проверьте вендора по бюллетеням безопасности, сообщениям об утечках и страницам доверия либо соберите нормализованные данные об уязвимостях.
</Card>