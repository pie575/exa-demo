> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="import-from-csv">
  # Import from CSV
</div>

> Transformez vos données CSV existantes en Webset

<br />

<div id="overview">
  ## Aperçu
</div>

La fonctionnalité Import from CSV vous permet de transformer vos fichiers CSV contenant des URL en Websets pleinement fonctionnels. C&#39;est la solution idéale si vous disposez déjà d&#39;une liste de sites web, d&#39;entreprises ou de ressources que vous souhaitez enrichir avec des données supplémentaires ou filtrer à l&#39;aide de critères de recherche.

<br />

<div id="how-it-works">
  ## Fonctionnement
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="Flux d'import CSV pour créer un Webset" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. Cliquez sur « Start from CSV » pour sélectionner votre fichier CSV
2. Indiquez la colonne qui contient les URL à analyser
3. Vérifiez la manière dont vos données seront importées avant de poursuivre
4. Vos URL sont transformées en un Webset enrichi et accompagné de ses metadata

<br />

<div id="csv-preparation">
  ## Préparation du CSV
</div>

Assurez-vous que votre fichier CSV comporte une colonne URL

* Pour les recherches de type People : les URL doivent être des URL de profils LinkedIn (par ex., [https://linkedin.com/in/username](https://linkedin.com/in/username))
* Pour les recherches de type Company : les URL doivent être des URL de pages d&#39;accueil d&#39;entreprises (par ex., [https://example.com](https://example.com))
* Pour les autres recherches : utilisez n&#39;importe quel type d&#39;URL

Si vous ne disposez pas d&#39;URL, Websets tentera de les déduire à partir des informations contenues dans chaque ligne du CSV et des informations complémentaires que vous fournissez.

Le nombre maximal de résultats que vous pouvez importer dépend de votre offre.

<div id="what-happens-next">
  ## Et ensuite ?
</div>

Une fois importé, votre CSV devient un Webset complet dans lequel vous pouvez :

<div id="enrich-with-custom-columns">
  ### Enrichir avec des colonnes personnalisées
</div>

Ajoutez toutes les informations souhaitées sur chaque URL :

* Coordonnées (e-mails, numéros de téléphone)
* Indicateurs d&#39;entreprise (chiffre d&#39;affaires, effectif)
* Analyse de contenu (sentiment, thèmes, résumés)
* Données personnalisées propres à votre cas d&#39;usage

<div id="apply-search-criteria">
  ### Appliquer des critères de recherche
</div>

Filtrez les URL importées selon des critères précis :

* Stade de développement ou taille de l&#39;entreprise
* Industrie ou secteur
* Zone géographique
* Type de contenu ou thématique