> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="fiberai">
  # Fiber.ai
</div>

> Cari perusahaan, orang, dan profil LinkedIn di basis data B2B milik Fiber.ai.

[Fiber.ai](https://fiber.ai) adalah platform data B2B dengan data terkini tentang 40 juta+
perusahaan, 850 juta+ orang, dan 30 juta+ lowongan kerja. Cari data perusahaan, orang, dan lowongan kerja
secara langsung, serta enrich catatan yang belum lengkap dengan work email, personal email, dan
nomor telepon.

Attach `fiber` ke sebuah run [Exa Agent](/id/docs/agent/quickstart) melalui
[Exa Connect](/id/docs/agent/connect/overview), dan agent akan melakukan kueri ke
Fiber.ai bersamaan dengan Exa web search.

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Merapikan CRM dengan menelusuri balik work email atau personal email menjadi
  identitas seseorang, atau meng-enrich catatan perusahaan/orang yang belum
  lengkap.
* Melacak sinyal LinkedIn secara real-time: pergantian pekerjaan, promosi,
  pekerjaan baru, perubahan jumlah karyawan, dan penggalangan dana.
* Menemukan postingan relevan di LinkedIn, X, Instagram, TikTok, Reddit, dan
  YouTube, menarik komentar dan reaksinya, lalu meng-enrich informasi kontak
  para penulisnya.
* Mencari di antara 40 juta+ perusahaan dan 850 juta+ orang serta meng-enrich
  prospek dengan work email, personal email, dan nomor telepon.

<div id="provider-id">
  ## Provider ID
</div>

Gunakan nilai ini pada `dataSources`:

```text theme={null}
fiber
```

<div id="pricing">
  ## Harga
</div>

Fiber.ai menagih dalam credits dengan tarif `$0.02 / credit`, dan setiap panggilan dikenakan
credits sesuai yang dilaporkan Fiber untuk panggilan tersebut:

| Operasi                                 | Credits                           |
| --------------------------------------- | --------------------------------- |
| Search                                  | 2 + 1 per hasil yang dikembalikan |
| Pencarian perusahaan                    | ~2 per kandidat yang dikembalikan |
| Pencarian orang / pencarian balik email | 2                                 |
| Pengungkapan kontak                     | 2 (work email) – 5 (telepon)      |

Panggilan yang tidak menemukan kecocokan (atau yang biayanya dikembalikan oleh Fiber) tidak dikenakan biaya. Pilihan
parameter memengaruhi harga: `numResults` pada pencarian perusahaan menentukan berapa banyak
kandidat yang Anda bayar, dan jumlah hasil pada sebuah search menentukan sebagian besar biayanya.

<div id="example">
  ## Contoh
</div>

Bangun daftar prospek B2B berisi perusahaan fintech tahap Series A di New York dengan 50–200 karyawan.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
      data_sources=[{"provider": "fiber"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "employeeCount", "fundingStage"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "employeeCount": {"type": "number"},
                          "fundingStage": {"type": "string"},
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
    query: "I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
    dataSources: [{ provider: "fiber" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "employeeCount", "fundingStage"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              employeeCount: { type: "number" },
              fundingStage: { type: "string" },
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
      "query": "I'\''m building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company'\''s LinkedIn profile, domain, employee count, and funding stage.",
      "dataSources": [{ "provider": "fiber" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "employeeCount", "fundingStage"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "employeeCount": { "type": "number" },
                "fundingStage": { "type": "string" }
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

* [Similarweb](/id/docs/agent/connect/similarweb): mengukur kehadiran web dan kompetitor sebuah prospek.
* [Baselayer](/id/docs/agent/connect/baselayer): memverifikasi pejabat dan registrasi bisnis AS yang masuk daftar pendek.
* [Particle](/id/docs/agent/connect/particle): mencari tahu apa yang dibicarakan podcast tentang sebuah perusahaan atau eksekutif.

<div id="next-steps">
  ## Langkah selanjutnya
</div>

<Columns cols={2}>
  <Card title="Attach ke sebuah run" icon="rocket" href="/id/docs/agent/connect/overview" cta="Buka quickstart" arrow="true">
    Quickstart Exa Connect membahas `dataSources`, harga, dan katalog partner selengkapnya.
  </Card>

  <Card title="Gabungkan beberapa provider" icon="blend" href="/id/docs/agent/connect/combining-providers" cta="Baca panduan" arrow="true">
    Attach hingga lima partner ke satu run dan susun query agar masing-masing terpicu.
  </Card>

  <Card title="Pelajari Exa Agent" icon="book-open" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Buat runs, stream progres, rancang schema output, serta kendalikan effort dan cost.
  </Card>

  <Card title="Dapatkan API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Buat key" arrow="true">
    Buat key di dashboard lalu jalankan contoh di halaman ini apa adanya. Akun baru mendapatkan credits gratis.
  </Card>
</Columns>