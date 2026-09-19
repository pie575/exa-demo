> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="highlights">
  # Highlights
</div>

> Kembalikan excerpt yang relevan dengan query dari hasil Exa Search sekaligus mengendalikan konteks size dan latensi.

Highlights mengembalikan cuplikan ekstraktif dari setiap hasil yang relevan dengan query Anda. Gunakan highlights saat aplikasi Anda membutuhkan evidence dari sebuah halaman tanpa harus menanggung biaya token untuk teks lengkap.

Setiap hasil mengembalikan cuplikan terpilihnya pada `results[].highlights`.

<div id="why-highlights-instead-of-full-text">
  ## Mengapa highlights alih-alih teks lengkap
</div>

Highlights dihasilkan oleh model extraction internal Exa. Model ini membaca setiap hasil terhadap query Anda pada setiap permintaan dan hanya mengembalikan bagian teks yang menjawabnya. Anda hanya memakai sebagian kecil token dari teks halaman lengkap, dengan kualitas jawaban akhir yang setara atau lebih baik.

| Evaluasi                         | Hasil                                                                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Akurasi (SimpleQA)               | 500 karakter highlights menyamai akurasi 8.000 karakter pertama teks halaman, dengan token 16x lebih sedikit                                  |
| Kualitas pada budget lebih besar | 4.000 karakter highlights mengungguli 32.000 karakter teks lengkap                                                                            |
| Dokumen teknis panjang           | Pada budget 500 karakter, highlights mencapai akurasi 60% pada referensi API, dokumentasi SDK, spesifikasi, dan papers; teks lengkap hanya 6% |
| Usage token search               | Highlights memangkas token search rata-rata hingga 5x                                                                                         |

Penghematan ini paling terasa pada loop agent, di mana setiap putaran hasil search harus berebut konteks dengan jejak penalaran.

<Tip>
  Baca [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)
  untuk metodologi dan hasil lengkapnya.
</Tip>

<div id="add-highlights-to-search">
  ## Menambahkan highlights ke Search
</div>

Gunakan `highlights: true` di dalam `contents` sebagai default yang direkomendasikan. Exa menentukan sendiri seberapa banyak teks yang dikembalikan dari setiap hasil berdasarkan relevansinya dengan query Anda, jadi tidak ada character budget yang perlu disetel. Atur `maxCharacters` hanya jika aplikasi Anda memerlukan limit tetap per halaman.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "How are inference providers reducing transformer latency?",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "How are inference providers reducing transformer latency?",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "How are inference providers reducing transformer latency?",
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

<div id="dynamic-highlights">
  ## Dynamic Highlights
</div>

Dynamic Highlights menyesuaikan seberapa banyak teks yang diambil dari setiap hasil berdasarkan apa yang paling berguna untuk query Anda. Fitur ini bisa mengambil lebih banyak dari sumber yang kuat dan lebih sedikit dari sumber yang repetitif atau tidak relevan, sehingga total token yang dikembalikan berkurang.

Gunakan fitur ini ketika beberapa hasil akan dialirkan ke agent atau jendela konteks yang sama. Tetap gunakan `highlights: true` biasa jika setiap halaman memerlukan excerpt tersendiri atau limit per halaman yang dapat diprediksi.

Dalam evaluasi Exa, Dynamic Highlights memangkas token rata-rata 95% dibandingkan page content penuh. Pada character budget 12.000 karakter, fitur ini mengungguli highlights biasa dengan peningkatan efisiensi token rata-rata 40% dan kenaikan kualitas 3,8%. Di dalam Exa Agent, fitur ini memangkas total usage token agent sebesar 30% dengan rata-rata kenaikan kualitas 2,1% pada benchmark seperti BrowseComp dan WideSearch.

<Tip>
  Baca [Dynamic Highlights](https://exa.ai/blog/dynamic-highlights) untuk hasil evaluasi dan
  rancangan di balik pemilihan highlight lintas hasil.
</Tip>

Aktifkan dengan `dynamic: true`:

<CodeGroup>
  ```python Python theme={null}
  from exa_py.api import DYNAMIC_HIGHLIGHTS_BETA

  result = exa.search(
      "How did US household solar installation costs change over the past five years?",
      contents={
          "highlights": {
              "dynamic": True,
          }
      },
      betas=[DYNAMIC_HIGHLIGHTS_BETA],
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa, { DYNAMIC_HIGHLIGHTS_BETA } from "exa-js";

  const result = await exa.search(
    "How did US household solar installation costs change over the past five years?",
    {
      contents: {
        highlights: {
          dynamic: true
        }
      },
      betas: [DYNAMIC_HIGHLIGHTS_BETA]
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: dynamic-highlights-2026-08-28" \
    -d '{
      "query": "How did US household solar installation costs change over the past five years?",
      "contents": {
        "highlights": {
          "dynamic": true
        }
      }
    }'
  ```
</CodeGroup>

<Info>
  Dynamic Highlights masih berupa pratinjau riset dan memerlukan header permintaan
  `Exa-Beta: dynamic-highlights-2026-08-28`. SDK akan mengirimkannya saat Anda meneruskan
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) atau `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript).

  Respons menggunakan struktur
  `results[].highlights` yang sama dengan highlights biasa.
</Info>

<div id="next-steps">
  ## Langkah selanjutnya
</div>

<Columns cols={2}>
  <Card title="Panduan Search API" icon="search" href="/id/docs/search/quickstart" cta="Buka panduan" arrow="true">
    Buat Search request dan pilih bentuk output yang tepat.
  </Card>

  <Card title="Praktik terbaik search" icon="sparkles" href="/id/docs/search/best-practices" cta="Baca panduan" arrow="true">
    Optimalkan kualitas retrieval, latensi, freshness, dan konteks size.
  </Card>
</Columns>