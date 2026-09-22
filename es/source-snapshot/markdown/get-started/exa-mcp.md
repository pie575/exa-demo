> ## Índice de documentación {#documentation-index}
>
> Obtén el índice completo de documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Exa MCP {#exa-mcp}

> Conecta ChatGPT, Codex, Claude, Grok, Cursor y cualquier otro MCP cliente con las herramientas de búsqueda web, obtención de páginas, Exa Agent y Exa Connect de Exa.

Usa Exa MCP para potenciar la búsqueda web integrada de ChatGPT, Claude y las herramientas compatibles con MCP con las capacidades de búsqueda de Exa, como la búsqueda web, la búsqueda de código, [Exa Agent](/es/docs/agent/quickstart) y [Exa Connect](/es/docs/agent/connect/overview).

Exa ofrece un server alojado que funciona en cualquier MCP cliente:

```text theme={null}
https://mcp.exa.ai/mcp
```

No se requiere ninguna API key para empezar. Exa MCP es de código abierto y está disponible en [GitHub](https://github.com/exa-labs/exa-mcp-server).

## Instalación {#install}

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT y Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa es un plugin oficial en el directorio de plugins de OpenAI, que incluye el MCP server alojado más las skills `search` y `exa-agent` de Exa.

      <Steps>
        <Step title="Abre el plugin">
          Ve a [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Se abrirá **Exa** en el directorio de plugins de OpenAI, que es el mismo directorio para ChatGPT y para Codex.
        </Step>

        <Step title="Instálalo">
          Selecciona el botón de más para instalarlo. Inicia sesión en Exa cuando se te solicite, ya sea durante la instalación o la primera vez que Codex o ChatGPT lo use.

          <Frame caption="Abrir Plugins en Codex, añadir Exa y autorizar el acceso">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Abrir Plugins en Codex, ver el plugin de Exa y autorizar el acceso" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="Inicia una nueva sesión">
          Las skills se cargan en los chats y sesiones de CLI que inicies después de la instalación, así que abre una nueva y pide algo que requiera la web.
        </Step>
      </Steps>

      Eso es todo. El plugin incluye tanto la integración MCP de Exa como las skills, por lo que no hace falta configurar MCP ni las skills por separado.

      Consulta [Exa en Codex y ChatGPT](/es/docs/integrations/chatgpt-codex) para ver la guía completa de configuración y flujo de trabajo.
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
### Claude Code CLI {#claude-code-cli}

      <Steps>
        <Step title="Instala el plugin">
          Instala Exa desde la terminal:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          También puedes escribir `/plugin` en Claude Code, buscar **Exa** e instalarlo.
        </Step>

        <Step title="Usa Exa">
          Inicia una nueva sesión de Claude Code y pide algo que requiera acceso a la web.
        </Step>
      </Steps>

### Desktop, Web y Cowork {#desktop-web-cowork}

      Claude Desktop, Web y Cowork usan el conector oficial de Exa.

      <Steps>
        <Step title="Abre el directorio de conectores">
          Selecciona el botón de más en un chat nuevo, elige **Add connector** y busca **Exa**.
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

      Consulta [Exa en Claude Code, Web y Desktop](/es/docs/integrations/claude-web-desktop) para ver la guía completa de configuración y flujo de trabajo.

      Los administradores de Claude Team y Enterprise pueden, en su lugar, aprovisionar el conector para todo el equipo a través de su identity provider: consulta [Enterprise Managed Auth](/es/docs/admin/mcp-enterprise-managed-auth).
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa está disponible en el marketplace de [Grok Build](https://docs.x.ai/build/overview).

      <Steps>
        <Step title="Abre el marketplace">
          En Grok Build, ejecuta `/marketplace`.
        </Step>

        <Step title="Instala Exa">
          Busca **exa** en la lista y pulsa `i`.
        </Step>

        <Step title="Inicia sesión">
          Ejecuta `/mcp`, selecciona **exa** y pulsa `i` para iniciar sesión en tu cuenta de Exa desde el navegador.
        </Step>
      </Steps>

      Las cuentas nuevas reciben créditos gratuitos al registrarse.
    </Tab>

    <Tab title="Cursor" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      Instala Exa MCP desde el [marketplace de Cursor](https://cursor.com/marketplace/exa) o agrégalo a `~/.cursor/mcp.json`:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="VS Code" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/vscode.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9828a7b963d47467df217a38c716fea2" width="24" height="24" data-path="images/mcp-clients/vscode.svg">
      Usa la [instalación con un clic](https://vscode.dev/redirect/mcp/install?name=exa\&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D) o agrégalo a `.vscode/mcp.json` en tu proyecto:

      ```json theme={null}
      {
        "servers": {
          "exa": {
            "type": "http",
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="Otros clientes" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/other-clients.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=187e423022b8fc3ed950a967a10ff700" width="24" height="24" data-path="images/mcp-clients/other-clients.svg">
      La mayoría de los clientes utilizan la estructura estándar `mcpServers`:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```

      La ubicación de la configuración y el nombre de la clave de URL varían según el cliente:

      | Cliente                                      | Dónde añadirlo                                                                                           | Clave de URL             |
      | -------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------ |
      | [fx by Vercel](/es/docs/integrations/vercel/fx) | `/mcp add --transport http exa https://mcp.exa.ai/mcp` en el shell de fx (se guarda en `~/.fx/mcp.json`) | `url`                    |
      | OpenCode                                     | `opencode.json` (dentro de `mcp`, con `"type": "remote"`)                                                | `url`                    |
      | Kiro                                         | `~/.kiro/settings/mcp.json` (dentro de `mcpServers`)                                                     | `url`                    |
      | Windsurf                                     | `~/.codeium/windsurf/mcp_config.json` (dentro de `mcpServers`)                                           | `serverUrl`              |
      | Google Antigravity                           | Panel del agente → Manage MCP Servers → View Raw config (dentro de `mcpServers`)                         | `serverUrl`              |
      | Zed                                          | `settings.json` de Zed (dentro de `context_servers`)                                                     | `url`                    |
      | Gemini CLI                                   | `~/.gemini/settings.json` (dentro de `mcpServers`)                                                       | `httpUrl`                |
      | Warp                                         | Settings → MCP Servers → Add MCP Server (`exa` en el nivel superior)                                     | `url`                    |
      | v0 by Vercel                                 | Prompt Tools → Add MCP                                                                                   | pega la URL directamente |

      Si tu cliente no admite remote MCP servers, usa el puente `mcp-remote`:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
          }
        }
      }
      ```

      O ejecuta el [paquete npm](https://www.npmjs.com/package/exa-mcp-server) local con tu [API key de Exa](https://dashboard.exa.ai/api-keys):

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "exa-mcp-server"],
            "env": {
              "EXA_API_KEY": "your_api_key"
            }
          }
        }
      }
      ```
    </Tab>
  </Tabs>
</div>

## Autenticación {#authentication}

Exa MCP admite tres modos de autenticación:

| Modo    | Úsalo para                                                                   | Configuración                                                                                                                    |
| ------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Sin key | Uso gratuito con límite de tasa, sin inicio de sesión ni API key             | Conéctate a `https://mcp.exa.ai/mcp`                                                                                             |
| OAuth   | Clientes interactivos, instalaciones desde el marketplace, uso en producción | Conéctate a `https://mcp.exa.ai/mcp?login` para iniciar sesión en Exa desde el navegador. El uso se atribuye a tu equipo de Exa. |
| API key | Clientes sin MCP OAuth                                                       | Conéctate a `https://mcp.exa.ai/mcp` con el encabezado `x-api-key` establecido con tu API key                                    |

### Iniciar sesión con OAuth {#sign-in-with-oauth}

ChatGPT, Claude y otras instalaciones desde el marketplace te piden iniciar sesión cuando es necesario. En cualquier cliente compatible con MCP OAuth, puedes solicitar el mismo flujo conectándote a:

```text theme={null}
https://mcp.exa.ai/mcp?login
```

Tu cliente descubre el authorization server de Exa, abre el sign-in en el navegador y gestiona el acceso.

### Usar una API key {#use-an-api-key}

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

Agrega el encabezado `x-api-key` a la configuración del MCP server:

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

## Herramientas disponibles {#available-tools}

| Herramienta               | Disponibilidad                 | Úsala para                                                                                   |
| ------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `web_search_exa`          | Habilitada por defecto         | Buscar en la web y devolver contenido relevante y listo para usar                            |
| `web_fetch_exa`           | Habilitada por defecto         | Leer contenido limpio de una o varias URL conocidas                                          |
| `web_search_advanced_exa` | Disponible si se activa        | Configurar la búsqueda web con filtros y controles avanzados                                 |
| `agent_run`               | Disponible con OAuth o API key | Ejecutar investigación de varios pasos, creación de listas, enrichment y salida estructurada |

Usa el parámetro de URL `tools` para elegir qué herramientas ve tu cliente. Por ejemplo, para habilitarlas todas:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  Una lista explícita de `tools` sustituye a los valores predeterminados, así que incluye todas las herramientas que quieras habilitar, incluidas la búsqueda web y fetch.
</Tip>

## Exa Agent {#exa-agent}

Usa [Exa Agent](/es/docs/agent/quickstart) para investigaciones que requieren más de una búsqueda: por ejemplo, crear una lista, evaluar cada item según criteria o devolver resultados estructurados.

Los runs del agente se facturan según el uso, por lo que `agent_run` requiere OAuth o una API key. Esta URL inicia OAuth y añade Agent junto con las herramientas por defecto:

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

Si usas una API key, omite `login` y añade la key como se describe en [Autenticación](#authentication).

<Steps>
  <Step title="Describe lo que necesitas">
    Pide la investigación en lenguaje natural. Tu asistente pasa la solicitud a `agent_run` con una `query`, y Exa Agent determina qué buscar, lee las fuentes y contrasta lo que encuentra con la solicitud.

    Pídele a tu Agent que proporcione un `outputSchema` solo cuando tu aplicación necesite los hallazgos en un formato JSON consistente. Puedes compartir uno con tu asistente en el prompt de sistema o pedirle que lo genere por ti.
  </Step>

  <Step title="Obtén el resultado">
    Cuando la investigación termina, la llamada a herramienta entrega a tu asistente el paquete completo de investigación:

    * Los hallazgos redactados
    * Las fuentes que los respaldan
    * JSON validado si proporcionaste `outputSchema`
    * Uso y costo

    Tu asistente redacta su respuesta a partir de este paquete, así que indícale qué quieres hacer con el output. Puedes pedirle que resuma los hallazgos, los compare, los guarde en un archivo o cualquier otra cosa.
  </Step>

  <Step title="Continúa si necesita más tiempo">
    Una investigación que se prolonga más allá de una sola llamada MCP no falla: la herramienta informa `status: "running"` junto con un `id` mientras el run continúa en Exa. Tu asistente vuelve a llamar a `agent_run` con ese `id` como `runId` para retomar el mismo run.
  </Step>
</Steps>

<Accordion title="Controles opcionales" icon="sliders-horizontal">
  | Campo             | Úsalo para                                                                    |
  | ----------------- | ----------------------------------------------------------------------------- |
  | `systemPrompt`    | Dar al Agent indicaciones adicionales para investigar o evaluar resultados    |
  | `outputSchema`    | Devolver la respuesta en un formato JSON específico                           |
  | `input.data`      | Enriquecer filas o entidades que ya tienes                                    |
  | `input.exclusion` | Omitir resultados que ya conoces                                              |
  | `dataSources`     | Añadir hasta cinco proveedores de [Exa Connect](/es/docs/agent/connect/overview) |
  | `previousRunId`   | Partir de una investigación ya completada para una nueva solicitud            |
  | `effort`          | Elegir cuánta investigación debe hacer el Agent                               |
</Accordion>

<Tip>
  Usa `runId` para seguir esperando el trabajo en curso. Usa `previousRunId` para hacer un nuevo follow-up basado en trabajo ya finalizado.
</Tip>

Consulta la [guía de Exa Agent](/es/docs/agent/quickstart) para conocer patrones de esquemas de salida, modos de effort, fuentes de datos y precios.

## Búsqueda avanzada {#advanced-search}

Usa `web_search_advanced_exa` cuando la solicitud requiera filtros explícitos de categoría o dominio, rangos de fechas, restricciones de texto, segmentación geográfica, expansión de consultas, resúmenes, highlights, control de frescura o rastreo de subpáginas. Para búsquedas comunes, mantén `web_search_exa`: ofrece al modelo una superficie de herramientas más reducida y requiere menos configuración.

Advanced Search no requiere autenticación, aunque las conexiones autenticadas usan tu propio plan y tus límites de tasa. Actívala junto con las herramientas predeterminadas con:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

La herramienta MCP expone los controles habituales de la [Search API](/es/docs/reference/search) como campos adaptados a herramientas, como `includeDomains`, `startPublishedDate`, `enableHighlights` y `maxAgeHours`. Consulta el esquema de la herramienta en tu cliente para conocer los nombres exactos de los campos.

## Solución de problemas {#troubleshooting}

<AccordionGroup>
  <Accordion title="Error de límite de tasa (429)">
    La conexión está usando los límites de tasa gratuitos de Exa. Inicia sesión con OAuth o añade tu propia API key y vuelve a conectarte para que las solicitudes usen el plan y los límites de tu equipo.

    <Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas comienzan con créditos gratuitos.
    </Card>
  </Accordion>

  <Accordion title="Agent no aparece o pide autenticación">
    `agent_run` no está habilitado de forma predeterminada y no puede usar los límites de tasa gratuitos. Añádelo al parámetro `tools` de la URL y luego conéctate con `?login` o configura una API key. Consulta [Exa Agent](#exa-agent) para ver la URL completa.
  </Accordion>

  <Accordion title="El inicio de sesión con OAuth no se abre">
    Confirma que tu cliente admite MCP OAuth y conéctate a `https://mcp.exa.ai/mcp?login`. Reinicia el cliente después de cambiar la URL. Si el cliente no puede completar MCP OAuth, usa una API key en su lugar.
  </Accordion>

  <Accordion title="Las herramientas no aparecen">
    Un parámetro `tools` explícito reemplaza la lista de herramientas predeterminada. Comprueba que todas las herramientas que quieras estén incluidas en la URL y luego reinicia tu MCP cliente para que vuelva a obtener la lista de herramientas.
  </Accordion>

  <Accordion title="Claude Desktop no se conecta">
    Usa el conector integrado: selecciona **+** (o **Add connectors**) → pestaña **Connectors** → busca **Exa** → selecciona **+**.
  </Accordion>

  <Accordion title="No se encuentra el archivo de configuración">
    Ubicaciones habituales de la configuración:

    * Cursor: `~/.cursor/mcp.json`
    * fx: `~/.fx/mcp.json`
    * VS Code: `.vscode/mcp.json` (en la raíz del proyecto)
    * Claude Desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
    * Claude Desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
  </Accordion>
</AccordionGroup>

## Recursos {#resources}

<Columns cols={2}>
  <Card title="GitHub" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Ver código fuente" arrow="true">
    Código fuente de Exa MCP.
  </Card>

  <Card title="npm" icon="package" href="https://www.npmjs.com/package/exa-mcp-server" cta="Abrir paquete" arrow="true">
    Ejecuta Exa MCP en local con el paquete de npm.
  </Card>

  <Card title="Skills de agente" icon="wrench" href="/es/docs/get-started/agent-skills/overview" cta="Explorar skills" arrow="true">
    Skills portables que se integran con Exa MCP.
  </Card>

  <Card title="Exa en Codex y ChatGPT" icon="messages-square" href="/es/docs/integrations/chatgpt-codex" cta="Abrir guía" arrow="true">
    Guía completa de configuración y flujo de trabajo del plugin de Exa.
  </Card>
</Columns>