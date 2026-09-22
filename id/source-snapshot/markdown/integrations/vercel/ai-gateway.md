> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Vercel AI Gateway {#vercel-ai-gateway}

> Gunakan Exa web search melalui Vercel AI Gateway dengan AI SDK.

Gunakan Exa web search melalui [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) dengan `gateway.tools.exaSearch()` dari package `ai`. Anda tidak memerlukan Exa API key; Vercel menagih permintaan ini melalui AI Gateway. Lihat [dokumentasi web search](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) dari Vercel untuk referensi lengkapnya.

## Pasang {#install}

Pasang AI SDK 5 atau versi yang lebih baru:

```bash install.sh theme={null}
npm install ai
```

## Autentikasi {#authentication}

<Info>
  AI Gateway memerlukan API key atau token OIDC. Buat `AI_GATEWAY_API_KEY` di dashboard Vercel pada menu **AI Gateway &gt; API Keys**, lalu tambahkan ke environment Anda.
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

Saat men-deploy aplikasi Anda di Vercel, Anda dapat menggunakan `VERCEL_OIDC_TOKEN` yang otomatis tersedia sebagai gantinya. Lihat [dokumentasi autentikasi dan BYOK](https://vercel.com/docs/ai-gateway/authentication-and-byok) milik Vercel.

## Mulai cepat {#quick-start}

Anda dapat menggunakan Exa search dengan model apa pun yang didukung:

```typescript quickstart.ts theme={null}
import { gateway, generateText, stepCountIs } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

## Streaming {#streaming}

Gunakan `streamText` untuk memproses teks yang dihasilkan dan events tool search begitu diterima:

```typescript stream.ts theme={null}
import { gateway, streamText } from 'ai';

const result = streamText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
});

for await (const part of result.fullStream) {
  if (part.type === 'text-delta') {
    process.stdout.write(part.text);
  } else if (part.type === 'tool-call') {
    console.log('Tool call:', part.toolName);
  } else if (part.type === 'tool-result') {
    console.log('Search results received');
  }
}
```

Pada route handler Next.js, kembalikan stream ke client dengan `return result.toUIMessageStreamResponse()`.

## Konfigurasi {#configuration}

Berikan options ke `gateway.tools.exaSearch()` untuk menyetel search Anda:

```typescript configuration.ts theme={null}
tools: {
  exa_search: gateway.tools.exaSearch({
    type: 'fast',
    numResults: 5,
    category: 'news',
    includeDomains: ['reuters.com', 'bbc.com', 'nytimes.com'],
    contents: {
      highlights: true,
      maxAgeHours: 24,
    },
  }),
},
```

Opsi yang tersedia mencakup:

| Opsi                                                   | Deskripsi                                                              |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `type`                                                 | Search mode: `auto` (default), `fast`, atau `instant`.                 |
| `numResults`                                           | Jumlah hasil yang dikembalikan, dari 1 hingga 100. Default-nya 10.     |
| `category`                                             | Kategori konten.                                                       |
| `includeDomains` / `excludeDomains`                    | Menyertakan atau mengecualikan domain tertentu.                        |
| `startPublishedDate` / `endPublishedDate`              | Memfilter hasil berdasarkan publication date.                          |
| `userLocation`                                         | Kode negara ISO dua huruf untuk search yang mempertimbangkan lokasi.   |
| `contents.text`                                        | Mengembalikan teks halaman hasil ekstraksi.                            |
| `contents.highlights`                                  | Mengembalikan kutipan halaman yang relevan.                            |
| `contents.maxAgeHours`                                 | Menetapkan usia maksimum konten yang di-cache.                         |
| `contents.livecrawlTimeout`                            | Menetapkan batas waktu livecrawl.                                      |
| `contents.subpages` / `contents.subpageTarget`         | Meng-crawl subhalaman dan secara opsional menargetkan satu subhalaman. |
| `contents.extras.links` / `contents.extras.imageLinks` | Mengembalikan tautan atau tautan gambar dari hasil.                    |

Lihat [referensi Exa web search](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) dari Vercel untuk daftar lengkap parameter beserta perilakunya.

## Vercel eve agents {#vercel-eve-agents}

Agent yang dibuat dengan [eve](https://eve.dev) sudah dilengkapi tool `web_search` bawaan, dan model AI Gateway menjalankannya di Exa secara default, tanpa perlu konfigurasi atau Exa API key. Untuk menetapkan provider secara eksplisit, export dari `agent/tools/web_search.ts`:

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

Model yang dipanggil melalui provider langsung alih-alih AI Gateway tetap mempertahankan web search bawaannya. Lihat [dokumentasi harness](https://eve.dev/docs/concepts/default-harness#built-in-tools) eve untuk daftar tool lengkapnya.

## Harga {#pricing}

<Tip>
  Exa web search **gratis hingga 31 Agustus** di AI Gateway dan eve, jadi Anda sudah bisa mulai membangun dengannya hari ini tanpa biaya.
</Tip>

Setelah itu, Vercel akan menagih permintaan melalui AI Gateway sesuai tarif yang tercantum di [dokumentasi web search](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) Vercel.

<Note>
  Saat ini integrasi ini mendukung mode search standar Exa serta kontrol extraction konten. Mode deep synthesis dan summaries yang dihasilkan belum tersedia.
</Note>

<Columns cols={2}>
  <Card title="Gunakan Exa AI SDK" icon="code" href="/id/docs/integrations/vercel/ai-sdk" cta="Buka panduan" arrow="true">
    Panggil Exa secara langsung dengan Exa API key melalui `@exalabs/ai-sdk`.
  </Card>

  <Card title="Baca referensi web search dari Vercel" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="Buka referensi" arrow="true">
    Tinjau referensi lengkap konfigurasi dan harga AI Gateway.
  </Card>
</Columns>