> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# OpenClaw {#openclaw}

> Lengkapi OpenClaw dengan web search real-time dan page contents dari Exa.

[OpenClaw](https://openclaw.ai/) mendukung Exa sebagai provider `web_search` native. Setelah dipilih, setiap agent OpenClaw dapat memanfaatkan search mode Exa, filter tanggal, dan extraction konten melalui tool web bawaan.

## Menyiapkan Exa {#set-up-exa}

<Steps>
  <Step title="Pasang plugin Exa">
    ```bash theme={null}
    openclaw plugins install @openclaw/exa-plugin
    openclaw gateway restart
    ```
  </Step>

  <Step title="Dapatkan Exa API key">
    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru langsung mendapat credits gratis.
    </Card>
  </Step>

  <Step title="Simpan key">
    Untuk instalasi gateway, tambahkan key ke `~/.openclaw/.env`:

    ```bash ~/.openclaw/.env theme={null}
    EXA_API_KEY=your-exa-api-key
    ```

    Restart gateway setelah mengubah environment-nya.
  </Step>

  <Step title="Pilih Exa untuk web search">
    Jalankan:

    ```bash theme={null}
    openclaw configure --section web
    ```

    Pilih **Exa** sebagai provider web search. OpenClaw menyimpan pemilihan provider di konfigurasinya dan membaca credential dari `EXA_API_KEY`.
  </Step>
</Steps>

## Konfigurasi secara manual {#configure-manually}

Anda dapat memilih Exa langsung di konfigurasi JSON5 OpenClaw:

```json5 theme={null}
{
  tools: {
    web: {
      search: {
        provider: "exa",
      },
    },
  },
}
```

Untuk menyimpan key di konfigurasi alih-alih di environment gateway:

```json5 theme={null}
{
  plugins: {
    entries: {
      exa: {
        config: {
          webSearch: {
            apiKey: "exa-...",
          },
        },
      },
    },
  },
}
```

<Note>
  Sebaiknya gunakan `EXA_API_KEY` atau SecretRef OpenClaw daripada menyimpan API key langsung di file konfigurasi.
</Note>

## Apa yang dapat diminta agent {#what-agents-can-request}

OpenClaw menyediakan Exa melalui `web_search`.

| Parameter                    | Tujuan                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `query`                      | Query web search.                                                                            |
| `count`                      | Jumlah hasil, hingga 100 dan tunduk pada batas dari search type yang dipilih.                |
| `type`                       | Search mode Exa, meliputi `auto`, `neural`, `fast`, `instant`, `deep`, dan `deep-reasoning`. |
| `freshness`                  | Membatasi hasil pada hari, minggu, bulan, atau tahun terakhir.                               |
| `date_after` / `date_before` | Membatasi hasil dengan rentang `YYYY-MM-DD`.                                                 |
| `contents`                   | Mengembalikan teks penuh, kutipan, atau ringkasan pada setiap hasil.                         |

Jika `contents` tidak disertakan, OpenClaw meminta kutipan secara default. Agent dapat meminta bentuk konten yang berbeda saat membutuhkan halaman lengkap atau ringkasan:

```javascript theme={null}
await web_search({
  query: "transformer architecture explained",
  type: "neural",
  contents: {
    text: { maxCharacters: 5000 },
    highlights: { numSentences: 3 },
    summary: true,
  },
});
```

OpenClaw menyimpan hasil web search di cache selama 15 menit secara default. Ubah `tools.web.search.cacheTtlMinutes` atau setel ke `0` jika setiap permintaan harus selalu mendapatkan data terbaru.

## Pemecahan Masalah {#troubleshooting}

<AccordionGroup>
  <Accordion title="OpenClaw tidak menampilkan Exa sebagai provider">
    Pasang `@openclaw/exa-plugin`, mulai ulang gateway, lalu jalankan kembali `openclaw configure --section web`.
  </Accordion>

  <Accordion title="OpenClaw melaporkan Exa key tidak ditemukan">
    Pastikan `EXA_API_KEY` tersedia bagi proses gateway, bukan hanya di shell interaktif Anda. Untuk instalasi gateway, tempatkan di `~/.openclaw/.env` lalu mulai ulang gateway.
  </Accordion>

  <Accordion title="Hasil search tampak usang">
    OpenClaw menyimpan cache hasil secara terpisah dari Exa. Turunkan nilai `tools.web.search.cacheTtlMinutes` atau setel ke `0`, lalu gunakan opsi kesegaran konten Exa saat meminta konten halaman.
  </Accordion>
</AccordionGroup>

## Sumber daya {#resources}

<Columns cols={3}>
  <Card title="Exa provider OpenClaw" icon="book-open" href="https://docs.openclaw.ai/tools/exa-search" cta="Baca panduan" arrow="true">
    Tinjau konfigurasi plugin dan parameter tool saat ini.
  </Card>

  <Card title="Exa Search" icon="search" href="/id/docs/search/quickstart" cta="Baca panduan" arrow="true">
    Bandingkan search mode Exa dan format response.
  </Card>

  <Card title="Kesegaran konten" icon="clock" href="/id/docs/contents/quickstart#content-freshness" cta="Baca panduan" arrow="true">
    Kendalikan konten halaman dari indeks maupun yang diambil secara live.
  </Card>
</Columns>