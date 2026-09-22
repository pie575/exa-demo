> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="nevermined">
  # Nevermined
</div>

> Paiements autonomes pour Exa par les agents via la délégation de carte x402 de Nevermined. Un achat de 7 USD provisionne ou recharge une API key Exa avec 7 USD de crédits.

Les agents paient Exa par carte bancaire via le schéma [x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation) de [Nevermined](https://nevermined.ai). Chaque **achat de $7** renvoie une API key Exa créditée de **$7 de crédits Exa**.

<Info>
  Utilisez ce plan ID Nevermined :<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />Ce plan s&#39;exécute sur l&#39;environnement live de Nevermined (API keys préfixées par live). L&#39;achat porte sur des crédits d&#39;API, et non sur une seule search request.
</Info>

Pour un payeur Nevermined qui effectue son premier achat, `POST /team-management/nevermined/purchase-key` provisionne une nouvelle API key Exa et y ajoute $7 de crédits. Si la clé est épuisée, générez un nouveau jeton x402 avec la même délégation et appelez de nouveau le même endpoint. Exa renvoie la même API key, avec $7 de crédits supplémentaires.

<div id="buy-a-key">
  ## Acheter une clé
</div>

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **Coût :** 7 $ par achat, débités sur la carte associée à la délégation référencée par le jeton x402.
* **Réponse (nouveau payeur) :** `{ status: "ok", apiKey: "…", expiresAt: null }` — une nouvelle API key Exa créditée de 7 $.
* **Réponse (payeur existant) :** `{ status: "ok", apiKey: "…", expiresAt: null }` — la même API key Exa, créditée de 7 $ supplémentaires.
* **Réponse (jeton rejoué) :** résultat mis en cache, aucun nouveau débit.
* **Signature manquante ou invalide :** `402 Payment Required` avec les exigences de paiement dans le corps.

<div id="how-it-works">
  ## Fonctionnement
</div>

La partie paiement est gérée par Nevermined ; Exa ne voit que le jeton x402 signé.

1. **Configuration unique (par le propriétaire de la carte) :** enregistrez une carte sur [nevermined.app](https://nevermined.app), créez-y une **délégation** (l&#39;autorisation de dépense : le propriétaire définit une limite et une durée, et peut la restreindre à une API key précise), puis émettez une API key Nevermined pour l&#39;agent.
2. **L&#39;agent trouve sa délégation.** Le SDK Nevermined permet à l&#39;agent de découvrir les délégations sur lesquelles sa clé peut dépenser et d&#39;en choisir une disposant d&#39;un budget restant suffisant (au moins 7 $). S&#39;il n&#39;en existe aucune, le propriétaire en crée une dans le tableau de bord, ou un agent entièrement autonome peut en créer une via le SDK, dans les limites de la carte.
3. **L&#39;agent mint un jeton d&#39;accès x402** pour le plan ID ci-dessus, selon le schéma card-delegation, en référençant la délégation par son ID. Les délégations doivent exister avant le mint ; les jetons ne peuvent pas les créer à la volée.
4. **L&#39;agent envoie le jeton en POST vers l&#39;endpoint ci-dessus** dans le header `payment-signature` et reçoit l&#39;API key Exa dans la réponse.
5. **La clé fonctionne immédiatement** avec l&#39;[Exa Search API](/fr/docs/search/quickstart) standard.

Pour le guide complet prêt à l&#39;emploi pour les agents (méthodes du SDK, paramètres, découverte et création de délégations, dépannage), consultez le Guide d&#39;intégration Exa de Nevermined : [nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agents : récupérez [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)).

<div id="what-7-buys">
  ## Ce que 7 $ permettent d&#39;obtenir
</div>

Les crédits sont consommés selon la tarification standard de l&#39;API Exa. Aux tarifs actuels, 7 $ de crédits couvrent environ :

| Endpoint ou fonctionnalité                                       |                                  Prix |       Utilisation approximative |
| ---------------------------------------------------------------- | ------------------------------------: | ------------------------------: |
| Search (`instant`, `fast`, `auto`) avec jusqu&#39;à 10 résultats |                  7 $ / 1 000 requests |                  1 000 requests |
| Deep-Lite Search                                                 |                 10 $ / 1 000 requests |                    700 requests |
| Deep Search                                                      |                 12 $ / 1 000 requests |                   ~583 requests |
| Deep-Reasoning Search                                            |                 15 $ / 1 000 requests |                   ~466 requests |
| Contents (`text`, `highlights` ou `summary`)                     | 1 $ / 1 000 pages par type de contenu |                     7 000 pages |
| Résumés de page par IA sur Search ou Contents                    |                     1 $ / 1 000 pages |                   7 000 résumés |
| Résultats supplémentaires au-delà des 10 premiers                |                 1 $ / 1 000 résultats | 7 000 résultats supplémentaires |
| Answer                                                           |                  5 $ / 1 000 requests |                  1 400 requests |
| Monitors                                                         |                 15 $ / 1 000 requests |                   ~466 requests |

Les requêtes Search incluent le texte et les highlights pour un maximum de 10 résultats. Les résultats au-delà des 10 premiers et les résumés par IA sont facturés séparément.<br />
Pour tous les détails de tarification, consultez [la tarification Exa](https://exa.ai/pricing).

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

Générez un nouveau jeton x402 avec le même plan ID et la même délégation, puis envoyez-le à nouveau en POST au même endpoint `/purchase-key`. Exa ajoute 7 $ de crédits supplémentaires à la même API key.

<div id="references">
  ## Références
</div>

* [Guide d’intégration Exa de Nevermined](https://nevermined.ai/docs/integrations/exa)
* [Spécification x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Tarification Exa](https://exa.ai/pricing)
* [Exa Search API](/fr/docs/search/quickstart)