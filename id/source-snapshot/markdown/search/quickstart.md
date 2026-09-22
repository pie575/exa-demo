> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Exa Search API {#exa-search-api}

> Cari di web dengan bahasa alami dan dapatkan konten halaman yang bersih dan relevan dalam satu permintaan.

Exa Search menerima query dalam bahasa alami dan mengembalikan hasil web yang sudah diperingkat beserta konten halamannya yang bersih.

## Buat permintaan pertama Anda {#make-your-first-request}

Mulailah dengan `query` dalam bahasa alami dan `contents: { highlights: true }`, yang mengembalikan kutipan dengan panjang menyesuaikan relevance tiap hasil. Field lain mengatur cara Exa melakukan pencarian dan apa saja yang disertakan pada setiap hasil; bagian selanjutnya dari halaman ini membahas field yang benar-benar akan Anda gunakan.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "recent techniques for improving retrieval in RAG systems",
      type="auto",
      contents={"highlights": True},
  )

  for item in result.results:
      print(item.title, item.url)
      print(item.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "recent techniques for improving retrieval in RAG systems",
    {
      type: "auto",
      contents: { highlights: true }
    }
  );

  for (const item of result.results) {
    console.log(item.title, item.url);
    console.log(item.highlights);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "recent techniques for improving retrieval in RAG systems",
      "type": "auto",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Secara default, Search mengembalikan maksimal 10 hasil. Atur `numResults` untuk meminta hingga 100 hasil; jumlah yang dikembalikan bisa lebih sedikit jika halaman relevan yang tersedia memang terbatas. Search tidak mendukung penomoran halaman.

<Accordion title="Contoh response">
  Kutipan dan daftar di bawah ini dipersingkat.

  ```json theme={null}
  {
    "requestId": "c3174df2b9cd5afbc64cdf79f3719b19",
    "resolvedSearchType": "",
    "results": [
      {
        "id": "https://arxiv.org/html/2608.21702",
        "title": "From Association to Causation: Improving Retrieval Precision ofRetrieval-Augmented Generation via Causal Relations and an Attention Mechanism",
        "url": "https://arxiv.org/html/2608.21702",
        "highlights": [
          "Retrieval-Augmented Generation (RAG) grounds LLM generation on retrieved documents, but the standard terminal retrieval stage—dense-vector similarity, optionally followed by reranking—often returns documents that merely share keywords with the query without containing the needed information...\n..."
        ],
        "image": "https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg",
        "favicon": "https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png"
      },
      {
        "id": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "title": "Four retrieval techniques to improve RAG you need to know",
        "url": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "publishedDate": "2025-04-14T00:00:00.000Z",
        "highlights": [
          "It's not surprising, then, that we've seen a range of different approaches emerge that attempt to address RAG's limitations over the last year or so.\n..."
        ],
        "image": "https://www.thoughtworks.com/content/dam/thoughtworks/images/illustration/brand/tw_illustration_5.jpg"
      }
    ],
    "searchTime": 1324.3,
    "costDollars": {
      "total": 0.007,
      "search": {
        "neural": 0.007
      }
    }
  }
  ```
</Accordion>

Hasil diurutkan berdasarkan relevance. Setiap hasil menyertakan metadata seperti judul, URL, dan tanggal publikasi, ditambah apa pun yang Anda minta melalui `contents`.

## Menulis query {#writing-queries}

Field `query` adalah satu-satunya field yang wajib diisi saat menggunakan Search API.

Tulis query dalam bahasa alami. Sertakan subjeknya dan, bila perlu, jenis sumber serta rentang waktu yang Anda inginkan.

Query boleh bersifat luas dan eksploratif. `"Latest news on EU battery policy"` memberi Exa maksud yang cukup untuk menemukan halaman yang relevan, sedangkan `"news"` tidak. Jika jenis sumber menjadi hal yang penting, sebutkan dalam query:

```text theme={null}
Artikel teknis terbaru yang membandingkan retrieval hibrida dan semantik untuk sistem RAG
```

Lihat [What&#39;s in Exa&#39;s Index](/id/docs/search/data/overview) untuk mengetahui isi indeks Exa dan cara melakukan search pada tipe konten tersebut.

<h2 id="search-types">
  Memilih search type
</h2>

`type` menentukan search mode, yang masing-masing disetel untuk keseimbangan kecepatan, kedalaman search, dan synthesis yang berbeda. `auto` adalah default dan cocok untuk sebagian besar searches.

| Type             | Gunakan saat                                                                 |
| ---------------- | ---------------------------------------------------------------------------- |
| `auto`           | Anda menginginkan keseimbangan default terbaik antara kualitas dan kecepatan |
| `fast`           | Permintaan sensitif terhadap latency                                         |
| `instant`        | Permintaan berada di jalur real-time seperti autocomplete atau suara         |
| `deep-lite`      | Tugas membutuhkan research dan synthesis ringan                              |
| `deep`           | Tugas memerlukan search multi-langkah dan synthesis yang lebih kuat          |
| `deep-reasoning` | Kelengkapan dan kedalaman penalaran lebih penting daripada latency           |

Mode deep menjalankan proses research, bukan sekadar satu tahap retrieval. Lihat [Deep Search](/id/docs/search/deep-search) untuk memahami cara kerja proses tersebut dan cara menggunakan kontrol tambahannya.

<Tip>
  Alih-alih `deep-reasoning`, gunakan [Exa Agent](/id/docs/agent/quickstart) untuk research jangka panjang, list building
  daftar, dan enrichment multi-langkah. Agent memiliki komputasi lebih besar per run dan mengembalikan hasil
  terstruktur yang grounded.
</Tip>

## Bentuk keluaran {#output-shapes}

Setiap hasil menyertakan metadata seperti judul, URL, dan tanggal publikasinya. Gunakan `contents` untuk menambahkan kutipan, teks penuh, atau ringkasan dari halaman tersebut.

<Tabs>
  <Tab title="Kutipan">
    Kutipan mengembalikan bagian yang paling relevan dengan query Anda. Kutipan memberi model dan agent
    evidence yang dibutuhkan tanpa memenuhi jendela konteks dengan bagian halaman yang tidak relevan.

    Ini adalah bentuk keluaran yang direkomendasikan untuk sebagian besar tugas.

    Mulailah dengan `highlights: true` saja. Exa menggunakan query untuk memilih jumlah konten yang
    sesuai dari setiap hasil.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "How are inference providers reducing transformer latency?",
          contents={"highlights": True},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "How are inference providers reducing transformer latency?",
        { contents: { highlights: true } }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "How are inference providers reducing transformer latency?",
          "contents": { "highlights": true }
        }'
      ```
    </CodeGroup>

    Lihat [Highlights](/id/docs/search/highlights) untuk Dynamic Highlights dan instruksi tentang kapan sebaiknya fitur ini diaktifkan.
  </Tab>

  <Tab title="Teks penuh">
    Teks penuh mengembalikan isi halaman yang sudah bersih. Gunakan ini bila tugas bergantung pada konteks yang lebih luas,
    struktur dokumen, atau detail yang mungkin berada di luar kutipan yang berfokus pada query.

    Halaman penuh bisa berukuran besar. Batasi jumlah hasil sekaligus teks yang dikembalikan per halaman.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "Technical postmortems of large-scale inference outages",
          num_results=5,
          contents={"text": {"max_characters": 10000}},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "Technical postmortems of large-scale inference outages",
        {
          numResults: 5,
          contents: { text: { maxCharacters: 10000 } }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "Technical postmortems of large-scale inference outages",
          "numResults": 5,
          "contents": {
            "text": { "maxCharacters": 10000 }
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

Pilih satu content view per permintaan. Meminta highlights dan text sekaligus akan mengembalikan sekaligus menagih dua tampilan dari halaman yang sama. `summary` adalah opsi ketiga, tetapi opsi ini menambah satu panggilan model bahasa untuk setiap hasil.

<Warning>
  `/search` dan `/contents` menerima content options yang sama, tetapi di tempat yang berbeda:

  * **`/search`** menempatkan `highlights`, `text`, dan `summary` di dalam objek `contents`:
    `"contents": { "highlights": true }`
  * **`/contents`** tidak memiliki wrapper `contents`. Body-nya adalah content options itu sendiri, sehingga
    field yang sama berada di tingkat teratas, bersebelahan dengan `urls`: `"urls": [...], "highlights": true`
</Warning>

## Output schema {#output-schema}

Tambahkan `outputSchema` jika Anda ingin Exa mensintesis hasil search. Parameter ini berfungsi dengan semua search type dan menambahkan objek `output` ke response.

Halaman yang telah diberi peringkat tetap berada di `results`. Nilai yang dihasilkan dikembalikan pada `output.content`, beserta sources dan confidence per field di `output.grounding`.

<Tabs>
  <Tab title="Teks Bebas">
    Gunakan `type: "text"` untuk prosa yang dihasilkan. Tambahkan `description` untuk menentukan format atau panjangnya.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "What changed in the latest EU battery policy?",
          output_schema={
              "type": "text",
              "description": "Summarize the changes in three concise bullets",
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "What changed in the latest EU battery policy?",
        {
          outputSchema: {
            type: "text",
            description: "Summarize the changes in three concise bullets"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "What changed in the latest EU battery policy?",
          "outputSchema": {
            "type": "text",
            "description": "Summarize the changes in three concise bullets"
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="JSON Terstruktur">
    Gunakan `type: "object"` untuk JSON yang mengikuti properti dan ketentuan yang Anda tetapkan.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "AI infrastructure companies that announced Series A or B funding in the past six months",
          output_schema={
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "maxItems": 10,
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "round": {"type": "string"},
                              "amount": {"type": "string"},
                              "announcedDate": {
                                  "type": "string",
                                  "description": "The funding announcement date",
                              },
                              "leadInvestors": {
                                  "type": "array",
                                  "items": {"type": "string"},
                              },
                          },
                          "required": ["name", "round", "amount", "announcedDate"],
                      },
                  }
              },
              "required": ["companies"],
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "AI infrastructure companies that announced Series A or B funding in the past six months",
        {
          outputSchema: {
            type: "object",
            properties: {
              companies: {
                type: "array",
                maxItems: 10,
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    round: { type: "string" },
                    amount: { type: "string" },
                    announcedDate: {
                      type: "string",
                      description: "The funding announcement date"
                    },
                    leadInvestors: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            required: ["companies"]
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "AI infrastructure companies that announced Series A or B funding in the past six months",
          "outputSchema": {
            "type": "object",
            "properties": {
              "companies": {
                "type": "array",
                "maxItems": 10,
                "items": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "round": { "type": "string" },
                    "amount": { "type": "string" },
                    "announcedDate": {
                      "type": "string",
                      "description": "The funding announcement date"
                    },
                    "leadInvestors": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            "required": ["companies"]
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

Gunakan `systemPrompt` untuk instruksi seperti source preferences atau penekanan tertentu; gunakan `outputSchema` untuk menentukan bentuk response. Python menggunakan `system_prompt` dan `output_schema`.

<Note>
  Buat schema objek tetap sederhana: schema mendukung hingga 2 tingkat nesting dan 10 properti. Jangan menambahkan
  field citation atau confidence ke dalam schema; Exa mengembalikannya secara otomatis di `output.grounding`.
</Note>

## Memfilter hasil {#filter-results}

Filter adalah batasan ketat: gunakan filter jika hasil di luar batasan tersebut tidak berguna bagi Anda, dan cukup nyatakan preferensi sumber yang lebih longgar di dalam teks query. [API reference](/id/docs/reference/search) memuat daftar lengkapnya.

### Menyertakan domain atau path {#include-domains-or-paths}

`includeDomains` membatasi hasil hanya pada sources yang Anda percaya. Parameter ini menerima domain lengkap, prefiks path seperti `anthropic.com/news`, dan wildcard subdomain seperti `*.substack.com`.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "new model releases",
      include_domains=["openai.com", "anthropic.com/news"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("new model releases", {
    includeDomains: ["openai.com", "anthropic.com/news"],
    contents: { highlights: true }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "new model releases",
      "includeDomains": ["openai.com", "anthropic.com/news"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Cantumkan path di dalam filter, bukan mengulanginya sebagai operator `site:` pada query.

### Kecualikan domain atau path {#exclude-domains-or-paths}

`excludeDomains` menghapus hasil dari domain atau path tertentu. Parameter ini mendukung prefiks path dan wildcard subdomain yang sama seperti `includeDomains`. Gunakan parameter ini jika sources tersebut membuat hasil menjadi tidak berguna, bukan sekadar untuk menyatakan preferensi.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "primary research on retrieval-augmented generation benchmarks",
      exclude_domains=["medium.com", "dev.to"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "primary research on retrieval-augmented generation benchmarks",
    {
      excludeDomains: ["medium.com", "dev.to"],
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "primary research on retrieval-augmented generation benchmarks",
      "excludeDomains": ["medium.com", "dev.to"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

## Kebaruan konten {#content-freshness}

`contents.maxAgeHours` mengatur seberapa baru konten yang diekstraksi dari setiap hasil. Field ini tidak memfilter hasil berdasarkan tanggal publikasi.

| Nilai                  | Perilaku                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Tidak diisi            | Gunakan konten cache jika tersedia dan ambil halaman bila diperlukan                |
| Bilangan bulat positif | Gunakan konten cache jika usianya kurang dari sekian jam; jika tidak, ambil halaman |
| `0`                    | Selalu ambil konten terbaru                                                         |
| `-1`                   | Hanya gunakan konten cache                                                          |

Sebagian besar pencarian sebaiknya tidak menggunakan field ini. Gunakan field ini bila konten halaman yang usang tidak akan berguna, misalnya untuk harga, ketersediaan, atau halaman yang sering berubah.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "current pricing for serverless GPU providers",
      contents={
          "highlights": True,
          "max_age_hours": 24,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("current pricing for serverless GPU providers", {
    contents: {
      highlights: true,
      maxAgeHours: 24
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "current pricing for serverless GPU providers",
      "contents": {
        "highlights": true,
        "maxAgeHours": 24
      }
    }'
  ```
</CodeGroup>

## Langkah selanjutnya {#next-steps}

<Columns cols={2}>
  <Card title="Praktik terbaik" icon="sparkles" href="/id/docs/search/best-practices" cta="Baca panduan" arrow="true">
    Anggaran token, kebaruan content, output terstruktur, dan system prompt.
  </Card>

  <Card title="API reference" icon="square-terminal" href="/id/docs/reference/search" cta="Buka referensi" arrow="true">
    Setiap parameter permintaan dan field response, lengkap dengan playground interaktif.
  </Card>

  <Card title="Contents" icon="file-text" href="/id/docs/contents/quickstart" cta="Buka panduan" arrow="true">
    Anda sudah punya URL-nya dan ingin mendapatkan teks bersih, kutipan, atau ringkasan.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan" arrow="true">
    Anda membutuhkan Research jangka panjang, list building, atau enrichment.
  </Card>
</Columns>