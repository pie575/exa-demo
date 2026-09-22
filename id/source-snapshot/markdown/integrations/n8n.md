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

[Node Exa resmi untuk n8n](https://github.com/exa-labs/n8n-integration) menambahkan web search, extraction konten, grounded answer, dan Exa Agent run ke workflow visual. Gunakan sebagai langkah workflow biasa atau hubungkan ke AI Agent n8n sebagai tool.

<div id="install-the-exa-node">
  ## Instal node Exa
</div>

Nama package-nya adalah `n8n-nodes-exa-official`.

<Steps>
  <Step title="Tambahkan community node">
    Cari **Exa** di node picker n8n. Jika belum tersedia di instance Anda, pemilik instance dapat menginstal `n8n-nodes-exa-official` dengan mengikuti [panduan instalasi community node](https://docs.n8n.io/integrations/community-nodes/installation/) dari n8n.

    Node ini membutuhkan n8n 1.60 atau lebih baru dan Node.js 20.15 atau lebih baru.
  </Step>

  <Step title="Buat Exa API key">
    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Tambahkan credential Exa">
    Tambahkan credential **Exa API** di n8n dan tempelkan key Anda. Pilih credential tersebut pada setiap node Exa yang akan menggunakan akun tersebut.
  </Step>
</Steps>

<div id="run-a-search">
  ## Menjalankan search
</div>

1. Tambahkan trigger ke sebuah workflow.
2. Tambahkan node **Exa**.
3. Pilih **Search**.
4. Masukkan query dan pilih search type.
5. Pilih format response:
   * **Results** untuk halaman yang diperingkat
   * **Text** untuk jawaban hasil sintesis
   * **Terstruktur** untuk JSON yang sesuai dengan schema Anda
6. Jalankan node tersebut dan teruskan output-nya ke langkah workflow berikutnya.

Search juga dapat mengembalikan teks, kutipan, ringkasan, tautan, dan gambar dari setiap hasil. Filter domain, publication date, kategori, `maxAgeHours`, dan crawling subhalaman tersedia di field opsional pada node tersebut.

<div id="available-resources">
  ## Sumber daya yang tersedia
</div>

| Sumber daya  | Operasi                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Search**   | Mencari di web menggunakan `auto`, `instant`, `fast`, `deep-lite`, `deep`, atau `deep-reasoning`, dengan synthesis dan output terstruktur opsional. |
| **Contents** | Mengambil teks bersih, kutipan, ringkasan, tautan, dan gambar untuk sederet URL.                                                                   |
| **Answer**   | Menghasilkan grounded answer dengan sitasi dan output terstruktur opsional.                                                                         |
| **Agent**    | Membuat, memeriksa, mendaftar, melakukan stream, poll, dan membatalkan Agent run multi-langkah.                                                    |

<div id="use-exa-with-an-n8n-ai-agent">
  ## Menggunakan Exa dengan AI Agent n8n
</div>

Hubungkan node Exa ke node **AI Agent** melalui input tool-nya. Parameter yang perlu diisi oleh model dapat menggunakan ekspresi `$fromAI()` dari n8n:

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search dan Answer berfungsi dengan baik sebagai tool grounding. Gunakan sumber daya Agent bila tugas tersebut membutuhkan research multi-langkah, list building, enrichment terstruktur, atau data premium [Exa Connect](/id/docs/agent/connect/overview).

<div id="wait-for-an-agent-run">
  ## Menunggu Agent run
</div>

Saat membuat Agent run, **Wait for Completion** mendukung:

* **Stream** untuk mempertahankan satu koneksi server-sent events tetap terbuka sampai run selesai
* **Poll** untuk memeriksa run secara berkala pada interval tertentu

Untuk workflow yang berjalan lama atau asinkron, nonaktifkan **Wait for Completion**, simpan `id` run yang dikembalikan, lalu gunakan **Get Run** nanti. Run akan tetap berjalan di Exa setelah langkah n8n selesai.

<div id="troubleshooting">
  ## Pemecahan Masalah
</div>

<AccordionGroup>
  <Accordion title="Node Exa tidak muncul di node picker">
    Minta pemilik instance untuk menginstal package komunitas terverifikasi `n8n-nodes-exa-official`. Ketersediaan community node bisa bergantung pada cara instance n8n Anda dihosting.
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
  <Card title="Node Exa resmi" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="Lihat repositori" arrow="true">
    Tinjau operasi yang tersedia saat ini, kompatibilitas, dan source.
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/id/docs/agent/quickstart" cta="Baca panduan" arrow="true">
    Bangun workflow Research dan enrichment multi-langkah.
  </Card>

  <Card title="Praktik terbaik search" icon="search" href="/id/docs/search/best-practices" cta="Baca panduan" arrow="true">
    Tulis kueri yang lebih baik dan pilih search mode yang tepat.
  </Card>
</Columns>