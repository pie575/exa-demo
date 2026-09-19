> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="changelog">
  # Changelog
</div>

> Mises à jour produit et annonces d&#39;Exa.

<Update label="28 août 2026" rss={{ title: "Dynamic Highlights (aperçu de recherche)" }}>
  <div id="dynamic-highlights-research-preview">
    ## Dynamic Highlights (aperçu de recherche)
  </div>

  Dynamic Highlights sélectionne des extraits sur l&#39;ensemble des résultats au lieu de traiter chaque page isolément. La fonctionnalité alloue une part plus importante du budget de contexte partagé aux sources utiles, et une part moindre à celles qui ne font que répéter des informations déjà renvoyées.

  * **RAG en un tour** : environ 49 % d&#39;efficacité de tokens en plus et 2,4 % de qualité en aval supplémentaire avec Exa Auto, sur des évaluations de code et de questions-réponses générales.
  * **Agents** : environ 30 % de tokens en moins sur l&#39;ensemble des trajectoires d&#39;agent et 1 % de qualité en plus sur BrowseComp, WideSearch ainsi que sur les évaluations internes portant sur les entreprises et les personnes.

  Les requêtes qui définissent `dynamic: true` nécessitent le header `Exa-Beta: dynamic-highlights-2026-08-28`.

  [Lire le guide Dynamic Highlights →](/fr/docs/contents/quickstart)
</Update>

