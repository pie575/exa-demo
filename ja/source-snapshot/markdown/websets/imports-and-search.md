> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳細を調べる前に、このファイルで利用可能なすべてのページを確認してください。

# インポートの使い方 {#how-to-use-imports}

> URL を Websets にインポートする手順を順を追って解説するガイドです。リストのエンリッチ、条件に基づくスコアリング、新たな一致結果の発見、そしてこれら 3 つを組み合わせる方法を紹介します。

URL のリスト (企業、人物、製品など) がすでにある場合は、それらを Webset に**インポート**できます。Webset の設定に応じて、インポートした item をエンリッチしたり、条件に照らして評価したり、Web Discovery の結果と組み合わせたりできます。

このガイドでは、すべての構成について、そのままコピー&amp;ペーストできる API 呼び出しを示しながら解説します。`$EXA_API_KEY` をご自身の API キーに置き換えるだけで使えます。

## 例: IT コンサルティングのサプライヤー 5 社 {#our-example-5-it-consulting-suppliers}

このガイドでは全体を通して、以下の 5 社のリストを import として使用します。

| 企業           | URL                              | 備考                           |
| ------------ | -------------------------------- | ---------------------------- |
| Accenture    | `https://www.accenture.com`      | グローバル IT コンサルティング、米国に本社      |
| Infosys      | `https://www.infosys.com`        | IT サービス、米国で大規模に事業展開          |
| Wipro        | `https://www.wipro.com`          | IT サービス、米国にオフィスあり            |
| EPAM Systems | `https://www.epam.com`           | ソフトウェアエンジニアリング、米国上場          |
| Persol Group | `https://www.persol-group.co.jp` | 人材派遣会社、日本市場中心、米国での事業展開はごくわずか |

これらの企業を選んだのは、5 社のうち 4 社が一般的な IT コンサルティングの条件 (米国オフィス、IT サービス) に明確に合致するためです。**Persol Group** は例外で、米国での事業展開がごくわずかな日本の人材派遣会社であるため、米国を対象とした条件には合致しない想定です。

以下の例で使用する条件:

1. 「The company has an office in the United States」(米国にオフィスがある)
2. 「The company provides IT consulting or staff augmentation services」(IT コンサルティングまたは人材派遣・技術者支援サービスを提供している)

***

## Config 1: Import Only -- フィルタリングせずにエンリッチする {#config-1-import-only-enrich-without-filtering}

