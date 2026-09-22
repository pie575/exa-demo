> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="search-best-practices">
  # Praktik Terbaik Search
</div>

> Optimalkan kualitas retrieval, latency, konteks, dan synthesis untuk integrasi Search API di production.

Panduan ini mengasumsikan Anda sudah memiliki [permintaan Search API](/id/docs/search/quickstart) yang berjalan. Di sini dijelaskan cara menyempurnakan permintaan tersebut sesuai praktik terbaik yang direkomendasikan Exa.

<div id="start-with-the-smallest-useful-request">
  ## Mulai dengan permintaan terkecil yang berguna
</div>

Baseline terbaik adalah query bahasa alami dengan `highlights: true`. Exa menyesuaikan panjang kutipan setiap hasil dengan relevance-nya, jadi tidak ada character budget yang perlu disetel:

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

Hasilnya, Anda mendapatkan halaman yang sudah diperingkat beserta konteks yang hemat token untuk tiap halaman, sesuai dengan query.

Tambahkan parameter lain hanya jika diperlukan:

| Parameter                  | Tambahkan saat                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `type`                     | Menyesuaikan dengan anggaran latency atau kebutuhan kedalaman                                     |
| `numResults`               | Lebih sedikit halaman untuk jendela konteks yang kecil, atau lebih banyak untuk cakupan yang luas |
| `outputSchema`             | Mensintesis hasil atau menyusunnya ke dalam JSON                                                  |
| `maxAgeHours`              | Konten halaman di cache mungkin sudah terlalu lama                                                |
| `highlights.maxCharacters` | Aplikasi Anda membutuhkan batas kutipan tetap per halaman                                         |
| Filter domain atau tanggal | Hasil di luar batasan tersebut tidak akan berguna                                                 |

<div id="search-vs-deep-search">
  ## Search vs. Deep Search
</div>

Search standar mengambil dan memeringkat halaman untuk sebuah query. Deep Search menjalankan proses Research yang dapat
melakukan search secara iteratif, memeriksa hasil yang ditemukan, menyempurnakan search, dan melakukan synthesis menjadi hasil yang grounded.

| Kebutuhan                                                                                                                                   | Mulai dengan                        |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Halaman berperingkat untuk query yang sudah dirumuskan dengan baik                                                                          | `auto` atau `fast`                  |
| Search yang sulit, synthesis dari banyak hasil, atau structured outputs yang tidak dapat dipenuhi hanya dengan satu kali search (3+ fields) | `deep`                              |
| Research jangka panjang, list building, atau enrichment multi-langkah                                                                       | [Exa Agent](/id/docs/agent/quickstart) |

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

  <Step title="Baca response secara berlapis">
    Perhatikan judul, URL, publication date, dan kutipan sebelum mengubah permintaan.

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
    seberapa baru sumber tersebut, dan kutipan menunjukkan evidence yang cocok dengan query. Perhalus query untuk
    mengambil halaman yang berbeda, tambahkan filter tanggal untuk mempersempit periode waktu, atau ambil teks penuh saat
    Anda butuh konteks lebih banyak dari sebuah hasil yang bermanfaat.
  </Step>

  <Step title="Tambahkan hanya batasan yang mutlak">
    Gunakan `includeDomains`, `excludeDomains`, dan filter tanggal publikasi hanya ketika hasil yang
    melanggar batasan tersebut memang tidak bisa dipakai. Letakkan preferensi retrieval di dalam query dan, saat
    melakukan sintesis, letakkan instruksi response di `systemPrompt`.
  </Step>

  <Step title="Ubah search mode paling akhir">
    Gunakan mode yang lebih cepat untuk kebutuhan latency, atau mode deep ketika proses retrieval itu sendiri
    membutuhkan iterasi dan penalaran. Mode yang berbeda tidak akan memperbaiki query yang kurang spesifik.
  </Step>
</Steps>

Pertahankan sekumpulan kecil query representatif selama proses penyetelan. Bandingkan relevance hasil dan keberhasilan tugas lanjutan pada seluruh kumpulan tersebut, bukan mengoptimalkan untuk satu contoh saja. Catat `requestId`, `searchTime`, dan `costDollars` agar regresi dapat direproduksi.

