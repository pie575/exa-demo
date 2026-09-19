> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="pay-with-mpp-tempo">
  # Bayar dengan MPP (Tempo)
</div>

> Panggil API Search dan Contents milik Exa tanpa API key dengan membayar per permintaan menggunakan USDC.e di Tempo.

<div id="what-is-mpp">
  ## Apa itu MPP?
</div>

MPP (Machine Payments Protocol) adalah standar pembayaran terbuka dan HTTP-native yang dibangun di atas status code `402 Payment Required`. Standar ini memungkinkan klien membayar akses API per permintaan menggunakan berbagai metode pembayaran, termasuk stablecoin di [Tempo](https://tempo.xyz), tanpa perlu akun, API key, maupun langganan. Contoh pada halaman ini menggunakan Tempo; saat ini Exa menyelesaikan pembayaran MPP dalam USDC.e di Tempo mainnet.

Exa mendukung MPP pada dua endpoint: **`/search`** dan **`/contents`**. Ketika Anda mengirim permintaan tanpa API key atau payment credential, Exa merespons dengan `402` beserta challenge `WWW-Authenticate: Payment` yang memuat informasi harga dan cara membayar. Klien Anda menandatangani pembayaran, mengirim ulang permintaan dengan credential `Authorization: Payment`, lalu menerima hasilnya setelah pembayaran tuntas on-chain.

Pendekatan ini sangat cocok untuk **AI agents** yang perlu membayar web search secara mandiri tanpa credential yang sudah di-provisioned sebelumnya.

<Info>
  MPP dan akses melalui API key bersifat independen. Jika permintaan Anda menyertakan header `x-api-key`, alur API key billing biasa yang digunakan dan MPP dilewati sepenuhnya.
</Info>

<div id="supported-endpoints">
  ## Endpoint yang didukung
</div>

| Endpoint    | Metode | Deskripsi                                                                                              |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `/search`   | POST   | Web search dengan semua search type (`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`) |
| `/contents` | POST   | Pengambilan konten berdasarkan URL atau ID dokumen                                                     |

Endpoint Exa lainnya *belum* menerima pembayaran MPP.

<div id="get-started">
  ## Mulai
</div>

Anda memerlukan wallet yang kompatibel dengan Tempo dan sudah terisi dana USDC.e. Ekspor private key wallet Anda sebelum menjalankan contoh:

```bash theme={null}
export WALLET_PRIVATE_KEY="0x..."
```

<div id="install-the-client">
  ### Instal klien
</div>

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

<div id="make-a-paid-search-request">
  ### Membuat search request berbayar
</div>

Gunakan klien MPP untuk menandatangani dan mengirimkan payment untuk sebuah search request:

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={"query": "best machine learning frameworks", "numResults": 5},
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

Run yang berhasil akan mencetak hasil search beserta header `Payment-Receipt` yang berisi hash transaksi on-chain.

<div id="pay-from-the-command-line">
  ## Bayar dari baris perintah
</div>

Jika Anda tidak ingin repot mengelola private key secara langsung, gunakan Tempo Wallet CLI. Perintah `tempo wallet login` akan membuat atau menghubungkan wallet Tempo, mengotorisasi access key lokal, dan dapat menyertakan MPP Credits gratis untuk pendaftaran baru.

<div id="install-and-authenticate">
  ### Instal dan autentikasi
</div>

```bash theme={null}
curl -fsSL https://tempo.xyz/install | bash
tempo add wallet
tempo add request
tempo wallet login
```

Pada host remote tanpa browser lokal, gunakan `tempo wallet login --no-browser` lalu buka URL yang ditampilkan di perangkat Anda untuk mengotorisasi CLI.

<div id="check-balances-and-credits">
  ### Memeriksa saldo dan credits
</div>

```bash theme={null}
tempo wallet whoami
tempo wallet whoami --credits
```

<div id="make-a-paid-request">
  ### Buat permintaan berbayar
</div>

```bash theme={null}
tempo request --max-spend 1.00 https://api.exa.ai/search \
  --json '{"query": "Series A fintech companies", "numResults": 5}'
```

`tempo request` mencegat challenge `402 Payment Required`, melakukan payment, lalu mengulang permintaan secara otomatis.

Untuk referensi CLI lengkap, lihat [dokumentasi Tempo Wallet CLI](https://tempo.xyz/developers/docs/cli/wallet) dan [dokumentasi `tempo request`](https://tempo.xyz/developers/docs/cli/request).

<div id="gas-fees">
  ## Biaya gas
</div>

Exa menanggung biaya jaringan Tempo dan membayarnya dalam USDC.e. Wallet Anda hanya perlu memiliki USDC.e yang cukup untuk biaya API; tidak perlu ada saldo pathUSD atau token gas lainnya. Anda tidak perlu mengonfigurasi pembayar biaya. Payment challenge dari Exa dan MPP SDK menangani sponsorship secara otomatis.

<div id="pricing">
  ## Harga
</div>

MPP menggunakan skema harga paket yang sama seperti billing API key. Exa menghitung harga berdasarkan parameter permintaan sebelum memproses permintaan tersebut.

<div id="search">
  ### Search
</div>

| Search type               | Harga untuk maksimal 10 hasil |
| ------------------------- | ----------------------------- |
| `instant`, `auto`, `fast` | $0,007 per permintaan         |
| `deep-lite`, `deep`       | $0,012 per permintaan         |
| `deep-reasoning`          | $0,015 per permintaan         |

Menambahkan `contents.summary` dikenakan biaya tambahan **$0,001 per hasil**.

<Warning>
  Permintaan search MPP dibatasi maksimal 10 hasil. Jika `numResults` lebih dari 10, Exa tetap menggunakan 10 dan menagihkan permintaan tersebut untuk 10 hasil. Jika Anda membutuhkan lebih banyak, gunakan [API key billing](/id/docs/search/quickstart).
</Warning>

<div id="contents">
  ### Contents
</div>

Setiap jenis konten yang diminta dikenakan biaya $0,001 per URL:

| Jenis konten | Harga per URL |
| ------------ | ------------- |
| `text`       | $0,001        |
| `highlights` | $0,001        |
| `summary`    | $0,001        |

Jika Anda tidak meminta `text`, `highlights`, atau `summary`, Exa mengaktifkan `text` secara bawaan.

<div id="pricing-examples">
  ### Contoh harga
</div>

| Permintaan                                          | Harga  |
| --------------------------------------------------- | ------ |
| `/search` dengan `type: "auto"`                     | $0.007 |
| `/search` dengan 3 hasil dan `contents.summary`     | $0.010 |
| `/search` dengan `type: "deep"`                     | $0.012 |
| `/contents` untuk 2 URL dengan `text: true`         | $0.002 |
| `/contents` untuk 1 URL dengan `text` dan `summary` | $0.002 |

<div id="how-the-payment-flow-works">
  ## Cara kerja payment flow
</div>

SDK mengotomatiskan alur ini, tetapi Anda dapat memeriksanya langsung melalui HTTP:

1. Kirim permintaan tanpa API key atau payment credential. Exa mengembalikan `402` beserta challenge `WWW-Authenticate: Payment` yang memuat harga, token, penerima, jaringan, dan detail sponsorship.
2. Tanda tangani challenge tersebut, lalu kirim ulang permintaan dengan `Authorization: Payment <credential>`.
3. Exa memproses permintaan sambil melakukan settlement payment. Setelah settlement terkonfirmasi, Exa mengembalikan hasilnya beserta header `Payment-Receipt`. Jika settlement gagal, Exa mengembalikan `402` dengan challenge baru dan tanpa hasil.

<div id="inspect-a-payment-challenge">
  ### Memeriksa payment challenge
</div>

Anda dapat memeriksa harga dan detail pembayaran tanpa wallet:

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "numResults": 3}'
```

Cari header `WWW-Authenticate: Payment` pada respons `402`. Permintaan discovery yang belum dibayar memiliki batas laju (rate limit), jadi gunakan ini untuk keperluan debugging, bukan untuk polling.

<div id="payment-reference">
  ## Referensi pembayaran
</div>

Exa menerima pembayaran MPP dalam USDC.e di Tempo mainnet.

| Jaringan      | Identifier    | Token  | Aset                                         |
| ------------- | ------------- | ------ | -------------------------------------------- |
| Tempo mainnet | `eip155:4217` | USDC.e | `0x20c000000000000000000000b9537d11c60e8b50` |

USDC.e memiliki 6 angka desimal. Challenge menyatakan harga dalam satuan atomik, sehingga `7000` berarti $0,007 dan `1000000` berarti $1,00.

<Note>
  Exa mendukung MPP dan [x402](/id/docs/integrations/payments/x402/quickstart) pada endpoint yang sama. Respons `402` yang belum terautentikasi dapat memuat challenge MPP `WWW-Authenticate: Payment` sekaligus header x402 `PAYMENT-REQUIRED`. Gunakan header yang sesuai dengan protokol pembayaran yang didukung klien Anda.
</Note>

<div id="headers">
  ### Header
</div>

| Header                                | Arah             | Deskripsi                                             |
| ------------------------------------- | ---------------- | ----------------------------------------------------- |
| `Authorization: Payment <credential>` | Permintaan       | Payment credential MPP                                |
| `WWW-Authenticate: Payment`           | Respons `402`    | Harga dan instruksi payment untuk permintaan tersebut |
| `Payment-Receipt`                     | Respons berhasil | Settlement receipt, termasuk hash transaksi on-chain  |

<div id="errors">
  ### Error
</div>

| Status | Deskripsi                                                                         |
| ------ | --------------------------------------------------------------------------------- |
| `402`  | Payment credential tidak ada atau tidak valid; respons menyertakan challenge baru |
| `402`  | Jumlah payment tidak sesuai dengan harga permintaan, atau settlement gagal        |
| `429`  | IP ini mengirim terlalu banyak unpaid discovery request                           |
| `429`  | Wallet ini melampaui rate limit permintaan berbayar                               |

<div id="rate-limits">
  ### Rate limit
</div>

Rate limit MPP digunakan bersama dengan x402 dan terpisah dari limit API key:

| Limit                           | Ambang     | Rentang Waktu |
| ------------------------------- | ---------- | ------------- |
| Unpaid discovery request per IP | 5 request  | 60 detik      |
| Request berbayar per wallet     | 10 request | 1 detik       |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Bisakah saya menggunakan MPP dan API key sekaligus?">
    Jika permintaan Anda menyertakan header `x-api-key`, alur API key yang diprioritaskan dan MPP dilewati. Keduanya tidak bisa digabungkan. Setiap permintaan hanya memakai salah satunya.
  </Accordion>

  <Accordion title="Apa yang terjadi jika settlement gagal setelah permintaan saya diproses?">
    Respons Anda diblokir. Anda akan menerima `402` beserta challenge `WWW-Authenticate: Payment` yang baru sehingga klien Anda dapat mencoba lagi. Tidak ada hasil yang dikembalikan sampai settlement berhasil.
  </Accordion>

  <Accordion title="Wallet apa saja yang didukung?">
    Semua wallet EVM yang kompatibel dengan Tempo dan bisa dipakai menandatangani lewat SDK klien — akun `viem` dengan `mppx` (TypeScript), atau key `eth-account` dengan `pympp` (Python). Untuk AI agents, gunakan wallet dengan saldo USDC.e di Tempo untuk menutupi biaya permintaan.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Sumber Daya
</div>

* [Dokumentasi protokol MPP](https://mpp.dev/protocol): detail protokol dan format autentikasi
* [Dokumentasi mppx](https://mpp.dev/sdk/typescript): SDK reference MPP untuk TypeScript
* [Dokumentasi pympp](https://mpp.dev/sdk/python): SDK reference MPP untuk Python
* [Tempo](https://tempo.xyz): dokumentasi jaringan Tempo
* [Bayar dengan x402](/id/docs/integrations/payments/x402/quickstart): bayar endpoint yang sama menggunakan x402
* [Panduan Exa Search API](/id/docs/search/quickstart): referensi lengkap parameter search
* [Panduan Exa Contents API](/id/docs/contents/quickstart): referensi lengkap parameter contents