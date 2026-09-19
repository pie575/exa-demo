> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="hermes-agent">
  # Hermes Agent
</div>

> Offrez à Hermes Agent la recherche web en temps réel et l&#39;accès au contenu des pages avec Exa.

[Hermes Agent](https://github.com/NousResearch/hermes-agent) intègre Exa comme backend natif pour ses outils `web_search` et `web_extract` appelables par le modèle. Utilisez Exa pour ces deux capacités, ou associez-le à un autre provider web de Hermes.

<div id="connect-your-exa-account">
  ## Connectez votre compte Exa
</div>

<Steps>
  <Step title="Obtenir une API key Exa">
    <Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une key dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
    </Card>
  </Step>

  <Step title="Sélectionner Exa dans Hermes">
    Lancez l&#39;assistant de configuration des tools :

    ```bash theme={null}
    hermes tools
    ```

    Ouvrez **Web Search &amp; Extract**, choisissez Exa, puis sélectionnez l&#39;option reposant sur une API key. Saisissez votre API key Exa lorsque vous y êtes invité. Hermes stocke les secrets dans `~/.hermes/.env` et la provider selection dans `~/.hermes/config.yaml`.
  </Step>

  <Step title="Tester l'accès au web">
    Démarrez Hermes et demandez-lui de lancer une recherche, puis de lire l&#39;un des résultats :

    ```text theme={null}
    Recherche sur le web les dernières nouveautés produit d'Exa, puis lis le résultat le plus pertinent.
    ```

    Hermes doit appeler `web_search`, puis `web_extract` lorsqu&#39;il a besoin de la page elle-même.
  </Step>
</Steps>

<div id="configure-manually">
  ## Configuration manuelle
</div>

Ajoutez votre key au fichier d&#39;environnement de Hermes :

```bash ~/.hermes/.env theme={null}
EXA_API_KEY=your-exa-api-key
```

Sélectionnez ensuite Exa pour les deux capacités web :

```yaml ~/.hermes/config.yaml theme={null}
web:
  search_backend: "exa"
  extract_backend: "exa"
```

Vous pouvez utiliser le mécanisme de repli partagé à la place :

```yaml ~/.hermes/config.yaml theme={null}
web:
  backend: "exa"
```

Les paramètres propres à chaque capacité l&#39;emportent sur `web.backend`. Vous pouvez ainsi utiliser Exa uniquement pour la search ou uniquement pour l&#39;extraction lorsque vous combinez plusieurs providers.

<div id="tools-hermes-gets">
  ## Les tools dont dispose Hermes
</div>

| Tool          | Comportement d&#39;Exa                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `web_search`  | Effectue une recherche avec Exa et renvoie des pages classées avec leurs titres, URL et extraits de texte. |
| `web_extract` | Récupère le contenu lisible d&#39;une ou plusieurs URL via Exa Contents.                                   |

Hermes tronque les pages extraites trop longues selon le character budget configuré et enregistre le texte complet sur disque. Modifiez la valeur par défaut avec `web.extract_char_limit`, ou laissez l&#39;agent demander un `char_limit` plus élevé pour un call donné.

<Note>
  Hermes peut utiliser Exa via son pool de providers gratuits sans API key. Ce pool est soumis à des limites de débit et peut alterner entre les providers. Configurez `EXA_API_KEY` et sélectionnez l&#39;option Exa adossée à une API key si vous souhaitez que les requêtes passent systématiquement par votre compte Exa.
</Note>

<div id="troubleshooting">
  ## Dépannage
</div>

<AccordionGroup>
  <Accordion title="Hermes ne sélectionne pas Exa">
    Exécutez `hermes tools` et sélectionnez explicitement Exa. Si vous modifiez les fichiers de configuration manuellement, vérifiez que `web.search_backend`, `web.extract_backend` ou `web.backend` a bien pour valeur `exa`.
  </Accordion>

  <Accordion title="Hermes signale que EXA_API_KEY est manquante">
    Ajoutez la key dans `~/.hermes/.env`, puis redémarrez Hermes pour qu&#39;il recharge l&#39;environnement.
  </Accordion>

  <Accordion title="La recherche fonctionne, mais l'extraction passe par un autre provider">
    Hermes permet de configurer la recherche et l&#39;extraction indépendamment l&#39;une de l&#39;autre. Attribuez la valeur `exa` à la fois à `web.search_backend` et à `web.extract_backend`.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

<Columns cols={3}>
  <Card title="Outils web Hermes" icon="book-open" href="https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search" cta="Lire le guide" arrow="true">
    Découvrez la sélection de provider, la mise en cache et le comportement d&#39;extraction de Hermes.
  </Card>

  <Card title="Exa Search" icon="search" href="/fr/docs/search/quickstart" cta="Lire le guide" arrow="true">
    Découvrez comment Exa effectue ses recherches, filtre et renvoie le contenu des pages.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/fr/docs/contents/quickstart" cta="Lire le guide" arrow="true">
    Comprenez l&#39;API d&#39;extraction qui alimente `web_extract`.
  </Card>
</Columns>