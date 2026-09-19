> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="elevenlabs">
  # ElevenLabs
</div>

> Tambahkan Exa web search ke voice agent ElevenLabs.

***

Voice agent ElevenLabs dapat melakukan search di web di tengah percakapan dengan memakai Exa sebagai **webhook tool**. Saat agent memutuskan bahwa ia butuh informasi terkini, ElevenLabs mengirim HTTP POST langsung ke endpoint `/search` milik Exa — tanpa perlu server atau middleware di sisi Anda.

Ada dua cara menghubungkan Exa ke ElevenLabs:

| Pendekatan                           | Penyiapan                              | Fleksibilitas                                                    |
| ------------------------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| **Webhook tool** (direkomendasikan)  | Konfigurasi melalui API atau dashboard | Kendali penuh atas parameter search, content options, dan header |
| **Built-in Exa integration** (alpha) | Sekali klik di dashboard ElevenLabs    | Lebih sederhana, tetapi konfigurasinya terbatas                  |

Panduan ini membahas pendekatan webhook tool, yang memberi Anda kendali penuh atas cara Exa dipanggil. Anda juga bisa mengatur integrasi ini lewat [dashboard ElevenLabs](https://elevenlabs.io/app/conversational-ai).

<div id="how-it-works">
  ## Cara kerjanya
</div>

1. Pengguna berbicara dengan voice agent
2. LLM memutuskan untuk memanggil `web_search` berdasarkan deskripsi tool
3. ElevenLabs mengirim POST ke `https://api.exa.ai/search` dengan header dan body yang Anda konfigurasikan
4. Parameter yang ditentukan LLM (yaitu `query` pencarian) digabungkan dengan nilai konstan Anda (`type`, `numResults`, `contents`)
5. Hasil dari Exa dikembalikan ke LLM, yang lalu merespons secara percakapan

Tanpa server, tanpa callback URL, tanpa listener. ElevenLabs bertindak sebagai klien HTTP yang memanggil Exa secara langsung. Pemanggilan tool memiliki batas waktu 20 detik.

<div id="prerequisites">
  ## Prasyarat
</div>

* [Exa API key](https://dashboard.exa.ai/api-keys)
* [ElevenLabs API key](https://elevenlabs.io/app/settings/api-keys)

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru langsung mendapat credits gratis.
</Card>

<div id="get-started">
  ## Get started
</div>

<Steps>
  <Step title="Buat webhook tool">
    Gunakan [Create Tool API](https://elevenlabs.io/docs/api-reference/tools/create) dari ElevenLabs untuk mendaftarkan webhook tool yang mengarah ke endpoint search Exa.

    Konsep utamanya: properti dengan `constant_value` bersifat tetap (dikirim pada setiap permintaan), sedangkan properti dengan `description` ditentukan oleh LLM saat runtime.

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/tools" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "tool_config": {
          "type": "webhook",
          "name": "web_search",
          "description": "Search the web using Exa. Use this when the user asks anything that needs current or factual information.",
          "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
              "x-api-key": "YOUR_EXA_API_KEY",
              "Content-Type": "application/json",
              "x-exa-integration": "elevenlabs"
            },
            "request_body_schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "description": "Natural language search query. Be specific."
                },
                "type": {
                  "type": "string",
                  "constant_value": "instant"
                },
                "numResults": {
                  "type": "integer",
                  "constant_value": 5
                },
                "contents": {
                  "type": "object",
                  "properties": {
                    "highlights": {
                      "type": "boolean",
                      "constant_value": true
                    }
                  }
                }
              },
              "required": ["query"]
            }
          }
        }
      }'
    ```

    Perintah ini membuat tool dengan ketentuan berikut:

    * `query` — diisi oleh LLM berdasarkan konteks percakapan
    * `type: "instant"` — menggunakan search mode tercepat dari Exa (~150ms)
    * `numResults: 5` — mengembalikan 5 hasil per search
    * `contents.highlights: true` — mengembalikan cuplikan highlights yang hemat token (paling cocok untuk latensi suara)

    Simpan `id` yang dikembalikan — Anda membutuhkannya untuk menghubungkan tool ke sebuah agent.

    <Note>
      Jika Anda sudah punya agent, Anda bisa melewati langkah 2 dan menambahkan tool ke agent yang sudah ada melalui dashboard ElevenLabs di **Agent &gt; Tools**, atau lewat [Update Agent API](https://elevenlabs.io/docs/api-reference/agents/update). Tool tidak akan berfungsi sebelum di-attach ke sebuah agent.
    </Note>
  </Step>

  <Step title="Buat agent dengan tool tersebut">
    Buat agent percakapan, lalu attach webhook tool tersebut menggunakan ID-nya.

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/agents/create" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Exa Search Assistant",
        "conversation_config": {
          "agent": {
            "prompt": {
              "prompt": "You are a helpful voice assistant with real-time web search powered by Exa. When users ask questions that need current information, use the web_search tool.\n\nGuidelines:\n- Search proactively for time-sensitive or factual questions.\n- Summarize results conversationally — do not read URLs aloud.\n- Cite sources naturally.\n- Keep responses concise — this is voice.",
              "tool_ids": ["YOUR_TOOL_ID"]
            },
            "first_message": "Hey! I can search the web for you in real-time. What would you like to know?"
          }
        }
      }'
    ```

    Respons berisi `agent_id`. Buka agent tersebut di dashboard ElevenLabs untuk mengujinya:

    ```text theme={null}
    https://elevenlabs.io/app/conversational-ai/agents/YOUR_AGENT_ID
    ```
  </Step>

  <Step title="Sematkan widget">
    Tambahkan agent ke halaman web mana pun hanya dengan dua baris HTML:

    ```html html theme={null}
    <elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
    ```
  </Step>
