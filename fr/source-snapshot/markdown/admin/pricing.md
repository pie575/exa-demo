> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Tarification {#pricing}

> Tarifs à l&#39;usage pour Exa Search, Contents, Answer, Monitors et l&#39;API Agent

***

Exa fonctionne à l&#39;usage. Ni abonnement, ni dépense minimale : vous créditez votre compte et êtes facturé à la requête, aux tarifs ci-dessous.

<Check>
  **Démarrez gratuitement.** Les nouveaux comptes reçoivent 20 $ de crédits offerts (environ 2 800 recherches), et le Free Tier ajoute 10 $ de crédits chaque mois. Obtenez une API key et lancez-vous.

  **Besoin de passer à l&#39;échelle ?** Pour les gros volumes, les index personnalisés, des limites de débit plus élevées, des SLA ou le Zero Data Retention, [contactez-nous](https://exa.ai/contact/sales) au sujet d&#39;un [plan Enterprise](#enterprise) avec remises sur volume.
</Check>

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le tableau de bord. Les nouveaux comptes démarrent avec des crédits offerts.
</Card>

## Produits {#products}

<Columns cols={3}>
  <Card title="Search" icon="search" href="/fr/docs/search/quickstart">
    **$7** / 1 000 requests

    Recherche en temps réel avec des page contents économes en jetons.
  </Card>

  <Card title="Deep Search" icon="microscope" href="/fr/docs/search/deep-search">
    **$12–15** / 1 000 requests

    Recherche en plusieurs étapes avec sorties structurées et citations.
  </Card>

  <Card title="Contents" icon="file-text" href="/fr/docs/contents/quickstart">
    **$1** / 1 000 pages

    Texte intégral des pages, highlights et résumés pour des URL connues.
  </Card>

  <Card title="Answer" icon="message-circle" href="/fr/docs/reference/answer">
    **$5** / 1 000 requests

    Une réponse de LLM à une question, avec citations.
  </Card>

  <Card title="Monitors" icon="bell" href="/fr/docs/monitors/quickstart">
    **$15** / 1 000 requests

    Recherches planifiées qui font remonter les nouveaux événements sur le web.
  </Card>

  <Card title="Agent" icon="bot" href="/fr/docs/agent/quickstart">
    **$0,012–$1,00** / run à effort fixe, ou à l&#39;utilisation

    Deep research asynchrone, constitution de listes et enrichment.
  </Card>
</Columns>

## Search, Contents, Answer et Monitors {#search-contents-answer-and-monitors}

Chaque endpoint a un prix de base par request qui inclut jusqu&#39;à 10 résultats. Les résultats supplémentaires et les résumés de page générés par Exa sont facturés en sus.

| Endpoint    | Prix de base<br />(jusqu&#39;à 10 résultats) | Chaque résultat au-delà de 10 | Résumés de page par IA |
| ----------- | -------------------------------------------- | ----------------------------- | ---------------------- |
| `/search`   | 7 $ / 1 k requests                           | 1 $ / 1 k résultats           | 1 $ / 1 k pages        |
| `/answer`   | 5 $ / 1 k requests                           | —                             | —                      |
| `/monitors` | 15 $ / 1 k requests                          | 1 $ / 1 k résultats           | 1 $ / 1 k pages        |
| `/contents` | 1 $ / 1 k pages, par type de contenu         | —                             | 1 $ / 1 k pages        |

## Agent {#agent}

Définissez un `effort` fixe sur [Agent](/fr/docs/agent/quickstart) pour obtenir un prix prévisible par requête. `auto` est le mode mesuré par défaut ; le mode bêta `max` est également mesuré et applique les mêmes tarifs d&#39;utilisation :

| Effort    | Prix             |
| --------- | ---------------- |
| `minimal` | $0,012 / requête |
| `low`     | $0,025 / requête |
| `medium`  | $0,10 / requête  |
| `high`    | $0,50 / requête  |
| `xhigh`   | $1,00 / requête  |

Les runs mesurés facturent l&#39;utilisation réelle, dans la limite de leur plafond par run. `auto` applique par défaut un plafond de $5 ; le mode bêta `max` applique par défaut un plafond de $20 :

| Composant d&#39;utilisation         | Prix                        |
| ----------------------------------- | --------------------------- |
| Agent Compute Units                 | $0,10 / ACU                 |
| Appels d&#39;outil de search        | $0,005 / search             |
| Enrichissement de contact e-mail    | $0,02 / e-mail              |
| Enrichissement de contact téléphone | $0,07 / numéro de téléphone |

### Fournisseurs Connect {#connect-providers}

Les runs qui utilisent des sources de données [Exa Connect](/fr/docs/agent/connect/overview)
facturent en plus chaque appel de fournisseur — par exemple
[Fiber.ai](/fr/docs/agent/connect/fiber#pricing) à $0.02 par crédit et
[Baselayer](/fr/docs/agent/connect/baselayer#pricing) entre $0.15 et $4.00 par
commande selon l&#39;opération. Consultez la
[tarification Connect](/fr/docs/agent/connect/overview#pricing) pour connaître tous
les tarifs des fournisseurs.

## Deep Search {#deep-search}

Se définit avec `type` sur [`/search`](/fr/docs/search/deep-search). Les résultats supplémentaires et les résumés de page par IA sont facturés au même tarif qu&#39;un Search standard.

| Type             | Prix de base<br />(jusqu&#39;à 10 résultats) | Latence          | Idéal pour                                         |
| ---------------- | -------------------------------------------- | ---------------- | -------------------------------------------------- |
| `deep-lite`      | 12 $ / 1k requests                           | ~4 secondes      | Synthèse légère                                    |
| `deep`           | 12 $ / 1k requests                           | 4 à 15 secondes  | Raisonnement multi-étapes avec sorties structurées |
| `deep-reasoning` | 15 $ / 1k requests                           | 12 à 40 secondes | Tâches de recherche plus complexes                 |

## Enterprise {#enterprise}

Pour les volumes élevés, les jeux de données personnalisés et les exigences de sécurité renforcées.

<Columns cols={3}>
  <Card title="Recherche puissante" icon="gauge">
    Jusqu&#39;à 1 000 résultats par recherche, requests au-delà de 25 résultats, limites de débit personnalisées (QPS), modération sur mesure et index personnalisés.
  </Card>

  <Card title="Support Enterprise" icon="headphones">
    SLA et MSA, accompagnement et support individuels, et [Zero Data Retention](/fr/docs/admin/security/zero-data-retention).
  </Card>

  <Card title="Tarification personnalisée" icon="tag">
    Remises sur volume et facturation à terme sur facture.
  </Card>
</Columns>

<Card title="Contactez-nous" icon="mail" horizontal href="https://exa.ai/contact/sales">
  Obtenez un devis adapté aux volumes et conditions Enterprise
</Card>

## Glossaire des coûts {#cost-glossary}

<AccordionGroup>
  <Accordion title="Requête">
    Un appel d&#39;API vers un endpoint. Les prix sont indiqués pour 1 000 requests : un tarif de $7 / 1k revient donc à $0,007 par appel.
  </Accordion>

  <Accordion title="Résultat">
    Un résultat de recherche renvoyé dans une réponse. Le prix de base couvre les 10 premiers résultats d&#39;une request ; chaque résultat au-delà de 10 ajoute $1 / 1k résultats. Demander `numResults: 20` coûte donc le prix de base plus 10 résultats supplémentaires.
  </Accordion>

  <Accordion title="Page et type de contenu">
    Une page correspond à une URL pour laquelle Exa renvoie du contenu. Un type de contenu est une vue de cette page : `text`, `highlights` ou `summary`. `/contents` facture chaque type de contenu séparément : une page avec `text` et `highlights` compte donc pour deux.
  </Accordion>

  <Accordion title="Résumé de page par IA">
    Un résumé de page généré par Exa, produit par un appel LLM supplémentaire de notre côté. Facturé $1 / 1k pages sur tout endpoint qui en renvoie un.
  </Accordion>

  <Accordion title="Agent Compute Unit (ACU)">
    L&#39;unité de calcul de modèle consommée par un run Agent, indiquée dans `usage.agentComputeUnits`. Les runs plus longs, les `input.data` plus volumineux et un plus grand nombre d&#39;étapes de raisonnement consomment davantage d&#39;ACU.
  </Accordion>

  <Accordion title="Effort">
    Le paramètre Agent qui arbitre entre coût et latence d&#39;un côté, et exhaustivité de l&#39;autre. `auto` facture à la consommation (ACU plus appels d&#39;outils) jusqu&#39;à un plafond par défaut de $5 ; `max` (bêta) applique les mêmes tarifs d&#39;utilisation jusqu&#39;à un plafond par défaut de $20. Les efforts fixes sont facturés à un prix forfaitaire par request. Voir [Modes d&#39;effort Agent](/fr/docs/agent/quickstart#effort).
  </Accordion>

  <Accordion title="Enrichissement de contact">
    Une recherche Agent qui renvoie une adresse e-mail ou un numéro de téléphone pour une personne ou une entreprise. Facturé par contact trouvé, en plus des autres coûts du run.
  </Accordion>

  <Accordion title="Crédits">
    Solde prépayé en dollars sur votre compte. L&#39;utilisation décompte les crédits selon les tarifs ci-dessus.
  </Accordion>
</AccordionGroup>

<Card title="Facturation" icon="credit-card" horizontal href="/fr/docs/admin/billing">
  Ajoutez des crédits, configurez l&#39;auto recharge et retrouvez vos factures
</Card>