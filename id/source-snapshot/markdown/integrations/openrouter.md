> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="openrouter">
  # OpenRouter
</div>

> Grounding model OpenRouter mana pun dengan Exa web search melalui server tool openrouter:web&#95;search.

Exa adalah mesin pencari di balik web search [OpenRouter](https://openrouter.ai). OpenRouter memberi Anda satu API untuk ratusan model, dan Exa memberi model-model tersebut akses web secara langsung: model tanpa search bawaan akan di-grounding melalui Exa secara default, dan model apa pun dapat diarahkan ke Exa secara eksplisit. Exa API key tidak diperlukan. OpenRouter menjalankan searches di sisi server dan menagihkannya ke OpenRouter credits Anda.

<div id="use-the-web-search-server-tool">
  ## Menggunakan server tool web search
</div>

Tambahkan `openrouter:web_search` ke array `tools` Anda, lalu model akan menentukan kapan harus melakukan search, apa yang dicari, dan apakah perlu melakukan search lagi dalam permintaan yang sama. [Server tools](https://openrouter.ai/docs/guides/features/server-tools/web-search) masih dalam tahap beta di OpenRouter, dan menggantikan plugin `web` serta varian model `:online` yang sudah tidak digunakan lagi; lihat [panduan migrasi](https://openrouter.ai/docs/guides/features/server-tools/web-search#migrating-from-the-web-search-plugin) dari OpenRouter jika Anda menggunakan salah satunya.

<CodeGroup>
  ```javascript JavaScript theme={null}
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer <OPENROUTER_API_KEY>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.2",
      messages: [
        { role: "user", content: "What were the major AI announcements this week?" },
      ],
      tools: [{ type: "openrouter:web_search" }],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      "https://openrouter.ai/api/v1/chat/completions",
      headers={
          "Authorization": "Bearer <OPENROUTER_API_KEY>",
          "Content-Type": "application/json",
      },
      json={
          "model": "openai/gpt-5.2",
          "messages": [
              {"role": "user", "content": "What were the major AI announcements this week?"}
          ],
          "tools": [{"type": "openrouter:web_search"}],
      },
  )

  print(response.json()["choices"][0]["message"]["content"])
  ```

  ```bash cURL theme={null}
  curl https://openrouter.ai/api/v1/chat/completions \
    -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "openai/gpt-5.2",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [{ "type": "openrouter:web_search" }]
    }'
  ```
</CodeGroup>

Dengan nilai bawaan `engine: "auto"`, OpenRouter memakai search native milik provider jika model tersebut memilikinya, dan memakai Exa untuk model lainnya. Setel `engine: "exa"` agar perilaku search konsisten di semua model:

```json theme={null}
{
  "type": "openrouter:web_search",
  "parameters": {
    "engine": "exa",
    "mode": "auto",
    "max_results": 5,
    "max_total_results": 20,
    "allowed_domains": ["arxiv.org"],
    "excluded_domains": ["reddit.com"]
  }
}
```

| Parameter                             | Gunakan untuk                                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mode`                                | Menukar latensi dengan kedalaman: `instant`, `fast`, `auto` (default), `deep-lite`, `deep`, atau `deep-reasoning`. Mode-mode ini dipetakan ke [search types](/id/docs/search/quickstart) milik Exa. |
| `max_results`                         | Membatasi jumlah hasil per panggilan search (default 5)                                                                                                                                          |
| `max_uses`                            | Membatasi berapa kali model boleh melakukan search dalam satu permintaan                                                                                                                         |
| `max_total_results`                   | Membatasi total hasil kumulatif dari seluruh searches dalam satu permintaan                                                                                                                      |
| `max_characters`                      | Menetapkan character budget per hasil secara tepat untuk highlights                                                                                                                              |
| `search_context_size`                 | Menggunakan budget preset sebagai gantinya: `low`, `medium`, atau `high`                                                                                                                         |
| `allowed_domains`, `excluded_domains` | Memfilter domain hasil. Exa mendukung kedua filter tersebut dalam satu permintaan yang sama.                                                                                                     |

<div id="how-results-come-back">
  ## Bagaimana hasil dikembalikan
</div>

OpenRouter meminta [Exa highlights](/id/docs/search/highlights) untuk setiap hasil, bukan teks halaman secara utuh: excerpt ekstraktif dengan ukuran adaptif, biasanya 2.000 hingga 4.000 karakter per hasil, kecuali Anda menetapkan `max_characters` atau `search_context_size`. Model membaca excerpt tersebut, dan pemanggil API menerimanya dalam anotasi `url_citation` terstandardisasi pada pesan respons. Dalam satu hasil, penanda `[...]` memisahkan excerpt yang diambil dari bagian halaman yang berbeda.

<div id="pricing">
  ## Harga
</div>

Exa search ditagihkan ke OpenRouter credits Anda, selain biaya token model untuk membaca hasilnya. Mode `instant`, `fast`, dan `auto` berbiaya $0,007 per search, `deep-lite` dan `deep` $0,012, dan `deep-reasoning` $0,015. Setiap search mencakup hingga 10 hasil, dan setiap hasil tambahan dikenakan biaya $0,001. Lihat [dokumentasi web search OpenRouter](https://openrouter.ai/docs/guides/features/server-tools/web-search) untuk tarif terkini.

Objek `usage` pada respons melaporkan berapa banyak search yang dijalankan model melalui `server_tool_use.web_search_requests`.

<div id="resources">
  ## Sumber Daya
</div>

<Columns cols={2}>
  <Card title="Dokumentasi server tool" icon="wrench" href="https://openrouter.ai/docs/guides/features/server-tools/web-search" cta="Buka dokumentasi" arrow="true">
    Referensi konfigurasi lengkap untuk `openrouter:web_search`.
  </Card>

  <Card title="Kisah pelanggan" icon="book-open" href="https://exa.ai/customers/openrouter" cta="Baca kisahnya" arrow="true">
    Bagaimana OpenRouter menghadirkan web search untuk ratusan model dengan Exa.
  </Card>
</Columns>