</Steps>

<div id="full-python-example">
  ## Contoh Python lengkap
</div>

Skrip ini membuat webhook tool sekaligus agent dalam satu run:

```python python theme={null}
import os
import requests

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]
EXA_API_KEY = os.environ["EXA_API_KEY"]
BASE = "https://api.elevenlabs.io/v1/convai"
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

# 1. Buat webhook tool
tool_resp = requests.post(f"{BASE}/tools", headers=HEADERS, json={
    "tool_config": {
        "type": "webhook",
        "name": "web_search",
        "description": (
            "Search the web using Exa. Use this when the user asks anything "
            "that needs current or factual information."
        ),
        "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
                "x-api-key": EXA_API_KEY,
                "Content-Type": "application/json",
                "x-exa-integration": "elevenlabs",
            },
            "request_body_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Natural language search query. Be specific.",
                    },
                    "type": {"type": "string", "constant_value": "instant"},
                    "numResults": {"type": "integer", "constant_value": 5},
                    "contents": {
                        "type": "object",
                        "properties": {
                            "highlights": {
                                "type": "boolean",
                                "constant_value": True,
                            }
                        },
                    },
                },
                "required": ["query"],
            },
        },
    }
})
tool_resp.raise_for_status()
tool_id = tool_resp.json()["id"]
print(f"Tool created: {tool_id}")

# 2. Buat agent
agent_resp = requests.post(f"{BASE}/agents/create", headers=HEADERS, json={
    "name": "Exa Search Assistant",
    "conversation_config": {
        "agent": {
            "prompt": {
                "prompt": (
                    "You are a helpful voice assistant with real-time web search "
                    "powered by Exa. When users ask questions that need current "
                    "information, use the web_search tool.\n\n"
                    "Guidelines:\n"
                    "- Search proactively for time-sensitive or factual questions.\n"
                    "- Summarize results conversationally — do not read URLs aloud.\n"
                    "- Cite sources naturally.\n"
                    "- Keep responses concise — this is voice."
                ),
                "tool_ids": [tool_id],
            },
            "first_message": "Hey! I can search the web for you. What would you like to know?",
        }
    },
})
agent_resp.raise_for_status()
agent_id = agent_resp.json()["agent_id"]
print(f"Agent created: {agent_id}")
print(f"Dashboard: https://elevenlabs.io/app/conversational-ai/agents/{agent_id}")
```

Jalankan:

```bash bash theme={null}
export ELEVENLABS_API_KEY="your-key"
export EXA_API_KEY="your-key"
python elevenlabs_exa_webhook.py
```

<div id="customizing-search-parameters">
  ## Menyesuaikan search parameters
</div>

Body schema pada webhook tool dipetakan langsung ke [Search API Exa](/id/docs/reference/search). Berikut beberapa konfigurasi yang umum digunakan:

<div id="search-type">
  ### Search type
</div>

Atur keseimbangan antara kecepatan dan kualitas melalui konstanta `type`:

