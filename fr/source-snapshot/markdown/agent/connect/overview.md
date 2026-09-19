> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-connect">
  # Exa Connect
</div>

> Offrez à votre Exa Agent un accès en direct à des data partners premium, en complément d&#39;Exa web search, au cours d&#39;un même run.

Exa Connect intègre des data partners premium à la boucle de l&#39;Exa Agent. Attachez un
provider à un run : l&#39;Exa Agent interroge alors la base de données de ce partner en parallèle du web
search, puis combine les résultats en une seule réponse grounded et structurée.

Vous débutez avec les agent runs ? Commencez par le [guide Exa Agent](/fr/docs/agent/quickstart),
puis revenez ici pour attacher des data partners.

<Tip>
  L&#39;Exa Agent interroge déjà l&#39;intégralité du [data index](/fr/docs/search/data/overview), soit les mêmes
  sources d&#39;actualités, de code, d&#39;entreprises et de personnes que la Search API. Exa Connect y ajoute
  les bases de données de partners premium.
</Tip>

<Tip>
  Vous préférez MCP ? Exa Agent et [Exa Connect](/fr/docs/agent/connect/overview) sont disponibles dans [Exa MCP](/fr/docs/get-started/exa-mcp#exa-agent). Activez `tools=agent_run` pour lancer des recherches multi-étapes, du list-building, de l&#39;enrichment et du structured output depuis Claude, Cursor et d&#39;autres clients MCP.
</Tip>

<div id="why-exa-connect">
  ## Pourquoi Exa Connect
</div>

* **Des données premium sans intégrations séparées.** Accédez aux données des partners sans
  signer de contrat ni brancher un SDK. Vous appelez une seule API Exa.
* **Exa s&#39;occupe de la plomberie.** Nous prenons en charge l&#39;authentification des providers, la sélection des tools,
  les nouvelles tentatives et le classement des résultats.
* **L&#39;Exa Agent choisit la source.** Lorsque votre `outputSchema` demande
  « les visites mensuelles depuis Similarweb » ou « les officers vérifiés », l&#39;Exa Agent appelle le
  tool partner correspondant plutôt que de deviner à partir d&#39;une page web.
* **Données de l&#39;index et des partners dans un même run.** Connect repose sur l&#39;index Exa.
  L&#39;Exa Agent exploite chaque source là où elle est la plus performante et cite les résultats.

<div id="how-it-works">
  ## Fonctionnement
</div>

1. **Attachez** un ou plusieurs providers via le tableau `dataSources` de
   [`POST /agent/runs`](/fr/docs/reference/agent-api/create-a-run).
2. L&#39;Exa Agent **sélectionne le tool adapté** à chaque étape en fonction de votre query et
   de votre `outputSchema` : données du partner ou Exa web search.
3. Les résultats du partner sont **fusionnés avec la recherche web** dans votre structured output,
   sources à l&#39;appui.

<div id="pricing">
  ## Pricing
</div>

<Note>
  La tarification d&#39;Exa Connect s&#39;ajoute à la [tarification standard des Agent runs](/fr/docs/agent/quickstart#pricing).
  Vous payez les coûts habituels de calcul et de search de l&#39;Agent, auxquels s&#39;ajoutent les frais d&#39;appel du provider pour chaque appel d&#39;outil Exa Connect.
</Note>

| Provider                                             | Prix                                          |
| ---------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/fr/docs/agent/connect/fiber#pricing)        | `$0.02 / credit`                              |
| [Similarweb](/fr/docs/agent/connect/similarweb#pricing) | `$0.30 / credit`                              |
| [Baselayer](/fr/docs/agent/connect/baselayer#pricing)   | `$0.10 – $4.00 / order (varies by operation)` |
| [Polymarket](/fr/docs/agent/connect/polymarket#pricing) | `Free`                                        |
| Affiliate.com                                        | `$0.015 / appel`                              |
| Particle                                             | `$0.015 / appel`                              |
| Financial Datasets                                   | `$0.01 / appel`                               |
| Jinko                                                | `$0.005 / appel`                              |

Fiber.ai facture en credits plutôt qu&#39;à l&#39;appel, car son propre tarif varie
d&#39;un appel à l&#39;autre : un search coûte 2 credits plus 1 par résultat renvoyé,
une recherche d&#39;entreprise ou de personne est facturée par candidat renvoyé
(augmenter le `numResults` d&#39;une recherche d&#39;entreprise pour lever l&#39;ambiguïté
d&#39;un nom coûte donc plus cher), et la révélation d&#39;un contact coûte de 2 à
5 credits selon que vous demandez le work email, le personal email ou le
téléphone. Vous êtes facturé des credits déclarés par Fiber pour chaque appel ;
les appels sans correspondance sont gratuits. Voir [la tarification de Fiber.ai](/fr/docs/agent/connect/fiber#pricing).

Similarweb facture en data credits (environ un par métrique × ligne × mois) : le
prix d&#39;un appel dépend donc de ses paramètres `numResults`/`months` — de 1 à
15 credits par appel. Vous êtes facturé des credits déclarés par Similarweb pour
chaque appel ; les appels ne renvoyant aucune donnée sont gratuits. Voir
[la tarification de Similarweb](/fr/docs/agent/connect/similarweb#pricing).

Baselayer facture par order, et le tarif dépend de l&#39;opération : une recherche
d&#39;entreprise KYB coûte 1,00 $, une recherche de privilèges UCC 2,00 $ par
state interrogé, une recherche de dossiers judiciaires ou de faillite 1,00 $
par catégorie, le screening de watchlist de 0,10 à 0,25 $ par liste demandée,
la classification sectorielle et l&#39;analyse de site web 0,35 $ chacune, la
présence web correspond à la somme des analyses sélectionnées (0,15 à 0,35 $
chacune), et une recherche d&#39;entreprise internationale 4,00 $. Les lectures en
follow-up d&#39;une recherche d&#39;entreprise antérieure (consultation d&#39;entreprise,
officers, registrations, recherche inversée d&#39;officer) sont gratuites. Voir
[la tarification de Baselayer](/fr/docs/agent/connect/baselayer#pricing).

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Profile Anthropic: total funding and estimated monthly web traffic.",
      data_sources=[{"provider": "fiber"}, {"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["company"],
          "properties": {
              "company": {
                  "type": "object",
                  "required": ["name", "totalFunding", "monthlyVisits"],
                  "properties": {
                      "name": {"type": "string"},
                      "totalFunding": {"type": "string", "description": "from Fiber.ai"},
                      "monthlyVisits": {"type": "number", "description": "from Similarweb"},
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Profile Anthropic: total funding and estimated monthly web traffic.",
    dataSources: [{ provider: "fiber" }, { provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["company"],
      properties: {
        company: {
          type: "object",
          required: ["name", "totalFunding", "monthlyVisits"],
          properties: {
            name: { type: "string" },
            totalFunding: { type: "string", description: "from Fiber.ai" },
            monthlyVisits: { type: "number", description: "from Similarweb" },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Profile Anthropic: total funding and estimated monthly web traffic.",
      "dataSources": [{ "provider": "fiber" }, { "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["company"],
        "properties": {
          "company": {
            "type": "object",
            "required": ["name", "totalFunding", "monthlyVisits"],
            "properties": {
              "name": { "type": "string" },
              "totalFunding": { "type": "string", "description": "from Fiber.ai" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="data-partners">
  ## Data partners
</div>

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/fiber.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=e2292b486593416a57b075123bcfc513" href="/fr/docs/agent/connect/fiber" width="400" height="400" data-path="images/agent/connect/fiber.svg">
      **GTM et recrutement.** Base de données B2B d&#39;entreprises et de personnes pour la détection de prospects
      et la recherche de contacts.
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/similarweb.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7ac916fb46576857bd10c95f12ae78dc" href="/fr/docs/agent/connect/similarweb" width="400" height="371" data-path="images/agent/connect/similarweb.svg">
      **Analyse web.** Estimations de trafic, classements mondiaux et identification
      des concurrents pour n&#39;importe quel domaine.
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/baselayer.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=d73cd54ad8fc01672a8407aabefee887" href="/fr/docs/agent/connect/baselayer" width="400" height="247" data-path="images/agent/connect/baselayer.svg">
      **Conformité et KYB.** Vérifiez les entreprises américaines : dirigeants, immatriculations et signaux de risque.
    </Card>

    <Card title="Polymarket" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/polymarket.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a3541cde8f59cb64491fa6f4f40f12c" href="/fr/docs/agent/connect/polymarket" width="168" height="168" data-path="images/agent/connect/polymarket.svg">
      **Marchés prédictifs.** Cotes des marchés prédictifs, historique des prix et
      positions des traders, issus de Polymarket.
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/affiliatecom.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=b193bea9be653125ba5695f3cd2c027a" href="/fr/docs/agent/connect/affiliatecom" width="400" height="400" data-path="images/agent/connect/affiliatecom.svg">
      **Commerce.** Recherche dans les catalogues de produits, avec tarifs, marques et liens vers les marchands.
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/particle.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=72ab9729a143893f286fa369ceeb036f" href="/fr/docs/agent/connect/particle" width="400" height="400" data-path="images/agent/connect/particle.svg">
      **Intelligence média.** Recherchez dans les transcriptions de podcasts avec attribution des intervenants
      et horodatages.
    </Card>

    <Card title="Jeux de données financières" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/financialdatasets.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=24052e4641fa4060e1ccf64482b10e00" href="/fr/docs/agent/connect/financialdatasets" width="401" height="400" data-path="images/agent/connect/financialdatasets.svg">
      **Finance.** Cours, fondamentaux, earnings, SEC filings, actionnariat et
      screening d&#39;actions pour plus de 27 000 tickers américains.
    </Card>

    <Card title="Jinko" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/jinko.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=958d2ec147d452f12c0904f41ffb2311" href="/fr/docs/agent/connect/jinko" width="400" height="395" data-path="images/agent/connect/jinko.svg">
      **Voyage.** Recherche de vols et d&#39;hôtels avec tarifs en temps réel.
    </Card>
  </Columns>
</div>

Vous avez besoin d&#39;une source qui ne figure pas dans cette liste ? Consultez nos [Providers supplémentaires](/fr/docs/agent/connect/additional-partners), disponibles sur demande auprès de notre équipe.

<div id="usage">
  ## Utilisation
</div>

<div id="combining-providers">
  ### Combiner des providers
</div>

Attachez autant de partners que votre tâche l&#39;exige. Exa Agent appelle chacun d&#39;eux là où il est
le plus performant et combine les résultats avec la web search en une seule réponse structurée :

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

Pour un guide complet, notamment sur la manière de structurer votre query et votre `outputSchema` afin que chaque
partner se déclenche, consultez [Combiner les providers](/fr/docs/agent/connect/combining-providers).