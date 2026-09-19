> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="faqs">
  # FAQ
</div>

> Jawaban atas pertanyaan umum seputar produk Exa, indeks search, freshness, grounding, keamanan, dan harga.

<AccordionGroup>
  <Accordion title="Apa itu Exa?">
    Exa menyediakan infrastruktur web search dan riset untuk aplikasi AI. Exa memadukan indeks pencarian independen dengan extraction konten dan API agentic research, sehingga aplikasi dapat menemukan sumber, mengambil contents-nya, dan menghasilkan output yang grounded.
  </Accordion>

  <Accordion title="Produk Exa mana yang sebaiknya saya gunakan?">
    * Gunakan [Search API](/id/docs/search/quickstart) untuk menemukan hasil web yang sudah diperingkat dan, jika perlu, mengembalikan highlights, teks lengkap, atau summaries.
    * Gunakan [Contents API](/id/docs/contents/quickstart) jika Anda sudah memiliki URL dan membutuhkan contents hasil extraction-nya.
    * Gunakan [Agent API](/id/docs/agent/quickstart) untuk riset asinkron multi-langkah, list building, dan enrichment terstruktur.
    * Gunakan [Monitors](/id/docs/monitors/quickstart) untuk menjalankan searches berulang dan menerima hasil yang baru ditemukan.
  </Accordion>

  <Accordion title="Apa itu Exa Connect?">
    [Exa Connect](/id/docs/agent/connect/overview) memberi Exa Agent akses ke data provider premium sekaligus web search dalam satu run yang sama. Tambahkan provider melalui `dataSources`, lalu Exa Agent akan menentukan kapan harus melakukan query ke setiap sumber sebelum menggabungkan data partner dan riset web menjadi satu structured output yang grounded.

    Untuk provider swalayan, Exa yang menangani autentikasi provider dan billing usage, sehingga Anda tidak perlu membangun integrasi terpisah atau membuat akun provider tersendiri.
  </Accordion>

  <Accordion title="Apa yang membedakan Exa Search?">
    Exa Search dibangun untuk retrieval secara programatik, bukan untuk penjelajahan berbasis iklan. Exa Search dapat mencari berdasarkan makna, menerima query berbahasa alami, dan mengembalikan page contents dalam permintaan yang sama. Search mode-nya beragam, mulai dari retrieval berlatensi rendah hingga riset multi-langkah dengan structured output.

    Lihat [Quickstart Search](/id/docs/search/quickstart) untuk search types dan format respons yang tersedia.
  </Accordion>

  <Accordion title="Seberapa besar indeks Exa?">
    Per Agustus 2026, indeks Exa melacak 1,4 triliun URL dan melayani 100 miliar halaman dari seluruh web publik. Indeks ini terus berubah seiring halaman ditemukan, disegarkan, atau dihapus.
  </Accordion>

  <Accordion title="Seberapa baru hasil dari Exa?">
    Exa menemukan dan menyegarkan halaman secara berkelanjutan, dengan waktu yang bervariasi tergantung sumber dan seberapa sering sebuah halaman berubah. Jika Anda membutuhkan konten yang lebih baru daripada salinan yang terindeks, gunakan opsi [`maxAgeHours`](/id/docs/contents/quickstart#content-freshness) pada Contents API untuk mengatur usia cache dan retrieval langsung.
  </Accordion>

  <Accordion title="Apakah Exa mengoperasikan crawler?">
    Ya. Exa mengoperasikan `ExaSearchBot` untuk menemukan dan menyegarkan halaman di web publik untuk keperluan search dan retrieval. Crawler ini mematuhi Robots Exclusion Protocol, membatasi request rate per situs, dan tidak berupaya melewati login, paywall, atau CAPTCHA.

    `robots.txt` mengendalikan proses crawling. Untuk menghapus halaman yang sudah terindeks, gunakan meta tag robots `noindex` atau header respons `X-Robots-Tag: noindex`; Exa akan menghapus halaman tersebut setelah pengambilan ulang berikutnya. Lihat [Exa Search Crawler](https://crawler.exa.ai/) untuk informasi user agent, instruksi verification kriptografis, dan kendali crawler.
  </Accordion>

  <Accordion title="Bagaimana Exa membantu membuat respons LLM menjadi grounded?">
    Exa mengembalikan source URL dan konten web yang digunakan untuk retrieval, sehingga aplikasi dapat menghasilkan jawaban dengan citations dan memeriksa evidence pendukungnya. Kualitas search dan grounding sumber dapat mengurangi klaim yang tidak didukung, tetapi aplikasi dan model bahasanya tetap bertanggung jawab atas cara informasi yang diambil ditafsirkan dan disajikan.
  </Accordion>

  <Accordion title="Bisakah saya membatasi sumber yang dicari Exa?">
    Ya. Gunakan `includeDomains` untuk membatasi Search pada domain tertentu atau `excludeDomains` untuk menyingkirkan sumber yang tidak diinginkan. Exa juga menyediakan kategori data untuk retrieval spesifik per sumber seperti perusahaan, orang, berita, dan kode. Lihat [Praktik terbaik Search](/id/docs/search/best-practices) dan [Data](/id/docs/search/data/overview).
  </Accordion>

  <Accordion title="Opsi keamanan dan retensi data apa saja yang tersedia?">
    Exa menyediakan kendali keamanan dan kepatuhan untuk kasus penggunaan produksi dan Enterprise, termasuk [Zero Data Retention](/id/docs/admin/security/zero-data-retention) dan [kepatuhan HIPAA](/id/docs/admin/security/hipaa) bagi pelanggan Enterprise yang memenuhi syarat. Lihat [Keamanan &amp; Kepatuhan](/id/docs/admin/security/overview) untuk detailnya.
  </Accordion>

  <Accordion title="Bagaimana cara kerja harga Exa?">
    Usage API ditagihkan dari credits akun sesuai endpoint dan opsi yang digunakan. Akun baru mendapat credits gratis, dan usage berbayar bersifat bayar-sesuai-pemakaian kecuali Organization Anda memiliki kontrak enterprise. Lihat [Harga](/id/docs/admin/pricing) dan [Billing](/id/docs/admin/billing).
  </Accordion>
</AccordionGroup>