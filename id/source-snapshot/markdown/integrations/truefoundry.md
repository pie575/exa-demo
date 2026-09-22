> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# TrueFoundry {#truefoundry}

> Hubungkan Exa ke TrueFoundry MCP Gateway untuk kontrol akses terpusat, manajemen tool, dan pemantauan penggunaan.

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) adalah lapisan proxy berkelas enterprise antara aplikasi Anda dan penyedia LLM atau MCP server. Gateway ini memberikan akses terpadu ke lebih dari 1.000 LLM dengan observabilitas dan tata kelola terpusat.

TrueFoundry menyediakan Exa sebagai remote server resmi di [MCP Gateway](https://www.truefoundry.com/mcp-gateway) miliknya. Hubungkan Exa MCP server agar tim Anda punya satu endpoint terkelola untuk web search, content fetching, dan agentic research.

<Frame caption="Exa dalam katalog remote MCP server resmi TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="The Exa server in TrueFoundry's official remote MCP catalog" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

## Tambahkan Exa ke TrueFoundry {#add-exa-to-truefoundry}

1. Buka **MCP Servers** di sidebar TrueFoundry dan pilih **Add new MCP Server**.
2. Pilih **Connect Official Remote MCP Servers**.

<Frame caption="Pilih katalog remote MCP server resmi">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="Pemilih Add MCP Server di TrueFoundry dengan Connect Official Remote MCP Servers terpilih" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. Cari **Exa** di katalog, lalu pilih **+ Add**.
4. Konfirmasi detail server yang sudah terisi otomatis:

| Field          | Nilai                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Name           | `exa`                                                                                                                      |
| Description    | Search Engine made for AIs by Exa                                                                                          |
| URL            | `https://mcp.exa.ai/mcp`                                                                                                   |
| Authentication | Opsional (MCP Server dapat berjalan tanpa autentikasi. Anda hanya memerlukan Exa API key jika mencapai rate limit gratis.) |

5. Tambahkan pengguna atau Team yang akan mengelola atau menggunakan server tersebut. Biarkan **Auth Data** tetap nonaktif, lalu pilih **Update MCP Server**.

<Frame caption="Konfigurasikan server Exa dan kolaboratornya">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Formulir registrasi Exa MCP server dengan nama, URL, kolaborator, dan pengaturan autentikasinya" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  Buka tab **Tools** dan pastikan tool search, content fetching, dan agentic research dari Exa tersedia.
</Check>

## Konfigurasikan server Exa {#configure-the-exa-server}

URL yang sudah terisi otomatis menyediakan kumpulan tool default dari Exa. Ubah URL tersebut hanya jika Anda perlu membatasi tool yang tersedia atau menggunakan API key Anda sendiri.

### Pilih tool mana yang tersedia {#choose-which-tools-are-available}

Berikan daftar nama tool yang dipisahkan koma pada parameter query `tools`:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

Anda dapat memasukkan URL di formulir server atau menggunakan **Apply using YAML**:

```yaml theme={null}
url: >-
  https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
name: exa
type: mcp-server/remote
description: Search Engine made for AIs by Exa
collaborators:
  - role_id: mcp-server-manager
    subject: user:you@your-company.com
```

<Tip>
  Anda dapat menemukan nama tool yang tersedia di [dokumentasi Exa MCP](/id/docs/get-started/exa-mcp).
</Tip>

### Gunakan Exa API key Anda untuk melampaui rate limit gratis {#use-your-exa-api-key-to-bypass-the-free-rate-limit}

Jika Anda mencapai rate limit gratis, tambahkan Exa API key Anda ke URL server:

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru langsung mendapatkan credits gratis.
</Card>

## Menghubungkan MCP client {#connect-an-mcp-client}

Buka tab **How To Use** pada server Exa, lalu pilih client Anda. TrueFoundry akan menghasilkan endpoint khusus tenant beserta konfigurasi siap tempel untuk Cursor, Claude Code, VS Code, Windsurf, Codex, dan MCP client lainnya.

<Frame caption="Salin konfigurasi untuk MCP client Anda">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="Instruksi penyiapan khusus client dari TrueFoundry untuk Exa MCP server" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

## Menguji tool {#test-a-tool}

Pilih **Try** di samping tool Exa, masukkan input-nya, lalu pilih **Execute Tool**. Playground akan menampilkan response JSON sehingga Anda dapat memverifikasi tool tersebut sebelum menggunakannya dalam agent.

<Frame caption="Menjalankan tool Exa di playground TrueFoundry">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Menguji tool Exa di tool playground TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

## Kelola dan pantau tool {#manage-and-monitor-tools}

* Aktifkan atau nonaktifkan tiap tool untuk mengatur apa saja yang dapat dipanggil oleh MCP client
* Gunakan **Tool Metrics** untuk meninjau trafik, latency, dan error
* Export jejak pemanggilan ke stack observabilitas Anda melalui OpenTelemetry

<Frame caption="Kelola Exa tools yang diekspos ke MCP client">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="Exa tools yang tersedia dari MCP server TrueFoundry" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

## Sumber Daya {#resources}

<Columns cols={3}>
  <Card title="Panduan penyiapan TrueFoundry" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="Buka panduan" arrow="true">
    Baca panduan TrueFoundry mengenai Exa MCP server miliknya.
  </Card>

  <Card title="Dokumentasi Exa MCP" icon="search" href="/id/docs/get-started/exa-mcp" cta="Buka panduan" arrow="true">
    Pelajari tool, konfigurasi, dan contoh penggunaan Exa.
  </Card>

  <Card title="Exa MCP Server" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="Lihat sumber" arrow="true">
    Lihat kode sumber server dan daftar rilisnya di GitHub.
  </Card>
</Columns>