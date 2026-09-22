> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="billing-and-rate-limits">
  # Facturation et limites de débit
</div>

> Gérez vos crédits Exa, vos factures et les limites de débit de l&#39;API.

Exa propose une offre gratuite, une facturation à l&#39;usage et des plans Enterprise sur mesure. L&#39;utilisation de l&#39;API est décomptée du solde de crédits de votre équipe, tandis que les limites de débit déterminent la fréquence à laquelle l&#39;équipe peut envoyer des requests.

<Columns cols={3}>
  <Card title="Tableau de bord de facturation" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="Gérer la facturation" arrow="true">
    Ajoutez des crédits, configurez l&#39;auto recharge et consultez vos factures.
  </Card>

  <Card title="API keys" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Gérer les API keys" arrow="true">
    Consultez l&#39;utilisation et définissez une limite plus basse pour une clé donnée.
  </Card>

  <Card title="Tarification" icon="tag" href="/fr/docs/admin/pricing" cta="Voir la tarification" arrow="true">
    Comparez les tarifs actuels des différents produits Exa.
  </Card>
</Columns>

<div id="plans-at-a-glance">
  ## Aperçu des plans
</div>

| Plan              | Facturation                                                                    | Limite de débit                                        | Concurrency Agent |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------- |
| **Free**          | 20 $ de crédits offerts au départ, puis 10 $ de crédits renouvelés chaque mois | 10 QPS                                                 | 50 runs actifs    |
| **Pay as you go** | Crédits prépayés, sans abonnement ni dépense minimale                          | 10 QPS, [jusqu&#39;à 25 QPS](#25-qps-on-pay-as-you-go) | 50 runs actifs    |
| **Enterprise**    | Tarification par volume personnalisée et facturation postpayée en option       | Personnalisée                                          | Personnalisée     |

<Card title="Contactez-nous" icon="headset" href="https://exa.ai/contact/sales" cta="Contacter l'équipe commerciale" arrow="true">
  Nous vous conseillerons sur la configuration la mieux adaptée à vos besoins en matière de latence, de montée en charge, de ZDR et bien plus encore.
</Card>

<div id="billing-basics">
  ## Bases de la facturation
</div>

Les requests sont décomptées de vos crédits prépayés selon les tarifs indiqués dans [Tarification](/fr/docs/admin/pricing) ou dans votre contrat Enterprise. Les propriétaires d&#39;équipe peuvent ajouter des crédits depuis le [tableau de bord de facturation](https://dashboard.exa.ai/billing) ; les paiements sont traités via Stripe.

Si votre équipe épuise ses crédits, les requests renvoient `402 Payment Required`. Une API key qui atteint le budget qui lui est attribué renvoie également `402`. Ajoutez des crédits ou demandez à un administrateur de l&#39;équipe d&#39;ajuster le budget de la clé. Consultez [Codes d&#39;erreur](/fr/docs/admin/error-codes).

Pour consulter l&#39;historique d&#39;utilisation par API key, utilisez [Get API key usage](/fr/docs/reference/team-management/get-api-key-usage).

<div id="rate-limits">
  ## Limites de débit
</div>

Les limites de débit sont mesurées en requêtes par seconde (QPS) et s&#39;appliquent à votre équipe dans son ensemble, toutes API keys confondues. Vous pouvez attribuer une limite inférieure à une clé donnée depuis la page [API Keys](https://dashboard.exa.ai/api-keys), mais son trafic reste comptabilisé dans la limite de l&#39;équipe.

| Endpoint                                                      | Limite par défaut       |
| ------------------------------------------------------------- | ----------------------- |
| `/search`, `/answer`, `/chat/completions`                     | 10 QPS                  |
| `/search` avec `type` `deep-lite`, `deep` ou `deep-reasoning` | 5 QPS                   |
| `/contents`                                                   | 100 QPS                 |
| `/agent/runs`, `/responses`                                   | 5 QPS et 50 runs actifs |
| `/websets/*`                                                  | 20 QPS                  |

Certains endpoints partagent la même capacité de limite de débit. Les limites peuvent évoluer et varier selon le plan ; les recherches Websets sont également soumises à des limites de concurrency dépendant du plan, que vous pouvez consulter avec [Obtenir les informations de l&#39;équipe](/fr/docs/websets/api/teams/get-team-info).

Lorsque vous dépassez une limite, les requests renvoient `429 Too Many Requests`. Attendez la durée indiquée par le header `Retry-After` lorsqu&#39;il est présent, ou réessayez avec un backoff exponentiel. Consultez [Codes d&#39;erreur](/fr/docs/admin/error-codes).

<div id="agent-limits">
  ### Limites d&#39;Agent
</div>

Les limites d&#39;Agent reposent sur deux contrôles distincts : le nombre de runs pouvant être en cours simultanément et la vitesse à laquelle vous pouvez en démarrer de nouveaux.

* **Concurrency** : 50 runs d&#39;Agent peuvent être en cours en même temps. Cette limite est indépendante de votre QPS et ne change pas lorsque celui-ci est augmenté. Démarrer un run au-delà de la limite renvoie un `429` avec le code d&#39;erreur `CONCURRENCY_LIMIT_REACHED` ; attendez qu&#39;un run se termine ou contactez-nous pour augmenter votre limite de concurrency.
* **Démarrage des runs** : `POST /agent/runs` puise dans le QPS de votre compte, et chaque démarrage de run compte pour deux requests. Vous pouvez donc démarrer des runs à la moitié de votre QPS : un compte disposant du QPS par défaut de 10 peut démarrer 5 runs par seconde, et 25 QPS en autorisent 12 par seconde.
* **Polling** : les requests `GET` portant sur le statut d&#39;un run, les events et les listes de runs ne sont pas décomptées de votre QPS et ne bloquent jamais le dispatch : vous pouvez donc poller les Agents en cours indépendamment de la vitesse à laquelle vous en démarrez de nouveaux.

<div id="25-qps-on-pay-as-you-go">
  ### 25 QPS avec le Pay as you go
</div>

Achetez pour 1 000 $ de crédits sur une période de 30 jours et la limite de débit de votre équipe passe automatiquement à **25 QPS pendant 90 jours**. Le seuil porte sur les crédits que vous achetez, et non sur ceux que vous dépensez, et remplir à nouveau la condition réinitialise les 90 jours. Suivez votre progression sur le [tableau de bord de facturation](https://dashboard.exa.ai/billing).

Besoin de plus de 25 QPS ? [Contactez le service commercial](https://exa.ai/contact/sales).

<div id="auto-recharge">
  ## Auto recharge
</div>

L&#39;auto recharge achète des crédits lorsque votre solde atteint un seuil que vous définissez. Configurez-la depuis le [tableau de bord de facturation](https://dashboard.exa.ai/billing).

| Paramètre               | Description                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Montant de recharge** | Crédits achetés à chaque déclenchement de l&#39;auto recharge, de $5 à $10,000.                                                                           |
| **Seuil de recharge**   | Le solde à partir duquel la recharge se déclenche.                                                                                                        |
| **Maximum mensuel**     | Plafond facultatif des achats en auto recharge pendant le cycle de facturation. Définissez-le à $0 ou laissez-le vide pour n&#39;appliquer aucun plafond. |

Par exemple, avec un montant de recharge de $100, un seuil de $10 et un maximum mensuel de $500, $100 sont achetés chaque fois que le solde atteint $10, dans la limite de $500 d&#39;achats automatiques par cycle.

Pour un lancement à venir ou toute autre charge de travail à fort volume, ajoutez suffisamment de crédits à l&#39;avance et définissez un montant d&#39;auto recharge qui évite de multiplier les petites tentatives de paiement.

<div id="receipts-and-invoices">
  ## Reçus et factures
</div>

Exa envoie par e-mail les reçus des achats de crédits et des auto recharges depuis l&#39;adresse [billing@exa.ai](mailto:billing@exa.ai). Au besoin, ajoutez cette adresse à votre liste d&#39;autorisation. L&#39;historique complet de vos factures est disponible dans le [tableau de bord de facturation](https://dashboard.exa.ai/billing).

La facturation postpayée sur facture est proposée avec un plan Enterprise.

<div id="get-help">
  ## Obtenir de l&#39;aide
</div>

<Columns cols={2}>
  <Card title="Augmentez vos limites" icon="gauge" href="https://exa.ai/contact/sales" cta="Contacter le service commercial" arrow="true">
    Demandez plus de 25 QPS, une concurrency personnalisée, une tarification au volume ou une facturation en post-paiement.
  </Card>

  <Card title="Assistance facturation" icon="mail" href="mailto:billing@exa.ai" cta="Écrire au service facturation" arrow="true">
    Obtenez de l&#39;aide pour vos paiements, vos crédits, vos factures ou toute question de facturation liée à votre compte.
  </Card>
</Columns>