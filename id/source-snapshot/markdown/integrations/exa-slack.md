> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-in-slack">
  # Exa di Slack
</div>

> Pasang Exa di Slack dan tag @Exa di channel atau thread mana pun untuk mendapatkan jawaban riset bersitasi, pembuatan daftar, dan enrichment.

Hadirkan Exa ke Slack tim Anda. Tag **@Exa** di channel atau thread mana pun dengan pertanyaan riset, tugas pembuatan daftar, atau permintaan enrichment. Exa akan melakukan search di web, membaca sumbernya, lalu membalas langsung di thread dengan jawaban yang disertai sitasi.

<div id="get-started">
  ## Memulai
</div>

<div id="installation">
  ### Instalasi
</div>

1. Buka [Dashboard &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack), lalu klik **Install**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="Halaman Exa in Slack di dashboard Exa, dengan tombol Install" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. Alur OAuth Slack akan terbuka. Pilih workspace tempat Anda ingin memasang Exa, lalu klik **Allow**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="Layar persetujuan OAuth Slack untuk Exa app, menampilkan pemberitahuan &#x22;App is not approved by Slack&#x22;, pemilih workspace, izin yang diminta, dan tombol Allow" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  Pemberitahuan merah **&quot;App is not approved by Slack&quot;** memang wajar muncul dan aman diabaikan. Itu hanya berarti
  Exa belum tersedia di Slack Marketplace publik, bukan berarti ada masalah.
</Note>

3. Setelah terpasang, undang @Exa ke sebuah channel (atau kirim DM langsung) dan mulailah bertanya.

<div id="how-to-use-exa-from-slack">
  ## Cara menggunakan Exa dari Slack
</div>

Di channel mana pun yang sudah ditambahkan Exa, sebut @Exa disertai pertanyaan Anda:

```text theme={null}
@Exa temukan semua startup fintech tahap Series A di SF
```

Exa membalas pertanyaan Anda di dalam thread.

<div id="follow-ups">
  ### Follow-ups
</div>

Setelah Exa menjawab di sebuah thread, cukup balas di thread tersebut untuk melanjutkan percakapan. Tidak perlu menyebut @Exa lagi. Exa mengingat isi percakapan, jadi follow-ups akan berlanjut dari jawaban sebelumnya. Siapa pun di thread tersebut bisa mengirim follow-up.

<div id="direct-messages">
  ### Pesan langsung
</div>

Anda juga bisa mengirim pesan ke Exa lewat DM. Di sana Anda sama sekali tidak perlu menyebut Exa. Setiap pesan yang Anda kirim akan memulai permintaan baru, yang dijawab dalam thread di bawah pesan tersebut. Balas di thread itu untuk melanjutkan percakapan.

<div id="cancelling-a-run">
  ### Membatalkan run
</div>

Saat run sedang berjalan, balas di thread dan minta Exa untuk menghentikan run tersebut. Tidak perlu menyebut.

```text theme={null}
Hentikan run saat ini
```

<div id="exa-connect-providers">
  ### Provider Exa Connect
</div>

Exa secara otomatis menyertakan data provider [Exa Connect](/id/docs/agent/connect/overview) jika relevan dengan pertanyaan Anda. Untuk menggunakan provider tertentu, sebutkan provider tersebut di pesan Anda:

```text theme={null}
@Exa find me all AI infrastructure startups that raised funding this quarter using Fiber.ai
```

Untuk daftar semua data provider yang tersedia, cukup tanyakan pada Exa.

<div id="examples">
  ## Contoh
</div>

<div id="news-and-current-events">
  ### Berita dan peristiwa terkini
</div>

Cari tahu informasi terbaru tentang apa pun.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Exa menjawab pertanyaan tentang berita terbaru mengenai suatu topik di dalam thread Slack, dengan hasil bertanggal dalam bentuk tabel" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

<div id="large-list-building">
  ### List building skala besar
</div>

Awali permintaan dengan `!max` untuk list building yang menyeluruh.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Exa menjalankan permintaan list building !max di dalam thread Slack dan menampilkan tabel hasil" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

<div id="keywords">
  ## Kata Kunci
</div>

Gunakan kata kunci ini di thread yang diikuti Exa. Perintah dapat ditulis setelah menyebut `@Exa` atau langsung
di awal pesan:

