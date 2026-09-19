> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="langchain">
  # LangChain
</div>

> Cara menggunakan integrasi Exa dengan LangChain untuk melakukan RAG.

<Card title="Quickstart Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Baru mengenal Exa? Mulai dalam waktu kurang dari satu menit.
</Card>

***

LangChain adalah framework untuk membangun aplikasi yang menggabungkan LLM dengan data, API, dan tool lainnya. Gunakan integrasi Exa dengan LangChain untuk melakukan RAG:

1. Siapkan integrasi Exa dengan LangChain dan gunakan Exa untuk mengambil konten yang relevan
2. Hubungkan konten ini ke toolchain yang menggunakan LLM OpenAI untuk proses generasi

<Info> Lihat tutorial YouTube dari tim LangChain dengan konfigurasi yang sangat mirip [di sini](https://www.youtube.com/watch?v=dA1cHGACXCo). </Info>

<Info> Lihat referensi lengkap dari LangChain [di sini](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/). </Info>

***

<div id="get-started">
  ## Memulai
</div>

<Steps>
  <Step title="Prasyarat dan instalasi">
    Instal pustaka inti OpenAI dan Exa LangChain

    ```Bash Bash theme={null}
    pip install langchain-openai langchain-exa
    ```

    <Note> Pastikan API key sudah diinisialisasi dengan benar. Untuk library LangChain, nama variabel lingkungannya adalah `OPENAI_API_KEY` dan `EXA_API_KEY`, masing-masing untuk key OpenAI dan Exa. </Note>

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru langsung mendapat credits gratis.
    </Card>
  </Step>

  <Step title="Gunakan Exa Search untuk memberdayakan LangChain Tool">
    Siapkan tool Retriever menggunakan `ExaSearchRetriever`. Retriever ini terhubung ke Exa Search untuk menemukan dokumen yang relevan melalui pencarian semantik. Pertama, impor library yang diperlukan lalu buat instance ExaSearchRetriever.

    ```Python Python theme={null}
    # muat variabel lingkungan
    import os
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_exa import ExaSearchRetriever
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    # Definisikan retriever kita agar menggunakan Exa Search, mengambil 3 hasil dan mengurai highlights dari tiap hasil
    retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)
    ```
  </Step>

  <Step title="Buat template prompt (opsional)">
    Kami menggunakan [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) dari LangChain untuk mendefinisikan template placeholder guna mengekstrak URL dan highlights dari retriever Exa.

    ```Python Python theme={null}
    # Mendefinisikan template prompt dokumen menggunakan tag mirip XML
    document_prompt = PromptTemplate.from_template("""
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """)
    ```
  </Step>

  <Step title="Parse URL dan konten dari hasil Exa">
    Kami menggunakan [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html) untuk mengekstrak atribut URL dan Highlights dari hasil Exa Search, lalu meneruskannya ke templat prompt di atas

    ```Python Python theme={null}
    # Buat Runnable Lambda yang mengurai atribut highlights dan URL dari retriever lalu meneruskannya ke prompt dokumen di atas
    document_chain = RunnableLambda(
        lambda document: {
            "highlights": document.metadata["highlights"],
            "url": document.metadata["url"]
        }
    ) | document_prompt
    ```
  </Step>

  <Step title="Gabungkan hasil pencarian dan konten Exa untuk retrieval">
    Lengkapi rantai retrieval dengan merangkai retriever Exa, parser, dan sebuah fungsi lambda singkat - hal ini krusial agar hasilnya diteruskan sebagai satu string tunggal yang menjadi konteks bagi LLM pada langkah berikutnya.

    ```Python Python theme={null}
    # Definisikan rantai retrieval - hasil Exa search => ambil atribut dan parse menjadi XML => gabungkan menjadi satu string untuk dipakai sebagai konteks di langkah berikutnya
    retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))
    ```
  </Step>

  <Step title="Siapkan toolchain lainnya, termasuk OpenAI untuk menghasilkan konten">
    Pada langkah ini, kita mendefinisikan system prompt dengan input template Query dan Context yang masing-masing diambil dari pengguna dan Exa Search. Pertama, sekali lagi impor pustaka dan komponen yang relevan dari pustaka LangChain

    ```Python Python theme={null}
    from langchain_core.runnables import RunnablePassthrough, RunnableParallel
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_openai import ChatOpenAI
    from langchain_core.output_parsers import StrOutputParser
    ```

    Selanjutnya kita mendefinisikan prompt generasi - template prompt yang digunakan bersama konteks dari Exa untuk menjalankan RAG.

    ```Python Python theme={null}
    # Definisikan template prompt inti
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

    Kita mengatur [LLM untuk generasi ke OpenAI](https://python.langchain.com/v0.1/docs/integrations/chat/openai/), lalu menyatukan semuanya dengan koneksi paralel [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/). Prompt generasi, yang berisi query dan konteks, kemudian diteruskan ke LLM dan [diurai agar representasi output lebih baik](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html).

    ```Python Python theme={null}
    # Gunakan OpenAI untuk generasi
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Parsing string sederhana untuk output
    output_parser = StrOutputParser()

    # Hubungkan chain, termasuk koneksi paralel untuk query dari pengguna dan konteks dari chain retriever Exa pada langkah 2.
    chain = RunnableParallel({
        "query": RunnablePassthrough(),
        "context": retrieval_chain,
    }) | generation_prompt | llm | output_parser
    ```
  </Step>

  <Step title="Menjalankan seluruh toolchain RAG">
    Mari kita [invoke](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke) chain tersebut:

    ```Python Python theme={null}
    result = chain.invoke("Latest research on climate change innovation")

    print(result)
    ```

    Lalu lihat output-nya (newline sudah di-parse):

    ```Stdout Stdout theme={null}
    'Berdasarkan konteks yang diberikan, riset terbaru mengenai inovasi perubahan iklim mengungkap beberapa temuan penting:
    1. Inovasi sebagai respons terhadap perubahan iklim: Sebuah studi meneliti bagaimana inovasi merespons perubahan iklim dengan menganalisis kumpulan data panel dari 70 negara. Studi tersebut menemukan bahwa jumlah inovasi terkait perubahan iklim berkorelasi positif dengan meningkatnya tingkat emisi karbon dioksida dari bahan bakar gas dan cair, terutama dari gas alam dan minyak bumi. Namun, inovasi tersebut berkorelasi negatif dengan peningkatan emisi karbon dioksida dari konsumsi bahan bakar padat, terutama batu bara, serta emisi gas rumah kaca lainnya. Riset ini juga menyoroti bahwa investasi pemerintah tidak selalu memengaruhi keputusan untuk mengembangkan dan mematenkan teknologi iklim. Studi ini berkontribusi pada literatur inovasi lingkungan dengan memberikan wawasan tentang bagaimana inovasi bereaksi terhadap perubahan pada faktor-faktor utama perubahan iklim.
    2. Pendanaan dan perhatian terhadap teknologi iklim: Selama periode 2010-2022, di luar AS, China, Uni Eropa, dan India, hanya 8% dari total aktivitas modal ventura iklim yang berasal dari kawasan lain di dunia. Terpusatnya pendanaan dan perhatian pada wilayah tertentu ini dapat menghambat jangkauan solusi teknologi iklim ke komunitas berpenghasilan rendah dan negara berkembang, yang sudah merasakan dampak perubahan iklim tetapi tidak memiliki sumber daya yang memadai untuk menanganinya secara efektif.
    3. Alokasi pendanaan riset: Sebuah studi dari University of Sussex Business School menganalisis pendanaan riset untuk penelitian iklim dan energi dari tahun 1990 hingga 2020. Riset tersebut menemukan bahwa 36% pendanaan dialokasikan untuk adaptasi iklim, sementara 28% digunakan untuk mempelajari cara membersihkan sistem energi. Porsi pendanaan signifikan lainnya dialokasikan untuk transportasi dan mobilitas (13%), geoengineering (12%), serta dekarbonisasi industri (11%). Sebagian besar pendanaan diberikan kepada peneliti di negara-negara Barat yang kaya, yang mungkin bukan pihak paling rentan terhadap dampak langsung perubahan iklim.
    Sumber:
    1. Studi tentang respons inovasi terhadap perubahan iklim: https://www.sciencedirect.com/science/article/pii/S0040162516302542
    2. Pendanaan dan perhatian terhadap teknologi iklim: https://www.sbs.ox.ac.uk/oxford-answers/climate-tech-opportunity-save-planet
    3. Alokasi pendanaan riset untuk penelitian iklim dan energi: https://www.protocol.com/bulletins/climate-research-funding-adaptation'
    ```
  </Step>

  <Step title="Secara opsional, streaming output chain">
    Secara opsional, Anda dapat melakukan streaming output dari chain tersebut.

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

    Menghasilkan output dalam bentuk stream. [Pelajari lebih lanjut](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/) tentang metode `.stream`, termasuk cara menangani chunk dan mem-parsing output.
  </Step>
</Steps>