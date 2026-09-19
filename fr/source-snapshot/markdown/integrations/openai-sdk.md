> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="openai-sdk-compatibility">
  # Compatibilité avec le SDK OpenAI
</div>

> Utilisez les endpoints d&#39;Exa comme substitut direct d&#39;OpenAI — avec prise en charge des API chat completions et responses.

<Card title="Quickstart agent de code" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Vous découvrez Exa ? Lancez-vous en moins d&#39;une minute.
</Card>

***

<div id="overview">
  ## Vue d&#39;ensemble
</div>

Exa fournit des endpoints compatibles OpenAI qui fonctionnent avec le SDK OpenAI :

| Endpoint            | Interface OpenAI     | Modèles disponibles | Cas d&#39;usage                                             |
| ------------------- | -------------------- | ------------------- | ----------------------------------------------------------- |
| `/chat/completions` | Chat Completions API | `exa`               | Interface de conversation traditionnelle                    |
| `/responses`        | Responses API        | `exa-agent`         | API Exa Agent (recherche asynchrone, enrichment, list-building) |

<Info>
  `/chat/completions` est routé vers [`/answer`](/fr/docs/reference/answer), et `/responses` vers l&#39;[API Exa Agent](/fr/docs/agent/quickstart). Voir [Agent via Responses API](#agent-via-responses-api) ci-dessous.
</Info>

<div id="answer">
  ## Answer
</div>

Pour utiliser l&#39;endpoint `/answer` d&#39;Exa via l&#39;interface chat completions :

1. Remplacez l&#39;URL de base par `https://api.exa.ai`
2. Remplacez l&#39;API key par votre Exa API key
3. Remplacez le nom du modèle par `exa`.

<Info>
  Consultez la référence complète de l&#39;endpoint [`/answer`](/fr/docs/reference/answer). Pour un comportement de routage personnalisé, contactez [hello@exa.ai](mailto:hello@exa.ai).
</Info>

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
    base_url="https://api.exa.ai", # utiliser exa comme URL de base
    api_key=os.environ["EXA_API_KEY"],
  )

  completion = client.chat.completions.create(
    model="exa",
    messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ],

  # utiliser extra_body pour transmettre des paramètres supplémentaires à l'endpoint /answer
    extra_body={
      "text": True # inclure le texte intégral des sources
    }
  )

  print(completion.choices[0].message.content)  # afficher le contenu de la réponse
  print(completion.choices[0].message.citations)  # afficher les citations
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai", // utiliser exa comme URL de base
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: "exa",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "What are the latest developments in quantum computing?",
        },
      ],
      store: true,
      stream: true,
      extra_body: {
        text: true, // inclure le texte intégral des sources
      },
    });

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s https://api.exa.ai/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "model": "exa",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "What are the latest developments in quantum computing?"
        }
      ],
      "text": true
    }'
  ```
</CodeGroup>

<div id="agent-via-responses-api">
  ## Agent via l&#39;API Responses
</div>

L&#39;endpoint [`/responses`](https://api.exa.ai/responses) d&#39;Exa expose l&#39;[API Exa Agent](/fr/docs/agent/quickstart) via l&#39;interface OpenAI Responses : les SDK OpenAI fonctionnent donc avec lui sans aucune modification. Définissez `model: "exa-agent"` et choisissez un mode d&#39;exécution :

| Mode       | Requête                                 | Comportement                                                                                                                      |
| ---------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Synchrone  | par défaut (sans `stream`/`background`) | La requête est bloquante et renvoie l&#39;objet `response` terminé.                                                               |
| Streaming  | `stream: true`                          | La requête diffuse les événements OpenAI Responses (SSE) au fil de la progression du run, et se termine par `response.completed`. |
| Background | `background: true`                      | La requête renvoie immédiatement une réponse `in_progress` ; interrogez `GET /responses/{id}` pour obtenir le résultat.           |

Définissez `reasoning.effort` (`minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, `max`) pour arbitrer entre coût et profondeur, et annulez un run avec `POST /responses/{id}/cancel`. Pour `max`, définissez `Exa-Beta: agent-max-effort-2026-07-27` comme header par défaut du client. Le [guide Agent](/fr/docs/agent/quickstart) détaille le modèle de run, la structure de l&#39;output et la tarification par effort sur lesquels repose cette interface.

