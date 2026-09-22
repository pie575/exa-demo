> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Exa untuk Google Sheets {#exa-for-google-sheets}

> Gunakan Exa Agent dan formula Exa langsung di Google Sheets.

<Warning>
  **Beberapa akun Google:** Add-on harus dijalankan dengan akun Google pertama (default) di profil browser Anda. Jika Anda login ke beberapa akun sekaligus, Anda mungkin tidak dapat menyimpan atau memuat API key Anda. Untuk mengatasinya, buka Sheets di jendela penyamaran dengan satu akun saja, atau keluar dari akun lainnya agar akun yang Anda inginkan menjadi default. [Pelajari selengkapnya](https://developers.google.com/apps-script/guides/projects#fix_issues_with_multiple_google_accounts).
</Warning>

Gunakan Exa langsung di Google Sheets untuk melakukan research di web, membuat tabel, dan melengkapi data yang kosong.

Add-on ini menyediakan dua cara kerja:

* **Exa Agent** untuk tabel utuh dan tugas lintas sel
* **`=EXA(...)`** untuk satu jawaban dalam satu sel

## Instal {#install}

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
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>

    Tempelkan key tersebut di sidebar.
  </Step>

  <Step title="Mulai gunakan Exa">
    Buka **Exa Agent** dan mulai gunakan Exa di sheet Anda.
  </Step>
</Steps>

## Exa Agent {#exa-agent}

Exa Agent memungkinkan Anda menggunakan Exa di banyak sel sekaligus dalam Google Sheets.

Gunakan saat Anda ingin:

* membuat tabel lengkap dari satu prompt
* mengisi sel yang kosong pada tabel yang sudah ada
* melanjutkan tabel dengan menambahkan baris baru
* meng-enrich daftar dengan data dari web

### Membuat tabel {#generate-a-table}

Gunakan **Generate table** saat Anda ingin Exa membuat tabel baru.

1. Buka sidebar.
2. Buka **Exa Agent**.
3. Pilih **Generate table**.
4. Tuliskan apa yang Anda inginkan.
5. Klik **Generate table**.

Contoh prompt:

```text theme={null}
Temukan 40 perusahaan AI teratas dan tampilkan nama perusahaan, URL situs web, CEO, tanggal berdiri, kantor pusat, dan deskripsi singkat.
```

Exa melakukan Research di web dan menulis tabel ke dalam sheet Anda.

Secara default, tabel dimulai dari sel yang dipilih. Anda bisa memilih sel awal lain di **More options**.

### Fill cells {#fill-cells}

Gunakan **Fill cells** jika Anda sudah punya tabel dan ingin Exa mengisi data yang masih kosong.

1. Pilih sel-sel kosong di sheet Anda.
2. Buka **Exa Agent**.
3. Pilih **Fill cells**.
4. Klik **Fill selected cells**.

Exa membaca tabel di sekitar pilihan Anda lalu mengisi bagian yang kosong.

Pilih sel kosong pada tabel yang sudah memiliki header yang jelas sebelum menggunakan **Fill cells**.

Contoh:

| Company | Website                                  | CEO           | Headquarters  |
| ------- | ---------------------------------------- | ------------- | ------------- |
| Apple   | [https://apple.com](https://apple.com)   |               |               |
| Google  | [https://google.com](https://google.com) | Sundar Pichai | Mountain View |

Pilih sel kosong pada baris Apple, lalu klik **Fill selected cells**. Exa memakai nama perusahaan dan baris-baris di sekitarnya sebagai konteks.

### Melanjutkan baris {#continue-rows}

Anda juga dapat memilih baris kosong di bawah sebuah tabel.

Jika tabel Anda berakhir di peringkat 55 dan Anda memilih dua baris kosong berikutnya, Exa dapat melanjutkan tabel dengan peringkat 56 dan 57.

Exa memakai baris yang sudah ada sebagai contoh, mempertahankan kolom yang sama, dan menghindari pengulangan item yang sudah ada di tabel.

## `=EXA(...)` {#exa}

Gunakan `=EXA(...)` saat Anda ingin satu jawaban dalam satu sel. Fungsi ini melakukan search di web, membaca hasil teratas, lalu mengembalikan jawaban yang ringkas.

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

Argumen kedua adalah konteks. Anda dapat menyeret formula ke bawah dalam satu kolom untuk menjalankannya di banyak baris.

Gunakan `=EXA(...)` untuk jawaban sederhana dalam satu sel. Gunakan **Exa Agent** jika Anda ingin membuat atau mengisi seluruh tabel.

## `=EXA_ANSWER(...)` {#exa_answer}

Jawaban AI tingkat lanjut dengan kendali penuh atas format output. Gunakan ini saat Anda memerlukan system prompt, output JSON terstruktur, sitasi, atau search type tertentu.

```text theme={null}
=EXA_ANSWER(prompt, [prefix], [suffix], [includeCitations], [systemPrompt], [outputSchema], [returnRawJson], [type])
```

| Parameter          | Wajib | Default  | Deskripsi                                                                                               |
| ------------------ | ----- | -------- | ------------------------------------------------------------------------------------------------------- |
| `prompt`           | Ya    | —        | Pertanyaan atau prompt utama.                                                                           |
| `prefix`           | Tidak | `""`     | Teks yang ditambahkan sebelum prompt.                                                                   |
| `suffix`           | Tidak | `""`     | Teks yang ditambahkan setelah prompt.                                                                   |
| `includeCitations` | Tidak | `FALSE`  | Jika `TRUE`, menambahkan sitasi sumber bernomor.                                                        |
| `systemPrompt`     | Tidak | `""`     | Instruksi sistem untuk mengatur format keluaran (mis. `"only return a number"`).                        |
| `outputSchema`     | Tidak | `""`     | JSON schema untuk output terstruktur. [Buat schema di sini](https://dashboard.exa.ai/playground/answer). |
| `returnRawJson`    | Tidak | `FALSE`  | Jika `TRUE` dan `outputSchema` diisi, mengembalikan JSON lengkap alih-alih mengekstrak nilainya.        |
| `type`             | Tidak | `"deep"` | Search type: `"auto"`, `"neural"`, `"fast"`, atau `"deep"`.                                             |

Contoh:

```text theme={null}
=EXA_ANSWER("OpenAI CEO", "", "", FALSE, "only return a name")
=EXA_ANSWER("Modal AI headcount", "", "", FALSE, "only return a number")
=EXA_ANSWER("ceo of exa.ai", "", "", FALSE, "", "{""type"":""object"",""properties"":{""name"":{""type"":""string""}}}")
```

## `=EXA_SEARCH(...)` {#exa_search}

Mencari di web dan mengembalikan daftar URL secara vertikal. Mendukung pemfilteran domain, pemfilteran kategori, kutipan konten, dan output tersintesis melalui `outputSchema`.

```text theme={null}
=EXA_SEARCH(query, [numResults], [searchType], [prefix], [suffix], [includeDomainsStr], [excludeDomainsStr], [category], [highlightsMaxChars], [outputSchemaJson])
```

| Parameter            | Wajib | Default  | Deskripsi                                                                                                                                                            |
| -------------------- | ----- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`              | Ya    | —        | Query pencarian.                                                                                                                                                     |
| `numResults`         | Tidak | `1`      | Jumlah hasil (1–10).                                                                                                                                                 |
| `searchType`         | Tidak | `"auto"` | `"auto"`, `"neural"`, atau `"keyword"`.                                                                                                                              |
| `prefix`             | Tidak | `""`     | Teks yang ditambahkan sebelum query.                                                                                                                                 |
| `suffix`             | Tidak | `""`     | Teks yang ditambahkan setelah query.                                                                                                                                 |
| `includeDomainsStr`  | Tidak | `""`     | Domain yang disertakan, dipisahkan koma (misalnya, `"linkedin.com,crunchbase.com"`).                                                                                 |
| `excludeDomainsStr`  | Tidak | `""`     | Domain yang dikecualikan, dipisahkan koma.                                                                                                                           |
| `category`           | Tidak | `""`     | Filter berdasarkan tipe: `"company"`, `"publication"`, `"news"`, `"personal site"`, `"financial report"`, `"people"`.                                                |
| `highlightsMaxChars` | Tidak | `0`      | Jika &gt; 0, meminta kutipan konten dengan batas karakter ini per hasil.                                                                                             |
| `outputSchemaJson`   | Tidak | `""`     | String JSON untuk `outputSchema` (misalnya, `"{""type"":""text"",""description"":""summarize""}"`). Jika diisi, mengembalikan teks output hasil sintesis, bukan URL. |

Contoh:

```text theme={null}
=EXA_SEARCH("AI startups", 5, "auto", "", "", "linkedin.com,crunchbase.com")
=EXA_SEARCH("transformer architecture", 5, "auto", "", "", "", "", "publication")
```

## `=EXA_CONTENTS(...)` {#exa_contents}

Mengekstrak konten teks dari sebuah URL.

```text theme={null}
=EXA_CONTENTS(url)
```

| Parameter | Wajib | Deskripsi                                        |
| --------- | ----- | ------------------------------------------------ |
| `url`     | Ya    | URL lengkap (harus diawali `http` atau `https`). |

## `=EXA_FINDSIMILAR(...)` {#exa_findsimilar}

Mencari URL yang mirip dengan URL referensi, dengan filter domain dan teks yang bersifat opsional.

```text theme={null}
=EXA_FINDSIMILAR(url, [numResults], [includeDomainsStr], [excludeDomainsStr], [includeTextStr], [excludeTextStr])
```

| Parameter           | Wajib | Default | Deskripsi                                  |
| ------------------- | ----- | ------- | ------------------------------------------ |
| `url`               | Ya    | —       | URL referensi.                             |
| `numResults`        | Tidak | `1`     | Jumlah hasil (1–10).                       |
| `includeDomainsStr` | Tidak | `""`    | Domain yang disertakan, dipisahkan koma.   |
| `excludeDomainsStr` | Tidak | `""`    | Domain yang dikecualikan, dipisahkan koma. |
| `includeTextStr`    | Tidak | `""`    | Frasa yang harus muncul dalam hasil.       |
| `excludeTextStr`    | Tidak | `""`    | Frasa yang tidak boleh muncul dalam hasil. |

## Batch {#batch}

Gunakan **Batch** saat Anda ingin mengelola banyak sel formula Exa sekaligus.

Batch dapat:

* menyegarkan sel terpilih yang berisi formula Exa
* mengubah formula Exa terpilih menjadi nilai biasa

Ubah formula menjadi nilai jika Anda ingin mempertahankan hasil saat ini dan mencegah formula dijalankan kembali.

## Kapan menggunakan apa {#when-to-use-what}

| Tugas                                                           | Gunakan                    |
| --------------------------------------------------------------- | -------------------------- |
| Membuat tabel lengkap dari sebuah prompt                        | Exa Agent → Generate table |
| Mengisi sel kosong pada tabel                                   | Exa Agent → Fill cells     |
| Melanjutkan tabel dengan baris baru                             | Exa Agent → Fill cells     |
| Mendapatkan satu nilai pada satu sel                            | `=EXA(...)`                |
| Mendapatkan jawaban dengan system prompt atau output terstruktur | `=EXA_ANSWER(...)`         |
| Mencari dan mendapatkan daftar URL                              | `=EXA_SEARCH(...)`         |
| Mengekstrak teks dari sebuah URL                                | `=EXA_CONTENTS(...)`       |
| Menemukan halaman yang serupa dengan sebuah URL                 | `=EXA_FINDSIMILAR(...)`    |
| Menyegarkan banyak formula Exa sekaligus                        | Batch                      |
| Menyimpan hasil formula sebagai teks biasa                      | Batch → Convert to values  |

## Catatan {#notes}

* Permintaan Exa API diperhitungkan dalam kuota penggunaan Anda. Gunakan **Batch → Convert to values** untuk membekukan hasil agar formula tidak menghitung ulang.
* Add-on ini otomatis mencoba ulang hingga 3 kali dengan exponential backoff saat terkena rate limit (HTTP 429).
* Mulailah dengan batch kecil (10–20 baris) sebelum menskalakan ke ratusan baris.

## Tautan {#links}

* [Instal Exa AI for Google Sheets](https://workspace.google.com/marketplace/app/exa_ai/465545439521)
* [Dapatkan Exa API key](https://dashboard.exa.ai/api-keys)
* [Repositori GitHub](https://github.com/exa-labs/exa-for-sheets)
* [Kebijakan Privasi](https://exa.ai/exa-for-sheets/privacy-policy)