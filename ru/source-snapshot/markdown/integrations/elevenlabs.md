> ## Индекс документации {#documentation-index}
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

# ElevenLabs {#elevenlabs}

> Добавьте Exa web search в голосовые agent&#39;ы ElevenLabs.

***

Голосовые agent&#39;ы ElevenLabs могут искать информацию в интернете прямо во время разговора, используя Exa в качестве **вебхук-инструмента**. Когда agent решает, что ему нужны актуальные данные, ElevenLabs отправляет HTTP POST напрямую на эндпоинт Exa `/search` — никакой server или промежуточный слой с вашей стороны не нужен.

Подключить Exa к ElevenLabs можно двумя способами:

| Подход                                | Настройка                       | Гибкость                                                                  |
| ------------------------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| **Вебхук-инструмент** (рекомендуется) | Настройка через API или дашборд | Полный контроль над параметрами search, параметрами содержимого и headers |
| **Built-in Exa integration** (альфа)  | Один клик в дашборде ElevenLabs | Проще, но с ограниченными настройками                                     |

В этом руководстве описан подход с вебхук-инструментом, который даёт полный контроль над тем, как вызывается Exa. Настроить интеграцию можно и через [дашборд ElevenLabs](https://elevenlabs.io/app/conversational-ai).

## Как это работает {#how-it-works}

1. Пользователь обращается к голосовому agent&#39;у
2. LLM решает вызвать `web_search` на основе описания tool
3. ElevenLabs отправляет POST-запрос на `https://api.exa.ai/search` с настроенными вами headers и body
4. Параметры, определённые LLM (поисковый `query`), объединяются с вашими постоянными значениями (`type`, `numResults`, `contents`)
5. Результаты Exa возвращаются в LLM, и тот отвечает в разговорной форме

Никакого server, никакого callback URL, никаких слушателей. ElevenLabs сам выступает HTTP-client и обращается к Exa напрямую. Для tool calls действует таймаут 20 секунд.

## Предварительные требования {#prerequisites}

* [Exa API key](https://dashboard.exa.ai/api-keys)
* [API key ElevenLabs](https://elevenlabs.io/app/settings/api-keys)

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте ключ в дашборде. Новым аккаунтам начисляются бесплатные credits.
</Card>

## Get started {#get-started}

<Steps>
  <Step title="Создание вебхук-инструмента">
    Воспользуйтесь [Create Tool API](https://elevenlabs.io/docs/api-reference/tools/create) от ElevenLabs, чтобы зарегистрировать вебхук-инструмент, указывающий на поисковый эндпоинт Exa.

    Ключевая идея: свойства с `constant_value` фиксированы (отправляются с каждым запросом), а свойства с `description` определяются LLM во время выполнения.

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

    В результате создаётся инструмент, в котором:

    * `query` — LLM заполняет это поле исходя из контекста разговора
    * `type: "instant"` — используется самый быстрый search mode Exa (~150 мс)
    * `numResults: 5` — возвращается 5 результатов на один поиск
    * `contents.highlights: true` — возвращаются экономные по токенам highlights (оптимально для голосовой задержки)

    Сохраните полученный `id` — он понадобится, чтобы подключить инструмент к agent.

    <Note>
      Если у вас уже есть agent, шаг 2 можно пропустить и добавить инструмент к существующему agent в дашборде ElevenLabs в разделе **Agent &gt; Tools** либо через [Update Agent API](https://elevenlabs.io/docs/api-reference/agents/update). Инструмент не заработает, пока не будет подключён к agent.
    </Note>
  </Step>

  <Step title="Создание agent с инструментом">
    Создайте разговорный agent и подключите вебхук-инструмент по его ID.

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

    Ответ содержит `agent_id`. Откройте agent в дашборде ElevenLabs, чтобы протестировать его:

    ```text theme={null}
    https://elevenlabs.io/app/conversational-ai/agents/YOUR_AGENT_ID
    ```
  </Step>

  <Step title="Встраивание виджета">
    Добавьте agent на любую веб-страницу двумя строками HTML:

    ```html html theme={null}
    <elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
    ```
  </Step>
</Steps>

## Полный пример на Python {#full-python-example}

Этот скрипт создаёт и вебхук-инструмент, и agent за одно выполнение:

```python python theme={null}
import os
import requests

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]
EXA_API_KEY = os.environ["EXA_API_KEY"]
BASE = "https://api.elevenlabs.io/v1/convai"
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

# 1. Создаём вебхук-инструмент
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

# 2. Создаём agent
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

Запустите его:

```bash bash theme={null}
export ELEVENLABS_API_KEY="your-key"
export EXA_API_KEY="your-key"
python elevenlabs_exa_webhook.py
```

## Настройка параметров поиска {#customizing-search-parameters}

Схема body вебхук-инструмента напрямую соответствует [Search API от Exa](/ru/docs/reference/search). Ниже приведены типичные конфигурации:

### Тип поиска {#search-type}

Управляйте балансом между скоростью и качеством с помощью константы `type`:

| Тип       | Задержка | Подходит для                      |
| --------- | -------- | --------------------------------- |
| `instant` | ~150 мс  | Голосовые диалоги (рекомендуется) |
| `auto`    | ~1 с     | Общее использование               |

Для голосовых agent начинайте с `instant`. Используйте `auto`, если хотите, чтобы Exa сама выбирала наиболее подходящий на текущий момент search mode для каждого запроса.

### Параметры содержимого {#content-options}

Выберите, в каком виде возвращать результаты, с помощью объекта `contents`:

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

* **`highlights`** — экономичные по токенам выдержки. Используйте, когда нужны релевантные фрагменты, не перегружающие контекст LLM. Передайте `true`, чтобы получить наилучшее качество по умолчанию.
* **`text`** — полный markdown страницы. Используйте, когда agent&#39;у требуется всё содержимое страницы. Задайте `maxCharacters`, чтобы ограничить длину.
* **`summary`** — сгенерированный LLM summary каждой страницы. Задержка выше, зато вы получаете синтезированный контент.

Для голосовых agent&#39;ов рекомендуемое значение по умолчанию — `highlights: true`: оно сочетает релевантность и высокую скорость ответа.

### Фильтрация результатов {#filtering-results}

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

### Количество результатов {#number-of-results}

Задавайте `numResults` в зависимости от сценария использования. Для голосовых сценариев 3–5 результатов обеспечивают быстрые ответы. Для исследовательских agent&#39;ов 10 и более результатов дают более широкий охват.

## Справочник по схеме {#schema-reference}

Вебхук-инструменты ElevenLabs используют JSON-схему со следующими типами свойств:

* **`constant_value`** — фиксированное значение, отправляемое в каждом запросе. LLM его не видит и не изменяет. Подходит для строк, чисел и логических значений.
* **`description`** — LLM определяет значение во время выполнения на основе этого описания. Используйте для динамических параметров, таких как `query`.
* **Вложенные объекты** — используйте `type: "object"` вместе с `properties`, чтобы строить вложенные структуры вроде `contents.highlights`.

Для каждого параметра в дашборде есть переключатель режима — **Fixed** или **LLM**:

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/elevenlabs/parameters.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=618ca64cac86308c571a8268f48342a5" alt="Настройка параметров вебхук-инструмента ElevenLabs с переключателями режимов Fixed и LLM" width="1692" height="898" data-path="images/integrations/elevenlabs/parameters.png" />
</Frame>

Параметры в режиме **Fixed** (в API помечаются как `constant_value`) отправляются без изменений в каждом запросе. Параметры в режиме **LLM** (помечаются через `description`) позволяют модели выбрать значение во время выполнения. По возможности оставляйте как можно больше параметров в режиме Fixed — каждый параметр, определяемый LLM, добавляет отдельный шаг вызова инструмента и увеличивает задержку ответа.

Полную схему вебхук-инструмента ElevenLabs смотрите в [документации ElevenLabs по серверным инструментам](https://elevenlabs.io/docs/conversational-ai/customization/tools/server-tools).

## Built-in Exa integration (alpha) {#built-in-exa-integration-alpha}

ElevenLabs также предлагает встроенную интеграцию с Exa, доступную в дашборде agent в разделе **Tools &gt; Integrations**. Настроить её проще, но гибко задать параметры поиска сложнее, чем в варианте с вебхук-инструментом.

Если нужен полный контроль над типом поиска, параметрами содержимого и фильтрацией, рекомендуем описанный выше подход с вебхук-инструментом.