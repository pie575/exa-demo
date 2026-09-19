> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжить изучение.

<div id="tempo-mpp-gtm-enrichment-cookbook">
  # Практическое руководство по GTM-enrichment с Tempo MPP
</div>

> Постройте процесс GTM-enrichment с оплатой за каждый запрос search и contents к Exa через Tempo MPP — без API key.

Используйте это руководство, чтобы создать агента или конвейер GTM-enrichment на основе
эндпоинтов Exa `/search` и `/contents` с оплатой за каждый запрос через Machine
Payments Protocol (MPP). MPP поддерживает несколько способов оплаты; в примерах
ниже используются стейблкоины в сети [Tempo](https://tempo.xyz). Никакой месячной подписки, никаких
API key и никакой оплаты за место: пополните кошелёк в USDC.e и платите по мере
enrichment лидов или компаний.

<Info>
  Сейчас MPP поддерживается только для эндпоинтов Exa `/search` и `/contents`.
  Для Agent API (`/agent/runs`) и `/answer` нужен Exa API key — они тарифицируются
  по стандартной схеме с оплатой через API key.
</Info>

<div id="what-youll-build">
  ## Что вы создадите
</div>

Лёгкий конвейер enrichment, который по списку названий компаний или
описаний целевых объектов:

1. Использует Exa `/search` с `type: "deep"` и `outputSchema`, чтобы найти
   официальную страницу компании и извлечь ключевые метаданные.
2. Применяет `contents.highlights` к полученному результату, чтобы вытащить
   фрагменты источников о финансировании, штаб-квартире, сотрудниках и продукте.
3. Формирует запись enrichment в формате CSV или JSON для каждого входного элемента.

Этот подход хорошо подходит для enrichment списков лидов, исследования компаний-клиентов и
персонализации исходящих коммуникаций. Поскольку он состоит из отдельных вызовов
`/search` + `/contents`, каждый шаг можно оплатить через MPP.

<div id="prerequisites">
  ## Предварительные требования
</div>

* Совместимый с Tempo кошелёк, пополненный **USDC.e** в основной сети Tempo.
* Безопасный способ загрузки приватного ключа кошелька во время выполнения (см. ниже; никогда
  не коммитьте ключ и не раскрывайте его в исходном коде).
* Установленный `mppx` (TypeScript) или `pympp` (Python).

<Info>
  Если нужна настройка из командной строки без использования «сырого» приватного ключа, воспользуйтесь [Tempo Wallet CLI](/ru/docs/integrations/payments/mpp/quickstart#pay-from-the-command-line). Команда `tempo wallet login` создаёт или подключает кошелёк и для новых пользователей может включать бесплатные MPP Credits.
</Info>

<div id="mpp-setup">
  ## Настройка MPP
</div>

<div id="install-the-client">
  ### Установите клиент
</div>

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

<div id="load-your-private-key-safely">
  ### Безопасная загрузка приватного ключа
</div>

Никогда не зашивайте приватный ключ в код. В примерах ниже значение `WALLET_PRIVATE_KEY` считывается из переменных окружения — только для локальной разработки. В продакшене загружайте его из менеджера секретов, например 1Password, AWS Secrets Manager или HashiCorp Vault.

<CodeGroup>
  ```bash TypeScript theme={null}
  # Задайте в оболочке или в хранилище секретов CI; никогда не коммитьте это значение
  export WALLET_PRIVATE_KEY="0x..."
  ```

  ```bash Python theme={null}
  # Задайте в оболочке или в хранилище секретов CI; никогда не коммитьте это значение
  export WALLET_PRIVATE_KEY="0x..."
  ```
</CodeGroup>

<div id="make-a-paid-search-request">
  ### Отправка платного поискового запроса
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  // В продакшене загружайте значение из менеджера секретов — никогда не коммитьте его в открытом виде.
  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      numResults: 5,
      contents: { highlights: true },
    }),
  });

  const data = (await response.json()) as { results: { title: string; url: string }[] };
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      # В продакшене загружайте значение из менеджера секретов — никогда не коммитьте его в открытом виде.
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": "Series A fintech companies with 50-200 employees",
                  "numResults": 5,
                  "contents": {"highlights": True},
              },
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

При успешном выполнении возвращаются результаты Exa и header `Payment-Receipt`
с хешем транзакции в блокчейне.

