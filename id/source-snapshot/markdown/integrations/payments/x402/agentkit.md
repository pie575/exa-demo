> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

# World AgentKit {#world-agentkit}

> Izinkan AI agent yang didukung verified human mengakses Exa secara gratis menggunakan World AgentKit — tanpa perlu USDC.

## Apa itu AgentKit? {#what-is-agentkit}

[World AgentKit](https://docs.world.org/agents/agent-kit) adalah toolkit yang memungkinkan AI agent membuktikan bahwa mereka didukung (backed) oleh verified human nyata melalui [World ID](https://world.org). Saat diintegrasikan dengan [x402](/id/docs/integrations/payments/x402/quickstart), toolkit ini membuka jalur **free trial**: agent yang terdaftar di [AgentBook](https://docs.world.org/agents/agent-kit/integrate) milik World dapat mengakses endpoint `/search` dan `/contents` milik Exa tanpa membayar USDC.

Mekanisme ini berjalan berdampingan dengan x402 payment flow standar. Setiap verified human mendapatkan **100 permintaan gratis per bulan** untuk seluruh agent yang didukungnya. Setelah kuota habis, agent kembali ke jalur USDC payment normal. Penghitung direset pada awal setiap bulan kalender (UTC).

<Info>
  AgentKit free trial dan x402 payment sama-sama dilewati jika permintaan Anda menyertakan header `x-api-key` atau `Authorization: Bearer`. Alur API key billing normal yang diutamakan.
</Info>

## Cara kerjanya {#how-it-works}

Ketika sebuah client mengakses `/search` atau `/contents` tanpa API key, Exa merespons dengan `402 Payment Required`. Response tersebut menyertakan ekstensi `agentkit` pada header `PAYMENT-REQUIRED` yang berisi challenge [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) (Sign-In with Ethereum).

Agent menandatangani challenge ini dengan wallet yang terdaftar, lalu Exa memverifikasi:

1. **Pemeriksaan signature** — memvalidasi signature SIWE terhadap alamat wallet (mendukung EOA melalui EIP-191 maupun smart contract wallets melalui ERC-1271)
2. **Pencarian AgentBook** — memetakan wallet ke `humanId` anonim melalui kontrak AgentBook di World Chain (`eip155:480`), memastikan satu verified human yang unik telah mendelegasikan identitasnya ke agent ini
3. **Pemeriksaan penggunaan** — jika human tersebut masih memiliki sisa free trial uses, akses diberikan; jika tidak, sistem beralih mensyaratkan USDC payment

## Quickstart {#quickstart}

### 1. Daftarkan agent Anda di AgentBook {#1-register-your-agent-in-agentbook}

Ini adalah penyiapan sekali jalan. Anda memerlukan [World App](https://world.org/download) dengan identitas yang sudah terverifikasi.

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

CLI akan memicu flow verifikasi World App, lalu mengirimkan transaksi registrasi di World Chain. Setelah selesai, server mana pun yang menggunakan AgentKit dapat menelusuri wallet Anda dan memastikan bahwa wallet tersebut didukung oleh orang sungguhan.

### 2. Kirim permintaan (dapatkan challenge) {#2-send-a-request-get-the-challenge}

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

Response `402` menyertakan ekstensi `agentkit` di dalam payload `PAYMENT-REQUIRED` yang sudah didekode:

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

### 3. Tandatangani challenge dan kirim ulang {#3-sign-the-challenge-and-resubmit}

Susun [pesan SIWE](https://eips.ethereum.org/EIPS/eip-4361) dari field `info` (domain, uri, nonce, statement, dll.), tandatangani dengan wallet agent Anda yang sudah terdaftar menggunakan salah satu tipe `supportedChains`, lalu kirimkan melalui header `agentkit` (JSON berenkode base64):

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

Jika agent terverifikasi dan masih memiliki sisa free trial uses, Exa mengembalikan `200` beserta hasil pencarian — tanpa perlu payment.

### Menggunakan skill AgentKit x402 {#using-the-agentkit-x402-skill}

Alih-alih mengimplementasikan flow challenge-response secara manual, tambahkan [skill agentkit-x402](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md) ke AI agent Anda:

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

Skill ini secara otomatis menangani seluruh flow saat agent menerima response `402` dengan ekstensi AgentKit.

## Detail free trial {#free-trial-details}

* Setiap verified human mendapatkan **100 permintaan gratis per bulan** untuk seluruh agent yang mereka dukung
* Penghitung penggunaan direset pada awal setiap bulan kalender (UTC)
* Penggunaan dilacak per human per endpoint (`/search` dan `/contents` dihitung terpisah)
* Dua agent yang didukung oleh human yang sama berbagi penghitung yang sama
* Setelah free trial uses habis untuk bulan tersebut, agent kembali menggunakan [x402 payment flow](/id/docs/integrations/payments/x402/quickstart) standar
* [Batas 10 hasil](/id/docs/integrations/payments/x402/quickstart#pricing) yang sama juga berlaku untuk permintaan free trial pada `/search`
* Penghitung free trial saat ini belum ditampilkan dalam response API — ketika kuotanya habis, server merespons dengan `402` standar tanpa memberikan akses gratis

## Endpoint yang didukung {#supported-endpoints}

| Endpoint    | x402 Payment | AgentKit Free Trial |
| ----------- | :----------: | :-----------------: |
| `/search`   |      Ya      |          Ya         |
| `/contents` |      Ya      |          Ya         |

Semua endpoint Exa lainnya tidak didukung melalui x402 maupun free trial AgentKit.

## Detail jaringan {#network-details}

| Properti                  | Nilai                                              |
| ------------------------- | -------------------------------------------------- |
| Chain AgentBook           | World Chain                                        |
| Chain ID (CAIP-2)         | `eip155:480`                                       |
| Verifikasi                | Kontrak AgentBook di World Chain                   |
| Tipe wallet yang didukung | EOA (EIP-191) dan smart contract wallet (ERC-1271) |

## FAQ {#faq}

<AccordionGroup>
  <Accordion title="Bisakah saya menggunakan x402 payment dan AgentKit sekaligus?">
    Ya. Response `PAYMENT-REQUIRED` memuat pricing payment sekaligus challenge AgentKit. Client Anda bisa memilih salah satu jalur. Jika free trial uses sudah habis, agent dapat beralih membayar dengan USDC.
  </Accordion>

  <Accordion title="Apa yang terjadi jika agent saya belum terdaftar di AgentBook?">
    Verifikasi AgentKit gagal tanpa pemberitahuan dan permintaan diperlakukan sebagai `402` standar — agent Anda tetap dapat membayar dengan USDC melalui flow x402 biasa.
  </Accordion>

  <Accordion title="Apakah dua agent yang backed by manusia yang sama mendapat kuota free trial terpisah?">
    Tidak. Penggunaan dilacak per manusia (melalui `humanId` anonim dari AgentBook), bukan per wallet. Dua agent yang backed by World ID yang sama berbagi penghitung yang sama.
  </Accordion>

  <Accordion title="Jaringan blockchain apa saja yang terlibat?">
    Pembayaran USDC x402 standar dapat diselesaikan di **Base** (`eip155:8453`) atau **Solana mainnet** (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`). Verifikasi AgentKit menggunakan **World Chain** (`eip155:480`) untuk pencarian AgentBook. Keduanya saling independen — AgentKit tidak memerlukan payment on-chain apa pun.
  </Accordion>

  <Accordion title="tipe wallet apa saja yang didukung?">
    Baik EOA (externally owned accounts) yang menggunakan signature EIP-191 maupun smart contract wallets (misalnya Coinbase Smart Wallet, Safe) yang menggunakan ERC-1271. Lihat [World AgentKit SDK reference](https://docs.world.org/agents/agent-kit/sdk-reference) untuk detailnya.
  </Accordion>
</AccordionGroup>

## Sumber Daya {#resources}

* [Panduan x402 payment](/id/docs/integrations/payments/x402/quickstart): flow USDC payment standar
* [Dokumentasi World AgentKit](https://docs.world.org/agents/agent-kit): dokumentasi AgentKit lengkap
* [Panduan integrasi World AgentKit](https://docs.world.org/agents/agent-kit/integrate): registrasi AgentBook
* [World AgentKit SDK reference](https://docs.world.org/agents/agent-kit/sdk-reference): referensi API SDK
* [AgentKit x402 skill](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md): skill siap pakai untuk AI agent
* [Dokumentasi protokol x402](https://docs.x402.org): spesifikasi x402 lengkap