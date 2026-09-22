> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="faqs">
  # FAQ
</div>

> Jawaban atas pertanyaan umum seputar produk Exa, indeks search, kebaruan, grounding, keamanan, dan harga.

<AccordionGroup>
  <Accordion title="Apa itu Exa?">
    Exa menyediakan infrastruktur web search dan Research untuk aplikasi AI. Exa memadukan indeks pencarian independen dengan extraction konten serta API agentic research, sehingga aplikasi dapat menemukan sources, mengambil contents-nya, dan menghasilkan output yang grounded.
  </Accordion>

  <Accordion title="Produk Exa mana yang sebaiknya saya gunakan?">
    * Gunakan [Search API](/id/docs/search/quickstart) untuk menemukan hasil web berperingkat dan, jika perlu, mengembalikan kutipan, teks penuh, atau summaries.
    * Gunakan [Contents API](/id/docs/contents/quickstart) jika Anda sudah memiliki URL dan membutuhkan contents hasil extraction-nya.
    * Gunakan [Agent API](/id/docs/agent/quickstart) untuk Research asinkron multi-langkah, list building, dan enrichment terstruktur.
    * Gunakan [Monitors](/id/docs/monitors/quickstart) untuk menjalankan searches berulang dan menerima hasil yang baru ditemukan.
  </Accordion>

  <Accordion title="Apa itu Exa Connect?">
    [Exa Connect](/id/docs/agent/connect/overview) memberi Exa Agent akses ke data provider premium sekaligus web search dalam satu run yang sama. Tambahkan providers melalui `dataSources`, lalu Exa Agent akan menentukan kapan harus melakukan query ke tiap source sebelum menggabungkan data partner dan Research web menjadi satu output terstruktur yang grounded.

    Untuk providers swalayan, Exa menangani autentikasi provider dan billing penggunaan, sehingga Anda tidak perlu membangun integrasi terpisah atau membuat akun provider tersendiri.
  </Accordion>

  <Accordion title="Apa yang membedakan Exa Search?">
    Exa Search dirancang untuk retrieval secara programatik, bukan penjelajahan yang digerakkan iklan. Exa Search dapat mencari berdasarkan makna, menerima query berbahasa alami, dan mengembalikan page contents dalam permintaan yang sama. Search mode-nya mencakup mulai dari retrieval dengan latency rendah hingga Research multi-langkah dengan structured output.

    Lihat [Search quickstart](/id/docs/search/quickstart) untuk search types dan format response yang tersedia.
  </Accordion>

  <Accordion title="Seberapa besar indeks Exa?">
    Per Agustus 2026, indeks Exa melacak 1,4 triliun URL dan menyajikan 100 miliar halaman dari seluruh public web. Indeks ini terus berubah seiring halaman ditemukan, disegarkan, atau dihapus.
  </Accordion>

  <Accordion title="Seberapa baru hasil dari Exa?">
    Exa menemukan dan menyegarkan halaman secara terus-menerus, dengan waktu yang bervariasi tergantung source dan seberapa sering sebuah halaman berubah. Jika Anda membutuhkan konten yang lebih baru daripada salinan terindeks, gunakan opsi [`maxAgeHours`](/id/docs/contents/quickstart#content-freshness) pada Contents API untuk mengatur usia cache dan retrieval langsung.
  </Accordion>

  <Accordion title="Apakah Exa mengoperasikan crawler?">
    Ya. Exa mengoperasikan `ExaSearchBot` untuk menemukan dan menyegarkan halaman di public web guna keperluan search dan retrieval. Crawler ini mematuhi Robots Exclusion Protocol, membatasi request rate per situs, dan tidak berupaya melewati login, paywall, atau CAPTCHA.

    `robots.txt` mengendalikan proses crawling. Untuk menghapus halaman yang sudah terindeks, gunakan meta tag robots `noindex` atau header response `X-Robots-Tag: noindex`; Exa akan menghapus halaman tersebut setelah pengambilan ulang berikutnya. Lihat [Exa Search Crawler](https://crawler.exa.ai/) untuk informasi user agent, instruksi verifikasi kriptografis, dan kontrol crawler.
  </Accordion>

  <Accordion title="Bagaimana Exa membantu melakukan grounding pada response LLM?">
    Exa mengembalikan source URL beserta konten web yang digunakan untuk retrieval, sehingga aplikasi dapat menghasilkan jawaban dengan sitasi dan memeriksa evidence pendukungnya. Kualitas search dan grounding source dapat mengurangi klaim yang tidak didukung, tetapi aplikasi beserta model bahasanya tetap bertanggung jawab atas cara informasi hasil retrieval ditafsirkan dan disajikan.
  </Accordion>

  <Accordion title="Bisakah saya membatasi sources yang dicari Exa?">
    Ya. Gunakan `includeDomains` untuk membatasi Search pada domain tertentu atau `excludeDomains` untuk menyingkirkan sources yang tidak diinginkan. Exa juga menyediakan kategori data untuk retrieval spesifik per source seperti perusahaan, orang, berita, dan kode. Lihat [Search best practices](/id/docs/search/best-practices) dan [Data](/id/docs/search/data/overview).
  </Accordion>

  <Accordion title="Opsi keamanan dan retensi data apa saja yang tersedia?">
    Exa menawarkan kontrol keamanan dan kepatuhan untuk kasus penggunaan production dan enterprise, termasuk [Zero Data Retention](/id/docs/admin/security/zero-data-retention) dan [HIPAA compliance](/id/docs/admin/security/hipaa) bagi pelanggan Enterprise yang memenuhi syarat. Lihat [Security &amp; Compliance](/id/docs/admin/security/overview) untuk detailnya.
  </Accordion>

  <Accordion title="Bagaimana cara kerja harga Exa?">
    Penggunaan API ditagihkan dari credits akun sesuai endpoint dan opsi yang digunakan. Akun baru mendapatkan credits gratis, dan penggunaan berbayar bersifat bayar sesuai pemakaian kecuali organisasi Anda memiliki kontrak enterprise. Lihat [Harga](/id/docs/admin/pricing) dan [Billing](/id/docs/admin/billing).
  </Accordion>
</AccordionGroup>