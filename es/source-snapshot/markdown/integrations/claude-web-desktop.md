> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Exa en Claude Code, Web y Desktop {#exa-in-claude-code-web-and-desktop}

> Busca en la web y lee cualquier página con Exa directamente desde Claude

Instala Exa en Claude Code o conéctalo a Claude Web, Desktop y Cowork para dar a Claude acceso a información actualizada de la web. Claude puede buscar en lenguaje natural, leer las páginas relevantes y usar esas fuentes mientras trabaja.

## Instalar Exa {#install-exa}

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web, Desktop y Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="Abre el directorio de conectores">
          En un chat nuevo de Claude, pulsa el botón de más, elige **Add connector** y busca **Exa**.
        </Step>

        <Step title="Conecta Exa">
          Abre Exa, selecciona **Connect to Claude** y autoriza el acceso cuando se te solicite.

          <Frame caption="Abrir el directorio de conectores en Claude, encontrar Exa, conectarlo y autorizar el acceso">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Abrir el directorio de conectores en Claude, encontrar Exa, conectarlo y autorizar el acceso" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Usa Exa">
          Inicia un chat nuevo y pide algo que requiera información actualizada de la web.
        </Step>
      </Steps>
    </Tab>

    <Tab title="CLI de Claude Code" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude-code.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=f7f017b187974c56e5822d7baf8272fa" width="16" height="16" data-path="images/mcp-clients/claude-code.svg">
      <Steps>
        <Step title="Instala el plugin">
          Instala Exa desde la terminal:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          También puedes escribir `/plugin` en Claude Code, buscar **Exa** e instalarlo.
        </Step>

        <Step title="Inicia una sesión nueva">
          Abre una sesión nueva de Claude Code para que se cargue el plugin y luego pide algo que requiera acceso a la web.

          <Frame caption="Abrir una sesión nueva de Claude Code y pedir algo que requiera acceso a la web">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="Abrir una sesión nueva de Claude Code y pedir algo que requiera acceso a la web" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

Ambas opciones habilitan Exa sin necesidad de editar un archivo de configuración de MCP.

## Trabaja con lo que hay en la web ahora mismo {#work-with-whats-on-the-web-right-now}

En Claude Code, Exa puede buscar documentación actualizada, incidencias, registros de cambios y ejemplos reales mientras trabajas en tu repositorio. Esa misma integración aporta a Claude Web, Desktop y Cowork noticias recientes, investigación, información de empresas, detalles de productos y otras fuentes que quizá aún no estén en el contexto.

```text theme={null}
Estamos en Tailwind v3. Usa Exa para buscar y leer la guía oficial de
actualización a Tailwind v4 y luego migra este proyecto a v4.
```

Claude Code puede usar lo que encuentra para aplicar el cambio en tu base de código. En otros clientes de Claude, puede usar esas mismas fuentes en respuestas, artefactos y tareas de Cowork.

El mismo patrón funciona siempre que la respuesta dependa de fuentes web actuales o específicas:

* «Busca las notas de la última versión de esta dependencia y resume los cambios incompatibles».
* «Busca investigación primaria reciente sobre el escalado en tiempo de inferencia y compara los métodos».
* «Lee la documentación actual de webhooks de Stripe y explica el comportamiento de reintentos recomendado».
* «Busca las páginas oficiales de precios de estos productos y compara sus planes de nivel inicial».

## Buscar, leer e investigar {#search-read-and-research}

La integración de Exa proporciona a Claude herramientas para buscar y leer en la web, que puede combinar a lo largo de una tarea de investigación más extensa.

<Columns cols={3}>
  <Card title="Buscar" icon="search">
    Busca en lenguaje natural y obtén el contenido relevante de las páginas, no solo una lista de enlaces.
  </Card>

  <Card title="Leer" icon="file-text">
    Lee la página que le indiques: documentación, investigaciones, registros de cambios, incidencias y artículos.
  </Card>

  <Card title="Investigar" icon="compass">
    Ejecuta varias búsquedas, revisa las páginas útiles y combina la evidencia en una respuesta con fuentes.
  </Card>
</Columns>

## Investigación sin salir de Claude {#research-without-leaving-claude}

Pide el resultado que quieres e indícale a Claude qué tipo de fuentes te interesan:

```text theme={null}
Compara las ofertas gestionadas, las licencias y los precios de las principales
bases de datos vectoriales de código abierto. Usa fuentes primarias actualizadas y cítalas.
```

Claude puede usar Exa durante toda la conversación para encontrar y leer las fuentes que necesite la tarea. Úsalo para investigación técnica, análisis competitivo, mapeo de mercados, investigación de empresas o cualquier pregunta cuya respuesta esté repartida por la web.

## Usa Exa en Cowork {#use-exa-in-cowork}

El mismo conector está disponible en Cowork. Asigna a Claude una tarea que dependa de información externa y podrá buscar o leer páginas mientras trabaja con tus archivos y otras herramientas conectadas.

```text theme={null}
Revisa este informe competitivo, verifica con Exa cada afirmación sobre precios
contrastándola con las páginas actuales del vendor y actualiza el documento con citas.
```

## ¿Prefieres usar MCP directamente? {#prefer-mcp-directly}

Si estás configurando Claude manualmente o usas otro MCP client, puedes conectarte directamente al MCP server alojado de Exa:

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

Consulta [Exa MCP](/es/docs/get-started/exa-mcp) para conocer otros clientes, opciones de configuración y herramientas disponibles.

<Card title="Abrir el conector de Exa" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Añade Exa desde el directorio de conectores de Claude.
</Card>