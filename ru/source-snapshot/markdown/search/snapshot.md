> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать материалы дальше.

<div id="exa-snapshot">
  # Exa Snapshot
</div>

> Привязывайте Search и Contents к сохранённой версии страницы на выбранный вами момент времени.

Exa Snapshot хранит сохранённые версии страниц, которые обошёл краулер Exa. Передайте `snapshotAsOf`, чтобы привязать запрос к нужной дате и времени.

Это удобно для бэктестинга агентов, воспроизводимых оценок и сравнения предыдущих версий документации, страниц с ценами, политик и отчётности.

<Info>
  Exa Snapshot доступен по модели оплаты по факту использования с ограничением 10 QPS и скользящим окном индекса в 5 месяцев.
  После 100 запросов [свяжитесь с отделом продаж](https://exa.ai/contact/sales), чтобы продолжить.
</Info>

<div id="search-at-a-datetime">
  ## Поиск на заданный момент времени
</div>

В `/search` укажите `snapshotAsOf` внутри `contents`.

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

Exa находит подходящие URL, а затем оставляет только те страницы, для которых есть сохранённая версия на момент `snapshotAsOf` или раньше.

<Accordion title="Пример ответа">
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
  ## Привязка contents к моменту времени
</div>

Добавьте `snapshotAsOf` на верхнем уровне запроса `/contents`.

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

Exa возвращает самую свежую сохранённую версию на указанный момент времени или раньше него.

<Accordion title="Пример ответа">
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
  Идентификаторы, для которых нет подходящей версии, не попадают в `results` и возвращаются в `statuses`
  со значениями `"status": "error"` и `"tag": "CONTENT_NOT_CACHED"`.
</Tip>

<div id="how-snapshots-work">
  ## Как работают снимки
</div>

| Поле           | Где    | Значение                                                                                    |
| -------------- | ------ | ------------------------------------------------------------------------------------------- |
| `snapshotAsOf` | Запрос | Временная граница. Exa возвращает самую свежую сохранённую версию на этот момент или ранее. |

Для обоих эндпоинтов:

* Возвращаемое содержимое страницы берётся из этой сохранённой версии.
* Заголовок, автор, дата публикации, текст, highlights и краткие изложения формируются только на основе этой версии.
* Страницы, у которых нет подходящей версии в пределах 5-месячного окна, пропускаются.

<Note>
  В Search граница ограничивает содержимое, но не ранжирование. Для подбора URL-кандидатов Exa по-прежнему
  использует актуальные сигналы поиска. Воспринимайте результаты как данные, ограниченные значением `snapshotAsOf`,
  а не как точное воспроизведение того, что search выдал бы в ранжировании на тот момент.
</Note>

<div id="limits-and-compatibility">
  ## Лимиты и совместимость
</div>

<AccordionGroup>
  <Accordion title="Доступ, лимит запросов и глубина ретроспективы">
    Тариф с оплатой по факту использования включает 10 QPS и скользящий доступ к индексу за последние 5 месяцев. Значение `snapshotAsOf`, выходящее
    за пределы этого окна, отклоняется. После 100 запросов [свяжитесь с отделом продаж](https://exa.ai/contact/sales),
    чтобы продолжить работу.
  </Accordion>

  <Accordion title="Исторические запросы используют сохранённый контент">
    Не сочетайте `snapshotAsOf` с параметрами, которые обращаются к «живому» вебу или расширяют выдачу на другие страницы.
    Полностью опускайте `livecrawl`, `livecrawlTimeout`, `maxAgeHours` и `subpages`; запросы, в которых
    любой из них задан вместе с `snapshotAsOf`, отклоняются с ошибкой `INVALID_REQUEST`.
  </Accordion>

  <Accordion title="Поддерживаемые запросы Search">
    Exa Snapshot в Search поддерживает `auto`, `fast` и `instant`. Режимы
    `deep-lite`, `deep` и `deep-reasoning` не поддерживаются.

    Exa Snapshot не поддерживает параметр `category` в Search.
  </Accordion>
</AccordionGroup>

<div id="common-uses">
  ## Типичные сценарии использования
</div>

Используйте Exa Snapshot, когда задача зависит от того, что было сохранено в Exa на определённый момент времени:

* Бэктестинг агента без влияния более поздних обновлений страниц.
* Проведение оценки с воспроизводимой границей содержимого.
* Сравнение более ранних версий документации, цен, политик или отчётности.