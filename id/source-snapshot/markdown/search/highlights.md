> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Kutipan {#highlights}

> Dapatkan kutipan yang relevan dengan query dari hasil Exa Search sambil mengendalikan ukuran konteks dan latency.

Kutipan mengembalikan potongan teks ekstraktif dari setiap hasil yang relevan dengan query Anda. Gunakan kutipan saat aplikasi Anda membutuhkan bukti dari halaman tanpa menanggung biaya token untuk teks penuh.

Setiap hasil mengembalikan potongan teks terpilih pada `results[].highlights`.

## Mengapa kutipan alih-alih teks penuh {#why-highlights-instead-of-full-text}

Kutipan dihasilkan oleh model extraction internal Exa. Model ini membaca setiap hasil berdasarkan query Anda pada setiap permintaan dan hanya mengembalikan potongan teks yang menjawabnya. Anda memakai token jauh lebih sedikit dibandingkan teks halaman penuh, dengan kualitas jawaban akhir yang setara atau lebih baik.

| Evaluasi                         | Hasil                                                                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Akurasi (SimpleQA)               | 500 karakter kutipan menyamai akurasi 8.000 karakter pertama teks halaman, dengan token 16x lebih sedikit                                        |
| Kualitas pada budget lebih besar | 4.000 karakter kutipan mengungguli 32.000 karakter teks penuh                                                                                    |
| Dokumen teknis panjang           | Pada budget 500 karakter, kutipan mencapai akurasi 60% pada API reference, dokumentasi SDK, spesifikasi, dan paper; teks penuh hanya mencapai 6% |
| Penggunaan token search          | Kutipan memangkas token search rata-rata 5x                                                                                                      |

Penghematan ini paling terasa dalam loop agent, ketika setiap putaran hasil search harus berebut konteks dengan jejak penalaran.

<Tip>
  Baca [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)
  untuk metodologi dan hasil lengkapnya.
</Tip>

## Menambahkan kutipan ke Search {#add-highlights-to-search}

Gunakan `highlights: true` di dalam `contents` sebagai default yang direkomendasikan. Exa yang menentukan seberapa banyak teks dikembalikan dari setiap hasil berdasarkan relevance-nya terhadap query Anda, sehingga tidak ada character budget yang perlu disetel. Atur `maxCharacters` hanya jika aplikasi Anda memerlukan batas tetap per halaman.

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

## Dynamic Highlights {#dynamic-highlights}

Dynamic Highlights menyesuaikan seberapa banyak teks yang diambil dari setiap hasil berdasarkan apa yang paling berguna untuk query Anda. Fitur ini dapat mengambil lebih banyak dari sources yang kuat dan lebih sedikit dari sources yang repetitif atau tidak relevan, sehingga mengurangi total token yang dikembalikan.

Gunakan fitur ini ketika beberapa hasil akan masuk ke agent atau jendela konteks yang sama. Tetap gunakan `highlights: true` biasa jika setiap halaman memerlukan kutipannya sendiri atau batas per halaman yang dapat diprediksi.

Dalam evaluasi Exa, Dynamic Highlights memangkas token rata-rata 95% dibandingkan konten halaman penuh. Pada anggaran 12.000 karakter, fitur ini mengungguli kutipan biasa dengan peningkatan efisiensi token rata-rata 40% dan kenaikan kualitas 3,8%. Di dalam Exa Agent, fitur ini memangkas total penggunaan token agent sebesar 30% dengan rata-rata kenaikan kualitas 2,1% pada benchmark seperti BrowseComp dan WideSearch.

<Tip>
  Baca [Dynamic Highlights](https://exa.ai/blog/dynamic-highlights) untuk hasil evaluasi dan
  desain di balik pemilihan kutipan lintas hasil.
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
  Dynamic Highlights adalah pratinjau riset dan memerlukan header permintaan
  `Exa-Beta: dynamic-highlights-2026-08-28`. SDK akan mengirimkannya saat Anda meneruskan
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) atau `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript).

  Response menggunakan bentuk
  `results[].highlights` yang sama dengan kutipan biasa.
</Info>

## Langkah selanjutnya {#next-steps}

<Columns cols={2}>
  <Card title="Panduan Search API" icon="search" href="/id/docs/search/quickstart" cta="Buka panduan" arrow="true">
    Susun permintaan Search dan pilih bentuk output yang tepat.
  </Card>

  <Card title="Praktik terbaik search" icon="sparkles" href="/id/docs/search/best-practices" cta="Baca panduan" arrow="true">
    Atur kualitas retrieval, latency, kebaruan, dan context size.
  </Card>
</Columns>