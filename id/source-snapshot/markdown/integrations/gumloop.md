> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Gumloop {#gumloop}

> Gunakan Exa search dan contents di dalam flow Gumloop.

[Gumloop](https://www.gumloop.com/) menyertakan Exa sebagai integrasi MCP bawaan. Tambahkan ke agent atau Agent Node untuk menelusuri web, mengekstrak halaman, menemukan sources terkait, dan menghasilkan jawaban yang didukung sitasi di dalam workflow.

## Menambahkan Exa ke agent Gumloop {#add-exa-to-a-gumloop-agent}

<Steps>
  <Step title="Buka agent">
    Buka konfigurasi agent Anda, lalu pilih **Add tools** → **Connect an app with MCP**.
  </Step>

  <Step title="Hubungkan Exa">
    Cari **Exa**, pilih integrasinya, lalu selesaikan alur autentikasi.
  </Step>

  <Step title="Pilih tool">
    Buka integrasi Exa yang sudah terhubung dan aktifkan hanya tool yang dibutuhkan agent. Dengan begitu, pemilihan tool menjadi lebih jelas dan agent tidak memanggil aksi yang tidak relevan.
  </Step>

  <Step title="Uji koneksi">
    Minta agent melakukan hal berikut:

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    Tinjau run tersebut untuk memastikan agent benar-benar memanggil Exa dan mengembalikan sources yang dikutip.
  </Step>
</Steps>

## Tool yang tersedia {#available-tools}

| Tool                     | Kegunaannya                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| **Search**               | Menemukan halaman relevan dengan pencarian neural atau kata kunci.             |
| **Get Contents**         | Mengekstrak teks penuh, ringkasan, dan metadata dari URL yang sudah diketahui. |
| **Find Similar**         | Menemukan halaman yang terkait dengan sebuah source URL.                       |
| **Answer**               | Menghasilkan grounded answer lengkap dengan sitasi.                            |
| **Create Research Task** | Memulai Research yang berjalan lebih lama.                                     |
| **Get Research Task**    | Mengambil status dan hasil sebuah research task.                               |

Untuk agent percakapan, aktifkan Search, Get Contents, dan Answer terlebih dahulu. Tambahkan tool lainnya hanya jika workflow memang membutuhkannya.

## Menggunakan Exa dalam workflow {#use-exa-in-a-workflow}

### Agent Node {#agent-node}

Tambahkan **Agent Node** ke flow Gumloop yang deterministik, lalu attach Exa sebagai salah satu tool-nya. Node ini dapat menentukan apakah perlu melakukan search, mengambil halaman secara utuh, atau merangkai beberapa panggilan Exa sebelum meneruskan output-nya ke langkah workflow berikutnya.

Ini cocok untuk:

* meng-enrich baris CRM atau spreadsheet dengan evidence web terkini
* memantau berita dan mengirim ringkasan bersumber ke Slack atau email
* melakukan Research terhadap perusahaan sebelum mengarahkan catatan ke workflow penjualan
* membandingkan produk dan menuliskan hasilnya ke sebuah dokumen

### Custom MCP node yang dapat dipakai ulang {#reusable-custom-mcp-node}

Untuk satu aksi yang berulang, buat node khusus:

1. Buka pustaka node dan cari Exa.
2. Pilih **Create a node with AI**.
3. Deskripsikan satu aksi, misalnya `Search for funding announcements from the past seven days`.
4. Uji node yang dihasilkan, verifikasi input dan output-nya, lalu simpan.

Gunakan Agent Node jika tugas memerlukan perencanaan dinamis atau beberapa tool. Gunakan custom MCP node jika operasi Exa yang sama perlu dijalankan secara konsisten pada setiap item.

## Pola prompt {#prompt-patterns}

<AccordionGroup>
  <Accordion title="Cari dan ringkas">
    ```text theme={null}
    Cari pengumuman resmi tentang [topik] yang dipublikasikan minggu ini.
    Kembalikan tanggal, penerbit, ringkasan, dan source URL untuk setiap hasil.
    ```
  </Accordion>

  <Accordion title="Enrich sebuah perusahaan">
    ```text theme={null}
    Berdasarkan nama perusahaan dan domain ini, temukan deskripsi produknya,
    pengumuman pendanaan terbaru, dan dua sources berita terkini.
    ```
  </Accordion>

  <Accordion title="Baca halaman yang sudah diketahui">
    ```text theme={null}
    Ambil seluruh contents dari URL ini dan ekstrak tingkatan harga dalam format JSON.
    ```
  </Accordion>
</AccordionGroup>

## Pemecahan Masalah {#troubleshooting}

<AccordionGroup>
  <Accordion title="Exa tidak tersedia untuk agent">
    Buka kembali tool MCP milik agent, pastikan Exa sudah terhubung, lalu aktifkan tool yang diperlukan. Integrasi yang sudah terhubung tetap bisa memiliki tool tertentu dalam keadaan nonaktif.
  </Accordion>

  <Accordion title="Agent memilih tindakan yang salah">
    Buat permintaan yang eksplisit mengenai apakah agent harus melakukan search, membaca URL yang sudah diketahui, mencari halaman serupa, atau menjawab dari sources. Nonaktifkan Exa tools yang tidak diperlukan agent untuk workflow tersebut.
  </Accordion>

  <Accordion title="Workflow membutuhkan satu panggilan yang dapat diprediksi">
    Ganti langkah agent serbaguna dengan MCP node Exa kustom yang input dan tugasnya sudah ditetapkan.
  </Accordion>
</AccordionGroup>

## Sumber Daya {#resources}

<Columns cols={3}>
  <Card title="Integrasi Exa untuk Gumloop" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="Baca panduan" arrow="true">
    Tinjau tool Gumloop yang tersedia saat ini dan workflow Agent Node.
  </Card>

  <Card title="Exa MCP server" icon="plug" href="/id/docs/get-started/exa-mcp" cta="Baca panduan" arrow="true">
    Pahami Exa tools yang tersedia melalui MCP.
  </Card>

  <Card title="Exa Search" icon="search" href="/id/docs/search/quickstart" cta="Baca panduan" arrow="true">
    Pelajari cara menyusun kueri search dan contents yang dikembalikan.
  </Card>
</Columns>