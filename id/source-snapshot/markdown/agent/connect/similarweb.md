> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="similarweb">
  # Similarweb
</div>

> Dapatkan estimasi trafik situs web, peringkat global, dan penemuan kompetitor.

[Similarweb](https://www.similarweb.com) adalah salah satu sumber terkemuka
intelijen pasar digital. Similarweb memodelkan trafik dan engagement jutaan situs web serta
aplikasi, mencakup estimasi kunjungan, sumber trafik, demografi audiens, dan
lanskap kompetitif di sekitar domain mana pun.

Attach `similarweb` ke sebuah run [Exa Agent](/id/docs/agent/quickstart) melalui
[Exa Connect](/id/docs/agent/connect/overview), dan agent akan melakukan kueri ke
Similarweb bersamaan dengan Exa web search.

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Membandingkan trafik web dan engagement suatu perusahaan dengan para pesaingnya.
* Memetakan kompetitor suatu domain serta situs-situs dengan audiens yang beririsan.
* Memperkirakan ukuran pasar dan menyaring perusahaan berdasarkan jejak digitalnya.
* Memperkaya riset perusahaan dan kategori dengan data perilaku nyata.

<div id="provider-id">
  ## Provider ID
</div>

Gunakan nilai ini pada `dataSources`:

```text theme={null}
similarweb
```

<div id="pricing">
  ## Harga
</div>

Similarweb menagih dalam data credit dengan tarif `$0.30 / credit`, dan setiap call
dikenakan credit sebanyak yang dilaporkan Similarweb untuk call tersebut. Jumlah credit
sebanding dengan banyaknya data yang dikembalikan — kira-kira satu credit per titik data
(metrik × baris × bulan) — sehingga harga sebuah call ditentukan oleh parameternya:

| Tool                  | Credit                                                           |
| --------------------- | ---------------------------------------------------------------- |
| Traffic and rank      | hingga 7 per bulan yang diminta (1–2 bulan)                      |
| Similar sites         | 3 per situs yang dikembalikan (1–5 situs)                        |
| Traffic sources       | 10                                                               |
| Top referrers         | 3 per referrer yang dikembalikan (1–5)                           |
| Top countries         | 3 per negara yang dikembalikan (1–5)                             |
| Top pages             | 2 per halaman yang dikembalikan (1–7)                            |
| Top keywords          | 1–10 (sekitar 1 per 100 titik data kata kunci; 50 kata kunci ~7) |
| Keyword overview      | 1–2                                                              |
| Audience demographics | 8                                                                |
| Audience overlap      | 2 per kombinasi domain (2–3 domain: 6–14)                        |
| Technologies          | 10                                                               |
| Top sites by category | 1 per situs yang dikembalikan (1–10)                             |

Call yang tidak mengembalikan data (domain yang tidak dikenal atau berlalu lintas
rendah, kata kunci tanpa volume pencarian) tidak dikenakan biaya. `numResults` dan
`months` menentukan berapa banyak titik data yang Anda bayar, jadi setel sekecil
mungkin sesuai kebutuhan tugas Anda.

<div id="example">
  ## Contoh
</div>

Temukan 10 perusahaan SaaS B2B yang bertumbuh pesat beserta estimasi trafik web mereka.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      data_sources=[{"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "monthlyVisits"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "monthlyVisits": {"type": "number", "description": "from Similarweb"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
    dataSources: [{ provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "monthlyVisits"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              monthlyVisits: { type: "number", description: "from Similarweb" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      "dataSources": [{ "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "monthlyVisits"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "monthlyVisits": { "type": "number", "description": "from Similarweb" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## Cocok dipadukan dengan
</div>

* [Fiber.ai](/id/docs/agent/connect/fiber): ubah kompetitor yang ditemukan menjadi data perusahaan yang diperkaya.
* [Affiliate.com](/id/docs/agent/connect/affiliatecom): ukur jangkauan sebuah merchant sebelum merekomendasikan produknya.

<div id="next-steps">
  ## Langkah selanjutnya
</div>

<Columns cols={2}>
  <Card title="Attach ke sebuah run" icon="rocket" href="/id/docs/agent/connect/overview" cta="Buka quickstart" arrow="true">
    Quickstart Exa Connect membahas `dataSources`, harga, dan katalog partner lengkap.
  </Card>

  <Card title="Gabungkan beberapa provider" icon="blend" href="/id/docs/agent/connect/combining-providers" cta="Baca panduan" arrow="true">
    Attach hingga lima partner ke satu run dan rancang query agar masing-masing terpicu.
  </Card>

  <Card title="Pelajari Exa Agent" icon="book-open" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Buat run, pantau progres secara streaming, rancang schema output, serta kendalikan effort dan cost.
  </Card>

  <Card title="Dapatkan API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Buat key" arrow="true">
    Buat key di dashboard dan jalankan contoh di halaman ini apa adanya. Akun baru mendapat credits gratis.
  </Card>
</Columns>