> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="import-from-csv">
  # Impor from CSV
</div>

> Ubah data CSV yang sudah Anda miliki menjadi sebuah Webset

<br />

<div id="overview">
  ## Ikhtisar
</div>

Fitur Impor from CSV memungkinkan Anda mengubah file CSV berisi URL yang sudah Anda miliki menjadi Websets yang berfungsi penuh. Fitur ini sangat cocok jika Anda sudah memiliki daftar situs web, perusahaan, atau sumber daya yang ingin Anda enrich dengan data tambahan atau Anda saring dengan kriteria pencarian.

<br />

<div id="how-it-works">
  ## Cara kerjanya
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="CSV import flow for creating a Webset" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. Klik &quot;Start from CSV&quot; untuk memilih file CSV Anda
2. Pilih kolom yang berisi URL yang ingin Anda analisis
3. Tinjau bagaimana data Anda akan diimpor sebelum melanjutkan
4. URL Anda diubah menjadi Webset lengkap dengan enrichment dan metadata

<br />

<div id="csv-preparation">
  ## Persiapan CSV
</div>

Pastikan file CSV Anda memiliki kolom URL

* Untuk pencarian People: URL harus berupa URL profil LinkedIn (misalnya, [https://linkedin.com/in/username](https://linkedin.com/in/username))
* Untuk pencarian Company: URL harus berupa URL halaman utama perusahaan (misalnya, [https://example.com](https://example.com))
* Untuk pencarian lainnya: gunakan URL jenis apa pun

Jika Anda tidak memiliki URL, Websets akan mencoba menyimpulkan URL berdasarkan informasi pada setiap baris CSV serta informasi tambahan yang Anda berikan.

Jumlah maksimum hasil yang dapat Anda impor ditentukan oleh plan Anda.

<div id="what-happens-next">
  ## Apa yang terjadi selanjutnya?
</div>

Setelah diimpor, CSV Anda menjadi Webset lengkap tempat Anda dapat:

<div id="enrich-with-custom-columns">
  ### Enrich dengan kolom kustom
</div>

Tambahkan informasi apa pun yang Anda inginkan untuk setiap URL:

* Informasi kontak (email, nomor telepon)
* Metrik perusahaan (pendapatan, jumlah karyawan)
* Analisis konten (sentimen, topik, ringkasan)
* Data kustom yang sesuai dengan kasus penggunaan Anda

<div id="apply-search-criteria">
  ### Terapkan kriteria pencarian
</div>

Saring URL yang Anda impor berdasarkan kriteria tertentu:

* Tahap atau ukuran perusahaan
* Industri atau sektor
* Lokasi geografis
* Tipe konten atau topik