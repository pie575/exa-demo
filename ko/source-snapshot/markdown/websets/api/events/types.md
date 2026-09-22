> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Event types {#event-types}

> Webset API에서 발생하는 이벤트에 대해 알아보세요

Websets API는 이벤트를 통해 Websets의 변경 사항을 알려줍니다. [events 엔드포인트](/ko/docs/websets/api/events/list-all-events)를 사용하거나 [웹훅](/ko/docs/websets/api/webhooks/create-a-webhook)을 설정해 이러한 이벤트를 모니터링할 수 있습니다.

이벤트는 60일 동안 보관된 후 자동으로 삭제됩니다.

## Webset {#webset}

* `webset.created` - 새 Webset이 생성될 때 발생합니다.
* `webset.deleted` - Webset이 삭제될 때 발생합니다.
* `webset.paused` - Webset의 작업이 일시 중지될 때 발생합니다.
* `webset.idle` - Webset에 실행 중인 작업이 없을 때 발생합니다.

## search {#search}

* `webset.search.created` - 새로운 search가 시작될 때 발생합니다.
* `webset.search.updated` - search 진행 상황이 업데이트될 때 발생합니다.
* `webset.search.completed` - search가 모든 item을 찾아 완료되었을 때 발생합니다.
* `webset.search.canceled` - search가 수동으로 취소되었을 때 발생합니다.

## Item {#item}

* `webset.item.created` - Webset에 새 item이 추가되면 발생합니다.
* `webset.item.enriched` - item의 enrichment가 완료되면 발생합니다.

## Import {#import}

* `import.created` - 새 import가 시작될 때 발생합니다.
* `import.completed` - import가 완료되면 발생합니다.

## Export {#export}

* `webset.export.created` - 새로운 export가 시작될 때 발생합니다.
* `webset.export.completed` - export가 완료되면 발생합니다.

## Monitor {#monitor}

* `monitor.created` - 새로운 monitor가 생성될 때 발생합니다.
* `monitor.updated` - monitor의 구성이 업데이트될 때 발생합니다.
* `monitor.deleted` - monitor가 삭제될 때 발생합니다.
* `monitor.run.created` - Monitor 실행이 시작될 때 발생합니다.
* `monitor.run.completed` - Monitor 실행이 완료될 때 발생합니다.

각 이벤트에는 다음이 포함됩니다:

* 고유한 `id`
* 이벤트 `type`
* 이벤트를 발생시킨 리소스 전체를 담은 `data` 객체
* `createdAt` timestamp

이러한 이벤트는 다음과 같은 용도로 활용할 수 있습니다:

* search와 enrichment의 진행 상황 추적
* 실시간 dashboard 구축
* 새로운 item이 발견될 때 워크플로우 트리거
* export 상태 모니터링