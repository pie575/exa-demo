> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="enterprise-managed-auth-for-claude">
  # Enterprise Managed Auth para Claude
</div>

> Configura Enterprise Managed Auth (EMA) para que Claude se conecte a Exa MCP a través de tu proveedor de identidad, incluido Okta Cross App Access (XAA).

De forma predeterminada, cada miembro conecta el [conector de Exa](/es/docs/get-started/exa-mcp) en Claude iniciando sesión una vez en Exa mediante OAuth. Con **Enterprise Managed Auth (EMA)**, en cambio, lo obtienen de forma transparente a través de Okta: sin pantalla de inicio de sesión de Exa, sin solicitud de consentimiento y sin tener que repartir API keys.

El acceso sigue a tu directorio: si desaprovisionas a alguien en Okta, su acceso a Exa desde Claude se corta al instante. EMA es la [extensión de autorización gestionada para empresas](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) de MCP.

<div id="before-you-start">
  ## Antes de empezar
</div>

* Una organización de Claude Team o Enterprise con tu proveedor de identidad conectado y acceso de administrador a ella.
* Una **organización** de Exa (no un equipo personal) con SSO y sincronización de directorio, y acceso de administrador a ella.
* Okta como proveedor de identidad, en Okta Identity Engine con [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm) habilitado, y acceso de Super Admin al tenant. Okta es el único proveedor de identidad compatible por ahora.

<div id="exa-values-youll-need">
  ## Valores de Exa que necesitarás
</div>

| Campo                                            | Valor                    |
| ------------------------------------------------ | ------------------------ |
| URL del emisor (servidor de autorización de Exa) | `https://auth.exa.ai`    |
| URL del recurso / servidor MCP                   | `https://mcp.exa.ai/mcp` |
| Scope                                            | `mcp:tools`              |

<div id="set-up-ema">
  ## Configurar EMA
</div>

<Steps>
  <Step title="Aprovisiona a tus miembros en Exa">
    Todo miembro que vaya a usar el conector debe existir previamente en Exa y pertenecer a un equipo de tu organización de Exa, con la misma dirección de correo electrónico que declara Okta, en un dominio verificado en tu organización. EMA nunca crea cuentas. Usa la sincronización de directorio o [invítalos al equipo](/es/docs/admin/team-management).
  </Step>

  <Step title="Registra tu proveedor de identidad en Exa">
    En el panel de Exa, abre [Organization](https://dashboard.exa.ai/organization), busca **Enterprise-managed auth (Claude MCP)** y haz clic en **Register identity provider**. Pega la URL de SSO / app embed de Okta (`https://your-org.okta.com/app/.../sso/saml`). Exa valida la URL al registrarla.

    El registro permanece en **Pending verification** hasta que el primer miembro aprovisionado conecte Claude correctamente a través de Okta; entonces pasa a **Active** automáticamente. No hay que hacer nada más. Los emisores que Exa configuró por ti aparecen como **Managed by Exa**; para modificarlos, contacta con soporte. Si Exa no reconoce tu URL, escribe a [support@exa.ai](mailto:support@exa.ai).
  </Step>

  <Step title="Configura Cross App Access en Okta">
    Sigue la [guía de Cross App Access de Okta para Claude EMA](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide). Para Exa:

    1. Abre la aplicación de Exa en la consola de administración de Okta, ve a **Resource Server**, activa XAA y establece la Resource URL y la Issuer URL en `https://auth.exa.ai`. Deja vacío el Audience/tenant ID.
    2. Si la aplicación de Exa es una app SAML personalizada, confirma que su **Name ID Format** sea `EmailAddress`, ya que Exa compara el correo declarado con la cuenta de Exa del miembro.
    3. Registra el Claude AI Agent en **Directory → AI Agents**, añade su clave pública de Anthropic, añade la aplicación de Claude como llamador delegado y añade Exa como **Resource Connection** usando el Client ID que te proporciona Anthropic.
  </Step>

  <Step title="Activa la autorización gestionada en Claude">
    En Claude, ve a **Organization settings → Connectors**, selecciona el conector de Exa y, en la pestaña **Configuration**, haz clic en **Set up** junto a Managed authorization. Confirma la conexión con el IdP, ejecuta la prueba, elige los roles que heredan el conector y guarda. Consulta la [guía de administración de Anthropic](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization) para ver las opciones de roles y scope.
  </Step>
</Steps>

Los miembros obtienen el conector la próxima vez que inicien sesión. Puedes mantener habilitado el inicio de sesión por navegador junto con la autorización gestionada; Claude intenta primero la autorización gestionada y, si falla, recurre al inicio de sesión OAuth habitual.

<Note>
  El uso a través de Claude se factura al equipo de Exa del miembro, según el plan y los límites de tasa de ese equipo, igual que cualquier otra cosa que ejecute en el equipo.
</Note>

<div id="revoking-access">
  ## Revocar el acceso
</div>

* **Un solo miembro:** elimínalo en Okta o de su equipo en Exa. Cualquiera de las dos acciones pone fin a su acceso a través de Claude.
* **Todos:** elimina el emisor en la página Organization o desactiva la autorización gestionada en Claude. Las nuevas conexiones se bloquean de inmediato y las sesiones ya abiertas finalizan poco después. Puedes volver a registrar el emisor en cualquier momento.

<div id="troubleshooting">
  ## Solución de problemas
</div>

<AccordionGroup>
  <Accordion title="Funciona para algunos miembros, pero no para otros">
    El miembro que falla no se puede resolver en Exa. Comprueba que exista en Exa con el correo electrónico exacto que declara Okta, en un dominio verificado en tu organización, y que pertenezca a un equipo de esa organización. Lo más habitual es que el problema esté en la asignación de grupos de la sincronización de directorio.
  </Accordion>

  <Accordion title="No funciona para nadie">
    Revisa el estado del emisor en la página Organization. Si sigue en **Pending verification**, es que aún no se ha establecido ninguna conexión correctamente. Por lo general, la configuración de Okta está incompleta, la Issuer URL de la aplicación de Exa no coincide con `https://auth.exa.ai` o el miembro que lo intentó no está aprovisionado en Exa. Corrige el problema y vuelve a conectarte con un miembro aprovisionado.
  </Accordion>

  <Accordion title="El registro indica que el proveedor de identidad ya está registrado">
    Cada emisor pertenece a una única organización de Exa. Si no aparece en tu página Organization, escribe a [support@exa.ai](mailto:support@exa.ai).
  </Accordion>
</AccordionGroup>

<Note>
  Para cualquier otro caso, escribe a [support@exa.ai](mailto:support@exa.ai) indicando el nombre de tu organización en Exa, el correo electrónico del miembro afectado y aproximadamente cuándo se produjo el intento.
</Note>