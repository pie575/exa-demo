> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="gumloop">
  # Gumloop
</div>

> Usa Exa search y contents dentro de los flujos de Gumloop.

[Gumloop](https://www.gumloop.com/) incluye Exa como integración MCP integrada. Añádela a un agent o a un Agent Node para buscar en la web, extraer páginas, encontrar fuentes relacionadas y generar respuestas respaldadas por citas dentro de un flujo de trabajo.

<div id="add-exa-to-a-gumloop-agent">
  ## Añadir Exa a un agent de Gumloop
</div>

<Steps>
  <Step title="Abre el agent">
    Abre la configuración de tu agent y selecciona **Add tools** → **Connect an app with MCP**.
  </Step>

  <Step title="Conecta Exa">
    Busca **Exa**, selecciona la integración y completa el flujo de autenticación.
  </Step>

  <Step title="Elige las herramientas">
    Abre la integración de Exa ya conectada y habilita solo las herramientas que el agent necesite. Así la selección de herramientas queda más clara y se evita que el agent invoque acciones que no vienen al caso.
  </Step>

  <Step title="Prueba la conexión">
    Pídele al agent:

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    Revisa la ejecución para confirmar que el agent llamó a Exa y devolvió fuentes citadas.
  </Step>
</Steps>

<div id="available-tools">
  ## Herramientas disponibles
</div>

| Herramienta              | Úsala para                                                               |
| ------------------------ | ------------------------------------------------------------------------ |
| **Search**               | Encontrar páginas relevantes con búsqueda neuronal o por palabras clave. |
| **Get Contents**         | Extraer texto completo, resúmenes y metadatos de URLs conocidas.         |
| **Find Similar**         | Descubrir páginas relacionadas con una URL de origen.                    |
| **Answer**               | Generar una respuesta fundamentada con citas.                            |
| **Create Research Task** | Iniciar investigaciones de mayor duración.                               |
| **Get Research Task**    | Consultar el estado y el resultado de una tarea de investigación.        |

Para un agent conversacional, habilita primero Search, Get Contents y Answer. Añade las demás herramientas solo cuando el flujo de trabajo lo requiera.

<div id="use-exa-in-a-workflow">
  ## Usar Exa en un flujo de trabajo
</div>

<div id="agent-node">
  ### Agent Node
</div>

Añade un **Agent Node** a un flujo determinista de Gumloop y adjunta Exa como una de sus herramientas. El nodo puede decidir si ejecutar una search, recuperar páginas completas o encadenar varias llamadas a Exa antes de pasar su resultado al siguiente paso del flujo de trabajo.

Esto resulta útil para:

* enriquecer filas de un CRM o de hojas de cálculo con información web actualizada
* monitorear noticias y enviar un summary con fuentes a Slack o por correo electrónico
* investigar empresas antes de derivar los registros a un flujo de trabajo de ventas
* comparar productos y escribir el resultado en un documento

<div id="reusable-custom-mcp-node">
  ### MCP node personalizado reutilizable
</div>

Para una sola acción repetible, crea un nodo dedicado:

1. Abre la biblioteca de nodos y busca Exa.
2. Selecciona **Create a node with AI**.
3. Describe una única acción, como `Search for funding announcements from the past seven days`.
4. Prueba el nodo generado, verifica sus entradas y salidas y luego guárdalo.

Usa un Agent Node cuando la tarea requiera planificación dinámica o varias herramientas. Usa un MCP node personalizado cuando la misma operación de Exa deba ejecutarse de forma predecible en cada Item.

<div id="prompt-patterns">
  ## Patrones de prompts
</div>

<AccordionGroup>
  <Accordion title="Buscar y resumir">
    ```text theme={null}
    Busca anuncios oficiales sobre [tema] publicados esta semana.
    Devuelve la fecha, el medio que lo publicó, el resumen y la URL de origen de cada resultado.
    ```
  </Accordion>

  <Accordion title="Enriquecer una empresa">
    ```text theme={null}
    Dado este nombre de empresa y su dominio, encuentra la descripción de su producto,
    el último anuncio de financiación y dos fuentes de noticias recientes.
    ```
  </Accordion>

  <Accordion title="Leer una página conocida">
    ```text theme={null}
    Obtén el contenido completo de esta URL y extrae los niveles de precios en formato JSON.
    ```
  </Accordion>
</AccordionGroup>

<div id="troubleshooting">
  ## Solución de problemas
</div>

<AccordionGroup>
  <Accordion title="Exa no está disponible para el agent">
    Vuelve a abrir las herramientas MCP del agent, comprueba que Exa esté conectado y habilita la herramienta que necesites. Una integración conectada puede tener herramientas individuales deshabilitadas.
  </Accordion>

  <Accordion title="El agent elige la acción equivocada">
    Especifica en la solicitud si debe hacer una search, leer URLs conocidas, encontrar páginas similares o responder a partir de fuentes. Deshabilita las herramientas de Exa que el agent no necesite para ese flujo de trabajo.
  </Accordion>

  <Accordion title="Un flujo de trabajo necesita una única llamada predecible">
    Sustituye el paso del agent de propósito general por un MCP node personalizado de Exa con entradas y tarea fijas.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Recursos
</div>

<Columns cols={3}>
  <Card title="Integración de Exa con Gumloop" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="Leer guía" arrow="true">
    Revisa las herramientas actuales de Gumloop y el flujo de trabajo del Agent Node.
  </Card>

  <Card title="Servidor MCP de Exa" icon="plug" href="/es/docs/get-started/exa-mcp" cta="Leer guía" arrow="true">
    Conoce las herramientas de Exa disponibles a través de MCP.
  </Card>

  <Card title="Exa Search" icon="search" href="/es/docs/search/quickstart" cta="Leer guía" arrow="true">
    Aprende a definir tus consultas de búsqueda y los contents que devuelven.
  </Card>
</Columns>