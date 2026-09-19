> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="enterprise-managed-auth-for-claude">
  # Enterprise Managed Auth untuk Claude
</div>

> Siapkan Enterprise Managed Auth (EMA) agar Claude terhubung ke Exa MCP melalui identity provider Anda, termasuk Okta Cross App Access (XAA).

Secara bawaan, setiap anggota menghubungkan [konektor Exa](/id/docs/get-started/exa-mcp) di Claude dengan masuk ke Exa satu kali melalui OAuth. Dengan **Enterprise Managed Auth (EMA)**, mereka mendapatkannya secara otomatis di balik layar melalui Okta: tanpa layar login Exa, tanpa prompt persetujuan, tanpa perlu membagikan API key.

Akses mengikuti direktori Anda: cabut akses seseorang di Okta, maka akses Exa orang tersebut melalui Claude juga ikut berhenti. EMA adalah [ekstensi enterprise managed authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) dari MCP.

<div id="before-you-start">
  ## Sebelum memulai
</div>

* Organisasi Claude Team atau Enterprise yang sudah terhubung dengan identity provider Anda, beserta akses admin ke organisasi tersebut.
* Sebuah **organisasi** Exa (bukan team pribadi) dengan SSO dan sinkronisasi direktori, beserta akses admin ke dalamnya.
* Okta sebagai identity provider Anda, berjalan di Okta Identity Engine dengan [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm) yang sudah diaktifkan, serta akses Super Admin ke tenant tersebut. Saat ini, Okta adalah satu-satunya identity provider yang didukung.

<div id="exa-values-youll-need">
  ## Nilai Exa yang Anda perlukan
</div>

| Field                             | Value                    |
| --------------------------------- | ------------------------ |
| Issuer URL (server otorisasi Exa) | `https://auth.exa.ai`    |
| URL Resource / MCP server         | `https://mcp.exa.ai/mcp` |
| Scope                             | `mcp:tools`              |

<div id="set-up-ema">
  ## Menyiapkan EMA
</div>

<Steps>
  <Step title="Siapkan anggota Anda di Exa">
    Setiap anggota yang akan menggunakan konektor harus sudah terdaftar di Exa dan tergabung dalam sebuah team di organisasi Exa Anda, dengan alamat email yang sama seperti yang dinyatakan Okta, pada domain yang sudah diverifikasi di organisasi Anda. EMA tidak pernah membuat akun. Gunakan sinkronisasi direktori, atau [undang mereka ke team](/id/docs/admin/team-management).
  </Step>

  <Step title="Daftarkan identity provider Anda di Exa">
    Di Exa Dashboard, buka [Organization](https://dashboard.exa.ai/organization), cari **Enterprise-managed auth (Claude MCP)**, lalu klik **Register identity provider**. Tempelkan URL SSO / app embed Okta Anda (`https://your-org.okta.com/app/.../sso/saml`). Exa akan memvalidasi URL tersebut saat Anda mendaftarkannya.

    Pendaftaran akan berstatus **Pending verification** sampai anggota pertama yang telah di-provision berhasil menghubungkan Claude melalui Okta, lalu berubah menjadi **Active** secara otomatis. Tidak ada langkah lain yang perlu dilakukan. Issuer yang disiapkan Exa untuk Anda akan ditampilkan sebagai **Managed by Exa**; hubungi tim dukungan untuk mengubahnya. Jika Exa tidak mengenali URL Anda, hubungi [support@exa.ai](mailto:support@exa.ai).
  </Step>

  <Step title="Konfigurasikan Cross App Access di Okta">
    Ikuti [panduan Cross App Access dari Okta untuk Claude EMA](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide). Untuk Exa:

    1. Buka aplikasi Exa di Okta Admin Console, masuk ke **Resource Server**, aktifkan XAA, lalu atur Resource URL dan Issuer URL ke `https://auth.exa.ai`. Biarkan Audience/tenant ID kosong.
    2. Jika Exa app merupakan aplikasi SAML kustom, pastikan **Name ID Format**-nya adalah `EmailAddress`, karena Exa mencocokkan email yang dinyatakan dengan akun Exa anggota tersebut.
    3. Daftarkan Claude AI Agent di **Directory → AI Agents**, tambahkan kunci publiknya dari Anthropic, tambahkan aplikasi Claude sebagai delegated caller, lalu tambahkan Exa sebagai **Resource Connection** menggunakan Client ID yang diberikan Anthropic.
  </Step>

  <Step title="Aktifkan managed authorization di Claude">
    Di Claude, buka **Organization settings → Connectors**, pilih konektor Exa, lalu pada tab **konfigurasi** klik **Set up** di samping Managed authorization. Konfirmasi koneksi IdP, jalankan pengujian, pilih peran yang mewarisi konektor tersebut, lalu simpan. Lihat [panduan admin dari Anthropic](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization) untuk opsi peran dan scope.
  </Step>
</Steps>

Anggota akan mendapatkan konektor tersebut pada saat mereka masuk berikutnya. Anda tetap bisa mengaktifkan proses masuk lewat peramban berdampingan dengan managed authorization; Claude akan mencoba managed authorization terlebih dahulu dan beralih ke login OAuth biasa jika gagal.

<Note>
  Penggunaan melalui Claude ditagihkan ke team Exa milik anggota tersebut, sesuai paket dan rate limit team itu, sama seperti aktivitas lain yang mereka jalankan di team tersebut.
</Note>

<div id="revoking-access">
  ## Mencabut akses
</div>

* **Satu anggota:** hapus anggota tersebut di Okta, atau keluarkan dari team-nya di Exa. Salah satu saja sudah cukup untuk mengakhiri aksesnya melalui Claude.
* **Semua orang:** hapus issuer di halaman Organization, atau nonaktifkan managed authorization di Claude. Koneksi baru akan langsung terhenti dan sesi yang masih terbuka berakhir tak lama setelahnya. Anda dapat mendaftarkan issuer kembali kapan saja.

<div id="troubleshooting">
  ## Pemecahan Masalah
</div>

<AccordionGroup>
  <Accordion title="Berfungsi untuk sebagian anggota, tetapi tidak untuk yang lain">
    Anggota yang gagal tidak dapat dikenali di Exa. Pastikan mereka ada di Exa dengan email yang persis sama seperti yang dinyatakan Okta, pada domain yang sudah diverifikasi di organisasi Anda, dan bahwa mereka tergabung dalam sebuah team di organisasi tersebut. Pemetaan grup pada sinkronisasi direktori biasanya menjadi penyebabnya.
  </Accordion>

  <Accordion title="Tidak berfungsi untuk siapa pun">
    Periksa status issuer di Organization page. Jika masih **Pending verification**, berarti belum ada koneksi yang berhasil. Biasanya konfigurasi Okta belum selesai, Issuer URL pada Exa app tidak cocok dengan `https://auth.exa.ai`, atau anggota yang mencoba belum di-provision di Exa. Perbaiki hal tersebut, lalu hubungkan kembali sebagai anggota yang sudah di-provision.
  </Accordion>

  <Accordion title="Pendaftaran menyatakan bahwa identity provider sudah terdaftar">
    Satu issuer hanya dapat dimiliki oleh satu organisasi Exa. Jika issuer tersebut tidak tercantum pada Organization page Anda, hubungi [support@exa.ai](mailto:support@exa.ai).
  </Accordion>
</AccordionGroup>

<Note>
  Untuk hal lainnya, hubungi [support@exa.ai](mailto:support@exa.ai) dengan menyertakan nama organisasi Exa Anda, email anggota yang terdampak, dan perkiraan waktu percobaan tersebut dilakukan.
</Note>