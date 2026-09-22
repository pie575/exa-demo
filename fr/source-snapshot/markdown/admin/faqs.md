> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="faqs">
  # FAQ
</div>

> Réponses aux questions fréquentes sur les produits Exa, l&#39;index de recherche, la fraîcheur, le grounding, la sécurité et la tarification.

<AccordionGroup>
  <Accordion title="Qu'est-ce qu'Exa ?">
    Exa fournit une infrastructure de recherche web et de recherche documentaire pour les applications d&#39;IA. Elle combine un index de recherche indépendant avec des API d&#39;extraction de contenu et de recherche agentique, afin que les applications puissent trouver des sources, récupérer leur contenu et produire des sorties fondées sur des preuves.
  </Accordion>

  <Accordion title="Quel produit Exa dois-je utiliser ?">
    * Utilisez la [Search API](/fr/docs/search/quickstart) pour obtenir des résultats web classés et, si besoin, renvoyer des highlights, le texte intégral ou des résumés.
    * Utilisez la [Contents API](/fr/docs/contents/quickstart) lorsque vous disposez déjà des URL et avez besoin de leur contenu extrait.
    * Utilisez l&#39;[API Agent](/fr/docs/agent/quickstart) pour la recherche asynchrone en plusieurs étapes, la constitution de listes et l&#39;enrichment structuré.
    * Utilisez les [Monitors](/fr/docs/monitors/quickstart) pour exécuter des recherches récurrentes et recevoir les nouveaux résultats découverts.
  </Accordion>

  <Accordion title="Qu'est-ce qu'Exa Connect ?">
    [Exa Connect](/fr/docs/agent/connect/overview) donne à Exa Agent accès à des provider de données premium en parallèle de la recherche web, au sein d&#39;un même run. Ajoutez des provider via `dataSources` : Exa Agent détermine alors quand interroger chaque source, avant de combiner les données partner et la recherche web en une seule sortie structurée et fondée sur des preuves.

    Pour les provider en libre-service, Exa gère l&#39;authentification du provider et la facturation de l&#39;utilisation : vous n&#39;avez donc pas à développer une integration distincte ni à ouvrir un compte séparé auprès du provider.
  </Accordion>

  <Accordion title="Qu'est-ce qui distingue Exa Search ?">
    Exa Search est conçu pour le retrieval programmatique plutôt que pour la navigation financée par la publicité. Il peut effectuer une recherche par sens, accepter des requêtes en langage naturel et renvoyer les page contents dans la même requête. Les modes de recherche vont du retrieval à faible latence à la recherche en plusieurs étapes avec sortie structurée.

    Consultez le [Quickstart Search](/fr/docs/search/quickstart) pour connaître les search type disponibles et les formats de réponse.
  </Accordion>

  <Accordion title="Quelle est la taille de l'index d'Exa ?">
    En août 2026, l&#39;index d&#39;Exa suivait 1 400 milliards d&#39;URL et desservait 100 milliards de pages issues du web public. L&#39;index évolue en continu à mesure que des pages sont découvertes, actualisées ou supprimées.
  </Accordion>

  <Accordion title="Quelle est la fraîcheur des résultats d'Exa ?">
    Exa découvre et actualise les pages en continu, selon un rythme qui varie en fonction de la source et de la fréquence de modification de la page. Lorsque vous avez besoin d&#39;un contenu plus récent que la copie indexée, utilisez l&#39;option [`maxAgeHours`](/fr/docs/contents/quickstart#content-freshness) de la Contents API pour contrôler l&#39;âge du cache et le retrieval en direct.
  </Accordion>

  <Accordion title="Exa exploite-t-il un crawler ?">
    Oui. Exa exploite `ExaSearchBot` pour découvrir et actualiser les pages du web public à des fins de recherche et de retrieval. Il respecte le protocole d&#39;exclusion des robots, limite la cadence de requêtes par site et ne cherche pas à contourner les identifiants de connexion, les paywalls ou les CAPTCHA.

    Le fichier `robots.txt` contrôle le crawl. Pour retirer une page déjà indexée, utilisez une balise meta robots `noindex` ou un header de réponse `X-Robots-Tag: noindex` ; Exa supprime la page lors de sa prochaine récupération. Consultez [Exa Search Crawler](https://crawler.exa.ai/) pour l&#39;user agent, les instructions de vérification cryptographique et les contrôles du crawler.
  </Accordion>

  <Accordion title="Comment Exa aide-t-il à fonder les réponses des LLM sur des preuves ?">
    Exa renvoie les source URL et le contenu web utilisé pour le retrieval, ce qui permet à une application de générer des réponses avec citations et d&#39;examiner les preuves qui les étayent. La qualité de la recherche et le grounding sur les sources peuvent réduire les affirmations non étayées, mais l&#39;application et son modèle de langage restent responsables de la manière dont les informations récupérées sont interprétées et présentées.
  </Accordion>

  <Accordion title="Puis-je restreindre les sources qu'Exa interroge ?">
    Oui. Utilisez `includeDomains` pour limiter Search à certains domaines, ou `excludeDomains` pour écarter les sources indésirables. Exa propose également des catégories de données pour un retrieval ciblé par source, comme les entreprises, les personnes, l&#39;actualité et le code. Consultez les [bonnes pratiques de recherche](/fr/docs/search/best-practices) et [Data](/fr/docs/search/data/overview).
  </Accordion>

  <Accordion title="Quelles options de sécurité et de conservation des données sont disponibles ?">
    Exa propose des contrôles de sécurité et de conformité pour les cas d&#39;usage en production et en entreprise, notamment le [Zero Data Retention](/fr/docs/admin/security/zero-data-retention) et la [conformité HIPAA](/fr/docs/admin/security/hipaa) pour les clients Enterprise éligibles. Consultez [Sécurité et conformité](/fr/docs/admin/security/overview) pour en savoir plus.
  </Accordion>

  <Accordion title="Comment fonctionne la tarification d'Exa ?">
    L&#39;utilisation de l&#39;API est facturée sur les crédits du compte, selon l&#39;endpoint et les options utilisés. Les nouveaux comptes reçoivent des crédits gratuits, et l&#39;utilisation payante se fait à l&#39;usage, sauf si votre organization dispose d&#39;un contrat entreprise. Consultez [Tarifs](/fr/docs/admin/pricing) et [Facturation](/fr/docs/admin/billing).
  </Accordion>
</AccordionGroup>