<Warning>
  Les runs dont le `reasoning.effort` vaut `high`, `xhigh` ou `max` durent trop longtemps pour une requête synchrone et renvoient `400`. Utilisez `stream: true` ou `background: true` pour ces runs. `/responses` ne dispose pas de field `budget` ; max applique son plafond par run par défaut.
</Warning>

Utilisez `previous_response_id` pour poursuivre un run Responses terminé.

<div id="synchronous">
  ### Synchrone
</div>

La requête reste bloquante jusqu&#39;à la fin du run, puis renvoie l&#39;objet `response` final.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning={"effort": "medium"},
  )

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning: { effort: "medium" },
    });

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "reasoning": { "effort": "medium" }
    }'
  ```
</CodeGroup>

<div id="streaming">
  ### Streaming
</div>

Définissez `stream: true` pour recevoir les événements de flux Responses via SSE. Les événements portent un `sequence_number` monotone et se terminent par `response.completed` ; il n&#39;y a pas de sentinelle `[DONE]`. Le flux peut contenir des lignes de commentaire `: keep-alive`, que les clients SSE ignorent.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  with client.responses.stream(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
  ) as stream:
      for event in stream:
          if event.type == "response.output_text.delta":
              print(event.delta, end="", flush=True)
      final = stream.get_final_response()

  print("\n\n", final.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const stream = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
      }
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -N -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -H 'Accept: text/event-stream' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "stream": true
    }'
  ```
</CodeGroup>

<div id="background">
  ### Background
</div>

Définissez `background: true` pour démarrer un run sans maintenir la connexion ouverte, puis interrogez `GET /responses/{id}` (poll) jusqu&#39;à ce qu&#39;il atteigne un status terminal. Pour utiliser le streaming plutôt que le polling, consultez [Streaming](#streaming).

<CodeGroup>
  ```python Python theme={null}
  import os
  import time
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      background=True,
  )

  # Interroger jusqu'à la fin du traitement
  while response.status in ("queued", "in_progress"):
      time.sleep(5)
      response = client.responses.retrieve(response.id)

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    let response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      background: true,
    });

    // Interroger jusqu'à la fin du traitement
    while (response.status === "queued" || response.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 5000));
      response = await openai.responses.retrieve(response.id);
    }

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  # Créer un run en arrière-plan
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "background": true
    }'

  # Interroger avec l'ID de réponse renvoyé
  curl -s 'https://api.exa.ai/responses/resp_agent_run_...' \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="chat-wrapper">
  ## Chat wrapper
</div>

Exa fournit un wrapper Python qui enrichit automatiquement n&#39;importe quelle complétion de chat OpenAI avec des capacités de RAG. En une seule ligne de code, vous pouvez transformer n&#39;importe quelle complétion de chat OpenAI en un système RAG propulsé par Exa, qui gère automatiquement la search, le découpage en fragments et le prompting.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI
  from exa_py import Exa

  # Initialiser les clients
  openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
  exa = Exa(api_key=os.environ["EXA_API_KEY"])

  # Envelopper le client OpenAI
  exa_openai = exa.wrap(openai)

  # Utiliser exactement comme le client OpenAI normal
  completion = exa_openai.chat.completions.create(
      model="gpt-5.6-sol",
      messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

Le client enveloppé s&#39;utilise exactement comme le client OpenAI natif, à ceci près qu&#39;il enrichit automatiquement vos complétions avec des résultats de search pertinents lorsque c&#39;est nécessaire.

Le wrapper prend en charge tous les parameters de la fonction `exa.search()`.

```python theme={null}
completion = exa_openai.chat.completions.create(
    model="gpt-5.6-sol",
    messages=messages,
    use_exa="auto",              # "auto", "required" ou "none"
    num_results=5,               # 3 par défaut
    result_max_len=1024,         # 2048 caractères par défaut
    include_domains=["arxiv.org"],
    category="publication",
    start_published_date="2019-01-01"
)
```