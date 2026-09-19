> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="billing-and-rate-limits">
  # Facturation et rate limits
</div>

> Gérez les credits Exa, les factures et les rate limits de l&#39;API.

Exa propose une offre Free, une facturation à l&#39;usage et des plans Enterprise personnalisés. L&#39;utilisation de l&#39;API est décomptée du solde de credits de votre team, tandis que les rate limits déterminent la fréquence à laquelle la team peut envoyer des requêtes.

<Columns cols={3}>
  <Card title="Billing dashboard" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="Gérer la facturation" arrow="true">
    Ajoutez des credits, configurez l&#39;auto recharge et consultez vos factures.
  </Card>

  <Card title="API keys" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Gérer les API keys" arrow="true">
    Consultez l&#39;usage et définissez une limite plus basse pour une key donnée.
  </Card>

  <Card title="Tarifs" icon="tag" href="/fr/docs/admin/pricing" cta="Voir les tarifs" arrow="true">
    Comparez les tarifs actuels des différents produits Exa.
  </Card>
</Columns>

<div id="plans-at-a-glance">
  ## Les plans en un coup d&#39;œil
</div>

| Plan              | Facturation                                                                    | Rate limit                                             | Concurrency Agent |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------- |
| **Free**          | 20 $ de credits offerts au départ, puis 10 $ de credits renouvelés chaque mois | 10 QPS                                                 | 50 runs actifs    |
| **Pay as you go** | Credits prépayés, sans abonnement ni dépense minimale                          | 10 QPS, [jusqu&#39;à 25 QPS](#25-qps-on-pay-as-you-go) | 50 runs actifs    |
| **Enterprise**    | Tarification sur mesure selon le volume et facturation postpayée en option     | Sur mesure                                             | Sur mesure        |

<Card title="Nous contacter" icon="headset" href="https://exa.ai/contact/sales" cta="Contacter le service commercial" arrow="true">
  Nous vous conseillerons sur la configuration la plus adaptée à vos besoins en matière de latence, de passage à l&#39;échelle, de ZDR et bien plus encore.
</Card>

<div id="billing-basics">
  ## Bases de la facturation
</div>

Les requêtes sont facturées sur des credits prépayés, aux tarifs indiqués dans [tarif](/fr/docs/admin/pricing) ou définis par votre contrat Enterprise. Les propriétaires d&#39;une team peuvent ajouter des credits depuis le [Billing dashboard](https://dashboard.exa.ai/billing) ; les paiements sont traités via Stripe.

Si votre team épuise ses credits, les requêtes renvoient `402 Payment Required`. Une API key qui atteint le budget qui lui est alloué renvoie elle aussi `402`. Ajoutez alors des credits ou demandez à un administrateur de la team de modifier le budget de la key. Consultez les [codes d&#39;erreur](/fr/docs/admin/error-codes).

Pour connaître l&#39;historique d&#39;usage par API key, utilisez [Get API key usage](/fr/docs/reference/team-management/get-api-key-usage).

<div id="rate-limits">
  ## Rate limits
</div>

Les rate limits sont mesurées en requêtes par seconde (QPS) et s&#39;appliquent à l&#39;ensemble de votre team, toutes API keys confondues. Vous pouvez attribuer une rate limit plus basse à une key donnée depuis la page [API Keys](https://dashboard.exa.ai/api-keys), mais son trafic reste comptabilisé dans la rate limit de la team.

| Endpoint                                                      | Limite par défaut       |
| ------------------------------------------------------------- | ----------------------- |
| `/search`, `/answer`, `/chat/completions`                     | 10 QPS                  |
| `/search` avec `type` `deep-lite`, `deep` ou `deep-reasoning` | 5 QPS                   |
| `/contents`                                                   | 100 QPS                 |
| `/agent/runs`, `/responses`                                   | 5 QPS et 50 runs actifs |
| `/websets/*`                                                  | 20 QPS                  |

Certains endpoints partagent la même capacité de rate limit. Les rate limits sont susceptibles d&#39;évoluer et peuvent varier selon le forfait ; les searches Websets sont également soumises à des limites de concurrency dépendant du forfait, que vous pouvez consulter avec [Get Team Info](/fr/docs/websets/api/teams/get-team-info).

Lorsque vous dépassez une rate limit, les requêtes renvoient `429 Too Many Requests`. Attendez le délai indiqué par le header `Retry-After` lorsqu&#39;il est présent, ou réessayez avec un backoff exponentiel. Consultez les [codes d&#39;erreur](/fr/docs/admin/error-codes).

<div id="agent-limits">
  ### Limites d&#39;Agent
</div>

Les limites d&#39;Agent reposent sur deux contrôles distincts : le nombre de runs pouvant être en cours simultanément, et la vitesse à laquelle vous pouvez en démarrer de nouveaux.

* **Concurrency** : 50 runs d&#39;Agent peuvent être en cours à la fois. Cette limite est indépendante de votre QPS et ne change pas lorsque celui-ci est augmenté. Démarrer un run au-delà de cette limite renvoie `429` avec le code d&#39;erreur `CONCURRENCY_LIMIT_REACHED` ; attendez qu&#39;un run se termine ou contactez-nous pour augmenter votre limite de concurrency.
* **Démarrage des runs** : `POST /agent/runs` puise dans le QPS de votre compte, et chaque démarrage de run compte pour deux requêtes. Vous pouvez donc démarrer des runs à la moitié de votre QPS : un compte disposant du QPS par défaut de 10 peut démarrer 5 runs par seconde, et 25 QPS en autorisent 12 par seconde.
* **Polling** : les requêtes `GET` portant sur le status d&#39;un run, les événements et les listes de runs ne sont pas décomptées de votre QPS et ne bloquent jamais le dispatch ; vous pouvez donc poller les Agents en cours d&#39;exécution indépendamment de la vitesse à laquelle vous en démarrez de nouveaux.

<div id="25-qps-on-pay-as-you-go">
  ### 25 QPS en pay as you go
</div>

Ajoutez $1 000 de credits sur une période de 30 jours et la rate limit de votre team passe automatiquement à **25 QPS pendant 90 jours**. Le seuil prend en compte les credits achetés, et non ceux dépensés, et remplir à nouveau la condition réinitialise les 90 jours. Suivez votre progression sur le [Billing dashboard](https://dashboard.exa.ai/billing).

Besoin de plus de 25 QPS ? [Contactez l&#39;équipe commerciale](https://exa.ai/contact/sales).

<div id="auto-recharge">
  ## Auto recharge
</div>

L&#39;auto recharge achète des credits lorsque votre solde atteint un seuil que vous définissez. Configurez-la depuis le [Billing dashboard](https://dashboard.exa.ai/billing).

| Paramètre               | Description                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Montant de recharge** | Credits achetés à chaque déclenchement de l&#39;auto recharge, de $5 à $10 000.                                                                   |
| **Seuil de recharge**   | Le solde à partir duquel la recharge se déclenche.                                                                                                |
| **Maximum mensuel**     | Plafond facultatif des achats d&#39;auto recharge sur le cycle de facturation. Définissez-le à $0 ou laissez-le vide pour ne fixer aucun plafond. |

Par exemple, avec un montant de recharge de $100, un seuil de $10 et un maximum mensuel de $500, $100 sont achetés dès que le solde atteint $10, jusqu&#39;à $500 d&#39;achats automatiques sur le cycle.

Pour un lancement à venir ou toute autre charge de travail à fort volume, ajoutez suffisamment de credits à l&#39;avance et choisissez un montant d&#39;auto recharge qui évite de multiplier les petites tentatives de payment.

<div id="receipts-and-invoices">
  ## Reçus et factures
</div>

Exa envoie par e-mail les reçus des achats de credits et des auto recharges depuis l&#39;adresse [billing@exa.ai](mailto:billing@exa.ai). Ajoutez cette adresse à votre liste d&#39;autorisation si nécessaire. L&#39;historique complet de vos factures est disponible dans le [Billing dashboard](https://dashboard.exa.ai/billing).

La facturation à terme (sur facture) est disponible avec un plan Enterprise.

<div id="get-help">
  ## Obtenir de l&#39;aide
</div>

<Columns cols={2}>
  <Card title="Augmenter vos limites" icon="gauge" href="https://exa.ai/contact/sales" cta="Contacter le service commercial" arrow="true">
    Demandez plus de 25 QPS, une concurrency personnalisée, une tarification au volume ou une facturation postpayée.
  </Card>

  <Card title="Assistance facturation" icon="mail" href="mailto:billing@exa.ai" cta="Écrire au service facturation" arrow="true">
    Obtenez de l&#39;aide concernant les paiements, les credits, les factures ou toute question de facturation liée à votre compte.
  </Card>
</Columns>