> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="monitors-api">
  # Monitors API
</div>

> 반복 search를 실행하고 새로 발견된 결과를 webhook으로 전달받으세요.

Monitor는 정해진 일정에 따라 Exa search를 반복 실행하고 결과를 webhook endpoint로 전달합니다.

뉴스, 경쟁사 발표, 투자 라운드, 규제 변화, 연구 논문 등 시간에 따라 달라지는 주제를 추적하려면 Monitor를 활용하세요.

<div id="how-monitors-work">
  ## Monitor 작동 방식
</div>

Exa는 실행할 때마다 설정된 search를 수행하고, 시간 기준으로 필터링한 뒤, monitor가 이미 반환한
결과나 발견 항목을 제외하고 새로운 output을 webhook으로 전송합니다.

각 monitor는 자체 실행 이력을 관리하므로, 날짜 범위를 직접 옮겨 가며 지정하기보다는
추적하려는 지속적인 신호를 중심으로 질의를 작성하세요.

<div id="create-your-first-monitor">
  ## 첫 monitor 생성하기
</div>

search 질의, 실행 주기, 업데이트를 수신할 HTTPS endpoint를 지정해 monitor를 생성합니다:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  monitor = exa.monitors.create({
      "name": "Battery recycling expansion",
      "search": {
          "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
          "type": "interval",
          "period": "1d",
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"],
      },
  })

  print(monitor.id)
  print(monitor.webhook_secret)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const monitor = await exa.monitors.create({
    name: "Battery recycling expansion",
    search: {
      query: "new battery recycling facilities announced in North America"
    },
    trigger: {
      type: "interval",
      period: "1d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });

  console.log(monitor.id);
  console.log(monitor.webhookSecret);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "Battery recycling expansion",
      "search": {
        "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
        "type": "interval",
        "period": "1d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<Accordion title="응답 예시">
  ```json theme={null}
  {
    "id": "01k4d9w6y3h7p2m8n5q1r0s4tv",
    "name": "Battery recycling expansion",
    "status": "active",
    "search": {
      "query": "new battery recycling facilities announced in North America"
    },
    "trigger": {
      "type": "interval",
      "period": "1d"
    },
    "outputSchema": null,
    "metadata": null,
    "webhook": {
      "url": "https://example.com/webhooks/exa",
      "events": ["monitor.run.completed"]
    },
    "nextRunAt": null,
    "createdAt": "2026-09-05T20:00:00.000Z",
    "updatedAt": "2026-09-05T20:00:00.000Z",
    "webhookSecret": "<one-time-webhook-signing-secret>"
  }
  ```
</Accordion>

monitor를 생성할 때 `webhookSecret`을 반드시 저장해 두세요. 이 값은 한 번만 반환되며, webhook signature 검증에 필요합니다.

<div id="configure-the-output">
  ## 출력 구성
</div>

완료된 모든 실행은 새로 발견된 페이지를 `output.results`에 반환합니다.

또한 Exa는 각 페이지에서 얻은 내용을 종합해 `output.content`에 담습니다:

| 출력 형태     | 사용 방법                | 반환 값                                |
| --------- | -------------------- | ----------------------------------- |
| 텍스트 요약    | 기본값                  | `output.content`의 문자열               |
| 구조화된 JSON | `outputSchema` 객체 추가 | `output.content`에 schema와 일치하는 JSON |

종합된 필드의 출처는 `output.grounding`에 자동으로 반환됩니다.

후속 코드에서 일관된 필드가 필요하다면 `outputSchema`를
추가하세요:

```json theme={null}
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "announcements": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "company": { "type": "string" },
            "location": { "type": "string" },
            "announcement": { "type": "string" }
          },
          "required": ["company", "location", "announcement"]
        }
      }
    },
    "required": ["announcements"]
  }
}
```

citations와 신뢰도 정보는 schema에 포함하지 마세요. 이 값들은 `output.grounding`으로 별도 반환됩니다.

<div id="add-page-content">
  ## 페이지 콘텐츠 추가하기
</div>

`search`는 [Exa Search](/ko/docs/search/quickstart)와 동일한 옵션을 지원합니다. 각 결과에 highlights, 전체 텍스트, summaries를 함께 포함하려면 `contents`를 사용하고, 출처를 제한하려면 `includeDomains` 또는 `excludeDomains`를 사용하세요.

<CodeGroup>
  ```python Python theme={null}
  monitor = exa.monitors.create({
      "name": "LLM Research Tracker",
      "search": {
          "query": "new large language model training techniques and architectures",
          "numResults": 10,
          "contents": {
              "highlights": True
          }
      },
      "trigger": {
          "type": "interval",
          "period": "7d"
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"]
      }
  })
  ```

  ```javascript JavaScript theme={null}
  const monitor = await exa.monitors.create({
    name: "LLM Research Tracker",
    search: {
      query: "new large language model training techniques and architectures",
      numResults: 10,
      contents: {
        highlights: true
      }
    },
    trigger: {
      type: "interval",
      period: "7d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "LLM Research Tracker",
      "search": {
        "query": "new large language model training techniques and architectures",
        "numResults": 10,
        "contents": {
          "highlights": true
        }
      },
      "trigger": {
        "type": "interval",
        "period": "7d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<div id="test-your-monitor">
  ## monitor 테스트하기
</div>

다음 예약 시간까지 기다리지 말고 즉시 실행을 트리거한 뒤, 해당 실행 목록을 조회해 보세요:

<CodeGroup>
  ```python Python theme={null}
  exa.monitors.trigger(monitor.id)

  runs = exa.monitors.runs.list(monitor.id, limit=1)
  latest = runs.data[0]
  print(latest.id, latest.status)
  ```

  ```javascript JavaScript theme={null}
  await exa.monitors.trigger(monitor.id);

  const runs = await exa.monitors.runs.list(monitor.id, { limit: 1 });
  const latest = runs.data[0];
  console.log(latest.id, latest.status);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors/$MONITOR_ID/trigger" \
    -H "Authorization: Bearer $EXA_API_KEY"

  curl -s "https://api.exa.ai/monitors/$MONITOR_ID/runs?limit=1" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

실행 상태는 다음과 같습니다:

| 상태          | 의미                                    |
| ----------- | ------------------------------------- |
| `pending`   | 실행이 대기열에 있음                           |
| `running`   | 실행이 진행 중임                             |
| `completed` | 실행이 완료됨. ID로 조회하면 전체 output을 확인할 수 있음 |
| `failed`    | 실행이 실패함. `failReason`에 원인이 표시됨        |
| `cancelled` | 실행이 취소됨                               |

`output`은 실행이 완료되기 전까지 null입니다.

<div id="schedule-runs">
  ## 실행 일정
</div>

최소 간격은 1시간입니다. `1h`, `6h`, `1d`, `7d`처럼 단일 기간 값을 사용하세요. 일정은 monitor의 생성 시각을 기준으로 정해집니다. 오후 2시 30분에 생성된 일간 monitor는 매일 오후 2시 30분 무렵에 실행됩니다. 다만 각 실행은 최대 30분까지 지연될 수 있으므로 정확한 시각에 전달된다고 가정하지 마세요.

수동 실행만 가능한 monitor를 만들려면 `trigger`를 생략하세요. 일정이 설정된 monitor를 일시 중지하면 자동 실행은 중단되지만 수동 트리거는 그대로 사용할 수 있습니다.

<Note>
  monitor run은 서로 겹치지 않습니다. 이전 실행이 아직 진행 중인 상태에서 다음 예약 실행이 시작되면 Exa가 이전 실행을 취소합니다.
</Note>

<div id="receive-webhook-updates">
  ## webhook 업데이트 수신
</div>

완료된 실행만 필요하다면 `monitor.run.completed`를 구독하세요. `events`를 생략하면 Exa는
monitor 수명 주기 이벤트와 실행 생성 이벤트까지 함께 전송합니다.

완료된 실행 payload에는 실행 상태와 output이 포함됩니다. 선택 항목인 monitor `metadata`는
webhook 전송 시 그대로 함께 전달되므로, 업데이트를 알맞은 고객, 워크스페이스, 채널 또는
내부 작업으로 라우팅할 수 있습니다.

<Accordion title="완료된 실행의 webhook payload">
  아래 예시에서는 output과 timestamp를 축약했습니다.

  ```json theme={null}
  {
    "id": "event_...",
    "object": "event",
    "type": "monitor.run.completed",
    "data": {
      "id": "01k...",
      "monitorId": "01k...",
      "status": "completed",
      "output": {
        "results": [
          {
            "title": "New battery recycling facility announced",
            "url": "https://example.com/announcement"
          }
        ],
        "content": "...",
        "grounding": [
          {
            "field": "content",
            "citations": [
              {
                "title": "New battery recycling facility announced",
                "url": "https://example.com/announcement"
              }
            ],
            "confidence": "high"
          }
        ]
      },
      "failReason": null,
      "metadata": {
        "workspace_id": "workspace_123"
      }
    },
    "createdAt": "2026-09-05T20:00:00.000Z"
  }
  ```
</Accordion>

<Warning>
  리다이렉트는 따라가지 않으므로, webhook은 반드시 HTTPS를 사용해야 하며 최종 목적지여야 합니다.
  이벤트를 처리하기 전에 `Exa-Signature`를 검증하세요.
</Warning>

모든 전송에는 `t=<timestamp>,v1=<signature>` 형식의 `Exa-Signature` header가 포함됩니다.
`<timestamp>.<raw-request-body>` 문자열을 만든 뒤 일회성 `webhookSecret`으로 HMAC-SHA256 다이제스트를
계산하고, 그 결과를 `v1`과 상수 시간 비교 방식으로 대조하세요.

<CodeGroup>
  ```python Python theme={null}
  import hashlib
  import hmac


  def verify_webhook(payload: bytes, signature_header: str, secret: str) -> bool:
      parts = dict(part.split("=", 1) for part in signature_header.split(","))
      signed_payload = parts["t"].encode() + b"." + payload
      expected = hmac.new(secret.encode(), signed_payload, hashlib.sha256).hexdigest()
      return hmac.compare_digest(expected, parts["v1"])
  ```

  ```javascript JavaScript theme={null}
  import crypto from "crypto";

  function verifyWebhook(payload, signatureHeader, secret) {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((part) => part.split("=", 2))
    );
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${parts.t}.`)
      .update(payload)
      .digest("hex");
    const actualBuffer = Buffer.from(parts.v1 ?? "", "hex");
    const expectedBuffer = Buffer.from(expected, "hex");

    return (
      actualBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    );
  }
  ```
</CodeGroup>

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="monitor 생성하기" icon="bell" href="/ko/docs/reference/monitors/create-a-monitor" cta="레퍼런스 열기" arrow="true">
    search, 일정, output, metadata, webhook 등 모든 필드를 확인하세요.
  </Card>

  <Card title="monitor 실행" icon="clock" href="/ko/docs/reference/monitors/runs/get-a-run" cta="레퍼런스 열기" arrow="true">
    실행의 상태, output, grounding, 실패 원인을 확인하세요.
  </Card>

  <Card title="search 가이드" icon="search" href="/ko/docs/search/quickstart" cta="가이드 열기" arrow="true">
    질의, 필터, highlights, 전문, freshness를 설정하세요.
  </Card>

  <Card title="search 모범 사례" icon="sparkles" href="/ko/docs/search/best-practices" cta="가이드 읽기" arrow="true">
    output을 핵심에 집중시키면서 retrieval 품질을 높이세요.
  </Card>
</Columns>