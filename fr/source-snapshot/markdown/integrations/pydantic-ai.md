> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="pydantic-ai">
  # Pydantic AI
</div>

> Dotez un agent Pydantic AI d&#39;outils de recherche web reposant sur la Search API d&#39;Exa.

<Card title="Quickstart coding agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Vous débutez avec Exa ? Lancez-vous en moins d&#39;une minute.
</Card>

***

[Pydantic AI](https://pydantic.dev/docs/ai/) est un framework d&#39;agents Python conçu par l&#39;équipe à l&#39;origine de Pydantic. Son [harness](https://pydantic.dev/docs/ai/harness/exa-search/) intègre officiellement Exa sous la forme de deux capabilities composables :

* **`ExaSearch`** : des outils de recherche web reposant sur la Search API d&#39;Exa : `web_search` (les meilleurs résultats accompagnés de leurs excerpts les plus pertinents, ainsi qu&#39;un résumé textuel synthétisé en option), `get_page` (retrieval de la page complète pour une URL donnée) et, sur activation, `deep_search` (une réponse synthétisée et sourcée en un seul call).
* **`ExaAgent`** : délègue les recherches de longue durée à l&#39;[API Exa Agent](/fr/docs/agent/quickstart) sous forme de deferred tool calls.

Une capability regroupe les tools, les budgets d&#39;output propres à chaque tool et une courte guidance de recherche dans le system prompt : vous n&#39;avez donc pas à relier vous-même une API de search à un récupérateur de pages, ni à demander à l&#39;agent de mener ses recherches de façon méthodique.

<Info> Consultez la reference complète de Pydantic [ici](https://pydantic.dev/docs/ai/harness/exa-search/). </Info>

<Card title="Lire l'article de Pydantic sur la création d'un Research Agent avec Exa" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/pydantic-ai/logo.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=aee1bf45859bf6a3debf4177d0aefb3f" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/integrations/pydantic-ai/logo.svg">
  Une présentation pas à pas de trois agents de recherche prêts à copier-coller, bâtis sur Pydantic AI et Exa.
</Card>

***

<div id="get-started">
  ## Démarrer
</div>

<Steps>
  <Step title="Prérequis et installation">
    Installez le harness avec l&#39;extra Exa et définissez la variable d&#39;environnement `EXA_API_KEY`.

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="Obtenez votre clé API Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une clé dans le dashboard. Les nouveaux comptes démarrent avec des crédits gratuits.
    </Card>
  </Step>

  <Step title="Ajouter ExaSearch à un agent">
    Passez `ExaSearch` à un `Agent` via le paramètre `capabilities`. Par défaut, l&#39;authentification s&#39;appuie sur `EXA_API_KEY`.

    ```Python Python theme={null}
    from pydantic_ai import Agent
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch()])

    result = agent.run_sync('What changed in the latest stable Python release?')
    print(result.output)
    ```

    `ExaSearch` ajoute deux outils à l&#39;agent :

    | Outil        | Rôle                                                                                                                                                 |
    | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `web_search` | Effectue une recherche sur le web et renvoie les `num_results` premières pages, chacune avec son titre, son URL et ses extraits les plus pertinents. |
    | `get_page`   | Récupère le texte intégral d&#39;une URL précise — un résultat prometteur de `web_search`, ou une URL fournie par l&#39;utilisateur.                 |

    `web_search` renvoie de courts extraits (les highlights Exa) plutôt que le texte intégral des pages : passer en revue plusieurs sources reste donc peu coûteux, l&#39;agent lisant ensuite la page retenue avec `get_page`. Une URL ou une question qui ne renvoie aucun contenu, une limite de débit atteinte ou une défaillance passagère sont remontées au modèle sous la forme d&#39;un `ModelRetry`, ce qui permet au run de se poursuivre ; les échecs d&#39;authentification (401/403) se propagent comme des erreurs de configuration.
  </Step>

  <Step title="Activer la deep search (facultatif)">
    `deep_search` exécute la [deep search](/fr/docs/search/quickstart) multi-étapes d&#39;Exa (`type='deep'`) : Exa décompose la question en plusieurs requêtes, lance les recherches et renvoie une réponse étayée par des citations en un seul appel d&#39;outil. Elle demande plus de temps et une profondeur de recherche supérieure à `web_search` : elle est donc désactivée par défaut. Activez-la explicitement :

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    Une fois activée, les instructions de la capability indiquent au modèle de traiter `deep_search` comme une escalade depuis `web_search`, et non comme un remplacement.
  </Step>
</Steps>

***

<div id="configuration">
  ## Configuration
</div>

Chaque champ d&#39;`ExaSearch` avec sa valeur par défaut :

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # résultats par appel web_search (1 à 100)
    max_text_chars=10_000,     # limite de texte de get_page, en caractères (1 à 10 000)
    text_summary=False,        # web_search renvoie aussi un résumé textuel synthétisé
    include_deep_search=False, # expose également l'outil deep_search
    include_domains=[],        # rechercher uniquement dans ces domaines (liste d'autorisation)
    exclude_domains=[],        # ne jamais rechercher dans ces domaines (liste de blocage)
    guidance=None,             # None = instructions par défaut, '' = aucune, str = personnalisée
    client=None,               # ExaClient -- None construit exa_py.AsyncExa à partir de EXA_API_KEY
)
```

`include_domains` et `exclude_domains` s&#39;appliquent à `web_search` et `deep_search`, et sont mutuellement exclusifs. Des limites hors plage ou la définition simultanée des deux listes de domaines déclenchent une erreur à la construction.

<div id="text-summary">
  ### Résumé textuel
</div>

Définissez `text_summary` pour que chaque appel à `web_search` demande également un résumé synthétisé en texte brut des résultats. Indiquez `True` pour un résumé libre, ou une chaîne décrivant le format souhaité :

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

La structure de retour du tool reste inchangée : lorsque Exa renvoie un summary, celui-ci est ajouté en tête sous forme de ligne `Summary:`.

<div id="structured-citations">
  ### Citations structurées
</div>

Chaque tool renvoie un `ToolReturn` : `return_value` contient le texte lisible vu par le modèle (y compris les blocs `Sources:`), tandis que `metadata` contient les sources sous forme de records `ExaSource` structurés (`{'url': ..., 'title': ...}`), sous la clé `'sources'`. Les metadata ne sont jamais envoyées au modèle : l&#39;affichage des citations ne nécessite donc aucune analyse de texte :

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
  ### Client personnalisé
</div>

Le client par défaut est `exa_py.AsyncExa`, configuré à partir de `EXA_API_KEY`. Passez n&#39;importe quel objet conforme au protocole `ExaClient` pour définir explicitement l&#39;authentification ou l&#39;URL de base, ou pour utiliser un objet factice dans les tests :

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

<div id="exa-agent-runs">
  ## Exa agent runs
</div>

L&#39;[API Exa Agent](/fr/docs/agent/quickstart) exécute de manière asynchrone des tâches de recherche ouvertes. La capability `ExaAgent` projette ce cycle de vie sur les [deferred tool calls](https://pydantic.dev/docs/ai/deferred-tools/) de Pydantic AI : son tool `exa_agent` crée le run puis diffère son exécution, en transmettant l&#39;identifiant du run Exa dans les metadata du deferred call.

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

Par défaut (`execution='inline'`), la capability résout elle-même ses appels différés au sein de l&#39;agent run en interrogeant le run Exa jusqu&#39;à son achèvement : le tool se comporte donc comme un tool classique (quoique lent). Avec `execution='external'`, les appels remontent sous forme de sortie `DeferredToolRequests`, à charge pour l&#39;application hôte de les résoudre en dehors du flux.

Chaque field d&#39;`ExaAgent` avec sa valeur par défaut :

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None = valeur par défaut de l'API
    execution='inline',   # 'inline' effectue le polling jusqu'à la fin ; 'external' remonte des DeferredToolRequests
    output_schema=None,   # classe BaseModel ou schéma dict pour la sortie structurée
    system_prompt=None,   # transmis au run de l'agent Exa
    poll_interval=1000,   # ms entre deux polls lors d'une résolution inline
    timeout_ms=3_600_000, # ms d'attente d'un run lors d'une résolution inline
    guidance=None,        # None = instructions par défaut, '' = aucune, str = personnalisées
    runs=None,            # ExaAgentRuns -- None construit AsyncExa().agent.runs à partir de EXA_API_KEY
)
```

***

<div id="agent-spec-yamljson">
  ## Agent spec (YAML/JSON)
</div>

Les deux capabilities fonctionnent avec l&#39;[agent spec](https://pydantic.dev/docs/ai/agents/#agent-spec) de Pydantic AI : vous pouvez donc les déclarer dans un fichier de configuration plutôt qu&#39;en Python :

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

Transmettez `custom_capability_types` pour que le chargeur de spécification sache comment instancier les capabilities. Les instances chargées depuis une spécification construisent toujours le client par défaut à partir de `EXA_API_KEY`.

***

<div id="next">
  ## Pour aller plus loin
</div>

* [**Search API**](/fr/docs/search/quickstart) - Recherche sémantique avec highlights, summaries et deep search
* [**Agent API**](/fr/docs/agent/quickstart) - Runs de recherche asynchrones et ouverts
* [**Configuration MCP**](/fr/docs/get-started/exa-mcp) - Le MCP server hébergé par Exa
* [**SDK**](/fr/docs/sdks/quickstart) - Documentation des SDK Python et JavaScript