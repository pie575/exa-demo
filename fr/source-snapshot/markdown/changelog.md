> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="changelog">
  # Changelog
</div>

> Mises à jour produit et annonces d&#39;Exa.

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  <div id="dynamic-highlights-research-preview">
    ## Dynamic Highlights (aperçu de recherche)
  </div>

  Dynamic Highlights sélectionne les extraits sur l&#39;ensemble des résultats au lieu de traiter chaque page isolément. La fonctionnalité alloue une plus grande part du budget de context partagé aux sources utiles, et une part moindre à celles qui ne font que répéter des informations déjà retournées.

  * **RAG en un seul tour** : environ 49 % d&#39;efficacité en jetons en plus et 2,4 % de qualité en aval en plus avec Exa Auto, sur les évaluations de code et de questions-réponses générales.
  * **Agents** : environ 30 % de jetons en moins sur l&#39;ensemble des trajectoires d&#39;agent et 1 % de qualité en plus sur BrowseComp, WideSearch ainsi que sur les évaluations internes d&#39;entreprises et de personnes.

  Les requests qui définissent `dynamic: true` nécessitent le header `Exa-Beta: dynamic-highlights-2026-08-28`.

  [Consulter le guide Dynamic Highlights →](/fr/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  <div id="publication-research">
    ## Recherche sur les publications
  </div>

  Nous avons considérablement élargi et amélioré la recherche sur les publications académiques.

  * **350 M de publications** : recherche sur un index de 350 millions de publications.
  * **Résultats plus riches sur les organisations et les personnes** : les recherches retournent désormais à la fois les organisations et les personnes qui y sont affiliées, chacune sous forme de profil détaillé et enrichi couvrant publications, principaux collaborateurs, domaines de recherche et financements.
  * **Recherche agentique de personnes et d&#39;organisations** : les agents peuvent désormais effectuer des recherches sur les personnes et les organisations.
  * **Benchmark public de retrieval** : nous avons publié un benchmark public pour le retrieval de publications.
  * **Nouvelle catégorie de search `publication`** : interrogez les résultats scientifiques avec `category: "publication"`, qui remplace la catégorie `research paper`.
  * **Catégories dépréciées** : les catégories de search `pdf`, `github` et `tweet` sont en cours de dépréciation.
  * **`startCrawlDate` / `endCrawlDate`** : ces paramètres dépréciés sont désormais ignorés pour toutes les équipes, tout en restant acceptés par compatibilité.

  Interrogez-la via l&#39;API avec la [catégorie de search](/fr/docs/search/quickstart) `publication`, ou [essayez-la dans le tableau de bord →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  <div id="exa-agent-and-exa-connect-in-mcp">
    ## Exa Agent et Exa Connect dans MCP
  </div>

  Exa Agent est désormais disponible dans Exa MCP. Utilisez-le depuis Claude, Cursor ou tout autre MCP client lorsque la tâche nécessite plus qu&#39;un simple appel de search.

  Activez l&#39;outil Agent avec `https://mcp.exa.ai/mcp?tools=agent_run`, puis appelez `agent_run` pour exécuter l&#39;agent jusqu&#39;à son terme et récupérer son output.

  Les sources de données Exa Connect sont accessibles via le flux Agent : vous pouvez donc attacher des data partners premium lorsqu&#39;un run nécessite plus que la seule recherche web.

  [Consulter le guide Exa MCP →](/fr/docs/get-started/exa-mcp) · [Consulter le guide Exa Agent →](/fr/docs/agent/quickstart) · [Tweet d&#39;annonce →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  <div id="introducing-exa-connect">
    ## Présentation d&#39;Exa Connect
  </div>

  Exa Connect donne à Exa Agent un accès en direct aux données publiques et privées du monde entier. Le lancement s&#39;est fait avec Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko et d&#39;autres partners. Vous les attachez via `dataSources` sur `POST /agent/runs`.

  [Consulter le guide Exa Connect →](/fr/docs/agent/connect/overview) · [Tweet d&#39;annonce →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  <div id="introducing-exa-agent">
    ## Présentation d&#39;Exa Agent
  </div>

  Nous avons lancé une nouvelle génération d&#39;agents de recherche web de pointe, accessibles via API.

  L&#39;API Exa Agent prend en charge des paramètres tels qu&#39;une requête en langage naturel, le mode `effort`, `outputSchema` pour les sorties structurées et `input.data` pour s&#39;appuyer sur un jeu de données existant.

  [Consulter le guide de l&#39;API Exa Agent →](/fr/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "Avis de dépréciation de l'API" }}>
  <div id="api-deprecation-notice">
    ## Avis de dépréciation de l&#39;API
  </div>

  Nous avons retiré quelques éléments hérités de l&#39;API Exa :

  * **endpoint `/research`** : remplacé par `/search` avec `type: "deep-reasoning"`.
  * **`resolvedSearchType` et `highlightScores` (fields de réponse)** : renvoient `null` à partir du 15 avril, supprimés le 1er mai.
  * **`startCrawlDate` / `endCrawlDate` (paramètres de requête dépréciés)** : ignorés silencieusement à partir du 15 avril.

  [Migrer vers Deep search →](/fr/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Présentation d'Exa Monitors" }}>
  <div id="introducing-exa-monitors">
    ## Présentation d&#39;Exa Monitors
  </div>

  Les monitors exécutent des Exa searches selon un schedule et livrent les résultats à votre webhook, dédupliqués par rapport aux runs précédents pour que vous ne receviez que du nouveau contenu.

  * **Suivre des sujets dans la durée** : actualités des concurrents, levées de fonds, évolutions réglementaires, papers de recherche.
  * **Résultats structurés** : renvoyez du texte brut ou du JSON typé via `outputSchema`.
  * **Planification flexible** : exécution à intervalle régulier (minimum 1 heure) ou déclenchement manuel.

  [Lire le guide de l&#39;API Monitors →](/fr/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Refonte d'Exa Deep" }}>
  <div id="exa-deep-revamp">
    ## Refonte d&#39;Exa Deep
  </div>

  Exa Deep est plus rapide, moins cher et prend désormais en charge les sorties structurées avec grounding au niveau des fields.

  * **Nouveau type `deep-reasoning`** pour les tâches exigeant plus d&#39;effort (12-50 s) ; `deep` s&#39;exécute en 4-12 s.
  * **Prix réduit de 20 %** pour la recherche `deep` classique.
  * **Sorties structurées** via `outputSchema`, avec `output.content` et `output.grounding` (citations et confiance au niveau des fields) dans la réponse.

  Consultez la [mise à jour de la tarification Exa](#exa-pricing-update) ci-dessous pour la tarification complète.

  [Lire la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Mise à jour de la tarification Exa" }}>
  <div id="exa-pricing-update">
    ## Mise à jour de la tarification Exa
  </div>

  Nous avons simplifié et réduit nos tarifs. Le contenu des 10 premiers résultats de recherche est désormais inclus gratuitement, et la nouvelle tarification s&#39;applique automatiquement, sans aucune action de votre part.

  * **Search avec contenu** : 7 $ pour 1 k requests (10 résultats, texte + highlights inclus) ; 1 $ pour 1 k résultats supplémentaires.
  * **Résumés** : 1 $ pour 1 k, sur search comme sur contenu.
  * **Exa Deep** : 12 $ pour 1 k requests ; **Deep (Reasoning)** 15 $ pour 1 k.
  * **Endpoint Contenu** : 1 $ pour 1 k pages par type de contenu.

  [Voir la tarification actuelle →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Présentation d'Exa Instant Search" }}>
  <div id="introducing-exa-instant-search">
    ## Présentation d&#39;Exa Instant Search
  </div>

  Exa Instant est notre type de recherche le plus rapide : il allie une qualité de neural search améliorée à une latence inférieure à 150 ms. Activez-le avec `type="instant"`.

  * **Conçu pour le temps réel** : applications de chat, IA vocale, agents de code, autocomplétion et suggestions en direct.
  * **Qualité à l&#39;état de l&#39;art** avec la latence la plus faible que nous proposons.

  [Lire le guide de la Search API →](/fr/docs/search/quickstart) · [L&#39;essayer dans le tableau de bord →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights, fraîcheur du contenu et mises à jour MCP" }}>
  <div id="highlights-content-freshness-and-mcp-updates">
    ## Highlights, fraîcheur du contenu et mises à jour MCP
  </div>

  Trois améliorations pour l&#39;extraction et l&#39;accès au contenu :

  * **`maxCharacters` pour les highlights** : c&#39;est désormais la méthode recommandée pour contrôler la longueur des highlights. `numSentences` et `highlightsPerUrl` sont dépréciés.
  * **`maxAgeHours` pour la fraîcheur du contenu** : un contrôle basé sur l&#39;ancienneté qui remplace le booléen `livecrawl` (`0` crawle toujours, `-1` cache uniquement, `24` crawle si le contenu a plus de 24 h).
  * **Offre gratuite d&#39;Exa MCP** : essayez-la sans authentification à 3 QPS et 150 appels/jour ; ajoutez une API key pour un accès complet.

  [Documentation sur la fraîcheur du contenu →](/fr/docs/contents/quickstart#content-freshness) · [Exa MCP →](/fr/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Présentation d'Exa Company Search" }}>
  <div id="introducing-exa-company-search">
    ## Présentation d&#39;Exa Company Search
  </div>

  La recherche d&#39;entreprises s&#39;appuie désormais sur un modèle de retrieval affiné et un pipeline de correspondance d&#39;entités. Utilisez `type="auto"`, `category="company"`.

  * **Précis sur tous les attributs** : secteur, zone géographique, stade de financement et effectifs.
  * **Données d&#39;entités structurées** : les résultats renvoient des informations typées sur l&#39;entreprise (effectifs, siège, données financières, traffic web).
  * **Cas d&#39;usage** : prospection commerciale, études de marché et workflows de chaîne d&#39;approvisionnement.

  [Consulter la documentation Companies &amp; People Search →](/fr/docs/search/data/companies-people) · [Lire l&#39;article de benchmark →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Présentation d'Exa People Search" }}>
  <div id="introducing-exa-people-search">
    ## Présentation d&#39;Exa People Search
  </div>

  La recherche de personnes couvre désormais plus d&#39;un milliard de profils publics grâce à un système de retrieval hybride. La catégorie `linkedin` est remplacée par la nouvelle catégorie `people`.

  * **Couverture plus large** : des profils issus de tout le web, pas seulement de LinkedIn.
  * **Meilleure précision** : embeddings affinés pour les requêtes portant sur un poste, une compétence ou une entreprise.
  * **Cas d&#39;usage** : vente, recrutement et études de marché.

  [Consulter la documentation Companies &amp; People Search →](/fr/docs/search/data/companies-people) · [Lire l&#39;article de benchmark →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "SDK JS : les highlights sont de retour" }}>
  <div id="js-sdk-highlights-restored">
    ## SDK JS : les highlights sont de retour
  </div>

  Les highlights sont de retour dans le SDK JavaScript depuis `exa-js` v2.0.11 : ils renvoient les phrases clés accompagnées de leurs relevance scores. Passez `highlights: true` ou `highlights: { maxCharacters, query }` dans les appels search et contenu.

  [Consulter la documentation du SDK JavaScript →](/fr/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "Nouveau type de recherche Deep" }}>
  <div id="new-deep-search-type">
    ## Nouveau type de recherche Deep
  </div>

  Exa Deep trouve de meilleurs résultats en lançant plusieurs recherches simultanément et en renvoyant un context de grande qualité pour chaque résultat. Activez-le avec `type="deep"`.

  * **Expansion de requête** : envoyez une seule requête et nous générons des variantes, ou fournissez les vôtres avec `additionalQueries`.
  * **Recherche parallèle et classement intelligent** sur votre requête et toutes ses variantes.
  * **Résumés détaillés** pour chaque résultat.

  [Consulter la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "Ajout du filtrage par langue" }}>
  <div id="added-language-filtering">
    ## Ajout du filtrage par langue
  </div>

  Exa détecte désormais la langue de votre requête et ne renvoie que des résultats dans cette langue. Activé par défaut pour tous les utilisateurs, sans configuration nécessaire.

  [Consulter le guide de la Search API →](/fr/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "Changements dans les SDK : suppression des highlights et contenu renvoyé par défaut" }}>
  <div id="sdk-changes-highlights-removed-and-contents-returned-by-default">
    ## Changements dans les SDK : suppression des highlights et contenu renvoyé par défaut
  </div>

  Une version majeure des SDK, avec des changements incompatibles :

  * **Contenu par défaut** : la recherche inclut désormais le contenu de page ; désactivez cette option pour des recherches plus rapides.
  * **Highlights supprimés des SDK** : rétablis par la suite dans le SDK JS ; voir [SDK JS : les highlights sont de retour](#js-sdk-highlights-restored).
  * **`use_autoprompt` déprécié** : supprimé de toutes les réponses de l&#39;API.

  [Consulter la documentation du SDK Python →](/fr/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "Prise en charge du filtre par chemin de domaine" }}>
  <div id="domain-path-filter-support">
    ## Prise en charge du filtre par chemin de domaine
  </div>

  `includeDomains` et `excludeDomains` permettent désormais un ciblage plus fin :

  * **Filtrage par chemin spécifique** : par exemple `exa.ai/blog` ou `linkedin.com/company`.
  * **Jokers de sous-domaines** : par exemple `*.substack.com`.

  Pratique pour restreindre les recherches à des blogs, des catalogues de produits ou des annuaires.

  [Consulter la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "Prise en charge du filtre de géolocalisation" }}>
  <div id="geolocation-filter-support">
    ## Prise en charge du filtre de géolocalisation
  </div>

  Le nouveau paramètre `userLocation` oriente les résultats vers la région d&#39;un utilisateur ; il se transmet sous la forme d&#39;un code pays [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (par exemple `"us"`, `"fr"`). Pratique pour les applications multirégionales, les contenus en langue régionale et la découverte locale.

  [Consulter la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "Nouveau type de recherche Fast" }}>
  <div id="new-fast-search-type">
    ## Nouveau type de recherche Fast
  </div>

  Exa Fast s&#39;appuie sur des modèles de recherche allégés avec une latence p50 inférieure à 425 ms. Activez-le avec `type="fast"`.

  * **Le même index Exa** de contenu de haute qualité que la neural search.
  * **Compatibilité complète des paramètres** avec les autres types de recherche.
  * **Conçu pour** le grounding web rapide, les workflows agentiques et les produits à faible latence.

  [Consulter le guide de la Search API →](/fr/docs/search/quickstart) · [Essayer dans le tableau de bord →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Dépréciation du score dans Auto search" }}>
  <div id="score-deprecation-in-auto-search">
    ## Dépréciation du score dans Auto search
  </div>

  La nouvelle architecture d&#39;Auto search ne permet plus de produire des relevance scores pertinents : le field `score` est donc retiré des résultats d&#39;Auto search.

  * **Auto search** : ne renvoie plus `score` ; les résultats sont déjà classés par relevance.
  * **Neural search** : les scores restent inchangés. Définissez `type="neural"` si vous en avez besoin.

  [Consulter la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Contenu en markdown par défaut" }}>
  <div id="markdown-contents-as-default">
    ## Contenu en markdown par défaut
  </div>

  Tous les endpoints renvoient désormais du markdown propre par défaut, mieux adapté aux LLM, au RAG et au traitement de texte en général. Aucune action requise.

  * **`includeHtmlTags=false` (par défaut)** : contenu transformé en markdown propre.
  * **`includeHtmlTags=true`** : HTML brut, sans traitement markdown.

  Dans les deux cas, les éléments superflus comme les publicités et la navigation sont supprimés.

  [Consulter la documentation Contenu →](/fr/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "Nouvelle option livecrawl : preferred" }}>
  <div id="new-livecrawl-option-preferred">
    ## Nouvelle option livecrawl : preferred
  </div>

  <Warning>
    Entrée historique : le paramètre `livecrawl` de type chaîne est désormais déprécié. Pour les nouvelles integrations, utilisez `maxAgeHours` avec `livecrawlTimeout`. Voir [fraîcheur du contenu](/fr/docs/contents/quickstart#content-freshness).
  </Warning>

  L&#39;option dépréciée `livecrawl: "preferred"` tente un nouveau crawl, mais se rabat sur le contenu en cache lorsque le crawl échoue (contrairement à `"always"`, qui renvoie une erreur). Idéale pour les applications en production qui veulent du contenu frais sans échouer sur des sites temporairement indisponibles.

  [Consulter la documentation fraîcheur du contenu →](/fr/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Changements de statut de l'endpoint Contenu" }}>
  <div id="contents-endpoint-status-changes">
    ## Changements de statut de l&#39;endpoint Contenu
  </div>

  `/contents` renvoie désormais un field `statuses` par URL au lieu d&#39;une seule erreur HTTP, ce qui vous permet de traiter individuellement le résultat de chaque URL. L&#39;endpoint ne renvoie une erreur qu&#39;en cas de problème interne.

  * **`status`** : `"success"` ou `"error"` pour chaque URL.
  * **`error.tag`** : par exemple `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE`, avec un `httpStatusCode`.

  [Consulter la référence des codes d&#39;erreur →](/fr/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto search par défaut" }}>
  <div id="auto-search-as-default">
    ## Auto search par défaut
  </div>

  Auto search est désormais le mode par défaut : chaque requête est automatiquement dirigée vers la meilleure méthode de recherche. Aucune action requise ; définissez `type="neural"` pour conserver le comportement précédent.

  [En savoir plus sur les types de recherche d&#39;Exa →](/fr/docs/search/quickstart)
</Update>