> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение.

<div id="agent-skills">
  # Agent Skills
</div>

> Установка навыков Exa в Claude Code, Codex и других кодинг-агентах.

Навыки Exa учат кодинг-агентов выполнять search, получать контент и создавать приложения на базе API Exa. Найти их можно в открытом репозитории [exa-labs/agent-skills](https://github.com/exa-labs/agent-skills).

Каждый навык состоит из markdown-файлов, соответствующих открытому стандарту [Agent Skills](https://agentskills.io), поэтому одни и те же файлы можно установить в любой совместимый агент.

<div id="install">
  ## Установка
</div>

Установите все навыки Exa разом:

```bash theme={null}
npx skills add exa-labs/agent-skills
```

<Card title="Получите Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в дашборде. Новым аккаунтам начисляются бесплатные credits.
</Card>

<Note>
  Задайте свой key в переменной `EXA_API_KEY` в окружении агента.
</Note>

Либо откройте страницу нужного навыка ниже и скопируйте её установочный промпт в своего агента. Промпт установит этот навык и проверит ваш API key, не выводя его на экран.

<div id="skills">
  ## Навыки
</div>

Страница каждого навыка содержит краткое описание в одну строку, готовый к копированию промпт для настройки и ссылку на исходный файл `SKILL.md`.

<Columns cols={3}>
  <Card title="Создавайте с Exa" icon="rocket" href="/ru/docs/get-started/agent-skills/build-with-exa" cta="Открыть навык" arrow="true">
    Создавайте приложения и агентов на полноценной API-платформе Exa.
  </Card>

  <Card title="Exa Search" icon="search" href="/ru/docs/get-started/agent-skills/exa-search" cta="Открыть навык" arrow="true">
    Вызывайте Exa Search напрямую через cURL или обычные HTTP-запросы.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/ru/docs/get-started/agent-skills/exa-contents" cta="Открыть навык" arrow="true">
    Вызывайте Exa Contents напрямую через cURL или обычные HTTP-запросы.
  </Card>
</Columns>

<div id="related">
  ## Связанные материалы
</div>

<Columns cols={2}>
  <Card title="Репозиторий навыков" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Посмотреть исходники" arrow="true">
    Исходный код всех навыков, включая сами файлы `SKILL.md`.
  </Card>

  <Card title="Exa MCP" icon="plug" href="/ru/docs/get-started/exa-mcp" cta="Открыть руководство" arrow="true">
    Подключите Claude, Cursor, VS Code и другие клиенты к Exa по MCP.
  </Card>
</Columns>