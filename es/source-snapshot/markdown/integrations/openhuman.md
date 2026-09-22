> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# OpenHuman {#openhuman}

> Dale al agente de OpenHuman búsqueda web en vivo con Exa, ya sea gestionada o con tu propia API key de Exa.

[OpenHuman](https://tinyhumans.gitbook.io/openhuman) de TinyHumans es un asistente de IA de escritorio con una herramienta nativa de búsqueda web que el agente llama por su cuenta. Exa es el proveedor de búsqueda detrás de esa herramienta.

| Enfoque               | Configuración           | Se ejecuta en                                                           |
| --------------------- | ----------------------- | ----------------------------------------------------------------------- |
| **OpenHuman Managed** | Ninguna                 | El backend de OpenHuman, con tecnología de Exa. Sin API key.            |
| **Exa provider**      | Pega una API key de Exa | Tu máquina, directo a `https://api.exa.ai` con tu propia cuenta de Exa. |

## OpenHuman Managed {#openhuman-managed}

La búsqueda gestionada es la opción predeterminada. Elige **Simple** durante la configuración inicial y el agente podrá buscar en la web de inmediato.

<Frame caption="Elige Simple durante la configuración inicial para usar la búsqueda gestionada con tecnología de Exa">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="Configuración inicial de OpenHuman preguntando cómo ejecutar OpenHuman, con la opción Simple seleccionada" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **La opción gestionada es la forma más rápida de obtener resultados de Exa.** No hay ninguna key que crear, almacenar ni rotar, no se guardan credenciales en tu máquina y la búsqueda se factura en tu suscripción de OpenHuman.
</Tip>

## Exa provider {#exa-provider}

Configura Exa directamente para ejecutar búsquedas con tu propia cuenta de Exa y proporcionar al agente las herramientas de búsqueda y de contenido de página de Exa.

### Obtén tu API key de Exa {#get-your-exa-api-key}

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

### Añadir Exa en OpenHuman {#add-exa-in-openhuman}

1. Abre **Connections** y luego selecciona **Search engine** dentro de **API keys**.

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="La página Connections de OpenHuman con Search engine seleccionado dentro de API keys, mostrando la lista de motores de búsqueda con OpenHuman Managed activo" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. Selecciona **Exa**.

<Frame caption="Exa seleccionado, a la espera de una key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="La opción de motor Exa seleccionada en el panel Search engine de OpenHuman, mostrando la etiqueta Needs API key" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. Pega tu key en **Exa API key** y selecciona **Save**.

<Frame caption="Guarda la API key de Exa">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="El campo Exa API key en OpenHuman con una key introducida y el botón Save visible" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="Exa configurado como motor de búsqueda activo">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="El panel Search engine de OpenHuman con Exa seleccionado y marcado como Configured" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

### Configuración {#configuration}

El panel escribe en el `config.toml` de OpenHuman. Como alternativa, define los mismos valores en el archivo o en el entorno:

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

### Herramientas que recibe el agente {#tools-the-agent-gets}

| Herramienta        | Devuelve                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `web_search_tool`  | Búsqueda web, provista por Exa.                                                            |
| `exa_search`       | Páginas ordenadas por relevancia con títulos, URL, fechas de publicación y texto opcional. |
| `exa_get_contents` | Contenido completo de las URL indicadas, con resúmenes o highlights opcionales.            |

El agente define los [parámetros de búsqueda](/es/docs/search/quickstart) de Exa en cada llamada, por lo que basta con instrucciones sencillas para orientar el modo de búsqueda, los dominios, las fechas y las categorías.

## Solución de problemas {#troubleshooting}

<AccordionGroup>
  <Accordion title="Exa Search no disponible: no hay ninguna API key configurada">
    OpenHuman no encontró ninguna key en el panel **Search engine**, ni en las variables `EXA_API_KEY` y `OPENHUMAN_EXA_API_KEY`, ni en `search.exa.api_key`. Configúrala en alguno de ellos y reinicia OpenHuman si editaste `config.toml` mientras estaba en ejecución.
  </Accordion>

  <Accordion title="Exa rechazó la API key configurada (HTTP 401)">
    La key no es válida o fue revocada. Verifícala en el [Exa dashboard](https://dashboard.exa.ai/api-keys), luego usa **Clear** para eliminar la key almacenada y guarda la correcta. Ten cuidado con los espacios en blanco al pegarla.
  </Accordion>

  <Accordion title="Exa devolvió un estado distinto de 2xx">
    `429` indica un límite de tasa o una cuota agotada: revisa el uso en el [panel](https://dashboard.exa.ai). Para `5xx`, reintenta y luego consulta los [códigos de error](/es/docs/admin/error-codes).
  </Accordion>

  <Accordion title="OpenHuman Managed no aparece en la lista de motores">
    Las sesiones solo locales no pueden usar la búsqueda gestionada. Configura el Exa provider con tu propia key.
  </Accordion>
</AccordionGroup>

## Recursos {#resources}

<Columns cols={3}>
  <Card title="Documentación de búsqueda web de OpenHuman" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search" cta="Abrir guía" arrow="true">
    Consulta la propia documentación de referencia de OpenHuman sobre sus motores de búsqueda.
  </Card>

  <Card title="Exa Search API" icon="search" href="/es/docs/search/quickstart" cta="Leer guía" arrow="true">
    Conoce los modos de búsqueda, los filtros y las opciones de contenido detrás de las herramientas de Exa.
  </Card>

  <Card title="Buenas prácticas de búsqueda" icon="sparkles" href="/es/docs/search/best-practices" cta="Leer guía" arrow="true">
    Obtén mejores resultados en cada consulta.
  </Card>
</Columns>