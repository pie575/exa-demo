> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Gumloop {#gumloop}

> Usa Exa Search y contenido dentro de los flows de Gumloop.

[Gumloop](https://www.gumloop.com/) incluye Exa como integración MCP nativa. Añádela a un agente o a un Agent Node para buscar en la web, extraer páginas, encontrar fuentes relacionadas y generar respuestas respaldadas por citas dentro de un flujo de trabajo.

## Añadir Exa a un agente de Gumloop {#add-exa-to-a-gumloop-agent}

<Steps>
  <Step title="Abre el agente">
    Abre la configuración de tu agente y selecciona **Añadir herramientas** → **Connect an app with MCP**.
  </Step>

  <Step title="Conecta Exa">
    Busca **Exa**, selecciona la integración y completa el flujo de autenticación.
  </Step>

  <Step title="Elige las herramientas">
    Abre la integración de Exa ya conectada y habilita solo las herramientas que necesite el agente. Así la selección de herramientas queda más clara y se evita que el agente llame a acciones que no vienen al caso.
  </Step>

  <Step title="Prueba la conexión">
    Pídele al agente:

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    Revisa el run para confirmar que el agente llamó a Exa y devolvió fuentes citadas.
  </Step>
</Steps>

## Herramientas disponibles {#available-tools}

| Herramienta              | Úsala para                                                               |
| ------------------------ | ------------------------------------------------------------------------ |
| **Search**               | Encontrar páginas relevantes con búsqueda neuronal o por palabras clave. |
| **Get Contents**         | Extraer contenido completo, resúmenes y metadatos de URL conocidas.      |
| **Find Similar**         | Descubrir páginas relacionadas con una URL de origen.                    |
| **Answer**               | Generar una respuesta fundamentada con citas.                            |
| **Create Research Task** | Iniciar una investigación de mayor duración.                             |
| **Get Research Task**    | Consultar el estado y el resultado de una tarea de investigación.        |

Para un agente conversacional, habilita primero Search, Get Contents y Answer. Añade las demás herramientas solo cuando el flujo de trabajo lo requiera.

## Usar Exa en un flujo de trabajo {#use-exa-in-a-workflow}

### Agent Node {#agent-node}

Añade un **Agent Node** a un flujo determinista de Gumloop y adjunta Exa como una de sus herramientas. El nodo puede decidir si hacer una búsqueda, recuperar páginas completas o encadenar varias llamadas a Exa antes de pasar su output al siguiente paso del flujo de trabajo.

Esto funciona bien para:

* enriquecer filas de un CRM o de una hoja de cálculo con evidencia web actualizada
* monitorizar noticias y enviar un resumen con fuentes a Slack o al correo
* investigar empresas antes de derivar registros a un flujo de trabajo de ventas
* comparar productos y volcar el resultado en un documento

### Nodo MCP personalizado reutilizable {#reusable-custom-mcp-node}

Para una única acción repetible, crea un nodo dedicado:

1. Abre la biblioteca de nodos y busca Exa.
2. Selecciona **Create a node with AI**.
3. Describe una sola acción, como `Search for funding announcements from the past seven days`.
4. Prueba el nodo generado, verifica sus entradas y outputs y guárdalo.

Usa un Agent Node cuando la tarea requiera planificación dinámica o varias herramientas. Usa un nodo MCP personalizado cuando la misma operación de Exa deba ejecutarse de forma predecible en cada item.

## Patrones de prompt {#prompt-patterns}

<AccordionGroup>
  <Accordion title="Buscar y resumir">
    ```text theme={null}
    Busca anuncios oficiales sobre [tema] publicados esta semana.
    Devuelve la fecha, el editor, el resumen y la URL de origen de cada resultado.
    ```
  </Accordion>

  <Accordion title="Enriquecer una empresa">
    ```text theme={null}
    A partir de este nombre de empresa y dominio, encuentra la descripción de su producto,
    el último anuncio de financiación y dos fuentes de noticias recientes.
    ```
  </Accordion>

  <Accordion title="Leer una página conocida">
    ```text theme={null}
    Obtén el contenido completo de esta URL y extrae los niveles de precios en JSON.
    ```
  </Accordion>
</AccordionGroup>

## Solución de problemas {#troubleshooting}

<AccordionGroup>
  <Accordion title="Exa no está disponible para el agente">
    Vuelve a abrir las herramientas MCP del agente, confirma que Exa esté conectado y habilita la herramienta necesaria. Aunque una integración esté conectada, sus herramientas pueden estar deshabilitadas de forma individual.
  </Accordion>

  <Accordion title="El agente elige la acción incorrecta">
    Indica de forma explícita en la solicitud si debe buscar, leer URL conocidas, encontrar páginas similares o responder a partir de fuentes. Deshabilita las herramientas de Exa que el agente no necesite para ese flujo de trabajo.
  </Accordion>

  <Accordion title="Un flujo de trabajo necesita una única llamada predecible">
    Sustituye el paso del agente de propósito general por un nodo MCP de Exa personalizado con entradas y tarea fijas.
  </Accordion>
</AccordionGroup>

## Recursos {#resources}

<Columns cols={3}>
  <Card title="Integración de Exa con Gumloop" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="Leer la guía" arrow="true">
    Revisa las herramientas actuales de Gumloop y el flujo de trabajo del Agent Node.
  </Card>

  <Card title="Exa MCP server" icon="plug" href="/es/docs/get-started/exa-mcp" cta="Leer la guía" arrow="true">
    Conoce las herramientas de Exa disponibles a través de MCP.
  </Card>

  <Card title="Exa Search" icon="search" href="/es/docs/search/quickstart" cta="Leer la guía" arrow="true">
    Aprende a definir tus consultas de búsqueda y el contenido devuelto.
  </Card>
</Columns>