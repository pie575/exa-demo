> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Exa Snapshot {#exa-snapshot}

> Search と Contents を、指定した日時時点のページの保存バージョンに固定します。

Exa Snapshot は、Exa がクロールしたページの保存バージョンを保持します。`snapshotAsOf` を指定すると、リクエストを特定の日時に固定できます。

エージェントのバックテストや再現性のある評価の実行、ドキュメント、料金ページ、ポリシー、提出書類の過去バージョンとの比較に活用できます。

<Info>
  Exa Snapshot は従量課金制で利用でき、上限は 10 QPS、インデックス期間は直近 5 か月のローリングウィンドウです。
  100 リクエストを超えて引き続き利用する場合は、[営業チームにお問い合わせください](https://exa.ai/contact/sales)。
</Info>

## 特定の日時時点で検索する {#search-at-a-datetime}

`/search` では、`snapshotAsOf` を `contents` 内に指定します。

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

Exa は候補 URL を見つけた後、`snapshotAsOf` 時点またはそれ以前の保存済みバージョンがあるページのみに絞り込みます。

<Accordion title="レスポンスの例">
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

## コンテンツを特定の日時に固定する {#pin-contents-to-a-datetime}

`/contents` リクエストのトップレベルに `snapshotAsOf` を追加します。

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

Exa は、指定した日時以前に保存されたバージョンのうち、最新のものを返します。

<Accordion title="レスポンスの例">
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
  条件を満たすバージョンがない ID は `results` に含まれず、`statuses` に
  `"status": "error"` と `"tag": "CONTENT_NOT_CACHED"` 付きで報告されます。
</Tip>

## スナップショットの仕組み {#how-snapshots-work}

| フィールド          | 指定箇所  | 意味                                        |
| -------------- | ----- | ----------------------------------------- |
| `snapshotAsOf` | リクエスト | 基準となる日時。Exa は、この時点以前で最も新しい保存済みバージョンを返します。 |

どちらのエンドポイントでも、次のように動作します。

* 返されるページコンテンツは、その保存済みバージョンから取得されます。
* タイトル、著者、公開日、テキスト、highlights、要約は、すべてそのバージョンのみに基づいて生成されます。
* 過去 5 か月の範囲内に条件を満たすバージョンが存在しないページは、結果から除外されます。

<Note>
  Search では、基準日時が制限するのはコンテンツであり、ランキングではありません。Exa は候補 URL の検出に、引き続き現在の取得シグナルを使用します。結果は `snapshotAsOf` 時点までの情報に限定されたエビデンスとして扱ってください。当時の検索でどのようにランク付けされていたかを正確に再現したものではありません。
</Note>

## 制限と互換性 {#limits-and-compatibility}

<AccordionGroup>
  <Accordion title="アクセス、レート制限、遡及期間">
    Pay as you go プランでは、10 QPS と、直近 5 か月間のインデックスへのアクセスが利用できます。この期間より古い `snapshotAsOf`
    を指定したリクエストは拒否されます。100 リクエストを超えて引き続き利用するには、[営業チームにお問い合わせください](https://exa.ai/contact/sales)。
  </Accordion>

  <Accordion title="過去時点のリクエストは保存済みのコンテンツを使用">
    `snapshotAsOf` は、ライブウェブにアクセスする可能性のあるオプションや、他のページへ範囲を広げるオプションと併用しないでください。
    `livecrawl`、`livecrawlTimeout`、`maxAgeHours`、`subpages` は一切指定しないでください。これらのいずれかを
    `snapshotAsOf` と併せて指定したリクエストは、`INVALID_REQUEST` で拒否されます。
  </Accordion>

  <Accordion title="サポートされる Search リクエスト">
    Search での Exa Snapshot は `auto`、`fast`、`instant` に対応しています。
    `deep-lite`、`deep`、`deep-reasoning` には対応していません。

    Exa Snapshot は、Search の `category` パラメーターには対応していません。
  </Accordion>
</AccordionGroup>

## 主な用途 {#common-uses}

特定の日時の時点で Exa に保存されていた内容を前提とするタスクには、Exa Snapshot を使用します。

* それ以降のページ更新の影響を受けずに、エージェントをバックテストする。
* 再現可能なコンテンツ範囲に固定して評価を実行する。
* ドキュメント、料金体系、ポリシー、または提出書類の過去のバージョンを比較する。