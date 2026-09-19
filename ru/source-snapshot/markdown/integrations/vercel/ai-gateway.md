> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы увидеть все доступные страницы, прежде чем продолжить изучение.

<div id="vercel-ai-gateway">
  # Vercel AI Gateway
</div>

> Используйте веб-поиск Exa через Vercel AI Gateway с помощью AI SDK.

Используйте веб-поиск Exa через [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) с помощью `gateway.tools.exaSearch()` из пакета `ai`. API key Exa при этом не нужен — Vercel тарифицирует такие запросы через AI Gateway. Полный справочник см. в [документации Vercel по веб-поиску](https://vercel.com/docs/ai-gateway/models-and-providers/web-search).

<div id="install">
  ## Установка
</div>

Установите AI SDK 5 или новее:

```bash install.sh theme={null}
npm install ai
```

<div id="authentication">
  ## Аутентификация
</div>

<Info>
  Для работы с AI Gateway требуется API key или OIDC-токен. Создайте `AI_GATEWAY_API_KEY` в панели управления Vercel в разделе **AI Gateway &gt; API Keys**, а затем добавьте его в переменные окружения.
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

При развёртывании приложения на Vercel вместо него можно использовать автоматически доступный `VERCEL_OIDC_TOKEN`. См. [документацию Vercel по аутентификации и BYOK](https://vercel.com/docs/ai-gateway/authentication-and-byok).

<div id="quick-start">
  ## Быстрый старт
</div>

Exa search можно использовать с любой поддерживаемой моделью:

```typescript quickstart.ts theme={null}
import { gateway, generateText, stepCountIs } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<div id="streaming">
  ## Потоковая передача
</div>

Используйте `streamText`, чтобы обрабатывать генерируемый текст и события инструмента search по мере их поступления:

```typescript stream.ts theme={null}
import { gateway, streamText } from 'ai';

const result = streamText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
});

for await (const part of result.fullStream) {
  if (part.type === 'text-delta') {
    process.stdout.write(part.text);
  } else if (part.type === 'tool-call') {
    console.log('Tool call:', part.toolName);
  } else if (part.type === 'tool-result') {
    console.log('Search results received');
  }
}
```

В обработчике маршрута Next.js верните поток клиенту с помощью `return result.toUIMessageStreamResponse()`.

<div id="configuration">
  ## Настройка
</div>

Передайте параметры в `gateway.tools.exaSearch()`, чтобы настроить поиск:

```typescript configuration.ts theme={null}
tools: {
  exa_search: gateway.tools.exaSearch({
    type: 'fast',
    numResults: 5,
    category: 'news',
    includeDomains: ['reuters.com', 'bbc.com', 'nytimes.com'],
    contents: {
      highlights: true,
      maxAgeHours: 24,
    },
  }),
},
```

Доступны следующие параметры:

| Параметр                                               | Описание                                                             |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| `type`                                                 | Режим поиска: `auto` (по умолчанию), `fast` или `instant`.           |
| `numResults`                                           | Количество возвращаемых результатов, от 1 до 100. По умолчанию — 10. |
| `category`                                             | Категория контента.                                                  |
| `includeDomains` / `excludeDomains`                    | Включение или исключение определённых доменов.                       |
| `startPublishedDate` / `endPublishedDate`              | Фильтрация результатов по дате публикации.                           |
| `userLocation`                                         | Двухбуквенный код страны по ISO для поиска с учётом местоположения.  |
| `contents.text`                                        | Возвращать извлечённый текст страницы.                               |
| `contents.highlights`                                  | Возвращать релевантные highlights страницы.                          |
| `contents.maxAgeHours`                                 | Максимальный возраст кешированного контента.                         |
| `contents.livecrawlTimeout`                            | Таймаут livecrawl.                                                   |
| `contents.subpages` / `contents.subpageTarget`         | Обход подстраниц и, при необходимости, указание целевой подстраницы. |
| `contents.extras.links` / `contents.extras.imageLinks` | Возвращать ссылки или ссылки на изображения из результатов.          |

Полный список параметров и описание их поведения см. в [справочнике Vercel по веб-поиску Exa](https://vercel.com/docs/ai-gateway/models-and-providers/web-search).

<div id="vercel-eve-agents">
  ## Vercel eve agents
</div>

Агенты, созданные с помощью [eve](https://eve.dev), получают встроенный инструмент `web_search`, и модели AI Gateway по умолчанию выполняют его через Exa — без дополнительной настройки и без Exa API key. Чтобы явно зафиксировать провайдера, экспортируйте его из `agent/tools/web_search.ts`:

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

Модели, вызываемые напрямую через провайдера, а не через AI Gateway, сохраняют свой встроенный веб-поиск. Полный набор инструментов см. в [документации по harness](https://eve.dev/docs/concepts/default-harness#built-in-tools) от eve.

<div id="pricing">
  ## Цены
</div>

<Tip>
  Веб-поиск Exa **бесплатен до 31 августа** в AI Gateway и eve — вы можете начать разрабатывать с ним уже сегодня без каких-либо затрат.
</Tip>

После этого Vercel будет тарифицировать запросы через AI Gateway по расценкам, указанным в [документации Vercel по веб-поиску](https://vercel.com/docs/ai-gateway/models-and-providers/web-search).

<Note>
  Сейчас интеграция поддерживает стандартные режимы поиска Exa и параметры извлечения контента. Режимы глубокого синтеза и генерируемые сводки пока недоступны.
</Note>

<Columns cols={2}>
  <Card title="Используйте Exa AI SDK" icon="code" href="/ru/docs/integrations/vercel/ai-sdk" cta="Открыть руководство" arrow="true">
    Обращайтесь к Exa напрямую с помощью Exa API key через `@exalabs/ai-sdk`.
  </Card>

  <Card title="Изучите справочник Vercel по веб-поиску" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="Открыть справочник" arrow="true">
    Ознакомьтесь с полным справочником по настройке и ценам AI Gateway.
  </Card>
</Columns>