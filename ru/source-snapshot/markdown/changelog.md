> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

<div id="changelog">
  # Changelog
</div>

> Обновления продукта и анонсы от Exa.

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  <div id="dynamic-highlights-research-preview">
    ## Dynamic Highlights (research preview)
  </div>

  Dynamic Highlights выбирает фрагменты по всему набору результатов, а не обрабатывает каждую страницу по отдельности. Полезным источникам достаётся бо́льшая доля общего бюджета контекста, а источникам, которые лишь дублируют уже возвращённую информацию, — меньшая.

  * **Одношаговый RAG**: примерно на 49% выше эффективность использования токенов и на 2,4% выше итоговое качество с Exa Auto в тестах по программированию и общим вопросам-ответам.
  * **Агенты**: примерно на 30% меньше токенов на полных траекториях агента и на 1% выше качество в BrowseComp, WideSearch, а также во внутренних оценках по компаниям и людям.

  Запросы с `dynamic: true` требуют заголовка `Exa-Beta: dynamic-highlights-2026-08-28`.

  [Читать руководство по Dynamic Highlights →](/ru/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  <div id="publication-research">
    ## Исследование публикаций
  </div>

  Мы значительно расширили и улучшили исследование научных публикаций.

  * **350 млн публикаций**: search по индексу из 350 миллионов публикаций.
  * **Более содержательные результаты по организациям и людям**: поиск теперь возвращает и организации, и связанных с ними людей — каждого в виде подробного, обогащённого профиля с публикациями, ключевыми соавторами, областями исследований и финансированием.
  * **Агентный поиск по людям и организациям**: агенты теперь умеют искать по людям и организациям.
  * **Публичный бенчмарк поиска**: мы выпустили публичный бенчмарк для поиска публикаций.
  * **Новая категория поиска `publication`**: запрашивайте научные результаты с `category: "publication"` — эта категория заменяет `research paper`.
  * **Устаревшие категории**: категории поиска `pdf`, `github` и `tweet` выводятся из эксплуатации.
  * **`startCrawlDate` / `endCrawlDate`**: устаревшие параметры теперь игнорируются для всех команд, но по-прежнему принимаются для совместимости.

  Обращайтесь к этому через API с [категорией поиска](/ru/docs/search/quickstart) `publication` или [попробуйте в панели управления →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  <div id="exa-agent-and-exa-connect-in-mcp">
    ## Exa Agent и Exa Connect в MCP
  </div>

  Exa Agent теперь доступен в Exa MCP. Используйте его из Claude, Cursor или любого другого MCP-клиента, когда задача требует большего, чем один вызов search.

  Включите инструмент Agent с помощью `https://mcp.exa.ai/mcp?tools=agent_run`, затем вызовите `agent_run`, чтобы выполнить агент до завершения и получить его результат.

  Источники данных Exa Connect доступны через поток Agent, поэтому вы можете подключать премиальных партнёров по данным, когда одного web search недостаточно.

  [Читать руководство по Exa MCP →](/ru/docs/get-started/exa-mcp) · [Читать руководство по Exa Agent →](/ru/docs/agent/quickstart) · [Твит с анонсом →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  <div id="introducing-exa-connect">
    ## Представляем Exa Connect
  </div>

  Exa Connect даёт Exa Agent доступ в реальном времени к публичным и приватным данным со всего мира. На старте доступны Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko и другие партнёры. Подключить их можно через `dataSources` в `POST /agent/runs`.

  [Читать руководство по Exa Connect →](/ru/docs/agent/connect/overview) · [Твит с анонсом →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  <div id="introducing-exa-agent">
    ## Представляем Exa Agent
  </div>

  Мы выпустили новый класс передовых агентов для веб-исследований, доступных через API.

  Exa Agent API поддерживает такие параметры, как запрос на естественном языке, режим `effort`, `outputSchema` для структурированного вывода и `input.data` для работы поверх существующего набора данных.

  [Читать руководство по Exa Agent API →](/ru/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "Уведомление о прекращении поддержки части API" }}>
  <div id="api-deprecation-notice">
    ## Уведомление о прекращении поддержки части API
  </div>

  Мы отключили несколько устаревших возможностей Exa API:

  * **Эндпоинт `/research`**: заменён на `/search` с `type: "deep-reasoning"`.
  * **`resolvedSearchType` и `highlightScores` (поля ответа)**: с 15 апреля возвращают `null`, удалены 1 мая.
  * **`startCrawlDate` / `endCrawlDate` (устаревшие параметры запроса)**: с 15 апреля игнорируются без предупреждения.

  [Перейти на Deep search →](/ru/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Представляем Exa Monitors" }}>
  <div id="introducing-exa-monitors">
    ## Представляем Exa Monitors
  </div>

  Monitors выполняют поиск Exa по расписанию и доставляют результаты на ваш webhook, отсеивая дубликаты по предыдущим запускам, так что вы получаете только новый контент.

  * **Отслеживание тем во времени**: новости конкурентов, раунды финансирования, изменения в регулировании, научные статьи.
  * **Структурированные результаты**: обычный текст или типизированный JSON через `outputSchema`.
  * **Гибкое расписание**: запуск по интервалу (минимум 1 час) или вручную.

  [Читать руководство по Monitors API →](/ru/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Обновление Exa Deep" }}>
  <div id="exa-deep-revamp">
    ## Обновление Exa Deep
  </div>

  Exa Deep стал быстрее и дешевле и теперь поддерживает структурированный вывод с grounding на уровне полей.

  * **Новый тип `deep-reasoning`** для задач с высоким effort (12–50 с); `deep` выполняется за 4–12 с.
  * **Цена ниже на 20%** для обычного поиска `deep`.
  * **Структурированный вывод** через `outputSchema`, с полями `output.content` и `output.grounding` (цитаты и уверенность на уровне полей) в ответе.

  Полный прайс-лист см. в разделе [Обновление цен Exa](#exa-pricing-update) ниже.

  [Читать справочник Search API →](/ru/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Обновление цен Exa" }}>
  <div id="exa-pricing-update">
    ## Обновление цен Exa
  </div>

  Мы упростили и снизили цены. Contents для первых 10 результатов поиска теперь бесплатны, а новые цены применяются автоматически — от вас ничего не требуется.

  * **Search с contents**: $7 за 1 тыс. запросов (10 результатов, текст + highlights включены); $1 за 1 тыс. дополнительных результатов.
  * **Сводки**: $1 за 1 тыс. — и в search, и в contents.
  * **Exa Deep**: $12 за 1 тыс. запросов; **Deep (Reasoning)** — $15 за 1 тыс.
  * **Эндпоинт Contents**: $1 за 1 тыс. страниц на каждый тип контента.

  [Посмотреть текущие цены →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Представляем Exa Instant Search" }}>
  <div id="introducing-exa-instant-search">
    ## Представляем Exa Instant Search
  </div>

  Exa Instant — наш самый быстрый тип поиска: улучшенное качество нейропоиска при задержке менее 150 мс. Включается через `type="instant"`.

  * **Создан для реального времени**: чат-приложения, голосовой ИИ, кодинг-агенты, автодополнение и живые подсказки.
  * **Передовое качество** при самой низкой задержке из всех наших вариантов.

  [Читать руководство по Search API →](/ru/docs/search/quickstart) · [Попробовать в панели управления →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights, свежесть контента и обновления MCP" }}>
  <div id="highlights-content-freshness-and-mcp-updates">
    ## Highlights, свежесть контента и обновления MCP
  </div>

  Три улучшения в извлечении контента и доступе к нему:

  * **`maxCharacters` для highlights**: теперь это предпочтительный способ управлять длиной highlights. `numSentences` и `highlightsPerUrl` устарели.
  * **`maxAgeHours` для свежести контента**: управление по возрасту контента вместо булева `livecrawl` (`0` — всегда обход, `-1` — только кеш, `24` — обход, если старше 24 ч).
  * **Бесплатный тариф Exa MCP**: попробуйте без аутентификации — 3 QPS и 150 вызовов в день; для полного доступа добавьте API key.

  [Документация по свежести контента →](/ru/docs/contents/quickstart#content-freshness) · [Exa MCP →](/ru/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Представляем Exa Company Search" }}>
  <div id="introducing-exa-company-search">
    ## Представляем Exa Company Search
  </div>

  Поиск по компаниям теперь работает на дообученной поисковой модели и конвейере сопоставления сущностей. Используйте `type="auto"`, `category="company"`.

  * **Точность по атрибутам**: отрасль, география, стадия финансирования, численность сотрудников.
  * **Структурированные данные о сущностях**: в результатах возвращается типизированная информация о компании (штат, штаб-квартира, финансовые показатели, веб-трафик).
  * **Сценарии использования**: поиск потенциальных клиентов, исследование рынка, workflow в цепочках поставок.

  [Документация по Companies &amp; People Search →](/ru/docs/search/data/companies-people) · [Статья в блоге о бенчмарках →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Представляем Exa People Search" }}>
  <div id="introducing-exa-people-search">
    ## Представляем Exa People Search
  </div>

  Поиск по людям теперь охватывает более 1 млрд публичных профилей благодаря гибридной поисковой системе. Категория `linkedin` заменена новой категорией `people`.

  * **Более широкий охват**: профили по всему вебу, а не только из LinkedIn.
  * **Выше точность**: дообученные эмбеддинги для запросов по должности, навыкам и компании.
  * **Сценарии использования**: продажи, рекрутинг, исследование рынка.

  [Документация по Companies &amp; People Search →](/ru/docs/search/data/companies-people) · [Статья в блоге о бенчмарках →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK: highlights восстановлены" }}>
  <div id="js-sdk-highlights-restored">
    ## JS SDK: highlights восстановлены
  </div>

  Начиная с версии `exa-js` v2.0.11, highlights снова доступны в JavaScript SDK — возвращаются ключевые предложения с оценками релевантности. Передавайте `highlights: true` или `highlights: { maxCharacters, query }` в вызовах search и contents.

  [Документация по JavaScript SDK →](/ru/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "Новый тип поиска Deep" }}>
  <div id="new-deep-search-type">
    ## Новый тип поиска Deep
  </div>

  Exa Deep находит более качественные результаты: он выполняет несколько поисков одновременно и возвращает подробный контекст для каждого результата. Включите его через `type="deep"`.

  * **Расширение запроса**: отправьте один запрос, и мы сгенерируем его вариации, либо задайте свои через `additionalQueries`.
  * **Параллельный поиск и умное ранжирование** по вашему запросу и всем его вариациям.
  * **Подробные сводки** для каждого результата.

  [Справочник Search API →](/ru/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "Добавлена фильтрация по языку" }}>
  <div id="added-language-filtering">
    ## Добавлена фильтрация по языку
  </div>

  Exa теперь определяет язык вашего запроса и возвращает результаты только на этом языке. Работает по умолчанию для всех пользователей, никакой настройки не требуется.

  [Руководство по Search API →](/ru/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "Изменения в SDK: highlights удалены, contents возвращаются по умолчанию" }}>
  <div id="sdk-changes-highlights-removed-and-contents-returned-by-default">
    ## Изменения в SDK: highlights удалены, contents возвращаются по умолчанию
  </div>

  Мажорная версия SDK с обратно несовместимыми изменениями:

  * **Contents по умолчанию**: search теперь включает page contents; отключите их, чтобы поиск шёл быстрее.
  * **Highlights удалены из SDK**: позже восстановлены в JS SDK, см. [JS SDK: highlights восстановлены](#js-sdk-highlights-restored).
  * **`use_autoprompt` объявлен устаревшим**: удалён из всех ответов API.

  [Документация по Python SDK →](/ru/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "Поддержка фильтрации по путям доменов" }}>
  <div id="domain-path-filter-support">
    ## Поддержка фильтрации по путям доменов
  </div>

  `includeDomains` и `excludeDomains` теперь позволяют задавать более точные цели:

  * **Фильтрация по конкретным путям**: например, `exa.ai/blog` или `linkedin.com/company`.
  * **Подстановочные знаки для поддоменов**: например, `*.substack.com`.

  Удобно, когда нужно ограничить поиск блогами, каталогами продуктов или справочниками.

  [Справочник Search API →](/ru/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "Поддержка фильтра по геолокации" }}>
  <div id="geolocation-filter-support">
    ## Поддержка фильтра по геолокации
  </div>

  Новый параметр `userLocation` смещает результаты в сторону региона пользователя и передаётся как код страны [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (например, `"us"`, `"fr"`). Полезно для мультирегиональных приложений, контента на региональных языках и локального поиска.

  [Справочник Search API →](/ru/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "New Fast Search Type" }}>
  <div id="new-fast-search-type">
    ## Новый тип поиска Fast
  </div>

  Exa Fast использует облегчённые поисковые модели с задержкой p50 менее 425 мс. Включается через `type="fast"`.

  * **Тот же индекс Exa** с качественным контентом, что и у нейропоиска.
  * **Полная совместимость параметров** с другими типами поиска.
  * **Создан для** быстрого grounding по вебу, агентных workflow и продуктов с низкой задержкой.

  [Читать руководство по Search API →](/ru/docs/search/quickstart) · [Попробовать в панели управления →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Score Deprecation in Auto Search" }}>
  <div id="score-deprecation-in-auto-search">
    ## Отказ от score в поиске Auto
  </div>

  Новая архитектура поиска Auto больше не позволяет вычислять осмысленные оценки релевантности, поэтому поле `score` удаляется из результатов поиска Auto.

  * **Поиск Auto**: больше не возвращает `score`; результаты и так отсортированы по релевантности.
  * **Нейропоиск**: оценки остаются без изменений. Укажите `type="neural"`, если они вам нужны.

  [Читать справочник по Search API →](/ru/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Markdown Contents as Default" }}>
  <div id="markdown-contents-as-default">
    ## Markdown в contents по умолчанию
  </div>

  Все эндпоинты теперь по умолчанию возвращают чистый markdown — он лучше подходит для LLM, RAG и обработки текста в целом. Никаких действий не требуется.

  * **`includeHtmlTags=false` (по умолчанию)**: контент преобразуется в чистый markdown.
  * **`includeHtmlTags=true`**: необработанный HTML без преобразования в markdown.

  В обоих случаях служебные элементы вроде рекламы и навигации удаляются.

  [Читать документацию по Contents →](/ru/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "New Livecrawl Option: Preferred" }}>
  <div id="new-livecrawl-option-preferred">
    ## Новый вариант livecrawl: preferred
  </div>

  <Warning>
    Историческая запись: строковый параметр `livecrawl` устарел. Для новых интеграций используйте `maxAgeHours` вместе с `livecrawlTimeout`. См. [Свежесть контента](/ru/docs/contents/quickstart#content-freshness).
  </Warning>

  Устаревший вариант `livecrawl: "preferred"` пытается выполнить свежий обход, но при неудаче возвращается к кешированному контенту (в отличие от `"always"`, который выдаёт ошибку). Идеально подходит для продакшен-приложений, которым нужен свежий контент, но недопустимы сбои из-за временно недоступных сайтов.

  [Читать документацию о свежести контента →](/ru/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Contents Endpoint Status Changes" }}>
  <div id="contents-endpoint-status-changes">
    ## Изменения статусов в эндпоинте Contents
  </div>

  `/contents` теперь возвращает поле `statuses` по каждому URL вместо одной общей HTTP-ошибки, так что результат по каждому URL можно обрабатывать отдельно. Сам эндпоинт выдаёт ошибку только при внутренних проблемах.

  * **`status`**: `"success"` или `"error"` для каждого URL.
  * **`error.tag`**: например, `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE`, вместе с `httpStatusCode`.

  [Читать справочник по кодам ошибок →](/ru/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto search as Default" }}>
  <div id="auto-search-as-default">
    ## Поиск Auto по умолчанию
  </div>

  Поиск Auto теперь используется по умолчанию и автоматически направляет каждый запрос к наиболее подходящему методу поиска. Никаких действий не требуется; чтобы сохранить прежнее поведение, укажите `type="neural"`.

  [Узнать о типах поиска Exa →](/ru/docs/search/quickstart)
</Update>