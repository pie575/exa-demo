> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="openai-sdk-compatibility">
  # Kompatibilitas SDK OpenAI
</div>

> Gunakan endpoint Exa sebagai pengganti langsung OpenAI - mendukung baik API chat completions maupun responses.

<Card title="Quickstart Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Baru mengenal Exa? Mulai dalam waktu kurang dari satu menit.
</Card>

***

<div id="overview">
  ## Ikhtisar
</div>

Exa menyediakan endpoint yang kompatibel dengan OpenAI dan dapat digunakan bersama SDK OpenAI:

| Endpoint            | Antarmuka OpenAI     | Model Tersedia | Kasus Penggunaan                                         |
| ------------------- | -------------------- | -------------- | -------------------------------------------------------- |
| `/chat/completions` | Chat Completions API | `exa`          | Antarmuka chat tradisional                               |
| `/responses`        | Responses API        | `exa-agent`    | Agent API (research asinkron, enrichment, list building) |

<Info>
  `/chat/completions` dirutekan ke [`/answer`](/id/docs/reference/answer), dan `/responses` dirutekan ke [Agent API](/id/docs/agent/quickstart). Lihat [Agent melalui Responses API](#agent-via-responses-api) di bawah ini.
</Info>

<div id="answer">
  ## Answer
</div>

Untuk menggunakan endpoint `/answer` milik Exa melalui antarmuka chat completions:

1. Ganti base URL dengan `https://api.exa.ai`
2. Ganti API key dengan Exa API key Anda
3. Ganti nama model dengan `exa`.

<Info>
  Lihat referensi lengkap endpoint [`/answer`](/id/docs/reference/answer). Untuk perilaku routing kustom, hubungi [hello@exa.ai](mailto:hello@exa.ai).
</Info>

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
    base_url="https://api.exa.ai", # gunakan exa sebagai base url
    api_key=os.environ["EXA_API_KEY"],
  )

  completion = client.chat.completions.create(
    model="exa",
    messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ],

  # gunakan extra_body untuk meneruskan parameter tambahan ke endpoint /answer
    extra_body={
      "text": True # sertakan teks penuh dari sources
    }
  )

  print(completion.choices[0].message.content)  # cetak konten response
  print(completion.choices[0].message.citations)  # cetak sitasi
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai", // gunakan exa sebagai base url
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: "exa",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "What are the latest developments in quantum computing?",
        },
      ],
      store: true,
      stream: true,
      extra_body: {
        text: true, // sertakan teks penuh dari sources
      },
    });

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s https://api.exa.ai/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "model": "exa",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "What are the latest developments in quantum computing?"
        }
      ],
      "text": true
    }'
  ```
</CodeGroup>

<div id="agent-via-responses-api">
  ## Agent melalui Responses API
</div>

Endpoint [`/responses`](https://api.exa.ai/responses) milik Exa mengekspos [Agent API](/id/docs/agent/quickstart) melalui antarmuka OpenAI Responses, sehingga SDK OpenAI bisa langsung digunakan tanpa perubahan. Atur `model: "exa-agent"` dan pilih mode eksekusi:

| Mode        | Permintaan                            | Perilaku                                                                                                                       |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Synchronous | default (tanpa `stream`/`background`) | Permintaan akan memblokir dan mengembalikan objek `response` yang sudah selesai.                                               |
| Streaming   | `stream: true`                        | Permintaan melakukan streaming event OpenAI Responses (SSE) seiring berjalannya run, dan diakhiri dengan `response.completed`. |
| Background  | `background: true`                    | Permintaan langsung mengembalikan response `in_progress`; poll `GET /responses/{id}` untuk memperoleh hasilnya.                |

Atur `reasoning.effort` (`minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, `max`) untuk menyeimbangkan cost dengan depth, dan batalkan sebuah run dengan `POST /responses/{id}/cancel`. Untuk `max`, atur `Exa-Beta: agent-max-effort-2026-07-27` sebagai header default client. [Panduan Agent](/id/docs/agent/quickstart) membahas model run, bentuk output, dan pricing effort yang mendasari antarmuka ini.

