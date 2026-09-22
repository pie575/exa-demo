<div id="verification-against-exa-production">
  # Verifikasi terhadap Exa production
</div>

Snapshot production: 18 September 2026. Preview lokal: http://localhost:3000/docs.

| Pemeriksaan                       | Hasil                                                                                                                           | Evidence                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Inventaris sumber dan navigasi    | 159 dari 159 halaman; tidak ada halaman yang hilang atau berlebih                                                               | [Audit konten](content-audit.json)                    |
| Rendering halaman HTTP            | 159 dari 159 rute ter-render                                                                                                    | [Audit rute](route-audit.json)                        |
| Konten API ter-render lengkap     | 69 dari 69 cocok dengan production setelah normalisasi spasi                                                                    | [Perbandingan API](api-content-audit.json)            |
| Tautan internal dan referensi API | 378 tautan yang ditulis dan seluruh 69 path/metode schema lolos                                                                 | [Audit konten](content-audit.json)                    |
| Unduhan yang dipublikasikan       | Seluruh 9 export Markdown, LLM, dan schema yang diuji berhasil di-resolve dengan payload yang cocok                             | [Audit export](exports-report.json)                   |
| Perilaku interaktif               | Seluruh 11 pemeriksaan browser lolos, tanpa error halaman                                                                       | [Audit interaksi](interaction-audit.json)             |
| Tata letak desktop                | Seluruh 159 rute cocok dengan geometri terukur dan tinggi konten penuh; tidak ada error runtime atau gambar rusak yang terlihat | [Ringkasan visual](visual-summary.json)               |
| Mode seluler dan gelap            | 10 perbandingan pada 5 rute representatif; tata letak terukur cocok, tanpa overflow horizontal atau gambar rusak yang terlihat  | [Perbandingan seluler/tema](mobile-theme/report.json) |
| Build dan tautan Mintlify         | `pnpm validate` dan `pnpm check:links` lolos                                                                                    | Perintah yang dapat direproduksi di bawah ini         |

Pemeriksaan interaksi mencakup seluruh selector contoh di halaman beranda, search
teks lengkap lokal dan navigasi keyboard, hasil kosong, Escape, penyalinan clipboard,
pergantian tema, rendering schema API, seluruh tujuh tab spreadsheet Agent, serta
navigasi/search seluler.

<div id="blind-visual-review">
  ## Tinjauan visual buta
</div>

[Buka galeri perbandingan A/B 159 halaman](blind/index.html). Dua
tangkapan layar pada setiap halaman diacak secara terpisah. Galeri menyimpan preferensi A/B/seri
di peramban. Empat pasangan desktop/seluler yang mewakili juga ditinjau
tanpa melihat kunci identitas: [tinjauan akhir](blind/final-review.md).
Tinjauan independen sebelumnya beserta tangkapan layar yang bersesuaian diarsipkan di
`blind/review-round-2/`.

Tinjauan akhir pada sampel yang mewakili tidak menemukan keunggulan estetika yang berarti pada
salah satu versi. Dua pasangan akhir yang mewakili identik secara bitmap; dua lainnya
hanya berbeda pada 8 dan 1 piksel di ambang yang tercatat
([pengukuran piksel](representative-pixel-comparison.json)). Ini merupakan pemeriksaan
terhadap viewport yang ditangkap, bukan klaim bahwa seluruh piksel identik atau
bahwa layanan yang dihosting setara. Dari 159 halaman, body teks cocok pada 158 halaman;
satu-satunya perbedaan adalah timestamp pemeriksaan pada status page langsung.

<div id="fidelity-details">
  ## Detail kesetiaan
</div>

Impor ini mempertahankan tema production, navigasi, gaya dan skrip kustom,
font, metadata halaman, spesifikasi API, serta komponen MDX asli.
Impor juga memulihkan spreadsheet Agent Examples yang tidak disertakan dalam
export Markdown, serta 85 label modifikasi terpublikasi yang terlewat oleh
renderer lokal. Response dan checksum asli disimpan di `source-snapshot/`.

Asisten AI yang dihosting Exa tidak tersedia di pratinjau lokal Mintlify. Kontrol
lokalnya justru membuka pencarian dokumentasi yang berfungsi. Dashboard eksternal
dan tujuan API playground tetap bersifat eksternal. URL unduhan Markdown dan schema
menggunakan pengalihan ke payload `.txt` yang identik karena server pengembangan
native tidak menyajikan ekstensi file tersebut secara langsung. Timestamp status
langsung dan media beranimasi dapat berbeda antar pengambilan.

<div id="reproduce">
  ## Reproduksi
</div>

```sh
pnpm validate
pnpm check:links
pnpm audit:content
pnpm dev
# Di terminal lain, saat pratinjau sedang berjalan:
python3 verification/audit-content.py --url http://localhost:3000 --output verification/route-audit.json
python3 verification/check-exports.py
node verification/audit-interactions.mjs
node verification/audit-api-content.mjs
node verification/compare-all.mjs
node verification/mobile-theme-check.mjs
node verification/build-blind-gallery.mjs
```

Browser checks memerlukan Google Chrome dan menggunakan package Playwright yang sudah terinstal.
Tangkapan layar seluruh halaman merupakan artefak yang dihasilkan secara lokal dan dikecualikan dari Git;
buat ulang tangkapan layar tersebut sebelum menggunakan galeri pada checkout yang baru.