> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

# OpenRouter {#openrouter}

> Landasi model OpenRouter mana pun dengan Exa web search melalui server tool openrouter:web&#95;search.

Exa adalah mesin pencari di balik web search milik [OpenRouter](https://openrouter.ai). OpenRouter memberi Anda satu API untuk ratusan model, dan Exa memberi model-model tersebut akses web secara langsung: model yang tidak memiliki pencarian bawaan akan dilandasi melalui Exa secara default, dan model mana pun dapat diarahkan ke Exa secara eksplisit. Exa API key tidak diperlukan. OpenRouter menjalankan pencarian di sisi server dan menagihkannya ke OpenRouter credits Anda.

## Menggunakan server tool web search {#use-the-web-search-server-tool}

Tambahkan `openrouter:web_search` ke array `tools` Anda, lalu model akan menentukan kapan harus melakukan search, apa yang dicari, dan apakah perlu search lagi dalam permintaan yang sama. [Server tools](https://openrouter.ai/docs/guides/features/server-tools/web-search) masih dalam tahap beta di OpenRouter, dan menggantikan plugin `web` serta varian model `:online` yang sudah usang; lihat [panduan migrasi](https://openrouter.ai/docs/guides/features/server-tools/web-search#migrating-from-the-web-search-plugin) dari OpenRouter jika Anda menggunakan salah satunya.

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

Dengan default `engine: "auto"`, OpenRouter memakai search bawaan provider jika model tersebut memilikinya, dan Exa untuk model lainnya. Setel `engine: "exa"` agar perilaku search seragam di semua model:

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
| `mode`                                | Menukar latency dengan kedalaman: `instant`, `fast`, `auto` (default), `deep-lite`, `deep`, atau `deep-reasoning`. Mode-mode ini dipetakan ke [search types](/id/docs/search/quickstart) milik Exa. |
| `max_results`                         | Membatasi jumlah hasil per panggilan search (default 5)                                                                                                                                          |
| `max_uses`                            | Membatasi berapa kali model boleh melakukan search dalam satu permintaan                                                                                                                         |
| `max_total_results`                   | Membatasi total kumulatif hasil dari seluruh searches dalam satu permintaan                                                                                                                      |
| `max_characters`                      | Menetapkan character budget yang pasti per hasil untuk kutipan                                                                                                                                   |
| `search_context_size`                 | Menggunakan budget preset sebagai gantinya: `low`, `medium`, atau `high`                                                                                                                         |
| `allowed_domains`, `excluded_domains` | Memfilter domain hasil. Exa mendukung kedua filter tersebut dalam satu permintaan yang sama.                                                                                                     |

## Bagaimana hasil dikembalikan {#how-results-come-back}

OpenRouter meminta [kutipan Exa](/id/docs/search/highlights) untuk setiap hasil alih-alih teks halaman secara utuh: kutipan ekstraktif dengan ukuran adaptif, biasanya 2.000 hingga 4.000 karakter per hasil, kecuali Anda menetapkan `max_characters` atau `search_context_size`. Model membaca kutipan tersebut, dan pemanggil API menerimanya dalam anotasi `url_citation` terstandardisasi pada pesan response. Dalam satu hasil, penanda `[...]` memisahkan kutipan yang diambil dari bagian halaman yang berbeda.

## Harga {#pricing}

Exa search ditagihkan ke OpenRouter credits Anda, selain biaya token model untuk membaca hasilnya. Mode `instant`, `fast`, dan `auto` berbiaya $0,007 per search, `deep-lite` dan `deep` berbiaya $0,012, sedangkan `deep-reasoning` berbiaya $0,015. Setiap search mencakup hingga 10 hasil, dan setiap hasil tambahan dikenakan biaya $0,001. Lihat [dokumentasi web search OpenRouter](https://openrouter.ai/docs/guides/features/server-tools/web-search) untuk tarif terkini.

Objek `usage` pada response melaporkan berapa banyak search yang dijalankan model melalui `server_tool_use.web_search_requests`.

## Sumber Daya {#resources}

<Columns cols={2}>
  <Card title="Dokumentasi server tool" icon="wrench" href="https://openrouter.ai/docs/guides/features/server-tools/web-search" cta="Buka dokumentasi" arrow="true">
    Referensi konfigurasi lengkap untuk `openrouter:web_search`.
  </Card>

  <Card title="Kisah pelanggan" icon="book-open" href="https://exa.ai/customers/openrouter" cta="Baca kisahnya" arrow="true">
    Cara OpenRouter menghadirkan web search ke ratusan model dengan Exa.
  </Card>
</Columns>