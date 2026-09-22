> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Exa Connect {#exa-connect}

> Donnez à votre Exa Agent un accès en direct à des data partners premium, en complément d&#39;Exa web search, au sein d&#39;un même run.

Exa Connect intègre des data partners premium dans le loop de l&#39;Exa Agent. Attachez un
fournisseur à un run : l&#39;Exa Agent interroge alors la base de données de ce partner en parallèle de la recherche
web, puis combine les résultats en une réponse unique, structurée et fondée sur des preuves.

Vous débutez avec les agent runs ? Commencez par le [guide Exa Agent](/fr/docs/agent/quickstart),
puis revenez ici pour attacher des data partners.

<Tip>
  Exa Agent effectue déjà des recherches dans l&#39;intégralité du [data index](/fr/docs/search/data/overview), soit les mêmes sources d&#39;actualités,
  de code, d&#39;entreprises et de personnes que la Search API. Exa Connect y ajoute
  des bases de données de partners premium.
</Tip>

<Tip>
  Vous préférez MCP ? Exa Agent et [Exa Connect](/fr/docs/agent/connect/overview) sont disponibles dans [Exa MCP](/fr/docs/get-started/exa-mcp#exa-agent). Activez `tools=agent_run` pour lancer des recherches multi-étapes, de la constitution de liste, de l&#39;enrichment et de la sortie structurée depuis Claude, Cursor et d&#39;autres clients MCP.
</Tip>

## Pourquoi Exa Connect {#why-exa-connect}

* **Des données premium sans intégrations séparées.** Accédez aux données des partners sans
  signer de contrat ni intégrer un SDK. Vous appelez une seule API Exa.
* **Exa s&#39;occupe de la plomberie.** Nous gérons l&#39;authentification des fournisseurs, la sélection des outils,
  les nouvelles tentatives et le classement des résultats.
* **Exa Agent choisit la source.** Lorsque votre `outputSchema` demande
  « les visites mensuelles depuis Similarweb » ou « les dirigeants vérifiés », Exa Agent appelle l&#39;outil
  partner correspondant plutôt que de deviner à partir d&#39;une page web.
* **Données de l&#39;index et des partners dans un même run.** Connect s&#39;appuie sur l&#39;index Exa.
  Exa Agent exploite chaque source là où elle est la plus solide et cite les résultats.

## Fonctionnement {#how-it-works}

1. **Attachez** un ou plusieurs providers via le tableau `dataSources` de
   [`POST /agent/runs`](/fr/docs/reference/agent-api/create-a-run).
2. Exa Agent **sélectionne le bon outil** à chaque étape en fonction de votre requête et
   de votre `outputSchema` : données du partner ou Exa web search.
3. Les résultats du partner sont **fusionnés avec la recherche web** dans votre sortie structurée,
   avec les sources associées.

## Tarification {#pricing}

<Note>
  La tarification d&#39;Exa Connect s&#39;ajoute à la [tarification standard des Agent runs](/fr/docs/agent/quickstart#pricing).
  Vous payez les coûts habituels de calcul et de search de l&#39;Agent, ainsi que les frais d&#39;appel au fournisseur pour chaque appel d&#39;outil Exa Connect.
</Note>

| Fournisseur                                          | Prix                                          |
| ---------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/fr/docs/agent/connect/fiber#pricing)        | `$0.02 / credit`                              |
| [Similarweb](/fr/docs/agent/connect/similarweb#pricing) | `$0.30 / credit`                              |
| [Baselayer](/fr/docs/agent/connect/baselayer#pricing)   | `$0.10 – $4.00 / order (varies by operation)` |
| [Polymarket](/fr/docs/agent/connect/polymarket#pricing) | `Free`                                        |
| Affiliate.com                                        | `$0.015 / appel`                              |
| Particle                                             | `$0.015 / appel`                               |
| Financial Datasets                                   | `$0.01 / appel`                                |
| Jinko                                                | `$0.005 / appel`                               |

Fiber.ai facture en crédits plutôt qu&#39;à l&#39;appel, car son propre tarif varie
d&#39;un appel à l&#39;autre : une recherche coûte 2 crédits plus 1 par result
retourné, une recherche d&#39;entreprise ou de personne est facturée par candidat
retourné (augmenter le `numResults` d&#39;une recherche d&#39;entreprise pour lever
l&#39;ambiguïté d&#39;un nom coûte donc plus cher), et la révélation d&#39;un contact coûte
de 2 à 5 crédits selon que vous demandez l&#39;e-mail professionnel, l&#39;e-mail
personnel ou le téléphone. Les crédits déclarés par Fiber pour chaque appel
vous sont facturés ; les appels sans correspondance sont gratuits. Voir la
[tarification Fiber.ai](/fr/docs/agent/connect/fiber#pricing).

Similarweb facture en crédits de données (environ un par métrique × ligne ×
mois) : le prix d&#39;un appel dépend donc de ses valeurs `numResults`/`months` —
de 1 à 15 crédits par appel. Les crédits déclarés par Similarweb pour chaque
appel vous sont facturés ; les appels qui ne retournent aucune donnée sont
gratuits. Voir la [tarification Similarweb](/fr/docs/agent/connect/similarweb#pricing).

Baselayer facture à la commande, et le tarif dépend de l&#39;opération : une
recherche d&#39;entreprise KYB coûte 1,00 $, une recherche de privilèges UCC
2,00 $ par state interrogé, une recherche de dossiers de litige ou de faillite
1,00 $ par catégorie, le screening de watchlists de 0,10 $ à 0,25 $ par liste
demandée, la classification sectorielle et l&#39;analyse de site web 0,35 $
chacune, la présence web correspond à la somme des analyses sélectionnées (de
0,15 $ à 0,35 $ chacune), et une recherche d&#39;entreprise à l&#39;international
4,00 $. Les lectures ultérieures d&#39;une recherche d&#39;entreprise antérieure
(recherche d&#39;entreprise, dirigeants, immatriculations, recherche inversée de
dirigeant) sont gratuites.
Voir la [tarification Baselayer](/fr/docs/agent/connect/baselayer#pricing).

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

## Partners de données {#data-partners}

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/fiber.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=e2292b486593416a57b075123bcfc513" href="/fr/docs/agent/connect/fiber" width="400" height="400" data-path="images/agent/connect/fiber.svg">
      **GTM et recrutement.** Base de données B2B d&#39;entreprises et de personnes pour l&#39;identification de prospects
      et la recherche de contacts.
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/similarweb.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7ac916fb46576857bd10c95f12ae78dc" href="/fr/docs/agent/connect/similarweb" width="400" height="371" data-path="images/agent/connect/similarweb.svg">
      **Analyse web.** Estimations de trafic, classements mondiaux et découverte de concurrents pour n&#39;importe quel domaine.
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/baselayer.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=d73cd54ad8fc01672a8407aabefee887" href="/fr/docs/agent/connect/baselayer" width="400" height="247" data-path="images/agent/connect/baselayer.svg">
      **Conformité et KYB.** Vérifiez les entreprises américaines : dirigeants, immatriculations et signaux de risque.
    </Card>

    <Card title="Polymarket" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/polymarket.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a3541cde8f59cb64491fa6f4f40f12c" href="/fr/docs/agent/connect/polymarket" width="168" height="168" data-path="images/agent/connect/polymarket.svg">
      **Marchés prédictifs.** Cotes des marchés prédictifs, historique des prix et positions des traders, issus de Polymarket.
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/affiliatecom.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=b193bea9be653125ba5695f3cd2c027a" href="/fr/docs/agent/connect/affiliatecom" width="400" height="400" data-path="images/agent/connect/affiliatecom.svg">
      **Commerce.** Recherche dans les catalogues de produits, avec tarification, marques et liens marchands.
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/particle.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=72ab9729a143893f286fa369ceeb036f" href="/fr/docs/agent/connect/particle" width="400" height="400" data-path="images/agent/connect/particle.svg">
      **Veille média.** Recherchez dans les transcriptions de podcasts avec attribution des intervenants
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

Vous avez besoin d&#39;une source qui ne figure pas dans la liste ci-dessus ? Consultez nos [provider supplémentaires](/fr/docs/agent/connect/additional-partners), disponibles sur demande auprès de notre équipe.

## Utilisation {#usage}

### Combiner les provider {#combining-providers}

Attachez autant de partner que votre tâche l&#39;exige. L&#39;Exa Agent appelle chacun d&#39;eux là où il est
le plus performant et combine les résultats avec la recherche web en une seule réponse structurée :

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

Pour un guide complet, incluant la façon de structurer votre requête et votre `outputSchema` afin que chaque
partner soit déclenché, consultez [Combiner les providers](/fr/docs/agent/connect/combining-providers).