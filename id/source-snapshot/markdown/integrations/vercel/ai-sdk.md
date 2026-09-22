> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

# AI SDK by Vercel {#ai-sdk-by-vercel}

> Tambahkan Exa web search ke aplikasi AI SDK dengan package @exalabs/ai-sdk.

Gunakan package `@exalabs/ai-sdk` untuk menambahkan Exa web search ke aplikasi yang dibangun dengan AI SDK by Vercel. Anda cukup menyediakan Exa API key, dan tool `webSearch()` akan menangani permintaan search untuk model Anda.

## Pasang {#install}

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

## Mulai cepat {#quick-start}

```typescript quickstart.ts theme={null}
import { generateText, stepCountIs } from 'ai';
import { webSearch } from '@exalabs/ai-sdk';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Tell me the latest developments in AI',
  system: 'Only use web search once per turn. Answer based on the information you have.',
  tools: {
    webSearch: webSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru langsung mendapatkan credits gratis.
</Card>

<Info>
  Setel key Anda sebagai `EXA_API_KEY` sebelum menjalankan contoh ini. Package akan membaca variabel lingkungan ini secara otomatis.
</Info>

## Default {#defaults}

`webSearch()` menggunakan default berikut:

* `type`: `auto`
* `numResults`: `10`
* `contents.text`: `3000` karakter per hasil
* `maxAgeHours`: fallback cache default; atur opsi ini jika Anda memerlukan kebaruan yang lebih ketat

## Konfigurasi search {#configure-search}

Gunakan options berikut untuk menyetel search dan extraction konten:

```typescript configuration.ts theme={null}
const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Find the top AI companies in Europe founded after 2018',
  tools: {
    webSearch: webSearch({
      type: 'auto',
      numResults: 6,
      category: 'company',
      contents: {
        text: { maxCharacters: 1000 },
        maxAgeHours: 1,
        summary: true,
      },
    }),
  },
  stopWhen: stepCountIs(5),
});

console.log(text);
```

### Opsi pencarian {#search-options}

| Opsi                                      | Deskripsi                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `type`                                    | Mode pencarian: `auto`, `fast`, `instant`, `deep-lite`, `deep`, atau `deep-reasoning`.                 |
| `category`                                | Kategori konten: `company`, `publication`, `news`, `personal site`, `people`, atau `financial report`. |
| `numResults`                              | Jumlah hasil yang dikembalikan.                                                                        |
| `includeDomains` / `excludeDomains`       | Menyertakan atau mengecualikan domain tertentu.                                                        |
| `startPublishedDate` / `endPublishedDate` | Memfilter hasil berdasarkan tanggal publikasi dalam format ISO 8601.                                   |
| `includeText` / `excludeText`             | Mewajibkan atau mengecualikan teks dalam hasil.                                                        |
| `userLocation`                            | Kode negara dua huruf untuk pencarian berbasis lokasi.                                                 |

### Content options {#content-options}

| Opsi                                                   | Deskripsi                                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `contents.text`                                        | Mengembalikan teks hasil ekstraksi. Mendukung `maxCharacters` dan `includeHtmlTags`.                          |
| `contents.summary`                                     | Mengembalikan ringkasan yang dihasilkan AI. Mendukung `query`.                                                |
| `contents.maxAgeHours`                                 | Gunakan konten dari cache hanya jika masih dalam rentang usia yang ditentukan; jika tidak, gunakan livecrawl. |
| `contents.livecrawlTimeout`                            | Mengatur batas waktu livecrawl.                                                                               |
| `contents.subpages` / `contents.subpageTarget`         | Meng-crawl subhalaman dan secara opsional menargetkan subhalaman tertentu.                                    |
| `contents.extras.links` / `contents.extras.imageLinks` | Mengembalikan tautan atau tautan gambar dari hasil.                                                           |

## Dukungan TypeScript {#typescript-support}

Package ini sudah menyertakan tipe TypeScript:

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

## Halaman terkait {#related-pages}

<Columns cols={2}>
  <Card title="Gunakan Vercel AI Gateway" icon="cloud" href="/id/docs/integrations/vercel/ai-gateway" cta="Buka panduan" arrow="true">
    Gunakan Exa web search tanpa Exa API key melalui AI Gateway milik Vercel.
  </Card>

  <Card title="Jelajahi package AI SDK" icon="git-branch" href="https://github.com/exa-labs/ai-sdk" cta="Lihat sumber" arrow="true">
    Lihat kode sumber dan detail package di GitHub.
  </Card>
</Columns>

Anda juga dapat menemukan package ini di [npm](https://www.npmjs.com/package/@exalabs/ai-sdk) dan membaca [panduan web search Vercel AI SDK](https://ai-sdk.dev/cookbook/node/web-search-agent#exa).