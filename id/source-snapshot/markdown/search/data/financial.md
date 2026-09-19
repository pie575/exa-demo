> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="financial-markets">
  # Pasar Keuangan
</div>

> Temukan data pasar, filings, earnings call, dan rilis data ekonomi dengan Exa Search.

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

Gunakan Exa Search untuk harga, filings, transkrip, dan pemberitaan seputarnya dalam satu query. Pertanyaan tentang sebuah ticker dapat mengembalikan kuotasi harga, earnings call terbaru, dan liputan analis sekaligus.

<div id="included">
  ## Termasuk
</div>

* Kuotasi harga dan riwayat harga terkini untuk saham, kripto, forex, indeks, futures, opsi, dan komoditas
* Profil sekuritas dengan statistik utama dan riwayat OHLCV harian
* Transkrip earnings call, lengkap dengan pernyataan yang telah disiapkan serta sesi tanya jawab beserta atribusi pembicaranya
* SEC filings, laporan keuangan, dan filings internasional
* Estimasi analis, pengumuman pendanaan, dan rilis data ekonomi

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Riset ekuitas dan kredit
* KYC, KYB, dan penyaringan adverse media
* Pemantauan portofolio dan kebijakan
* Pencarian peluang transaksi dan riset pasar privat

<div id="example-queries">
  ## Contoh kueri
</div>

<div id="look-up-a-quote">
  ### Mencari kuotasi harga
</div>

Sebutkan ticker atau nama perusahaan beserta angka yang Anda inginkan. Cashtag seperti `$NVDA` juga bisa digunakan.

<PlaygroundQuery query="NVIDIA stock price and change today" />

<div id="read-an-earnings-call">
  ### Membaca earnings call
</div>

Sebutkan nama perusahaan dan kuartalnya untuk mendapatkan transkrip-nya, bukan berita yang membahasnya.

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

<div id="search-filings">
  ### Mencari filings
</div>

Jelaskan pengungkapan yang Anda cari, bukan sekadar jenis formulirnya. Kategori `financial report` membatasi hasil hanya pada filings dan laporan.

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

<div id="track-private-market-activity">
  ### Lacak aktivitas pasar privat
</div>

Tentukan putaran pendanaan, sektor, dan rentang waktunya.

<PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

<div id="follow-economic-data">
  ### Pantau data ekonomi
</div>

Sebutkan rilis data dan angka yang Anda inginkan darinya.

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

<div id="make-a-request">
  ## Buat permintaan
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "10-K risk factors that mention dependency on third-party AI models",
      type="auto",
      category="financial report",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "10-K risk factors that mention dependency on third-party AI models",
    {
      type: "auto",
      category: "financial report",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "10-K risk factors that mention dependency on third-party AI models",
      "type": "auto",
      "category": "financial report",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Dapatkan data terstruktur dengan Exa Agent
</div>

Untuk data terstruktur yang membutuhkan riset lintas banyak sumber, gunakan [task run Exa Agent](/id/docs/agent/quickstart). Jelaskan sekuritas, periode, criteria, dan field output yang Anda perlukan, lalu Agent akan mengembalikan hasil yang tervalidasi terhadap schema beserta citations.

<Card title="Mulai task Agent" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan Agent" arrow="true">
  Saring perusahaan, bandingkan filings, atau susun ringkasan terstruktur untuk satu portofolio.
</Card>