| Kata Kunci        | Fungsi                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `!max <message>`  | Menjalankan permintaan ini dengan effort maksimum, dirancang untuk menyusun daftar berukuran sangat besar.                  |
| `mute`            | Membuat Exa berhenti merespons balasan tanpa menyebut di thread. Sebut @Exa secara eksplisit tetap berfungsi.              |
| `unmute`          | Mengaktifkan kembali follow-ups di thread setelah `mute`.                                                                   |
| `sleep`           | Membuat Exa berhenti bekerja sepenuhnya di thread. Sebut @Exa untuk membangunkannya.                                        |
| `aside <message>` | Mengirim komentar sampingan yang diabaikan Exa, berguna untuk berbicara dengan rekan tim di thread yang sedang diikuti Exa. |
| `help`            | Menampilkan petunjuk penggunaan.                                                                                            |

<div id="permissions">
  ## Izin
</div>

Exa app untuk Slack meminta scope berikut:

| Izin                   | Akses Slack                                                           | Mengapa Exa membutuhkannya                                                                                             |
| ---------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `app_mentions:read`    | Melihat pesan yang menyebut @Exa secara langsung                      | Memulai permintaan ketika seseorang menyebut Exa di channel atau thread                                                |
| `assistant:write`      | Bertindak sebagai App Agent di Slack                                  | Memanfaatkan pengalaman agent Slack dan mengalirkan jawaban ke pesan langsung serta thread channel                    |
| `channels:history`     | Melihat pesan di channel publik tempat Exa ditambahkan                | Menerima balasan thread di channel publik agar follow-ups berjalan tanpa perlu menyebut Exa lagi                       |
| `channels:read`        | Melihat informasi dasar tentang channel publik                        | Menemukan channel publik yang sudah memiliki Exa saat memilih tujuan sinkronisasi sesi web                             |
| `chat:write`           | Mengirim pesan sebagai Exa app                                        | Mengirim pesan awal thread, jawaban, pembaruan progres, konfirmasi, dan pesan hasil sinkronisasi web                   |
| `chat:write.customize` | Menyesuaikan nama dan avatar pesan yang dibuat aplikasi               | Menampilkan nama dan foto profil peserta web pada pesan yang disinkronkan dari aplikasi web                            |
| `files:read`           | Melihat berkas yang dibagikan di percakapan tempat Exa ditambahkan    | Membaca berkas yang dilampirkan pada pertanyaan                                                                        |
| `files:write`          | Mengunggah, menyunting, dan menghapus berkas sebagai Exa app          | Melampirkan berkas hasil, seperti tabel yang diekspor, ke jawaban                                                      |
| `groups:history`       | Melihat pesan di channel privat tempat Exa ditambahkan                | Menerima balasan thread di channel privat agar follow-ups berjalan tanpa perlu menyebut Exa lagi                       |
| `groups:read`          | Melihat informasi dasar tentang channel privat tempat Exa ditambahkan | Menemukan channel privat yang memenuhi syarat dan memverifikasi keanggotaan saat memilih tujuan sinkronisasi sesi web  |
| `im:history`           | Melihat pesan di pesan langsung dengan Exa                            | Menerima permintaan lewat pesan langsung dan balasan follow-up                                                         |
| `im:write`             | Memulai pesan langsung                                                | Membuka pesan langsung Exa milik pengguna terverifikasi ketika mereka memilihnya sebagai tujuan sinkronisasi sesi web |
| `users:read`           | Melihat orang dan profil dasar Slack mereka                           | Mengubah penyebutan menjadi nama dan memakai foto profil Slack peserta web pada pesan tersinkron                       |
| `users:read.email`     | Melihat alamat email anggota workspace                                | Mencocokkan akun Slack dan Exa untuk atribusi Team serta foto profil pesan web yang disesuaikan                        |

<Note>
  `channels:read`, `groups:read`, dan `im:write` memungkinkan penemuan tujuan untuk sinkronisasi web-ke-Slack.
  Instalasi yang sudah ada dapat terus menggunakan thread Slack mereka saat ini tanpa scope ini, tetapi
  harus menyambungkan ulang sebelum menggunakan tujuan terkait. `chat:write.customize` bersifat opsional saat
  runtime: tanpanya, pesan hasil sinkronisasi web tetap memakai identitas standar Exa app dan mencantumkan
  nama peserta di isi pesan.
</Note>

Exa hanya menerima pesan dari channel tempat ia diundang secara eksplisit dan dari pesan langsung miliknya sendiri.

<div id="pricing">
  ## Harga
</div>

Run yang dijalankan dari Slack akan ditagihkan ke Team Exa Anda. Lihat [harga](https://exa.ai/pricing) untuk detailnya.

<div id="privacy">
  ## Privasi
</div>

Untuk detail mengenai cara Exa menangani data Anda, lihat [kebijakan privasi Exa](https://exa.ai/privacy-policy).