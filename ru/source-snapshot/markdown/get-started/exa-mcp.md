> ## Индекс документации
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем изучать документацию дальше.

<div id="exa-mcp">
  # Exa MCP
</div>

> Подключайте ChatGPT, Codex, Claude, Grok, Cursor и любой другой MCP-клиент к инструментам Exa: веб-поиску, загрузке страниц, Exa Agent и Exa Connect.

Используйте Exa MCP, чтобы расширить встроенный веб-поиск в ChatGPT, Claude и MCP-совместимых инструментах поисковыми возможностями Exa, включая веб-поиск, поиск по коду, [Exa Agent](/ru/docs/agent/quickstart) и [Exa Connect](/ru/docs/agent/connect/overview).

Exa предоставляет размещённый server, который работает в любом MCP-клиенте:

```text theme={null}
https://mcp.exa.ai/mcp
```

Чтобы начать, API key не требуется. Exa MCP имеет открытый исходный код и доступен на [GitHub](https://github.com/exa-labs/exa-mcp-server).

<div id="install">
  ## Установка
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT и Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa — официальный плагин в каталоге плагинов OpenAI, который включает размещённый MCP-сервер Exa, а также навыки Exa `search` и `exa-agent`.

      <Steps>
        <Step title="Откройте плагин">
          Перейдите на [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Откроется страница **Exa** в каталоге плагинов OpenAI — это общий каталог для ChatGPT и Codex.
        </Step>

        <Step title="Установите его">
          Нажмите кнопку с плюсом, чтобы установить. Войдите в Exa по запросу — либо во время установки, либо при первом использовании плагина в Codex или ChatGPT.

          <Frame caption="Открытие раздела Plugins в Codex, добавление Exa и предоставление доступа">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Открытие раздела Plugins в Codex, просмотр плагина Exa и предоставление доступа" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="Начните новую сессию">
          Навыки загружаются в чатах и CLI-сессиях, начатых после установки, поэтому откройте новую сессию и задайте вопрос, требующий доступа к вебу.
        </Step>
      </Steps>

      Готово. Плагин включает и MCP-интеграцию Exa, и навыки, поэтому отдельно настраивать MCP или навыки не нужно.

      Полное руководство по настройке и рабочему процессу смотрите в разделе [Exa в Codex и ChatGPT](/ru/docs/integrations/chatgpt-codex).
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      ### Claude Code CLI

      <Steps>
        <Step title="Установите плагин">
          Установите Exa из терминала:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Также можно ввести `/plugin` в Claude Code, найти **Exa** и установить его.
        </Step>

        <Step title="Используйте Exa">
          Начните новую сессию Claude Code и задайте вопрос, для ответа на который нужен веб.
        </Step>
      </Steps>

      ### Desktop, Web и Cowork

      Claude Desktop, Web и Cowork используют официальный коннектор Exa.

      <Steps>
        <Step title="Откройте каталог коннекторов">
          Нажмите кнопку «плюс» в новом чате, выберите **Add connector** и найдите **Exa**.
        </Step>

        <Step title="Подключите Exa">
          Откройте Exa, выберите **Connect to Claude** и предоставьте доступ по запросу.

          <Frame caption="Открытие каталога коннекторов в Claude, поиск Exa, подключение и авторизация доступа">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Открытие каталога коннекторов в Claude, поиск Exa, подключение и авторизация доступа" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Используйте Exa">
          Начните новый чат и задайте вопрос, требующий актуальной информации из веба.
        </Step>
      </Steps>

      Полное руководство по настройке и рабочему процессу смотрите в разделе [Exa в Claude Code, Web и Desktop](/ru/docs/integrations/claude-web-desktop).

      Администраторы Claude Team и Enterprise могут вместо этого подключить коннектор сразу для всех через своего поставщика удостоверений: см. [Enterprise Managed Auth](/ru/docs/admin/mcp-enterprise-managed-auth).
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa доступна в marketplace [Grok Build](https://docs.x.ai/build/overview).

      <Steps>
        <Step title="Откройте marketplace">
          В Grok Build выполните `/marketplace`.
        </Step>

        <Step title="Установите Exa">
          Найдите **exa** в списке и нажмите `i`.
        </Step>

        <Step title="Войдите в аккаунт">
          Выполните `/mcp`, выберите **exa** и нажмите `i`, чтобы войти в свой аккаунт Exa в браузере.
        </Step>
      </Steps>

      Новым аккаунтам при регистрации начисляются бесплатные credits.
    </Tab>

    <Tab title="Курсор" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      Установите Exa MCP из [marketplace Cursor](https://cursor.com/marketplace/exa) или добавьте его в `~/.cursor/mcp.json`:

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
      Воспользуйтесь [установкой в один клик](https://vscode.dev/redirect/mcp/install?name=exa\&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D) или добавьте его в файл `.vscode/mcp.json` в вашем проекте:

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
      | Warp                                         | Settings → MCP Servers → Add MCP Server (верхний уровень `exa`)                                       | `url`                 |
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

      Или запустите локальный [npm-пакет](https://www.npmjs.com/package/exa-mcp-server) со своим [Exa API key](https://dashboard.exa.ai/api-keys):

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

| Режим     | Для чего использовать                                                         | Настройка                                                                                                                |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Без ключа | Бесплатное использование с ограничением частоты запросов, без входа и API key | Подключитесь к `https://mcp.exa.ai/mcp`                                                                                  |
| OAuth     | Интерактивные клиенты, установка из marketplace, использование в production   | Подключитесь к `https://mcp.exa.ai/mcp?login` и войдите в Exa в браузере. Использование засчитывается вашей команде Exa. |
| API key   | Клиенты без MCP OAuth                                                         | Подключитесь к `https://mcp.exa.ai/mcp`, передав в header `x-api-key` ваш API key                                        |

<div id="sign-in-with-oauth">
  ### Вход через OAuth
</div>

ChatGPT, Claude и другие установки из marketplace предлагают выполнить вход, когда это требуется. В любом client с поддержкой MCP OAuth вы можете запустить тот же процесс, подключившись к:

```text theme={null}
https://mcp.exa.ai/mcp?login
```

Ваш client находит сервер авторизации Exa, открывает страницу входа в браузере и управляет доступом.

<div id="use-an-api-key">
  ### Использование API key
</div>

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте ключ в дашборде. Новым аккаунтам начисляются бесплатные credits.
</Card>

Добавьте header `x-api-key` в настройки MCP-сервера Exa:

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

<div id="available-tools">
  ## Доступные инструменты
</div>

| Инструмент                | Доступность                    | Для чего использовать                                                    |
| ------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `web_search_exa`          | Включён по умолчанию           | Веб-поиск и возврат релевантного, готового к использованию контента      |
| `web_fetch_exa`           | Включён по умолчанию           | Чтение очищенного контента с одного или нескольких известных URL         |
| `web_search_advanced_exa` | Доступен при явном подключении | Настройка веб-поиска с расширенными фильтрами и параметрами              |
| `agent_run`               | Доступен с OAuth или API key   | Многошаговые исследования, list-building, enrichment и структурированный вывод |

С помощью URL-параметра `tools` выберите, какие инструменты увидит ваш клиент. Например, чтобы включить все инструменты:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  Явно заданный список `tools` заменяет набор по умолчанию, поэтому перечислите в нём все инструменты, которые хотите включить, в том числе веб-поиск и fetch.
</Tip>

<div id="exa-agent">
  ## Exa Agent
</div>

Используйте [Exa Agent](/ru/docs/agent/quickstart) для исследований, которым требуется больше одного search: например, чтобы построить список, проверить каждый item по criteria или получить структурированные результаты.

Agent runs тарифицируются по использованию, поэтому для `agent_run` нужен OAuth или API key. Этот URL запускает OAuth и добавляет Agent к инструментам по умолчанию:

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

Если вы используете API key, опустите `login` и добавьте ключ, как описано в разделе [Аутентификация](#authentication).

<Steps>
  <Step title="Опишите, что вам нужно">
    Сформулируйте исследовательскую задачу обычными словами. Ваш ассистент передаёт запрос в `agent_run` в поле `query`, а Exa Agent сам решает, что искать, читает источники и сверяет найденное с запросом.

    Просите Agent вернуть `outputSchema` только тогда, когда вашему приложению нужны результаты в едином формате JSON. Вы можете передать схему ассистенту в системном промпте или попросить его сгенерировать её за вас.
  </Step>

  <Step title="Получите результат">
    Когда исследование завершается, tool call передаёт ассистенту полный пакет результатов:

    * Текстовые выводы
    * Источники, на которых они основаны
    * Проверенный JSON, если вы указали `outputSchema`
    * Использование и стоимость

    Ассистент формирует ответ на основе этого пакета, поэтому скажите ему, что делать с выводом. Можно попросить кратко изложить результаты, сравнить их, сохранить в файл или что-то ещё.
  </Step>

  <Step title="Продолжите, если нужно больше времени">
    Исследование, которое не укладывается в один вызов MCP, не завершается ошибкой: инструмент возвращает `status: "running"` и `id`, пока выполнение продолжается на стороне Exa. Ассистент снова вызывает `agent_run`, передавая этот `id` как `runId`, чтобы вернуться к тому же выполнению.
  </Step>
</Steps>

<Accordion title="Дополнительные настройки" icon="sliders-horizontal">
  | Поле              | Для чего использовать                                                     |
  | ----------------- | ------------------------------------------------------------------------- |
  | `systemPrompt`    | Дать Agent дополнительные указания по исследованию или оценке результатов |
  | `outputSchema`    | Вернуть ответ в определённом формате JSON                                 |
  | `input.data`      | Обогатить уже имеющиеся у вас строки или сущности                         |
  | `input.exclusion` | Пропустить результаты, о которых вы уже знаете                            |
  | `dataSources`     | Добавить до пяти провайдеров [Exa Connect](/ru/docs/agent/connect/overview)  |
  | `previousRunId`   | Построить новый запрос на основе завершённого исследования                |
  | `effort`          | Выбрать глубину исследования, которое выполнит Agent                      |
</Accordion>

<Tip>
  Используйте `runId`, чтобы дождаться результата текущей работы. Используйте `previousRunId`, чтобы задать новый follow-up на основе уже завершённой работы.
</Tip>

Схемы вывода, режимы effort, источники данных и стоимость описаны в [руководстве по Exa Agent](/ru/docs/agent/quickstart).

<div id="advanced-search">
  ## Расширенный поиск
</div>

Используйте `web_search_advanced_exa`, когда в запросе нужны явные фильтры по категории или домену, диапазоны дат, текстовые ограничения, геотаргетинг, расширение запроса, краткие сводки, highlights, контроль свежести или обход подстраниц. Для обычного поиска оставляйте `web_search_exa`: он даёт модели меньшую поверхность инструментов и требует меньше настроек.

Расширенный поиск не требует аутентификации, однако для аутентифицированных подключений действуют ваш тарифный план и ваши лимиты частоты запросов. Включите его вместе с инструментами по умолчанию так:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

MCP tool предоставляет основные настройки [Search API](/ru/docs/reference/search) в виде удобных для инструментов полей, таких как `includeDomains`, `startPublishedDate`, `enableHighlights` и `maxAgeHours`. Точные имена полей смотрите в tool schema в вашем клиенте.

<div id="troubleshooting">
  ## Устранение неполадок
</div>

<AccordionGroup>
  <Accordion title="Ошибка превышения лимита запросов (429)">
    Подключение использует бесплатные лимиты частоты запросов Exa. Войдите через OAuth или добавьте собственный API key, а затем переподключитесь, чтобы запросы выполнялись по тарифу и лимитам вашей team.

    <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте ключ в дашборде. Новым аккаунтам начисляются бесплатные credits.
    </Card>
  </Accordion>

  <Accordion title="Agent отсутствует или запрашивает аутентификацию">
    `agent_run` не включён по умолчанию и не может использовать бесплатные лимиты частоты запросов. Добавьте его в URL-параметр `tools`, а затем подключитесь с `?login` или настройте API key. Полный URL смотрите в разделе [Exa Agent](#exa-agent).
  </Accordion>

  <Accordion title="Не открывается вход через OAuth">
    Убедитесь, что ваш client поддерживает MCP OAuth, и подключитесь к `https://mcp.exa.ai/mcp?login`. После изменения URL перезапустите client. Если client не может завершить MCP OAuth, используйте вместо этого API key.
  </Accordion>

  <Accordion title="Tools не отображаются">
    Явно указанный parameter `tools` заменяет список инструментов по умолчанию. Проверьте, что в URL присутствует каждый нужный tool, затем перезапустите MCP-клиент, чтобы он заново получил список инструментов.
  </Accordion>

  <Accordion title="Claude desktop не подключается">
    Используйте встроенный коннектор: выберите **+** (или **Add connectors**) → вкладка **Connectors** → найдите **Exa** → выберите **+**.
  </Accordion>

  <Accordion title="Файл Config не найден">
    Типичные расположения config:

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

  <Card title="Навыки agent" icon="wrench" href="/ru/docs/get-started/agent-skills/overview" cta="Просмотреть навыки" arrow="true">
    Переносимые навыки, которые дополняют Exa MCP.
  </Card>

  <Card title="Exa в Codex и ChatGPT" icon="messages-square" href="/ru/docs/integrations/chatgpt-codex" cta="Открыть руководство" arrow="true">
    Полное руководство по настройке и рабочему процессу для плагина Exa.
  </Card>
</Columns>