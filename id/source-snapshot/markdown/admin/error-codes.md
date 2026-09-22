> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="error-codes">
  # Error Codes
</div>

> Referensi untuk error codes umum yang digunakan oleh Exa API

Exa API menandakan kegagalan melalui kode status HTTP standar dan error body dalam format JSON.

<div id="http-status-codes">
  ## Kode status HTTP
</div>

| Kode                        | Arti                                                                                                                                   | Yang harus dilakukan                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400` Bad Request           | Body, query parameter, header, atau kombinasi opsi tidak valid.                                                                        | Perbaiki permintaan berdasarkan pesan yang dikembalikan.                                                                                                      |
| `401` Unauthorized          | API key tidak ada atau tidak valid.                                                                                                    | Periksa header autentikasi dan API key.                                                                                                                       |
| `402` Payment Required      | Credits habis atau anggaran pengeluaran terlampaui.                                                                                    | [Isi ulang credits](https://dashboard.exa.ai) atau hubungi administrator team Anda.                                                                           |
| `403` Forbidden             | API key tidak memiliki akses ke fitur yang diminta, atau permintaan diblokir oleh kebijakan.                                           | Periksa pesan yang dikembalikan dan akses fitur pada plan Anda.                                                                                               |
| `404` Not Found             | Rute atau sumber daya yang diminta tidak ada.                                                                                          | Periksa endpoint dan ID sumber daya.                                                                                                                          |
| `409` Conflict              | Permintaan bertentangan dengan state yang ada — misalnya, Webset dengan `externalId` yang sama sudah ada.                              | Ambil sumber daya yang sudah ada atau gunakan identifier lain.                                                                                                |
| `422` Unprocessable Entity  | Query preview Websets tidak dapat diuraikan menjadi entitas dan kriteria yang valid.                                                   | Ubah susunan query preview.                                                                                                                                   |
| `429` Too Many Requests     | API key, team, atau jaringan Anda melampaui batas laju atau konkurensi.                                                                | Kurangi laju permintaan Anda; tunggu selama `Retry-After` detik bila tersedia, jika tidak gunakan exponential backoff.                                       |
| `500` Internal Server Error | Terjadi error server yang tidak terduga.                                                                                               | Coba lagi setelah jeda singkat. Hubungi dukungan jika masih berlanjut.                                                                                        |
| `503` Service Unavailable   | Exa sedang melebihi kapasitas (`SERVICE_OVERLOADED`) atau tidak tersedia untuk sementara. Permintaan tidak diproses dan tidak ditagih. | Coba lagi dengan exponential backoff. Hal ini tidak bergantung pada laju permintaan Anda, jadi menguranginya tidak membantu — yang membantu adalah mencoba lagi. |
| `504` Gateway Timeout       | Permintaan melampaui batas waktu pemrosesannya.                                                                                        | Coba lagi permintaan tersebut atau persempit cakupannya.                                                                                                      |

<Note>
  Kegagalan di tingkat URL dari `/contents` dilaporkan pada field `statuses` dalam response `200` yang berhasil, bukan sebagai error di tingkat permintaan. Lihat [Content fetch status tags](#content-fetch-status-tags).
</Note>

<div id="error-response-structure">
  ## Struktur response error
</div>

Response error mengembalikan `requestId`, pesan `error` yang mudah dibaca manusia, dan `tag` yang dapat dibaca mesin:

```json theme={null}
{
  "requestId": "67207943fab9832d162b5317f4cca830",
  "error": "Invalid request body | Validation error: Invalid value for type",
  "tag": "INVALID_REQUEST_BODY"
}
```

<Note>
  Sertakan `requestId` saat menghubungi tim dukungan agar pemecahan masalah lebih cepat.
</Note>

Kumpulan tag bersifat terbuka dan nama tag cukup jelas dengan sendirinya. Lakukan percabangan berdasarkan kode status HTTP terlebih dahulu, dan perlakukan tag yang tidak dikenali sebagai detail tambahan, bukan sebagai kegagalan parsing.

<div id="common-error-tags">
  ## Tag error umum
</div>

<div id="account-billing-and-access">
  ### Akun, billing, dan akses
</div>

| Tag                       | HTTP code | Deskripsi                                                                                                                          |
| ------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `INVALID_API_KEY`         | `401`     | API key tidak disertakan, kosong, atau tidak valid.                                                                                |
| `NO_MORE_CREDITS`         | `402`     | Akun tidak memiliki sisa credits — isi ulang di [dashboard.exa.ai](https://dashboard.exa.ai).                                      |
| `API_KEY_BUDGET_EXCEEDED` | `402`     | API key melampaui batas anggaran pengeluarannya — hubungi administrator team Anda.                                                 |
| `TEAM_BUDGET_EXCEEDED`    | `402`     | Team melampaui anggaran pengeluarannya untuk periode billing saat ini.                                                             |
| `FEATURE_DISABLED`        | `403`     | Endpoint, search type, atau opsi yang diminta tidak aktif untuk plan Anda.                                                         |
| `PROHIBITED_CONTENT`      | `403`     | Permintaan ditolak oleh moderasi keamanan konten.                                                                                  |
| `CONTENT_FILTER_ERROR`    | `403`     | Konten ditolak oleh kebijakan keamanan saat pemrosesan.                                                                            |
| `RATE_LIMIT_EXCEEDED`     | `429`     | API key, team, atau jaringan Anda melampaui rate limit-nya — kurangi laju permintaan Anda.                                         |
| `SERVICE_OVERLOADED`      | `503`     | Exa sedang kelebihan kapasitas untuk sementara dan menolak permintaan sebelum memprosesnya — coba lagi dengan exponential backoff. |

<div id="request-validation">
  ### Validasi permintaan
</div>

| Tag                       | HTTP code | Deskripsi                                                                         |
| ------------------------- | --------- | --------------------------------------------------------------------------------- |
| `INVALID_REQUEST_BODY`    | `400`     | Body JSON tidak lolos validasi schema.                                            |
| `INVALID_REQUEST`         | `400`     | Options saling bertentangan, atau feature beta digunakan tanpa header `Exa-Beta`. |
| `INVALID_NUM_RESULTS`     | `400`     | `numResults` harus ≤ 100 jika kutipan diminta.                                    |
| `NUM_RESULTS_EXCEEDED`    | `400`     | Jumlah hasil yang diminta melebihi batas plan Anda.                               |
| `INVALID_JSON_SCHEMA`     | `400`     | Schema output yang diberikan tidak valid.                                         |
| `SUBPAGES_LIMIT_EXCEEDED` | `400`     | `/contents` hanya mengizinkan maksimal 100 subhalaman per permintaan.             |

<div id="payment-protocols">
  ### Protokol payment
</div>

Permintaan yang dibayar melalui x402 atau MPP juga dapat mengembalikan:

| Tag                        | HTTP code | Deskripsi                                         |
| -------------------------- | --------- | ------------------------------------------------- |
| `X402_PAYMENT_REQUIRED`    | `402`     | Payment diperlukan.                               |
| `X402_INVALID_SIGNATURE`   | `400`     | Signature payment x402 tidak valid.               |
| `X402_VERIFICATION_FAILED` | `402`     | Payment x402 tidak dapat diverifikasi.            |
| `MPP_VERIFICATION_FAILED`  | `402`     | Payment MPP tidak dapat diverifikasi.             |
| `X402_TOO_MANY_UNPAID`     | `429`     | Terlalu banyak permintaan x402 menunggu payment.  |
| `X402_WALLET_RATE_LIMITED` | `429`     | Wallet x402 melampaui rate limit-nya.             |
| `X402_INTERNAL_ERROR`      | `500`     | Exa tidak dapat membuat persyaratan payment x402. |

<div id="content-fetch-status-tags">
  ## Konten fetch status tags
</div>

Ketika `/contents` menerima beberapa URL, salah satu URL bisa gagal sementara URL lainnya berhasil. Kegagalan di tingkat URL dikembalikan pada field `statuses` dan tidak menggagalkan permintaan:

```json theme={null}
{
  "results": [],
  "statuses": [
    {
      "id": "https://example.com",
      "status": "error",
      "error": {
        "tag": "CRAWL_NOT_FOUND",
        "httpStatusCode": 404
      }
    }
  ]
}
```

`httpStatusCode` menggambarkan halaman target, bukan response `/contents`.

| Tag                       | Deskripsi                                                    | Cara menangani                                              |
| ------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| `CRAWL_NOT_FOUND`         | Halaman target tidak ditemukan.                              | Pastikan URL benar dan dapat diakses.                       |
| `CRAWL_HTTP_{status}`     | Target mengembalikan error HTTP, misalnya `CRAWL_HTTP_403`.  | Tangani status target yang tersemat.                        |
| `CRAWL_TIMEOUT`           | Crawl habis waktu saat mengambil halaman target.             | Ulangi permintaan atau coba lagi nanti.                     |
| `CRAWL_LIVECRAWL_TIMEOUT` | Retrieval langsung melebihi `livecrawlTimeout` yang diminta. | Naikkan `livecrawlTimeout` atau sesuaikan `maxAgeHours`.    |
| `SOURCE_NOT_AVAILABLE`    | Akses ke source ditolak atau source tidak tersedia.          | Periksa apakah source memerlukan autentikasi atau dibatasi. |
| `UNSUPPORTED_URL`         | Skema URL tidak didukung untuk pengambilan konten.           | Gunakan URL HTTP atau HTTPS standar.                        |
| `CRAWL_UNKNOWN_ERROR`     | Crawl gagal karena alasan lain.                              | Ulangi permintaan; hubungi dukungan jika terus berlanjut.   |

Status tag ini khusus untuk `/contents`; `/search` tidak mengembalikan field `statuses`.

<div id="getting-help">
  ## Mendapatkan bantuan
</div>

* Periksa [Exa Status](/id/docs/admin/status) jika error `500`, `503`, atau `504` terus terjadi.
* Periksa [Rate Limits](/id/docs/admin/billing#rate-limits) untuk mengetahui batas saat ini.
* Tinjau [API referensi](/id/docs/reference/search) endpoint terkait untuk mengetahui persyaratan permintaan.
* Hubungi [hello@exa.ai](mailto:hello@exa.ai) dengan menyertakan status response, error body, dan `requestId`.