<Update label="23 juillet 2026" rss={{ title: "Recherche sur les publications" }}>
  <div id="publication-research">
    ## Recherche sur les publications
  </div>

  Nous avons considérablement étendu et amélioré la recherche portant sur les publications académiques.

  * **350 M de publications** : recherchez dans un index de 350 millions de publications.
  * **Résultats plus riches sur les organisations et les personnes** : les recherches renvoient désormais à la fois les organisations et les personnes qui y sont affiliées, chacune sous forme de profil détaillé et enrichi couvrant publications, principaux collaborateurs, domaines de recherche et financements.
  * **Recherche agentique de personnes et d&#39;organisations** : les agents peuvent désormais effectuer des recherches sur les personnes et les organisations.
  * **Benchmark public de retrieval** : nous avons publié un benchmark public pour le retrieval de publications.
  * **Nouvelle catégorie de search `publication`** : interrogez les résultats scientifiques avec `category: "publication"`, qui remplace la catégorie `research paper`.
  * **Catégories deprecated** : les catégories de search `pdf`, `github` et `tweet` sont en cours de dépréciation.
  * **`startCrawlDate` / `endCrawlDate`** : ces paramètres deprecated sont désormais ignorés pour toutes les teams, tout en restant acceptés pour des raisons de compatibilité.

  Interrogez-les via l&#39;API avec la [catégorie de search](/fr/docs/search/quickstart) `publication`, ou [essayez dans le dashboard →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="1er juillet 2026" rss={{ title: "Exa Agent et Exa Connect dans MCP" }}>
  <div id="exa-agent-and-exa-connect-in-mcp">
    ## Exa Agent et Exa Connect dans MCP
  </div>

  Exa Agent est désormais disponible dans Exa MCP. Utilisez-le depuis Claude, Cursor ou tout autre client MCP lorsque la tâche nécessite plus qu&#39;un simple appel de search.

  Activez le tool Agent avec `https://mcp.exa.ai/mcp?tools=agent_run`, puis appelez `agent_run` pour exécuter l&#39;agent jusqu&#39;à son terme et récupérer son output.

  Les sources de données Exa Connect sont accessibles via le flux Agent : vous pouvez ainsi attacher des data partners premium lorsqu&#39;un run nécessite plus que la seule web search.

  [Lire le guide Exa MCP →](/fr/docs/get-started/exa-mcp) · [Lire le guide Exa Agent →](/fr/docs/agent/quickstart) · [Tweet d&#39;annonce →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="24 juin 2026" rss={{ title: "Présentation d'Exa Connect" }}>
  <div id="introducing-exa-connect">
    ## Présentation d&#39;Exa Connect
  </div>

  Exa Connect donne à Exa Agent un accès en direct aux données publiques et privées du monde entier. Le lancement s&#39;est fait avec Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko et Additional Partners. Vous les attachez via `dataSources` sur `POST /agent/runs`.

  [Lire le guide Exa Connect →](/fr/docs/agent/connect/overview) · [Tweet d&#39;annonce →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="16 juin 2026" rss={{ title: "Présentation d'Exa Agent" }}>
  <div id="introducing-exa-agent">
    ## Présentation d&#39;Exa Agent
  </div>

  Nous avons lancé une nouvelle génération d&#39;agents de recherche web de pointe, accessibles via API.

  L&#39;API Exa Agent prend en charge des paramètres tels qu&#39;une requête en langage naturel, le mode `effort`, `outputSchema` pour les structured outputs et `input.data` pour s&#39;appuyer sur un jeu de données existant.

  [Lire le guide de l&#39;API Exa Agent →](/fr/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "Avis de dépréciation de l'API" }}>
  <div id="api-deprecation-notice">
    ## Avis de dépréciation de l&#39;API
  </div>

  Nous avons retiré quelques éléments hérités de l&#39;API Exa :

  * **endpoint `/research`** : remplacé par `/search` avec `type: "deep-reasoning"`.
  * **`resolvedSearchType` et `highlightScores` (champs de réponse)** : renvoient `null` à partir du 15 avril, supprimés le 1er mai.
  * **`startCrawlDate` / `endCrawlDate` (paramètres de requête deprecated)** : ignorés silencieusement à partir du 15 avril.

  [Migrer vers Deep search →](/fr/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Présentation d'Exa Monitors" }}>
  <div id="introducing-exa-monitors">
    ## Présentation d&#39;Exa Monitors
  </div>

  Les monitors exécutent des recherches Exa selon un schedule et transmettent les résultats à votre webhook, dédupliqués par rapport aux runs précédents pour que vous ne receviez que du contenu inédit.

  * **Suivre des sujets dans la durée** : actualités des concurrents, levées de fonds, évolutions réglementaires, papers de recherche.
  * **Résultats structurés** : renvoyer du texte brut ou du JSON typé via `outputSchema`.
  * **Planification flexible** : exécution à intervalle régulier (1 heure minimum) ou déclenchement manuel.

  [Lire le guide de l&#39;API Monitors →](/fr/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Refonte d'Exa Deep" }}>
  <div id="exa-deep-revamp">
    ## Refonte d&#39;Exa Deep
  </div>

  Exa Deep est plus rapide, moins cher, et prend désormais en charge les structured outputs avec grounding au niveau des champs.

  * **Nouveau type `deep-reasoning`** pour les tâches exigeant plus d&#39;effort (12-50 s) ; `deep` s&#39;exécute en 4-12 s.
  * **Prix réduit de 20 %** pour la recherche `deep` classique.
  * **Structured outputs** via `outputSchema`, avec `output.content` et `output.grounding` (citations et niveau de confiance au niveau des champs) dans la réponse.

  Consultez la [mise à jour tarifaire d&#39;Exa](#exa-pricing-update) ci-dessous pour la tarification complète.

  [Lire la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Mise à jour tarifaire d'Exa" }}>
  <div id="exa-pricing-update">
    ## Mise à jour tarifaire d&#39;Exa
  </div>

  Nous avons simplifié et baissé nos tarifs. Les contents des 10 premiers résultats de search sont désormais inclus gratuitement, et la nouvelle tarification s&#39;applique automatiquement, sans aucune action de votre part.

  * **Search avec contents** : 7 $ pour 1 k requêtes (10 résultats, texte + highlights inclus) ; 1 $ pour 1 k résultats supplémentaires.
  * **Summaries** : 1 $ pour 1 k, aussi bien sur search que sur contents.
  * **Exa Deep** : 12 $ pour 1 k requêtes ; **Deep (Reasoning)** 15 $ pour 1 k.
  * **Endpoint Contents** : 1 $ pour 1 k pages par content type.

  [Voir la tarification actuelle →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Présentation d'Exa Instant Search" }}>
  <div id="introducing-exa-instant-search">
    ## Présentation d&#39;Exa Instant Search
  </div>

  Exa Instant est notre search type le plus rapide : il associe une qualité de neural search améliorée à une latence inférieure à 150 ms. Activez-le avec `type="instant"`.

  * **Conçu pour le temps réel** : applications de chat, IA vocale, agents de code, autocomplétion et suggestions en direct.
  * **Qualité à l&#39;état de l&#39;art** avec la plus faible latence que nous proposons.

  [Lire le guide de la Search API →](/fr/docs/search/quickstart) · [L&#39;essayer dans le dashboard →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights, content freshness et mises à jour MCP" }}>
  <div id="highlights-content-freshness-and-mcp-updates">
    ## Highlights, content freshness et mises à jour MCP
  </div>

  Trois améliorations de l&#39;extraction de contenu et de son accès :

  * **`maxCharacters` pour les highlights** : désormais la méthode recommandée pour contrôler la longueur des highlights. `numSentences` et `highlightsPerUrl` sont deprecated.
  * **`maxAgeHours` pour la content freshness** : contrôle basé sur l&#39;ancienneté, qui remplace le booléen `livecrawl` (`0` explore systématiquement, `-1` cache uniquement, `24` explore si le contenu date de plus de 24 h).
  * **Offre gratuite d&#39;Exa MCP** : essayez-la sans authentification, à 3 QPS et 150 appels par jour ; ajoutez une API key pour un accès complet.

  [Documentation sur la content freshness →](/fr/docs/contents/quickstart#content-freshness) · [Exa MCP →](/fr/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Introducing Exa Company Search" }}>
  <div id="introducing-exa-company-search">
    ## Présentation d&#39;Exa Company Search
  </div>

  La recherche d&#39;entreprises s&#39;appuie désormais sur un modèle de retrieval affiné et sur un pipeline de correspondance d&#39;entités. Utilisez `type="auto"`, `category="company"`.

  * **Précise sur tous les attributs** : secteur d&#39;activité, zone géographique, stade de financement et effectif.
  * **Données d&#39;entité structurées** : les résultats renvoient des informations typées sur l&#39;entreprise (effectifs, siège social, données financières, trafic web).
  * **Cas d&#39;usage** : prospection commerciale, études de marché et workflows de chaîne d&#39;approvisionnement.

  [Consulter la documentation Companies &amp; People Search →](/fr/docs/search/data/companies-people) · [Lire l&#39;article de blog sur les benchmarks →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Introducing Exa People Search" }}>
  <div id="introducing-exa-people-search">
    ## Présentation d&#39;Exa People Search
  </div>

  La recherche de personnes couvre désormais plus d&#39;un milliard de profils publics grâce à un système de retrieval hybride. La catégorie `linkedin` est remplacée par la nouvelle catégorie `people`.

  * **Couverture élargie** : des profils sur l&#39;ensemble du web, et non plus seulement sur LinkedIn.
  * **Meilleure précision** : embeddings affinés pour les requêtes portant sur un poste, une compétence ou une entreprise.
  * **Cas d&#39;usage** : vente, recrutement et études de marché.

  [Consulter la documentation Companies &amp; People Search →](/fr/docs/search/data/companies-people) · [Lire l&#39;article de blog sur le benchmark →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK: highlights restored" }}>
  <div id="js-sdk-highlights-restored">
    ## SDK JS : retour des highlights
  </div>

  Les highlights font leur retour dans le SDK JavaScript à partir de `exa-js` v2.0.11 : ils renvoient les phrases clés accompagnées de scores de relevance. Passez `highlights: true` ou `highlights: { maxCharacters, query }` dans vos appels search et contents.

  [Consulter la documentation du SDK JavaScript →](/fr/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "New Deep Search Type" }}>
  <div id="new-deep-search-type">
    ## Nouveau search type « deep »
  </div>

  Exa Deep obtient de meilleurs résultats en lançant plusieurs recherches en parallèle et en renvoyant un contexte de grande qualité pour chaque résultat. Activez-le avec `type="deep"`.

  * **Expansion de requête** : envoyez une seule requête et nous en générons des variantes, ou fournissez les vôtres via `additionalQueries`.
  * **Recherche parallèle et classement intelligent** sur votre requête et sur toutes ses variantes.
  * **Summaries détaillés** pour chaque résultat.

  [Consulter la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "Added Language Filtering" }}>
  <div id="added-language-filtering">
    ## Ajout du filtrage par langue
  </div>

  Exa détecte désormais la langue de votre requête et ne renvoie que des résultats dans cette langue. Activé par défaut pour tous les utilisateurs, sans aucune configuration.

  [Consulter le guide de la Search API →](/fr/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "SDK changes: highlights removed and contents returned by default" }}>
  <div id="sdk-changes-highlights-removed-and-contents-returned-by-default">
    ## Changements dans les SDK : suppression des highlights et contents renvoyés par défaut
  </div>

  Une version majeure des SDK, avec des changements non rétrocompatibles :

  * **Contents par défaut** : search inclut désormais les page contents ; désactivez cette option pour des recherches plus rapides.
  * **Highlights supprimés des SDK** : rétablis par la suite dans le SDK JS ; voir [SDK JS : retour des highlights](#js-sdk-highlights-restored).
  * **`use_autoprompt` deprecated** : supprimé de toutes les réponses de l&#39;API.

  [Consulter la documentation du SDK Python →](/fr/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "Domain Path Filter Support" }}>
  <div id="domain-path-filter-support">
    ## Prise en charge des filtres par chemin de domaine
  </div>

  `includeDomains` et `excludeDomains` permettent désormais un ciblage plus fin :

  * **Filtrage par chemin** : par exemple `exa.ai/blog` ou `linkedin.com/company`.
  * **Jokers sur les sous-domaines** : par exemple `*.substack.com`.

  Pratique pour restreindre les recherches à des blogs, des catalogues de produits ou des annuaires.

  [Consulter la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "Geolocation Filter Support" }}>
  <div id="geolocation-filter-support">
    ## Prise en charge du filtre de géolocalisation
  </div>

  Le nouveau paramètre `userLocation` oriente les résultats vers la région d&#39;un utilisateur ; il se transmet sous la forme d&#39;un code pays [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (par exemple `"us"`, `"fr"`). Utile pour les applications multirégionales, les contenus en langue régionale et la découverte locale.

  [Consulter la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "Nouveau search type Fast" }}>
  <div id="new-fast-search-type">
    ## Nouveau search type Fast
  </div>

  Exa Fast s&#39;appuie sur des modèles de recherche allégés dont la latence p50 est inférieure à 425 ms. Activez-le avec `type="fast"`.

  * **Le même index Exa** de contenus de haute qualité que la neural search.
  * **Compatibilité totale des paramètres** avec les autres search types.
  * **Conçu pour** le grounding web rapide, les workflows agentiques et les produits à faible latence.

  [Lire le guide de la Search API →](/fr/docs/search/quickstart) · [Essayer dans le dashboard →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Dépréciation du score dans Auto search" }}>
  <div id="score-deprecation-in-auto-search">
    ## Dépréciation du score dans Auto search
  </div>

  La nouvelle architecture d&#39;Auto search ne permet plus de produire des scores de relevance pertinents : le champ `score` est donc retiré des résultats d&#39;Auto search.

  * **Auto search** : ne renvoie plus `score` ; les résultats sont déjà classés par relevance.
  * **Neural search** : les scores restent inchangés. Définissez `type="neural"` si vous en avez besoin.

  [Consulter la Search API reference →](/fr/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Contenus en Markdown par défaut" }}>
  <div id="markdown-contents-as-default">
    ## Contenus en Markdown par défaut
  </div>

  Tous les endpoints renvoient désormais du markdown propre par défaut, mieux adapté aux LLM, au RAG et au traitement de texte en général. Aucune action requise.

  * **`includeHtmlTags=false` (default)** : contenu transformé en markdown propre.
  * **`includeHtmlTags=true`** : HTML brut, sans traitement markdown.

  Dans les deux cas, les éléments superflus comme les publicités et la navigation sont supprimés.

  [Lire la documentation Contents →](/fr/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "Nouvelle option livecrawl : preferred" }}>
  <div id="new-livecrawl-option-preferred">
    ## Nouvelle option livecrawl : preferred
  </div>

  <Warning>
    Entrée historique : le paramètre chaîne `livecrawl` est désormais deprecated. Pour toute nouvelle intégration, utilisez `maxAgeHours` avec `livecrawlTimeout`. Voir [Content Freshness](/fr/docs/contents/quickstart#content-freshness).
  </Warning>

  L&#39;option dépréciée `livecrawl: "preferred"` tente un nouveau crawl, mais bascule sur le contenu en cache si le crawl échoue (contrairement à `"always"`, qui renvoie une erreur). Idéale pour les applications en production qui veulent du contenu frais sans échouer sur des sites temporairement indisponibles.

  [Lire la documentation Content Freshness →](/fr/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Changements de status de l'endpoint Contents" }}>
  <div id="contents-endpoint-status-changes">
    ## Changements de status de l&#39;endpoint Contents
  </div>

  `/contents` renvoie désormais un champ `statuses` par URL au lieu d&#39;une seule erreur HTTP : vous pouvez ainsi traiter individuellement le résultat de chaque URL. L&#39;endpoint ne renvoie d&#39;erreur qu&#39;en cas de problème interne.

  * **`status`** : `"success"` ou `"error"` pour chaque URL.
  * **`error.tag`** : par exemple `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE`, accompagné d&#39;un `httpStatusCode`.

  [Consulter la référence des error codes →](/fr/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto search par défaut" }}>
  <div id="auto-search-as-default">
    ## Auto search par défaut
  </div>

  Auto search est désormais le mode par défaut : chaque requête est automatiquement orientée vers la meilleure méthode de recherche. Aucune action requise ; définissez `type="neural"` pour conserver le comportement précédent.

  [Découvrir les search types d&#39;Exa →](/fr/docs/search/quickstart)
</Update>