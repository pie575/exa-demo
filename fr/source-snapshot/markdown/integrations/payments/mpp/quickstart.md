> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="pay-with-mpp-tempo">
  # Payer avec MPP (Tempo)
</div>

> Appelez les API Search et Contents d&#39;Exa sans API key, en payant à la request avec des USDC.e sur Tempo.

<div id="what-is-mpp">
  ## Qu&#39;est-ce que MPP ?
</div>

MPP (Machine Payments Protocol) est un standard de paiement ouvert et nativement HTTP, fondé sur le code de statut `402 Payment Required`. Il permet aux clients de payer l&#39;accès à une API request par request, via plusieurs moyens de paiement, dont les stablecoins sur [Tempo](https://tempo.xyz), sans compte, API key ni abonnement. Les exemples de cette page utilisent Tempo ; Exa règle actuellement les paiements MPP en USDC.e sur le mainnet Tempo.

Exa prend en charge MPP sur deux endpoints : **`/search`** et **`/contents`**. Lorsque vous envoyez une request sans API key ni payment credential, Exa répond par un `402` accompagné d&#39;un challenge `WWW-Authenticate: Payment` indiquant le prix et les modalités de paiement. Votre client signe un payment, renvoie la request avec un credential `Authorization: Payment`, puis reçoit les résultats une fois le payment réglé on-chain.

C&#39;est la solution idéale pour les **agents IA** qui doivent payer de façon autonome une web search sans credentials provisionnés au préalable.

<Info>
  MPP et l&#39;accès par API key sont indépendants. Si votre request inclut un header `x-api-key`, c&#39;est le flux normal de facturation par API key qui s&#39;applique et MPP est entièrement contourné.
</Info>

<div id="supported-endpoints">
  ## Endpoints pris en charge
</div>

| Endpoint    | Méthode | Description                                                                                                 |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `/search`   | POST    | Recherche web avec tous les search types (`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`) |
| `/contents` | POST    | Récupération de contenu par URL ou par identifiant de document                                              |

Les autres endpoints Exa n&#39;acceptent *pas encore* les paiements MPP.

<div id="get-started">
  ## Démarrer
</div>

Vous avez besoin d&#39;un wallet compatible Tempo approvisionné en USDC.e. Exportez la private key de votre wallet avant d&#39;exécuter un exemple :

```bash theme={null}
export WALLET_PRIVATE_KEY="0x..."
```

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

<div id="make-a-paid-search-request">
  ### Effectuer une search request payante
</div>

Utilisez le client MPP pour signer et soumettre un payment correspondant à une search request :

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={"query": "best machine learning frameworks", "numResults": 5},
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

Un run réussi affiche les résultats de la search ainsi que le header `Payment-Receipt`, qui contient le hash de la transaction on-chain.

<div id="pay-from-the-command-line">
  ## Payer depuis la ligne de commande
</div>

Si vous préférez ne pas manipuler directement une private key, utilisez plutôt la CLI Tempo Wallet. `tempo wallet login` crée ou connecte un wallet Tempo, autorise une key d&#39;accès locale et peut inclure des MPP Credits offerts pour les nouvelles inscriptions.

<div id="install-and-authenticate">
  ### Installation et authentification
</div>

```bash theme={null}
curl -fsSL https://tempo.xyz/install | bash
tempo add wallet
tempo add request
tempo wallet login
```

Sur un hôte distant sans navigateur local, utilisez `tempo wallet login --no-browser`, puis ouvrez l&#39;URL affichée sur votre appareil pour autoriser la CLI.

<div id="check-balances-and-credits">
  ### Vérifier les soldes et les crédits
</div>

```bash theme={null}
tempo wallet whoami
tempo wallet whoami --credits
```

<div id="make-a-paid-request">
  ### Effectuer une requête payante
</div>

```bash theme={null}
tempo request --max-spend 1.00 https://api.exa.ai/search \
  --json '{"query": "Series A fintech companies", "numResults": 5}'
```

`tempo request` intercepte le challenge `402 Payment Required`, effectue le paiement et relance automatiquement la requête.

