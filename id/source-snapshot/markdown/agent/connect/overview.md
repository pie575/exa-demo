> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-connect">
  # Exa Connect
</div>

> Berikan Exa Agent Anda akses langsung ke data partners premium, berdampingan dengan Exa web search, dalam satu run.

Exa Connect mengintegrasikan data partners premium ke dalam loop Exa Agent. Attach sebuah
provider ke sebuah run, lalu Exa Agent akan melakukan query ke database partner tersebut berdampingan dengan web
search, sebelum menggabungkan hasilnya menjadi satu jawaban yang grounded dan terstruktur.

Baru mengenal agent runs? Mulailah dari [panduan Exa Agent](/id/docs/agent/quickstart),
lalu kembali ke sini untuk attach data partners.

<Tip>
  Exa Agent sudah melakukan search pada seluruh [data index](/id/docs/search/data/overview) — sumber
  berita, kode, perusahaan, dan orang yang sama seperti Search API. Exa Connect menambahkan
  database partner premium di atasnya.
</Tip>

<Tip>
  Lebih suka MCP? Exa Agent dan [Exa Connect](/id/docs/agent/connect/overview) tersedia di [Exa MCP](/id/docs/get-started/exa-mcp#exa-agent). Aktifkan `tools=agent_run` untuk menjalankan riset multi-langkah, pembuatan daftar, enrichment, dan structured output dari Claude, Cursor, dan klien MCP lainnya.
</Tip>

<div id="why-exa-connect">
  ## Mengapa Exa Connect
</div>

* **Data premium tanpa integrasi terpisah.** Akses data partner tanpa perlu
  menandatangani kontrak atau menyiapkan SDK. Anda cukup memanggil satu API Exa.
* **Exa yang mengurus detail teknisnya.** Kami mengelola autentikasi provider, pemilihan tool,
  percobaan ulang, dan pemeringkatan hasil.
* **Exa Agent yang memilih sumbernya.** Ketika `outputSchema` Anda meminta
  &quot;kunjungan bulanan dari Similarweb&quot; atau &quot;pejabat terverifikasi&quot;, Exa Agent memanggil
  tool partner yang sesuai alih-alih menebak dari sebuah halaman web.
* **Data indeks dan partner dalam satu run.** Connect berjalan di atas indeks Exa.
  Exa Agent memanfaatkan setiap sumber sesuai keunggulannya dan mencantumkan sitasi hasilnya.

<div id="how-it-works">
  ## Cara kerjanya
</div>

1. **Attach** satu atau beberapa provider melalui array `dataSources` pada
   [`POST /agent/runs`](/id/docs/reference/agent-api/create-a-run).
2. Exa Agent **memilih tool yang tepat** untuk setiap langkah berdasarkan query dan
   `outputSchema` Anda: data partner atau Exa web search.
3. Hasil dari partner **dipadukan dengan riset web** menjadi structured output Anda,
   lengkap dengan sumbernya.

<div id="pricing">
  ## Harga
</div>

<Note>
  Harga Exa Connect bersifat tambahan di atas [harga Agent run standar](/id/docs/agent/quickstart#pricing).
  Anda membayar biaya komputasi Agent dan search seperti biasa, ditambah biaya provider call untuk setiap tool call Exa Connect.
</Note>

| Provider                                             | Harga                                         |
| ---------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/id/docs/agent/connect/fiber#pricing)        | `$0.02 / credit`                              |
| [Similarweb](/id/docs/agent/connect/similarweb#pricing) | `$0.30 / credit`                              |
| [Baselayer](/id/docs/agent/connect/baselayer#pricing)   | `$0.10 – $4.00 / order (varies by operation)` |
| [Polymarket](/id/docs/agent/connect/polymarket#pricing) | `Free`                                        |
| Affiliate.com                                        | `$0.015 / call`                               |
| Particle                                             | `$0.015 / call`                               |
| Financial Datasets                                   | `$0.01 / call`                                |
| Jinko                                                | `$0.005 / call`                               |

Fiber.ai menagih dalam credit, bukan per call, karena biaya mereka sendiri berbeda-beda
tiap call: satu search dikenai 2 credit ditambah 1 per hasil yang dikembalikan,
pencarian perusahaan atau orang ditagih per kandidat yang dikembalikan (jadi
menaikkan `numResults` pada pencarian perusahaan untuk memilah nama yang ambigu
akan lebih mahal), dan pengungkapan kontak dikenai 2–5 credit tergantung apakah
Anda meminta work email, personal email, atau nomor telepon. Anda ditagih sesuai
credit yang dilaporkan Fiber untuk setiap call; call yang tidak menemukan
kecocokan tidak dikenai biaya. Lihat [harga Fiber.ai](/id/docs/agent/connect/fiber#pricing).

Similarweb menagih dalam data credit (kira-kira satu per metrik × baris × bulan),
sehingga harga sebuah call mengikuti `numResults`/`months` — 1 hingga 15 credit per
call. Anda ditagih sesuai credit yang dilaporkan Similarweb untuk setiap call; call
yang tidak mengembalikan data tidak dikenai biaya. Lihat [harga Similarweb](/id/docs/agent/connect/similarweb#pricing).

Baselayer menagih per order, dan tarifnya bergantung pada operasinya: pencarian
bisnis KYB seharga $1.00, pencarian UCC lien seharga $2.00 per negara bagian yang
dicari, pencarian dokumen litigasi/kepailitan seharga $1.00 per kategori, screening
watchlist seharga $0.10–$0.25 per daftar yang diminta, klasifikasi industri dan
analisis situs web masing-masing $0.35, kehadiran web dihitung sebagai total dari
analisis yang dipilih (masing-masing $0.15–$0.35), dan pencarian bisnis
internasional seharga $4.00. Pembacaan lanjutan atas hasil pencarian bisnis sebelumnya
(business lookup, pejabat, registrations, pencarian balik pejabat) tidak dikenai
biaya. Lihat [harga Baselayer](/id/docs/agent/connect/baselayer#pricing).

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Profile Anthropic: total funding and estimated monthly web traffic.",
      data_sources=[{"provider": "fiber"}, {"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["company"],
          "properties": {
              "company": {
                  "type": "object",
                  "required": ["name", "totalFunding", "monthlyVisits"],
                  "properties": {
                      "name": {"type": "string"},
                      "totalFunding": {"type": "string", "description": "from Fiber.ai"},
                      "monthlyVisits": {"type": "number", "description": "from Similarweb"},
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
    query: "Profile Anthropic: total funding and estimated monthly web traffic.",
    dataSources: [{ provider: "fiber" }, { provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["company"],
      properties: {
        company: {
          type: "object",
          required: ["name", "totalFunding", "monthlyVisits"],
          properties: {
            name: { type: "string" },
            totalFunding: { type: "string", description: "from Fiber.ai" },
            monthlyVisits: { type: "number", description: "from Similarweb" },
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
      "query": "Profile Anthropic: total funding and estimated monthly web traffic.",
      "dataSources": [{ "provider": "fiber" }, { "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["company"],
        "properties": {
          "company": {
            "type": "object",
            "required": ["name", "totalFunding", "monthlyVisits"],
            "properties": {
              "name": { "type": "string" },
              "totalFunding": { "type": "string", "description": "from Fiber.ai" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="data-partners">
  ## Data partners
</div>

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/fiber.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=e2292b486593416a57b075123bcfc513" href="/id/docs/agent/connect/fiber" width="400" height="400" data-path="images/agent/connect/fiber.svg">
      **GTM &amp; rekrutmen.** Basis data B2B berisi perusahaan dan individu untuk pencarian prospek
      dan riset kontak.
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/similarweb.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7ac916fb46576857bd10c95f12ae78dc" href="/id/docs/agent/connect/similarweb" width="400" height="371" data-path="images/agent/connect/similarweb.svg">
      **Analitik web.** Estimasi trafik, peringkat global, dan penemuan
      kompetitor untuk domain apa pun.
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/baselayer.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=d73cd54ad8fc01672a8407aabefee887" href="/id/docs/agent/connect/baselayer" width="400" height="247" data-path="images/agent/connect/baselayer.svg">
      **Kepatuhan &amp; KYB.** Verifikasi bisnis AS: pejabat perusahaan, registrasi, dan sinyal
      risiko.
    </Card>

    <Card title="Polymarket" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/polymarket.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a3541cde8f59cb64491fa6f4f40f12c" href="/id/docs/agent/connect/polymarket" width="168" height="168" data-path="images/agent/connect/polymarket.svg">
      **Prediction markets.** Odds prediction market, riwayat harga, dan posisi
      trader dari Polymarket.
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/affiliatecom.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=b193bea9be653125ba5695f3cd2c027a" href="/id/docs/agent/connect/affiliatecom" width="400" height="400" data-path="images/agent/connect/affiliatecom.svg">
      **Commerce.** Pencarian katalog produk dengan harga, merek, dan tautan merchant.
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/particle.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=72ab9729a143893f286fa369ceeb036f" href="/id/docs/agent/connect/particle" width="400" height="400" data-path="images/agent/connect/particle.svg">
      **Media intelligence.** Cari transcript podcast lengkap dengan atribusi pembicara
      dan timestamp.
    </Card>

    <Card title="Dataset Keuangan" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/financialdatasets.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=24052e4641fa4060e1ccf64482b10e00" href="/id/docs/agent/connect/financialdatasets" width="401" height="400" data-path="images/agent/connect/financialdatasets.svg">
      **Finance.** Harga, fundamental, kinerja laba, SEC filings, kepemilikan, dan
      penyaringan saham untuk 27.000+ ticker AS.
    </Card>

    <Card title="Jinko" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/jinko.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=958d2ec147d452f12c0904f41ffb2311" href="/id/docs/agent/connect/jinko" width="400" height="395" data-path="images/agent/connect/jinko.svg">
      **Travel.** Pencarian penerbangan dan hotel dengan harga real-time.
    </Card>
  </Columns>
</div>

Butuh sumber yang tidak tercantum di atas? Lihat [Penyedia tambahan](/id/docs/agent/connect/additional-partners) kami, yang tersedia atas permintaan dengan menghubungi tim kami.

<div id="usage">
  ## Penggunaan
</div>

<div id="combining-providers">
  ### Menggabungkan provider
</div>

Attach partner sebanyak yang dibutuhkan tugas Anda. Exa Agent akan memanggil masing-masing partner di bidang yang paling dikuasainya dan memadukan hasilnya dengan web search menjadi satu jawaban terstruktur:

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

Untuk panduan lengkapnya, termasuk cara menyusun query dan `outputSchema` Anda agar setiap
partner terpicu, lihat [Menggabungkan provider](/id/docs/agent/connect/combining-providers).