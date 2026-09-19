> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="search-best-practices">
  # Praktik Terbaik Search
</div>

> Optimalkan kualitas retrieval, latensi, konteks, dan synthesis untuk integrasi Search API di lingkungan produksi.

Panduan ini mengasumsikan Anda sudah memiliki [permintaan Search API](/id/docs/search/quickstart) yang berfungsi, dan menjelaskan cara menyempurnakan permintaan tersebut sesuai praktik terbaik yang direkomendasikan Exa.

<div id="start-with-the-smallest-useful-request">
  ## Mulai dengan permintaan terkecil yang berguna
</div>

Baseline terbaik adalah query bahasa alami dengan `highlights: true`. Exa menyesuaikan panjang excerpt setiap hasil dengan tingkat relevansinya, sehingga tidak ada character budget yang perlu disetel:

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Dengan ini Anda mendapatkan halaman yang sudah diperingkat beserta konteks hemat token untuk tiap halaman, sesuai dengan query.

Tambahkan parameter lain hanya jika diperlukan:

| Parameter                  | Tambahkan saat                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `type`                     | Menyesuaikan dengan anggaran latensi atau kebutuhan kedalaman                                                |
| `numResults`               | Lebih sedikit halaman untuk jendela konteks yang lebih kecil, atau lebih banyak untuk recall yang lebih luas |
| `outputSchema`             | Menyintesis hasil atau menyusunnya menjadi JSON                                                              |
| `maxAgeHours`              | Page content yang di-cache mungkin sudah terlalu usang                                                       |
| `highlights.maxCharacters` | Aplikasi Anda memerlukan limit excerpt tetap per halaman                                                     |
| Filter domain atau tanggal | Hasil di luar batasan tersebut tidak akan berguna                                                            |

<div id="search-vs-deep-search">
  ## Search vs. Deep Search
</div>

Search standar mengambil dan memeringkat halaman untuk sebuah query. Deep Search menjalankan proses riset yang dapat
melakukan search secara berulang, menelaah temuannya, memperhalus search, lalu melakukan synthesis menjadi hasil yang grounded.

| Kebutuhan                                                                                                                                | Mulai dengan                        |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Halaman berperingkat untuk query yang sudah dirumuskan dengan baik                                                                       | `auto` atau `fast`                  |
| Search yang sulit, synthesis dari banyak hasil, atau structured output yang tidak bisa dipenuhi hanya dengan satu kali search (3+ field) | `deep`                              |
| Riset berdurasi panjang, list building, atau enrichment multi-langkah                                                                    | [Exa Agent](/id/docs/agent/quickstart) |

Mode deep direkomendasikan secara default saat menggunakan `outputSchema`. Baca [panduan Deep Search](/id/docs/search/deep-search) untuk instruksi dan contoh lengkap.

<div id="improve-retrieval-quality">
  ## Tingkatkan kualitas retrieval
</div>

Ketika hasil perlu diperbaiki, ubah satu bagian permintaan dalam satu waktu.

<Steps>
  <Step title="Perjelas query">
    Deskripsikan halaman yang Anda inginkan, bukan sekadar kumpulan kata kunci. Sertakan subjek serta jenis sumber,
    periode waktu, atau detail lain yang memengaruhi seperti apa hasil yang relevan.

    ```text theme={null}
    Benchmark papers evaluating long-context retrieval methods on legal documents
    ```
  </Step>

  <Step title="Baca respons secara berlapis">
    Perhatikan judul, URL, tanggal publikasi, dan highlights sebelum mengubah permintaan.

    ```json theme={null}
    {
      "results": [
        {
          "title": "Long-Context Retrieval Methods on Legal Documents",
          "url": "https://arxiv.org/abs/2608.00000",
          "publishedDate": "2026-08-26T00:00:00.000Z",
          "highlights": [
            "We compare long-context retrieval methods across legal document benchmarks..."
          ]
        }
      ]
    }
    ```

    Judul dan URL menunjukkan jenis sumber yang diambil Exa, `publishedDate` menunjukkan
    seberapa baru sumber tersebut, dan highlight menunjukkan evidence yang cocok dengan query. Perbaiki query untuk
    mengambil halaman yang berbeda, tambahkan filter tanggal untuk mempersempit periode waktu, atau ambil teks lengkap saat
    Anda membutuhkan lebih banyak konteks dari sebuah hasil yang bermanfaat.
  </Step>

  <Step title="Tambahkan hanya batasan yang mutlak">
    Gunakan `includeDomains`, `excludeDomains`, dan publication-date filters hanya ketika hasil yang
    melanggar batasan tersebut memang tidak bisa dipakai. Tempatkan preferensi retrieval di dalam query dan, saat
    melakukan synthesis, tempatkan instruksi respons di `systemPrompt`.
  </Step>

  <Step title="Ubah search mode paling akhir">
    Gunakan mode yang lebih cepat untuk memenuhi kebutuhan latensi, atau mode deep ketika proses retrieval itu sendiri
    memerlukan iterasi dan penalaran. Pergantian mode tidak akan memperbaiki query yang kurang spesifik.
  </Step>
