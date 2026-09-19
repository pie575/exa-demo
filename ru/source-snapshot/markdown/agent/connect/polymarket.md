> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="polymarket">
  # Polymarket
</div>

> Получайте котировки рынков предсказаний, историю цен, стаканы заявок и позиции трейдеров.

[Polymarket](https://polymarket.com) — платформа рынков предсказаний, где
рыночные цены отражают оценку вероятности реальных
событий участниками рынка. [Exa Connect](/ru/docs/agent/connect/overview) предоставляет
доступ к публичным рыночным данным Polymarket в режиме только для чтения.

Подключите `polymarket` к запуску [Exa Agent](/ru/docs/agent/quickstart) — и
агент будет обращаться к Polymarket параллельно с веб-поиском Exa.

<div id="use-it-for">
  ## Для чего использовать
</div>

* Поиск рынков предсказаний и текущих подразумеваемых рынком вероятностей по интересующей теме.
* Сравнение того, как подразумеваемая вероятность исхода менялась со временем.
* Анализ ликвидности рынка, глубины bid/ask и крупнейших держателей позиций.
* Просмотр текущих позиций трейдера и его недавней ончейн-активности.

<div id="provider-id">
  ## Идентификатор провайдера
</div>

Используйте это значение в `dataSources`:

```text theme={null}
polymarket
```

<div id="pricing">
  ## Стоимость
</div>

API Polymarket для чтения данных не требуют аутентификации и бесплатны, поэтому вызовы инструментов Polymarket
ничего не стоят: вы оплачиваете только стандартные
[тарифы на запуски Agent](/ru/docs/agent/quickstart#pricing).

<div id="data-available">
  ## Доступные данные
</div>

| Данные               | Описание                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| Рынки и события      | Текущие рынки предсказаний и события с ценами, отражающими подразумеваемую вероятность, объёмом и ликвидностью. |
| История цен          | Как подразумеваемая вероятность исхода менялась во времени.                                                     |
| Стаканы заявок       | Актуальная глубина bid/ask и спред по исходу рынка.                                                             |
| Держатели и трейдеры | Крупнейшие держатели позиций по рынку, а также текущие позиции трейдера и его недавняя ончейн-активность.       |

<div id="example">
  ## Пример
</div>

Получите подразумеваемую рынком вероятность снижения ставки ФРС и узнайте, как она менялась за последний месяц.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "What are the current market-implied odds of a Fed rate cut at the "
          "next FOMC meeting, and how have they moved over the past month?"
      ),
      data_sources=[{"provider": "polymarket"}],
      output_schema={
          "type": "object",
          "required": ["market", "currentProbability", "trend"],
          "properties": {
              "market": {"type": "string", "description": "the market question"},
              "currentProbability": {"type": "number", "description": "between 0 and 1"},
              "trend": {"type": "string", "description": "how the implied probability moved over the past month"},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
    dataSources: [{ provider: "polymarket" }],
    outputSchema: {
      type: "object",
      required: ["market", "currentProbability", "trend"],
      properties: {
        market: { type: "string", description: "the market question" },
        currentProbability: { type: "number", description: "between 0 and 1" },
        trend: { type: "string", description: "how the implied probability moved over the past month" },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
      "dataSources": [{ "provider": "polymarket" }],
      "outputSchema": {
        "type": "object",
        "required": ["market", "currentProbability", "trend"],
        "properties": {
          "market": { "type": "string", "description": "the market question" },
          "currentProbability": { "type": "number", "description": "between 0 and 1" },
          "trend": { "type": "string", "description": "how the implied probability moved over the past month" }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## Хорошо сочетается с
</div>

* [Веб-поиск Exa](/ru/docs/search/quickstart): дополните подразумеваемые рынком вероятности публикациями и общим контекстом.
* [Particle](/ru/docs/agent/connect/particle): найдите новости, стоящие за изменением вероятностей.
* [Financial Datasets](/ru/docs/agent/connect/financialdatasets): свяжите подразумеваемые рынком вероятности с ценами, фундаментальными и макроэкономическими данными.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Подключите к запуску" icon="rocket" href="/ru/docs/agent/connect/overview" cta="Открыть быстрый старт" arrow="true">
    Быстрый старт Exa Connect охватывает `dataSources`, цены и полный каталог партнёров.
  </Card>

  <Card title="Комбинируйте провайдеров" icon="blend" href="/ru/docs/agent/connect/combining-providers" cta="Читать руководство" arrow="true">
    Подключите до пяти партнёров к одному запуску и составьте запрос так, чтобы срабатывал каждый из них.
  </Card>

  <Card title="Изучите Exa Agent" icon="book-open" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создавайте запуски, отслеживайте ход выполнения в потоковом режиме, проектируйте схемы вывода и управляйте объёмом работы и стоимостью.
  </Card>

  <Card title="Получите API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Создать key" arrow="true">
    Создайте key в панели управления и запустите пример с этой страницы как есть. Новым аккаунтам начисляются бесплатные credits.
  </Card>
</Columns>