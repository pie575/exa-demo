> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="n8n">
  # n8n
</div>

> Gunakan Exa search dan contents di dalam workflow n8n.

[node Exa untuk n8n](https://github.com/exa-labs/n8n-integration) resmi menambahkan web search, extraction konten, grounded answer, dan Exa Agent run ke workflow visual. Gunakan sebagai langkah workflow biasa, atau hubungkan ke n8n AI Agent sebagai tool.

<div id="install-the-exa-node">
  ## Instal node Exa
</div>

Nama package-nya adalah `n8n-nodes-exa-official`.

<Steps>
  <Step title="Tambahkan community node">
    Cari **Exa** di pemilih node n8n. Jika belum tersedia di instance Anda, pemilik instance dapat menginstal `n8n-nodes-exa-official` dengan mengikuti [panduan instalasi community node](https://docs.n8n.io/integrations/community-nodes/installation/) dari n8n.

    Node ini memerlukan n8n 1.60 atau yang lebih baru dan Node.js 20.15 atau yang lebih baru.
  </Step>

  <Step title="Buat Exa API key">
    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Tambahkan credential Exa">
    Tambahkan credential **Exa API** di n8n, lalu tempelkan key Anda. Pilih credential tersebut pada setiap node Exa yang akan menggunakan akun tersebut.
  </Step>
</Steps>

<div id="run-a-search">
  ## Menjalankan search
</div>

1. Tambahkan trigger ke sebuah workflow.
2. Tambahkan node **Exa**.
3. Pilih **Search**.
4. Masukkan query dan pilih search type.
5. Pilih format respons:
   * **Results** untuk halaman hasil peringkat
   * **Text** untuk jawaban tersintesis
   * **Structured** untuk JSON yang sesuai dengan schema Anda
6. Jalankan node tersebut dan teruskan output-nya ke langkah workflow berikutnya.

Search juga dapat mengembalikan teks, highlights, summaries, tautan, dan gambar dari setiap hasil. Filter domain, tanggal publikasi, kategori, `maxAgeHours`, dan crawling subhalaman tersedia di kolom opsional pada node.

<div id="available-resources">
  ## Resource yang tersedia
</div>

| Resource     | Operasi                                                                                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Search**   | Melakukan search di web menggunakan `auto`, `instant`, `fast`, `deep-lite`, `deep`, atau `deep-reasoning`, dengan synthesis dan structured output opsional. |
| **Contents** | Mengambil teks bersih, highlights, summaries, tautan, dan gambar dari sekumpulan URL.                                                                       |
| **Answer**   | Menghasilkan grounded answer dengan citations dan structured output opsional.                                                                               |
| **Agent**    | Membuat, memeriksa, menampilkan daftar, melakukan streaming, poll, dan membatalkan Agent run multi-langkah.                                                 |

<div id="use-exa-with-an-n8n-ai-agent">
  ## Menggunakan Exa dengan AI Agent n8n
</div>

Hubungkan node Exa ke node **AI Agent** melalui input tool-nya. Parameter yang perlu disediakan oleh model dapat menggunakan ekspresi `$fromAI()` dari n8n:

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search dan Answer sangat cocok digunakan sebagai alat grounding. Gunakan resource Agent jika tugas memerlukan riset multi-langkah, list building, enrichment terstruktur, atau data premium [Exa Connect](/id/docs/agent/connect/overview).

<div id="wait-for-an-agent-run">
  ## Menunggu Agent run
</div>

Saat membuat Agent run, **Wait for Completion** mendukung:

* **Stream** untuk mempertahankan satu koneksi server-sent events tetap terbuka hingga run selesai
* **Poll** untuk memeriksa run pada interval tertentu

Untuk workflow yang berjalan lama atau asinkron, nonaktifkan **Wait for Completion**, simpan `id` run yang dikembalikan, lalu gunakan **Get Run** nanti. Run tetap berjalan di Exa setelah langkah n8n selesai.

<div id="troubleshooting">
  ## Pemecahan Masalah
</div>

<AccordionGroup>
  <Accordion title="Node Exa tidak muncul di pemilih node">
    Minta pemilik instance untuk memasang package community node terverifikasi `n8n-nodes-exa-official`. Ketersediaan community node dapat bergantung pada cara instance n8n Anda di-hosting.
  </Accordion>

  <Accordion title="Credential Exa ditolak">
    Pastikan credential yang dipilih berisi key aktif dari [dashboard Exa](https://dashboard.exa.ai/api-keys) dan key tersebut masih memiliki credits.
  </Accordion>

  <Accordion title="Workflow Agent mengalami timeout">
    Nonaktifkan **Wait for Completion**, simpan `id` run yang dikembalikan, lalu ambil hasilnya pada langkah berikutnya dengan **Get Run**.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Sumber Daya
</div>

<Columns cols={3}>
  <Card title="Node Exa resmi" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="Lihat repository" arrow="true">
    Tinjau operasi yang tersedia saat ini, kompatibilitas, dan kode sumbernya.
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/id/docs/agent/quickstart" cta="Baca panduan" arrow="true">
    Bangun workflow riset dan enrichment multi-langkah.
  </Card>

  <Card title="Praktik terbaik search" icon="search" href="/id/docs/search/best-practices" cta="Baca panduan" arrow="true">
    Tulis kueri yang lebih baik dan pilih search mode yang tepat.
  </Card>
</Columns>