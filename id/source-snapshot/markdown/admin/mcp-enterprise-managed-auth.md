> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

# Enterprise Managed Auth untuk Claude {#enterprise-managed-auth-for-claude}

> Siapkan Enterprise Managed Auth (EMA) agar Claude terhubung ke Exa MCP melalui identity provider Anda, termasuk Okta Cross App Access (XAA).

Secara default, setiap anggota menghubungkan [konektor Exa](/id/docs/get-started/exa-mcp) di Claude dengan masuk ke Exa satu kali melalui OAuth. Dengan **Enterprise Managed Auth (EMA)**, mereka mendapatkannya secara otomatis melalui Okta: tanpa layar login Exa, tanpa prompt persetujuan, dan tanpa perlu membagikan API key.

Akses mengikuti direktori Anda: cabut akun seseorang di Okta, maka akses Exa-nya melalui Claude ikut terhenti. EMA adalah [enterprise managed authorization extension](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) dari MCP.

## Sebelum memulai {#before-you-start}

* Organisasi Claude Team atau Enterprise yang sudah terhubung dengan identity provider Anda, beserta akses admin ke organisasi tersebut.
* **Organisasi** Exa (bukan team pribadi) dengan SSO dan sinkronisasi direktori, beserta akses admin ke organisasi tersebut.
* Okta sebagai identity provider Anda, berjalan di Okta Identity Engine dengan [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm) yang aktif, serta akses Super Admin ke tenant. Saat ini, Okta adalah satu-satunya identity provider yang didukung.

## Nilai Exa yang Anda perlukan {#exa-values-youll-need}

| Field                             | Nilai                    |
| --------------------------------- | ------------------------ |
| issuer URL (server otorisasi Exa) | `https://auth.exa.ai`    |
| URL sumber daya / MCP server      | `https://mcp.exa.ai/mcp` |
| Scope                             | `mcp:tools`              |

## Menyiapkan EMA {#set-up-ema}

<Steps>
  <Step title="Provision anggota Anda di Exa">
    Setiap anggota yang akan menggunakan konektor ini harus sudah ada di Exa dan tergabung dalam sebuah team di organisasi Exa Anda, dengan alamat email yang sama dengan yang dikirimkan Okta, pada domain yang sudah diverifikasi di organisasi Anda. EMA tidak pernah membuat akun. Gunakan sinkronisasi direktori, atau [undang mereka ke team](/id/docs/admin/team-management).
  </Step>

  <Step title="Daftarkan identity provider Anda di Exa">
    Di dashboard Exa, buka [Organization](https://dashboard.exa.ai/organization), cari **Enterprise-managed auth (Claude MCP)**, lalu klik **Register identity provider**. Tempelkan URL Okta SSO / app embed Anda (`https://your-org.okta.com/app/.../sso/saml`). Exa memvalidasi URL tersebut saat Anda mendaftarkannya.

    Registrasi akan tetap berstatus **Pending verification** sampai anggota pertama yang sudah di-provision berhasil menghubungkan Claude melalui Okta, lalu otomatis berubah menjadi **Active**. Tidak ada langkah lain yang perlu dilakukan. Issuer yang disiapkan Exa untuk Anda akan tampil sebagai **Managed by Exa**; hubungi support untuk mengubahnya. Jika Exa tidak mengenali URL Anda, hubungi [support@exa.ai](mailto:support@exa.ai).
  </Step>

  <Step title="Konfigurasikan Cross App Access di Okta">
    Ikuti [panduan Cross App Access dari Okta untuk Claude EMA](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide). Untuk Exa:

    1. Buka aplikasi Exa di Okta Admin Console, masuk ke **Resource Server**, aktifkan XAA, lalu atur Resource URL dan Issuer URL ke `https://auth.exa.ai`. Biarkan Audience/tenant ID kosong.
    2. Jika aplikasi Exa merupakan aplikasi SAML kustom, pastikan **Name ID Format**-nya adalah `EmailAddress`, karena Exa mencocokkan email yang dikirimkan tersebut dengan akun Exa milik anggota.
    3. Daftarkan Claude AI Agent di **Directory → AI Agents**, tambahkan public key-nya dari Anthropic, tambahkan aplikasi Claude sebagai delegated caller, lalu tambahkan Exa sebagai **Resource Connection** menggunakan Client ID yang diberikan Anthropic kepada Anda.
  </Step>

  <Step title="Aktifkan managed authorization di Claude">
    Di Claude, buka **Organization settings → Connectors**, pilih konektor Exa, lalu pada tab **Configuration** klik **Set up** di sebelah Managed authorization. Konfirmasikan koneksi IdP, jalankan pengujian, pilih peran yang mewarisi konektor tersebut, lalu simpan. Lihat [panduan admin dari Anthropic](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization) untuk opsi peran dan scope.
  </Step>
</Steps>

Anggota akan mendapatkan konektor tersebut saat mereka masuk berikutnya. Anda dapat tetap mengaktifkan proses masuk melalui browser bersamaan dengan managed authorization; Claude akan mencoba managed authorization terlebih dahulu dan beralih ke login OAuth biasa jika gagal.

<Note>
  Penggunaan melalui Claude ditagihkan ke team Exa milik anggota tersebut, sesuai plan dan rate limit team itu, sama seperti hal lain yang mereka jalankan di team tersebut.
</Note>

## Mencabut akses {#revoking-access}

* **Satu anggota:** hapus anggota tersebut di Okta, atau keluarkan dari Team-nya di Exa. Salah satu langkah ini sudah cukup untuk mengakhiri aksesnya melalui Claude.
* **Semua anggota:** hapus issuer di halaman Organization, atau nonaktifkan managed authorization di Claude. Koneksi baru langsung terhenti dan sesi yang sedang berjalan akan berakhir tidak lama kemudian. Anda dapat mendaftarkan issuer kembali kapan saja.

## Pemecahan Masalah {#troubleshooting}

<AccordionGroup>
  <Accordion title="Berfungsi untuk sebagian anggota, tetapi tidak untuk yang lain">
    Anggota yang gagal tersebut tidak dapat dikenali di Exa. Pastikan mereka terdaftar di Exa dengan email yang persis sama seperti yang dikirim Okta, pada domain yang sudah terverifikasi di organisasi Anda, dan bahwa mereka tergabung dalam sebuah team di organisasi tersebut. Pemetaan grup sinkronisasi direktori biasanya menjadi penyebabnya.
  </Accordion>

  <Accordion title="Tidak berfungsi untuk siapa pun">
    Periksa status issuer pada Organization page. Jika statusnya masih **Pending verification**, berarti belum ada koneksi yang berhasil. Biasanya konfigurasi Okta belum selesai, Issuer URL pada aplikasi Exa tidak cocok dengan `https://auth.exa.ai`, atau anggota yang mencoba belum di-provision di Exa. Perbaiki hal tersebut, lalu hubungkan kembali sebagai anggota yang sudah di-provision.
  </Accordion>

  <Accordion title="Registrasi menyatakan bahwa identity provider sudah terdaftar">
    Satu issuer hanya dapat dimiliki oleh satu organisasi Exa. Jika issuer tidak tercantum pada Organization page Anda, hubungi [support@exa.ai](mailto:support@exa.ai).
  </Accordion>
</AccordionGroup>

<Note>
  Untuk hal lainnya, hubungi [support@exa.ai](mailto:support@exa.ai) dengan menyertakan nama organisasi Exa Anda, email anggota yang terdampak, dan perkiraan waktu percobaan tersebut dilakukan.
</Note>