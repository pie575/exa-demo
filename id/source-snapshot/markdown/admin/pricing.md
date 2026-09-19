> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="pricing">
  # Harga
</div>

> Tarif bayar sesuai pemakaian untuk Exa Search, Contents, Answer, Monitors, dan Agent API

***

Exa menggunakan sistem bayar sesuai pemakaian. Tidak ada langganan dan tidak ada minimum pembelanjaan: Anda mengisi credits lalu ditagih per permintaan, sesuai tarif di bawah ini.

<Check>
  **Mulai gratis.** Akun baru mendapatkan credits gratis senilai $20 (sekitar 2.800 searches) dan Free Tier menambahkan $10 credits setiap bulan. Dapatkan API key dan mulai membangun.

  **Ingin menaikkan skala?** Untuk volume tinggi, custom indexes, rate limits yang lebih tinggi, SLA, atau Zero Data Retention, [hubungi kami](https://exa.ai/contact/sales) untuk membahas [paket Enterprise](#enterprise) dengan diskon volume.
</Check>

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru langsung mendapatkan credits gratis.
</Card>

<div id="products">
  ## Produk
</div>

<Columns cols={3}>
  <Card title="Search" icon="search" href="/id/docs/search/quickstart">
    **$7** / 1rb permintaan

    Search real-time dengan page contents yang hemat token.
  </Card>

  <Card title="Deep Search" icon="microscope" href="/id/docs/search/deep-search">
    **$12–15** / 1rb permintaan

    Riset multi-langkah dengan structured output dan citations.
  </Card>

  <Card title="Contents" icon="file-text" href="/id/docs/contents/quickstart">
    **$1** / 1rb halaman

    Teks halaman lengkap, highlights, dan summaries untuk URL yang sudah diketahui.
  </Card>

  <Card title="Answer" icon="message-circle" href="/id/docs/reference/answer">
    **$5** / 1rb permintaan

    Jawaban LLM atas sebuah pertanyaan, lengkap dengan citations.
  </Card>

  <Card title="Monitors" icon="bell" href="/id/docs/monitors/quickstart">
    **$15** / 1rb permintaan

    Searches terjadwal yang memunculkan peristiwa baru di web.
  </Card>

  <Card title="Agent" icon="bot" href="/id/docs/agent/quickstart">
    **$0,012–$1,00** / run dengan effort tetap, atau berbasis usage

    Riset mendalam asinkron, list building, dan enrichment.
  </Card>
</Columns>

<div id="search-contents-answer-and-monitors">
  ## Search, Contents, Answer, dan Monitors
</div>

Setiap endpoint memiliki harga dasar per permintaan yang sudah mencakup hingga 10 hasil. Hasil tambahan dan ringkasan halaman yang dihasilkan Exa ditagih terpisah.

| Endpoint    | Harga dasar<br />(hingga 10 hasil) | Setiap hasil di atas 10 | Ringkasan halaman AI |
| ----------- | ---------------------------------- | ----------------------- | -------------------- |
| `/search`   | $7 / 1rb permintaan                | $1 / 1rb hasil          | $1 / 1rb halaman     |
| `/answer`   | $5 / 1rb permintaan                | —                       | —                    |
| `/monitors` | $15 / 1rb permintaan               | $1 / 1rb hasil          | $1 / 1rb halaman     |
| `/contents` | $1 / 1rb halaman, per tipe konten  | —                       | $1 / 1rb halaman     |

<div id="agent">
  ## Agent
</div>

Tetapkan `effort` tetap pada [Agent](/id/docs/agent/quickstart) untuk mendapatkan harga per permintaan yang dapat diprediksi. `auto` adalah mode terukur (metered) bawaan; `max` versi beta juga terukur dan menggunakan tarif penggunaan yang sama:

| Effort    | Harga               |
| --------- | ------------------- |
| `minimal` | $0,012 / permintaan |
| `low`     | $0,025 / permintaan |
| `medium`  | $0,10 / permintaan  |
| `high`    | $0,50 / permintaan  |
| `xhigh`   | $1,00 / permintaan  |

Run terukur ditagih sesuai penggunaan aktual, hingga batas maksimum per run. Batas bawaan `auto` adalah $5; batas bawaan `max` versi beta adalah $20:

| Komponen penggunaan        | Harga                 |
| -------------------------- | --------------------- |
| Agent Compute Unit         | $0,10 / ACU           |
| Panggilan tool search      | $0,005 / search       |
| Contact enrichment email   | $0,02 / email         |
| Contact enrichment telepon | $0,07 / nomor telepon |

<div id="connect-providers">
  ### Connect providers
</div>

Runs yang menggunakan sumber data [Exa Connect](/id/docs/agent/connect/overview)
juga akan menagihkan setiap provider call — misalnya
[Fiber.ai](/id/docs/agent/connect/fiber#pricing) sebesar $0,02 per credit dan
[Baselayer](/id/docs/agent/connect/baselayer#pricing) sebesar $0,15–$4,00 per
order, tergantung operasinya. Lihat
[harga Connect](/id/docs/agent/connect/overview#pricing) untuk seluruh
rates provider.

<div id="deep-search">
  ## Deep Search
</div>

Atur dengan `type` pada [`/search`](/id/docs/search/deep-search). Hasil tambahan dan Ringkasan halaman AI dikenakan biaya yang sama dengan search standar.

| Tipe             | Harga dasar<br />(hingga 10 hasil) | Latensi     | Paling cocok untuk                               |
| ---------------- | ---------------------------------- | ----------- | ------------------------------------------------ |
| `deep-lite`      | $12 / 1rb permintaan               | ~4 detik    | Synthesis ringan                                 |
| `deep`           | $12 / 1rb permintaan               | 4–15 detik  | Penalaran multi-langkah dengan structured output |
| `deep-reasoning` | $15 / 1rb permintaan               | 12–40 detik | Tugas riset yang lebih berat                     |

<div id="enterprise">
  ## Enterprise
</div>

Untuk volume tinggi, dataset khusus, dan persyaratan keamanan yang lebih ketat.

<Columns cols={3}>
  <Card title="Pencarian yang andal" icon="gauge">
    Hingga 1.000 hasil per search, permintaan di atas 25 hasil, rate limit (QPS) khusus, moderasi yang disesuaikan, dan custom indexes.
  </Card>

  <Card title="Dukungan Enterprise" icon="headphones">
    SLA dan MSA, onboarding dan dukungan 1:1, serta [Zero Data Retention](/id/docs/admin/security/zero-data-retention).
  </Card>

  <Card title="Harga khusus" icon="tag">
    Diskon volume dan billing melalui faktur pascabayar.
  </Card>
</Columns>

<Card title="Hubungi kami" icon="mail" horizontal href="https://exa.ai/contact/sales">
  Dapatkan penawaran untuk volume dan ketentuan Enterprise
</Card>

<div id="cost-glossary">
  ## Glosarium biaya
</div>

<AccordionGroup>
  <Accordion title="Request">
    Satu panggilan API ke sebuah endpoint. Harga dinyatakan per 1.000 request, jadi tarif $7 / 1k berarti $0,007 per panggilan.
  </Accordion>

  <Accordion title="Result">
    Satu hasil search yang dikembalikan dalam sebuah respons. Harga dasar mencakup 10 hasil pertama dalam satu request; setiap hasil di atas 10 menambah $1 / 1k hasil. Jadi, meminta `numResults: 20` dikenakan harga dasar ditambah 10 hasil tambahan.
  </Accordion>

  <Accordion title="Halaman dan tipe konten">
    Halaman adalah satu URL yang kontennya dikembalikan oleh Exa. Tipe konten adalah satu bentuk tampilan dari halaman tersebut: `text`, `highlights`, atau `summary`. `/contents` menagih setiap tipe konten secara terpisah, sehingga satu halaman dengan `text` dan `highlights` dihitung sebagai dua.
  </Accordion>

  <Accordion title="Ringkasan halaman AI">
    Ringkasan halaman yang dihasilkan Exa melalui panggilan LLM tambahan di sisi kami. Ditagih $1 / 1k halaman pada endpoint mana pun yang mengembalikannya.
  </Accordion>

  <Accordion title="Agent Compute Unit (ACU)">
    Unit komputasi model yang dikonsumsi sebuah Agent run, dilaporkan sebagai `usage.agentComputeUnits`. Run yang lebih panjang, `input.data` yang lebih besar, dan langkah penalaran yang lebih banyak mengonsumsi lebih banyak ACU.
  </Accordion>

  <Accordion title="Effort">
    Parameter Agent yang menyeimbangkan biaya dan latensi dengan tingkat ketuntasan. `auto` ditagih berdasarkan konsumsi (ACU ditambah panggilan tool) hingga batas bawaan $5; `max` (beta) memakai tarif penggunaan yang sama hingga batas bawaan $20. Effort tetap ditagih dengan harga flat per request. Lihat [Mode effort Agent](/id/docs/agent/quickstart#effort).
  </Accordion>

  <Accordion title="Contact enrichment">
    Pencarian Agent yang mengembalikan alamat email atau nomor telepon seseorang atau perusahaan. Ditagih per kontak yang ditemukan, di luar biaya lain dari run tersebut.
  </Accordion>

  <Accordion title="Credits">
    Saldo dolar prabayar pada akun Anda. Penggunaan mengurangi credits sesuai tarif di atas.
  </Accordion>
</AccordionGroup>

<Card title="Billing" icon="credit-card" horizontal href="/id/docs/admin/billing">
  Tambahkan credits, atur isi ulang otomatis, dan temukan faktur Anda
</Card>