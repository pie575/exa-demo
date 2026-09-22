> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Cybersécurité {#cybersecurity}

> Trouvez des vulnérabilités, des advisories, des rapports de menaces et de la documentation de confiance avec Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Ouvrir dans le Playground de l’API" aria-label={`Ouvrir "${query}" dans le Playground de l’API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Utilisez Exa Search pour les records de vulnérabilité, les advisory des vendors et la recherche sur les menaces, à partir des sources que les équipes de sécurité consultent déjà.

## Inclus {#included}

* Records de vulnérabilité CVE et GHSA
* Advisories de sécurité des vendors et notes de correctifs
* Rapports de threat intelligence et comptes rendus d&#39;incidents
* Pages de confiance, listes de sous-traitants et documentation de conformité
* Blogs de sécurité, conférences et travaux de recherche

## Cas d&#39;usage {#use-it-for}

* Triage des vulnérabilités et évaluation de l&#39;exposition
* Threat intelligence et suivi des adversaires
* Risque vendor et revues de sécurité des tiers
* Surveillance et alertes de sécurité

## Exemples de requêtes {#example-queries}

### Trier une classe de vulnérabilités {#triage-a-vulnerability-class}

Indiquez le produit, la plage de versions et la gravité.

<PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

### Trouver des advisories vendor {#find-vendor-advisories}

Décrivez le statut d&#39;exploitation et la classe de produit plutôt qu&#39;un seul identifiant CVE.

<PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

### Examiner la posture de sécurité d&#39;un vendor {#review-a-vendors-security-posture}

Indiquez le type de document et la catégorie de vendor.

<PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />

### Enquêter sur un adversaire {#research-an-adversary}

Nommez le groupe ou la campagne, ainsi que la technique ou le secteur qui vous intéresse.

<PlaygroundQuery query="reports on ransomware groups targeting healthcare providers this year" />

## Envoyer une requête {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "critical CVEs affecting Apache Struts 6.x",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "critical CVEs affecting Apache Struts 6.x",
    {
      type: "auto",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "critical CVEs affecting Apache Struts 6.x",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Obtenir des données structurées avec Exa Agent {#get-structured-data-with-exa-agent}

Pour des données structurées nécessitant une recherche sur plusieurs sources, utilisez un [run de tâche Exa Agent](/fr/docs/agent/quickstart). Décrivez les produits, les critères de menace et les fields d&#39;output dont vous avez besoin : Agent renvoie des résultats validés par schéma, avec citations.

<Card title="Lancer une tâche Exa Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide Agent" arrow="true">
  Évaluez un vendor à partir des advisories, des signalements de fuites de données et des pages de confiance, ou constituez un jeu de données de vulnérabilités normalisées.
</Card>