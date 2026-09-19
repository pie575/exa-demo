> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="openhuman">
  # OpenHuman
</div>

> Offrez à l&#39;agent OpenHuman une recherche web en temps réel avec Exa, en mode managé ou avec votre propre API key Exa.

[OpenHuman](https://tinyhumans.gitbook.io/openhuman) de TinyHumans est un assistant IA de bureau doté d&#39;un outil de recherche web natif que l&#39;agent appelle de lui-même. Exa est le provider de recherche derrière cet outil.

| Approche              | Configuration          | Exécution                                                                         |
| --------------------- | ---------------------- | --------------------------------------------------------------------------------- |
| **OpenHuman Managed** | Aucune                 | Le backend d&#39;OpenHuman, propulsé par Exa. Aucune API key.                     |
| **Exa provider**      | Collez une API key Exa | Votre machine, directement vers `https://api.exa.ai` sur votre propre compte Exa. |

<div id="openhuman-managed">
  ## OpenHuman Managed
</div>

La managed search est l&#39;option par défaut. Choisissez **Simple** lors de l&#39;onboarding et l&#39;agent pourra effectuer des recherches sur le web immédiatement.

<Frame caption="Choisissez Simple lors de l'onboarding pour une managed search propulsée par Exa">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="L'onboarding OpenHuman demandant comment exécuter OpenHuman, avec l'option Simple sélectionnée" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **L&#39;option managed est le moyen le plus rapide d&#39;obtenir des résultats Exa.** Aucune clé à créer, stocker ou renouveler, aucun credential sur votre machine, et la search est facturée sur votre abonnement OpenHuman.
</Tip>

<div id="exa-provider">
  ## Exa provider
</div>

Configurez Exa directement pour exécuter les search sur votre propre compte Exa et donner à l&#39;agent accès aux tools search et contents de page d&#39;Exa.

<div id="get-your-exa-api-key">
  ### Obtenez votre API clé Exa
</div>

<Card title="Obtenez votre API clé Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé depuis le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
</Card>

<div id="add-exa-in-openhuman">
  ### Ajouter Exa dans OpenHuman
</div>

1. Ouvrez **Connections**, puis sélectionnez **Search engine** sous **API keys**.

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="La page Connections d'OpenHuman avec Search engine sélectionné sous API keys, affichant la liste des moteurs de recherche avec OpenHuman Managed actif" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. Sélectionnez **Exa**.

<Frame caption="Exa sélectionné, en attente d'une clé">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="L'option de moteur Exa sélectionnée dans le panneau Search engine d'OpenHuman, affichant le badge Needs API key" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. Collez votre clé dans **Exa API key**, puis sélectionnez **Save**.

<Frame caption="Enregistrer l'Exa API key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="Le champ Exa API key dans OpenHuman avec une clé saisie et le bouton Save visible" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="Exa configuré comme moteur de recherche actif">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="Le panneau Search engine d'OpenHuman avec Exa sélectionné et marqué Configured" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

<div id="configuration">
  ### Configuration
</div>

Le panneau écrit dans le fichier `config.toml` d&#39;OpenHuman. Vous pouvez aussi définir les mêmes valeurs directement dans le fichier ou dans l&#39;environnement :

<Tabs>
  <Tab title="config.toml">
    ```toml config.toml theme={null}
    [search]
    engine = "exa"        # requis
    max_results = 5       # optionnel, 1-20
    timeout_secs = 15     # optionnel

    [search.exa]
    api_key = "your-exa-api-key"   # requis
    ```
  </Tab>

  <Tab title="Environnement">
    ```bash theme={null}
    OPENHUMAN_SEARCH_ENGINE=exa
    EXA_API_KEY=your-exa-api-key
    ```

    <Note>
      `EXA_API_KEY` et `OPENHUMAN_EXA_API_KEY` remplacent tous deux `search.exa.api_key`. Si les deux sont définies, `OPENHUMAN_EXA_API_KEY` est prioritaire.
    </Note>
  </Tab>
</Tabs>

<div id="tools-the-agent-gets">
  ### Les tools dont dispose l&#39;agent
</div>

| Tool               | Retourne                                                                      |
| ------------------ | ----------------------------------------------------------------------------- |
| `web_search_tool`  | Une web search, assurée par Exa.                                              |
| `exa_search`       | Des pages classées avec titres, URL, dates de publication et texte optionnel. |
| `exa_get_contents` | Le contenu complet des URL fournies, avec summaries ou highlights en option.  |

L&#39;agent définit les [search parameters](/fr/docs/search/quickstart) d&#39;Exa à chaque call : de simples instructions suffisent donc à piloter le search mode, les domaines, les dates et les catégories.

<div id="troubleshooting">
  ## Dépannage
</div>

<AccordionGroup>
  <Accordion title="Exa search indisponible : aucune API key configurée">
    OpenHuman n&#39;a trouvé aucune clé dans le panneau **Search engine**, dans les variables `EXA_API_KEY` et `OPENHUMAN_EXA_API_KEY`, ni dans `search.exa.api_key`. Définissez-la à l&#39;un de ces emplacements, puis redémarrez OpenHuman si vous avez modifié `config.toml` pendant son exécution.
  </Accordion>

  <Accordion title="Exa a rejeté l'API key configurée (HTTP 401)">
    La clé est invalide ou révoquée. Vérifiez-la dans le [Exa Dashboard](https://dashboard.exa.ai/api-keys), puis cliquez sur **Clear** pour supprimer la clé stockée et enregistrez la bonne. Méfiez-vous des espaces copiés par inadvertance.
  </Accordion>

  <Accordion title="Exa a renvoyé un statut non 2xx">
    `429` indique un rate limit ou un quota épuisé : vérifiez votre usage dans le [dashboard](https://dashboard.exa.ai). Pour les erreurs `5xx`, réessayez, puis consultez les [error codes](/fr/docs/admin/error-codes).
  </Accordion>

  <Accordion title="OpenHuman Managed est absent de la liste des moteurs">
    Les sessions purement locales ne peuvent pas utiliser la managed search. Configurez l&#39;Exa provider avec votre propre clé.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

<Columns cols={3}>
  <Card title="Documentation web search d'OpenHuman" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search" cta="Ouvrir le guide" arrow="true">
    Consultez la référence d&#39;OpenHuman consacrée à ses moteurs de recherche.
  </Card>

  <Card title="Search API d'Exa" icon="search" href="/fr/docs/search/quickstart" cta="Lire le guide" arrow="true">
    Comprenez les search modes, les filtres et les content options qui sous-tendent les tools Exa.
  </Card>

  <Card title="Bonnes pratiques de recherche" icon="sparkles" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Tirez de meilleurs résultats de chaque query.
  </Card>
</Columns>