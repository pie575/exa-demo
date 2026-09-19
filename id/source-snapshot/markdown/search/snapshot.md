> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="exa-snapshot">
  # Exa Snapshot
</div>

> Sematkan Search dan Contents ke stored version suatu halaman pada datetime yang Anda pilih.

Exa Snapshot menyimpan stored version dari halaman-halaman yang telah di-crawl Exa. Kirim `snapshotAsOf` untuk menyematkan permintaan ke suatu datetime.

Gunakan ini untuk melakukan backtest agent, menjalankan eval yang dapat direproduksi, serta membandingkan versi terdahulu dari dokumentasi, halaman harga, kebijakan, dan filings.

<Info>
  Exa Snapshot tersedia dengan model pay as you go pada 10 QPS, dengan jendela indeks bergulir selama 5 bulan.
  Setelah 100 permintaan, [hubungi tim sales](https://exa.ai/contact/sales) untuk melanjutkan.
</Info>

<div id="search-at-a-datetime">
  ## Pencarian pada suatu datetime
</div>

Pada `/search`, letakkan `snapshotAsOf` di dalam `contents`.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "latest stable Python release notes",
      num_results=3,
      contents={
          "snapshot_as_of": "2026-07-01T00:00:00Z",
          "highlights": True,
      },
  )

  for r in result.results:
      print(r.title, r.url)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search("latest stable Python release notes", {
    numResults: 3,
    contents: {
      snapshotAsOf: "2026-07-01T00:00:00Z",
      highlights: true
    }
  });

  for (const r of result.results) {
    console.log(r.title, r.url);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "latest stable Python release notes",
      "numResults": 3,
      "contents": {
        "snapshotAsOf": "2026-07-01T00:00:00Z",
        "highlights": true
      }
    }'
  ```
</CodeGroup>

Exa menemukan URL kandidat, lalu hanya mempertahankan halaman yang memiliki stored version pada atau sebelum `snapshotAsOf`.

<Accordion title="Contoh respons">
  ```json theme={null}
  {
    "requestId": "211fc1f57b87a792de082309ef3bce95",
    "results": [
      {
        "id": "https://docs.python.org/3/whatsnew/changelog.html",
        "url": "https://docs.python.org/3/whatsnew/changelog.html",
        "title": "Changelog — Python 3.14.6 documentation",
        "highlights": [
          "Changelog — Python 3.14.6 documentation\n...\n## Python 3.14.6 final¶\n...\nRelease date: 2026-06-10"
        ],
        "image": "https://docs.python.org/3.14/_images/social_previews/..."
      },
      {
        "id": "https://docs.python.org/3/whatsnew/index.html",
        "url": "https://docs.python.org/3/whatsnew/index.html",
        "title": "What's New in Python — Python 3.14.6 documentation",
        "highlights": ["What's new in Python\n...\n- Python 3.14.6 final\n- Python 3.14.5 final"]
      },
      {
        "id": "https://docs.python.org/3/whatsnew/3.14.html",
        "url": "https://docs.python.org/3/whatsnew/3.14.html",
        "title": "What's new in Python 3.14 — Python 3.14.6 documentation",
        "highlights": ["Python 3.14 is the latest stable release of the Python programming language..."]
      }
    ]
  }
  ```
</Accordion>

<div id="pin-contents-to-a-datetime">
  ## Sematkan contents ke suatu datetime
</div>

Tambahkan `snapshotAsOf` pada level teratas permintaan `/contents`.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://en.wikipedia.org/wiki/2026"],
      snapshot_as_of="2026-06-01T00:00:00Z",
      text=True,
  )

  print(result.results[0].text[:300])
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://en.wikipedia.org/wiki/2026"],
    {
      snapshotAsOf: "2026-06-01T00:00:00Z",
      text: true
    }
  );

  console.log(result.results[0].text.slice(0, 300));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://en.wikipedia.org/wiki/2026"],
      "snapshotAsOf": "2026-06-01T00:00:00Z",
      "text": true
    }'
  ```