Pour la référence complète de la CLI, consultez la [documentation de la CLI Tempo Wallet](https://tempo.xyz/developers/docs/cli/wallet) et la [documentation de `tempo request`](https://tempo.xyz/developers/docs/cli/request).

<div id="gas-fees">
  ## Frais de gas
</div>

Exa prend en charge les frais du réseau Tempo et les règle en USDC.e. Votre wallet doit uniquement disposer d&#39;assez d&#39;USDC.e pour couvrir le montant facturé par l&#39;API ; aucun solde en pathUSD ou dans un autre jeton de gas n&#39;est requis. Vous n&#39;avez pas à configurer de payeur de frais : le payment challenge d&#39;Exa et le SDK MPP gèrent la sponsorship automatiquement.

<div id="pricing">
  ## Tarification
</div>

MPP utilise la même tarification groupée que la facturation par API key. Exa calcule le prix à partir des paramètres de la requête avant de la traiter.

<div id="search">
  ### Search
</div>

| Search type               | Prix jusqu&#39;à 10 résultats |
| ------------------------- | ----------------------------- |
| `instant`, `auto`, `fast` | 0,007 $ par requête           |
| `deep-lite`, `deep`       | 0,012 $ par requête           |
| `deep-reasoning`          | 0,015 $ par requête           |

L&#39;ajout de `contents.summary` coûte **0,001 $ de plus par résultat**.

<Warning>
  Les requêtes de search MPP sont limitées à 10 résultats. Si `numResults` est supérieur à 10, Exa n&#39;en utilise que 10 et facture la requête sur la base de 10 résultats. Si vous avez besoin de plus, utilisez la [facturation par API key](/fr/docs/search/quickstart).
</Warning>

<div id="contents">
  ### Contents
</div>

Chaque type de contenu demandé coûte 0,001 $ par URL :

| Type de contenu | Prix par URL |
| --------------- | ------------ |
| `text`          | 0,001 $      |
| `highlights`    | 0,001 $      |
| `summary`       | 0,001 $      |

Si vous ne demandez ni `text`, ni `highlights`, ni `summary`, Exa active `text` par défaut.

<div id="pricing-examples">
  ### Exemples de tarification
</div>

| Requête                                          | Prix   |
| ------------------------------------------------ | ------ |
| `/search` avec `type: "auto"`                    | $0.007 |
| `/search` avec 3 résultats et `contents.summary` | $0.010 |
| `/search` avec `type: "deep"`                    | $0.012 |
| `/contents` pour 2 URL avec `text: true`         | $0.002 |
| `/contents` pour 1 URL avec `text` et `summary`  | $0.002 |

<div id="how-the-payment-flow-works">
  ## Fonctionnement du payment flow
</div>

Le SDK automatise ce flux, mais vous pouvez l&#39;inspecter directement en HTTP :

1. Envoyez une request sans API key ni payment credential. Exa renvoie `402` avec un challenge `WWW-Authenticate: Payment` contenant le prix, le jeton, le destinataire, le réseau et les informations de sponsorship.
2. Signez le challenge, puis relancez la request avec `Authorization: Payment <credential>`.
3. Exa traite la request pendant le settlement du payment. Une fois le settlement confirmé, Exa renvoie les résultats accompagnés d&#39;un header `Payment-Receipt`. Si le settlement échoue, Exa renvoie `402` avec un nouveau challenge et aucun résultat.

<div id="inspect-a-payment-challenge">
  ### Inspecter un payment challenge
</div>

Vous pouvez consulter le prix et les détails de paiement sans wallet :

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "numResults": 3}'
```

Recherchez le header `WWW-Authenticate: Payment` dans la réponse `402`. Les discovery requests non payées sont soumises à une limite de débit : utilisez-les à des fins de débogage plutôt que pour du polling.

<div id="payment-reference">
  ## Référence des paiements
</div>

Exa accepte les paiements MPP en USDC.e sur le mainnet Tempo.

| Réseau        | Identifiant   | Jeton  | Actif                                        |
| ------------- | ------------- | ------ | -------------------------------------------- |
| Tempo mainnet | `eip155:4217` | USDC.e | `0x20c000000000000000000000b9537d11c60e8b50` |

USDC.e comporte 6 décimales. Le challenge exprime les prix en unités atomiques : `7000` correspond donc à 0,007 $ et `1000000` à 1,00 $.

<Note>
  Exa prend en charge MPP et [x402](/fr/docs/integrations/payments/x402/quickstart) sur les mêmes endpoints. Une réponse `402` non authentifiée peut contenir à la fois le challenge MPP `WWW-Authenticate: Payment` et le header x402 `PAYMENT-REQUIRED`. Utilisez les headers correspondant au protocole de paiement pris en charge par votre client.
</Note>

<div id="headers">
  ### Headers
</div>

| Header                                | Direction       | Description                                                     |
| ------------------------------------- | --------------- | --------------------------------------------------------------- |
| `Authorization: Payment <credential>` | Requête         | Payment credential MPP                                          |
| `WWW-Authenticate: Payment`           | Réponse `402`   | Tarif et instructions de paiement pour la requête               |
| `Payment-Receipt`                     | Réponse réussie | Settlement receipt, incluant le hash de la transaction on-chain |

<div id="errors">
  ### Erreurs
</div>

| Statut | Description                                                                               |
| ------ | ----------------------------------------------------------------------------------------- |
| `402`  | Le payment credential est manquant ou invalide ; la réponse contient un nouveau challenge |
| `402`  | Le montant du paiement ne correspond pas au prix de la requête, ou le settlement a échoué |
| `429`  | Cette IP a envoyé trop de discovery requests non payées                                   |
| `429`  | Ce wallet a dépassé le rate limit des requêtes payées                                     |

<div id="rate-limits">
  ### Rate limits
</div>

Les rate limits MPP sont partagés avec x402 et sont distincts des limits associés à l&#39;API key :

| Limit                            | Seuil       | Fenêtre     |
| -------------------------------- | ----------- | ----------- |
| Unpaid discovery requests par IP | 5 requests  | 60 secondes |
| Requests payantes par wallet     | 10 requests | 1 seconde   |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Puis-je utiliser MPP et une API key en même temps ?">
    Si votre requête inclut un header `x-api-key`, le flux par API key est prioritaire et MPP est ignoré. Les deux ne se cumulent pas : c&#39;est l&#39;un ou l&#39;autre, requête par requête.
  </Accordion>

  <Accordion title="Que se passe-t-il si le settlement échoue après le traitement de ma requête ?">
    Votre réponse est bloquée. Vous recevez un `402` accompagné d&#39;un nouveau challenge `WWW-Authenticate: Payment` pour que votre client puisse réessayer. Aucun résultat n&#39;est renvoyé tant que le settlement n&#39;a pas abouti.
  </Accordion>

  <Accordion title="Quels wallets sont pris en charge ?">
    Tout wallet EVM compatible Tempo avec lequel le SDK client peut signer — un compte `viem` avec `mppx` (TypeScript), ou une clé `eth-account` avec `pympp` (Python). Pour les agents IA, utilisez un wallet disposant d&#39;un solde en USDC.e sur Tempo afin de couvrir le prix des requêtes.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

* [Documentation du protocole MPP](https://mpp.dev/protocol) : détails du protocole et format d&#39;authentification
* [Documentation de mppx](https://mpp.dev/sdk/typescript) : référence du SDK TypeScript MPP
* [Documentation de pympp](https://mpp.dev/sdk/python) : référence du SDK Python MPP
* [Tempo](https://tempo.xyz) : documentation du réseau Tempo
* [Payer avec x402](/fr/docs/integrations/payments/x402/quickstart) : payer les mêmes endpoints avec x402
* [Guide de la Search API Exa](/fr/docs/search/quickstart) : référence complète des paramètres de search
* [Guide de l&#39;API Contents d&#39;Exa](/fr/docs/contents/quickstart) : référence complète des paramètres de contents