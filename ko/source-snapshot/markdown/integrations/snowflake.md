> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

<div id="snowflake">
  # Snowflake
</div>

> Snowflake 저장 프로시저와 Cortex Agent에서 Exa search와 콘텐츠 retrieval을 사용하세요.

Snowflake에서 Exa의 Search API를 직접 호출해 SQL을 벗어나지 않고도 실시간 웹 인텔리전스로 데이터를 enrich하세요.

이 통합은 Snowflake의 [External Access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) 기능을 사용해 저장 프로시저에서 Exa API를 안전하게 호출하며, 다음 두 가지 주요 워크플로우를 지원합니다.

1. **Cortex Agent 도구** — Snowflake Cortex Agent가 웹을 search하고 page contents를 가져올 수 있도록 합니다
2. **데이터 보강** — CEO/창업자 정보, 최신 뉴스 등 웹 데이터로 테이블을 batch 단위로 enrich합니다

<div id="prerequisites">
  ## 사전 준비 사항
</div>

1. Exa API key
2. `ACCOUNTADMIN` 역할(External Access Integration 생성에 필요)
3. External Access를 지원하는 Snowflake 계정(유료 계정)

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<div id="setup">
  ## 설정
</div>

Snowflake 워크시트에서 다음 SQL을 실행하세요. `<<YOUR_EXA_API_KEY>>`는 실제 key로 바꿔주세요.

<div id="roles-and-database">
  ### 역할 및 데이터베이스
</div>

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

<div id="warehouse">
  ### 웨어하우스
</div>

```sql theme={null}
CREATE WAREHOUSE IF NOT EXISTS exa_agent_wh
WITH
    WAREHOUSE_SIZE = 'XSMALL'
    AUTO_SUSPEND = 60
    AUTO_RESUME = TRUE
    INITIALLY_SUSPENDED = TRUE;

GRANT USAGE, OPERATE ON WAREHOUSE exa_agent_wh TO ROLE exa_agent_role;
```

<div id="network-rule-secret-and-external-access">
  ### Network rule, secret 및 External Access
</div>

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

이렇게 하면 다음이 생성됩니다:

* `api.exa.ai:443`으로의 아웃바운드 트래픽만 허용하는 **network rule**
* API key를 저장하는 **secret**(암호화되어 SQL에서는 보이지 않음)
* 해당 rule과 secret을 함께 묶는 **external access integration**

<div id="stored-procedures">
  ## 저장 프로시저
</div>

<div id="exa_search">
  ### EXA_SEARCH
</div>

Exa의 Search API를 사용해 웹을 검색합니다. 제목, URL, 점수가 포함된 결과를 반환하며, 선택적으로 텍스트/highlights/summaries도 함께 반환할 수 있습니다.

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

<div id="parameters">
  #### 매개변수
</div>

| 매개변수                   | 타입        | 기본값      | 설명                                                                              |
| ---------------------- | --------- | -------- | ------------------------------------------------------------------------------- |
| `query`                | `STRING`  | 필수       | 검색 질의                                                                           |
| `num_results`          | `INTEGER` | `10`     | 결과 개수(1–100)                                                                    |
| `search_type`          | `STRING`  | `'auto'` | 권장 값: `auto`, `instant`, `fast`, `deep-lite`, `deep`, `deep-reasoning`          |
| `category`             | `STRING`  | `NULL`   | `company`, `publication`, `news`, `personal_site`, `financial_report`, `people` |
| `include_domains`      | `STRING`  | `NULL`   | 검색 대상으로 제한할 도메인(쉼표로 구분)                                                         |
| `exclude_domains`      | `STRING`  | `NULL`   | 제외할 도메인(쉼표로 구분)                                                                 |
| `start_published_date` | `STRING`  | `NULL`   | ISO 8601 날짜 하한                                                                  |
| `end_published_date`   | `STRING`  | `NULL`   | ISO 8601 날짜 상한                                                                  |
| `include_text`         | `STRING`  | `NULL`   | 결과에 반드시 포함되어야 하는 문구                                                             |
| `get_contents`         | `BOOLEAN` | `TRUE`   | text, highlights, summaries 가져오기                                                |

<div id="exa_get_contents">
  ### EXA_GET_CONTENTS
</div>

특정 URL의 page contents(텍스트, highlights, summaries)를 가져옵니다.

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

<div id="usage-examples">
  ## 사용 예시
</div>

<div id="basic-search">
  ### 기본 search
</div>

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

<div id="get-contents-for-specific-urls">
  ### 특정 URL의 contents 가져오기
</div>

```sql theme={null}
CALL EXA_INTEGRATION.TOOLS.EXA_GET_CONTENTS(
    'https://example.com/article1,https://example.com/article2',
    TRUE,   -- get_text
    TRUE,   -- get_highlights
    TRUE    -- get_summary
);
```

<div id="company-research">
  ### 기업 리서치
</div>

