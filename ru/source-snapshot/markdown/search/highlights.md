> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

<div id="highlights">
  # Highlights
</div>

> Получайте релевантные запросу выдержки из результатов Exa Search, контролируя объём контекста и задержку.

Highlights — это извлечённые из каждого результата фрагменты текста, релевантные вашему запросу. Используйте их, когда приложению нужны подтверждения со страницы, но без затрат токенов на полный текст.

Для каждого результата выбранные фрагменты возвращаются в `results[].highlights`.

<div id="why-highlights-instead-of-full-text">
  ## Почему highlights, а не полный текст
</div>

Highlights формирует собственная модель извлечения Exa. При каждом запросе модель читает каждый результат с учётом вашего запроса и возвращает только те фрагменты, которые на него отвечают. Вы тратите лишь малую долю токенов от полного текста страницы, получая при этом такое же или даже лучшее итоговое качество ответов.

| Оценка                           | Результат                                                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Точность (SimpleQA)              | 500 символов highlights дают ту же точность, что и первые 8 000 символов текста страницы, но с в 16 раз меньшим числом токенов                      |
| Качество при больших бюджетах    | 4 000 символов highlights обходят по результату 32 000 символов полного текста                                                                      |
| Длинная техническая документация | При бюджете в 500 символов highlights достигают точности 60% на справочниках API, документации SDK, спецификациях и статьях; полный текст — лишь 6% |
| Расход токенов на search         | Highlights сокращают расход токенов поиска в среднем в 5 раз                                                                                        |

Особенно ощутима эта экономия в агентных циклах, где каждая порция результатов поиска конкурирует за контекст с цепочками рассуждений.

<Tip>
  Методология и полные результаты — в статье [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents).
</Tip>

<div id="add-highlights-to-search">
  ## Добавление highlights в Search
</div>

Используйте `highlights: true` внутри `contents` — это рекомендуемое значение по умолчанию. Exa сама определяет, сколько текста вернуть из каждого результата, исходя из его релевантности вашему запросу, поэтому подбирать лимит символов не требуется. Указывайте `maxCharacters` только в том случае, если вашему приложению нужен фиксированный лимит на страницу.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "How are inference providers reducing transformer latency?",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "How are inference providers reducing transformer latency?",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "How are inference providers reducing transformer latency?",
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

<div id="dynamic-highlights">
  ## Dynamic Highlights
</div>

Dynamic Highlights подбирает объём текста, извлекаемого из каждого результата, исходя из того, что наиболее полезно для вашего запроса. Из сильных источников он может брать больше текста, а из повторяющихся или нерелевантных — меньше, сокращая общее число возвращаемых токенов.

Используйте эту возможность, когда несколько результатов попадают в один и тот же агент или контекстное окно. Оставляйте обычный `highlights: true`, если каждой странице нужен собственный фрагмент или предсказуемый лимит на страницу.

По результатам оценок Exa, Dynamic Highlights сокращает число токенов в среднем на 95% по сравнению с полным содержимым страницы. При бюджете в 12 000 символов он превзошёл обычные highlights: средний прирост эффективности по токенам составил 40%, а качество выросло на 3,8%. Внутри Exa Agent он сократил общее потребление токенов агентом на 30% при среднем приросте качества 2,1% на бенчмарках, включая BrowseComp и WideSearch.

<Tip>
  Прочитайте [Dynamic Highlights](https://exa.ai/blog/dynamic-highlights), чтобы узнать о результатах оценок и
  устройстве отбора highlights сразу по нескольким результатам.
</Tip>

Включите режим с помощью `dynamic: true`:

<CodeGroup>
  ```python Python theme={null}
  from exa_py.api import DYNAMIC_HIGHLIGHTS_BETA

  result = exa.search(
      "How did US household solar installation costs change over the past five years?",
      contents={
          "highlights": {
              "dynamic": True,
          }
      },
      betas=[DYNAMIC_HIGHLIGHTS_BETA],
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa, { DYNAMIC_HIGHLIGHTS_BETA } from "exa-js";

  const result = await exa.search(
    "How did US household solar installation costs change over the past five years?",
    {
      contents: {
        highlights: {
          dynamic: true
        }
      },
      betas: [DYNAMIC_HIGHLIGHTS_BETA]
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: dynamic-highlights-2026-08-28" \
    -d '{
      "query": "How did US household solar installation costs change over the past five years?",
      "contents": {
        "highlights": {
          "dynamic": true
        }
      }
    }'
  ```
</CodeGroup>

<Info>
  Dynamic Highlights — это исследовательская предварительная версия, для которой требуется
  заголовок запроса `Exa-Beta: dynamic-highlights-2026-08-28`. SDK отправляют его, когда вы передаёте
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) или `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript).

  В ответе используется та же
  структура `results[].highlights`, что и для обычных highlights.
</Info>

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Руководство по Search API" icon="search" href="/ru/docs/search/quickstart" cta="Открыть руководство" arrow="true">
    Соберите запрос Search и выберите подходящий формат ответа.
  </Card>

  <Card title="Лучшие практики поиска" icon="sparkles" href="/ru/docs/search/best-practices" cta="Читать руководство" arrow="true">
    Настройте качество выдачи, задержку, актуальность и объём контекста.
  </Card>
</Columns>