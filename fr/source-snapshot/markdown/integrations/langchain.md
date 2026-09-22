> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# LangChain {#langchain}

> Comment utiliser l&#39;intégration d&#39;Exa avec LangChain pour faire du RAG.

<Card title="Quickstart agent de code" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Vous découvrez Exa ? Lancez-vous en moins d&#39;une minute.
</Card>

***

LangChain est un framework permettant de créer des applications qui combinent des LLM avec des données, des API et d&#39;autres outils. Utilisez l&#39;intégration LangChain d&#39;Exa pour faire du RAG :

1. Configurez l&#39;intégration LangChain d&#39;Exa et utilisez Exa pour récupérer le contenu pertinent
2. Reliez ce contenu à une chaîne d&#39;outils qui s&#39;appuie sur le LLM d&#39;OpenAI pour la génération

<Info> Regardez [ici](https://www.youtube.com/watch?v=dA1cHGACXCo) un tutoriel YouTube de l&#39;équipe LangChain présentant une configuration très similaire. </Info>

<Info> Consultez la référence complète de LangChain [ici](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/). </Info>

***

## Démarrer {#get-started}

<Steps>
  <Step title="Prérequis et installation">
    Installez les bibliothèques principales LangChain pour OpenAI et Exa

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> Assurez-vous que les API keys sont correctement initialisées. Pour les libraries LangChain, les variables d&#39;environnement se nomment respectivement `OPENAI_API_KEY` et `EXA_API_KEY` pour les clés OpenAI et Exa. </Note>

    <Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
    </Card>
  </Step>

  <Step title="Utilisez Exa Search pour alimenter un outil LangChain">
    Configurez un outil Retriever à l&#39;aide de `ExaSearchRetriever`. Ce retriever se connecte à Exa Search pour trouver des documents pertinents par recherche sémantique. Commencez par importer les bibliothèques nécessaires, puis instanciez ExaSearchRetriever.

    ```Python Python theme={null}
    # charger les variables d'environnement
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # Définir notre retriever pour qu'il utilise Exa Search, en récupérant 3 résultats et en extrayant les highlights de chaque résultat
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="Créer un modèle de prompt (facultatif)">
    Nous utilisons un [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) LangChain pour définir un template avec des espaces réservés permettant d&#39;extraire les URL et les highlights renvoyés par le retriever Exa.

    ```Python Python theme={null}
    # Définir un template de prompt de document avec des balises de type XML
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="Analysez l’URL et le contenu des résultats Exa">
    Nous utilisons un [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html) pour extraire les attributs URL et Highlights des résultats d&#39;Exa Search, puis les transmettre au template de prompt ci-dessus

    ```Python Python theme={null}
    # Crée un Runnable Lambda qui extrait les attributs highlights et URL du retriever et les transmet au prompt de document défini ci-dessus
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="Combinez les résultats et le contenu d’Exa pour le retrieval">
    Complétez la chaîne de retrieval en assemblant le retriever Exa, le parser et une courte fonction lambda : cette étape est essentielle pour transmettre le résultat sous forme d&#39;une chaîne unique servant de context au LLM à l&#39;étape suivante.

    ```Python Python theme={null}
    # Définition de la chaîne de retrieval - résultats de l'Exa search => récupération des attributs et conversion en XML => concaténation en une seule chaîne servant de context aux étapes suivantes
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="Configurez le reste de la chaîne d’outils, y compris OpenAI pour la génération.">
    Dans cette étape, nous définissons le system prompt avec les entrées de template Query et Context, provenant respectivement de l&#39;utilisateur et d&#39;Exa Search. Commencez par importer à nouveau les bibliothèques et composants nécessaires depuis les bibliothèques LangChain

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    Nous définissons ensuite un prompt de génération, c&#39;est-à-dire le template de prompt utilisé avec le context provenant d&#39;Exa pour effectuer du RAG.

    ```Python Python theme={null}
    # Définition du template de prompt principal
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

    Nous définissons le [LLM de génération sur OpenAI](https://python.langchain.com/v0.1/docs/integrations/chat/openai/), puis nous relions le tout via une connexion parallèle [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/). Le prompt de génération, qui contient la requête et le context, est ensuite transmis au LLM puis [parsé pour une meilleure présentation de l&#39;output](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html).

    ```Python Python theme={null}
    # Utiliser OpenAI pour la génération
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Analyse de chaîne simple pour l'output
    output_parser = StrOutputParser()

    # Connecter la chaîne, avec une connexion parallèle pour la requête de l'utilisateur et le context provenant de la chaîne de retrieval Exa de l'étape 2.
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="Exécuter toute la chaîne d’outils RAG">
    [Invoquons](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke) la chaîne :

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    Et examinez l&#39;output (sauts de ligne interprétés) :

    ```Stdout Stdout theme={null}
    'D'après le contexte fourni, les recherches les plus récentes sur l'innovation face au changement climatique révèlent plusieurs constats importants :
    1. L'innovation en réponse au changement climatique : une étude a examiné la manière dont l'innovation réagit au changement climatique en analysant un panel de données portant sur 70 pays. Elle a constaté que le nombre d'innovations liées au changement climatique est corrélé positivement à la hausse des émissions de dioxyde de carbone issues des combustibles gazeux et liquides, principalement le gaz naturel et le pétrole. En revanche, il est corrélé négativement à la hausse des émissions de dioxyde de carbone provenant de la consommation de combustibles solides, principalement le charbon, ainsi qu'aux autres émissions de gaz à effet de serre. La recherche a également souligné que l'investissement public n'influence pas toujours les décisions de développer et de breveter des technologies climatiques. Cette étude enrichit la littérature sur l'innovation environnementale en éclairant la façon dont l'innovation réagit à l'évolution des principaux facteurs du changement climatique.
    2. Financement et attention portés aux technologies climatiques : entre 2010 et 2022, en dehors des États-Unis, de la Chine, de l'UE et de l'Inde, seuls 8 % de l'activité totale de capital-risque dans le climat provenaient du reste du monde. Cette concentration des financements et de l'attention sur certaines régions pourrait freiner la diffusion des solutions technologiques climatiques auprès des communautés à faibles revenus et des pays en développement, qui subissent déjà les effets du changement climatique sans disposer des ressources nécessaires pour y faire face efficacement.
    3. Répartition des financements de la recherche : une étude de l'University of Sussex Business School a analysé les financements consacrés à la recherche sur le climat et l'énergie entre 1990 et 2020. Elle a constaté que 36 % des financements étaient alloués à l'adaptation au changement climatique, tandis que 28 % portaient sur l'assainissement du système énergétique. D'autres parts significatives ont été attribuées aux transports et à la mobilité (13 %), à la géo-ingénierie (12 %) et à la décarbonation industrielle (11 %). La majorité des financements est allée à des chercheurs de pays occidentaux riches, qui ne sont pas nécessairement les plus vulnérables aux effets immédiats du changement climatique.
    Sources :
    1. Étude sur la réponse de l'innovation au changement climatique : https://www.sciencedirect.com/science/article/pii/S0040162516302542
    2. Financement et attention portés aux technologies climatiques : https://www.sbs.ox.ac.uk/oxford-answers/climate-tech-opportunity-save-planet
    3. Répartition des financements de la recherche sur le climat et l'énergie : https://www.protocol.com/bulletins/climate-research-funding-adaptation'
    ```
  </Step>

  <Step title="Diffusez, si vous le souhaitez, l’output de la chaîne en continu">
    Vous pouvez également streamer l&#39;output de la chaîne.

    ```Python Python theme={null}
    for chunk in chain.stream("Latest research on climate change innovation"):
      print(chunk, end="|", flush=True)

    # Ou de manière asynchrone
    async def run_async():
      async for chunk in chain.astream("Latest research on climate change innovation"):
        print(chunk, end="|", flush=True)

    import asyncio
    asyncio.run(run_async())
    ```

    Produit les outputs en stream. [En savoir plus](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/) sur la méthode `.stream`, notamment la gestion des chunks et le parsing des outputs.
  </Step>
</Steps>