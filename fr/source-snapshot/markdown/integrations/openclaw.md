> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# OpenClaw {#openclaw}

> Offrez à OpenClaw la recherche web en temps réel et les page contents avec Exa.

[OpenClaw](https://openclaw.ai/) prend en charge Exa comme fournisseur `web_search` natif. Une fois Exa sélectionné, chaque agent OpenClaw peut utiliser les modes de recherche Exa, les filtres de date et l&#39;extraction de contenu via l&#39;outil web intégré.

## Configurer Exa {#set-up-exa}

<Steps>
  <Step title="Installer le plugin Exa">
    ```bash theme={null}
    openclaw plugins install @openclaw/exa-plugin
    openclaw gateway restart
    ```
  </Step>

  <Step title="Obtenir une API key Exa">
    <Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
    </Card>
  </Step>

  <Step title="Stocker la clé">
    Pour une installation avec gateway, ajoutez la clé dans `~/.openclaw/.env` :

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

    Choisissez **Exa** comme fournisseur de recherche web. OpenClaw enregistre le fournisseur sélectionné dans sa configuration et lit les identifiants depuis `EXA_API_KEY`.
  </Step>
</Steps>

## Configurer manuellement {#configure-manually}

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

Pour stocker la clé dans la configuration plutôt que dans l&#39;environnement du gateway :

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
  Privilégiez `EXA_API_KEY` ou un SecretRef OpenClaw plutôt que de committer une API key dans un fichier de configuration.
</Note>

## Ce que les agents peuvent demander {#what-agents-can-request}

OpenClaw expose Exa via `web_search`.

| Paramètre                    | Utilité                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `query`                      | La requête de recherche web.                                                             |
| `count`                      | Nombre de résultats, jusqu&#39;à 100 et dans la limite du type de recherche sélectionné. |
| `type`                       | Mode de recherche Exa : `auto`, `neural`, `fast`, `instant`, `deep` et `deep-reasoning`. |
| `freshness`                  | Limite les résultats au jour, à la semaine, au mois ou à l&#39;année écoulés.            |
| `date_after` / `date_before` | Limite les résultats à des bornes au format `YYYY-MM-DD`.                                |
| `contents`                   | Renvoie le texte intégral, les highlights ou des résumés avec chaque résultat.           |

Si `contents` est omis, OpenClaw demande les highlights par défaut. L&#39;agent peut demander une autre forme de contenu lorsqu&#39;il a besoin de pages complètes ou de résumés :

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

Par défaut, OpenClaw met en cache les résultats de recherche web pendant 15 minutes. Modifiez `tools.web.search.cacheTtlMinutes` ou définissez cette valeur sur `0` si chaque requête doit renvoyer des données fraîches.

## Dépannage {#troubleshooting}

<AccordionGroup>
  <Accordion title="OpenClaw n'affiche pas Exa comme fournisseur">
    Installez `@openclaw/exa-plugin`, redémarrez le gateway, puis exécutez à nouveau `openclaw configure --section web`.
  </Accordion>

  <Accordion title="OpenClaw signale une clé Exa manquante">
    Vérifiez que `EXA_API_KEY` est accessible au processus du gateway, et pas uniquement à votre shell interactif. Pour une installation en gateway, placez-la dans `~/.openclaw/.env` et redémarrez le gateway.
  </Accordion>

  <Accordion title="Les résultats de search semblent obsolètes">
    OpenClaw met les résultats en cache indépendamment d&#39;Exa. Réduisez `tools.web.search.cacheTtlMinutes` ou définissez-le à `0`, puis utilisez les options de fraîcheur du contenu d&#39;Exa lorsque vous demandez des page contents.
  </Accordion>
</AccordionGroup>

## Ressources {#resources}

<Columns cols={3}>
  <Card title="Exa fournisseur OpenClaw" icon="book-open" href="https://docs.openclaw.ai/tools/exa-search" cta="Lire le guide" arrow="true">
    Consultez la configuration actuelle du plugin et les paramètres de l&#39;outil.
  </Card>

  <Card title="Exa Search" icon="search" href="/fr/docs/search/quickstart" cta="Lire le guide" arrow="true">
    Comparez les modes de recherche Exa et les formats de réponse.
  </Card>

  <Card title="Fraîcheur du contenu" icon="clock" href="/fr/docs/contents/quickstart#content-freshness" cta="Lire le guide" arrow="true">
    Contrôlez les page contents indexés et récupérés en direct.
  </Card>
</Columns>