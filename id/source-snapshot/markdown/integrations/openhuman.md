> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="openhuman">
  # OpenHuman
</div>

> Berikan agent OpenHuman kemampuan web search real-time dengan Exa, baik secara terkelola maupun dengan Exa API key Anda sendiri.

[OpenHuman](https://tinyhumans.gitbook.io/openhuman) dari TinyHumans adalah asisten AI desktop dengan tool web search bawaan yang dipanggil sendiri oleh agent. Exa adalah penyedia search di balik tool tersebut.

| Pendekatan            | Penyiapan             | Berjalan di                                                              |
| --------------------- | --------------------- | ------------------------------------------------------------------------ |
| **OpenHuman Managed** | Tidak ada             | Backend OpenHuman, didukung oleh Exa. Tanpa API key.                     |
| **Exa provider**      | Tempelkan Exa API key | Mesin Anda, langsung ke `https://api.exa.ai` pada akun Exa Anda sendiri. |

<div id="openhuman-managed">
  ## OpenHuman Managed
</div>

Managed search adalah opsi default. Pilih **Simple** saat onboarding, dan agent dapat langsung melakukan search di web.

<Frame caption="Pilih Simple saat onboarding untuk managed search berbasis Exa">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="OpenHuman onboarding asking how to run OpenHuman, with the Simple option selected" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **Managed adalah cara tercepat untuk mendapatkan hasil Exa.** Tidak ada key yang perlu dibuat, disimpan, atau dirotasi, tidak ada credential yang tersimpan di mesin Anda, dan search ditagihkan melalui langganan OpenHuman Anda.
</Tip>

<div id="exa-provider">
  ## Exa provider
</div>

Konfigurasikan Exa secara langsung agar search dijalankan di akun Exa Anda sendiri dan agent mendapatkan tool search serta page-contents dari Exa.

<div id="get-your-exa-api-key">
  ### Dapatkan Exa API key Anda
</div>

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru langsung mendapatkan credits gratis.
</Card>

<div id="add-exa-in-openhuman">
  ### Menambahkan Exa di OpenHuman
</div>

1. Buka **Connections**, lalu pilih **Search engine** pada bagian **API keys**.

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="Halaman Connections OpenHuman dengan Search engine terpilih pada bagian API keys, menampilkan daftar mesin pencari dengan OpenHuman Managed aktif" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. Pilih **Exa**.

<Frame caption="Exa terpilih, menunggu key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="Opsi engine Exa terpilih di panel Search engine OpenHuman, menampilkan badge Needs API key" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. Tempelkan key Anda ke **Exa API key** lalu pilih **Save**.

<Frame caption="Simpan Exa API key">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="Field Exa API key di OpenHuman dengan key yang sudah dimasukkan dan tombol Save terlihat" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="Exa dikonfigurasi sebagai mesin pencari aktif">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="Panel Search engine OpenHuman dengan Exa terpilih dan ditandai Configured" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

<div id="configuration">
  ### Konfigurasi
</div>

Panel ini menulis ke `config.toml` milik OpenHuman. Sebagai alternatif, atur nilai yang sama langsung di file tersebut atau melalui environment:

<Tabs>
  <Tab title="config.toml">
    ```toml config.toml theme={null}
    [search]
    engine = "exa"        # wajib
    max_results = 5       # opsional, 1-20
    timeout_secs = 15     # opsional

    [search.exa]
    api_key = "your-exa-api-key"   # wajib
    ```
  </Tab>

  <Tab title="Environment">
    ```bash theme={null}
    OPENHUMAN_SEARCH_ENGINE=exa
    EXA_API_KEY=your-exa-api-key
    ```

    <Note>
      `EXA_API_KEY` dan `OPENHUMAN_EXA_API_KEY` sama-sama menimpa `search.exa.api_key`. Jika keduanya diatur, `OPENHUMAN_EXA_API_KEY` yang diutamakan.
    </Note>
  </Tab>
</Tabs>

<div id="tools-the-agent-gets">
  ### Tool yang didapat agent
</div>

| Tool               | Mengembalikan                                                                      |
| ------------------ | ---------------------------------------------------------------------------------- |
| `web_search_tool`  | Web search, disediakan oleh Exa.                                                   |
| `exa_search`       | Halaman hasil pemeringkatan beserta judul, URL, tanggal terbit, dan teks opsional. |
| `exa_get_contents` | Contents lengkap dari URL yang diberikan, dengan summaries atau kutipan opsional.  |

Agent menentukan [search parameters](/id/docs/search/quickstart) Exa pada setiap pemanggilan, sehingga instruksi sederhana saja sudah cukup untuk mengarahkan search mode, domain, tanggal, dan kategori.

<div id="troubleshooting">
  ## Pemecahan Masalah
</div>

<AccordionGroup>
  <Accordion title="Exa search tidak tersedia: tidak ada API key yang dikonfigurasi">
    OpenHuman tidak menemukan key di panel **Search engine**, pada variabel `EXA_API_KEY` dan `OPENHUMAN_EXA_API_KEY`, maupun di `search.exa.api_key`. Atur key di salah satunya, lalu mulai ulang OpenHuman jika Anda mengubah `config.toml` saat OpenHuman sedang berjalan.
  </Accordion>

  <Accordion title="Exa menolak API key yang dikonfigurasi (HTTP 401)">
    Key tidak valid atau sudah dicabut. Periksa key tersebut di [Exa dashboard](https://dashboard.exa.ai/api-keys), lalu **Clear** key yang tersimpan dan simpan key yang benar. Perhatikan spasi yang ikut tersalin saat menempel.
  </Accordion>

  <Accordion title="Exa mengembalikan status non-2xx">
    `429` berarti rate limit tercapai atau kuota habis: periksa penggunaan di [dashboard](https://dashboard.exa.ai). Untuk `5xx`, coba lagi, lalu lihat [error codes](/id/docs/admin/error-codes).
  </Accordion>

  <Accordion title="OpenHuman Managed tidak ada di daftar engine">
    Sesi yang hanya berjalan secara lokal tidak dapat menggunakan managed search. Konfigurasikan Exa provider dengan key Anda sendiri.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Sumber Daya
</div>

<Columns cols={3}>
  <Card title="Dokumentasi web search OpenHuman" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search" cta="Buka panduan" arrow="true">
    Baca referensi resmi OpenHuman tentang mesin pencarinya.
  </Card>

  <Card title="Exa search API" icon="search" href="/id/docs/search/quickstart" cta="Baca panduan" arrow="true">
    Pahami search mode, filter, dan content options di balik Exa tools.
  </Card>

  <Card title="Praktik terbaik search" icon="sparkles" href="/id/docs/search/best-practices" cta="Baca panduan" arrow="true">
    Dapatkan hasil yang lebih baik dari setiap query.
  </Card>
</Columns>