<Note>
  **ライブ例:** [ダッシュボードでこの Webset を表示](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**適した場面:** URL のリストがあり、単にエンリッチだけを行いたい場合。スコアリングやフィルタリングは行わず、すべての item がそのまま保持されます。

### API呼び出し {#api-calls}

```bash theme={null}
# ステップ1: サプライヤーのURLを含むCSVインポートを作成する
curl -s -X POST "https://api.exa.ai/websets/v0/imports" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "count": 5,
    "size": 128,
    "entity": { "type": "company" },
    "title": "IT Consulting Suppliers"
  }'
# レスポンスには `uploadUrl` とインポートの `id` が含まれます

# ステップ2: ステップ1で取得した署名付きURLにCSVをアップロードする
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv の内容: url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# ステップ3: このインポートを使用するWebsetを作成する(エンリッチメントのみ。検索や条件は指定しない)
# Websetを作成すると、インポートの処理が自動的にスケジュールされます。
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "import": [
      { "source": "import", "id": "<IMPORT_ID>" }
    ],
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }'
```

### ライブ Webset での表示結果 {#what-we-see-in-the-live-webset}

**5 件の item** すべてが Webset に表示されます。条件が設定されていないため、filtering は行われません。

| Supplier     | Webset に含まれるか | Source   | Evaluations | Enrichments | 理由                          |
| ------------ | ------------- | -------- | ----------- | ----------- | --------------------------- |
| Accenture    | **はい**        | `import` | 0           | 2           | import 済み、評価に使う条件なし |
| Infosys      | **はい**        | `import` | 0           | 2           | import 済み、評価に使う条件なし |
| Wipro        | **はい**        | `import` | 0           | 2           | import 済み、評価に使う条件なし |
| EPAM Systems | **はい**        | `import` | 0           | 2           | import 済み、評価に使う条件なし |
| Persol Group | **はい**        | `import` | 0           | 2           | import 済み、評価に使う条件なし |

すべての item が `source: "import"` と `evaluations: []` を持ちます。この Config には条件がないため、仮に条件があった場合に通過するかどうかに関係なく、5 件すべてが保持され enrich されます。

<Note>
  Persol Group の URL (`persol-group.co.jp`) は、エンティティデータ上で「PERSOL Vietnam Japan Desk」に解決されました。解決先が地域子会社のページになっただけで、システムは通常どおり import と enrich を行います。
</Note>

***

## Config 2: Search Only -- Web Discovery {#config-2-search-only-web-discovery}

<Note>
  **ライブ例:** [ダッシュボードでこの Webset を表示](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**適した場面:** 手元にリストがなく、条件 (criteria) に一致する新しい企業を Web から見つけたい場合。

### API呼び出し {#api-call}

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

### ライブ Webset で確認できる内容 {#what-we-see-in-the-live-webset-2}

システムがウェブを検索した結果、両方の条件を満たす **35 社** が見つかりました。すべての item に `source: "search"` が設定されており、一致した理由を説明する詳細な評価が付いています。

| 当社のサプライヤー 5 社 | Webset に含まれるか | 理由                                        |
| ------------- | ------------- | ----------------------------------------- |
| Accenture     | **はい**        | ウェブ検索により、条件に一致する企業として Accenture が独自に発見された |
| Infosys       | **いいえ**       | 今回のウェブ検索では発見されなかった                        |
| Wipro         | **いいえ**       | 今回のウェブ検索では発見されなかった                        |
| EPAM Systems  | **いいえ**       | 今回のウェブ検索では発見されなかった                        |
| Persol Group  | **いいえ**       | 今回のウェブ検索では発見されなかった                        |
| *(その他 34 社)*  | **はい**        | ウェブ検索で発見され、両方の条件を満たした                     |

ウェブ検索の 35 件の結果には偶然 Accenture が含まれていましたが、残り 4 社のサプライヤーは発見されませんでした。これは想定どおりの挙動です。検索のみの webset は、あらかじめ決められたリストではなく、ウェブクロールで見つかったものだけを返します。このほかに発見された企業には、Artech、TurnKey Staffing、DataArt、Insight Global などがあります。

***

## Config 3: Scoped Search -- リストを条件に照らしてスコアリングする {#config-3-scoped-search-score-your-list-against-criteria}

<Note>
  **ライブ例:** [ダッシュボードでこの webset を表示](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**使用する場面:** サプライヤーのリストがあり、**各サプライヤーを条件に照らして評価したい**場合に使用します。条件を満たしたものだけが返されます。いわゆる「リストをスコアリングしたい」というユースケースです。

### API 呼び出し {#api-calls-2}

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Config 1 の手順で CSV インポートを作成してアップロードし、その ID をここで指定します。
  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  // Config 1 の手順で CSV インポートを作成してアップロードし、その ID をここで指定します。
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        scope: [
          { source: "import", id: "<IMPORT_ID>" }
        ]
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  # ステップ 1: CSV インポートを作成してアップロードします（Config 1 のステップ 1〜2 と同じ）
  # ...（インポートの手順全体は Config 1 を参照）
  # <IMPORT_ID> が返されます

  # ステップ 2: スコープ付き検索で Webset を作成します。インポートした各 URL が条件を満たすかどうかを評価します
  # Webset を作成すると、インポートの処理が自動的にスケジュールされます。
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

### 実際の Webset で確認できる内容 {#what-we-see-in-the-live-webset-3}

この Webset には **4 件の Item** が含まれています。5 社のサプライヤーはそれぞれ条件に基づいて評価され、両方の条件を満たしたものだけが表示されています。

| サプライヤー       | Webset に含まれるか | Source   | Evaluations の有無 | 理由                                 |
| ------------ | ------------- | -------- | --------------- | ---------------------------------- |
| Accenture    | **はい**        | `search` | あり (2)          | 合格：米国にオフィスがあり、IT コンサルティングを提供       |
| Infosys      | **はい**        | `search` | あり (2)          | 合格：米国にオフィスがあり、IT サービスを提供           |
| Wipro        | **はい**        | `search` | あり (2)          | 合格：米国にオフィスがあり、IT サービスを提供           |
| EPAM Systems | **はい**        | `search` | あり (2)          | 合格：米国で上場しており、ソフトウェアエンジニアリングサービスを提供 |
| Persol Group | **いいえ -- 除外** | --       | --              | 「米国にオフィスがある」を満たさず -- 主に日本を拠点としている  |

5 社のサプライヤーをインポートしましたが、結果に表示されるのは 4 社のみです。**Persol Group は評価されたものの条件を満たさなかった**ため、除外されています。表示されている Item にはすべて `source: "search"` が設定され、各条件に対する判断理由を示す `evaluations` がすべて含まれています。

<Warning>
  条件を満たさない Item は**結果から除外されます**。すべての Item を残したまま合否だけを確認したい場合は、Config 3 とは別の Webset として Config 1 (Import Only、フィルタリングなし) を併用してください。
</Warning>

***

## Config 4: Scoped Search + Web Discovery -- リストをスコアリングしつつ、新たな一致も見つける {#config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches}

<Note>
  **ライブ例:** [ダッシュボードでこの Webset を表示](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**使用する場面:** 手元のサプライヤーリストを条件に照らしてスコアリングしつつ、同じ条件に一致する企業をウェブからも新たに見つけたい場合に使用します。手順は 2 段階です。まず Scoped Search で Webset を作成し、次に同じ Webset に通常のウェブ検索を追加します。

### API 呼び出し {#api-calls-3}

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Config 1 の手順に従って CSV のインポートを作成・アップロードし、その ID をここで指定します。
  headers = {"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"}
  webset_response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers=headers,
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  webset_response.raise_for_status()
  webset_id = webset_response.json()["id"]

  search_response = requests.post(
      f"https://api.exa.ai/websets/v0/websets/{webset_id}/searches",
      headers=headers,
      json={
          "query": "IT consulting and staff augmentation companies",
          "entity": {"type": "company"},
          "criteria": [
              {"description": "The company has an office in the United States"},
              {
                  "description": "The company provides IT consulting or staff augmentation services"
              },
          ],
          "count": 25,
          "behavior": "append",
      },
  )
  search_response.raise_for_status()
  ```

  ```javascript JavaScript theme={null}
  // Config 1 の手順で CSV インポートを作成してアップロードし、その ID をここで指定します。
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXA_API_KEY}`
  };
  const websetResponse = await fetch(
    "https://api.exa.ai/websets/v0/websets",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        search: {
          query: "IT consulting and staff augmentation companies",
          entity: { type: "company" },
          criteria: [
            { description: "The company has an office in the United States" },
            {
              description: "The company provides IT consulting or staff augmentation services"
            }
          ],
          count: 25,
          scope: [
            { source: "import", id: "<IMPORT_ID>" }
          ]
        },
        enrichments: [
          {
            description: "What services does this company provide?",
            format: "text"
          },
          { description: "Number of employees", format: "number" }
        ]
      })
    }
  );

  if (!websetResponse.ok) {
    throw new Error(`Webset creation failed: ${websetResponse.status}`);
  }
  const webset = await websetResponse.json();

  const searchResponse = await fetch(
    `https://api.exa.ai/websets/v0/websets/${webset.id}/searches`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        behavior: "append"
      })
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Search creation failed: ${searchResponse.status}`);
  }
  ```

  ```bash cURL theme={null}
  # ステップ 1: CSV インポートを作成してアップロードします（Config 1 のステップ 1〜2 と同じ）
  # ...（インポートの全手順は Config 1 を参照）
  # <IMPORT_ID> が返されます

  # ステップ 2: スコープ付き検索を含む Webset を作成します -- インポートした各 URL を条件に基づいて評価します
  # Webset を作成すると、インポートの処理が自動的にスケジュールされます。
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  # レスポンスに含まれる webset の `id` を <WEBSET_ID> として保存します

  # ステップ 3: スコープ付き検索が完了したら、ウェブ検索を追加して新たな一致項目を探します
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/<WEBSET_ID>/searches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25,
      "behavior": "append"
    }'
  ```
</CodeGroup>

### 稼働中の Webset で確認できる内容 {#what-we-see-in-the-live-webset-4}

この webset には **29 件の item** が含まれています。内訳は、インポートしたサプライヤーのうちスコアリングを通過した 4 件と、Web 上で新たに見つかった 25 社です。どちらも条件に基づいて評価されています。

| サプライヤー               | Webset に含まれるか | Source   | Evaluations の有無 | 理由                                        |
| -------------------- | ------------- | -------- | --------------- | ----------------------------------------- |
| Accenture            | **はい**        | `search` | あり (2)          | Scoped Search を通過: 米国拠点あり、IT コンサルティングを提供  |
| Infosys              | **はい**        | `search` | あり (2)          | Scoped Search を通過: 米国拠点あり、IT サービスを提供      |
| Wipro                | **はい**        | `search` | あり (2)          | Scoped Search を通過: 米国拠点あり、IT サービスを提供      |
| EPAM Systems         | **はい**        | `search` | あり (2)          | Scoped Search を通過: 米国上場、ソフトウェアエンジニアリングを提供 |
| Persol Group         | **いいえ (除外)**  | --       | --              | Scoped Search で不合格: 米国拠点なし                |
| *(Web 上で見つかった 25 社)* | **はい**        | `search` | あり (各 2)        | Web 検索で見つかり、両方の条件を満たした            |

Scoped Search ではインポートしたリストを条件に照らして評価し (Persol Group は除外)、追加実行した Web 検索でさらに 25 社が見つかります。その結果、スコアリング済みのインポートと Web 検索で新たに見つかった企業の両方を含む、1 つの webset が得られます。

<Note>
  Web 検索では `"behavior": "append"` を使用しているため、既存の結果が置き換えられることはなく、結果が追加されます。Scoped Search の結果にすでに含まれている企業 (例: Accenture) が Web 検索で見つかった場合、重複は自動的に処理されます。
</Note>

***

## クイックリファレンス {#quick-reference}

| 構成                                   | 機能                         | すべての item を保持するか                  | item はスコアリングされるか                              |
| ------------------------------------ | -------------------------- | --------------------------------- | --------------------------------------------- |
| **1. Import Only**                   | リストをエンリッチする                | はい。すべて保持されます                      | いいえ                                           |
| **2. Search Only**                   | Web から条件に一致する新しい項目を見つける    | 該当なし (インポートなし)                    | はい。合格した item のみが返されます                         |
| **3. Scoped Search**                 | 条件に基づいてリストをスコアリングする | いいえ。不合格の item は除外されます             | はい                                            |
| **4. Scoped Search + Web Discovery** | リストをスコアリングし、一致する新しい項目も見つける | いいえ。インポートした item のうち不合格のものは除外されます | はい。インポートした item と新たに見つかった item の両方がスコアリングされます |

## どの Config を使うべきか {#which-config-should-i-use}

* **「リストをエンリッチしたいだけで、フィルタリングは不要」** -- Config 1
* **「リストがないので、企業を探してほしい」** -- Config 2
* **「リストをスコアリングして、条件に合わないものを除外したい」** -- Config 3
* **「リストをスコアリングし、さらに条件に合う新しい企業も見つけたい」** -- Config 4