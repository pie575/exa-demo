> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="crewai">
  # CrewAI
</div>

> Узнайте, как добавить возможности поиска Exa в ваших агентов CrewAI.

<Card title="Быстрый старт с кодинг-агентом" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Впервые используете Exa? Начните меньше чем за минуту.
</Card>

***

[CrewAI](https://crewai.com/) — это фреймворк для оркестрации ИИ-агентов, которые совместно решают сложные задачи.
В этом руководстве мы создадим команду из двух агентов, которые составят рассылку на основе результатов поиска Exa. Мы разберём, как:

1. Создать собственный инструмент CrewAI на базе Exa
2. Настроить агентов и назначить им конкретные роли, использующие поисковый инструмент на базе Exa
3. Объединить агентов в команду, которая напишет рассылку

<Note>
  В CrewAI также есть встроенный инструмент [`ExaSearchTool`](https://docs.crewai.com/en/tools/search-research/exasearchtool), который можно подключить без написания собственной обёртки. Описанный ниже пользовательский инструмент пригодится, если вам нужен полный контроль над форматированием результатов; оба подхода рабочие.
</Note>

***

<div id="get-started">
  ## Начало работы
</div>

<Steps>
  <Step title="Предварительные требования и установка">
    Установите библиотеки crewAI core, crewAI tools и Exa Python SDK.

    ```Python Python theme={null}
    pip install crewai 'crewai[tools]' exa_py
    ```
  </Step>

  <Step title="Создание пользовательского инструмента Exa в crewAI">
    Мы создаём [пользовательский инструмент](https://docs.crewai.com/concepts/tools) с помощью [декоратора @tool](https://docs.crewai.com/concepts/tools#utilizing-the-tool-decorator) из crewAI. Внутри инструмента можно инициализировать класс Exa из [Exa Python SDK](https://github.com/exa-labs/exa-py), выполнить запрос и вернуть обработанный результат.

    ```Python Python theme={null}
    from crewai_tools import tool
    from exa_py import Exa
    import os

    exa_api_key = os.getenv("EXA_API_KEY")

    @tool("Exa search and get contents")
    def search_and_get_contents_tool(question: str) -> str:
        """Tool using Exa's Python SDK to run semantic search and return result highlights."""

        exa = Exa(api_key=exa_api_key)

        response = exa.search(
            question,
            type="auto",
            num_results=10,
            contents={"highlights": True}
        )

        parsedResult = ''.join([
          f'<Title id={idx}>{eachResult.title}</Title>'
          f'<URL id={idx}>{eachResult.url}</URL>'
          f'<Highlight id={idx}>{"".join(eachResult.highlights)}</Highlight>'
          for (idx, eachResult) in enumerate(response.results)
        ])

        return parsedResult
    ```

    <Note> Убедитесь, что ваши API keys инициализированы правильно. В этом примере переменные окружения называются `OPENAI_API_KEY` и `EXA_API_KEY` — для ключей OpenAI и Exa соответственно. </Note>

    <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте key в панели управления. Новые аккаунты получают бесплатные credits.
    </Card>
  </Step>

  <Step title="Настройка агента crewAI">
    Импортируйте нужные модули crewAI. Затем определите `exa_tools`, чтобы сослаться на пользовательский метод поиска, определённый выше.

    ```Python Python theme={null}
    from crewai import Task, Crew, Agent

    exa_tools = search_and_get_contents_tool
    ```

    Затем мы создаём[ двух агентов](https://docs.crewai.com/concepts/Agents/) и объединяем их в [общую команду (crew)](https://docs.crewai.com/concepts/Crews/):

    * Один ведёт исследование с помощью Exa (для этого ему передаётся определённый выше пользовательский инструмент)
    * Второй пишет итоговую новостную рассылку (с помощью LLM)

    ```Python Python theme={null}
    # Создаём agent-исследователя уровня senior с памятью и подробным выводом
    researcher = Agent(
      role='Researcher',
      goal='Get the latest research on {topic}',
      verbose=True,
      memory=True,
      backstory=(
        "Driven by curiosity, you're at the forefront of"
        "innovation, eager to explore and share knowledge that could change"
        "the world."
      ),
      tools=[exa_tools],
      allow_delegation=False
    )

    article_writer = Agent(
      role='Writer',
      goal='Write a great newsletter article on {topic}',
      verbose=True,
      memory=True,
      backstory=(
        "Driven by a love of writing and passion for"
        "innovation, you are eager to share knowledge with"
        "the world."
      ),
      tools=[exa_tools],
      allow_delegation=False
    )
    ```
  </Step>

  <Step title="Постановка задач для агентов">
    Далее мы определим [задачи](https://docs.crewai.com/concepts/Tasks/) для каждого агента и соберём саму команду (crew) из всех настроенных выше компонентов.

    ```Python Python theme={null}
    research_task = Task(
      description=(
        "Identify the latest research in {topic}."
        "Your final report should clearly articulate the key points,"
      ),
      expected_output='A comprehensive 3 paragraphs long report on the {topic}.',
      tools=[exa_tools],
      agent=researcher,
    )

    write_article = Task(
      description=(
        "Write a newsletter article on the latest research in {topic}."
        "Your article should be engaging, informative, and accurate."
        "The article should address the audience with a greeting to the newsletter audience \"Hi readers!\", plus a similar signoff"
      ),
      expected_output='A comprehensive 3 paragraphs long newsletter article on the {topic}.',
      agent=article_writer,
    )

    crew = Crew(
      agents=[researcher, article_writer],
      tasks=[research_task, write_article],
      memory=True,
      cache=True,
      max_rpm=100,
      share_crew=True
    )
    ```
  </Step>

  <Step title="Начало работы с командой">
    Наконец, мы запускаем crew, передав тему исследования в качестве входного запроса.

    ```Python Python theme={null}
    response = crew.kickoff(inputs={'topic': 'Latest AI research'})

    print(response)
    ```

    Команда (crew) пишет рассылку на основе контента, который вернул инструмент поиска Exa.
  </Step>
</Steps>