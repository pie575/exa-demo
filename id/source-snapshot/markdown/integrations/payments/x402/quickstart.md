> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="pay-with-x402">
  # Bayar dengan x402
</div>

> Gunakan API Search dan Contents dari Exa tanpa API key. Bayar per permintaan menggunakan USDC di Base atau Solana melalui protokol x402.

<div id="what-is-x402">
  ## Apa itu x402?
</div>

[x402](https://x402.org) adalah standar payment terbuka yang dibangun di atas kode status HTTP `402 Payment Required`. Standar ini memungkinkan klien membayar akses API per permintaan menggunakan stablecoin USDC di Base atau Solana, tanpa perlu akun, API key, maupun langganan.

Exa mendukung x402 pada dua endpoint: **`/search`** dan **`/contents`**. Ketika Anda mengirim permintaan tanpa API key atau header payment, Exa merespons dengan `402` beserta header `PAYMENT-REQUIRED` yang berisi detail harga serta jaringan payment yang didukung. Klien Anda menandatangani payment USDC, mengirim ulang permintaan dengan header `PAYMENT-SIGNATURE`, lalu menerima hasilnya begitu settlement terkonfirmasi on-chain.

Ini ideal untuk **AI agents** yang perlu membayar web search secara otonom tanpa credential yang di-provisioned terlebih dahulu.

<Info>
  x402 dan akses melalui API key bersifat independen. Jika permintaan Anda menyertakan header `x-api-key` atau `Authorization: Bearer`, alur API key billing biasa yang digunakan dan x402 dilewati sepenuhnya.
</Info>

<div id="supported-endpoints">
  ## Endpoint yang didukung
</div>

| Endpoint    | Metode | Deskripsi                                                                                              |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `/search`   | POST   | Web search dengan semua search type (`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`) |
| `/contents` | POST   | Pengambilan konten berdasarkan URL atau ID dokumen                                                     |

Semua endpoint lainnya **tidak** tersedia melalui x402.

<div id="how-it-works">
  ## Cara kerjanya
</div>

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/payments/x402/payment-flow.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a560d80bb84828e03dfacd61351e9fb" alt="Diagram urutan x402 payment flow: Klien mengirim permintaan ke server, menerima 402 beserta header PAYMENT-REQUIRED, membuat payload payment, mengirim ulang permintaan dengan PAYMENT-SIGNATURE, server melakukan verifikasi melalui facilitator, memproses permintaan, menyelesaikan transaksi on-chain, lalu mengembalikan 200 berisi hasil dan PAYMENT-RESPONSE" width="4224" height="2720" data-path="images/integrations/payments/x402/payment-flow.png" />
</Frame>

<div id="step-1-discovery">
  ### Langkah 1: Discovery
</div>

Kirim permintaan ke endpoint yang didukung tanpa API key atau header payment:

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "best machine learning frameworks", "numResults": 5}'
```

Anda akan menerima respons `402` dengan header `PAYMENT-REQUIRED` yang dienkode base64. Setelah didekode, isinya terlihat seperti ini:

```json theme={null}
{
  "x402Version": 2,
  "resource": {
    "url": "https://api.exa.ai/search",
    "description": "Exa /search endpoint"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:8453",
      "amount": "7000",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "payTo": "0x...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2" }
    },
    {
      "scheme": "exact",
      "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      "amount": "7000",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "payTo": "...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2", "feePayer": "..." }
    }
  ]
}
```

`amount` dinyatakan dalam satuan atomik USDC (6 desimal), sehingga `"7000"` = $0,007.
Klien dapat melakukan payment dengan entri `accepts` mana pun yang diiklankan dan didukungnya. Entri Solana menyertakan field yang disediakan facilitator seperti `extra.feePayer`; gunakan entri yang persis sama dari header `PAYMENT-REQUIRED` saat menyusun payment.

<div id="step-2-pay-and-retry">
  ### Langkah 2: Bayar dan coba lagi
</div>

Tanda tangani payment dengan wallet Anda, lalu kirim ulang permintaan tersebut dengan header `PAYMENT-SIGNATURE` yang berisi payload payment Anda dalam format base64. SDK klien x402 menangani hal ini secara otomatis.

<div id="step-3-settlement">
  ### Langkah 3: Settlement
</div>

Exa memverifikasi signature payment Anda melalui facilitator, lalu memulai settlement on-chain **secara paralel** dengan pemrosesan permintaan Anda. Respons ditahan sampai settlement terkonfirmasi. Jika berhasil, Anda akan menerima:

* HTTP `200` berisi hasil Anda
* Header `PAYMENT-RESPONSE` yang memuat settlement receipt (dikodekan base64), termasuk hash transaksi on-chain

Jika settlement gagal, Anda akan mendapatkan `402` beserta `PAYMENT-RESPONSE` (detail error) dan `PAYMENT-REQUIRED` (sehingga Anda bisa mencoba lagi).

<div id="pricing">
  ## Harga
</div>

x402 menggunakan harga paket yang sama seperti billing API key. Harga dihitung di awal berdasarkan parameter permintaan Anda (bukan berdasarkan hasil aktual yang dikembalikan).

<div id="search-search">
  ### Search (`/search`)
</div>

| Search type               | Harga dasar (hingga 10 hasil) | Per hasil di atas 10 |
| ------------------------- | ----------------------------- | -------------------- |
| `instant`, `auto`, `fast` | $0.007 / permintaan           | N/A (dibatasi 10)    |
| `deep-lite`               | $0.012 / permintaan           | N/A (dibatasi 10)    |
| `deep`                    | $0.012 / permintaan           | N/A (dibatasi 10)    |
| `deep-reasoning`          | $0.015 / permintaan           | N/A (dibatasi 10)    |

Menambahkan `contents.summary` dikenakan biaya tambahan **$0.001 per hasil**.

<Warning>
  Permintaan x402 dibatasi maksimal **10 hasil**. Jika Anda meminta lebih dari 10, `numResults` akan otomatis dipangkas menjadi 10 tanpa pemberitahuan dan harga dihitung berdasarkan 10 hasil.
</Warning>

<div id="contents-contents">
  ### Contents (`/contents`)
</div>

Setiap jenis konten dikenakan biaya per halaman/URL:

| Jenis konten | Harga per halaman |
| ------------ | ----------------- |
| `text`       | $0.001            |
| `highlights` | $0.001            |
| `summary`    | $0.001            |

Jika Anda tidak meminta jenis konten apa pun (tanpa `text`, `highlights`, atau `summary`), `text` akan diaktifkan secara default.

<div id="examples">
  ### Contoh
</div>

| Permintaan                                         | Harga  | USDC atomic |
| -------------------------------------------------- | ------ | ----------- |
| `/search` dengan 10 hasil, `type: "auto"`          | $0.007 | 7000        |
| `/search` dengan 5 hasil, `type: "fast"`           | $0.007 | 7000        |
| `/search` dengan 3 hasil + summary, `type: "auto"` | $0.010 | 10000       |
| `/search` dengan 10 hasil, `type: "deep-lite"`     | $0.012 | 12000       |
| `/search` dengan 10 hasil, `type: "deep"`          | $0.012 | 12000       |
| `/contents` untuk 2 URL dengan `text: true`        | $0.002 | 2000        |
| `/contents` untuk 1 URL dengan `text` + `summary`  | $0.002 | 2000        |

<div id="quickstart">
  ## Quickstart
</div>

<div id="install-dependencies">
  ### Instal dependensi
</div>

<CodeGroup>
  ```bash JavaScript theme={null}
  npm install @x402/fetch @x402/core @x402/evm viem
  # Untuk dukungan Solana, instal juga:
  npm install @x402/svm @solana/kit @scure/base
  ```

  ```bash Python theme={null}
  pip install "x402[requests,evm]"
  # Untuk dukungan Solana, instal juga:
  pip install "x402[svm]" "solana<0.40"
  ```
</CodeGroup>

<Note>
  Tidak ada yang perlu diinstal untuk cURL, tetapi Anda harus menangani challenge 402 dan penandatanganan payment secara manual. Untuk penggunaan produksi, pendekatan SDK lebih disarankan.
</Note>

<Tip>
  Tidak ingin repot mengelola private key? [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) menyediakan pengelolaan key yang terisolasi dengan TEE untuk AI agents. Agent Anda tidak pernah melihat private key tersebut. Wallet ini kompatibel dengan viem, jadi bisa langsung digunakan dengan `@x402/fetch`.
</Tip>

<div id="make-a-paid-search-request">
  ### Membuat search request berbayar
</div>

<CodeGroup>
  ```typescript JavaScript theme={null}
  import { wrapFetchWithPayment } from "@x402/fetch";
  import { x402Client, x402HTTPClient } from "@x402/core/client";
  import { ExactEvmScheme } from "@x402/evm/exact/client";
  // Untuk dukungan Solana, impor juga:
  // import { ExactSvmScheme } from "@x402/svm/exact/client";
  import { privateKeyToAccount } from "viem/accounts";

  const signer = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(signer));
  // Daftarkan juga signer Solana jika Anda ingin client memakai entri accept
  // Solana seperti `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`:
  // client.register("solana:*", new ExactSvmScheme(svmSigner));
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  const response = await fetchWithPayment("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);

  // Periksa settlement receipt
  const httpClient = new x402HTTPClient(client);
  const receipt = httpClient.getPaymentSettleResponse(
    (name) => response.headers.get(name)
  );
  console.log("Transaction:", receipt?.transaction);
  ```

  ```python Python theme={null}
  import os
  import requests
  from eth_account import Account
  from x402 import x402ClientSync
  from x402.http.clients import wrapRequestsWithPayment
  from x402.mechanisms.evm.exact import register_exact_evm_client
  from x402.mechanisms.evm.signers import EthAccountSigner

  account = Account.from_key(os.environ["WALLET_PRIVATE_KEY"])
  client = x402ClientSync()
  register_exact_evm_client(
      client,
      EthAccountSigner(account),
      networks="eip155:*",
  )
  session = wrapRequestsWithPayment(requests.Session(), client)

  response = session.post("https://api.exa.ai/search", json={
      "query": "best machine learning frameworks",
      "numResults": 5,
  })

  data = response.json()
  for result in data["results"]:
      print(result["url"], result["title"])
  print("Payment response:", response.headers.get("PAYMENT-RESPONSE"))
  ```

  ```bash cURL theme={null}
  # Langkah 1: Discovery, dapatkan informasi harga
  curl -s -o /dev/null -w "%{http_code}" -D - \
    -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # Mengembalikan 402 dengan header PAYMENT-REQUIRED yang berisi info harga terenkode base64

  # Langkah 2: Tanda tangani payment dengan wallet Anda (gunakan SDK untuk ini)
  # Langkah 3: Ulangi request dengan signature payment
  curl -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "PAYMENT-SIGNATURE: <base64-encoded-payment>" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # Mengembalikan 200 dengan hasil + header PAYMENT-RESPONSE (settlement receipt)
  ```
</CodeGroup>

<Info>
  cURL mengharuskan penandatanganan payment secara manual. Untuk produksi, gunakan SDK JavaScript atau Python yang menangani seluruh alur 402 &gt; tanda tangan &gt; ulangi request secara otomatis.
</Info>

<div id="discovery-mode-no-wallet-needed">
  ### Mode discovery (tanpa perlu wallet)
</div>

Cek harga tanpa wallet dengan mengirim permintaan tanpa autentikasi:

<CodeGroup>
  ```typescript JavaScript theme={null}
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "test query", numResults: 3 }),
  });

  // res.status === 402
  const paymentRequired = JSON.parse(
    atob(res.headers.get("PAYMENT-REQUIRED")!)
  );
  console.log(
    paymentRequired.accepts.map(({ network, amount }) => ({
      network,
      amount,
    }))
  );
  ```

  ```python Python theme={null}
  import base64, json, requests

  res = requests.post("https://api.exa.ai/search", json={
      "query": "test query",
      "numResults": 3,
  })

  # res.status_code == 402
  pricing = json.loads(base64.b64decode(res.headers["PAYMENT-REQUIRED"]))
  print([(accept["network"], accept["amount"]) for accept in pricing["accepts"]])
  ```

  ```bash cURL theme={null}
  curl -s -D - -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "test query", "numResults": 3}'
  # Cari header PAYMENT-REQUIRED pada respons 402
  # Dekode: echo "<header-value>" | base64 -d
  ```
</CodeGroup>

<div id="payment-networks">
  ## Jaringan payment
</div>

Exa mencantumkan setiap jaringan yang saat ini didukung dalam array `accepts`. Pilih entri yang sesuai dengan wallet Anda dan skema klien x402 yang terdaftar.

| Jaringan           | Identifier                                | Token | Aset                                           |
| ------------------ | ----------------------------------------- | ----- | ---------------------------------------------- |
| Base (Ethereum L2) | `eip155:8453`                             | USDC  | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`   |
| Solana mainnet     | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | USDC  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

