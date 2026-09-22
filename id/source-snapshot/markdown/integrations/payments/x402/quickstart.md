> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Bayar dengan x402 {#pay-with-x402}

> Gunakan API Search dan Contents dari Exa tanpa API key. Bayar per permintaan dengan USDC di Base atau Solana melalui protokol x402.

## Apa itu x402? {#what-is-x402}

[x402](https://x402.org) adalah standar payment terbuka yang dibangun di atas kode status HTTP `402 Payment Required`. Standar ini memungkinkan client membayar akses API per permintaan menggunakan stablecoin USDC di Base atau Solana, tanpa perlu akun, API key, maupun langganan.

Exa mendukung x402 pada dua endpoint: **`/search`** dan **`/contents`**. Ketika Anda mengirim permintaan tanpa API key atau header payment, Exa merespons dengan `402` dan header `PAYMENT-REQUIRED` yang berisi detail harga serta jaringan payment yang didukung. Client Anda menandatangani USDC payment, mengirim ulang permintaan dengan header `PAYMENT-SIGNATURE`, lalu menerima hasil setelah settlement terkonfirmasi on-chain.

Pendekatan ini ideal untuk **AI agent** yang perlu membayar web search secara mandiri tanpa credential yang sudah di-provision sebelumnya.

<Info>
  x402 dan akses API key bersifat independen. Jika permintaan Anda menyertakan header `x-api-key` atau `Authorization: Bearer`, alur API key billing biasa yang digunakan dan x402 dilewati sepenuhnya.
</Info>

## Endpoint yang didukung {#supported-endpoints}

| Endpoint    | Metode | Deskripsi                                                                                              |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `/search`   | POST   | Web search dengan semua search type (`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`) |
| `/contents` | POST   | Pengambilan konten berdasarkan URL atau ID dokumen                                                     |

Semua endpoint lainnya **tidak** tersedia melalui x402.

## Cara kerjanya {#how-it-works}

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/payments/x402/payment-flow.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a560d80bb84828e03dfacd61351e9fb" alt="Diagram sekuens x402 payment flow: Client mengirim permintaan ke server, menerima 402 dengan header PAYMENT-REQUIRED, membuat payload payment, mengulang permintaan dengan PAYMENT-SIGNATURE, server memverifikasi melalui facilitator, menjalankan prosesnya, menyelesaikan pembayaran secara on-chain, lalu mengembalikan 200 beserta hasil dan PAYMENT-RESPONSE" width="4224" height="2720" data-path="images/integrations/payments/x402/payment-flow.png" />
</Frame>

### Langkah 1: Discovery {#step-1-discovery}

Kirim permintaan ke endpoint yang didukung tanpa API key atau header payment:

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "best machine learning frameworks", "numResults": 5}'
```

Anda akan menerima response `402` dengan header `PAYMENT-REQUIRED` berenkode base64. Setelah didekode, isinya terlihat seperti ini:

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

`amount` dinyatakan dalam satuan atomic USDC (6 desimal), jadi `"7000"` = $0,007.
Client dapat melakukan payment menggunakan entri `accepts` mana pun yang ditawarkan dan didukungnya. Entri Solana memuat field yang disediakan facilitator seperti `extra.feePayer`; gunakan entri yang persis sama dari header `PAYMENT-REQUIRED` saat menyusun payment.

### Langkah 2: Lakukan payment dan coba lagi {#step-2-pay-and-retry}

Tanda tangani payment dengan wallet Anda, lalu kirim ulang permintaan tersebut dengan header `PAYMENT-SIGNATURE` yang berisi payload payment Anda dalam format base64. SDK client x402 menangani hal ini secara otomatis.

### Langkah 3: Settlement {#step-3-settlement}

Exa memverifikasi signature payment Anda melalui facilitator, lalu memulai settlement on-chain **secara paralel** dengan pemrosesan permintaan Anda. Response ditahan hingga settlement terkonfirmasi. Jika berhasil, Anda akan menerima:

* HTTP `200` beserta hasil Anda
* Header `PAYMENT-RESPONSE` yang berisi settlement receipt (dienkode base64), termasuk hash transaksi on-chain

Jika settlement gagal, Anda akan mendapat `402` disertai `PAYMENT-RESPONSE` (detail kesalahan) dan `PAYMENT-REQUIRED` (agar Anda dapat mencoba lagi).

## Harga {#pricing}

x402 menggunakan harga paket yang sama seperti API key billing. Harga dihitung di awal berdasarkan parameter permintaan Anda (bukan berdasarkan hasil aktual yang dikembalikan).

### Search (`/search`) {#search-search}

| Search type               | Harga dasar (hingga 10 hasil) | Per hasil di atas 10 |
| ------------------------- | ----------------------------- | -------------------- |
| `instant`, `auto`, `fast` | $0,007 / permintaan           | T/A (dibatasi 10)    |
| `deep-lite`               | $0,012 / permintaan           | T/A (dibatasi 10)    |
| `deep`                    | $0,012 / permintaan           | T/A (dibatasi 10)    |
| `deep-reasoning`          | $0,015 / permintaan           | T/A (dibatasi 10)    |

Menambahkan `contents.summary` dikenakan biaya tambahan **$0,001 per hasil**.

<Warning>
  Permintaan x402 dibatasi maksimal **10 hasil**. Jika Anda meminta lebih dari 10, `numResults` akan otomatis dibatasi menjadi 10 dan harga dihitung berdasarkan 10 hasil.
</Warning>

### Contents (`/contents`) {#contents-contents}

Setiap tipe konten dikenakan biaya per halaman/URL:

| Tipe konten  | Harga per halaman |
| ------------ | ----------------- |
| `text`       | $0.001            |
| `highlights` | $0.001            |
| `summary`    | $0.001            |

Jika Anda tidak meminta tipe konten apa pun (tanpa `text`, `highlights`, atau `summary`), `text` akan diaktifkan secara default.

### Contoh {#examples}

| Permintaan                                           | Harga  | USDC atomic |
| ---------------------------------------------------- | ------ | ----------- |
| `/search` dengan 10 hasil, `type: "auto"`            | $0.007 | 7000        |
| `/search` dengan 5 hasil, `type: "fast"`             | $0.007 | 7000        |
| `/search` dengan 3 hasil + ringkasan, `type: "auto"` | $0.010 | 10000       |
| `/search` dengan 10 hasil, `type: "deep-lite"`       | $0.012 | 12000       |
| `/search` dengan 10 hasil, `type: "deep"`            | $0.012 | 12000       |
| `/contents` untuk 2 URL dengan `text: true`          | $0.002 | 2000        |
| `/contents` untuk 1 URL dengan `text` + `summary`    | $0.002 | 2000        |

## Quickstart {#quickstart}

### Instal dependensi {#install-dependencies}

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
  Tidak ada yang perlu diinstal untuk cURL, tetapi Anda harus menangani challenge 402 dan penandatanganan payment secara manual. Pendekatan SDK direkomendasikan untuk penggunaan production.
</Note>

<Tip>
  Tidak ingin mengelola private keys? [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) menyediakan pengelolaan key terisolasi TEE untuk AI agents. Agent Anda tidak pernah melihat private key tersebut. Wallet ini kompatibel dengan viem, sehingga bisa langsung digunakan dengan `@x402/fetch`.
</Tip>

### Membuat permintaan search berbayar {#make-a-paid-search-request}

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
  // Daftarkan juga signer Solana jika Anda ingin client memakai entri accept Solana
  // seperti `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`:
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
  # Langkah 1: Discovery, dapatkan info harga
  curl -s -o /dev/null -w "%{http_code}" -D - \
    -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # Mengembalikan 402 dengan header PAYMENT-REQUIRED yang berisi harga terenkode base64

  # Langkah 2: Tanda tangani payment dengan wallet Anda (gunakan SDK untuk ini)
  # Langkah 3: Coba lagi dengan signature payment
  curl -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "PAYMENT-SIGNATURE: <base64-encoded-payment>" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # Mengembalikan 200 dengan hasil + header PAYMENT-RESPONSE (settlement receipt)
  ```
</CodeGroup>

<Info>
  cURL mengharuskan penandatanganan payment dilakukan manual. Untuk production, gunakan SDK JavaScript atau Python yang menangani seluruh alur 402 &gt; tanda tangan &gt; coba lagi secara otomatis.
</Info>

### Mode discovery (tanpa perlu wallet) {#discovery-mode-no-wallet-needed}

Cek harga tanpa wallet dengan mengirim permintaan unauthenticated:

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
  # Cari header PAYMENT-REQUIRED pada response 402
  # Dekode dengan: echo "<header-value>" | base64 -d
  ```
</CodeGroup>

## Jaringan payment {#payment-networks}

Exa mencantumkan setiap jaringan yang saat ini didukung dalam array `accepts`. Pilih entri yang sesuai dengan wallet Anda dan skema client x402 yang terdaftar.

| Jaringan           | Identifier                                | Token | Aset                                           |
| ------------------ | ----------------------------------------- | ----- | ---------------------------------------------- |
| Base (Ethereum L2) | `eip155:8453`                             | USDC  | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`   |
| Solana mainnet     | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | USDC  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

Keduanya menggunakan USDC dengan 6 desimal (`1000000` = $1,00) dan diselesaikan secara on-chain melalui facilitator x402.

## Rate limit {#rate-limits}

x402 memiliki rate limit tersendiri yang terpisah dari batas API key:

| Batas                             | Ambang              | Jendela  |
| --------------------------------- | ------------------- | -------- |
| Unpaid discovery request (per IP) | 5 permintaan        | 60 detik |
| Permintaan berbayar (per wallet)  | 10 permintaan/detik | 1 detik  |

Setelah 5 discovery request `402` tanpa autentikasi dari IP yang sama dalam 60 detik, permintaan berikutnya akan mengembalikan `429 Too Many Requests`. Permintaan berbayar yang berhasil akan mengurangi penghitung tersebut.

QPS per wallet diberlakukan pada seluruh permintaan berbayar dari alamat wallet yang sama.

## Referensi header {#headers-reference}

### Header permintaan {#request-headers}

| Header              | Deskripsi                                  |
| ------------------- | ------------------------------------------ |
| `PAYMENT-SIGNATURE` | Payload payment terenkode Base64 (x402 v2) |
| `payment-signature` | Alias (juga diterima)                      |
| `x-payment`         | Alias lama (kompatibilitas v1)             |

### Response header {#response-headers}

| Header             | Kapan                                        | Deskripsi                                                                     |
| ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------- |
| `PAYMENT-REQUIRED` | Response `402`                               | Objek `PaymentRequired` terenkode Base64 berisi harga dan instruksi payment |
| `PAYMENT-RESPONSE` | `200` atau `402` (setelah percobaan payment) | Hasil settlement terenkode Base64 berisi hash transaksi atau error            |

## Error codes {#error-codes}

| Status | Tag                        | Deskripsi                                                                             |
| ------ | -------------------------- | ------------------------------------------------------------------------------------- |
| `402`  | `X402_PAYMENT_REQUIRED`    | Tidak ada payment yang disertakan. Menyertakan harga pada header `PAYMENT-REQUIRED` |
| `402`  | `X402_VERIFICATION_FAILED` | Signature payment tidak lolos verifikasi facilitator                                  |
| `400`  | `X402_INVALID_SIGNATURE`   | Signature payment tidak valid atau tidak dapat diurai                                 |
| `429`  | `X402_TOO_MANY_UNPAID`     | Terlalu banyak unpaid discovery request dari IP ini                                   |
| `429`  | `X402_WALLET_RATE_LIMITED` | Wallet melampaui 10 permintaan/detik                                                  |
| `500`  | `X402_INTERNAL_ERROR`      | Kesalahan di sisi server saat menghasilkan persyaratan payment                        |

## FAQ {#faq}

<AccordionGroup>
  <Accordion title="Bisakah saya menggunakan x402 dan API key sekaligus?">
    Jika permintaan Anda menyertakan header `x-api-key` atau token `Authorization: Bearer`, alur API key yang diutamakan dan x402 dilewati. Keduanya tidak bisa digabung. Setiap permintaan hanya memakai salah satunya.
  </Accordion>

  <Accordion title="Apa yang terjadi jika settlement gagal setelah permintaan saya diproses?">
    Response Anda diblokir. Anda menerima `402` beserta `PAYMENT-RESPONSE` (berisi error) dan `PAYMENT-REQUIRED` (agar client Anda dapat mencoba lagi). Tidak ada hasil yang dikembalikan sampai settlement berhasil.
  </Accordion>

  <Accordion title="Mengapa numResults dibatasi maksimal 10?">
    Permintaan x402 menerapkan batas maksimum 10 hasil per search. Jika Anda butuh lebih banyak, gunakan alur API key dengan plan berbayar.
  </Accordion>

  <Accordion title="Wallet mana saja yang didukung?">
    Semua wallet yang kompatibel dengan EVM dan dapat menandatangani typed data EIP-712 di Base, atau wallet Solana yang didukung client x402 SVM untuk `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`. SDK x402 mendukung `viem`, `ethers`, signer Coinbase Wallet, dan signer Solana SVM. Untuk AI agents berbasis EVM, [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) menawarkan manajemen key yang terisolasi TEE sehingga agent Anda tidak pernah menangani private keys mentah secara langsung.
  </Accordion>
</AccordionGroup>

## Sumber Daya {#resources}

* [Dokumentasi protokol x402](https://docs.x402.org): spesifikasi protokol lengkap
* [x402 GitHub](https://github.com/coinbase/x402): SDK dan contoh open-source
* [@x402/fetch di npm](https://www.npmjs.com/package/@x402/fetch): wrapper fetch untuk penanganan payment otomatis
* [@x402/svm di npm](https://www.npmjs.com/package/@x402/svm): dukungan payment exact untuk Solana/SVM
* [Panduan Exa Search API](/id/docs/search/quickstart): referensi lengkap parameter search
* [Panduan Exa Contents API](/id/docs/contents/quickstart): referensi lengkap parameter contents