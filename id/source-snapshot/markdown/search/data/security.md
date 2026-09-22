> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="cybersecurity">
  # Keamanan Siber
</div>

> Temukan kerentanan, advisory, laporan ancaman, dan dokumentasi kepercayaan dengan Exa Search.

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

Gunakan Exa Search untuk catatan kerentanan, advisory vendor, dan threat research dari sources yang memang sudah dibaca oleh Team keamanan.

<div id="included">
  ## Included
</div>

* Catatan kerentanan CVE dan GHSA
* Advisory keamanan vendor dan catatan patch
* Laporan threat intelligence dan uraian incident
* Trust pages, daftar subprosesor, dan dokumentasi kepatuhan
* Blog keamanan, presentasi konferensi, dan research

<div id="use-it-for">
  ## Gunakan untuk
</div>

* Triase kerentanan dan penilaian eksposur
* Threat intelligence dan pelacakan pelaku ancaman
* Penilaian risiko vendor dan tinjauan keamanan pihak ketiga
* Pemantauan dan pemberian peringatan keamanan

<div id="example-queries">
  ## Contoh kueri
</div>

<div id="triage-a-vulnerability-class">
  ### Melakukan triase kelas kerentanan
</div>

Sebutkan produk, rentang versi, dan tingkat keparahannya.

<PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

<div id="find-vendor-advisories">
  ### Menemukan advisory vendor
</div>

Jelaskan status eksploitasi dan kelas produknya, bukan satu ID CVE tertentu.

<PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

<div id="review-a-vendors-security-posture">
  ### Meninjau postur keamanan vendor
</div>

Sebutkan jenis dokumen dan kelas vendor.

<PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />

<div id="research-an-adversary">
  ### Research pelaku ancaman
</div>

Sebutkan nama kelompok atau kampanyenya, serta teknik atau sektor yang ingin Anda dalami.

<PlaygroundQuery query="reports on ransomware groups targeting healthcare providers this year" />

<div id="make-a-request">
  ## Kirim permintaan
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "critical CVEs affecting Apache Struts 6.x",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "critical CVEs affecting Apache Struts 6.x",
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
      "query": "critical CVEs affecting Apache Struts 6.x",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Mendapatkan data terstruktur dengan Exa Agent
</div>

Untuk data terstruktur yang membutuhkan research di berbagai sources, gunakan [Exa Agent task run](/id/docs/agent/quickstart). Jelaskan produk, kriteria ancaman, dan output fields yang Anda butuhkan, lalu Agent akan mengembalikan hasil yang tervalidasi terhadap schema beserta sitasi.

<Card title="Mulai Agent task" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan Agent" arrow="true">
  Periksa vendor melalui advisory, laporan pelanggaran data, dan trust pages, atau susun data kerentanan yang sudah dinormalisasi.
</Card>