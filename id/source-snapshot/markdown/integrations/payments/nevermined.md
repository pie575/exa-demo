> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="nevermined">
  # Nevermined
</div>

> Pembayaran agent otonom untuk Exa melalui card delegation x402 dari Nevermined. Pembelian senilai 7 USD akan menyediakan atau mengisi ulang Exa API key dengan credits senilai 7 USD.

Agent membayar Exa dengan kartu kredit melalui skema [x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation) milik [Nevermined](https://nevermined.ai). Setiap **pembelian $7** menghasilkan satu Exa API key dengan **credits Exa senilai $7**.

<Info>
  Gunakan plan ID Nevermined berikut:<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />Plan ini berjalan di lingkungan live Nevermined (API key berawalan live). Pembelian ini ditujukan untuk credits API, bukan untuk satu search request.
</Info>

Bagi pembayar Nevermined yang baru pertama kali, `POST /team-management/nevermined/purchase-key` akan menyediakan Exa API key baru sekaligus menambahkan credits senilai $7. Jika key habis, buat token x402 baru dengan delegation yang sama lalu panggil kembali endpoint tersebut. Exa akan mengembalikan API key yang sama dengan tambahan credits senilai $7.

<div id="buy-a-key">
  ## Beli key
</div>

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **Biaya:** $7 per pembelian, dibebankan ke kartu di balik delegation yang dirujuk oleh token x402.
* **Respons (pembayar baru):** `{ status: "ok", apiKey: "…", expiresAt: null }` — Exa API key baru dengan credit senilai $7.
* **Respons (pembayar lama):** `{ status: "ok", apiKey: "…", expiresAt: null }` — Exa API key yang sama dengan tambahan credit $7.
* **Respons (token yang di-replay):** hasil dari cache, tanpa biaya baru.
* **Signature hilang/tidak valid:** `402 Payment Required` dengan persyaratan pembayaran di dalam body.

<div id="how-it-works">
  ## Cara kerjanya
</div>

Sisi payment ditangani oleh Nevermined; Exa hanya melihat token x402 yang sudah ditandatangani.

1. **Penyiapan satu kali (oleh pemilik kartu):** daftarkan kartu di [nevermined.app](https://nevermined.app), buat **delegation** pada kartu tersebut (izin pembelanjaan: pemilik menetapkan limit dan durasi, serta dapat membatasi scope-nya ke API key tertentu), lalu terbitkan Nevermined API key untuk agent.
2. **Agent menemukan delegation miliknya.** Nevermined SDK memungkinkan agent menemukan delegation yang dapat dibelanjakan oleh key-nya dan memilih salah satu yang sisa anggarannya mencukupi (minimal $7). Jika belum ada, pemilik dapat membuatnya di dashboard, atau agent yang sepenuhnya otonom dapat membuatnya melalui SDK dalam batas limit kartu.
3. **Agent mencetak x402 access token** untuk plan ID di atas, pada skema card-delegation, dengan merujuk delegation berdasarkan ID. Delegation harus sudah ada sebelum pencetakan; token tidak dapat membuatnya secara spontan.
4. **Agent melakukan POST token ke endpoint di atas** melalui header `payment-signature` dan menerima Exa API key dari respons.
5. **Key langsung dapat digunakan** pada [Exa Search API](/id/docs/search/quickstart) standar.

Untuk panduan lengkap yang siap dipakai agent (metode SDK, parameter, penemuan dan pembuatan delegation, pemecahan masalah), ikuti Exa integration guide dari Nevermined: [nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agent: ambil [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)).

<div id="what-7-buys">
  ## Apa yang bisa didapat dengan $7
</div>

Credits digunakan sesuai harga standar Exa API. Dengan rates saat ini, $7 credits kira-kira mencakup:

| Endpoint atau fitur                                         |                               Harga |      Perkiraan usage |
| ----------------------------------------------------------- | ----------------------------------: | -------------------: |
| Search (`instant`, `fast`, `auto`) dengan maksimal 10 hasil |               $7 / 1.000 permintaan |     1.000 permintaan |
| Deep-Lite Search                                            |              $10 / 1.000 permintaan |       700 permintaan |
| Deep Search                                                 |              $12 / 1.000 permintaan |      ~583 permintaan |
| Deep-Reasoning Search                                       |              $15 / 1.000 permintaan |      ~466 permintaan |
| Contents (`text`, `highlights`, atau `summary`)             | $1 / 1.000 halaman per jenis konten |        7.000 halaman |
| AI page summaries pada Search atau Contents                 |                  $1 / 1.000 halaman |      7.000 summaries |
| Hasil tambahan di luar 10 hasil pertama                     |                    $1 / 1.000 hasil | 7.000 hasil tambahan |
| Answer                                                      |               $5 / 1.000 permintaan |     1.400 permintaan |
| Monitors                                                    |              $15 / 1.000 permintaan |      ~466 permintaan |

Search request sudah mencakup text dan highlights untuk maksimal 10 hasil. Hasil tambahan di luar 10 hasil tersebut dan AI summaries ditagih terpisah.<br />
Untuk detail harga lengkap, lihat [harga Exa](https://exa.ai/pricing).

<div id="when-the-key-runs-out">
  ## Ketika key habis
</div>

Exa mengembalikan **`HTTP 402`** pada endpoint API biasa begitu credits pada API key habis:

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

Buat token x402 baru dengan plan ID dan delegation yang sama, lalu kirim ulang melalui POST ke endpoint `/purchase-key` yang sama. Exa akan menambahkan credits senilai $7 lagi ke API key yang sama.

<div id="references">
  ## Referensi
</div>

* [Panduan integrasi Exa dari Nevermined](https://nevermined.ai/docs/integrations/exa)
* [Spesifikasi card-delegation x402](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Harga Exa](https://exa.ai/pricing)
* [Exa Search API](/id/docs/search/quickstart)