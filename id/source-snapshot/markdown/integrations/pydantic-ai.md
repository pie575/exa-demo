> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="pydantic-ai">
  # Pydantic AI
</div>

> Lengkapi agent Pydantic AI dengan tools riset web yang didukung Exa search API.

<Card title="Quickstart Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Baru mengenal Exa? Mulai dalam waktu kurang dari satu menit.
</Card>

***

[Pydantic AI](https://pydantic.dev/docs/ai/) adalah framework agent Python dari tim di balik Pydantic. [Harness](https://pydantic.dev/docs/ai/harness/exa-search/)-nya menyertakan integrasi resmi Exa dalam bentuk dua capability yang dapat dikomposisikan:

* **`ExaSearch`**: tools riset web yang didukung Exa Search API: `web_search` (hasil teratas beserta excerpt paling relevan, ditambah text summary hasil sintesis yang bersifat opsional), `get_page` (retrieval halaman penuh untuk URL tertentu), dan `deep_search` yang bersifat opt-in (jawaban tersintesis beserta sitasi dalam satu call).
* **`ExaAgent`**: mendelegasikan riset berdurasi panjang ke [Exa Agent API](/id/docs/agent/quickstart) sebagai deferred tool call.

Sebuah capability memaketkan tools, budget output per tool, dan panduan riset singkat di dalam system prompt, sehingga Anda tidak perlu lagi menyambungkan search API ke pengambil halaman dan menyusun sendiri prompt agar agent meriset secara metodis.

<Info> Lihat referensi lengkap dari Pydantic [di sini](https://pydantic.dev/docs/ai/harness/exa-search/). </Info>

<Card title="Baca artikel Pydantic tentang membangun Research Agent dengan Exa" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/pydantic-ai/logo.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=aee1bf45859bf6a3debf4177d0aefb3f" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/integrations/pydantic-ai/logo.svg">
  Panduan langkah demi langkah tiga research agent siap salin-tempel yang dibangun di atas Pydantic AI dan Exa.
</Card>

***

<div id="get-started">
  ## Get Started
</div>

<Steps>
  <Step title="Prasyarat dan instalasi">
    Instal harness dengan ekstra Exa dan atur variabel lingkungan `EXA_API_KEY` Anda.

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru langsung mendapat credits gratis.
    </Card>
  </Step>

  <Step title="Tambahkan ExaSearch ke sebuah agent">
    Teruskan `ExaSearch` ke sebuah `Agent` melalui parameter `capabilities`. Secara bawaan, autentikasi diambil dari `EXA_API_KEY`.

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
    | `web_search` | Mencari di web dan mengembalikan `num_results` halaman teratas, masing-masing dengan judul, URL, dan excerpt yang paling relevan. |
    | `get_page`   | Mengambil teks lengkap dari satu URL tertentu — hasil `web_search` yang menjanjikan, atau URL yang diberikan pengguna.            |

    `web_search` mengembalikan excerpt singkat (highlights Exa), bukan teks halaman secara penuh, sehingga menelusuri banyak sumber tetap hemat; agent kemudian membaca halaman pilihannya dengan `get_page`. URL atau pertanyaan yang tidak mengembalikan konten, rate limit, atau kegagalan sementara akan diteruskan ke model sebagai `ModelRetry` agar run bisa pulih; kegagalan autentikasi (401/403) diteruskan sebagai error konfigurasi.
  </Step>

  <Step title="Aktifkan deep search (opsional)">
    `deep_search` menjalankan [deep search](/id/docs/search/quickstart) multi-langkah milik Exa (`type='deep'`): Exa menguraikan pertanyaan menjadi beberapa kueri, melakukan searches, lalu mengembalikan jawaban yang grounded pada citations dalam satu tool call. Cara ini memerlukan lebih banyak waktu dan kedalaman pencarian dibandingkan `web_search`, sehingga secara bawaan dinonaktifkan. Aktifkan secara eksplisit:

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    Jika diaktifkan, instruksi capability akan meminta model memperlakukan `deep_search` sebagai eskalasi dari `web_search`, bukan penggantinya.
  </Step>
</Steps>

***

<div id="configuration">
  ## Konfigurasi
</div>

Setiap field `ExaSearch` beserta nilai defaultnya:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # jumlah hasil per pemanggilan web_search (1 hingga 100)
    max_text_chars=10_000,     # batas teks get_page, dalam karakter (1 hingga 10.000)
    text_summary=False,        # web_search juga mengembalikan text summary hasil sintesis
    include_deep_search=False, # sekaligus menyediakan tool deep_search
    include_domains=[],        # hanya cari di domain ini (daftar izin)
    exclude_domains=[],        # jangan pernah cari di domain ini (daftar larangan)
    guidance=None,             # None = instruksi bawaan, '' = tidak ada, str = kustom
    client=None,               # ExaClient -- None membangun exa_py.AsyncExa dari EXA_API_KEY
)
```

`include_domains` dan `exclude_domains` berlaku untuk `web_search` dan `deep_search`, serta saling eksklusif. Limit di luar rentang maupun pengisian kedua daftar domain sekaligus akan memunculkan error saat konstruksi.

<div id="text-summary">
  ### Text summary
</div>

Atur `text_summary` agar setiap call `web_search` juga meminta summary teks biasa hasil sintesis dari hasilnya. Berikan `True` untuk summary tanpa batasan, atau sebuah string yang mendeskripsikan format yang diinginkan:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

Bentuk nilai kembalian tool tidak berubah: ketika Exa mengembalikan summary, hasilnya disisipkan di awal sebagai baris `Summary:`.

<div id="structured-citations">
  ### Citations terstruktur
</div>

Setiap tool mengembalikan `ToolReturn`: `return_value` berisi teks yang dapat dibaca dan dilihat model (termasuk blok `Sources:`), sedangkan `metadata` berisi sumber dalam bentuk record `ExaSource` terstruktur (`{'url': ..., 'title': ...}`) pada key `'sources'`. Metadata tidak pernah dikirim ke model, jadi untuk menampilkan citations Anda tidak perlu mengurai teks:

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
  ### Client kustom
</div>

Client bawaan adalah `exa_py.AsyncExa`, yang dikonfigurasi dari `EXA_API_KEY`. Berikan objek apa pun yang memenuhi protokol `ExaClient` untuk mengatur autentikasi atau base URL secara eksplisit, atau untuk menggantinya dengan objek tiruan saat pengujian:

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

<div id="exa-agent-runs">
  ## Exa agent runs
</div>

[Exa Agent API](/id/docs/agent/quickstart) menjalankan tugas riset terbuka (open-ended) secara asinkron. Capability `ExaAgent` memetakan siklus hidup tersebut ke [deferred tool calls](https://pydantic.dev/docs/ai/deferred-tools/) milik Pydantic AI: tool `exa_agent` membuat run lalu menundanya, sekaligus membawa ID run Exa dalam metadata deferred call tersebut.

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

Secara default (`execution='inline'`), capability menyelesaikan sendiri call yang ditangguhkan di dalam agent run dengan mem-polling run Exa hingga selesai, sehingga tool berperilaku seperti tool biasa (meski lebih lambat). Dengan `execution='external'`, call tersebut diteruskan ke atas sebagai output `DeferredToolRequests` agar aplikasi host yang menyelesaikannya di luar alur.

Setiap field pada `ExaAgent` beserta nilai defaultnya:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None = default API
    execution='inline',   # 'inline' melakukan poll hingga selesai; 'external' meneruskan DeferredToolRequests ke atas
    output_schema=None,   # kelas BaseModel atau schema dict untuk structured output
    system_prompt=None,   # diteruskan ke Exa agent run
    poll_interval=1000,   # ms antar poll saat penyelesaian secara inline
    timeout_ms=3_600_000, # ms untuk menunggu sebuah run saat penyelesaian secara inline
    guidance=None,        # None = instruksi default, '' = tidak ada, str = kustom
    runs=None,            # ExaAgentRuns -- None membangun AsyncExa().agent.runs dari EXA_API_KEY
)
```

***

<div id="agent-spec-yamljson">
  ## Agent spec (YAML/JSON)
</div>

Kedua capabilities tersebut dapat digunakan dengan [agent spec](https://pydantic.dev/docs/ai/agents/#agent-spec) milik Pydantic AI, sehingga Anda bisa mendeklarasikannya dalam file konfigurasi alih-alih di Python:

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

Berikan `custom_capability_types` agar pemuat spec mengetahui cara menginstansiasi capability tersebut. Instance yang dimuat dari spec selalu membangun client default dari `EXA_API_KEY`.

***

<div id="next">
  ## Selanjutnya
</div>

* [**Search API**](/id/docs/search/quickstart) - Pencarian semantik dengan highlights, summaries, dan deep search
* [**Agent API**](/id/docs/agent/quickstart) - Runs riset asinkron yang bersifat terbuka
* [**Penyiapan MCP**](/id/docs/get-started/exa-mcp) - MCP server yang dihosting Exa
* [**SDK**](/id/docs/sdks/quickstart) - Dokumentasi SDK Python dan JavaScript