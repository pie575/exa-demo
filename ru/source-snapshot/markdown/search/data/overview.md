> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение.

<div id="data-index">
  # Индекс данных
</div>

> Что Exa индексирует в открытом вебе и в приватных источниках данных.

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

Exa ищет по открытому вебу и отдельным закрытым источникам данных, непрерывно обновляя охват. Он включает:

<AccordionGroup>
  <Accordion title="Новости" icon="newspaper">
    <Card title="Руководство по новостям" icon="newspaper" href="/ru/docs/search/data/news" cta="Читать руководство" arrow="true">
      Познакомьтесь со сценариями использования поиска по новостям, примерами и лучшими практиками.
    </Card>

    Новости и статьи:

    <PlaygroundQuery query="coverage of the EU AI Act enforcement timeline published this month" />

    Записи в блогах и подборки:

    <PlaygroundQuery query="engineering blog posts about migrating from Postgres to ClickHouse" />

    Расшифровки подкастов и видео:

    <PlaygroundQuery query="podcast episodes where founders discuss pricing strategy mistakes" />

    Негативные упоминания в СМИ:

    <PlaygroundQuery query="negative press and regulatory complaints about payday lending companies" />
  </Accordion>

  <Accordion title="Код и документация" icon="code">
    <Card title="Руководство по коду и документации" icon="code" href="/ru/docs/search/data/code" cta="Читать руководство" arrow="true">
      Изучите сценарии использования поиска по коду, примеры и рекомендации.
    </Card>

    Репозитории GitHub:

    <PlaygroundQuery query="open source Rust libraries for vector similarity search" />

    API и документация для разработчиков:

    <PlaygroundQuery query="Stripe webhook signature verification documentation" />

    Реестры пакетов с точными сведениями о версиях и релизах:

    <PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

    Каталоги навыков агентов:

    <PlaygroundQuery query="agent skills for extracting tables from PDFs" />
  </Accordion>

  <Accordion title="Компании и люди" icon="users">
    <Card title="Руководство по компаниям и людям" icon="users" href="/ru/docs/search/data/companies-people" cta="Читать руководство" arrow="true">
      Узнайте, как находить компании, людей и связи между ними.
    </Card>

    Поиск компаний и сигналы об их деятельности:

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    Профессиональные профили по роли, навыкам и местоположению:

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    Люди, отобранные по компаниям, в которых они работают:

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    Исследование компаний и заинтересованных лиц в одном запросе:

    <PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />
  </Accordion>

  <Accordion title="Финансовые рынки" icon="chart-line">
    <Card title="Руководство по финансовым рынкам" icon="chart-line" href="/ru/docs/search/data/financial" cta="Читать руководство" arrow="true">
      Изучите сценарии использования: котировки, отчётность, звонки с инвесторами по результатам квартала и рыночную аналитику.
    </Card>

    Цены, прогнозы аналитиков и финансовая отчётность:

    <PlaygroundQuery query="analyst price targets for NVIDIA after its most recent earnings" />

    Документы SEC, звонки по результатам квартала и отчётность зарубежных компаний:

    <PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" />

    Объявленные раунды финансирования и другие публично раскрытые данные:

    <PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

    Публикуемые экономические данные и государственная статистика:

    <PlaygroundQuery query="most recent US CPI release and month-over-month change" />
  </Accordion>

  <Accordion title="Научные публикации" icon="book-open">
    <Card title="Руководство по научным публикациям" icon="book-open" href="/ru/docs/search/data/research" cta="Читать руководство" arrow="true">
      Разберитесь со сценариями использования для научных статей, патентов, клинических и регуляторных исследований.
    </Card>

    Научные статьи, патенты и гранты:

    <PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" />

    Клинические исследования и лекарственные взаимодействия:

    <PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

    Регуляторные разрешения и одобрения в сфере здравоохранения:

    <PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />
  </Accordion>

  <Accordion title="Юридические документы и публичные записи" icon="scale">
    <Card title="Руководство по юридическим и публичным данным" icon="scale" href="/ru/docs/search/data/legal" cta="Читать руководство" arrow="true">
      Изучите сценарии работы с судебной практикой, патентами, санкциями и публичными реестрами.
    </Card>

    Юридические и судебные документы:

    <PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

    Санкции и списки наблюдения:

    <PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

    Государственные контракты:

    <PlaygroundQuery query="federal contracts awarded for cloud migration services" />

    Переписи населения и другие публичные реестры:

    <PlaygroundQuery query="census tract population change in the Austin metro area" />
  </Accordion>

  <Accordion title="Спорт, погода и места" icon="map-pin">
    <Card title="Руководство по спорту, погоде и местам" icon="map-pin" href="/ru/docs/search/data/sports-weather-places" cta="Читать руководство" arrow="true">
      Узнайте, как запрашивать спортивные данные в реальном времени, прогнозы погоды и информацию о местах поблизости.
    </Card>

    Счёт матчей в реальном времени, турнирные таблицы и расписания:

    <PlaygroundQuery query="NBA scores last night" />

    Прогнозы погоды для любого места и даты:

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

    Местный бизнес, заведения и объекты недвижимости:

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />
  </Accordion>

  <Accordion title="Кибербезопасность" icon="shield">
    <Card title="Руководство по кибербезопасности" icon="shield" href="/ru/docs/search/data/security" cta="Читать руководство" arrow="true">
      Изучите сценарии использования, связанные с уязвимостями, бюллетенями безопасности и рисками поставщиков.
    </Card>

    Бюллетени безопасности:

    <PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

    Базы уязвимостей CVE и GHSA:

    <PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

    Списки субобработчиков данных и страницы Trust Center:

    <PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />
  </Accordion>
</AccordionGroup>

В этих руководствах рассматриваются типичные сценарии работы с данными, но Exa также ищет по всему открытому вебу — по множеству сайтов, форматов и языков.