> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 오류 코드 {#error-codes}

> Exa API에서 사용하는 일반적인 오류 코드 reference

Exa API는 표준 HTTP 상태 코드와 JSON 오류 본문으로 실패를 알립니다.

## HTTP status codes {#http-status-codes}

| 코드                          | 의미                                                                                  | 조치 방법                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `400` Bad Request           | body, 질의 parameters, headers 또는 옵션 조합이 유효하지 않습니다.                                   | 반환된 메시지를 참고해 요청을 수정하세요.                                                      |
| `401` Unauthorized          | API 키가 없거나 유효하지 않습니다.                                                               | authentication header와 API 키를 확인하세요.                                         |
| `402` Payment Required      | credits가 소진되었거나 지출 예산을 초과했습니다.                                                      | [credits를 충전](https://dashboard.exa.ai)하거나 team 관리자에게 문의하세요.                 |
| `403` Forbidden             | API 키에 요청한 feature에 대한 접근 권한이 없거나, 정책에 의해 요청이 차단되었습니다.                              | 반환된 메시지와 사용 중인 plan의 feature 접근 권한을 확인하세요.                                   |
| `404` Not Found             | 해당 route 또는 요청한 resource가 존재하지 않습니다.                                                | 엔드포인트와 resource ID를 확인하세요.                                                   |
| `409` Conflict              | 요청이 기존 state와 충돌합니다. 예를 들어 동일한 `externalId`를 가진 Webset이 이미 존재하는 경우입니다.              | 기존 resource를 조회하거나 다른 identifier를 사용하세요.                                     |
| `422` Unprocessable Entity  | Websets 미리보기 질의를 유효한 엔티티와 criteria로 분해하지 못했습니다.                                     | 미리보기 질의를 다시 작성하세요.                                                           |
| `429` Too Many Requests     | API 키, team 또는 네트워크가 rate 또는 concurrency limit을 초과했습니다.                             | 요청 빈도를 줄이세요. `Retry-After`가 있으면 해당 초만큼 기다리고, 없으면 exponential backoff를 사용하세요. |
| `500` Internal Server Error | 예기치 않은 서버 오류가 발생했습니다.                                                               | 잠시 후 다시 시도하세요. 문제가 계속되면 지원팀에 문의하세요.                                          |
| `503` Service Unavailable   | Exa가 일시적으로 용량을 초과(`SERVICE_OVERLOADED`)했거나 사용할 수 없는 상태입니다. 요청은 처리되지 않았으며 과금되지 않습니다. | exponential backoff로 재시도하세요. 이는 요청 빈도와 무관하므로 빈도를 줄여도 소용이 없고, 재시도해야 해결됩니다.    |
| `504` Gateway Timeout       | 요청이 처리 제한 시간을 초과했습니다.                                                               | 요청을 다시 시도하거나 범위를 줄이세요.                                                       |

<Note>
  `/contents`의 URL-level failures는 요청 수준 오류가 아니라 성공한 `200` response의 `statuses` field에 보고됩니다. [Content fetch 상태 태그](#content-fetch-status-tags)를 참고하세요.
</Note>

## 오류 response 구조 {#error-response-structure}

오류 response는 `requestId`, 사람이 읽을 수 있는 `error` 메시지, 기계가 읽을 수 있는 `tag`를 반환합니다:

```json theme={null}
{
  "requestId": "67207943fab9832d162b5317f4cca830",
  "error": "Invalid request body | Validation error: Invalid value for type",
  "tag": "INVALID_REQUEST_BODY"
}
```

<Note>
  지원팀에 문의할 때 `requestId`를 함께 알려주시면 문제 해결이 더 빨라집니다.
</Note>

tag 집합은 고정되어 있지 않으며, tag 이름만 봐도 의미를 알 수 있습니다. 먼저 HTTP status code를 기준으로 분기하고, 알 수 없는 tag는 파싱 실패로 처리하지 말고 부가 정보로 취급하세요.

## 일반적인 오류 Tag {#common-error-tags}

### 계정, billing 및 접근 권한 {#account-billing-and-access}

| Tag                       | HTTP code | 설명                                                                           |
| ------------------------- | --------- | ---------------------------------------------------------------------------- |
| `INVALID_API_KEY`         | `401`     | API 키가 없거나, 비어 있거나, 유효하지 않습니다.                                               |
| `NO_MORE_CREDITS`         | `402`     | 계정에 남은 credits가 없습니다 — [dashboard.exa.ai](https://dashboard.exa.ai)에서 충전하세요. |
| `API_KEY_BUDGET_EXCEEDED` | `402`     | API 키가 지출 예산을 초과했습니다 — team 관리자에게 문의하세요.                                     |
| `TEAM_BUDGET_EXCEEDED`    | `402`     | team이 현재 billing 주기의 지출 예산을 초과했습니다.                                          |
| `FEATURE_DISABLED`        | `403`     | 요청한 엔드포인트, search type 또는 옵션이 사용 중인 plan에서 활성화되어 있지 않습니다.                    |
| `PROHIBITED_CONTENT`      | `403`     | 콘텐츠 안전 검열에 의해 요청이 거부되었습니다.                                                   |
| `CONTENT_FILTER_ERROR`    | `403`     | 처리 중 안전 정책에 의해 콘텐츠가 거부되었습니다.                                                 |
| `RATE_LIMIT_EXCEEDED`     | `429`     | API 키, team 또는 네트워크가 각자의 속도 제한을 초과했습니다 — 요청 빈도를 줄이세요.                        |
| `SERVICE_OVERLOADED`      | `503`     | Exa의 처리 용량이 일시적으로 초과되어 요청이 처리 전에 차단되었습니다 — exponential backoff로 재시도하세요.      |

### 요청 검증 {#request-validation}

| Tag                       | HTTP code | 설명                                                     |
| ------------------------- | --------- | ------------------------------------------------------ |
| `INVALID_REQUEST_BODY`    | `400`     | JSON body가 schema 검증을 통과하지 못했습니다.                      |
| `INVALID_REQUEST`         | `400`     | 옵션이 서로 충돌하거나, 베타 feature를 `Exa-Beta` header 없이 사용했습니다. |
| `INVALID_NUM_RESULTS`     | `400`     | highlights를 요청하는 경우 `numResults`는 100 이하여야 합니다.        |
| `NUM_RESULTS_EXCEEDED`    | `400`     | 요청한 result 개수가 plan의 limit을 초과했습니다.                    |
| `INVALID_JSON_SCHEMA`     | `400`     | 제공된 output schema가 유효하지 않습니다.                          |
| `SUBPAGES_LIMIT_EXCEEDED` | `400`     | `/contents`는 요청당 최대 100개의 하위 페이지만 허용합니다.               |

### 결제 프로토콜 {#payment-protocols}

x402 또는 MPP로 결제된 요청은 다음도 반환할 수 있습니다:

| Tag                        | HTTP code | 설명                              |
| -------------------------- | --------- | ------------------------------- |
| `X402_PAYMENT_REQUIRED`    | `402`     | 결제가 필요합니다.                      |
| `X402_INVALID_SIGNATURE`   | `400`     | x402 결제 signature가 유효하지 않습니다.   |
| `X402_VERIFICATION_FAILED` | `402`     | x402 결제를 verification하지 못했습니다.  |
| `MPP_VERIFICATION_FAILED`  | `402`     | MPP 결제를 verification하지 못했습니다.   |
| `X402_TOO_MANY_UNPAID`     | `429`     | 결제 대기 중인 x402 요청이 너무 많습니다.      |
| `X402_WALLET_RATE_LIMITED` | `429`     | x402 wallet이 속도 제한을 초과했습니다.     |
| `X402_INTERNAL_ERROR`      | `500`     | Exa가 x402 결제 요구 사항을 생성하지 못했습니다. |

## Content fetch 상태 태그 {#content-fetch-status-tags}

`/contents`에 여러 URL을 전달하면 일부 URL만 실패하고 나머지는 성공할 수 있습니다. URL 단위 실패는 `statuses` field에 반환되며, 요청 전체가 실패하지는 않습니다:

```json theme={null}
{
  "results": [],
  "statuses": [
    {
      "id": "https://example.com",
      "status": "error",
      "error": {
        "tag": "CRAWL_NOT_FOUND",
        "httpStatusCode": 404
      }
    }
  ]
}
```

`httpStatusCode`는 `/contents` response가 아니라 대상 페이지의 상태를 나타냅니다.

| Tag                       | 설명                                        | 처리 방법                                            |
| ------------------------- | ----------------------------------------- | ------------------------------------------------ |
| `CRAWL_NOT_FOUND`         | 대상 페이지를 찾을 수 없습니다.                        | URL이 올바르고 접근 가능한지 확인하세요.                         |
| `CRAWL_HTTP_{status}`     | 대상이 `CRAWL_HTTP_403`과 같은 HTTP 오류를 반환했습니다. | 태그에 포함된 대상 상태 코드에 맞게 처리하세요.                      |
| `CRAWL_TIMEOUT`           | 대상 페이지를 가져오는 중 크롤이 시간 초과되었습니다.            | 요청을 다시 시도하거나 나중에 다시 시도하세요.                       |
| `CRAWL_LIVECRAWL_TIMEOUT` | 실시간 검색이 요청한 `livecrawlTimeout`을 초과했습니다.   | `livecrawlTimeout`을 늘리거나 `maxAgeHours`를 조정하세요.   |
| `SOURCE_NOT_AVAILABLE`    | 소스에 대한 접근이 금지되었거나 소스를 사용할 수 없습니다.         | 소스가 authentication을 요구하는지 또는 접근이 제한되어 있는지 확인하세요. |
| `UNSUPPORTED_URL`         | 해당 URL 스킴은 콘텐츠 가져오기에서 지원되지 않습니다.          | 표준 HTTP 또는 HTTPS URL을 사용하세요.                     |
| `CRAWL_UNKNOWN_ERROR`     | 다른 이유로 크롤이 실패했습니다.                        | 요청을 다시 시도하고, 계속 발생하면 지원팀에 문의하세요.                 |

이 상태 태그는 `/contents`에만 적용됩니다. `/search`는 `statuses` field를 반환하지 않습니다.

## 도움 받기 {#getting-help}

* `500`, `503`, `504` 오류가 계속 발생하면 [Exa 상태](/ko/docs/admin/status)를 확인하세요.
* 현재 limits는 [속도 제한](/ko/docs/admin/billing#rate-limits)에서 확인하세요.
* 요청 요구 사항은 해당 엔드포인트의 [API reference](/ko/docs/reference/search)를 참고하세요.
* response 상태, 오류 본문, `requestId`와 함께 [hello@exa.ai](mailto:hello@exa.ai)로 문의하세요.