> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk mengetahui semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="legal-public-records">
  # Hukum &amp; Catatan Publik
</div>

> Temukan putusan pengadilan, paten, sanksi, kontrak pemerintah, dan catatan publik lainnya dengan Exa Search.

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

Gunakan Exa Search untuk menelusuri sumber hukum primer dan rekaman publik pemerintah sekaligus ulasan yang membahasnya.

<div id="included">
  ## Termasuk
</div>

* Putusan pengadilan AS, lengkap dengan teks penuh, pengadilan, nomor perkara, dan metadata sitasi
* Paten AS yang telah dikabulkan, dengan abstrak, klaim, deskripsi, inventor, dan pemegang paten
* Undang-undang, peraturan, dan panduan lembaga
* Daftar sanksi dan watchlist
* Kontrak pemerintah dan catatan pengadaan
* Data sensus dan catatan statistik publik lainnya

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Riset yurisprudensi dan RAG hukum
* Pemantauan regulasi dan kebijakan
* Pencarian prior art dan freedom-to-operate
* Penyaringan kepatuhan dan uji tuntas
* Riset pasar sektor publik

<div id="example-queries">
  ## Contoh kueri
</div>

<div id="find-case-law">
  ### Temukan yurisprudensi
</div>

Jelaskan pertanyaan hukum dan jurisdiction dalam bahasa sehari-hari, bukan dalam bentuk sitasi perkara.

<PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

<div id="search-patents">
  ### Search paten
</div>

Jelaskan cara kerja invensi tersebut, sebagaimana sebuah klaim dituliskan.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="screen-against-sanctions">
  ### Penyaringan terhadap daftar sanksi
</div>

Sebutkan nama daftar dan kelas entitas yang Anda saring.

<PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

<div id="research-government-spending">
  ### Meneliti belanja pemerintah
</div>

Sebutkan instansi pembeli atau kategori layanan beserta rentang waktunya.

<PlaygroundQuery query="federal contracts awarded for cloud migration services" />

<div id="pull-public-statistics">
  ### Ambil statistik publik
</div>

Sebutkan nama dataset dan wilayah geografisnya.

<PlaygroundQuery query="census tract population change in the Austin metro area" />

<div id="make-a-request">
  ## Membuat permintaan
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "California appellate decisions on non-compete enforceability",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "California appellate decisions on non-compete enforceability",
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
      "query": "California appellate decisions on non-compete enforceability",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Dapatkan data terstruktur dengan Exa Agent
</div>

Untuk data terstruktur yang membutuhkan riset lintas sumber, gunakan [task run Exa Agent](/id/docs/agent/quickstart). Jelaskan jurisdiction, jenis dokumen, criteria, dan bidang output yang Anda butuhkan, lalu Agent akan mengembalikan hasil yang tervalidasi schema beserta citations.

<Card title="Mulai task Agent" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan Agent" arrow="true">
  Periksa suatu entitas di berbagai jenis dokumen atau telusuri perubahan regulasi melalui sumber primer dan pemberitaannya.
</Card>