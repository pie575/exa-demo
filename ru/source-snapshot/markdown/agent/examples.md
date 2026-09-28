> ## Индекс документации {#documentation-index}
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжить изучение.

# Примеры {#examples}

> Примеры использования Exa Agent в production: построение списков, KYB-аналитика, вакансии и структурированные выводы.

Эти примеры демонстрируют шаблоны рабочих процессов Exa Agent для production, включая построение списков, KYB-аналитику, вакансии и структурированные выводы.

<h2 id="find-all-code">
  Найти всех сотрудников GTM в Exa.ai
</h2>

Используйте промпт на поиск, когда Agent должен сам найти строки. Чётко опишите, как отличать нужную компанию от других, и требуйте данные о текущем месте работы, чтобы компании со схожими названиями не попали в результат.

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
  KYC / KYB-аналитика
</h2>

Используйте Agent, когда для проверки партнёра или вендора нужны данные со всего публичного веба, а не одна страница профиля. Запросите верификацию личности, бизнес-контекст, публичные сигналы, инвестиционную активность и явные пометки о рисках в одном структурированном объекте.

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
  Вакансии
</h2>

Используйте Agent, когда открытые вакансии разбросаны по сайтам компаний, агрегаторам и каталогам стартапов. В этом примере источник ограничен доской вакансий Exa на базе Ashby, но различение компаний всё равно необходимо.

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
  Обогащение входных строк
</h2>

Используйте `input.data`, когда записи уже есть в вашей системе и Agent должен исследовать или обогатить каждую из них. При таком подходе идентификация строк остаётся в структурированных входных данных, а не теряется где-то в промпте.

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
  Обогащение строк ограниченным набором контактных полей
</h2>

Рабочие процессы, ориентированные на контакты, могут приводить к отдельной тарификации за обогащение контактов. Эта анонимизированная версия для документации показывает структуру данных без публикации имён, адресов электронной почты, номеров телефонов и ссылок на профили.

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
  Исключение уже известных записей
</h2>

Используйте `input.exclusion`, если Agent не должен возвращать записи, которые ваш продукт уже просмотрел, показал или отклонил.
В предпросмотре таблицы приведены вымышленные названия компаний: так шаблон исключения остаётся наглядным, и при этом не создаётся впечатления, что эти строки получены из реального выполнения в production.

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
  Продолжение завершённого рабочего процесса
</h2>

Используйте `previousRunId`, если следующий запрос должен опираться на контекст завершённого выполнения.
В предпросмотре таблицы приведены вымышленные названия компаний: они иллюстрируют схему продолжения, не раскрывая реальное предыдущее выполнение.

<CodeGroup>
  ```python Python expandable theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="From the companies you found, narrow the list to those hiring platform engineers in San Francisco. Add the hiring page URL for each match.",
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
    query: "From the companies you found, narrow the list to those hiring platform engineers in San Francisco. Add the hiring page URL for each match.",
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
    "query": "From the companies you found, narrow the list to those hiring platform engineers in San Francisco. Add the hiring page URL for each match.",
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

## Широкое построение списков с Agent Max {#broad-list-building-with-agent-max}

Используйте `effort: "max"` для задач, где полнота и тщательность важнее задержки или стоимости: масштабное построение списков, глубокое исследование по множеству источников и criteria, которые сложно проверить. Agent Max находится в публичной бете: передавайте `Exa-Beta: agent-max-effort-2026-07-27` вместе с запросом. Этот header принимает список бета-токенов, разделённых запятыми.

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

## Подключение партнёра данных через Exa Connect {#attach-a-data-partner-with-exa-connect}

Используйте `dataSources`, чтобы Exa Agent во время выполнения обращался к премиальному партнёру данных. Здесь для каждой компании добавляются данные о трафике из Similarweb и о финансировании из Harmonic в сочетании с веб-исследованием. Полный список партнёров смотрите в разделе [Exa Connect](/ru/docs/agent/connect/overview).

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

## Чеклист для production {#production-checklist}

* Задавайте Agent конкретный `query`, в котором указаны единица работы и требуемое качество источников.
* Для известных записей используйте `input.data`, а не вставляйте строки в промпт.
* Используйте `input.exclusion` для записей, которые не должны возвращаться повторно.
* Добавляйте `outputSchema`, если результат затем обрабатывается кодом.
* Используйте `maxItems` для массивов, когда нужны предсказуемые scope и стоимость.
* Сохраняйте возвращаемый `id` выполнения, чтобы затем опрашивать его, воспроизводить события, проверять затраты или продолжить выполнение позже.