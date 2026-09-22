> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Grok Build {#grok-build}

> Usa Exa web search en Grok Build. Instala el plugin de Exa desde el marketplace de Grok Build e inicia sesión con tu cuenta de Exa.

Exa está disponible como plugin en el marketplace de [Grok Build](https://docs.x.ai/build/overview). Le aporta a Grok búsqueda web en tiempo real, lectura de páginas y una habilidad de investigación profunda.

## Instalación {#installation}

<Steps>
  <Step title="Instalar Grok Build">
    Instala la CLI de Grok (consulta la [documentación de Grok Build](https://docs.x.ai/build/overview) para más detalles):

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    Luego inicia sesión en tu cuenta de xAI:

    ```bash theme={null}
    grok login
    ```
  </Step>

  <Step title="Abrir el marketplace">
    Inicia Grok Build ejecutando `grok` y luego abre el marketplace:

    ```text theme={null}
    /marketplace
    ```
  </Step>

  <Step title="Instalar el plugin de Exa">
    Busca **exa** en la lista y pulsa `i` para instalarlo.
  </Step>

  <Step title="Iniciar sesión en Exa">
    Abre la pestaña de MCP servers con `/mcp`, selecciona **exa** y pulsa `i` para iniciar sesión. Se abrirá en tu navegador la página de inicio de sesión de Exa. Las cuentas nuevas reciben créditos gratis al registrarse.
  </Step>
</Steps>

Cuando exa aparezca como **ready**, pregúntale a Grok cualquier cosa que requiera la web.

## Qué obtienes {#what-you-get}

* **web&#95;search&#95;exa**: búsqueda web en tiempo real. Admite consultas en lenguaje natural y filtros por categoría como noticias, empresas, personas, artículos de investigación y GitHub.
* **web&#95;fetch&#95;exa**: lee cualquier URL y devuelve el contenido de la página en markdown limpio.
* **exa-search skill**: una habilidad de investigación profunda. Pídele a Grok que profundice en un tema y ejecutará varias búsquedas, leerá las mejores fuentes y responderá con citas.

## Ejemplos de prompts {#example-prompts}

* «Busca noticias recientes sobre xAI»
* «Lee [https://exa.ai](https://exa.ai) y haz un resumen»
* «Haz un análisis a fondo de los motores de inferencia de código abierto»