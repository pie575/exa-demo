> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="examples">
  # 示例
</div>

> 涵盖列表构建、KYB 情报、职位发布和结构化输出的 Exa Agent 生产级示例。

以下示例展示了 Exa Agent 的生产级工作流模式，包括列表构建、KYB 情报、职位发布和结构化输出。

<h2 id="find-all-code">
  查找 Exa.ai 的所有 GTM 成员
</h2>

当需要由 Agent 自行找出这些条目时，请使用发现型提示词。务必明确公司消歧规则，并要求提供在职证据，避免名称相似的公司混入结果。

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
  KYC / KYB 情报
</h2>

当合作伙伴或供应商尽调所需的不只是一个资料页面，而是全网公开情报时，就可以使用 Agent。你可以在一次请求中获得身份核验、业务背景、公开信号、投资动态以及明确的风险提示，并以单个结构化对象返回。

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
  招聘职位
</h2>

当空缺职位分散在公司官网、聚合网站和创业公司名录中时，就可以使用 Agent。本示例将信息来源限定为 Exa 托管在 Ashby 上的招聘页面，但仍需对公司做消歧处理。

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
  丰富输入行数据
</h2>

如果你的系统中已有这些记录，只需让 Agent 逐条研究或补充信息，请使用 `input.data`。这种方式将行标识保留在结构化输入中，而不是把它塞进提示词里。

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
  用有界的联系人字段丰富行数据
</h2>

面向联系人的工作流可能会产生单独的联系人 enrichment 费用。此处的文档示例已做匿名化处理，只展示数据结构，不会公开真实姓名、邮箱、电话号码或个人主页链接。

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
  排除已知记录
</h2>

如果希望 Agent 跳过你的产品中已经审阅、展示或拒绝过的记录，请使用 `input.exclusion`。
表格预览中返回的公司名称均为合成数据，这样既能直观呈现排除机制，又不会让人误以为这些行来自真实的生产运行。

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
  继续已完成的工作流
</h2>

如果下一个请求需要在某次已完成运行的上下文基础上继续，请使用 `previousRunId`。
表格预览中的公司名称为虚构数据，仅用于演示这种延续模式，不会暴露真实的历史运行。

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

<div id="broad-list-building-with-agent-max">
  ## 使用 Agent Max 进行大范围列表构建
</div>

当完整性和彻底性比延迟或成本更重要时，请使用 `effort: "max"`，适用于大规模列表构建、多来源深度调研，以及难以验证的 criteria。Agent Max 目前处于公开测试阶段：请在请求中附带 `Exa-Beta: agent-max-effort-2026-07-27`。该 header 支持以逗号分隔的 beta 令牌列表。

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
  ## 使用 Exa Connect 接入数据合作伙伴
</div>

通过 `dataSources`，可让 Exa Agent 在运行期间从优质数据合作伙伴获取数据。本例中，它结合网络调研，为每家公司补充来自 Similarweb 的流量数据和来自 Harmonic 的融资数据。完整的合作伙伴列表请参阅 [Exa Connect](/zh/docs/agent/connect/overview)。

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
  ## 生产环境检查清单
</div>

* 为 Agent 提供明确的 `query`，说明工作单元以及期望的来源质量。
* 对已知记录使用 `input.data`，而不是将数据行嵌入提示词中。
* 对不应再次返回的记录使用 `input.exclusion`。
* 只要下游代码需要使用返回结果，就添加 `outputSchema`。
* 需要可预期的范围和成本时，为数组设置 `maxItems`。
* 保存返回的运行 `id`，以便后续轮询、重放事件、查看成本，或从该次运行继续。