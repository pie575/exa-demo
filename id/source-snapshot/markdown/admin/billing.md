> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="billing-and-rate-limits">
  # Billing dan Rate Limit
</div>

> Kelola credits Exa, faktur, dan rate limit API.

Exa menyediakan tier Free, billing pay-as-you-go, dan paket Enterprise khusus. Penggunaan API memotong saldo credits tim Anda, sedangkan rate limit menentukan seberapa cepat tim dapat mengirim permintaan.

<Columns cols={3}>
  <Card title="Billing dashboard" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="Kelola billing" arrow="true">
    Tambahkan credits, atur isi ulang otomatis, dan lihat faktur.
  </Card>

  <Card title="API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Kelola API key" arrow="true">
    Tinjau penggunaan dan tetapkan limit yang lebih rendah untuk key tertentu.
  </Card>

  <Card title="Harga" icon="tag" href="/id/docs/admin/pricing" cta="Lihat harga" arrow="true">
    Bandingkan tarif terkini di seluruh produk Exa.
  </Card>
</Columns>

<div id="plans-at-a-glance">
  ## Sekilas tentang paket
</div>

| Paket             | Billing                                                              | Rate limit                                        | Concurrency Agent |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------------- | ----------------- |
| **Free**          | $20 credits perkenalan, lalu $10 credits yang diisi ulang tiap bulan | 10 QPS                                            | 50 runs aktif     |
| **Pay as you go** | Credits prabayar tanpa langganan atau minimum belanja                | 10 QPS, [hingga 25 QPS](#25-qps-on-pay-as-you-go) | 50 runs aktif     |
| **Enterprise**    | Harga volume khusus dan opsi penagihan pascabayar                    | Khusus                                            | Khusus            |

<Card title="Hubungi Kami" icon="headset" href="https://exa.ai/contact/sales" cta="Hubungi tim sales" arrow="true">
  Kami akan membantu menentukan konfigurasi terbaik untuk menangani latensi, skala, ZDR, dan lainnya.
</Card>

<div id="billing-basics">
  ## Dasar-dasar billing
</div>

Permintaan ditagihkan dari credits prabayar sesuai rates yang tercantum di [Harga](/id/docs/admin/pricing) atau berdasarkan kontrak Enterprise Anda. Pemilik team dapat menambahkan credits melalui [Billing dashboard](https://dashboard.exa.ai/billing); pembayaran diproses melalui Stripe.

Jika credits team Anda habis, permintaan akan mengembalikan `402 Payment Required`. API key yang mencapai batas budget-nya juga akan mengembalikan `402`. Tambahkan credits atau minta administrator team untuk menyesuaikan budget key tersebut. Lihat [Error codes](/id/docs/admin/error-codes).

Untuk melihat riwayat penggunaan per API key, gunakan [Get API key penggunaan](/id/docs/reference/team-management/get-api-key-usage).

<div id="rate-limits">
  ## Rate limit
</div>

Rate limit diukur dalam kueri per detik (QPS) dan berlaku untuk Team Anda secara keseluruhan, mencakup semua API key di dalamnya. Anda dapat menetapkan limit yang lebih rendah untuk satu key tertentu melalui halaman [API Keys](https://dashboard.exa.ai/api-keys), tetapi trafiknya tetap diperhitungkan dalam limit Team.

| Endpoint                                                           | Limit default          |
| ------------------------------------------------------------------ | ---------------------- |
| `/search`, `/answer`, `/chat/completions`                          | 10 QPS                 |
| `/search` dengan `type` `deep-lite`, `deep`, atau `deep-reasoning` | 5 QPS                  |
| `/contents`                                                        | 100 QPS                |
| `/agent/runs`, `/responses`                                        | 5 QPS dan 50 run aktif |
| `/websets/*`                                                       | 20 QPS                 |

Beberapa endpoint berbagi kapasitas rate limit. Limit dapat berubah sewaktu-waktu dan berbeda-beda tergantung paket; search pada Websets juga memiliki limit concurrency berdasarkan paket, yang dapat Anda periksa melalui [Get Team Info](/id/docs/websets/api/teams/get-team-info).

Jika Anda melampaui suatu limit, permintaan akan mengembalikan `429 Too Many Requests`. Tunggu sesuai header `Retry-After` bila tersedia, atau coba lagi dengan exponential backoff. Lihat [Error codes](/id/docs/admin/error-codes).

<div id="agent-limits">
  ### Batas Agent
</div>

Batas Agent terdiri dari dua kontrol terpisah: berapa banyak run yang dapat berjalan sekaligus, dan seberapa cepat Anda dapat memulai run baru.

* **Concurrency**: 50 Agent run dapat berjalan dalam satu waktu. Batas ini terpisah dari QPS Anda dan tidak berubah meskipun QPS Anda dinaikkan. Memulai run melebihi batas tersebut akan mengembalikan `429` dengan kode error `CONCURRENCY_LIMIT_REACHED`; tunggu hingga ada run yang selesai atau hubungi kami untuk menaikkan batas concurrency Anda.
* **Memulai run**: `POST /agent/runs` mengambil kuota dari QPS akun Anda, dan setiap pemulaian run dihitung sebagai dua permintaan. Anda dapat memulai run pada setengah QPS Anda, sehingga akun dengan 10 QPS bawaan dapat memulai 5 run per detik, dan 25 QPS memungkinkan 12 run per detik.
* **Polling**: Permintaan `GET` untuk status run, event, dan daftar run tidak diperhitungkan terhadap QPS Anda dan tidak pernah menghambat dispatch, jadi Anda bisa melakukan poll pada Agent yang sedang berjalan tanpa terpengaruh seberapa cepat Anda memulai run baru.

<div id="25-qps-on-pay-as-you-go">
  ### 25 QPS pada pay as you go
</div>

Tambahkan $1.000 credits dalam rentang 30 hari mana pun, dan rate limit Team Anda otomatis naik menjadi **25 QPS selama 90 hari**. Ambang batas ini dihitung dari credits yang Anda beli, bukan credits yang Anda pakai, dan jika Anda kembali memenuhi syarat, masa 90 hari tersebut akan dimulai ulang. Pantau progres Anda di [Billing dashboard](https://dashboard.exa.ai/billing).

Butuh lebih dari 25 QPS? [Hubungi tim sales](https://exa.ai/contact/sales).

<div id="auto-recharge">
  ## Isi ulang otomatis
</div>

Isi ulang otomatis membeli credits ketika saldo Anda mencapai ambang batas yang Anda tentukan. Konfigurasikan dari [Billing dashboard](https://dashboard.exa.ai/billing).

| Pengaturan                 | Deskripsi                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Jumlah isi ulang**       | Credits yang dibeli setiap kali isi ulang otomatis terpicu, mulai dari $5 hingga $10.000.                                  |
| **Ambang batas isi ulang** | Saldo yang memicu isi ulang.                                                                                               |
| **Maksimum bulanan**       | Batas opsional untuk pembelian isi ulang otomatis selama siklus billing. Setel ke $0 atau biarkan kosong jika tanpa batas. |

Sebagai contoh, jumlah isi ulang $100, ambang batas $10, dan maksimum bulanan $500 berarti sistem membeli $100 setiap kali saldo mencapai $10, hingga total $500 pembelian otomatis dalam satu siklus.

Untuk peluncuran yang akan datang atau beban kerja bervolume tinggi lainnya, tambahkan credits yang cukup sejak awal dan setel jumlah isi ulang otomatis yang cukup besar agar tidak terjadi banyak percobaan payment kecil.

<div id="receipts-and-invoices">
  ## Tanda terima dan faktur
</div>

Exa mengirimkan tanda terima untuk pembelian credit dan isi ulang otomatis melalui email dari [billing@exa.ai](mailto:billing@exa.ai). Tambahkan alamat tersebut ke daftar izin (allow list) Anda jika diperlukan. Riwayat faktur lengkap Anda tersedia di [Billing dashboard](https://dashboard.exa.ai/billing).

Penagihan lewat faktur pascabayar tersedia pada paket Enterprise.

<div id="get-help">
  ## Dapatkan bantuan
</div>

<Columns cols={2}>
  <Card title="Tingkatkan limit Anda" icon="gauge" href="https://exa.ai/contact/sales" cta="Hubungi tim sales" arrow="true">
    Ajukan permintaan di atas 25 QPS, concurrency khusus, harga volume, atau billing pascabayar.
  </Card>

  <Card title="Dukungan billing" icon="mail" href="mailto:billing@exa.ai" cta="Kirim email ke tim billing" arrow="true">
    Dapatkan bantuan seputar pembayaran, credits, faktur, atau pertanyaan billing akun.
  </Card>
</Columns>