</CodeGroup>

Exa mengembalikan stored version terbaru pada atau sebelum datetime tersebut.

<Accordion title="Contoh respons">
  ```json theme={null}
  {
    "requestId": "c05151f7df9cd9d8785e0acf0935355d",
    "results": [
      {
        "id": "https://en.wikipedia.org/wiki/2026",
        "url": "https://en.wikipedia.org/wiki/2026",
        "title": "2026",
        "author": null,
        "text": "2026\n\n2026 (MMXXVI) is the current year, and is a common year starting on Thursday of the Gregorian calendar...",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/..."
      }
    ],
    "statuses": [
      {
        "id": "https://en.wikipedia.org/wiki/2026",
        "status": "success",
        "source": "cached"
      }
    ]
  }
  ```
</Accordion>

<Tip>
  ID yang tidak memiliki versi yang memenuhi syarat tidak disertakan dalam `results` dan dilaporkan di `statuses` dengan
  `"status": "error"` dan `"tag": "CONTENT_NOT_CACHED"`.
</Tip>

<div id="how-snapshots-work">
  ## Cara kerja snapshot
</div>

| Field          | Lokasi  | Arti                                                                                       |
| -------------- | ------- | ------------------------------------------------------------------------------------------ |
| `snapshotAsOf` | Request | Batas datetime. Exa mengembalikan stored version terbaru pada atau sebelum waktu tersebut. |

Untuk kedua endpoint:

* Page content yang dikembalikan berasal dari stored version tersebut.
* Judul, penulis, tanggal publikasi, teks, highlights, dan summaries hanya dihasilkan dari versi tersebut.
* Halaman yang tidak memiliki versi yang memenuhi syarat dalam rentang 5 bulan tidak akan disertakan.

<Note>
  Pada Search, batas waktu ini membatasi konten, bukan peringkat. Exa tetap menggunakan sinyal retrieval terkini untuk
  menemukan URL kandidat. Gunakan hasilnya sebagai evidence yang dibatasi oleh `snapshotAsOf`, bukan sebagai
  rekonstruksi persis dari peringkat search pada saat itu.
</Note>

<div id="limits-and-compatibility">
  ## Batasan dan kompatibilitas
</div>

<AccordionGroup>
  <Accordion title="Akses, rate limit, dan rentang riwayat">
    Pay as you go mencakup 10 QPS dan akses indeks bergulir selama 5 bulan. Nilai `snapshotAsOf` yang lebih lama
    dari rentang tersebut akan ditolak. Setelah 100 permintaan, [hubungi tim sales](https://exa.ai/contact/sales)
    untuk melanjutkan.
  </Accordion>

  <Accordion title="Permintaan historis menggunakan konten tersimpan">
    Jangan gabungkan `snapshotAsOf` dengan opsi yang dapat mengakses web secara langsung atau meluas ke halaman lain.
    Hilangkan `livecrawl`, `livecrawlTimeout`, `maxAgeHours`, dan `subpages` sepenuhnya; permintaan yang menyetel
    salah satu di antaranya bersama `snapshotAsOf` akan ditolak dengan `INVALID_REQUEST`.
  </Accordion>

  <Accordion title="Search request yang didukung">
    Exa Snapshot pada Search mendukung `auto`, `fast`, dan `instant`, tetapi tidak mendukung
    `deep-lite`, `deep`, atau `deep-reasoning`.

    Exa Snapshot tidak mendukung parameter `category` pada Search.
  </Accordion>
</AccordionGroup>

<div id="common-uses">
  ## Penggunaan umum
</div>

Gunakan Exa Snapshot saat tugas Anda bergantung pada apa yang tersimpan di Exa pada datetime tertentu:

* Melakukan backtest pada agent tanpa terpengaruh pembaruan halaman yang lebih baru.
* Menjalankan evaluasi terhadap batas konten yang dapat direproduksi.
* Membandingkan versi lama dari dokumentasi, harga, kebijakan, atau filings.