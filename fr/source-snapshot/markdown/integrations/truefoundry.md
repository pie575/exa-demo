> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="truefoundry">
  # TrueFoundry
</div>

> Connectez Exa au MCP Gateway de TrueFoundry pour centraliser les contrôles d&#39;accès, la gestion des outils et le suivi de l&#39;utilisation.

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) est une couche proxy de niveau entreprise entre vos applications et les fournisseurs de LLM ou les MCP servers. Elle offre un accès unifié à plus de 1 000 LLM, avec une observabilité et une gouvernance centralisées.

TrueFoundry propose Exa comme serveur distant officiel dans son [MCP Gateway](https://www.truefoundry.com/mcp-gateway). Connectez l&#39;Exa MCP server pour offrir à vos équipes un endpoint géré unique dédié à la recherche web, à la récupération de contenu et à la recherche agentique.

<Frame caption="Exa dans le catalogue officiel de MCP servers distants de TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="Le serveur Exa dans le catalogue officiel de MCP distants de TrueFoundry" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

<div id="add-exa-to-truefoundry">
  ## Ajouter Exa à TrueFoundry
</div>

1. Ouvrez **MCP Servers** dans la sidebar de TrueFoundry et sélectionnez **Add new MCP Server**.
2. Sélectionnez **Connect Official Remote MCP Servers**.

<Frame caption="Choisissez le catalogue officiel de MCP servers distants">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="Sélecteur Add MCP Server de TrueFoundry avec Connect Official Remote MCP Servers sélectionné" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. Trouvez **Exa** dans le catalogue et sélectionnez **+ Add**.
4. Vérifiez les informations pré-remplies du serveur :

| Field          | Valeur                                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name           | `exa`                                                                                                                                                 |
| Description    | Moteur de recherche conçu pour les IA par Exa                                                                                                         |
| URL            | `https://mcp.exa.ai/mcp`                                                                                                                              |
| Authentication | Facultative (le MCP server fonctionne sans authentification. Une API key Exa n&#39;est nécessaire que si vous atteignez la limite de débit gratuite.) |

5. Ajoutez les utilisateurs ou les équipes qui doivent gérer ou utiliser le serveur. Laissez **Auth Data** désactivé, puis sélectionnez **Update MCP Server**.

<Frame caption="Configurez le serveur Exa et ses collaborateurs">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Formulaire d'enregistrement du MCP server Exa avec son nom, son URL, ses collaborateurs et ses paramètres d'authentification" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  Ouvrez l&#39;onglet **Tools** et vérifiez que les tools Exa de search, de content fetching et de recherche agentique sont bien disponibles.
</Check>

<div id="configure-the-exa-server">
  ## Configurer le serveur Exa
</div>

L&#39;URL préremplie expose l&#39;ensemble d&#39;outils par défaut d&#39;Exa. Ne la modifiez que si vous devez restreindre les tools disponibles ou utiliser votre propre API key.

<div id="choose-which-tools-are-available">
  ### Choisir les outils disponibles
</div>

Transmettez une liste de noms de tools séparés par des virgules dans le paramètre de requête `tools` :

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
  Vous trouverez les noms des tools disponibles dans la [documentation Exa MCP](/fr/docs/get-started/exa-mcp).
</Tip>

<div id="use-your-exa-api-key-to-bypass-the-free-rate-limit">
  ### Utiliser votre API key Exa pour contourner la limite de débit gratuite
</div>

Si vous atteignez la limite de débit gratuite, ajoutez votre API key Exa à l&#39;URL du serveur :

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<div id="connect-an-mcp-client">
  ## Connecter un client MCP
</div>

Ouvrez l&#39;onglet **How To Use** du serveur Exa et sélectionnez votre client. TrueFoundry génère l&#39;endpoint propre à votre tenant ainsi qu&#39;une configuration prête à coller pour Cursor, Claude Code, VS Code, Windsurf, Codex et les autres clients MCP.

<Frame caption="Copiez la configuration correspondant à votre client MCP">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="Instructions de configuration propres à chaque client pour le MCP server Exa dans TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

<div id="test-a-tool">
  ## Tester un outil
</div>

Sélectionnez **Try** à côté d&#39;un outil Exa, renseignez ses paramètres d&#39;entrée, puis sélectionnez **Execute Tool**. Le playground affiche la réponse JSON, ce qui vous permet de vérifier l&#39;outil avant de l&#39;utiliser dans un agent.

<Frame caption="Exécuter un outil Exa dans le playground TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Test d'un outil Exa dans le playground d'outils TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

<div id="manage-and-monitor-tools">
  ## Gérer et surveiller les outils
</div>

* Activez ou désactivez chaque outil pour contrôler ce que les clients MCP peuvent appeler
* Utilisez les **Tool Metrics** pour analyser le trafic, la latence et les erreurs
* Exportez les traces d&#39;invocation vers votre stack d&#39;observabilité via OpenTelemetry

<Frame caption="Gérer les tools Exa exposés aux clients MCP">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="Tools Exa disponibles depuis le MCP server TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

<div id="resources">
  ## Ressources
</div>

<Columns cols={3}>
  <Card title="Guide de configuration TrueFoundry" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="Ouvrir le guide" arrow="true">
    Consultez le guide de TrueFoundry sur son Exa MCP server.
  </Card>

  <Card title="Documentation Exa MCP" icon="search" href="/fr/docs/get-started/exa-mcp" cta="Ouvrir le guide" arrow="true">
    Découvrez les tools, la configuration et des exemples d&#39;utilisation d&#39;Exa.
  </Card>

  <Card title="Exa MCP Server" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Voir la source" arrow="true">
    Consultez le code source du serveur et ses versions sur GitHub.
  </Card>
</Columns>