<div id="make-a-paid-contents-request">
  ### Выполните платный запрос к contents
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  const contentsResponse = await mppx.fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: ["https://www.example.com"],
      text: true,
      summary: true,
    }),
  });

  const contentsData = (await contentsResponse.json()) as {
    results: { url: string; text?: string; summary?: string }[];
  };
  console.log(contentsData.results[0]);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/contents",
      json={
          "urls": ["https://www.example.com"],
          "text": True,
          "summary": True,
      },
  )
  print(response.json()["results"][0])
  ```
</CodeGroup>

<div id="gtm-enrichment-recipe">
  ## Рецепт GTM Enrichment
</div>

<div id="enrich-a-list-of-companies">
  ### Обогащение списка компаний
</div>

Имея список названий компаний, найдите страницу каждой из них и извлеките
структурированные сведения.

<CodeGroup>
  ```typescript TypeScript theme={null}
  interface CompanyEnrichment {
    name: string;
    url: string;
    title: string;
    industry?: string;
    headquarters?: string;
    funding?: string;
    summary?: string;
    highlights: string[];
  }

  async function enrichCompanies(names: string[]): Promise<CompanyEnrichment[]> {
    const enriched: CompanyEnrichment[] = [];

    for (const name of names) {
      const response = await mppx.fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `${name} official company`,
          type: "deep",
          numResults: 1,
          contents: {
            highlights: { query: "funding, headquarters, employees, product" },
          },
          outputSchema: {
            type: "object",
            properties: {
              company: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  industry: { type: "string" },
                  headquarters: { type: "string" },
                  funding: { type: "string" },
                  summary: { type: "string" },
                },
                required: ["name", "url"],
              },
            },
            required: ["company"],
          },
        }),
      });

      const data = (await response.json()) as {
        output?: { company?: CompanyEnrichment & { summary?: string } };
        results?: { highlights?: string[] }[];
      };
      const company = data.output?.company;
      const highlights = data.results?.[0]?.highlights?.slice(0, 3) ?? [];
      if (!company) continue;

      enriched.push({
        ...company,
        title: company.name,
        highlights,
      });
    }

    return enriched;
  }
  ```

  ```python Python theme={null}
  async def enrich_companies(names):
      enriched = []
      for name in names:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": f"{name} official company",
                  "type": "deep",
                  "numResults": 1,
                  "contents": {
                      "highlights": {"query": "funding, headquarters, employees, product"}
                  },
                  "outputSchema": {
                      "type": "object",
                      "properties": {
                          "company": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "url": {"type": "string"},
                                  "industry": {"type": "string"},
                                  "headquarters": {"type": "string"},
                                  "funding": {"type": "string"},
                                  "summary": {"type": "string"},
                              },
                              "required": ["name", "url"],
                          }
                      },
                      "required": ["company"],
                  },
              },
          )
          data = response.json()
          company = data.get("output", {}).get("company")
          highlights = []
          if data.get("results"):
              highlights = data["results"][0].get("highlights", [])[:3]
          if not company:
              continue

          enriched.append({
              "name": company["name"],
              "url": company["url"],
              "title": company["name"],
              "industry": company.get("industry"),
              "headquarters": company.get("headquarters"),
              "funding": company.get("funding"),
              "summary": company.get("summary"),
              "highlights": highlights,
          })
      return enriched
  ```
</CodeGroup>

<div id="enrich-a-person-profile">
  ### Обогащение профиля человека
</div>

В этом рецепте используются `type: "deep"`, `contents.highlights` и `outputSchema`, чтобы
собрать информацию о человеке и вернуть структурированный профиль.

<CodeGroup>
  ```typescript TypeScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Exa Labs founders contact and background",
      type: "deep",
      numResults: 5,
      contents: {
        highlights: { query: "email, title, education, work history, LinkedIn" },
      },
      outputSchema: {
        type: "object",
        properties: {
          people: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                title: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                linkedInUrl: { type: "string" },
                summary: { type: "string" },
              },
              required: ["name"],
            },
          },
        },
        required: ["people"],
      },
    }),
  });

  const data = (await response.json()) as {
    output?: { people: { name: string; title?: string; company?: string }[] };
  };
  console.log(data.output?.people);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Exa Labs founders contact and background",
          "type": "deep",
          "numResults": 5,
          "contents": {
              "highlights": {"query": "email, title, education, work history, LinkedIn"}
          },
          "outputSchema": {
              "type": "object",
              "properties": {
                  "people": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "title": {"type": "string"},
                              "company": {"type": "string"},
                              "email": {"type": "string"},
                              "linkedInUrl": {"type": "string"},
                              "summary": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["people"],
          },
      },
  )

  print(response.json().get("output", {}).get("people"))
  ```
</CodeGroup>

<Note>
  Здесь `type: "deep"` обеспечивает более глубокий анализ, а `outputSchema` задаёт
  структуру ответа. Deep search стоит $0,012 за запрос, а
  `contents.highlights` добавляет $0,001 за каждый результат.
</Note>

<div id="structured-output">
  ### Структурированный вывод
</div>

Если вместо необработанного текста вам нужны поля JSON, используйте `outputSchema` в запросе
к search. Exa вернёт объект `output`, структура которого соответствует вашей схеме.

<CodeGroup>
  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Series A fintech companies with 50-200 employees",
          "type": "deep-lite",
          "numResults": 5,
          "outputSchema": {
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "headcount": {"type": "string"},
                              "headquarters": {"type": "string"},
                              "fundingStage": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["companies"],
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      type: "deep-lite",
      numResults: 5,
      outputSchema: {
        type: "object",
        properties: {
          companies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                headcount: { type: "string" },
                headquarters: { type: "string" },
                fundingStage: { type: "string" }
              },
              required: ["name"]
            }
          }
        },
        required: ["companies"]
      }
    })
  });
  ```
