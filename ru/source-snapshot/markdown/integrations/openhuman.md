> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

<div id="openhuman">
  # OpenHuman
</div>

> Подключите к агенту OpenHuman веб-поиск в реальном времени через Exa — в управляемом режиме или со своим Exa API key.

[OpenHuman](https://tinyhumans.gitbook.io/openhuman) от TinyHumans — это десктопный ИИ-ассистент со встроенным инструментом веб-поиска, который агент вызывает самостоятельно. Поиск для этого инструмента обеспечивает Exa.

| Подход                | Настройка            | Где выполняется                                                                          |
| --------------------- | -------------------- | ---------------------------------------------------------------------------------------- |
| **OpenHuman Managed** | Не требуется         | Бэкенд OpenHuman на базе Exa. Без API key.                                               |
| **Провайдер Exa**     | Вставьте Exa API key | На вашей машине, напрямую к `https://api.exa.ai` в вашей собственной учётной записи Exa. |

<div id="openhuman-managed">
  ## OpenHuman Managed
</div>

Управляемый search используется по умолчанию. Выберите **Simple** при онбординге — и агент сразу сможет искать в интернете.

<Frame caption="Выберите Simple при онбординге, чтобы использовать управляемый search на базе Exa">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="Онбординг OpenHuman с вопросом о способе запуска OpenHuman и выбранным вариантом Simple" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **Managed — самый быстрый способ получить результаты Exa.** Не нужно создавать, хранить и ротировать key, на вашей машине не хранятся учётные данные, а search оплачивается в рамках вашей подписки OpenHuman.
</Tip>

<div id="exa-provider">
  ## Провайдер Exa
</div>

Настройте Exa напрямую, чтобы выполнять search в собственном аккаунте Exa и предоставить агенту инструменты Exa для search и получения contents страниц.

<div id="get-your-exa-api-key">
  ### Получите Exa API key
</div>

<Card title="Получите Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в дашборде. Новым аккаунтам начисляются бесплатные credits.
</Card>

<div id="add-exa-in-openhuman">
  ### Добавление Exa в OpenHuman
</div>

1. Откройте **Connections**, затем выберите **Search engine** в разделе **API keys**.

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="Страница Connections в OpenHuman с выбранным пунктом Search engine в разделе API keys: показан список поисковых систем, активна OpenHuman Managed" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. Выберите **Exa**.

<Frame caption="Exa выбрана, требуется key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="Выбранный движок Exa в панели Search engine в OpenHuman с бейджем Needs API key" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. Вставьте свой key в поле **Exa API key** и нажмите **Save**.

<Frame caption="Сохранение Exa API key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="Поле Exa API key в OpenHuman с введённым key и кнопкой Save" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="Exa настроена как активная поисковая система">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="Панель Search engine в OpenHuman с выбранной Exa и отметкой Configured" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

<div id="configuration">
  ### Настройка
</div>

Панель записывает данные в файл `config.toml` OpenHuman. Те же значения можно задать вручную — в файле или через переменные окружения:

<Tabs>
  <Tab title="config.toml">
    ```toml config.toml theme={null}
    [search]
    engine = "exa"        # обязательно
    max_results = 5       # необязательно, 1-20
    timeout_secs = 15     # необязательно

    [search.exa]
    api_key = "your-exa-api-key"   # обязательно
    ```
  </Tab>

  <Tab title="Переменные окружения">
    ```bash theme={null}
    OPENHUMAN_SEARCH_ENGINE=exa
    EXA_API_KEY=your-exa-api-key
    ```

    <Note>
      И `EXA_API_KEY`, и `OPENHUMAN_EXA_API_KEY` переопределяют `search.exa.api_key`. Если заданы обе переменные, приоритет у `OPENHUMAN_EXA_API_KEY`.
    </Note>
  </Tab>
</Tabs>

<div id="tools-the-agent-gets">
  ### Инструменты, доступные агенту
</div>

| Инструмент         | Что возвращает                                                                          |
| ------------------ | --------------------------------------------------------------------------------------- |
| `web_search_tool`  | Веб-поиск на базе Exa.                                                                  |
| `exa_search`       | Ранжированные страницы с заголовками, URL, датами публикации и — опционально — текстом. |
| `exa_get_contents` | Полное содержимое указанных URL, при необходимости со сводками или highlights.          |

Агент задаёт [параметры поиска](/ru/docs/search/quickstart) Exa для каждого вызова, поэтому достаточно обычных текстовых инструкций, чтобы управлять режимом поиска, доменами, датами и категориями.

<div id="troubleshooting">
  ## Устранение неполадок
</div>

<AccordionGroup>
  <Accordion title="Поиск Exa недоступен: не настроен API key">
    OpenHuman не нашёл key ни в панели **Search engine**, ни в переменных `EXA_API_KEY` и `OPENHUMAN_EXA_API_KEY`, ни в `search.exa.api_key`. Задайте его в одном из этих мест и перезапустите OpenHuman, если вы редактировали `config.toml` во время его работы.
  </Accordion>

  <Accordion title="Exa отклонил настроенный API key (HTTP 401)">
    Key недействителен или отозван. Проверьте его в [панели управления Exa](https://dashboard.exa.ai/api-keys), затем нажмите **Clear**, чтобы удалить сохранённый key, и сохраните корректный. Следите за пробелами, которые могли попасть при вставке.
  </Accordion>

  <Accordion title="Exa вернул статус, отличный от 2xx">
    `429` означает превышение лимита запросов или исчерпание квоты: проверьте использование в [панели управления](https://dashboard.exa.ai). При `5xx` повторите запрос, а затем см. [коды ошибок](/ru/docs/admin/error-codes).
  </Accordion>

  <Accordion title="OpenHuman Managed отсутствует в списке движков">
    В локальных сессиях управляемый search недоступен. Настройте провайдер Exa с собственным key.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ресурсы
</div>

<Columns cols={3}>
  <Card title="Документация OpenHuman по веб-поиску" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search" cta="Открыть руководство" arrow="true">
    Ознакомьтесь с собственным справочником OpenHuman по поисковым движкам.
  </Card>

  <Card title="Exa Search API" icon="search" href="/ru/docs/search/quickstart" cta="Читать руководство" arrow="true">
    Разберитесь в режимах поиска, фильтрах и параметрах контента, на которых построены инструменты Exa.
  </Card>

  <Card title="Лучшие практики поиска" icon="sparkles" href="/ru/docs/search/best-practices" cta="Читать руководство" arrow="true">
    Получайте более качественные результаты по каждому запросу.
  </Card>
</Columns>