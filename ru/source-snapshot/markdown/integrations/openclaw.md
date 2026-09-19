> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжать изучение.

<div id="openclaw">
  # OpenClaw
</div>

> Дайте OpenClaw доступ к актуальному веб-поиску и содержимому страниц с помощью Exa.

[OpenClaw](https://openclaw.ai/) поддерживает Exa как встроенный провайдер `web_search`. После его выбора любой агент OpenClaw сможет использовать режимы поиска Exa, фильтры по датам и извлечение содержимого через встроенный веб-инструмент.

<div id="set-up-exa">
  ## Настройка Exa
</div>

<Steps>
  <Step title="Установите плагин Exa">
    ```bash theme={null}
    openclaw plugins install @openclaw/exa-plugin
    openclaw gateway restart
    ```
  </Step>

  <Step title="Получите Exa API-ключ">
    <Card title="Получите свой Exa API-ключ" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте ключ в панели управления. Новым аккаунтам начисляются бесплатные credits.
    </Card>
  </Step>

  <Step title="Сохраните ключ">
    При установке со шлюзом добавьте ключ в `~/.openclaw/.env`:

    ```bash ~/.openclaw/.env theme={null}
    EXA_API_KEY=your-exa-api-key
    ```

    После изменения переменных окружения перезапустите шлюз.
  </Step>

  <Step title="Выберите Exa для веб-поиска">
    Выполните:

    ```bash theme={null}
    openclaw configure --section web
    ```

    Выберите **Exa** в качестве провайдера веб-поиска. OpenClaw сохраняет выбранного провайдера в своих настройках и считывает учётные данные из `EXA_API_KEY`.
  </Step>
</Steps>

<div id="configure-manually">
  ## Настройка вручную
</div>

Вы можете выбрать Exa напрямую в настройках OpenClaw в формате JSON5:

```json5 theme={null}
{
  tools: {
    web: {
      search: {
        provider: "exa",
      },
    },
  },
}
```

Чтобы сохранить ключ в настройках, а не в переменных окружения шлюза:

```json5 theme={null}
{
  plugins: {
    entries: {
      exa: {
        config: {
          webSearch: {
            apiKey: "exa-...",
          },
        },
      },
    },
  },
}
```

<Note>
  Лучше используйте `EXA_API_KEY` или SecretRef из OpenClaw, чем записывать API key в файл настроек.
</Note>

<div id="what-agents-can-request">
  ## Что могут запрашивать агенты
</div>

OpenClaw предоставляет доступ к Exa через `web_search`.

| Параметр                     | Назначение                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `query`                      | Поисковый запрос к веб-страницам.                                                   |
| `count`                      | Количество результатов — до 100, с учётом ограничения выбранного типа поиска.       |
| `type`                       | Режим поиска Exa: `auto`, `neural`, `fast`, `instant`, `deep` и `deep-reasoning`.   |
| `freshness`                  | Ограничить результаты последним днём, неделей, месяцем или годом.                   |
| `date_after` / `date_before` | Ограничить результаты границами в формате `YYYY-MM-DD`.                             |
| `contents`                   | Возвращать вместе с каждым результатом полный текст, highlights или краткие сводки. |

Если `contents` не указан, OpenClaw по умолчанию запрашивает highlights. Агент может запросить контент в другом виде, если ему нужны страницы целиком или сводки:

```javascript theme={null}
await web_search({
  query: "transformer architecture explained",
  type: "neural",
  contents: {
    text: { maxCharacters: 5000 },
    highlights: { numSentences: 3 },
    summary: true,
  },
});
```

По умолчанию OpenClaw кэширует результаты веб-поиска на 15 минут. Измените значение `tools.web.search.cacheTtlMinutes` или установите его в `0`, если каждый запрос должен возвращать свежие данные.

<div id="troubleshooting">
  ## Устранение неполадок
</div>

<AccordionGroup>
  <Accordion title="OpenClaw не показывает Exa в списке провайдеров">
    Установите `@openclaw/exa-plugin`, перезапустите шлюз и снова выполните `openclaw configure --section web`.
  </Accordion>

  <Accordion title="OpenClaw сообщает об отсутствии ключа Exa">
    Убедитесь, что `EXA_API_KEY` доступен процессу шлюза, а не только вашей интерактивной оболочке. Если шлюз установлен локально, поместите ключ в `~/.openclaw/.env` и перезапустите шлюз.
  </Accordion>

  <Accordion title="Результаты поиска выглядят устаревшими">
    OpenClaw кэширует результаты независимо от Exa. Уменьшите значение `tools.web.search.cacheTtlMinutes` или задайте `0`, а затем используйте параметры актуальности контента Exa при запросе содержимого страниц.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ресурсы
</div>

<Columns cols={3}>
  <Card title="Провайдер Exa в OpenClaw" icon="book-open" href="https://docs.openclaw.ai/tools/exa-search" cta="Читать руководство" arrow="true">
    Ознакомьтесь с текущей настройкой плагина и параметрами инструмента.
  </Card>

  <Card title="Exa Search" icon="search" href="/ru/docs/search/quickstart" cta="Читать руководство" arrow="true">
    Сравните режимы поиска Exa и форматы ответов.
  </Card>

  <Card title="Актуальность контента" icon="clock" href="/ru/docs/contents/quickstart#content-freshness" cta="Читать руководство" arrow="true">
    Управляйте получением содержимого страниц из индекса и в реальном времени.
  </Card>
</Columns>