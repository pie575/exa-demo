> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="build-with-exa-skill">
  # Build with Exa Skill
</div>

> Agent skill untuk membantu developer mengimplementasikan bagian mana pun dari platform API Exa.

Gunakan skill ini untuk mengajari agent Anda membangun aplikasi dan agent dengan API Exa sesuai praktik terbaik.

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru mendapatkan credit gratis.
</Card>

<Note>
  Setel key Anda sebagai `EXA_API_KEY` di environment agent Anda.
</Note>

<div id="setup">
  ## Penyiapan
</div>

**Opsi A: Instal skill ini secara langsung:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "build-with-exa"
```

**Opsi B: Salin prompt ini ke coding agent Anda.**

Prompt berikut akan memasang skill dan memverifikasi API key Anda tanpa menampilkannya:

```text Copy this setup prompt into your agent theme={null}
Siapkan build-with-exa agent skill dari Exa di mesin ini.

Tujuan:
- Pasang build-with-exa skill agar coding agent saya bisa memakainya untuk membangun aplikasi dan agent dengan seluruh platform API Exa.
- Membuat Exa API key berfungsi TANPA pernah mengekspos, mencetak, atau menempelkan key tersebut ke obrolan ini.

Agent yang dipilih:
- Claude Code, Codex, Cursor, atau agent apa pun yang kompatibel dengan Agent-Skills
- Direktori pemasangan global: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / lainnya)
- Direktori pemasangan lokal proyek: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / lainnya)

Sumber skill:
- URL SKILL.md: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md

Yang harus dilakukan:
1. Pasang skill TERLEBIH DAHULU, sebelum pengaturan key apa pun. Utamakan pemasangan lokal proyek jika bekerja di dalam sebuah repo; jika tidak, gunakan direktori global yang sesuai dari daftar di atas. Buat direktori skills yang dipilih lalu unduh skill-nya:
   mkdir -p <skills-dir>/build-with-exa && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" -o <skills-dir>/build-with-exa/SKILL.md
   Lalu pastikan <skills-dir>/build-with-exa/SKILL.md benar-benar ada.
2. Periksa apakah Exa API key sudah tersedia DARI LINGKUNGAN EKSEKUSI PERINTAH ANDA SENDIRI — gunakan tool/shell yang sama dengan yang akan Anda pakai untuk menjalankan skill, bukan dengan meminta saya menampilkannya. Skill ini mengambil key dari EXA_API_KEY lebih dulu, baru dari berkas ~/.config/exa/key, jadi periksa keduanya tanpa pernah mencetak nilainya:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Shell Anda kemungkinan bersifat non-interaktif dan TIDAK otomatis melakukan source terhadap profil interaktif seperti ~/.zshrc atau ~/.bashrc, sehingga key yang saya set di sana bisa tampak ada bagi saya tetapi kosong bagi Anda. Jika keduanya tidak muncul, key bisa jadi tersimpan di profil interaktif yang dilewati shell Anda: cari berkasnya TANPA mencetak nilainya dengan `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (hanya menampilkan nama berkas — JANGAN PERNAH menjalankan `grep`/`cat`/`echo` biasa pada sebuah profil, karena baris `export EXA_API_KEY=...` akan membocorkan secret ke obrolan kita). Lalu `source` berkas tersebut di dalam perintah Anda dan jalankan ulang uji keberadaan di atas; jika muncul, tambahkan `source ...;` yang sama di depan setiap perintah berikutnya yang membutuhkan key.
3. Hanya jika key tidak ditemukan di mana pun, siapkan satu TANPA menyunting profil shell secara manual dan TANPA menempelkan key ke obrolan ini. Minta saya membuat/menyalin key di https://dashboard.exa.ai/api-keys, lalu di terminal saya sendiri saya akan meng-export EXA_API_KEY atau menuliskannya ke ~/.config/exa/key dengan mode 600 — jangan pernah meminta saya menempelkan key ke obrolan. Setelah itu tunggu konfirmasi dari saya bahwa langkah itu selesai sebelum melanjutkan.
4. Uji cepat key tersebut dari shell Anda sendiri — ambil dari variabel lingkungan atau dari berkasnya, dan cetak kode statusnya saja:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   Pertahankan endpoint, header, dan body persis seperti tertulis (jangan menebak schema-nya). Hasilnya harus 200, bukan 401/429. Jika pada langkah 2 Anda memerlukan awalan `source ...;` untuk melihat key dari variabel lingkungan, tambahkan juga di sini.
5. Beri tahu saya cara memulai ulang atau memindai ulang agent saya agar skill tersebut terdeteksi.

Aturan mutlak sepanjang proses: key adalah secret. Periksa hanya lewat pengecekan keberadaan/panjang (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) atau kode status HTTP — jangan pernah mencetak, menjalankan `echo`, `cat`, atau `grep`-dengan-keluaran pada berkas atau variabel apa pun yang mungkin memuatnya, dan jangan pernah mencoba "menyensor" berkas key dengan regex. Jika sebuah key pernah terekspos, minta saya merotasinya di https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Lihat sumber
</div>

<Card title="build-with-exa/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" cta="Lihat sumber" arrow="true">
  Baca definisi build-with-exa skill sebelum melakukan instalasi.
</Card>

<div id="related">
  ## Terkait
</div>

<Columns cols={2}>
  <Card title="Semua agent skill" icon="layers" href="/id/docs/get-started/agent-skills/overview" cta="Jelajahi skill" arrow="true">
    Jelajahi seluruh skill Exa dan pasang semuanya sekaligus.
  </Card>

  <Card title="Repository skill" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Lihat sumber" arrow="true">
    Sumber untuk setiap skill, termasuk file `SKILL.md` mentah.
  </Card>
</Columns>