> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="examples">
  # Exemples
</div>

> Exemples Exa Agent en production pour le list building, la veille KYB, les offres d&#39;emploi et les structured outputs.

Ces exemples présentent des modèles de workflow en production pour Exa Agent : list building, veille KYB, offres d&#39;emploi et structured outputs.

<h2 id="find-all-code">
  Trouver tous les membres GTM chez Exa.ai
</h2>

Utilisez un prompt de découverte lorsque c&#39;est à Agent de trouver les lignes. Soyez explicite quant à la company disambiguation et exigez des evidence d&#39;emploi en cours, afin que des entreprises aux noms similaires ne viennent pas polluer le résultat.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find all GTM members currently working at Exa.ai. Verify each person is at the correct company: Exa, the AI search company at exa.ai, not any other company named Exa. Include the company name in every row. Include only people with public evidence that they currently work at Exa and whose role is go-to-market, such as sales, business development, partnerships, customer success, marketing, growth, or revenue. Return one row per person.",
      effort="high",
      output_schema={
          "type": "object",
          "required": ["gtm_members"],
          "properties": {
              "gtm_members": {
                  "type": "array",
                  "maxItems": 100,
                  "items": {
                      "type": "object",
                      "required": ["full_name", "company", "title", "gtm_function", "company_verified_as_exa_ai", "evidence_urls"],
                      "properties": {
                          "full_name": {"type": "string"},
                          "company": {"type": "string"},
                          "title": {"type": "string"},
                          "gtm_function": {"type": "string"},
                          "company_verified_as_exa_ai": {"type": "boolean"},
                          "evidence_summary": {"type": "string"},
                          "profile_url": {"type": "string", "format": "uri"},
                          "evidence_urls": {
                              "type": "array",
                              "items": {"type": "string", "format": "uri"},
                              "minItems": 1,
                          },
                      },
                  },
              }
          },
      },
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find all GTM members currently working at Exa.ai. Verify each person is at the correct company: Exa, the AI search company at exa.ai, not any other company named Exa. Include the company name in every row. Include only people with public evidence that they currently work at Exa and whose role is go-to-market, such as sales, business development, partnerships, customer success, marketing, growth, or revenue. Return one row per person.",
    effort: "high",
    outputSchema: {
      type: "object",
      required: ["gtm_members"],
      properties: {
        gtm_members: {
          type: "array",
          maxItems: 100,
          items: {
            type: "object",
            required: ["full_name", "company", "title", "gtm_function", "company_verified_as_exa_ai", "evidence_urls"],
            properties: {
              full_name: { type: "string" },
              company: { type: "string" },
              title: { type: "string" },
              gtm_function: { type: "string" },
              company_verified_as_exa_ai: { type: "boolean" },
              evidence_summary: { type: "string" },
              profile_url: { type: "string", format: "uri" },
              evidence_urls: {
                type: "array",
                items: { type: "string", format: "uri" },
                minItems: 1
              }
            }
          }
        }
      }
    }
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d '
  {
    "query": "Find all GTM members currently working at Exa.ai. Verify each person is at the correct company: Exa, the AI search company at exa.ai, not any other company named Exa. Include the company name in every row. Include only people with public evidence that they currently work at Exa and whose role is go-to-market, such as sales, business development, partnerships, customer success, marketing, growth, or revenue. Return one row per person.",
    "effort": "high",
    "outputSchema": {
      "type": "object",
      "required": ["gtm_members"],
      "properties": {
        "gtm_members": {
          "type": "array",
          "maxItems": 100,
          "items": {
            "type": "object",
            "required": ["full_name", "company", "title", "gtm_function", "company_verified_as_exa_ai", "evidence_urls"],
            "properties": {
              "full_name": { "type": "string" },
              "company": { "type": "string" },
              "title": { "type": "string" },
              "gtm_function": { "type": "string" },
              "company_verified_as_exa_ai": { "type": "boolean" },
              "evidence_summary": { "type": "string" },
              "profile_url": { "type": "string", "format": "uri" },
              "evidence_urls": {
                "type": "array",
                "items": { "type": "string", "format": "uri" },
                "minItems": 1
              }
            }
          }
        }
      }
    }
  }
  '
  ```
</CodeGroup>

<h2 id="kyb-code">
  Renseignement KYC / KYB
</h2>

Utilisez Agent lorsque l&#39;évaluation d&#39;un partenaire ou d&#39;un fournisseur exige des renseignements publics issus du web, et pas seulement une simple page de profil. Demandez la vérification d&#39;identité, le contexte d&#39;entreprise, les signaux publics, l&#39;activité d&#39;investissement et des notes de risque explicites au sein d&#39;un même objet structuré.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Research Ramp (ramp.com) as a potential partner for a fintech infrastructure company. Verify the company identity. Return concise KYB intelligence covering company identity, brand or ecosystem partnerships, public mentions or notable news, recent investment activity, and risk notes. Use public sources and include source URLs.",
      effort="medium",
      output_schema={
          "type": "object",
          "required": ["company_intel"],
          "properties": {
              "company_intel": {
                  "type": "object",
                  "required": [
                      "company",
                      "domain",
                      "identity_verified",
                      "business_summary",
                      "brand_partnerships",
                      "public_mentions",
                      "investment_activity",
                      "risk_notes",
                      "source_urls",
                  ],
                  "properties": {
                      "company": {"type": "string"},
                      "domain": {"type": "string"},
                      "identity_verified": {"type": "boolean"},
                      "business_summary": {"type": "string"},
                      "brand_partnerships": {
                          "type": "array",
                          "maxItems": 3,
                          "items": {
                              "type": "object",
                              "required": ["partner", "relationship", "evidence"],
                              "properties": {
                                  "partner": {"type": "string"},
                                  "relationship": {"type": "string"},
                                  "evidence": {"type": "string"},
                              },
                          },
                      },
                      "public_mentions": {
                          "type": "array",
                          "maxItems": 3,
                          "items": {
                              "type": "object",
                              "required": ["mention", "source"],
                              "properties": {
                                  "mention": {"type": "string"},
                                  "date": {"type": "string"},
                                  "source": {"type": "string", "format": "uri"},
                              },
                          },
                      },
                      "investment_activity": {
                          "type": "array",
                          "maxItems": 3,
                          "items": {
                              "type": "object",
                              "required": ["event", "source"],
                              "properties": {
                                  "event": {"type": "string"},
                                  "amount_or_valuation": {"type": "string"},
                                  "date": {"type": "string"},
                                  "source": {"type": "string", "format": "uri"},
                              },
                          },
                      },
                      "risk_notes": {
                          "type": "array",
                          "maxItems": 3,
                          "items": {"type": "string"},
                      },
                      "source_urls": {
                          "type": "array",
                          "maxItems": 8,
                          "items": {"type": "string", "format": "uri"},
                      },
                  },
              }
          },
      },
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Research Ramp (ramp.com) as a potential partner for a fintech infrastructure company. Verify the company identity. Return concise KYB intelligence covering company identity, brand or ecosystem partnerships, public mentions or notable news, recent investment activity, and risk notes. Use public sources and include source URLs.",
    effort: "medium",
    outputSchema: {
      type: "object",
      required: ["company_intel"],
      properties: {
        company_intel: {
          type: "object",
          required: [
            "company",
            "domain",
            "identity_verified",
            "business_summary",
            "brand_partnerships",
            "public_mentions",
            "investment_activity",
            "risk_notes",
            "source_urls"
          ],
          properties: {
            company: { type: "string" },
            domain: { type: "string" },
            identity_verified: { type: "boolean" },
            business_summary: { type: "string" },
            brand_partnerships: {
              type: "array",
              maxItems: 3,
              items: {
                type: "object",
                required: ["partner", "relationship", "evidence"],
                properties: {
                  partner: { type: "string" },
                  relationship: { type: "string" },
                  evidence: { type: "string" }
                }
              }
            },
            public_mentions: {
              type: "array",
              maxItems: 3,
              items: {
                type: "object",
                required: ["mention", "source"],
                properties: {
                  mention: { type: "string" },
                  date: { type: "string" },
                  source: { type: "string", format: "uri" }
                }
              }
            },
            investment_activity: {
              type: "array",
              maxItems: 3,
              items: {
                type: "object",
                required: ["event", "source"],
                properties: {
                  event: { type: "string" },
                  amount_or_valuation: { type: "string" },
                  date: { type: "string" },
                  source: { type: "string", format: "uri" }
                }
              }
            },
            risk_notes: {
              type: "array",
              maxItems: 3,
              items: { type: "string" }
            },
            source_urls: {
              type: "array",
              maxItems: 8,
              items: { type: "string", format: "uri" }
            }
          }
        }
      }
    }
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d '
  {
    "query": "Research Ramp (ramp.com) as a potential partner for a fintech infrastructure company. Verify the company identity. Return concise KYB intelligence covering company identity, brand or ecosystem partnerships, public mentions or notable news, recent investment activity, and risk notes. Use public sources and include source URLs.",
    "effort": "medium",
    "outputSchema": {
      "type": "object",
      "required": ["company_intel"],
      "properties": {
        "company_intel": {
          "type": "object",
          "required": [
            "company",
            "domain",
            "identity_verified",
            "business_summary",
            "brand_partnerships",
            "public_mentions",
            "investment_activity",
            "risk_notes",
            "source_urls"
          ],
          "properties": {
            "company": { "type": "string" },
            "domain": { "type": "string" },
            "identity_verified": { "type": "boolean" },
            "business_summary": { "type": "string" },
            "brand_partnerships": {
              "type": "array",
              "maxItems": 3,
              "items": {
                "type": "object",
                "required": ["partner", "relationship", "evidence"],
                "properties": {
                  "partner": { "type": "string" },
                  "relationship": { "type": "string" },
                  "evidence": { "type": "string" }
                }
              }
            },
            "public_mentions": {
              "type": "array",
              "maxItems": 3,
              "items": {
                "type": "object",
                "required": ["mention", "source"],
                "properties": {
                  "mention": { "type": "string" },
                  "date": { "type": "string" },
                  "source": { "type": "string", "format": "uri" }
                }
              }
            },
            "investment_activity": {
              "type": "array",
              "maxItems": 3,
              "items": {
                "type": "object",
                "required": ["event", "source"],
                "properties": {
                  "event": { "type": "string" },
                  "amount_or_valuation": { "type": "string" },
                  "date": { "type": "string" },
                  "source": { "type": "string", "format": "uri" }
                }
              }
            },
            "risk_notes": {
              "type": "array",
              "maxItems": 3,
              "items": { "type": "string" }
            },
            "source_urls": {
              "type": "array",
              "maxItems": 8,
              "items": { "type": "string", "format": "uri" }
            }
          }
        }
      }
    }
  }
  '
  ```
