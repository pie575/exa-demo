> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="deep-search">
  # Deep Search
</div>

> Gunakan search iteratif, penalaran, dan sintesis yang grounded untuk tugas riset yang kompleks.

Deep Search adalah mode riset dari Search API. Mode ini menggunakan endpoint `/search` yang sama, tetapi proses retrieval-nya dapat menjalankan beberapa search, memeriksa evidence, menyempurnakan pendekatannya, dan menyintesis hasil yang grounded.

Gunakan Search standar jika Anda memerlukan halaman yang sudah diperingkat untuk query yang terumuskan dengan baik. Gunakan Deep jika menemukan jawabannya memerlukan riset.

<div id="how-deep-search-works">
  ## Cara kerja Deep Search
</div>

Deep Search menambahkan loop riset sebelum respons akhir:

<Steps>
  <Step title="Rencanakan pencarian">
    Exa berangkat dari `query` Anda dan dapat memperluasnya menjadi beberapa searches yang mencakup
    bagian-bagian berbeda dari permintaan tersebut. Anda dapat memberikan variasi awal melalui `additionalQueries`.
  </Step>

  <Step title="Cari dan periksa">
    Deep mencari evidence, membandingkan temuan dengan permintaan, lalu menentukan hal apa yang sudah
    didukung dan apa yang masih kurang.
  </Step>

  <Step title="Perhalus">
    Ketika evidence belum lengkap atau saling bertentangan, Deep dapat menjalankan search yang lebih
    tertarget alih-alih mengembalikan halaman pertama yang sekadar tampak masuk akal.
  </Step>

  <Step title="Pilih dan sintesis">
    Deep memilih hasil yang relevan lalu menggunakan synthesis path yang sama seperti search types lainnya.
    Saat Anda menyediakan `outputSchema`, respons mencakup `output.content` terstruktur dan
    sitasi tingkat field pada `output.grounding`.
  </Step>
</Steps>

Proses ini sangat berguna untuk daftar dan structured output. Setiap item yang diminta bisa saja memerlukan search yang berbeda, dan Deep dapat mengumpulkan serta memeriksa hasil tersebut sebelum menyusun struktur akhir.

<div id="choose-a-deep-mode">
  ## Memilih mode Deep
</div>

| Tipe             | Gunakan saat                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `deep-lite`      | Anda hanya butuh ekspansi query dan synthesis yang ringan                                      |
| `deep`           | Tugas memerlukan search iteratif, pengumpulan evidence, atau banyak item terstruktur           |
| `deep-reasoning` | Tugas memerlukan penalaran yang lebih cermat atas evidence yang sulit atau saling bertentangan |

Mulailah dengan `deep` untuk workflow riset. Beralihlah ke `deep-lite` bila tugasnya lebih sederhana dan latensi menjadi pertimbangan.

<Tip>
  Alih-alih `deep-reasoning`, gunakan [Exa Agent](/id/docs/agent/quickstart) untuk riset jangka panjang, penyusunan
  daftar, dan enrichment multi-langkah. Agent memiliki daya komputasi lebih besar per run dan mengembalikan hasil terstruktur
  yang grounded.
</Tip>

