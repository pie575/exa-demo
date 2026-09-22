> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="agent-best-practices">
  # Praktik Terbaik Agent
</div>

> Sesuaikan kualitas query, terstruktur output, effort, dan cost untuk integrasi Exa Agent di production.

Gunakan panduan ini setelah [Exa Agent quickstart](/id/docs/agent/quickstart) untuk meningkatkan kualitas query, menyusun output, serta mengendalikan runtime dan cost. Untuk permintaan yang utuh, mulailah dari [contoh Agent](/id/docs/agent/examples).

<div id="core-principles">
  ## Prinsip inti
</div>

Perlakukan `query` sebagai spesifikasi tugas. Sebutkan apa yang harus ditemukan Agent, cakupan pekerjaannya, evidence yang dibutuhkan, dan seperti apa hasil yang dianggap lengkap.

<CodeGroup>
  ```python Python theme={null}
  run = exa.agent.runs.create(
      query="Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources.",
  )
  ```

  ```javascript JavaScript theme={null}
  const run = await exa.agent.runs.create({
    query:
      "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
    }'
  ```
</CodeGroup>

Tanpa `outputSchema`, Agent mengembalikan prosa di `output.text` dan sitasi di `output.grounding`. Tambahkan field lain hanya jika field itu punya fungsi yang jelas:

| Field                   | Gunakan saat                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `outputSchema`          | Kode di hilir membutuhkan field terstruktur                                         |
| `input.data`            | Anda sudah punya baris data untuk di-enrich                                         |
| `input.exclusion`       | Ada catatan tertentu yang tidak boleh dikembalikan                                  |
| `dataSources`           | Sebuah field harus berasal dari partner [Exa Connect](/id/docs/agent/connect/overview) |
| `previousRunId`         | Permintaan melanjutkan run yang sudah selesai                                       |
| `effort`                | Biaya atau kedalaman research perlu diatur secara eksplisit                         |
| `budget.maxCostDollars` | Run `auto` atau `max` perlu batas atas biaya yang tegas                             |

Letakkan baris data, pengecualian, dan bentuk response pada field khususnya masing-masing, jangan menyisipkannya ke dalam `query`.

<div id="writing-list-building-and-enrichment-queries">
  ## Menulis query list building dan enrichment
</div>

Untuk list building, tentukan entitas, jumlah target, kriteria kualifikasi, pengecualian, dan standar evidence. Untuk enrichment, masukkan catatan yang sudah ada ke `input.data` dan jelaskan hanya research yang perlu ditambahkan oleh Agent.

Mintalah alasan ketika kualifikasi membutuhkan penilaian. Berikan contoh hanya jika sebuah kriteria memiliki lebih dari satu penafsiran yang masuk akal.

<CodeGroup>
  ```text Query theme={null}
  Find up to 20 current engineering leaders at US-based AI infrastructure companies
  that announced a Series A or B between March 1 and August 31, 2026.

  Include CTOs, VPs of Engineering, and Heads of Engineering. Exclude founders without
  an operating engineering role and anyone whose current employment cannot be verified.
  For each person, return their name, current title, company, company website, funding
  announcement date, and a short explanation of why they qualify. Verify employment on
  the company website or another current source, and verify funding from the company
  announcement or a reputable business publication.
  ```
</CodeGroup>

