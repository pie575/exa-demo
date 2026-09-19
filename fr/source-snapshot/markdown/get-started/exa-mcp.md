> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-mcp">
  # Exa MCP
</div>

> Connectez ChatGPT, Codex, Claude, Grok, Cursor et tout autre client MCP aux outils Exa de recherche web, de récupération de pages, ainsi qu&#39;à Exa Agent et Exa Connect.

Utilisez Exa MCP pour enrichir la recherche web intégrée de ChatGPT, Claude et des outils compatibles MCP avec les capacités de recherche d&#39;Exa : recherche web, recherche de code, [Exa Agent](/fr/docs/agent/quickstart) et [Exa Connect](/fr/docs/agent/connect/overview).

Exa propose un serveur hébergé qui fonctionne avec n&#39;importe quel client MCP :

```text theme={null}
https://mcp.exa.ai/mcp
```

Aucune API key n&#39;est nécessaire pour démarrer. Exa MCP est open source et disponible sur [GitHub](https://github.com/exa-labs/exa-mcp-server).

<div id="install">
  ## Installation
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT & Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa est un plugin officiel du répertoire de plugins d&#39;OpenAI, qui inclut le MCP server hébergé ainsi que les skills `search` et `exa-agent` d&#39;Exa.

      <Steps>
        <Step title="Ouvrir le plugin">
          Rendez-vous sur [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). La page **Exa** s&#39;ouvre dans le répertoire de plugins d&#39;OpenAI, le même répertoire pour ChatGPT et pour Codex.
        </Step>

        <Step title="L'installer">
          Cliquez sur le bouton plus pour l&#39;installer. Connectez-vous à Exa lorsque cela vous est demandé, soit pendant l&#39;installation, soit lors de la première utilisation par Codex ou ChatGPT.

          <Frame caption="Ouverture des Plugins dans Codex, ajout d'Exa et autorisation d'accès">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Ouverture des Plugins dans Codex, affichage du plugin Exa et autorisation d'accès" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="Démarrer une nouvelle session">
          Les skills ne se chargent que dans les conversations et les sessions CLI démarrées après l&#39;installation : ouvrez-en donc une nouvelle et posez une question qui nécessite le web.
        </Step>
      </Steps>

      C&#39;est tout. Le plugin inclut à la fois l&#39;intégration MCP et les skills d&#39;Exa : aucune configuration MCP ou skill distincte n&#39;est donc nécessaire.

      Consultez [Exa dans Codex et ChatGPT](/fr/docs/integrations/chatgpt-codex) pour le guide complet de configuration et de workflow.
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <div id="claude-code-cli">
        ### Claude Code CLI
      </div>

      <Steps>
        <Step title="Installer le plugin">
          Installez Exa depuis le terminal :

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Vous pouvez aussi saisir `/plugin` dans Claude Code, rechercher **Exa** et l&#39;installer.
        </Step>

        <Step title="Utiliser Exa">
          Démarrez une nouvelle session Claude Code et posez une question nécessitant le web.
        </Step>
      </Steps>

      <div id="desktop-web-cowork">
        ### Desktop, Web &amp; Cowork
      </div>

      Claude Desktop, Web et Cowork utilisent tous le connecteur officiel d&#39;Exa.

      <Steps>
        <Step title="Ouvrir l'annuaire des connecteurs">
          Cliquez sur le bouton plus dans un nouveau chat, choisissez **Add connector**, puis recherchez **Exa**.
        </Step>

        <Step title="Connecter Exa">
          Ouvrez Exa, sélectionnez **Connect to Claude**, puis autorisez l&#39;accès lorsque vous y êtes invité.

          <Frame caption="Ouverture de l'annuaire des connecteurs dans Claude, recherche d'Exa, connexion et autorisation d'accès">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Ouverture de l'annuaire des connecteurs dans Claude, recherche d'Exa, connexion et autorisation d'accès" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Utiliser Exa">
          Démarrez un nouveau chat et posez une question nécessitant des informations actuelles issues du web.
        </Step>
      </Steps>

      Consultez [Exa dans Claude Code, Web et Desktop](/fr/docs/integrations/claude-web-desktop) pour le guide complet de configuration et de workflow.

      Les administrateurs Claude Team et Enterprise peuvent aussi provisionner le connecteur pour l&#39;ensemble des utilisateurs via leur identity provider : voir [Enterprise Managed Auth](/fr/docs/admin/mcp-enterprise-managed-auth).
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa est disponible sur le marketplace [Grok Build](https://docs.x.ai/build/overview).

      <Steps>
        <Step title="Ouvrir le marketplace">
          Dans Grok Build, exécutez `/marketplace`.
        </Step>

        <Step title="Installer Exa">
          Repérez **exa** dans la liste et appuyez sur `i`.
        </Step>

        <Step title="Se connecter">
          Exécutez `/mcp`, sélectionnez **exa**, puis appuyez sur `i` pour vous connecter à votre compte Exa depuis le navigateur.
        </Step>
      </Steps>

      Les nouveaux comptes reçoivent des credits gratuits à l&#39;inscription.
    </Tab>

    <Tab title="Cursor" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      Installez Exa MCP depuis la [marketplace Cursor](https://cursor.com/marketplace/exa), ou ajoutez-le à `~/.cursor/mcp.json` :

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="VS Code" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/vscode.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9828a7b963d47467df217a38c716fea2" width="24" height="24" data-path="images/mcp-clients/vscode.svg">
      Utilisez l&#39;[installation en un clic](https://vscode.dev/redirect/mcp/install?name=exa\&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D), ou ajoutez-le à `.vscode/mcp.json` dans votre projet :

      ```json theme={null}
      {
        "servers": {
          "exa": {
            "type": "http",
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="Autres clients" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/other-clients.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=187e423022b8fc3ed950a967a10ff700" width="24" height="24" data-path="images/mcp-clients/other-clients.svg">
      La plupart des clients utilisent la structure standard `mcpServers` :

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```

      L&#39;emplacement de la configuration et le nom de la clé d&#39;URL varient selon le client :

      | Client                                       | Où l&#39;ajouter                                                                                           | Clé d&#39;URL                |
      | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------- |
      | [fx by Vercel](/fr/docs/integrations/vercel/fx) | `/mcp add --transport http exa https://mcp.exa.ai/mcp` dans le shell fx (enregistré dans `~/.fx/mcp.json`) | `url`                        |
      | OpenCode                                     | `opencode.json` (sous `mcp`, avec `"type": "remote"`)                                                      | `url`                        |
      | Kiro                                         | `~/.kiro/settings/mcp.json` (sous `mcpServers`)                                                            | `url`                        |
      | Windsurf                                     | `~/.codeium/windsurf/mcp_config.json` (sous `mcpServers`)                                                  | `serverUrl`                  |
      | Google Antigravity                           | Panneau Agent → Manage MCP Servers → View Raw config (sous `mcpServers`)                                   | `serverUrl`                  |
      | Zed                                          | `settings.json` de Zed (sous `context_servers`)                                                            | `url`                        |
      | Gemini CLI                                   | `~/.gemini/settings.json` (sous `mcpServers`)                                                              | `httpUrl`                    |
      | Warp                                         | Settings → MCP Servers → Add MCP Server (`exa` au niveau racine)                                           | `url`                        |
      | v0 by Vercel                                 | Prompt Tools → Add MCP                                                                                     | collez directement l&#39;URL |

      Si votre client ne prend pas en charge les remote MCP servers, utilisez le pont `mcp-remote` :

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
          }
        }
      }
      ```

      Ou exécutez le [package npm](https://www.npmjs.com/package/exa-mcp-server) en local avec votre [Exa API key](https://dashboard.exa.ai/api-keys) :

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "exa-mcp-server"],
            "env": {
              "EXA_API_KEY": "your_api_key"
            }
          }
        }
      }
      ```
    </Tab>
  </Tabs>
