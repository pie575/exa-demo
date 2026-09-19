> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="import-from-csv">
  # Import from CSV
</div>

> Ubah data CSV yang sudah Anda miliki menjadi sebuah Webset

<br />

<div id="overview">
  ## Ikhtisar
</div>

Fitur Import from CSV memungkinkan Anda mengubah file CSV berisi URL yang sudah Anda miliki menjadi Websets yang berfungsi penuh. Fitur ini sangat cocok jika Anda sudah punya daftar situs web, perusahaan, atau sumber daya yang ingin di-enrich dengan data tambahan atau disaring menggunakan search criteria.

<br />

<div id="how-it-works">
  ## Cara kerjanya
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="Alur import CSV untuk membuat Webset" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. Klik &quot;Start from CSV&quot; untuk memilih file CSV Anda
2. Pilih kolom yang berisi URL yang ingin Anda analisis
3. Tinjau bagaimana data Anda akan diimpor sebelum melanjutkan
4. URL Anda diubah menjadi sebuah Webset lengkap dengan enrichment dan metadata

<br />

<div id="csv-preparation">
  ## Persiapan CSV
</div>

Pastikan file CSV Anda memiliki kolom URL

* Untuk search People: URL harus berupa URL profil LinkedIn (misalnya, [https://linkedin.com/in/username](https://linkedin.com/in/username))
* Untuk search Company: URL harus berupa URL beranda perusahaan (misalnya, [https://example.com](https://example.com))
* Untuk search lainnya: gunakan jenis URL apa pun

Jika Anda tidak memiliki URL, Websets akan mencoba menyimpulkan URL berdasarkan informasi pada setiap baris CSV serta informasi tambahan yang Anda berikan.

Jumlah maksimum hasil yang dapat Anda import ditentukan oleh paket Anda.

<div id="what-happens-next">
  ## Apa yang terjadi selanjutnya?
</div>

Setelah diimpor, CSV Anda menjadi Webset lengkap di mana Anda dapat:

<div id="enrich-with-custom-columns">
  ### Enrich dengan kolom kustom
</div>

Tambahkan informasi apa pun yang Anda butuhkan tentang setiap URL:

* Informasi kontak (email, nomor telepon)
* Metrik perusahaan (pendapatan, jumlah karyawan)
* Analisis konten (sentimen, topik, summaries)
* Data kustom sesuai kebutuhan kasus penggunaan Anda

<div id="apply-search-criteria">
  ### Terapkan search criteria
</div>

Filter URL yang Anda impor berdasarkan criteria tertentu:

* Tahap atau ukuran perusahaan
* Industri atau sektor
* Lokasi geografis
* Jenis atau topik konten