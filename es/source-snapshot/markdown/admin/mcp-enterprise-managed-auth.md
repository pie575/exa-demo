> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="enterprise-managed-auth-for-claude">
  # Enterprise Managed Auth para Claude
</div>

> Configura Enterprise Managed Auth (EMA) para que Claude se conecte a Exa MCP a través de tu identity provider, incluido Okta Cross App Access (XAA).

Por defecto, cada miembro conecta el [conector de Exa](/es/docs/get-started/exa-mcp) en Claude iniciando sesión una vez en Exa mediante OAuth. Con **Enterprise Managed Auth (EMA)**, en cambio, la conexión se hace de forma silenciosa a través de Okta: sin pantalla de inicio de sesión de Exa, sin solicitud de consentimiento y sin repartir API keys.

El acceso sigue a tu directorio: si desaprovisionas a alguien en Okta, su acceso a Exa desde Claude se corta al mismo tiempo. EMA es la [extensión de managed authorization empresarial](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) de MCP.

<div id="before-you-start">
  ## Antes de empezar
</div>

* Una organización de Claude Team o Enterprise con tu identity provider conectado y acceso de administrador a ella.
* Una **organization** de Exa (no un equipo personal) con SSO y directory sync, y acceso de administrador a ella.
* Okta como identity provider, en Okta Identity Engine con [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm) habilitado y acceso de Super Admin al tenant. Okta es el único identity provider compatible por ahora.

<div id="exa-values-youll-need">
  ## Valores de Exa que necesitarás
</div>

| Campo                                            | Valor                    |
| ------------------------------------------------ | ------------------------ |
| URL del emisor (servidor de autorización de Exa) | `https://auth.exa.ai`    |
| URL del resource / MCP server                    | `https://mcp.exa.ai/mcp` |
| Scope                                            | `mcp:tools`              |

<div id="set-up-ema">
  ## Configurar EMA
</div>

<Steps>
  <Step title="Aprovisiona a tus miembros en Exa">
    Todo miembro que vaya a usar el conector debe existir ya en Exa y pertenecer a un equipo de tu organization de Exa, con la misma dirección de correo que declara Okta y en un dominio verificado en tu organization. EMA nunca crea cuentas. Usa directory sync o [invítalos al equipo](/es/docs/admin/team-management).
  </Step>

  <Step title="Registra tu identity provider en Exa">
    En el Exa Dashboard, abre [Organization](https://dashboard.exa.ai/organization), busca **Enterprise-managed auth (Claude MCP)** y haz clic en **Register identity provider**. Pega la URL de SSO / app embed de Okta (`https://your-org.okta.com/app/.../sso/saml`). Exa valida la URL al registrarla.

    El registro permanece en **Pending verification** hasta que el primer miembro aprovisionado conecte Claude correctamente a través de Okta; entonces pasa a **Active** por sí solo. No hay que hacer nada más. Los issuers que Exa configuró por ti aparecen como **Managed by Exa**; escribe a soporte para modificarlos. Si Exa no reconoce tu URL, escribe a [support@exa.ai](mailto:support@exa.ai).
  </Step>

  <Step title="Configura Cross App Access en Okta">
    Sigue la [guía de Cross App Access de Okta para Claude EMA](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide). Para Exa:

    1. Abre la aplicación de Exa en la Okta Admin Console, ve a **Resource Server**, activa XAA y establece la Resource URL y la URL del emisor en `https://auth.exa.ai`. Deja vacío el Audience/tenant ID.
    2. Si la aplicación de Exa es una app SAML personalizada, confirma que su **Name ID Format** sea `EmailAddress`, ya que Exa hace coincidir el correo declarado con la cuenta de Exa del miembro.
    3. Registra el Claude AI Agent en **Directory → AI Agents**, añade su clave pública de Anthropic, añade la app de Claude como llamador delegado y añade Exa como **Resource Connection** usando el Client ID que te proporcione Anthropic.
  </Step>

  <Step title="Activa managed authorization en Claude">
    En Claude, ve a **Organization settings → Connectors**, selecciona el conector de Exa y, en la pestaña **Configuration**, haz clic en **Set up** junto a Managed authorization. Confirma la conexión con el IdP, ejecuta la prueba, elige los roles que heredan el conector y guarda. Consulta la [guía de administración de Anthropic](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization) para conocer las opciones de roles y scope.
  </Step>
</Steps>

Los miembros reciben el conector la próxima vez que inicien sesión. Puedes mantener habilitado el sign-in por navegador junto con managed authorization; Claude intenta primero managed authorization y, si falla, recurre al inicio de sesión OAuth normal.

<Note>
  El uso a través de Claude se factura al equipo de Exa del miembro, según el plan y los límites de tasa de ese equipo, igual que cualquier otra cosa que ejecuten en el equipo.
</Note>

<div id="revoking-access">
  ## Revocar el acceso
</div>

* **Un solo miembro:** elimínalo en Okta o de su equipo en Exa. Cualquiera de las dos acciones pone fin a su acceso a través de Claude.
* **Todos:** elimina el issuer en la página Organization o desactiva managed authorization en Claude. Las nuevas conexiones se bloquean de inmediato y las sesiones ya abiertas finalizan poco después. Puedes volver a registrar el issuer en cualquier momento.

<div id="troubleshooting">
  ## Solución de problemas
</div>

<AccordionGroup>
  <Accordion title="Funciona para algunos miembros, pero no para otros">
    El miembro que falla no se puede resolver en Exa. Comprueba que exista en Exa con el correo exacto que declara Okta, en un dominio verificado en tu organization, y que pertenezca a un equipo de esa organization. Lo más habitual es que la causa sea una asignación de grupos del directory sync.
  </Accordion>

  <Accordion title="No funciona para nadie">
    Revisa el estado del issuer en la página Organization. Si sigue en **Pending verification**, es que aún no se ha establecido ninguna conexión correctamente. Normalmente la configuración de Okta está incompleta, la URL del emisor en la aplicación de Exa no coincide con `https://auth.exa.ai`, o el miembro que lo intentó no está aprovisionado en Exa. Corrige eso y vuelve a conectarte con un miembro aprovisionado.
  </Accordion>

  <Accordion title="El registro indica que el identity provider ya está registrado">
    Un issuer pertenece a una única organization de Exa. Si no aparece en tu página Organization, escribe a [support@exa.ai](mailto:support@exa.ai).
  </Accordion>
</AccordionGroup>

<Note>
  Para cualquier otro caso, escribe a [support@exa.ai](mailto:support@exa.ai) indicando el nombre de tu organization de Exa, el correo del miembro afectado y aproximadamente cuándo ocurrió el intento.
</Note>