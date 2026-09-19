> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="tempo-mpp-gtm-enrichment-cookbook">
  # Cookbook d&#39;enrichment GTM avec Tempo MPP
</div>

> Créez un workflow d&#39;enrichment GTM facturé à chaque requête Exa search et contents avec Tempo MPP — sans API key.

Utilisez ce cookbook pour créer un agent ou un pipeline d&#39;enrichment GTM
reposant sur les endpoints `/search` et `/contents` d&#39;Exa, payés à la requête via le
Machine Payments Protocol (MPP). MPP prend en charge plusieurs moyens de paiement ;
les exemples présentés ici utilisent des stablecoins sur [Tempo](https://tempo.xyz).
Aucun abonnement mensuel, aucune API key et aucune tarification par siège :
approvisionnez un wallet en USDC.e et payez au fil de l&#39;enrichment
de vos leads ou entreprises.

<Info>
  MPP est actuellement pris en charge uniquement sur les endpoints `/search` et `/contents` d&#39;Exa.
  L&#39;API Agent (`/agent/runs`) et `/answer` nécessitent une Exa API key et passent
  par le flux de billing standard par API key.
</Info>

<div id="what-youll-build">
  ## Ce que vous allez construire
</div>

Un pipeline d&#39;enrichment léger qui, à partir d&#39;une liste de noms d&#39;entreprises ou de
descriptions de cibles :

1. Utilise `/search` d&#39;Exa avec `type: "deep"` et `outputSchema` pour trouver la
   page officielle de l&#39;entreprise et en extraire les metadata clés.
2. Utilise `contents.highlights` sur le résultat renvoyé pour récupérer des extraits sources
   sur le financement, le siège social, les effectifs et le produit.
3. Produit un enregistrement d&#39;enrichment au format CSV ou JSON pour chaque entrée.

Ce modèle convient à l&#39;enrichment de listes de prospects, à la recherche sur des comptes et à la
personnalisation des campagnes sortantes. Comme il repose sur des appels `/search` + `/contents`
distincts, chaque étape peut être réglée via MPP.

<div id="prerequisites">
  ## Prérequis
</div>

* Un wallet compatible Tempo approvisionné en **USDC.e** sur le mainnet Tempo.
* Un moyen sûr de charger la private key du wallet au moment de l&#39;exécution (voir ci-dessous ; ne committez jamais
  la key et ne l&#39;exposez pas dans le code source).
* `mppx` (TypeScript) ou `pympp` (Python) installé.

<Info>
  Pour une configuration en ligne de commande qui ne nécessite pas de private key brute, utilisez le [CLI Tempo Wallet](/fr/docs/integrations/payments/mpp/quickstart#pay-from-the-command-line). `tempo wallet login` crée ou connecte un wallet et peut inclure des MPP Credits gratuits pour toute nouvelle inscription.
</Info>

<div id="mpp-setup">
  ## Configuration de MPP
</div>

<div id="install-the-client">
  ### Installer le client
</div>

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

<div id="load-your-private-key-safely">
  ### Charger votre private key en toute sécurité
</div>

Ne codez jamais une private key en dur. Les exemples ci-dessous lisent `WALLET_PRIVATE_KEY` depuis
votre environnement d&#39;exécution, uniquement pour le development local. En production, chargez-la depuis
un secrets manager tel que 1Password, AWS Secrets Manager ou HashiCorp Vault.

<CodeGroup>
  ```bash TypeScript theme={null}
  # À définir dans votre shell ou votre gestionnaire de secrets CI ; ne committez jamais cette valeur
  export WALLET_PRIVATE_KEY="0x..."
  ```

  ```bash Python theme={null}
  # À définir dans votre shell ou votre gestionnaire de secrets CI ; ne committez jamais cette valeur
  export WALLET_PRIVATE_KEY="0x..."
  ```
</CodeGroup>

<div id="make-a-paid-search-request">
  ### Effectuer une search payante
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  // En production, chargez cette valeur depuis un secrets manager — ne committez jamais la valeur brute.
  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      numResults: 5,
      contents: { highlights: true },
    }),
  });

  const data = (await response.json()) as { results: { title: string; url: string }[] };
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      # En production, chargez cette valeur depuis un secrets manager — ne committez jamais la valeur brute.
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": "Series A fintech companies with 50-200 employees",
                  "numResults": 5,
                  "contents": {"highlights": True},
              },
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

En cas de succès, la response renvoie les résultats Exa ainsi qu&#39;un header `Payment-Receipt` contenant
le hash de la transaction on-chain.

