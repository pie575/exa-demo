> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Perusahaan &amp; Orang {#companies-people}

> Temukan perusahaan, profil profesional, dan keterkaitan di antara keduanya dengan Exa Search.

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

Gunakan Exa Search untuk organisasi dan orang-orang yang terkait dengannya. Kedua jenis pencarian ini paling efektif bila dipadukan: jelaskan company traits yang membuat seseorang memenuhi kualifikasi, atau orang dan peran yang menunjukkan cara sebuah perusahaan beroperasi.

<Columns cols={2}>
  <Card title="Tolok ukur retrieval perusahaan" icon="building" href="https://exa.ai/blog/company-search-benchmarks">
    Lihat cara Exa mengevaluasi retrieval perusahaan dan extraction fakta.
  </Card>

  <Card title="Tolok ukur retrieval orang" icon="users" href="https://exa.ai/blog/people-search-benchmark">
    Lihat cara Exa mengevaluasi pencarian bertarget dan discovery profil.
  </Card>
</Columns>

## Gunakan untuk {#use-it-for}

* Penemuan perusahaan, kandidat, dan pakar
* Research akun dan pemetaan pemangku kepentingan
* Peta pasar, research investasi, dan pencarian peluang transaksi
* Research kepemimpinan, perekrutan, dan organisasi

## Tulis query yang lebih baik {#write-better-queries}

Mulailah dengan entitas yang Anda cari, lalu tambahkan karakteristik dan hubungan yang menjadi syaratnya. Sebutkan jenis sumber bila hal itu penting, misalnya halaman utama perusahaan, profil profesional, lowongan pekerjaan, atau situs web pribadi.

<Tabs>
  <Tab title="Perusahaan" icon="building">
### Temukan perusahaan berdasarkan apa yang mereka kerjakan {#discover-companies-by-what-they-do}

    Jelaskan pelanggan, produk, capability, tahap, dan cakupan geografis yang mendefinisikan market tersebut. Dengan cara ini, kandidat ditemukan berdasarkan apa yang mereka kerjakan, bukan berdasarkan daftar perusahaan yang sudah ditentukan sebelumnya.

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

### Temukan sinyal operasional {#find-operating-signals}

    Sebutkan sinyal dan company traits yang penting. Search dapat mengambil lowongan pekerjaan, halaman harga, dokumentasi produk, dan laporan, selain halaman perusahaan.

    <PlaygroundQuery query="remote staff engineer roles at Series B fintech companies" />

### Teliti aktivitas pendanaan {#research-funding-activity}

    Tentukan putaran pendanaan, industri, pihak yang terlibat, dan rentang waktunya.

    <PlaygroundQuery query="investors who led seed rounds in robotics in the last year" />
  </Tab>

  <Tab title="Orang" icon="users">
### Temukan orang berdasarkan role dan keahlian {#discover-people-by-role-and-skills}

    Gabungkan role, senioritas, lokasi, keahlian yang relevan, dan jenis sumber yang Anda inginkan.

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

### Saring orang berdasarkan company traits {#qualify-people-by-company-traits}

    Jelaskan hubungan orang tersebut dengan perusahaan serta karakteristik yang menjadi syarat bagi perusahaan itu. Cara ini lebih efektif daripada menyusun daftar perusahaan terlebih dahulu.

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

### Temukan situs web pribadi dan karya publik {#find-personal-websites-and-public-work}

    Sebutkan profesi atau bidang research, lalu minta secara eksplisit situs web pribadi, ceramah, wawancara, atau artikel.

    <PlaygroundQuery query="personal blogs of distributed systems researchers" />
  </Tab>
</Tabs>

## Cari keduanya sekaligus {#search-both-together}

Tulis satu query yang menyatakan keterkaitan yang Anda butuhkan. Exa dapat mengembalikan halaman perusahaan, profil profesional, halaman lowongan kerja, dan referensi publik dalam satu kumpulan hasil yang sama.

<PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />

## Membuat permintaan {#make-a-request}

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

## Mendapatkan data terstruktur dengan Exa Agent {#get-structured-data-with-exa-agent}

Untuk data terstruktur yang memerlukan research di berbagai sources, gunakan [Exa Agent task run](/id/docs/agent/quickstart). Jelaskan perusahaan, orang, kriteria kualifikasi, dan output fields yang Anda butuhkan, lalu Agent akan mengembalikan hasil yang tervalidasi terhadap schema beserta sitasi.

<Card title="Mulai Agent task" icon="bot" href="/id/docs/agent/quickstart" cta="Buka panduan Agent" arrow="true">
  Susun dan seleksi daftar perusahaan atau orang, lalu enrich setiap catatan dengan fields yang dikumpulkan dari berbagai sources.
</Card>