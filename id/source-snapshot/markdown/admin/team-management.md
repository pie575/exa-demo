> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="managing-your-team">
  # Mengelola Team Anda
</div>

> Detail tentang struktur Team dan pengelolaan akun di platform Exa

***

<Card title="Buka API Dashboard" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  Buat Team, undang anggota, dan kelola billing.
</Card>

Exa mengelola usage akun dan akses fitur berbayar melalui &#39;Team&#39;:

Saat akun dibuat, Anda otomatis ditempatkan dalam Team &#39;Personal&#39;. Gunakan dropdown di kiri atas Exa Dashboard seperti yang ditampilkan di bawah ini untuk membuat Team baru atau berpindah antar-Team yang Anda miliki. Anda dapat membuat Team sebanyak yang Anda inginkan.

<div id="seeing-your-teams">
  ## Melihat Team Anda
</div>

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Dropdown Team (kiri atas) di Exa dashboard pada bagian Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Dropdown Team (kiri atas) di Exa dashboard pada bagian Team settings

<div id="topping-up-a-teams-balance">
  ## Mengisi saldo Team
</div>

Setelah Team yang diinginkan dipilih, Anda dapat mengisi saldo credit di halaman Billing.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Pengisian saldo credit di halaman Billing" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

<div id="inviting-people-to-your-team">
  ## Mengundang orang ke Team Anda
</div>

Admin Team dapat menambahkan anggota melalui fitur Invite di Team settings.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="Mengundang anggota di Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

Setelah seorang anggota Team diundang, statusnya akan menjadi &#39;Pending&#39; di menu manajemen Team.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="Anggota Team tercantum dengan status undangan Pending" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

Mereka akan menerima email berisi undangan untuk bergabung dengan Team.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="Email undangan Team" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

Setelah undangan diterima, Anda akan melihat kedua anggota berstatus &#39;Accepted&#39;. Semua anggota Team berbagi limit usage dan fitur sesuai paket Team masing-masing.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Daftar anggota Team yang menampilkan status Accepted" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

<div id="team-management-api">
  ## Team Management API
</div>

Buat dan kelola API key secara terprogram dengan [Team Management API](/id/docs/reference/team-management/create-api-key).

<Info>
  Team Management API diaktifkan per Team. Autentikasinya menggunakan API key akun layanan, yang dibuat dari tab **Service keys** di [halaman API keys](https://dashboard.exa.ai/api-keys) setelah fitur ini diaktifkan untuk Team Anda. Hubungi [support@exa.ai](mailto:support@exa.ai) untuk meminta akses.
</Info>