Keduanya menggunakan USDC dengan 6 desimal (`1000000` = $1.00) dan diselesaikan secara on-chain melalui facilitator x402.

<div id="rate-limits">
  ## Rate limit
</div>

x402 memiliki rate limit tersendiri yang terpisah dari limit API key:

| Limit                             | Ambang batas     | Jendela waktu |
| --------------------------------- | ---------------- | ------------- |
| Unpaid discovery request (per IP) | 5 request        | 60 detik      |
| Request berbayar (per wallet)     | 10 request/detik | 1 detik       |

Setelah 5 discovery request `402` tanpa autentikasi dari IP yang sama dalam 60 detik, request berikutnya akan mengembalikan `429 Too Many Requests`. Request berbayar yang berhasil akan mengurangi penghitung tersebut.

QPS per wallet diberlakukan pada seluruh request berbayar dari alamat wallet yang sama.

<div id="headers-reference">
  ## Referensi header
</div>

<div id="request-headers">
  ### Header permintaan
</div>

| Header              | Deskripsi                                  |
| ------------------- | ------------------------------------------ |
| `PAYMENT-SIGNATURE` | Payload payment berenkode Base64 (x402 v2) |
| `payment-signature` | Alias (juga diterima)                      |
| `x-payment`         | Alias lama (kompatibilitas v1)             |

