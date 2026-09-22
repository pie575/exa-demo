> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Exa Agent {#exa-agent}

> Jalankan workflow deep research, list building, dan enrichment yang mengembalikan terstruktur output.

Exa Agent adalah endpoint asinkron berbasis penggunaan untuk tugas dengan komputasi berat seperti list building, enrichment, dan deep research. Endpoint ini menangani penalaran kompleks dan dapat mengembalikan banyak field terstruktur output.

Anggap saja sebagai agent konteks: Anda menjelaskan data yang Anda inginkan beserta bentuk hasil yang diharapkan, lalu Exa Agent mengorkestrasi tool call yang diperlukan untuk mendapatkannya. Satu run dapat menyebar menjadi banyak search dari berbagai sudut pandang, membaca dan meringkas halaman di baliknya, memecah list building menjadi subtugas yang berjalan paralel, memverifikasi setiap kandidat terhadap kriteria Anda, meng-enrich kontak, serta melakukan query ke data partners [Exa Connect](/id/docs/agent/connect/overview) mana pun yang Anda attach. Konteks yang sudah dirangkai dikembalikan sebagai satu hasil terstruktur dan grounded, tanpa perlu mengorkestrasi sendiri setiap panggilan `/search` dan `/contents`.

Setiap run dapat mengembalikan jawaban dalam bahasa alami, JSON yang tervalidasi schema, grounding di tingkat field, metadata, dan rincian cost. Anda dapat mengambil run yang telah selesai di kemudian hari, menampilkan daftar run sebelumnya, melakukan replay events, atau melanjutkan dari run sebelumnya.

<Tip>
  Lebih suka MCP? Exa Agent dan [Exa Connect](/id/docs/agent/connect/overview) tersedia di [Exa MCP](/id/docs/get-started/exa-mcp#exa-agent). Aktifkan `tools=agent_run` untuk menjalankan research multi-langkah, list building, enrichment, dan terstruktur output dari Claude, Cursor, dan MCP clients lainnya.
</Tip>

## Kapan menggunakan Exa Agent {#when-to-use-exa-agent}

Gunakan Exa Agent ketika sebuah workflow membutuhkan lebih dari satu search atau extraction call, atau ketika Anda harus menulis sendiri loop berisi searches, pembacaan halaman, dan langkah verifikasi untuk menyusun data:

* Membangun daftar dari kriteria terbuka, lalu enrich setiap hasil
* Meneliti entitas pada banyak fields lengkap dengan sitasi
* Menjalankan tugas multi-hop seperti &quot;temukan perusahaan, lalu temukan pengambil keputusannya&quot;
* Menghasilkan JSON terstruktur dari tugas Research web yang berjalan lama
* Menggabungkan Research web dengan data partners premium dalam satu grounded answer
* Melanjutkan run sebelumnya dengan follow-up permintaan seperti &quot;temukan 10 hasil lagi&quot;

Exa Agent memang dirancang bersifat async dengan latency yang lebih tinggi. Untuk satu search dengan latency rendah di mana Anda mengorkestrasi calls sendiri, mulailah dengan [Search API](/id/docs/search/quickstart).

## Quickstart {#quickstart}

Contoh ini memulai sebuah run yang menyusun daftar orang terstruktur sesuai kriteria Anda. Hasilnya dikembalikan dalam bentuk JSON di `output.structured`.

### 1. Instal SDK Exa {#1-install-the-exa-sdk}

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

### 2. Atur API key Anda {#2-set-your-api-key}

<Tabs>
  <Tab title="macOS/Linux">
    ```bash theme={null}
    export EXA_API_KEY="your-api-key"
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell theme={null}
    setx EXA_API_KEY "your-api-key"
    ```
  </Tab>
</Tabs>

### 3. Buat run {#3-create-a-run}

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      output_schema={
          "type": "object",
          "properties": {
              "people": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "job_title": {"type": "string"},
                          "linkedin_url": {"type": "string", "format": "uri"},
                      },
                      "required": ["name", "job_title", "linkedin_url"],
                  },
              }
          },
          "required": ["people"],
      },
      effort="auto",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
    outputSchema: {
      type: "object",
      properties: {
        people: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              job_title: { type: "string" },
              linkedin_url: { type: "string", format: "uri" }
            },
            required: ["name", "job_title", "linkedin_url"]
          }
        }
      },
      required: ["people"]
    },
    effort: "auto"
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "people": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "job_title": { "type": "string" },
                "linkedin_url": { "type": "string", "format": "uri" }
              },
              "required": ["name", "job_title", "linkedin_url"]
            }
          }
        },
        "required": ["people"]
      }
    }'
  ```
</CodeGroup>

Tambahkan `Accept: text/event-stream` saat membuat run untuk menerima server-sent events ketika run masuk antrean (queued), dimulai, dan selesai. Lihat [Stream events](#stream-events) untuk detail selengkapnya.

### 4. Poll hingga selesai {#4-poll-for-completion}

Jika Anda tidak melakukan streaming events, simpan `id` yang dikembalikan lalu poll run tersebut hingga mencapai status terminal.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run_id = "agent_run_01j..."
  run = exa.agent.runs.poll_until_finished(
      run_id,
      poll_interval=4000,
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const runId = "agent_run_01j...";
  const run = await exa.agent.runs.pollUntilFinished(runId, {
    pollInterval: 4000
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  RUN_ID="agent_run_01j..."

  while true; do
    RUN_JSON="$(curl -s "https://api.exa.ai/agent/runs/$RUN_ID" \
      -H "Authorization: Bearer $EXA_API_KEY")"

    STATUS="$(echo "$RUN_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["status"])')"
    echo "status=$STATUS"

    if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ] || [ "$STATUS" = "cancelled" ]; then
      echo "$RUN_JSON"
      break
    fi

    sleep 4
  done
  ```
