> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="langchain">
  # LangChain
</div>

> Cómo usar la integración de Exa con LangChain para hacer RAG.

<Card title="Inicio rápido con agentes de programación" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  ¿Es tu primera vez con Exa? Empieza en menos de un minuto.
</Card>

***

LangChain es un framework para crear aplicaciones que combinan LLM con datos, APIs y otras herramientas. Usa la integración de Exa con LangChain para hacer RAG:

1. Configura la integración de Exa con LangChain y usa Exa para recuperar contenido relevante
2. Conecta ese contenido a una cadena de herramientas que use el LLM de OpenAI para la generación

<Info> Mira [aquí](https://www.youtube.com/watch?v=dA1cHGACXCo) un tutorial en YouTube del equipo de LangChain con una configuración muy similar. </Info>

<Info> Consulta la referencia completa de LangChain [aquí](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/). </Info>

***

<div id="get-started">
  ## Comenzar
</div>

<Steps>
  <Step title="Requisitos previos e instalación">
    Instala las bibliotecas principales de LangChain para OpenAI y Exa

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> Asegúrate de que las API keys estén inicializadas correctamente. En las bibliotecas de LangChain, los nombres de las variables de entorno son `OPENAI_API_KEY` y `EXA_API_KEY` para las keys de OpenAI y de Exa, respectivamente. </Note>

    <Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el dashboard. Las cuentas nuevas incluyen créditos gratuitos.
    </Card>
  </Step>

  <Step title="Usa Exa Search para potenciar una herramienta de LangChain">
    Configura una herramienta Retriever con `ExaSearchRetriever`. Es un retriever que se conecta a Exa Search para encontrar documentos relevantes mediante búsqueda semántica. Primero, importa las bibliotecas necesarias e instancia el ExaSearchRetriever.

    ```Python Python theme={null}
    # cargar las variables de entorno
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # Definimos nuestro retriever para que use Exa Search, obteniendo 3 resultados y extrayendo los highlights de cada uno
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="Crea una plantilla de instrucciones (opcional)">
    Usamos una [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) de LangChain para definir una plantilla con marcadores de posición que extraiga las URL y los highlights del retriever de Exa.

    ```Python Python theme={null}
    # Define una plantilla de prompt de documento con etiquetas tipo XML
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="Extrae la URL y el contenido de los resultados de Exa">
    Usamos un [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html) para extraer los atributos URL y Highlights de los resultados de Exa Search y luego pasarlos a la plantilla de prompt anterior

    ```Python Python theme={null}
    # Crea un Runnable Lambda que extrae los atributos highlights y URL del retriever y los pasa al prompt de documento definido arriba
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="Combina los resultados y el contenido de Exa para la recuperación">
    Completa la cadena de recuperación combinando el retriever de Exa, el parser y una breve función lambda; esto es fundamental para pasar el resultado como una única cadena de texto que sirva de contexto al LLM en el siguiente paso.

    ```Python Python theme={null}
    # Define la cadena de recuperación: resultados de Exa search => obtener los atributos y convertirlos a XML => unirlos en una sola cadena para pasarla como contexto en los siguientes pasos
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="Configura el resto de las herramientas, incluido OpenAI para la generación">
    En este paso, definimos el prompt del sistema con las entradas de plantilla Query y Context, que se obtendrán del usuario y de Exa Search respectivamente. Primero, vuelve a importar las bibliotecas y componentes necesarios de las bibliotecas de LangChain

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    Luego definimos un prompt de generación: la plantilla de prompt que se usa junto con el contexto de Exa para realizar RAG.

    ```Python Python theme={null}
    # Definir la plantilla principal del prompt
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

    Definimos el [LLM de generación como OpenAI](https://python.langchain.com/v0.1/docs/integrations/chat/openai/) y luego conectamos todo mediante una conexión paralela [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/). El prompt de generación, que contiene la query y el contexto, se pasa después al LLM y se [parsea para obtener una mejor representación de la salida](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html).

    ```Python Python theme={null}
    # Usar OpenAI para la generación
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Parseo simple de cadenas para la salida
    output_parser = StrOutputParser()

    # Conectar la cadena, incluida la conexión paralela para la query del usuario y el contexto de la cadena de recuperación de Exa del paso 2.
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="Ejecutar toda la cadena de herramientas RAG">
    Vamos a [invocar](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke) la cadena:

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    Y echa un vistazo al resultado (con los saltos de línea procesados):

    ```Stdout Stdout theme={null}
    'Según el contexto proporcionado, las investigaciones más recientes sobre innovación frente al cambio climático revelan varios hallazgos importantes:
    1. Innovación como respuesta al cambio climático: un estudio analizó cómo responde la innovación al cambio climático a partir de un conjunto de datos de panel de 70 países. El estudio concluyó que el número de innovaciones relacionadas con el cambio climático se correlaciona positivamente con el aumento de las emisiones de dióxido de carbono procedentes de combustibles gaseosos y líquidos, principalmente gases naturales y petróleo. Sin embargo, se correlaciona negativamente con los incrementos de las emisiones de dióxido de carbono derivadas del consumo de combustibles sólidos, sobre todo carbón, y de otros gases de efecto invernadero. La investigación también destacó que la inversión pública no siempre influye en las decisiones de desarrollar y patentar tecnologías climáticas. Este estudio contribuye a la literatura sobre innovación ambiental al aportar información sobre cómo reacciona la innovación ante cambios en los principales factores del cambio climático.
    2. Financiación y atención a la tecnología climática: durante el periodo 2010-2022, fuera de EE. UU., China, la UE y la India, solo el 8 % de la actividad total de capital de riesgo climático provino del resto del mundo. Esta concentración de financiación y atención en determinadas regiones podría estar limitando el alcance de las soluciones de tecnología climática en comunidades de bajos ingresos y países en desarrollo, que ya sufren los efectos del cambio climático pero carecen de los recursos necesarios para afrontarlos de forma eficaz.
    3. Asignación de la financiación a la investigación: un estudio de la University of Sussex Business School analizó la financiación de la investigación climática y energética entre 1990 y 2020. La investigación concluyó que el 36 % de los fondos se destinó a la adaptación al clima, mientras que el 28 % se dedicó a estudiar cómo descarbonizar el sistema energético. Otras partidas significativas se asignaron a transporte y movilidad (13 %), geoingeniería (12 %) y descarbonización industrial (11 %). La mayor parte de la financiación fue a parar a investigadores de países occidentales ricos, que quizá no sean los más vulnerables a los impactos inmediatos del cambio climático.
    Fuentes:
    1. Estudio sobre la respuesta de la innovación al cambio climático: https://www.sciencedirect.com/science/article/pii/S0040162516302542
    2. Financiación y atención a la tecnología climática: https://www.sbs.ox.ac.uk/oxford-answers/climate-tech-opportunity-save-planet
    3. Asignación de la financiación a la investigación climática y energética: https://www.protocol.com/bulletins/climate-research-funding-adaptation'
    ```
  </Step>

  <Step title="Opcionalmente, transmite en tiempo real la salida de la cadena">
    Opcionalmente, puedes transmitir la salida de la cadena en streaming.

    ```Python Python theme={null}
    for chunk in chain.stream("Latest research on climate change innovation"):
      print(chunk, end="|", flush=True)

    # O de forma asíncrona
    async def run_async():
      async for chunk in chain.astream("Latest research on climate change innovation"):
        print(chunk, end="|", flush=True)

    import asyncio
    asyncio.run(run_async())
    ```

    Genera la salida en streaming. [Más información](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/) sobre el método `.stream`, incluido el manejo de fragmentos y el análisis de las salidas.
  </Step>
</Steps>