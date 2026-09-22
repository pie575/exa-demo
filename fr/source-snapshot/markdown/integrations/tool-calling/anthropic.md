> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Anthropic Tool Calling {#anthropic-tool-calling}

> Utilisez le tool use de Claude pour ajouter Exa web search et les page contents à votre application.

<Card title="Quickstart agent de code" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Vous découvrez Exa ? Lancez-vous en moins d&#39;une minute.
</Card>

***

Le [tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) de Claude permet aux modèles d&#39;appeler des fonctions que vous définissez dans votre code. Les SDK Exa intègrent des tools de recherche web et de lecture de pages prêts à l&#39;emploi pour Anthropic : vous n&#39;avez donc pas à écrire vous-même le schéma de tool, à analyser les blocs `tool_use` ni à formater les résultats Exa.

## Démarrer {#get-started}

<Steps>
  <Step title="Installer les SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install anthropic exa_py
      ```

      ```bash JavaScript theme={null}
      npm install @anthropic-ai/sdk exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Configurer vos API keys">
    Définissez les variables d&#39;environnement `EXA_API_KEY` et `ANTHROPIC_API_KEY`. Rendez-vous sur la [console Anthropic](https://console.anthropic.com/settings/keys) et sur le [Exa Dashboard](https://dashboard.exa.ai/api-keys) pour générer vos API keys.

    <Card title="Obtenir votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
    </Card>
  </Step>

  <Step title="Ajouter les tools Exa à votre loop d'outils">
    Passez les tools dans la liste `tools` de la requête, puis transmettez le message de l&#39;assistant à `handle_tool_use`. La fonction exécute chaque bloc `tool_use` du message et renvoie les blocs `tool_result` correspondants, prêts à être renvoyés dans le message utilisateur suivant.

    `web_search` recherche sur le web des pages que le modèle n&#39;a pas encore vues ; `get_contents` lit les pages dont il possède déjà les URL, qu&#39;elles proviennent d&#39;une recherche antérieure ou de l&#39;utilisateur. Enregistrez l&#39;un des deux, ou les deux.

    <CodeGroup>
      ```python Python theme={null}
      import anthropic
      from exa_py import Exa

      exa = Exa()  # lit EXA_API_KEY depuis l'environnement
      claude = anthropic.Anthropic()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )

      messages.append({"role": "assistant", "content": response.content})
      messages.append(
          {"role": "user", "content": exa.anthropic.handle_tool_use(response)}
      )

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )
      print(response.content[0].text)
      ```

      ```javascript JavaScript theme={null}
      import Anthropic from "@anthropic-ai/sdk";
      import Exa from "exa-js";

      const exa = new Exa(); // lit EXA_API_KEY depuis l'environnement
      const anthropic = new Anthropic();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });

      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: await exa.anthropic.handleToolUse(response),
      });

      response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });
      console.log(response.content[0].text);
      ```
    </CodeGroup>

    Cet exemple ne comporte qu&#39;un seul tour, par souci de concision. Un agent réel conserve `tools` sur chaque requête et répète l&#39;étape du handler jusqu&#39;à ce que le modèle réponde sans bloc `tool_use` : c&#39;est ainsi qu&#39;un résultat de recherche débouche sur une lecture de page en follow-up.

    Appeler les factories sans argument applique les valeurs par défaut recommandées par Exa : `type="auto"` avec `contents={"highlights": True}` pour la recherche. Les highlights renvoient des extraits pertinents par rapport à la requête : ils ne limitent pas le texte de la page à 10 000 caractères. La factory de contenu renvoie le texte de la page ; la limite de 10 000 caractères du SDK ne s&#39;applique qu&#39;à `text`, et uniquement si vous omettez `max_characters`.
  </Step>
</Steps>

## Configuration des tools {#configuring-the-tools}

Les arguments nommés sont des options Exa classiques, transmises au moment de l&#39;exécution du tool : les options de recherche à `exa.search()`, les options de contenu à `exa.get_contents()` :

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.anthropic.web_search(category="news", contents={"text": True}),
      exa.anthropic.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.anthropic.webSearch({ category: "news", contents: { text: true } }),
    exa.anthropic.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

Le modèle choisit la `query` de recherche et les `urls` à lire ; tout le reste est fixé à la création du tool, il ne peut donc pas modifier ce qui est exploré ou extrait.

`name` (dont la valeur par défaut est `"web_search"` ou `"get_contents"`) et `description` remplacent quant à eux la définition du tool telle que le modèle la voit. Anthropic exige que les noms de tools soient uniques : un nom personnalisé permet donc d&#39;exécuter le tool Exa aux côtés du tool serveur intégré `web_search_20250305` d&#39;Anthropic, qui réserve le nom `web_search` :

<CodeGroup>
  ```python Python theme={null}
  response = claude.messages.create(
      model="claude-sonnet-4-6",
      max_tokens=1024,
      messages=messages,
      tools=[
          exa.anthropic.web_search(name="exa_web_search"),
          {"type": "web_search_20250305", "name": "web_search", "max_uses": 5},
      ],
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages,
    tools: [
      exa.anthropic.webSearch({ name: "exa_web_search" }),
      { type: "web_search_20250305", name: "web_search", max_uses: 5 },
    ],
  });
  ```
</CodeGroup>

## Combiner vos propres tools {#mixing-in-your-own-tools}

`handle_tool_use` répond à chaque bloc `tool_use` du message : un bloc désignant un outil qu&#39;il ne parvient pas à résoudre reçoit un résultat `Error: unknown tool "<name>"` plutôt que d&#39;être ignoré, si bien que la requête de suivi n&#39;omet jamais un résultat d&#39;outil requis. Si vous exécutez vos propres tools en parallèle de ceux d&#39;Exa, remplacez ces résultats d&#39;erreur par les vôtres avant la requête suivante.

## Écrire la loop à la main {#writing-the-loop-by-hand}

Si vous préférez gérer vous-même le schéma d&#39;outil et l&#39;exécution, définissez l&#39;outil et traitez les blocs `tool_use` manuellement. `exa.tools.web_search()` et `exa.tools.get_contents()` vous fournissent les mêmes spécifications d&#39;outil indépendantes du fournisseur (avec une méthode `run`) pour vos loops faites main, ou bien vous pouvez tout écrire de zéro :

```python Python theme={null}
TOOLS = [
    {
        "name": "exa_search",
        "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to perform.",
                },
            },
            "required": ["query"],
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_use(response):
    results = []
    for block in response.content:
        if block.type == "tool_use" and block.name == "exa_search":
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(exa_search(**block.input)),
                }
            )
    return results
```

Consultez le [Quickstart SDK](/fr/docs/sdks/quickstart) pour découvrir les options de search et de contenu en Python et en TypeScript.