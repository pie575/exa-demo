> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="code-docs">
  # Kode &amp; Dokumentasi
</div>

> Temukan kode, dokumentasi teknis, dan instruksi implementasi dengan Exa Search.

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

Gunakan Exa Search untuk mencari repositori, dokumentasi teknis, informasi package, dan instruksi implementasi dengan kueri berbahasa alami.

<Tip>
  Baca [WebCode: Search Evals for Coding Agents](https://exa.ai/blog/webcode) untuk mempelajari cara Exa
  mengevaluasi retrieval pada tugas-tugas coding.
</Tip>

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Coding agent dan tool pembuatan kode
* Produk pencarian dan dokumentasi untuk developer
* Workflow debugging, migrasi, dan konfigurasi
* Research teknis di berbagai repositori, dokumentasi, dan package registry

<div id="example-queries">
  ## Contoh kueri
</div>

<div id="discover-libraries-by-capability">
  ### Temukan libraries berdasarkan capability
</div>

Jelaskan capability, ekosistem, dan batasan yang Anda perlukan. Cara ini menghasilkan kandidat berdasarkan fungsinya, bukan berdasarkan nama proyek yang persis.

<PlaygroundQuery query="open source Rust libraries for vector similarity search" />

<div id="retrieve-implementation-documentation">
  ### Mengambil dokumentasi implementasi
</div>

Sebutkan nama produk dan operasi yang spesifik. Dengan begitu, Search dapat memprioritaskan dokumentasi API dan panduan implementasi dibandingkan pembahasan umum.

<PlaygroundQuery query="Stripe webhook signature verification documentation" />

<div id="check-version-specific-changes">
  ### Periksa perubahan spesifik per versi
</div>

Sertakan kanal rilis atau versi jika kompatibilitas menjadi hal penting. Hal ini mengurangi hasil yang terkait rilis lama.

<PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

<div id="find-reusable-agent-tooling">
  ### Menemukan tooling agent yang dapat digunakan ulang
</div>

Sebutkan jenis artefak dan tugasnya, jangan mencari frasa yang terlalu umum seperti &quot;AI tools&quot;.

<PlaygroundQuery query="agent skills for extracting tables from PDFs" />

<div id="make-a-request">
  ## Membuat permintaan
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "how to use Exa search in python",
      type="fast",
      num_results=10,
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "how to use Exa search in python",
    {
      type: "fast",
      numResults: 10,
      contents: {
        highlights: true,
      },
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "how to use Exa search in python",
      "type": "fast",
      "numResults": 10,
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Mendapatkan data terstruktur dengan Exa Agent
</div>

Untuk data terstruktur yang membutuhkan research lintas berbagai sumber, gunakan [Exa Agent task run](/id/docs/agent/quickstart). Jelaskan libraries, kriteria teknis, dan output fields yang Anda butuhkan, lalu Agent akan mengembalikan hasil yang tervalidasi terhadap schema beserta sitasi.

<Card title="Mulai Agent task" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan Agent" arrow="true">
  Bandingkan libraries, enrich catatan repositori, atau hasilkan daftar terstruktur dari berbagai sinyal teknis.
</Card>