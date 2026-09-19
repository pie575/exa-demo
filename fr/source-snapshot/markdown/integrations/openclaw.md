> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="openclaw">
  # OpenClaw
</div>

> Offrez à OpenClaw la recherche web en temps réel et les page contents avec Exa.

[OpenClaw](https://openclaw.ai/) prend en charge Exa comme provider `web_search` natif. Une fois Exa sélectionné, chaque agent OpenClaw peut utiliser les search modes d&#39;Exa, les filtres de date et l&#39;extraction de contenu via l&#39;outil web intégré.

<div id="set-up-exa">
  ## Configurer Exa
</div>

<Steps>
  <Step title="Installer le plugin Exa">
    ```bash theme={null}
    openclaw plugins install @openclaw/exa-plugin
    openclaw gateway restart
    ```
  </Step>

  <Step title="Obtenir une API key Exa">
    <Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une clé dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
    </Card>
  </Step>

  <Step title="Enregistrer la clé">
    Pour une installation via gateway, ajoutez la clé au fichier `~/.openclaw/.env` :

    ```bash ~/.openclaw/.env theme={null}
    EXA_API_KEY=your-exa-api-key
    ```

    Redémarrez le gateway après avoir modifié son environnement.
  </Step>

  <Step title="Sélectionner Exa pour la recherche web">
    Exécutez :

    ```bash theme={null}
    openclaw configure --section web
    ```

    Choisissez **Exa** comme provider de recherche web. OpenClaw enregistre ce choix de provider dans sa configuration et lit le credential depuis `EXA_API_KEY`.
  </Step>
</Steps>

<div id="configure-manually">
  ## Configuration manuelle
</div>

Vous pouvez sélectionner Exa directement dans la configuration JSON5 d&#39;OpenClaw :

```json5 theme={null}
{
  tools: {
    web: {
      search: {
        provider: "exa",
      },
    },
  },
}
```

Pour stocker la key dans la configuration plutôt que dans l&#39;environnement du gateway :

```json5 theme={null}
{
  plugins: {
    entries: {
      exa: {
        config: {
          webSearch: {
            apiKey: "exa-...",
          },
        },
      },
    },
  },
}
```

<Note>
  Privilégiez `EXA_API_KEY` ou une SecretRef OpenClaw plutôt que d&#39;inscrire une API key dans un fichier de configuration.
</Note>

<div id="what-agents-can-request">
  ## Ce que les agents peuvent demander
</div>

OpenClaw expose Exa via `web_search`.

| Paramètre                    | Utilité                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `query`                      | La requête de recherche web.                                                             |
| `count`                      | Nombre de résultats, jusqu&#39;à 100 et dans la limite du search type sélectionné.       |
| `type`                       | Search mode d&#39;Exa : `auto`, `neural`, `fast`, `instant`, `deep` et `deep-reasoning`. |
| `freshness`                  | Limiter les résultats au jour, à la semaine, au mois ou à l&#39;année écoulés.           |
| `date_after` / `date_before` | Limiter les résultats à des bornes au format `YYYY-MM-DD`.                               |
| `contents`                   | Renvoyer le full text, les highlights ou les summaries avec chaque résultat.             |

Si `contents` est omis, OpenClaw demande les highlights par défaut. L&#39;agent peut demander un autre format de contenu lorsqu&#39;il a besoin de pages complètes ou de summaries :

```javascript theme={null}
await web_search({
  query: "transformer architecture explained",
  type: "neural",
  contents: {
    text: { maxCharacters: 5000 },
    highlights: { numSentences: 3 },
    summary: true,
  },
});
```

Par défaut, OpenClaw met en cache les résultats de recherche web pendant 15 minutes. Modifiez `tools.web.search.cacheTtlMinutes` ou définissez cette valeur sur `0` si chaque requête doit renvoyer des résultats à jour.

<div id="troubleshooting">
  ## Dépannage
</div>

<AccordionGroup>
  <Accordion title="OpenClaw n'affiche pas Exa parmi les providers">
    Installez `@openclaw/exa-plugin`, redémarrez le gateway, puis exécutez de nouveau `openclaw configure --section web`.
  </Accordion>

  <Accordion title="OpenClaw signale une clé Exa manquante">
    Vérifiez que `EXA_API_KEY` est accessible au processus gateway, et pas seulement à votre shell interactif. Pour une installation en mode gateway, placez la variable dans `~/.openclaw/.env`, puis redémarrez le gateway.
  </Accordion>

  <Accordion title="Les résultats de recherche semblent obsolètes">
    OpenClaw met les résultats en cache indépendamment d&#39;Exa. Réduisez `tools.web.search.cacheTtlMinutes` ou définissez-le à `0`, puis utilisez les options de content freshness d&#39;Exa lorsque vous demandez le page contents.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

<Columns cols={3}>
  <Card title="Exa provider pour OpenClaw" icon="book-open" href="https://docs.openclaw.ai/tools/exa-search" cta="Lire le guide" arrow="true">
    Consultez la configuration actuelle du plugin et les paramètres de l&#39;outil.
  </Card>

  <Card title="Exa Search" icon="search" href="/fr/docs/search/quickstart" cta="Lire le guide" arrow="true">
    Comparez les search modes et les formats de réponse d&#39;Exa.
  </Card>

  <Card title="Content freshness" icon="clock" href="/fr/docs/contents/quickstart#content-freshness" cta="Lire le guide" arrow="true">
    Contrôlez les page contents indexés et récupérés en temps réel.
  </Card>
</Columns>