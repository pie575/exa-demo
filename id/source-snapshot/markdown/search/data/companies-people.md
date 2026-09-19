> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="companies-people">
  # Perusahaan &amp; Orang
</div>

> Temukan perusahaan, profil profesional, serta hubungan di antara keduanya dengan Exa Search.

export const PlaygroundQuery = ({query, category, filters}) => {
  const PLAYGROUND = "https://dashboard.exa.ai/playground/search";
  const DEFAULT_FILTERS = {
    type: "auto",
    highlights: true
  };
  const params = [`q=${encodeURIComponent(query)}`];
  if (category) params.push(`c=${encodeURIComponent(category)}`);
  params.push(`filters=${encodeURIComponent(JSON.stringify({
    ...DEFAULT_FILTERS,
    ...filters
  }))}`);
  const href = `${PLAYGROUND}?${params.join("&")}`;
  return <div className="playground-query not-prose">
      <code className="playground-query-text">{query}</code>
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Buka di playground API" aria-label={`Buka "${query}" di playground API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Gunakan Exa Search untuk mencari organisasi dan orang-orang yang terkait dengannya. Kedua jenis pencarian ini paling efektif bila dipadukan: jelaskan karakteristik perusahaan yang membuat seseorang memenuhi kriteria, atau orang dan peran yang menunjukkan cara sebuah perusahaan beroperasi.

<Columns cols={2}>
  <Card title="Tolok ukur retrieval perusahaan" icon="building" href="https://exa.ai/blog/company-search-benchmarks">
    Lihat bagaimana Exa mengevaluasi retrieval perusahaan dan extraction fakta.
  </Card>

  <Card title="Tolok ukur retrieval orang" icon="users" href="https://exa.ai/blog/people-search-benchmark">
    Lihat bagaimana Exa mengevaluasi pencarian bertarget dan penemuan profil.
  </Card>
</Columns>

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Menemukan perusahaan, kandidat, dan pakar
* Riset akun dan pemetaan pemangku kepentingan
* Peta pasar, riset investasi, dan pencarian peluang investasi
* Riset kepemimpinan, perekrutan, dan organisasi

<div id="write-better-queries">
  ## Menulis query yang lebih baik
</div>

Mulailah dari entitas yang Anda cari, lalu tambahkan karakteristik dan keterkaitan yang mempersempitnya. Sebutkan jenis sumbernya bila hal itu penting, misalnya beranda perusahaan, profil profesional, lowongan kerja, atau situs web pribadi.

<Tabs>
  <Tab title="Perusahaan" icon="building">
    <div id="discover-companies-by-what-they-do">
      ### Temukan perusahaan berdasarkan bidang kerjanya
    </div>

    Deskripsikan pelanggan, produk, capability, tahapan, dan wilayah geografis yang mendefinisikan pasar tersebut. Dengan cara ini, kandidat ditemukan berdasarkan apa yang mereka kerjakan, bukan dari daftar perusahaan yang sudah ditentukan sebelumnya.

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    <div id="find-operating-signals">
      ### Temukan sinyal operasional
    </div>

    Sebutkan sinyalnya dan karakteristik perusahaan yang relevan bagi Anda. Search dapat mengambil lowongan kerja, halaman harga, dokumentasi produk, dan laporan, selain halaman perusahaan.

    <PlaygroundQuery query="remote staff engineer roles at Series B fintech companies" />

    <div id="research-funding-activity">
      ### Riset aktivitas pendanaan
    </div>

    Tentukan putaran pendanaan, industri, partisipan, dan rentang waktunya.

    <PlaygroundQuery query="investors who led seed rounds in robotics in the last year" />
  </Tab>

  <Tab title="Orang" icon="users">
    <div id="discover-people-by-role-and-skills">
      ### Temukan orang berdasarkan peran dan keahlian
    </div>

    Gabungkan peran, tingkat senioritas, lokasi, keahlian yang relevan, dan jenis sumber yang Anda inginkan.

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    <div id="qualify-people-by-company-traits">
      ### Saring orang berdasarkan karakteristik perusahaan
    </div>

    Deskripsikan hubungan orang tersebut dengan perusahaan serta karakteristik yang menentukan perusahaan itu. Cara ini lebih efektif daripada menyusun daftar perusahaan terlebih dahulu.

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    <div id="find-personal-websites-and-public-work">
      ### Temukan situs web pribadi dan karya publik
    </div>

    Sebutkan profesi atau bidang penelitiannya, lalu mintalah secara eksplisit situs web pribadi, presentasi, wawancara, atau artikel.

    <PlaygroundQuery query="personal blogs of distributed systems researchers" />
  </Tab>
</Tabs>

<div id="search-both-together">
  ## Cari keduanya sekaligus
</div>

Tulis satu query yang menyatakan keterkaitan yang Anda butuhkan. Exa dapat mengembalikan halaman perusahaan, profil profesional, halaman lowongan kerja, dan referensi publik dalam satu kumpulan hasil yang sama.

<PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />

<div id="make-a-request">
  ## Buat permintaan
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "heads of security at Series B healthcare software companies that sell to hospitals",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "heads of security at Series B healthcare software companies that sell to hospitals",
    {
      type: "auto",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "heads of security at Series B healthcare software companies that sell to hospitals",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Mendapatkan data terstruktur dengan Exa Agent
</div>

Untuk data terstruktur yang memerlukan riset lintas banyak sumber, gunakan [task run Exa Agent](/id/docs/agent/quickstart). Jelaskan perusahaan, orang, criteria kualifikasi, dan field output yang Anda butuhkan, lalu Agent akan mengembalikan hasil yang tervalidasi terhadap schema beserta citations.

<Card title="Mulai task Agent" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan Agent" arrow="true">
  Susun dan saring daftar perusahaan atau orang, lalu enrich setiap record dengan field yang dikumpulkan dari berbagai sumber.
</Card>