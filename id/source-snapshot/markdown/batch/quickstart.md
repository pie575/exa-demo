> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="batch-api">
  # Batch API
</div>

> Jalankan permintaan Exa API secara asinkron dalam batch.

<Info>
  Batch API tersedia untuk pelanggan Enterprise setelah Exa mengaktifkannya untuk team Anda. Hubungi [sales@exa.ai](mailto:sales@exa.ai) untuk membahas akses dan pengaktifan Enterprise.
</Info>

Batch API memungkinkan Anda mengirim banyak permintaan Exa API sekaligus dan mengambil hasilnya kemudian dalam bentuk file JSONL. Alih-alih mengirim ribuan permintaan satu per satu serta mengelola sendiri rate limit dan percobaan ulang, Anda cukup mengirim satu batch, melakukan poll terhadap statusnya, lalu mengunduh semua hasil dalam satu file.

Gunakan ini untuk enrichment offline, backfill, atau pekerjaan lain yang tidak memerlukan response seketika. Schema lengkap untuk permintaan dan response tersedia di [API reference](/id/docs/reference/batches/create-a-batch).

<Note>
  Batch API masih dalam tahap beta. Sertakan header `Exa-Beta: batches-2026-06-06` pada setiap permintaan.
</Note>

<div id="supported-requests">
  ## Permintaan yang didukung
</div>

Setiap item batch harus berupa permintaan `POST` ke salah satu route berikut:

| Route         | Kasus penggunaan                                  |
| ------------- | ------------------------------------------------- |
| `/search`     | Menjalankan permintaan Exa search secara asinkron |
| `/agent/runs` | Menjalankan permintaan Exa Agent secara asinkron  |

Setiap item memerlukan `customId` yang unik dalam satu batch. `customId` yang sama dikembalikan pada file hasil sehingga Anda dapat memetakan baris output kembali ke data input Anda.

<div id="create-a-batch">
  ## Membuat batch
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/batches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06" \
    -H "Content-Type: application/json" \
    -d '{
      "requests": [
        {
          "customId": "row-1",
          "method": "POST",
          "url": "/search",
          "body": {
            "query": "Latest AI infrastructure funding rounds"
          }
        },
        {
          "customId": "row-2",
          "method": "POST",
          "url": "/agent/runs",
          "body": {
            "query": "Summarize recent vector database launches"
          }
        }
      ],
      "metadata": {
        "project": "weekly-digest"
      }
    }'
  ```
</CodeGroup>

Response berisi ID batch dan status awalnya:

<Accordion title="Contoh response">
  ```json theme={null}
  {
    "id": "batch_01j7x9v0m2n4p6q8r0s2t4v6w8",
    "object": "batch",
    "status": "in_progress",
    "requestCounts": {
      "total": 2,
      "completed": 0,
      "failed": 0
    },
    "createdAt": "2026-06-06T12:00:00.000Z",
    "expiresAt": null,
    "endedAt": null,
    "resultsUrl": null,
    "metadata": {
      "project": "weekly-digest"
    }
  }
  ```
</Accordion>

<div id="check-status">
  ## Cek status
</div>

Poll batch hingga mencapai status terminal:

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

Status batch yang tersedia:

| Status        | Arti                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| `in_progress` | Batch sedang berjalan                                                         |
| `completed`   | Semua permintaan telah selesai dan hasil sudah tersedia                       |
| `cancelling`  | Pembatalan telah diminta dan pekerjaan yang masih berjalan sedang dituntaskan |
| `cancelled`   | Batch telah dibatalkan                                                        |
| `expired`     | Hasil sudah tidak tersedia lagi                                               |

Saat batch selesai, `resultsUrl` berisi URL unduhan untuk file hasil JSONL, dan `expiresAt` diatur ke akhir masa penyimpanan hasil.

<Warning>
  `resultsUrl` adalah URL presigned yang berumur pendek. Ambil ulang batch untuk mendapatkan URL baru setiap kali Anda perlu mengunduh hasil kembali.
</Warning>

<div id="list-batches">
  ## Daftar batch
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches?limit=100" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

Response ini menggunakan paginasi berbasis cursor: `data` berisi maksimal sebanyak `limit` batch, dan jika `hasMore` bernilai `true`, kirimkan `nextCursor` sebagai parameter query `cursor` untuk mengambil halaman berikutnya.

Kirimkan `status=completed` untuk menampilkan hanya batch yang sudah selesai:

```bash theme={null}
curl -s "https://api.exa.ai/batches?status=completed" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Exa-Beta: batches-2026-06-06"
```

`completed` adalah satu-satunya nilai yang didukung; nilai lainnya akan mengembalikan error. Listing yang telah selesai diurutkan berdasarkan waktu kedaluwarsa dan menggunakan cursor tersendiri, jadi tetap kirimkan `status=completed` di setiap halaman — cursor untuk hasil `completed` dan cursor tanpa filter tidak bisa saling dipertukarkan.

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

<div id="download-results">
  ## Unduh hasil
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

Setiap baris JSONL berisi `customId` asli beserta `response` atau `error`:

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

<div id="cancel-a-batch">
  ## Membatalkan batch
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="delete-a-batch">
  ## Menghapus batch
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="access">
  ## Akses
</div>

Untuk mengaktifkan Batch API bagi sebuah team, hubungi [sales@exa.ai](mailto:sales@exa.ai).