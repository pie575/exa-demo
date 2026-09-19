> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем изучать документацию дальше.

<div id="pydantic-ai">
  # Pydantic AI
</div>

> Дайте агенту Pydantic AI инструменты веб-исследования на базе Exa Search API.

<Card title="Быстрый старт для кодинг-агента" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Впервые используете Exa? Начните работу меньше чем за минуту.
</Card>

***

[Pydantic AI](https://pydantic.dev/docs/ai/) — это Python-фреймворк для агентов от команды, создавшей Pydantic. Его [harness](https://pydantic.dev/docs/ai/harness/exa-search/) поставляется с официальной интеграцией с Exa в виде двух компонуемых возможностей:

* **`ExaSearch`**: инструменты веб-исследования на базе Exa Search API: `web_search` (лучшие результаты с наиболее релевантными фрагментами, а также опциональная синтезированная текстовая сводка), `get_page` (получение полной страницы по конкретному URL) и подключаемый по желанию `deep_search` (синтезированный ответ со ссылками на источники за один вызов).
* **`ExaAgent`**: делегирует длительные исследования [Exa Agent API](/ru/docs/agent/quickstart) в виде отложенных вызовов инструментов.

Возможность объединяет в себе инструменты, лимиты вывода для каждого из них и краткие рекомендации по исследованию в системном промпте — так что вам не придётся самим связывать search API с загрузчиком страниц и подсказывать агенту, как вести исследование методично.

<Info> Полную справку от Pydantic смотрите [здесь](https://pydantic.dev/docs/ai/harness/exa-search/). </Info>

<Card title="Прочитайте статью Pydantic о создании исследовательского агента с Exa" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/pydantic-ai/logo.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=aee1bf45859bf6a3debf4177d0aefb3f" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/integrations/pydantic-ai/logo.svg">
  Разбор трёх готовых к копированию исследовательских агентов, построенных на Pydantic AI и Exa.
</Card>

***

<div id="get-started">
  ## Начало работы
</div>

<Steps>
  <Step title="Требования и установка">
    Установите harness с дополнением Exa и задайте переменную окружения `EXA_API_KEY`.

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте key в панели управления. Новым аккаунтам начисляются бесплатные кредиты.
    </Card>
  </Step>

  <Step title="Добавьте ExaSearch в агента">
    Передайте `ExaSearch` в `Agent` через параметр `capabilities`. По умолчанию аутентификация выполняется с помощью `EXA_API_KEY`.

    ```Python Python theme={null}
    from pydantic_ai import Agent
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch()])

    result = agent.run_sync('What changed in the latest stable Python release?')
    print(result.output)
    ```

    `ExaSearch` добавляет агенту два инструмента:

    | Инструмент   | Назначение                                                                                                                         |
    | ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
    | `web_search` | Выполняет search по вебу и возвращает первые `num_results` страниц — каждую с заголовком, URL и наиболее релевантными фрагментами. |
    | `get_page`   | Получает полный текст одного конкретного URL — перспективного результата `web_search` или URL, указанного пользователем.           |

    `web_search` возвращает короткие фрагменты (Exa highlights), а не полный текст страницы, поэтому обзор нескольких источников обходится дёшево; после этого агент читает выбранную страницу через `get_page`. Если URL или вопрос не дал контента, сработал лимит запросов или произошёл временный сбой, модель получает `ModelRetry` и может продолжить выполнение; ошибки аутентификации (401/403) передаются дальше как ошибки настройки.
  </Step>

  <Step title="Включите deep search (необязательно)">
    `deep_search` запускает многошаговый [deep search](/ru/docs/search/quickstart) от Exa (`type='deep'`): Exa разворачивает вопрос в несколько запросов, выполняет поиск и за один вызов инструмента возвращает ответ, подкреплённый цитатами. Это требует больше времени и глубины поиска, чем `web_search`, поэтому по умолчанию отключено. Включите явно:

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    Когда эта возможность включена, инструкции capability предписывают модели использовать `deep_search` как escalation после `web_search`, а не вместо него.
  </Step>
</Steps>

***

<div id="configuration">
  ## Настройка
</div>

Все поля `ExaSearch` со значениями по умолчанию:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # результатов на один вызов web_search (от 1 до 100)
    max_text_chars=10_000,     # лимит текста get_page в символах (от 1 до 10 000)
    text_summary=False,        # web_search также возвращает сгенерированную текстовую сводку
    include_deep_search=False, # также предоставить инструмент deep_search
    include_domains=[],        # искать только по этим доменам (белый список)
    exclude_domains=[],        # никогда не искать по этим доменам (чёрный список)
    guidance=None,             # None = инструкции по умолчанию, '' = без инструкций, str = свои
    client=None,               # ExaClient -- при None создаётся exa_py.AsyncExa из EXA_API_KEY
)
```

`include_domains` и `exclude_domains` применяются к `web_search` и `deep_search` и являются взаимоисключающими. Лимиты вне допустимого диапазона, а также одновременное указание обоих списков доменов приводят к ошибке при создании объекта.

<div id="text-summary">
  ### Текстовая сводка
</div>

Задайте `text_summary`, чтобы каждый вызов `web_search` дополнительно запрашивал сгенерированную текстовую сводку результатов. Передайте `True`, чтобы получить сводку без ограничений, либо строку с описанием нужного формата:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

Структура возвращаемого инструментом результата не меняется: если Exa возвращает summary, он добавляется в начало отдельной строкой `Summary:`.

<div id="structured-citations">
  ### Структурированные ссылки на источники
</div>

Каждый инструмент возвращает `ToolReturn`: в `return_value` находится читаемый текст, который видит модель (включая блоки `Sources:`), а в `metadata` — источники в виде структурированных записей `ExaSource` (`{'url': ..., 'title': ...}`) по ключу `'sources'`. Метаданные никогда не передаются модели, поэтому для вывода ссылок на источники не нужно разбирать текст:

```Python Python theme={null}
from pydantic_ai.messages import ModelRequest, ToolReturnPart

for message in result.all_messages():
    if isinstance(message, ModelRequest):
        for part in message.parts:
            if isinstance(part, ToolReturnPart) and part.metadata is not None:
                for source in part.metadata.get('sources', []):
                    print(source['url'], source['title'])
```

<div id="custom-client">
  ### Пользовательский клиент
</div>

Клиент по умолчанию — `exa_py.AsyncExa`, который настраивается через переменную `EXA_API_KEY`. Передайте любой объект, соответствующий протоколу `ExaClient`, чтобы явно задать параметры аутентификации или базовый URL либо подставить заглушку в тестах:

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

<div id="exa-agent-runs">
  ## Запуски Exa Agent
</div>

[Exa Agent API](/ru/docs/agent/quickstart) асинхронно выполняет исследовательские задачи с открытой постановкой. Возможность `ExaAgent` проецирует этот жизненный цикл на [отложенные вызовы инструментов](https://pydantic.dev/docs/ai/deferred-tools/) в Pydantic AI: инструмент `exa_agent` создаёт запуск и откладывает выполнение, передавая ID запуска Exa в метаданных отложенного вызова.

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

По умолчанию (`execution='inline'`) возможность самостоятельно обрабатывает свои отложенные вызовы в рамках запуска агента, опрашивая запуск Exa до его завершения, поэтому инструмент ведёт себя как обычный (пусть и медленный) инструмент. При `execution='external'` вызовы передаются наверх в виде результата `DeferredToolRequests`, и хост-приложение обрабатывает их отдельно.

Все поля `ExaAgent` со значениями по умолчанию:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None = значение API по умолчанию
    execution='inline',   # 'inline' опрашивает до завершения; 'external' пробрасывает DeferredToolRequests
    output_schema=None,   # класс BaseModel или схема в виде словаря для структурированного вывода
    system_prompt=None,   # передаётся в запуск Exa Agent
    poll_interval=1000,   # мс между опросами при разрешении в режиме inline
    timeout_ms=3_600_000, # мс ожидания запуска при разрешении в режиме inline
    guidance=None,        # None = инструкции по умолчанию, '' = без инструкций, str = свои
    runs=None,            # ExaAgentRuns -- None создаёт AsyncExa().agent.runs из EXA_API_KEY
)
```

***

<div id="agent-spec-yamljson">
  ## Agent spec (YAML/JSON)
</div>

Обе возможности работают с [agent spec](https://pydantic.dev/docs/ai/agents/#agent-spec) из Pydantic AI, так что их можно описать в конфигурационном файле, а не в коде на Python:

```yaml agent.yaml theme={null}
model: anthropic:claude-sonnet-4-6
capabilities:
  - ExaSearch:
      num_results: 3
      include_deep_search: true
  - ExaAgent:
      effort: low
```

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent, ExaSearch

agent = Agent.from_file('agent.yaml', custom_capability_types=[ExaSearch, ExaAgent])
```

Передайте `custom_capability_types`, чтобы загрузчик спецификации знал, как создавать экземпляры возможностей. Экземпляры, загруженные из спецификации, всегда создают клиент по умолчанию на основе `EXA_API_KEY`.

***

<div id="next">
  ## Далее
</div>

* [**Search API**](/ru/docs/search/quickstart) — семантический поиск с highlights, краткими сводками и deep search
* [**Agent API**](/ru/docs/agent/quickstart) — асинхронные исследовательские задачи со свободной постановкой
* [**Настройка MCP**](/ru/docs/get-started/exa-mcp) — размещённый MCP-сервер Exa
* [**SDK**](/ru/docs/sdks/quickstart) — документация по SDK для Python и JavaScript