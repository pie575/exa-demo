> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Cara Menggunakan Imports {#how-to-use-imports}

> Panduan langkah demi langkah untuk mengimpor URL ke Websets -- meng-enrich daftar Anda, menilainya berdasarkan kriteria, menemukan matches baru, dan menggabungkan ketiganya.

Jika Anda sudah punya daftar URL (perusahaan, orang, produk, dan sebagainya), Anda bisa **mengimpor**-nya ke sebuah Webset. Bergantung pada cara Anda menyiapkan Webset tersebut, item yang diimpor bisa di-enrich, dievaluasi berdasarkan kriteria, atau digabungkan dengan hasil web discovery.

Panduan ini membahas setiap konfigurasi beserta panggilan API yang bisa langsung Anda salin-tempel. Cukup ganti `$EXA_API_KEY` dengan API key Anda.

## Contoh Kami: 5 Pemasok Konsultasi TI {#our-example-5-it-consulting-suppliers}

Sepanjang panduan ini, kami akan menggunakan daftar 5 perusahaan yang sama sebagai impor kami:

| Perusahaan   | URL                              | Catatan                                                               |
| ------------ | -------------------------------- | --------------------------------------------------------------------- |
| Accenture    | `https://www.accenture.com`      | Konsultasi TI global, kantor pusat di AS                              |
| Infosys      | `https://www.infosys.com`        | Layanan TI, kehadiran besar di AS                                     |
| Wipro        | `https://www.wipro.com`          | Layanan TI, memiliki kantor di AS                                     |
| EPAM Systems | `https://www.epam.com`           | Rekayasa perangkat lunak, tercatat di bursa AS                        |
| Persol Group | `https://www.persol-group.co.jp` | Perusahaan penyedia tenaga kerja, fokus Jepang, kehadiran di AS minim |

Kami memilih perusahaan-perusahaan ini karena 4 dari 5 jelas memenuhi kriteria umum konsultasi TI (kantor di AS, layanan TI). **Persol Group** adalah pengecualiannya -- perusahaan ini adalah penyedia tenaga kerja asal Jepang dengan kehadiran yang minim di AS, sehingga seharusnya tidak memenuhi kriteria yang berfokus pada AS.

Kriteria kami untuk contoh-contoh di bawah ini:

1. &quot;Perusahaan memiliki kantor di Amerika Serikat&quot;
2. &quot;Perusahaan menyediakan layanan konsultasi TI atau penambahan tenaga kerja&quot;

***

## Config 1: Import Only -- Enrich Tanpa Pemfilteran {#config-1-import-only-enrich-without-filtering}

<Note>
  **Contoh langsung:** [Lihat webset ini di dashboard](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**Gunakan saat:** Anda punya daftar URL dan hanya ingin meng-enrich-nya. Tanpa penilaian, tanpa pemfilteran -- semua item dipertahankan.

### Panggilan API {#api-calls}

```bash theme={null}
# Langkah 1: Buat impor CSV berisi URL pemasok Anda
curl -s -X POST "https://api.exa.ai/websets/v0/imports" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "count": 5,
    "size": 128,
    "entity": { "type": "company" },
    "title": "IT Consulting Suppliers"
  }'
# Response berisi `uploadUrl` dan `id` impor

# Langkah 2: Unggah CSV Anda ke URL presigned dari Langkah 1
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv berisi: url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# Langkah 3: Buat Webset yang menggunakan impor ini (hanya enrichments, tanpa search/kriteria)
# Impor akan otomatis dijadwalkan untuk diproses saat Webset dibuat.
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "import": [
      { "source": "import", "id": "<IMPORT_ID>" }
    ],
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }'
```

### Apa yang Kita Lihat di Webset Langsung {#what-we-see-in-the-live-webset}

Seluruh **5 item** muncul di Webset. Tidak ada pemfilteran karena tidak ada kriteria.

| Pemasok      | Ada di Webset? | Source   | Evaluasi | Enrichment | Mengapa?                                       |
| ------------ | -------------- | -------- | -------- | ---------- | ---------------------------------------------- |
| Accenture    | **Ya**         | `import` | 0        | 2          | Diimpor, tidak ada kriteria sebagai pembanding |
| Infosys      | **Ya**         | `import` | 0        | 2          | Diimpor, tidak ada kriteria sebagai pembanding |
| Wipro        | **Ya**         | `import` | 0        | 2          | Diimpor, tidak ada kriteria sebagai pembanding |
| EPAM Systems | **Ya**         | `import` | 0        | 2          | Diimpor, tidak ada kriteria sebagai pembanding |
| Persol Group | **Ya**         | `import` | 0        | 2          | Diimpor, tidak ada kriteria sebagai pembanding |

Setiap item memiliki `source: "import"` dan `evaluations: []`. Kelima item tetap dipertahankan dan di-enrich, terlepas dari apakah mereka akan lolos kriteria apa pun -- karena memang tidak ada kriteria pada config ini.

<Note>
  URL Persol Group (`persol-group.co.jp`) mengarah ke &quot;PERSOL Vietnam Japan Desk&quot; pada data entitas -- sistem tetap mengimpor dan meng-enrich-nya, hanya saja URL tersebut mengarah ke halaman anak perusahaan regional.
</Note>

***

## Config 2: Search Only -- Web Discovery {#config-2-search-only-web-discovery}

<Note>
  **Contoh langsung:** [Lihat webset ini di dashboard](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**Gunakan saat:** Anda tidak punya daftar -- Anda ingin menemukan perusahaan baru dari web yang sesuai dengan kriteria Anda.

### Panggilan API {#api-call}

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

### Apa yang Kita Lihat di Webset Langsung {#what-we-see-in-the-live-webset-2}

Sistem menelusuri web dan menemukan **35 perusahaan** yang memenuhi kedua kriteria. Setiap item memiliki `source: "search"` beserta evaluasi lengkap yang menjelaskan alasan kecocokannya.

| 5 Pemasok Kami         | Ada di Webset? | Mengapa?                                                             |
| ---------------------- | -------------- | -------------------------------------------------------------------- |
| Accenture              | **Ya**         | Web search menemukan Accenture sendiri sebagai perusahaan yang cocok |
| Infosys                | **Tidak**      | Tidak ditemukan oleh web search kali ini                             |
| Wipro                  | **Tidak**      | Tidak ditemukan oleh web search kali ini                             |
| EPAM Systems           | **Tidak**      | Tidak ditemukan oleh web search kali ini                             |
| Persol Group           | **Tidak**      | Tidak ditemukan oleh web search kali ini                             |
| *(34 perusahaan lain)* | **Ya**         | Ditemukan lewat web search, memenuhi kedua kriteria                  |

Web search kebetulan menemukan Accenture di antara 35 hasilnya, tetapi 4 pemasok lainnya tidak ditemukan. Hal ini wajar: webset yang hanya mengandalkan search hanya mengembalikan apa yang ditemukan dari penjelajahan web, bukan daftar yang sudah ditentukan sebelumnya. Contoh perusahaan lain yang ditemukan: Artech, TurnKey Staffing, DataArt, Insight Global, dan lainnya.

***

## Config 3: Scoped Search -- Nilai Daftar Anda Berdasarkan Kriteria {#config-3-scoped-search-score-your-list-against-criteria}

<Note>
  **Contoh langsung:** [Lihat webset ini di dashboard](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**Gunakan saat:** Anda memiliki daftar pemasok dan ingin **menilai masing-masing berdasarkan kriteria**. Hanya yang lolos yang dikembalikan. Inilah kasus penggunaan &quot;nilai daftar saya&quot;.

### Panggilan API {#api-calls-2}

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Buat impor CSV dan unggah seperti pada Config 1, lalu gunakan ID-nya di sini.
  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  // Buat impor CSV dan unggah seperti pada Config 1, lalu gunakan ID-nya di sini.
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        scope: [
          { source: "import", id: "<IMPORT_ID>" }
        ]
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  # Langkah 1: Buat impor CSV dan unggah (sama seperti Config 1, Langkah 1-2)
  # ... (lihat Config 1 untuk alur impor selengkapnya)
  # Anda akan menerima sebuah <IMPORT_ID>

  # Langkah 2: Buat Webset dengan scoped search -- mengevaluasi setiap URL hasil impor terhadap kriteria
  # Impor otomatis dijadwalkan untuk diproses saat Webset dibuat.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

### Apa yang Kita Lihat di Webset Langsung {#what-we-see-in-the-live-webset-3}

Webset ini berisi **4 item**. Masing-masing dari 5 pemasok kita dievaluasi terhadap kriteria -- hanya yang lolos kedua kriteria yang muncul.

| Pemasok      | Ada di Webset?     | Source   | Punya Evaluasi? | Mengapa?                                                                              |
| ------------ | ------------------ | -------- | --------------- | ------------------------------------------------------------------------------------- |
| Accenture    | **Ya**             | `search` | Ya (2)          | Lolos: punya kantor di AS, menyediakan konsultasi TI                                  |
| Infosys      | **Ya**             | `search` | Ya (2)          | Lolos: punya kantor di AS, menyediakan layanan TI                                     |
| Wipro        | **Ya**             | `search` | Ya (2)          | Lolos: punya kantor di AS, menyediakan layanan TI                                     |
| EPAM Systems | **Ya**             | `search` | Ya (2)          | Lolos: tercatat di bursa AS, menyediakan layanan rekayasa perangkat lunak             |
| Persol Group | **Tidak -- gugur** | --       | --              | Gagal pada &quot;punya kantor di Amerika Serikat&quot; -- utamanya berfokus di Jepang |

Kita mengimpor 5 pemasok, tetapi hanya 4 yang muncul di hasil. **Persol Group dievaluasi dan tidak lolos**, sehingga tersaring keluar. Setiap item yang tampil memiliki `source: "search"` beserta `evaluations` lengkap yang menunjukkan alasan untuk tiap kriteria.

<Warning>
  Item yang tidak memenuhi kriteria akan **dihapus dari hasil**. Jika Anda perlu mempertahankan semua item dan hanya ingin melihat mana yang lolos/gagal, gunakan Config 1 (Import Only, tanpa pemfilteran) sebagai webset terpisah di samping Config 3.
</Warning>

***

## Config 4: Scoped Search + Web Discovery -- Nilai Daftar Anda DAN Temukan Matches Baru {#config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches}

<Note>
  **Contoh langsung:** [Lihat webset ini di dashboard](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**Gunakan saat:** Anda memiliki daftar pemasok yang ingin dinilai berdasarkan kriteria, tetapi Anda juga ingin menemukan perusahaan lain dari web yang memenuhi kriteria yang sama. Ini adalah proses dua langkah: pertama, buat webset dengan scoped search, lalu tambahkan web search biasa ke webset yang sama.

### Panggilan API {#api-calls-3}

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Buat impor CSV dan unggah seperti yang ditunjukkan pada Config 1, lalu gunakan ID-nya di sini.
  headers = {"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"}
  webset_response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers=headers,
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  webset_response.raise_for_status()
  webset_id = webset_response.json()["id"]

  search_response = requests.post(
      f"https://api.exa.ai/websets/v0/websets/{webset_id}/searches",
      headers=headers,
      json={
          "query": "IT consulting and staff augmentation companies",
          "entity": {"type": "company"},
          "criteria": [
              {"description": "The company has an office in the United States"},
              {
                  "description": "The company provides IT consulting or staff augmentation services"
              },
          ],
          "count": 25,
          "behavior": "append",
      },
  )
  search_response.raise_for_status()
  ```

  ```javascript JavaScript theme={null}
  // Buat impor CSV dan unggah seperti yang ditunjukkan pada Config 1, lalu gunakan ID-nya di sini.
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXA_API_KEY}`
  };
  const websetResponse = await fetch(
    "https://api.exa.ai/websets/v0/websets",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        search: {
          query: "IT consulting and staff augmentation companies",
          entity: { type: "company" },
          criteria: [
            { description: "The company has an office in the United States" },
            {
              description: "The company provides IT consulting or staff augmentation services"
            }
          ],
          count: 25,
          scope: [
            { source: "import", id: "<IMPORT_ID>" }
          ]
        },
        enrichments: [
          {
            description: "What services does this company provide?",
            format: "text"
          },
          { description: "Number of employees", format: "number" }
        ]
      })
    }
  );

  if (!websetResponse.ok) {
    throw new Error(`Webset creation failed: ${websetResponse.status}`);
  }
  const webset = await websetResponse.json();

  const searchResponse = await fetch(
    `https://api.exa.ai/websets/v0/websets/${webset.id}/searches`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        behavior: "append"
      })
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Search creation failed: ${searchResponse.status}`);
  }
  ```

  ```bash cURL theme={null}
  # Langkah 1: Buat impor CSV dan unggah filenya (sama seperti Config 1, Langkah 1-2)
  # ... (lihat Config 1 untuk alur impor lengkapnya)
  # Anda akan menerima <IMPORT_ID>

  # Langkah 2: Buat Webset dengan scoped search -- mengevaluasi setiap URL yang diimpor terhadap kriteria
  # Impor otomatis dijadwalkan untuk diproses saat Webset dibuat.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  # Response berisi `id` webset -- simpan sebagai <WEBSET_ID>

  # Langkah 3: Tunggu scoped search selesai, lalu tambahkan web search untuk menemukan kecocokan baru
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/<WEBSET_ID>/searches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25,
      "behavior": "append"
    }'
  ```
</CodeGroup>

### Yang Kita Lihat di Webset Langsung {#what-we-see-in-the-live-webset-4}

Webset ini berisi **29 item** -- 4 dari pemasok yang kita impor (sudah dinilai dan lolos) ditambah 25 perusahaan hasil penemuan web. Kedua kelompok dievaluasi terhadap kriteria.

| Pemasok                              | Ada di Webset?     | Source   | Punya Evaluasi? | Mengapa?                                                                         |
| ------------------------------------ | ------------------ | -------- | --------------- | -------------------------------------------------------------------------------- |
| Accenture                            | **Ya**             | `search` | Ya (2)          | Lolos scoped search: punya kantor di AS, menyediakan konsultasi TI               |
| Infosys                              | **Ya**             | `search` | Ya (2)          | Lolos scoped search: punya kantor di AS, menyediakan layanan TI                  |
| Wipro                                | **Ya**             | `search` | Ya (2)          | Lolos scoped search: punya kantor di AS, menyediakan layanan TI                  |
| EPAM Systems                         | **Ya**             | `search` | Ya (2)          | Lolos scoped search: terdaftar di bursa AS, menyediakan rekayasa perangkat lunak |
| Persol Group                         | **Tidak -- gugur** | --       | --              | Gagal scoped search: tidak punya kantor di AS                                    |
| *(25 perusahaan hasil penemuan web)* | **Ya**             | `search` | Ya (2 per item) | Ditemukan lewat web search, lolos kedua kriteria                                 |

Scoped search mengevaluasi daftar impor Anda terhadap kriteria (sehingga Persol Group gugur), lalu web search yang ditambahkan menemukan 25 perusahaan baru. Hasilnya adalah satu webset yang memuat impor Anda yang sudah dinilai sekaligus temuan baru dari web.

<Note>
  Web search menggunakan `"behavior": "append"` sehingga hasilnya ditambahkan ke hasil yang sudah ada, bukan menggantikannya. Jika web search menemukan perusahaan yang sudah ada dalam hasil scoped search (misalnya Accenture), duplikatnya ditangani secara otomatis.
</Note>

***

## Referensi Singkat {#quick-reference}

| Konfigurasi                          | Fungsinya                                | Semua item dipertahankan?         | Item dinilai?                                        |
| ------------------------------------ | ---------------------------------------- | --------------------------------- | ---------------------------------------------------- |
| **1. Import Only**                   | Enrich daftar Anda                       | Ya -- semua dipertahankan         | Tidak                                                |
| **2. Search Only**                   | Temukan matches baru dari web            | Tidak berlaku (tanpa impor)       | Ya -- hanya item yang lolos yang dikembalikan        |
| **3. Scoped Search**                 | Nilai daftar Anda terhadap kriteria      | Tidak -- item yang gagal dibuang  | Ya                                                   |
| **4. Scoped Search + Web Discovery** | Nilai daftar Anda + temukan matches baru | Tidak -- impor yang gagal dibuang | Ya -- impor maupun hasil discovery sama-sama dinilai |

## Config Mana yang Sebaiknya Saya Gunakan? {#which-config-should-i-use}

* **&quot;Saya hanya ingin meng-enrich daftar saya, tanpa pemfilteran&quot;** -- Config 1
* **&quot;Saya belum punya daftar, carikan perusahaan untuk saya&quot;** -- Config 2
* **&quot;Nilai daftar saya, buang yang tidak cocok&quot;** -- Config 3
* **&quot;Nilai daftar saya DAN temukan perusahaan baru yang cocok&quot;** -- Config 4