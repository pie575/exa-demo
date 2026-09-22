> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="langchain">
  # LangChain
</div>

> Cara menggunakan integrasi Exa dengan LangChain untuk melakukan RAG.

<Card title="Quickstart Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Baru mengenal Exa? Memulai dalam waktu kurang dari satu menit.
</Card>

***

LangChain adalah framework untuk membangun aplikasi yang memadukan LLM dengan data, API, dan tool lainnya. Gunakan integrasi LangChain dari Exa untuk melakukan RAG:

1. Siapkan integrasi LangChain dari Exa dan gunakan Exa untuk mengambil konten yang relevan
2. Hubungkan konten ini ke toolchain yang menggunakan LLM dari OpenAI untuk proses generasi

<Info> Lihat tutorial YouTube dari tim LangChain dengan penyiapan yang sangat mirip [di sini](https://www.youtube.com/watch?v=dA1cHGACXCo). </Info>

<Info> Lihat referensi lengkap dari LangChain [di sini](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/). </Info>

***

<div id="get-started">
  ## Memulai
</div>

<Steps>
  <Step title="Prasyarat dan instalasi">
    Instal library inti OpenAI dan Exa LangChain

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> Pastikan API key sudah diinisialisasi dengan benar. Untuk libraries LangChain, nama variabel lingkungannya adalah `OPENAI_API_KEY` dan `EXA_API_KEY`, masing-masing untuk key OpenAI dan Exa. </Note>

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Gunakan Exa Search untuk mendukung Tool LangChain">
    Siapkan tool Retriever menggunakan `ExaSearchRetriever`. Ini adalah retriever yang terhubung ke Exa Search untuk menemukan dokumen yang relevan melalui pencarian semantik. Pertama, impor library yang diperlukan lalu buat instance ExaSearchRetriever.

    ```Python Python theme={null}
    # muat variabel lingkungan
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # Definisikan retriever kita agar menggunakan Exa Search, mengambil 3 hasil dan mengurai kutipan dari setiap hasil
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="Buat templat prompt (opsional)">
    Kami menggunakan [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) dari LangChain untuk mendefinisikan templat placeholder guna mengurai URL dan kutipan dari retriever Exa.

    ```Python Python theme={null}
    # Mendefinisikan templat prompt dokumen menggunakan tag mirip XML
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="Ekstrak URL dan konten dari hasil Exa">
    Kami menggunakan [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html) untuk mengekstrak atribut URL dan Highlights dari hasil Exa Search, lalu meneruskannya ke templat prompt di atas

    ```Python Python theme={null}
    # Buat Runnable Lambda yang mengurai atribut kutipan dan URL dari retriever lalu meneruskannya ke prompt dokumen di atas
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="Gabungkan hasil dan konten Exa untuk pengambilan informasi">
    Lengkapi rantai retrieval dengan merangkai retriever Exa, parser, dan sebuah fungsi lambda singkat - langkah ini penting agar hasilnya diteruskan sebagai satu string tunggal yang menjadi konteks bagi LLM pada langkah berikutnya.

    ```Python Python theme={null}
    # Definisikan rantai retrieval - hasil Exa search => ambil atributnya lalu parse menjadi XML => gabungkan menjadi satu string untuk dipakai sebagai konteks pada langkah berikutnya
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="Siapkan seluruh toolchain lainnya, termasuk OpenAI untuk menghasilkan konten">
    Pada langkah ini, kita mendefinisikan system prompt dengan input templat Query dan Context yang masing-masing diambil dari pengguna dan Exa Search. Pertama, sekali lagi impor library dan komponen yang relevan dari library LangChain

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    Selanjutnya kita mendefinisikan prompt generasi - templat prompt yang digunakan bersama konteks dari Exa untuk menjalankan RAG.

    ```Python Python theme={null}
    # Definisikan templat prompt inti
    generation_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert research assistant. You use xml-formatted context to research people's questions."),
        ("human", """
    Please answer the following query based on the provided context. Please cite your sources at the end of your response.:

    Query: {query}
    ---
    <context>
    {context}
    </context>
    """)
    ])
    ```

    Kami mengatur [LLM generasi ke OpenAI](https://python.langchain.com/v0.1/docs/integrations/chat/openai/), lalu menghubungkan semuanya dengan koneksi paralel [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/). Prompt generasi, yang berisi query dan konteks, kemudian diteruskan ke LLM dan [diurai agar representasi output lebih baik](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html).

    ```Python Python theme={null}
    # Gunakan OpenAI untuk generasi
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Parsing string sederhana untuk output
    output_parser = StrOutputParser()

    # Hubungkan rantainya, termasuk koneksi paralel untuk query dari pengguna dan konteks dari rantai retriever Exa pada langkah 2.
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="Menjalankan toolchain RAG secara lengkap">
    Mari kita [invoke](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke) chain tersebut:

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    Lalu lihat output-nya (baris baru sudah diurai):

    ```Stdout Stdout theme={null}
    'Based on the provided context, the latest research on climate change innovation reveals several important findings:
    1. Innovation in response to climate change: A study examined how innovation responds to climate change by analyzing a panel dataset of 70 countries. The study found that the number of climate-change-related innovations is positively correlated with increasing levels of carbon dioxide emissions from gas and liquid fuels, mainly from natural gases and petroleum. However, it is negatively correlated with increases in carbon dioxide emissions from solid fuel consumption, mainly from coal, and other greenhouse gas emissions. The research also highlighted that government investment does not always influence decisions to develop and patent climate technologies. This study contributes to the environmental innovation literature by providing insights on how innovation reacts to changes in major climate change factors.
    2. Climate tech funding and attention: During the period of 2010-2022, outside of the US, China, EU, and India, only 8% of total climate venture capital activity came from the rest of the world. This concentration of funding and attention in specific regions may be hindering the reach of climate tech solutions to low-income communities and developing countries, which are already feeling the effects of climate change but lack the necessary resources to address them effectively.
    3. Research funding allocation: A study from the University of Sussex Business School analyzed research funding for climate and energy research from 1990 to 2020. The research found that 36% of funding was allocated to climate adaptation, while 28% went to studying how to clean up the energy system. Other significant shares of funding were allocated to transport and mobility (13%), geoengineering (12%), and industrial decarbonization (11%). The majority of the funding went to researchers in wealthy, Western countries, which may not be the most vulnerable to the immediate impacts of climate change.
    Sources:
    1. Study on innovation response to climate change: https://www.sciencedirect.com/science/article/pii/S0040162516302542
    2. Climate tech funding and attention: https://www.sbs.ox.ac.uk/oxford-answers/climate-tech-opportunity-save-planet
    3. Research funding allocation for climate and energy research: https://www.protocol.com/bulletins/climate-research-funding-adaptation'
    ```
  </Step>

  <Step title="Secara opsional, streaming output chain">
    Secara opsional, Anda dapat melakukan stream pada output dari chain tersebut.

    ```Python Python theme={null}
    for chunk in chain.stream("Latest research on climate change innovation"):
      print(chunk, end="|", flush=True)

    # Atau secara asinkron
    async def run_async():
      async for chunk in chain.astream("Latest research on climate change innovation"):
        print(chunk, end="|", flush=True)

    import asyncio
    asyncio.run(run_async())
    ```

    Menghasilkan output dalam bentuk stream. [Pelajari lebih lanjut](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/) tentang metode `.stream`, termasuk cara menangani chunk dan mengurai output.
  </Step>
</Steps>