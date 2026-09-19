> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="openhuman">
  # OpenHuman
</div>

> Dale al agente de OpenHuman búsqueda web en tiempo real con Exa, ya sea gestionada o con tu propia Exa API key.

[OpenHuman](https://tinyhumans.gitbook.io/openhuman), de TinyHumans, es un asistente de IA de escritorio con una herramienta nativa de búsqueda web que el agente invoca por su cuenta. Exa es el proveedor de búsqueda detrás de esa herramienta.

| Enfoque               | Configuración        | Se ejecuta en                                                           |
| --------------------- | -------------------- | ----------------------------------------------------------------------- |
| **OpenHuman Managed** | Ninguna              | El backend de OpenHuman, con tecnología de Exa. Sin API key.            |
| **Proveedor Exa**     | Pega una Exa API key | Tu máquina, directo a `https://api.exa.ai` con tu propia cuenta de Exa. |

<div id="openhuman-managed">
  ## OpenHuman Managed
</div>

La búsqueda gestionada es la opción predeterminada. Elige **Simple** durante la configuración inicial y el agente podrá buscar en la web de inmediato.

<Frame caption="Elige Simple durante la configuración inicial para usar la búsqueda gestionada con tecnología de Exa">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="La configuración inicial de OpenHuman pregunta cómo ejecutar OpenHuman, con la opción Simple seleccionada" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **La opción gestionada es la forma más rápida de obtener resultados de Exa.** No hay ninguna key que crear, almacenar ni rotar, no hay credenciales en tu equipo y la búsqueda se factura en tu suscripción de OpenHuman.
</Tip>

<div id="exa-provider">
  ## Proveedor Exa
</div>

Configura Exa directamente para ejecutar búsquedas en tu propia cuenta de Exa y proporcionarle al agente las herramientas de search y de contents de páginas de Exa.

<div id="get-your-exa-api-key">
  ### Obtén tu Exa API key
</div>

<Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el dashboard. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

<div id="add-exa-in-openhuman">
  ### Añadir Exa en OpenHuman
</div>

1. Abre **Connections** y luego selecciona **Search engine** dentro de **API keys**.

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="La página Connections de OpenHuman con Search engine seleccionado dentro de API keys, mostrando la lista de motores de búsqueda con OpenHuman Managed activo" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. Selecciona **Exa**.

<Frame caption="Exa seleccionado, a la espera de una key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="La opción de motor Exa seleccionada en el panel Search engine de OpenHuman, mostrando la etiqueta Needs API key" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. Pega tu key en **Exa API key** y selecciona **Save**.

<Frame caption="Guarda la Exa API key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="El campo Exa API key en OpenHuman con una key introducida y el botón Save visible" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="Exa configurado como motor de búsqueda activo">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="El panel Search engine de OpenHuman con Exa seleccionado y marcado como Configured" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

<div id="configuration">
  ### Configuración
</div>

El panel escribe en el archivo `config.toml` de OpenHuman. Como alternativa, define los mismos valores directamente en el archivo o en el entorno:

<Tabs>
  <Tab title="config.toml">
    ```toml config.toml theme={null}
    [search]
    engine = "exa"        # obligatorio
    max_results = 5       # opcional, 1-20
    timeout_secs = 15     # opcional

    [search.exa]
    api_key = "your-exa-api-key"   # obligatorio
    ```
  </Tab>

  <Tab title="Entorno">
    ```bash theme={null}
    OPENHUMAN_SEARCH_ENGINE=exa
    EXA_API_KEY=your-exa-api-key
    ```

    <Note>
      Tanto `EXA_API_KEY` como `OPENHUMAN_EXA_API_KEY` anulan `search.exa.api_key`. Si ambas están definidas, `OPENHUMAN_EXA_API_KEY` tiene prioridad.
    </Note>
  </Tab>
</Tabs>

<div id="tools-the-agent-gets">
  ### Herramientas que recibe el agente
</div>

| Herramienta        | Devuelve                                                                         |
| ------------------ | -------------------------------------------------------------------------------- |
| `web_search_tool`  | Búsqueda web, proporcionada por Exa.                                             |
| `exa_search`       | Páginas clasificadas con títulos, URLs, fechas de publicación y texto opcional.  |
| `exa_get_contents` | Contenido completo de las URLs indicadas, con resúmenes o highlights opcionales. |

El agente configura los [parámetros de búsqueda](/es/docs/search/quickstart) de Exa en cada llamada, por lo que basta con instrucciones sencillas para controlar el modo de búsqueda, los dominios, las fechas y las categorías.

<div id="troubleshooting">
  ## Solución de problemas
</div>

<AccordionGroup>
  <Accordion title="Exa Search no disponible: no hay ninguna API key configurada">
    OpenHuman no encontró ninguna key en el panel **Search engine**, en las variables `EXA_API_KEY` y `OPENHUMAN_EXA_API_KEY` ni en `search.exa.api_key`. Configúrala en alguno de esos lugares y reinicia OpenHuman si editaste `config.toml` mientras estaba en ejecución.
  </Accordion>

  <Accordion title="Exa rechazó la API key configurada (HTTP 401)">
    La key no es válida o fue revocada. Verifícala en el [panel de Exa](https://dashboard.exa.ai/api-keys), luego pulsa **Clear** para borrar la key almacenada y guarda la correcta. Ten cuidado con los espacios en blanco al pegarla.
  </Accordion>

  <Accordion title="Exa devolvió un estado distinto de 2xx">
    `429` indica un límite de tasa o una cuota agotada: revisa el uso en el [panel](https://dashboard.exa.ai). Para los `5xx`, reintenta y luego consulta los [códigos de error](/es/docs/admin/error-codes).
  </Accordion>

  <Accordion title="OpenHuman Managed no aparece en la lista de motores">
    Las sesiones exclusivamente locales no pueden usar la búsqueda gestionada. Configura el proveedor de Exa con tu propia key.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Recursos
</div>

<Columns cols={3}>
  <Card title="Documentación de búsqueda web de OpenHuman" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search" cta="Abrir guía" arrow="true">
    Consulta la referencia oficial de OpenHuman sobre sus motores de búsqueda.
  </Card>

  <Card title="Search API de Exa" icon="search" href="/es/docs/search/quickstart" cta="Leer guía" arrow="true">
    Conoce los modos de búsqueda, los filtros y las opciones de contenido que hay detrás de las herramientas de Exa.
  </Card>

  <Card title="Buenas prácticas de búsqueda" icon="sparkles" href="/es/docs/search/best-practices" cta="Leer guía" arrow="true">
    Saca mejores resultados de cada query.
  </Card>
</Columns>