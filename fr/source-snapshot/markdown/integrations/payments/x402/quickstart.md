> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="pay-with-x402">
  # Payer avec x402
</div>

> Utilisez les API Search et Contents d&#39;Exa sans API key. Payez à la requête en USDC sur Base ou Solana via le protocole x402.

<div id="what-is-x402">
  ## Qu&#39;est-ce que x402 ?
</div>

[x402](https://x402.org) est un standard de paiement ouvert reposant sur le code de statut HTTP `402 Payment Required`. Il permet aux clients de payer l&#39;accès à une API à la requête, avec des stablecoins USDC sur Base ou Solana, sans compte, API key ni abonnement.

Exa prend en charge x402 sur deux endpoints : **`/search`** et **`/contents`**. Lorsque vous envoyez une requête sans API key ni header de paiement, Exa répond avec un `402` et un header `PAYMENT-REQUIRED` contenant les détails de tarification et les réseaux de paiement pris en charge. Votre client signe un paiement en USDC, relance la requête avec un header `PAYMENT-SIGNATURE`, puis reçoit les résultats une fois le settlement confirmé on-chain.

C&#39;est idéal pour les **agents IA** qui doivent payer de façon autonome des recherches web sans credentials provisionnés au préalable.

<Info>
  x402 et l&#39;accès par API key sont indépendants. Si votre requête inclut un header `x-api-key` ou `Authorization: Bearer`, le flux habituel de facturation par API key s&#39;applique et x402 est entièrement contourné.
</Info>

<div id="supported-endpoints">
  ## Endpoints pris en charge
</div>

| Endpoint    | Méthode | Description                                                                                                 |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `/search`   | POST    | Recherche web avec tous les search types (`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`) |
| `/contents` | POST    | Récupération de contenu par URL ou identifiant de document                                                  |

Tous les autres endpoints ne sont **pas** disponibles via x402.

<div id="how-it-works">
  ## Fonctionnement
</div>

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/payments/x402/payment-flow.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a560d80bb84828e03dfacd61351e9fb" alt="Diagramme de séquence du flux de paiement x402 : le client envoie une requête au serveur, reçoit un 402 avec le header PAYMENT-REQUIRED, crée un payload de paiement, réessaie avec PAYMENT-SIGNATURE, le serveur vérifie via le facilitateur, effectue le traitement, procède au règlement on-chain, puis renvoie un 200 avec les résultats et PAYMENT-RESPONSE" width="4224" height="2720" data-path="images/integrations/payments/x402/payment-flow.png" />
</Frame>

<div id="step-1-discovery">
  ### Étape 1 : Discovery
</div>

Envoyez une requête à un endpoint pris en charge sans API key ni header de paiement :

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "best machine learning frameworks", "numResults": 5}'
```

Vous recevrez une réponse `402` accompagnée d&#39;un header `PAYMENT-REQUIRED` encodé en base64. Une fois décodé, il se présente ainsi :

```json theme={null}
{
  "x402Version": 2,
  "resource": {
    "url": "https://api.exa.ai/search",
    "description": "Exa /search endpoint"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:8453",
      "amount": "7000",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "payTo": "0x...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2" }
    },
    {
      "scheme": "exact",
      "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      "amount": "7000",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "payTo": "...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2", "feePayer": "..." }
    }
  ]
}
```

Le champ `amount` est exprimé en unités atomiques USDC (6 décimales), donc `"7000"` = 0,007 $.
Le client peut payer avec n&#39;importe quelle entrée `accepts` annoncée qu&#39;il prend en charge. Les entrées Solana incluent des fields fournis par le facilitator, tels que `extra.feePayer` ; utilisez l&#39;entrée exacte issue du header `PAYMENT-REQUIRED` pour construire le paiement.

<div id="step-2-pay-and-retry">
  ### Étape 2 : payer et réessayer
</div>

Signez le paiement avec votre wallet, puis renvoyez la requête avec un header `PAYMENT-SIGNATURE` contenant votre payload de paiement encodé en base64. Les SDK clients x402 s&#39;en chargent automatiquement.

<div id="step-3-settlement">
  ### Étape 3 : Settlement
</div>

Exa vérifie votre payment signature auprès du facilitator, puis lance le settlement on-chain **en parallèle** du traitement de votre requête. La réponse est mise en attente jusqu&#39;à la confirmation du settlement. En cas de succès, vous recevez :

* une réponse HTTP `200` avec vos résultats
* un header `PAYMENT-RESPONSE` contenant le settlement receipt (encodé en base64), avec le hash de la transaction on-chain

Si le settlement échoue, vous obtenez un `402` accompagné à la fois de `PAYMENT-RESPONSE` (détails de l&#39;erreur) et de `PAYMENT-REQUIRED` (afin que vous puissiez réessayer).

<div id="pricing">
  ## Tarification
</div>

x402 utilise la même tarification groupée que la facturation par API key. Les prix sont calculés en amont à partir des paramètres de votre requête (et non des résultats réellement renvoyés).

<div id="search-search">
  ### Search (`/search`)
</div>

| Type de recherche         | Prix de base (jusqu&#39;à 10 résultats) | Par résultat au-delà de 10 |
| ------------------------- | --------------------------------------- | -------------------------- |
| `instant`, `auto`, `fast` | $0,007 / requête                        | S.O. (plafonné à 10)       |
| `deep-lite`               | $0,012 / requête                        | S.O. (plafonné à 10)       |
| `deep`                    | $0,012 / requête                        | S.O. (plafonné à 10)       |
| `deep-reasoning`          | $0,015 / requête                        | S.O. (plafonné à 10)       |

L&#39;ajout de `contents.summary` coûte **$0,001 de plus par résultat**.

<Warning>
  Les requêtes x402 sont plafonnées à **10 résultats maximum**. Si vous en demandez davantage, `numResults` est silencieusement ramené à 10 et la tarification s&#39;appuie sur 10 résultats.
</Warning>

<div id="contents-contents">
  ### Contents (`/contents`)
</div>

Chaque type de contenu est facturé par page/URL :

| Type de contenu | Prix par page |
| --------------- | ------------- |
| `text`          | $0,001        |
| `highlights`    | $0,001        |
| `summary`       | $0,001        |

Si vous ne demandez aucun type de contenu (ni `text`, ni `highlights`, ni `summary`), `text` est activé par défaut.

<div id="examples">
  ### Exemples
</div>

| Requête                                             | Prix   | USDC atomic |
| --------------------------------------------------- | ------ | ----------- |
| `/search` avec 10 résultats, `type: "auto"`         | $0.007 | 7000        |
| `/search` avec 5 résultats, `type: "fast"`          | $0.007 | 7000        |
| `/search` avec 3 résultats + résumé, `type: "auto"` | $0.010 | 10000       |
| `/search` avec 10 résultats, `type: "deep-lite"`    | $0.012 | 12000       |
| `/search` avec 10 résultats, `type: "deep"`         | $0.012 | 12000       |
| `/contents` pour 2 URL avec `text: true`            | $0.002 | 2000        |
| `/contents` pour 1 URL avec `text` + `summary`      | $0.002 | 2000        |

<div id="quickstart">
  ## Quickstart
</div>

<div id="install-dependencies">
  ### Installer les dépendances
</div>

<CodeGroup>
  ```bash JavaScript theme={null}
  npm install @x402/fetch @x402/core @x402/evm viem
  # Pour la prise en charge de Solana, installez également :
  npm install @x402/svm @solana/kit @scure/base
  ```

  ```bash Python theme={null}
  pip install "x402[requests,evm]"
  # Pour la prise en charge de Solana, installez également :
  pip install "x402[svm]" "solana<0.40"
  ```
</CodeGroup>

<Note>
  Aucune installation n&#39;est nécessaire pour cURL, mais vous devrez gérer manuellement le challenge 402 et la signature du paiement. L&#39;approche par SDK est recommandée en production.
</Note>

<Tip>
  Vous ne souhaitez pas gérer de private keys ? Les [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) assurent une gestion des clés isolée par TEE pour les agents IA. Votre agent ne voit jamais la private key. Le wallet est compatible viem : il fonctionne donc directement avec `@x402/fetch`.
</Tip>

<div id="make-a-paid-search-request">
  ### Effectuer une search payante
</div>

<CodeGroup>
  ```typescript JavaScript theme={null}
  import { wrapFetchWithPayment } from "@x402/fetch";
  import { x402Client, x402HTTPClient } from "@x402/core/client";
  import { ExactEvmScheme } from "@x402/evm/exact/client";
  // Pour la prise en charge de Solana, importez également :
  // import { ExactSvmScheme } from "@x402/svm/exact/client";
  import { privateKeyToAccount } from "viem/accounts";

  const signer = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(signer));
  // Enregistrez aussi un signataire Solana si vous souhaitez que le client utilise les entrées
  // accept de Solana telles que `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` :
  // client.register("solana:*", new ExactSvmScheme(svmSigner));
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  const response = await fetchWithPayment("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);

  // Vérifier le settlement receipt
  const httpClient = new x402HTTPClient(client);
  const receipt = httpClient.getPaymentSettleResponse(
    (name) => response.headers.get(name)
  );
  console.log("Transaction:", receipt?.transaction);
  ```

  ```python Python theme={null}
  import os
  import requests
  from eth_account import Account
  from x402 import x402ClientSync
  from x402.http.clients import wrapRequestsWithPayment
  from x402.mechanisms.evm.exact import register_exact_evm_client
  from x402.mechanisms.evm.signers import EthAccountSigner

  account = Account.from_key(os.environ["WALLET_PRIVATE_KEY"])
  client = x402ClientSync()
  register_exact_evm_client(
      client,
      EthAccountSigner(account),
      networks="eip155:*",
  )
  session = wrapRequestsWithPayment(requests.Session(), client)

  response = session.post("https://api.exa.ai/search", json={
      "query": "best machine learning frameworks",
      "numResults": 5,
  })

  data = response.json()
  for result in data["results"]:
      print(result["url"], result["title"])
  print("Payment response:", response.headers.get("PAYMENT-RESPONSE"))
  ```

  ```bash cURL theme={null}
  # Étape 1 : discovery, récupérer les informations de tarification
  curl -s -o /dev/null -w "%{http_code}" -D - \
    -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # Renvoie 402 avec le header PAYMENT-REQUIRED contenant la tarification encodée en base64

  # Étape 2 : signez le paiement avec votre wallet (utilisez le SDK pour cela)
  # Étape 3 : réessayez avec la payment signature
  curl -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "PAYMENT-SIGNATURE: <base64-encoded-payment>" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # Renvoie 200 avec les résultats + le header PAYMENT-RESPONSE (settlement receipt)
  ```
</CodeGroup>

<Info>
  cURL impose de signer le paiement manuellement. En production, utilisez le SDK JavaScript ou Python, qui gère automatiquement l&#39;intégralité du flux 402 &gt; signature &gt; nouvelle tentative.
</Info>

<div id="discovery-mode-no-wallet-needed">
  ### Mode discovery (aucun wallet requis)
</div>

Interrogez la tarification sans wallet en envoyant des requêtes non authentifiées :

<CodeGroup>
  ```typescript JavaScript theme={null}
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "test query", numResults: 3 }),
  });

  // res.status === 402
  const paymentRequired = JSON.parse(
    atob(res.headers.get("PAYMENT-REQUIRED")!)
  );
  console.log(
    paymentRequired.accepts.map(({ network, amount }) => ({
      network,
      amount,
    }))
  );
  ```

  ```python Python theme={null}
  import base64, json, requests

  res = requests.post("https://api.exa.ai/search", json={
      "query": "test query",
      "numResults": 3,
  })

  # res.status_code == 402
  pricing = json.loads(base64.b64decode(res.headers["PAYMENT-REQUIRED"]))
  print([(accept["network"], accept["amount"]) for accept in pricing["accepts"]])
  ```

  ```bash cURL theme={null}
  curl -s -D - -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "test query", "numResults": 3}'
  # Recherchez le header PAYMENT-REQUIRED dans la réponse 402
  # Décodez-le : echo "<header-value>" | base64 -d
  ```
</CodeGroup>

<div id="payment-networks">
  ## Réseaux de paiement
</div>

Exa annonce tous les réseaux actuellement pris en charge dans le tableau `accepts`. Choisissez l&#39;entrée qui correspond à votre wallet et au schéma de client x402 enregistré.

| Réseau             | Identifiant                               | Jeton | Actif                                          |
| ------------------ | ----------------------------------------- | ----- | ---------------------------------------------- |
| Base (Ethereum L2) | `eip155:8453`                             | USDC  | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`   |
| Solana mainnet     | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | USDC  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

