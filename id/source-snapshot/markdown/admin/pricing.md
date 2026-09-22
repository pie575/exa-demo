> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="pricing">
  # Harga
</div>

> Tarif pay-as-you-go untuk Exa Search, Contents, Answer, Monitors, dan Agent API

***

Exa menggunakan sistem pay-as-you-go. Tidak ada langganan dan tidak ada minimum pengeluaran: Anda mengisi credits dan dikenakan biaya per permintaan, sesuai tarif di bawah ini.

<Check>
  **Mulai gratis.** Akun baru mendapatkan credits gratis senilai $20 (sekitar 2.800 searches) dan Free Tier menambahkan $10 credits setiap bulan. Dapatkan API key dan mulai membangun.

  **Ingin meningkatkan skala?** Untuk volume tinggi, custom indexes, rate limits yang lebih tinggi, SLA, atau Zero Data Retention, [hubungi kami](https://exa.ai/contact/sales) untuk membahas [Enterprise plan](#enterprise) dengan diskon volume.
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

    Research multi-langkah dengan structured outputs dan sitasi.
  </Card>

  <Card title="Contents" icon="file-text" href="/id/docs/contents/quickstart">
    **$1** / 1rb halaman

    Teks halaman lengkap, kutipan, dan ringkasan untuk URL yang sudah diketahui.
  </Card>

  <Card title="Answer" icon="message-circle" href="/id/docs/reference/answer">
    **$5** / 1rb permintaan

    Jawaban LLM atas sebuah pertanyaan, lengkap dengan sitasi.
  </Card>

  <Card title="Monitors" icon="bell" href="/id/docs/monitors/quickstart">
    **$15** / 1rb permintaan

    Search terjadwal yang menampilkan peristiwa baru di web.
  </Card>

  <Card title="Agent" icon="bot" href="/id/docs/agent/quickstart">
    **$0,012–$1,00** / run dengan effort tetap, atau berbasis penggunaan

    Deep research asinkron, list building, dan enrichment.
  </Card>
</Columns>

<div id="search-contents-answer-and-monitors">
  ## Search, Contents, Answer, dan Monitors
</div>

Setiap endpoint memiliki harga dasar per permintaan yang sudah mencakup hingga 10 hasil. Hasil tambahan dan Ringkasan halaman AI yang dihasilkan Exa ditagih terpisah.

| Endpoint    | Harga dasar<br />(hingga 10 hasil) | Setiap hasil di atas 10 | Ringkasan halaman AI |
| ----------- | ---------------------------------- | ----------------------- | -------------------- |
| `/search`   | $7 / 1k permintaan                 | $1 / 1k hasil           | $1 / 1k halaman      |
| `/answer`   | $5 / 1k permintaan                 | —                       | —                    |
| `/monitors` | $15 / 1k permintaan                | $1 / 1k hasil           | $1 / 1k halaman      |
| `/contents` | $1 / 1k halaman, per tipe konten   | —                       | $1 / 1k halaman      |

<div id="agent">
  ## Agent
</div>

Tetapkan nilai `effort` tetap pada [Agent](/id/docs/agent/quickstart) agar harga per permintaan dapat diprediksi. `auto` adalah mode terukur default; `max` (beta) juga terukur dan menggunakan tarif penggunaan yang sama:

| Effort    | Harga               |
| --------- | ------------------- |
| `minimal` | $0,012 / permintaan |
| `low`     | $0,025 / permintaan |
| `medium`  | $0,10 / permintaan  |
| `high`    | $0,50 / permintaan  |
| `xhigh`   | $1,00 / permintaan  |

Run terukur ditagih sesuai penggunaan aktual hingga batas maksimum per run. Batas default `auto` adalah $5; batas default `max` (beta) adalah $20:

| Komponen penggunaan        | Harga                 |
| -------------------------- | --------------------- |
| Agent Compute Unit         | $0,10 / ACU           |
| Tool call search           | $0,005 / search       |
| Contact enrichment email   | $0,02 / email         |
| Contact enrichment telepon | $0,07 / nomor telepon |

<div id="connect-providers">
  ### Connect providers
</div>

Runs yang menggunakan sumber data [Exa Connect](/id/docs/agent/connect/overview)
juga dikenakan biaya untuk setiap panggilan provider — misalnya
[Fiber.ai](/id/docs/agent/connect/fiber#pricing) sebesar $0,02 per credit dan
[Baselayer](/id/docs/agent/connect/baselayer#pricing) sebesar $0,15–$4,00 per
order tergantung operasinya. Lihat
[Harga Connect](/id/docs/agent/connect/overview#pricing) untuk semua
tarif provider.

<div id="deep-search">
  ## Deep Search
</div>

Atur dengan `type` pada [`/search`](/id/docs/search/deep-search). Hasil tambahan dan Ringkasan halaman AI dikenakan biaya yang sama dengan standard Search.

| Type             | Harga dasar<br />(hingga 10 hasil) | Latency     | Cocok untuk                                       |
| ---------------- | ---------------------------------- | ----------- | ------------------------------------------------- |
| `deep-lite`      | $12 / 1k permintaan                | ~4 detik    | Synthesis ringan                                  |
| `deep`           | $12 / 1k permintaan                | 4–15 detik  | Penalaran multi-langkah dengan structured outputs |
| `deep-reasoning` | $15 / 1k permintaan                | 12–40 detik | Tugas Research yang lebih berat                   |

<div id="enterprise">
  ## Enterprise
</div>

Untuk volume tinggi, dataset kustom, dan kebutuhan keamanan yang lebih ketat.

<Columns cols={3}>
  <Card title="Pencarian yang andal" icon="gauge">
    Hingga 1.000 hasil per search, permintaan di atas 25 hasil, rate limit kustom (QPS), moderasi yang disesuaikan, dan custom indexes.
  </Card>

  <Card title="Dukungan enterprise" icon="headphones">
    SLA dan MSA, onboarding dan dukungan 1:1, serta [Zero Data Retention](/id/docs/admin/security/zero-data-retention).
  </Card>

  <Card title="Harga kustom" icon="tag">
    Diskon volume dan billing faktur pascabayar.
  </Card>
</Columns>

<Card title="Hubungi kami" icon="mail" horizontal href="https://exa.ai/contact/sales">
  Dapatkan kuotasi harga untuk volume dan ketentuan enterprise
</Card>

<div id="cost-glossary">
  ## Glosarium biaya
</div>

<AccordionGroup>
  <Accordion title="Permintaan">
    Satu panggilan API ke sebuah endpoint. Harga dinyatakan per 1.000 permintaan, jadi tarif $7 / 1k berarti $0,007 per panggilan.
  </Accordion>

  <Accordion title="Hasil">
    Satu hasil pencarian yang dikembalikan dalam sebuah response. Harga dasar mencakup 10 hasil pertama dalam satu permintaan; setiap hasil di atas 10 menambah $1 / 1k hasil. Jadi, meminta `numResults: 20` dikenakan harga dasar ditambah 10 hasil tambahan.
  </Accordion>

  <Accordion title="Halaman dan tipe konten">
    Halaman adalah satu URL yang kontennya dikembalikan oleh Exa. Tipe konten adalah satu bentuk tampilan dari halaman tersebut: `text`, `highlights`, atau `summary`. `/contents` menagih setiap tipe konten secara terpisah, jadi satu halaman dengan `text` dan `highlights` dihitung sebagai dua.
  </Accordion>

  <Accordion title="Ringkasan halaman AI">
    Ringkasan halaman yang dihasilkan Exa melalui panggilan LLM tambahan di sisi kami. Ditagih $1 / 1k halaman pada endpoint mana pun yang mengembalikannya.
  </Accordion>

  <Accordion title="Agent Compute Unit (ACU)">
    Unit komputasi model yang dikonsumsi satu Agent run, dilaporkan sebagai `usage.agentComputeUnits`. Run yang lebih panjang, `input.data` yang lebih besar, dan langkah penalaran yang lebih banyak akan mengonsumsi lebih banyak ACU.
  </Accordion>

  <Accordion title="Effort">
    Parameter Agent yang menyeimbangkan biaya dan latency dengan tingkat ketuntasan. `auto` ditagih berdasarkan konsumsi (ACU ditambah tool call) hingga batas default $5; `max` (beta) memakai tarif penggunaan yang sama hingga batas default $20. Effort tetap ditagih dengan harga flat per permintaan. Lihat [mode effort Agent](/id/docs/agent/quickstart#effort).
  </Accordion>

  <Accordion title="Contact enrichment">
    Pencarian Agent yang mengembalikan alamat email atau nomor telepon untuk seseorang atau perusahaan. Ditagih per kontak yang ditemukan, di luar biaya lain dari run tersebut.
  </Accordion>

  <Accordion title="Credits">
    Saldo dolar prabayar pada akun Anda. Penggunaan memotong credits sesuai tarif di atas.
  </Accordion>
</AccordionGroup>

<Card title="Billing" icon="credit-card" horizontal href="/id/docs/admin/billing">
  Tambah credits, atur isi ulang otomatis, dan temukan faktur Anda
</Card>