> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Hermes Agent {#hermes-agent}

> Berikan Hermes Agent kemampuan web search real-time dan page contents dengan Exa.

[Hermes Agent](https://github.com/NousResearch/hermes-agent) menyertakan Exa sebagai backend native untuk tool `web_search` dan `web_extract` yang dapat dipanggil model. Gunakan Exa untuk kedua kemampuan tersebut, atau padukan dengan provider web Hermes lainnya.

## Hubungkan akun Exa Anda {#connect-your-exa-account}

<Steps>
  <Step title="Dapatkan Exa API key">
    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Pilih Exa di Hermes">
    Jalankan wizard penyiapan tool:

    ```bash theme={null}
    hermes tools
    ```

    Buka **Web Search &amp; Extract**, pilih Exa, lalu pilih opsi yang menggunakan API key. Saat diminta, masukkan Exa API key Anda. Hermes menyimpan secret di `~/.hermes/.env` dan pemilihan provider di `~/.hermes/config.yaml`.
  </Step>

  <Step title="Uji akses web">
    Jalankan Hermes dan minta Hermes melakukan search, lalu baca salah satu hasilnya:

    ```text theme={null}
    Search the web for the latest Exa product updates, then read the most relevant result.
    ```

    Hermes semestinya memanggil `web_search`, lalu `web_extract` saat membutuhkan isi halamannya.
  </Step>
</Steps>

## Konfigurasi manual {#configure-manually}

Tambahkan key Anda ke file environment Hermes:

```bash ~/.hermes/.env theme={null}
EXA_API_KEY=your-exa-api-key
```

Lalu pilih Exa untuk kedua capabilities web tersebut:

```yaml ~/.hermes/config.yaml theme={null}
web:
  search_backend: "exa"
  extract_backend: "exa"
```

Sebagai gantinya, Anda dapat menggunakan fallback bersama:

```yaml ~/.hermes/config.yaml theme={null}
web:
  backend: "exa"
```

Pengaturan per capability lebih diprioritaskan daripada `web.backend`. Dengan begitu, Anda bisa menggunakan Exa hanya untuk search atau hanya untuk extraction saat menggabungkan provider.

## Tool yang didapat Hermes {#tools-hermes-gets}

| Tool          | Perilaku Exa                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `web_search`  | Melakukan search dengan Exa dan mengembalikan halaman terurut berdasarkan peringkat beserta judul, URL, dan cuplikan teks. |
| `web_extract` | Mengambil konten yang dapat dibaca dari satu atau beberapa URL melalui Exa Contents.                                       |

Hermes memotong halaman hasil ekstraksi yang panjang agar sesuai dengan character budget yang dikonfigurasi dan menyimpan teks lengkapnya di disk. Ubah nilai default melalui `web.extract_char_limit`, atau biarkan agent meminta `char_limit` yang lebih besar untuk satu panggilan tertentu.

<Note>
  Hermes dapat menggunakan Exa melalui kumpulan provider gratis tanpa key, sehingga API key tidak diperlukan. Kumpulan tersebut dibatasi laju permintaannya dan dapat berganti-ganti antar provider. Konfigurasikan `EXA_API_KEY` dan pilih opsi Exa yang menggunakan API key jika Anda ingin permintaan selalu menggunakan akun Exa Anda.
</Note>

## Pemecahan Masalah {#troubleshooting}

<AccordionGroup>
  <Accordion title="Hermes tidak memilih Exa">
    Jalankan `hermes tools` lalu pilih Exa secara eksplisit. Jika Anda mengonfigurasi file secara manual, pastikan `web.search_backend`, `web.extract_backend`, atau `web.backend` disetel ke `exa`.
  </Accordion>

  <Accordion title="Hermes melaporkan bahwa EXA_API_KEY tidak ditemukan">
    Tambahkan key ke `~/.hermes/.env`, lalu mulai ulang Hermes agar environment dimuat ulang.
  </Accordion>

  <Accordion title="Search berfungsi tetapi extraction menggunakan provider lain">
    Hermes dapat mengonfigurasi search dan extraction secara terpisah. Setel `web.search_backend` dan `web.extract_backend` ke `exa`.
  </Accordion>
</AccordionGroup>

## Sumber Daya {#resources}

<Columns cols={3}>
  <Card title="Tool web Hermes" icon="book-open" href="https://hermes-agent.nousresearch.com/docs/user-guide/features/web-search" cta="Baca panduan" arrow="true">
    Tinjau pemilihan provider, caching, dan perilaku extraction pada Hermes.
  </Card>

  <Card title="Exa Search" icon="search" href="/id/docs/search/quickstart" cta="Baca panduan" arrow="true">
    Pelajari cara Exa melakukan search, memfilter, dan mengembalikan page contents.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/id/docs/contents/quickstart" cta="Baca panduan" arrow="true">
    Pahami API extraction di balik `web_extract`.
  </Card>
</Columns>