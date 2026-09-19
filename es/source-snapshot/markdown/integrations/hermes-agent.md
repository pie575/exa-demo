> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="hermes-agent">
  # Hermes Agent
</div>

> Dale a Hermes Agent búsqueda web en tiempo real y contenido de páginas con Exa.

[Hermes Agent](https://github.com/NousResearch/hermes-agent) incluye Exa como backend nativo para sus herramientas `web_search` y `web_extract`, invocables por el modelo. Usa Exa para ambas capacidades o combínalo con otro proveedor web de Hermes.

<div id="connect-your-exa-account">
  ## Conecta tu cuenta de Exa
</div>

<Steps>
  <Step title="Obtén una Exa API key">
    <Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el dashboard. Las cuentas nuevas incluyen credits gratuitos.
    </Card>
  </Step>

  <Step title="Selecciona Exa en Hermes">
    Ejecuta el asistente de configuración de herramientas:

    ```bash theme={null}
    hermes tools
    ```

    Abre **Web Search &amp; Extract**, elige Exa y selecciona la opción basada en API key. Cuando se te solicite, introduce tu Exa API key. Hermes guarda los secretos en `~/.hermes/.env` y la selección de proveedor en `~/.hermes/config.yaml`.
  </Step>

  <Step title="Prueba el acceso a la web">
    Inicia Hermes y pídele que haga una search y luego lea uno de los resultados:

    ```text theme={null}
    Search the web for the latest Exa product updates, then read the most relevant result.
    ```

    Hermes debería llamar a `web_search` y, después, a `web_extract` cuando necesite la página en sí.
  </Step>
</Steps>

<div id="configure-manually">
  ## Configuración manual
</div>

Agrega tu key al archivo de entorno de Hermes:

```bash ~/.hermes/.env theme={null}
EXA_API_KEY=your-exa-api-key
```

Luego selecciona Exa para ambas capacidades web:

```yaml ~/.hermes/config.yaml theme={null}
web:
  search_backend: "exa"
  extract_backend: "exa"
```

En su lugar, puedes usar el respaldo compartido:

```yaml ~/.hermes/config.yaml theme={null}
web:
  backend: "exa"
```

Los ajustes por capacidad tienen prioridad sobre `web.backend`. Esto te permite usar Exa solo para búsqueda o solo para extracción cuando combinas proveedores.

<div id="tools-hermes-gets">
  ## Herramientas que recibe Hermes
</div>

| Herramienta   | Comportamiento de Exa                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `web_search`  | Busca con Exa y devuelve páginas ordenadas por relevancia con títulos, URL y fragmentos de texto. |
| `web_extract` | Recupera contenido legible de una o varias URL mediante Exa Contents.                             |

Hermes trunca las páginas extraídas extensas según el límite de caracteres configurado y guarda el texto completo en disco. Cambia el valor predeterminado con `web.extract_char_limit` o deja que el agent solicite un `char_limit` mayor para una llamada concreta.

<Note>
  Hermes puede usar Exa mediante su grupo de proveedores gratuitos sin API key. Ese grupo tiene límites de tasa y puede rotar entre proveedores. Configura `EXA_API_KEY` y selecciona la opción de Exa respaldada por una API key cuando necesites que las solicitudes usen siempre tu cuenta de Exa.
</Note>

<div id="troubleshooting">
  ## Solución de problemas
</div>

<AccordionGroup>
  <Accordion title="Hermes no selecciona Exa">
    Ejecuta `hermes tools` y selecciona Exa explícitamente. Si configuras los archivos manualmente, comprueba que `web.search_backend`, `web.extract_backend` o `web.backend` tenga el valor `exa`.
  </Accordion>

  <Accordion title="Hermes indica que falta EXA_API_KEY">
    Añade la key a `~/.hermes/.env` y reinicia Hermes para que recargue el entorno.
  </Accordion>

  <Accordion title="La búsqueda funciona, pero la extracción usa otro proveedor">
    Hermes permite configurar la búsqueda y la extracción de forma independiente. Asigna el valor `exa` tanto a `web.search_backend` como a `web.extract_backend`.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Recursos
</div>

<Columns cols={3}>
  <Card title="Herramientas web de Hermes" icon="book-open" href="https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search" cta="Leer la guía" arrow="true">
    Consulta la selección de proveedores, el almacenamiento en caché y el comportamiento de extracción de Hermes.
  </Card>

  <Card title="Exa Search" icon="search" href="/es/docs/search/quickstart" cta="Leer la guía" arrow="true">
    Descubre cómo Exa busca, filtra y devuelve el contenido de las páginas.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/es/docs/contents/quickstart" cta="Leer la guía" arrow="true">
    Conoce la API de extracción que hay detrás de `web_extract`.
  </Card>
</Columns>