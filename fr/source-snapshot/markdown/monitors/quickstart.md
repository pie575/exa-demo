> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="monitors-api">
  # API Monitors
</div>

> Exécutez des recherches récurrentes et recevez les nouveaux résultats découverts via webhook.

Les monitors exécutent des recherches Exa selon une schedule récurrente et envoient les résultats vers un endpoint webhook.

Utilisez les Monitors pour suivre l&#39;actualité, les annonces de concurrents, les levées de fonds, les évolutions réglementaires, les publications
de recherche ou tout autre sujet qui évolue dans le temps.

<div id="how-monitors-work">
  ## Fonctionnement des Monitors
</div>

À chaque run, Exa exécute la search configurée, applique un filtre temporel, écarte les résultats ou observations déjà renvoyés par le monitor, puis envoie le nouvel output à votre webhook.

Chaque monitor conserve son propre historique de runs : rédigez donc la query autour du signal continu que vous souhaitez suivre, plutôt que d&#39;y ajouter vous-même une plage de dates glissante.

<div id="create-your-first-monitor">
  ## Créez votre premier monitor
</div>

Créez un monitor avec une query de search, un intervalle et l&#39;endpoint HTTPS qui recevra les
mises à jour :

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  monitor = exa.monitors.create({
      "name": "Battery recycling expansion",
      "search": {
          "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
          "type": "interval",
          "period": "1d",
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"],
      },
  })

  print(monitor.id)
  print(monitor.webhook_secret)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const monitor = await exa.monitors.create({
    name: "Battery recycling expansion",
    search: {
      query: "new battery recycling facilities announced in North America"
    },
    trigger: {
      type: "interval",
      period: "1d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });

  console.log(monitor.id);
  console.log(monitor.webhookSecret);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "Battery recycling expansion",
      "search": {
        "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
        "type": "interval",
        "period": "1d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<Accordion title="Exemple de réponse">
  ```json theme={null}
  {
    "id": "01k4d9w6y3h7p2m8n5q1r0s4tv",
    "name": "Battery recycling expansion",
    "status": "active",
    "search": {
      "query": "new battery recycling facilities announced in North America"
    },
    "trigger": {
      "type": "interval",
      "period": "1d"
    },
    "outputSchema": null,
    "metadata": null,
    "webhook": {
      "url": "https://example.com/webhooks/exa",
      "events": ["monitor.run.completed"]
    },
    "nextRunAt": null,
    "createdAt": "2026-09-05T20:00:00.000Z",
    "updatedAt": "2026-09-05T20:00:00.000Z",
    "webhookSecret": "<one-time-webhook-signing-secret>"
  }
  ```
</Accordion>

Conservez le `webhookSecret` au moment de la création du monitor : il n&#39;est renvoyé qu&#39;une seule fois et il est
indispensable pour vérifier les signatures des webhooks.

<div id="configure-the-output">
  ## Configurer l’output
</div>

Chaque run terminé renvoie les pages nouvellement découvertes dans `output.results`.

Exa synthétise également les informations de chaque page dans `output.content` :

| Forme d’output | Utilisation                     | Valeur renvoyée                               |
| --------------- | ------------------------------- | --------------------------------------------- |
| Résumé textuel  | Par défaut                      | Une chaîne dans `output.content`              |
| JSON structuré  | Ajoutez un objet `outputSchema` | JSON conforme au schema dans `output.content` |

Les sources des champs synthétisés sont renvoyées automatiquement dans `output.grounding`.

Ajoutez `outputSchema` lorsque le code en aval a besoin de champs
cohérents :

```json theme={null}
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "announcements": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "company": { "type": "string" },
            "location": { "type": "string" },
            "announcement": { "type": "string" }
          },
          "required": ["company", "location", "announcement"]
        }
      }
    },
    "required": ["announcements"]
  }
}
```

N&#39;incluez pas les citations ni le niveau de confiance dans le schema. Ils sont renvoyés séparément dans
`output.grounding`.

<div id="add-page-content">
  ## Ajouter le contenu des pages
</div>

`search` accepte les mêmes options qu&#39;[Exa Search](/fr/docs/search/quickstart) : utilisez `contents` pour inclure
les highlights, le full text ou les summaries avec chaque résultat, et `includeDomains` ou `excludeDomains` pour
restreindre les sources.

<CodeGroup>
  ```python Python theme={null}
  monitor = exa.monitors.create({
      "name": "LLM Research Tracker",
      "search": {
          "query": "new large language model training techniques and architectures",
          "numResults": 10,
          "contents": {
              "highlights": True
          }
      },
      "trigger": {
          "type": "interval",
          "period": "7d"
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"]
      }
  })
  ```

  ```javascript JavaScript theme={null}
  const monitor = await exa.monitors.create({
    name: "LLM Research Tracker",
    search: {
      query: "new large language model training techniques and architectures",
      numResults: 10,
      contents: {
        highlights: true
      }
    },
    trigger: {
      type: "interval",
      period: "7d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "LLM Research Tracker",
      "search": {
        "query": "new large language model training techniques and architectures",
        "numResults": 10,
        "contents": {
          "highlights": true
        }
      },
      "trigger": {
        "type": "interval",
        "period": "7d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<div id="test-your-monitor">
  ## Testez votre monitor
</div>

Déclenchez un run immédiatement au lieu d&#39;attendre la prochaine exécution planifiée, puis listez ses runs :

<CodeGroup>
  ```python Python theme={null}
  exa.monitors.trigger(monitor.id)

  runs = exa.monitors.runs.list(monitor.id, limit=1)
  latest = runs.data[0]
  print(latest.id, latest.status)
  ```

  ```javascript JavaScript theme={null}
  await exa.monitors.trigger(monitor.id);

  const runs = await exa.monitors.runs.list(monitor.id, { limit: 1 });
  const latest = runs.data[0];
  console.log(latest.id, latest.status);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors/$MONITOR_ID/trigger" \
    -H "Authorization: Bearer $EXA_API_KEY"

  curl -s "https://api.exa.ai/monitors/$MONITOR_ID/runs?limit=1" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

Les statuts de run possibles sont :

| Statut      | Signification                                                                               |
| ----------- | ------------------------------------------------------------------------------------------- |
| `pending`   | Le run est en file d&#39;attente                                                            |
| `running`   | Le run est en cours d&#39;exécution                                                         |
| `completed` | Le run est terminé ; récupérez-le par son ID pour consulter l&#39;intégralité de son output |
| `failed`    | Le run a échoué ; `failReason` en indique la raison                                         |
| `cancelled` | Le run a été annulé                                                                         |

`output` reste null tant que le run n&#39;est pas terminé.

<div id="schedule-runs">
  ## Planifier les runs
</div>

L&#39;intervalle minimal est d&#39;une heure. Utilisez une durée unique telle que `1h`, `6h`, `1d` ou `7d`. Le
schedule est calé sur la date de création du monitor — un monitor quotidien créé à 14 h 30 s&#39;exécute
chaque jour aux alentours de 14 h 30 — mais chaque run peut être retardé de 30 minutes au maximum : ne vous fiez donc pas à une
heure de livraison exacte.

Omettez `trigger` pour créer un monitor déclenché uniquement manuellement. Mettre en pause un monitor planifié interrompt également les runs
automatiques, tout en conservant les déclenchements manuels.

<Note>
  Les monitor runs ne se chevauchent pas. Si le run planifié suivant démarre alors que le précédent est
  encore en cours, Exa annule ce dernier.
</Note>

<div id="receive-webhook-updates">
  ## Recevoir les mises à jour par webhook
</div>

Abonnez-vous à `monitor.run.completed` si vous n&#39;avez besoin que des runs terminés. Si vous omettez `events`, Exa
envoie également les événements de cycle de vie du monitor et les événements de création de run.

Le payload d&#39;un run terminé contient le status et l&#39;output du run. Les `metadata` facultatives du monitor sont
reprises dans les livraisons de webhook, ce qui vous permet d&#39;acheminer une mise à jour vers le bon client,
espace de travail, canal ou traitement interne.

<Accordion title="Payload du webhook de run terminé">
  L&#39;output et les timestamps sont abrégés ci-dessous.

  ```json theme={null}
  {
    "id": "event_...",
    "object": "event",
    "type": "monitor.run.completed",
    "data": {
      "id": "01k...",
      "monitorId": "01k...",
      "status": "completed",
      "output": {
        "results": [
          {
            "title": "New battery recycling facility announced",
            "url": "https://example.com/announcement"
          }
        ],
        "content": "...",
        "grounding": [
          {
            "field": "content",
            "citations": [
              {
                "title": "New battery recycling facility announced",
                "url": "https://example.com/announcement"
              }
            ],
            "confidence": "high"
          }
        ]
      },
      "failReason": null,
      "metadata": {
        "workspace_id": "workspace_123"
      }
    },
    "createdAt": "2026-09-05T20:00:00.000Z"
  }
  ```
</Accordion>

<Warning>
  Votre webhook doit utiliser HTTPS et constituer la destination finale, car les redirections ne sont pas suivies.
  Vérifiez `Exa-Signature` avant de traiter l&#39;événement.
</Warning>

Chaque livraison inclut un header `Exa-Signature` de la forme `t=<timestamp>,v1=<signature>`.
Construisez `<timestamp>.<raw-request-body>`, calculez son empreinte HMAC-SHA256 avec le
`webhookSecret` à usage unique, puis comparez le résultat à `v1` à l&#39;aide d&#39;une comparaison à temps constant.

<CodeGroup>
  ```python Python theme={null}
  import hashlib
  import hmac


  def verify_webhook(payload: bytes, signature_header: str, secret: str) -> bool:
      parts = dict(part.split("=", 1) for part in signature_header.split(","))
      signed_payload = parts["t"].encode() + b"." + payload
      expected = hmac.new(secret.encode(), signed_payload, hashlib.sha256).hexdigest()
      return hmac.compare_digest(expected, parts["v1"])
  ```

  ```javascript JavaScript theme={null}
  import crypto from "crypto";

  function verifyWebhook(payload, signatureHeader, secret) {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((part) => part.split("=", 2))
    );
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${parts.t}.`)
      .update(payload)
      .digest("hex");
    const actualBuffer = Buffer.from(parts.v1 ?? "", "hex");
    const expectedBuffer = Buffer.from(expected, "hex");

    return (
      actualBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    );
  }
  ```
</CodeGroup>

<div id="next-steps">
  ## Prochaines étapes
</div>

<Columns cols={2}>
  <Card title="Créer un monitor" icon="bell" href="/fr/docs/reference/monitors/create-a-monitor" cta="Ouvrir la référence" arrow="true">
    Découvrez tous les champs search, schedule, output, metadata et webhook.
  </Card>

  <Card title="Monitor runs" icon="clock" href="/fr/docs/reference/monitors/runs/get-a-run" cta="Ouvrir la référence" arrow="true">
    Inspectez le status, l&#39;output, le grounding et la cause d&#39;échec d&#39;un run.
  </Card>

  <Card title="Guide de la search" icon="search" href="/fr/docs/search/quickstart" cta="Ouvrir le guide" arrow="true">
    Configurez les queries, les filtres, les highlights, le full text et la freshness.
  </Card>

  <Card title="Bonnes pratiques de search" icon="sparkles" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Améliorez la qualité du retrieval tout en conservant un output ciblé.
  </Card>
</Columns>