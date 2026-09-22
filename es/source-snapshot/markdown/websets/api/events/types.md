> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="event-types">
  # Tipos de evento
</div>

> Conoce los eventos que ocurren dentro de la API de Websets

La API de Websets usa eventos para notificarte los cambios en tus Websets. Puedes monitorear estos eventos a través de nuestro [endpoint de eventos](/es/docs/websets/api/events/list-all-events) o configurando [webhooks](/es/docs/websets/api/webhooks/create-a-webhook).

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

* `webset.search.created` - Se emite cuando se inicia una nueva búsqueda.
* `webset.search.updated` - Se emite cuando se actualiza el progreso de la búsqueda.
* `webset.search.completed` - Se emite cuando una búsqueda termina de encontrar todos los items.
* `webset.search.canceled` - Se emite cuando una búsqueda se cancela manualmente.

<div id="item">
  ## Item
</div>

* `webset.item.created` - Se emite cuando se añade un nuevo item al Webset.
* `webset.item.enriched` - Se emite cuando se completa el enrichment de un item.

<div id="import">
  ## Import
</div>

* `import.created` - Se emite cuando se inicia un nuevo import.
* `import.completed` - Se emite cuando un import se ha completado.

<div id="export">
  ## Export
</div>

* `webset.export.created` - Se emite cuando se inicia un nuevo export.
* `webset.export.completed` - Se emite cuando se ha completado un export.

<div id="monitor">
  ## Monitor
</div>

* `monitor.created` - Se emite cuando se crea un nuevo monitor.
* `monitor.updated` - Se emite cuando se actualiza la configuración de un monitor.
* `monitor.deleted` - Se emite cuando se elimina un monitor.
* `monitor.run.created` - Se emite cuando comienza un monitor run.
* `monitor.run.completed` - Se emite cuando finaliza un monitor run.

Cada evento incluye:

* Un `id` único
* El `type` del evento
* Un objeto `data` con el recurso completo que activó el evento
* Un timestamp `createdAt`

Puedes usar estos eventos para:

* Hacer seguimiento del progreso de las búsquedas y los enrichments
* Crear paneles en tiempo real
* Activar flujos de trabajo cuando se encuentren nuevos items
* Supervisar el estado de tus exports