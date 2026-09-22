> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="tempo-mpp-gtm-enrichment-cookbook">
  # Cookbook Enrichment GTM dengan Tempo MPP
</div>

> Bangun workflow enrichment GTM yang membayar per permintaan Exa search dan contents dengan Tempo MPP — tanpa perlu API key.

Gunakan cookbook ini untuk membangun agent atau pipeline enrichment GTM di atas
endpoint `/search` dan `/contents` milik Exa, yang dibayar per permintaan melalui Machine
Payments Protocol (MPP). MPP mendukung beberapa metode payment; contoh di
sini menggunakan stablecoin di [Tempo](https://tempo.xyz). Tanpa langganan bulanan, tanpa
API key, dan tanpa pricing berbasis seat: isi saldo wallet dengan USDC.e lalu bayar sesuai pemakaian saat Anda
meng-enrich lead atau perusahaan.

<Info>
  MPP saat ini hanya didukung pada endpoint `/search` dan `/contents` milik Exa.
  Agent API (`/agent/runs`) dan `/answer` memerlukan Exa API key dan mengikuti
  alur API key billing standar.
</Info>

<div id="what-youll-build">
  ## Yang akan Anda bangun
</div>

Sebuah pipeline enrichment ringan yang, dari daftar nama perusahaan atau
deskripsi target:

1. Menggunakan Exa `/search` dengan `type: "deep"` dan `outputSchema` untuk menemukan
   halaman resmi perusahaan dan mengekstrak metadata penting.
2. Menggunakan `contents.highlights` pada hasil yang dikembalikan untuk mengambil kutipan sumber
   terkait pendanaan, kantor pusat, jumlah karyawan, dan produk.
3. Menghasilkan satu catatan enrichment berformat CSV atau JSON untuk setiap masukan.

Pola ini cocok untuk enrichment daftar prospek, riset akun, dan
personalisasi outbound. Karena tersusun dari panggilan `/search` + `/contents`
yang terpisah, setiap langkah dapat dibayar dengan MPP.

<div id="prerequisites">
  ## Prasyarat
</div>

* Wallet yang kompatibel dengan Tempo dan telah diisi dana **USDC.e** di Tempo mainnet.
* Cara yang aman untuk memuat private key wallet saat runtime (lihat di bawah; jangan pernah
  melakukan commit key tersebut atau mengeksposnya di dalam kode sumber).
* `mppx` (TypeScript) atau `pympp` (Python) sudah terinstal.

<Info>
  Untuk penyiapan lewat baris perintah yang tidak memerlukan private key mentah, gunakan [Tempo Wallet CLI](/id/docs/integrations/payments/mpp/quickstart#pay-from-the-command-line). `tempo wallet login` akan membuat atau menghubungkan wallet dan bisa jadi menyertakan MPP Credits gratis untuk pendaftar baru.
</Info>

<div id="mpp-setup">
  ## Penyiapan MPP
</div>

<div id="install-the-client">
  ### Instal client
</div>

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

<div id="load-your-private-key-safely">
  ### Muat private key Anda dengan aman
</div>

Jangan pernah menulis private key secara hardcode. Contoh di bawah ini membaca `WALLET_PRIVATE_KEY` dari
environment runtime Anda, hanya untuk pengembangan lokal. Di production, muat private key dari
secrets manager seperti 1Password, AWS Secrets Manager, atau HashiCorp Vault.

<CodeGroup>
  ```bash TypeScript theme={null}
  # Atur di shell atau penyimpanan secret CI Anda; jangan pernah commit nilai ini
  export WALLET_PRIVATE_KEY="0x..."
  ```

  ```bash Python theme={null}
  # Atur di shell atau penyimpanan secret CI Anda; jangan pernah commit nilai ini
  export WALLET_PRIVATE_KEY="0x..."
  ```
</CodeGroup>

<div id="make-a-paid-search-request">
  ### Mengirim permintaan search berbayar
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  // Di production, muat nilai ini dari secrets manager — jangan pernah commit nilai mentahnya.
  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      numResults: 5,
      contents: { highlights: true },
    }),
  });

  const data = (await response.json()) as { results: { title: string; url: string }[] };
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      # Di production, muat nilai ini dari secrets manager — jangan pernah commit nilai mentahnya.
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": "Series A fintech companies with 50-200 employees",
                  "numResults": 5,
                  "contents": {"highlights": True},
              },
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

Response yang berhasil akan mengembalikan hasil Exa beserta header `Payment-Receipt` yang berisi
hash transaksi on-chain.

