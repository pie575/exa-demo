> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="gumloop">
  # Gumloop
</div>

> Gunakan Exa search dan contents di dalam alur Gumloop.

[Gumloop](https://www.gumloop.com/) menyertakan Exa sebagai integrasi MCP bawaan. Tambahkan ke agent atau Agent Node untuk menelusuri web, mengekstrak halaman, menemukan sumber terkait, dan menghasilkan jawaban yang didukung sitasi di dalam workflow.

<div id="add-exa-to-a-gumloop-agent">
  ## Tambahkan Exa ke agent Gumloop
</div>

<Steps>
  <Step title="Buka agent">
    Buka konfigurasi agent Anda, lalu pilih **Add tools** → **Connect an app with MCP**.
  </Step>

  <Step title="Hubungkan Exa">
    Cari **Exa**, pilih integrasinya, lalu selesaikan alur autentikasi.
  </Step>

  <Step title="Pilih tools">
    Buka integrasi Exa yang sudah terhubung dan aktifkan hanya tools yang diperlukan agent. Dengan begitu, pemilihan tool menjadi lebih jelas dan agent tidak memanggil aksi yang tidak relevan.
  </Step>

  <Step title="Uji koneksi">
    Minta agent melakukan hal berikut:

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    Tinjau run tersebut untuk memastikan agent memanggil Exa dan mengembalikan sumber yang disertai kutipan.
  </Step>
</Steps>

<div id="available-tools">
  ## Tool yang tersedia
</div>

| Alat                     | Digunakan untuk                                                                  |
| ------------------------ | -------------------------------------------------------------------------------- |
| **Search**               | Menemukan halaman yang relevan dengan pencarian neural atau kata kunci.          |
| **Get Contents**         | Mengekstrak teks lengkap, ringkasan, dan metadata dari URL yang sudah diketahui. |
| **Find Similar**         | Menemukan halaman yang terkait dengan suatu source URL.                          |
| **Answer**               | Menghasilkan grounded answer lengkap dengan citations.                           |
| **Create Research Task** | Memulai riset yang berjalan lebih lama.                                          |
| **Get Research Task**    | Mengambil status dan hasil sebuah research task.                                 |

Untuk agent percakapan, aktifkan Search, Get Contents, dan Answer terlebih dahulu. Tambahkan tool lainnya hanya jika workflow memang membutuhkannya.

<div id="use-exa-in-a-workflow">
  ## Menggunakan Exa dalam workflow
</div>

<div id="agent-node">
  ### Agent Node
</div>

Tambahkan **Agent Node** ke alur Gumloop yang deterministik dan attach Exa sebagai salah satu tool-nya. Node ini dapat menentukan apakah perlu melakukan search, mengambil halaman secara utuh, atau merangkai beberapa panggilan Exa sebelum meneruskan output-nya ke langkah workflow berikutnya.

Ini cocok untuk:

* memperkaya baris CRM atau spreadsheet dengan evidence web terkini
* memantau berita dan mengirimkan summary yang disertai sumber ke Slack atau email
* meneliti perusahaan sebelum mengarahkan data ke workflow penjualan
* membandingkan produk dan menuliskan hasilnya ke dalam dokumen

<div id="reusable-custom-mcp-node">
  ### MCP node kustom yang dapat dipakai ulang
</div>

Untuk satu tindakan yang berulang, buat node khusus:

1. Buka pustaka node dan cari Exa.
2. Pilih **Create a node with AI**.
3. Jelaskan satu tindakan, misalnya `Search for funding announcements from the past seven days`.
4. Uji node yang dihasilkan, periksa input dan output-nya, lalu simpan.

Gunakan Agent Node jika tugas memerlukan perencanaan dinamis atau banyak tool. Gunakan MCP node kustom jika operasi Exa yang sama harus berjalan secara konsisten pada setiap item.

<div id="prompt-patterns">
  ## Pola prompt
</div>

<AccordionGroup>
  <Accordion title="Cari dan ringkas">
    ```text theme={null}
    Cari pengumuman resmi tentang [topik] yang dipublikasikan minggu ini.
    Kembalikan tanggal, penerbit, ringkasan, dan source URL untuk setiap hasil.
    ```
  </Accordion>

  <Accordion title="Enrich sebuah perusahaan">
    ```text theme={null}
    Berdasarkan nama dan domain perusahaan ini, temukan deskripsi produknya,
    pengumuman pendanaan terbaru, dan dua sumber berita terkini.
    ```
  </Accordion>

  <Accordion title="Baca halaman yang sudah diketahui">
    ```text theme={null}
    Ambil seluruh contents dari URL ini dan ekstrak tingkatan harganya sebagai JSON.
    ```
  </Accordion>
</AccordionGroup>

<div id="troubleshooting">
  ## Pemecahan masalah
</div>

<AccordionGroup>
  <Accordion title="Exa tidak tersedia untuk agent">
    Buka kembali tool MCP milik agent, pastikan Exa sudah terhubung, lalu aktifkan tool yang dibutuhkan. Integrasi yang sudah terhubung pun masih bisa memiliki tool tertentu yang dinonaktifkan.
  </Accordion>

  <Accordion title="Agent memilih tindakan yang salah">
    Nyatakan secara eksplisit dalam permintaan apakah agent harus melakukan search, membaca URL yang sudah diketahui, mencari halaman serupa, atau menjawab berdasarkan sumber. Nonaktifkan tool Exa yang tidak dibutuhkan agent untuk workflow tersebut.
  </Accordion>

  <Accordion title="Workflow membutuhkan satu call tunggal yang dapat diprediksi">
    Ganti langkah agent serbaguna dengan MCP node Exa kustom yang input dan tugasnya sudah ditetapkan.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Sumber daya
</div>

<Columns cols={3}>
  <Card title="Integrasi Exa Gumloop" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="Baca panduan" arrow="true">
    Tinjau tools Gumloop yang tersedia saat ini dan workflow Agent Node.
  </Card>

  <Card title="MCP server Exa" icon="plug" href="/id/docs/get-started/exa-mcp" cta="Baca panduan" arrow="true">
    Pahami tools Exa yang diekspos melalui MCP.
  </Card>

  <Card title="Exa Search" icon="search" href="/id/docs/search/quickstart" cta="Baca panduan" arrow="true">
    Pelajari cara menyusun kueri search dan contents yang dikembalikan.
  </Card>
</Columns>