> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="agent-skills">
  # Agent Skills
</div>

> Instal skill Exa di Claude Code, Codex, dan coding agent lainnya.

Skill Exa mengajarkan coding agent cara melakukan search, mengambil konten, dan membangun dengan API Exa. Temukan semuanya di repository open-source [exa-labs/agent-skills](https://github.com/exa-labs/agent-skills).

Setiap skill berisi file markdown yang mengikuti standar terbuka [Agent Skills](https://agentskills.io), sehingga file yang sama bisa diinstal ke agent mana pun yang kompatibel.

<div id="install">
  ## Instalasi
</div>

Instal semua skill Exa sekaligus:

```bash theme={null}
npx skills add exa-labs/agent-skills
```

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru langsung mendapatkan credits gratis.
</Card>

<Note>
  Simpan key Anda sebagai `EXA_API_KEY` di lingkungan agent Anda.
</Note>

Atau buka salah satu halaman skill di bawah ini dan salin setup prompt-nya ke agent Anda. Prompt tersebut akan memasang skill tersebut dan memverifikasi API key Anda tanpa menampilkannya.

<div id="skills">
  ## Skill
</div>

Setiap halaman skill berisi deskripsi satu baris, setup prompt yang bisa disalin, dan tautan ke sumber mentah `SKILL.md`.

<Columns cols={3}>
  <Card title="Build with Exa" icon="rocket" href="/id/docs/get-started/agent-skills/build-with-exa" cta="Buka skill" arrow="true">
    Bangun aplikasi dan agent dengan platform API lengkap dari Exa.
  </Card>

  <Card title="Exa Search" icon="search" href="/id/docs/get-started/agent-skills/exa-search" cta="Buka skill" arrow="true">
    Panggil Exa Search secara langsung dengan cURL atau raw HTTP.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/id/docs/get-started/agent-skills/exa-contents" cta="Buka skill" arrow="true">
    Panggil Exa Contents secara langsung dengan cURL atau raw HTTP.
  </Card>
</Columns>

<div id="related">
  ## Terkait
</div>

<Columns cols={2}>
  <Card title="Repository skill" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="View source" arrow="true">
    Sumber untuk setiap skill, termasuk berkas `SKILL.md` mentah.
  </Card>

  <Card title="Exa MCP" icon="plug" href="/id/docs/get-started/exa-mcp" cta="Buka panduan" arrow="true">
    Hubungkan Claude, Cursor, VS Code, dan klien lainnya ke Exa melalui MCP.
  </Card>
</Columns>