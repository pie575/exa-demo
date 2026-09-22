> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Exa dans Codex et ChatGPT {#exa-in-codex-and-chatgpt}

> Recherchez sur le web, lisez n&#39;importe quelle page et menez vos recherches avec Exa directement depuis Codex et ChatGPT.

Installez le plugin Exa une seule fois pour donner à Codex et ChatGPT un accès au web en temps réel via Exa. Trouvez des informations à jour, consultez les sources qui comptent et lancez des recherches approfondies sans quitter votre conversation ou votre session de code.

## Installer Exa {#install-exa}

<Steps>
  <Step title="Ouvrir le plugin">
    Rendez-vous sur [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Le lien ouvre **Exa** dans l&#39;annuaire de plugins d&#39;OpenAI, le même pour ChatGPT et pour Codex.
  </Step>

  <Step title="L'installer">
    Cliquez sur le bouton plus pour lancer l&#39;installation. Connectez-vous à Exa lorsque vous y êtes invité, soit pendant l&#39;installation, soit la première fois que Codex ou ChatGPT l&#39;utilise.

    <Frame caption="Ouverture des Plugins dans Codex, ajout d'Exa et autorisation d'accès">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Ouverture des Plugins dans Codex, consultation du plugin Exa et autorisation d'accès" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="Démarrer une nouvelle session">
    Les skills se chargent dans les conversations et les sessions CLI démarrées après l&#39;installation : ouvrez-en donc une nouvelle et posez une question qui nécessite le web.
  </Step>
</Steps>

C&#39;est tout. Le plugin comprend à la fois l&#39;integration MCP d&#39;Exa et les skills : aucune configuration MCP ou skill supplémentaire n&#39;est nécessaire.

## Développez avec ce que le web propose à l&#39;instant T {#build-with-whats-on-the-web-right-now}

Les bibliothèques, API et tools que vous utilisez évoluent chaque jour. Une fois Exa installé, Codex peut rechercher la documentation, les issues, les changelogs et les exemples concrets les plus récents pendant qu&#39;il travaille.

Depuis votre repo :

```text theme={null}
Nous utilisons Tailwind v3. Cherche le guide de migration vers Tailwind v4, lis-le,
puis fais migrer ce projet vers la v4.
```

Codex peut effectuer une recherche avec Exa, lire les sources pertinentes et s&#39;appuyer sur ce qu&#39;il trouve pour apporter la modification dans votre base de code.

Le même principe s&#39;applique dès que la réponse se trouve potentiellement en dehors de votre repo :

* « Cherche dans les issues et le changelog de `tokio-tungstenite` des informations sur cette erreur avant d&#39;essayer de la corriger. »
* « Trouve de vrais exemples de verrous consultatifs Postgres en Rust et recommande le modèle adapté à ce pool de workers. »
* « Lis la documentation actuelle des webhooks Stripe et compare-la à notre implémentation. »
* « Cherche le guide de migration le plus récent pour cette dépendance, puis mets-la à niveau. »

## Rechercher, lire et approfondir {#search-read-and-research}

Le plugin Exa offre à Codex et ChatGPT trois façons d&#39;exploiter le web.

<Columns cols={3}>
  <Card title="Search" icon="search">
    Lancez une recherche en langage naturel et récupérez le contenu des meilleures pages, plutôt qu&#39;une simple liste de liens.
  </Card>

  <Card title="Lecture" icon="file-text">
    Faites-lui lire la page de votre choix : documentation, changelog, issue ou article de blog.
  </Card>

  <Card title="Recherche" icon="compass">
    Traitez une question qui nécessite plusieurs recherches et obtenez une réponse accompagnée de citations.
  </Card>
</Columns>

## Faire ses recherches sans quitter ChatGPT {#research-without-leaving-chatgpt}

Exa fonctionne aussi dans ChatGPT. Posez une question qui nécessite des informations récentes et utilisez Exa pour explorer le web et mener vos recherches directement depuis la conversation.

```text theme={null}
Compare les offres managées, les licences et la tarification des principales
bases de données vectorielles open source. Appuie-toi sur des sources primaires à jour et cite-les.
```

Plutôt que de s&#39;appuyer uniquement sur les informations déjà présentes dans son context, ChatGPT peut utiliser Exa pour trouver et lire les sources nécessaires à la tâche.

Utilisez-le pour de la recherche concurrentielle, de la recherche technique, de la cartographie de marché, de la recherche sur des entreprises, ou pour tout autre cas où la réponse est dispersée sur le web.

## MCP + skills, ensemble {#mcp-skills-together}

En coulisses, le plugin réunit deux composants de la pile d&#39;agents d&#39;Exa.

[Exa MCP](/fr/docs/get-started/exa-mcp) fournit à Codex et ChatGPT les tools nécessaires pour accéder à Exa. C&#39;est le lien entre l&#39;agent et les capacités de search et de recherche d&#39;Exa.

Les [skills Exa](/fr/docs/get-started/agent-skills/overview) donnent à l&#39;agent des instructions supplémentaires pour exploiter ces capacités dans des workflows utiles, notamment la recherche web et [Exa Agent](/fr/docs/agent/quickstart).

Il n&#39;est pas nécessaire de configurer l&#39;un ou l&#39;autre séparément : tout est pris en charge à l&#39;installation du plugin.

## Vous préférez utiliser MCP directement ? {#prefer-mcp-directly}

Le plugin est la méthode recommandée pour utiliser Exa avec Codex et ChatGPT. Si vous configurez Codex manuellement ou utilisez un autre MCP client, vous pouvez vous connecter directement au MCP server hébergé d&#39;Exa :

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

Consultez [Exa MCP](/fr/docs/get-started/exa-mcp) pour les autres clients, les options de configuration et les tools disponibles.

<Card title="Installer Exa pour ChatGPT et Codex" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  Ajoutez le plugin Exa depuis le marketplace ChatGPT.
</Card>