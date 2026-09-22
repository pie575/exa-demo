> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Contoh {#examples}

> Contoh Exa Agent tingkat production untuk list building, intelijen KYB, lowongan kerja, dan output terstruktur.

Contoh-contoh ini menunjukkan pola workflow production untuk Exa Agent, termasuk list building, intelijen KYB, lowongan kerja, dan output terstruktur.

<h2 id="find-all-code">
  Temukan semua anggota GTM di Exa.ai
</h2>

Gunakan prompt discovery ketika Agent yang harus menemukan barisnya. Jelaskan secara eksplisit soal company disambiguation dan wajibkan evidence status kerja saat ini agar perusahaan dengan nama serupa tidak ikut masuk ke hasil.

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
  Intelijen KYC / KYB
</h2>

Gunakan Agent saat peninjauan partner atau vendor membutuhkan intelijen dari public web, bukan sekadar satu halaman profil. Mintalah verifikasi identitas, konteks bisnis, sinyal publik, aktivitas investasi, dan catatan risiko secara eksplisit dalam satu objek terstruktur.

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
  Lowongan pekerjaan
</h2>

Gunakan Agent saat lowongan posisi tersebar di halaman perusahaan, agregator, dan direktori startup. Contoh ini membatasi sumber hanya pada papan lowongan kerja Exa yang dihosting di Ashby, dan tetap membutuhkan disambiguasi perusahaan.

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
  Enrich baris input
</h2>

Gunakan `input.data` saat sistem Anda sudah memiliki catatannya dan Agent perlu melakukan research atau enrich pada setiap catatan. Pola ini mempertahankan identitas baris di dalam input terstruktur, alih-alih menyembunyikannya di dalam prompt.

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
  Enrich baris dengan contact field yang dibatasi
</h2>

Workflow yang berorientasi kontak dapat memicu biaya contact enrichment tersendiri. Versi dokumentasi yang dianonimkan ini menunjukkan bentuk datanya tanpa memublikasikan nama pribadi, email, nomor telepon, atau URL profil.

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
  Kecualikan catatan yang sudah diketahui
</h2>

Gunakan `input.exclusion` saat Agent perlu menghindari catatan yang sudah ditinjau, ditampilkan, atau ditolak oleh produk Anda.
Pratinjau lembar kerja memakai nama perusahaan sintetis pada hasilnya agar pola exclusion tetap terlihat tanpa menyiratkan bahwa baris tersebut berasal dari run production yang sesungguhnya.

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
  Melanjutkan workflow yang sudah selesai
</h2>

Gunakan `previousRunId` jika permintaan berikutnya perlu memanfaatkan konteks dari run yang sudah selesai.
Pratinjau lembar kerja memakai nama perusahaan sintetis pada hasil yang dikembalikan untuk menggambarkan pola kelanjutan tanpa menampilkan run sebelumnya yang sebenarnya.

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

## List building berskala luas dengan Agent Max {#broad-list-building-with-agent-max}

Gunakan `effort: "max"` untuk pekerjaan yang lebih mengutamakan kelengkapan dan ketelitian daripada latency atau biaya, termasuk list building berskala besar, Research mendalam dari banyak source, dan kriteria yang sulit diverifikasi. Agent Max masih dalam tahap public beta: kirimkan `Exa-Beta: agent-max-effort-2026-07-27` bersama permintaan. Header ini menerima daftar token beta yang dipisahkan koma.

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

## Attach data partner dengan Exa Connect {#attach-a-data-partner-with-exa-connect}

Gunakan `dataSources` agar Exa Agent bisa mengambil data dari data partner premium selama satu run. Di sini, setiap perusahaan di-enrich dengan trafik dari Similarweb dan pendanaan dari Harmonic, dipadukan dengan Research web. Lihat [Exa Connect](/id/docs/agent/connect/overview) untuk daftar lengkap partner.

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

## Checklist production {#production-checklist}

* Berikan Agent `query` yang spesifik, yang menyebutkan unit pekerjaan dan kualitas source yang diinginkan.
* Gunakan `input.data` untuk catatan yang sudah diketahui, bukan menyisipkan barisnya ke dalam prompt.
* Gunakan `input.exclusion` untuk catatan yang tidak boleh dikembalikan lagi.
* Tambahkan `outputSchema` setiap kali hasilnya dipakai oleh kode di sisi hilir.
* Gunakan `maxItems` pada array saat Anda memerlukan scope dan cost yang dapat diprediksi.
* Simpan `id` run yang dikembalikan agar Anda dapat melakukan poll, me-replay events, memeriksa cost, atau melanjutkan dari run tersebut nanti.