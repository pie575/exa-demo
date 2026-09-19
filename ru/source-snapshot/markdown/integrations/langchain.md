> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="langchain">
  # LangChain
</div>

> Как использовать интеграцию Exa с LangChain для реализации RAG.

<Card title="Быстрый старт с кодинг-агентом" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Впервые работаете с Exa? Начните меньше чем за минуту.
</Card>

***

LangChain — это фреймворк для создания приложений, объединяющих LLM с данными, API и другими инструментами. Используйте интеграцию Exa с LangChain для реализации RAG:

1. Настройте интеграцию Exa с LangChain и используйте Exa для получения релевантного контента
2. Подключите этот контент к цепочке инструментов, которая использует LLM от OpenAI для генерации

<Info> Видеоруководство по очень похожей настройке от команды LangChain доступно на YouTube [здесь](https://www.youtube.com/watch?v=dA1cHGACXCo). </Info>

<Info> Полную справочную документацию LangChain смотрите [здесь](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/). </Info>

***

<div id="get-started">
  ## Начало работы
</div>

<Steps>
  <Step title="Требования и установка">
    Установите основные библиотеки LangChain для OpenAI и Exa

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> Убедитесь, что API keys инициализированы правильно. Для библиотек LangChain используются переменные окружения `OPENAI_API_KEY` и `EXA_API_KEY` — для ключей OpenAI и Exa соответственно. </Note>

    <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте ключ в панели управления. Новым аккаунтам начисляются бесплатные credits.
    </Card>
  </Step>

  <Step title="Используйте Exa Search в качестве инструмента LangChain">
    Настройте инструмент Retriever с помощью `ExaSearchRetriever`. Это ретривер, который подключается к Exa Search и находит релевантные документы с помощью семантического поиска. Сначала импортируйте нужные библиотеки и создайте экземпляр ExaSearchRetriever.

    ```Python Python theme={null}
    # загружаем переменные окружения
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # Настраиваем retriever на работу с Exa Search: берём 3 результата и извлекаем highlights из каждого
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="Создайте шаблон запроса (необязательно)">
    Мы используем [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) из LangChain, чтобы задать шаблон с плейсхолдерами и извлечь URL и highlights из ретривера Exa.

    ```Python Python theme={null}
    # Определяем шаблон промпта для документа с помощью XML-подобных тегов
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="Извлечение URL и содержимого из результатов Exa">
    Мы используем [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html), чтобы извлечь атрибуты URL и Highlights из результатов Exa Search и передать их в приведённый выше шаблон промпта

    ```Python Python theme={null}
    # Создаём Runnable Lambda, который извлекает атрибуты highlights и url из результатов ретривера и передаёт их в наш шаблон документа выше
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="Объединяйте результаты поиска и контент Exa для последующего извлечения">
    Завершите цепочку извлечения, соединив ретривер Exa, парсер и короткую лямбда-функцию, — это необходимо, чтобы передать результат одной строкой в качестве контекста для LLM на следующем шаге.

    ```Python Python theme={null}
    # Определяем цепочку извлечения: результаты поиска Exa => извлекаем атрибуты и преобразуем в XML => объединяем в одну строку, чтобы передать её как контекст на следующих шагах
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="Настройте остальные инструменты, включая OpenAI для генерации">
    На этом шаге мы определяем системный промпт с шаблонными параметрами Query и Context, которые будут подставляться из пользовательского ввода и из Exa Search соответственно. Сначала снова импортируем необходимые библиотеки и компоненты из библиотек LangChain

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    Затем мы определяем промпт для генерации — шаблон промпта, который используется вместе с контекстом из Exa для выполнения RAG.

    ```Python Python theme={null}
    # Определяем основной шаблон промпта
    generation_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert research assistant. You use xml-formatted context to research people's questions."),
        ("human", """
    Please answer the following query based on the provided context. Please cite your sources at the end of your response.:

    Query: {query}
    ---
    <context>
    {context}
    </context>
    """)
    ])
    ```

    В качестве генерирующей модели мы указываем [LLM от OpenAI](https://python.langchain.com/v0.1/docs/integrations/chat/openai/), а затем объединяем все компоненты через параллельное соединение [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/). Промпт генерации, содержащий запрос и контекст, передаётся в LLM, а результат [разбирается парсером для более удобного представления](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html).

    ```Python Python theme={null}
    # Используем OpenAI для генерации
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Простой строковый парсер для вывода
    output_parser = StrOutputParser()

    # Собираем цепочку, включая параллельную передачу запроса от пользователя и контекста из цепочки ретривера Exa из шага 2.
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="Запуск полного набора инструментов для RAG">
    Давайте [вызовем](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke) цепочку:

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    И посмотрите на результат (переносы строк обработаны):

    ```Stdout Stdout theme={null}
    'Исходя из предоставленного контекста, новейшие исследования инноваций в области изменения климата выявляют несколько важных результатов:
    1. Инновации как реакция на изменение климата: в исследовании рассматривалось, как инновации реагируют на изменение климата, на основе панельных данных по 70 странам. Было установлено, что количество инноваций, связанных с изменением климата, положительно коррелирует с ростом выбросов углекислого газа от газообразного и жидкого топлива, главным образом от природного газа и нефтепродуктов. Однако оно отрицательно коррелирует с ростом выбросов углекислого газа от потребления твёрдого топлива, преимущественно угля, а также с выбросами других парниковых газов. Исследование также показало, что государственные инвестиции не всегда влияют на решения о разработке и патентовании климатических технологий. Эта работа дополняет литературу об экологических инновациях, объясняя, как инновации реагируют на изменения ключевых факторов изменения климата.
    2. Финансирование и внимание к климатическим технологиям: в период с 2010 по 2022 год за пределами США, Китая, ЕС и Индии на остальной мир пришлось лишь 8% всей венчурной активности в климатической сфере. Такая концентрация финансирования и внимания в отдельных регионах может препятствовать распространению климатических технологий в сообществах с низкими доходами и развивающихся странах, которые уже ощущают последствия изменения климата, но не располагают необходимыми ресурсами для эффективного реагирования.
    3. Распределение финансирования исследований: в исследовании Школы бизнеса Университета Сассекса проанализировано финансирование климатических и энергетических исследований с 1990 по 2020 год. Выяснилось, что 36% средств направлялось на адаптацию к изменению климата, а 28% — на изучение способов очистки энергетической системы. Другие значимые доли финансирования пришлись на транспорт и мобильность (13%), геоинженерию (12%) и декарбонизацию промышленности (11%). Большая часть средств досталась исследователям в богатых западных странах, которые, возможно, не являются наиболее уязвимыми к непосредственным последствиям изменения климата.
    Источники:
    1. Исследование о реакции инноваций на изменение климата: https://www.sciencedirect.com/science/article/pii/S0040162516302542
    2. Финансирование и внимание к климатическим технологиям: https://www.sbs.ox.ac.uk/oxford-answers/climate-tech-opportunity-save-planet
    3. Распределение финансирования климатических и энергетических исследований: https://www.protocol.com/bulletins/climate-research-funding-adaptation'
    ```
  </Step>

  <Step title="При необходимости включите потоковую передачу результатов цепочки">
    При желании вывод цепочки можно получать в потоковом режиме.

    ```Python Python theme={null}
    for chunk in chain.stream("Latest research on climate change innovation"):
      print(chunk, end="|", flush=True)

    # Или асинхронно
    async def run_async():
      async for chunk in chain.astream("Latest research on climate change innovation"):
        print(chunk, end="|", flush=True)

    import asyncio
    asyncio.run(run_async())
    ```

    Выводит результат потоком. [Подробнее](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/) о методе `.stream`, включая обработку фрагментов и разбор результатов.
  </Step>
</Steps>