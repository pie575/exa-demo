> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# fx par Vercel Labs {#fx-by-vercel-labs}

> Ajoutez Exa web search à fx, l&#39;agent de code natif de Vercel Labs, grâce au MCP server hébergé d&#39;Exa.

[fx](https://fx.sh) est un agent de code natif et une CLI de Vercel Labs, ainsi qu&#39;un MCP client. Ajoutez-y le MCP server hébergé d&#39;Exa pour lui donner accès à la recherche web en temps réel et à la lecture de pages.

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/vercel/fx/install-exa.gif?s=2e331148abdf5bdf083e6f651e3b8b75" alt="Installation de fx, ajout du MCP server Exa avec /mcp add et exécution d'une Exa web search en temps réel" style={{width: "100%", height: "auto"}} width="800" height="393" data-path="images/integrations/vercel/fx/install-exa.gif" />
</Frame>

## Installation {#installation}

<Steps>
  <Step title="Installer fx">
    ```bash theme={null}
    curl -fsSL https://fx.sh/setup.sh | bash
    ```

    Connectez-vous ensuite avec `fx login`. Consultez la [documentation de fx](https://fx.sh/docs) pour connaître les options de fournisseur.
  </Step>

  <Step title="Ajouter Exa">
    Lancez fx avec la commande `fx`, puis ajoutez le Exa MCP server depuis le shell interactif :

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    fx enregistre le serveur dans `~/.fx/mcp.json` et recharge MCP.
  </Step>

  <Step title="Vérifier la connexion">
    ```text theme={null}
    /mcp list
    ```
  </Step>
</Steps>

## Configuration manuelle {#configure-by-hand}

fx lit les MCP servers uniquement depuis `~/.fx/mcp.json` : vous pouvez donc aussi y ajouter Exa directement :

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

Exécutez `/mcp reload` pour appliquer la modification sans redémarrer fx.

Le plan gratuit suffit pour un usage occasionnel. Pour relever les limites de débit, créez une API key et ajoutez-la à la configuration :

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
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

`header_env` associe un nom de header à une variable d&#39;environnement, ce qui évite de stocker la clé dans le fichier de configuration.

## Découverte des outils {#tool-discovery}

fx découvre les outils MCP de manière paresseuse : les outils du serveur ne sont pas chargés dans le context du modèle tant qu&#39;un tour n&#39;en a pas besoin, si bien qu&#39;ajouter Exa ne coûte rien lors des tours qui n&#39;effectuent aucune recherche web.

<Card title="Exa MCP" icon="plug" href="/fr/docs/get-started/exa-mcp" cta="Ouvrir le guide" arrow="true">
  Consultez les outils disponibles, les options de configuration et les autres clients.
</Card>