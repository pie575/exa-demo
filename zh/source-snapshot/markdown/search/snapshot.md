> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="exa-snapshot">
  # Exa Snapshot
</div>

> 将 Search 和 Contents 固定到你指定时间点的页面存储版本。

Exa Snapshot 会保存 Exa 已抓取页面的历史版本。只需传入 `snapshotAsOf`，即可将请求固定到指定时间点。

你可以借此回测 agent、运行可复现的评估，并对比文档、定价页、政策和申报文件的早期版本。

<Info>
  Exa Snapshot 支持按量付费，速率为 10 QPS，索引窗口为滚动的 5 个月。
  请求数超过 100 次后，请[联系销售](https://exa.ai/contact/sales)以继续使用。
</Info>

<div id="search-at-a-datetime">
  ## 在指定时间点搜索
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

Exa 会先找出候选 URL，再只保留在 `snapshotAsOf` 及之前有存储版本的页面。

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
  ## 将 contents 固定到指定时间点
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

Exa 会返回该时间点或此前的最新存储版本。

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
  `"status": "error"` 和 `"tag": "CONTENT_NOT_CACHED"` 的形式返回。
</Tip>

<div id="how-snapshots-work">
  ## 快照的工作原理
</div>

| 字段             | 位置 | 含义                          |
| -------------- | -- | --------------------------- |
| `snapshotAsOf` | 请求 | 时间截止点。Exa 会返回该时刻及之前存储的最新版本。 |

两个端点均适用：

* 返回的页面内容来自该存储版本。
* 标题、作者、发布日期、正文、highlights 和摘要均仅基于该版本生成。
* 在 5 个月窗口内没有符合条件版本的页面会被略过。

<Note>
  在 Search 中，该截止点限定的是内容，而非排序。Exa 仍会使用当前的检索信号来发现候选 URL。请将结果视为受 `snapshotAsOf` 限定的证据，而非对当时搜索排序结果的精确还原。
</Note>

<div id="limits-and-compatibility">
  ## 限制与兼容性
</div>

<AccordionGroup>
  <Accordion title="访问权限、速率限制与可回溯范围">
    按量付费包含 10 QPS，以及滚动 5 个月的索引访问范围。早于该时间窗口的 `snapshotAsOf`
    会被拒绝。请求数超过 100 次后，请[联系销售](https://exa.ai/contact/sales)以继续使用。
  </Accordion>

  <Accordion title="历史请求使用已存储的内容">
    请勿将 `snapshotAsOf` 与可能访问实时网页或扩展至其他页面的选项搭配使用。
    请完全省略 `livecrawl`、`livecrawlTimeout`、`maxAgeHours` 和 `subpages`；若请求在设置
    `snapshotAsOf` 的同时设置了其中任意一项，将以 `INVALID_REQUEST` 被拒绝。
  </Accordion>

  <Accordion title="支持的 Search 请求">
    Search 上的 Exa Snapshot 支持 `auto`、`fast` 和 `instant`，不支持
    `deep-lite`、`deep` 或 `deep-reasoning`。

    Exa Snapshot 不支持 Search 的 `category` 参数。
  </Accordion>
</AccordionGroup>

<div id="common-uses">
  ## 常见用途
</div>

当任务取决于 Exa 在某个特定时间点存储的内容时，可以使用 Exa Snapshot：

* 对 Agent 进行回测，避免其受到后续页面更新的影响。
* 在可复现的内容边界上运行评估。
* 对比文档、定价、政策或申报文件的早期版本。