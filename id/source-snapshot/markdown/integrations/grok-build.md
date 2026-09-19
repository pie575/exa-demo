> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="grok-build">
  # Grok Build
</div>

> Gunakan Exa web search di Grok Build. Instal plugin Exa dari marketplace Grok Build dan masuk dengan akun Exa Anda.

Exa tersedia sebagai plugin di marketplace [Grok Build](https://docs.x.ai/build/overview). Plugin ini memberikan Grok kemampuan web search real-time, pembacaan halaman, dan deep research skill.

<div id="installation">
  ## Instalasi
</div>

<Steps>
  <Step title="Instal Grok Build">
    Instal Grok CLI (lihat [dokumentasi Grok Build](https://docs.x.ai/build/overview) untuk detailnya):

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    Lalu masuk ke akun xAI Anda:

    ```bash theme={null}
    grok login
    ```
  </Step>

  <Step title="Buka marketplace">
    Jalankan `grok` untuk memulai Grok Build, lalu buka marketplace:

    ```text theme={null}
    /marketplace
    ```
  </Step>

  <Step title="Instal plugin Exa">
    Cari **exa** di daftar, lalu tekan `i` untuk menginstalnya.
  </Step>

  <Step title="Masuk ke Exa">
    Buka tab MCP server dengan `/mcp`, pilih **exa**, lalu tekan `i` untuk masuk. Peramban Anda akan membuka halaman masuk Exa. Akun baru mendapatkan credits gratis saat mendaftar.
  </Step>
</Steps>

Setelah exa berstatus **ready**, tanyakan apa pun kepada Grok yang memerlukan akses web.

<div id="what-you-get">
  ## Apa yang Anda dapatkan
</div>

* **web&#95;search&#95;exa**: web search real-time. Mendukung kueri bahasa alami dan filter kategori seperti berita, perusahaan, orang, makalah riset, dan GitHub.
* **web&#95;fetch&#95;exa**: membaca URL apa pun dan mengembalikan page content dalam bentuk markdown yang bersih.
* **exa-search skill**: sebuah deep research skill. Minta Grok mendalami suatu topik, dan ia akan menjalankan beberapa search, membaca sumber-sumber terbaik, lalu menjawab dengan citations.

<div id="example-prompts">
  ## Contoh prompt
</div>

* &quot;Cari berita terbaru tentang xAI&quot;
* &quot;Baca [https://exa.ai](https://exa.ai) lalu ringkas isinya&quot;
* &quot;Lakukan penelusuran mendalam tentang mesin inferensi open source&quot;