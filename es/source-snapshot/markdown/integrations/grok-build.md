> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="grok-build">
  # Grok Build
</div>

> Usa la búsqueda web de Exa en Grok Build. Instala el plugin de Exa desde el marketplace de Grok Build e inicia sesión con tu cuenta de Exa.

Exa está disponible como plugin en el marketplace de [Grok Build](https://docs.x.ai/build/overview). Le aporta a Grok búsqueda web en tiempo real, lectura de páginas y una habilidad de investigación profunda.

<div id="installation">
  ## Instalación
</div>

<Steps>
  <Step title="Instala Grok Build">
    Instala la CLI de Grok (consulta la [documentación de Grok Build](https://docs.x.ai/build/overview) para más detalles):

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    Luego inicia sesión en tu cuenta de xAI:

    ```bash theme={null}
    grok login
    ```
  </Step>

  <Step title="Abre el marketplace">
    Inicia Grok Build ejecutando `grok` y luego abre el marketplace:

    ```text theme={null}
    /marketplace
    ```
  </Step>

  <Step title="Instala el plugin de Exa">
    Busca **exa** en la lista y pulsa `i` para instalarlo.
  </Step>

  <Step title="Inicia sesión en Exa">
    Abre la pestaña de servidores MCP con `/mcp`, selecciona **exa** y pulsa `i` para iniciar sesión. Se abrirá en tu navegador la página de inicio de sesión de Exa. Las cuentas nuevas reciben credits gratuitos al registrarse.
  </Step>
</Steps>

Cuando exa aparezca como **ready**, pregúntale a Grok cualquier cosa que requiera la web.

<div id="what-you-get">
  ## Qué incluye
</div>

* **web&#95;search&#95;exa**: búsqueda web en tiempo real. Admite consultas en lenguaje natural y filtros por categoría como noticias, empresas, personas, artículos de investigación y GitHub.
* **web&#95;fetch&#95;exa**: lee cualquier URL y devuelve el contenido de la página en markdown limpio.
* **exa-search skill**: una habilidad de investigación profunda. Pídele a Grok un análisis a fondo sobre un tema y ejecutará varias búsquedas, leerá las mejores fuentes y responderá con citas.

<div id="example-prompts">
  ## Ejemplos de prompts
</div>

* «Busca noticias recientes sobre xAI»
* «Lee [https://exa.ai](https://exa.ai) y haz un resumen»
* «Haz un análisis a fondo de los motores de inferencia de código abierto»