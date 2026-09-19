> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

<div id="exa-mcp">
  # Exa MCP
</div>

> Подключите ChatGPT, Codex, Claude, Grok, Cursor и любой другой MCP-клиент к инструментам Exa: веб-поиску, получению содержимого страниц, Exa Agent и Exa Connect.

Используйте Exa MCP, чтобы расширить встроенный веб-поиск в ChatGPT, Claude и других MCP-совместимых инструментах возможностями поиска Exa, включая веб-поиск, поиск по коду, [Exa Agent](/ru/docs/agent/quickstart) и [Exa Connect](/ru/docs/agent/connect/overview).

Exa предоставляет размещённый сервер, который работает в любом MCP-клиенте:

```text theme={null}
https://mcp.exa.ai/mcp
```

Чтобы начать, API key не требуется. Exa MCP — проект с открытым исходным кодом, доступный на [GitHub](https://github.com/exa-labs/exa-mcp-server).

<div id="install">
  ## Установка
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT и Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa — официальный плагин в каталоге плагинов OpenAI; он включает размещённый MCP-сервер, а также навыки Exa `search` и `exa-agent`.

      <Steps>
        <Step title="Откройте плагин">
          Перейдите на [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Откроется страница **Exa** в каталоге плагинов OpenAI — это один и тот же каталог для ChatGPT и для Codex.
        </Step>

        <Step title="Установите его">
          Нажмите кнопку «плюс», чтобы установить. Войдите в Exa, когда появится запрос, — либо во время установки, либо при первом обращении Codex или ChatGPT к плагину.

          <Frame caption="Открытие раздела Plugins в Codex, добавление Exa и выдача доступа">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Открытие раздела Plugins в Codex, просмотр плагина Exa и выдача доступа" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="Начните новую сессию">
          Навыки подгружаются в чатах и CLI-сессиях, запущенных уже после установки, поэтому откройте новую сессию и задайте вопрос, для ответа на который нужен веб.
        </Step>
      </Steps>

      Готово. Плагин включает и MCP-интеграцию Exa, и навыки, так что отдельно настраивать MCP или навыки не нужно.

      Полное руководство по настройке и работе смотрите в разделе [Exa в Codex и ChatGPT](/ru/docs/integrations/chatgpt-codex).
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <div id="claude-code-cli">
        ### Claude Code CLI
      </div>

      <Steps>
        <Step title="Установите плагин">
          Установите Exa из терминала:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Также можно ввести `/plugin` в Claude Code, найти **Exa** и установить плагин.
        </Step>

        <Step title="Используйте Exa">
          Начните новую сессию Claude Code и задайте вопрос, для ответа на который нужен интернет.
        </Step>
      </Steps>

      <div id="desktop-web-cowork">
        ### Desktop, Web и Cowork
      </div>

      Claude Desktop, Web и Cowork используют официальный коннектор Exa.

      <Steps>
        <Step title="Откройте каталог коннекторов">
          Нажмите кнопку с плюсом в новом чате, выберите **Add connector** и найдите **Exa**.
        </Step>

        <Step title="Подключите Exa">
          Откройте Exa, выберите **Connect to Claude** и предоставьте доступ по запросу.

          <Frame caption="Открытие каталога коннекторов в Claude, поиск Exa, подключение и предоставление доступа">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Открытие каталога коннекторов в Claude, поиск Exa, подключение и предоставление доступа" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Используйте Exa">
          Начните новый чат и задайте вопрос, требующий актуальной информации из интернета.
        </Step>
      </Steps>

      Полное руководство по настройке и работе см. в разделе [Exa в Claude Code, Web и Desktop](/ru/docs/integrations/claude-web-desktop).

      Администраторы Claude Team и Enterprise могут вместо этого выдать коннектор всем сотрудникам через своего поставщика идентификации: см. [Enterprise Managed Auth](/ru/docs/admin/mcp-enterprise-managed-auth).
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa доступна в маркетплейсе [Grok Build](https://docs.x.ai/build/overview).

      <Steps>
        <Step title="Откройте маркетплейс">
          В Grok Build выполните `/marketplace`.
        </Step>

        <Step title="Установите Exa">
          Найдите **exa** в списке и нажмите `i`.
        </Step>

        <Step title="Войдите в аккаунт">
          Выполните `/mcp`, выберите **exa** и нажмите `i`, чтобы войти в свой аккаунт Exa через браузер.
        </Step>
      </Steps>

      Новым аккаунтам при регистрации начисляются бесплатные credits.
    </Tab>

    <Tab title="Курсор" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      Установите Exa MCP из [маркетплейса Cursor](https://cursor.com/marketplace/exa) или добавьте его в `~/.cursor/mcp.json`:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="VS Code" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/vscode.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9828a7b963d47467df217a38c716fea2" width="24" height="24" data-path="images/mcp-clients/vscode.svg">
      Воспользуйтесь [установкой в один клик](https://vscode.dev/redirect/mcp/install?name=exa\&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D) или добавьте конфигурацию в файл `.vscode/mcp.json` вашего проекта:

      ```json theme={null}
      {
        "servers": {
          "exa": {
            "type": "http",
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="Другие клиенты" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/other-clients.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=187e423022b8fc3ed950a967a10ff700" width="24" height="24" data-path="images/mcp-clients/other-clients.svg">
      Большинство клиентов используют стандартную структуру `mcpServers`:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```

      Расположение конфигурации и название ключа с URL зависят от клиента:

      | Клиент                                       | Куда добавлять                                                                                        | Ключ URL              |
      | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------- |
      | [fx by Vercel](/ru/docs/integrations/vercel/fx) | `/mcp add --transport http exa https://mcp.exa.ai/mcp` в оболочке fx (сохраняется в `~/.fx/mcp.json`) | `url`                 |
      | OpenCode                                     | `opencode.json` (в разделе `mcp`, с `"type": "remote"`)                                               | `url`                 |
      | Kiro                                         | `~/.kiro/settings/mcp.json` (в разделе `mcpServers`)                                                  | `url`                 |
      | Windsurf                                     | `~/.codeium/windsurf/mcp_config.json` (в разделе `mcpServers`)                                        | `serverUrl`           |
      | Google Antigravity                           | Панель Agent → Manage MCP Servers → View Raw config (в разделе `mcpServers`)                          | `serverUrl`           |
      | Zed                                          | `settings.json` в Zed (в разделе `context_servers`)                                                   | `url`                 |
      | Gemini CLI                                   | `~/.gemini/settings.json` (в разделе `mcpServers`)                                                    | `httpUrl`             |
      | Warp                                         | Settings → MCP Servers → Add MCP Server (ключ `exa` верхнего уровня)                                  | `url`                 |
      | v0 by Vercel                                 | Prompt Tools → Add MCP                                                                                | вставьте URL напрямую |

      Если ваш клиент не поддерживает удалённые MCP-серверы, используйте мост `mcp-remote`:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
          }
        }
      }
      ```

      Либо запустите локальный [npm-пакет](https://www.npmjs.com/package/exa-mcp-server), указав свой [Exa API key](https://dashboard.exa.ai/api-keys):

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "exa-mcp-server"],
            "env": {
              "EXA_API_KEY": "your_api_key"
            }
          }
        }
      }
      ```
    </Tab>
  </Tabs>
</div>

<div id="authentication">
  ## Аутентификация
</div>

Exa MCP поддерживает три режима аутентификации:

| Режим     | Когда использовать                                                            | Настройка                                                                                                            |
| --------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Без ключа | Бесплатное использование с ограничением частоты запросов, без входа и API key | Подключитесь к `https://mcp.exa.ai/mcp`                                                                              |
| OAuth     | Интерактивные клиенты, установка из маркетплейсов, использование в продакшене | Подключитесь к `https://mcp.exa.ai/mcp?login` и войдите в Exa через браузер. Расход засчитывается вашей команде Exa. |
| API key   | Клиенты без поддержки MCP OAuth                                               | Подключитесь к `https://mcp.exa.ai/mcp`, передав свой API key в header `x-api-key`                                   |

<div id="sign-in-with-oauth">
  ### Вход через OAuth
</div>

ChatGPT, Claude и другие установки из каталогов приложений сами предложат войти, когда это потребуется. В любом клиенте с поддержкой MCP OAuth тот же процесс можно запустить, подключившись к:

```text theme={null}
https://mcp.exa.ai/mcp?login
```

Ваш клиент находит сервер авторизации Exa, открывает страницу входа в браузере и управляет доступом.

<div id="use-an-api-key">
  ### Использование API key
</div>

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте ключ в дашборде. Новым аккаунтам начисляются бесплатные кредиты.
</Card>

Добавьте заголовок `x-api-key` в настройки MCP-сервера:

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

<div id="available-tools">
  ## Доступные инструменты
</div>

| Инструмент                | Доступность                    | Для чего использовать                                                                |
| ------------------------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| `web_search_exa`          | Включён по умолчанию           | Поиск в интернете с выдачей релевантного, готового к использованию контента          |
| `web_fetch_exa`           | Включён по умолчанию           | Чтение очищенного контента с одного или нескольких известных URL                     |
| `web_search_advanced_exa` | Доступен при явном подключении | Настройка веб-поиска с расширенными фильтрами и параметрами                          |
| `agent_run`               | Доступен с OAuth или API key   | Многошаговые исследования, составление списков, enrichment и структурированный вывод |

Используйте URL-параметр `tools`, чтобы выбрать, какие инструменты будут видны вашему клиенту. Например, чтобы включить все инструменты:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  Явно заданный список `tools` заменяет набор по умолчанию, поэтому перечислите в нём все инструменты, которые хотите включить, в том числе веб-поиск и fetch.
</Tip>

<div id="exa-agent">
  ## Exa Agent
</div>

Используйте [Exa Agent](/ru/docs/agent/quickstart) для исследований, которым недостаточно одного поиска: например, чтобы собрать список, проверить каждый item по criteria или получить структурированные результаты.

Запуски Agent тарифицируются по использованию, поэтому для `agent_run` необходим OAuth или API key. Этот URL запускает OAuth и добавляет Agent к инструментам по умолчанию:

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

Если вы используете API key, опустите `login` и добавьте ключ, как описано в разделе [Аутентификация](#authentication).

<Steps>
  <Step title="Опишите, что вам нужно">
    Сформулируйте задачу исследования обычным языком. Ассистент передаёт её в `agent_run` в поле `query`, а Exa Agent сам решает, что искать, читает источники и сверяет найденное с запросом.

    Просить Agent вернуть `outputSchema` стоит только тогда, когда вашему приложению нужны результаты в едином формате JSON. Схему можно передать ассистенту в системном промпте или попросить сгенерировать её.
  </Step>

  <Step title="Получите результат">
    Когда исследование завершено, вызов инструмента передаёт ассистенту полный пакет результатов:

    * Текстовые выводы
    * Источники, на которых они основаны
    * Проверенный JSON, если вы указали `outputSchema`
    * Использование и стоимость

    Ответ ассистента строится на основе этого пакета, поэтому укажите, что именно нужно сделать с результатом. Можно попросить кратко изложить выводы, сравнить их, сохранить в файл или что-то ещё.
  </Step>

  <Step title="Продолжите, если нужно больше времени">
    Исследование, которое не укладывается в один вызов MCP, не завершается ошибкой: инструмент возвращает `status: "running"` и `id`, пока выполнение продолжается на стороне Exa. Ассистент снова вызывает `agent_run`, передав этот `id` как `runId`, и подхватывает тот же запуск.
  </Step>
</Steps>

<Accordion title="Дополнительные настройки" icon="sliders-horizontal">
  | Поле              | Для чего использовать                                                     |
  | ----------------- | ------------------------------------------------------------------------- |
  | `systemPrompt`    | Дать Agent дополнительные указания по исследованию или оценке результатов |
  | `outputSchema`    | Вернуть ответ в определённом формате JSON                                 |
  | `input.data`      | Обогатить строки или сущности, которые у вас уже есть                     |
  | `input.exclusion` | Пропустить результаты, о которых вы уже знаете                            |
  | `dataSources`     | Добавить до пяти провайдеров [Exa Connect](/ru/docs/agent/connect/overview)  |
  | `previousRunId`   | Построить новый запрос на основе завершённого исследования                |
  | `effort`          | Выбрать, насколько глубокое исследование должен провести Agent            |
</Accordion>

<Tip>
  Используйте `runId`, чтобы продолжать ожидать результат текущей работы. Используйте `previousRunId`, чтобы задать уточняющий запрос на основе уже завершённой работы.
</Tip>

Схемы вывода, режимы effort, источники данных и цены описаны в [руководстве по Exa Agent](/ru/docs/agent/quickstart).

<div id="advanced-search">
  ## Расширенный поиск
</div>

Используйте `web_search_advanced_exa`, когда запрос требует явных фильтров по категории или домену, диапазонов дат, текстовых ограничений, геотаргетинга, расширения запроса, кратких изложений, highlights, контроля свежести или обхода подстраниц. Для обычных поисковых запросов оставляйте `web_search_exa`: этот инструмент предоставляет модели меньшую поверхность и требует меньше настройки.

Расширенный поиск не требует аутентификации, однако при аутентифицированных подключениях применяются ваш тарифный план и ваши лимиты запросов. Включите его вместе с инструментами по умолчанию так:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

Инструмент MCP предоставляет основные параметры [Search API](/ru/docs/reference/search) в виде удобных для инструментов полей, таких как `includeDomains`, `startPublishedDate`, `enableHighlights` и `maxAgeHours`. Точные имена полей смотрите в схеме инструмента в вашем клиенте.

<div id="troubleshooting">
  ## Устранение неполадок
</div>

<AccordionGroup>
  <Accordion title="Ошибка превышения лимита запросов (429)">
    Подключение работает с бесплатными лимитами запросов Exa. Войдите через OAuth или добавьте собственный API key, затем переподключитесь, чтобы запросы шли по тарифному плану и лимитам вашей команды.

    <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте ключ в дашборде. Новым аккаунтам начисляются бесплатные кредиты.
    </Card>
  </Accordion>

  <Accordion title="Agent отсутствует или запрашивает аутентификацию">
    `agent_run` не включён по умолчанию и не может работать с бесплатными лимитами запросов. Добавьте его в URL-параметр `tools`, затем подключитесь с `?login` или укажите API key. Полный URL смотрите в разделе [Exa Agent](#exa-agent).
  </Accordion>

  <Accordion title="Не открывается вход через OAuth">
    Убедитесь, что ваш клиент поддерживает MCP OAuth, и подключитесь к `https://mcp.exa.ai/mcp?login`. После изменения URL перезапустите клиент. Если клиент не может завершить MCP OAuth, используйте API key.
  </Accordion>

  <Accordion title="Инструменты не отображаются">
    Явно указанный параметр `tools` заменяет список инструментов по умолчанию. Проверьте, что все нужные инструменты перечислены в URL, затем перезапустите MCP-клиент, чтобы он заново получил список инструментов.
  </Accordion>

  <Accordion title="Claude desktop не подключается">
    Используйте встроенный коннектор: выберите **+** (или **Add connectors**) → вкладка **Connectors** → найдите **Exa** → нажмите **+**.
  </Accordion>

  <Accordion title="Файл конфигурации не найден">
    Типичные расположения конфигурации:

    * Cursor: `~/.cursor/mcp.json`
    * fx: `~/.fx/mcp.json`
    * VS Code: `.vscode/mcp.json` (в корне проекта)
    * Claude desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
    * Claude desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ресурсы
</div>

<Columns cols={2}>
  <Card title="GitHub" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Посмотреть исходный код" arrow="true">
    Исходный код Exa MCP.
  </Card>

  <Card title="npm" icon="package" href="https://www.npmjs.com/package/exa-mcp-server" cta="Открыть пакет" arrow="true">
    Запустите Exa MCP локально с помощью npm-пакета.
  </Card>

  <Card title="Навыки агентов" icon="wrench" href="/ru/docs/get-started/agent-skills/overview" cta="Смотреть навыки" arrow="true">
    Переносимые навыки, дополняющие Exa MCP.
  </Card>

  <Card title="Exa в Codex и ChatGPT" icon="messages-square" href="/ru/docs/integrations/chatgpt-codex" cta="Открыть руководство" arrow="true">
    Полное руководство по настройке и workflow для плагина Exa.
  </Card>
</Columns>