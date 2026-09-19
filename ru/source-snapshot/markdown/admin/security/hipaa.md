> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="hipaa">
  # HIPAA
</div>

> Используйте режим соответствия HIPAA для подходящих запросов к кэшированным данным.

<Info>
  Соответствие HIPAA доступно клиентам тарифа Enterprise после того, как Exa включит его для вашей команды. Напишите на [sales@exa.ai](mailto:sales@exa.ai), чтобы обсудить доступ к Enterprise, требования к BAA и подключение.
</Info>

Режим HIPAA включается отдельно для каждого запроса через поле `compliance` верхнего уровня:

```json theme={null}
{
  "compliance": "hipaa"
}
```

Если это поле указано для команды, которой доступна данная возможность, Exa обрабатывает запрос с применением механизмов контроля соответствия HIPAA. Если для вашей команды эта возможность не включена, API возвращает `403 FEATURE_DISABLED`.

Режим HIPAA включает [Zero Data Retention](/ru/docs/admin/security/zero-data-retention) для таких запросов: Exa не сохраняет PHI.

<div id="supported-endpoints">
  ## Поддерживаемые эндпоинты
</div>

Поле `compliance` распознаётся в:

* [`/search`](/ru/docs/reference/search)
* [`/contents`](/ru/docs/reference/get-contents)

Остальные эндпоинты отклоняют это поле.

<div id="requirements">
  ## Требования
</div>

Режим HIPAA поддерживает только получение данных из кэша. Совместимые запросы:

* В `/search` задайте для `type` значение `instant` или `fast`
* Запрашивайте `text` или `highlights` (но не `summary`)
* Используйте только кэшированный контент: не указывайте поля актуальности либо задайте `maxAgeHours: -1` в `/contents`

Несовместимые запросы возвращают `400 INVALID_REQUEST_BODY`, в том числе:

* `summary` в `/contents` или `contents.summary` в `/search`
* Параметры актуальности, требующие загрузки в реальном времени, например `maxAgeHours: 0` или положительное значение `maxAgeHours`
* Поисковые запросы без указания `type` или с типом, отличным от `instant` или `fast`

<div id="example">
  ## Пример
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
  ## Доступ
</div>

Чтобы включить режим HIPAA для вашей команды, напишите на [sales@exa.ai](mailto:sales@exa.ai). Документация по безопасности Exa доступна в [Trust Center](https://trust.exa.ai).