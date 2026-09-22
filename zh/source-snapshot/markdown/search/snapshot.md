> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索前，可通过该文件了解所有可用页面。

<div id="exa-snapshot">
  # Exa Snapshot
</div>

> 将 Search 和 Contents 锁定到你指定 datetime 的页面存储版本。

Exa Snapshot 会保留 Exa 已抓取页面的存储版本。在请求中传入 `snapshotAsOf`，即可将其锁定到指定的 datetime。

可用于回测 agent、运行可复现的评估，以及对比文档、定价页面、政策和申报文件的历史版本。

<Info>
  Exa Snapshot 以 Pay as you go 方式提供，限速 10 QPS，索引窗口为滚动 5 个月。
  超过 100 次请求后，请[联系销售](https://exa.ai/contact/sales)以继续使用。
</Info>

<div id="search-at-a-datetime">
  ## 按指定 datetime 搜索
</div>

在 `/search` 中，将 `snapshotAsOf` 放在 `contents` 内。

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

Exa 会先找出候选 URL，再只保留在 `snapshotAsOf` 当时或之前已有存储版本的页面。

<Accordion title="响应示例">
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
  ## 将页面内容固定到指定时间点
</div>

在 `/contents` 请求的顶层添加 `snapshotAsOf`。

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

Exa 会返回该时间点或之前最新的存储版本。

<Accordion title="响应示例">
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
  若某个 ID 没有符合条件的版本，则不会出现在 `results` 中，而是在 `statuses` 中以
  `"status": "error"` 和 `"tag": "CONTENT_NOT_CACHED"` 报告。
</Tip>

<div id="how-snapshots-work">
  ## snapshot 的工作方式
</div>

| Field          | 位置 | 含义                                  |
| -------------- | -- | ----------------------------------- |
| `snapshotAsOf` | 请求 | datetime 截止时间。Exa 会返回该时刻或此前的最新存储版本。 |

这两个端点均适用：

* 返回的页面内容来自该存储版本。
* 标题、作者、publication date、正文、highlights 和摘要均仅基于该版本生成。
* 在 5 个月窗口内没有符合条件的版本的页面将被忽略。

<Note>
  在 Search 中，截止时间限定的是 content，而非排序。Exa 仍会使用当前的 retrieval 信号来
  发现候选 URL。请将结果视为受 `snapshotAsOf` 限定的证据，而不是
  对当时 search 排序结果的精确还原。
</Note>

<div id="limits-and-compatibility">
  ## 限制与兼容性
</div>

<AccordionGroup>
  <Accordion title="访问权限、速率限制与回溯范围">
    Pay as you go 提供 10 QPS，以及滚动 5 个月的索引访问范围。超出该时间窗口的 `snapshotAsOf`
    会被拒绝。请求数达到 100 次后，请[联系销售](https://exa.ai/contact/sales)以继续使用。
  </Accordion>

  <Accordion title="历史请求使用已存储的内容">
    请勿将 `snapshotAsOf` 与可能访问实时网页或扩展到其他页面的选项搭配使用。
    请完全省略 `livecrawl`、`livecrawlTimeout`、`maxAgeHours` 和 `subpages`；若请求在使用
    `snapshotAsOf` 的同时设置了其中任意一项，将以 `INVALID_REQUEST` 被拒绝。
  </Accordion>

  <Accordion title="支持的 Search 请求">
    Search 上的 Exa Snapshot 支持 `auto`、`fast` 和 `instant`，不支持
    `deep-lite`、`deep` 或 `deep-reasoning`。

    Exa Snapshot 不支持 Search 上的 `category` 参数。
  </Accordion>
</AccordionGroup>

<div id="common-uses">
  ## 常见用途
</div>

当任务依赖于 Exa 在某个特定 datetime 所存储的内容时，请使用 Exa Snapshot：

* 对 agent 进行回测，避免其接触到后续的页面更新。
* 在可重复的内容边界上运行评估。
* 比较文档、定价、政策或申报文件的历史版本。