</div>

<div id="authentication">
  ## Authentification
</div>

Exa MCP prend en charge trois modes d&#39;authentification :

| Mode     | À utiliser pour                                                               | Configuration                                                                                                                            |
| -------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Sans clé | Usage gratuit et limité en débit, sans connexion ni API key                   | Se connecter à `https://mcp.exa.ai/mcp`                                                                                                  |
| OAuth    | Clients interactifs, installations depuis le marketplace, usage en production | Se connecter à `https://mcp.exa.ai/mcp?login` pour s&#39;authentifier à Exa dans le navigateur. L&#39;usage est imputé à votre team Exa. |
| API key  | Clients sans MCP OAuth                                                        | Se connecter à `https://mcp.exa.ai/mcp` avec le header `x-api-key` défini sur votre API key                                              |

<div id="sign-in-with-oauth">
  ### Se connecter avec OAuth
</div>

ChatGPT, Claude et les autres installations depuis une marketplace vous invitent à vous connecter le moment venu. Dans tout client prenant en charge MCP OAuth, vous pouvez déclencher le même flux en vous connectant à :

```text theme={null}
https://mcp.exa.ai/mcp?login
```

Votre client détecte le serveur d&#39;autorisation d&#39;Exa, ouvre la page de connexion dans le navigateur et gère l&#39;accès.

