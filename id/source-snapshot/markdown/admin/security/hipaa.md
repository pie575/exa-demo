> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="hipaa">
  # HIPAA
</div>

> Gunakan mode HIPAA compliance untuk permintaan cached retrieval yang memenuhi syarat.

<Info>
  HIPAA compliance tersedia bagi pelanggan Enterprise setelah Exa mengaktifkannya untuk team Anda. Hubungi [sales@exa.ai](mailto:sales@exa.ai) untuk membahas akses Enterprise, persyaratan BAA, dan proses pengaktifannya.
</Info>

Mode HIPAA diatur per permintaan melalui field `compliance` di level teratas:

```json theme={null}
{
  "compliance": "hipaa"
}
```

Ketika field ini ada pada team yang memenuhi syarat, Exa memproses permintaan tersebut dengan kontrol HIPAA compliance. Jika team Anda belum diaktifkan, API akan mengembalikan `403 FEATURE_DISABLED`.

Mode HIPAA mencakup [Zero Data Retention](/id/docs/admin/security/zero-data-retention) untuk permintaan tersebut: Exa tidak menyimpan PHI.

<div id="supported-endpoints">
  ## Endpoint yang didukung
</div>

Field `compliance` dikenali pada:

* [`/search`](/id/docs/reference/search)
* [`/contents`](/id/docs/reference/get-contents)

Endpoint lainnya akan menolak field ini.

<div id="requirements">
  ## Persyaratan
</div>

Mode HIPAA hanya mendukung cached retrieval. Permintaan yang kompatibel:

* Pada `/search`, atur `type` ke `instant` atau `fast`
* Minta `text` atau `highlights` (bukan `summary`)
* Gunakan konten dari cache saja: hilangkan field kebaruan, atau atur `maxAgeHours: -1` pada `/contents`

Permintaan yang tidak kompatibel akan mengembalikan `400 INVALID_REQUEST_BODY`, termasuk:

* `summary` pada `/contents`, atau `contents.summary` pada `/search`
* Pengaturan kebaruan yang mengharuskan pengambilan langsung, seperti `maxAgeHours: 0` atau `maxAgeHours` bernilai positif
* Permintaan search yang tidak menyertakan `type`, atau menggunakan tipe selain `instant` atau `fast`

<div id="example">
  ## Contoh
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "urls": ["https://example.com/article"],
      "compliance": "hipaa",
      "highlights": true,
      "maxAgeHours": -1
    }'
  ```
</CodeGroup>

<div id="access">
  ## Akses
</div>

Untuk mengaktifkan mode HIPAA pada team Anda, hubungi [sales@exa.ai](mailto:sales@exa.ai). Lihat [Trust Center](https://trust.exa.ai) untuk dokumentasi keamanan Exa.