> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="llamaindex">
  # LlamaIndex
</div>

> Panduan singkat tentang cara menambahkan retrieval Exa ke aplikasi LlamaIndex Agent.

<Card title="Quickstart Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Baru mengenal Exa? Memulai dalam waktu kurang dari satu menit.
</Card>

***

LlamaIndex adalah framework untuk membangun aplikasi LLM yang ditenagai data terstruktur. Dalam panduan ini, kita akan menggunakan integrasi LlamaIndex dari Exa untuk:

1. Menetapkan Search and Retrieve Highlight Tool dari Exa sebagai retriever LlamaIndex
2. Menyiapkan OpenAI Agent yang memanfaatkan tool ini saat menghasilkan response

***

<div id="get-started">
  ## Memulai
</div>

<Steps>
  <Step title="Prasyarat dan instalasi">
    Instal library llama-index, llama-index core, dan llama-index-tools-exa. Dependensi OpenAI sudah tercakup dalam core library, jadi tidak perlu disebutkan secara terpisah.

    ```Python Python theme={null}
    pip install llama-index llama-index-core llama-index-tools-exa
    ```

    Pastikan juga API key sudah diinisialisasi dengan benar. Kode berikut menggunakan `EXA_API_KEY` sebagai nama variabel lingkungan yang relevan.

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Instansiasi tool Exa">
    Impor library integrasi Exa yang relevan lalu instansiasi `ExaToolSpec` dari LlamaIndex.

    ```Python Python theme={null}
    from llama_index.tools.exa import ExaToolSpec
    import os

    exa_tool = ExaToolSpec(
        api_key=os.environ["EXA_API_KEY"],
    )
    ```
  </Step>

  <Step title="Pilih metode Exa yang akan digunakan">
    Pada contoh ini, kita hanya ingin meneruskan metode [search&#95;and&#95;retrieve&#95;highlights](https://docs.llamaindex.ai/en/stable/api_reference/tools/exa/) ke agent kita, sehingga kita menentukannya melalui metode `.to_tool_list` dari LlamaIndex. Kita juga meneruskan `current_date`, sebuah utilitas sederhana agar agent mengetahui tanggal saat ini.

    ```Python Python theme={null}
    print('Tools that are provide by Exa LlamaIndex integration:')
    print('\n'.join(map(str, (exa_tool.spec_functions))))

    search_and_retrieve_highlights_tool = exa_tool.to_tool_list(
        spec_functions=["search_and_retrieve_highlights", "current_date"]
    )
    ```
  </Step>

  <Step title="Siapkan OpenAI agent dan kirim permintaan berbasis Exa">
    Siapkan [OpenAIAgent](https://docs.llamaindex.ai/en/stable/examples/agent/Chatbot%5FSEC/) dengan meneruskan kumpulan tool yang sudah disaring di atas.

    ```Python Python theme={null}
    from llama_index.agent.openai import OpenAIAgent

    agent = OpenAIAgent.from_tools(
        search_and_retrieve_highlights_tool,
        verbose=True,
    )
    ```

    Setelah itu, kita bisa menggunakan metode chat untuk berinteraksi dengan agent.

    ```Python Python theme={null}
    agent.chat(
        "Can you summarize the news from the last month related to the US stock market?"
    )
    ```

    Agent akan memanggil Exa tools yang diberikan kepadanya, lalu menyusun jawaban dari hasil tersebut. Output persisnya berbeda-beda tergantung query dan publication date halaman yang dikembalikan Exa.
  </Step>
</Steps>

<Columns cols={2}>
  <Card title="Panduan Search API" icon="search" href="/id/docs/search/quickstart" cta="Baca panduan" arrow="true">
    Tinjau search parameters dan field response Exa.
  </Card>

  <Card title="Referensi tool LlamaIndex" icon="book" href="https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/" cta="Buka referensi" arrow="true">
    Jelajahi tool LlamaIndex dan konfigurasi agent.
  </Card>
</Columns>