<div id="use-an-api-key">
  ### Utiliser une API key
</div>

<Card title="Obtenez votre Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une key dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
</Card>

Ajoutez le header `x-api-key` à la configuration du MCP serveur :

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

<div id="available-tools">
  ## Outils disponibles
</div>

| Outil                     | Disponibilité                    | À utiliser pour                                                                                                  |
| ------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `web_search_exa`          | Activé par défaut                | Rechercher sur le web et obtenir du contenu pertinent, prêt à l&#39;emploi                                       |
| `web_fetch_exa`           | Activé par défaut                | Lire le contenu épuré d&#39;une ou plusieurs URL connues                                                         |
| `web_search_advanced_exa` | Disponible sur activation        | Configurer la recherche web avec des filtres et contrôles avancés                                                |
| `agent_run`               | Disponible avec OAuth ou API key | Mener des recherches en plusieurs étapes, du list-building, de l&#39;enrichment et produire du structured output |

Utilisez le paramètre d&#39;URL `tools` pour définir les outils visibles par votre client. Par exemple, pour tous les activer :

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  Une liste `tools` explicite remplace les valeurs par défaut : pensez donc à inclure tous les outils que vous souhaitez activer, y compris la web search et fetch.
</Tip>

<div id="exa-agent">
  ## Exa Agent
</div>

Utilisez [Exa Agent](/fr/docs/agent/quickstart) pour les recherches qui nécessitent plus d&#39;une search — par exemple, constituer une liste, évaluer chaque item selon des critères ou renvoyer des résultats structurés.

Les Agent runs sont facturés à l&#39;usage : `agent_run` requiert donc OAuth ou une API key. Cette URL lance OAuth et ajoute Agent aux outils par défaut :

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

