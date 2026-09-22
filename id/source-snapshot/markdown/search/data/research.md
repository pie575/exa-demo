> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="research-publications">
  # Publikasi Research
</div>

> Temukan paper akademik, paten, hibah, uji klinis, dan persetujuan regulasi dengan Exa Search.

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

Gunakan Exa Search untuk publikasi research dan catatan terkait, termasuk judul, abstrak, penulis, tempat publikasi, sitasi, halaman penerbit, pracetak, dan halaman repositori.

<Tip>
  Baca [SOTA Search Over Academic Publications](https://exa.ai/blog/publications-search)
  untuk mempelajari lebih lanjut tentang kualitas pencarian publikasi.
</Tip>

<div id="included">
  ## Termasuk
</div>

* Paper dan pracetak, termasuk potongan teks penuh bila tersedia teks penuh hasil penguraian
* Paten, beserta abstrak, klaim, penemu, dan pemegang hak
* Hibah dan pengumuman pendanaan
* Uji klinis, label obat, dan data interaksi
* Persetujuan regulasi dan kesehatan

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Tinjauan literatur dan penemuan sitasi
* Pemetaan prior art dan lanskap paten
* Research klinis dan farmasi
* Penemuan hibah dan peluang pendanaan

<div id="example-queries">
  ## Contoh kueri
</div>

<div id="find-papers-on-a-topic">
  ### Mencari paper tentang suatu topik
</div>

Deskripsikan metode atau temuannya, jangan menebak-nebak kata kunci pada judul. Kategori `publication` membatasi hasil hanya pada paper.

<PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" category="publication" />

<div id="search-clinical-evidence">
  ### Cari evidence klinis
</div>

Sebutkan fase, intervensi, dan populasinya agar registrasi uji klinis dan halaman hasil berperingkat lebih tinggi daripada liputan umum.

<PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

<div id="track-regulatory-approvals">
  ### Melacak persetujuan regulasi
</div>

Sebutkan regulator serta kelas perangkat atau obat yang sedang Anda pantau.

<PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />

<div id="run-a-prior-art-search">
  ### Jalankan pencarian prior art
</div>

Jelaskan invensi secara fungsional, seperti cara sebuah klaim ditulis, alih-alih menggunakan nama produk.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="make-a-request">
  ## Membuat permintaan
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "papers on evaluation benchmarks for retrieval-augmented generation",
      type="auto",
      category="publication",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "papers on evaluation benchmarks for retrieval-augmented generation",
    {
      type: "auto",
      category: "publication",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "papers on evaluation benchmarks for retrieval-augmented generation",
      "type": "auto",
      "category": "publication",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Mendapatkan data terstruktur dengan Exa Agent
</div>

Untuk data terstruktur yang membutuhkan research lintas berbagai sumber, gunakan [Exa Agent task run](/id/docs/agent/quickstart). Jelaskan publikasi, kriteria inklusi, dan output fields yang Anda butuhkan, lalu Agent akan mengembalikan hasil tervalidasi schema beserta sitasi.

<Card title="Mulai Agent task" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan Agent" arrow="true">
  Susun peta literatur, saring paper berdasarkan kriteria inklusi, atau kumpulkan fields dari beberapa publikasi ke dalam satu tabel.
</Card>