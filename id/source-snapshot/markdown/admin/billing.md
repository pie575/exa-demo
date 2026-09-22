> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Billing dan Rate Limit {#billing-and-rate-limits}

> Kelola credits Exa, faktur, dan rate limit API.

Exa menyediakan tier Free, billing pay-as-you-go, dan plan Enterprise khusus. Penggunaan API memotong saldo credit team Anda, sedangkan rate limit mengatur seberapa cepat team dapat mengirim permintaan.

<Columns cols={3}>
  <Card title="Billing dashboard" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="Kelola billing" arrow="true">
    Tambahkan credits, atur isi ulang otomatis, dan lihat faktur.
  </Card>

  <Card title="API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Kelola API key" arrow="true">
    Tinjau penggunaan dan tetapkan batas yang lebih rendah untuk tiap key.
  </Card>

  <Card title="Harga" icon="tag" href="/id/docs/admin/pricing" cta="Lihat harga" arrow="true">
    Bandingkan tarif terkini di seluruh produk Exa.
  </Card>
</Columns>

## Sekilas tentang plan {#plans-at-a-glance}

| Plan              | Billing                                                                        | Rate limit                                        | Konkurensi Agent |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | ---------------- |
| **Free**          | Credits perkenalan senilai $20, lalu $10 credits yang diisi ulang setiap bulan | 10 QPS                                            | 50 active runs   |
| **Pay as you go** | Credits prabayar tanpa langganan maupun minimum belanja                        | 10 QPS, [hingga 25 QPS](#25-qps-on-pay-as-you-go) | 50 active runs   |
| **Enterprise**    | Harga volume khusus dan opsi penagihan pascabayar                              | Khusus                                            | Khusus           |

<Card title="Hubungi Kami" icon="headset" href="https://exa.ai/contact/sales" cta="Hubungi tim sales" arrow="true">
  Kami akan memberikan saran penyiapan terbaik untuk menangani latency, skala, ZDR, dan lainnya.
</Card>

## Dasar-dasar billing {#billing-basics}

Permintaan dikenakan biaya dari credits prabayar sesuai tarif di [Harga](/id/docs/admin/pricing) atau berdasarkan kontrak Enterprise Anda. Team owner dapat menambahkan credits melalui [Billing dashboard](https://dashboard.exa.ai/billing); pembayaran diproses melalui Stripe.

Jika credits team Anda habis, permintaan akan mengembalikan `402 Payment Required`. API key yang mencapai batas budget yang ditetapkan juga akan mengembalikan `402`. Tambahkan credits atau minta administrator team untuk menyesuaikan budget key tersebut. Lihat [Error codes](/id/docs/admin/error-codes).

Untuk riwayat penggunaan per API key, gunakan [Get API key usage](/id/docs/reference/team-management/get-api-key-usage).

## Rate limit {#rate-limits}

Rate limit diukur dalam queries per second (QPS) dan berlaku untuk team Anda secara keseluruhan, mencakup seluruh API key di dalamnya. Anda dapat menetapkan batas yang lebih rendah untuk satu key tertentu melalui halaman [API Keys](https://dashboard.exa.ai/api-keys), tetapi trafiknya tetap diperhitungkan terhadap batas team.

| Endpoint                                                           | Batas default            |
| ------------------------------------------------------------------ | ------------------------ |
| `/search`, `/answer`, `/chat/completions`                          | 10 QPS                   |
| `/search` dengan `type` `deep-lite`, `deep`, atau `deep-reasoning` | 5 QPS                    |
| `/contents`                                                        | 100 QPS                  |
| `/agent/runs`, `/responses`                                        | 5 QPS dan 50 active runs |
| `/websets/*`                                                       | 20 QPS                   |

Beberapa endpoint berbagi kapasitas rate limit. Batas dapat berubah sewaktu-waktu dan bisa berbeda tergantung plan; searches Websets juga memiliki batas konkurensi berdasarkan plan, yang dapat Anda periksa melalui [Get Team Info](/id/docs/websets/api/teams/get-team-info).

Jika Anda melampaui suatu batas, permintaan akan mengembalikan `429 Too Many Requests`. Tunggu sesuai header `Retry-After` bila tersedia, atau coba lagi dengan exponential backoff. Lihat [Error codes](/id/docs/admin/error-codes).

### Batas Agent {#agent-limits}

Batas Agent terdiri dari dua kontrol terpisah: berapa banyak run yang dapat berjalan sekaligus, dan seberapa cepat Anda dapat memulai run baru.

* **Konkurensi**: 50 Agent run dapat berjalan dalam satu waktu. Batas ini terpisah dari QPS Anda dan tidak berubah saat QPS Anda dinaikkan. Memulai run melebihi batas tersebut akan mengembalikan `429` dengan kode error `CONCURRENCY_LIMIT_REACHED`; tunggu hingga ada run yang selesai atau hubungi kami untuk menaikkan batas konkurensi Anda.
* **Memulai run**: `POST /agent/runs` mengambil dari QPS akun Anda, dan setiap run yang dimulai dihitung sebagai dua permintaan. Anda dapat memulai run pada setengah dari QPS Anda, sehingga akun dengan default 10 QPS dapat memulai 5 run per detik, dan 25 QPS memungkinkan 12 run per detik.
* **Polling**: permintaan `GET` untuk status run, events, dan daftar run tidak dihitung terhadap QPS Anda dan tidak pernah menghambat dispatch, jadi Anda dapat melakukan poll pada Agent yang sedang berjalan tanpa terpengaruh seberapa cepat Anda memulai run baru.

### 25 QPS pada pay as you go {#25-qps-on-pay-as-you-go}

Tambahkan credits senilai $1.000 dalam rentang 30 hari mana pun, dan rate limit team Anda otomatis naik menjadi **25 QPS selama 90 hari**. Ambang batas ini dihitung dari credits yang Anda beli, bukan credits yang Anda pakai, dan memenuhi syarat kembali akan mengatur ulang masa 90 hari tersebut. Pantau progres Anda di [Billing dashboard](https://dashboard.exa.ai/billing).

Butuh lebih dari 25 QPS? [Hubungi tim sales](https://exa.ai/contact/sales).

## Isi ulang otomatis {#auto-recharge}

Isi ulang otomatis membeli credits ketika saldo Anda mencapai ambang batas yang Anda tentukan. Konfigurasikan melalui [Billing dashboard](https://dashboard.exa.ai/billing).

| Pengaturan                 | Deskripsi                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Jumlah isi ulang**       | Credits yang dibeli setiap kali isi ulang otomatis terpicu, mulai dari $5 hingga $10.000.                                  |
| **Ambang batas isi ulang** | Saldo yang memicu isi ulang.                                                                                               |
| **Batas maksimum bulanan** | Batas opsional untuk pembelian isi ulang otomatis selama siklus billing. Setel ke $0 atau biarkan kosong jika tanpa batas. |

Sebagai contoh, dengan jumlah isi ulang $100, ambang batas $10, dan batas maksimum bulanan $500, sistem akan membeli $100 setiap kali saldo mencapai $10, hingga total $500 pembelian otomatis dalam satu siklus.

Untuk peluncuran yang akan datang atau beban kerja bervolume tinggi lainnya, tambahkan credits yang cukup sejak awal dan setel jumlah isi ulang otomatis yang cukup besar agar tidak terjadi banyak percobaan payment kecil.

## Tanda terima dan faktur {#receipts-and-invoices}

Exa mengirimkan tanda terima untuk pembelian credits dan isi ulang otomatis melalui email dari [billing@exa.ai](mailto:billing@exa.ai). Tambahkan alamat tersebut ke daftar izin Anda jika diperlukan. Riwayat faktur lengkap Anda tersedia di [Billing dashboard](https://dashboard.exa.ai/billing).

Billing faktur pascabayar tersedia pada plan Enterprise.

## Dapatkan bantuan {#get-help}

<Columns cols={2}>
  <Card title="Tingkatkan batas Anda" icon="gauge" href="https://exa.ai/contact/sales" cta="Hubungi tim sales" arrow="true">
    Ajukan permintaan untuk lebih dari 25 QPS, konkurensi khusus, harga volume, atau billing pascabayar.
  </Card>

  <Card title="Dukungan billing" icon="mail" href="mailto:billing@exa.ai" cta="Email billing" arrow="true">
    Dapatkan bantuan untuk pembayaran, credits, faktur, atau pertanyaan seputar billing akun.
  </Card>
</Columns>