Les deux utilisent l&#39;USDC à 6 décimales (`1000000` = 1,00 $) et sont réglés on-chain via un facilitator x402.

<div id="rate-limits">
  ## Limites de débit
</div>

x402 applique sa propre limitation de débit, distincte des limites liées aux API keys :

| Limite                                 | Seuil               | Fenêtre     |
| -------------------------------------- | ------------------- | ----------- |
| Discovery requests non payées (par IP) | 5 requêtes          | 60 secondes |
| Requêtes payées (par wallet)           | 10 requêtes/seconde | 1 seconde   |

Au-delà de 5 discovery requests `402` non authentifiées provenant de la même IP en 60 secondes, les requêtes suivantes renvoient `429 Too Many Requests`. Une requête payée aboutie décrémente le compteur.

Le QPS par wallet s&#39;applique à toutes les requêtes payées provenant de la même adresse de wallet.

<div id="headers-reference">
  ## Référence des headers
</div>

<div id="request-headers">
  ### Headers de requête
</div>

| Header              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `PAYMENT-SIGNATURE` | Payload de paiement encodé en Base64 (x402 v2) |
| `payment-signature` | Alias (également accepté)                      |
| `x-payment`         | Ancien alias (compatibilité v1)                |

<div id="response-headers">
  ### Headers de réponse
