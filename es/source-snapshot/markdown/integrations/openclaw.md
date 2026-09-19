> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="openclaw">
  # OpenClaw
</div>

> Dale a OpenClaw búsqueda web en tiempo real y contenido de páginas con Exa.

[OpenClaw](https://openclaw.ai/) admite Exa como proveedor nativo de `web_search`. Una vez seleccionado, cualquier agente de OpenClaw puede usar los modos de búsqueda de Exa, los filtros por fecha y la extracción de contenido mediante la herramienta web integrada.

<div id="set-up-exa">
  ## Configurar Exa
</div>

<Steps>
  <Step title="Instalar el plugin de Exa">
    ```bash theme={null}
    openclaw plugins install @openclaw/exa-plugin
    openclaw gateway restart
    ```
  </Step>

  <Step title="Obtener una Exa API key">
    <Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas incluyen credits gratuitos.
    </Card>
  </Step>

  <Step title="Guardar la key">
    En una instalación con gateway, añade la key a `~/.openclaw/.env`:

    ```bash ~/.openclaw/.env theme={null}
    EXA_API_KEY=your-exa-api-key
    ```

    Reinicia el gateway después de modificar su entorno.
  </Step>

  <Step title="Seleccionar Exa para la web search">
    Ejecuta:

    ```bash theme={null}
    openclaw configure --section web
    ```

    Elige **Exa** como proveedor de web search. OpenClaw guarda la selección del proveedor en su configuración y lee la credencial de `EXA_API_KEY`.
  </Step>
</Steps>

<div id="configure-manually">
  ## Configurar manualmente
</div>

Puedes seleccionar Exa directamente en la configuración JSON5 de OpenClaw:

```json5 theme={null}
{
  tools: {
    web: {
      search: {
        provider: "exa",
      },
    },
  },
}
```

Para almacenar la key en la configuración en lugar de en el entorno del gateway:

```json5 theme={null}
{
  plugins: {
    entries: {
      exa: {
        config: {
          webSearch: {
            apiKey: "exa-...",
          },
        },
      },
    },
  },
}
```

<Note>
  Es preferible usar `EXA_API_KEY` o un SecretRef de OpenClaw en lugar de incluir una API key en un archivo de configuración.
</Note>

<div id="what-agents-can-request">
  ## Qué pueden solicitar los agentes
</div>

OpenClaw expone Exa a través de `web_search`.

| Parámetro                    | Propósito                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `query`                      | La consulta de búsqueda web.                                                             |
| `count`                      | Número de resultados, hasta 100 y sujeto al límite del tipo de búsqueda seleccionado.    |
| `type`                       | Modo de búsqueda de Exa: `auto`, `neural`, `fast`, `instant`, `deep` y `deep-reasoning`. |
| `freshness`                  | Limita los resultados al último día, semana, mes o año.                                  |
| `date_after` / `date_before` | Limita los resultados con fechas `YYYY-MM-DD`.                                           |
| `contents`                   | Devuelve el texto completo, los highlights o los resúmenes con cada resultado.           |

Si se omite `contents`, OpenClaw solicita highlights de forma predeterminada. El agente puede pedir otro formato de contenido cuando necesite páginas completas o resúmenes:

```javascript theme={null}
await web_search({
  query: "transformer architecture explained",
  type: "neural",
  contents: {
    text: { maxCharacters: 5000 },
    highlights: { numSentences: 3 },
    summary: true,
  },
});
```

OpenClaw almacena en caché los resultados de búsqueda web durante 15 minutos de forma predeterminada. Cambia `tools.web.search.cacheTtlMinutes` o ponlo en `0` cuando cada solicitud deba devolver datos actualizados.

<div id="troubleshooting">
  ## Solución de problemas
</div>

<AccordionGroup>
  <Accordion title="OpenClaw no muestra Exa como proveedor">
    Instala `@openclaw/exa-plugin`, reinicia el gateway y vuelve a ejecutar `openclaw configure --section web`.
  </Accordion>

  <Accordion title="OpenClaw indica que falta la key de Exa">
    Comprueba que `EXA_API_KEY` esté disponible para el proceso del gateway, y no solo en tu shell interactivo. Si la instalación es con gateway, colócala en `~/.openclaw/.env` y reinicia el gateway.
  </Accordion>

  <Accordion title="Los resultados de search parecen desactualizados">
    OpenClaw almacena en caché los resultados de forma independiente de Exa. Reduce `tools.web.search.cacheTtlMinutes` o ponlo en `0`, y luego usa las opciones de actualidad de contenido de Exa al solicitar el contenido de una página.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Recursos
</div>

<Columns cols={3}>
  <Card title="Proveedor Exa de OpenClaw" icon="book-open" href="https://docs.openclaw.ai/tools/exa-search" cta="Leer la guía" arrow="true">
    Consulta la configuración actual del plugin y los parámetros de la herramienta.
  </Card>

  <Card title="Exa Search" icon="search" href="/es/docs/search/quickstart" cta="Leer la guía" arrow="true">
    Compara los modos de búsqueda de Exa y los formatos de respuesta.
  </Card>

  <Card title="Actualidad del contenido" icon="clock" href="/es/docs/contents/quickstart#content-freshness" cta="Leer la guía" arrow="true">
    Controla el contenido indexado y el recuperado en tiempo real.
  </Card>
</Columns>