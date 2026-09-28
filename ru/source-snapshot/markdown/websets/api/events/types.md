> ## Индекс документации {#documentation-index}
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

# Типы событий {#event-types}

> Узнайте о событиях, которые происходят в Webset API

Websets API использует события, чтобы уведомлять вас об изменениях в ваших Websets. Отслеживать эти события можно через [эндпоинт событий](/ru/docs/websets/api/events/list-all-events) или с помощью [вебхуков](/ru/docs/websets/api/webhooks/create-a-webhook).

События хранятся 60 дней, после чего автоматически удаляются.

## Webset {#webset}

* `webset.created` — отправляется при создании нового Webset.
* `webset.deleted` — отправляется при удалении Webset.
* `webset.paused` — отправляется при приостановке операций Webset.
* `webset.idle` — отправляется, когда у Webset не осталось выполняющихся операций.

## Search {#search}

* `webset.search.created` — отправляется при создании нового Search.
* `webset.search.updated` — отправляется при обновлении хода выполнения Search.
* `webset.search.completed` — отправляется, когда Search находит все items.
* `webset.search.canceled` — отправляется при ручной отмене Search.

## Item {#item}

* `webset.item.created` — отправляется при добавлении нового item в Webset.
* `webset.item.enriched` — отправляется по завершении enrichment для item.

## Import {#import}

* `import.created` — отправляется при создании нового import.
* `import.completed` — отправляется после завершения import.

## Экспорт {#export}

* `webset.export.created` — отправляется при запуске нового экспорта.
* `webset.export.completed` — отправляется после завершения экспорта.

## Monitor {#monitor}

* `monitor.created` — отправляется при создании нового monitor.
* `monitor.updated` — отправляется при изменении настроек monitor.
* `monitor.deleted` — отправляется при удалении monitor.
* `monitor.run.created` — отправляется при запуске выполнения monitor.
* `monitor.run.completed` — отправляется по завершении выполнения monitor.

Каждое событие содержит:

* Уникальный `id`
* Тип события `type`
* Объект `data` с полным ресурсом, вызвавшим событие
* Метку времени `createdAt`

Эти события можно использовать, чтобы:

* Отслеживать ход выполнения search и enrichment
* Создавать панели мониторинга в реальном времени
* Запускать рабочие процессы при появлении новых Item
* Следить за статусом экспорта