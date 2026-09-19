> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

<div id="elevenlabs">
  # ElevenLabs
</div>

> Добавьте веб-поиск Exa в голосовые агенты ElevenLabs.

***

Голосовые агенты ElevenLabs могут искать информацию в вебе прямо по ходу разговора, используя Exa в качестве **вебхук-инструмента**. Когда агент решает, что ему нужны актуальные данные, ElevenLabs отправляет HTTP POST напрямую на эндпоинт Exa `/search` — никакого сервера или промежуточного слоя с вашей стороны не требуется.

Подключить Exa к ElevenLabs можно двумя способами:

| Подход                                | Настройка                                 | Гибкость                                                               |
| ------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| **Вебхук-инструмент** (рекомендуется) | Настройка через API или панель управления | Полный контроль над параметрами поиска, параметрами контента и заголовками |
| **Встроенная интеграция Exa** (альфа) | Один клик в панели управления ElevenLabs  | Проще, но с ограниченными возможностями настройки                      |

В этом руководстве описан подход с вебхук-инструментом, который даёт полный контроль над тем, как вызывается Exa. Интеграцию также можно настроить через [панель управления ElevenLabs](https://elevenlabs.io/app/conversational-ai).

<div id="how-it-works">
  ## Как это работает
</div>

1. Пользователь обращается к голосовому agent
2. LLM решает вызвать `web_search`, опираясь на описание инструмента
3. ElevenLabs отправляет POST-запрос на `https://api.exa.ai/search` с заданными вами заголовками и телом
4. Параметры, определённые LLM (поисковый `query`), объединяются с вашими фиксированными значениями (`type`, `numResults`, `contents`)
5. Результаты Exa возвращаются в LLM, которая отвечает в диалоговой форме

Ни сервера, ни callback URL, ни слушателя. ElevenLabs сам выступает HTTP-клиентом и обращается к Exa напрямую. Тайм-аут вызова инструмента — 20 секунд.

<div id="prerequisites">
  ## Предварительные требования
</div>

* [Exa API key](https://dashboard.exa.ai/api-keys)
* [ElevenLabs API key](https://elevenlabs.io/app/settings/api-keys)

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в панели управления. Новым аккаунтам начисляются бесплатные credits.
</Card>

<div id="get-started">
  ## Начало работы
</div>

<Steps>
  <Step title="Создайте webhook-инструмент">
    С помощью [Create Tool API](https://elevenlabs.io/docs/api-reference/tools/create) от ElevenLabs зарегистрируйте webhook-инструмент, который обращается к эндпоинту search Exa.

    Ключевая идея: свойства с `constant_value` фиксированы (отправляются при каждом запросе), а свойства с `description` определяются LLM во время выполнения.

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/tools" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "tool_config": {
          "type": "webhook",
          "name": "web_search",
          "description": "Search the web using Exa. Use this when the user asks anything that needs current or factual information.",
          "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
              "x-api-key": "YOUR_EXA_API_KEY",
              "Content-Type": "application/json",
              "x-exa-integration": "elevenlabs"
            },
            "request_body_schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "description": "Natural language search query. Be specific."
                },
                "type": {
                  "type": "string",
                  "constant_value": "instant"
                },
                "numResults": {
                  "type": "integer",
                  "constant_value": 5
                },
                "contents": {
                  "type": "object",
                  "properties": {
                    "highlights": {
                      "type": "boolean",
                      "constant_value": true
                    }
                  }
                }
              },
              "required": ["query"]
            }
          }
        }
      }'
    ```

    Так создаётся инструмент, в котором:

    * `query` — LLM заполняет это поле исходя из контекста разговора
    * `type: "instant"` — используется самый быстрый режим search у Exa (~150 мс)
    * `numResults: 5` — возвращает 5 результатов на каждый search
    * `contents.highlights: true` — возвращает экономные по токенам highlights-фрагменты (оптимально для низкой задержки в голосовых сценариях)

    Сохраните возвращённый `id` — он понадобится, чтобы привязать инструмент к agent.

    <Note>
      Если agent у вас уже есть, шаг 2 можно пропустить и добавить инструмент к существующему agent в панели ElevenLabs в разделе **Agent &gt; Tools** или через [Update Agent API](https://elevenlabs.io/docs/api-reference/agents/update). Пока инструмент не привязан к agent, он ничего не делает.
    </Note>
  </Step>

  <Step title="Создайте agent с этим инструментом">
    Создайте разговорного agent и привяжите к нему webhook-инструмент по его ID.

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/agents/create" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Exa Search Assistant",
        "conversation_config": {
          "agent": {
            "prompt": {
              "prompt": "You are a helpful voice assistant with real-time web search powered by Exa. When users ask questions that need current information, use the web_search tool.\n\nGuidelines:\n- Search proactively for time-sensitive or factual questions.\n- Summarize results conversationally — do not read URLs aloud.\n- Cite sources naturally.\n- Keep responses concise — this is voice.",
              "tool_ids": ["YOUR_TOOL_ID"]
            },
            "first_message": "Hey! I can search the web for you in real-time. What would you like to know?"
          }
        }
      }'
    ```

    В ответе придёт `agent_id`. Откройте agent в панели ElevenLabs, чтобы протестировать его:

    ```text theme={null}
    https://elevenlabs.io/app/conversational-ai/agents/YOUR_AGENT_ID
    ```
  </Step>

  <Step title="Встройте виджет">
    Добавьте agent на любую веб-страницу двумя строками HTML:

    ```html html theme={null}
    <elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
    ```
  </Step>
