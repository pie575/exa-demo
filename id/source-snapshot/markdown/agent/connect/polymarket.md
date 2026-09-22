> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Polymarket {#polymarket}

> Dapatkan odds prediction market, price history, order books, dan posisi trader.

[Polymarket](https://polymarket.com) adalah platform prediction market di mana
harga pasar mencerminkan implied probability dari khalayak terhadap
hasil di dunia nyata. [Exa Connect](/id/docs/agent/connect/overview) menyediakan
akses baca-saja ke data pasar publik Polymarket.

Attach `polymarket` ke sebuah run [Exa Agent](/id/docs/agent/quickstart), maka
agent akan melakukan kueri ke Polymarket sekaligus Exa web search.

## Gunakan untuk {#use-it-for}

* Menemukan prediction market dan market-implied odds terkini untuk suatu topik.
* Membandingkan perubahan implied probability suatu hasil dari waktu ke waktu.
* Memeriksa likuiditas market, depth bid/ask, dan pemegang posisi terbesar.
* Meninjau posisi terkini seorang trader dan aktivitas on-chain terbarunya.

## Provider ID {#provider-id}

Gunakan nilai ini pada `dataSources`:

```text theme={null}
polymarket
```

## Harga {#pricing}

API baca Polymarket bersifat unauthenticated dan gratis, sehingga tool call Polymarket
tidak dikenakan biaya: Anda hanya membayar
[harga Agent run](/id/docs/agent/quickstart#pricing) standar.

## Data yang tersedia {#data-available}

| Data                | Deskripsi                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Market dan events   | Prediction market dan events saat ini, lengkap dengan harga implied probability, volume, dan likuiditas.            |
| Price history       | Pergerakan implied probability suatu outcome dari waktu ke waktu.                                                   |
| Order books         | Depth bid/ask dan spread secara langsung untuk sebuah outcome market.                                               |
| Pemegang dan trader | Pemegang posisi terbesar pada sebuah market, serta posisi terkini seorang trader dan aktivitas on-chain terbarunya. |

## Contoh {#example}

Dapatkan market-implied odds untuk pemangkasan suku bunga The Fed beserta pergerakannya selama sebulan terakhir.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "What are the current market-implied odds of a Fed rate cut at the "
          "next FOMC meeting, and how have they moved over the past month?"
      ),
      data_sources=[{"provider": "polymarket"}],
      output_schema={
          "type": "object",
          "required": ["market", "currentProbability", "trend"],
          "properties": {
              "market": {"type": "string", "description": "the market question"},
              "currentProbability": {"type": "number", "description": "between 0 and 1"},
              "trend": {"type": "string", "description": "how the implied probability moved over the past month"},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
    dataSources: [{ provider: "polymarket" }],
    outputSchema: {
      type: "object",
      required: ["market", "currentProbability", "trend"],
      properties: {
        market: { type: "string", description: "the market question" },
        currentProbability: { type: "number", description: "between 0 and 1" },
        trend: { type: "string", description: "how the implied probability moved over the past month" },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
      "dataSources": [{ "provider": "polymarket" }],
      "outputSchema": {
        "type": "object",
        "required": ["market", "currentProbability", "trend"],
        "properties": {
          "market": { "type": "string", "description": "the market question" },
          "currentProbability": { "type": "number", "description": "between 0 and 1" },
          "trend": { "type": "string", "description": "how the implied probability moved over the past month" }
        }
      }
    }'
  ```
</CodeGroup>

## Cocok dipadukan dengan {#pairs-well-with}

* [Exa web search](/id/docs/search/quickstart): tambahkan pemberitaan dan konteks latar pada odds pasar.
* [Particle](/id/docs/agent/connect/particle): tarik liputan berita di balik pergerakan odds.
* [Financial Datasets](/id/docs/agent/connect/financialdatasets): hubungkan market-implied odds dengan harga, data fundamental, dan data makro.

## Langkah selanjutnya {#next-steps}

<Columns cols={2}>
  <Card title="Attach ke sebuah run" icon="rocket" href="/id/docs/agent/connect/overview" cta="Buka quickstart" arrow="true">
    Quickstart Exa Connect membahas `dataSources`, Harga, dan katalog partner lengkapnya.
  </Card>

  <Card title="Gabungkan providers" icon="blend" href="/id/docs/agent/connect/combining-providers" cta="Baca panduan" arrow="true">
    Attach hingga lima partner ke satu run dan rancang query agar masing-masing terpicu.
  </Card>

  <Card title="Pelajari Exa Agent" icon="book-open" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Buat runs, stream progres, rancang schema output, serta kendalikan effort dan cost.
  </Card>

  <Card title="Dapatkan API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Buat key" arrow="true">
    Buat key di dashboard dan jalankan contoh di halaman ini apa adanya. Akun baru mendapatkan credits gratis.
  </Card>
</Columns>