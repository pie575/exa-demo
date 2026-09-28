> ## Индекс документации {#documentation-index}
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжать изучение.

# Оплата через MPP (Tempo) {#pay-with-mpp-tempo}

> Вызывайте API Search и Contents от Exa без API key — оплачивая каждый запрос в USDC.e в сети Tempo.

## Что такое MPP? {#what-is-mpp}

MPP (Machine Payments Protocol) — это открытый HTTP-нативный стандарт платежей, основанный на коде состояния `402 Payment Required`. Он позволяет клиентам оплачивать доступ к API отдельно за каждый запрос разными способами, в том числе стейблкоинами в сети [Tempo](https://tempo.xyz), — без учётных записей, API key и подписок. В примерах на этой странице используется Tempo; сейчас Exa проводит расчёты по MPP в USDC.e в основной сети Tempo.

Exa поддерживает MPP на двух эндпоинтах: **`/search`** и **`/contents`**. Если запрос отправлен без API key или платёжных учётных данных, Exa отвечает кодом `402` и платёжным запросом `WWW-Authenticate: Payment`, в котором указаны цена и порядок оплаты. Клиент подписывает платёж, повторяет запрос с учётными данными `Authorization: Payment` и получает результаты, как только платёж подтверждается в блокчейне.

Это идеальный вариант для **ИИ-агентов**, которым нужно самостоятельно оплачивать поиск в вебе без заранее выданных учётных данных.

<Info>
  MPP и доступ по API key не зависят друг от друга. Если запрос содержит header `x-api-key`, применяется обычная схема тарификации по API key, а MPP не используется вовсе.
</Info>

## Поддерживаемые эндпоинты {#supported-endpoints}

| Эндпоинт    | Метод | Описание                                                                                            |
| ----------- | ----- | --------------------------------------------------------------------------------------------------- |
| `/search`   | POST  | Веб-поиск со всеми типами поиска (`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`) |
| `/contents` | POST  | Получение контента по URL или идентификатору документа                                              |

Остальные эндпоинты Exa *пока* не принимают платежи MPP.

## Начало работы {#get-started}

Вам понадобится совместимый с Tempo кошелёк, пополненный USDC.e. Перед запуском примера экспортируйте приватный ключ кошелька:

```bash theme={null}
export WALLET_PRIVATE_KEY="0x..."
```

### Установка клиента {#install-the-client}

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

### Выполните платный поисковый запрос {#make-a-paid-search-request}

Используйте клиент MPP, чтобы подписать и отправить платёж за поисковый запрос:

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={"query": "best machine learning frameworks", "numResults": 5},
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

При успешном выполнении выводятся результаты поиска и заголовок `Payment-Receipt` с хешем ончейн-транзакции.

## Оплата из командной строки {#pay-from-the-command-line}

Если вы предпочитаете не хранить приватный ключ в открытом виде, воспользуйтесь Tempo Wallet CLI. Команда `tempo wallet login` создаёт или подключает кошелёк Tempo, авторизует локальный ключ доступа и может начислить бесплатные MPP Credits новым пользователям.

### Установка и аутентификация {#install-and-authenticate}

```bash theme={null}
curl -fsSL https://tempo.xyz/install | bash
tempo add wallet
tempo add request
tempo wallet login
```

На удалённом хосте без локального браузера выполните `tempo wallet login --no-browser` и откройте показанный URL на своём устройстве, чтобы авторизовать CLI.

### Проверка балансов и credits {#check-balances-and-credits}

```bash theme={null}
tempo wallet whoami
tempo wallet whoami --credits
```

### Выполните платный запрос {#make-a-paid-request}

```bash theme={null}
tempo request --max-spend 1.00 https://api.exa.ai/search \
  --json '{"query": "Series A fintech companies", "numResults": 5}'
```

`tempo request` перехватывает ответ `402 Payment Required`, оплачивает его и автоматически повторяет запрос.

Полный справочник по CLI см. в [документации Tempo Wallet CLI](https://tempo.xyz/developers/docs/cli/wallet) и [документации по `tempo request`](https://tempo.xyz/developers/docs/cli/request).

## Комиссии за газ {#gas-fees}

Exa берёт на себя сетевую комиссию Tempo и оплачивает её в USDC.e. На вашем кошельке достаточно иметь USDC.e только для оплаты запросов к API; баланс pathUSD или другого газового токена не нужен. Плательщика комиссии настраивать не требуется — платёжный запрос Exa и MPP SDK берут спонсирование на себя автоматически.

## Тарификация {#pricing}

В MPP действуют те же пакетные тарифы, что и при оплате по API key. Exa рассчитывает стоимость по параметрам запроса до его обработки.

### Search {#search}

| Тип поиска                | Цена за не более чем 10 результатов |
| ------------------------- | ----------------------------------- |
| `instant`, `auto`, `fast` | $0.007 за запрос                    |
| `deep-lite`, `deep`       | $0.012 за запрос                    |
| `deep-reasoning`          | $0.015 за запрос                    |

Добавление `contents.summary` обойдётся ещё в **$0.001 за результат**.

<Warning>
  Поисковые запросы через MPP ограничены 10 результатами. Если `numResults` больше 10, Exa использует 10 и тарифицирует запрос как за 10 результатов. Если вам нужно больше, используйте [оплату по API key](/ru/docs/search/quickstart).
</Warning>

### Contents {#contents}

Каждый запрошенный тип контента стоит $0,001 за URL:

| Тип контента | Цена за URL |
| ------------ | ----------- |
| `text`       | $0,001      |
| `highlights` | $0,001      |
| `summary`    | $0,001      |

Если вы не запрашиваете `text`, `highlights` или `summary`, Exa по умолчанию включает `text`.

### Примеры расчёта стоимости {#pricing-examples}

| Запрос                                          | Цена   |
| ----------------------------------------------- | ------ |
| `/search` с `type: "auto"`                      | $0.007 |
| `/search` с 3 результатами и `contents.summary` | $0.010 |
| `/search` с `type: "deep"`                      | $0.012 |
| `/contents` для 2 URL с `text: true`            | $0.002 |
| `/contents` для 1 URL с `text` и `summary`      | $0.002 |

## Как работает процесс оплаты {#how-the-payment-flow-works}

SDK автоматизирует этот процесс, но вы можете изучить его напрямую по HTTP:

1. Отправьте запрос без API key или платёжных данных. Exa вернёт `402` с запросом-вызовом `WWW-Authenticate: Payment`, содержащим цену, токен, получателя, сеть и сведения о спонсировании.
2. Подпишите вызов и повторите запрос с `Authorization: Payment <credential>`.
3. Exa обрабатывает запрос, одновременно проводя расчёт по платежу. После подтверждения расчёта Exa возвращает результаты с header `Payment-Receipt`. Если расчёт не удался, Exa возвращает `402` с новым вызовом и без результатов.

### Просмотр платёжного запроса {#inspect-a-payment-challenge}

Стоимость и детали платежа можно посмотреть без кошелька:

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "numResults": 3}'
```

Найдите header `WWW-Authenticate: Payment` в ответе `402`. Неоплаченные discovery-запросы ограничены по частоте, поэтому используйте их для отладки, а не для регулярного опроса.

## Справочник по оплате {#payment-reference}

Exa принимает платежи MPP в USDC.e в основной сети Tempo.

| Сеть          | Идентификатор | Токен  | Актив                                        |
| ------------- | ------------- | ------ | -------------------------------------------- |
| Tempo mainnet | `eip155:4217` | USDC.e | `0x20c000000000000000000000b9537d11c60e8b50` |

У USDC.e 6 знаков после запятой. Цены в challenge указываются в атомарных единицах, поэтому `7000` — это $0,007, а `1000000` — $1,00.

<Note>
  Exa поддерживает MPP и [x402](/ru/docs/integrations/payments/x402/quickstart) на одних и тех же эндпоинтах. Ответ `402` без аутентификации может содержать как MPP-платёжный запрос `WWW-Authenticate: Payment`, так и header x402 `PAYMENT-REQUIRED`. Используйте headers того платёжного протокола, который поддерживает ваш клиент.
</Note>

### Headers {#headers}

| Header                                | Направление    | Описание                                                |
| ------------------------------------- | -------------- | ------------------------------------------------------- |
| `Authorization: Payment <credential>` | Запрос         | Платёжные учётные данные MPP                            |
| `WWW-Authenticate: Payment`           | Ответ `402`    | Стоимость и платёжные инструкции для запроса            |
| `Payment-Receipt`                     | Успешный ответ | Квитанция о расчёте, включая хеш транзакции в блокчейне |

### Ошибки {#errors}

| Статус | Описание                                                                                        |
| ------ | ----------------------------------------------------------------------------------------------- |
| `402`  | Платёжные учётные данные отсутствуют или недействительны; в ответе возвращается новый challenge |
| `402`  | Сумма платежа не соответствует стоимости запроса, либо не удалось провести расчёт               |
| `429`  | С этого IP-адреса отправлено слишком много неоплаченных discovery-запросов                      |
| `429`  | Этот кошелёк превысил лимит частоты оплаченных запросов                                         |

### Лимиты частоты запросов {#rate-limits}

Лимиты MPP являются общими с x402 и не зависят от лимитов API key:

| Лимит                                      | Порог       | Окно      |
| ------------------------------------------ | ----------- | --------- |
| Неоплаченные discovery-запросы с одного IP | 5 запросов  | 60 секунд |
| Оплаченные запросы с одного кошелька       | 10 запросов | 1 секунда |

## Часто задаваемые вопросы {#faq}

<AccordionGroup>
  <Accordion title="Можно ли использовать MPP и API key одновременно?">
    Если запрос содержит header `x-api-key`, приоритет получает сценарий с API key, а MPP не применяется. Они не комбинируются: в каждом запросе работает что-то одно.
  </Accordion>

  <Accordion title="Что произойдёт, если расчёт не пройдёт уже после обработки запроса?">
    Ответ будет заблокирован. Вы получите `402` с новым платёжным запросом `WWW-Authenticate: Payment`, чтобы клиент мог повторить попытку. Результаты не возвращаются, пока расчёт не завершится успешно.
  </Accordion>

  <Accordion title="Какие кошельки поддерживаются?">
    Любой совместимый с Tempo EVM-кошелёк, которым клиентский SDK может подписывать транзакции, — аккаунт `viem` с `mppx` (TypeScript) или ключ `eth-account` с `pympp` (Python). Для ИИ-агентов используйте кошелёк с балансом USDC.e в сети Tempo, чтобы покрывать стоимость запросов.
  </Accordion>
</AccordionGroup>

## Ресурсы {#resources}

* [Документация протокола MPP](https://mpp.dev/protocol): описание протокола и формат аутентификации
* [Документация mppx](https://mpp.dev/sdk/typescript): справочник по MPP TypeScript SDK
* [Документация pympp](https://mpp.dev/sdk/python): справочник по MPP Python SDK
* [Tempo](https://tempo.xyz): документация сети Tempo
* [Оплата через x402](/ru/docs/integrations/payments/x402/quickstart): оплата тех же эндпоинтов с помощью x402
* [Руководство по Exa Search API](/ru/docs/search/quickstart): полный справочник параметров search
* [Руководство по Exa Contents API](/ru/docs/contents/quickstart): полный справочник параметров contents