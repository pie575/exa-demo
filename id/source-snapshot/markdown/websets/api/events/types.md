> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="event-types">
  # Jenis event
</div>

> Pelajari event yang terjadi di dalam Webset API

Websets API menggunakan event untuk memberi tahu Anda tentang perubahan pada Websets Anda. Anda dapat memantau event ini melalui [endpoint events](/id/docs/websets/api/events/list-all-events) kami atau dengan menyiapkan [webhook](/id/docs/websets/api/webhooks/create-a-webhook).

Event disimpan selama 60 hari sebelum dihapus secara otomatis.

<div id="webset">
  ## Webset
</div>

* `webset.created` - Dikirim saat Webset baru dibuat.
* `webset.deleted` - Dikirim saat sebuah Webset dihapus.
* `webset.paused` - Dikirim saat operasi sebuah Webset dijeda.
* `webset.idle` - Dikirim saat sebuah Webset tidak memiliki operasi yang sedang berjalan.

<div id="search">
  ## Search
</div>

* `webset.search.created` - Dikirim saat search baru dimulai.
* `webset.search.updated` - Dikirim saat progres search diperbarui.
* `webset.search.completed` - Dikirim saat search selesai menemukan semua item.
* `webset.search.canceled` - Dikirim saat search dibatalkan secara manual.

<div id="item">
  ## Item
</div>

* `webset.item.created` - Dikirim saat item baru ditambahkan ke Webset.
* `webset.item.enriched` - Dikirim saat enrichment sebuah item selesai.

<div id="import">
  ## Impor
</div>

* `import.created` - Dikirim saat impor baru dimulai.
* `import.completed` - Dikirim saat impor telah selesai.

<div id="export">
  ## Export
</div>

* `webset.export.created` - Dikirim saat export baru dimulai.
* `webset.export.completed` - Dikirim saat export telah selesai.

<div id="monitor">
  ## Monitor
</div>

* `monitor.created` - Dikirim saat monitor baru dibuat.
* `monitor.updated` - Dikirim saat konfigurasi monitor diperbarui.
* `monitor.deleted` - Dikirim saat monitor dihapus.
* `monitor.run.created` - Dikirim saat run monitor dimulai.
* `monitor.run.completed` - Dikirim saat run monitor selesai.

Setiap event mencakup:

* `id` yang unik
* `type` event
* Objek `data` yang berisi sumber daya lengkap pemicu event tersebut
* Timestamp `createdAt`

Anda dapat menggunakan event ini untuk:

* Melacak progres search dan enrichment
* Membangun dashboard real-time
* Memicu workflow saat item baru ditemukan
* Memantau status export Anda