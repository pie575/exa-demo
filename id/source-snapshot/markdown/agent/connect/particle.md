> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="particle">
  # Particle
</div>

> Cari transcript podcast dengan atribusi pembicara dan timestamp.

Podcast Intelligence dari [Particle](https://particle.news) mengindeks lebih dari 100.000 acara,
yang ditranskripsikan penuh, didiarisasi, diidentifikasi pembicaranya, dilabeli, dan diperkaya dengan metadata
dalam hitungan menit setelah tayang, sehingga percakapan lisan menjadi dapat dicari. Setiap hasil berupa
potongan transcript dengan atribusi pembicara dan timestamp.

Attach `particle` ke sebuah run [Exa Agent](/id/docs/agent/quickstart) melalui
[Exa Connect](/id/docs/agent/connect/overview), dan agent akan melakukan kueri ke
Particle sekaligus Exa web search.

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Menemukan komentar pakar dan cuplikan pernyataan yang layak dikutip.
* Pemantauan media dan merek.
* Riset narasi dan sentimen.
* Menemukan podcast dan mengikuti perkembangannya.

<div id="provider-id">
  ## Provider ID
</div>

Gunakan nilai ini pada `dataSources`:

```text theme={null}
particle
```

<div id="example">
  ## Contoh
</div>

Temukan apa yang dibicarakan para pembawa acara podcast tentang regulasi AI.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      data_sources=[{"provider": "particle"}],
      output_schema={
          "type": "object",
          "required": ["mentions"],
          "properties": {
              "mentions": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "episode", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "episode": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "pro-regulation, anti-regulation, or nuanced"},
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
    query: "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
    dataSources: [{ provider: "particle" }],
    outputSchema: {
      type: "object",
      required: ["mentions"],
      properties: {
        mentions: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["podcast", "episode", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              episode: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "pro-regulation, anti-regulation, or nuanced" },
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
      "query": "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      "dataSources": [{ "provider": "particle" }],
      "outputSchema": {
        "type": "object",
        "required": ["mentions"],
        "properties": {
          "mentions": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["podcast", "episode", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "episode": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "pro-regulation, anti-regulation, or nuanced" }
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

* [Financial Datasets](/id/docs/agent/connect/financialdatasets): periksa silang perbincangan podcast dengan berita yang telah dipublikasikan.
* [Fiber.ai](/id/docs/agent/connect/fiber): attach konteks perusahaan dan kontak pada orang-orang yang sedang dibahas.

<div id="next-steps">
  ## Langkah selanjutnya
</div>

<Columns cols={2}>
  <Card title="Attach ke sebuah run" icon="rocket" href="/id/docs/agent/connect/overview" cta="Buka quickstart" arrow="true">
    Quickstart Exa Connect membahas `dataSources`, harga, dan katalog partner lengkapnya.
  </Card>

  <Card title="Gabungkan beberapa provider" icon="blend" href="/id/docs/agent/connect/combining-providers" cta="Baca panduan" arrow="true">
    Attach hingga lima partner ke satu run dan rancang query agar masing-masing terpicu.
  </Card>

  <Card title="Pelajari Exa Agent" icon="book-open" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Buat run, pantau progres secara streaming, rancang schema output, serta kendalikan effort dan cost.
  </Card>

  <Card title="Dapatkan API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Buat key" arrow="true">
    Buat key di dashboard dan jalankan contoh di halaman ini apa adanya. Akun baru langsung mendapat credits gratis.
  </Card>
</Columns>