<div id="response-headers">
  ### Response header
</div>

| Header             | Kapan                                        | Deskripsi                                                                      |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------------------------ |
| `PAYMENT-REQUIRED` | Respons `402`                                | Objek `PaymentRequired` dalam enkode Base64 berisi harga dan instruksi payment |
| `PAYMENT-RESPONSE` | `200` atau `402` (setelah percobaan payment) | Hasil settlement dalam enkode Base64 berisi hash transaksi atau error          |

<div id="error-codes">
  ## Kode error
</div>

| Status | Tag                        | Deskripsi                                                                             |
| ------ | -------------------------- | ------------------------------------------------------------------------------------- |
| `402`  | `X402_PAYMENT_REQUIRED`    | Tidak ada payment yang diberikan. Menyertakan harga pada header `PAYMENT-REQUIRED` |
| `402`  | `X402_VERIFICATION_FAILED` | Signature payment tidak lolos verifikasi facilitator                               |
| `400`  | `X402_INVALID_SIGNATURE`   | Signature payment salah format atau tidak dapat diurai                             |
| `429`  | `X402_TOO_MANY_UNPAID`     | Terlalu banyak permintaan discovery yang belum dibayar dari IP ini                    |
| `429`  | `X402_WALLET_RATE_LIMITED` | Wallet melampaui 10 permintaan/detik                                                  |
| `500`  | `X402_INTERNAL_ERROR`      | Kesalahan di sisi server saat membuat persyaratan payment                          |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Bisakah saya menggunakan x402 dan API key secara bersamaan?">
    Jika permintaan Anda menyertakan header `x-api-key` atau token `Authorization: Bearer`, alur API key yang diprioritaskan dan x402 dilewati. Keduanya tidak bisa digabungkan; setiap permintaan hanya bisa memakai salah satunya.
  </Accordion>

  <Accordion title="Apa yang terjadi jika settlement gagal setelah permintaan saya diproses?">
    Respons Anda diblokir. Anda akan menerima `402` beserta `PAYMENT-RESPONSE` (berisi error) dan `PAYMENT-REQUIRED` (agar klien Anda dapat mencoba ulang). Tidak ada hasil yang dikembalikan sampai settlement berhasil.
  </Accordion>

  <Accordion title="Mengapa numResults dibatasi maksimal 10?">
    Permintaan x402 menerapkan batas maksimum 10 hasil per search. Jika Anda membutuhkan lebih banyak, gunakan alur API key dengan paket berbayar.
  </Accordion>

  <Accordion title="Wallet apa saja yang didukung?">
    Wallet apa pun yang kompatibel dengan EVM dan dapat menandatangani typed data EIP-712 di Base, atau wallet Solana yang didukung klien x402 SVM untuk `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`. SDK x402 mendukung `viem`, `ethers`, signer Coinbase Wallet, dan signer Solana SVM. Untuk AI agents berbasis EVM, [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) menawarkan manajemen key yang terisolasi TEE sehingga agent Anda tidak pernah menangani private keys mentah secara langsung.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Sumber Daya
</div>

* [Dokumentasi protokol x402](https://docs.x402.org): spesifikasi protokol lengkap
* [x402 GitHub](https://github.com/coinbase/x402): SDK dan contoh open-source
* [@x402/fetch di npm](https://www.npmjs.com/package/@x402/fetch): wrapper fetch untuk penanganan payment otomatis
* [@x402/svm di npm](https://www.npmjs.com/package/@x402/svm): dukungan payment exact untuk Solana/SVM
* [Panduan Exa Search API](/id/docs/search/quickstart): referensi lengkap parameter search
* [Panduan Exa Contents API](/id/docs/contents/quickstart): referensi lengkap parameter contents