Lihat [Pricing](/id/docs/admin/pricing#deep-search) untuk panduan cost dan latensi terkini.

<div id="make-a-deep-request">
  ## Membuat permintaan Deep
</div>

Atur `type` pada permintaan Search API biasa:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "Compare how major database vendors support vector, keyword, and hybrid retrieval",
    {
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Deep mengembalikan hasil search yang terpilih di dalam `results`. Tambahkan `outputSchema` jika Anda juga ingin mendapatkan jawaban hasil sintesis atau dataset terstruktur.

<div id="provide-starting-queries">
  ## Sediakan query awal
</div>

Deep biasanya menentukan sendiri searches mana yang dijalankan. Gunakan `additionalQueries` bila Anda sudah mengetahui terminologi, sudut pandang, atau submasalah tertentu yang perlu dicakup oleh riset:

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Compare current approaches to inference-time scaling",
      additional_queries=[
          "inference-time compute scaling benchmark",
          "test-time reasoning methods survey",
          "adaptive compute language models",
      ],
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Compare current approaches to inference-time scaling",
    {
      additionalQueries: [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare current approaches to inference-time scaling",
      "additionalQueries": [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

`query` utama selalu disertakan. Anda dapat memberikan hingga 10 query tambahan, dan daftar ini hanya tersedia untuk search types Deep.

Hindari memberikan parafrase kecil hanya demi menambah volume search. Tambahkan query hanya jika masing-masing membuka arah pencarian yang benar-benar berbeda.

<div id="guide-behavior-and-output-separately">
  ## Arahkan perilaku dan output secara terpisah
</div>

`systemPrompt` dan `outputSchema` memengaruhi bagian permintaan yang berbeda:

* `systemPrompt` mengarahkan preferensi sumber, kebaruan, deduplikasi, dan perilaku riset Deep.
* `outputSchema` menentukan bentuk akhir dan memicu synthesis.

Query sebaiknya menjelaskan apa yang perlu diriset, sedangkan system prompt menjelaskan bagaimana riset tersebut dilakukan dan disajikan.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      type="deep",
      system_prompt="Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 8,
                  "items": {
                      "type": "object",
                      "required": ["name", "round", "amount"],
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "amount": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Find AI infrastructure companies that announced Series A or B funding in the last six months",
    {
      type: "deep",
      systemPrompt:
        "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      outputSchema: {
        type: "object",
        required: ["companies"],
        properties: {
          companies: {
            type: "array",
            maxItems: 8,
            items: {
              type: "object",
              required: ["name", "round", "amount"],
              properties: {
                name: { type: "string" },
                round: { type: "string" },
                amount: { type: "string" }
              }
            }
          }
        }
      }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      "type": "deep",
      "systemPrompt": "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 8,
            "items": {
              "type": "object",
              "required": ["name", "round", "amount"],
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "amount": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

Pilih Deep jika Anda membutuhkan lebih dari dua item terstruktur atau jika setiap item harus memenuhi beberapa persyaratan sekaligus. Search type standar memakai synthesis path yang sama, tetapi tidak menjalankan riset iteratif seperti itu sebelum synthesis.

<div id="read-the-grounded-response">
  ## Membaca respons yang grounded
</div>

Respons terstruktur memisahkan nilai yang dihasilkan dari evidence pendukungnya:

```json theme={null}
{
  "results": [
    {
      "title": "Acme AI raises $30M Series B",
      "url": "https://acme.example/news/series-b"
    }
  ],
  "output": {
    "content": {
      "companies": [
        {
          "name": "Acme AI",
          "round": "Series B",
          "amount": "$30M"
        }
      ]
    },
    "grounding": [
      {
        "field": "companies[0].amount",
        "citations": [
          {
            "title": "Acme AI raises $30M Series B",
            "url": "https://acme.example/news/series-b"
          }
        ],
        "confidence": "high"
      }
    ]
  }
}
```

Gunakan `output.content` sebagai hasil yang dihasilkan dan `output.grounding` untuk menampilkan atau memverifikasi sumber yang mendukung setiap field. Jangan menambahkan field sitasi atau confidence pada schema Anda sendiri; Exa mengembalikannya secara otomatis.

`numResults` menentukan berapa banyak halaman terpilih yang dikembalikan dalam `results`. Parameter ini tidak menentukan jumlah search yang mungkin dilakukan Deep.

<div id="stream-the-synthesis">
  ## Streaming synthesis
</div>

Atur `stream: true` bersama `outputSchema` untuk menerima output hasil synthesis melalui server-sent events:

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/search",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "query": "Explain the competing technical approaches to long-context retrieval",
          "type": "deep",
          "stream": True,
          "outputSchema": {
              "type": "text",
              "description": "A grounded comparison organized by approach",
          },
      },
      stream=True,
  )
  response.raise_for_status()

  for line in response.iter_lines(decode_unicode=True):
      if line:
          print(line)
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      query: "Explain the competing technical approaches to long-context retrieval",
      type: "deep",
      stream: true,
      outputSchema: {
        type: "text",
        description: "A grounded comparison organized by approach"
      }
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const decoder = new TextDecoder();
  for await (const chunk of response.body) {
    process.stdout.write(decoder.decode(chunk, { stream: true }));
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Explain the competing technical approaches to long-context retrieval",
      "type": "deep",
      "stream": true,
      "outputSchema": {
        "type": "text",
        "description": "A grounded comparison organized by approach"
      }
    }'
  ```
</CodeGroup>

Proses event bertipe tersebut hingga `done`. Event terakhir berisi output yang sudah lengkap dan waktu search, beserta informasi cost jika tersedia.

<div id="when-to-stay-with-standard-search">
  ## Kapan tetap menggunakan Search standar
</div>

Deep tidak diperlukan jika satu kali retrieval sudah cukup untuk memenuhi permintaan:

* Anda membutuhkan halaman yang relevan, bukan kesimpulan hasil riset.
* Query sudah merujuk pada sumber tertentu atau topik yang spesifik.
* Aplikasi Anda melakukan penalaran sendiri dan hanya membutuhkan retrieval.
* Permintaan berjalan di jalur interaktif, pelengkapan otomatis, atau suara.

Gunakan `auto` untuk keseimbangan kualitas dan kecepatan secara bawaan, atau `fast` dan `instant` untuk kebutuhan latensi yang terukur.

<Columns cols={2}>
  <Card title="Panduan Search API" icon="search" href="/id/docs/search/quickstart" cta="Tinjau Search" arrow="true">
    Susun permintaan, pilih konten hasil, dan terapkan filter.
  </Card>

  <Card title="Praktik terbaik Search" icon="sliders-horizontal" href="/id/docs/search/best-practices" cta="Setel retrieval" arrow="true">
    Tingkatkan kualitas, konteks, latensi, dan integrasi agent.
  </Card>

  <Card title="Search API reference" icon="square-terminal" href="/id/docs/reference/search" cta="Buka referensi" arrow="true">
    Lihat semua parameter permintaan dan field respons.
  </Card>

  <Card title="Harga" icon="credit-card" href="/id/docs/admin/pricing#deep-search" cta="Bandingkan mode" arrow="true">
    Tinjau cost dan latensi Deep Search saat ini.
  </Card>
</Columns>