> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="crewai">
  # CrewAI
</div>

> Pelajari cara menambahkan kemampuan retrieval Exa ke agent CrewAI Anda.

<Card title="Quickstart Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Baru mengenal Exa? Mulai dalam waktu kurang dari satu menit.
</Card>

***

[CrewAI](https://crewai.com/) adalah framework untuk mengorkestrasi AI agents yang bekerja sama menyelesaikan tugas-tugas kompleks.
Dalam panduan ini, kita akan membuat sebuah crew berisi dua agent yang menghasilkan newsletter berdasarkan hasil search Exa. Kita akan membahas cara:

1. Membuat tool CrewAI kustom yang berbasis Exa
2. Menyiapkan agent dan memberinya peran spesifik yang menggunakan tool search berbasis Exa
3. Menyusun agent tersebut ke dalam sebuah crew yang akan menulis newsletter

<Note>
  CrewAI juga menyediakan [`ExaSearchTool`](https://docs.crewai.com/en/tools/search-research/exasearchtool) bawaan yang bisa langsung Anda pakai tanpa menulis wrapper kustom. Tool kustom di bawah ini berguna jika Anda ingin kendali penuh atas cara hasil diformat; kedua pendekatan sama-sama berfungsi.
</Note>

***

<div id="get-started">
  ## Memulai
</div>

<Steps>
  <Step title="Prasyarat dan instalasi">
    Instal pustaka crewAI core, crewAI tools, dan SDK Python Exa.

    ```Python Python theme={null}
    pip install crewai 'crewai[tools]' exa_py
    ```
  </Step>

  <Step title="Mendefinisikan tool kustom berbasis Exa di crewAI">
    Kita membuat sebuah [tool kustom](https://docs.crewai.com/concepts/tools) menggunakan [@tool decorator ](https://docs.crewai.com/concepts/tools#utilizing-the-tool-decorator) dari crewAI. Di dalam tool tersebut, kita dapat menginisialisasi kelas Exa dari [Exa Python SDK](https://github.com/exa-labs/exa-py), mengirim permintaan, dan mengembalikan hasil yang sudah diurai.

    ```Python Python theme={null}
    from crewai_tools import tool
    from exa_py import Exa
    import os

    exa_api_key = os.getenv("EXA_API_KEY")

    @tool("Exa search and get contents")
    def search_and_get_contents_tool(question: str) -> str:
        """Tool using Exa's Python SDK to run semantic search and return result highlights."""

        exa = Exa(api_key=exa_api_key)

        response = exa.search(
            question,
            type="auto",
            num_results=10,
            contents={"highlights": True}
        )

        parsedResult = ''.join([
          f'<Title id={idx}>{eachResult.title}</Title>'
          f'<URL id={idx}>{eachResult.url}</URL>'
          f'<Highlight id={idx}>{"".join(eachResult.highlights)}</Highlight>'
          for (idx, eachResult) in enumerate(response.results)
        ])

        return parsedResult
    ```

    <Note> Pastikan API key Anda sudah diinisialisasi dengan benar. Untuk demonstrasi ini, nama variabel lingkungan yang digunakan adalah `OPENAI_API_KEY` dan `EXA_API_KEY`, masing-masing untuk key OpenAI dan Exa. </Note>

    <Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Buat key di dashboard. Akun baru mendapatkan credits gratis.
    </Card>
  </Step>

  <Step title="Menyiapkan agen crewAI">
    Impor modul crewAI yang relevan. Kemudian, definisikan `exa_tools` agar merujuk ke metode search kustom yang kita buat di atas.

    ```Python Python theme={null}
    from crewai import Task, Crew, Agent

    exa_tools = search_and_get_contents_tool
    ```

    Selanjutnya kita menyiapkan[ dua agent](https://docs.crewai.com/concepts/Agents/) dan menempatkan keduanya dalam satu [crew](https://docs.crewai.com/concepts/Crews/):

    * Satu untuk melakukan riset dengan Exa (menggunakan custom tool yang didefinisikan di atas)
    * Satu lagi untuk menulis newsletter sebagai output (menggunakan LLM)

    ```Python Python theme={null}
    # Membuat agent peneliti senior dengan memori dan mode verbose
    researcher = Agent(
      role='Researcher',
      goal='Get the latest research on {topic}',
      verbose=True,
      memory=True,
      backstory=(
        "Driven by curiosity, you're at the forefront of"
        "innovation, eager to explore and share knowledge that could change"
        "the world."
      ),
      tools=[exa_tools],
      allow_delegation=False
    )

    article_writer = Agent(
      role='Writer',
      goal='Write a great newsletter article on {topic}',
      verbose=True,
      memory=True,
      backstory=(
        "Driven by a love of writing and passion for"
        "innovation, you are eager to share knowledge with"
        "the world."
      ),
      tools=[exa_tools],
      allow_delegation=False
    )
    ```
  </Step>

  <Step title="Mendefinisikan tugas untuk agen">
    Selanjutnya, kita akan mendefinisikan [tasks](https://docs.crewai.com/concepts/Tasks/) untuk masing-masing agent dan membentuk crew secara keseluruhan dengan memanfaatkan semua komponen yang sudah kita siapkan di atas.

    ```Python Python theme={null}
    research_task = Task(
      description=(
        "Identify the latest research in {topic}."
        "Your final report should clearly articulate the key points,"
      ),
      expected_output='A comprehensive 3 paragraphs long report on the {topic}.',
      tools=[exa_tools],
      agent=researcher,
    )

    write_article = Task(
      description=(
        "Write a newsletter article on the latest research in {topic}."
        "Your article should be engaging, informative, and accurate."
        "The article should address the audience with a greeting to the newsletter audience \"Hi readers!\", plus a similar signoff"
      ),
      expected_output='A comprehensive 3 paragraphs long newsletter article on the {topic}.',
      agent=article_writer,
    )

    crew = Crew(
      agents=[researcher, article_writer],
      tasks=[research_task, write_article],
      memory=True,
      cache=True,
      max_rpm=100,
      share_crew=True
    )
    ```
  </Step>

  <Step title="Memulai CrewAI">
    Terakhir, kita menjalankan crew dengan memberikan topik riset sebagai query masukan.

    ```Python Python theme={null}
    response = crew.kickoff(inputs={'topic': 'Latest AI research'})

    print(response)
    ```

    Crew menulis newsletter dari konten yang dikembalikan oleh tool Exa search.
  </Step>
</Steps>