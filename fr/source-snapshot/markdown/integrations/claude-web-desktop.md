> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-in-claude-code-web-and-desktop">
  # Exa dans Claude Code, Web et Desktop
</div>

> Recherchez sur le web et consultez n&#39;importe quelle page avec Exa, directement depuis Claude

Installez Exa dans Claude Code ou connectez-le à Claude Web, Desktop et Cowork pour donner à Claude accès aux informations les plus récentes du web. Claude peut lancer des recherches en langage naturel, lire les pages pertinentes et s&#39;appuyer sur ces sources pendant son travail.

<div id="install-exa">
  ## Installer Exa
</div>

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
          Démarrez une nouvelle conversation et posez une question nécessitant des informations à jour issues du web.
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
          Ouvrez une nouvelle session Claude Code pour que le plugin se charge, puis posez une question nécessitant un accès au web.

          <Frame caption="Ouverture d'une nouvelle session Claude Code et question nécessitant un accès au web">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="Ouverture d'une nouvelle session Claude Code et question nécessitant un accès au web" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

Ces deux options rendent Exa disponible sans avoir à modifier de fichier de configuration MCP.

<div id="work-with-whats-on-the-web-right-now">
  ## Travaillez avec ce qui est sur le web en ce moment même
</div>

Dans Claude Code, Exa peut rechercher la documentation à jour, les issues, les changelogs et des exemples concrets pendant que vous travaillez dans votre repository. La même intégration donne à Claude Web, Desktop et Cowork accès à l&#39;actualité, aux travaux de recherche, aux informations sur les entreprises, aux détails produits et à d&#39;autres sources qui ne figurent pas forcément déjà dans le contexte.

```text theme={null}
Nous sommes en Tailwind v3. Utilise Exa pour trouver et lire le guide officiel
de migration vers Tailwind v4, puis fais migrer ce projet vers la v4.
```

Claude Code peut utiliser ce qu&#39;il trouve pour apporter la modification dans votre base de code. Dans les autres clients Claude, il peut exploiter les mêmes sources dans les réponses, les artefacts et les tâches Cowork.

Le même principe s&#39;applique dès que la réponse dépend de sources web actuelles ou précises :

* « Trouve les dernières notes de version de cette dépendance et résume les changements incompatibles. »
* « Recherche des travaux de recherche primaire récents sur la mise à l&#39;échelle au moment de l&#39;inférence et compare les méthodes. »
* « Lis la documentation actuelle des webhooks Stripe et explique le comportement de relance recommandé. »
* « Trouve les pages de tarifs officielles de ces produits et compare leurs formules d&#39;entrée de gamme. »

<div id="search-read-and-research">
  ## Rechercher, lire et enquêter
</div>

L&#39;intégration Exa donne à Claude des tools pour rechercher et lire le web, qu&#39;il peut combiner au fil d&#39;une tâche de recherche plus longue.

<Columns cols={3}>
  <Card title="Rechercher" icon="search">
    Lancez une recherche en langage naturel et obtenez le contenu des pages pertinentes, et pas seulement une liste de liens.
  </Card>

  <Card title="Lire" icon="file-text">
    Lisez la page de votre choix : documentation, travaux de recherche, changelogs, issues et articles.
  </Card>

  <Card title="Enquêter" icon="compass">
    Lancez plusieurs recherches, examinez les pages utiles et regroupez les éléments recueillis dans une réponse sourcée.
  </Card>
</Columns>

<div id="research-without-leaving-claude">
  ## Faire vos recherches sans quitter Claude
</div>

Demandez le résultat que vous souhaitez et précisez à Claude quels types de sources comptent :

```text theme={null}
Compare les offres managées, les licences et les tarifs des principales
bases de données vectorielles open source. Appuie-toi sur des sources
primaires à jour et cite-les.
```

Claude peut utiliser Exa tout au long de la conversation pour trouver et lire les sources nécessaires à la tâche. Utilisez cette approche pour la recherche technique, l&#39;analyse concurrentielle, la cartographie de marché, la recherche d&#39;entreprises ou toute question dont la réponse est dispersée sur le web.

<div id="use-exa-in-cowork">
  ## Utiliser Exa dans Cowork
</div>

Le même connecteur est disponible dans Cowork. Confiez à Claude une tâche qui dépend d&#39;informations externes : il pourra effectuer des recherches ou consulter des pages tout en travaillant avec vos fichiers et les autres tools connectés.

```text theme={null}
Relis cette note concurrentielle, vérifie chaque affirmation tarifaire avec Exa
sur les pages actuelles des fournisseurs, puis mets à jour le document avec les citations.
```

<div id="prefer-mcp-directly">
  ## Vous préférez utiliser MCP directement ?
</div>

Si vous configurez Claude manuellement ou si vous utilisez un autre client MCP, vous pouvez vous connecter directement au serveur MCP hébergé d&#39;Exa :

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

Consultez [Exa MCP](/fr/docs/get-started/exa-mcp) pour découvrir les autres clients, les options de configuration et les tools disponibles.

<Card title="Ouvrir le connecteur Exa" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Ajoutez Exa depuis l&#39;annuaire de connecteurs de Claude.
</Card>