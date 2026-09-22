> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="enterprise-managed-auth-for-claude">
  # Enterprise Managed Auth pour Claude
</div>

> Configurez Enterprise Managed Auth (EMA) afin que Claude se connecte à Exa MCP via votre identity provider, y compris Okta Cross App Access (XAA).

Par défaut, chaque membre active le [connecteur Exa](/fr/docs/get-started/exa-mcp) dans Claude en se connectant une fois à Exa via OAuth. Avec **Enterprise Managed Auth (EMA)**, l&#39;accès se fait de façon transparente via Okta : aucun écran de connexion Exa, aucune demande de consentement, aucune API key à faire circuler.

L&#39;accès suit votre annuaire : supprimez le compte d&#39;une personne dans Okta et son accès à Exa via Claude prend fin immédiatement. EMA correspond à l&#39;[extension enterprise managed authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) de MCP.

<div id="before-you-start">
  ## Avant de commencer
</div>

* Une organisation Claude Team ou Enterprise dont votre identity provider est connecté, ainsi qu&#39;un accès administrateur à celle-ci.
* Une **organization** Exa (et non une équipe personnelle) avec SSO et directory sync, ainsi qu&#39;un accès administrateur à celle-ci.
* Okta comme identity provider, sur Okta Identity Engine avec [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm) activé, ainsi qu&#39;un accès Super Admin au tenant. Okta est le seul identity provider pris en charge à ce jour.

<div id="exa-values-youll-need">
  ## Valeurs Exa dont vous aurez besoin
</div>

| Field                                             | Valeur                   |
| ------------------------------------------------- | ------------------------ |
| Issuer URL (serveur d&#39;autorisation d&#39;Exa) | `https://auth.exa.ai`    |
| URL de la resource / du MCP server                | `https://mcp.exa.ai/mcp` |
| Scope                                             | `mcp:tools`              |

<div id="set-up-ema">
  ## Configurer EMA
</div>

<Steps>
  <Step title="Provisionner vos membres dans Exa">
    Chaque membre appelé à utiliser le connecteur doit déjà exister dans Exa et appartenir à une équipe de votre Exa organization, avec l&#39;adresse e-mail transmise par Okta, sur un domaine vérifié pour votre organization. EMA ne crée jamais de comptes. Utilisez le directory sync, ou [invitez-les dans l&#39;équipe](/fr/docs/admin/team-management).
  </Step>

  <Step title="Enregistrer votre identity provider dans Exa">
    Dans le Exa dashboard, ouvrez [Organization](https://dashboard.exa.ai/organization), repérez **Enterprise-managed auth (Claude MCP)**, puis cliquez sur **Register identity provider**. Collez votre URL Okta SSO / app embed (`https://your-org.okta.com/app/.../sso/saml`). Exa valide l&#39;URL au moment de l&#39;enregistrement.

    L&#39;enregistrement reste en **Pending verification** jusqu&#39;à ce que le premier membre provisionné se connecte à Claude via Okta avec succès, puis passe automatiquement à **Active**. Aucune autre action n&#39;est nécessaire. Les issuers configurés pour vous par Exa apparaissent comme **Managed by Exa** ; contactez le support pour les modifier. Si Exa ne reconnaît pas votre URL, contactez [support@exa.ai](mailto:support@exa.ai).
  </Step>

  <Step title="Configurer Cross App Access dans Okta">
    Suivez le [guide Okta sur Cross App Access pour Claude EMA](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide). Pour Exa :

    1. Ouvrez l&#39;application Exa dans la console d&#39;administration Okta, allez dans **Resource Server**, activez XAA, puis définissez la Resource URL et l&#39;Issuer URL sur `https://auth.exa.ai`. Laissez le champ Audience/tenant ID vide.
    2. Si l&#39;Exa app est une application SAML personnalisée, vérifiez que son **Name ID Format** est `EmailAddress`, car Exa fait correspondre l&#39;e-mail transmis au compte Exa du membre.
    3. Enregistrez le Claude AI Agent sous **Directory → AI Agents**, ajoutez sa clé publique fournie par Anthropic, ajoutez l&#39;application Claude comme appelant délégué, puis ajoutez Exa comme **Resource Connection** à l&#39;aide du Client ID fourni par Anthropic.
  </Step>

  <Step title="Activer la managed authorization dans Claude">
    Dans Claude, allez dans **Organization settings → Connectors**, sélectionnez le connecteur Exa, puis, dans l&#39;onglet **Configuration**, cliquez sur **Set up** à côté de Managed authorization. Confirmez la connexion à l&#39;IdP, lancez le test, choisissez les rôles qui héritent du connecteur, puis enregistrez. Consultez le [guide d&#39;administration d&#39;Anthropic](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization) pour les options de rôle et de scope.
  </Step>
</Steps>

Les membres disposent du connecteur dès leur prochaine connexion. Vous pouvez laisser la connexion via navigateur activée en parallèle de la managed authorization : Claude tente d&#39;abord la managed authorization et bascule sur la connexion OAuth normale en cas d&#39;échec.

<Note>
  L&#39;utilisation via Claude est facturée à l&#39;équipe Exa du membre, selon le plan et les limites de débit de cette équipe, comme tout ce qu&#39;il exécute au sein de l&#39;équipe.
</Note>

<div id="revoking-access">
  ## Révoquer l&#39;accès
</div>

* **Un seul membre :** supprimez-le dans Okta, ou retirez-le de son équipe dans Exa. L&#39;une ou l&#39;autre action suffit à mettre fin à son accès via Claude.
* **Tout le monde :** supprimez l&#39;issuer sur la page Organization, ou désactivez la managed authorization dans Claude. Les nouvelles connexions sont immédiatement bloquées et les sessions déjà ouvertes prennent fin peu après. Vous pouvez réenregistrer l&#39;issuer à tout moment.

<div id="troubleshooting">
  ## Dépannage
</div>

<AccordionGroup>
  <Accordion title="Cela fonctionne pour certains membres mais pas pour d'autres">
    Le membre en échec n&#39;est pas identifiable dans Exa. Vérifiez qu&#39;il existe bien dans Exa avec l&#39;adresse e-mail exacte transmise par Okta, sur un domaine vérifié pour votre organization, et qu&#39;il appartient à une équipe de cette organization. Un mappage de groupe de directory sync est le plus souvent en cause.
  </Accordion>

  <Accordion title="Rien ne fonctionne pour personne">
    Vérifiez le statut de l&#39;issuer sur la page Organization. S&#39;il est toujours **Pending verification**, c&#39;est qu&#39;aucune connexion n&#39;a encore abouti. En général, la configuration Okta n&#39;est pas terminée, l&#39;Issuer URL de l&#39;Exa app ne correspond pas à `https://auth.exa.ai`, ou le membre ayant fait la tentative n&#39;est pas provisionné dans Exa. Corrigez ce point, puis reconnectez-vous avec un membre provisionné.
  </Accordion>

  <Accordion title="L'enregistrement indique que l'identity provider est déjà enregistré">
    Un issuer appartient à une seule organization Exa. S&#39;il n&#39;apparaît pas sur votre page Organization, contactez [support@exa.ai](mailto:support@exa.ai).
  </Accordion>
</AccordionGroup>

<Note>
  Pour tout autre problème, contactez [support@exa.ai](mailto:support@exa.ai) en indiquant le nom de votre organization Exa, l&#39;adresse e-mail du membre concerné et le moment approximatif de la tentative.
</Note>