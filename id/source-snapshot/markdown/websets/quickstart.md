> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="websets">
  # Websets
</div>

> Bangun dataset terverifikasi dan ter-enrich dari web.

<div id="what-are-websets">
  ## Apa Itu Websets?
</div>

Sebuah Webset dimulai dari query berbahasa alami dan jumlah item yang ditargetkan. Tambahkan kriteria yang harus dipenuhi oleh setiap hasil serta field enrichment yang akan diisi untuk setiap item yang diterima. Hasil dikirimkan secara asinkron melalui dashboard, API, atau webhook.

Anda juga bisa membangun webset secara visual di [Dashboard](/id/docs/websets/dashboard/get-started), tanpa perlu
kode.

<Info>
  Baru memulai workflow list building atau enrichment? Gunakan [Exa Agent](/id/docs/agent/quickstart).
  Gunakan panduan ini untuk memelihara atau memperluas integrasi Websets yang sudah ada.
  API Websets memerlukan plan Websets berbayar; credits Search API dan credits Websets bersifat terpisah.
</Info>

<div id="how-it-works">
  ## Cara Kerjanya
</div>

1. **Tentukan search:** Berikan query dalam bahasa alami, jumlah hasil, serta kriteria verifikasi dan enrichment opsional.
2. **Cari dan verifikasi:** Websets menemukan kandidat dan mencocokkan masing-masing dengan kriteria Anda. Hanya hasil yang cocok yang menjadi item.
3. **Jalankan enrichment:** Untuk setiap item yang terverifikasi, Websets mencari data tambahan yang Anda minta, seperti nama CEO, jumlah pendanaan, atau informasi kontak.
4. **Terima hasil:** Lakukan poll untuk mengetahui status, gunakan webhook untuk pembaruan, atau periksa dashboard saat item mulai berdatangan.

<div id="key-capabilities">
  ## Kemampuan Utama
</div>

| Fitur                   | Fungsinya                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Verifikasi kriteria** | Setiap hasil diperiksa berdasarkan aturan yang Anda tentukan, sehingga Anda hanya memperoleh hasil yang benar-benar relevan |
| **Enrichments**         | Ekstrak data spesifik (teks, angka, tanggal, boolean) untuk setiap hasil                                                    |
| **Monitors**            | Jadwalkan pencarian berulang agar webset Anda selalu diperbarui secara otomatis                                             |
| **Webhooks**            | Terima callback HTTP secara real-time saat item ditambahkan atau di-enrich                                                  |
| **Imports**             | Gunakan URL Anda sendiri dan jalankan enrichments di atasnya                                                                |

<div id="human-quickstart">
  ## Human Quickstart
</div>

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru langsung mendapat credits gratis.
</Card>

Instal SDK:

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

Lalu kirim permintaan pertama Anda:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa
  from exa_py.websets.types import CreateWebsetParameters, CreateEnrichmentParameters
  import os

  exa = Exa(api_key=os.getenv("EXA_API_KEY"))

  webset = exa.websets.create(
      params=CreateWebsetParameters(
          search={
              "query": "Top AI research labs focusing on large language models",
              "count": 5
          },
          enrichments=[
              CreateEnrichmentParameters(
                  description="LinkedIn profile of VP of Engineering or related role",
                  format="text",
              ),
          ],
      )
  )

  print(f"Webset created with ID: {webset.id}")
  print(f"View your Webset at: {webset.dashboard_url}")

  # Tunggu sampai Webset selesai diproses
  webset = exa.websets.wait_until_idle(webset.id)

  # Ambil Item Webset
  items = exa.websets.items.list(webset_id=webset.id)
  for item in items.data:
      print(f"Item: {item.model_dump_json(indent=2)}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa(process.env.EXA_API_KEY);

  const webset = await exa.websets.create({
    search: {
      query: "Top AI research labs focusing on large language models",
      count: 10
    },
    enrichments: [
      { description: "Estimate the company's founding year", format: "number" }
    ],
  });

  console.log(`Webset created with ID: ${webset.id}`);
  console.log(`View your Webset at: ${webset.dashboardUrl}`);

  const idleWebset = await exa.websets.waitUntilIdle(webset.id, {
    timeout: 60000,
    pollInterval: 2000,
    onPoll: (status) => console.log(`Current status: ${status}...`)
  });

  const items = await exa.websets.items.list(webset.id, { limit: 10 });
  for (const item of items.data) {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/" \
    -H "accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer ${EXA_API_KEY}" \
    -d '{
      "search": {
        "query": "Top AI research labs focusing on large language models",
        "count": 5
      },
      "enrichments": [
        {"description": "Find the company'\''s founding year", "format": "number"}
      ]
    }'
  ```
</CodeGroup>

<Note>
  Lihat [Zero Data Retention](/id/docs/admin/security/zero-data-retention) untuk ketersediaan produk.
</Note>

<div id="next">
  ## Selanjutnya
</div>

* [**Panduan Dashboard**](./dashboard/get-started) - Panduan langkah demi langkah untuk menggunakan Websets di dashboard
* [**Cara Kerjanya**](./api/how-it-works) - Pembahasan mendalam tentang arsitektur berbasis event
* [**Referensi API Websets**](./api/websets/create-a-webset) - Referensi API lengkap untuk semua endpoint