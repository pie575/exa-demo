> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="llamaindex">
  # LlamaIndex
</div>

> Un guide de démarrage rapide pour ajouter la récupération de contenu Exa à une application d&#39;agent LlamaIndex.

<Card title="Quickstart agent de code" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Vous débutez avec Exa ? Lancez-vous en moins d&#39;une minute.
</Card>

***

LlamaIndex est un framework permettant de créer des applications LLM alimentées par des données structurées. Dans ce guide, nous allons utiliser l&#39;intégration LlamaIndex d&#39;Exa pour :

1. Déclarer l&#39;outil Search and Retrieve Highlight d&#39;Exa comme retriever LlamaIndex
2. Configurer un OpenAI Agent qui utilise cet outil pour générer ses réponses

***

<div id="get-started">
  ## Get started
</div>

<Steps>
  <Step title="Prérequis et installation">
    Installez les bibliothèques llama-index, llama-index core et llama-index-tools-exa. Les dépendances OpenAI sont incluses dans la bibliothèque core, il n&#39;est donc pas nécessaire de les spécifier.

    ```Python Python theme={null}
    pip install llama-index llama-index-core llama-index-tools-exa
    ```

    Assurez-vous également que les API keys sont correctement initialisées. Le code suivant utilise `EXA_API_KEY` comme nom d&#39;environment variable.

    <Card title="Obtenez votre Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une key dans le dashboard. Les nouveaux comptes démarrent avec des credits gratuits.
    </Card>
  </Step>

  <Step title="Instancier l'outil Exa">
    Importez la bibliothèque d&#39;integration Exa correspondante et instanciez le `ExaToolSpec` de LlamaIndex.

    ```Python Python theme={null}
    from llama_index.tools.exa import ExaToolSpec
    import os

    exa_tool = ExaToolSpec(
        api_key=os.environ["EXA_API_KEY"],
    )
    ```
  </Step>

  <Step title="Choisir la méthode Exa à utiliser">
    Dans cet exemple, nous souhaitons uniquement transmettre la méthode [search&#95;and&#95;retrieve&#95;highlights](https://docs.llamaindex.ai/en/stable/api_reference/tools/exa/) à notre agent : nous la spécifions donc via la méthode LlamaIndex `.to_tool_list`. Nous transmettons également `current_date`, un utilitaire simple qui permet à notre agent de connaître la date du jour.

    ```Python Python theme={null}
    print('Tools that are provide by Exa LlamaIndex integration:')
    print('\n'.join(map(str, (exa_tool.spec_functions))))

    search_and_retrieve_highlights_tool = exa_tool.to_tool_list(
        spec_functions=["search_and_retrieve_highlights", "current_date"]
    )
    ```
  </Step>

  <Step title="Configurer un OpenAI Agent et effectuer des requêtes Exa-powered">
    Configurez l&#39;[OpenAIAgent](https://docs.llamaindex.ai/en/stable/examples/agent/Chatbot%5FSEC/) en lui transmettant l&#39;ensemble de tools filtré ci-dessus.

    ```Python Python theme={null}
    from llama_index.agent.openai import OpenAIAgent

    agent = OpenAIAgent.from_tools(
        search_and_retrieve_highlights_tool,
        verbose=True,
    )
    ```

    Nous pouvons ensuite utiliser la méthode chat pour interagir avec l&#39;agent.

    ```Python Python theme={null}
    agent.chat(
        "Can you summarize the news from the last month related to the US stock market?"
    )
    ```

    L&#39;agent appelle les tools Exa mis à sa disposition, puis formule sa réponse à partir des résultats. La sortie exacte varie selon la query et les dates de publication des pages renvoyées par Exa.
  </Step>
</Steps>

<Columns cols={2}>
  <Card title="Guide de la Search API" icon="search" href="/fr/docs/search/quickstart" cta="Lire le guide" arrow="true">
    Passez en revue les search parameters et les fields de réponse d&#39;Exa.
  </Card>

  <Card title="Référence des tools LlamaIndex" icon="book" href="https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/" cta="Ouvrir la reference" arrow="true">
    Explorez les tools LlamaIndex et la configuration des agents.
  </Card>
</Columns>