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

Instal Exa di Claude Code atau hubungkan ke Claude Web, Desktop, dan Cowork agar Claude memiliki akses ke informasi terkini dari web. Claude dapat melakukan search dengan bahasa alami, membaca halaman yang relevan, dan memanfaatkan sources tersebut selama bekerja.

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
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Membuka direktori konektor di Claude, menemukan Exa, menghubungkannya, dan memberikan izin akses" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
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
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="Membuka sesi Claude Code baru dan menanyakan sesuatu yang memerlukan akses web" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

Kedua opsi ini membuat Exa langsung tersedia tanpa perlu mengedit file konfigurasi MCP.

<div id="work-with-whats-on-the-web-right-now">
  ## Manfaatkan apa yang ada di web saat ini
</div>

Di Claude Code, Exa dapat mencari dokumentasi, issues, changelog, dan contoh nyata terkini sambil Anda bekerja di repositori Anda. Integrasi yang sama memberi Claude Web, Desktop, dan Cowork akses ke berita terbaru, research, informasi perusahaan, detail produk, serta sources lain yang mungkin belum ada dalam konteks.

```text theme={null}
Kami memakai Tailwind v3. Gunakan Exa untuk mencari dan membaca panduan
upgrade resmi Tailwind v4, lalu migrasikan proyek ini ke v4.
```

Claude Code dapat memanfaatkan apa yang ditemukannya untuk melakukan perubahan pada basis kode Anda. Di client Claude lainnya, sources yang sama bisa digunakan dalam jawaban, artifact, dan tugas Cowork.

Pola yang sama berlaku setiap kali jawaban bergantung pada sources web yang terkini atau spesifik:

* &quot;Cari release notes terbaru untuk dependensi ini dan ringkas breaking changes-nya.&quot;
* &quot;Cari Research primer terbaru tentang inference-time scaling dan bandingkan metodenya.&quot;
* &quot;Baca dokumentasi webhook Stripe yang berlaku saat ini dan jelaskan perilaku retry yang direkomendasikan.&quot;
* &quot;Cari halaman harga resmi untuk produk-produk ini dan bandingkan plan tingkat dasarnya.&quot;

<div id="search-read-and-research">
  ## Search, read, dan research
</div>

Integrasi Exa memberi Claude tool untuk melakukan search dan membaca web, yang bisa dipadukan dalam tugas research yang lebih panjang.

<Columns cols={3}>
  <Card title="Search" icon="search">
    Lakukan search dengan bahasa alami dan dapatkan page content yang relevan, bukan sekadar daftar tautan.
  </Card>

  <Card title="Read" icon="file-text">
    Baca halaman yang Anda tentukan, termasuk dokumentasi, research, changelog, issue, dan artikel.
  </Card>

  <Card title="Research" icon="compass">
    Jalankan beberapa search, periksa halaman yang relevan, dan rangkum evidence menjadi response yang disertai sumber.
  </Card>
</Columns>

<div id="research-without-leaving-claude">
  ## Research tanpa meninggalkan Claude
</div>

Mintalah hasil yang Anda inginkan dan beri tahu Claude jenis sources mana yang penting:

```text theme={null}
Bandingkan layanan terkelola, lisensi, dan harga dari basis data vektor
open source utama. Gunakan sumber primer terkini dan cantumkan sitasinya.
```

Claude dapat menggunakan Exa sepanjang percakapan untuk menemukan dan membaca sources yang dibutuhkan dalam suatu tugas. Gunakan ini untuk Research teknis, analisis kompetitor, pemetaan market, riset perusahaan, atau pertanyaan apa pun yang jawabannya tersebar di seluruh web.

<div id="use-exa-in-cowork">
  ## Menggunakan Exa di Cowork
</div>

Konektor yang sama tersedia di Cowork. Berikan Claude tugas yang membutuhkan informasi dari luar, dan Claude dapat melakukan search atau membaca halaman sambil bekerja dengan file Anda serta tool lain yang terhubung.

```text theme={null}
Tinjau ringkasan kompetitif ini, verifikasi setiap klaim harga dengan
halaman vendor terkini menggunakan Exa, lalu perbarui dokumen dengan sitasi.
```

<div id="prefer-mcp-directly">
  ## Lebih suka langsung pakai MCP?
</div>

Jika Anda mengonfigurasi Claude secara manual atau menggunakan MCP client lain, Anda bisa langsung terhubung ke MCP server yang dihosting Exa:

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

Lihat [Exa MCP](/id/docs/get-started/exa-mcp) untuk client lain, opsi konfigurasi, dan tool yang tersedia.

<Card title="Buka konektor Exa" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Tambahkan Exa di direktori konektor Claude.
</Card>