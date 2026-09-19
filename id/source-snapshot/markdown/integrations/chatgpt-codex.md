> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-in-codex-and-chatgpt">
  # Exa di Codex dan ChatGPT
</div>

> Cari di web, baca halaman apa pun, dan lakukan riset dengan Exa langsung dari Codex dan ChatGPT.

Pasang plugin Exa sekali saja untuk memberi Codex dan ChatGPT akses ke web secara real-time melalui Exa. Cari informasi terkini, baca sumber yang relevan, dan jalankan riset yang lebih mendalam tanpa perlu meninggalkan percakapan atau sesi coding Anda.

<div id="install-exa">
  ## Instal Exa
</div>

<Steps>
  <Step title="Buka plugin">
    Kunjungi [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Tautan ini membuka **Exa** di direktori plugin OpenAI, direktori yang sama untuk ChatGPT maupun Codex.
  </Step>

  <Step title="Instal plugin">
    Pilih tombol plus untuk menginstal. Masuk ke Exa saat diminta, baik saat proses instalasi maupun saat Codex atau ChatGPT pertama kali menggunakannya.

    <Frame caption="Membuka Plugins di Codex, menambahkan Exa, dan memberikan izin akses">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Membuka Plugins di Codex, melihat plugin Exa, dan memberikan izin akses" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="Mulai sesi baru">
    Skill hanya dimuat pada chat dan sesi CLI yang dimulai setelah instalasi, jadi buka sesi baru dan ajukan permintaan yang membutuhkan akses web.
  </Step>
</Steps>

Selesai. Plugin ini sudah mencakup integrasi MCP sekaligus skill dari Exa, jadi tidak perlu menyiapkan MCP atau skill secara terpisah.

<div id="build-with-whats-on-the-web-right-now">
  ## Bangun dengan apa yang ada di web saat ini
</div>

Library, API, dan tool yang Anda gunakan berubah setiap hari. Dengan Exa terpasang, Codex dapat mencari dokumentasi, issue, changelog, dan contoh nyata terbaru sambil bekerja.

Dari dalam repo Anda:

```text theme={null}
Kami memakai Tailwind v3. Cari panduan upgrade ke Tailwind v4, baca panduannya,
lalu migrasikan proyek ini ke v4.
```

Codex dapat melakukan search dengan Exa, membaca sumber yang relevan, dan memanfaatkan temuannya untuk melakukan perubahan di basis kode Anda.

Hal yang sama berlaku setiap kali jawabannya mungkin berada di luar repo Anda:

* &quot;Cari error ini di issue dan changelog `tokio-tungstenite` sebelum kamu mencoba memperbaikinya.&quot;
* &quot;Temukan contoh nyata penggunaan advisory lock Postgres di Rust dan rekomendasikan pola yang cocok untuk worker pool ini.&quot;
* &quot;Baca dokumentasi webhook Stripe terbaru dan bandingkan implementation kami dengan dokumentasi tersebut.&quot;
* &quot;Cari panduan migrasi terbaru untuk dependensi ini, lalu lakukan upgrade.&quot;

<div id="search-read-and-research">
  ## Search, baca, dan riset
</div>

Plugin Exa memberi Codex dan ChatGPT tiga cara untuk bekerja dengan web.

<Columns cols={3}>
  <Card title="Search" icon="search">
    Lakukan search dengan bahasa alami dan dapatkan konten halaman terbaik, bukan sekadar daftar tautan.
  </Card>

  <Card title="Baca" icon="file-text">
    Baca halaman yang Anda tentukan, entah itu dokumentasi, changelog, issue, atau tulisan blog.
  </Card>

  <Card title="Riset" icon="compass">
    Dalami pertanyaan yang butuh lebih dari satu search, lalu jawab dengan citations.
  </Card>
</Columns>

<div id="research-without-leaving-chatgpt">
  ## Riset tanpa meninggalkan ChatGPT
</div>

Exa juga berfungsi di ChatGPT. Ajukan pertanyaan yang memerlukan informasi terbaru, lalu gunakan Exa untuk melakukan search dan riset web langsung dari percakapan.

```text theme={null}
Bandingkan layanan terkelola, lisensi, dan harga dari basis data vektor
open source utama. Gunakan sumber primer terkini dan cantumkan kutipannya.
```

Alih-alih hanya mengandalkan informasi yang sudah ada dalam konteks, ChatGPT dapat menggunakan Exa untuk menemukan dan membaca sumber yang dibutuhkan untuk suatu tugas.

Gunakan untuk riset kompetitor, riset teknis, pemetaan pasar, riset perusahaan, atau hal lain apa pun yang jawabannya tersebar di web.

<div id="mcp-skills-together">
  ## MCP + skill, bersama-sama
</div>

Di balik layar, plugin ini menggabungkan dua bagian dari agent stack Exa.

[Exa MCP](/id/docs/get-started/exa-mcp) memberikan Codex dan ChatGPT tools untuk mengakses Exa. Inilah jembatan antara agent dan capabilities search serta riset milik Exa.

[Exa skills](/id/docs/get-started/agent-skills/overview) memberi agent instruksi tambahan untuk memanfaatkan capabilities tersebut dalam workflow yang berguna, termasuk riset web dan [Exa Agent](/id/docs/agent/quickstart).

Anda tidak perlu mengonfigurasi keduanya secara terpisah saat menginstal plugin ini.

<div id="prefer-mcp-directly">
  ## Lebih suka langsung memakai MCP?
</div>

Plugin adalah cara yang direkomendasikan untuk menggunakan Exa dengan Codex dan ChatGPT. Jika Anda mengonfigurasi Codex secara manual atau menggunakan klien MCP lain, Anda dapat terhubung langsung ke MCP server milik Exa:

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

Lihat [Exa MCP](/id/docs/get-started/exa-mcp) untuk klien lainnya, opsi konfigurasi, dan tool yang tersedia.

<Card title="Instal Exa untuk ChatGPT dan Codex" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  Tambahkan plugin Exa dari marketplace ChatGPT.
</Card>