<div id="budget-latency-and-context">
  ## Mengatur anggaran latency dan konteks
</div>

Setiap kontrol menghabiskan sumber daya yang berbeda:

| Kontrol                   | Yang ditambahkan                                       |
| ------------------------- | ------------------------------------------------------ |
| Lebih banyak hasil        | Lebih banyak halaman, data response, dan konteks hilir |
| Teks penuh                | Konteks halaman lebih luas dan payload lebih besar     |
| `summary`                 | Satu panggilan model bahasa tambahan per hasil         |
| `outputSchema`            | Synthesis di seluruh hasil yang diambil                |
| `contents.maxAgeHours: 0` | Pengambilan halaman baru alih-alih konten dari cache   |
| Search type deep          | Search iteratif, synthesis, dan penalaran              |

Untuk jalur real-time yang masih dapat menerima konten dari cache, gabungkan mode dengan latency terendah bersama kutipan dan konten cache saja:

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

Jangan gunakan pola ini jika kebaruan halaman menentukan ketepatan hasil. Mulailah dari `auto` dan kebaruan default kecuali produk Anda punya target latency yang terukur.

Agar Exa mengalokasikan satu anggaran konteks untuk seluruh kumpulan hasil — lebih banyak dari sources yang kuat, lebih sedikit dari yang redundan — lihat [pratinjau riset Dynamic Highlights](/id/docs/search/highlights#dynamic-highlights).

<div id="tips-for-common-use-cases">
  ## Tips untuk kasus penggunaan umum
</div>

| Jika Anda membutuhkan                           | Gunakan                                                                  | Hindari                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Publikasi yang lebih baru                       | Sertakan rentang waktu dalam query atau gunakan filter tanggal publikasi | `maxAgeHours`                                              |
| Konten terbaru dari halaman yang sering berubah | `contents.maxAgeHours`                                                   | Filter tanggal publikasi                                   |
| Jenis source tertentu yang diinginkan           | Susunan kata pada query; `systemPrompt` saat melakukan synthesis         | Allowlist domain yang kaku                                 |
| Hasil hanya dari sources yang disetujui         | `includeDomains`                                                         | Mengulang `site:` dalam query                              |
| Output terstruktur berukuran kecil              | `outputSchema` dengan Search standar                                     | Memilih Deep hanya karena output berupa JSON               |
| Output hasil research dengan banyak item        | `deep` dengan `outputSchema`, atau [Exa Agent](/id/docs/agent/quickstart)   | Berharap satu kali retrieval dapat mengumpulkan semua item |
| Lebih banyak konteks dari beberapa halaman      | Search dengan kutipan, lalu panggil Contents                             | Teks penuh untuk setiap hasil                              |
| Latency yang lebih rendah                       | Ukur `fast` atau `instant` dengan konten ringkas                         | Menambahkan kontrol kebaruan atau synthesis secara default |

<div id="when-to-use-another-endpoint">
  ## Kapan menggunakan endpoint lain
</div>

Gunakan endpoint Exa yang berbeda ketika sifat tugasnya berubah:

| Tugas                                                   | Gunakan                               |
| ------------------------------------------------------- | ------------------------------------- |
| Research jangka panjang, list building, atau enrichment | [Exa Agent](/id/docs/agent/quickstart)   |
| URL sudah diketahui                                     | [Contents](/id/docs/contents/quickstart) |
| Menjalankan search sesuai jadwal                        | [Monitors](/id/docs/monitors/quickstart) |

<div id="next-steps">
  ## Langkah selanjutnya
</div>

<Columns cols={2}>
  <Card title="Search API reference" icon="square-terminal" href="/id/docs/reference/search" cta="Buka referensi" arrow="true">
    Setiap parameter permintaan dan field response.
  </Card>

  <Card title="Quickstart Search" icon="search" href="/id/docs/search/quickstart" cta="Tinjau panduan" arrow="true">
    Bentuk dasar permintaan, filter, output, dan kebaruan.
  </Card>

  <Card title="Contents API" icon="file-text" href="/id/docs/contents/quickstart" cta="Buka panduan" arrow="true">
    Ekstrak kutipan atau teks penuh dari halaman yang sudah Anda ketahui.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Research jangka panjang, list building, dan enrichment.
  </Card>
</Columns>