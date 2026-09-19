> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour identifier toutes les pages disponibles avant d&#39;aller plus loin.

<div id="openai-tool-calling">
  # OpenAI Tool Calling
</div>

> Utilisez le tool calling d&#39;OpenAI pour ajouter la recherche web Exa et les contenus de page à votre application.

<Info>
  OpenAI recommande l&#39;API Responses pour tous les nouveaux projets. Consultez la section [API Responses](#responses-api) ci-dessous.
</Info>

Le [tool calling](https://platform.openai.com/docs/guides/function-calling?lang=python) d&#39;OpenAI permet aux modèles d&#39;appeler des fonctions que vous définissez dans votre code. Les SDK Exa fournissent des tools de recherche web et de lecture de page prêts à l&#39;emploi pour OpenAI : vous n&#39;avez donc pas à rédiger vous-même le tool schema, à analyser les tool calls ni à mettre en forme les résultats Exa.

<div id="get-started">
  ## Get started
</div>

<Steps>
  <Step title="Installer les SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install openai exa_py
      ```

      ```bash JavaScript theme={null}
      npm install openai exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Configurer vos API keys">
    Définissez les environment variables `EXA_API_KEY` et `OPENAI_API_KEY`. Rendez-vous sur le [dashboard OpenAI](https://platform.openai.com/api-keys) et le [dashboard Exa](https://dashboard.exa.ai/api-keys) pour générer vos API keys.

    <Card title="Obtenir votre Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une key dans le dashboard. Les nouveaux comptes démarrent avec des credits gratuits.
    </Card>
  </Step>

  <Step title="Ajouter les tools Exa à votre boucle de tools">
    Passez les tools dans la liste `tools` de la requête, puis transmettez le message de l&#39;assistant à `handle_tool_calls`. Cette fonction exécute chaque tool call Exa contenu dans le message et renvoie les messages `role: "tool"` correspondants, prêts à être ajoutés à la conversation.

    `web_search` recherche sur le web des pages que le modèle n&#39;a pas encore vues ; `get_contents` lit les pages dont il possède déjà les URL, qu&#39;elles proviennent d&#39;une search antérieure ou de l&#39;utilisateur. Enregistrez l&#39;un des deux, ou les deux.

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # lit EXA_API_KEY depuis l'environnement
      openai_client = OpenAI()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
          tools=[exa.openai.web_search(), exa.openai.get_contents()],
      )

      message = completion.choices[0].message
      messages.append(message)
      messages += exa.openai.handle_tool_calls(message)

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
      )
      print(completion.choices[0].message.content)
      ```

      ```javascript JavaScript theme={null}
      import Exa from "exa-js";
      import { OpenAI } from "openai";

      const exa = new Exa(); // lit EXA_API_KEY depuis l'environnement
      const openai = new OpenAI();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
        tools: [exa.openai.webSearch(), exa.openai.getContents()],
      });

      const message = completion.choices[0].message;
      messages.push(message, ...(await exa.openai.handleToolCalls(message)));

      completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
      });
      console.log(completion.choices[0].message.content);
      ```
    </CodeGroup>

    Cet exemple ne comporte qu&#39;un seul tour, par souci de concision. Un agent réel conserve `tools` dans chaque requête et répète l&#39;étape du handler jusqu&#39;à ce que le modèle réponde sans tool calls — c&#39;est ainsi qu&#39;un résultat de search débouche sur la lecture d&#39;une page en follow-up.

    Appeler les factories sans argument applique les valeurs par défaut recommandées par Exa : `type="auto"` avec `contents={"highlights": True}` pour la search. Les highlights renvoient des excerpts pertinents par rapport à la query — ils ne plafonnent pas le texte de la page à 10 000 caractères. La factory contents renvoie le texte de la page ; la limit de 10 000 caractères du SDK ne s&#39;applique qu&#39;à `text`, et uniquement si vous omettez `max_characters`.
  </Step>
</Steps>

<div id="responses-api">
  ## Responses API
</div>

Pour la Responses API d&#39;OpenAI, utilisez la factory `responses` avec le même helper `handle_tool_calls`. Le handler renvoie des éléments `function_call_output` destinés à une requête de suivi.

<CodeGroup>
  ```python Python theme={null}
  response = openai_client.responses.create(
      model="gpt-5.6",
      input=messages,
      tools=[exa.openai.responses.web_search(), exa.openai.responses.get_contents()],
  )

  messages += response.output
  messages += exa.openai.responses.handle_tool_calls(response)
  ```

  ```javascript JavaScript theme={null}
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: messages,
    tools: [exa.openai.responses.webSearch(), exa.openai.responses.getContents()],
  });

  messages.push(...response.output);
  messages.push(...(await exa.openai.responses.handleToolCalls(response)));
  ```
</CodeGroup>

<Note>
  Chat Completions et la Responses API utilisent des formats de tools différents et rejettent mutuellement ceux de l&#39;autre : utilisez donc la factory correspondant à l&#39;endpoint que vous appelez.
</Note>

<div id="configuring-the-tools">
  ## Configuration des tools
</div>

Les arguments nommés sont des options Exa classiques, transmises lors de l&#39;exécution du tool — les options de search à `exa.search()`, les options de contents à `exa.get_contents()` :

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.openai.web_search(category="news", contents={"text": True}),
      exa.openai.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.openai.webSearch({ category: "news", contents: { text: true } }),
    exa.openai.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

Le modèle choisit la `query` de search et les `urls` à lire ; tout le reste est fixé à la création du tool, ce qui l&#39;empêche de modifier ce qui est exploré ou extrait.

`name` (par défaut `"web_search"` et `"get_contents"`) et `description` remplacent quant à eux la définition du tool telle que le modèle la voit. Utilisez un `name` personnalisé pour exécuter en parallèle des tools Exa configurés différemment, ou pour éviter les conflits avec d&#39;autres tools qui réservent ces noms.

<div id="mixing-in-your-own-tools">
  ## Combiner vos propres tools
</div>

Les handlers répondent à chaque tool call du message : un appel désignant un tool qu&#39;ils ne savent pas résoudre reçoit la sortie `Error: unknown tool "<name>"` au lieu d&#39;être ignoré, si bien que la requête de follow-up n&#39;omet jamais une réponse de tool requise. Si vous exécutez vos propres tools en parallèle de ceux d&#39;Exa, remplacez ces sorties d&#39;erreur par vos propres résultats avant la requête suivante.

<div id="writing-the-loop-by-hand">
  ## Écrire la boucle à la main
</div>

Si vous préférez maîtriser vous-même le tool schema et l&#39;exécution, définissez le tool et traitez les calls manuellement. `exa.tools.web_search()` et `exa.tools.get_contents()` vous fournissent les mêmes spécifications de tool indépendantes du provider (avec une méthode `run`) pour vos boucles écrites à la main, ou bien vous pouvez tout écrire de zéro :

```python Python theme={null}
import json

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "exa_search",
            "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to perform.",
                    },
                },
                "required": ["query"],
            },
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_calls(tool_calls, messages):
    for tool_call in tool_calls:
        if tool_call.function.name == "exa_search":
            args = json.loads(tool_call.function.arguments)
            messages.append(
                {
                    "role": "tool",
                    "content": str(exa_search(**args)),
                    "tool_call_id": tool_call.id,
                }
            )
    return messages
```

Consultez le [quickstart SDK](/fr/docs/sdks/quickstart) pour les options de search et de contents en Python et en TypeScript.