| Tipe      | Latensi | Paling cocok untuk                  |
| --------- | ------- | ----------------------------------- |
| `instant` | ~150ms  | Percakapan suara (direkomendasikan) |
| `auto`    | ~1s     | Penggunaan umum                     |

Untuk voice agent, mulailah dengan `instant`. Gunakan `auto` bila Anda ingin Exa yang menentukan search mode terbaik saat itu untuk setiap query.

<div id="content-options">
  ### Content options
</div>

Tentukan bagaimana hasil dikembalikan melalui objek `contents`:

```json json theme={null}
{
  "contents": {
    "type": "object",
    "properties": {
      "highlights": {
        "type": "boolean",
        "constant_value": true
      }
    }
  }
}
```

* **`highlights`** — Excerpt yang hemat token. Gunakan ini saat Anda ingin cuplikan yang relevan tanpa membebani konteks LLM. Berikan `true` untuk default berkualitas tertinggi.
* **`text`** — Markdown halaman secara utuh. Gunakan saat agent membutuhkan page content lengkap. Atur `maxCharacters` untuk membatasi panjangnya.
* **`summary`** — Summary tiap halaman yang dihasilkan LLM. Latensinya lebih tinggi, tetapi memberikan konten yang telah disintesis.

Untuk voice agent, `highlights: true` adalah default yang direkomendasikan — opsi ini menyeimbangkan relevansi dengan kecepatan respons.

<div id="filtering-results">
  ### Memfilter hasil
</div>

Tambahkan filter domain atau tanggal sebagai konstanta:

```json json theme={null}
{
  "includeDomains": {
    "type": "array",
    "constant_value": ["reuters.com", "apnews.com", "bbc.com"]
  }
}
```

```json json theme={null}
{
  "startPublishedDate": {
    "type": "string",
    "constant_value": "2025-01-01T00:00:00.000Z"
  }
}
```

<div id="number-of-results">
  ### Jumlah hasil
</div>

Sesuaikan `numResults` dengan kasus penggunaan Anda. Untuk aplikasi suara, 3-5 hasil menjaga respons tetap cepat. Untuk agent yang berorientasi riset, 10+ memberikan cakupan yang lebih luas.

<div id="schema-reference">
  ## Referensi schema
</div>

Webhook tool ElevenLabs menggunakan JSON schema dengan tipe properti berikut:

* **`constant_value`** — Nilai tetap yang dikirim pada setiap permintaan. LLM tidak pernah melihat maupun mengubahnya. Berlaku untuk string, angka, dan boolean.
* **`description`** — LLM menentukan nilainya saat runtime berdasarkan deskripsi ini. Gunakan untuk parameter dinamis seperti `query`.
* **Objek bersarang** — Gunakan `type: "object"` dengan `properties` untuk membangun struktur bersarang seperti `contents.highlights`.

Setiap parameter memiliki tombol pengalih mode di dashboard — **Fixed** atau **LLM**:

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/elevenlabs/parameters.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=618ca64cac86308c571a8268f48342a5" alt="Konfigurasi parameter webhook tool ElevenLabs yang menampilkan tombol pengalih mode Fixed dan LLM" width="1692" height="898" data-path="images/integrations/elevenlabs/parameters.png" />
</Frame>

Parameter yang disetel ke **Fixed** (ditandai dengan `constant_value` di API) dikirim apa adanya pada setiap permintaan. Parameter yang disetel ke **LLM** (ditandai dengan `description`) membiarkan model memilih nilainya saat runtime. Setel sebanyak mungkin parameter ke Fixed — setiap parameter yang ditentukan LLM menambah satu langkah pemanggilan tool sehingga latensi respons meningkat.

Untuk schema webhook tool ElevenLabs selengkapnya, lihat [dokumentasi server tools ElevenLabs](https://elevenlabs.io/docs/conversational-ai/customization/tools/server-tools).

<div id="built-in-exa-integration-alpha">
  ## Built-in Exa integration (alpha)
</div>

ElevenLabs juga menyediakan Built-in Exa integration yang tersedia di dashboard agent pada menu **Tools &gt; Integrations**. Integrasi ini lebih mudah disiapkan, tetapi penyesuaian search parameters lebih sulit dilakukan dibandingkan pendekatan webhook tool.

Untuk kontrol penuh atas search type, content options, dan pemfilteran, sebaiknya gunakan pendekatan webhook tool yang dijelaskan di atas.