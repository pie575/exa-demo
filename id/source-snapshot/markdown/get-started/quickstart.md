> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="developer-quickstart">
  # Quickstart developer
</div>

> Dapatkan API key, lalu gunakan Exa dari kode Anda atau dari agent Anda.

<div className="docs-quickstart-section docs-quickstart-auth">
  <div id="1-get-an-api-key">
    ## 1. Dapatkan API key
  </div>

  <Steps>
    <Step title="Kunjungi Exa Dashboard">
      <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
        Buat key di dashboard. Akun baru mendapatkan credits gratis.
      </Card>
    </Step>

    <Step title="Atur key sebagai variabel lingkungan">
      <Tabs>
        <Tab title="macOS/Linux">
          ```bash theme={null}
          export EXA_API_KEY="your-api-key"
          ```
        </Tab>

        <Tab title="Windows">
          ```powershell theme={null}
          setx EXA_API_KEY "your-api-key"
          ```
        </Tab>
      </Tabs>
    </Step>
  </Steps>
</div>

<div className="docs-quickstart-section">
  <div id="2-choose-how-youll-use-exa">
    ## 2. Pilih cara Anda menggunakan Exa
  </div>

  Ada dua cara memakai Exa di aplikasi Anda: memanggil API dari kode Anda sendiri, atau menghubungkan agent yang sudah Anda pakai.

  <Columns cols={2}>
    <Card title="Panggil API" icon="code" href="#3-install-an-sdk" cta="Instal SDK">
      Gunakan Search, Contents, dan Exa Agent dari kode Anda sendiri. Instal SDK
      di bawah ini dan kirim permintaan pertama Anda.
    </Card>

    <Card title="Hubungkan agent Anda" icon="plug" href="/id/docs/get-started/exa-mcp" cta="Siapkan Exa MCP">
      Hubungkan ChatGPT, Claude, Codex, atau Cursor ke tool search dan Research
      milik Exa. Tidak perlu API key.
    </Card>
  </Columns>

  Membangun dengan API? Pilih titik awal Anda:

  | Mulai dengan                            | Gunakan untuk                                                                                             |
  | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
  | [Search](/id/docs/search/quickstart)       | Menemukan halaman web yang relevan &amp; mengembalikan konten tersintesis dalam waktu kurang dari 2 detik |
  | [Deep Search](/id/docs/search/deep-search) | Search berkualitas lebih tinggi, di mana LLM secara iteratif menemukan hasil yang lebih baik              |
  | [Agent](/id/docs/agent/quickstart)         | Research asinkron jangka panjang, list building, enrichment, atau laporan                                 |
  | [Contents](/id/docs/contents/quickstart)   | Mengekstrak konten halaman saat Anda sudah punya URL-nya                                                  |
</div>

<div className="docs-quickstart-section">
  <div id="3-install-an-sdk">
    ## 3. Instal SDK
  </div>

  <CodeGroup>
    ```bash Python theme={null}
    pip install exa-py
    ```

    ```bash JavaScript theme={null}
    npm install exa-js
    ```
  </CodeGroup>
</div>

<div className="docs-quickstart-section">
  <div id="4-make-your-first-request">
    ## 4. Kirim permintaan pertama Anda
  </div>

  <CodeGroup>
    ```python Python theme={null}
    from exa_py import Exa

    exa = Exa()

    results = exa.search(
        "best blog posts about vector databases",
        contents={"highlights": True},
    )

    for result in results.results:
        print(result.title, result.url)
    ```

    ```javascript JavaScript theme={null}
    import Exa from "exa-js";

    const exa = new Exa();

    const { results } = await exa.search(
      "best blog posts about vector databases",
      { contents: { highlights: true } },
    );

    for (const result of results) {
      console.log(result.title, result.url);
    }
    ```

    ```bash cURL theme={null}
    curl -s -X POST "https://api.exa.ai/search" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $EXA_API_KEY" \
      -d '{
        "query": "best blog posts about vector databases",
        "contents": { "highlights": true }
      }'
    ```
  </CodeGroup>

  <div id="next-steps">
    ## Langkah selanjutnya
  </div>

  <Columns cols={2}>
    <Card title="Search API" icon="search" href="/id/docs/search/quickstart" cta="Baca panduan" arrow="true">
      Temukan halaman yang relevan dan dapatkan konten bersih atau structured output.
    </Card>

    <Card title="Agent API" icon="bot" href="/id/docs/agent/quickstart" cta="Baca panduan" arrow="true">
      Bangun workflow Research jangka panjang, list building, dan enrichment.
    </Card>

    <Card title="Contents API" icon="file-text" href="/id/docs/contents/quickstart" cta="Baca panduan" arrow="true">
      Ekstrak konten bersih dari halaman yang sudah Anda ketahui.
    </Card>

    <Card title="Exa MCP" icon="plug" href="/id/docs/get-started/exa-mcp" cta="Baca panduan" arrow="true">
      Hubungkan MCP client mana pun ke web search, pengambilan halaman, dan tool
      Exa Agent milik Exa.
    </Card>
  </Columns>
</div>