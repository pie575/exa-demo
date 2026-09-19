> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-mcp">
  # Exa MCP
</div>

> Hubungkan ChatGPT, Codex, Claude, Grok, Cursor, dan klien MCP lainnya ke tool web search, pengambilan halaman, Exa Agent, dan Exa Connect dari Exa.

Gunakan Exa MCP untuk menyempurnakan web search bawaan di ChatGPT, Claude, dan tool yang kompatibel dengan MCP dengan kemampuan search milik Exa, termasuk web search, pencarian kode, [Exa Agent](/id/docs/agent/quickstart), dan [Exa Connect](/id/docs/agent/connect/overview).

Exa menyediakan server terkelola yang dapat digunakan di klien MCP mana pun:

```text theme={null}
https://mcp.exa.ai/mcp
```

Tidak diperlukan API key untuk memulai. Exa MCP bersifat open source dan tersedia di [GitHub](https://github.com/exa-labs/exa-mcp-server).

<div id="install">
  ## Instalasi
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT & Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa adalah plugin resmi di direktori plugin OpenAI, yang mencakup MCP server terkelola beserta skill `search` dan `exa-agent` milik Exa.

      <Steps>
        <Step title="Buka plugin">
          Kunjungi [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app). Tautan tersebut membuka **Exa** di direktori plugin OpenAI, yaitu direktori yang sama untuk ChatGPT maupun Codex.
        </Step>

        <Step title="Pasang plugin">
          Klik tombol plus untuk memasang. Masuk ke Exa saat diminta, baik saat pemasangan maupun saat Codex atau ChatGPT pertama kali menggunakannya.

          <Frame caption="Membuka Plugins di Codex, menambahkan Exa, dan memberikan otorisasi akses">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Membuka Plugins di Codex, melihat plugin Exa, dan memberikan otorisasi akses" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="Mulai sesi baru">
          Skill hanya dimuat pada chat dan sesi CLI yang dimulai setelah pemasangan, jadi buka sesi baru lalu ajukan permintaan yang membutuhkan akses web.
        </Step>
      </Steps>

      Selesai. Plugin ini sudah mencakup integrasi MCP sekaligus skill Exa, jadi tidak perlu menyiapkan MCP atau skill secara terpisah.

      Lihat [Exa di Codex dan ChatGPT](/id/docs/integrations/chatgpt-codex) untuk panduan penyiapan dan workflow selengkapnya.
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <div id="claude-code-cli">
        ### Claude Code CLI
      </div>

      <Steps>
        <Step title="Pasang plugin">
          Pasang Exa dari terminal:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Anda juga bisa mengetik `/plugin` di Claude Code, cari **Exa**, lalu pasang.
        </Step>

        <Step title="Gunakan Exa">
          Mulai sesi Claude Code baru dan ajukan permintaan yang memerlukan akses ke web.
        </Step>
      </Steps>

      <div id="desktop-web-cowork">
        ### Desktop, Web &amp; Cowork
      </div>

      Claude Desktop, Web, dan Cowork sama-sama menggunakan konektor resmi Exa.

      <Steps>
        <Step title="Buka direktori konektor">
          Pilih tombol plus di obrolan baru, pilih **Add connector**, lalu cari **Exa**.
        </Step>

        <Step title="Hubungkan Exa">
          Buka Exa, pilih **Connect to Claude**, lalu izinkan akses saat diminta.

          <Frame caption="Membuka direktori konektor di Claude, menemukan Exa, menghubungkannya, dan mengizinkan akses">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Membuka direktori konektor di Claude, menemukan Exa, menghubungkannya, dan mengizinkan akses" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Gunakan Exa">
          Mulai obrolan baru dan ajukan permintaan yang memerlukan informasi terkini dari web.
        </Step>
      </Steps>

      Lihat [Exa di Claude Code, Web, dan Desktop](/id/docs/integrations/claude-web-desktop) untuk panduan lengkap penyiapan dan workflow.

      Sebagai alternatif, admin Claude Team dan Enterprise dapat menyediakan konektor untuk seluruh anggota melalui identity provider mereka: lihat [Enterprise Managed Auth](/id/docs/admin/mcp-enterprise-managed-auth).
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa tersedia di marketplace [Grok Build](https://docs.x.ai/build/overview).

      <Steps>
        <Step title="Buka marketplace">
          Di Grok Build, jalankan `/marketplace`.
        </Step>

        <Step title="Instal Exa">
          Cari **exa** pada daftar, lalu tekan `i`.
        </Step>

        <Step title="Masuk">
          Jalankan `/mcp`, pilih **exa**, lalu tekan `i` untuk masuk ke akun Exa Anda melalui browser.
        </Step>
      </Steps>

      Akun baru mendapatkan credits gratis saat mendaftar.
    </Tab>

    <Tab title="Cursor" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      Instal Exa MCP dari [marketplace Cursor](https://cursor.com/marketplace/exa), atau tambahkan ke `~/.cursor/mcp.json`:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="VS Code" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/vscode.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9828a7b963d47467df217a38c716fea2" width="24" height="24" data-path="images/mcp-clients/vscode.svg">
      Gunakan [instalasi sekali klik](https://vscode.dev/redirect/mcp/install?name=exa\&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D), atau tambahkan ke `.vscode/mcp.json` di proyek Anda:

      ```json theme={null}
      {
        "servers": {
          "exa": {
            "type": "http",
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="Klien lainnya" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/other-clients.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=187e423022b8fc3ed950a967a10ff700" width="24" height="24" data-path="images/mcp-clients/other-clients.svg">
      Sebagian besar klien menggunakan format `mcpServers` standar:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```

      Lokasi berkas konfigurasi dan nama key URL berbeda-beda tergantung client:

      | Client                                       | Tempat menambahkannya                                                                             | Key URL                    |
      | -------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------- |
      | [fx by Vercel](/id/docs/integrations/vercel/fx) | `/mcp add --transport http exa https://mcp.exa.ai/mcp` di shell fx (disimpan ke `~/.fx/mcp.json`) | `url`                      |
      | OpenCode                                     | `opencode.json` (di bawah `mcp`, dengan `"type": "remote"`)                                       | `url`                      |
      | Kiro                                         | `~/.kiro/settings/mcp.json` (di bawah `mcpServers`)                                               | `url`                      |
      | Windsurf                                     | `~/.codeium/windsurf/mcp_config.json` (di bawah `mcpServers`)                                     | `serverUrl`                |
      | Google Antigravity                           | Panel Agent → Manage MCP Servers → View Raw config (di bawah `mcpServers`)                        | `serverUrl`                |
      | Zed                                          | `settings.json` Zed (di bawah `context_servers`)                                                  | `url`                      |
      | Gemini CLI                                   | `~/.gemini/settings.json` (di bawah `mcpServers`)                                                 | `httpUrl`                  |
      | Warp                                         | Settings → MCP Servers → Add MCP Server (`exa` di tingkat teratas)                                | `url`                      |
      | v0 by Vercel                                 | Prompt Tools → Add MCP                                                                            | tempel URL secara langsung |

      Jika client Anda tidak mendukung MCP server jarak jauh, gunakan bridge `mcp-remote`:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
          }
        }
      }
      ```

      Atau jalankan [package npm](https://www.npmjs.com/package/exa-mcp-server) lokal dengan [Exa API key](https://dashboard.exa.ai/api-keys) Anda:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "exa-mcp-server"],
            "env": {
              "EXA_API_KEY": "your_api_key"
            }
          }
        }
      }
      ```
    </Tab>
  </Tabs>
</div>

<div id="authentication">
  ## Autentikasi
</div>

Exa MCP mendukung tiga mode autentikasi:

| Mode        | Gunakan untuk                                                      | Penyiapan                                                                                                               |
| ----------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Tanpa kunci | Penggunaan gratis dengan batas laju tanpa perlu masuk atau API key | Hubungkan ke `https://mcp.exa.ai/mcp`                                                                                   |
| OAuth       | Klien interaktif, pemasangan dari marketplace, penggunaan produksi | Hubungkan ke `https://mcp.exa.ai/mcp?login` untuk masuk ke Exa melalui browser. Penggunaan tercatat pada Team Exa Anda. |
| API key     | Klien tanpa MCP OAuth                                              | Hubungkan ke `https://mcp.exa.ai/mcp` dengan header `x-api-key` yang diisi API key Anda                                 |

<div id="sign-in-with-oauth">
  ### Masuk dengan OAuth
</div>

ChatGPT, Claude, dan instalasi marketplace lainnya akan meminta Anda masuk saat diperlukan. Pada klien mana pun yang mendukung MCP OAuth, Anda dapat memicu alur yang sama dengan terhubung ke:

```text theme={null}
https://mcp.exa.ai/mcp?login
```

Klien Anda menemukan server otorisasi Exa, membuka halaman masuk di browser, dan mengelola akses.

<div id="use-an-api-key">
  ### Gunakan API key
</div>

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru mendapatkan credits gratis.
</Card>

Tambahkan header `x-api-key` ke konfigurasi MCP server:

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

<div id="available-tools">
  ## Tool yang Tersedia
</div>

| Tool                      | Ketersediaan                       | Digunakan untuk                                                                       |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
| `web_search_exa`          | Aktif secara bawaan                | Mencari di web dan mengembalikan konten relevan yang siap pakai                       |
| `web_fetch_exa`           | Aktif secara bawaan                | Membaca konten bersih dari satu atau beberapa URL yang sudah diketahui                |
| `web_search_advanced_exa` | Tersedia jika diaktifkan           | Mengonfigurasi web search dengan filter dan kontrol lanjutan                          |
| `agent_run`               | Tersedia dengan OAuth atau API key | Menjalankan riset multi-langkah, penyusunan daftar, enrichment, dan structured output |

Gunakan parameter URL `tools` untuk menentukan tool mana saja yang terlihat oleh klien Anda. Misalnya, untuk mengaktifkan semua tool:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  Daftar `tools` yang eksplisit akan menggantikan nilai default, jadi sertakan semua tool yang ingin Anda aktifkan, termasuk web search dan fetch.
</Tip>

<div id="exa-agent">
  ## Exa Agent
</div>

Gunakan [Exa Agent](/id/docs/agent/quickstart) untuk riset yang memerlukan lebih dari satu search—misalnya, menyusun daftar, mengevaluasi setiap item berdasarkan criteria, atau menghasilkan hasil terstruktur.

Agent run bersifat berbasis usage, sehingga `agent_run` memerlukan OAuth atau API key. URL ini memulai OAuth dan menambahkan Agent bersama tool bawaan:

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

Jika Anda menggunakan API key, hilangkan `login` dan tambahkan key seperti dijelaskan di [Autentikasi](#authentication).

<Steps>
  <Step title="Jelaskan apa yang Anda butuhkan">
    Mintalah riset dengan bahasa sehari-hari. Asisten Anda meneruskan permintaan tersebut ke `agent_run` beserta sebuah `query`, lalu Exa Agent menentukan apa yang perlu dicari, membaca sumber-sumbernya, dan mencocokkan temuannya dengan permintaan Anda.

    Minta Agent menyediakan `outputSchema` hanya jika aplikasi Anda membutuhkan temuan dalam format JSON yang konsisten. Anda dapat memberikannya kepada asisten melalui system prompt, atau meminta asisten membuatkannya untuk Anda.
  </Step>

  <Step title="Dapatkan hasilnya">
    Ketika riset selesai, tool call menyerahkan paket riset lengkap kepada asisten Anda:

    * Temuan tertulis
    * Sumber yang mendasarinya
    * JSON tervalidasi jika Anda menyediakan `outputSchema`
    * Usage dan cost

    Asisten Anda menyusun balasannya dari paket ini, jadi beri tahu apa yang ingin Anda lakukan dengan output tersebut. Anda bisa memintanya merangkum temuan, membandingkannya, menyimpannya ke sebuah file, atau hal lain sesuai kebutuhan.
  </Step>

  <Step title="Lanjutkan jika butuh waktu lebih">
    Riset yang berlangsung lebih lama dari satu panggilan MCP tidak akan gagal: tool melaporkan `status: "running"` beserta sebuah `id` selagi run terus berjalan di Exa. Asisten Anda cukup memanggil `agent_run` lagi dengan `id` tersebut sebagai `runId` untuk melanjutkan run yang sama.
  </Step>
</Steps>

<Accordion title="Kontrol opsional" icon="sliders-horizontal">
  | Field             | Gunakan untuk                                                                |
  | ----------------- | ---------------------------------------------------------------------------- |
  | `systemPrompt`    | Memberi Agent panduan tambahan untuk meneliti atau menilai hasil             |
  | `outputSchema`    | Mengembalikan jawaban dalam format JSON tertentu                             |
  | `input.data`      | Meng-enrich baris atau entitas yang sudah Anda miliki                        |
  | `input.exclusion` | Melewati hasil yang sudah Anda ketahui                                       |
  | `dataSources`     | Menambahkan hingga lima provider [Exa Connect](/id/docs/agent/connect/overview) |
  | `previousRunId`   | Menyusun permintaan baru berdasarkan riset yang sudah selesai                |
  | `effort`          | Memilih seberapa dalam riset yang harus dilakukan Agent                      |
</Accordion>

<Tip>
  Gunakan `runId` untuk terus menunggu pekerjaan yang sedang berjalan. Gunakan `previousRunId` untuk mengajukan pertanyaan lanjutan baru berdasarkan pekerjaan yang telah selesai.
</Tip>

Lihat [panduan Exa Agent](/id/docs/agent/quickstart) untuk pola output schema, mode effort, sumber data, dan harga.

<div id="advanced-search">
  ## Advanced search
</div>

Gunakan `web_search_advanced_exa` ketika permintaan memerlukan filter kategori atau domain secara eksplisit, rentang tanggal, batasan teks, penargetan geografis, perluasan query, summaries, highlights, kontrol freshness, atau perayapan subhalaman. Untuk search biasa, tetap gunakan `web_search_exa`; tool ini memberi model permukaan tool yang lebih kecil dan membutuhkan lebih sedikit konfigurasi.

Advanced Search tidak memerlukan autentikasi, meskipun koneksi yang terautentikasi menggunakan paket dan rate limits Anda sendiri. Aktifkan bersama tool bawaan dengan:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

Tool MCP menyajikan kontrol [Search API](/id/docs/reference/search) yang umum sebagai field yang mudah digunakan tool, seperti `includeDomains`, `startPublishedDate`, `enableHighlights`, dan `maxAgeHours`. Baca schema tool di klien Anda untuk mengetahui nama field yang tepat.

<div id="troubleshooting">
  ## Pemecahan Masalah
</div>

<AccordionGroup>
  <Accordion title="Error rate limit (429)">
    Koneksi ini menggunakan rate limit gratis dari Exa. Masuk dengan OAuth atau tambahkan API key Anda sendiri, lalu sambungkan ulang agar permintaan mengikuti paket dan limit team Anda.

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Accordion>

  <Accordion title="Agent tidak muncul atau meminta autentikasi">
    `agent_run` tidak aktif secara default dan tidak dapat menggunakan rate limit gratis. Tambahkan ke parameter URL `tools`, lalu sambungkan dengan `?login` atau konfigurasikan API key. Lihat [Exa Agent](#exa-agent) untuk URL lengkapnya.
  </Accordion>

  <Accordion title="Proses masuk OAuth tidak terbuka">
    Pastikan klien Anda mendukung MCP OAuth dan sambungkan ke `https://mcp.exa.ai/mcp?login`. Mulai ulang klien setelah mengubah URL. Jika klien tidak dapat menyelesaikan MCP OAuth, gunakan API key sebagai gantinya.
  </Accordion>

  <Accordion title="Tools tidak muncul">
    Parameter `tools` yang eksplisit akan menggantikan daftar tool default. Pastikan setiap tool yang Anda inginkan tercantum di URL, lalu mulai ulang klien MCP Anda agar daftar tool diambil ulang.
  </Accordion>

  <Accordion title="Claude desktop tidak tersambung">
    Gunakan konektor bawaan: pilih **+** (atau **Add connectors**) → tab **Connectors** → cari **Exa** → pilih **+**.
  </Accordion>

  <Accordion title="Berkas konfigurasi tidak ditemukan">
    Lokasi konfigurasi yang umum:

    * Cursor: `~/.cursor/mcp.json`
    * fx: `~/.fx/mcp.json`
    * VS Code: `.vscode/mcp.json` (di root proyek)
    * Claude desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
    * Claude desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Sumber daya
</div>

<Columns cols={2}>
  <Card title="GitHub" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Lihat sumber" arrow="true">
    Kode sumber Exa MCP.
  </Card>

  <Card title="npm" icon="package" href="https://www.npmjs.com/package/exa-mcp-server" cta="Buka package" arrow="true">
    Jalankan Exa MCP secara lokal dengan package npm.
  </Card>

  <Card title="Agent skill" icon="wrench" href="/id/docs/get-started/agent-skills/overview" cta="Jelajahi skill" arrow="true">
    Skill portabel yang cocok dipadukan dengan Exa MCP.
  </Card>

  <Card title="Exa di Codex dan ChatGPT" icon="messages-square" href="/id/docs/integrations/chatgpt-codex" cta="Buka panduan" arrow="true">
    Panduan lengkap penyiapan dan workflow untuk plugin Exa.
  </Card>
</Columns>