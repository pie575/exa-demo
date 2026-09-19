> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="batch-api">
  # Batch API
</div>

> Exa API 요청을 batch 단위로 비동기 실행합니다.

<Info>
  Batch API는 Exa가 해당 team에 대해 활성화한 후 Enterprise 고객이 사용할 수 있습니다. Enterprise 이용 및 활성화에 대한 문의는 [sales@exa.ai](mailto:sales@exa.ai)로 연락해 주세요.
</Info>

Batch API를 사용하면 여러 Exa API 요청을 한 번에 제출하고, 그 결과를 나중에 JSONL 파일로 받아볼 수 있습니다. 수천 개의 요청을 개별적으로 보내며 rate limit과 재시도를 직접 관리할 필요 없이, batch 하나를 전송하고 상태를 poll한 뒤 모든 결과를 파일 하나로 내려받으면 됩니다.

오프라인 enrichment, 백필 등 즉각적인 응답이 필요하지 않은 작업에 활용하세요. 전체 요청 및 응답 schema는 [API 레퍼런스](/ko/docs/reference/batches/create-a-batch)에서 확인할 수 있습니다.

<Note>
  Batch API는 베타 단계입니다. 모든 요청에 `Exa-Beta: batches-2026-06-06` header를 포함하세요.
</Note>

<div id="supported-requests">
  ## 지원되는 요청
</div>

각 batch 항목은 다음 경로 중 하나로 보내는 `POST` 요청이어야 합니다:

| 경로            | 사용 사례                  |
| ------------- | ---------------------- |
| `/search`     | Exa search 요청을 비동기로 실행 |
| `/agent/runs` | Exa Agent 요청을 비동기로 실행  |

각 항목에는 batch 내에서 고유한 `customId`가 필요합니다. 결과 파일에도 동일한 `customId`가 반환되므로 출력 행을 원래 입력 데이터와 연결할 수 있습니다.

<div id="create-a-batch">
  ## batch 생성하기
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/batches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06" \
    -H "Content-Type: application/json" \
    -d '{
      "requests": [
        {
          "customId": "row-1",
          "method": "POST",
          "url": "/search",
          "body": {
            "query": "Latest AI infrastructure funding rounds"
          }
        },
        {
          "customId": "row-2",
          "method": "POST",
          "url": "/agent/runs",
          "body": {
            "query": "Summarize recent vector database launches"
          }
        }
      ],
      "metadata": {
        "project": "weekly-digest"
      }
    }'
  ```
</CodeGroup>

응답에는 batch ID와 초기 상태가 담겨 있습니다:

<Accordion title="응답 예시">
  ```json theme={null}
  {
    "id": "batch_01j7x9v0m2n4p6q8r0s2t4v6w8",
    "object": "batch",
    "status": "in_progress",
    "requestCounts": {
      "total": 2,
      "completed": 0,
      "failed": 0
    },
    "createdAt": "2026-06-06T12:00:00.000Z",
    "expiresAt": null,
    "endedAt": null,
    "resultsUrl": null,
    "metadata": {
      "project": "weekly-digest"
    }
  }
  ```
</Accordion>

<div id="check-status">
  ## 상태 확인
</div>

batch가 최종 상태에 도달할 때까지 poll하세요:

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

batch 상태는 다음과 같습니다:

| 상태            | 의미                           |
| ------------- | ---------------------------- |
| `in_progress` | batch가 실행 중입니다               |
| `completed`   | 모든 요청이 완료되어 결과를 사용할 수 있습니다   |
| `cancelling`  | 취소가 요청되어 진행 중인 작업이 정리되는 중입니다 |
| `cancelled`   | batch가 취소되었습니다               |
| `expired`     | 결과를 더 이상 사용할 수 없습니다          |

batch가 완료되면 `resultsUrl`에 JSONL 결과 파일의 다운로드 URL이 담기고, `expiresAt`은 결과 보존 기간의 종료 시점으로 설정됩니다.

<Warning>
  `resultsUrl`은 유효 기간이 짧은 사전 서명된 URL입니다. 결과를 다시 다운로드해야 할 때마다 batch를 다시 조회해 새 URL을 받으세요.
</Warning>

<div id="list-batches">
  ## batch 목록 조회
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches?limit=100" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

응답은 cursor 기반으로 페이지네이션됩니다. `data`에는 최대 `limit` 개수만큼의 batch가 담기며, `hasMore`가 `true`이면 `nextCursor` 값을 `cursor` 질의 매개변수로 전달해 다음 페이지를 가져올 수 있습니다.

완료된 batch만 조회하려면 `status=completed`를 전달하세요:

```bash theme={null}
curl -s "https://api.exa.ai/batches?status=completed" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Exa-Beta: batches-2026-06-06"
```

`completed`만 지원되는 값이며, 다른 값을 전달하면 오류가 반환됩니다. 완료된 목록은 만료 시각 기준으로 정렬되고 별도의 cursor를 사용하므로, 모든 페이지 요청에 `status=completed`를 계속 포함해야 합니다. 완료 목록의 cursor와 필터링되지 않은 목록의 cursor는 서로 호환되지 않습니다.

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

<div id="download-results">
  ## 결과 다운로드
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

각 JSONL 줄에는 원본 `customId`와 함께 `response` 또는 `error` 중 하나가 포함됩니다:

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

<div id="cancel-a-batch">
  ## batch 취소
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="delete-a-batch">
  ## batch 삭제하기
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="access">
  ## 이용 방법
</div>

team에서 Batch API를 활성화하려면 [sales@exa.ai](mailto:sales@exa.ai)로 문의하세요.