</CodeGroup>

<h2 id="job-postings-code">
  Offres d&#39;emploi
</h2>

Utilisez Agent lorsque les postes ouverts sont dispersés entre les pages d&#39;entreprises, les agrégateurs et les annuaires de startups. Cet exemple limite la source au site d&#39;offres d&#39;emploi d&#39;Exa hébergé sur Ashby, tout en nécessitant malgré tout une company disambiguation.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find current open job postings for Exa on Ashby. Use Ashby-hosted postings, preferably jobs.ashbyhq.com/exa, and verify each job is for Exa, the AI search company at exa.ai. Return up to 5 postings with company name, title, function, location, Ashby posting URL, and why it is relevant.",
      effort="medium",
      output_schema={
          "type": "object",
          "required": ["job_postings"],
          "properties": {
              "job_postings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": [
                          "title",
                          "company",
                          "function",
                          "location",
                          "company_verified_as_exa_ai",
                          "posting_url",
                          "source_platform",
                          "why_relevant",
                      ],
                      "properties": {
                          "title": {"type": "string"},
                          "company": {"type": "string"},
                          "function": {"type": "string"},
                          "location": {"type": "string"},
                          "company_verified_as_exa_ai": {"type": "boolean"},
                          "posting_url": {"type": "string", "format": "uri"},
                          "source_platform": {"type": "string"},
                          "why_relevant": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find current open job postings for Exa on Ashby. Use Ashby-hosted postings, preferably jobs.ashbyhq.com/exa, and verify each job is for Exa, the AI search company at exa.ai. Return up to 5 postings with company name, title, function, location, Ashby posting URL, and why it is relevant.",
    effort: "medium",
    outputSchema: {
      type: "object",
      required: ["job_postings"],
      properties: {
        job_postings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: [
              "title",
              "company",
              "function",
              "location",
              "company_verified_as_exa_ai",
              "posting_url",
              "source_platform",
              "why_relevant"
            ],
            properties: {
              title: { type: "string" },
              company: { type: "string" },
              function: { type: "string" },
              location: { type: "string" },
              company_verified_as_exa_ai: { type: "boolean" },
              posting_url: { type: "string", format: "uri" },
              source_platform: { type: "string" },
              why_relevant: { type: "string" }
            }
          }
        }
      }
    }
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d '
  {
    "query": "Find current open job postings for Exa on Ashby. Use Ashby-hosted postings, preferably jobs.ashbyhq.com/exa, and verify each job is for Exa, the AI search company at exa.ai. Return up to 5 postings with company name, title, function, location, Ashby posting URL, and why it is relevant.",
    "effort": "medium",
    "outputSchema": {
      "type": "object",
      "required": ["job_postings"],
      "properties": {
        "job_postings": {
          "type": "array",
          "maxItems": 5,
          "items": {
            "type": "object",
            "required": [
              "title",
              "company",
              "function",
              "location",
              "company_verified_as_exa_ai",
              "posting_url",
              "source_platform",
              "why_relevant"
            ],
            "properties": {
              "title": { "type": "string" },
              "company": { "type": "string" },
              "function": { "type": "string" },
              "location": { "type": "string" },
              "company_verified_as_exa_ai": { "type": "boolean" },
              "posting_url": { "type": "string", "format": "uri" },
              "source_platform": { "type": "string" },
              "why_relevant": { "type": "string" }
            }
          }
        }
      }
    }
  }
  '
  ```
</CodeGroup>

<h2 id="enrich-input-rows-code">
  Enrichir les lignes d&#39;entrée
</h2>

Utilisez `input.data` lorsque votre système dispose déjà des records et qu&#39;Agent doit effectuer des recherches sur chacun d&#39;eux ou les enrichir. Ce schéma conserve l&#39;identité des lignes dans l&#39;entrée structurée au lieu de la noyer dans le prompt.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="For each input company, produce a concise research brief. Use recent, reputable sources. Return one report per input row.",
      effort="medium",
      input={"data": [{"company": "Ramp", "domain": "ramp.com"}, {"company": "Mercury", "domain": "mercury.com"}]},
      output_schema={
          "type": "object",
          "required": ["reports"],
          "properties": {
              "reports": {
                  "type": "array",
                  "maxItems": 2,
                  "items": {
                      "type": "object",
                      "required": ["company", "domain", "overview", "buyingSignals", "sourceUrls", "verified_domain"],
                      "properties": {
                          "company": {"type": "string"},
                          "domain": {"type": "string"},
                          "overview": {"type": "string"},
                          "buyingSignals": {
                              "type": "array",
                              "maxItems": 3,
                              "items": {"type": "string"},
                          },
                          "sourceUrls": {
                              "type": "array",
                              "minItems": 1,
                              "items": {"type": "string", "format": "uri"},
                          },
                          "verified_domain": {"type": "boolean"},
                      },
                  },
              }
          },
      },
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "For each input company, produce a concise research brief. Use recent, reputable sources. Return one report per input row.",
    effort: "medium",
    input: { data: [{ company: "Ramp", domain: "ramp.com" }, { company: "Mercury", domain: "mercury.com" }] },
    outputSchema: {
      type: "object",
      required: ["reports"],
      properties: {
        reports: {
          type: "array",
          maxItems: 2,
          items: {
            type: "object",
            required: ["company", "domain", "overview", "buyingSignals", "sourceUrls", "verified_domain"],
            properties: {
              company: { type: "string" },
              domain: { type: "string" },
              overview: { type: "string" },
              buyingSignals: {
                type: "array",
                maxItems: 3,
                items: { type: "string" }
              },
              sourceUrls: {
                type: "array",
                minItems: 1,
                items: { type: "string", format: "uri" }
              },
              verified_domain: { type: "boolean" }
            }
          }
        }
      }
    }
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d '
  {
    "query": "For each input company, produce a concise research brief. Use recent, reputable sources. Return one report per input row.",
    "effort": "medium",
    "input": {
      "data": [
        { "company": "Ramp", "domain": "ramp.com" },
        { "company": "Mercury", "domain": "mercury.com" }
      ]
    },
    "outputSchema": {
      "type": "object",
      "required": ["reports"],
      "properties": {
        "reports": {
          "type": "array",
          "maxItems": 2,
          "items": {
            "type": "object",
            "required": ["company", "domain", "overview", "buyingSignals", "sourceUrls", "verified_domain"],
            "properties": {
              "company": { "type": "string" },
              "domain": { "type": "string" },
              "overview": { "type": "string" },
              "buyingSignals": {
                "type": "array",
                "maxItems": 3,
                "items": { "type": "string" }
              },
              "sourceUrls": {
                "type": "array",
                "minItems": 1,
                "items": { "type": "string", "format": "uri" }
              },
              "verified_domain": { "type": "boolean" }
            }
          }
        }
      }
    }
  }
  '
  ```
</CodeGroup>

<h2 id="bounded-contact-fields-code">
  Enrichir les lignes avec des champs de contact bornés
</h2>

Les workflows orientés contacts peuvent déclencher des frais distincts de contact enrichment. Cette version anonymisée de la documentation illustre la structure sans publier de noms, d&#39;adresses e-mail, de numéros de téléphone ni d&#39;URL de profil réels.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="For each company, find the best sales or partnerships contact. Prefer leadership or go-to-market roles. Return anonymized contact labels in examples and include evidence for why each role is relevant.",
      effort="high",
      input={"data": [{"company": "LangChain", "domain": "langchain.com"}, {"company": "Modal", "domain": "modal.com"}]},
      output_schema={
          "type": "object",
          "required": ["contacts"],
          "properties": {
              "contacts": {
                  "type": "array",
                  "maxItems": 2,
                  "items": {
                      "type": "object",
                      "required": ["company", "contact_label", "role", "relevanceReason"],
                      "properties": {
                          "company": {"type": "string"},
                          "contact_label": {"type": "string"},
                          "role": {"type": "string"},
                          "relevanceReason": {"type": "string"},
                          "contact_cost_bound": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "For each company, find the best sales or partnerships contact. Prefer leadership or go-to-market roles. Return anonymized contact labels in examples and include evidence for why each role is relevant.",
    effort: "high",
    input: { data: [{ company: "LangChain", domain: "langchain.com" }, { company: "Modal", domain: "modal.com" }] },
    outputSchema: {
      type: "object",
      required: ["contacts"],
      properties: {
        contacts: {
          type: "array",
          maxItems: 2,
          items: {
            type: "object",
            required: ["company", "contact_label", "role", "relevanceReason"],
            properties: {
              company: { type: "string" },
              contact_label: { type: "string" },
              role: { type: "string" },
              relevanceReason: { type: "string" },
              contact_cost_bound: { type: "string" }
            }
          }
        }
      }
    }
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d '
  {
    "query": "For each company, find the best sales or partnerships contact. Prefer leadership or go-to-market roles. Return anonymized contact labels in examples and include evidence for why each role is relevant.",
    "effort": "high",
    "input": {
      "data": [
        { "company": "LangChain", "domain": "langchain.com" },
        { "company": "Modal", "domain": "modal.com" }
      ]
    },
    "outputSchema": {
      "type": "object",
      "required": ["contacts"],
      "properties": {
        "contacts": {
          "type": "array",
          "maxItems": 2,
          "items": {
            "type": "object",
            "required": ["company", "contact_label", "role", "relevanceReason"],
            "properties": {
              "company": { "type": "string" },
              "contact_label": { "type": "string" },
              "role": { "type": "string" },
              "relevanceReason": { "type": "string" },
              "contact_cost_bound": { "type": "string" }
            }
          }
        }
      }
    }
  }
  '
  ```
</CodeGroup>

<h2 id="exclude-known-records-code">
  Exclure les records connus
</h2>

Utilisez `input.exclusion` lorsque Agent doit écarter les records que votre produit a déjà examinés, affichés ou rejetés.
L&#39;aperçu de la feuille utilise des noms d&#39;entreprises fictifs : le schéma d&#39;exclusion reste ainsi visible sans laisser croire que ces lignes proviennent d&#39;un run réel en production.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find 10 seed-stage companies building infrastructure for AI coding agents. Do not return companies in the exclusion list.",
      effort="auto",
      input={"exclusion": [{"company": "Cursor", "domain": "cursor.com"}, {"company": "CodeRabbit", "domain": "coderabbit.ai"}]},
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["company", "domain", "reason", "sourceUrl"],
                      "properties": {
                          "company": {"type": "string"},
                          "domain": {"type": "string"},
                          "reason": {"type": "string"},
                          "sourceUrl": {"type": "string", "format": "uri"},
                          "excluded_match": {"type": "string"},
                          "status": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find 10 seed-stage companies building infrastructure for AI coding agents. Do not return companies in the exclusion list.",
    effort: "auto",
    input: { exclusion: [{ company: "Cursor", domain: "cursor.com" }, { company: "CodeRabbit", domain: "coderabbit.ai" }] },
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["company", "domain", "reason", "sourceUrl"],
            properties: {
              company: { type: "string" },
              domain: { type: "string" },
              reason: { type: "string" },
              sourceUrl: { type: "string", format: "uri" },
              excluded_match: { type: "string" },
              status: { type: "string" }
            }
          }
        }
      }
    }
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d '
  {
    "query": "Find 10 seed-stage companies building infrastructure for AI coding agents. Do not return companies in the exclusion list.",
    "effort": "auto",
    "input": {
      "exclusion": [
        { "company": "Cursor", "domain": "cursor.com" },
        { "company": "CodeRabbit", "domain": "coderabbit.ai" }
      ]
    },
    "outputSchema": {
      "type": "object",
      "required": ["companies"],
      "properties": {
        "companies": {
          "type": "array",
          "maxItems": 10,
          "items": {
            "type": "object",
            "required": ["company", "domain", "reason", "sourceUrl"],
            "properties": {
              "company": { "type": "string" },
              "domain": { "type": "string" },
              "reason": { "type": "string" },
              "sourceUrl": { "type": "string", "format": "uri" },
              "excluded_match": { "type": "string" },
              "status": { "type": "string" }
            }
          }
        }
      }
    }
  }
  '
  ```
</CodeGroup>

<h2 id="continue-workflow-code">
  Poursuivre un workflow terminé
</h2>

Utilisez `previousRunId` lorsque la requête suivante doit s&#39;appuyer sur le contexte d&#39;un run terminé.
L&#39;aperçu de la feuille s&#39;appuie sur des noms d&#39;entreprises fictifs pour illustrer le principe de continuation sans exposer un run antérieur réel.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Parmi les entreprises que tu as trouvées, ne conserve que celles qui recrutent des ingénieurs plateforme à San Francisco. Ajoute l'URL de la page de recrutement pour chaque correspondance.",
      previous_run_id="agent_run_01j...",
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["company", "website", "hiringPageUrl"],
                      "properties": {
                          "company": {"type": "string"},
                          "website": {"type": "string", "format": "uri"},
                          "hiringPageUrl": {"type": "string", "format": "uri"},
                          "hiringEvidence": {"type": "string"},
                          "location": {"type": "string"},
                          "followup_source": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    previousRunId: "agent_run_01j...",
    query: "Parmi les entreprises que tu as trouvées, ne conserve que celles qui recrutent des ingénieurs plateforme à San Francisco. Ajoute l'URL de la page de recrutement pour chaque correspondance.",
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["company", "website", "hiringPageUrl"],
            properties: {
              company: { type: "string" },
              website: { type: "string", format: "uri" },
              hiringPageUrl: { type: "string", format: "uri" },
              hiringEvidence: { type: "string" },
              location: { type: "string" },
              followup_source: { type: "string" }
            }
          }
        }
      }
    }
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d '{
    "previousRunId": "agent_run_01j...",
    "query": "Parmi les entreprises que tu as trouvées, ne conserve que celles qui recrutent des ingénieurs plateforme à San Francisco. Ajoute pour chaque correspondance le lien vers la page de recrutement.",
    "outputSchema": {
      "type": "object",
      "required": ["companies"],
      "properties": {
        "companies": {
          "type": "array",
          "maxItems": 10,
          "items": {
            "type": "object",
            "required": ["company", "website", "hiringPageUrl"],
            "properties": {
              "company": { "type": "string" },
              "website": { "type": "string", "format": "uri" },
              "hiringPageUrl": { "type": "string", "format": "uri" },
              "hiringEvidence": { "type": "string" },
              "location": { "type": "string" },
              "followup_source": { "type": "string" }
            }
          }
        }
      }
    }
  }'
  ```
</CodeGroup>

<div id="broad-list-building-with-agent-max">
  ## List building à grande échelle avec Agent Max
</div>

Utilisez `effort: "max"` pour les tâches où l&#39;exhaustivité et la rigueur importent plus que la latence ou le coût : list building à grande échelle, recherche approfondie multi-sources et criteria difficiles à vérifier. Agent Max est en bêta publique : envoyez `Exa-Beta: agent-max-effort-2026-07-27` avec la requête. Ce header accepte une liste de jetons bêta séparés par des virgules.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.beta.agent.runs.create(
      query="Find all companies building browser automation tools in the United States.",
      effort="max",
      budget={"maxCostDollars": 10},
      betas=["agent-max-effort-2026-07-27"],
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.beta.agent.runs.create({
    query: "Find all companies building browser automation tools in the United States.",
    effort: "max",
    budget: { maxCostDollars: 10 },
    betas: ["agent-max-effort-2026-07-27"]
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -H "Exa-Beta: agent-max-effort-2026-07-27" \
    -d '{
      "query": "Find all companies building browser automation tools in the United States.",
      "effort": "max",
      "budget": { "maxCostDollars": 10 }
    }'
  ```
</CodeGroup>

<div id="attach-a-data-partner-with-exa-connect">
  ## Attacher un data partner avec Exa Connect
</div>

Utilisez `dataSources` pour permettre à Exa Agent de puiser dans les données d&#39;un data partner premium pendant un run. Ici, chaque entreprise est enrichie avec le traffic issu de Similarweb et les levées de fonds issues de Harmonic, le tout combiné à une recherche web. Consultez [Exa Connect](/fr/docs/agent/connect/overview) pour la liste complète des partners.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="For each input company, report estimated monthly visits and total funding raised. Use the attached data partners.",
      effort="medium",
      data_sources=[
          {"provider": "similarweb"},
          {"provider": "harmonic"},
      ],
      input={
          "data": [
              {"company": "Ramp", "domain": "ramp.com"},
              {"company": "Mercury", "domain": "mercury.com"},
          ]
      },
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 2,
                  "items": {
                      "type": "object",
                      "required": ["company", "domain", "monthlyVisits", "totalFunding"],
                      "properties": {
                          "company": {"type": "string"},
                          "domain": {"type": "string"},
                          "monthlyVisits": {"type": "number", "description": "from Similarweb"},
                          "totalFunding": {"type": "string", "description": "from Harmonic"},
                      },
                  },
              }
          },
      },
  )
  print(run)
  ```

  ```javascript JavaScript expandable theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "For each input company, report estimated monthly visits and total funding raised. Use the attached data partners.",
    effort: "medium",
    dataSources: [{ provider: "similarweb" }, { provider: "harmonic" }],
    input: {
      data: [
        { company: "Ramp", domain: "ramp.com" },
        { company: "Mercury", domain: "mercury.com" }
      ]
    },
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 2,
          items: {
            type: "object",
            required: ["company", "domain", "monthlyVisits", "totalFunding"],
            properties: {
              company: { type: "string" },
              domain: { type: "string" },
              monthlyVisits: { type: "number", description: "from Similarweb" },
              totalFunding: { type: "string", description: "from Harmonic" }
            }
          }
        }
      }
    }
  });
  console.log(run);
  ```

  ```bash cURL expandable theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $EXA_API_KEY" \
    -d '{
    "query": "For each input company, report estimated monthly visits and total funding raised. Use the attached data partners.",
    "effort": "medium",
    "dataSources": [
      { "provider": "similarweb" },
      { "provider": "harmonic" }
    ],
    "input": {
      "data": [
        { "company": "Ramp", "domain": "ramp.com" },
        { "company": "Mercury", "domain": "mercury.com" }
      ]
    },
    "outputSchema": {
      "type": "object",
      "required": ["companies"],
      "properties": {
        "companies": {
          "type": "array",
          "maxItems": 2,
          "items": {
            "type": "object",
            "required": ["company", "domain", "monthlyVisits", "totalFunding"],
            "properties": {
              "company": { "type": "string" },
              "domain": { "type": "string" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" },
              "totalFunding": { "type": "string", "description": "from Harmonic" }
            }
          }
        }
      }
    }
  }'
  ```
</CodeGroup>

<div id="production-checklist">
  ## Checklist de mise en production
</div>

* Donnez à l&#39;Agent une `query` précise qui nomme l&#39;unité de travail et la qualité de source souhaitée.
* Utilisez `input.data` pour les records connus plutôt que d&#39;intégrer des lignes dans le prompt.
* Utilisez `input.exclusion` pour les records qui ne doivent pas être renvoyés à nouveau.
* Ajoutez `outputSchema` dès que du code en aval exploite le résultat.
* Utilisez `maxItems` sur les tableaux lorsque vous avez besoin d&#39;une portée et d&#39;un coût prévisibles.
* Conservez l&#39;`id` du run renvoyé afin de pouvoir interroger son état, rejouer les événements, inspecter les coûts ou reprendre le run plus tard.