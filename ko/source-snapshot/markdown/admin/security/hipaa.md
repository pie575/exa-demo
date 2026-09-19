> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

<div id="hipaa">
  # HIPAA
</div>

> 대상이 되는 캐시된 retrieval 요청에 HIPAA 준수 모드를 사용하세요.

<Info>
  HIPAA 준수 기능은 Exa가 해당 team에 대해 활성화한 이후 Enterprise 고객이 사용할 수 있습니다. Enterprise 이용, BAA 요건, 활성화에 대한 문의는 [sales@exa.ai](mailto:sales@exa.ai)로 보내주세요.
</Info>

HIPAA 모드는 최상위 `compliance` 필드로 요청별로 제어합니다:

```json theme={null}
{
  "compliance": "hipaa"
}
```

자격을 갖춘 team의 요청에 이 필드가 포함되면 Exa는 HIPAA 규정 준수 제어를 적용하여 해당 요청을 처리합니다. team에 이 기능이 활성화되어 있지 않으면 API는 `403 FEATURE_DISABLED`를 반환합니다.

HIPAA 모드는 해당 요청에 [Zero Data Retention](/ko/docs/admin/security/zero-data-retention)을 적용합니다. 즉, Exa는 PHI를 보관하지 않습니다.

<div id="supported-endpoints">
  ## 지원되는 endpoint
</div>

`compliance` 필드는 다음 endpoint에서 인식됩니다:

* [`/search`](/ko/docs/reference/search)
* [`/contents`](/ko/docs/reference/get-contents)

그 외 endpoint에서는 이 필드가 거부됩니다.

<div id="requirements">
  ## 요구 사항
</div>

HIPAA 모드는 캐시된 retrieval만 지원합니다. 호환되는 요청은 다음과 같습니다.

* `/search`에서 `type`을 `instant` 또는 `fast`로 설정
* `text` 또는 `highlights` 요청(`summary`는 불가)
* 캐시 전용 콘텐츠 사용: freshness 관련 필드를 생략하거나 `/contents`에서 `maxAgeHours: -1` 설정

호환되지 않는 요청은 `400 INVALID_REQUEST_BODY`를 반환하며, 다음이 이에 해당합니다.

* `/contents`의 `summary` 또는 `/search`의 `contents.summary`
* 실시간 fetch가 필요한 freshness 설정(예: `maxAgeHours: 0` 또는 양수 `maxAgeHours`)
* `type`을 생략했거나 `instant`, `fast` 이외의 타입을 사용한 search request

<div id="example">
  ## 예시
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "urls": ["https://example.com/article"],
      "compliance": "hipaa",
      "highlights": true,
      "maxAgeHours": -1
    }'
  ```
</CodeGroup>

<div id="access">
  ## 접근 권한
</div>

team에 HIPAA 모드를 활성화하려면 [sales@exa.ai](mailto:sales@exa.ai)로 문의하세요. Exa 보안 문서는 [Trust Center](https://trust.exa.ai)에서 확인할 수 있습니다.