<div id="make-a-paid-contents-request">
  ### Membuat permintaan contents berbayar
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  const contentsResponse = await mppx.fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: ["https://www.example.com"],
      text: true,
      summary: true,
    }),
  });

  const contentsData = (await contentsResponse.json()) as {
    results: { url: string; text?: string; summary?: string }[];
  };
  console.log(contentsData.results[0]);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/contents",
      json={
          "urls": ["https://www.example.com"],
          "text": True,
          "summary": True,
      },
  )
  print(response.json()["results"][0])
  ```
</CodeGroup>

<div id="gtm-enrichment-recipe">
  ## Resep enrichment GTM
</div>

<div id="enrich-a-list-of-companies">
  ### Enrich daftar perusahaan
</div>

Dari daftar nama perusahaan, cari halaman masing-masing perusahaan dan ekstrak
detail terstruktur.

<CodeGroup>
  ```typescript TypeScript theme={null}
  interface CompanyEnrichment {
    name: string;
    url: string;
    title: string;
    industry?: string;
    headquarters?: string;
    funding?: string;
    summary?: string;
    highlights: string[];
  }

  async function enrichCompanies(names: string[]): Promise<CompanyEnrichment[]> {
    const enriched: CompanyEnrichment[] = [];

    for (const name of names) {
      const response = await mppx.fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `${name} official company`,
          type: "deep",
          numResults: 1,
          contents: {
            highlights: { query: "funding, headquarters, employees, product" },
          },
          outputSchema: {
            type: "object",
            properties: {
              company: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  industry: { type: "string" },
                  headquarters: { type: "string" },
                  funding: { type: "string" },
                  summary: { type: "string" },
                },
                required: ["name", "url"],
              },
            },
            required: ["company"],
          },
        }),
      });

      const data = (await response.json()) as {
        output?: { company?: CompanyEnrichment & { summary?: string } };
        results?: { highlights?: string[] }[];
      };
      const company = data.output?.company;
      const highlights = data.results?.[0]?.highlights?.slice(0, 3) ?? [];
      if (!company) continue;

      enriched.push({
        ...company,
        title: company.name,
        highlights,
      });
    }

    return enriched;
  }
  ```

  ```python Python theme={null}
  async def enrich_companies(names):
      enriched = []
      for name in names:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": f"{name} official company",
                  "type": "deep",
                  "numResults": 1,
                  "contents": {
                      "highlights": {"query": "funding, headquarters, employees, product"}
                  },
                  "outputSchema": {
                      "type": "object",
                      "properties": {
                          "company": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "url": {"type": "string"},
                                  "industry": {"type": "string"},
                                  "headquarters": {"type": "string"},
                                  "funding": {"type": "string"},
                                  "summary": {"type": "string"},
                              },
                              "required": ["name", "url"],
                          }
                      },
                      "required": ["company"],
                  },
              },
          )
          data = response.json()
          company = data.get("output", {}).get("company")
          highlights = []
          if data.get("results"):
              highlights = data["results"][0].get("highlights", [])[:3]
          if not company:
              continue

          enriched.append({
              "name": company["name"],
              "url": company["url"],
              "title": company["name"],
              "industry": company.get("industry"),
              "headquarters": company.get("headquarters"),
              "funding": company.get("funding"),
              "summary": company.get("summary"),
              "highlights": highlights,
          })
      return enriched
  ```
</CodeGroup>

<div id="enrich-a-person-profile">
  ### Enrich profil seseorang
</div>

Resep ini menggunakan `type: "deep"`, `contents.highlights`, dan `outputSchema` untuk
meneliti seseorang dan mengembalikan profil terstruktur.

<CodeGroup>
  ```typescript TypeScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Exa Labs founders contact and background",
      type: "deep",
      numResults: 5,
      contents: {
        highlights: { query: "email, title, education, work history, LinkedIn" },
      },
      outputSchema: {
        type: "object",
        properties: {
          people: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                title: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                linkedInUrl: { type: "string" },
                summary: { type: "string" },
              },
              required: ["name"],
            },
          },
        },
        required: ["people"],
      },
    }),
  });

  const data = (await response.json()) as {
    output?: { people: { name: string; title?: string; company?: string }[] };
  };
  console.log(data.output?.people);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Exa Labs founders contact and background",
          "type": "deep",
          "numResults": 5,
          "contents": {
              "highlights": {"query": "email, title, education, work history, LinkedIn"}
          },
          "outputSchema": {
              "type": "object",
              "properties": {
                  "people": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "title": {"type": "string"},
                              "company": {"type": "string"},
                              "email": {"type": "string"},
                              "linkedInUrl": {"type": "string"},
                              "summary": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["people"],
          },
      },
  )

  print(response.json().get("output", {}).get("people"))
  ```
</CodeGroup>

<Note>
  Contoh ini menggunakan `type: "deep"` untuk penalaran yang lebih mendalam dan `outputSchema` untuk menentukan bentuk
  response. Deep search dikenakan biaya $0,012 per permintaan, dan
  `contents.highlights` menambah $0,001 per hasil.
</Note>

<div id="structured-output">
  ### Output terstruktur
</div>

Jika Anda menginginkan field JSON alih-alih teks mentah, gunakan `outputSchema` pada
permintaan search. Exa akan mengembalikan objek `output` yang bentuknya mengikuti schema Anda.

<CodeGroup>
  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Series A fintech companies with 50-200 employees",
          "type": "deep-lite",
          "numResults": 5,
          "outputSchema": {
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "headcount": {"type": "string"},
                              "headquarters": {"type": "string"},
                              "fundingStage": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["companies"],
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      type: "deep-lite",
      numResults: 5,
      outputSchema: {
        type: "object",
        properties: {
          companies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                headcount: { type: "string" },
                headquarters: { type: "string" },
                fundingStage: { type: "string" }
              },
              required: ["name"]
            }
          }
        },
        required: ["companies"]
      }
    })
  });
  ```
