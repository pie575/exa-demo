> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="pydantic-ai">
  # Pydantic AI
</div>

> Lengkapi agent Pydantic AI dengan tool Research web yang didukung Exa search API.

<Card title="Quickstart Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Baru mengenal Exa? Memulai dalam waktu kurang dari satu menit.
</Card>

***

[Pydantic AI](https://pydantic.dev/docs/ai/) adalah framework agent Python dari tim di balik Pydantic. [Harness](https://pydantic.dev/docs/ai/harness/exa-search/)-nya menyertakan integrasi Exa resmi dalam bentuk dua capability yang dapat dikomposisikan:

* **`ExaSearch`**: tool Research web yang didukung Exa Search API: `web_search` (hasil teratas beserta kutipan paling relevan, ditambah ringkasan teks hasil sintesis yang bersifat opsional), `get_page` (retrieval satu halaman penuh untuk URL tertentu), dan `deep_search` yang bersifat opt-in (jawaban hasil sintesis lengkap dengan sitasi dalam satu panggilan).
* **`ExaAgent`**: mendelegasikan Research jangka panjang ke [Exa Agent API](/id/docs/agent/quickstart) sebagai deferred tool calls.

Sebuah capability menggabungkan tool, anggaran output per tool, dan instruksi Research singkat di dalam system prompt, sehingga Anda tidak perlu lagi menyambungkan search API ke pengambil halaman dan menyusun sendiri prompt agar agent melakukan Research secara metodis.

<Info> Lihat referensi lengkap dari Pydantic [di sini](https://pydantic.dev/docs/ai/harness/exa-search/). </Info>

<Card title="Baca artikel Pydantic tentang membangun Research Agent dengan Exa" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/pydantic-ai/logo.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=aee1bf45859bf6a3debf4177d0aefb3f" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/integrations/pydantic-ai/logo.svg">
  Panduan langkah demi langkah untuk tiga Research agent siap salin-tempel yang dibangun di atas Pydantic AI dan Exa.
</Card>

***

<div id="get-started">
  ## Memulai
</div>

<Steps>
  <Step title="Prasyarat dan instalasi">
    Instal harness dengan extra Exa dan atur variabel lingkungan `EXA_API_KEY` Anda.

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Tambahkan ExaSearch ke sebuah agent">
    Berikan `ExaSearch` ke sebuah `Agent` melalui parameter `capabilities`. Autentikasi diambil dari `EXA_API_KEY` secara default.

    ```Python Python theme={null}
    from pydantic_ai import Agent
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch()])

    result = agent.run_sync('What changed in the latest stable Python release?')
    print(result.output)
    ```

    `ExaSearch` menambahkan dua tool ke agent:

    | Tool         | Tujuan                                                                                                                            |
    | ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
    | `web_search` | Mencari di web dan mengembalikan `num_results` halaman teratas, masing-masing dengan judul, URL, dan kutipan yang paling relevan. |
    | `get_page`   | Mengambil teks penuh dari satu URL tertentu — hasil `web_search` yang menjanjikan, atau URL yang diberikan pengguna.              |

    `web_search` mengembalikan kutipan singkat (Exa kutipan), bukan teks penuh halaman, sehingga menyisir beberapa sources tetap murah; agent lalu membaca halaman pilihan dengan `get_page`. URL atau pertanyaan yang tidak mengembalikan konten, rate limit, atau kegagalan sementara akan tampil ke model sebagai `ModelRetry` sehingga run bisa pulih; kegagalan autentikasi (401/403) diteruskan sebagai kesalahan konfigurasi.
  </Step>

  <Step title="Aktifkan deep search (opsional)">
    `deep_search` menjalankan [deep search](/id/docs/search/quickstart) multi-langkah milik Exa (`type='deep'`): Exa memperluas pertanyaan menjadi beberapa kueri, melakukan pencarian, dan mengembalikan jawaban yang didukung sitasi dalam satu tool call. Cara ini menghabiskan lebih banyak waktu dan kedalaman pencarian dibandingkan `web_search`, sehingga secara default dinonaktifkan. Aktifkan secara eksplisit:

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    Jika diaktifkan, instruksi capability akan meminta model memperlakukan `deep_search` sebagai eskalasi dari `web_search`, bukan sebagai penggantinya.
  </Step>
</Steps>

***

<div id="configuration">
  ## Konfigurasi
</div>

Setiap field pada `ExaSearch` beserta nilai default-nya:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # jumlah hasil per pemanggilan web_search (1 sampai 100)
    max_text_chars=10_000,     # batas teks get_page, dalam karakter (1 sampai 10.000)
    text_summary=False,        # web_search juga mengembalikan ringkasan teks hasil sintesis
    include_deep_search=False, # sekaligus menyediakan tool deep_search
    include_domains=[],        # hanya cari pada domain ini (daftar izin)
    exclude_domains=[],        # jangan pernah cari pada domain ini (daftar larangan)
    guidance=None,             # None = instruksi default, '' = tanpa instruksi, str = kustom
    client=None,               # ExaClient -- None membangun exa_py.AsyncExa dari EXA_API_KEY
)
```

`include_domains` dan `exclude_domains` berlaku untuk `web_search` dan `deep_search`, serta bersifat saling eksklusif. Batas di luar rentang dan pengisian kedua daftar domain sekaligus akan memunculkan error saat konstruksi.

<div id="text-summary">
  ### Ringkasan teks
</div>

Atur `text_summary` agar setiap pemanggilan `web_search` juga meminta ringkasan teks biasa hasil sintesis dari hasil pencarian. Berikan `True` untuk ringkasan tanpa batasan, atau string yang mendeskripsikan format yang diinginkan:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

Bentuk nilai kembalian tool tidak berubah: ketika Exa mengembalikan ringkasan, ringkasan itu disisipkan di awal sebagai baris `Summary:`.

<div id="structured-citations">
  ### Sitasi terstruktur
</div>

Setiap tool mengembalikan `ToolReturn`: `return_value` berisi teks terbaca yang dilihat model (termasuk blok `Sources:`), sedangkan `metadata` berisi sources sebagai catatan `ExaSource` terstruktur (`{'url': ..., 'title': ...}`) di bawah key `'sources'`. Metadata tidak pernah dikirim ke model, sehingga penampilan sitasi tidak memerlukan penguraian teks:

```Python Python theme={null}
from pydantic_ai.messages import ModelRequest, ToolReturnPart

for message in result.all_messages():
    if isinstance(message, ModelRequest):
        for part in message.parts:
            if isinstance(part, ToolReturnPart) and part.metadata is not None:
                for source in part.metadata.get('sources', []):
                    print(source['url'], source['title'])
```

<div id="custom-client">
  ### Custom client
</div>

Client default adalah `exa_py.AsyncExa`, yang dikonfigurasi dari `EXA_API_KEY`. Berikan objek apa pun yang memenuhi protokol `ExaClient` untuk mengatur autentikasi atau base URL secara eksplisit, atau untuk menggantinya dengan objek tiruan dalam pengujian:

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

<div id="exa-agent-runs">
  ## Exa agent runs
</div>

[Exa Agent API](/id/docs/agent/quickstart) menjalankan tugas research terbuka secara asinkron. Capability `ExaAgent` memetakan siklus hidup tersebut ke [deferred tool calls](https://pydantic.dev/docs/ai/deferred-tools/) milik Pydantic AI: tool `exa_agent` membuat run lalu menundanya, sambil membawa ID run Exa di dalam metadata deferred call tersebut.

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

Secara default (`execution='inline'`), capability menyelesaikan sendiri deferred call miliknya di dalam agent run dengan melakukan polling ke Exa run hingga selesai, sehingga tool berperilaku seperti tool biasa (meski lambat). Dengan `execution='external'`, call tersebut diteruskan ke atas sebagai output `DeferredToolRequests` agar aplikasi host yang menyelesaikannya di luar alur.

Setiap field pada `ExaAgent` beserta nilai defaultnya:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None = default API
    execution='inline',   # 'inline' melakukan polling hingga selesai; 'external' meneruskan DeferredToolRequests ke atas
    output_schema=None,   # kelas BaseModel atau schema dict untuk output terstruktur
    system_prompt=None,   # diteruskan ke agent run Exa
    poll_interval=1000,   # ms antar polling saat diselesaikan secara inline
    timeout_ms=3_600_000, # ms untuk menunggu sebuah run saat diselesaikan secara inline
    guidance=None,        # None = instruksi default, '' = tanpa instruksi, str = kustom
    runs=None,            # ExaAgentRuns -- None membangun AsyncExa().agent.runs dari EXA_API_KEY
)
```

***

<div id="agent-spec-yamljson">
  ## Agent spec (YAML/JSON)
</div>

Kedua capabilities tersebut dapat digunakan dengan [agent spec](https://pydantic.dev/docs/ai/agents/#agent-spec) dari Pydantic AI, sehingga Anda bisa mendeklarasikannya di file konfigurasi alih-alih di Python:

```yaml agent.yaml theme={null}
model: anthropic:claude-sonnet-4-6
capabilities:
  - ExaSearch:
      num_results: 3
      include_deep_search: true
  - ExaAgent:
      effort: low
```

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent, ExaSearch

agent = Agent.from_file('agent.yaml', custom_capability_types=[ExaSearch, ExaAgent])
```

Berikan `custom_capability_types` agar loader spec mengetahui cara menginstansiasi capabilities tersebut. Instance yang dimuat dari spec selalu membangun client default dari `EXA_API_KEY`.

***

<div id="next">
  ## Selanjutnya
</div>

* [**Search API**](/id/docs/search/quickstart) - Pencarian semantik dengan kutipan, ringkasan, dan deep search
* [**Agent API**](/id/docs/agent/quickstart) - Research runs asinkron yang bersifat terbuka
* [**Penyiapan MCP**](/id/docs/get-started/exa-mcp) - MCP server yang dihosting oleh Exa
* [**SDK**](/id/docs/sdks/quickstart) - Dokumentasi SDK Python dan JavaScript