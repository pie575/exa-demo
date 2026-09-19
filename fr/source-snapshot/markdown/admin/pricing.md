> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="pricing">
  # Pricing
</div>

> Tarifs à l&#39;usage pour Exa Search, Contents, Answer, Monitors et l&#39;API Agent

***

Exa fonctionne à l&#39;usage. Aucun abonnement, aucune dépense minimale : vous créditez votre compte et êtes facturé à la requête, aux tarifs ci-dessous.

<Check>
  **Démarrez gratuitement.** Les nouveaux comptes reçoivent 20 $ de credits offerts (environ 2 800 searches), et l&#39;offre gratuite ajoute 10 $ de credits chaque mois. Obtenez une API key et lancez-vous.

  **Vous montez en charge ?** Pour de gros volumes, des custom indexes, des rate limits plus élevées, des SLA ou le Zero Data Retention, [contactez-nous](https://exa.ai/contact/sales) pour un [plan Enterprise](#enterprise) avec remises sur volume.
</Check>

<Card title="Obtenez votre Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une key dans le dashboard. Les nouveaux comptes démarrent avec des credits offerts.
</Card>

<div id="products">
  ## Produits
</div>

<Columns cols={3}>
  <Card title="Search" icon="search" href="/fr/docs/search/quickstart">
    **$7** / 1 k requêtes

    Recherche en temps réel avec un contenu de page économe en tokens.
  </Card>

  <Card title="Deep Search" icon="microscope" href="/fr/docs/search/deep-search">
    **$12–15** / 1 k requêtes

    Recherche en plusieurs étapes avec sorties structurées et citations.
  </Card>

  <Card title="Contents" icon="file-text" href="/fr/docs/contents/quickstart">
    **$1** / 1 k pages

    Texte intégral des pages, highlights et résumés pour des URL connues.
  </Card>

  <Card title="Answer" icon="message-circle" href="/fr/docs/reference/answer">
    **$5** / 1 k requêtes

    Une réponse de LLM à une question, avec citations.
  </Card>

  <Card title="Monitors" icon="bell" href="/fr/docs/monitors/quickstart">
    **$15** / 1 k requêtes

    Recherches planifiées qui font remonter les nouveaux événements sur le web.
  </Card>

  <Card title="Agent" icon="bot" href="/fr/docs/agent/quickstart">
    **$0,012–$1,00** / run à effort fixe, ou à l&#39;usage

    Deep research asynchrone, list building et enrichment.
  </Card>
</Columns>

<div id="search-contents-answer-and-monitors">
  ## Search, Contents, Answer et Monitors
</div>

Chaque endpoint a un prix de base par requête incluant jusqu&#39;à 10 résultats. Les résultats supplémentaires et les résumés de pages générés par Exa sont facturés en sus.

| Endpoint    | Prix de base<br />(jusqu&#39;à 10 résultats) | Chaque résultat au-delà de 10 | Résumés de pages par IA |
| ----------- | -------------------------------------------- | ----------------------------- | ----------------------- |
| `/search`   | 7 $ / 1k requêtes                            | 1 $ / 1k résultats            | 1 $ / 1k pages          |
| `/answer`   | 5 $ / 1k requêtes                            | —                             | —                       |
| `/monitors` | 15 $ / 1k requêtes                           | 1 $ / 1k résultats            | 1 $ / 1k pages          |
| `/contents` | 1 $ / 1k pages, par type de contenu          | —                             | 1 $ / 1k pages          |

<div id="agent">
  ## Agent
</div>

Définissez un `effort` fixe sur [Agent](/fr/docs/agent/quickstart) pour obtenir un prix par requête prévisible. `auto` est le mode mesuré par défaut ; le mode bêta `max` est lui aussi mesuré et applique les mêmes tarifs d&#39;usage :

| Effort    | Prix             |
| --------- | ---------------- |
| `minimal` | $0.012 / requête |
| `low`     | $0.025 / requête |
| `medium`  | $0.10 / requête  |
| `high`    | $0.50 / requête  |
| `xhigh`   | $1.00 / requête  |

Les runs mesurés sont facturés à l&#39;usage réel, dans la limite de leur plafond par run. `auto` applique par défaut un plafond de $5 ; le mode bêta `max`, un plafond de $20 :

| Composant d&#39;usage               | Prix                        |
| ----------------------------------- | --------------------------- |
| Agent Compute Units                 | $0.10 / ACU                 |
| Tool calls de search                | $0.005 / search             |
| Enrichissement de contact e-mail    | $0.02 / e-mail              |
| Enrichissement de contact téléphone | $0.07 / numéro de téléphone |

<div id="connect-providers">
  ### Providers Connect
</div>

Les runs qui utilisent des sources de données [Exa Connect](/fr/docs/agent/connect/overview)
entraînent en plus la facturation de chaque appel de provider — par exemple
[Fiber.ai](/fr/docs/agent/connect/fiber#pricing) à $0.02 par credit et
[Baselayer](/fr/docs/agent/connect/baselayer#pricing) à $0.15–$4.00 par
commande selon l&#39;opération. Consultez la
[tarification de Connect](/fr/docs/agent/connect/overview#pricing) pour connaître l&#39;ensemble
des tarifs des providers.

<div id="deep-search">
  ## Deep Search
</div>

Se définit avec `type` sur [`/search`](/fr/docs/search/deep-search). Les résultats supplémentaires et les résumés de page par IA sont facturés au même tarif qu&#39;une recherche standard.

| Type             | Prix de base<br />(jusqu&#39;à 10 résultats) | Latence          | Idéal pour                                         |
| ---------------- | -------------------------------------------- | ---------------- | -------------------------------------------------- |
| `deep-lite`      | 12 $ / 1 000 requêtes                        | ~4 secondes      | Synthèse légère                                    |
| `deep`           | 12 $ / 1 000 requêtes                        | 4 à 15 secondes  | Raisonnement multi-étapes avec sorties structurées |
| `deep-reasoning` | 15 $ / 1 000 requêtes                        | 12 à 40 secondes | Tâches de recherche plus complexes                 |

<div id="enterprise">
  ## Enterprise
</div>

Pour les volumes élevés, les jeux de données personnalisés et les exigences de sécurité renforcées.

<Columns cols={3}>
  <Card title="Recherche puissante" icon="gauge">
    Jusqu&#39;à 1 000 résultats par recherche, des requêtes de plus de 25 résultats, des rate limits (QPS) personnalisés, une modération sur mesure et des index personnalisés.
  </Card>

  <Card title="Support Enterprise" icon="headphones">
    SLA et MSA, accompagnement et support individuels, et [Zero Data Retention](/fr/docs/admin/security/zero-data-retention).
  </Card>

  <Card title="Tarification personnalisée" icon="tag">
    Remises sur volume et facturation postpayée sur facture.
  </Card>
</Columns>

<Card title="Contactez-nous" icon="mail" horizontal href="https://exa.ai/contact/sales">
  Obtenez un devis adapté à vos volumes et conditions Enterprise
</Card>

<div id="cost-glossary">
  ## Glossaire des coûts
</div>

<AccordionGroup>
  <Accordion title="Requête">
    Un appel d&#39;API vers un endpoint. Les tarifs sont indiqués pour 1 000 requêtes : un tarif de 7 $ / 1 k correspond donc à 0,007 $ par appel.
  </Accordion>

  <Accordion title="Résultat">
    Un résultat de recherche renvoyé dans une réponse. Le prix de base couvre les 10 premiers résultats d&#39;une requête ; chaque résultat au-delà de 10 ajoute 1 $ / 1 k résultats. Demander `numResults: 20` revient donc au prix de base plus 10 résultats supplémentaires.
  </Accordion>

  <Accordion title="Page et type de contenu">
    Une page correspond à une URL dont Exa renvoie le contenu. Un type de contenu est une vue de cette page : `text`, `highlights` ou `summary`. `/contents` facture chaque type de contenu séparément : une page avec `text` et `highlights` compte donc pour deux.
  </Accordion>

  <Accordion title="Résumé de page par IA">
    Un résumé de page généré par Exa, produit par un appel LLM supplémentaire de notre côté. Facturé 1 $ / 1 k pages sur tout endpoint qui en renvoie un.
  </Accordion>

  <Accordion title="Agent Compute Unit (ACU)">
    L&#39;unité de calcul de modèle consommée par un run Agent, indiquée dans `usage.agentComputeUnits`. Les runs plus longs, des `input.data` plus volumineux et un plus grand nombre d&#39;étapes de raisonnement consomment davantage d&#39;ACU.
  </Accordion>

  <Accordion title="Effort">
    Le paramètre Agent qui arbitre entre coût et latence d&#39;un côté, et exhaustivité de l&#39;autre. `auto` facture à la consommation (ACU et tool calls) jusqu&#39;à un plafond par défaut de 5 $ ; `max` (bêta) applique les mêmes tarifs d&#39;usage jusqu&#39;à un plafond par défaut de 20 $. Les efforts fixes sont facturés à un prix forfaitaire par requête. Voir [Modes d&#39;effort d&#39;Agent](/fr/docs/agent/quickstart#effort).
  </Accordion>

  <Accordion title="Enrichissement de contact">
    Une recherche Agent qui renvoie une adresse e-mail ou un numéro de téléphone pour une personne ou une entreprise. Facturée par contact trouvé, en plus des autres coûts du run.
  </Accordion>

  <Accordion title="Credits">
    Solde prépayé en dollars sur votre compte. L&#39;usage décompte les credits selon les tarifs ci-dessus.
  </Accordion>
</AccordionGroup>

<Card title="Facturation" icon="credit-card" horizontal href="/fr/docs/admin/billing">
  Ajoutez des credits, configurez le rechargement automatique et retrouvez vos factures
</Card>