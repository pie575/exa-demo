> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

<div id="ai-sdk-by-vercel">
  # AI SDK by Vercel
</div>

> Добавьте веб-поиск Exa в приложения на AI SDK с помощью пакета @exalabs/ai-sdk.

Используйте пакет `@exalabs/ai-sdk`, чтобы добавить веб-поиск Exa в приложения, созданные на AI SDK by Vercel. Вы указываете Exa API key, а инструмент `webSearch()` берёт на себя поисковые запросы вашей модели.

<div id="install">
  ## Установка
</div>

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

<div id="quick-start">
  ## Быстрый старт
</div>

```typescript quickstart.ts theme={null}
import { generateText, stepCountIs } from 'ai';
import { webSearch } from '@exalabs/ai-sdk';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Tell me the latest developments in AI',
  system: 'Only use web search once per turn. Answer based on the information you have.',
  tools: {
    webSearch: webSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в панели управления. Новые аккаунты получают бесплатные кредиты.
</Card>

<Info>
  Перед запуском примера укажите свой key в переменной окружения `EXA_API_KEY`. Пакет считывает её автоматически.
</Info>

<div id="defaults">
  ## Значения по умолчанию
</div>

`webSearch()` использует следующие значения по умолчанию:

* `type`: `auto`
* `numResults`: `10`
* `contents.text`: `3000` символов на результат
* `maxAgeHours`: значение по умолчанию для отката к кешу; задайте этот параметр, если нужны более строгие требования к свежести данных

<div id="configure-search">
  ## Настройка поиска
</div>

С помощью приведённых ниже параметров можно настроить поиск и извлечение контента:

```typescript configuration.ts theme={null}
const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Find the top AI companies in Europe founded after 2018',
  tools: {
    webSearch: webSearch({
      type: 'auto',
      numResults: 6,
      category: 'company',
      contents: {
        text: { maxCharacters: 1000 },
        maxAgeHours: 1,
        summary: true,
      },
    }),
  },
  stopWhen: stepCountIs(5),
});

console.log(text);
```

<div id="search-options">
  ### Параметры поиска
</div>

| Параметр                                  | Описание                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `type`                                    | Режим поиска: `auto`, `fast`, `instant`, `deep-lite`, `deep` или `deep-reasoning`.                      |
| `category`                                | Категория контента: `company`, `publication`, `news`, `personal site`, `people` или `financial report`. |
| `numResults`                              | Количество возвращаемых результатов.                                                                    |
| `includeDomains` / `excludeDomains`       | Включение или исключение определённых доменов.                                                          |
| `startPublishedDate` / `endPublishedDate` | Фильтрация результатов по дате публикации в формате ISO 8601.                                           |
| `includeText` / `excludeText`             | Обязательное наличие или исключение текста в результатах.                                               |
| `userLocation`                            | Двухбуквенный код страны для поиска с учётом местоположения.                                            |

<div id="content-options">
  ### Параметры контента
</div>

| Параметр                                               | Описание                                                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `contents.text`                                        | Возвращает извлечённый текст. Поддерживает `maxCharacters` и `includeHtmlTags`.                     |
| `contents.summary`                                     | Возвращает сгенерированное ИИ краткое содержание (summary). Поддерживает `query`.                   |
| `contents.maxAgeHours`                                 | Использовать кешированный контент, только если он не старше указанного возраста; иначе — livecrawl. |
| `contents.livecrawlTimeout`                            | Задаёт таймаут livecrawl.                                                                           |
| `contents.subpages` / `contents.subpageTarget`         | Обходит подстраницы и при необходимости выбирает конкретную подстраницу.                            |
| `contents.extras.links` / `contents.extras.imageLinks` | Возвращает ссылки или ссылки на изображения из результатов.                                         |

<div id="typescript-support">
  ## Поддержка TypeScript
</div>

Пакет содержит типы TypeScript:

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

<div id="related-pages">
  ## Связанные страницы
</div>

<Columns cols={2}>
  <Card title="Использование Vercel AI Gateway" icon="cloud" href="/ru/docs/integrations/vercel/ai-gateway" cta="Открыть руководство" arrow="true">
    Используйте веб-поиск Exa без Exa API key через Vercel AI Gateway.
  </Card>

  <Card title="Обзор пакета AI SDK" icon="git-branch" href="https://github.com/exa-labs/ai-sdk" cta="Посмотреть исходный код" arrow="true">
    Посмотрите исходный код и сведения о пакете на GitHub.
  </Card>
</Columns>

Пакет также доступен на [npm](https://www.npmjs.com/package/@exalabs/ai-sdk), а также можно ознакомиться с [руководством по веб-поиску в Vercel AI SDK](https://ai-sdk.dev/cookbook/node/web-search-agent#exa).