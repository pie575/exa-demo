> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-agent">
  # Exa Agent
</div>

> Jalankan workflow deep research, list building, dan enrichment yang mengembalikan structured output.

Exa Agent adalah endpoint asinkron berbasis usage untuk tugas berkomputasi tinggi seperti list building, enrichment, dan deep research. Endpoint ini menangani penalaran kompleks dan dapat mengembalikan banyak field structured output.

Anggap saja sebagai agent konteks: Anda mendeskripsikan data yang Anda inginkan beserta bentuk hasil yang diharapkan, lalu Exa Agent mengatur panggilan tool yang dibutuhkan untuk mewujudkannya. Satu run dapat memecah pekerjaan menjadi banyak search dari berbagai sudut pandang, membaca dan meringkas halaman di baliknya, membagi list building menjadi subtugas yang berjalan paralel, memverifikasi setiap kandidat terhadap criteria Anda, meng-enrich kontak, serta melakukan query ke data partners [Exa Connect](/id/docs/agent/connect/overview) mana pun yang Anda attach. Anda menerima seluruh konteks yang sudah dirangkai sebagai satu hasil terstruktur yang grounded, tanpa perlu mengatur sendiri setiap panggilan `/search` dan `/contents`.

Setiap run dapat mengembalikan jawaban dalam bahasa alami, JSON yang tervalidasi terhadap schema, grounding di tingkat field, metadata, dan rincian cost. Anda dapat mengambil run yang telah selesai di kemudian hari, menampilkan daftar runs sebelumnya, melakukan replay event, atau melanjutkan dari run sebelumnya.

