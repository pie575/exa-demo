> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Changelog {#changelog}

> Pembaruan produk dan pengumuman dari Exa.

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  ## Dynamic Highlights (pratinjau riset) {#dynamic-highlights-research-preview}

  Dynamic Highlights memilih kutipan dari keseluruhan kumpulan hasil, bukan memperlakukan setiap halaman secara terpisah. Fitur ini memberikan porsi anggaran konteks bersama yang lebih besar kepada sources yang bermanfaat, dan porsi lebih kecil kepada sources yang hanya mengulang informasi yang sudah dikembalikan.

  * **RAG sekali putar**: efisiensi token sekitar 49% lebih baik dan kualitas hilir 2,4% lebih tinggi dengan Exa Auto pada evaluasi coding dan QA umum.
  * **Agent**: sekitar 30% lebih sedikit token pada keseluruhan trayektori agent dan kualitas 1% lebih tinggi pada BrowseComp, WideSearch, serta evaluasi internal untuk perusahaan dan orang.

  Permintaan yang menyetel `dynamic: true` memerlukan header `Exa-Beta: dynamic-highlights-2026-08-28`.

  [Baca panduan Dynamic Highlights →](/id/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  ## Research publikasi {#publication-research}

  Kami memperluas dan meningkatkan Research atas publikasi akademik secara signifikan.

  * **350 juta publikasi**: search pada indeks berisi 350 juta publikasi.
  * **Hasil organisasi dan orang yang lebih kaya**: search kini mengembalikan organisasi sekaligus orang yang berafiliasi dengannya, masing-masing sebagai profil terperinci hasil enrich yang mencakup publikasi, kolaborator utama, bidang Research, dan pendanaan.
  * **Search agentik untuk orang dan organisasi**: agent kini dapat melakukan search atas orang dan organisasi.
  * **Tolok ukur retrieval publik**: kami merilis tolok ukur publik untuk retrieval publikasi.
  * **Kategori search `publication` baru**: cari hasil ilmiah dengan `category: "publication"`, yang menggantikan kategori `research paper`.
  * **Kategori usang**: kategori search `pdf`, `github`, dan `tweet` sedang dinyatakan usang.
  * **`startCrawlDate` / `endCrawlDate`**: parameter usang ini kini diabaikan untuk semua Team, meskipun tetap diterima demi kompatibilitas.

  Gunakan melalui API dengan [kategori search](/id/docs/search/quickstart) `publication`, atau [coba di dashboard →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  ## Exa Agent dan Exa Connect di MCP {#exa-agent-and-exa-connect-in-mcp}

  Exa Agent kini tersedia di dalam Exa MCP. Gunakan dari Claude, Cursor, atau MCP client lainnya saat tugas membutuhkan lebih dari sekadar satu panggilan search.

  Aktifkan tool Agent dengan `https://mcp.exa.ai/mcp?tools=agent_run`, lalu panggil `agent_run` untuk menjalankan agent hingga selesai dan mengembalikan outputnya.

  Sumber data Exa Connect tersedia melalui flow Agent, sehingga Anda dapat attach data partners premium saat sebuah run membutuhkan lebih dari sekadar web search.

  [Baca panduan Exa MCP →](/id/docs/get-started/exa-mcp) · [Baca panduan Exa Agent →](/id/docs/agent/quickstart) · [Tweet pengumuman →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  ## Memperkenalkan Exa Connect {#introducing-exa-connect}

  Exa Connect memberi Exa Agent akses langsung ke data publik dan privat di seluruh dunia. Saat diluncurkan, Exa Connect hadir dengan Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko, dan Additional Partners. Anda meng-attach-nya melalui `dataSources` pada `POST /agent/runs`.

  [Baca panduan Exa Connect →](/id/docs/agent/connect/overview) · [Tweet pengumuman →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  ## Memperkenalkan Exa Agent {#introducing-exa-agent}

  Kami merilis kelas baru agent Research web mutakhir yang dapat diakses melalui API.

  Exa Agent API mendukung parameter seperti query bahasa alami, mode `effort`, `outputSchema` untuk output terstruktur, dan `input.data` untuk membangun di atas dataset yang sudah ada.

  [Baca panduan Exa Agent API →](/id/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "Pemberitahuan Penghentian API" }}>
  ## Pemberitahuan Penghentian API {#api-deprecation-notice}

  Kami menghentikan beberapa item lama dari Exa API:

  * **endpoint `/research`**: digantikan oleh `/search` dengan `type: "deep-reasoning"`.
  * **`resolvedSearchType` dan `highlightScores` (field response)**: mengembalikan `null` mulai 15 April, dihapus 1 Mei.
  * **`startCrawlDate` / `endCrawlDate` (parameter permintaan yang usang)**: diabaikan tanpa pemberitahuan mulai 15 April.

  [Migrasi ke Deep search →](/id/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Memperkenalkan Exa Monitors" }}>
  ## Memperkenalkan Exa Monitors {#introducing-exa-monitors}

  Monitors menjalankan Exa search sesuai jadwal dan mengirimkan hasilnya ke webhook Anda, dengan deduplikasi terhadap run sebelumnya sehingga Anda hanya menerima konten baru.

  * **Pantau topik dari waktu ke waktu**: berita kompetitor, putaran pendanaan, perubahan regulasi, paper Research.
  * **Hasil terstruktur**: mengembalikan teks biasa atau JSON bertipe melalui `outputSchema`.
  * **Penjadwalan fleksibel**: jalankan pada interval tertentu (minimum 1 jam) atau picu secara manual.

  [Baca panduan Monitors API →](/id/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Pembaruan Besar Exa Deep" }}>
  ## Pembaruan Besar Exa Deep {#exa-deep-revamp}

  Exa Deep kini lebih cepat, lebih murah, dan mendukung output terstruktur dengan grounding tingkat field.

  * **Tipe `deep-reasoning` baru** untuk tugas dengan effort lebih tinggi (12-50 detik); `deep` berjalan dalam 4-12 detik.
  * **Harga 20% lebih rendah** untuk deep search reguler.
  * **Output terstruktur** melalui `outputSchema`, dengan `output.content` dan `output.grounding` (sitasi tingkat field dan confidence) dalam response.

  Lihat [Pembaruan Harga Exa](#exa-pricing-update) di bawah untuk harga selengkapnya.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Pembaruan Harga Exa" }}>
  ## Pembaruan Harga Exa {#exa-pricing-update}

  Kami menyederhanakan dan menurunkan harga. Contents untuk 10 hasil search pertama kini disertakan gratis, dan harga baru berlaku otomatis tanpa perlu tindakan apa pun.

  * **Search dengan contents**: $7 per 1rb permintaan (10 hasil, sudah termasuk teks + kutipan); $1 per 1rb hasil tambahan.
  * **Ringkasan**: $1 per 1rb, baik pada search maupun contents.
  * **Exa Deep**: $12 per 1rb permintaan; **Deep (Reasoning)** $15 per 1rb.
  * **Endpoint Contents**: $1 per 1rb halaman per tipe konten.

  [Lihat harga terkini →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Memperkenalkan Exa Instant Search" }}>
  ## Memperkenalkan Exa Instant Search {#introducing-exa-instant-search}

  Exa Instant adalah search type tercepat kami, memadukan kualitas neural search yang lebih baik dengan latency di bawah 150 ms. Aktifkan dengan `type="instant"`.

  * **Dirancang untuk real-time**: aplikasi chat, AI suara, coding agent, pelengkapan otomatis, dan saran langsung.
  * **Kualitas terdepan** dengan latency terendah yang kami tawarkan.

  [Baca panduan Search API →](/id/docs/search/quickstart) · [Coba di dashboard →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Pembaruan highlights, konten freshness, dan MCP" }}>
  ## Pembaruan highlights, konten freshness, dan MCP {#highlights-content-freshness-and-mcp-updates}

  Tiga peningkatan pada extraction dan akses konten:

  * **`maxCharacters` untuk kutipan**: kini menjadi cara yang disarankan untuk mengatur panjang kutipan. `numSentences` dan `highlightsPerUrl` sudah usang.
  * **`maxAgeHours` untuk konten freshness**: kontrol berbasis usia konten yang menggantikan boolean `livecrawl` (`0` selalu meng-crawl, `-1` hanya cache, `24` meng-crawl jika lebih lama dari 24 jam).
  * **Tingkat gratis Exa MCP**: coba tanpa autentikasi pada 3 QPS dan 150 panggilan/hari; tambahkan API key untuk akses penuh.

  [Dokumentasi konten freshness →](/id/docs/contents/quickstart#content-freshness) · [Exa MCP →](/id/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Memperkenalkan Exa Company Search" }}>
  ## Memperkenalkan Exa Company Search {#introducing-exa-company-search}

  Company search kini menggunakan model retrieval hasil fine-tuning dan pipeline pencocokan entitas. Gunakan `type="auto"`, `category="company"`.

  * **Akurat di berbagai atribut**: industri, geografi, tahap pendanaan, dan jumlah karyawan.
  * **Data entitas terstruktur**: hasil mengembalikan info perusahaan bertipe (tenaga kerja, kantor pusat, keuangan, trafik web).
  * **Kasus penggunaan**: pencarian prospek penjualan, Research pasar, dan workflow rantai pasok.

  [Baca dokumentasi Companies &amp; People Search →](/id/docs/search/data/companies-people) · [Baca blog benchmark →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Memperkenalkan Exa People Search" }}>
  ## Memperkenalkan Exa People Search {#introducing-exa-people-search}

  People search kini mencakup lebih dari 1 miliar profil publik melalui sistem retrieval hibrida. Kategori `linkedin` digantikan oleh kategori baru `people`.

  * **Cakupan lebih luas**: profil dari seluruh web, tidak hanya LinkedIn.
  * **Akurasi lebih baik**: embedding hasil fine-tuning untuk query peran, keahlian, dan perusahaan.
  * **Kasus penggunaan**: penjualan, rekrutmen, dan Research pasar.

  [Baca dokumentasi Companies &amp; People Search →](/id/docs/search/data/companies-people) · [Baca blog benchmark →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK: kutipan dipulihkan" }}>
  ## JS SDK: kutipan dipulihkan {#js-sdk-highlights-restored}

  Kutipan kembali hadir di SDK JavaScript mulai `exa-js` v2.0.11, mengembalikan kalimat-kalimat penting beserta relevance score. Berikan `highlights: true` atau `highlights: { maxCharacters, query }` pada pemanggilan search dan contents.

  [Baca dokumentasi SDK JavaScript →](/id/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "Search Type Deep Baru" }}>
  ## Search Type Deep Baru {#new-deep-search-type}

  Exa Deep menemukan hasil yang lebih baik dengan menjalankan beberapa search sekaligus dan mengembalikan konteks berkualitas tinggi untuk setiap hasil. Aktifkan dengan `type="deep"`.

  * **Ekspansi query**: kirim satu query dan kami akan membuat variasinya, atau sediakan variasi Anda sendiri lewat `additionalQueries`.
  * **Search paralel dan pemeringkatan cerdas** untuk query Anda dan seluruh variasinya.
  * **Ringkasan mendetail** untuk setiap hasil.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "Penambahan Pemfilteran Bahasa" }}>
  ## Penambahan Pemfilteran Bahasa {#added-language-filtering}

  Exa kini mendeteksi bahasa query Anda dan hanya mengembalikan hasil dalam bahasa tersebut. Aktif secara default untuk semua pengguna, tanpa perlu pengaturan apa pun.

  [Baca panduan Search API →](/id/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "Perubahan SDK: kutipan dihapus dan contents dikembalikan secara default" }}>
  ## Perubahan SDK: kutipan dihapus dan contents dikembalikan secara default {#sdk-changes-highlights-removed-and-contents-returned-by-default}

  Versi mayor SDK dengan perubahan yang merusak kompatibilitas:

  * **Contents secara default**: search kini menyertakan page contents; nonaktifkan untuk search yang lebih cepat.
  * **Kutipan dihapus dari SDK**: kemudian dipulihkan di SDK JS; lihat [JS SDK: kutipan dipulihkan](#js-sdk-highlights-restored).
  * **`use_autoprompt` usang**: dihapus dari semua response API.

  [Baca dokumentasi SDK Python →](/id/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "Dukungan Filter Path Domain" }}>
  ## Dukungan Filter Path Domain {#domain-path-filter-support}

  `includeDomains` dan `excludeDomains` kini mendukung penargetan yang lebih presisi:

  * **Pemfilteran khusus path**: mis. `exa.ai/blog` atau `linkedin.com/company`.
  * **Wildcard subdomain**: mis. `*.substack.com`.

  Berguna untuk membatasi search ke blog, katalog produk, atau direktori.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "Dukungan Filter Geolokasi" }}>
  ## Dukungan Filter Geolokasi {#geolocation-filter-support}

  Parameter baru `userLocation` mengarahkan hasil ke wilayah pengguna, diberikan sebagai kode negara [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (mis. `"us"`, `"fr"`). Berguna untuk aplikasi multiregional, konten berbahasa regional, dan penemuan lokal.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "Search Type Fast Baru" }}>
  ## Search Type Fast Baru {#new-fast-search-type}

  Exa Fast menggunakan model pencarian yang dirampingkan dengan latency p50 di bawah 425ms. Aktifkan dengan `type="fast"`.

  * **Indeks Exa yang sama** berisi konten berkualitas tinggi seperti pada neural search.
  * **Kompatibilitas parameter penuh** dengan search type lainnya.
  * **Dibuat untuk** grounding web yang cepat, workflow agentik, dan produk berlatency rendah.

  [Baca panduan Search API →](/id/docs/search/quickstart) · [Coba di dashboard →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Penghentian Score pada Auto Search" }}>
  ## Penghentian Score pada Auto Search {#score-deprecation-in-auto-search}

  Arsitektur Auto search yang baru tidak lagi dapat menghasilkan relevance score yang bermakna, sehingga field `score` dihapus dari hasil Auto search.

  * **Auto search**: tidak lagi mengembalikan `score`; hasil sudah diurutkan berdasarkan relevance.
  * **Neural search**: score tidak berubah. Setel `type="neural"` jika Anda masih membutuhkannya.

  [Baca Search API reference →](/id/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Contents Markdown sebagai Default" }}>
  ## Contents Markdown sebagai Default {#markdown-contents-as-default}

  Semua endpoint kini mengembalikan markdown yang bersih secara default, yang lebih cocok untuk LLM, RAG, dan pemrosesan teks pada umumnya. Tidak ada tindakan yang diperlukan.

  * **`includeHtmlTags=false` (default)**: konten diproses menjadi markdown yang bersih.
  * **`includeHtmlTags=true`**: HTML mentah tanpa pemrosesan markdown.

  Dalam kedua kasus, boilerplate seperti iklan dan navigasi tetap dihilangkan.

  [Baca dokumentasi Contents →](/id/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "Opsi Livecrawl Baru: Preferred" }}>
  ## Opsi Livecrawl Baru: Preferred {#new-livecrawl-option-preferred}

  <Warning>
    Entri historis: parameter string `livecrawl` kini sudah usang. Untuk integrasi baru, gunakan `maxAgeHours` bersama `livecrawlTimeout`. Lihat [Content Freshness](/id/docs/contents/quickstart#content-freshness).
  </Warning>

  Opsi usang `livecrawl: "preferred"` mencoba melakukan crawl baru, tetapi beralih ke konten cache jika crawl gagal (berbeda dengan `"always"`, yang menghasilkan error). Ideal untuk aplikasi production yang menginginkan konten terbaru tanpa gagal saat suatu situs sedang tidak tersedia.

  [Baca dokumentasi Content Freshness →](/id/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Perubahan Status Endpoint Contents" }}>
  ## Perubahan Status Endpoint Contents {#contents-endpoint-status-changes}

  `/contents` kini mengembalikan field `statuses` per URL alih-alih satu error HTTP, sehingga Anda dapat menangani hasil setiap URL secara terpisah. Endpoint ini hanya mengembalikan error untuk masalah internal.

  * **`status`**: `"success"` atau `"error"` per URL.
  * **`error.tag`**: misalnya `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE`, disertai `httpStatusCode`.

  [Baca referensi error codes →](/id/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto Search sebagai Default" }}>
  ## Auto search sebagai Default {#auto-search-as-default}

  Auto search kini menjadi default, secara otomatis mengarahkan setiap query ke metode pencarian terbaik. Tidak ada tindakan yang diperlukan; setel `type="neural"` untuk mempertahankan perilaku sebelumnya.

  [Pelajari search type Exa →](/id/docs/search/quickstart)
</Update>