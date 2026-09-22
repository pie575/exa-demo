> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="crewai">
  # CrewAI
</div>

> Aprende a añadir capacidades de recuperación de Exa a tus agentes de CrewAI.

<Card title="Quickstart de agentes de programación" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  ¿Es tu primera vez con Exa? Primeros pasos en menos de un minuto.
</Card>

***

[CrewAI](https://crewai.com/) es un framework para orquestar agentes de IA que colaboran entre sí para realizar tareas complejas.
En esta guía crearemos un crew de dos agentes que genera un boletín a partir de los resultados de búsqueda de Exa. Veremos cómo:

1. Crear una herramienta personalizada de CrewAI basada en Exa
2. Configurar agentes y asignarles roles específicos que usen la herramienta de búsqueda basada en Exa
3. Organizar los agentes en un crew que escribirá un boletín

<Note>
  CrewAI también incluye una herramienta integrada, [`ExaSearchTool`](https://docs.crewai.com/en/tools/search-research/exasearchtool), que puedes usar directamente sin escribir un wrapper personalizado. La herramienta personalizada que se muestra a continuación resulta útil si quieres control total sobre el formato de los resultados; cualquiera de los dos enfoques funciona.
</Note>

***

<div id="get-started">
  ## Primeros pasos
</div>

<Steps>
  <Step title="Requisitos previos e instalación">
    Instala las bibliotecas crewAI core, crewAI tools y el SDK de Exa para Python.

    ```Python Python theme={null}
    pip install crewai 'crewai[tools]' exa_py
    ```
  </Step>

  <Step title="Definición de una herramienta personalizada de Exa en crewAI">
    Configuramos una [herramienta personalizada](https://docs.crewai.com/concepts/tools) con el [decorador @tool](https://docs.crewai.com/concepts/tools#utilizing-the-tool-decorator) de crewAI. Dentro de la herramienta podemos inicializar la clase Exa del [SDK de Python de Exa](https://github.com/exa-labs/exa-py), hacer una solicitud y devolver un resultado ya procesado.

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

    <Note> Asegúrate de que tus API keys estén inicializadas correctamente. Para esta demostración, los nombres de las variables de entorno son `OPENAI_API_KEY` y `EXA_API_KEY`, correspondientes a las keys de OpenAI y de Exa respectivamente. </Note>

    <Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas empiezan con créditos gratuitos.
    </Card>
  </Step>

  <Step title="Configurar un agente de crewAI">
    Importa los módulos correspondientes de crewAI. Luego, define `exa_tools` para que haga referencia al método de búsqueda personalizado que definimos más arriba.

    ```Python Python theme={null}
    from crewai import Task, Crew, Agent

    exa_tools = search_and_get_contents_tool
    ```

    Luego configuramos[ dos agentes](https://docs.crewai.com/concepts/Agents/) y los agrupamos en un [crew](https://docs.crewai.com/concepts/Crews/):

    * Uno para investigar con Exa (proporcionando la herramienta personalizada definida arriba)
    * Otro para redactar una newsletter como output (usando un LLM)

    ```Python Python theme={null}
    # Creación de un agente investigador sénior con memoria y modo detallado
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

  <Step title="Definir tareas para los agentes">
    A continuación, definiremos [tareas](https://docs.crewai.com/concepts/Tasks/) para cada agente y crearemos el crew en su conjunto utilizando todos los componentes que configuramos arriba.

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

  <Step title="Puesta en marcha del equipo">
    Por último, ponemos en marcha el crew proporcionando un tema de investigación como consulta de entrada.

    ```Python Python theme={null}
    response = crew.kickoff(inputs={'topic': 'Latest AI research'})

    print(response)
    ```

    El equipo redacta el boletín a partir del contenido que devolvió la herramienta de Exa Search.
  </Step>
</Steps>