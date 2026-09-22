> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Snowflake {#snowflake}

> Usa Exa Search y la recuperación de contenido desde procedimientos almacenados de Snowflake y Cortex Agents.

Usa la Search API de Exa directamente desde Snowflake para enriquecer tus datos con inteligencia web en tiempo real, sin salir de SQL.

Esta integración usa la funcionalidad [External Access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) de Snowflake para llamar de forma segura a la API de Exa desde procedimientos almacenados, lo que habilita dos flujos de trabajo principales:

1. **Herramientas de Cortex Agent**: dale a un Snowflake Cortex Agent la capacidad de buscar en la web y recuperar el contenido de las páginas
2. **Data enrichment**: enriquece tablas con información de CEO/fundadores, noticias recientes y otros datos web en batch

## Requisitos previos {#prerequisites}

1. Una API key de Exa
2. Rol `ACCOUNTADMIN` (necesario para crear External Access Integrations)
3. Una cuenta de Snowflake compatible con External Access (cuentas de pago)

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

## Configuración {#setup}

Ejecuta el siguiente SQL en una hoja de trabajo de Snowflake. Reemplaza `<<YOUR_EXA_API_KEY>>` por tu key real.

### Roles y base de datos {#roles-and-database}

```sql theme={null}
USE ROLE ACCOUNTADMIN;

CREATE ROLE IF NOT EXISTS exa_agent_role;
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER TO ROLE exa_agent_role;

SET my_user = CURRENT_USER();
GRANT ROLE exa_agent_role TO USER IDENTIFIER($my_user);

CREATE DATABASE IF NOT EXISTS exa_integration;
CREATE SCHEMA IF NOT EXISTS exa_integration.tools;

GRANT USAGE ON DATABASE exa_integration TO ROLE exa_agent_role;
GRANT USAGE ON SCHEMA exa_integration.tools TO ROLE exa_agent_role;
```

### Warehouse {#warehouse}

```sql theme={null}
CREATE WAREHOUSE IF NOT EXISTS exa_agent_wh
WITH
    WAREHOUSE_SIZE = 'XSMALL'
    AUTO_SUSPEND = 60
    AUTO_RESUME = TRUE
    INITIALLY_SUSPENDED = TRUE;

GRANT USAGE, OPERATE ON WAREHOUSE exa_agent_wh TO ROLE exa_agent_role;
```

### Regla de red, secreto y acceso externo {#network-rule-secret-and-external-access}

```sql theme={null}
CREATE OR REPLACE NETWORK RULE exa_integration.tools.exa_api_rule
    MODE = EGRESS
    TYPE = HOST_PORT
    VALUE_LIST = ('api.exa.ai:443');

CREATE OR REPLACE SECRET exa_integration.tools.exa_api_key
    TYPE = GENERIC_STRING
    SECRET_STRING = '<<YOUR_EXA_API_KEY>>';

CREATE OR REPLACE EXTERNAL ACCESS INTEGRATION exa_api_access
    ALLOWED_NETWORK_RULES = (exa_integration.tools.exa_api_rule)
    ALLOWED_AUTHENTICATION_SECRETS = (exa_integration.tools.exa_api_key)
    ENABLED = TRUE;

GRANT USAGE ON INTEGRATION exa_api_access TO ROLE exa_agent_role;
```

Esto crea:

* Una **regla de red** que permite el tráfico de salida únicamente hacia `api.exa.ai:443`
* Un **secreto** que almacena tu API key (cifrado, no visible en SQL)
* Una **External Access Integration** que vincula la regla y el secreto

## Procedimientos almacenados {#stored-procedures}

### EXA_SEARCH {#exa_search}

Busca en la web mediante la Search API de Exa. Devuelve resultados con títulos, URL, puntuaciones y, opcionalmente, texto, highlights o resúmenes.

```sql theme={null}
CREATE OR REPLACE PROCEDURE EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    query STRING,
    num_results INTEGER DEFAULT 10,
    search_type STRING DEFAULT 'auto',
    category STRING DEFAULT NULL,
    include_domains STRING DEFAULT NULL,
    exclude_domains STRING DEFAULT NULL,
    start_published_date STRING DEFAULT NULL,
    end_published_date STRING DEFAULT NULL,
    include_text STRING DEFAULT NULL,
    get_contents BOOLEAN DEFAULT TRUE
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json


def main(session, query, num_results, search_type, category, include_domains,
         exclude_domains, start_published_date, end_published_date,
         include_text, get_contents):
    api_key = _snowflake.get_generic_secret_string('cred')
    url = "https://api.exa.ai/search"

    body = {
        "query": query,
        "numResults": num_results,
        "type": search_type,
    }

    if category:
        body["category"] = category
    if include_domains:
        body["includeDomains"] = [d.strip() for d in include_domains.split(",")]
    if exclude_domains:
        body["excludeDomains"] = [d.strip() for d in exclude_domains.split(",")]
    if start_published_date:
        body["startPublishedDate"] = start_published_date
    if end_published_date:
        body["endPublishedDate"] = end_published_date
    if include_text:
        body["includeText"] = [include_text]

    if get_contents:
        body["contents"] = {
            "text": {"maxCharacters": 3000},
            "highlights": True,
            "summary": True
        }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }

    try:
        resp = requests.post(url, json=body, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        results = []
        for r in data.get("results", []):
            result = {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "score": r.get("score"),
                "publishedDate": r.get("publishedDate", ""),
            }
            if get_contents:
                result["summary"] = r.get("summary", "")
                result["highlights"] = r.get("highlights", [])
                result["text"] = (r.get("text", "") or "")[:2000]
            results.append(result)

        return json.dumps({
            "query": query,
            "numResults": len(results),
            "results": results
        })
    except requests.exceptions.HTTPError as e:
        return json.dumps({"error": str(e), "status_code": e.response.status_code,
                           "detail": e.response.text})
    except Exception as e:
        return json.dumps({"error": str(e)})
$$;

GRANT USAGE ON PROCEDURE EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    STRING, INTEGER, STRING, STRING, STRING, STRING, STRING, STRING, STRING, BOOLEAN
) TO ROLE exa_agent_role;
```

#### Parámetros {#parameters}

| Parámetro              | Tipo      | Valor predeterminado | Descripción                                                                             |
| ---------------------- | --------- | -------------------- | --------------------------------------------------------------------------------------- |
| `query`                | `STRING`  | obligatorio          | La consulta de búsqueda                                                                 |
| `num_results`          | `INTEGER` | `10`                 | Número de resultados (1–100)                                                            |
| `search_type`          | `STRING`  | `'auto'`             | Valores recomendados: `auto`, `instant`, `fast`, `deep-lite`, `deep` o `deep-reasoning` |
| `category`             | `STRING`  | `NULL`               | `company`, `publication`, `news`, `personal_site`, `financial_report`, `people`         |
| `include_domains`      | `STRING`  | `NULL`               | Dominios separados por comas a los que restringir la búsqueda                           |
| `exclude_domains`      | `STRING`  | `NULL`               | Dominios separados por comas que se excluirán                                           |
| `start_published_date` | `STRING`  | `NULL`               | Límite inferior de fecha en ISO 8601                                                    |
| `end_published_date`   | `STRING`  | `NULL`               | Límite superior de fecha en ISO 8601                                                    |
| `include_text`         | `STRING`  | `NULL`               | Frase que debe aparecer en los resultados                                               |
| `get_contents`         | `BOOLEAN` | `TRUE`               | Obtener texto, highlights y resúmenes                                                   |

### EXA_GET_CONTENTS {#exa_get_contents}

Recupera el contenido de las páginas (texto, highlights, resúmenes) de URL específicas.

```sql theme={null}
CREATE OR REPLACE PROCEDURE EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS(
    urls STRING,
    get_text BOOLEAN DEFAULT TRUE,
    get_highlights BOOLEAN DEFAULT TRUE,
    get_summary BOOLEAN DEFAULT TRUE
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json


def main(session, urls, get_text, get_highlights, get_summary):
    api_key = _snowflake.get_generic_secret_string('cred')
    url = "https://api.exa.ai/contents"

    url_list = [u.strip() for u in urls.split(",")]

    contents = {}
    if get_text:
        contents["text"] = {"maxCharacters": 5000}
    if get_highlights:
        contents["highlights"] = True
    if get_summary:
        contents["summary"] = True

    body = {
        "urls": url_list,
        **contents
    }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }

    try:
        resp = requests.post(url, json=body, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        results = []
        for r in data.get("results", []):
            result = {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
            }
            if get_text:
                result["text"] = (r.get("text", "") or "")[:3000]
            if get_highlights:
                result["highlights"] = r.get("highlights", [])
            if get_summary:
                result["summary"] = r.get("summary", "")
            results.append(result)

        return json.dumps({"numResults": len(results), "results": results})
    except requests.exceptions.HTTPError as e:
        return json.dumps({"error": str(e), "status_code": e.response.status_code,
                           "detail": e.response.text})
    except Exception as e:
        return json.dumps({"error": str(e)})
$$;

GRANT USAGE ON PROCEDURE EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS(
    STRING, BOOLEAN, BOOLEAN, BOOLEAN
) TO ROLE exa_agent_role;
```

## Ejemplos de uso {#usage-examples}

### Búsqueda básica {#basic-search}

```sql theme={null}
USE WAREHOUSE exa_agent_wh;

CALL EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    'latest developments in renewable energy',
    5,        -- num_results
    'auto',   -- search_type
    'news',   -- category
    NULL, NULL,
    '2025-01-01T00:00:00.000Z',  -- start_published_date
    NULL, NULL, TRUE
);
```

### Obtener contenido de URL específicas {#get-contents-for-specific-urls}

```sql theme={null}
CALL EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS(
    'https://example.com/article1,https://example.com/article2',
    TRUE,   -- get_text
    TRUE,   -- get_highlights
    TRUE    -- get_summary
);
```

### Investigación de empresas {#company-research}

```sql theme={null}
CALL EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    'Stripe CEO founder leadership',
    5, 'auto', 'company',
    NULL, NULL, NULL, NULL, NULL, TRUE
);
```

## Data enrichment {#data-enrichment}

Exa puede enriquecer las tablas de Snowflake con datos web en tiempo real (información del CEO o fundador, últimas noticias y mucho más) sin salir de la plataforma.

### Crear una tabla de prospectos {#create-a-prospect-table}

```sql theme={null}
CREATE DATABASE IF NOT EXISTS exa_enrichment;
CREATE SCHEMA IF NOT EXISTS exa_enrichment.demo;

CREATE OR REPLACE TABLE exa_enrichment.demo.prospect_companies (
    company_name STRING,
    website STRING,
    industry STRING,
    employee_count INTEGER,
    ceo_name STRING,
    ceo_title STRING,
    ceo_source_url STRING,
    latest_news_headline STRING,
    latest_news_summary STRING,
    latest_news_url STRING,
    latest_news_date STRING,
    leaders_enriched_at TIMESTAMP,
    news_enriched_at TIMESTAMP
);

INSERT INTO exa_enrichment.demo.prospect_companies
    (company_name, website, industry, employee_count)
VALUES
    ('Stripe', 'https://stripe.com', 'Fintech / Payments', 8000),
    ('Databricks', 'https://databricks.com', 'Data & AI Platform', 7000),
    ('Figma', 'https://figma.com', 'Design Tools', 1500),
    ('Anthropic', 'https://anthropic.com', 'AI Research', 1000),
    ('Vercel', 'https://vercel.com', 'Developer Platform', 600);
```

### Enriquecer con información del CEO/fundador {#enrich-with-ceofounder-info}

```sql theme={null}
CREATE OR REPLACE PROCEDURE exa_enrichment.demo.enrich_company_leaders(
    target_company STRING
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json
import re


def main(session, target_company):
    api_key = _snowflake.get_generic_secret_string('cred')

    body = {
        "query": f"{target_company} CEO founder leadership team",
        "numResults": 5,
        "type": "auto",
        "category": "company",
        "contents": {
            "text": {"maxCharacters": 2000},
            "highlights": True,
            "summary": True
        }
    }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }

    resp = requests.post(
        "https://api.exa.ai/search", json=body, headers=headers, timeout=30
    )
    resp.raise_for_status()
    data = resp.json()

    ceo_name = None
    ceo_title = None
    source_url = None
    ceo_keywords = ["ceo", "chief executive", "founder", "co-founder"]

    for r in data.get("results", []):
        text = ((r.get("text", "") or "") + " " + (r.get("summary", "") or "")).lower()
        title_text = (r.get("title", "") or "").lower()
        combined = text + " " + title_text

        for kw in ceo_keywords:
            idx = combined.find(kw)
            if idx == -1:
                continue

            original = (r.get("text", "") or "") + " " + (r.get("summary", "") or "") + " " + (r.get("title", "") or "")
            names = re.findall(
                r'(?:^|[\s,])([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)',
                original[max(0, idx - 200):idx + 200]
            )
            if names:
                ceo_name = names[0].strip()
                title_map = {
                    "co-founder": "Co-Founder & CEO",
                    "founder": "Founder & CEO",
                    "chief executive": "CEO",
                    "ceo": "CEO",
                }
                ceo_title = title_map.get(kw, "CEO")
                source_url = r.get("url", "")
                break
        if ceo_name:
            break

    if ceo_name:
        safe = lambda s: (s or "").replace("'", "''")
        session.sql(f"""
            UPDATE exa_enrichment.demo.prospect_companies
            SET ceo_name = '{safe(ceo_name)}',
                ceo_title = '{safe(ceo_title)}',
                ceo_source_url = '{safe(source_url)}',
                leaders_enriched_at = CURRENT_TIMESTAMP()
            WHERE company_name = '{safe(target_company)}'
        """).collect()

    return json.dumps({
        "company": target_company,
        "ceo_name": ceo_name,
        "ceo_title": ceo_title,
        "source_url": source_url
    })
$$;
```

### Enriquecer con las últimas noticias {#enrich-with-latest-news}

```sql theme={null}
CREATE OR REPLACE PROCEDURE exa_enrichment.demo.enrich_company_news(
    target_company STRING
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json
from datetime import datetime, timedelta


def main(session, target_company):
    api_key = _snowflake.get_generic_secret_string('cred')

    one_month_ago = (datetime.utcnow() - timedelta(days=30)).strftime(
        "%Y-%m-%dT00:00:00.000Z"
    )

    body = {
        "query": f"latest news about {target_company}",
        "numResults": 3,
        "type": "auto",
        "category": "news",
        "startPublishedDate": one_month_ago,
        "contents": {
            "text": {"maxCharacters": 1000},
            "summary": True
        }
    }

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }

    resp = requests.post(
        "https://api.exa.ai/search", json=body, headers=headers, timeout=30
    )
    resp.raise_for_status()
    data = resp.json()

    results = data.get("results", [])
    if not results:
        return json.dumps({"company": target_company, "status": "no_news_found"})

    top = results[0]
    headline = (top.get("title", "") or "")[:500]
    summary = (top.get("summary", "") or "")[:2000]
    news_url = top.get("url", "") or ""
    pub_date = top.get("publishedDate", "") or ""

    safe = lambda s: (s or "").replace("'", "''")
    session.sql(f"""
        UPDATE exa_enrichment.demo.prospect_companies
        SET latest_news_headline = '{safe(headline)}',
            latest_news_summary = '{safe(summary)}',
            latest_news_url = '{safe(news_url)}',
            latest_news_date = '{safe(pub_date)}',
            news_enriched_at = CURRENT_TIMESTAMP()
        WHERE company_name = '{safe(target_company)}'
    """).collect()

    return json.dumps({
        "company": target_company,
        "headline": headline,
        "url": news_url,
        "published_date": pub_date
    })
$$;
```

### Ejecutar el enrichment {#run-enrichment}

```sql theme={null}
-- Enriquecer una sola empresa
CALL exa_enrichment.demo.enrich_company_leaders('Stripe');
CALL exa_enrichment.demo.enrich_company_news('Stripe');

-- Ver los resultados enriquecidos
SELECT company_name, ceo_name, ceo_title,
       latest_news_headline, latest_news_url, latest_news_date
FROM exa_enrichment.demo.prospect_companies;
```

## Paralelizar solicitudes a Exa {#parallelizing-exa-requests}

Al enriquecer tablas grandes, llamar a Exa de forma secuencial fila por fila es lento. Puedes paralelizar las solicitudes usando `concurrent.futures` de Python dentro de un único procedimiento almacenado, enviando varias llamadas a la API de Exa a la vez.

### Procedimiento de enrichment concurrente {#concurrent-enrichment-procedure}

```sql theme={null}
CREATE OR REPLACE PROCEDURE exa_enrichment.demo.enrich_all_parallel(
    max_workers INTEGER DEFAULT 10
)
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = '3.10'
PACKAGES = ('requests', 'snowflake-snowpark-python')
EXTERNAL_ACCESS_INTEGRATIONS = (EXA_API_ACCESS)
SECRETS = ('cred' = exa_integration.tools.exa_api_key)
HANDLER = 'main'
AS
$$
import _snowflake
import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed


def exa_search(api_key, company_name, query_template, category="company", num_results=5):
    body = {
        "query": query_template.format(company=company_name),
        "numResults": num_results,
        "type": "auto",
        "category": category,
        "contents": {
            "text": {"maxCharacters": 2000},
            "highlights": True,
            "summary": True
        }
    }
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
        "x-exa-integration": "snowflake-cortex-agent"
    }
    resp = requests.post("https://api.exa.ai/search", json=body, headers=headers, timeout=30)
    resp.raise_for_status()
    return {"company": company_name, "results": resp.json().get("results", [])}


def main(session, max_workers):
    api_key = _snowflake.get_generic_secret_string('cred')

    rows = session.sql(
        "SELECT company_name FROM exa_enrichment.demo.prospect_companies"
    ).collect()
    companies = [row["COMPANY_NAME"] for row in rows]

    results = {}
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {
            pool.submit(exa_search, api_key, name, "{company} CEO founder leadership"): name
            for name in companies
        }
        for future in as_completed(futures):
            company = futures[future]
            try:
                results[company] = future.result()
            except Exception as e:
                results[company] = {"company": company, "error": str(e)}

    return json.dumps({
        "enriched": len([r for r in results.values() if "error" not in r]),
        "errors": len([r for r in results.values() if "error" in r]),
        "results": results
    })
$$;
```

### Elegir el paralelismo {#choosing-parallelism}

| `max_workers` | Caso de uso                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `5`           | Conservador: se mantiene muy por debajo de los límites de tasa                                    |
| `10`          | Buen valor predeterminado para la mayoría de los trabajos de enrichment                           |
| `20–50`       | Conjuntos de datos grandes con un nivel alto de [límite de tasa](/es/docs/admin/billing#rate-limits) |

### Programación de tareas en Snowflake {#snowflake-task-scheduling}

Para trabajos de enrichment recurrentes, encapsula el procedimiento en una [Snowflake Task](https://docs.snowflake.com/en/user-guide/tasks-intro):

```sql theme={null}
CREATE OR REPLACE TASK exa_enrichment.demo.daily_enrichment
    WAREHOUSE = exa_agent_wh
    SCHEDULE = 'USING CRON 0 8 * * * America/Los_Angeles'
AS
    CALL exa_enrichment.demo.enrich_all_parallel(10);

ALTER TASK exa_enrichment.demo.daily_enrichment RESUME;
```

Esto ejecuta el enrichment en paralelo todos los días a las 8 AM PT. Ajusta la programación cron y `max_workers` según tu volumen y tus límites de tasa.

## Integración con Cortex Agent {#cortex-agent-integration}

También puedes registrar los procedimientos almacenados de Exa como herramientas para un [Snowflake Cortex Agent](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents), lo que le permite buscar en la web de forma conversacional.

```sql theme={null}
CREATE DATABASE IF NOT EXISTS exa_agents;
CREATE SCHEMA IF NOT EXISTS exa_agents.agents;

GRANT USAGE ON DATABASE exa_agents TO ROLE exa_agent_role;
GRANT USAGE ON SCHEMA exa_agents.agents TO ROLE exa_agent_role;
GRANT CREATE AGENT ON SCHEMA exa_agents.agents TO ROLE exa_agent_role;

USE DATABASE exa_agents;
USE SCHEMA agents;
USE WAREHOUSE exa_agent_wh;

CREATE OR REPLACE AGENT exa_web_search_agent
    COMMENT = 'Agent with Exa web search and content retrieval'
    FROM SPECIFICATION
    $$
    models:
      orchestration: auto

    orchestration:
      budget:
        seconds: 60
        tokens: 32000

    instructions:
      system: |
        You are a helpful research assistant with access to Exa, a
        web search engine built for AI. Always cite your sources with URLs.

      orchestration: |
        - Use EXA_SEARCH for questions requiring web search or external knowledge.
        - Use EXA_GET_CONTENTS when the user provides specific URLs.
        - For news queries, set category to "news".
        - For scholarly publications (research papers, preprints, journal articles), set category to "publication".
        - For company lookups, set category to "company".
        - When asked about recent events, set start_published_date to a recent date.
        - Always request contents (get_contents=TRUE) for substantive answers.

    tools:
      - tool_spec:
          type: generic
          name: exa_search
          description: >
            Search the web using Exa. Returns web pages with titles, URLs,
            text content, highlights, and summaries. Supports filtering by
            domain, date, category, and text content.
          input_schema:
            type: object
            properties:
              query:
                type: string
                description: The search query.
              num_results:
                type: integer
                description: Number of results (1-100). Default 10.
              search_type:
                type: string
                enum: ["auto", "instant", "fast", "deep-lite", "deep", "deep-reasoning"]
              category:
                type: string
                enum: ["company", "publication", "news",
                       "personal_site", "financial_report", "people"]
              include_domains:
                type: string
                description: Comma-separated domains to restrict to.
              exclude_domains:
                type: string
                description: Comma-separated domains to exclude.
              start_published_date:
                type: string
                description: ISO 8601 date lower bound.
              end_published_date:
                type: string
                description: ISO 8601 date upper bound.
              include_text:
                type: string
                description: Phrase that must appear in results.
              get_contents:
                type: boolean
                description: Fetch page contents. Default true.
            required:
              - query

      - tool_spec:
          type: generic
          name: exa_get_contents
          description: >
            Retrieve text, highlights, and summaries for specific URLs.
          input_schema:
            type: object
            properties:
              urls:
                type: string
                description: Comma-separated URLs.
              get_text:
                type: boolean
              get_highlights:
                type: boolean
              get_summary:
                type: boolean
            required:
              - urls

    tool_resources:
      exa_search:
        type: procedure
        execution_environment:
          type: warehouse
          warehouse: EXA_AGENT_WH
        identifier: EXA_INTEGRATION.TOOLS.EXA_SEARCH

      exa_get_contents:
        type: procedure
        execution_environment:
          type: warehouse
          warehouse: EXA_AGENT_WH
        identifier: EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS
    $$;
```

Una vez creado, abre Snowflake Intelligence y prueba a preguntarle a tu agente:

* &quot;Busca en la web frameworks recientes de agentes de IA&quot;
* &quot;Encuentra artículos de investigación sobre generación aumentada por recuperación&quot;
* &quot;¿Cuáles son las principales empresas de IA a las que seguir la pista?&quot;

## Seguridad {#security}

La integración utiliza las funcionalidades de seguridad integradas de Snowflake:

| Capa                            | Detalle                                                           |
| ------------------------------- | ----------------------------------------------------------------- |
| **Roles**                       | `exa_agent_role` para acceso restringido a procedimientos y datos |
| **Regla de red**                | Salida permitida únicamente hacia `api.exa.ai:443`                |
| **Secreto**                     | API key almacenada cifrada, no visible en las consultas SQL       |
| **External Access Integration** | Vincula la regla de red y el secreto                              |

Otorga acceso a usuarios adicionales:

```sql theme={null}
GRANT ROLE exa_agent_role TO USER analyst_user;
```

## Más recursos {#more-resources}

* [Documentación de la API de Exa](/es/docs/search/quickstart)
* [Exa Dashboard](https://dashboard.exa.ai) — obtén tu API key
* [Documentación de External Access de Snowflake](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview)
* [Documentación de Snowflake Cortex Agents](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents)