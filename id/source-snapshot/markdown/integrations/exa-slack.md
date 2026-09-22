> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Exa in Slack {#exa-in-slack}

> Instal Exa in Slack dan tag @Exa di channel atau thread mana pun untuk mendapatkan jawaban Research yang disertai sitasi, list building, dan Enrichment.

Hadirkan Exa ke Slack Team Anda. Tag **@Exa** di channel atau thread mana pun dengan pertanyaan Research, tugas list building, atau permintaan Enrichment. Exa menelusuri web, membaca sources, lalu membalas langsung di thread dengan jawaban yang disertai sitasi.

## Memulai {#get-started}

### Instalasi {#installation}

1. Buka [Dashboard &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack), lalu klik **Install**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="Halaman Exa in Slack di Exa dashboard, dengan tombol Install" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. Alur OAuth Slack akan terbuka. Pilih workspace tempat Anda ingin memasang Exa, lalu klik **Allow**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="Layar persetujuan OAuth Slack untuk aplikasi Exa, menampilkan pemberitahuan &#x22;App is not approved by Slack&#x22;, pemilih workspace, permissions yang diminta, dan tombol Allow" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  Pemberitahuan merah **&quot;App is not approved by Slack&quot;** memang wajar muncul dan aman untuk diabaikan. Itu hanya berarti
  Exa belum tersedia di Slack Marketplace publik, bukan karena ada masalah.
</Note>

3. Setelah terpasang, undang @Exa ke sebuah channel (atau kirim DM langsung) dan mulailah bertanya.

## Cara menggunakan Exa dari Slack {#how-to-use-exa-from-slack}

Di channel mana pun tempat Exa sudah ditambahkan, sebut @Exa beserta pertanyaan Anda:

```text theme={null}
@Exa find all Series A fintech startups in SF
```

Exa membalas pertanyaan Anda di dalam thread.

### Follow-up {#follow-ups}

Setelah Exa menjawab di sebuah thread, cukup balas di thread tersebut untuk melanjutkan percakapan. Tidak perlu menyebut @Exa lagi. Exa mengingat isi percakapan, sehingga follow-up akan melanjutkan jawaban sebelumnya. Siapa pun di dalam thread tersebut bisa mengirim follow-up.

### Pesan langsung {#direct-messages}

Anda juga bisa mengirim pesan langsung ke Exa melalui DM. Di sana Anda sama sekali tidak perlu menyebut Exa. Setiap pesan yang Anda kirim akan memulai permintaan baru, yang dijawab dalam thread di bawah pesan tersebut. Balas di thread tersebut untuk melanjutkan percakapan.

### Membatalkan run {#cancelling-a-run}

Saat run sedang berjalan, balas di thread dan minta Exa menghentikan run tersebut. Tidak perlu menyebut Exa.

```text theme={null}
Hentikan run saat ini
```

### Provider Exa Connect {#exa-connect-providers}

Exa secara otomatis menyertakan data provider [Exa Connect](/id/docs/agent/connect/overview) jika relevan dengan pertanyaan Anda. Untuk menggunakan provider tertentu, sebutkan provider tersebut dalam pesan Anda:

```text theme={null}
@Exa find me all AI infrastructure startups that raised funding this quarter using Fiber.ai
```

Untuk melihat daftar semua data provider yang tersedia, cukup tanyakan kepada Exa.

## Contoh {#examples}

### Berita dan peristiwa terkini {#news-and-current-events}

Dapatkan informasi terbaru tentang apa pun.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Exa menjawab pertanyaan tentang berita terbaru mengenai suatu topik di thread Slack, dengan hasil bertanggal dalam sebuah tabel" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

### List building skala besar {#large-list-building}

Awali permintaan dengan `!max` untuk list building yang menyeluruh.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Exa menjalankan permintaan list-building !max di dalam thread Slack dan menampilkan tabel hasil" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

## Keywords {#keywords}

Gunakan kata kunci ini di thread tempat Exa berada. Perintah dapat ditulis setelah sebutan `@Exa` atau langsung di awal pesan:

| Keyword           | Fungsi                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `!max <message>`  | Menjalankan permintaan ini dengan effort maksimal, dirancang untuk menyusun daftar yang sangat besar.                       |
| `mute`            | Menghentikan Exa merespons balasan tanpa sebutan di thread. Sebutan @Exa eksplisit tetap berfungsi.                         |
| `unmute`          | Melanjutkan kembali follow-up thread setelah `mute`.                                                                        |
| `sleep`           | Menghentikan Exa bekerja di thread sepenuhnya. Sebut @Exa untuk membangunkannya.                                            |
| `aside <message>` | Mengirim komentar sampingan yang diabaikan Exa, berguna untuk berbicara dengan rekan tim di thread yang sedang diikuti Exa. |
| `help`            | Menampilkan petunjuk penggunaan.                                                                                            |

## Permissions {#permissions}

Aplikasi Exa untuk Slack meminta scope berikut:

| Permission             | Akses Slack                                                           | Alasan Exa membutuhkannya                                                                                             |
| ---------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `app_mentions:read`    | Melihat pesan yang langsung menyebut @Exa                             | Memulai permintaan saat seseorang menyebut Exa di channel atau thread                                                 |
| `assistant:write`      | Bertindak sebagai App Agent di Slack                                  | Memakai pengalaman agent Slack dan mengalirkan jawaban ke DM dan thread channel                                       |
| `channels:history`     | Melihat pesan di channel publik tempat Exa ditambahkan                | Menerima balasan thread di channel publik agar follow-up berjalan tanpa perlu menyebut ulang                          |
| `channels:read`        | Melihat informasi dasar tentang channel publik                        | Menemukan channel publik yang sudah memuat Exa saat memilih tempat menyinkronkan sesi web                             |
| `chat:write`           | Mengirim pesan sebagai aplikasi Exa                                   | Mengirim pesan induk thread, jawaban, pembaruan progres, konfirmasi, dan pesan tersinkron dari web                    |
| `chat:write.customize` | Menyesuaikan nama dan avatar pesan yang ditulis aplikasi              | Menampilkan nama dan foto profil peserta web pada pesan yang disinkronkan dari aplikasi web                           |
| `files:read`           | Melihat file yang dibagikan di percakapan tempat Exa ditambahkan      | Membaca file yang dilampirkan pada pertanyaan                                                                         |
| `files:write`          | Mengunggah, mengedit, dan menghapus file sebagai aplikasi Exa         | Melampirkan file hasil, seperti tabel yang di-export, ke jawaban                                                      |
| `groups:history`       | Melihat pesan di channel privat tempat Exa ditambahkan                | Menerima balasan thread di channel privat agar follow-up berjalan tanpa perlu menyebut ulang                          |
| `groups:read`          | Melihat informasi dasar tentang channel privat tempat Exa ditambahkan | Menemukan channel privat yang memenuhi syarat dan memverifikasi keanggotaan saat memilih tujuan sinkronisasi sesi web |
| `im:history`           | Melihat pesan dalam pesan langsung dengan Exa                         | Menerima permintaan DM dan balasan follow-up                                                                          |
| `im:write`             | Memulai pesan langsung                                                | Membuka DM Exa milik pengguna terverifikasi saat mereka memilihnya sebagai tujuan sinkronisasi sesi web               |
| `users:read`           | Melihat orang dan profil dasar Slack mereka                           | Mencocokkan sebutan dengan nama dan memakai foto profil Slack peserta web pada pesan tersinkron                       |
| `users:read.email`     | Melihat alamat email anggota workspace                                | Mencocokkan akun Slack dan Exa untuk atribusi Team serta foto profil pesan web yang disesuaikan                       |

<Note>
  `channels:read`, `groups:read`, dan `im:write` memungkinkan penemuan tujuan untuk sinkronisasi web ke Slack.
  Instalasi yang sudah ada dapat terus memakai thread Slack mereka saat ini tanpa scope ini, tetapi
  harus menyambungkan ulang sebelum memakai tujuan terkait. `chat:write.customize` bersifat opsional saat
  runtime: tanpanya, pesan tersinkron dari web tetap memakai identitas aplikasi Exa standar dan menyertakan
  nama peserta di body pesan.
</Note>

Exa hanya menerima pesan dari channel tempat ia diundang secara eksplisit dan dari DM miliknya sendiri.

## Harga {#pricing}

Run yang dijalankan dari Slack ditagihkan ke Team Exa Anda. Lihat [harga](https://exa.ai/pricing) untuk detailnya.

## Privasi {#privacy}

Untuk detail mengenai cara Exa menangani data Anda, lihat [kebijakan privasi Exa](https://exa.ai/privacy-policy).