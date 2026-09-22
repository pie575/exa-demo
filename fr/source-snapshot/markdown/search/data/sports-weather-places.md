> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Sports, météo et lieux {#sports-weather-places}

> Trouvez des données sportives en direct, des prévisions météo et des lieux à proximité avec Exa Search.

export const PlaygroundQuery = ({query, category, filters}) => {
  const PLAYGROUND = "https://dashboard.exa.ai/playground/search";
  const DEFAULT_FILTERS = {
    type: "auto",
    highlights: true
  };
  const params = [`q=${encodeURIComponent(query)}`];
  if (category) params.push(`c=${encodeURIComponent(category)}`);
  params.push(`filters=${encodeURIComponent(JSON.stringify({
    ...DEFAULT_FILTERS,
    ...filters
  }))}`);
  const href = `${PLAYGROUND}?${params.join("&")}`;
  return <div className="playground-query not-prose">
      <code className="playground-query-text">{query}</code>
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Ouvrir dans le playground de l’API" aria-label={`Ouvrir "${query}" dans le playground de l’API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Utilisez Exa Search pour obtenir des données sportives en direct, des prévisions météo et des informations locales sans avoir à intégrer une API distincte pour chacun de ces besoins. Posez une question en langage naturel en précisant l&#39;équipe, le lieu et la période qui vous intéressent.

## Rédiger de meilleures requêtes {#write-better-queries}

Nommez précisément le lieu ou l&#39;équipe et incluez une date dès que la réponse évolue dans le temps. Ajoutez la condition ou l&#39;attribut qui compte pour votre tâche plutôt que de demander des informations générales.

<Tabs>
  <Tab title="Sports" icon="trophy">
### Inclus {#included}

    Données sportives disponibles :

    * **Scores** : matchs d&#39;une ligue sur une journée, avec les équipes, les scores, le statut, l&#39;heure de début et le lieu
    * **Classements** : classements actuels des ligues, avec répartition par conférence ou division
    * **Calendriers** : résultats passés et matchs à venir pour une ligue ou une équipe

    La couverture inclut la NBA, la WNBA, la NFL, la MLB, la NHL, la MLS, le basketball et le football américain universitaires, les grands championnats européens de football et les compétitions de l&#39;UEFA, le cricket, la F1, l&#39;UFC, le tennis et le golf.

### Précisez la ligue, l&#39;équipe et la période {#ask-for-the-league-team-and-time}

    <PlaygroundQuery query="NBA scores last night" />

    <PlaygroundQuery query="Lakers schedule this week" />

### Ajoutez le contexte autour {#add-the-surrounding-story}

    Demandez les analyses dont vous avez besoin en complément des données en direct.

    <PlaygroundQuery query="NBA injury reports ahead of tonight's games" />
  </Tab>

  <Tab title="Météo" icon="cloud-sun">
### Inclus {#included-2}

    Les prévisions comprennent les conditions, les températures maximales et minimales, les précipitations, le vent, l&#39;humidité, l&#39;indice UV ainsi que le lever et le coucher du soleil à l&#39;heure locale du lieu.

    Une requête sans date renvoie les prévisions du jour. Demandez un jour ou une plage précise pour obtenir une page par jour, jusqu&#39;à 16 jours à l&#39;avance ou 92 jours en arrière.

### Nommez le lieu et le jour {#name-the-place-and-day}

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

### Interrogez la condition qui influe sur votre projet {#ask-about-the-condition-that-affects-your-plan}

    <PlaygroundQuery query="will it rain in Austin this weekend" />

### Combinez prévisions et analyses {#combine-forecasts-with-reporting}

    <PlaygroundQuery query="hurricane forecast tracks for the Gulf Coast this week" />
  </Tab>

  <Tab title="Lieux" icon="map-pin">
### Inclus {#included-3}

    * Fiches d&#39;entreprises locales, avec adresses, horaires, équipements et avis
    * Salles, attractions et points d&#39;intérêt
    * Annonces immobilières et records de propriété
    * Décisions de zonage, permis et records d&#39;urbanisme

### Décrivez le lieu comme si vous demandiez à un habitant {#describe-the-place-like-you-would-ask-a-local}

    Combinez la catégorie, le quartier et les attributs qui comptent.

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />

### Nommez le type de record et la zone géographique {#name-the-record-type-and-geography}

    <PlaygroundQuery query="multifamily zoning variances approved in Denver" />

### Comparez des lieux selon des contraintes concrètes {#compare-places-against-practical-constraints}

    <PlaygroundQuery query="walkable neighborhoods in Austin with good public schools and under 30 minutes to downtown" />
  </Tab>
</Tabs>

## Envoyer une requête {#make-a-request}

Les trois types de données utilisent le même endpoint Search.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "weather in San Francisco tomorrow",
      type="auto",
      num_results=5,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search("weather in San Francisco tomorrow", {
    type: "auto",
    numResults: 5,
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "weather in San Francisco tomorrow",
      "type": "auto",
      "numResults": 5
    }'
  ```
</CodeGroup>

## Obtenir des données structurées avec Exa Agent {#get-structured-data-with-exa-agent}

Pour des données structurées qui nécessitent une recherche sur plusieurs sources, utilisez un [run de tâche Exa Agent](/fr/docs/agent/quickstart). Décrivez les lieux, les équipes, les dates, les critères et les fields d&#39;output dont vous avez besoin : Agent renvoie des résultats validés par schéma, accompagnés de leurs citations.

<Card title="Lancer une tâche Exa Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide Agent" arrow="true">
  Comparez des lieux, préparez un briefing de jour de match ou regroupez détails locaux et conditions dans des résultats structurés.
</Card>