</CodeGroup>

<Note>
  `outputSchema` лучше всего работает с типами search `deep-lite` и `deep`. Он добавляет
  вызов LLM на стороне Exa, поэтому тарифицируется как `deep-lite`/`deep`.
</Note>

<div id="pricing-and-limits">
  ## Цены и лимиты
</div>

MPP использует ту же тарификацию за запрос, что и оплата по API key. Количество результатов
в search-запросах через MPP ограничено 10.

| Операция                                        | Цена                |
| ----------------------------------------------- | ------------------- |
| `/search` с `type` `instant`, `auto` или `fast` | $0,007 за запрос    |
| `/search` с `type` `deep-lite` или `deep`       | $0,012 за запрос    |
| `/search` с `type` `deep-reasoning`             | $0,015 за запрос    |
| `contents.text`                                 | $0,001 за URL       |
| `contents.highlights`                           | $0,001 за URL       |
| `contents.summary`                              | $0,001 за результат |

Полное описание, включая лимиты частоты запросов, параметры сети и платёжные header, см. в разделе [Оплата через MPP (Tempo)](/ru/docs/integrations/payments/mpp/quickstart).

<div id="production-tips">
  ## Советы для продакшена
</div>

* **Пополняйте кошелёк только в USDC.e.** Exa берёт на себя комиссию сети Tempo,
  поэтому отдельный газовый токен кошельку не нужен.
* **Обрабатывайте ответы `402`.** MPP SDK повторяет запросы автоматически, но
  собственный клиент должен повторять запрос при `402`, используя запрос-вызов
  `WWW-Authenticate: Payment`.
* **Кэшируйте результаты `/contents`.** Contents тарифицируются за каждый URL.
  Кэшируйте по URL, чтобы не платить дважды за одну и ту же страницу компании.
* **Помните об ограничении в 10 результатов.** MPP search ограничивает `numResults` до 10.
* **Никогда не коммитьте приватные ключи.** Загружайте `WALLET_PRIVATE_KEY` из
  менеджера секретов, а не из системы контроля версий.

<div id="faq">
  ## Часто задаваемые вопросы
</div>

<AccordionGroup>
  <Accordion title="Можно ли использовать MPP с Exa Agent API?">
    Нет. В кодовой базе Exa MPP подключён только к `/search` и `/contents`.
    Для `/agent/runs` и `/answer` требуется Exa API key, и они используют
    стандартную тарификацию по API key.
  </Accordion>

  <Accordion title="Можно ли совмещать MPP и Exa API key в одном запросе?">
    Нет. Если запрос содержит `x-api-key` или `Authorization: Bearer`,
    приоритет получает сценарий с API key, а MPP не задействуется.
  </Accordion>

  <Accordion title="Что произойдёт, если расчёт по MPP не пройдёт?">
    Exa вернёт `402` с новым запросом-вызовом `WWW-Authenticate: Payment` и без
    результатов. Ваш клиент может повторить попытку с новым платежом. Пока
    расчёт не пройдёт успешно, результаты не возвращаются.
  </Accordion>

  <Accordion title="Нужен ли отдельный кошелёк Tempo для каждой среды?">
    Можно использовать один и тот же кошелёк, но мы рекомендуем заводить
    отдельные кошельки для разработки и продакшена. Лимит QPS на кошелёк —
    10 запросов в секунду по всем запросам с этого кошелька.
  </Accordion>
</AccordionGroup>

<div id="next-steps">
  ## Дальнейшие шаги
</div>

* [Оплата через MPP (Tempo)](/ru/docs/integrations/payments/mpp/quickstart): полный справочник по MPP
* [Руководство по Exa Search API](/ru/docs/search/quickstart): справочник параметров search
* [Руководство по Exa Contents API](/ru/docs/contents/quickstart): справочник параметров contents
* [Документация Tempo MPP](https://mpp.dev/protocol): подробности о протоколе и SDK