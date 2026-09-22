> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-in-codex-and-chatgpt">
  # Exa di Codex dan ChatGPT
</div>

> Cari di web, baca halaman apa pun, dan lakukan research dengan Exa langsung dari Codex dan ChatGPT.

Pasang plugin Exa sekali saja untuk memberi Codex dan ChatGPT akses ke web secara langsung melalui Exa. Cari informasi terkini, baca sources yang penting, dan jalankan research yang lebih mendalam tanpa meninggalkan percakapan atau sesi coding Anda.

<div id="install-exa">
  ## Pasang Exa
</div>

<Steps>
  <Step title="Buka plugin">
    Buka [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Tautan ini membuka **Exa** di direktori plugin OpenAI, yaitu direktori yang sama untuk ChatGPT dan Codex.
  </Step>

  <Step title="Pasang plugin">
    Klik tombol plus untuk memasang. Masuk ke Exa saat diminta, baik selama proses pemasangan maupun saat pertama kali Codex atau ChatGPT menggunakannya.

    <Frame caption="Membuka Plugins di Codex, menambahkan Exa, dan memberikan otorisasi akses">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Membuka Plugins di Codex, melihat plugin Exa, dan memberikan otorisasi akses" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="Mulai sesi baru">
    Skill hanya dimuat di chat dan sesi CLI yang dimulai setelah pemasangan, jadi buka sesi baru dan ajukan permintaan yang membutuhkan akses web.
  </Step>
</Steps>

Selesai. Plugin ini sudah mencakup integrasi MCP sekaligus skill dari Exa, jadi tidak perlu menyiapkan MCP atau skill secara terpisah.

<div id="build-with-whats-on-the-web-right-now">
  ## Bangun dengan apa yang ada di web saat ini
</div>

Library, API, dan tool yang Anda pakai untuk membangun berubah setiap hari. Dengan Exa terpasang, Codex dapat melakukan search untuk menemukan dokumentasi, issues, changelogs, dan contoh nyata terbaru sambil bekerja.

Dari dalam repositori Anda:

```text theme={null}
Kami memakai Tailwind v3. Cari panduan upgrade ke Tailwind v4, baca panduannya,
lalu migrasikan proyek ini ke v4.
```

Codex dapat melakukan search dengan Exa, membaca sources yang relevan, dan memanfaatkan temuannya untuk melakukan perubahan pada basis kode Anda.

Hal yang sama berlaku setiap kali jawabannya mungkin berada di luar repositori Anda:

* &quot;Telusuri issues dan changelog `tokio-tungstenite` terkait error ini sebelum kamu mencoba memperbaikinya.&quot;
* &quot;Temukan contoh nyata penggunaan advisory lock Postgres di Rust dan rekomendasikan pola yang cocok untuk worker pool ini.&quot;
* &quot;Baca dokumentasi webhook Stripe terkini dan bandingkan implementasi kami dengan dokumentasi tersebut.&quot;
* &quot;Cari panduan migrasi terbaru untuk dependensi ini, lalu lakukan upgrade.&quot;

<div id="search-read-and-research">
  ## Search, baca, dan research
</div>

Plugin Exa memberi Codex dan ChatGPT tiga cara untuk bekerja dengan web.

<Columns cols={3}>
  <Card title="Search" icon="search">
    Lakukan search dalam bahasa alami dan dapatkan konten halaman terbaik, bukan sekadar daftar tautan.
  </Card>

  <Card title="Baca" icon="file-text">
    Baca halaman yang Anda tunjuk, entah itu dokumentasi, changelog, issue, atau tulisan blog.
  </Card>

  <Card title="Research" icon="compass">
    Dalami pertanyaan yang butuh lebih dari satu search, lalu jawab dengan sitasi.
  </Card>
</Columns>

<div id="research-without-leaving-chatgpt">
  ## Research tanpa meninggalkan ChatGPT
</div>

Exa juga berfungsi di ChatGPT. Ajukan pertanyaan yang memerlukan informasi terkini, lalu gunakan Exa untuk melakukan search dan research di web langsung dari percakapan.

```text theme={null}
Bandingkan layanan terkelola, lisensi, dan harga dari basis data vektor
open source utama. Gunakan sumber primer terkini dan cantumkan kutipannya.
```

Alih-alih hanya mengandalkan informasi yang sudah ada di konteks, ChatGPT dapat menggunakan Exa untuk menemukan dan membaca sources yang dibutuhkan untuk suatu tugas.

Gunakan untuk Research kompetitor, Research teknis, pemetaan pasar, Research perusahaan, atau hal lain apa pun yang jawabannya tersebar di seluruh web.

<div id="mcp-skills-together">
  ## MCP + skills, bersama-sama
</div>

Di balik layar, plugin ini menggabungkan dua bagian dari agent stack Exa.

[Exa MCP](/id/docs/get-started/exa-mcp) memberikan tool bagi Codex dan ChatGPT untuk mengakses Exa. Inilah penghubung antara agent dan kemampuan search serta research milik Exa.

[Exa skills](/id/docs/get-started/agent-skills/overview) memberikan instruksi tambahan bagi agent untuk memanfaatkan kemampuan tersebut dalam workflow yang berguna, termasuk research web dan [Exa Agent](/id/docs/agent/quickstart).

Anda tidak perlu mengonfigurasi keduanya secara terpisah saat menginstal plugin ini.

<div id="prefer-mcp-directly">
  ## Ingin langsung pakai MCP?
</div>

Plugin adalah cara yang direkomendasikan untuk menggunakan Exa dengan Codex dan ChatGPT. Jika Anda mengonfigurasi Codex secara manual atau menggunakan MCP client lain, Anda dapat terhubung langsung ke MCP server yang dihosting Exa:

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

Lihat [Exa MCP](/id/docs/get-started/exa-mcp) untuk client lain, opsi konfigurasi, dan tool yang tersedia.

<Card title="Pasang Exa untuk ChatGPT dan Codex" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  Tambahkan plugin Exa dari marketplace ChatGPT.
</Card>