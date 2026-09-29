> ## Индекс документации
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжать изучение.

<div id="hermes-agent">
  # Hermes Agent
</div>

> Дайте Hermes Agent живой веб-поиск и содержимое страниц с помощью Exa.

[Hermes Agent](https://github.com/NousResearch/hermes-agent) поддерживает Exa как встроенный бэкенд для вызываемых моделью инструментов `web_search` и `web_extract`. Используйте Exa для обеих возможностей или сочетайте его с другим веб-провайдером Hermes.

<div id="connect-your-exa-account">
  ## Подключите свой аккаунт Exa
</div>

<Steps>
  <Step title="Получите Exa API key">
    <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте ключ в дашборде. Новым аккаунтам начисляются бесплатные credits.
    </Card>
  </Step>

  <Step title="Выберите Exa в Hermes">
    Запустите мастер настройки инструментов:

    ```bash theme={null}
    hermes tools
    ```

    Откройте **Web Search &amp; Extract**, выберите Exa, а затем вариант с аутентификацией по API key. По запросу введите свой Exa API key. Hermes хранит секреты в `~/.hermes/.env`, а выбранного провайдера — в `~/.hermes/config.yaml`.
  </Step>

  <Step title="Проверьте доступ к интернету">
    Запустите Hermes и попросите его выполнить поиск, а затем прочитать один из результатов:

    ```text theme={null}
    Search the web for the latest Exa product updates, then read the most relevant result.
    ```

    Hermes должен вызвать `web_search`, а затем `web_extract`, когда ему понадобится сама страница.
  </Step>
</Steps>

<div id="configure-manually">
  ## Настройка вручную
</div>

Добавьте свой ключ в файл окружения Hermes:

```bash ~/.hermes/.env theme={null}
EXA_API_KEY=your-exa-api-key
```

Затем выберите Exa для обеих веб-возможностей:

```yaml ~/.hermes/config.yaml theme={null}
web:
  search_backend: "exa"
  extract_backend: "exa"
```

Вместо этого можно использовать общий резервный вариант:

```yaml ~/.hermes/config.yaml theme={null}
web:
  backend: "exa"
```

Настройки отдельных capability имеют приоритет над `web.backend`. Это позволяет использовать Exa только для search или только для извлечения при сочетании нескольких провайдеров.

<div id="tools-hermes-gets">
  ## Инструменты, доступные Hermes
</div>

| Инструмент    | Поведение Exa                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `web_search`  | Выполняет поиск через Exa и возвращает ранжированные страницы с заголовками, URL и фрагментами текста. |
| `web_extract` | Получает читаемое содержимое с одного или нескольких URL через Exa Contents.                           |

Hermes обрезает длинные извлечённые страницы до заданного character budget и сохраняет полный текст на диске. Изменить значение по умолчанию можно через `web.extract_char_limit`, либо разрешить agent запрашивать больший `char_limit` для отдельного вызова.

<Note>
  Hermes может работать с Exa через пул бесплатных провайдеров без API key. Этот пул ограничен по частоте запросов и может переключаться между провайдерами. Задайте `EXA_API_KEY` и выберите вариант Exa с аутентификацией по API key, если нужно, чтобы запросы стабильно выполнялись от имени вашего аккаунта Exa.
</Note>

<div id="troubleshooting">
  ## Устранение неполадок
</div>

<AccordionGroup>
  <Accordion title="Hermes не выбирает Exa">
    Выполните `hermes tools` и явно выберите Exa. Если вы настраиваете файлы вручную, убедитесь, что для `web.search_backend`, `web.extract_backend` или `web.backend` задано значение `exa`.
  </Accordion>

  <Accordion title="Hermes сообщает, что EXA_API_KEY отсутствует">
    Добавьте ключ в `~/.hermes/.env` и перезапустите Hermes, чтобы он заново загрузил переменные окружения.
  </Accordion>

  <Accordion title="Поиск работает, но для извлечения контента используется другой провайдер">
    Hermes настраивает поиск и извлечение контента независимо друг от друга. Задайте значение `exa` и для `web.search_backend`, и для `web.extract_backend`.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ресурсы
</div>

<Columns cols={3}>
  <Card title="Веб-инструменты Hermes" icon="book-open" href="https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search" cta="Читать руководство" arrow="true">
    Изучите, как в Hermes работают выбор провайдера, кеширование и извлечение содержимого.
  </Card>

  <Card title="Exa Search" icon="search" href="/ru/docs/search/quickstart" cta="Читать руководство" arrow="true">
    Узнайте, как Exa выполняет поиск, фильтрует результаты и возвращает содержимое страниц.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/ru/docs/contents/quickstart" cta="Читать руководство" arrow="true">
    Разберитесь в API извлечения содержимого, лежащем в основе `web_extract`.
  </Card>
</Columns>