> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="truefoundry">
  # TrueFoundry
</div>

> Conecta Exa al MCP Gateway de TrueFoundry para obtener controles de acceso centralizados, gestión de herramientas y monitoreo del uso.

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) es una capa de proxy de nivel empresarial entre tus aplicaciones y los proveedores de LLM o los MCP servers. Ofrece acceso unificado a más de 1000 LLM con observabilidad y gobernanza centralizadas.

TrueFoundry incluye Exa como server remoto oficial en su [MCP Gateway](https://www.truefoundry.com/mcp-gateway). Conecta el Exa MCP server para darle a tus equipos un único endpoint gestionado para búsqueda web, obtención de contenido e investigación agéntica.

<Frame caption="Exa en el catálogo oficial de MCP servers remotos de TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="El server de Exa en el catálogo oficial de MCP remotos de TrueFoundry" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

<div id="add-exa-to-truefoundry">
  ## Añadir Exa a TrueFoundry
</div>

1. Abre **MCP Servers** en el sidebar de TrueFoundry y selecciona **Add new MCP Server**.
2. Selecciona **Connect Official Remote MCP Servers**.

<Frame caption="Elige el catálogo oficial de remote MCP servers">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="Selector Add MCP Server de TrueFoundry con Connect Official Remote MCP Servers seleccionado" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. Busca **Exa** en el catálogo y selecciona **+ Add**.
4. Confirma los datos precargados del server:

| Campo          | Valor                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Name           | `exa`                                                                                                                          |
| Description    | Motor de búsqueda hecho para IAs por Exa                                                                                       |
| URL            | `https://mcp.exa.ai/mcp`                                                                                                       |
| Authentication | Opcional (El MCP Server funciona sin autenticación. Solo necesitas una API key de Exa si alcanzas el límite de tasa gratuito.) |

5. Añade los usuarios o equipos que deban gestionar o usar el server. Deja **Auth Data** desactivado y luego selecciona **Update MCP Server**.

<Frame caption="Configura el server de Exa y sus colaboradores">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Formulario de registro del Exa MCP server con su nombre, URL, colaboradores y configuración de autenticación" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  Abre la pestaña **Herramientas** y confirma que las herramientas de búsqueda, obtención de contenido e investigación agéntica de Exa están disponibles.
</Check>

<div id="configure-the-exa-server">
  ## Configurar el server de Exa
</div>

La URL prellenada expone el conjunto de herramientas predeterminado de Exa. Cámbiala solo si necesitas restringir las herramientas disponibles o usar tu propia API key.

<div id="choose-which-tools-are-available">
  ### Elige qué herramientas están disponibles
</div>

Pasa una lista de nombres de herramientas separados por comas en el parámetro de consulta `tools`:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

Puedes introducir la URL en el formulario del server o usar **Apply using YAML**:

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
  ### Usa tu API key de Exa para superar el límite de tasa gratuito
</div>

Si alcanzas el límite de tasa gratuito, añade tu API key de Exa a la URL del server:

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

<div id="connect-an-mcp-client">
  ## Conecta un MCP cliente
</div>

Abre la pestaña **How To Use** del server de Exa y selecciona tu cliente. TrueFoundry genera el endpoint específico del tenant y la configuración lista para pegar en Cursor, Claude Code, VS Code, Windsurf, Codex y otros MCP clientes.

<Frame caption="Copia la configuración para tu MCP cliente">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="Instrucciones de configuración específicas para cada cliente de TrueFoundry para el Exa MCP server" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

<div id="test-a-tool">
  ## Probar una herramienta
</div>

Selecciona **Try** junto a una herramienta de Exa, introduce sus valores de entrada y luego selecciona **Execute Tool**. El playground muestra la respuesta JSON para que puedas verificar la herramienta antes de usarla en un agente.

<Frame caption="Ejecutar una herramienta de Exa en el playground de TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Probando una herramienta de Exa en el playground de herramientas de TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

<div id="manage-and-monitor-tools">
  ## Gestionar y monitorear herramientas
</div>

* Activa o desactiva herramientas individuales para controlar qué pueden llamar los MCP clientes
* Usa **Métricas de herramientas** para revisar el tráfico, la latencia y los errores
* Exporta las trazas de invocación a tu stack de observabilidad mediante OpenTelemetry

<Frame caption="Gestiona las herramientas de Exa expuestas a los MCP clientes">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="Herramientas de Exa disponibles desde el MCP server de TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

<div id="resources">
  ## Recursos
</div>

<Columns cols={3}>
  <Card title="Guía de configuración de TrueFoundry" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="Abrir guía" arrow="true">
    Consulta la guía de TrueFoundry sobre su Exa MCP server.
  </Card>

  <Card title="Documentación de Exa MCP" icon="search" href="/es/docs/get-started/exa-mcp" cta="Abrir guía" arrow="true">
    Revisa las herramientas, la configuración y los ejemplos de uso de Exa.
  </Card>

  <Card title="Exa MCP Server" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Ver código fuente" arrow="true">
    Consulta el código fuente del server y sus versiones en GitHub.
  </Card>
</Columns>