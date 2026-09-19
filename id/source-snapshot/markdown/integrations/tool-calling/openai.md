> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="openai-tool-calling">
  # OpenAI Tool Calling
</div>

> Gunakan tool calling OpenAI untuk menambahkan Exa web search dan page contents ke aplikasi Anda.

<Info>
  OpenAI merekomendasikan Responses API untuk semua proyek baru. Lihat bagian [Responses API](#responses-api) di bawah ini.
</Info>

[Tool calling](https://platform.openai.com/docs/guides/function-calling?lang=python) dari OpenAI memungkinkan model memanggil fungsi yang Anda definisikan di dalam kode Anda. SDK Exa sudah menyertakan tool web search dan pembacaan halaman yang siap pakai untuk OpenAI, sehingga Anda tidak perlu menulis sendiri schema tool, mem-parsing tool call, maupun memformat hasil Exa secara manual.

<div id="get-started">
  ## Get started
</div>

<Steps>
  <Step title="Pasang SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install openai exa_py
      ```

      ```bash JavaScript theme={null}
      npm install openai exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Siapkan API key Anda">
    Atur variabel lingkungan `EXA_API_KEY` dan `OPENAI_API_KEY`. Kunjungi [dashboard OpenAI](https://platform.openai.com/api-keys) dan [Exa dashboard](https://dashboard.exa.ai/api-keys) untuk membuat API key Anda.

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Tambahkan tool Exa ke tool loop Anda">
    Kirimkan tool pada daftar `tools` di request, lalu serahkan pesan assistant ke `handle_tool_calls`. Fungsi ini menjalankan setiap tool call Exa dalam pesan tersebut dan mengembalikan pesan `role: "tool"` yang sesuai, siap ditambahkan ke percakapan.

    `web_search` melakukan search di web untuk halaman yang belum dilihat model; `get_contents` membaca halaman yang URL-nya sudah dimiliki, baik dari search sebelumnya maupun dari pengguna. Daftarkan salah satu atau keduanya.

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # membaca EXA_API_KEY dari environment
      openai_client = OpenAI()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
          tools=[exa.openai.web_search(), exa.openai.get_contents()],
      )

      message = completion.choices[0].message
      messages.append(message)
      messages += exa.openai.handle_tool_calls(message)

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
      )
      print(completion.choices[0].message.content)
      ```

      ```javascript JavaScript theme={null}
      import Exa from "exa-js";
      import { OpenAI } from "openai";

      const exa = new Exa(); // membaca EXA_API_KEY dari environment
      const openai = new OpenAI();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
        tools: [exa.openai.webSearch(), exa.openai.getContents()],
      });

      const message = completion.choices[0].message;
      messages.push(message, ...(await exa.openai.handleToolCalls(message)));

      completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
      });
      console.log(completion.choices[0].message.content);
      ```
    </CodeGroup>

    Contoh ini hanya satu putaran agar ringkas. Agent sungguhan selalu menyertakan `tools` pada setiap request dan mengulang langkah handler sampai model membalas tanpa tool call — dari situlah hasil search berlanjut menjadi pembacaan halaman berikutnya.

    Memanggil factory tanpa argumen akan memberikan nilai default yang direkomendasikan Exa: `type="auto"` dengan `contents={"highlights": True}` untuk search. Highlights mengembalikan excerpt yang relevan dengan query — bukan membatasi teks halaman hingga 10.000 karakter. Factory contents mengembalikan teks halaman; limit 10.000 karakter pada SDK hanya berlaku untuk `text`, dan hanya jika Anda tidak menyertakan `max_characters`.
  </Step>
</Steps>

<div id="responses-api">
  ## Responses API
</div>

Untuk OpenAI Responses API, gunakan factory `responses` dengan helper `handle_tool_calls` yang sama. Handler akan mengembalikan item `function_call_output` untuk permintaan lanjutan.

<CodeGroup>
  ```python Python theme={null}
  response = openai_client.responses.create(
      model="gpt-5.6",
      input=messages,
      tools=[exa.openai.responses.web_search(), exa.openai.responses.get_contents()],
  )

  messages += response.output
  messages += exa.openai.responses.handle_tool_calls(response)
  ```

  ```javascript JavaScript theme={null}
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: messages,
    tools: [exa.openai.responses.webSearch(), exa.openai.responses.getContents()],
  });

  messages.push(...response.output);
  messages.push(...(await exa.openai.responses.handleToolCalls(response)));
  ```
</CodeGroup>

<Note>
  Chat Completions dan Responses API menggunakan bentuk tool yang berbeda dan saling menolak bentuk milik satu sama lain, jadi gunakan factory yang sesuai dengan endpoint yang Anda panggil.
</Note>

<div id="configuring-the-tools">
  ## Mengonfigurasi tool
</div>

Argumen kata kunci adalah opsi Exa biasa yang diteruskan saat tool dijalankan — opsi search ke `exa.search()`, opsi contents ke `exa.get_contents()`:

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.openai.web_search(category="news", contents={"text": True}),
      exa.openai.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.openai.webSearch({ category: "news", contents: { text: true } }),
    exa.openai.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

Model memilih `query` untuk search dan `urls` yang akan dibaca; selebihnya sudah terikat sejak Anda membuat tool, sehingga model tidak bisa mengubah apa yang di-crawl atau diekstraksi.

Sebaliknya, `name` (bernilai bawaan `"web_search"` dan `"get_contents"`) dan `description` menimpa definisi tool yang dilihat model. Gunakan `name` kustom untuk menjalankan beberapa tool Exa dengan konfigurasi berbeda secara berdampingan, atau untuk menghindari bentrok dengan tool lain yang memakai nama tersebut.

<div id="mixing-in-your-own-tools">
  ## Menggabungkan tool Anda sendiri
</div>

Handler menjawab setiap tool call dalam pesan: call yang menyebut tool yang tidak dapat dikenali akan menghasilkan output `Error: unknown tool "<name>"` alih-alih diabaikan, sehingga permintaan lanjutan tidak pernah melewatkan respons tool yang diperlukan. Jika Anda menjalankan tool Anda sendiri berdampingan dengan tool Exa, ganti output error tersebut dengan hasil Anda sendiri sebelum permintaan berikutnya.

<div id="writing-the-loop-by-hand">
  ## Menulis loop secara manual
</div>

Jika Anda lebih suka menangani sendiri schema dan eksekusi tool-nya, definisikan tool tersebut dan proses pemanggilannya secara manual. `exa.tools.web_search()` dan `exa.tools.get_contents()` memberikan spesifikasi tool yang netral terhadap provider (lengkap dengan method `run`) untuk loop buatan sendiri, atau Anda bisa menulis semuanya dari nol:

```python Python theme={null}
import json

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "exa_search",
            "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to perform.",
                    },
                },
                "required": ["query"],
            },
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_calls(tool_calls, messages):
    for tool_call in tool_calls:
        if tool_call.function.name == "exa_search":
            args = json.loads(tool_call.function.arguments)
            messages.append(
                {
                    "role": "tool",
                    "content": str(exa_search(**args)),
                    "tool_call_id": tool_call.id,
                }
            )
    return messages
```

Lihat [Quickstart SDK](/id/docs/sdks/quickstart) untuk opsi search dan contents di Python dan TypeScript.