</Steps>

Siapkan sekumpulan kecil query representatif selama penyetelan. Bandingkan relevansi hasil dan keberhasilan tugas lanjutan pada seluruh kumpulan tersebut, bukan mengoptimalkan untuk satu contoh saja. Catat `requestId`, `searchTime`, dan `costDollars` agar regresi dapat direproduksi.

<div id="budget-latency-and-context">
  ## Mengatur anggaran latensi dan konteks
</div>

Setiap kontrol mengonsumsi sumber daya yang berbeda:

| Kontrol                   | Apa yang ditambahkan                                         |
| ------------------------- | ------------------------------------------------------------ |
| Lebih banyak hasil        | Lebih banyak halaman, data respons, dan konteks hilir        |
| Teks lengkap              | Konteks halaman yang lebih luas dan payload yang lebih besar |
| `summary`                 | Satu panggilan model bahasa tambahan per hasil               |
| `outputSchema`            | synthesis atas seluruh hasil yang diambil                     |
| `contents.maxAgeHours: 0` | Pengambilan halaman baru alih-alih konten dari cache         |
| Tipe search deep          | Search iteratif, synthesis, dan penalaran                     |

Untuk alur real-time yang masih menoleransi konten dari cache, gabungkan mode berlatensi terendah dengan highlights dan konten khusus cache:

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent product updates from major AI labs",
      type="instant",
      contents={
          "highlights": True,
          "max_age_hours": -1,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("Recent product updates from major AI labs", {
    type: "instant",
    contents: {
      highlights: true,
      maxAgeHours: -1
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent product updates from major AI labs",
      "type": "instant",
      "contents": {
        "highlights": true,
        "maxAgeHours": -1
      }
    }'
  ```
</CodeGroup>

Jangan gunakan pola ini jika freshness halaman menentukan benar atau tidaknya hasil. Mulailah dari `auto` dan freshness bawaan, kecuali produk Anda memang punya target latensi yang terukur.

Agar Exa mengalokasikan satu anggaran konteks untuk seluruh kumpulan hasil — lebih banyak dari sumber yang kuat, lebih sedikit dari sumber yang redundan — lihat [pratinjau riset Dynamic Highlights](/id/docs/search/highlights#dynamic-highlights).

<div id="tips-for-common-use-cases">
  ## Tips untuk kasus penggunaan umum
</div>

| Jika Anda butuh                                 | Gunakan                                                                  | Hindari                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Publikasi yang lebih baru                       | Cantumkan rentang waktu pada query atau gunakan publication-date filters | `maxAgeHours`                                                 |
| Konten terbaru dari halaman yang sering berubah | `contents.maxAgeHours`                                                   | Publication-date filters                                      |
| Jenis sumber tertentu yang diutamakan           | Cara menyusun query; `systemPrompt` saat melakukan synthesis             | Allowlist domain yang kaku                                    |
| Hasil hanya dari sumber yang disetujui          | `includeDomains`                                                         | Mengulang `site:` di dalam query                              |
| Structured output berukuran kecil               | `outputSchema` dengan Search standar                                     | Memilih Deep hanya karena output berupa JSON                  |
| Hasil riset dengan banyak item                  | `deep` dengan `outputSchema`, atau [Exa Agent](/id/docs/agent/quickstart)   | Berharap satu putaran retrieval dapat mengumpulkan semua item |
| Konteks lebih banyak dari beberapa halaman      | Search dengan highlights, lalu call Contents                             | Teks lengkap untuk setiap hasil                               |
| Latensi lebih rendah                            | Ukur `fast` atau `instant` dengan konten ringkas                         | Menambahkan kontrol freshness atau synthesis secara default   |

<div id="when-to-use-another-endpoint">
  ## Kapan menggunakan endpoint lain
</div>

Gunakan endpoint Exa yang berbeda ketika sifat tugasnya berubah:

| Tugas                                                | Gunakan                               |
| ---------------------------------------------------- | ------------------------------------- |
| Riset jangka panjang, list building, atau enrichment | [Exa Agent](/id/docs/agent/quickstart)   |
| URL sudah diketahui                                  | [Contents](/id/docs/contents/quickstart) |
| Menjalankan search secara terjadwal                  | [Monitors](/id/docs/monitors/quickstart) |

<div id="next-steps">
  ## Langkah selanjutnya
</div>

<Columns cols={2}>
  <Card title="Search API reference" icon="square-terminal" href="/id/docs/reference/search" cta="Buka referensi" arrow="true">
    Setiap parameter permintaan dan field respons.
  </Card>

  <Card title="Quickstart Search" icon="search" href="/id/docs/search/quickstart" cta="Lihat panduan" arrow="true">
    Bentuk dasar permintaan, filter, output, dan freshness.
  </Card>

  <Card title="Contents API" icon="file-text" href="/id/docs/contents/quickstart" cta="Buka panduan" arrow="true">
    Ekstrak highlights atau teks lengkap dari halaman yang sudah Anda ketahui.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Riset berdurasi panjang, list building, dan enrichment.
  </Card>
</Columns>