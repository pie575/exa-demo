> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="anthropic-tool-calling">
  # Anthropic Tool Calling
</div>

> Gunakan tool use Claude untuk menambahkan Exa web search dan page contents ke aplikasi Anda.

<Card title="Quickstart Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Baru mengenal Exa? Memulai dalam waktu kurang dari satu menit.
</Card>

***

[Tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) dari Claude memungkinkan model memanggil fungsi yang Anda definisikan dalam kode Anda. SDK Exa sudah menyertakan tool web search dan pembacaan halaman siap pakai untuk Anthropic, sehingga Anda tidak perlu menulis tool schema secara manual, mengurai blok `tool_use`, atau memformat hasil Exa sendiri.

<div id="get-started">
  ## Memulai
</div>

<Steps>
  <Step title="Instal SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install anthropic exa_py
      ```

      ```bash JavaScript theme={null}
      npm install @anthropic-ai/sdk exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Siapkan API key Anda">
    Atur variabel lingkungan `EXA_API_KEY` dan `ANTHROPIC_API_KEY`. Kunjungi [console Anthropic](https://console.anthropic.com/settings/keys) dan [dashboard Exa](https://dashboard.exa.ai/api-keys) untuk membuat API key Anda.

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Tambahkan Exa tools ke tool loop Anda">
    Sertakan tool dalam daftar `tools` pada permintaan, lalu teruskan pesan assistant ke `handle_tool_use`. Fungsi ini menjalankan setiap blok `tool_use` dalam pesan tersebut dan mengembalikan blok `tool_result` yang sesuai, siap dikirim kembali pada pesan user berikutnya.

    `web_search` mencari halaman web yang belum pernah dilihat model; `get_contents` membaca halaman yang URL-nya sudah dimiliki model, baik dari search sebelumnya maupun dari pengguna. Daftarkan salah satu atau keduanya.

    <CodeGroup>
      ```python Python theme={null}
      import anthropic
      from exa_py import Exa

      exa = Exa()  # membaca EXA_API_KEY dari lingkungan
      claude = anthropic.Anthropic()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )

      messages.append({"role": "assistant", "content": response.content})
      messages.append(
          {"role": "user", "content": exa.anthropic.handle_tool_use(response)}
      )

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )
      print(response.content[0].text)
      ```

      ```javascript JavaScript theme={null}
      import Anthropic from "@anthropic-ai/sdk";
      import Exa from "exa-js";

      const exa = new Exa(); // membaca EXA_API_KEY dari lingkungan
      const anthropic = new Anthropic();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });

      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: await exa.anthropic.handleToolUse(response),
      });

      response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });
      console.log(response.content[0].text);
      ```
    </CodeGroup>

    Contoh ini hanya satu putaran agar ringkas. Agent yang sesungguhnya tetap menyertakan `tools` pada setiap permintaan dan mengulangi langkah handler sampai model membalas tanpa blok `tool_use` — begitulah sebuah hasil search berlanjut menjadi pembacaan halaman follow-up.

    Memanggil factory tanpa argumen akan memberikan default yang direkomendasikan Exa: `type="auto"` dengan `contents={"highlights": True}` untuk search. Kutipan mengembalikan potongan teks yang relevan dengan query — bukan memotong teks halaman pada 10.000 karakter. Factory contents mengembalikan teks halaman; batas 10.000 karakter pada SDK hanya berlaku untuk `text`, dan hanya jika Anda tidak menyertakan `max_characters`.
  </Step>
</Steps>

<div id="configuring-the-tools">
  ## Mengonfigurasi tool
</div>

Argumen keyword adalah options Exa biasa yang diteruskan saat tool dijalankan — options search ke `exa.search()`, options contents ke `exa.get_contents()`:

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.anthropic.web_search(category="news", contents={"text": True}),
      exa.anthropic.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.anthropic.webSearch({ category: "news", contents: { text: true } }),
    exa.anthropic.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

Model memilih `query` untuk search dan `urls` yang akan dibaca; sisanya sudah terikat saat Anda membuat tool, sehingga model tidak dapat mengubah apa yang di-crawl atau diekstraksi.

Sebaliknya, `name` (dengan default `"web_search"` dan `"get_contents"`) serta `description` menimpa definisi tool yang dilihat model. Anthropic mewajibkan nama tool bersifat unik, jadi nama kustom memungkinkan tool Exa berjalan berdampingan dengan server tool bawaan Anthropic `web_search_20250305`, yang sudah memakai nama `web_search`:

<CodeGroup>
  ```python Python theme={null}
  response = claude.messages.create(
      model="claude-sonnet-4-6",
      max_tokens=1024,
      messages=messages,
      tools=[
          exa.anthropic.web_search(name="exa_web_search"),
          {"type": "web_search_20250305", "name": "web_search", "max_uses": 5},
      ],
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages,
    tools: [
      exa.anthropic.webSearch({ name: "exa_web_search" }),
      { type: "web_search_20250305", name: "web_search", max_uses: 5 },
    ],
  });
  ```
</CodeGroup>

<div id="mixing-in-your-own-tools">
  ## Menggabungkan tool Anda sendiri
</div>

`handle_tool_use` merespons setiap blok `tool_use` dalam pesan: blok yang menyebut tool yang tidak dikenali akan mendapat hasil `Error: unknown tool "<name>"` alih-alih diabaikan, sehingga follow-up permintaan tidak pernah kehilangan hasil tool yang diwajibkan. Jika Anda menjalankan tool sendiri bersama tool milik Exa, ganti hasil error tersebut dengan hasil Anda sebelum permintaan berikutnya.

<div id="writing-the-loop-by-hand">
  ## Menulis loop secara manual
</div>

Jika Anda lebih suka menangani sendiri tool schema dan eksekusinya, definisikan tool tersebut dan proses blok `tool_use` secara manual. `exa.tools.web_search()` dan `exa.tools.get_contents()` menyediakan spesifikasi tool yang netral terhadap provider (lengkap dengan metode `run`) untuk loop buatan sendiri, atau Anda bisa menulis semuanya dari nol:

```python Python theme={null}
TOOLS = [
    {
        "name": "exa_search",
        "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to perform.",
                },
            },
            "required": ["query"],
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_use(response):
    results = []
    for block in response.content:
        if block.type == "tool_use" and block.name == "exa_search":
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(exa_search(**block.input)),
                }
            )
    return results
```

Lihat [Quickstart SDK](/id/docs/sdks/quickstart) untuk options search dan contents di Python dan TypeScript.