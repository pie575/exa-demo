> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="changelog">
  # Changelog
</div>

> Pembaruan produk dan pengumuman dari Exa.

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  <div id="dynamic-highlights-research-preview">
    ## Dynamic Highlights (pratinjau riset)
  </div>

  Dynamic Highlights memilih excerpt dari keseluruhan kumpulan hasil, alih-alih memperlakukan setiap halaman secara terpisah. Fitur ini mengalokasikan porsi anggaran konteks bersama yang lebih besar untuk sumber yang berguna, dan porsi lebih kecil untuk sumber yang hanya mengulang informasi yang sudah dikembalikan.

  * **RAG satu giliran**: efisiensi token sekitar 49% lebih baik dan kualitas hilir 2,4% lebih tinggi dengan Exa Auto pada evaluasi coding maupun QA umum.
  * **Agent**: sekitar 30% lebih sedikit token di sepanjang trajektori agent dan kualitas 1% lebih tinggi pada BrowseComp, WideSearch, serta evaluasi internal untuk perusahaan dan orang.

  Permintaan yang menyetel `dynamic: true` memerlukan header `Exa-Beta: dynamic-highlights-2026-08-28`.

  [Baca panduan Dynamic Highlights →](/id/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  <div id="publication-research">
    ## Riset publikasi
  </div>

  Kami memperluas dan meningkatkan riset atas publikasi akademik secara signifikan.

  * **350 juta publikasi**: lakukan search pada indeks berisi 350 juta publikasi.
  * **Hasil organisasi dan orang yang lebih kaya**: search kini mengembalikan organisasi sekaligus orang-orang yang berafiliasi dengannya, masing-masing sebagai profil terperinci dan diperkaya yang mencakup publikasi, kolaborator utama, bidang riset, dan pendanaan.
  * **Search agentik untuk orang dan organisasi**: agent kini dapat melakukan search atas orang dan organisasi.
  * **Benchmark retrieval publik**: kami merilis benchmark publik untuk retrieval publikasi.
  * **Kategori search `publication` baru**: cari hasil ilmiah dengan `category: "publication"`, yang menggantikan kategori `research paper`.
  * **Kategori usang**: kategori search `pdf`, `github`, dan `tweet` sedang dihentikan.
  * **`startCrawlDate` / `endCrawlDate`**: parameter usang ini kini diabaikan untuk semua team, meskipun tetap diterima demi kompatibilitas.

  Akses melalui API dengan [kategori search](/id/docs/search/quickstart) `publication`, atau [coba di dashboard →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  <div id="exa-agent-and-exa-connect-in-mcp">
    ## Exa Agent dan Exa Connect di MCP
  </div>

  Exa Agent kini tersedia di dalam Exa MCP. Gunakan dari Claude, Cursor, atau klien MCP lainnya ketika tugas membutuhkan lebih dari sekadar satu panggilan search.

  Aktifkan tool Agent dengan `https://mcp.exa.ai/mcp?tools=agent_run`, lalu panggil `agent_run` untuk menjalankan agent hingga selesai dan mengembalikan output-nya.

  Sumber data Exa Connect tersedia melalui alur Agent, sehingga Anda dapat meng-attach data partners premium ketika sebuah run membutuhkan lebih dari sekadar web search.

  [Baca panduan Exa MCP →](/id/docs/get-started/exa-mcp) · [Baca panduan Exa Agent →](/id/docs/agent/quickstart) · [Tweet pengumuman →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  <div id="introducing-exa-connect">
    ## Memperkenalkan Exa Connect
  </div>

  Exa Connect memberi Exa Agent akses langsung ke data publik dan privat di seluruh dunia. Saat diluncurkan, Exa Connect hadir bersama Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko, dan Additional Partners. Anda meng-attach semuanya melalui `dataSources` pada `POST /agent/runs`.

  [Baca panduan Exa Connect →](/id/docs/agent/connect/overview) · [Tweet pengumuman →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  <div id="introducing-exa-agent">
    ## Memperkenalkan Exa Agent
  </div>

  Kami merilis kelas baru agent riset web terdepan yang dapat diakses melalui API.

  Exa Agent API mendukung parameter seperti query bahasa alami, mode `effort`, `outputSchema` untuk structured output, dan `input.data` untuk membangun di atas dataset yang sudah ada.

  [Baca panduan Exa Agent API →](/id/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "Pemberitahuan Penghentian API" }}>
  <div id="api-deprecation-notice">
    ## Pemberitahuan Penghentian API
  </div>

  Kami menghentikan beberapa item lama dari Exa API:

  * **endpoint `/research`**: digantikan oleh `/search` dengan `type: "deep-reasoning"`.
  * **`resolvedSearchType` dan `highlightScores` (field respons)**: mengembalikan `null` mulai 15 April, dihapus 1 Mei.
  * **`startCrawlDate` / `endCrawlDate` (parameter permintaan yang sudah usang)**: diabaikan tanpa peringatan mulai 15 April.

  [Migrasikan ke Deep search →](/id/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Memperkenalkan Exa Monitors" }}>
  <div id="introducing-exa-monitors">
    ## Memperkenalkan Exa Monitors
  </div>

  Monitor menjalankan pencarian Exa sesuai jadwal dan mengirimkan hasilnya ke webhook Anda, dengan deduplikasi terhadap run sebelumnya sehingga Anda hanya menerima konten baru.

  * **Pantau topik dari waktu ke waktu**: berita kompetitor, putaran pendanaan, perubahan regulasi, paper riset.
  * **Hasil terstruktur**: mengembalikan teks biasa atau JSON bertipe melalui `outputSchema`.
  * **Penjadwalan fleksibel**: jalankan pada interval tertentu (minimum 1 jam) atau picu secara manual.

  [Baca panduan Monitors API →](/id/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Perombakan Exa Deep" }}>
  <div id="exa-deep-revamp">
    ## Perombakan Exa Deep
  </div>

  Exa Deep kini lebih cepat, lebih murah, dan mendukung structured output dengan grounding tingkat field.

  * **Tipe `deep-reasoning` baru** untuk tugas dengan effort lebih tinggi (12-50 detik); `deep` berjalan dalam 4-12 detik.
  * **Harga 20% lebih rendah** untuk deep search reguler.
  * **Structured output** melalui `outputSchema`, dengan `output.content` dan `output.grounding` (citations tingkat field dan tingkat keyakinan) dalam respons.

  Lihat [Pembaruan Harga Exa](#exa-pricing-update) di bawah untuk harga selengkapnya.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Pembaruan Harga Exa" }}>
  <div id="exa-pricing-update">
    ## Pembaruan Harga Exa
  </div>

  Kami menyederhanakan dan menurunkan harga. Contents untuk 10 hasil pencarian pertama kini disertakan gratis, dan harga baru berlaku otomatis tanpa perlu tindakan apa pun.

  * **Search dengan contents**: $7 per 1rb permintaan (10 hasil, teks + highlights disertakan); $1 per 1rb hasil tambahan.
  * **Summaries**: $1 per 1rb, baik pada search maupun contents.
  * **Exa Deep**: $12 per 1rb permintaan; **Deep (Reasoning)** $15 per 1rb.
  * **Endpoint contents**: $1 per 1rb halaman per tipe konten.

  [Lihat harga saat ini →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Memperkenalkan Exa Instant Search" }}>
  <div id="introducing-exa-instant-search">
    ## Memperkenalkan Exa Instant Search
  </div>

  Exa Instant adalah search type tercepat kami, memadukan kualitas neural search yang lebih baik dengan latensi di bawah 150 md. Aktifkan dengan `type="instant"`.

  * **Dirancang untuk real-time**: aplikasi chat, AI suara, coding agent, pelengkapan otomatis, dan saran langsung.
  * **Kualitas terdepan** dengan latensi terendah yang kami tawarkan.

  [Baca panduan Search API →](/id/docs/search/quickstart) · [Coba di dashboard →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Pembaruan highlights, content freshness, dan MCP" }}>
  <div id="highlights-content-freshness-and-mcp-updates">
    ## Pembaruan highlights, content freshness, dan MCP
  </div>

  Tiga peningkatan pada extraction dan akses konten:

  * **`maxCharacters` untuk highlights**: kini menjadi cara yang disarankan untuk mengatur panjang highlight. `numSentences` dan `highlightsPerUrl` sudah usang.
  * **`maxAgeHours` untuk content freshness**: kontrol berbasis usia yang menggantikan boolean `livecrawl` (`0` selalu meng-crawl, `-1` hanya cache, `24` meng-crawl jika lebih lama dari 24 jam).
  * **Tier gratis Exa MCP**: coba tanpa autentikasi pada 3 QPS dan 150 panggilan/hari; tambahkan API key untuk akses penuh.

  [Dokumentasi content freshness →](/id/docs/contents/quickstart#content-freshness) · [Exa MCP →](/id/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Memperkenalkan Exa Company Search" }}>
  <div id="introducing-exa-company-search">
    ## Memperkenalkan Exa Company Search
  </div>

  Pencarian perusahaan kini menggunakan model retrieval hasil fine-tuning dan pipeline pencocokan entitas. Gunakan `type="auto"`, `category="company"`.

  * **Akurat di berbagai atribut**: industri, geografi, tahap pendanaan, dan jumlah karyawan.
  * **Data entitas terstruktur**: hasil mengembalikan informasi perusahaan bertipe (tenaga kerja, kantor pusat, keuangan, trafik web).
  * **Kasus penggunaan**: prospecting penjualan, riset pasar, dan workflow rantai pasok.

  [Baca dokumentasi Companies &amp; People Search →](/id/docs/search/data/companies-people) · [Baca blog benchmark →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Memperkenalkan Exa People Search" }}>
  <div id="introducing-exa-people-search">
    ## Memperkenalkan Exa People Search
  </div>

  Pencarian orang kini menjangkau lebih dari 1 miliar profil publik melalui sistem retrieval hibrida. Kategori `linkedin` digantikan oleh kategori baru `people`.

  * **Cakupan lebih luas**: profil dari seluruh web, tidak hanya LinkedIn.
  * **Akurasi lebih baik**: embedding hasil fine-tuning untuk query peran, keahlian, dan perusahaan.
  * **Kasus penggunaan**: penjualan, rekrutmen, dan riset pasar.

  [Baca dokumentasi Companies &amp; People Search →](/id/docs/search/data/companies-people) · [Baca blog benchmark →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK: highlights dikembalikan" }}>
  <div id="js-sdk-highlights-restored">
    ## JS SDK: highlights dikembalikan
  </div>

  Highlights kembali hadir di JavaScript SDK mulai `exa-js` v2.0.11, mengembalikan kalimat-kalimat kunci beserta skor relevansinya. Kirimkan `highlights: true` atau `highlights: { maxCharacters, query }` pada pemanggilan search dan contents.

  [Baca dokumentasi JavaScript SDK →](/id/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "Search Type Deep Baru" }}>
  <div id="new-deep-search-type">
    ## Search Type Deep Baru
  </div>

  Exa Deep memberikan hasil yang lebih baik dengan menjalankan beberapa search sekaligus dan mengembalikan konteks berkualitas tinggi untuk setiap hasil. Aktifkan dengan `type="deep"`.

  * **Ekspansi query**: kirim satu query dan kami akan membuat variasinya, atau sediakan variasi Anda sendiri lewat `additionalQueries`.
  * **Search paralel dan pemeringkatan cerdas** pada query Anda dan semua variasinya.
  * **Summaries terperinci** untuk setiap hasil.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "Penambahan Filter Bahasa" }}>
  <div id="added-language-filtering">
    ## Penambahan Filter Bahasa
  </div>

  Exa kini mendeteksi bahasa query Anda dan hanya mengembalikan hasil dalam bahasa tersebut. Aktif secara bawaan untuk semua pengguna, tanpa perlu pengaturan apa pun.

  [Baca panduan Search API →](/id/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "Perubahan SDK: highlights dihapus dan contents dikembalikan secara bawaan" }}>
  <div id="sdk-changes-highlights-removed-and-contents-returned-by-default">
    ## Perubahan SDK: highlights dihapus dan contents dikembalikan secara bawaan
  </div>

  Versi mayor SDK dengan perubahan yang tidak kompatibel:

  * **Contents secara bawaan**: search kini menyertakan page contents; nonaktifkan untuk search yang lebih cepat.
  * **Highlights dihapus dari SDK**: kemudian dikembalikan di JS SDK; lihat [JS SDK: highlights dikembalikan](#js-sdk-highlights-restored).
  * **`use_autoprompt` usang**: dihapus dari seluruh respons API.

  [Baca dokumentasi Python SDK →](/id/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "Dukungan Filter Path Domain" }}>
  <div id="domain-path-filter-support">
    ## Dukungan Filter Path Domain
  </div>

  `includeDomains` dan `excludeDomains` kini mendukung penargetan yang lebih spesifik:

  * **Filter berdasarkan path**: misalnya `exa.ai/blog` atau `linkedin.com/company`.
  * **Wildcard subdomain**: misalnya `*.substack.com`.

  Berguna untuk membatasi searches ke blog, katalog produk, atau direktori.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "Dukungan Filter Geolokasi" }}>
  <div id="geolocation-filter-support">
    ## Dukungan Filter Geolokasi
  </div>

  Parameter baru `userLocation` mengarahkan hasil ke wilayah pengguna, dikirim sebagai kode negara [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (misalnya `"us"`, `"fr"`). Berguna untuk aplikasi multiregional, konten berbahasa lokal, dan penemuan konten lokal.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "New Fast Search Type" }}>
  <div id="new-fast-search-type">
    ## Search Type Fast Baru
  </div>

  Exa Fast menggunakan model pencarian yang disederhanakan dengan latensi p50 di bawah 425ms. Aktifkan dengan `type="fast"`.

  * **Indeks Exa yang sama** berisi konten berkualitas tinggi seperti neural search.
  * **Kompatibilitas parameter penuh** dengan search type lainnya.
  * **Dibuat untuk** grounding web yang cepat, workflow agentik, dan produk berlatensi rendah.

  [Baca panduan Search API →](/id/docs/search/quickstart) · [Coba di dashboard →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Score Deprecation in Auto Search" }}>
  <div id="score-deprecation-in-auto-search">
    ## Penghentian Score pada Auto Search
  </div>

  Arsitektur Auto search yang baru tidak lagi dapat menghasilkan skor relevansi yang bermakna, sehingga field `score` dihapus dari hasil Auto search.

  * **Auto search**: tidak lagi mengembalikan `score`; hasil sudah diurutkan berdasarkan relevansi.
  * **Neural search**: skor tidak berubah. Setel `type="neural"` jika Anda masih membutuhkannya.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Markdown Contents as Default" }}>
  <div id="markdown-contents-as-default">
    ## Contents Markdown sebagai Default
  </div>

  Semua endpoint kini mengembalikan markdown yang bersih secara default, yang lebih cocok untuk LLM, RAG, dan pemrosesan teks pada umumnya. Tidak ada tindakan yang perlu dilakukan.

  * **`includeHtmlTags=false` (default)**: konten diproses menjadi markdown yang bersih.
  * **`includeHtmlTags=true`**: HTML mentah tanpa pemrosesan markdown.

  Pada kedua opsi tersebut, boilerplate seperti iklan dan navigasi tetap dihapus.

  [Baca dokumentasi Contents →](/id/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "New Livecrawl Option: Preferred" }}>
  <div id="new-livecrawl-option-preferred">
    ## Opsi Livecrawl Baru: Preferred
  </div>

  <Warning>
    Entri historis: parameter string `livecrawl` kini sudah usang. Untuk integrasi baru, gunakan `maxAgeHours` bersama `livecrawlTimeout`. Lihat [Content Freshness](/id/docs/contents/quickstart#content-freshness).
  </Warning>

  Opsi usang `livecrawl: "preferred"` mencoba melakukan crawl baru, tetapi beralih ke konten cache jika crawl gagal (berbeda dengan `"always"`, yang menghasilkan error). Ideal untuk aplikasi produksi yang menginginkan konten terbaru tanpa gagal pada situs yang sedang tidak tersedia.

  [Baca dokumentasi Content Freshness →](/id/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Contents Endpoint Status Changes" }}>
  <div id="contents-endpoint-status-changes">
    ## Perubahan Status pada Endpoint Contents
  </div>

  `/contents` kini mengembalikan field `statuses` per URL alih-alih satu error HTTP, sehingga Anda dapat menangani hasil setiap URL secara terpisah. Endpoint ini hanya menghasilkan error pada masalah internal.

  * **`status`**: `"success"` atau `"error"` untuk setiap URL.
  * **`error.tag`**: mis. `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE`, disertai `httpStatusCode`.

  [Baca referensi error codes →](/id/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto search as Default" }}>
  <div id="auto-search-as-default">
    ## Auto Search sebagai Default
  </div>

  Auto search kini menjadi default, secara otomatis mengarahkan setiap query ke metode pencarian terbaik. Tidak ada tindakan yang perlu dilakukan; setel `type="neural"` untuk mempertahankan perilaku sebelumnya.

  [Pelajari search types Exa →](/id/docs/search/quickstart)
</Update>