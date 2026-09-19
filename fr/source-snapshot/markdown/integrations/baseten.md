> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="baseten">
  # Baseten
</div>

> Ancrez les modèles open source des Model APIs de Baseten avec Exa web search via les Hosted Tools de Baseten.

Exa est un fournisseur de web search dans les [Hosted Tools de Baseten](https://www.baseten.co/blog/introducing-baseten-hosted-tools/). Les Model APIs de Baseten donnent accès à des modèles open source, et les Hosted Tools permettent à ces modèles d&#39;effectuer des recherches sur le web sans que vous ayez à mettre en place une boucle d&#39;outils : vous ajoutez un sélecteur d&#39;outil Exa à une requête standard, Baseten exécute conjointement le modèle et les recherches Exa dans une boucle côté serveur, et vous obtenez une réponse grounded au sein de cette même réponse. Aucune API key Exa n&#39;est nécessaire. Baseten répercute le coût d&#39;Exa sur votre facture Baseten, sans marge.

<div id="use-the-exa-web-search-tools">
  ## Utiliser les outils Exa web search
</div>

Définissez le header `x-baseten-server-tools: true` et ajoutez un ou plusieurs sélecteurs Exa à votre tableau `tools`. Seul le `type` est nécessaire : Baseten développe automatiquement le tool schema, et le modèle décide quand effectuer une search, quoi rechercher et quelles pages lire. Les server-side tools fonctionnent avec les endpoints [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions), [Messages](https://docs.baseten.co/reference/inference-api/messages) et Responses de Baseten, en mode bufferisé ou streaming.

<CodeGroup>
  ```python Python theme={null}
  from openai import OpenAI

  client = OpenAI(
      api_key="<BASETEN_API_KEY>",
      base_url="https://inference.baseten.co/v1",
      default_headers={"x-baseten-server-tools": "true"},
  )

  response = client.chat.completions.create(
      model="zai-org/GLM-5.3-Fast",
      messages=[
          {"role": "user", "content": "What were the major AI announcements this week?"}
      ],
      tools=[
          {"type": "baseten__exa__web_search_exa"},
          {"type": "baseten__exa__web_fetch_exa"},
      ],
      extra_body={"baseten": {"tool_settings": {"max_react_iterations": 5}}},
  )

  print(response.choices[0].message.content)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const client = new OpenAI({
    apiKey: "<BASETEN_API_KEY>",
    baseURL: "https://inference.baseten.co/v1",
    defaultHeaders: { "x-baseten-server-tools": "true" },
  });

  const response = await client.chat.completions.create({
    model: "zai-org/GLM-5.3-Fast",
    messages: [
      { role: "user", content: "What were the major AI announcements this week?" },
    ],
    tools: [
      { type: "baseten__exa__web_search_exa" },
      { type: "baseten__exa__web_fetch_exa" },
    ],
    baseten: { tool_settings: { max_react_iterations: 5 } },
  });

  console.log(response.choices[0].message.content);
  ```

  ```bash cURL theme={null}
  curl https://inference.baseten.co/v1/chat/completions \
    -H "Authorization: Bearer <BASETEN_API_KEY>" \
    -H "Content-Type: application/json" \
    -H "x-baseten-server-tools: true" \
    -d '{
      "model": "zai-org/GLM-5.3-Fast",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [
        { "type": "baseten__exa__web_search_exa" },
        { "type": "baseten__exa__web_fetch_exa" }
      ],
      "baseten": { "tool_settings": { "max_react_iterations": 5 } }
    }'
  ```
</CodeGroup>

Trois outils Exa sont disponibles. Donnez au modèle la search et le fetch lorsqu&#39;il doit d&#39;abord trouver des sources, puis lire les pages qu&#39;il retient.

| Sélecteur                               | Ce que le modèle obtient                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `baseten__exa__web_search_exa`          | [Exa search](/fr/docs/search/quickstart) : résultats pertinents avec le page content pour une query |
| `baseten__exa__web_search_advanced_exa` | Search avec filtres de domaine, exploration des sous-pages et summary facultatif par résultat    |
| `baseten__exa__web_fetch_exa`           | [Page contents complet](/fr/docs/contents/quickstart) pour une URL déjà connue du modèle            |

Les sélecteurs ne prennent aucun field supplémentaire : le modèle renseigne les arguments de l&#39;outil à partir du schema d&#39;Exa. Servez-vous du system prompt pour orienter la politique de search : quand lancer une search, s&#39;il faut récupérer les sources primaires et comment citer. Utilisez `baseten.tool_settings` pour borner la boucle :

| Paramètre                      | À utiliser pour                                                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_react_iterations`         | Limiter les itérations du modèle par requête (12 par défaut, plage de 2 à 20). La dernière itération est réservée à la réponse : `N` autorise donc `N - 1` tours de tool calls. |
| `max_tool_calls_per_iteration` | Limiter les appels de server-side tools dans une même itération (10 par défaut, plage de 1 à 10)                                                                                |

<div id="how-results-come-back">
  ## Comment les résultats sont renvoyés
</div>

La réponse finale arrive via le champ habituel de l&#39;endpoint. Les appels Exa terminés sont consignés selon le protocole : blocs `tool_use` et `tool_result` sur Messages, éléments `mcp_call` sur Responses, et `baseten.iterations[].continuation_messages` sur Chat Completions. Les requêtes en streaming reçoivent chaque appel de search et chaque résultat sous forme de server-sent events pendant l&#39;exécution de la boucle, ce qui permet d&#39;afficher la progression avant l&#39;arrivée de la réponse. Le tableau `baseten.request.server_tool_calls[]` indique l&#39;issue de chaque appel Exa de la requête.

<div id="pricing">
  ## Tarification
</div>

Les appels Exa sont facturés sur votre compte Baseten au tarif d&#39;Exa, sans majoration, en plus du coût des tokens du modèle : environ 0,007 $ par recherche et 0,001 $ par URL récupérée. Exa communique le montant de chaque appel à l&#39;exécution ; les appels individuels peuvent donc s&#39;écarter de ces valeurs. Les appels d&#39;outils facturés apparaissent dans les paramètres de l&#39;espace de travail Baseten, sous Billing → Usage, regroupés par fournisseur. Consultez le [tableau tarifaire de Baseten](https://docs.baseten.co/inference/model-apis/web-search#pricing) pour connaître les tarifs en vigueur.

Les Hosted Tools sont en accès anticipé sur Baseten, avec une limite de 25 requêtes par minute et par organisation. Essayez Exa search dans le [playground Baseten](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground), ou contactez Baseten pour relever cette limite en vue de charges de travail en production.

<div id="resources">
  ## Ressources
</div>

<Columns cols={2}>
  <Card title="Documentation web search de Baseten" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="Ouvrir la documentation" arrow="true">
    Exemples exécutables Messages, Responses et Chat Completions utilisant des server-side tools.
  </Card>

  <Card title="Référence des server-side tools" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="Ouvrir la référence" arrow="true">
    Catalogue de tools, paramètres de boucle, formats `tool_choice` et structures de réponse.
  </Card>
</Columns>