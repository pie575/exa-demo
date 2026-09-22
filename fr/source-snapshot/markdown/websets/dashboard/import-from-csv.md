> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Import from CSV {#import-from-csv}

> Transformez vos données CSV existantes en Webset

<br />

## Aperçu {#overview}

La fonctionnalité Import from CSV vous permet de transformer vos fichiers CSV existants contenant des URL en Websets pleinement fonctionnels. C&#39;est idéal lorsque vous disposez déjà d&#39;une liste de sites web, d&#39;entreprises ou de ressources que vous souhaitez enrichir avec des données supplémentaires ou filtrer à l&#39;aide de critères de recherche.

<br />

## Fonctionnement {#how-it-works}

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="Flux d'import CSV pour créer un Webset" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. Cliquez sur « Start from CSV » pour sélectionner votre fichier CSV
2. Indiquez la colonne qui contient les URL à analyser
3. Vérifiez la façon dont vos données seront importées avant de continuer
4. Vos URL sont transformées en un Webset assorti d&#39;enrichments et de métadonnées

<br />

## Préparation du CSV {#csv-preparation}

Assurez-vous que votre fichier CSV comporte une colonne d&#39;URL

* Pour les recherches de type People : les URL doivent être des URL de profils LinkedIn (par ex. [https://linkedin.com/in/username](https://linkedin.com/in/username))
* Pour les recherches de type Company : les URL doivent être des URL de pages d&#39;accueil d&#39;entreprise (par ex. [https://example.com](https://example.com))
* Pour les autres recherches : utilisez n&#39;importe quel type d&#39;URL

Si vous ne disposez pas d&#39;URL, Websets tentera de les déduire à partir des informations contenues dans chaque ligne du CSV et de toute information supplémentaire que vous fournissez.

Le nombre maximal de résultats que vous pouvez importer dépend de votre plan.

## Que se passe-t-il ensuite ? {#what-happens-next}

Une fois importé, votre CSV devient un Webset complet dans lequel vous pouvez :

### Enrichir avec des colonnes personnalisées {#enrich-with-custom-columns}

Ajoutez toutes les informations que vous souhaitez sur chaque URL :

* Coordonnées (e-mails, numéros de téléphone)
* Indicateurs d&#39;entreprise (chiffre d&#39;affaires, nombre d&#39;employés)
* Analyse de contenu (sentiment, thématiques, résumés)
* Données personnalisées propres à votre cas d&#39;usage

### Appliquer des critères de recherche {#apply-search-criteria}

Filtrez les URL importées selon des critères précis :

* Stade de développement ou taille de l&#39;entreprise
* Industrie ou secteur
* Zone géographique
* Type de contenu ou sujet