<Tip>
  Lebih suka MCP? Exa Agent dan [Exa Connect](/id/docs/agent/connect/overview) tersedia di [Exa MCP](/id/docs/get-started/exa-mcp#exa-agent). Aktifkan `tools=agent_run` untuk menjalankan riset multi-langkah, list building, enrichment, dan structured output dari Claude, Cursor, dan klien MCP lainnya.
</Tip>

<div id="when-to-use-exa-agent">
  ## Kapan menggunakan Exa Agent
</div>

Gunakan Exa Agent ketika sebuah workflow membutuhkan lebih dari satu panggilan search atau extraction, atau ketika Anda harus menulis sendiri loop berisi search, pembacaan halaman, dan langkah verification untuk menyusun data:

* Membangun daftar dari criteria yang bersifat terbuka, lalu melakukan enrich pada setiap hasil
* Meneliti entitas di banyak bidang lengkap dengan citations
* Menjalankan tugas multi-langkah seperti &quot;temukan perusahaan, lalu temukan pengambil keputusannya&quot;
* Menghasilkan JSON terstruktur dari tugas riset web yang berjalan lama
* Menggabungkan riset web dengan data partners premium dalam satu grounded answer
* Melanjutkan run sebelumnya dengan permintaan lanjutan seperti &quot;temukan 10 hasil lagi&quot;

Exa Agent memang dirancang asinkron dan berlatensi lebih tinggi. Untuk satu search berlatensi rendah yang panggilannya Anda atur sendiri, mulailah dengan [Search API](/id/docs/search/quickstart).

<div id="quickstart">
  ## Quickstart
</div>

Contoh ini memulai run yang menyusun daftar terstruktur berisi orang-orang yang memenuhi criteria Anda. Hasilnya dikembalikan dalam format JSON di `output.structured`.

<div id="1-install-the-exa-sdk">
  ### 1. Instal SDK Exa
</div>

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

<div id="2-set-your-api-key">
  ### 2. Atur API key Anda
</div>

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

<div id="3-create-a-run">
  ### 3. Buat run
</div>

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

Tambahkan `Accept: text/event-stream` saat membuat run untuk menerima server-sent events ketika run diantrekan, dimulai, dan selesai. Lihat [Stream events](#stream-events) untuk detail selengkapnya.

<div id="4-poll-for-completion">
  ### 4. Poll hingga selesai
</div>

Jika Anda tidak melakukan streaming event, simpan `id` yang dikembalikan lalu poll run tersebut hingga mencapai status terminal.

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

Run yang sudah selesai berisi:

* `output.text`: jawaban dalam bahasa alami
* `output.structured`: JSON tervalidasi jika Anda menyediakan `outputSchema`
* `output.grounding`: citations untuk teks atau field terstruktur, bila tersedia
* `costDollars`: rincian cost dari run tersebut

<Note>
  Exa Agent juga tersedia melalui Responses API yang kompatibel dengan OpenAI. Arahkan
  OpenAI SDK ke `https://api.exa.ai`, gunakan `model: "exa-agent"`, lalu pilih
  eksekusi sinkron, streaming, atau background. Lihat [kompatibilitas OpenAI
  SDK](/id/docs/integrations/openai-sdk#agent-via-responses-api).
</Note>

<div id="verify-and-enrich-a-specific-entity">
  ## Memverifikasi dan meng-enrich entitas tertentu
</div>

Selain list building, gunakan Exa Agent untuk memeriksa satu entitas yang sudah diketahui, memverifikasi suatu klaim terhadap sumber otoritatif, dan mengembalikan enrichment terstruktur. Contoh ini mengecek apakah situs web resmi sebuah perusahaan memiliki halaman harga yang dapat diakses publik, lalu meng-enrich hasilnya dengan detail harga jika tersedia. Schema hanya mewajibkan `domain` dan `verdict`; selebihnya adalah enrichment opsional.

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
  Schema untuk workflow verification sebaiknya memperhitungkan ketidakpastian. Buat
  field yang mungkin tidak dapat diverifikasi menjadi nullable dan jangan sertakan dalam `required`,
  sehingga agent dapat mengembalikan `null` alih-alih mengarang nilai. Enum `verdict`
  membedakan pemeriksaan yang gagal (`cannot_verify`) dari evidence negatif
  yang sesungguhnya (`absent`): situs yang tidak dapat diakses bukan berarti
  halaman tersebut tidak ada.
</Note>

<div id="stream-events">
  ## Stream events
</div>

Streaming membuat permintaan create tetap terbuka dan mengirimkan Server-Sent Events (SSE) sampai run selesai. Lihat [Format event](#event-format) untuk mengetahui jenis event dan payload-nya.

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

<div id="event-format">
  ### Format event
</div>

Setiap frame SSE berisi ID event, nama event, dan payload JSON:

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

Stream juga dapat berisi baris komentar seperti `: keep-alive`. Klien SSE mengabaikan komentar secara otomatis; parser kustom sebaiknya melakukan hal yang sama.

<div id="event-types">
  ### Tipe event
</div>

| Event                 | Payload `data`                        | Cara menggunakannya                                                                                                   |
| --------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `agent_run.created`   | `{ id, status: "queued", createdAt }` | Simpan ID run segera setelah permintaan diterima.                                                                     |
| `agent_run.started`   | `{ id, status: "running" }`           | Tandai run sebagai sedang diproses.                                                                                   |
| `agent_run.completed` | Objek Agent run yang telah selesai    | Baca jawaban akhir dari `data.output.text` atau `data.output.structured`, dan citations dari `data.output.grounding`. |
| `agent_run.failed`    | `{ id, status: "failed", error }`     | Tampilkan `error.code` dan `error.message`; tidak ada output akhir yang tersedia.                                     |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`    | Hentikan pembacaan stream dan tangani run sebagai dibatalkan.                                                         |

Event yang terkait dengan langkah riset yang sama menyertakan `callId`, yang sesuai dengan `item.call_id` pada event progres tool. Gunakan nilai ini untuk mengelompokkan jejak search, sumber, dan progres tool. Sebagian deskripsi jejak search dihasilkan secara asinkron dan bisa tiba setelah event sumber atau tool yang dideskripsikannya, jadi jangan mengorelasikannya hanya berdasarkan urutan kedatangan.

Perlakukan `agent_run.source.added` sebagai pratinjau langsung, bukan sebagai daftar citations yang lengkap. `output.grounding` dari run terminal adalah output grounding yang otoritatif.

<div id="replay-stored-events">
  ### Replay event tersimpan
</div>

Untuk run non-ZDR, [`GET /agent/runs/{id}/events`](/id/docs/reference/agent-api/list-run-events) mengembalikan event tersimpan dalam bentuk JSON berpaginasi. Kirim `Accept: text/event-stream` untuk me-replay event tersimpan sebagai SSE, dan `Last-Event-ID` untuk melewati event yang sudah diproses oleh klien Anda:

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

Endpoint replay mengirimkan event yang tersimpan pada saat permintaan dibuat, lalu menutup koneksi; endpoint ini tidak terus mengikuti run yang sedang berjalan. Run ZDR tidak menyimpan event sehingga tidak dapat di-replay.

Demi kompatibilitas ke depan, abaikan nama event yang tidak dikenali aplikasi Anda dan lanjutkan hingga event terminal diterima.

<div id="return-structured-json">
  ## Mengembalikan JSON terstruktur
</div>

Gunakan `outputSchema` untuk mengembalikan JSON yang tervalidasi terhadap schema pada `output.structured`.

`outputSchema` mendukung [spesifikasi JSON Schema](https://json-schema.org/).

Untuk meminta informasi kontak, deskripsikan field kontak yang diinginkan pada `outputSchema`. Gunakan bentuk JSON Schema standar seperti `{ "type": "string", "format": "email" }` untuk alamat email, `{ "type": "string", "format": "phone" }` untuk nomor telepon, dan `{ "type": "string", "format": "uri" }` untuk URL. Batasi ukuran daftar dengan `maxItems` jika memungkinkan agar biaya maksimum contact enrichment dapat diprediksi.

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

<div id="process-input-rows">
  ## Memproses baris input
</div>

Gunakan `input.data` ketika Anda sudah memiliki kumpulan data yang ingin di-enrich. Anda dapat menambahkan lebih banyak field pada setiap entitas data, memunculkan entitas tambahan berdasarkan data yang Anda masukkan, atau keduanya.

Untuk contoh lengkap enrichment baris, lihat [Contoh Agent](/id/docs/agent/examples#enrich-input-rows-code).

<div id="process-exclusions">
  ## Memproses pengecualian
</div>

Gunakan `input.exclusion` untuk mencegah entri tertentu muncul dalam run. Pada contoh di bawah ini, kita ingin mencari 10 hewan paling menggemaskan, tetapi kambing dan panda kita kecualikan dari run karena kita sudah tahu betapa menggemaskannya mereka.

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

<div id="connect-data-sources">
  ## Hubungkan sumber data
</div>

Indeks sudah tersedia di setiap run. Gunakan `dataSources` hanya untuk meng-attach partner [Exa Connect](/id/docs/agent/connect/overview). Setiap entri memilih satu `provider`. Ketika sebuah properti di `outputSchema` Anda merujuk ke sumber tertentu (mis. &quot;dari Similarweb&quot;), Exa Agent akan memanggil tool provider yang sesuai alih-alih menebak dari halaman web.

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

Lihat [Exa Connect](/id/docs/agent/connect/overview) untuk daftar lengkap data partners, lengkap dengan contoh untuk masing-masing.

<div id="continue-from-a-previous-run">
  ## Melanjutkan dari run sebelumnya
</div>

Gunakan `previousRunId` untuk mengajukan follow-ups terhadap respons sebelumnya. Setiap follow-up akan memulai run baru dengan ID tersendiri. `previousRunId` membawa konteks ke run baru; ID ini tidak dipakai ulang sebagai ID run baru tersebut.

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

<div id="find-a-run-id">
  ## Menemukan ID run
</div>

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

<div id="pricing">
  ## Harga
</div>

Biaya dihitung berdasarkan usage dan ditetapkan per komponen:

| Komponen                | Harga             |
| ----------------------- | ----------------- |
| Agent Compute Unit      | `1 ACU = $0.10`   |
| Pemanggilan tool search | `$0.005 / search` |

<Note>
  Contact enrichment terpisah dari komponen harga inti di atas: contact enrichment email dikenakan `$0.02 / email`, dan contact enrichment nomor telepon dikenakan `$0.07 / phone number`.
</Note>

`usage.agentComputeUnits` mengukur komputasi model sepanjang run. Kueri yang kompleks, terutama yang memiliki field `input.data` berukuran besar, memerlukan lebih banyak langkah penalaran dan pemanggilan tool sehingga mengonsumsi lebih banyak ACU.

Lihat [limit Agent](/id/docs/admin/billing#agent-limits) untuk concurrency dan rate limit.

<div id="effort">
  ### Effort
</div>

Gunakan `effort` untuk memilih tingkat biaya dan penalaran pada setiap run. Nilai yang didukung adalah `minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, dan `max`; nilai defaultnya adalah `auto`. Effort tetap memiliki harga per permintaan yang dapat diprediksi, sedangkan `auto` dan `max` (beta) ditagih berdasarkan pemakaian:

| Effort    | Harga                                                       |
| --------- | ----------------------------------------------------------- |
| `minimal` | `$0.012 / request`                                          |
| `low`     | `$0.025 / request`                                          |
| `medium`  | `$0.10 / request`                                           |
| `high`    | `$0.50 / request`                                           |
| `xhigh`   | `$1.00 / request`                                           |
| `auto`    | Berdasarkan pemakaian; hingga batas default `$5`            |
| `max`     | **Beta**, berdasarkan pemakaian; hingga batas default `$20` |

<Info>
  Agent Max adalah tingkat effort tertinggi untuk pekerjaan yang lebih mengutamakan
  kelengkapan dan ketelitian dibandingkan latensi atau biaya, termasuk list building
  berskala besar, riset mendalam lintas banyak sumber, dan criteria yang sulit
  diverifikasi. Fitur ini berada dalam beta publik: permintaan dengan `effort: "max"`
  harus menyertakan `Exa-Beta: agent-max-effort-2026-07-27`. Header ini menerima
  daftar token beta yang dipisahkan koma.
</Info>

`budget.maxCostDollars` adalah batas atas opsional per run untuk `auto` dan `max`. Nilai yang diterima adalah `$1`–`$100`; maksimum yang tersedia adalah `$100`, meskipun server dapat menetapkan maksimum yang lebih rendah. Batas default-nya adalah `$5` untuk `auto` dan `$20` untuk `max`. Ini adalah batas atas, bukan harga tetap: run yang selesai lebih cepat akan lebih murah. Budget tidak berlaku untuk effort tetap.

<div id="choosing-an-effort-mode">
  ### Memilih mode effort
</div>

Mode effort tetap cocok digunakan ketika Anda menginginkan biaya per permintaan yang dapat diprediksi untuk riset standar. Gunakan `auto` untuk pekerjaan dengan scope yang bervariasi seperti list building, saat jumlah entitas bisa berbeda-beda di tiap permintaan.

| Effort    | Paling cocok untuk                                                                             | Kompleksitas schema yang disarankan                                       | Perkiraan runtime                     |
| --------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------- |
| `minimal` | Pencarian berbiaya paling rendah, tugas faktual yang sangat sempit, jawaban singkat            | Satu atau dua field, schema dangkal                                       | Paling murah, paling tidak menyeluruh |
| `low`     | Pencarian sederhana, tugas faktual sempit, jawaban singkat                                     | Beberapa field, schema dangkal                                            | Cepat, riset ringan                   |
| `medium`  | Titik awal default untuk sebagian besar tugas riset standar                                    | Jumlah field sedang, objek bersarang sederhana                            | Kualitas/runtime seimbang             |
| `high`    | Riset yang lebih sulit, lebih banyak citations, kelengkapan lebih ketat                        | Schema lebih besar atau field yang lebih bernuansa                        | Lebih lambat, lebih menyeluruh        |
| `xhigh`   | Tugas bernilai tinggi saat kelengkapan lebih penting daripada cost/latensi                     | Schema kompleks, banyak field, verification yang sulit                    | Effort tetap paling lambat            |
| `auto`    | Pekerjaan dengan scope bervariasi, list building, tingkat kesulitan tugas yang tidak diketahui | Fleksibel; berguna ketika jumlah entitas atau beban kerja belum diketahui | Bervariasi                            |
| `max`     | Riset dengan effort tertinggi (beta)                                                           | Schema kompleks, banyak field, verification yang sulit                    | Berjalan paling lama                  |

Mulailah dengan `medium` untuk riset entitas tunggal yang standar. Turunkan ke `low` atau `minimal` bila cost dan latensi lebih penting daripada kelengkapan. Naikkan ke `high` atau `xhigh` bila schema output lebih besar, field memerlukan verification, atau tugas membutuhkan penalaran yang lebih mendalam. Gunakan `auto` bila Anda belum mengetahui scope-nya sejak awal, misalnya pada list building atau workflow yang berpotensi mengembalikan banyak entitas.

Runtime bervariasi tergantung tingkat kesulitan query, kompleksitas schema, dan ketersediaan sumber eksternal. Anggap mode effort sebagai pertukaran antara kualitas/cost/runtime, bukan jaminan latensi yang ketat.

<div id="run-with-max-effort">
  ### Menjalankan run dengan effort max
</div>

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

<div id="zero-data-retention">
  ## Zero Data Retention
</div>

Exa Agent mendukung [Zero Data Retention](/id/docs/admin/security/zero-data-retention) (ZDR). ZDR diaktifkan per Team. [Hubungi kami](mailto:sales@exa.ai) untuk mengaktifkannya pada akun Anda.

Jika ZDR aktif untuk Team Anda:

* Buat runs dengan Streaming (`Accept: text/event-stream`) untuk menerima output secara langsung, atau lakukan poll pada runs asinkron dalam rentang waktu retensi.
* Data run tersedia selama run berjalan dan hingga 10 menit setelah run mencapai status terminal. Setelah melewati rentang waktu tersebut, run tidak dapat diambil lagi.
* `previousRunId` tidak tersedia.
* `dataSources` Exa Connect tidak tersedia; permintaan yang menyertakannya akan mengembalikan error `400`.

<div id="next-steps">
  ## Langkah selanjutnya
</div>

<Columns cols={2}>
  <Card title="Apa saja yang ada di indeks" icon="search" href="/id/docs/search/data/overview" cta="Buka panduan" arrow="true">
    Jelajahi sumber berita, kode, perusahaan, dan orang di seluruh web publik.
  </Card>

  <Card title="Exa Connect" icon="database" href="/id/docs/agent/connect/overview" cta="Buka panduan" arrow="true">
    Attach basis data partner premium ke sebuah run.
  </Card>

  <Card title="Praktik terbaik Agent" icon="lightbulb" href="/id/docs/agent/best-practices" cta="Buka panduan" arrow="true">
    Praktik terbaik dalam menggunakan Exa Agent.
  </Card>

  <Card title="Contoh Agent" icon="code" href="/id/docs/agent/examples" cta="Buka panduan" arrow="true">
    Contoh penggunaan Exa Agent.
  </Card>
</Columns>