</Steps>

<div id="full-python-example">
  ## Полный пример на Python
</div>

Этот скрипт за один запуск создаёт и вебхук-инструмент, и agent:

```python python theme={null}
import os
import requests

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]
EXA_API_KEY = os.environ["EXA_API_KEY"]
BASE = "https://api.elevenlabs.io/v1/convai"
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

# 1. Создаём инструмент-вебхук
tool_resp = requests.post(f"{BASE}/tools", headers=HEADERS, json={
    "tool_config": {
        "type": "webhook",
        "name": "web_search",
        "description": (
            "Search the web using Exa. Use this when the user asks anything "
            "that needs current or factual information."
        ),
        "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
                "x-api-key": EXA_API_KEY,
                "Content-Type": "application/json",
                "x-exa-integration": "elevenlabs",
            },
            "request_body_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Natural language search query. Be specific.",
                    },
                    "type": {"type": "string", "constant_value": "instant"},
                    "numResults": {"type": "integer", "constant_value": 5},
                    "contents": {
                        "type": "object",
                        "properties": {
                            "highlights": {
                                "type": "boolean",
                                "constant_value": True,
                            }
                        },
                    },
                },
                "required": ["query"],
            },
        },
    }
})
tool_resp.raise_for_status()
tool_id = tool_resp.json()["id"]
print(f"Tool created: {tool_id}")

# 2. Создаём агента
agent_resp = requests.post(f"{BASE}/agents/create", headers=HEADERS, json={
    "name": "Exa Search Assistant",
    "conversation_config": {
        "agent": {
            "prompt": {
                "prompt": (
                    "You are a helpful voice assistant with real-time web search "
                    "powered by Exa. When users ask questions that need current "
                    "information, use the web_search tool.\n\n"
                    "Guidelines:\n"
                    "- Search proactively for time-sensitive or factual questions.\n"
                    "- Summarize results conversationally — do not read URLs aloud.\n"
                    "- Cite sources naturally.\n"
                    "- Keep responses concise — this is voice."
                ),
                "tool_ids": [tool_id],
            },
            "first_message": "Hey! I can search the web for you. What would you like to know?",
        }
    },
})
agent_resp.raise_for_status()
agent_id = agent_resp.json()["agent_id"]
print(f"Agent created: {agent_id}")
print(f"Dashboard: https://elevenlabs.io/app/conversational-ai/agents/{agent_id}")
```

Запустите:

```bash bash theme={null}
export ELEVENLABS_API_KEY="your-key"
export EXA_API_KEY="your-key"
python elevenlabs_exa_webhook.py
```

<div id="customizing-search-parameters">
  ## Настройка параметров поиска
</div>

Схема тела запроса вебхук-инструмента напрямую соответствует [Search API от Exa](/ru/docs/reference/search). Ниже приведены типичные настройки:

<div id="search-type">
  ### Тип поиска
</div>

