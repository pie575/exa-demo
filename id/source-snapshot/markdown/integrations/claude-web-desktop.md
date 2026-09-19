> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-in-claude-code-web-and-desktop">
  # Exa di Claude Code, Web, dan Desktop
</div>

> Cari di web dan baca halaman apa pun dengan Exa langsung dari Claude

Pasang Exa di Claude Code atau hubungkan ke Claude Web, Desktop, dan Cowork agar Claude memiliki akses ke informasi terkini dari web. Claude dapat mencari dengan bahasa alami, membaca halaman yang relevan, dan menggunakan sumber-sumber tersebut selama bekerja.

<div id="install-exa">
  ## Instal Exa
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web, Desktop & Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="Buka direktori konektor">
          Di obrolan Claude yang baru, klik tombol plus, pilih **Add connector**, lalu cari **Exa**.
        </Step>

        <Step title="Hubungkan Exa">
          Buka Exa, pilih **Connect to Claude**, lalu berikan izin akses saat diminta.

          <Frame caption="Membuka direktori konektor di Claude, menemukan Exa, menghubungkannya, dan memberikan izin akses">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Opening the connector directory in Claude, finding Exa, connecting it, and authorizing access" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Gunakan Exa">
          Mulai obrolan baru dan tanyakan sesuatu yang memerlukan informasi terkini dari web.
        </Step>
      </Steps>
    </Tab>

    <Tab title="Claude Code CLI" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude-code.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=f7f017b187974c56e5822d7baf8272fa" width="16" height="16" data-path="images/mcp-clients/claude-code.svg">
      <Steps>
        <Step title="Instal plugin">
          Instal Exa dari terminal:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Anda juga bisa mengetik `/plugin` di Claude Code, mencari **Exa**, lalu menginstalnya.
        </Step>

        <Step title="Mulai sesi baru">
          Buka sesi Claude Code yang baru agar plugin dimuat, lalu tanyakan sesuatu yang memerlukan akses web.

          <Frame caption="Membuka sesi Claude Code baru dan menanyakan sesuatu yang memerlukan akses web">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="Opening a new Claude Code session and asking for something that needs the web" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

Kedua opsi tersebut membuat Exa langsung tersedia tanpa perlu menyunting berkas konfigurasi MCP.

<div id="work-with-whats-on-the-web-right-now">
  ## Manfaatkan informasi terbaru di web
</div>

Di Claude Code, Exa dapat melakukan search pada dokumentasi terkini, issue, changelog, dan contoh nyata saat Anda bekerja di repository. Integrasi yang sama memberi Claude Web, Desktop, dan Cowork akses ke berita terbaru, riset, informasi perusahaan, detail produk, serta sumber lain yang mungkin belum tersedia dalam konteks.

```text theme={null}
Kami memakai Tailwind v3. Gunakan Exa untuk mencari dan membaca panduan
upgrade resmi Tailwind v4, lalu migrasikan proyek ini ke v4.
```

Claude Code dapat memakai apa yang ditemukannya untuk melakukan perubahan pada basis kode Anda. Di klien Claude lainnya, sumber yang sama bisa dipakai dalam jawaban, artifact, dan tugas Cowork.

Pola yang sama berlaku setiap kali jawaban bergantung pada sumber web terkini atau spesifik:

* &quot;Cari catatan rilis terbaru untuk dependensi ini dan ringkas breaking changes-nya.&quot;
* &quot;Cari riset primer terbaru tentang inference-time scaling dan bandingkan metodenya.&quot;
* &quot;Baca dokumentasi webhook Stripe yang berlaku saat ini dan jelaskan perilaku retry yang direkomendasikan.&quot;
* &quot;Cari halaman harga resmi produk-produk ini dan bandingkan paket tingkat dasarnya.&quot;

<div id="search-read-and-research">
  ## Search, baca, dan riset
</div>

Integrasi Exa memberi Claude perangkat untuk melakukan search dan membaca web, yang bisa dipadukan dalam tugas riset yang lebih panjang.

<Columns cols={3}>
  <Card title="Search" icon="search">
    Lakukan search dengan bahasa alami dan dapatkan page content yang relevan, bukan sekadar daftar tautan.
  </Card>

  <Card title="Baca" icon="file-text">
    Baca halaman yang Anda tunjuk, termasuk dokumentasi, riset, changelog, issue, dan artikel.
  </Card>

  <Card title="Riset" icon="compass">
    Jalankan beberapa search, telaah halaman yang bermanfaat, lalu gabungkan evidence menjadi jawaban yang disertai sumber.
  </Card>
</Columns>

<div id="research-without-leaving-claude">
  ## Riset tanpa perlu keluar dari Claude
</div>

Mintalah hasil yang Anda inginkan dan beri tahu Claude jenis sumber apa yang penting:

```text theme={null}
Bandingkan layanan terkelola, lisensi, dan harga dari basis data vektor
open source utama. Gunakan sumber primer terkini dan cantumkan sitasinya.
```

Claude dapat menggunakan Exa sepanjang percakapan untuk menemukan dan membaca sumber yang diperlukan untuk suatu tugas. Gunakan ini untuk riset teknis, analisis kompetitif, pemetaan pasar, riset perusahaan, atau pertanyaan apa pun yang jawabannya tersebar di web.

<div id="use-exa-in-cowork">
  ## Menggunakan Exa di Cowork
</div>

Konektor yang sama juga tersedia di Cowork. Berikan Claude tugas yang membutuhkan informasi dari luar, dan Claude dapat melakukan search atau membaca halaman sambil bekerja dengan file Anda serta tool lain yang terhubung.

```text theme={null}
Tinjau brief kompetitif ini, verifikasi setiap klaim harga terhadap
halaman vendor terkini menggunakan Exa, lalu perbarui dokumennya dengan citations.
```

<div id="prefer-mcp-directly">
  ## Lebih suka langsung pakai MCP?
</div>

Jika Anda mengonfigurasi Claude secara manual atau menggunakan MCP client lain, Anda dapat terhubung langsung ke MCP server milik Exa yang di-hosting:

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

Lihat [Exa MCP](/id/docs/get-started/exa-mcp) untuk klien lain, opsi konfigurasi, dan tool yang tersedia.

<Card title="Buka konektor Exa" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Tambahkan Exa di direktori konektor Claude.
</Card>