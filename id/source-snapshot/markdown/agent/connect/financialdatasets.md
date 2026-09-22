> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Financial Datasets {#financial-datasets}

> Data keuangan dan pasar terstruktur untuk 27.000+ ticker AS: harga, fundamental, laba, SEC filings, kepemilikan, dan screening saham.

[Financial Datasets](https://financialdatasets.ai) menyediakan data perusahaan
dan pasar siap mesin untuk AI agents. Melalui
[Exa Connect](/id/docs/agent/connect/overview), agent dapat mengambil
harga real-time dan historis, fakta perusahaan, laporan keuangan dan
metrik valuasi, laba, kepemilikan insider dan kepemilikan institusional, SEC filings
beserta bagian-bagiannya, berita perusahaan, serta melakukan screening pasar AS berdasarkan kriteria
fundamental.

Attach `financial_datasets` ke sebuah run [Exa Agent](/id/docs/agent/quickstart),
dan agent akan melakukan kueri ke Financial Datasets berdampingan dengan Exa web search.

## Gunakan untuk {#use-it-for}

* Menyusun snapshot research perusahaan yang terstruktur.
* Menganalisis kinerja keuangan, valuasi, dan tren historis.
* Membaca SEC filings dan mengekstrak bagian seperti faktor risiko serta MD&amp;A.
* Menelaah transaksi insider dan kepemilikan institusional.
* Melakukan screening pasar AS berdasarkan kriteria fundamental.
* Memantau berita perusahaan dan perkembangan yang relevan.

## Data yang tersedia {#data-available}

Setiap dataset berikut tersedia di bawah provider `financial_datasets`;
agent akan memilih yang paling sesuai dengan tugasnya:

| Dataset                 | Apa yang dikembalikan                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Beneficial ownership    | Pemilik manfaat 5%+ dari Schedule 13D/13G, termasuk kepemilikan aktivis dan pasif.                      |
| Company facts           | Nama, sektor, industri, bursa, lokasi, SEC CIK, klasifikasi SIC.                                        |
| berita perusahaan       | Artikel berita terbaru untuk sebuah ticker.                                                             |
| laba                    | Pendapatan kuartalan dan EPS beserta perubahan YoY serta kejutan beat/miss.                             |
| Financial metrics       | Kapitalisasi pasar, EV, P/E, P/B, P/S, EV/EBITDA, PEG, margin, ROE/ROA/ROIC, pertumbuhan, EPS.          |
| Financial statements    | Laporan laba rugi, neraca, dan arus kas dari filings SEC.                                               |
| Historical stock prices | Bar OHLCV dalam rentang tanggal dengan granularitas hari/minggu/bulan/tahun.                            |
| Index-fund holdings     | Konstituen ETF/index fund berdasarkan bobot, atau dana yang memegang suatu sekuritas.                   |
| Insider ownership       | Kepemilikan insider dari SEC Form 3 dan 5 (saham yang dimiliki pejabat, direktur, pemilik 10%).         |
| Insider trades          | Transaksi insider SEC Form 4 (nama, peran, jenis, jumlah saham, nilai).                                 |
| kepemilikan institusional | Pemegang institusional 13F, jumlah saham, dan nilai yang dilaporkan.                                    |
| Interest rates          | Suku bunga kebijakan bank sentral saat ini dan historis (Fed, ECB, BOJ, dan lainnya).                   |
| SEC filing items        | Teks hasil ekstraksi dari item 10-K/10-Q/8-K tertentu (mis. faktor risiko, MD&amp;A).                   |
| SEC filings             | Metadata filing dan tautan langsung ke EDGAR, dapat difilter berdasarkan jenis formulir.                |
| Segmented financials    | Pendapatan, laba operasi, dan pos lainnya yang dirinci berdasarkan produk, segmen bisnis, dan geografi. |
| Stock price snapshot    | Harga real-time saat ini, perubahan harian, dan waktu kuotasi harga.                                    |
| Stock screener          | Perusahaan yang memenuhi kriteria filter fundamental.                                                   |

## Provider ID {#provider-id}

Gunakan nilai ini pada `dataSources`:

```text theme={null}
financial_datasets
```

## Contoh {#example}

Bangun snapshot research perusahaan yang terstruktur untuk NVIDIA.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Analyze NVIDIA using its latest price, valuation metrics, most recent "
          "quarterly financial statements and earnings, institutional and insider "
          "activity, and material SEC filing sections. Return a structured "
          "company-research snapshot with reporting dates."
      ),
      data_sources=[{"provider": "financial_datasets"}],
      output_schema={
          "type": "object",
          "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
          "properties": {
              "ticker": {"type": "string"},
              "price": {
                  "type": "object",
                  "required": ["latest", "asOf"],
                  "properties": {
                      "latest": {"type": "number"},
                      "asOf": {"type": "string"},
                  },
              },
              "valuation": {
                  "type": "object",
                  "properties": {
                      "marketCap": {"type": "number"},
                      "peRatio": {"type": "number"},
                      "evToEbitda": {"type": "number"},
                  },
              },
              "financials": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "earnings": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "ownership": {
                  "type": "object",
                  "properties": {
                      "institutionalHighlights": {"type": "string"},
                      "insiderActivity": {"type": "string"},
                  },
              },
              "filings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": ["formType", "filedAt", "keySection"],
                      "properties": {
                          "formType": {"type": "string"},
                          "filedAt": {"type": "string"},
                          "keySection": {"type": "string"},
                      },
                  },
              },
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
    dataSources: [{ provider: "financial_datasets" }],
    outputSchema: {
      type: "object",
      required: ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
      properties: {
        ticker: { type: "string" },
        price: {
          type: "object",
          required: ["latest", "asOf"],
          properties: {
            latest: { type: "number" },
            asOf: { type: "string" },
          },
        },
        valuation: {
          type: "object",
          properties: {
            marketCap: { type: "number" },
            peRatio: { type: "number" },
            evToEbitda: { type: "number" },
          },
        },
        financials: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        earnings: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        ownership: {
          type: "object",
          properties: {
            institutionalHighlights: { type: "string" },
            insiderActivity: { type: "string" },
          },
        },
        filings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: ["formType", "filedAt", "keySection"],
            properties: {
              formType: { type: "string" },
              filedAt: { type: "string" },
              keySection: { type: "string" },
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
      "query": "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
      "dataSources": [{ "provider": "financial_datasets" }],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
        "properties": {
          "ticker": { "type": "string" },
          "price": {
            "type": "object",
            "required": ["latest", "asOf"],
            "properties": {
              "latest": { "type": "number" },
              "asOf": { "type": "string" }
            }
          },
          "valuation": {
            "type": "object",
            "properties": {
              "marketCap": { "type": "number" },
              "peRatio": { "type": "number" },
              "evToEbitda": { "type": "number" }
            }
          },
          "financials": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "earnings": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "ownership": {
            "type": "object",
            "properties": {
              "institutionalHighlights": { "type": "string" },
              "insiderActivity": { "type": "string" }
            }
          },
          "filings": {
            "type": "array",
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["formType", "filedAt", "keySection"],
              "properties": {
                "formType": { "type": "string" },
                "filedAt": { "type": "string" },
                "keySection": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Cocok dipadukan dengan {#pairs-well-with}

* [Particle](/id/docs/agent/connect/particle): bandingkan liputan yang telah dipublikasikan dengan komentar di podcast.
* [Baselayer](/id/docs/agent/connect/baselayer): verifikasi entitas yang berada di balik sebuah ticker.
* [Fiber.ai](/id/docs/agent/connect/fiber): enrich perusahaan publik dengan perusahaan sejenis di pasar privat dan kontak jajaran pimpinannya.

## Langkah selanjutnya {#next-steps}

<Columns cols={2}>
  <Card title="Attach ke sebuah run" icon="rocket" href="/id/docs/agent/connect/overview" cta="Buka quickstart" arrow="true">
    Quickstart Exa Connect membahas `dataSources`, pricing, dan katalog partner selengkapnya.
  </Card>

  <Card title="Gabungkan providers" icon="blend" href="/id/docs/agent/connect/combining-providers" cta="Baca panduan" arrow="true">
    Attach hingga lima partner dalam satu run dan susun query agar masing-masing aktif.
  </Card>

  <Card title="Pelajari Exa Agent" icon="book-open" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Buat runs, stream progres, rancang schema output, serta kendalikan effort dan cost.
  </Card>

  <Card title="Dapatkan API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Buat key" arrow="true">
    Buat key di dashboard dan jalankan contoh di halaman ini apa adanya. Akun baru mendapat credits gratis.
  </Card>
</Columns>