<Warning>
  Run dengan `reasoning.effort` bernilai `high`, `xhigh`, dan `max` berjalan terlalu lama untuk permintaan synchronous sehingga mengembalikan `400`. Gunakan `stream: true` atau `background: true` untuk run tersebut. `/responses` tidak memiliki field `budget`; max memakai batas default per run.
</Warning>

Gunakan `previous_response_id` untuk melanjutkan run Responses yang sudah selesai.

<div id="synchronous">
  ### Synchronous
</div>

Permintaan akan tertahan hingga run selesai dan mengembalikan objek `response` terminal.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning={"effort": "medium"},
  )

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning: { effort: "medium" },
    });

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "reasoning": { "effort": "medium" }
    }'
  ```
</CodeGroup>

<div id="streaming">
  ### Streaming
</div>

Setel `stream: true` untuk menerima event stream Responses melalui SSE. Setiap event membawa `sequence_number` yang monoton dan diakhiri dengan `response.completed`; tidak ada penanda `[DONE]`. Stream dapat memuat baris komentar `: keep-alive`, yang akan diabaikan oleh client SSE.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  with client.responses.stream(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
  ) as stream:
      for event in stream:
          if event.type == "response.output_text.delta":
              print(event.delta, end="", flush=True)
      final = stream.get_final_response()

  print("\n\n", final.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const stream = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
      }
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -N -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -H 'Accept: text/event-stream' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "stream": true
    }'
  ```
</CodeGroup>

<div id="background">
  ### Background
</div>

Atur `background: true` untuk memulai run tanpa menahan koneksi tetap terbuka, lalu poll `GET /responses/{id}` hingga mencapai status terminal. Untuk melakukan stream alih-alih polling, gunakan [Streaming](#streaming).

<CodeGroup>
  ```python Python theme={null}
  import os
  import time
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      background=True,
  )

  # Poll hingga selesai
  while response.status in ("queued", "in_progress"):
      time.sleep(5)
      response = client.responses.retrieve(response.id)

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    let response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      background: true,
    });

    // Poll hingga selesai
    while (response.status === "queued" || response.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 5000));
      response = await openai.responses.retrieve(response.id);
    }

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  # Membuat background run
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "background": true
    }'

  # Poll dengan ID response yang dikembalikan
  curl -s 'https://api.exa.ai/responses/resp_agent_run_...' \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="chat-wrapper">
  ## Chat wrapper
</div>

Exa menyediakan wrapper Python yang secara otomatis melengkapi chat completion OpenAI mana pun dengan kemampuan RAG. Hanya dengan satu baris kode, Anda dapat mengubah chat completion OpenAI apa pun menjadi sistem RAG berbasis Exa yang menangani search, chunking, dan prompting secara otomatis.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI
  from exa_py import Exa

  # Inisialisasi client
  openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
  exa = Exa(api_key=os.environ["EXA_API_KEY"])

  # Bungkus client OpenAI
  exa_openai = exa.wrap(openai)

  # Gunakan persis seperti client OpenAI biasa
  completion = exa_openai.chat.completions.create(
      model="gpt-5.6-sol",
      messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

Client yang telah dibungkus bekerja persis seperti client OpenAI asli, hanya saja ia otomatis menyempurnakan completion Anda dengan hasil search yang relevan saat dibutuhkan.

Wrapper ini mendukung semua parameter dari fungsi `exa.search()`.

```python theme={null}
completion = exa_openai.chat.completions.create(
    model="gpt-5.6-sol",
    messages=messages,
    use_exa="auto",              # "auto", "required", atau "none"
    num_results=5,               # default-nya 3
    result_max_len=1024,         # default-nya 2048 karakter
    include_domains=["arxiv.org"],
    category="publication",
    start_published_date="2019-01-01"
)
```