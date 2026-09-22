> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="fx-by-vercel-labs">
  # fx de Vercel Labs
</div>

> Añade Exa web search a fx, el agente de programación nativo de Vercel Labs, con el Exa MCP server alojado.

[fx](https://fx.sh) es un agente de programación nativo y una CLI de Vercel Labs, y además un MCP client. Añade el MCP server alojado de Exa para dotarlo de búsqueda web en tiempo real y lectura de páginas.

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/vercel/fx/install-exa.gif?s=2e331148abdf5bdf083e6f651e3b8b75" alt="Instalación de fx, incorporación del Exa MCP server con /mcp add y ejecución de una búsqueda web en tiempo real con Exa" style={{width: "100%", height: "auto"}} width="800" height="393" data-path="images/integrations/vercel/fx/install-exa.gif" />
</Frame>

<div id="installation">
  ## Instalación
</div>

<Steps>
  <Step title="Instalar fx">
    ```bash theme={null}
    curl -fsSL https://fx.sh/setup.sh | bash
    ```

    Luego inicia sesión con `fx login`. Consulta la [documentación de fx](https://fx.sh/docs) para ver las opciones de proveedores.
  </Step>

  <Step title="Añadir Exa">
    Inicia fx ejecutando `fx` y luego añade el Exa MCP server desde el shell interactivo:

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    fx guarda el server en `~/.fx/mcp.json` y recarga MCP.
  </Step>

  <Step title="Verificar la conexión">
    ```text theme={null}
    /mcp list
    ```
  </Step>
</Steps>

<div id="configure-by-hand">
  ## Configuración manual
</div>

fx lee los MCP servers únicamente desde `~/.fx/mcp.json`, por lo que también puedes añadir Exa ahí directamente:

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

Ejecuta `/mcp reload` para aplicar el cambio sin reiniciar fx.

El plan gratuito cubre un uso ocasional. Para ampliar los límites de tasa, crea una API key y añádela a la configuración:

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas empiezan con créditos gratuitos.
</Card>

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp",
      "header_env": {
        "x-api-key": "EXA_API_KEY"
      }
    }
  }
}
```

`header_env` asigna el nombre de un encabezado a una variable de entorno, de modo que la key no quede en el archivo de configuración.

<div id="tool-discovery">
  ## Descubrimiento de herramientas
</div>

fx descubre las herramientas MCP de forma diferida: las herramientas del server no ocupan el contexto del modelo hasta que un turno las necesita, por lo que agregar Exa no tiene costo en los turnos que no requieren buscar en la web.

<Card title="Exa MCP" icon="plug" href="/es/docs/get-started/exa-mcp" cta="Abrir guía" arrow="true">
  Consulta las herramientas disponibles, las opciones de configuración y otros clientes.
</Card>