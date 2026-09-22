> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Jinko {#jinko}

> Pencarian penerbangan dan hotel dengan harga real-time.

[Jinko](https://gojinko.com) adalah platform pencarian perjalanan yang menyediakan
pencarian penerbangan dan hotel dengan harga real-time. Cari penawaran penerbangan terkini untuk suatu rute dan
tanggal, telusuri kamar hotel beserta tarifnya untuk suatu destinasi atau properti tertentu, serta
jelajahi destinasi yang dapat dijangkau dari bandara keberangkatan Anda.

Attach `jinko` ke sebuah run [Exa Agent](/id/docs/agent/quickstart) melalui
[Exa Connect](/id/docs/agent/connect/overview), dan agent akan melakukan kueri ke
Jinko bersamaan dengan Exa web search.

## Gunakan untuk {#use-it-for}

* Mencari penawaran penerbangan terkini lengkap dengan tarif, bagasi, dan kebijakan perubahan untuk rute dan tanggal tertentu.
* Menemukan hotel dengan tarif kamar terkini untuk suatu destinasi, atau mengecek ulang hotel tertentu.
* Menjelajahi destinasi dan tanggal fleksibel di berbagai rentang tanggal, kelas kabin, dan anggaran.

## Provider ID {#provider-id}

Gunakan nilai ini pada `dataSources`:

```text theme={null}
jinko
```

## Contoh {#example}

Temukan destinasi pantai yang bisa dijangkau dari New York dengan tarif pulang-pergi di bawah $400 pada bulan Maret.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find beach destinations reachable from New York for under $400 round-trip in March.",
      data_sources=[{"provider": "jinko"}],
      output_schema={
          "type": "object",
          "required": ["destinations"],
          "properties": {
              "destinations": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["city", "iataCode", "lowestFare"],
                      "properties": {
                          "city": {"type": "string"},
                          "iataCode": {"type": "string"},
                          "lowestFare": {"type": "number", "description": "round-trip fare in USD"},
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
    query: "Find beach destinations reachable from New York for under $400 round-trip in March.",
    dataSources: [{ provider: "jinko" }],
    outputSchema: {
      type: "object",
      required: ["destinations"],
      properties: {
        destinations: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["city", "iataCode", "lowestFare"],
            properties: {
              city: { type: "string" },
              iataCode: { type: "string" },
              lowestFare: { type: "number", description: "round-trip fare in USD" },
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
      "query": "Find beach destinations reachable from New York for under $400 round-trip in March.",
      "dataSources": [{ "provider": "jinko" }],
      "outputSchema": {
        "type": "object",
        "required": ["destinations"],
        "properties": {
          "destinations": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["city", "iataCode", "lowestFare"],
              "properties": {
                "city": { "type": "string" },
                "iataCode": { "type": "string" },
                "lowestFare": { "type": "number", "description": "round-trip fare in USD" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Cocok dipadukan dengan {#pairs-well-with}

* [Similarweb](/id/docs/agent/connect/similarweb): Research situs perjalanan dan platform pemesanan di balik sebuah destinasi.
* [Particle](/id/docs/agent/connect/particle): ambil liputan terbaru dan ulasan perjalanan tentang suatu tempat.

## Langkah berikutnya {#next-steps}

<Columns cols={2}>
  <Card title="Attach ke sebuah run" icon="rocket" href="/id/docs/agent/connect/overview" cta="Buka quickstart" arrow="true">
    Quickstart Exa Connect membahas `dataSources`, Harga, dan katalog partner selengkapnya.
  </Card>

  <Card title="Gabungkan providers" icon="blend" href="/id/docs/agent/connect/combining-providers" cta="Baca panduan" arrow="true">
    Attach hingga lima partner ke satu run dan susun query agar masing-masing terpicu.
  </Card>

  <Card title="Pelajari Exa Agent" icon="book-open" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Buat runs, stream progres, rancang schema output, serta kendalikan effort dan cost.
  </Card>

  <Card title="Dapatkan API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Buat key" arrow="true">
    Buat key di dashboard dan jalankan contoh di halaman ini apa adanya. Akun baru mendapatkan credits gratis di awal.
  </Card>
</Columns>