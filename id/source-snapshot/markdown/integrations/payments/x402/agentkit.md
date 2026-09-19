> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="world-agentkit">
  # World AgentKit
</div>

> Biarkan AI agents yang didukung verified human mengakses Exa secara gratis lewat World AgentKit — tanpa perlu USDC.

<div id="what-is-agentkit">
  ## Apa itu AgentKit?
</div>

[World AgentKit](https://docs.world.org/agents/agent-kit) adalah toolkit yang memungkinkan AI agents membuktikan bahwa mereka didukung oleh verified human yang nyata melalui [World ID](https://world.org). Jika diintegrasikan dengan [x402](/id/docs/integrations/payments/x402/quickstart), toolkit ini membuka jalur **free trial**: agent yang terdaftar di [AgentBook](https://docs.world.org/agents/agent-kit/integrate) milik World dapat mengakses endpoint `/search` dan `/contents` milik Exa tanpa membayar USDC.

Mekanisme ini berjalan berdampingan dengan x402 payment flow standar. Setiap verified human mendapatkan **100 permintaan gratis per bulan** untuk seluruh agent yang mereka dukung. Setelah kuota habis, agent akan kembali ke jalur payment USDC seperti biasa. Penghitung direset pada awal setiap bulan kalender (UTC).

<Info>
  Free trial AgentKit dan payment x402 sama-sama dilewati jika permintaan Anda menyertakan header `x-api-key` atau `Authorization: Bearer`. Alur API key billing biasa yang akan diprioritaskan.
</Info>

<div id="how-it-works">
  ## Cara kerjanya
</div>

Ketika klien memanggil `/search` atau `/contents` tanpa API key, Exa merespons dengan `402 Payment Required`. Respons tersebut menyertakan ekstensi `agentkit` pada header `PAYMENT-REQUIRED` yang berisi challenge [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) (Sign-In with Ethereum).

Agent menandatangani challenge ini dengan wallet terdaftarnya, lalu Exa memverifikasi:

1. **Pemeriksaan signature** — memvalidasi signature SIWE terhadap alamat wallet (mendukung EOA melalui EIP-191 maupun smart contract wallets melalui ERC-1271)
2. **Pencarian AgentBook** — memetakan wallet ke `humanId` anonim melalui kontrak AgentBook di World Chain (`eip155:480`), memastikan ada satu verified human unik yang telah mendelegasikan identitasnya ke agent ini
3. **Pemeriksaan usage** — jika human tersebut masih memiliki sisa free trial uses, akses diberikan; jika tidak, sistem beralih mensyaratkan payment USDC

<div id="quickstart">
  ## Quickstart
</div>

<div id="1-register-your-agent-in-agentbook">
  ### 1. Daftarkan agent Anda di AgentBook
</div>

Ini adalah penyiapan sekali saja. Anda memerlukan [World App](https://world.org/download) dengan identitas terverifikasi.

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

CLI memicu alur verification World App, lalu mengirimkan transaksi pendaftaran di World Chain. Setelah selesai, server mana pun yang menggunakan AgentKit dapat menelusuri wallet Anda dan memastikan bahwa wallet tersebut memang dimiliki oleh orang sungguhan.

<div id="2-send-a-request-get-the-challenge">
  ### 2. Kirim permintaan (dapatkan challenge)
</div>

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

Respons `402` menyertakan ekstensi `agentkit` di dalam payload `PAYMENT-REQUIRED` yang sudah didekode:

```json theme={null}
{
  "x402Version": 2,
  "accepts": [ ... ],
  "extensions": {
    "agentkit": {
      "info": {
        "version": "1",
        "statement": "Verify your agent is backed by a real human to access Exa",
        "domain": "api.exa.ai",
        "uri": "https://api.exa.ai/search",
        "nonce": "abc123...",
        "issuedAt": "2026-04-11T01:30:00.000Z",
        "resources": ["https://api.exa.ai/search"]
      },
      "supportedChains": [
        { "chainId": "eip155:480", "type": "eip191" },
        { "chainId": "eip155:480", "type": "eip1271" }
      ],
      "schema": { ... },
      "_options": {
        "statement": "Verify your agent is backed by a real human to access Exa",
        "mode": { "type": "free-trial", "uses": 100 },
        "network": "eip155:480"
      }
    }
  }
}
```

<div id="3-sign-the-challenge-and-resubmit">
  ### 3. Tandatangani challenge dan kirim ulang
</div>

Susun [pesan SIWE](https://eips.ethereum.org/EIPS/eip-4361) dari field `info` (domain, uri, nonce, statement, dll.), tandatangani dengan wallet agent Anda yang sudah terdaftar menggunakan salah satu tipe `supportedChains`, lalu kirimkan melalui header `agentkit` (JSON yang dienkode base64):

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

Jika agent terverifikasi dan masih memiliki sisa free trial uses, Exa mengembalikan `200` beserta hasil search — tanpa perlu payment.

<div id="using-the-agentkit-x402-skill">
  ### Menggunakan skill x402 AgentKit
</div>

Alih-alih menerapkan alur challenge-response secara manual, tambahkan [skill agentkit-x402](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md) ke agent AI Anda:

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

Skill ini secara otomatis menangani seluruh alur ketika agent menerima respons `402` dengan ekstensi AgentKit.

<div id="free-trial-details">
  ## Detail free trial
</div>

* Setiap verified human mendapatkan **100 permintaan gratis per bulan** untuk seluruh agent yang mereka dukung
* Penghitung usage disetel ulang pada awal setiap bulan kalender (UTC)
* Usage dilacak per human per endpoint (`/search` dan `/contents` dihitung terpisah)
* Dua agent yang didukung oleh human yang sama berbagi penghitung yang sama
* Setelah free trial uses habis untuk bulan tersebut, agent akan beralih ke [x402 payment flow](/id/docs/integrations/payments/x402/quickstart) standar
* [Batas 10 hasil](/id/docs/integrations/payments/x402/quickstart#pricing) yang sama juga berlaku untuk permintaan free trial pada `/search`
* Penghitung free trial saat ini belum ditampilkan dalam respons API — ketika kuota habis, server merespons dengan `402` standar tanpa memberikan akses gratis

<div id="supported-endpoints">
  ## Endpoint yang didukung
</div>

| Endpoint    | Payment x402 | Free Trial AgentKit |
| ----------- | :----------: | :-----------------: |
| `/search`   |      Ya      |          Ya         |
| `/contents` |      Ya      |          Ya         |

Semua endpoint Exa lainnya tidak didukung melalui x402 maupun free trial AgentKit.

<div id="network-details">
  ## Detail jaringan
</div>

| Properti                  | Nilai                                              |
| ------------------------- | -------------------------------------------------- |
| Chain AgentBook           | World Chain                                        |
| Chain ID (CAIP-2)         | `eip155:480`                                       |
| verification              | Kontrak AgentBook di World Chain                   |
| Tipe wallet yang didukung | EOA (EIP-191) dan smart contract wallet (ERC-1271) |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Bisakah saya menggunakan payment x402 dan AgentKit sekaligus?">
    Bisa. Respons `PAYMENT-REQUIRED` memuat harga payment sekaligus challenge AgentKit. Klien Anda bebas memilih salah satu jalur. Jika free trial uses sudah habis, agent dapat beralih membayar dengan USDC.
  </Accordion>

  <Accordion title="Apa yang terjadi jika agent saya belum terdaftar di AgentBook?">
    Verification AgentKit gagal tanpa pemberitahuan dan permintaan diperlakukan sebagai `402` standar — agent Anda tetap bisa membayar dengan USDC melalui alur x402 biasa.
  </Accordion>

  <Accordion title="Apakah dua agent milik manusia yang sama mendapat kuota free trial terpisah?">
    Tidak. Usage dilacak per manusia (melalui `humanId` anonim dari AgentBook), bukan per wallet. Dua agent dengan World ID yang sama berbagi penghitung yang sama.
  </Accordion>

  <Accordion title="Jaringan blockchain apa saja yang terlibat?">
    Payment USDC x402 standar dapat diselesaikan di **Base** (`eip155:8453`) atau **Solana mainnet** (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`). Verification AgentKit menggunakan **World Chain** (`eip155:480`) untuk pencarian AgentBook. Keduanya saling independen — AgentKit tidak memerlukan payment on-chain apa pun.
  </Accordion>

  <Accordion title="Tipe wallet apa saja yang didukung?">
    Baik EOA (externally owned accounts) yang memakai signature EIP-191 maupun smart contract wallets (misalnya Coinbase Smart Wallet, Safe) yang memakai ERC-1271. Lihat [SDK reference World AgentKit](https://docs.world.org/agents/agent-kit/sdk-reference) untuk detailnya.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Sumber Daya
</div>

* [Panduan payment x402](/id/docs/integrations/payments/x402/quickstart): payment flow USDC standar
* [Dokumentasi World AgentKit](https://docs.world.org/agents/agent-kit): dokumentasi lengkap AgentKit
* [Panduan integrasi World AgentKit](https://docs.world.org/agents/agent-kit/integrate): pendaftaran AgentBook
* [SDK reference World AgentKit](https://docs.world.org/agents/agent-kit/sdk-reference): referensi API SDK
* [Skill x402 AgentKit](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md): skill siap pakai untuk AI agents
* [Dokumentasi protokol x402](https://docs.x402.org): spesifikasi lengkap x402