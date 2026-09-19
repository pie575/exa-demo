> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="stripe-projects">
  # Stripe Projects
</div>

> Integra Exa desde tu terminal con la CLI de Stripe Projects.

[Stripe Projects](https://projects.dev) te permite, a ti y a tus agentes de programación, aprovisionar servicios de terceros desde la terminal, sin paneles ni copiar y pegar keys. Un solo comando crea una cuenta de Exa y sincroniza una API key en tu proyecto.

<div id="prerequisites">
  ## Requisitos previos
</div>

Instala la CLI de Stripe y el complemento Projects:

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

Para otras plataformas y la configuración completa de la CLI, consulta [Stripe Projects](https://projects.dev).

<div id="get-started">
  ## Primeros pasos
</div>

Desde el directorio de tu proyecto, inicializa un proyecto, añade Exa y descarga las credenciales:

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

Tu archivo `.env` ahora contiene una `EXA_API_KEY`. Los [SDKs de Exa](/es/docs/sdks/quickstart) y el [Quickstart](/es/docs/search/quickstart) leen esta variable automáticamente, por lo que tu código funciona sin necesidad de cambios.

<Info>
  La key se aprovisiona en una cuenta de Exa de tu propiedad. Gestiona el uso, las keys y la facturación en cualquier momento desde el [Exa Dashboard](https://dashboard.exa.ai).
</Info>

<div id="link-an-existing-exa-team">
  ## Vincular un equipo de Exa existente
</div>

¿Ya tienes una cuenta de Exa? Conéctala primero para que la API key se genere en tu equipo existente:

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link` abre Exa para que puedas autenticarte y vincular tu equipo con tu cuenta de Stripe. Puedes abrir el Exa Dashboard vinculado en cualquier momento con `stripe projects open exa`.

<div id="provision-from-your-coding-agent">
  ## Aprovisionar desde tu agente de programación
</div>

`stripe projects init` escribe una [Agent Skill](https://projects.dev) de Stripe Projects en tu proyecto, de modo que puedas dejar que tu agente (Claude Code, Cursor, Codex y otros) ejecute el flujo por ti:

```text theme={null}
Usa Stripe Projects para añadir Exa y conectar la API key.
```

<div id="next-steps">
  ## Próximos pasos
</div>

* [Quickstart](/es/docs/search/quickstart): realiza tu primera búsqueda con Exa usando nuestros SDK.
* [Documentación de Stripe Projects](https://docs.stripe.com/projects): referencia completa de la CLI, entornos y facturación.
* [Exa Dashboard](https://dashboard.exa.ai): gestiona API keys, uso y facturación.
* [Catálogo de proveedores](https://projects.dev): explora todos los proveedores de Stripe Projects.