Управляйте балансом между скоростью и качеством с помощью константы `type`:

| Тип       | Задержка | Лучше всего подходит для          |
| --------- | -------- | --------------------------------- |
| `instant` | ~150 мс  | Голосовые диалоги (рекомендуется) |
| `auto`    | ~1 с     | Общее использование               |

Для голосовых агентов начните с `instant`. Используйте `auto`, если хотите, чтобы Exa сама выбирала оптимальный режим поиска для каждого запроса.

<div id="content-options">
  ### Параметры контента
</div>

Выберите, в каком виде возвращаются результаты, с помощью объекта `contents`:

```json json theme={null}
{
  "contents": {
    "type": "object",
    "properties": {
      "highlights": {
        "type": "boolean",
        "constant_value": true
      }
    }
  }
}
```

* **`highlights`** — экономные по токенам выдержки. Используйте, когда нужны релевантные фрагменты без перегрузки контекста LLM. Передайте `true`, чтобы получить вариант наилучшего качества по умолчанию.
* **`text`** — полный markdown страницы. Используйте, когда agent&#39;у требуется всё содержимое страницы. Задайте `maxCharacters`, чтобы ограничить длину.
* **`summary`** — сгенерированное LLM краткое изложение каждой страницы. Задержка выше, но вы получаете обобщённое содержимое.

Для голосовых agent&#39;ов рекомендуемое значение по умолчанию — `highlights: true`: оно сочетает релевантность и скорость ответа.

<div id="filtering-results">
  ### Фильтрация результатов
</div>

Добавьте фильтры по доменам или датам в виде констант:

```json json theme={null}
{
  "includeDomains": {
    "type": "array",
    "constant_value": ["reuters.com", "apnews.com", "bbc.com"]
  }
}
```

```json json theme={null}
{
  "startPublishedDate": {
    "type": "string",
    "constant_value": "2025-01-01T00:00:00.000Z"
  }
}
```

<div id="number-of-results">
  ### Количество результатов
</div>

Настраивайте `numResults` под свой сценарий использования. Для голосовых сценариев 3–5 результатов обеспечат быстрые ответы. Для исследовательских агентов 10 и более результатов дадут более широкий охват.

<div id="schema-reference">
  ## Справочник по схеме
</div>

Вебхук-инструменты ElevenLabs используют JSON-схему со следующими типами свойств:

* **`constant_value`** — фиксированное значение, отправляемое с каждым запросом. LLM его не видит и не изменяет. Подходит для строк, чисел и булевых значений.
* **`description`** — LLM определяет значение во время выполнения на основе этого описания. Используйте для динамических параметров, таких как `query`.
* **Вложенные объекты** — используйте `type: "object"` вместе с `properties`, чтобы строить вложенные структуры, например `contents.highlights`.

У каждого параметра в панели управления есть переключатель режима — **Fixed** или **LLM**:

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/elevenlabs/parameters.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=618ca64cac86308c571a8268f48342a5" alt="Настройка параметров вебхук-инструмента ElevenLabs с переключателями режимов Fixed и LLM" width="1692" height="898" data-path="images/integrations/elevenlabs/parameters.png" />
</Frame>

Параметры в режиме **Fixed** (в API помечаются как `constant_value`) отправляются без изменений с каждым запросом. Параметры в режиме **LLM** (помечаются как `description`) позволяют модели выбрать значение во время выполнения. Оставляйте в режиме Fixed как можно больше параметров: каждый параметр, определяемый LLM, добавляет ещё один шаг вызова инструмента и увеличивает задержку ответа.

Полную схему вебхук-инструмента ElevenLabs см. в [документации ElevenLabs по серверным инструментам](https://elevenlabs.io/docs/conversational-ai/customization/tools/server-tools).

<div id="built-in-exa-integration-alpha">
  ## Встроенная интеграция с Exa (альфа)
</div>

ElevenLabs также предлагает встроенную интеграцию с Exa, доступную в панели управления agent в разделе **Tools &gt; Integrations**. Настроить её проще, но параметры поиска настраиваются не так гибко, как в варианте с вебхук-инструментом.

Если нужен полный контроль над типом поиска, параметрами контента и фильтрацией, рекомендуем описанный выше подход с вебхук-инструментом.