> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="world-agentkit">
  # World AgentKit
</div>

> Permettez aux AI agents adossés à un verified human d&#39;accéder gratuitement à Exa grâce à World AgentKit — sans USDC.

<div id="what-is-agentkit">
  ## Qu&#39;est-ce qu&#39;AgentKit ?
</div>

[World AgentKit](https://docs.world.org/agents/agent-kit) est une boîte à outils qui permet aux agents IA de prouver qu&#39;ils sont adossés à un véritable humain vérifié via [World ID](https://world.org). Intégrée à [x402](/fr/docs/integrations/payments/x402/quickstart), elle ouvre une voie d&#39;**essai gratuit** : les agents enregistrés dans l&#39;[AgentBook](https://docs.world.org/agents/agent-kit/integrate) de World peuvent accéder aux endpoints `/search` et `/contents` d&#39;Exa sans payer d&#39;USDC.

Ce mécanisme fonctionne en parallèle du x402 payment flow standard. Chaque verified human bénéficie de **100 requêtes gratuites par mois**, réparties sur l&#39;ensemble des agents qu&#39;il soutient. Une fois ce quota épuisé, l&#39;agent bascule sur le parcours de paiement en USDC habituel. Les compteurs sont réinitialisés au début de chaque mois calendaire (UTC).

<Info>
  L&#39;essai gratuit AgentKit et le x402 payment sont tous deux contournés si votre requête inclut un header `x-api-key` ou `Authorization: Bearer`. Le flux d&#39;API key billing habituel est alors prioritaire.
</Info>

<div id="how-it-works">
  ## Fonctionnement
</div>

Lorsqu&#39;un client appelle `/search` ou `/contents` sans API key, Exa renvoie une réponse `402 Payment Required`. Cette réponse inclut une extension `agentkit` dans le header `PAYMENT-REQUIRED`, contenant un challenge [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) (Sign-In with Ethereum).

L&#39;agent signe ce challenge avec son wallet enregistré, puis Exa procède aux vérifications suivantes :

1. **Vérification de la signature** — la signature SIWE est validée par rapport à l&#39;adresse du wallet (prise en charge des EOA via EIP-191 comme des smart contract wallets via ERC-1271)
2. **Consultation d&#39;AgentBook** — le wallet est résolu en un `humanId` anonyme via le contrat AgentBook sur World Chain (`eip155:480`), ce qui confirme qu&#39;un verified human unique a délégué son identité à cet agent
3. **Vérification de l&#39;usage** — s&#39;il reste des utilisations d’essai gratuit à cet humain, l&#39;accès est accordé ; sinon, un payment en USDC est exigé

<div id="quickstart">
  ## Quickstart
</div>

<div id="1-register-your-agent-in-agentbook">
  ### 1. Enregistrez votre agent dans AgentBook
</div>

Cette configuration n&#39;est à effectuer qu&#39;une seule fois. Vous aurez besoin de l&#39;[application World](https://world.org/download) avec une identité vérifiée.

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

La CLI déclenche un flux de vérification World App, puis soumet une transaction d&#39;enregistrement sur World Chain. Une fois l&#39;opération terminée, tout serveur utilisant AgentKit peut retrouver votre wallet et confirmer qu&#39;il est bien associé à une personne réelle.

<div id="2-send-a-request-get-the-challenge">
  ### 2. Envoyer une requête (obtenir le challenge)
</div>

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

La réponse `402` inclut une extension `agentkit` dans le payload `PAYMENT-REQUIRED` décodé :

```json theme={null}
{
  "x402Version": 2,
  "accepts": [ ... ],
  "extensions": {
    "agentkit": {
      "info": {
        "version": "1",
        "statement": "Verify your agent is backed by a real human to access Exa",
        "domain": "api.exa.ai",
        "uri": "https://api.exa.ai/search",
        "nonce": "abc123...",
        "issuedAt": "2026-04-11T01:30:00.000Z",
        "resources": ["https://api.exa.ai/search"]
      },
      "supportedChains": [
        { "chainId": "eip155:480", "type": "eip191" },
        { "chainId": "eip155:480", "type": "eip1271" }
      ],
      "schema": { ... },
      "_options": {
        "statement": "Verify your agent is backed by a real human to access Exa",
        "mode": { "type": "free-trial", "uses": 100 },
        "network": "eip155:480"
      }
    }
  }
}
```

<div id="3-sign-the-challenge-and-resubmit">
  ### 3. Signer le challenge et resoumettre
</div>

Construisez un [message SIWE](https://eips.ethereum.org/EIPS/eip-4361) à partir des fields de `info` (domain, uri, nonce, statement, etc.), signez-le avec le wallet de votre agent enregistré à l&#39;aide de l&#39;un des types `supportedChains`, puis envoyez-le dans le header `agentkit` (JSON encodé en base64) :

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

Si l&#39;agent est vérifié et qu&#39;il lui reste des utilisations d&#39;essai gratuit, Exa renvoie `200` avec les résultats de recherche — aucun paiement n&#39;est requis.

<div id="using-the-agentkit-x402-skill">
  ### Utiliser la skill AgentKit x402
</div>

Plutôt que d&#39;implémenter manuellement le flux challenge-response, ajoutez la [skill agentkit-x402](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md) à votre agent IA :

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

Cette skill gère automatiquement l&#39;ensemble du flux lorsque l&#39;agent reçoit une response `402` accompagnée d&#39;une extension AgentKit.

<div id="free-trial-details">
  ## Détails de l&#39;essai gratuit
</div>

* Chaque verified human bénéficie de **100 requêtes gratuites par mois**, tous agents qu&#39;il soutient confondus
* Les compteurs d&#39;usage sont réinitialisés au début de chaque mois calendaire (UTC)
* L&#39;usage est suivi par human et par endpoint (`/search` et `/contents` sont comptabilisés séparément)
* Deux agents soutenus par le même human partagent le même compteur
* Une fois les utilisations d’essai gratuit épuisées pour le mois en cours, l&#39;agent bascule sur le [x402 payment flow](/fr/docs/integrations/payments/x402/quickstart) standard
* La même [limite de 10 résultats](/fr/docs/integrations/payments/x402/quickstart#pricing) s&#39;applique aux requêtes de l&#39;essai gratuit sur `/search`
* Le compteur de l&#39;essai gratuit n&#39;est pas encore exposé dans la réponse de l&#39;API — une fois les utilisations d’essai gratuit épuisées, le serveur renvoie un `402` standard sans accorder d&#39;accès gratuit

<div id="supported-endpoints">
  ## Endpoints pris en charge
</div>

| Endpoint    | Paiement x402 | Essai gratuit AgentKit |
| ----------- | :-----------: | :--------------------: |
| `/search`   |      Oui      |           Oui          |
| `/contents` |      Oui      |           Oui          |

Aucun autre endpoint Exa n&#39;est pris en charge via x402 ou via l&#39;essai gratuit AgentKit.

<div id="network-details">
  ## Détails du réseau
</div>

| Propriété                       | Valeur                                             |
| ------------------------------- | -------------------------------------------------- |
| Chaîne AgentBook                | World Chain                                        |
| Chain ID (CAIP-2)               | `eip155:480`                                       |
| Vérification                    | Contrat AgentBook sur World Chain                  |
| Types de wallets pris en charge | EOA (EIP-191) et smart contract wallets (ERC-1271) |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Puis-je utiliser à la fois le paiement x402 et AgentKit ?">
    Oui. La réponse `PAYMENT-REQUIRED` contient à la fois la tarification du paiement et le challenge AgentKit. Votre client peut choisir l&#39;une ou l&#39;autre voie. Une fois les utilisations d’essai gratuit épuisées, l&#39;agent peut se rabattre sur un paiement en USDC.
  </Accordion>

  <Accordion title="Que se passe-t-il si mon agent n'est pas enregistré dans AgentBook ?">
    La vérification AgentKit échoue silencieusement et la requête est traitée comme un `402` standard : votre agent peut toujours payer en USDC via le flux x402 habituel.
  </Accordion>

  <Accordion title="Deux agents rattachés au même humain disposent-ils de quotas d'essai gratuit distincts ?">
    Non. L&#39;usage est comptabilisé par humain (via le `humanId` anonyme issu d&#39;AgentBook), et non par wallet. Deux agents rattachés au même World ID partagent le même compteur.
  </Accordion>

  <Accordion title="Quels réseaux blockchain sont concernés ?">
    Les paiements x402 standards en USDC peuvent être réglés sur **Base** (`eip155:8453`) ou sur **Solana mainnet** (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`). La vérification AgentKit s&#39;appuie sur **World Chain** (`eip155:480`) pour les recherches dans AgentBook. Ces mécanismes sont indépendants : AgentKit ne requiert aucun paiement on-chain.
  </Accordion>

  <Accordion title="Quels types de wallets sont pris en charge ?">
    Aussi bien les EOA (comptes détenus en externe) utilisant des signatures EIP-191 que les smart contract wallets (par ex. Coinbase Smart Wallet, Safe) utilisant ERC-1271. Consultez la [SDK reference World AgentKit](https://docs.world.org/agents/agent-kit/sdk-reference) pour plus de détails.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

* [Guide de paiement x402](/fr/docs/integrations/payments/x402/quickstart) : payment flow USDC standard
* [Documentation World AgentKit](https://docs.world.org/agents/agent-kit) : documentation complète d&#39;AgentKit
* [Guide d&#39;intégration World AgentKit](https://docs.world.org/agents/agent-kit/integrate) : inscription à AgentBook
* [SDK reference World AgentKit](https://docs.world.org/agents/agent-kit/sdk-reference) : reference de l&#39;API du SDK
* [Skill x402 pour AgentKit](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md) : skill prête à l&#39;emploi pour les AI agents
* [Documentation du protocole x402](https://docs.x402.org) : spécification x402 complète