```sql theme={null}
CALL EXA_INTEGRATION.TOOLS.EXA_SEARCH(
    'Stripe CEO founder leadership',
    5, 'auto', 'company',
    NULL, NULL, NULL, NULL, NULL, TRUE
);
```

<div id="data-enrichment">
  ## 데이터 보강
</div>

Exa는 CEO/창업자 정보, 최신 뉴스 등 실시간 웹 데이터로 Snowflake 테이블을 보강할 수 있으며, 이 모든 작업을 플랫폼을 벗어나지 않고 처리할 수 있습니다.

<div id="create-a-prospect-table">
  ### prospect 테이블 만들기
</div>

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

<div id="enrich-with-ceofounder-info">
  ### CEO/창업자 정보로 보강하기
</div>

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

<div id="enrich-with-latest-news">
  ### 최신 뉴스로 보강하기
</div>

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

<div id="run-enrichment">
  ### Enrichment 실행
</div>

```sql theme={null}
-- 단일 회사 Enrich
CALL exa_enrichment.demo.enrich_company_leaders('Stripe');
CALL exa_enrichment.demo.enrich_company_news('Stripe');

-- Enrich된 결과 조회
SELECT company_name, ceo_name, ceo_title,
       latest_news_headline, latest_news_url, latest_news_date
FROM exa_enrichment.demo.prospect_companies;
```

<div id="parallelizing-exa-requests">
  ## Exa 요청 병렬화
</div>

대규모 테이블을 enrich할 때 행마다 Exa를 순차적으로 호출하면 속도가 느립니다. 단일 저장 프로시저 안에서 Python의 `concurrent.futures`를 사용해 요청을 병렬화하면 여러 Exa API 호출을 한 번에 보낼 수 있습니다.

<div id="concurrent-enrichment-procedure">
  ### 동시 Enrichment 프로시저
</div>

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

<div id="choosing-parallelism">
  ### 병렬 처리 수준 선택
</div>

| `max_workers` | 사용 사례                                                         |
| ------------- | ------------------------------------------------------------- |
| `5`           | 보수적 — rate limits에 여유롭게 못 미치는 수준                              |
| `10`          | 대부분의 Enrichment 작업에 적합한 기본값                                   |
| `20–50`       | 높은 [rate limit](/ko/docs/admin/billing#rate-limits) 등급의 대규모 데이터셋 |

<div id="snowflake-task-scheduling">
  ### Snowflake 태스크 스케줄링
</div>

주기적으로 실행되는 Enrichment 작업이라면, 해당 프로시저를 [Snowflake Task](https://docs.snowflake.com/en/user-guide/tasks-intro)로 감싸세요:

```sql theme={null}
CREATE OR REPLACE TASK exa_enrichment.demo.daily_enrichment
    WAREHOUSE = exa_agent_wh
    SCHEDULE = 'USING CRON 0 8 * * * America/Los_Angeles'
AS
    CALL exa_enrichment.demo.enrich_all_parallel(10);

ALTER TASK exa_enrichment.demo.daily_enrichment RESUME;
```

이 설정은 매일 오전 8시(PT)에 병렬 enrichment를 실행합니다. 처리량과 rate limits에 맞게 cron 스케줄과 `max_workers`를 조정하세요.

<div id="cortex-agent-integration">
  ## Cortex Agent 통합
</div>

Exa 저장 프로시저를 [Snowflake Cortex Agent](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents)의 도구로 등록하면, 대화형으로 웹을 검색하는 기능을 갖추게 할 수도 있습니다.

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

생성이 완료되면 Snowflake Intelligence를 열고 agent에게 다음과 같이 질문해 보세요:

* &quot;최근 AI agent 프레임워크를 웹에서 검색해줘&quot;
* &quot;retrieval augmented generation에 관한 연구 논문을 찾아줘&quot;
* &quot;주목할 만한 AI 기업 상위권은 어디야?&quot;

<div id="security">
  ## 보안
</div>

이 통합은 Snowflake의 기본 제공 보안 기능을 사용합니다:

| 계층                              | 세부 내용                                    |
| ------------------------------- | ---------------------------------------- |
| **역할**                          | 프로시저와 데이터에 대한 범위 제한 접근용 `exa_agent_role` |
| **Network Rule**                | 아웃바운드 트래픽을 `api.exa.ai:443`으로만 제한        |
| **Secret**                      | API key를 암호화하여 저장하며, SQL 쿼리에 노출되지 않음     |
| **External Access Integration** | network rule과 secret을 하나로 묶어 연결          |

추가 사용자에게 접근 권한을 부여하려면:

```sql theme={null}
GRANT ROLE exa_agent_role TO USER analyst_user;
```

<div id="more-resources">
  ## 추가 자료
</div>

* [Exa API 문서](/ko/docs/search/quickstart)
* [Exa Dashboard](https://dashboard.exa.ai) — API key 발급받기
* [Snowflake External Access 문서](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview)
* [Snowflake Cortex Agents 문서](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents)