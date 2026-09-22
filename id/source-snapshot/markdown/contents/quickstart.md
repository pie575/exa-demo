> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Contents API {#contents-api}

> Ekstrak teks, kutipan, dan ringkasan dari URL mana pun.

Exa Contents mengembalikan konten halaman yang bersih dari URL, serta menangani halaman yang dirender dengan JavaScript, PDF, dan tata letak kompleks secara otomatis.

Semua fitur contents juga tersedia di [Exa Search](/id/docs/search/quickstart) untuk URL yang dikembalikan, tanpa biaya tambahan hingga 10 hasil per search ($1/1000 halaman setelahnya). Untuk kasus penggunaan tool web search, kami menyarankan penggunaan Search dengan cara ini alih-alih Contents.

<Tip>
  Untuk hasil search yang dijadikan konteks AI, gunakan `contents: { highlights: true }` pada `/search` —
  Exa menyesuaikan panjang kutipan setiap hasil dengan relevance-nya. Lihat [kutipan](/id/docs/search/highlights).
</Tip>

## Kirim permintaan pertama Anda {#make-your-first-request}

Berikan satu atau beberapa URL atau ID dokumen, lalu minta kutipan untuk bagian yang relevan dengan tugas Anda. Pada permintaan HTTP, cantumkan nilainya di `ids`:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and quality results"},
  )

  print(result.results[0].highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://exa.ai/blog/dynamic-highlights"],
    {
      highlights: {
        query: "token efficiency and quality results"
      }
    }
  );

  console.log(result.results[0].highlights);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://exa.ai/blog/dynamic-highlights"],
      "highlights": {
        "query": "token efficiency and quality results"
      }
    }'
  ```
</CodeGroup>

<Accordion title="Contoh response">
  ```json theme={null}
  {
    "requestId": "e492118ccdedcba5088bfc4357a8a125",
    "results": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "title": "Dynamic Highlights",
        "url": "https://exa.ai/blog/dynamic-highlights",
        "highlights": [
          "With a 12k character budget, relative to existing highlights, Dynamic Highlights achieves a 40% average token efficiency gain with a notable quality increase..."
        ]
      }
    ],
    "statuses": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "status": "success",
        "source": "cached"
      }
    ],
    "costDollars": {
      "total": 0.001
    }
  }
  ```
</Accordion>

Setiap item pada `results` memuat metadata halaman dan content view yang Anda minta. Periksa `statuses` untuk melihat keberhasilan atau kegagalan setiap URL.

<h2 id="dynamic-highlights">
  Bentuk output
</h2>

<Tabs>
  <Tab title="Kutipan">
    Kutipan mengembalikan bagian teks relevan yang disalin dari halaman. Mulailah dari sini untuk agent, RAG, dan
    pencarian fakta karena kutipan membuat konteks tetap lebih ringkas dibanding teks penuh.

    Setel `highlights: true` untuk mengaktifkan kutipan. Parameter `query` tambahan disarankan saat menggunakan Contents agar extraction konten dari halaman lebih terfokus:

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/research-paper"],
          highlights={"query": "methodology and results"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/research-paper"],
        {
          highlights: {
            query: "methodology and results"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/research-paper"],
          "highlights": {
            "query": "methodology and results"
          }
        }'
      ```
    </CodeGroup>

    Lihat [kutipan](/id/docs/search/highlights) untuk Dynamic kutipan dan instruksi cara mengalokasikan konteks
    di beberapa halaman.
  </Tab>

  <Tab title="Teks penuh">
    Teks penuh mengembalikan isi halaman yang sudah bersih dalam bentuk markdown. Gunakan ini bila tugas Anda bergantung pada konteks yang luas,
    struktur dokumen, atau detail yang mungkin tidak tercakup oleh kutipan.

    Halaman penuh bisa berukuran besar, jadi gunakan `maxCharacters` jika Anda perlu menetapkan batas:

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/technical-report"],
          text={"max_characters": 10000},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/technical-report"],
        {
          text: {
            maxCharacters: 10000
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/technical-report"],
          "text": {
            "maxCharacters": 10000
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Ringkasan">
    Ringkasan melakukan satu panggilan model bahasa untuk setiap halaman. Gunakan ini bila Anda membutuhkan gambaran umum hasil generasi model atau
    fields yang diekstrak ke dalam JSON schema.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/company"],
          summary={"query": "Summarize the product, customers, and pricing"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/company"],
        {
          summary: {
            query: "Summarize the product, customers, and pricing"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/company"],
          "summary": {
            "query": "Summarize the product, customers, and pricing"
          }
        }'
      ```
    </CodeGroup>

    Untuk mengekstrak fields alih-alih teks naratif, kirimkan JSON schema pada `summary.schema`. Ringkasan akan
    dikembalikan sebagai string JSON yang sesuai dengan schema tersebut; parse string itu untuk membaca fields-nya:

    ```json theme={null}
    {
      "ids": ["https://example.com/company"],
      "summary": {
        "schema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "title": "Company Information",
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "The company name" },
            "industry": { "type": "string", "description": "Primary industry" },
            "foundedYear": { "type": "number", "description": "Year the company was founded" }
          },
          "required": ["name"]
        }
      }
    }
    ```
  </Tab>
</Tabs>

Pilih satu content view per permintaan. Meminta kutipan, teks, dan ringkasan sekaligus akan mengembalikan sekaligus menagih setiap view secara terpisah.

## Kebaruan konten {#content-freshness}

`maxAgeHours` mengatur seberapa baru konten halaman yang diekstrak harus.

| Nilai                  | Perilaku                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Dihilangkan            | Gunakan konten cache bila tersedia dan ambil halaman bila diperlukan               |
| Bilangan bulat positif | Gunakan konten cache jika usianya kurang dari sekian jam, jika tidak ambil halaman |
| `0`                    | Selalu ambil konten terbaru                                                        |
| `-1`                   | Hanya gunakan konten cache                                                         |

Sebagian besar permintaan sebaiknya tidak menyertakan field ini. Setel field ini saat konten halaman yang basi tidak dapat digunakan, misalnya untuk harga, ketersediaan, atau halaman yang sering diperbarui. Pasangkan `maxAgeHours` yang rendah dengan `livecrawlTimeout` (milidetik) untuk membatasi durasi pengambilan konten terbaru.

<Accordion title="Migrasi dari parameter livecrawl yang usang">
  Parameter string `livecrawl` (`"always"`, `"preferred"`, `"fallback"`, `"never"`) sudah
  usang dan digantikan oleh `maxAgeHours`:

  | Nilai `livecrawl` lama | Padanan                                                                   |
  | ---------------------- | ------------------------------------------------------------------------- |
  | `"always"`             | `maxAgeHours: 0`                                                          |
  | `"never"`              | `maxAgeHours: -1`                                                         |
  | `"fallback"`           | Hilangkan `maxAgeHours`                                                   |
  | `"preferred"`          | Tidak ada padanan langsung; gunakan nilai rendah seperti `maxAgeHours: 1` |
</Accordion>

## Crawl subhalaman {#crawl-subpages}

Atur `subpages` untuk menelusuri tautan dari setiap URL awal. Tambahkan `subpageTarget` jika Anda ingin Exa memprioritaskan bagian situs tertentu:

<CodeGroup>
  ```python Python theme={null}
  result = exa.get_contents(
      ["https://docs.example.com"],
      subpages=10,
      subpage_target=["api", "reference", "guides"],
      highlights=True,
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.getContents(
    ["https://docs.example.com"],
    {
      subpages: 10,
      subpageTarget: ["api", "reference", "guides"],
      highlights: true
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://docs.example.com"],
      "subpages": 10,
      "subpageTarget": ["api", "reference", "guides"],
      "highlights": true
    }'
  ```
</CodeGroup>

## Gambar dan favicon {#images-and-favicons}

Atur `extras.imageLinks` sesuai jumlah URL gambar yang Anda inginkan dari setiap halaman. Hasil juga menyertakan
`favicon` situs dan URL `image` yang representatif jika tersedia. Pada `/search`, opsi ini
berada di `contents.extras.imageLinks`.

## Langkah selanjutnya {#next-steps}

<Columns cols={2}>
  <Card title="API reference" icon="square-terminal" href="/id/docs/reference/get-contents" cta="Buka referensi" arrow="true">
    Lihat setiap parameter permintaan dan field response.
  </Card>

  <Card title="kutipan" icon="highlighter" href="/id/docs/search/highlights" cta="Baca panduan" arrow="true">
    Bandingkan kutipan biasa dengan Dynamic kutipan untuk konteks agent dan RAG.
  </Card>

  <Card title="Search API" icon="search" href="/id/docs/search/quickstart" cta="Buka panduan" arrow="true">
    Temukan halaman yang relevan sebelum mengekstrak kontennya.
  </Card>

  <Card title="SDK" icon="code" href="/id/docs/sdks/quickstart" cta="Lihat SDK" arrow="true">
    Gunakan Exa dari Python atau JavaScript.
  </Card>
</Columns>