Lihat [Find all GTM members](/id/docs/agent/examples#find-all-code) untuk contoh permintaan discovery dan [Enrich input rows](/id/docs/agent/examples#enrich-input-rows-code) untuk pola enrichment baris yang sesuai.

<div id="handle-asynchronous-runs">
  ## Menangani run asinkron
</div>

Agent run bisa memakan waktu beberapa detik hingga beberapa menit saat melakukan search, membaca, dan menalar. Rancang alur mengikuti siklus hidup run, bukan dengan menahan permintaan aplikasi tetap terbuka.

<Steps>
  <Step title="Buat dan simpan">
    Buat run tersebut dan simpan `id` yang dikembalikan bersama metadata permintaan Anda. Response pembuatan bukanlah hasil akhir.
  </Step>

  <Step title="Tunggu status terminal">
    Gunakan helper polling SDK, lakukan poll ke `GET /agent/runs/{id}`, atau konsumsi stream SSE. Lanjutkan selama run berstatus `queued` atau `running`.
  </Step>

  <Step title="Simpan hasilnya">
    Berhenti menunggu saat status menjadi `completed`, `failed`, atau `cancelled`, lalu simpan response terminal beserta grounding-nya.
  </Step>
</Steps>

Dengan menyimpan ID run, aplikasi Anda dapat pulih setelah restart, terhubung kembali ke stream, dan memeriksa kegagalan. Tekan latency dengan mempersempit scope, membatasi jumlah hasil, menjaga schema tetap ringkas, serta memilih `minimal` atau `low` ketika kecepatan lebih penting daripada kelengkapan.

Untuk batch, lakukan benchmark pada tugas yang representatif sebelum memperkirakan konkurensi atau menempatkan Agent pada jalur UI sinkron. Waktu eksekusi bervariasi tergantung jumlah item, kompleksitas schema, ketersediaan source, dan effort.

Untuk team dengan Zero Data Retention, konsumsi stream langsung atau lakukan poll dalam jendela retensi. `previousRunId` dan `dataSources` Connect tidak tersedia. Lihat [Zero Data Retention](/id/docs/admin/security/zero-data-retention).

<div id="write-custom-json-schemas-for-structured-output">
  ## Tulis JSON schema kustom untuk terstruktur output
</div>

Gunakan `outputSchema` saat kode di sisi hilir membutuhkan field yang dapat dibaca mesin, nilai yang dinormalisasi, baris tabel, atau catatan enrichment. Jika jawaban dalam bentuk prosa sudah cukup, abaikan saja dan baca `output.text`; terstruktur output menambah pekerjaan pemformatan dan dapat menambah latency.

Tempatkan instruksi Research di `query` dan bentuk response di `outputSchema`. Gunakan nama properti dan deskripsi yang jelas, pilih tipe paling sempit yang masih berguna, dan batasi array dengan `maxItems`.

<CodeGroup>
  ```json Output schema expandable theme={null}
  {
    "type": "object",
    "properties": {
      "people": {
        "type": "array",
        "maxItems": 10,
        "description": "Current engineering leaders who satisfy every criterion in the query.",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The person's full name."
            },
            "job_title": {
              "type": "string",
              "description": "Their current title at the qualifying company."
            },
            "company": {
              "type": "string",
              "description": "The qualifying company's canonical name."
            },
            "qualification_rationale": {
              "type": "string",
              "description": "A concise explanation of how the person satisfies the query criteria."
            }
          },
          "required": ["name", "job_title", "company", "qualification_rationale"]
        }
      }
    },
    "required": ["people"]
  }
  ```
</CodeGroup>

Kepatuhan terhadap schema memvalidasi bentuk, bukan fakta. Agent dapat mengembalikan `null` ketika evidence tidak mendukung suatu field, bahkan jika schema yang dikirim menandainya sebagai wajib atau non-nullable. `stopReason: schema_satisfied` berarti Agent menganggap bentuk yang diharapkan sudah lengkap dengan null tersebut diizinkan; ini tidak menjamin validasi ketat terhadap schema yang dikirim.

Jangan menduplikasi sitasi atau confidence bawaan Exa di dalam schema Anda. Tambahkan field alasan hanya jika setiap item perlu menjelaskan alasan kelayakannya, dan simpan `output.grounding` bersama hasil terstruktur. Verifikasi klaim penting terhadap sources-nya dan uji perubahan schema pada input yang representatif sebelum dirilis.

Telusuri [contoh Agent terstruktur](/id/docs/agent/examples) untuk membandingkan schema bagi list building, KYB, lowongan kerja, pengecualian, dan runs lanjutan.

<div id="agent-vs-search">
  ## Agent vs Search
</div>

| Kebutuhan                                                       | Mulai dengan                            |
| --------------------------------------------------------------- | --------------------------------------- |
| Hasil web untuk LLM Anda                                        | [Search](/id/docs/search/quickstart)       |
| Research dan synthesis yang cepat                               | [Deep Search](/id/docs/search/deep-search) |
| List building asinkron, research multi-langkah, atau enrichment | [Agent](/id/docs/agent/quickstart)         |

Gunakan Agent jika pekerjaan tersebut membutuhkan beberapa langkah retrieval, verifikasi per entitas, atau enrichment terhadap catatan yang sudah diketahui. Gunakan Search jika Anda butuh halaman dengan cepat dan aplikasi Anda yang akan melakukan sisa penalarannya.

<div id="tips-for-common-use-cases">
  ## Tips untuk kasus penggunaan umum
</div>

| Jika Anda butuh                                       | Gunakan                                                          | Hindari                                                           |
| ----------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| Daftar hasil research yang ukurannya tidak diketahui  | `auto` dan `outputSchema` yang dibatasi                          | Effort murah yang tetap dan array tanpa batas                     |
| Enrichment untuk catatan yang sudah Anda miliki       | `input.data` beserta field yang ingin ditambahkan                | Menempelkan tabel ke dalam `query`                                |
| Follow-up atas kumpulan hasil terakhir                | `previousRunId`                                                  | Mengirim ulang seluruh output sebelumnya                          |
| Catatan yang tidak boleh muncul lagi                  | `input.exclusion` beserta deduplikasi di tahap berikutnya        | Menganggap pengecualian sebagai jaminan identitas yang ketat      |
| Data provider premium                                 | [Exa Connect](/id/docs/agent/connect/overview) dengan `dataSources` | Meminta Agent menyimpulkan field khusus provider dari web terbuka |
| Cost per permintaan yang dapat diprediksi             | `effort` yang tetap                                              | `auto` atau `max` tanpa anggaran                                  |
| Kelengkapan lebih penting daripada latency &amp; cost | `xhigh` atau `max`                                               | Menaikkan effort sebelum mempertajam query                        |

<div id="next-steps">
  ## Langkah selanjutnya
</div>

<Columns cols={2}>
  <Card title="Agent quickstart" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Buat run, stream events, atur effort, dan baca terstruktur output.
  </Card>

  <Card title="Contoh Agent" icon="layers" href="/id/docs/agent/examples" cta="Jelajahi contoh" arrow="true">
    Salin permintaan lengkap untuk list building, enrichment, KYB, pengecualian, dan follow-up.
  </Card>

  <Card title="Exa Connect" icon="database" href="/id/docs/agent/connect/overview" cta="Jelajahi data partners" arrow="true">
    Tambahkan data premium dari provider tentang perusahaan, orang, trafik, kepatuhan, keuangan, dan lainnya.
  </Card>

  <Card title="Praktik terbaik Search" icon="sparkles" href="/id/docs/search/best-practices" cta="Baca panduan" arrow="true">
    Kualitas retrieval, latency, dan synthesis saat Search sudah cukup.
  </Card>
</Columns>