> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="truefoundry">
  # TrueFoundry
</div>

> Conecta Exa al MCP Gateway de TrueFoundry para obtener controles de acceso centralizados, gestión de herramientas y monitoreo de uso.

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) es una capa de proxy de nivel empresarial entre tus aplicaciones y los proveedores de LLM o servidores MCP. Ofrece acceso unificado a más de 1000 LLM con observabilidad y gobernanza centralizadas.

TrueFoundry incluye a Exa como servidor remoto oficial en su [MCP Gateway](https://www.truefoundry.com/mcp-gateway). Conecta el servidor MCP de Exa para ofrecer a tus equipos un único endpoint gestionado para búsqueda web, obtención de contenido e investigación agéntica.

<Frame caption="Exa en el catálogo oficial de servidores MCP remotos de TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="El servidor de Exa en el catálogo oficial de MCP remotos de TrueFoundry" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

<div id="add-exa-to-truefoundry">
  ## Añadir Exa a TrueFoundry
</div>

1. Abre **MCP Servers** en la barra lateral de TrueFoundry y selecciona **Add new MCP Server**.
2. Selecciona **Connect Official Remote MCP Servers**.

<Frame caption="Elige el catálogo oficial de servidores MCP remotos">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="Selector Add MCP Server de TrueFoundry con Connect Official Remote MCP Servers seleccionado" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. Busca **Exa** en el catálogo y selecciona **+ Add**.
4. Confirma los datos del servidor ya rellenados:

| Campo          | Valor                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Name           | `exa`                                                                                                                         |
| Description    | Search Engine made for AIs by Exa                                                                                             |
| URL            | `https://mcp.exa.ai/mcp`                                                                                                      |
| Authentication | Opcional (el servidor MCP funciona sin autenticación. Solo necesitas una Exa API key si alcanzas el límite de tasa gratuito). |

5. Añade los usuarios o equipos que deban gestionar o usar el servidor. Deja **Auth Data** desactivado y selecciona **Update MCP Server**.

<Frame caption="Configura el servidor de Exa y sus colaboradores">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Formulario de registro del servidor MCP de Exa con su nombre, URL, colaboradores y ajustes de autenticación" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  Abre la pestaña **Tools** y comprueba que estén disponibles las herramientas de búsqueda, obtención de contenido e investigación agéntica de Exa.
</Check>

<div id="configure-the-exa-server">
  ## Configura el servidor de Exa
</div>

La URL prellenada expone el conjunto de herramientas predeterminado de Exa. Cámbiala solo si necesitas restringir las herramientas disponibles o usar tu propia API key.

<div id="choose-which-tools-are-available">
  ### Elige qué herramientas están disponibles
</div>

Pasa una lista de nombres de herramientas separados por comas en el parámetro de query `tools`:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

Puedes introducir la URL en el formulario del servidor o usar **Apply using YAML**:

```yaml theme={null}
url: >-
  https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
name: exa
type: mcp-server/remote
description: Search Engine made for AIs by Exa
collaborators:
  - role_id: mcp-server-manager
    subject: user:you@your-company.com
```

<Tip>
  Puedes consultar los nombres de las herramientas disponibles en la [documentación de Exa MCP](/es/docs/get-started/exa-mcp).
</Tip>

<div id="use-your-exa-api-key-to-bypass-the-free-rate-limit">
  ### Usa tu Exa API key para superar el límite de tasa gratuito
</div>

Si alcanzas el límite de tasa gratuito, añade tu Exa API key a la URL del servidor:

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el dashboard. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

<div id="connect-an-mcp-client">
  ## Conecta un cliente MCP
</div>

Abre la pestaña **How To Use** del servidor de Exa y selecciona tu cliente. TrueFoundry genera el endpoint específico del tenant y la configuración lista para pegar en Cursor, Claude Code, VS Code, Windsurf, Codex y otros clientes MCP.

<Frame caption="Copia la configuración de tu cliente MCP">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="Instrucciones de configuración de TrueFoundry específicas para cada cliente del servidor MCP de Exa" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

<div id="test-a-tool">
  ## Probar una herramienta
</div>

Selecciona **Try** junto a una herramienta de Exa, introduce sus entradas y luego selecciona **Execute Tool**. El playground muestra la respuesta JSON para que puedas verificar la herramienta antes de usarla en un agente.

<Frame caption="Ejecutar una herramienta de Exa en el playground de TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Probar una herramienta de Exa en el playground de herramientas de TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

<div id="manage-and-monitor-tools">
  ## Gestionar y monitorizar herramientas
</div>

* Activa o desactiva herramientas individuales para controlar qué pueden invocar los clientes MCP
* Usa **Tool Metrics** para revisar el tráfico, la latencia y los errores
* Exporta las trazas de invocación a tu stack de observabilidad mediante OpenTelemetry

<Frame caption="Gestiona las herramientas de Exa expuestas a los clientes MCP">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="Herramientas de Exa disponibles desde el servidor MCP de TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

<div id="resources">
  ## Recursos
</div>

<Columns cols={3}>
  <Card title="Guía de configuración de TrueFoundry" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="Abrir guía" arrow="true">
    Lee la guía de TrueFoundry sobre su servidor MCP de Exa.
  </Card>

  <Card title="Documentación de MCP de Exa" icon="search" href="/es/docs/get-started/exa-mcp" cta="Abrir guía" arrow="true">
    Consulta las herramientas, la configuración y los ejemplos de uso de Exa.
  </Card>

  <Card title="Servidor MCP de Exa" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Ver código fuente" arrow="true">
    Consulta el código fuente del servidor y sus versiones en GitHub.
  </Card>
</Columns>