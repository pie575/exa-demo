> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="truefoundry">
  # TrueFoundry
</div>

> Подключите Exa к TrueFoundry MCP Gateway, чтобы централизованно управлять доступом и инструментами и отслеживать использование.

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) — это прокси-слой корпоративного уровня между вашими приложениями и провайдерами LLM или MCP-серверами. Он даёт единый доступ к более чем 1000 LLM с централизованной наблюдаемостью и управлением.

TrueFoundry предоставляет Exa как официальный удалённый сервер в своём [MCP Gateway](https://www.truefoundry.com/mcp-gateway). Подключите MCP-сервер Exa, чтобы дать вашим командам единый управляемый эндпоинт для поиска в интернете, получения контента и агентных исследований.

<Frame caption="Exa в каталоге официальных удалённых MCP-серверов TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="Сервер Exa в официальном каталоге удалённых MCP-серверов TrueFoundry" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

<div id="add-exa-to-truefoundry">
  ## Добавление Exa в TrueFoundry
</div>

1. Откройте раздел **MCP Servers** на боковой панели TrueFoundry и выберите **Add new MCP Server**.
2. Выберите **Connect Official Remote MCP Servers**.

<Frame caption="Выбор каталога официальных удалённых MCP-серверов">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="Окно выбора Add MCP Server в TrueFoundry с выделенным пунктом Connect Official Remote MCP Servers" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. Найдите **Exa** в каталоге и нажмите **+ Add**.
4. Проверьте предзаполненные параметры сервера:

| Поле           | Значение                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Name           | `exa`                                                                                                                                   |
| Description    | Search Engine made for AIs by Exa                                                                                                       |
| URL            | `https://mcp.exa.ai/mcp`                                                                                                                |
| Authentication | Необязательно (MCP-сервер работает без аутентификации. API-ключ Exa понадобится, только если вы достигнете бесплатного лимита запросов.) |

5. Добавьте пользователей или команды, которые будут управлять сервером или пользоваться им. Оставьте **Auth Data** выключенным и нажмите **Update MCP Server**.

<Frame caption="Настройка сервера Exa и его участников">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Форма регистрации MCP-сервера Exa с именем, URL, участниками и настройками аутентификации" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  Откройте вкладку **Tools** и убедитесь, что инструменты Exa для search, получения контента и агентных исследований доступны.
</Check>

<div id="configure-the-exa-server">
  ## Настройка сервера Exa
</div>

Предзаполненный URL открывает доступ к стандартному набору инструментов Exa. Изменяйте его, только если нужно ограничить набор доступных инструментов или использовать собственный API-ключ.

<div id="choose-which-tools-are-available">
  ### Выбор доступных инструментов
</div>

Передайте список имён инструментов через запятую в query-параметре `tools`:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

URL можно указать в форме сервера или воспользоваться опцией **Apply using YAML**:

```yaml theme={null}
url: >-
  https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
name: exa
type: mcp-server/remote
description: Search Engine made for AIs by Exa
collaborators:
  - role_id: mcp-server-manager
    subject: user:you@your-company.com
```

<Tip>
  Список доступных названий инструментов приведён в [документации Exa MCP](/ru/docs/get-started/exa-mcp).
</Tip>

<div id="use-your-exa-api-key-to-bypass-the-free-rate-limit">
  ### Используйте свой Exa API-ключ, чтобы обойти бесплатный лимит запросов
</div>

Если вы достигли бесплатного лимита запросов, добавьте свой Exa API-ключ в URL сервера:

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Получите свой API-ключ Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте ключ в панели управления. Новым аккаунтам начисляются бесплатные кредиты.
</Card>

<div id="connect-an-mcp-client">
  ## Подключение MCP-клиента
</div>

Откройте вкладку **How To Use** на странице сервера Exa и выберите свой клиент. TrueFoundry сформирует эндпоинт для вашего тенанта и готовую к вставке настройку для Cursor, Claude Code, VS Code, Windsurf, Codex и других MCP-клиентов.

<Frame caption="Скопируйте настройку для своего MCP-клиента">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="Инструкции TrueFoundry по настройке MCP-сервера Exa для конкретного клиента" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

<div id="test-a-tool">
  ## Тестирование инструмента
</div>

Нажмите **Try** рядом с нужным инструментом Exa, введите входные данные и нажмите **Execute Tool**. Песочница покажет JSON-ответ, чтобы вы могли проверить инструмент до его использования в агенте.

<Frame caption="Запуск инструмента Exa в песочнице TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Тестирование инструмента Exa в песочнице инструментов TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

<div id="manage-and-monitor-tools">
  ## Управление инструментами и мониторинг
</div>

* Включайте и отключайте отдельные инструменты, чтобы контролировать, что могут вызывать MCP-клиенты
* Используйте **Tool Metrics** для анализа трафика, задержек и ошибок
* Экспортируйте трассировки вызовов в свою систему наблюдаемости через OpenTelemetry

<Frame caption="Управление инструментами Exa, доступными MCP-клиентам">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="Инструменты Exa, доступные на MCP-сервере TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

<div id="resources">
  ## Ресурсы
</div>

<Columns cols={3}>
  <Card title="Руководство по настройке TrueFoundry" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="Открыть руководство" arrow="true">
    Прочитайте руководство TrueFoundry по MCP-серверу Exa.
  </Card>

  <Card title="Документация Exa MCP" icon="search" href="/ru/docs/get-started/exa-mcp" cta="Открыть руководство" arrow="true">
    Изучите инструменты Exa, настройку и примеры использования.
  </Card>

  <Card title="Exa MCP Server" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Посмотреть исходный код" arrow="true">
    Посмотрите исходный код сервера и релизы на GitHub.
  </Card>
</Columns>