<div id="make-a-paid-contents-request">
  ### Effectuer une requête contents payante
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  const contentsResponse = await mppx.fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: ["https://www.example.com"],
      text: true,
      summary: true,
    }),
  });

  const contentsData = (await contentsResponse.json()) as {
    results: { url: string; text?: string; summary?: string }[];
  };
  console.log(contentsData.results[0]);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/contents",
      json={
          "urls": ["https://www.example.com"],
          "text": True,
          "summary": True,
      },
  )
  print(response.json()["results"][0])
  ```
</CodeGroup>

<div id="gtm-enrichment-recipe">
  ## Recette d&#39;Enrichment GTM
</div>

<div id="enrich-a-list-of-companies">
  ### Enrichir une liste d&#39;entreprises
</div>

À partir d&#39;une liste de noms d&#39;entreprises, recherchez la page de chaque entreprise et extrayez-en
des informations structurées.

<CodeGroup>
  ```typescript TypeScript theme={null}
  interface CompanyEnrichment {
    name: string;
    url: string;
    title: string;
    industry?: string;
    headquarters?: string;
    funding?: string;
    summary?: string;
    highlights: string[];
  }

  async function enrichCompanies(names: string[]): Promise<CompanyEnrichment[]> {
    const enriched: CompanyEnrichment[] = [];

    for (const name of names) {
      const response = await mppx.fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `${name} official company`,
          type: "deep",
          numResults: 1,
          contents: {
            highlights: { query: "funding, headquarters, employees, product" },
          },
          outputSchema: {
            type: "object",
            properties: {
              company: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  industry: { type: "string" },
                  headquarters: { type: "string" },
                  funding: { type: "string" },
                  summary: { type: "string" },
                },
                required: ["name", "url"],
              },
            },
            required: ["company"],
          },
        }),
      });

      const data = (await response.json()) as {
        output?: { company?: CompanyEnrichment & { summary?: string } };
        results?: { highlights?: string[] }[];
      };
      const company = data.output?.company;
      const highlights = data.results?.[0]?.highlights?.slice(0, 3) ?? [];
      if (!company) continue;

      enriched.push({
        ...company,
        title: company.name,
        highlights,
      });
    }

    return enriched;
  }
  ```

  ```python Python theme={null}
  async def enrich_companies(names):
      enriched = []
      for name in names:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": f"{name} official company",
                  "type": "deep",
                  "numResults": 1,
                  "contents": {
                      "highlights": {"query": "funding, headquarters, employees, product"}
                  },
                  "outputSchema": {
                      "type": "object",
                      "properties": {
                          "company": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "url": {"type": "string"},
                                  "industry": {"type": "string"},
                                  "headquarters": {"type": "string"},
                                  "funding": {"type": "string"},
                                  "summary": {"type": "string"},
                              },
                              "required": ["name", "url"],
                          }
                      },
                      "required": ["company"],
                  },
              },
          )
          data = response.json()
          company = data.get("output", {}).get("company")
          highlights = []
          if data.get("results"):
              highlights = data["results"][0].get("highlights", [])[:3]
          if not company:
              continue

          enriched.append({
              "name": company["name"],
              "url": company["url"],
              "title": company["name"],
              "industry": company.get("industry"),
              "headquarters": company.get("headquarters"),
              "funding": company.get("funding"),
              "summary": company.get("summary"),
              "highlights": highlights,
          })
      return enriched
  ```
</CodeGroup>

<div id="enrich-a-person-profile">
  ### Enrichir un profil de personne
</div>

Cette recette utilise `type: "deep"`, `contents.highlights` et `outputSchema` pour
rechercher des informations sur une personne et renvoyer un profil structuré.

<CodeGroup>
  ```typescript TypeScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Exa Labs founders contact and background",
      type: "deep",
      numResults: 5,
      contents: {
        highlights: { query: "email, title, education, work history, LinkedIn" },
      },
      outputSchema: {
        type: "object",
        properties: {
          people: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                title: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                linkedInUrl: { type: "string" },
                summary: { type: "string" },
              },
              required: ["name"],
            },
          },
        },
        required: ["people"],
      },
    }),
  });

  const data = (await response.json()) as {
    output?: { people: { name: string; title?: string; company?: string }[] };
  };
  console.log(data.output?.people);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Exa Labs founders contact and background",
          "type": "deep",
          "numResults": 5,
          "contents": {
              "highlights": {"query": "email, title, education, work history, LinkedIn"}
          },
          "outputSchema": {
              "type": "object",
              "properties": {
                  "people": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "title": {"type": "string"},
                              "company": {"type": "string"},
                              "email": {"type": "string"},
                              "linkedInUrl": {"type": "string"},
                              "summary": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["people"],
          },
      },
  )

  print(response.json().get("output", {}).get("people"))
  ```
</CodeGroup>

<Note>
  Cet exemple s&#39;appuie sur `type: "deep"` pour un raisonnement plus approfondi et sur
  `outputSchema` pour structurer la response. La deep search est facturée $0,012 par request, et
  `contents.highlights` ajoute $0,001 par résultat.
</Note>

<div id="structured-output">
  ### Structured output
</div>

Si vous souhaitez des champs JSON plutôt que du texte brut, utilisez `outputSchema` dans la
request de search. Exa renvoie un objet `output` conforme à votre schema.

<CodeGroup>
  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Series A fintech companies with 50-200 employees",
          "type": "deep-lite",
          "numResults": 5,
          "outputSchema": {
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "headcount": {"type": "string"},
                              "headquarters": {"type": "string"},
                              "fundingStage": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["companies"],
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      type: "deep-lite",
      numResults: 5,
      outputSchema: {
        type: "object",
        properties: {
          companies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                headcount: { type: "string" },
                headquarters: { type: "string" },
                fundingStage: { type: "string" }
              },
              required: ["name"]
            }
          }
        },
        required: ["companies"]
      }
    })
  });
  ```
