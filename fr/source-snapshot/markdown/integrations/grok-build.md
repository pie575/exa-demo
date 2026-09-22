> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour identifier toutes les pages disponibles avant d&#39;aller plus loin.

<div id="grok-build">
  # Grok Build
</div>

> Utilisez Exa web search dans Grok Build. Installez le plugin Exa depuis la marketplace Grok Build et connectez-vous avec votre compte Exa.

Exa est disponible sous forme de plugin sur la marketplace [Grok Build](https://docs.x.ai/build/overview). Il apporte à Grok la recherche web en temps réel, la lecture de pages et une compétence de recherche approfondie.

<div id="installation">
  ## Installation
</div>

<Steps>
  <Step title="Installer Grok Build">
    Installez le CLI Grok (voir la [documentation Grok Build](https://docs.x.ai/build/overview) pour plus de détails) :

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    Connectez-vous ensuite à votre compte xAI :

    ```bash theme={null}
    grok login
    ```
  </Step>

  <Step title="Ouvrir le marketplace">
    Démarrez Grok Build en exécutant `grok`, puis ouvrez le marketplace :

    ```text theme={null}
    /marketplace
    ```
  </Step>

  <Step title="Installer le plugin Exa">
    Repérez **exa** dans la liste et appuyez sur `i` pour l&#39;installer.
  </Step>

  <Step title="Se connecter à Exa">
    Ouvrez l&#39;onglet des MCP servers avec `/mcp`, sélectionnez **exa**, puis appuyez sur `i` pour vous connecter. Votre navigateur ouvre la page de connexion Exa. Les nouveaux comptes reçoivent des crédits gratuits à l&#39;inscription.
  </Step>
</Steps>

Dès qu&#39;exa affiche **ready**, posez à Grok toute question nécessitant le web.

<div id="what-you-get">
  ## Ce que vous obtenez
</div>

* **web&#95;search&#95;exa** : recherche web en temps réel. Prend en charge les requêtes en langage naturel et les filtres par catégorie tels que les actualités, les entreprises, les personnes, les papers de recherche et GitHub.
* **web&#95;fetch&#95;exa** : lit n&#39;importe quelle URL et renvoie le contenu de la page sous forme de markdown propre.
* **compétence exa-search** : une compétence de recherche approfondie. Demandez à Grok d&#39;approfondir un sujet : il lance plusieurs recherches, lit les meilleures sources et répond en citant ses sources.

<div id="example-prompts">
  ## Exemples de prompts
</div>

* « Recherche les actualités récentes sur xAI »
* « Lis [https://exa.ai](https://exa.ai) et fais-en un résumé »
* « Fais une analyse approfondie des moteurs d&#39;inférence open source »