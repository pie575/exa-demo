> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="fx-by-vercel-labs">
  # fx by Vercel Labs
</div>

> Tambahkan Exa web search ke fx, coding agent native dari Vercel Labs, dengan Exa MCP server yang dihosting.

[fx](https://fx.sh) adalah coding agent native sekaligus CLI dari Vercel Labs, dan juga sebuah MCP client. Tambahkan Exa MCP server yang dihosting untuk membekalinya dengan web search real-time dan kemampuan membaca halaman.

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/vercel/fx/install-exa.gif?s=2e331148abdf5bdf083e6f651e3b8b75" alt="Menginstal fx, menambahkan Exa MCP server dengan /mcp add, dan menjalankan Exa web search secara langsung" style={{width: "100%", height: "auto"}} width="800" height="393" data-path="images/integrations/vercel/fx/install-exa.gif" />
</Frame>

<div id="installation">
  ## Instalasi
</div>

<Steps>
  <Step title="Instal fx">
    ```bash theme={null}
    curl -fsSL https://fx.sh/setup.sh | bash
    ```

    Setelah itu, masuk dengan `fx login`. Lihat [dokumentasi fx](https://fx.sh/docs) untuk opsi provider.
  </Step>

  <Step title="Tambahkan Exa">
    Jalankan fx dengan perintah `fx`, lalu tambahkan Exa MCP server dari shell interaktif:

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    fx akan menyimpan server ke `~/.fx/mcp.json` dan memuat ulang MCP.
  </Step>

  <Step title="Verifikasi koneksi">
    ```text theme={null}
    /mcp list
    ```
  </Step>
</Steps>

<div id="configure-by-hand">
  ## Konfigurasi secara manual
</div>

fx hanya membaca MCP server dari `~/.fx/mcp.json`, jadi Anda juga bisa langsung menambahkan Exa di sana:

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

Jalankan `/mcp reload` untuk menerapkan perubahan tanpa memulai ulang fx.

Paket gratis sudah cukup untuk penggunaan ringan. Untuk menaikkan rate limit, buat API key dan tambahkan ke config:

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru mendapatkan credits gratis.
</Card>

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp",
      "header_env": {
        "x-api-key": "EXA_API_KEY"
      }
    }
  }
}
```

`header_env` memetakan nama header ke sebuah variabel lingkungan, sehingga key tidak perlu disimpan di dalam file config.

<div id="tool-discovery">
  ## Tool discovery
</div>

fx menemukan tool MCP secara lazy: tool dari server tidak masuk ke konteks model sampai ada turn yang membutuhkannya, sehingga menambahkan Exa tidak menimbulkan biaya pada turn yang tidak melakukan search di web.

<Card title="Exa MCP" icon="plug" href="/id/docs/get-started/exa-mcp" cta="Buka panduan" arrow="true">
  Tinjau tool yang tersedia, opsi konfigurasi, dan client lainnya.
</Card>