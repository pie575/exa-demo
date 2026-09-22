> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="n8n">
  # n8n
</div>

> Usa la búsqueda y el contenido de Exa dentro de flujos de trabajo de n8n.

El [nodo de Exa para n8n](https://github.com/exa-labs/n8n-integration) oficial añade búsqueda web, extracción de contenido, respuestas fundamentadas y runs de Exa Agent a los flujos de trabajo visuales. Úsalo como un paso más del flujo de trabajo o conéctalo como herramienta a un AI Agent de n8n.

<div id="install-the-exa-node">
  ## Instalar el nodo de Exa
</div>

El nombre del paquete es `n8n-nodes-exa-official`.

<Steps>
  <Step title="Añadir el community nodo">
    Busca **Exa** en el nodo picker de n8n. Si no está disponible en tu instancia, el propietario de la instancia puede instalar `n8n-nodes-exa-official` siguiendo la [guía de instalación de community nodos](https://docs.n8n.io/integrations/community-nodes/installation/) de n8n.

    El nodo requiere n8n 1.60 o posterior y Node.js 20.15 o posterior.
  </Step>

  <Step title="Crear una API key de Exa">
    <Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
    </Card>
  </Step>

  <Step title="Añadir las credenciales de Exa">
    Añade una credencial **Exa API** en n8n y pega tu key. Selecciona esa credencial en cada nodo de Exa que deba usar la cuenta.
  </Step>
</Steps>

<div id="run-a-search">
  ## Ejecutar una búsqueda
</div>

1. Añade un disparador a un flujo de trabajo.
2. Añade el nodo **Exa**.
3. Elige **Search**.
4. Introduce una consulta y selecciona un tipo de búsqueda.
5. Elige un formato de respuesta:
   * **Results** para páginas ordenadas por relevancia
   * **Text** para una respuesta sintetizada
   * **Structured** para JSON que se ajuste a tu esquema
6. Ejecuta el nodo y pasa su output al siguiente paso del flujo de trabajo.

La búsqueda también puede devolver texto, highlights, resúmenes, enlaces e imágenes de cada resultado. Los filtros de dominio, las fechas de publicación, las categorías, `maxAgeHours` y el rastreo de subpáginas están disponibles en los campos opcionales del nodo.

<div id="available-resources">
  ## Recursos disponibles
</div>

| Recurso      | Operaciones                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Search**   | Busca en la web con `auto`, `instant`, `fast`, `deep-lite`, `deep` o `deep-reasoning`, con síntesis y salida estructurada opcionales. |
| **contenido** | Recupera texto limpio, highlights, resúmenes, enlaces e imágenes de una lista de URL.                                                 |
| **Answer**   | Genera una respuesta fundamentada con citas y salida estructurada opcional.                                                           |
| **Agent**    | Crea, inspecciona, lista, transmite, sondea y cancela runs de Agent de varios pasos.                                                  |

<div id="use-exa-with-an-n8n-ai-agent">
  ## Usa Exa con un AI Agent de n8n
</div>

Conecta un nodo de Exa a un nodo **AI Agent** mediante su entrada de herramienta. Los parámetros que debe proporcionar el modelo pueden usar la expresión `$fromAI()` de n8n:

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search y Answer funcionan bien como herramientas de grounding. Usa el recurso Agent cuando la tarea requiera investigación de varios pasos, creación de listas, enrichment estructurado o datos premium de [Exa Connect](/es/docs/agent/connect/overview).

<div id="wait-for-an-agent-run">
  ## Esperar un run de Agent
</div>

Al crear un run de Agent, **Wait for Completion** admite:

* **Stream** para mantener abierta una conexión de server-sent events hasta que termine el run
* **Sondear** para consultar el run a intervalos regulares

Para flujos de trabajo prolongados o asíncronos, desactiva **Wait for Completion**, guarda el `id` del run devuelto y usa **Get Run** más adelante. El run continúa en Exa una vez finalizado el paso de n8n.

<div id="troubleshooting">
  ## Solución de problemas
</div>

<AccordionGroup>
  <Accordion title="El nodo de Exa no aparece en el selector de nodos">
    Pide al propietario de la instancia que instale el paquete verificado de la comunidad `n8n-nodes-exa-official`. La disponibilidad de los nodos de la comunidad puede depender de cómo esté alojada tu instancia de n8n.
  </Accordion>

  <Accordion title="Se rechaza la credencial de Exa">
    Comprueba que la credencial seleccionada contenga una key activa del [dashboard de Exa](https://dashboard.exa.ai/api-keys) y que la key tenga créditos disponibles.
  </Accordion>

  <Accordion title="Un flujo de trabajo de Agent agota el tiempo de espera">
    Desactiva **Wait for Completion**, guarda el `id` del run devuelto y recupera el resultado en un paso posterior con **Get Run**.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Recursos
</div>

<Columns cols={3}>
  <Card title="Nodo oficial de Exa" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="Ver repositorio" arrow="true">
    Consulta las operaciones actuales, la compatibilidad y el código fuente.
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/es/docs/agent/quickstart" cta="Leer la guía" arrow="true">
    Crea flujos de trabajo de investigación y enrichment en varios pasos.
  </Card>

  <Card title="Buenas prácticas de búsqueda" icon="search" href="/es/docs/search/best-practices" cta="Leer la guía" arrow="true">
    Escribe mejores consultas y elige el modo de búsqueda adecuado.
  </Card>
</Columns>