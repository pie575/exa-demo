> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжать изучение.

<div id="affiliatecom">
  # Affiliate.com
</div>

> Поиск по товарным каталогам продавцов и партнёрских сетей.

[Affiliate.com](https://affiliate.com) объединяет товарные каталоги продавцов
и партнёрских сетей в единый поисковый индекс с актуальными ценами, брендами
и прямыми ссылками на продавцов.

Подключите `affiliate` к запуску [Exa Agent](/ru/docs/agent/quickstart) через
[Exa Connect](/ru/docs/agent/connect/overview) — и агент будет обращаться к
Affiliate.com наряду с веб-поиском Exa.

<div id="use-it-for">
  ## Для чего использовать
</div>

* Поиск товаров и сравнение цен у разных продавцов.
* Работа шопинг-ассистентов и подготовка гайдов по покупкам.
* Показ партнёрских ссылок рядом с результатами исследования.

<div id="provider-id">
  ## Provider ID
</div>

Используйте это значение в `dataSources`:

```text theme={null}
affiliate
```

<div id="example">
  ## Пример
</div>

Найдите беспроводные наушники с шумоподавлением дешевле $300 и сравните цены.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      data_sources=[{"provider": "affiliate"}],
      output_schema={
          "type": "object",
          "required": ["products"],
          "properties": {
              "products": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "brand", "price", "merchant"],
                      "properties": {
                          "name": {"type": "string"},
                          "brand": {"type": "string"},
                          "price": {"type": "string", "description": "price with currency"},
                          "merchant": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
    dataSources: [{ provider: "affiliate" }],
    outputSchema: {
      type: "object",
      required: ["products"],
      properties: {
        products: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "brand", "price", "merchant"],
            properties: {
              name: { type: "string" },
              brand: { type: "string" },
              price: { type: "string", description: "price with currency" },
              merchant: { type: "string" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      "dataSources": [{ "provider": "affiliate" }],
      "outputSchema": {
        "type": "object",
        "required": ["products"],
        "properties": {
          "products": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "brand", "price", "merchant"],
              "properties": {
                "name": { "type": "string" },
                "brand": { "type": "string" },
                "price": { "type": "string", "description": "price with currency" },
                "merchant": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## Хорошо сочетается с
</div>

* [Similarweb](/ru/docs/agent/connect/similarweb): оцените охват продавца, прежде чем рекомендовать его.
* [Fiber.ai](/ru/docs/agent/connect/fiber): изучите компанию, стоящую за продавцом или брендом.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Подключите к запуску" icon="rocket" href="/ru/docs/agent/connect/overview" cta="Открыть быстрый старт" arrow="true">
    Быстрый старт Exa Connect охватывает `dataSources`, цены и полный каталог партнёров.
  </Card>

  <Card title="Комбинируйте провайдеров" icon="blend" href="/ru/docs/agent/connect/combining-providers" cta="Читать руководство" arrow="true">
    Подключите к одному запуску до пяти партнёров и сформулируйте запрос так, чтобы сработал каждый из них.
  </Card>

  <Card title="Изучите Exa Agent" icon="book-open" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создавайте запуски, отслеживайте ход выполнения в потоковом режиме, проектируйте схемы вывода и управляйте затратами усилий и стоимостью.
  </Card>

  <Card title="Получите API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Создать key" arrow="true">
    Создайте key в панели управления и запустите пример с этой страницы как есть. Новым аккаунтам начисляются бесплатные credits.
  </Card>
</Columns>