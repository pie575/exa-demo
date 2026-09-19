> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-search-skill">
  # Exa Search Skill
</div>

> Temukan halaman web yang relevan dan dapatkan konten hasil sintesis dalam waktu kurang dari dua detik dengan Exa Search.

Gunakan skill ini untuk mengajari agent Anda memanggil Exa Search melalui cURL atau raw HTTP dengan menerapkan praktik terbaik.

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru mendapatkan credits gratis.
</Card>

<Note>
  Atur key Anda sebagai `EXA_API_KEY` di lingkungan agent Anda.
</Note>

<div id="setup">
  ## Penyiapan
</div>

**Opsi A: Pasang skill ini secara langsung:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-search"
```

**Opsi B: Salin prompt ini ke coding agent Anda.**

Prompt berikut akan memasang skill dan memverifikasi API key Anda tanpa menampilkannya:

```text Copy this setup prompt into your agent theme={null}
Siapkan agent skill exa-search dari Exa di mesin ini.

Tujuan:
- Pasang skill exa-search agar coding agent saya bisa menggunakannya untuk memanggil Exa Search secara langsung dengan cURL atau raw HTTP.
- Membuat Exa API key berfungsi TANPA pernah mengekspos, mencetak, atau menempelkan key tersebut ke obrolan ini.

Agent yang dipilih:
- Claude Code, Codex, Cursor, atau agent apa pun yang kompatibel dengan Agent Skills
- Direktori pemasangan global: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / lainnya)
- Direktori pemasangan lokal proyek: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / lainnya)

Sumber skill:
- URL SKILL.md: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md

Yang harus dilakukan:
1. Pasang skill TERLEBIH DAHULU, sebelum menyiapkan key apa pun. Utamakan pemasangan lokal proyek saat bekerja di dalam sebuah repo; jika tidak, gunakan direktori global yang sesuai seperti tercantum di atas. Buat direktori skills yang dipilih lalu unduh skill-nya:
   mkdir -p <skills-dir>/exa-search && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" -o <skills-dir>/exa-search/SKILL.md
   Lalu pastikan bahwa <skills-dir>/exa-search/SKILL.md sudah ada.
2. Periksa apakah Exa API key sudah tersedia DARI LINGKUNGAN TEMPAT KAMU MENJALANKAN PERINTAH — gunakan tool/shell yang sama dengan yang akan kamu pakai untuk menjalankan skill, bukan dengan meminta saya meng-echo key tersebut. Skill ini mengambil key dari EXA_API_KEY terlebih dahulu, lalu dari berkas ~/.config/exa/key, jadi periksa keduanya tanpa pernah mencetak nilainya:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Shell kamu kemungkinan non-interaktif dan TIDAK otomatis meng-source profil interaktif seperti ~/.zshrc atau ~/.bashrc, sehingga key yang saya set di sana bisa tampak ada bagi saya tetapi kosong bagi kamu. Jika keduanya tidak muncul, key bisa jadi tersimpan di profil interaktif yang dilewati shell kamu: cari tahu berkas mana TANPA mencetak nilainya dengan `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (hanya menampilkan nama berkas — JANGAN PERNAH menjalankan `grep`/`cat`/`echo` biasa pada sebuah profil, karena baris `export EXA_API_KEY=...` akan membocorkan secret tersebut ke obrolan kita). Lalu `source` berkas itu di dalam perintahmu dan jalankan ulang pengecekan keberadaan di atas; jika muncul, tambahkan `source ...;` yang sama di depan setiap perintah berikutnya yang membutuhkan key.
3. Hanya jika tidak ada key yang bisa ditemukan di mana pun, siapkan satu TANPA menyunting profil shell secara manual dan TANPA menempelkan key ke obrolan ini. Minta saya membuat/menyalin key di https://dashboard.exa.ai/api-keys, lalu di terminal saya sendiri saya akan meng-export EXA_API_KEY atau menuliskannya ke ~/.config/exa/key dengan mode 600 — jangan pernah meminta saya menempelkan key ke obrolan. Kemudian tunggu konfirmasi dari saya bahwa langkah itu selesai sebelum melanjutkan.
4. Uji cepat key tersebut dari shell kamu sendiri — ambil dari variabel lingkungan atau dari berkasnya, dan cetak kode statusnya saja:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   Pertahankan endpoint, header, dan body persis seperti tertulis (jangan menebak schema-nya). Hasilnya harus 200, bukan 401/429. Jika pada langkah 2 kamu memerlukan awalan `source ...;` untuk melihat key dari variabel lingkungan, tambahkan juga di sini.
5. Beri tahu saya cara menjalankan ulang atau memindai ulang agent saya agar skill tersebut terdeteksi.

Aturan mutlak sepanjang proses: key adalah secret. Periksa hanya lewat pengecekan keberadaan/panjang (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) atau kode status HTTP — jangan pernah mencetak, meng-`echo`, meng-`cat`, atau menjalankan `grep` yang menampilkan isi berkas atau variabel apa pun yang mungkin memuat key, dan jangan pernah mencoba "menyensor" berkas key dengan regex. Jika suatu key pernah terekspos, minta saya merotasinya di https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## Lihat sumber
</div>

<Card title="exa-search/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" cta="Lihat sumber" arrow="true">
  Baca definisi skill exa-search sebelum memasangnya.
</Card>

<div id="related">
  ## Terkait
</div>

<Columns cols={2}>
  <Card title="Semua agent skill" icon="layers" href="/id/docs/get-started/agent-skills/overview" cta="Jelajahi skill" arrow="true">
    Jelajahi semua skill Exa dan pasang sekaligus.
  </Card>

  <Card title="Repository skill" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Lihat sumber" arrow="true">
    Sumber untuk setiap skill, termasuk file `SKILL.md` mentah.
  </Card>
</Columns>