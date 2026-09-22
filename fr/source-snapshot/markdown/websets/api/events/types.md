> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Types d&#39;événements {#event-types}

> Découvrez les événements qui se produisent au sein de l&#39;API Webset

L&#39;API Websets utilise des événements pour vous signaler les changements survenus dans vos Websets. Vous pouvez suivre ces événements via notre [endpoint events](/fr/docs/websets/api/events/list-all-events) ou en configurant des [webhooks](/fr/docs/websets/api/webhooks/create-a-webhook).

Les événements sont conservés pendant 60 jours, puis supprimés automatiquement.

## Webset {#webset}

* `webset.created` - Émis lors de la création d&#39;un nouveau Webset.
* `webset.deleted` - Émis lors de la suppression d&#39;un Webset.
* `webset.paused` - Émis lorsque les opérations d&#39;un Webset sont mises en pause.
* `webset.idle` - Émis lorsqu&#39;un Webset n&#39;a plus aucune opération en cours.

## Search {#search}

* `webset.search.created` - Émis lorsqu&#39;une nouvelle search est lancée.
* `webset.search.updated` - Émis lorsque la progression de la search est mise à jour.
* `webset.search.completed` - Émis lorsqu&#39;une search a fini de trouver tous les items.
* `webset.search.canceled` - Émis lorsqu&#39;une search est annulée manuellement.

## Item {#item}

* `webset.item.created` - Émis lorsqu&#39;un nouvel item est ajouté au Webset.
* `webset.item.enriched` - Émis lorsque l&#39;enrichment d&#39;un item est terminé.

## Import {#import}

* `import.created` - Émis lorsqu&#39;un nouvel import est lancé.
* `import.completed` - Émis lorsqu&#39;un import est terminé.

## Export {#export}

* `webset.export.created` - Émis lorsqu&#39;un nouvel export est lancé.
* `webset.export.completed` - Émis lorsqu&#39;un export est terminé.

## Monitor {#monitor}

* `monitor.created` - Émis lorsqu&#39;un nouveau monitor est créé.
* `monitor.updated` - Émis lorsque la configuration d&#39;un monitor est mise à jour.
* `monitor.deleted` - Émis lorsqu&#39;un monitor est supprimé.
* `monitor.run.created` - Émis au démarrage d&#39;un run de monitor.
* `monitor.run.completed` - Émis à la fin d&#39;un run de monitor.

Chaque événement comprend :

* Un `id` unique
* Le `type` de l&#39;événement
* Un objet `data` contenant la ressource complète à l&#39;origine de l&#39;événement
* Un horodatage `createdAt`

Vous pouvez utiliser ces événements pour :

* Suivre la progression des recherches et des enrichments
* Créer des tableaux de bord en temps réel
* Déclencher des workflows lorsque de nouveaux items sont trouvés
* Surveiller le statut de vos exports