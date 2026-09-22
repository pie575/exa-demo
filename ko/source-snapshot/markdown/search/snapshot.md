> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Exa Snapshot {#exa-snapshot}

> 원하는 datetime 시점에 저장된 stored version으로 Search와 Contents를 고정하세요.

Exa Snapshot은 Exa가 크롤링한 페이지의 stored version을 보관합니다. `snapshotAsOf`를 전달하면 해당 datetime 시점으로 요청을 고정할 수 있습니다.

이를 활용해 agent를 backtest하고, 재현 가능한 평가를 실행하며, 문서와 가격 페이지, 정책, 공시 자료의 이전 버전을 비교해 보세요.

<Info>
  Exa Snapshot은 pay as you go 방식으로 10 QPS까지 이용할 수 있으며, 최근 5개월의 롤링 인덱스 범위를 제공합니다.
  요청 100회 이후에도 계속 사용하려면 [영업팀에 문의하세요](https://exa.ai/contact/sales).
</Info>

## 특정 datetime 기준 검색 {#search-at-a-datetime}

`/search`에서는 `contents` 안에 `snapshotAsOf`를 넣습니다.

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

Exa는 후보 URL을 찾은 뒤, `snapshotAsOf` 시점 또는 그 이전의 stored version이 있는 페이지만 남깁니다.

<Accordion title="응답 예시">
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

## 특정 datetime으로 contents 고정하기 {#pin-contents-to-a-datetime}

`/contents` 요청의 최상위 레벨에 `snapshotAsOf`를 추가하세요.

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

Exa는 해당 datetime 시점 또는 그 이전의 가장 최신 stored version을 반환합니다.

<Accordion title="응답 예시">
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
  조건에 맞는 버전이 없는 ID는 `results`에서 제외되며, `statuses`에
  `"status": "error"`와 `"tag": "CONTENT_NOT_CACHED"`로 표시됩니다.
</Tip>

## snapshot 작동 방식 {#how-snapshots-work}

| Field          | 위치 | 의미                                                                 |
| -------------- | -- | ------------------------------------------------------------------ |
| `snapshotAsOf` | 요청 | datetime 기준점. Exa는 해당 시점 또는 그 이전에 저장된 가장 최신 stored version을 반환합니다. |

두 엔드포인트 공통 사항:

* 반환되는 페이지 콘텐츠는 해당 stored version에서 가져옵니다.
* 제목, 저자, 발행일, 텍스트, highlights, summary는 모두 해당 버전만을 기반으로 생성됩니다.
* 5개월 기간 내에 조건에 맞는 버전이 없는 페이지는 제외됩니다.

<Note>
  search에서 이 기준점은 콘텐츠의 범위만 한정할 뿐 랭킹에는 영향을 주지 않습니다. Exa는 후보 URL을
  찾기 위해 현재의 검색 신호를 그대로 사용합니다. 결과는 `snapshotAsOf`로 범위가 한정된
  evidence로 활용하시고, 그 시점에 search가 매겼을 랭킹을 그대로 재현한 것으로 보지 마십시오.
</Note>

## limits 및 호환성 {#limits-and-compatibility}

<AccordionGroup>
  <Accordion title="액세스, 속도 제한, 조회 가능 기간">
    Pay as you go에는 10 QPS와 최근 5개월 롤링 인덱스 액세스가 포함됩니다. 이 기간을 벗어난
    `snapshotAsOf`는 거부됩니다. 요청 100회를 초과해 계속 이용하려면 [영업팀에 문의](https://exa.ai/contact/sales)하세요.
  </Accordion>

  <Accordion title="과거 시점 요청은 저장된 content를 사용합니다">
    `snapshotAsOf`는 실시간 웹에 접근하거나 다른 페이지로 확장될 수 있는 옵션과 함께 사용하지 마세요.
    `livecrawl`, `livecrawlTimeout`, `maxAgeHours`, `subpages`는 아예 생략해야 합니다. `snapshotAsOf`와
    함께 이 중 하나라도 설정한 요청은 `INVALID_REQUEST`로 거부됩니다.
  </Accordion>

  <Accordion title="지원되는 search 요청">
    search에서 Exa Snapshot은 `auto`, `fast`, `instant`를 지원하며,
    `deep-lite`, `deep`, `deep-reasoning`은 지원하지 않습니다.

    Exa Snapshot은 search의 `category` 매개변수를 지원하지 않습니다.
  </Accordion>
</AccordionGroup>

## 일반적인 활용 사례 {#common-uses}

특정 datetime 시점에 Exa가 저장해 둔 내용에 작업이 좌우되는 경우 Exa Snapshot을 사용하세요:

* 이후 페이지 업데이트에 영향을 받지 않도록 agent를 backtest합니다.
* 재현 가능한 content 범위를 기준으로 평가를 실행합니다.
* 문서, 가격, 정책, 공시 자료의 이전 버전을 비교합니다.