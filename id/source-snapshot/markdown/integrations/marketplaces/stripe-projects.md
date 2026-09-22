> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="stripe-projects">
  # Stripe Projects
</div>

> Integrasikan Exa dari terminal Anda menggunakan Stripe Projects CLI.

[Stripe Projects](https://projects.dev) memungkinkan Anda dan coding agent Anda menyediakan layanan pihak ketiga langsung dari terminal, tanpa dashboard dan tanpa salin-tempel key. Cukup satu perintah untuk membuat akun Exa dan menyinkronkan API key ke proyek Anda.

<div id="prerequisites">
  ## Prasyarat
</div>

Instal Stripe CLI dan plugin Projects:

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

Untuk platform lain dan penyiapan CLI lengkap, lihat [Stripe Projects](https://projects.dev).

<div id="get-started">
  ## Memulai
</div>

Dari direktori proyek Anda, inisialisasi proyek, tambahkan Exa, lalu tarik credential:

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

File `.env` Anda kini berisi `EXA_API_KEY`. [SDK Exa](/id/docs/sdks/quickstart) dan [Quickstart](/id/docs/search/quickstart) membaca variabel ini secara otomatis, sehingga kode Anda langsung berjalan tanpa perlu diubah.

<Info>
  Key tersebut di-provision di akun Exa milik Anda. Kelola penggunaan, key, dan billing kapan saja melalui [Exa Dashboard](https://dashboard.exa.ai).
</Info>

<div id="link-an-existing-exa-team">
  ## Menautkan team Exa yang sudah ada
</div>

Sudah punya akun Exa? Tautkan terlebih dahulu agar API key di-provision di bawah team Anda yang sudah ada:

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link` akan membuka Exa agar Anda dapat melakukan autentikasi dan menautkan team Anda ke akun Stripe Anda. Buka Exa Dashboard yang tertaut kapan saja dengan `stripe projects open exa`.

<div id="provision-from-your-coding-agent">
  ## Provision dari coding agent Anda
</div>

`stripe projects init` menulis [Agent Skill](https://projects.dev) Stripe Projects ke dalam proyek Anda, sehingga Anda bisa meminta agent Anda (Claude Code, Cursor, Codex, dan lainnya) menjalankan flow tersebut untuk Anda:

```text theme={null}
Gunakan Stripe Projects untuk menambahkan Exa dan menghubungkan API key-nya.
```

<div id="next-steps">
  ## Langkah selanjutnya
</div>

* [Quickstart](/id/docs/search/quickstart): lakukan Exa search pertama Anda dengan SDK kami.
* [Dokumentasi Stripe Projects](https://docs.stripe.com/projects): referensi CLI lengkap, environment, dan billing.
* [Exa Dashboard](https://dashboard.exa.ai): kelola API key, penggunaan, dan billing.
* [Katalog provider](https://projects.dev): jelajahi semua provider Stripe Projects.