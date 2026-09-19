> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="baseten">
  # Baseten
</div>

> Buat model open-source di Baseten Model APIs menjadi grounded dengan Exa web search melalui Baseten Hosted Tools.

Exa adalah penyedia web search di [Baseten Hosted Tools](https://www.baseten.co/blog/introducing-baseten-hosted-tools/). Baseten Model APIs menyediakan model open-source, dan Hosted Tools memungkinkan model-model tersebut melakukan search di web tanpa perlu Anda merangkai sendiri tool loop-nya: Anda cukup menambahkan selektor tool Exa ke permintaan standar, Baseten menjalankan model beserta search Exa dalam satu loop di sisi server, dan Anda langsung menerima grounded answer dalam respons yang sama. Exa API key tidak diperlukan. Baseten meneruskan cost Exa ke tagihan Baseten Anda tanpa markup.

<div id="use-the-exa-web-search-tools">
  ## Menggunakan tool Exa web search
</div>

Setel header `x-baseten-server-tools: true`, lalu tambahkan satu atau beberapa selector Exa ke array `tools` Anda. Hanya `type` yang diperlukan; Baseten memperluas schema tool secara otomatis, dan model sendiri yang menentukan kapan harus melakukan search, apa yang dicari, dan halaman mana yang dibaca. Server-side tools berfungsi pada endpoint [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions), [Messages](https://docs.baseten.co/reference/inference-api/messages), dan Responses milik Baseten, baik buffered maupun streaming.

<CodeGroup>
  ```python Python theme={null}
  from openai import OpenAI

  client = OpenAI(
      api_key="<BASETEN_API_KEY>",
      base_url="https://inference.baseten.co/v1",
      default_headers={"x-baseten-server-tools": "true"},
  )

  response = client.chat.completions.create(
      model="zai-org/GLM-5.3-Fast",
      messages=[
          {"role": "user", "content": "What were the major AI announcements this week?"}
      ],
      tools=[
          {"type": "baseten__exa__web_search_exa"},
          {"type": "baseten__exa__web_fetch_exa"},
      ],
      extra_body={"baseten": {"tool_settings": {"max_react_iterations": 5}}},
  )

  print(response.choices[0].message.content)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const client = new OpenAI({
    apiKey: "<BASETEN_API_KEY>",
    baseURL: "https://inference.baseten.co/v1",
    defaultHeaders: { "x-baseten-server-tools": "true" },
  });

  const response = await client.chat.completions.create({
    model: "zai-org/GLM-5.3-Fast",
    messages: [
      { role: "user", content: "What were the major AI announcements this week?" },
    ],
    tools: [
      { type: "baseten__exa__web_search_exa" },
      { type: "baseten__exa__web_fetch_exa" },
    ],
    baseten: { tool_settings: { max_react_iterations: 5 } },
  });

  console.log(response.choices[0].message.content);
  ```

  ```bash cURL theme={null}
  curl https://inference.baseten.co/v1/chat/completions \
    -H "Authorization: Bearer <BASETEN_API_KEY>" \
    -H "Content-Type: application/json" \
    -H "x-baseten-server-tools: true" \
    -d '{
      "model": "zai-org/GLM-5.3-Fast",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [
        { "type": "baseten__exa__web_search_exa" },
        { "type": "baseten__exa__web_fetch_exa" }
      ],
      "baseten": { "tool_settings": { "max_react_iterations": 5 } }
    }'
  ```
</CodeGroup>

Tersedia tiga tool Exa. Berikan model search sekaligus fetch bila model perlu menemukan sumber lalu membaca halaman yang dipilihnya.

| Selector                                | Apa yang didapat model                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `baseten__exa__web_search_exa`          | [Exa search](/id/docs/search/quickstart): hasil relevan beserta page content untuk sebuah query |
| `baseten__exa__web_search_advanced_exa` | Search dengan filter domain, crawling subhalaman, dan summary opsional per hasil             |
| `baseten__exa__web_fetch_exa`           | [Page contents lengkap](/id/docs/contents/quickstart) untuk URL yang sudah dimiliki model       |

Selector tidak memerlukan field tambahan; model mengisi sendiri argumen tool berdasarkan schema Exa. Gunakan system prompt untuk mengarahkan kebijakan search, misalnya kapan harus melakukan search, perlu atau tidaknya mengambil sumber primer, dan cara mengutipnya. Gunakan `baseten.tool_settings` untuk membatasi loop:

| Pengaturan                     | Gunakan untuk                                                                                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_react_iterations`         | Membatasi jumlah iterasi model per permintaan (default 12, rentang 2 sampai 20). Iterasi terakhir dicadangkan untuk jawaban, sehingga `N` memungkinkan `N - 1` putaran tool call. |
| `max_tool_calls_per_iteration` | Membatasi jumlah server-side tool call dalam satu iterasi (default 10, rentang 1 sampai 10)                                                                                       |

<div id="how-results-come-back">
  ## Bagaimana hasil dikembalikan
</div>

Jawaban akhir dikirimkan melalui field standar endpoint tersebut. Panggilan Exa yang selesai dicatat sesuai protokolnya masing-masing: blok `tool_use` dan `tool_result` pada Messages, item `mcp_call` pada Responses, serta `baseten.iterations[].continuation_messages` pada Chat Completions. Permintaan streaming menerima setiap panggilan search beserta hasilnya sebagai server-sent events selama loop berjalan, sehingga Anda dapat menampilkan progres sebelum jawaban tiba. Array `baseten.request.server_tool_calls[]` melaporkan hasil dari setiap panggilan Exa dalam permintaan tersebut.

<div id="pricing">
  ## Harga
</div>

Panggilan Exa ditagihkan ke akun Baseten Anda dengan tarif Exa tanpa markup, di luar biaya token model: sekitar $0,007 per search dan $0,001 per URL yang diambil. Exa melaporkan biaya setiap panggilan saat runtime, sehingga biaya tiap panggilan bisa berbeda dari angka tersebut. tool call yang ditagih akan muncul di pengaturan workspace Baseten pada Billing → Usage, dikelompokkan berdasarkan provider. Lihat [tabel harga Baseten](https://docs.baseten.co/inference/model-apis/web-search#pricing) untuk tarif terkini.

Hosted Tools masih dalam tahap early access di Baseten dengan limit 25 permintaan per menit untuk setiap organization. Coba Exa search di [playground Baseten](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground), atau hubungi Baseten untuk menaikkan limit bagi beban kerja produksi.

<div id="resources">
  ## Sumber Daya
</div>

<Columns cols={2}>
  <Card title="Dokumentasi web search Baseten" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="Buka dokumentasi" arrow="true">
    Contoh Messages, Responses, dan Chat Completions yang siap dijalankan dengan server-side tools.
  </Card>

  <Card title="Referensi server-side tool" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="Buka referensi" arrow="true">
    Katalog tool, pengaturan loop, format `tool_choice`, dan bentuk respons.
  </Card>
</Columns>