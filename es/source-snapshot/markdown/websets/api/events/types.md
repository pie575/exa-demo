> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="event-types">
  # Tipos de eventos
</div>

> Conoce los eventos que ocurren dentro de la API de Websets

La API de Websets utiliza eventos para notificarte los cambios en tus Websets. Puedes monitorear estos eventos mediante nuestro [endpoint de eventos](/es/docs/websets/api/events/list-all-events) o configurando [webhooks](/es/docs/websets/api/webhooks/create-a-webhook).

Los eventos se conservan durante 60 días y luego se eliminan automáticamente.

<div id="webset">
  ## Webset
</div>

* `webset.created` - Se emite cuando se crea un nuevo Webset.
* `webset.deleted` - Se emite cuando se elimina un Webset.
* `webset.paused` - Se emite cuando se pausan las operaciones de un Webset.
* `webset.idle` - Se emite cuando un Webset no tiene operaciones en ejecución.

<div id="search">
  ## Search
</div>

* `webset.search.created` - Se emite cuando se inicia una nueva search.
* `webset.search.updated` - Se emite cuando se actualiza el progreso de la search.
* `webset.search.completed` - Se emite cuando una search termina de encontrar todos los items.
* `webset.search.canceled` - Se emite cuando una search se cancela manualmente.

<div id="item">
  ## Item
</div>

* `webset.item.created` - Se emite cuando se añade un nuevo item al Webset.
* `webset.item.enriched` - Se emite cuando se completa el enrichment de un item.

<div id="import">
  ## Import
</div>

* `import.created` - Se emite cuando se inicia un nuevo import.
* `import.completed` - Se emite cuando se ha completado un import.

<div id="export">
  ## Exportación
</div>

* `webset.export.created` - Se emite cuando se inicia una nueva exportación.
* `webset.export.completed` - Se emite cuando se ha completado una exportación.

<div id="monitor">
  ## Monitor
</div>

* `monitor.created` - Se emite cuando se crea un nuevo monitor.
* `monitor.updated` - Se emite cuando se actualiza la configuración de un monitor.
* `monitor.deleted` - Se emite cuando se elimina un monitor.
* `monitor.run.created` - Se emite cuando comienza la ejecución de un monitor.
* `monitor.run.completed` - Se emite cuando finaliza la ejecución de un monitor.

Cada evento incluye:

* Un `id` único
* El `type` del evento
* Un objeto `data` con el recurso completo que desencadenó el evento
* Una marca de tiempo `createdAt`

Puedes usar estos eventos para:

* Hacer seguimiento del progreso de las búsquedas y los enrichments
* Crear paneles en tiempo real
* Desencadenar flujos de trabajo cuando se encuentren nuevos items
* Supervisar el estado de tus exportaciones