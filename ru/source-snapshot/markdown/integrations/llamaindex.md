> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

<div id="llamaindex">
  # LlamaIndex
</div>

> Краткое руководство по добавлению поиска Exa в приложение на базе агента LlamaIndex.

<Card title="Быстрый старт с кодинг-агентом" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Впервые используете Exa? Начните меньше чем за минуту.
</Card>

***

LlamaIndex — это фреймворк для создания LLM-приложений на основе структурированных данных. В этом руководстве мы используем интеграцию Exa с LlamaIndex, чтобы:

1. Указать инструмент Exa Search and Retrieve Highlight в качестве ретривера LlamaIndex
2. Настроить агента OpenAI, который использует этот инструмент при генерации ответов

***

<div id="get-started">
  ## Начало работы
</div>

<Steps>
  <Step title="Требования и установка">
    Установите библиотеки llama-index, llama-index core, llama-index-tools-exa. Зависимости OpenAI входят в основную библиотеку, поэтому указывать их отдельно не нужно.

    ```Python Python theme={null}
    pip install llama-index llama-index-core llama-index-tools-exa
    ```

    Также убедитесь, что API-ключи инициализированы корректно. В приведённом ниже коде именем переменной окружения служит `EXA_API_KEY`.

    <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте ключ в панели управления. Новым аккаунтам начисляются бесплатные credits.
    </Card>
  </Step>

  <Step title="Создание экземпляра инструмента Exa">
    Импортируйте соответствующую библиотеку интеграции с Exa и создайте экземпляр `ExaToolSpec` из LlamaIndex.

    ```Python Python theme={null}
    from llama_index.tools.exa import ExaToolSpec
    import os

    exa_tool = ExaToolSpec(
        api_key=os.environ["EXA_API_KEY"],
    )
    ```
  </Step>

  <Step title="Выбор используемого метода Exa">
    В этом примере нам нужно передать агенту только метод [search&#95;and&#95;retrieve&#95;highlights](https://docs.llamaindex.ai/en/stable/api_reference/tools/exa/), поэтому указываем его с помощью метода `.to_tool_list` из LlamaIndex. Также передаём `current_date` — простую утилиту, благодаря которой агент знает текущую дату.

    ```Python Python theme={null}
    print('Tools that are provide by Exa LlamaIndex integration:')
    print('\n'.join(map(str, (exa_tool.spec_functions))))

    search_and_retrieve_highlights_tool = exa_tool.to_tool_list(
        spec_functions=["search_and_retrieve_highlights", "current_date"]
    )
    ```
  </Step>

  <Step title="Настройка агента OpenAI и запросы через Exa">
    Настройте [OpenAIAgent](https://docs.llamaindex.ai/en/stable/examples/agent/Chatbot%5FSEC/), передав отфильтрованный набор инструментов из предыдущего шага.

    ```Python Python theme={null}
    from llama_index.agent.openai import OpenAIAgent

    agent = OpenAIAgent.from_tools(
        search_and_retrieve_highlights_tool,
        verbose=True,
    )
    ```

    Затем для взаимодействия с агентом можно использовать метод chat.

    ```Python Python theme={null}
    agent.chat(
        "Can you summarize the news from the last month related to the US stock market?"
    )
    ```

    Агент вызывает переданные ему инструменты Exa и формирует ответ на основе полученных результатов. Конкретный вывод зависит от запроса и дат публикации страниц, которые вернёт Exa.
  </Step>
</Steps>

<Columns cols={2}>
  <Card title="Руководство по Search API" icon="search" href="/ru/docs/search/quickstart" cta="Читать руководство" arrow="true">
    Ознакомьтесь с параметрами search в Exa и полями ответа.
  </Card>

  <Card title="Справочник по инструментам LlamaIndex" icon="book" href="https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/" cta="Открыть справочник" arrow="true">
    Изучите инструменты LlamaIndex и настройку агента.
  </Card>
</Columns>