> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="exa-in-codex-and-chatgpt">
  # Exa en Codex y ChatGPT
</div>

> Busca en la web, lee cualquier página e investiga con Exa directamente desde Codex y ChatGPT.

Instala el plugin de Exa una sola vez para dar a Codex y ChatGPT acceso a la web en tiempo real mediante Exa. Busca información actualizada, consulta las fuentes que importan y realiza investigaciones más profundas sin salir de tu conversación ni de tu sesión de programación.

<div id="install-exa">
  ## Instalar Exa
</div>

<Steps>
  <Step title="Abre el plugin">
    Ve a [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Se abrirá **Exa** en el directorio de plugins de OpenAI, que es el mismo tanto para ChatGPT como para Codex.
  </Step>

  <Step title="Instálalo">
    Pulsa el botón de más para instalarlo. Inicia sesión en Exa cuando se te solicite, ya sea durante la instalación o la primera vez que Codex o ChatGPT lo use.

    <Frame caption="Abrir Plugins en Codex, agregar Exa y autorizar el acceso">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Abrir Plugins en Codex, ver el plugin de Exa y autorizar el acceso" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="Inicia una nueva sesión">
    Las skills se cargan en los chats y las sesiones de CLI que inicies después de la instalación, así que abre una nueva y pide algo que requiera la web.
  </Step>
</Steps>

Eso es todo. El plugin incluye tanto la integración MCP de Exa como las skills, así que no hace falta configurar MCP ni las skills por separado.

<div id="build-with-whats-on-the-web-right-now">
  ## Desarrolla con lo que hay en la web ahora mismo
</div>

Las bibliotecas, APIs y herramientas con las que desarrollas cambian a diario. Con Exa instalado, Codex puede buscar la documentación, issues, changelogs y ejemplos reales más recientes mientras trabaja.

Desde tu propio repositorio:

```text theme={null}
Estamos en Tailwind v3. Busca la guía de actualización a Tailwind v4, léela
y luego migra este proyecto a la v4.
```

Codex puede buscar con Exa, leer las fuentes relevantes y usar lo que encuentre para hacer el cambio en tu base de código.

Lo mismo aplica siempre que la respuesta pueda estar en algún lugar fuera de tu repositorio:

* «Busca este error en los issues y el changelog de `tokio-tungstenite` antes de intentar corregirlo.»
* «Encuentra ejemplos reales de advisory locks de Postgres en Rust y recomienda el patrón que mejor encaje con este worker pool.»
* «Lee la documentación actual de webhooks de Stripe y contrasta nuestra implementación con ella.»
* «Busca la guía de migración más reciente de esta dependencia y luego actualízala.»

<div id="search-read-and-research">
  ## Buscar, leer e investigar
</div>

El plugin de Exa ofrece a Codex y ChatGPT tres formas de trabajar con la web.

<Columns cols={3}>
  <Card title="Buscar" icon="search">
    Busca en lenguaje natural y obtén el contenido de las mejores páginas, no una lista de enlaces.
  </Card>

  <Card title="Leer" icon="file-text">
    Lee la página que le indiques, ya sea documentación, un changelog, una incidencia o una entrada de blog.
  </Card>

  <Card title="Investigar" icon="compass">
    Resuelve una pregunta que requiere más de una búsqueda y respóndela con citas.
  </Card>
</Columns>

<div id="research-without-leaving-chatgpt">
  ## Investiga sin salir de ChatGPT
</div>

Exa también funciona en ChatGPT. Haz una pregunta que requiera información actualizada y usa Exa para buscar e investigar en la web desde la misma conversación.

```text theme={null}
Compara las ofertas gestionadas, las licencias y los precios de las principales
bases de datos vectoriales de código abierto. Usa fuentes primarias actuales y cítalas.
```

En lugar de depender únicamente de la información que ya está en el contexto, ChatGPT puede usar Exa para encontrar y leer las fuentes que la tarea requiera.

Úsalo para análisis de la competencia, investigación técnica, mapeo de mercados, investigación de empresas o cualquier otro caso en el que la respuesta esté repartida por la web.

<div id="mcp-skills-together">
  ## MCP + skills, juntos
</div>

Internamente, el plugin combina dos partes del stack de agentes de Exa.

[Exa MCP](/es/docs/get-started/exa-mcp) ofrece a Codex y ChatGPT herramientas para acceder a Exa. Es el nexo entre el agent y las capacidades de search e investigación de Exa.

Las [Exa skills](/es/docs/get-started/agent-skills/overview) aportan al agent instrucciones adicionales para aprovechar esas capacidades en flujos de trabajo útiles, como la investigación web y [Exa Agent](/es/docs/agent/quickstart).

No hace falta configurar ninguno de los dos por separado al instalar el plugin.

<div id="prefer-mcp-directly">
  ## ¿Prefieres usar MCP directamente?
</div>

El plugin es la forma recomendada de usar Exa con Codex y ChatGPT. Si estás configurando Codex manualmente o usas otro cliente MCP, puedes conectarte directamente al servidor MCP alojado de Exa:

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

Consulta [Exa MCP](/es/docs/get-started/exa-mcp) para conocer otros clientes, opciones de configuración y herramientas disponibles.

<Card title="Instala Exa para ChatGPT y Codex" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  Añade el plugin de Exa desde el marketplace de ChatGPT.
</Card>