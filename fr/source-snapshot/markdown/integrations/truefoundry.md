> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="truefoundry">
  # TrueFoundry
</div>

> Connectez Exa à la MCP Gateway de TrueFoundry pour centraliser les contrôles d&#39;accès, la gestion des tools et le suivi de l&#39;usage.

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) est une couche proxy de niveau entreprise entre vos applications et les fournisseurs de LLM ou les MCP servers. Elle offre un accès unifié à plus de 1 000 LLM, avec observabilité et gouvernance centralisées.

TrueFoundry propose Exa comme serveur distant officiel dans sa [MCP Gateway](https://www.truefoundry.com/mcp-gateway). Connectez le MCP server Exa pour offrir à vos teams un endpoint géré unique dédié à la web search, à la récupération de contenu et à l&#39;agentic research.

<Frame caption="Exa dans le catalogue officiel de remote MCP servers de TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="Le serveur Exa dans le catalogue officiel de remote MCP de TrueFoundry" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

<div id="add-exa-to-truefoundry">
  ## Ajouter Exa à TrueFoundry
</div>

1. Ouvrez **MCP Servers** dans la sidebar de TrueFoundry et sélectionnez **Add new MCP Server**.
2. Sélectionnez **Connect Official Remote MCP Servers**.

<Frame caption="Choisissez le catalogue officiel de remote MCP servers">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="Sélecteur Add MCP Server de TrueFoundry avec Connect Official Remote MCP Servers sélectionné" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. Repérez **Exa** dans le catalogue et sélectionnez **+ Add**.
4. Vérifiez les informations du serveur pré-remplies :

| Champ          | Valeur                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Name           | `exa`                                                                                                                                           |
| Description    | Moteur de recherche conçu pour les IA par Exa                                                                                                   |
| URL            | `https://mcp.exa.ai/mcp`                                                                                                                        |
| Authentication | Facultative (le MCP server fonctionne sans authentification. Une Exa API key n&#39;est nécessaire que si vous atteignez la limite de débit gratuite.) |

5. Ajoutez les utilisateurs ou les teams qui doivent gérer ou utiliser le serveur. Laissez **Auth Data** désactivé, puis sélectionnez **Update MCP Server**.

<Frame caption="Configurez le serveur Exa et ses collaborateurs">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Formulaire d'enregistrement du MCP server Exa avec son nom, son URL, ses collaborateurs et ses paramètres d'authentification" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  Ouvrez l&#39;onglet **Tools** et vérifiez que les tools Exa de search, de récupération de contenu et d&#39;agentic research sont bien disponibles.
</Check>

<div id="configure-the-exa-server">
  ## Configurer le serveur Exa
</div>

L&#39;URL pré-remplie expose l&#39;ensemble d&#39;outils par défaut d&#39;Exa. Ne la modifiez que si vous devez restreindre les tools disponibles ou utiliser votre propre API key.

<div id="choose-which-tools-are-available">
  ### Choisir les tools disponibles
</div>

Transmettez une liste de noms de tools séparés par des virgules dans le paramètre de query `tools` :

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

Vous pouvez saisir l&#39;URL dans le formulaire du serveur ou utiliser **Apply using YAML** :

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
  Vous trouverez les noms des tools disponibles dans la [documentation MCP d&#39;Exa](/fr/docs/get-started/exa-mcp).
</Tip>

<div id="use-your-exa-api-key-to-bypass-the-free-rate-limit">
  ### Utilisez votre API key Exa pour dépasser la limite de débit gratuite
</div>

Si vous atteignez la limite de débit gratuite, ajoutez votre API key Exa à l&#39;URL du serveur :

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le dashboard. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<div id="connect-an-mcp-client">
  ## Connecter un client MCP
</div>

Ouvrez l&#39;onglet **How To Use** du serveur Exa et sélectionnez votre client. TrueFoundry génère l&#39;endpoint propre à votre tenant ainsi qu&#39;une configuration prête à coller pour Cursor, Claude Code, VS Code, Windsurf, Codex et d&#39;autres clients MCP.

<Frame caption="Copiez la configuration correspondant à votre client MCP">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="Instructions de configuration spécifiques à chaque client fournies par TrueFoundry pour le MCP server Exa" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

<div id="test-a-tool">
  ## Tester un tool
</div>

Sélectionnez **Try** à côté d&#39;un tool Exa, renseignez ses paramètres d&#39;entrée, puis sélectionnez **Execute Tool**. Le playground affiche la response JSON, ce qui vous permet de valider le tool avant de l&#39;utiliser dans un agent.

<Frame caption="Exécuter un tool Exa dans le playground TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Test d'un tool Exa dans le playground de tools TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

<div id="manage-and-monitor-tools">
  ## Gérer et surveiller les tools
</div>

* Activez ou désactivez chaque tool individuellement pour contrôler ce que les clients MCP peuvent appeler
* Utilisez les **Tool Metrics** pour analyser le trafic, la latence et les erreurs
* Exportez les traces d&#39;invocation vers votre stack d&#39;observabilité via OpenTelemetry

<Frame caption="Gérez les tools Exa exposés aux clients MCP">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="Tools Exa disponibles depuis le MCP server TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

<div id="resources">
  ## Ressources
</div>

<Columns cols={3}>
  <Card title="Guide de configuration TrueFoundry" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="Ouvrir le guide" arrow="true">
    Consultez le guide de TrueFoundry sur son MCP server Exa.
  </Card>

  <Card title="Documentation MCP Exa" icon="search" href="/fr/docs/get-started/exa-mcp" cta="Ouvrir le guide" arrow="true">
    Découvrez les tools, la configuration et des exemples d&#39;utilisation d&#39;Exa.
  </Card>

  <Card title="Exa MCP Server" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Voir le code source" arrow="true">
    Consultez le code source du serveur et les versions publiées sur GitHub.
  </Card>
</Columns>