Si vous utilisez une API key, omettez `login` et ajoutez la clé comme décrit dans [Authentification](#authentication).

<Steps>
  <Step title="Décrivez votre besoin">
    Formulez votre demande de recherche en langage naturel. Votre assistant transmet la requête à `agent_run` via un `query`, et Exa Agent détermine quoi rechercher, lit les sources et confronte ses résultats à la demande.

    Ne demandez à votre Agent de fournir un `outputSchema` que si votre application a besoin des résultats dans un format JSON cohérent. Vous pouvez lui en transmettre un dans le system prompt, ou lui en faire générer un.
  </Step>

  <Step title="Récupérez le résultat">
    Une fois la recherche terminée, le tool call remet à votre assistant l&#39;ensemble du dossier de recherche :

    * Les conclusions rédigées
    * Les sources qui les étayent
    * Un JSON validé si vous avez fourni `outputSchema`
    * L&#39;usage et le cost

    Votre assistant rédige sa réponse à partir de ce dossier : précisez-lui donc ce que vous attendez de l&#39;output. Vous pouvez lui demander de résumer les conclusions, de les comparer, de les enregistrer dans un fichier, ou toute autre chose.
  </Step>

  <Step title="Poursuivez si le temps manque">
    Une recherche qui dépasse la durée d&#39;un seul appel MCP n&#39;échoue pas : le tool renvoie `status: "running"` avec un `id` pendant que le run se poursuit sur Exa. Votre assistant rappelle `agent_run` avec cet `id` comme `runId` pour reprendre le même run.
  </Step>
</Steps>

<Accordion title="Contrôles optionnels" icon="sliders-horizontal">
  | Field             | À utiliser pour                                                                            |
  | ----------------- | ------------------------------------------------------------------------------------------ |
  | `systemPrompt`    | Donner à l&#39;Agent des guidance supplémentaires pour rechercher ou évaluer les résultats |
  | `outputSchema`    | Renvoyer la réponse dans un format JSON précis                                             |
  | `input.data`      | Enrichir des lignes ou des entités dont vous disposez déjà                                 |
  | `input.exclusion` | Ignorer les résultats que vous connaissez déjà                                             |
  | `dataSources`     | Ajouter jusqu&#39;à cinq providers [Exa Connect](/fr/docs/agent/connect/overview)             |
  | `previousRunId`   | Bâtir une nouvelle requête sur une recherche terminée                                      |
  | `effort`          | Choisir l&#39;ampleur de la recherche que l&#39;Agent doit mener                           |
</Accordion>

<Tip>
  Utilisez `runId` pour continuer à attendre un travail en cours. Utilisez `previousRunId` pour poser une nouvelle follow-up à partir d&#39;un travail achevé.
</Tip>

Consultez le [guide Exa Agent](/fr/docs/agent/quickstart) pour découvrir les modèles de schema de sortie, les modes d&#39;effort, les sources de données et la tarification.

<div id="advanced-search">
  ## Advanced search
</div>

Utilisez `web_search_advanced_exa` lorsque la requête nécessite des filtres explicites de catégorie ou de domaine, des plages de dates, des contraintes de texte, un ciblage géographique, une expansion de requête, des summaries, des highlights, un contrôle de la freshness ou l&#39;exploration des sous-pages. Pour les recherches classiques, restez sur `web_search_exa` : il expose une surface d&#39;outils plus réduite au modèle et demande moins de configuration.

Advanced Search ne nécessite pas d&#39;authentification, mais les connexions authentifiées s&#39;appuient sur votre propre plan et vos propres rate limits. Activez-le en complément des outils par défaut avec :

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

Le tool MCP expose les principaux paramètres de la [Search API](/fr/docs/reference/search) sous forme de fields adaptés aux outils, comme `includeDomains`, `startPublishedDate`, `enableHighlights` et `maxAgeHours`. Consultez le tool schema dans votre client pour connaître les noms exacts des fields.

<div id="troubleshooting">
  ## Dépannage
</div>

<AccordionGroup>
  <Accordion title="Erreur de rate limit (429)">
    La connexion utilise les rate limits gratuits d&#39;Exa. Connectez-vous via OAuth ou ajoutez votre propre API key, puis reconnectez-vous afin que les requêtes utilisent le plan et les limits de votre team.

    <Card title="Obtenir votre Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une key dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
    </Card>
  </Accordion>

  <Accordion title="Agent absent ou demandant une authentification">
    `agent_run` n&#39;est pas activé par default et ne peut pas utiliser les rate limits gratuits. Ajoutez-le au paramètre d&#39;URL `tools`, puis connectez-vous avec `?login` ou configurez une API key. Consultez [Exa Agent](#exa-agent) pour l&#39;URL complète.
  </Accordion>

  <Accordion title="La connexion OAuth ne s'ouvre pas">
    Vérifiez que votre client prend en charge MCP OAuth, puis connectez-vous à `https://mcp.exa.ai/mcp?login`. Redémarrez le client après avoir modifié l&#39;URL. Si le client ne parvient pas à finaliser MCP OAuth, utilisez plutôt une API key.
  </Accordion>

  <Accordion title="Les outils n'apparaissent pas">
    Un parameter `tools` explicite remplace la liste d&#39;outils par default. Vérifiez que chaque outil souhaité figure bien dans l&#39;URL, puis redémarrez votre client MCP afin qu&#39;il récupère à nouveau la liste des outils.
  </Accordion>

  <Accordion title="Claude desktop ne se connecte pas">
    Utilisez le connecteur intégré : sélectionnez **+** (ou **Add connectors**) → onglet **Connectors** → recherchez **Exa** → sélectionnez **+**.
  </Accordion>

  <Accordion title="Fichier de config introuvable">
    Emplacements de config courants :

    * Cursor : `~/.cursor/mcp.json`
    * fx : `~/.fx/mcp.json`
    * VS Code : `.vscode/mcp.json` (à la racine du projet)
    * Claude desktop (macOS) : `~/Library/Application Support/Claude/claude_desktop_config.json`
    * Claude desktop (Windows) : `%APPDATA%\Claude\claude_desktop_config.json`
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

<Columns cols={2}>
  <Card title="GitHub" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Voir la source" arrow="true">
    Code source d&#39;Exa MCP.
  </Card>

  <Card title="npm" icon="package" href="https://www.npmjs.com/package/exa-mcp-server" cta="Ouvrir le package" arrow="true">
    Exécutez Exa MCP en local avec le package npm.
  </Card>

  <Card title="Agent skills" icon="wrench" href="/fr/docs/get-started/agent-skills/overview" cta="Parcourir les skills" arrow="true">
    Des skills portables, conçues pour fonctionner avec Exa MCP.
  </Card>

  <Card title="Exa dans Codex et ChatGPT" icon="messages-square" href="/fr/docs/integrations/chatgpt-codex" cta="Ouvrir le guide" arrow="true">
    Guide complet de configuration et de workflow pour le plugin Exa.
  </Card>
</Columns>