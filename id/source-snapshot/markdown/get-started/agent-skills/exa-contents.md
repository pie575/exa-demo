> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Exa Contents Skill {#exa-contents-skill}

> Ekstrak konten halaman dengan Exa Contents ketika Anda sudah memiliki URL-nya.

Gunakan skill ini untuk mengajari agent Anda memanggil Exa Contents melalui cURL atau raw HTTP dengan praktik terbaik.

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru mendapatkan credits gratis.
</Card>

<Note>
  Setel key Anda sebagai `EXA_API_KEY` di lingkungan agent Anda.
</Note>

## Setup {#setup}

**Opsi A: Pasang skill ini secara langsung:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-contents"
```

**Opsi B: Salin prompt ini ke coding agent Anda.**

Prompt berikut akan menginstal skill dan memverifikasi API key Anda tanpa menampilkannya:

```text Copy this setup prompt into your agent theme={null}
Siapkan agent skill exa-contents dari Exa di mesin ini.

Tujuan:
- Pasang skill exa-contents agar coding agent saya bisa memakainya untuk memanggil Exa Contents secara langsung dengan cURL atau raw HTTP.
- Membuat Exa API key berfungsi TANPA pernah mengekspos, mencetak, atau menempelkan key ke dalam chat ini.

Agent yang dipilih:
- Claude Code, Codex, Cursor, atau agent apa pun yang kompatibel dengan Agent Skills
- Direktori instalasi global: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / lainnya)
- Direktori instalasi lokal proyek: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / lainnya)

Sumber skill:
- URL SKILL.md: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

Yang harus dilakukan:
1. Pasang skill TERLEBIH DAHULU, sebelum menyiapkan key. Utamakan instalasi lokal proyek saat bekerja di dalam repositori; jika tidak, gunakan direktori global yang sesuai dari daftar di atas. Buat direktori skills yang dipilih lalu unduh skill-nya:
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   Lalu pastikan <skills-dir>/exa-contents/SKILL.md benar-benar ada.
2. Periksa apakah Exa API key sudah tersedia DARI LINGKUNGAN TEMPAT KAMU MENJALANKAN PERINTAH — gunakan tool/shell yang sama yang akan kamu pakai untuk menjalankan skill, bukan dengan meminta saya meng-echo-nya. Skill ini mengambil key dari EXA_API_KEY terlebih dahulu, lalu dari file ~/.config/exa/key, jadi periksa keduanya tanpa pernah mencetak nilainya:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Shell kamu kemungkinan non-interaktif dan TIDAK otomatis melakukan source terhadap profil interaktif seperti ~/.zshrc atau ~/.bashrc, sehingga key yang saya set di sana bisa tampak ada bagi saya tetapi kosong bagi kamu. Jika keduanya tidak muncul, key bisa jadi masih tersimpan di profil interaktif yang dilewati shell kamu: cari file mana TANPA mencetak nilainya menggunakan `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (hanya menampilkan nama file — JANGAN PERNAH menjalankan `grep`/`cat`/`echo` biasa pada profil, karena baris `export EXA_API_KEY=...` akan membocorkan secret ke dalam chat kita). Setelah itu jalankan `source` pada file tersebut di dalam perintahmu dan ulangi pengecekan keberadaan di atas; jika muncul, sisipkan `source ...;` yang sama di awal setiap perintah berikutnya yang membutuhkan key.
3. Hanya jika key tidak ditemukan di mana pun, siapkan satu TANPA menyunting profil shell secara manual dan TANPA menempelkan key ke dalam chat ini. Minta saya membuat/menyalin key di https://dashboard.exa.ai/api-keys, lalu di terminal saya sendiri saya akan meng-export EXA_API_KEY atau menuliskannya ke ~/.config/exa/key dengan mode 600 — jangan pernah meminta saya menempelkan key ke dalam chat. Setelah itu tunggu konfirmasi dari saya sebelum melanjutkan.
4. Uji cepat key dari shell kamu sendiri — ambil dari variabel lingkungan atau dari file, lalu cetak kode statusnya saja:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   Pertahankan endpoint, header, dan body persis seperti yang tertulis (jangan menebak schema). Hasilnya harus 200, bukan 401/429. Jika pada langkah 2 kamu memerlukan awalan `source ...;` untuk melihat key dari variabel lingkungan, sisipkan juga di sini.
5. Beri tahu saya cara memulai ulang atau memindai ulang agent saya agar skill tersebut terdeteksi.

Aturan mutlak sepanjang proses: key adalah secret. Periksa key hanya lewat pengecekan keberadaan/panjang (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) atau kode status HTTP — jangan pernah mencetak, meng-`echo`, meng-`cat`, atau menjalankan `grep` dengan keluaran pada file atau variabel apa pun yang mungkin memuatnya, dan jangan pernah mencoba "menyensor" file key dengan regex. Jika sebuah key pernah terekspos, minta saya merotasinya di https://dashboard.exa.ai/api-keys.
```

## Lihat sumber {#view-source}

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="Lihat sumber" arrow="true">
  Baca definisi skill exa-contents sebelum memasangnya.
</Card>

## Terkait {#related}

<Columns cols={2}>
  <Card title="Semua agent skill" icon="layers" href="/id/docs/get-started/agent-skills/overview" cta="Jelajahi skill" arrow="true">
    Jelajahi seluruh skill Exa dan instal semuanya sekaligus.
  </Card>

  <Card title="Repositori skill" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Lihat sumber" arrow="true">
    Sumber untuk setiap skill, termasuk file `SKILL.md` mentah.
  </Card>
</Columns>