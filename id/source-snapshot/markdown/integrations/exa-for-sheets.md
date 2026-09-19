> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-for-google-sheets">
  # Exa untuk Google Sheets
</div>

> Gunakan Exa Agent dan formula Exa langsung di Google Sheets.

<Warning>
  **Beberapa akun Google:** Add-on harus dijalankan dengan akun Google pertama (default) pada profil browser Anda. Jika Anda login ke beberapa akun sekaligus, Anda mungkin tidak dapat menyimpan atau memuat API key Anda. Untuk mengatasinya, buka Sheets di jendela samaran (incognito) dengan hanya satu akun, atau keluar dari akun lainnya agar akun yang Anda inginkan menjadi akun default. [Pelajari lebih lanjut](https://developers.google.com/apps-script/guides/projects#fix_issues_with_multiple_google_accounts).
</Warning>

Gunakan Exa di dalam Google Sheets untuk meneliti web, membuat tabel, dan melengkapi data yang kosong.

Add-on ini menawarkan dua cara kerja:

* **Exa Agent** untuk tabel utuh dan tugas lintas sel
* **`=EXA(...)`** untuk satu jawaban dalam satu sel

<div id="install">
  ## Instalasi
</div>

<Steps>
  <Step title="Instal add-on">
    Buka [add-on Exa AI](https://workspace.google.com/marketplace/app/exa_ai/465545439521) di Google Workspace Marketplace, lalu klik **Install**.
  </Step>

  <Step title="Buka Google Sheet">
    Buka spreadsheet baru atau yang sudah ada.
  </Step>

  <Step title="Buka sidebar">
    Buka **Extensions → Exa AI → Open Sidebar**.
  </Step>

  <Step title="Tambahkan API key Anda">
    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru langsung mendapat credits gratis.
    </Card>

    Tempelkan key tersebut di sidebar.
  </Step>

  <Step title="Mulai gunakan Exa">
    Buka **Exa Agent** dan mulai gunakan Exa di sheet Anda.
  </Step>
</Steps>

<div id="exa-agent">
  ## Exa Agent
</div>

Exa Agent memungkinkan Anda menggunakan Exa di banyak sel sekaligus dalam Google Sheets.

Gunakan fitur ini saat Anda ingin:

* membuat tabel lengkap dari satu prompt
* mengisi sel yang kosong pada tabel yang sudah ada
* melanjutkan tabel dengan menambahkan baris baru
* memperkaya daftar dengan data dari web

<div id="generate-a-table">
  ### Membuat tabel
</div>

Gunakan **Generate table** saat Anda ingin Exa membuat tabel baru.

1. Buka sidebar.
2. Buka **Exa Agent**.
3. Pilih **Generate table**.
4. Tuliskan apa yang Anda inginkan.
5. Klik **Generate table**.

Contoh prompt:

```text theme={null}
Cari 40 perusahaan AI teratas dan tampilkan nama perusahaan, URL situs web, CEO, tanggal pendirian, kantor pusat, dan deskripsi singkat.
```

Exa menelusuri web dan menuliskan tabel ke dalam sheet Anda.

Secara default, tabel dimulai dari sel yang dipilih. Anda dapat memilih sel awal lain di **More options**.

<div id="fill-cells">
  ### Fill cells
</div>

Gunakan **Fill cells** jika Anda sudah punya tabel dan ingin Exa mengisi data yang kosong.

1. Pilih sel kosong di sheet Anda.
2. Buka **Exa Agent**.
3. Pilih **Fill cells**.
4. Klik **Fill selected cells**.

Exa akan membaca tabel di sekitar sel yang Anda pilih dan mengisi bagian yang kosong.

Pilih sel kosong pada tabel yang sudah memiliki header yang jelas sebelum menggunakan **Fill cells**.

Contoh:

| Company | Website                                  | CEO           | Headquarters  |
| ------- | ---------------------------------------- | ------------- | ------------- |
| Apple   | [https://apple.com](https://apple.com)   |               |               |
| Google  | [https://google.com](https://google.com) | Sundar Pichai | Mountain View |

Pilih sel kosong pada baris Apple, lalu klik **Fill selected cells**. Exa memakai nama perusahaan dan baris-baris di sekitarnya sebagai konteks.

<div id="continue-rows">
  ### Melanjutkan baris
</div>

Anda juga dapat memilih baris kosong di bawah tabel.

Jika tabel Anda berakhir pada peringkat 55 dan Anda memilih dua baris kosong berikutnya, Exa dapat melanjutkan tabel dengan peringkat 56 dan 57.

Exa menjadikan baris yang sudah ada sebagai contoh, mempertahankan kolom yang sama, dan menghindari pengulangan item yang sudah ada di tabel.

<div id="exa">
  ## `=EXA(...)`
</div>

Gunakan `=EXA(...)` bila Anda ingin satu jawaban dalam satu sel. Fungsi ini melakukan search di web, membaca hasil teratas, lalu mengembalikan jawaban yang ringkas.

```text theme={null}
=EXA("what you want", cell)
```

| Parameter | Wajib | Deskripsi                                                                   |
| --------- | ----- | --------------------------------------------------------------------------- |
| `prompt`  | Ya    | Informasi yang Anda inginkan (mis. `"Return only the CEO name"`).           |
| `context` | Tidak | Referensi sel atau teks yang akan di-enrich (mis. nama perusahaan di `A2`). |

Contoh:

```text theme={null}
=EXA("Return only the company website URL", A2)
=EXA("Return only the CEO name", A2)
=EXA("Return only the headquarters", A2)
=EXA("Return the Amazon rating of this product", A2)
```

Argumen kedua adalah konteks. Anda dapat menarik formula ke bawah dalam satu kolom untuk menjalankannya di banyak baris.

Gunakan `=EXA(...)` untuk jawaban sederhana dalam satu sel. Gunakan **Exa Agent** jika Anda ingin membuat atau mengisi seluruh tabel.

<div id="exa_answer">
  ## `=EXA_ANSWER(...)`
</div>

Jawaban AI tingkat lanjut dengan kendali penuh atas format output. Gunakan ini saat Anda memerlukan system prompt, output JSON terstruktur, citations, atau search type tertentu.

```text theme={null}
=EXA_ANSWER(prompt, [prefix], [suffix], [includeCitations], [systemPrompt], [outputSchema], [returnRawJson], [type])
```

| Parameter          | Wajib | Default  | Deskripsi                                                                                               |
| ------------------ | ----- | -------- | ------------------------------------------------------------------------------------------------------- |
| `prompt`           | Ya    | —        | Pertanyaan atau prompt utama.                                                                           |
| `prefix`           | Tidak | `""`     | Teks yang ditambahkan sebelum prompt.                                                                   |
| `suffix`           | Tidak | `""`     | Teks yang ditambahkan setelah prompt.                                                                   |
| `includeCitations` | Tidak | `FALSE`  | Jika `TRUE`, menambahkan citations sumber bernomor.                                                     |
| `systemPrompt`     | Tidak | `""`     | Instruksi sistem untuk mengatur format output (mis. `"only return a number"`).                          |
| `outputSchema`     | Tidak | `""`     | JSON schema untuk structured output. [Buat schema di sini](https://dashboard.exa.ai/playground/answer). |
| `returnRawJson`    | Tidak | `FALSE`  | Jika `TRUE` dan `outputSchema` diisi, mengembalikan JSON lengkap alih-alih mengekstrak nilainya.        |
| `type`             | Tidak | `"deep"` | Search type: `"auto"`, `"neural"`, `"fast"`, atau `"deep"`.                                             |

Contoh:

```text theme={null}
=EXA_ANSWER("OpenAI CEO", "", "", FALSE, "only return a name")
=EXA_ANSWER("Modal AI headcount", "", "", FALSE, "only return a number")
=EXA_ANSWER("ceo of exa.ai", "", "", FALSE, "", "{""type"":""object"",""properties"":{""name"":{""type"":""string""}}}")
```

<div id="exa_search">
  ## `=EXA_SEARCH(...)`
</div>

Melakukan search di web dan mengembalikan daftar URL dalam bentuk vertikal. Mendukung pemfilteran domain, pemfilteran kategori, highlights konten, dan output hasil sintesis melalui `outputSchema`.

```text theme={null}
=EXA_SEARCH(query, [numResults], [searchType], [prefix], [suffix], [includeDomainsStr], [excludeDomainsStr], [category], [highlightsMaxChars], [outputSchemaJson])
```

| Parameter            | Wajib | Default  | Deskripsi                                                                                                                                                          |
| -------------------- | ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `query`              | Ya    | —        | Query pencarian.                                                                                                                                                   |
| `numResults`         | Tidak | `1`      | Jumlah hasil (1–10).                                                                                                                                               |
| `searchType`         | Tidak | `"auto"` | `"auto"`, `"neural"`, atau `"keyword"`.                                                                                                                            |
| `prefix`             | Tidak | `""`     | Teks yang ditambahkan sebelum query.                                                                                                                               |
| `suffix`             | Tidak | `""`     | Teks yang ditambahkan setelah query.                                                                                                                               |
| `includeDomainsStr`  | Tidak | `""`     | Domain yang disertakan, dipisahkan koma (mis. `"linkedin.com,crunchbase.com"`).                                                                                    |
| `excludeDomainsStr`  | Tidak | `""`     | Domain yang dikecualikan, dipisahkan koma.                                                                                                                         |
| `category`           | Tidak | `""`     | Filter berdasarkan tipe: `"company"`, `"publication"`, `"news"`, `"personal site"`, `"financial report"`, `"people"`.                                              |
| `highlightsMaxChars` | Tidak | `0`      | Jika &gt; 0, meminta highlights konten dengan batas karakter ini per hasil.                                                                                        |
| `outputSchemaJson`   | Tidak | `""`     | String JSON untuk `outputSchema` (mis. `"{""type"":""text"",""description"":""summarize""}"`). Jika diisi, mengembalikan teks output hasil sintesis alih-alih URL. |

Contoh:

```text theme={null}
=EXA_SEARCH("AI startups", 5, "auto", "", "", "linkedin.com,crunchbase.com")
=EXA_SEARCH("transformer architecture", 5, "auto", "", "", "", "", "publication")
```

<div id="exa_contents">
  ## `=EXA_CONTENTS(...)`
</div>

Mengekstrak konten teks dari sebuah URL.

```text theme={null}
=EXA_CONTENTS(url)
```

| Parameter | Wajib | Deskripsi                                        |
| --------- | ----- | ------------------------------------------------ |
| `url`     | Ya    | URL lengkap (harus diawali `http` atau `https`). |

<div id="exa_findsimilar">
  ## `=EXA_FINDSIMILAR(...)`
</div>

Mencari URL yang mirip dengan URL acuan, dengan filter domain dan teks opsional.

```text theme={null}
=EXA_FINDSIMILAR(url, [numResults], [includeDomainsStr], [excludeDomainsStr], [includeTextStr], [excludeTextStr])
```

| Parameter           | Wajib | Default | Deskripsi                                  |
| ------------------- | ----- | ------- | ------------------------------------------ |
| `url`               | Ya    | —       | URL acuan.                                 |
| `numResults`        | Tidak | `1`     | Jumlah hasil (1–10).                       |
| `includeDomainsStr` | Tidak | `""`    | Domain yang disertakan, dipisahkan koma.   |
| `excludeDomainsStr` | Tidak | `""`    | Domain yang dikecualikan, dipisahkan koma. |
| `includeTextStr`    | Tidak | `""`    | Frasa yang harus muncul dalam hasil.       |
| `excludeTextStr`    | Tidak | `""`    | Frasa yang tidak boleh muncul dalam hasil. |

<div id="batch">
  ## Batch
</div>

Gunakan **Batch** saat Anda ingin mengerjakan banyak sel formula Exa sekaligus.

Batch dapat:

* memperbarui sel terpilih yang berisi formula Exa
* mengubah formula Exa terpilih menjadi nilai biasa

Ubah formula menjadi nilai jika Anda ingin mempertahankan hasil saat ini dan mencegah formula berjalan kembali.

<div id="when-to-use-what">
  ## Kapan menggunakan apa
</div>

| Tugas                                                           | Gunakan                    |
| --------------------------------------------------------------- | -------------------------- |
| Membuat tabel lengkap dari sebuah prompt                        | Exa Agent → Generate table |
| Mengisi sel kosong pada tabel                                   | Exa Agent → Fill cells     |
| Melanjutkan tabel dengan baris baru                             | Exa Agent → Fill cells     |
| Mendapatkan satu nilai pada satu sel                            | `=EXA(...)`                |
| Mendapatkan jawaban dengan system prompt atau structured output | `=EXA_ANSWER(...)`         |
| Melakukan search dan mendapatkan daftar URL                     | `=EXA_SEARCH(...)`         |
| Mengekstrak teks dari sebuah URL                                | `=EXA_CONTENTS(...)`       |
| Mencari halaman yang mirip dengan sebuah URL                    | `=EXA_FINDSIMILAR(...)`    |
| Menyegarkan banyak formula Exa sekaligus                        | Batch                      |
| Menyimpan hasil formula sebagai teks biasa                      | Batch → Convert to values  |

<div id="notes">
  ## Catatan
</div>

* Permintaan API Exa dihitung dalam kuota usage Anda. Gunakan **Batch → Convert to values** untuk membekukan hasil agar formula tidak dihitung ulang.
* Add-on ini otomatis mencoba ulang hingga 3 kali dengan exponential backoff saat terkena rate limit (HTTP 429).
* Mulailah dengan batch kecil (10–20 baris) sebelum menskalakannya hingga ratusan baris.

<div id="links">
  ## Tautan
</div>

* [Pasang Exa AI untuk Google Sheets](https://workspace.google.com/marketplace/app/exa_ai/465545439521)
* [Dapatkan API key Exa](https://dashboard.exa.ai/api-keys)
* [Repository GitHub](https://github.com/exa-labs/exa-for-sheets)
* [Kebijakan Privasi](https://exa.ai/exa-for-sheets/privacy-policy)