</div>

| Header             | Cas                                          | Description                                                                                        |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `PAYMENT-REQUIRED` | Réponses `402`                               | Objet `PaymentRequired` encodé en Base64 contenant la tarification et les instructions de paiement |
| `PAYMENT-RESPONSE` | `200` ou `402` (après tentative de paiement) | Résultat du settlement encodé en Base64 avec le hash de la transaction ou l&#39;erreur             |

<div id="error-codes">
  ## Codes d&#39;erreur
</div>

| Statut | Tag                        | Description                                                                     |
| ------ | -------------------------- | ------------------------------------------------------------------------------- |
| `402`  | `X402_PAYMENT_REQUIRED`    | Aucun paiement fourni. Inclut la tarification dans le header `PAYMENT-REQUIRED` |
| `402`  | `X402_VERIFICATION_FAILED` | La payment signature n&#39;a pas passé la vérification du facilitator           |
| `400`  | `X402_INVALID_SIGNATURE`   | Payment signature mal formée ou impossible à analyser                           |
| `429`  | `X402_TOO_MANY_UNPAID`     | Trop d&#39;unpaid discovery requests provenant de cette IP                      |
| `429`  | `X402_WALLET_RATE_LIMITED` | Le wallet a dépassé 10 requests par seconde                                     |
| `500`  | `X402_INTERNAL_ERROR`      | Erreur côté serveur lors de la génération des exigences de paiement             |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Puis-je utiliser x402 et une API key en même temps ?">
    Si votre requête inclut un header `x-api-key` ou un token `Authorization: Bearer`, le flux par API key est prioritaire et x402 est contourné. Les deux ne se cumulent pas : c&#39;est l&#39;un ou l&#39;autre, requête par requête.
  </Accordion>

  <Accordion title="Que se passe-t-il si le settlement échoue après le traitement de ma requête ?">
    Votre réponse est bloquée. Vous recevez un `402` accompagné à la fois de `PAYMENT-RESPONSE` (contenant l&#39;erreur) et de `PAYMENT-REQUIRED` (afin que votre client puisse réessayer). Aucun résultat n&#39;est renvoyé tant que le settlement n&#39;a pas abouti.
  </Accordion>

  <Accordion title="Pourquoi numResults est-il plafonné à 10 ?">
    Les requêtes x402 imposent un maximum de 10 résultats par search. S&#39;il vous en faut davantage, utilisez le flux par API key avec un plan payant.
  </Accordion>

  <Accordion title="Quels wallets sont pris en charge ?">
    Tout wallet compatible EVM capable de signer des données typées EIP-712 sur Base, ou un wallet Solana pris en charge par le client x402 SVM pour `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`. Le SDK x402 prend en charge `viem`, `ethers`, les signataires Coinbase Wallet et les signataires Solana SVM. Pour les agents IA basés sur EVM, les [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) offrent une gestion des clés isolée par TEE, afin que votre agent ne manipule jamais directement de private keys brutes.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

* [Documentation du protocole x402](https://docs.x402.org) : spécification complète du protocole
* [x402 sur GitHub](https://github.com/coinbase/x402) : SDK et exemples open source
* [@x402/fetch sur npm](https://www.npmjs.com/package/@x402/fetch) : wrapper fetch pour la gestion automatique des paiements
* [@x402/svm sur npm](https://www.npmjs.com/package/@x402/svm) : prise en charge des paiements exacts Solana/SVM
* [Guide de l&#39;Exa Search API](/fr/docs/search/quickstart) : référence complète des paramètres de search
* [Guide de l&#39;API Contents d&#39;Exa](/fr/docs/contents/quickstart) : référence complète des paramètres de contenu