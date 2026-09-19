> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="openclaw">
  # OpenClaw
</div>

> Lengkapi OpenClaw dengan web search real-time dan page contents dari Exa.

[OpenClaw](https://openclaw.ai/) mendukung Exa sebagai provider `web_search` native. Setelah dipilih, setiap agent OpenClaw dapat memanfaatkan search mode Exa, filter tanggal, dan extraction konten melalui tool web bawaan.

<div id="set-up-exa">
  ## Menyiapkan Exa
</div>

<Steps>
  <Step title="Instal plugin Exa">
    ```bash theme={null}
    openclaw plugins install @openclaw/exa-plugin
    openclaw gateway restart
    ```
  </Step>

  <Step title="Dapatkan Exa API key">
    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Simpan key">
    Untuk instalasi gateway, tambahkan key ke `~/.openclaw/.env`:

    ```bash ~/.openclaw/.env theme={null}
    EXA_API_KEY=your-exa-api-key
    ```

    Mulai ulang gateway setelah mengubah environment-nya.
  </Step>

  <Step title="Pilih Exa untuk web search">
    Jalankan:

    ```bash theme={null}
    openclaw configure --section web
    ```

    Pilih **Exa** sebagai provider web search. OpenClaw menyimpan pilihan provider tersebut di konfigurasinya dan membaca credential dari `EXA_API_KEY`.
  </Step>
</Steps>

<div id="configure-manually">
  ## Konfigurasi manual
</div>

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
  Sebaiknya gunakan `EXA_API_KEY` atau SecretRef OpenClaw daripada menuliskan API key langsung di file konfigurasi.
</Note>

<div id="what-agents-can-request">
  ## Apa yang dapat diminta oleh agent
</div>

OpenClaw menyediakan Exa melalui `web_search`.

| Parameter                    | Tujuan                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `query`                      | Query web search.                                                                            |
| `count`                      | Jumlah hasil, hingga 100 dan mengikuti limit dari search type yang dipilih.                  |
| `type`                       | Search mode Exa, meliputi `auto`, `neural`, `fast`, `instant`, `deep`, dan `deep-reasoning`. |
| `freshness`                  | Membatasi hasil pada hari, minggu, bulan, atau tahun terakhir.                               |
| `date_after` / `date_before` | Membatasi hasil dengan rentang `YYYY-MM-DD`.                                                 |
| `contents`                   | Mengembalikan teks lengkap, highlights, atau summaries pada setiap hasil.                    |

Jika `contents` tidak disertakan, OpenClaw meminta highlights secara default. Agent dapat meminta bentuk konten yang berbeda saat membutuhkan halaman lengkap atau summaries:

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

Secara bawaan, OpenClaw menyimpan hasil web search dalam cache selama 15 menit. Ubah `tools.web.search.cacheTtlMinutes` atau setel ke `0` jika setiap permintaan harus selalu baru.

<div id="troubleshooting">
  ## Pemecahan Masalah
</div>

<AccordionGroup>
  <Accordion title="OpenClaw tidak menampilkan Exa sebagai provider">
    Pasang `@openclaw/exa-plugin`, mulai ulang gateway, lalu jalankan kembali `openclaw configure --section web`.
  </Accordion>

  <Accordion title="OpenClaw melaporkan key Exa tidak ditemukan">
    Pastikan `EXA_API_KEY` tersedia bagi proses gateway, bukan hanya di shell interaktif Anda. Untuk instalasi gateway, letakkan di `~/.openclaw/.env` lalu mulai ulang gateway.
  </Accordion>

  <Accordion title="Hasil search tampak usang">
    OpenClaw menyimpan cache hasil secara terpisah dari Exa. Turunkan nilai `tools.web.search.cacheTtlMinutes` atau setel ke `0`, lalu gunakan opsi content freshness Exa saat meminta page contents.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Sumber Daya
</div>

<Columns cols={3}>
  <Card title="Exa provider OpenClaw" icon="book-open" href="https://docs.openclaw.ai/tools/exa-search" cta="Baca panduan" arrow="true">
    Tinjau konfigurasi plugin dan parameter tool saat ini.
  </Card>

  <Card title="Exa Search" icon="search" href="/id/docs/search/quickstart" cta="Baca panduan" arrow="true">
    Bandingkan search mode Exa beserta format responsnya.
  </Card>

  <Card title="Content freshness" icon="clock" href="/id/docs/contents/quickstart#content-freshness" cta="Baca panduan" arrow="true">
    Kendalikan page contents yang terindeks maupun yang diambil secara langsung.
  </Card>
</Columns>