</CodeGroup>

<Note>
  `outputSchema` bekerja paling baik dengan search type `deep-lite` atau `deep`. Field ini menambahkan
  satu LLM call di sisi Exa, sehingga harganya mengikuti `deep-lite`/`deep`.
</Note>

<div id="pricing-and-limits">
  ## Harga dan batas
</div>

MPP menggunakan harga per permintaan yang sama dengan API key billing. Permintaan search MPP
dibatasi maksimal 10 hasil.

| Operasi                                                | Harga                 |
| ------------------------------------------------------ | --------------------- |
| `/search` dengan `type` `instant`, `auto`, atau `fast` | $0,007 per permintaan |
| `/search` dengan `type` `deep-lite` atau `deep`        | $0,012 per permintaan |
| `/search` dengan `type` `deep-reasoning`               | $0,015 per permintaan |
| `contents.text`                                        | $0,001 per URL        |
| `contents.highlights`                                  | $0,001 per URL        |
| `contents.summary`                                     | $0,001 per hasil      |

Lihat [Pay with MPP (Tempo)](/id/docs/integrations/payments/mpp/quickstart) untuk referensi lengkap,
termasuk rate limit, detail jaringan, dan header payment.

<div id="production-tips">
  ## Tips untuk production
</div>

* **Isi wallet hanya dengan USDC.e.** Exa menanggung biaya jaringan Tempo,
  sehingga wallet tidak memerlukan token gas terpisah.
* **Tangani response `402`.** SDK MPP mencoba ulang secara otomatis,
  tetapi client kustom sebaiknya mencoba ulang saat menerima `402` menggunakan challenge
  `WWW-Authenticate: Payment`.
* **Cache hasil `/contents`.** Contents ditagih per URL. Lakukan cache
  berdasarkan URL agar tidak membayar dua kali untuk halaman perusahaan yang sama.
* **Perhatikan batas 10 hasil.** MPP search membatasi `numResults` hingga 10.
* **Jangan pernah melakukan commit private keys.** Muat `WALLET_PRIVATE_KEY` dari
  secrets manager, bukan dari source control.

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Bisakah saya menggunakan MPP dengan Exa Agent API?">
    Tidak. Dalam basis kode Exa, MPP hanya terhubung ke `/search` dan `/contents`.
    `/agent/runs` dan `/answer` memerlukan Exa API key dan menggunakan billing
    API key standar.
  </Accordion>

  <Accordion title="Bisakah saya menggabungkan MPP dan Exa API key pada permintaan yang sama?">
    Tidak. Jika sebuah permintaan menyertakan `x-api-key` atau `Authorization: Bearer`,
    alur API key akan diprioritaskan dan MPP dilewati.
  </Accordion>

  <Accordion title="Apa yang terjadi jika settlement MPP gagal?">
    Exa mengembalikan `402` disertai challenge `WWW-Authenticate: Payment` yang baru dan tanpa
    hasil. Client Anda dapat mencoba lagi dengan payment baru. Tidak ada hasil yang dikembalikan
    sampai settlement berhasil.
  </Accordion>

  <Accordion title="Apakah saya memerlukan wallet Tempo terpisah untuk setiap environment?">
    Anda dapat menggunakan wallet yang sama, tetapi kami menyarankan wallet terpisah untuk
    pengembangan dan production. QPS per wallet adalah 10 permintaan/detik untuk seluruh
    permintaan dari wallet tersebut.
  </Accordion>
</AccordionGroup>

<div id="next-steps">
  ## Langkah selanjutnya
</div>

* [Bayar dengan MPP (Tempo)](/id/docs/integrations/payments/mpp/quickstart): referensi MPP lengkap
* [Panduan Exa Search API](/id/docs/search/quickstart): referensi parameter search
* [Panduan Exa Contents API](/id/docs/contents/quickstart): referensi parameter contents
* [Dokumentasi Tempo MPP](https://mpp.dev/protocol): detail protokol dan SDK