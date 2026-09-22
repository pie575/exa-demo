> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Exa dans Claude Code, Web et Desktop {#exa-in-claude-code-web-and-desktop}

> Recherchez sur le web et consultez n&#39;importe quelle page avec Exa, directement depuis Claude

Installez Exa dans Claude Code ou connectez-le à Claude Web, Desktop et Cowork pour donner à Claude accès aux informations les plus récentes du web. Claude peut effectuer des recherches en langage naturel, lire les pages pertinentes et s&#39;appuyer sur ces sources pendant qu&#39;il travaille.

## Installer Exa {#install-exa}

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web, Desktop et Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="Ouvrir l'annuaire des connecteurs">
          Dans une nouvelle conversation Claude, cliquez sur le bouton plus, choisissez **Add connector**, puis recherchez **Exa**.
        </Step>

        <Step title="Connecter Exa">
          Ouvrez Exa, sélectionnez **Connect to Claude**, puis autorisez l&#39;accès lorsque vous y êtes invité.

          <Frame caption="Ouverture de l'annuaire des connecteurs dans Claude, recherche d'Exa, connexion et autorisation d'accès">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Ouverture de l'annuaire des connecteurs dans Claude, recherche d'Exa, connexion et autorisation d'accès" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Utiliser Exa">
          Démarrez une nouvelle conversation et posez une question qui nécessite des informations à jour issues du web.
        </Step>
      </Steps>
    </Tab>

    <Tab title="Claude Code CLI" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude-code.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=f7f017b187974c56e5822d7baf8272fa" width="16" height="16" data-path="images/mcp-clients/claude-code.svg">
      <Steps>
        <Step title="Installer le plugin">
          Installez Exa depuis le terminal :

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Vous pouvez aussi saisir `/plugin` dans Claude Code, rechercher **Exa**, puis l&#39;installer.
        </Step>

        <Step title="Démarrer une nouvelle session">
          Ouvrez une nouvelle session Claude Code pour que le plugin se charge, puis posez une question qui nécessite le web.

          <Frame caption="Ouverture d'une nouvelle session Claude Code et question nécessitant le web">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="Ouverture d'une nouvelle session Claude Code et question nécessitant le web" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

Ces deux options rendent Exa disponible sans avoir à modifier de fichier de configuration MCP.

## Travaillez avec ce qui est disponible sur le web en temps réel {#work-with-whats-on-the-web-right-now}

Dans Claude Code, Exa peut rechercher la documentation à jour, les issues, les changelogs et des exemples concrets pendant que vous travaillez dans votre repository. La même integration donne à Claude Web, Desktop et Cowork accès à l&#39;actualité, à des recherches, à des informations sur les entreprises, à des détails produits et à d&#39;autres sources qui ne figurent pas nécessairement déjà dans le context.

```text theme={null}
Nous sommes en Tailwind v3. Utilise Exa pour trouver et lire le guide officiel
de migration vers Tailwind v4, puis fais passer ce projet en v4.
```

Claude Code peut utiliser ce qu&#39;il trouve pour effectuer la modification dans votre base de code. Dans les autres clients Claude, il peut exploiter les mêmes sources dans ses réponses, ses artefacts et ses tâches Cowork.

Le même principe s&#39;applique dès que la réponse dépend de sources web récentes ou précises :

* « Trouve les dernières notes de version de cette dépendance et résume les changements incompatibles. »
* « Recherche des travaux de recherche primaires récents sur le passage à l&#39;échelle au moment de l&#39;inférence et compare les méthodes. »
* « Lis la documentation actuelle des webhooks Stripe et explique le comportement de réessai recommandé. »
* « Trouve les pages de tarification officielles de ces produits et compare leurs offres d&#39;entrée de gamme. »

## Rechercher, lire et mener des recherches {#search-read-and-research}

L&#39;integration Exa met à la disposition de Claude des tools pour rechercher et lire le web, qu&#39;il peut combiner au fil d&#39;une tâche de recherche plus longue.

<Columns cols={3}>
  <Card title="Rechercher" icon="search">
    Effectuez une recherche en langage naturel et obtenez le contenu des pages pertinentes, pas seulement une liste de liens.
  </Card>

  <Card title="Lire" icon="file-text">
    Lisez la page de votre choix : documentation, travaux de recherche, changelogs, issues ou articles.
  </Card>

  <Card title="Recherche" icon="compass">
    Lancez plusieurs recherches, examinez les pages utiles et combinez les preuves en une réponse sourcée.
  </Card>
</Columns>

## Faire des recherches sans quitter Claude {#research-without-leaving-claude}

Demandez le résultat souhaité et précisez à Claude quels types de sources comptent :

```text theme={null}
Compare les offres managées, les licences et la tarification des principales
bases de données vectorielles open source. Appuie-toi sur des sources primaires à jour et cite-les.
```

Claude peut utiliser Exa tout au long de la conversation pour trouver et lire les sources nécessaires à la tâche. Utilisez-le pour la recherche technique, l&#39;analyse concurrentielle, la cartographie de marché, la recherche sur des entreprises ou toute question dont la réponse se trouve dispersée sur le web.

## Utiliser Exa dans Cowork {#use-exa-in-cowork}

Le même connecteur est disponible dans Cowork. Confiez à Claude une tâche qui dépend d&#39;informations externes : il peut effectuer des recherches ou consulter des pages tout en travaillant avec vos fichiers et les autres tools connectés.

```text theme={null}
Relis ce brief concurrentiel, vérifie chaque affirmation de tarification
avec Exa sur les pages actuelles des vendors, puis mets à jour le document
avec les citations.
```

## Vous préférez utiliser MCP directement ? {#prefer-mcp-directly}

Si vous configurez Claude manuellement ou utilisez un autre client MCP, vous pouvez vous connecter directement au MCP server hébergé d&#39;Exa :

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

Consultez [Exa MCP](/fr/docs/get-started/exa-mcp) pour les autres clients, les options de configuration et les tools disponibles.

<Card title="Ouvrir le connecteur Exa" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Ajoutez Exa depuis l&#39;annuaire des connecteurs de Claude.
</Card>