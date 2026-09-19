> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-in-codex-and-chatgpt">
  # Exa dans Codex et ChatGPT
</div>

> Recherchez sur le web, lisez n&#39;importe quelle page et menez vos recherches avec Exa directement depuis Codex et ChatGPT.

Installez le plugin Exa une seule fois pour donner à Codex et ChatGPT accès au web en temps réel via Exa. Trouvez des informations à jour, consultez les sources qui comptent et menez des recherches plus approfondies sans quitter votre conversation ou votre session de développement.

<div id="install-exa">
  ## Installer Exa
</div>

<Steps>
  <Step title="Ouvrir le plugin">
    Rendez-vous sur [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Le lien ouvre **Exa** dans le répertoire de plugins d&#39;OpenAI, commun à ChatGPT et à Codex.
  </Step>

  <Step title="L'installer">
    Cliquez sur le bouton plus pour lancer l&#39;installation. Connectez-vous à Exa lorsque vous y êtes invité, pendant l&#39;installation ou lors de la première utilisation par Codex ou ChatGPT.

    <Frame caption="Ouverture des plugins dans Codex, ajout d'Exa et autorisation de l'accès">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Ouverture des plugins dans Codex, affichage du plugin Exa et autorisation de l'accès" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="Démarrer une nouvelle session">
    Les skills ne se chargent que dans les conversations et les sessions CLI ouvertes après l&#39;installation : démarrez-en une nouvelle et formulez une demande qui nécessite le web.
  </Step>
</Steps>

C&#39;est tout. Le plugin inclut à la fois l&#39;intégration MCP d&#39;Exa et les skills : aucune configuration MCP ou skill supplémentaire n&#39;est nécessaire.

<div id="build-with-whats-on-the-web-right-now">
  ## Développez avec ce qui est disponible sur le web à l&#39;instant même
</div>

Les bibliothèques, API et tools que vous utilisez évoluent chaque jour. Une fois Exa installé, Codex peut rechercher la documentation, les issues, les changelogs et les exemples concrets les plus récents tout en travaillant.

Depuis votre dépôt :

```text theme={null}
Nous sommes en Tailwind v3. Cherche le guide de migration vers Tailwind v4, lis-le,
puis fais migrer ce projet vers la v4.
```

Codex peut effectuer une recherche avec Exa, lire les sources pertinentes et utiliser ce qu&#39;il trouve pour apporter la modification dans votre base de code.

Le même principe s&#39;applique dès que la réponse peut se trouver ailleurs que dans votre dépôt :

* « Cherche dans les issues et le changelog de `tokio-tungstenite` des informations sur cette erreur avant d&#39;essayer de la corriger. »
* « Trouve de vrais exemples de verrous consultatifs (advisory locks) Postgres en Rust et recommande le motif le mieux adapté à ce pool de workers. »
* « Lis la documentation actuelle des webhooks Stripe et compare notre implémentation à celle-ci. »
* « Cherche le guide de migration le plus récent pour cette dépendance, puis mets-la à jour. »

<div id="search-read-and-research">
  ## Rechercher, lire et approfondir
</div>

Le plugin Exa offre à Codex et ChatGPT trois façons d&#39;exploiter le web.

<Columns cols={3}>
  <Card title="Rechercher" icon="search">
    Lancez une recherche en langage naturel et récupérez le contenu des meilleures pages, pas une simple liste de liens.
  </Card>

  <Card title="Lire" icon="file-text">
    Faites-lui lire la page de votre choix : documentation, changelog, issue ou article de blog.
  </Card>

  <Card title="Approfondir" icon="compass">
    Traitez une question qui nécessite plusieurs recherches et obtenez une réponse accompagnée de citations.
  </Card>
</Columns>

<div id="research-without-leaving-chatgpt">
  ## Faire des recherches sans quitter ChatGPT
</div>

Exa fonctionne aussi dans ChatGPT. Posez une question qui nécessite des informations à jour et utilisez Exa pour rechercher et explorer le web directement depuis la conversation.

```text theme={null}
Compare les offres managées, les licences et les tarifs des principales
bases de données vectorielles open source. Appuie-toi sur des sources
primaires à jour et cite-les.
```

Plutôt que de s&#39;appuyer uniquement sur les informations déjà présentes dans le context, ChatGPT peut utiliser Exa pour trouver et lire les sources nécessaires à la tâche.

Utilisez-le pour de la recherche concurrentielle, de la recherche technique, de la cartographie de marché, de la recherche d&#39;entreprises ou pour tout autre besoin dont la réponse se trouve quelque part sur le web.

<div id="mcp-skills-together">
  ## MCP + skills, ensemble
</div>

En coulisses, le plugin combine deux composants de la pile d&#39;agents d&#39;Exa.

[Exa MCP](/fr/docs/get-started/exa-mcp) fournit à Codex et ChatGPT les tools nécessaires pour accéder à Exa. C&#39;est le lien entre l&#39;agent et les capabilities de search et de recherche d&#39;Exa.

Les [skills Exa](/fr/docs/get-started/agent-skills/overview) donnent à l&#39;agent des instructions supplémentaires pour exploiter ces capabilities dans des workflows utiles, notamment la recherche web et [Exa Agent](/fr/docs/agent/quickstart).

Aucun des deux n&#39;a besoin d&#39;être configuré séparément : il suffit d&#39;installer le plugin.

<div id="prefer-mcp-directly">
  ## Vous préférez passer directement par MCP ?
</div>

Le plugin est la méthode recommandée pour utiliser Exa avec Codex et ChatGPT. Si vous configurez Codex manuellement ou si vous utilisez un autre client MCP, vous pouvez vous connecter directement au MCP server hébergé d&#39;Exa :

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

Consultez [Exa MCP](/fr/docs/get-started/exa-mcp) pour découvrir les autres clients, les options de configuration et les tools disponibles.

<Card title="Installer Exa pour ChatGPT et Codex" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  Ajoutez le plugin Exa depuis le marketplace ChatGPT.
</Card>