</CodeGroup>

Runs yang telah selesai berisi:

* `output.text`: jawaban dalam bahasa alami
* `output.structured`: JSON tervalidasi bila Anda menyediakan `outputSchema`
* `output.grounding`: sitasi untuk teks atau fields terstruktur, bila dihasilkan
* `costDollars`: rincian cost dari run tersebut

<Note>
  Exa Agent juga tersedia melalui Responses API yang kompatibel dengan OpenAI. Arahkan
  SDK OpenAI ke `https://api.exa.ai`, gunakan `model: "exa-agent"`, lalu pilih
  eksekusi synchronous, streaming, atau background. Lihat [kompatibilitas SDK
  OpenAI](/id/docs/integrations/openai-sdk#agent-via-responses-api).
</Note>

## Verifikasi dan enrich entitas tertentu {#verify-and-enrich-a-specific-entity}

Selain list building, gunakan Exa Agent untuk menelaah satu entitas yang sudah diketahui, memverifikasi sebuah klaim terhadap sources tepercaya, dan mengembalikan enrichment terstruktur. Contoh ini memeriksa apakah situs web resmi sebuah perusahaan memiliki halaman pricing yang dapat diakses publik, lalu meng-enrich hasil dengan detail pricing bila tersedia. Schema hanya mewajibkan `domain` dan `verdict`; selebihnya merupakan enrichment opsional.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
      system_prompt="Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
      effort="low",
      output_schema={
          "type": "object",
          "additionalProperties": False,
          "required": ["domain", "verdict"],
          "properties": {
              "domain": {"type": "string", "const": "redbarnrobotics.com"},
              "verdict": {
                  "type": "string",
                  "enum": ["present", "absent", "cannot_verify"],
              },
              "pricing_page_url": {"type": ["string", "null"], "format": "uri"},
              "displays_numeric_prices": {"type": ["boolean", "null"]},
              "pricing_model": {
                  "type": ["string", "null"],
                  "enum": [
                      "free",
                      "subscription",
                      "usage_based",
                      "one_time",
                      "custom_quote",
                      "mixed",
                      "other",
                      None,
                  ],
              },
              "starting_price": {"type": ["number", "null"], "minimum": 0},
              "currency": {
                  "type": ["string", "null"],
                  "description": "ISO 4217 code such as USD or EUR.",
              },
              "billing_period": {
                  "type": ["string", "null"],
                  "enum": [
                      "monthly",
                      "annual",
                      "one_time",
                      "usage_based",
                      "variable",
                      "other",
                      None,
                  ],
              },
              "has_free_plan": {"type": ["boolean", "null"]},
              "has_free_trial": {"type": ["boolean", "null"]},
              "reasoning": {"type": ["string", "null"], "maxLength": 300},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
    systemPrompt:
      "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
    effort: "low",
    outputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["domain", "verdict"],
      properties: {
        domain: { type: "string", const: "redbarnrobotics.com" },
        verdict: {
          type: "string",
          enum: ["present", "absent", "cannot_verify"]
        },
        pricing_page_url: { type: ["string", "null"], format: "uri" },
        displays_numeric_prices: { type: ["boolean", "null"] },
        pricing_model: {
          type: ["string", "null"],
          enum: [
            "free",
            "subscription",
            "usage_based",
            "one_time",
            "custom_quote",
            "mixed",
            "other",
            null
          ]
        },
        starting_price: { type: ["number", "null"], minimum: 0 },
        currency: {
          type: ["string", "null"],
          description: "ISO 4217 code such as USD or EUR."
        },
        billing_period: {
          type: ["string", "null"],
          enum: [
            "monthly",
            "annual",
            "one_time",
            "usage_based",
            "variable",
            "other",
            null
          ]
        },
        has_free_plan: { type: ["boolean", "null"] },
        has_free_trial: { type: ["boolean", "null"] },
        reasoning: { type: ["string", "null"], maxLength: 300 }
      }
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says '"'"'Contact sales'"'"'.",
      "systemPrompt": "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company'"'"'s official website as evidence.",
      "effort": "low",
      "outputSchema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["domain", "verdict"],
        "properties": {
          "domain": { "type": "string", "const": "redbarnrobotics.com" },
          "verdict": {
            "type": "string",
            "enum": ["present", "absent", "cannot_verify"]
          },
          "pricing_page_url": { "type": ["string", "null"], "format": "uri" },
          "displays_numeric_prices": { "type": ["boolean", "null"] },
          "pricing_model": {
            "type": ["string", "null"],
            "enum": ["free", "subscription", "usage_based", "one_time", "custom_quote", "mixed", "other", null]
          },
          "starting_price": { "type": ["number", "null"], "minimum": 0 },
          "currency": {
            "type": ["string", "null"],
            "description": "ISO 4217 code such as USD or EUR."
          },
          "billing_period": {
            "type": ["string", "null"],
            "enum": ["monthly", "annual", "one_time", "usage_based", "variable", "other", null]
          },
          "has_free_plan": { "type": ["boolean", "null"] },
          "has_free_trial": { "type": ["boolean", "null"] },
          "reasoning": { "type": ["string", "null"], "maxLength": 300 }
        }
      }
    }'
  ```
</CodeGroup>

<Note>
  Schema untuk workflow verifikasi sebaiknya memperhitungkan ketidakpastian. Jadikan
  field yang mungkin tidak dapat diverifikasi bersifat nullable dan jangan sertakan dalam `required`,
  sehingga agent dapat mengembalikan `null` alih-alih mengarang nilai. Enum `verdict`
  membedakan pemeriksaan yang gagal (`cannot_verify`) dari bukti negatif
  yang sebenarnya (`absent`): situs yang tidak dapat dijangkau bukan bukti bahwa
  halaman tersebut tidak ada.
</Note>

## Stream events {#stream-events}

Streaming membuat permintaan create tetap terbuka dan mengirimkan Server-Sent Events (SSE) sampai run selesai. Lihat [Event format](#event-format) untuk jenis event dan payload-nya.

Setel `stream=True` di Python, `stream: true` di JavaScript, atau kirim `Accept: text/event-stream` melalui HTTP:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  events = exa.agent.runs.create(
      query="Find five recently launched developer tools for evaluating AI agents.",
      stream=True,
  )

  for event in events:
      print(event.event, event.data)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const events = await exa.agent.runs.create({
    query: "Find five recently launched developer tools for evaluating AI agents.",
    stream: true
  });

  for await (const event of events) {
    console.log(event.event, event.data);
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find five recently launched developer tools for evaluating AI agents."
    }'
  ```
</CodeGroup>

### Format event {#event-format}

Setiap frame SSE berisi ID event, nama event, dan payload JSON:

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

Stream juga dapat berisi baris komentar seperti `: keep-alive`. Client SSE mengabaikan komentar secara otomatis; parser kustom sebaiknya melakukan hal yang sama.

### Jenis event {#event-types}

| Event                 | `data` payload                        | Cara menggunakannya                                                                                                |
| --------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `agent_run.created`   | `{ id, status: "queued", createdAt }` | Simpan ID run segera setelah permintaan diterima.                                                                  |
| `agent_run.started`   | `{ id, status: "running" }`           | Tandai run sebagai sedang diproses.                                                                                |
| `agent_run.completed` | Objek Agent run yang telah selesai    | Baca jawaban akhir dari `data.output.text` atau `data.output.structured`, dan sitasi dari `data.output.grounding`. |
| `agent_run.failed`    | `{ id, status: "failed", error }`     | Tampilkan `error.code` dan `error.message`; tidak ada output akhir yang tersedia.                                  |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`    | Hentikan pembacaan stream dan tangani run sebagai dibatalkan.                                                      |

Event yang terkait dengan langkah research yang sama menyertakan `callId`, yang sesuai dengan `item.call_id` pada event progres tool. Gunakan nilai ini untuk mengelompokkan jejak search, sources, dan progres tool. Sebagian deskripsi jejak search dihasilkan secara asinkron dan bisa tiba setelah event source atau tool yang dijelaskannya, jadi jangan mengaitkannya hanya berdasarkan urutan kedatangan.

Perlakukan `agent_run.source.added` sebagai pratinjau langsung, bukan daftar sitasi yang lengkap. `output.grounding` pada run terminal adalah output grounding yang otoritatif.

### Replay event tersimpan {#replay-stored-events}

Untuk run non-ZDR, [`GET /agent/runs/{id}/events`](/id/docs/reference/agent-api/list-run-events) mengembalikan event tersimpan dalam bentuk JSON berhalaman. Kirim `Accept: text/event-stream` untuk melakukan replay event tersimpan sebagai SSE, dan `Last-Event-ID` untuk melewati event yang sudah diproses oleh client Anda:

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

Endpoint replay mengirimkan events yang tersimpan pada saat permintaan dibuat, lalu menutup koneksi; endpoint ini tidak terus mengikuti run yang sedang berjalan. Run ZDR tidak menyimpan events sehingga tidak dapat di-replay.

Demi kompatibilitas ke depan, abaikan nama event yang tidak dikenali aplikasi Anda dan lanjutkan hingga event terminal diterima.

## Mengembalikan JSON terstruktur {#return-structured-json}

Gunakan `outputSchema` untuk mengembalikan JSON yang tervalidasi terhadap schema di `output.structured`.

`outputSchema` mendukung [spesifikasi JSON Schema](https://json-schema.org/).

Untuk meminta informasi kontak, jelaskan field kontak yang diinginkan di `outputSchema`. Gunakan bentuk JSON Schema standar seperti `{ "type": "string", "format": "email" }` untuk alamat email, `{ "type": "string", "format": "phone" }` untuk nomor telepon, dan `{ "type": "string", "format": "uri" }` untuk URL. Batasi ukuran daftar dengan `maxItems` bila memungkinkan agar biaya maksimum contact-enrichment dapat diperkirakan.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      effort="auto",
      output_schema={
          "type": "object",
          "properties": {
              "companies": {
                  "type": "array",
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "website": {"type": "string"},
                      },
                      "required": ["name", "round"],
                  },
              }
          },
          "required": ["companies"],
      },
  )
  run = exa.agent.runs.poll_until_finished(
      run.id,
  )

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
    effort: "auto",
    outputSchema: {
      type: "object",
      properties: {
        companies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              round: { type: "string" },
              website: { type: "string" }
            },
            required: ["name", "round"]
          }
        }
      },
      required: ["companies"]
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "companies": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "website": { "type": "string" }
              },
              "required": ["name", "round"]
            }
          }
        },
        "required": ["companies"]
      }
    }'
  ```
</CodeGroup>

## Memproses baris input {#process-input-rows}

Gunakan `input.data` jika Anda sudah memiliki kumpulan data yang ingin di-enrich. Anda dapat menambahkan lebih banyak field ke setiap entitas data, memunculkan entitas tambahan berdasarkan data yang Anda masukkan, atau keduanya.

Untuk contoh lengkap enrichment baris, lihat [Contoh Agent](/id/docs/agent/examples#enrich-input-rows-code).

## Memproses pengecualian {#process-exclusions}

Gunakan `input.exclusion` untuk mencegah entri tertentu muncul dalam run. Pada contoh di bawah ini, kita ingin mencari 10 hewan paling menggemaskan, tetapi kambing dan panda dikecualikan dari run karena kita sudah tahu betapa menggemaskannya mereka.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find the top 10 cutest animals. Return each animal's common name and a source URL.",
      input={
          "exclusion": [
              {"animal": "goat"},
              {"animal": "panda"},
          ]
      },
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find the top 10 cutest animals. Return each animal's common name and a source URL.",
    input: {
      exclusion: [
        { animal: "goat" },
        { animal: "panda" }
      ]
    }
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find the top 10 cutest animals. Return each animal'"'"'s common name and a source URL.",
      "input": {
        "exclusion": [
          { "animal": "goat" },
          { "animal": "panda" }
        ]
      }
    }'
  ```
</CodeGroup>

## Hubungkan sumber data {#connect-data-sources}

Indeks sudah tersedia di setiap run. Gunakan `dataSources` hanya untuk melakukan attach partner [Exa Connect](/id/docs/agent/connect/overview). Setiap entri memilih satu `provider`. Jika sebuah properti dalam `outputSchema` Anda merujuk ke sumber tertentu (misalnya, &quot;dari Similarweb&quot;), Exa Agent akan memanggil tool provider yang sesuai alih-alih menebak dari halaman web.

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

Lihat [Exa Connect](/id/docs/agent/connect/overview) untuk daftar lengkap data partners, lengkap dengan contoh untuk masing-masing.

## Melanjutkan dari run sebelumnya {#continue-from-a-previous-run}

Gunakan `previousRunId` untuk mengajukan follow-up terhadap response sebelumnya. Setiap follow-up memulai run baru dengan ID tersendiri. `previousRunId` membawa konteks ke run baru; ID tersebut tidak dipakai ulang sebagai ID run baru.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Narrow that list to companies hiring in San Francisco.",
      previous_run_id="agent_run_01j...",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Narrow that list to companies hiring in San Francisco.",
    previousRunId: "agent_run_01j..."
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Narrow that list to companies hiring in San Francisco.",
      "previousRunId": "agent_run_01j..."
    }'
  ```
</CodeGroup>

## Menemukan ID run {#find-a-run-id}

Tampilkan daftar run terbaru dan periksa statusnya:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  runs = exa.agent.runs.list(
      limit=10,
  )

  for run in runs.data:
      query = (run.request or {}).get("query", "")
      print(f"{run.id}\t{run.status}\t{run.created_at}\t{query}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const list = await exa.agent.runs.list({
    limit: 10
  });

  for (const run of list.data) {
    const query = run.request?.query ?? "";
    console.log(`${run.id}\t${run.status}\t${run.createdAt}\t${query}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/agent/runs?limit=10" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

## Harga {#pricing}

Biaya bersifat berbasis penggunaan dan dihitung per komponen:

| Komponen           | Harga             |
| ------------------ | ----------------- |
| Agent Compute Unit | `1 ACU = $0.10`   |
| Tool call search   | `$0.005 / search` |

<Note>
  Contact enrichment terpisah dari komponen harga inti di atas: contact enrichment email seharga `$0.02 / email`, dan contact enrichment nomor telepon seharga `$0.07 / phone number`.
</Note>

`usage.agentComputeUnits` mengukur komputasi model selama keseluruhan run. Kueri yang kompleks, terutama yang memiliki field `input.data` berukuran besar, memerlukan lebih banyak langkah penalaran dan tool call sehingga mengonsumsi lebih banyak ACU.

Lihat [batas Agent](/id/docs/admin/billing#agent-limits) untuk konkurensi dan rate limit.

### Effort {#effort}

Gunakan `effort` untuk memilih tingkat biaya dan penalaran pada setiap run. Nilai yang didukung adalah `minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, dan `max`; nilai default-nya adalah `auto`. Effort tetap memiliki harga per permintaan yang dapat diprediksi, sedangkan `auto` dan `max` (beta) dihitung berdasarkan penggunaan:

| Effort    | Harga                                         |
| --------- | --------------------------------------------- |
| `minimal` | `$0.012 / permintaan`                         |
| `low`     | `$0.025 / permintaan`                         |
| `medium`  | `$0.10 / permintaan`                          |
| `high`    | `$0.50 / permintaan`                          |
| `xhigh`   | `$1.00 / permintaan`                          |
| `auto`    | Terukur; hingga batas default `$5`            |
| `max`     | **Beta**, terukur; hingga batas default `$20` |

<Info>
  Agent Max adalah tingkat effort tertinggi untuk pekerjaan yang lebih mengutamakan
  kelengkapan dan ketelitian daripada latency atau biaya, termasuk list building
  berskala besar, Research mendalam dari banyak sumber, dan kriteria yang sulit
  diverifikasi. Fitur ini berada dalam beta publik: permintaan dengan `effort: "max"`
  harus menyertakan `Exa-Beta: agent-max-effort-2026-07-27`. Header tersebut menerima
  daftar token beta yang dipisahkan koma.
</Info>

`budget.maxCostDollars` adalah batas atas opsional per run untuk `auto` dan `max`. Nilainya menerima `$1`–`$100`; maksimum yang dirilis adalah `$100`, meskipun server dapat mengatur nilai maksimum yang lebih rendah. Batas default-nya adalah `$5` untuk `auto` dan `$20` untuk `max`. Ini adalah batas atas, bukan harga tetap: run yang selesai lebih cepat akan berbiaya lebih murah. Budget tidak diterima untuk effort tetap.

### Memilih mode effort {#choosing-an-effort-mode}

Mode effort tetap cocok ketika Anda menginginkan harga per permintaan yang dapat diprediksi untuk Research standar. Gunakan `auto` untuk pekerjaan dengan scope yang bervariasi seperti list building, di mana jumlah entitas bisa berbeda dari satu permintaan ke permintaan lainnya.

| Effort    | Paling cocok untuk                                                                             | Kompleksitas schema yang disarankan                                       | Ekspektasi runtime                |
| --------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------- |
| `minimal` | Pencarian berbiaya paling rendah, tugas faktual yang sangat sempit, jawaban singkat            | Satu atau dua field, schema dangkal                                       | Termurah, paling tidak menyeluruh |
| `low`     | Pencarian sederhana, tugas faktual yang sempit, jawaban singkat                                | Beberapa field, schema dangkal                                            | Cepat, Research ringan            |
| `medium`  | Titik awal default untuk sebagian besar tugas Research standar                                 | Jumlah field sedang, objek bersarang sederhana                            | Kualitas/runtime seimbang         |
| `high`    | Research yang lebih sulit, lebih banyak sitasi, kelengkapan yang lebih ketat                   | Schema lebih besar atau field yang lebih bernuansa                        | Lebih lambat, lebih menyeluruh    |
| `xhigh`   | Tugas bernilai tinggi yang kelengkapannya lebih penting daripada biaya/latency                 | Schema kompleks, banyak field, verifikasi sulit                           | Effort tetap paling lambat        |
| `auto`    | Pekerjaan dengan scope bervariasi, list building, tingkat kesulitan tugas yang tidak diketahui | Fleksibel; berguna ketika jumlah entitas atau beban kerja belum diketahui | Bervariasi                        |
| `max`     | Research dengan effort tertinggi (beta)                                                        | Schema kompleks, banyak field, verifikasi sulit                           | Berjalan paling lama              |

Mulailah dengan `medium` untuk Research entitas tunggal yang standar. Turunkan ke `low` atau `minimal` ketika biaya dan latency lebih penting daripada kelengkapan. Naikkan ke `high` atau `xhigh` ketika schema output lebih besar, field perlu diverifikasi, atau tugas memerlukan penalaran yang lebih mendalam. Gunakan `auto` ketika Anda belum mengetahui scope-nya sejak awal, misalnya pada list building atau workflow yang mungkin mengembalikan banyak entitas.

Runtime bervariasi tergantung tingkat kesulitan query, kompleksitas schema, dan ketersediaan sumber eksternal. Perlakukan mode effort sebagai tradeoff antara kualitas/biaya/runtime, bukan sebagai jaminan latency yang pasti.

### Menjalankan run dengan effort max {#run-with-max-effort}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.beta.agent.runs.create(
      query="Find all companies building browser automation tools in the United States.",
      effort="max",
      budget={"maxCostDollars": 10},
      betas=["agent-max-effort-2026-07-27"],
  )
  print(run)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.beta.agent.runs.create({
    query: "Find all companies building browser automation tools in the United States.",
    effort: "max",
    budget: { maxCostDollars: 10 },
    betas: ["agent-max-effort-2026-07-27"]
  });
  console.log(run);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: agent-max-effort-2026-07-27" \
    -d '{
      "query": "Find all companies building browser automation tools in the United States.",
      "effort": "max",
      "budget": { "maxCostDollars": 10 }
    }'
  ```
</CodeGroup>

Contoh SDK ini memerlukan versi `exa-py` atau `exa-js` yang mendukung Agent Max.

## Zero Data Retention {#zero-data-retention}

Exa Agent mendukung [Zero Data Retention](/id/docs/admin/security/zero-data-retention) (ZDR). ZDR diaktifkan per Team. [Hubungi kami](mailto:sales@exa.ai) untuk mengaktifkannya pada akun Anda.

Ketika ZDR aktif untuk Team Anda:

* Buat runs dengan streaming (`Accept: text/event-stream`) untuk menerima output secara langsung, atau lakukan poll pada runs asinkron dalam rentang waktu retensi.
* Data run tersedia selama run berjalan dan hingga 10 menit setelah run mencapai status terminal. Setelah rentang waktu tersebut, run tidak dapat diambil lagi.
* `previousRunId` tidak tersedia.
* `dataSources` Exa Connect tidak tersedia; permintaan yang menyertakannya akan mengembalikan error `400`.

## Langkah berikutnya {#next-steps}

<Columns cols={2}>
  <Card title="Apa saja yang ada di indeks" icon="search" href="/id/docs/search/data/overview" cta="Buka panduan" arrow="true">
    Jelajahi sources berita, kode, perusahaan, dan orang di seluruh public web.
  </Card>

  <Card title="Exa Connect" icon="database" href="/id/docs/agent/connect/overview" cta="Buka panduan" arrow="true">
    Attach basis data partner premium ke sebuah run.
  </Card>

  <Card title="Praktik terbaik Agent" icon="lightbulb" href="/id/docs/agent/best-practices" cta="Buka panduan" arrow="true">
    Praktik terbaik penggunaan Exa Agent.
  </Card>

  <Card title="Contoh Agent" icon="code" href="/id/docs/agent/examples" cta="Buka panduan" arrow="true">
    Contoh penggunaan Exa Agent.
  </Card>
</Columns>