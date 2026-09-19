> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="nevermined">
  # Nevermined
</div>

> Paiements autonomes d&#39;agents pour Exa via la card-delegation x402 de Nevermined. Un achat de 7 USD provisionne une Exa API key ou la recharge de 7 USD de crédits.

Les agents paient Exa par carte bancaire grâce au mécanisme [x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation) de [Nevermined](https://nevermined.ai). Chaque **achat de $7** renvoie une Exa API key assortie de **$7 de crédits Exa**.

<Info>
  Utilisez ce plan ID Nevermined :<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />Ce plan fonctionne dans l&#39;environnement live de Nevermined (API keys préfixées par live). L&#39;achat porte sur des crédits d&#39;API, et non sur une seule requête.
</Info>

Pour un payeur Nevermined qui effectue son premier achat, `POST /team-management/nevermined/purchase-key` provisionne une nouvelle Exa API key et y ajoute $7 de crédits. Si la key est épuisée, générez (mint) un nouveau jeton x402 avec la même delegation, puis appelez de nouveau le même endpoint. Exa renvoie la même API key, créditée de $7 supplémentaires.

<div id="buy-a-key">
  ## Acheter une key
</div>

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **Coût :** 7 $ par achat, débités sur la carte associée à la delegation référencée par le jeton x402.
* **Réponse (nouveau payeur) :** `{ status: "ok", apiKey: "…", expiresAt: null }` — une nouvelle Exa API key créditée de 7 $.
* **Réponse (payeur existant) :** `{ status: "ok", apiKey: "…", expiresAt: null }` — la même Exa API key, créditée de 7 $ supplémentaires.
* **Réponse (jeton rejoué) :** résultat mis en cache, aucun nouveau débit.
* **Signature manquante ou invalide :** `402 Payment Required` avec les exigences de paiement dans le corps de la réponse.

<div id="how-it-works">
  ## Fonctionnement
</div>

La partie paiement est gérée par Nevermined ; Exa ne voit que le jeton x402 signé.

1. **Configuration unique (par le propriétaire de la carte) :** enregistrez une carte sur [nevermined.app](https://nevermined.app), créez-y une **delegation** (l&#39;autorisation de dépense : le propriétaire fixe une limite et une durée, et peut la restreindre à une API key précise), puis émettez une API key Nevermined pour l&#39;agent.
2. **L&#39;agent trouve sa delegation.** Le SDK Nevermined permet à l&#39;agent de découvrir les delegations sur lesquelles sa key peut dépenser et d&#39;en choisir une dont le budget restant est suffisant (au moins 7 $). S&#39;il n&#39;en existe aucune, le propriétaire en crée une depuis le dashboard, ou un agent entièrement autonome peut en créer une via le SDK, dans les limites de la carte.
3. **L&#39;agent mint un jeton d&#39;accès x402** pour le plan ID ci-dessus, selon le schéma card-delegation, en référençant la delegation par son ID. Les delegations doivent exister avant le mint : un jeton ne peut pas les créer à la volée.
4. **L&#39;agent envoie le jeton en POST vers l&#39;endpoint ci-dessus** dans le header `payment-signature` et récupère l&#39;Exa API key dans la réponse.
5. **La key est utilisable immédiatement** avec l&#39;[Exa Search API](/fr/docs/search/quickstart) standard.

Pour la marche à suivre complète, pensée pour les agents (méthodes du SDK, parameters, découverte et création de delegations, dépannage), consultez le Guide d’intégration Exa de Nevermined : [nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agents : récupérez [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)).

<div id="what-7-buys">
  ## Ce que permettent 7 $
</div>

Les crédits sont consommés selon la tarification standard de l&#39;API Exa. Aux tarifs actuels, 7 $ de crédits couvrent environ :

| Endpoint ou fonctionnalité                                       |                                  Prix |              Usage approximatif |
| ---------------------------------------------------------------- | ------------------------------------: | ------------------------------: |
| Search (`instant`, `fast`, `auto`) avec jusqu&#39;à 10 résultats |                  7 $ / 1 000 requêtes |                  1 000 requêtes |
| Deep-Lite Search                                                 |                 10 $ / 1 000 requêtes |                    700 requêtes |
| Deep Search                                                      |                 12 $ / 1 000 requêtes |                   ~583 requêtes |
| Deep-Reasoning Search                                            |                 15 $ / 1 000 requêtes |                   ~466 requêtes |
| Contents (`text`, `highlights` ou `summary`)                     | 1 $ / 1 000 pages par type de contenu |                     7 000 pages |
| Résumés de pages par IA sur Search ou Contents                   |                     1 $ / 1 000 pages |                   7 000 résumés |
| Résultats supplémentaires au-delà des 10 premiers                |                 1 $ / 1 000 résultats | 7 000 résultats supplémentaires |
| Answer                                                           |                  5 $ / 1 000 requêtes |                  1 400 requêtes |
| Monitors                                                         |                 15 $ / 1 000 requêtes |                   ~466 requêtes |

Les requêtes de search incluent le texte et les highlights pour un maximum de 10 résultats. Les résultats au-delà de 10 et les résumés par IA sont facturés séparément.<br />
Pour tous les détails de tarification, consultez la [tarification Exa](https://exa.ai/pricing).

<div id="when-the-key-runs-out">
  ## Lorsque la clé est épuisée
</div>

Exa renvoie **`HTTP 402`** sur les endpoints classiques de l&#39;API dès que les crédits de l&#39;API key sont épuisés :

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

Générez (mint) un nouveau jeton x402 avec le même plan ID et la même delegation, puis envoyez-le de nouveau par POST au même endpoint `/purchase-key`. Exa ajoute alors 7 $ de crédits supplémentaires à la même API key.

<div id="references">
  ## Références
</div>

* [Guide d&#39;intégration Exa de Nevermined](https://nevermined.ai/docs/integrations/exa)
* [Spécification x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Tarifs Exa](https://exa.ai/pricing)
* [Exa Search API](/fr/docs/search/quickstart)