</CodeGroup>

<Note>
  `outputSchema` donne les meilleurs résultats avec les search types `deep-lite` ou `deep`. Il ajoute un
  call LLM côté Exa : il est donc facturé au tarif `deep-lite`/`deep`.
</Note>

<div id="pricing-and-limits">
  ## Tarification et limites
</div>

MPP applique la même tarification à la requête que la facturation par API key. Les requêtes de search MPP
sont plafonnées à 10 résultats.

| Opération                                         | Prix                 |
| ------------------------------------------------- | -------------------- |
| `/search` avec `type` `instant`, `auto` ou `fast` | 0,007 $ par requête  |
| `/search` avec `type` `deep-lite` ou `deep`       | 0,012 $ par requête  |
| `/search` avec `type` `deep-reasoning`            | 0,015 $ par requête  |
| `contents.text`                                   | 0,001 $ par URL      |
| `contents.highlights`                             | 0,001 $ par URL      |
| `contents.summary`                                | 0,001 $ par résultat |

Consultez [Payer avec MPP (Tempo)](/fr/docs/integrations/payments/mpp/quickstart) pour la référence complète,
y compris les rate limits, les détails réseau et les headers de paiement.

<div id="production-tips">
  ## Conseils pour la production
</div>

* **Approvisionnez le wallet uniquement en USDC.e.** Exa prend en charge les frais du réseau Tempo : le wallet n&#39;a donc pas besoin d&#39;un token de gas distinct.
* **Gérez les réponses `402`.** Le SDK MPP effectue automatiquement de nouvelles tentatives, mais un client personnalisé doit réessayer en cas de `402` à l&#39;aide du challenge `WWW-Authenticate: Payment`.
* **Mettez en cache les résultats de `/contents`.** Les contents sont facturés par URL. Mettez-les en cache par URL pour éviter de payer deux fois la même page d&#39;entreprise.
* **Attention à la limite de 10 résultats.** La search MPP plafonne `numResults` à 10.
* **Ne committez jamais de private keys.** Chargez `WALLET_PRIVATE_KEY` depuis un secrets manager, et non depuis le gestionnaire de versions.

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Puis-je utiliser MPP avec l'API Exa Agent ?">
    Non. Dans le code d&#39;Exa, MPP est relié uniquement à `/search` et `/contents`.
    `/agent/runs` et `/answer` nécessitent une API key Exa et utilisent la
    facturation standard par API key.
  </Accordion>

  <Accordion title="Puis-je combiner MPP et une API key Exa dans la même requête ?">
    Non. Si une requête contient `x-api-key` ou `Authorization: Bearer`, le flux
    par API key est prioritaire et MPP est ignoré.
  </Accordion>

  <Accordion title="Que se passe-t-il si le settlement MPP échoue ?">
    Exa renvoie un `402` accompagné d&#39;un nouveau challenge `WWW-Authenticate: Payment`,
    sans aucun résultat. Votre client peut réessayer avec un nouveau payment. Aucun
    résultat n&#39;est renvoyé tant que le settlement n&#39;a pas abouti.
  </Accordion>

  <Accordion title="Ai-je besoin d'un wallet Tempo distinct par environnement ?">
    Vous pouvez réutiliser le même wallet, mais nous recommandons des wallets
    distincts pour le development et la production. Le QPS par wallet est de
    10 requêtes/seconde, toutes requêtes issues de ce wallet confondues.
  </Accordion>
</AccordionGroup>

<div id="next-steps">
  ## Étapes suivantes
</div>

* [Payer avec MPP (Tempo)](/fr/docs/integrations/payments/mpp/quickstart) : référence complète de MPP
* [Guide de l&#39;API Exa Search](/fr/docs/search/quickstart) : référence des paramètres de recherche
* [Guide de l&#39;API Exa Contents](/fr/docs/contents/quickstart) : référence des paramètres de contents
* [Documentation Tempo MPP](https://mpp.dev/protocol) : détails du protocole et du SDK