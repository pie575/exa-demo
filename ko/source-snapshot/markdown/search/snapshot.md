> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="exa-snapshot">
  # Exa Snapshot
</div>

> Search와 Contents를 원하는 datetime 시점의 페이지 stored version에 고정하세요.

Exa Snapshot은 Exa가 크롤링한 페이지의 stored version을 보관합니다. `snapshotAsOf`를 전달하면 요청을 특정 datetime 시점에 고정할 수 있습니다.

이를 활용해 agent를 backtest하고, 재현 가능한 평가를 실행하며, 문서·가격 페이지·정책·filings의 이전 버전을 비교해 보세요.

<Info>
  Exa Snapshot은 pay as you go로 10 QPS까지 사용할 수 있으며, 최근 5개월 단위의 롤링 인덱스 윈도우를 제공합니다.
  요청 100회를 초과해 계속 사용하려면 [영업팀에 문의](https://exa.ai/contact/sales)하세요.
</Info>

<div id="search-at-a-datetime">
  ## 특정 datetime 시점으로 search하기
</div>

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

<div id="pin-contents-to-a-datetime">
  ## 특정 datetime으로 contents 고정하기
</div>

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

Exa는 해당 datetime 시점 또는 그 이전의 stored version 중 가장 최신 버전을 반환합니다.

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
  조건에 맞는 버전이 없는 ID는 `results`에서 제외되며, `"status": "error"`와
  `"tag": "CONTENT_NOT_CACHED"`로 `statuses`에 표시됩니다.
</Tip>

<div id="how-snapshots-work">
  ## 스냅샷 동작 방식
</div>

| 필드             | 위치 | 의미                                                                       |
| -------------- | -- | ------------------------------------------------------------------------ |
| `snapshotAsOf` | 요청 | datetime 기준 시점. Exa는 이 시점 또는 그 이전에 저장된 stored version 중 가장 최신 버전을 반환합니다. |

두 endpoint 모두 다음이 적용됩니다.

* 반환되는 page content는 해당 stored version에서 가져옵니다.
* 제목, 작성자, 발행일, 본문, highlights, summaries는 모두 해당 버전만을 기반으로 생성됩니다.
* 5개월 기간 내에 조건에 맞는 버전이 없는 페이지는 제외됩니다.

<Note>
  search에서 기준 시점은 콘텐츠의 범위만 제한할 뿐, 순위에는 영향을 주지 않습니다. Exa는 후보 URL을 찾을 때 여전히 현재의 retrieval 신호를 사용합니다.
  따라서 결과는 `snapshotAsOf`로 범위가 제한된 evidence로 활용하고, 당시 search가 매겼을 순위를 그대로 재현한 것으로 받아들이지 마세요.
</Note>

<div id="limits-and-compatibility">
  ## Limits 및 호환성
</div>

<AccordionGroup>
  <Accordion title="접근 권한, rate limit, 조회 가능 기간">
    Pay as you go에는 10 QPS와 최근 5개월 롤링 인덱스 접근이 포함됩니다. 이 기간을 벗어난
    `snapshotAsOf` 값은 거부됩니다. 요청 100건을 초과해 계속 사용하려면 [영업팀에 문의](https://exa.ai/contact/sales)하세요.
  </Accordion>

  <Accordion title="과거 시점 요청은 저장된 콘텐츠를 사용합니다">
    `snapshotAsOf`는 라이브 웹에 접근하거나 다른 페이지로 확장할 수 있는 옵션과 함께 사용하지 마세요.
    `livecrawl`, `livecrawlTimeout`, `maxAgeHours`, `subpages`는 아예 생략해야 하며, `snapshotAsOf`와 함께
    이 중 하나라도 설정한 요청은 `INVALID_REQUEST`로 거부됩니다.
  </Accordion>

  <Accordion title="지원되는 search 요청">
    search에서 Exa Snapshot은 `auto`, `fast`, `instant`를 지원하며,
    `deep-lite`, `deep`, `deep-reasoning`은 지원하지 않습니다.

    또한 Exa Snapshot은 search의 `category` 파라미터를 지원하지 않습니다.
  </Accordion>
</AccordionGroup>

<div id="common-uses">
  ## 주요 활용 사례
</div>

특정 datetime 기준으로 Exa가 저장해 둔 내용에 작업이 의존하는 경우 Exa Snapshot을 사용하세요:

* 이후에 발생한 페이지 업데이트의 영향 없이 agent를 백테스트합니다.
* 반복 가능한 콘텐츠 기준 시점에 맞춰 평가를 실행합니다.
* 문서, 가격 정책, 약관, 공시 자료의 이전 버전을 비교합니다.