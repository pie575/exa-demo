> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение.

<div id="pay-with-x402">
  # Оплата через x402
</div>

> Используйте API Search и Contents от Exa без API key. Оплачивайте каждый запрос в USDC в сети Base или Solana по протоколу x402.

<div id="what-is-x402">
  ## Что такое x402?
</div>

[x402](https://x402.org) — это открытый платёжный стандарт, основанный на HTTP-коде состояния `402 Payment Required`. Он позволяет клиентам оплачивать доступ к API по каждому запросу стейблкоинами USDC в сетях Base или Solana — без учётных записей, API key и подписок.

Exa поддерживает x402 на двух эндпоинтах: **`/search`** и **`/contents`**. Если вы отправляете запрос без API key или платёжного header, Exa отвечает кодом `402` и header `PAYMENT-REQUIRED`, в котором указаны сведения о стоимости и поддерживаемые платёжные сети. Ваш клиент подписывает платёж в USDC, повторяет запрос с header `PAYMENT-SIGNATURE` и получает результаты, как только расчёт подтверждается в блокчейне.

Это идеальный вариант для **ИИ-агентов**, которым нужно самостоятельно оплачивать веб-поиск без заранее выданных учётных данных.

<Info>
  x402 и доступ по API key независимы друг от друга. Если запрос содержит header `x-api-key` или `Authorization: Bearer`, применяется обычная схема тарификации по API key, а x402 полностью обходится.
</Info>

<div id="supported-endpoints">
  ## Поддерживаемые эндпоинты
</div>

| Эндпоинт    | Метод | Описание                                                                                            |
| ----------- | ----- | --------------------------------------------------------------------------------------------------- |
| `/search`   | POST  | Веб-поиск со всеми типами поиска (`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`) |
| `/contents` | POST  | Получение содержимого по URL или идентификатору документа                                           |

Все остальные эндпоинты через x402 **недоступны**.

<div id="how-it-works">
  ## Как это работает
</div>

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/payments/x402/payment-flow.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a560d80bb84828e03dfacd61351e9fb" alt="Диаграмма последовательности платёжного потока x402: клиент отправляет запрос на сервер, получает 402 с header PAYMENT-REQUIRED, формирует payload платежа, повторяет запрос с PAYMENT-SIGNATURE, сервер проверяет его через facilitator, выполняет работу, проводит расчёт в блокчейне и возвращает 200 с результатами и PAYMENT-RESPONSE" width="4224" height="2720" data-path="images/integrations/payments/x402/payment-flow.png" />
</Frame>

<div id="step-1-discovery">
  ### Шаг 1. Обнаружение
</div>

Отправьте запрос к поддерживаемому эндпоинту без API key и без платёжного header:

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "best machine learning frameworks", "numResults": 5}'
```

Вы получите ответ `402` с header `PAYMENT-REQUIRED`, закодированным в base64. В декодированном виде он выглядит так:

```json theme={null}
{
  "x402Version": 2,
  "resource": {
    "url": "https://api.exa.ai/search",
    "description": "Exa /search endpoint"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:8453",
      "amount": "7000",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "payTo": "0x...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2" }
    },
    {
      "scheme": "exact",
      "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      "amount": "7000",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "payTo": "...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2", "feePayer": "..." }
    }
  ]
}
```

Значение `amount` указывается в атомарных единицах USDC (6 знаков после запятой), поэтому `"7000"` = $0,007.
Клиент может оплатить с помощью любой из заявленных записей `accepts`, которую он поддерживает. Записи Solana содержат поля, предоставляемые фасилитатором, например `extra.feePayer`; при формировании платежа используйте запись ровно в том виде, в каком она указана в header `PAYMENT-REQUIRED`.

<div id="step-2-pay-and-retry">
  ### Шаг 2. Оплатите и повторите запрос
</div>

Подпишите платёж своим кошельком и отправьте запрос повторно с header `PAYMENT-SIGNATURE`, содержащим ваш payload платежа в кодировке base64. Клиентские SDK x402 делают это автоматически.

<div id="step-3-settlement">
  ### Шаг 3. Расчёт
</div>

Exa проверяет подпись вашего платежа у фасилитатора, после чего запускает ончейн-расчёт **параллельно** с обработкой запроса. Ответ удерживается до подтверждения расчёта. В случае успеха вы получаете:

* HTTP `200` с вашими результатами
* header `PAYMENT-RESPONSE` с квитанцией о расчёте (в кодировке base64), включая хеш ончейн-транзакции

Если расчёт не удался, вы получите `402` сразу с двумя заголовками: `PAYMENT-RESPONSE` (детали ошибки) и `PAYMENT-REQUIRED` (чтобы можно было повторить попытку).

<div id="pricing">
  ## Цены
</div>

x402 использует ту же пакетную тарификацию, что и оплата по API key. Стоимость рассчитывается заранее, исходя из параметров вашего запроса (а не фактически полученных результатов).

<div id="search-search">
  ### Search (`/search`)
</div>

| Тип поиска                | Базовая цена (до 10 результатов) | За результат свыше 10 |
| ------------------------- | -------------------------------- | --------------------- |
| `instant`, `auto`, `fast` | $0.007 / запрос                  | Н/Д (лимит — 10)      |
| `deep-lite`               | $0.012 / запрос                  | Н/Д (лимит — 10)      |
| `deep`                    | $0.012 / запрос                  | Н/Д (лимит — 10)      |
| `deep-reasoning`          | $0.015 / запрос                  | Н/Д (лимит — 10)      |

Добавление `contents.summary` обходится дополнительно в **$0.001 за результат**.

<Warning>
  Для запросов x402 действует ограничение — **не более 10 результатов**. Если вы запросите больше, значение `numResults` будет без уведомления уменьшено до 10, а стоимость рассчитается по 10 результатам.
</Warning>

<div id="contents-contents">
  ### Contents (`/contents`)
</div>

Каждый тип контента тарифицируется за страницу/URL:

| Тип контента | Цена за страницу |
| ------------ | ---------------- |
| `text`       | $0.001           |
| `highlights` | $0.001           |
| `summary`    | $0.001           |

Если вы не запрашиваете ни одного типа контента (ни `text`, ни `highlights`, ни `summary`), по умолчанию включается `text`.

<div id="examples">
  ### Примеры
</div>

| Запрос                                               | Цена   | USDC atomic |
| ---------------------------------------------------- | ------ | ----------- |
| `/search` с 10 результатами, `type: "auto"`          | $0.007 | 7000        |
| `/search` с 5 результатами, `type: "fast"`           | $0.007 | 7000        |
| `/search` с 3 результатами + summary, `type: "auto"` | $0.010 | 10000       |
| `/search` с 10 результатами, `type: "deep-lite"`     | $0.012 | 12000       |
| `/search` с 10 результатами, `type: "deep"`          | $0.012 | 12000       |
| `/contents` для 2 URL с `text: true`                 | $0.002 | 2000        |
| `/contents` для 1 URL с `text` + `summary`           | $0.002 | 2000        |

<div id="quickstart">
  ## Быстрый старт
</div>

<div id="install-dependencies">
  ### Установка зависимостей
</div>

<CodeGroup>
  ```bash JavaScript theme={null}
  npm install @x402/fetch @x402/core @x402/evm viem
  # Для поддержки Solana также установите:
  npm install @x402/svm @solana/kit @scure/base
  ```

  ```bash Python theme={null}
  pip install "x402[requests,evm]"
  # Для поддержки Solana также установите:
  pip install "x402[svm]" "solana<0.40"
  ```
</CodeGroup>

<Note>
  Для cURL ничего устанавливать не нужно, но обрабатывать запрос 402 и подписывать платёж придётся вручную. Для использования в продакшене рекомендуется вариант с SDK.
</Note>

<Tip>
  Не хотите управлять приватными ключами? [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) обеспечивают изолированное в TEE управление ключами для ИИ-агентов. Ваш агент никогда не видит приватный ключ. Кошелёк совместим с viem, поэтому работает напрямую с `@x402/fetch`.
</Tip>

<div id="make-a-paid-search-request">
  ### Выполните платный поисковый запрос
</div>

<CodeGroup>
  ```typescript JavaScript theme={null}
  import { wrapFetchWithPayment } from "@x402/fetch";
  import { x402Client, x402HTTPClient } from "@x402/core/client";
  import { ExactEvmScheme } from "@x402/evm/exact/client";
  // Для поддержки Solana также импортируйте:
  // import { ExactSvmScheme } from "@x402/svm/exact/client";
  import { privateKeyToAccount } from "viem/accounts";

  const signer = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(signer));
  // Зарегистрируйте также подписанта Solana, если хотите, чтобы клиент использовал
  // записи accept для Solana, например `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`:
  // client.register("solana:*", new ExactSvmScheme(svmSigner));
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  const response = await fetchWithPayment("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);

  // Проверьте квитанцию о расчёте
  const httpClient = new x402HTTPClient(client);
  const receipt = httpClient.getPaymentSettleResponse(
    (name) => response.headers.get(name)
  );
  console.log("Transaction:", receipt?.transaction);
  ```

  ```python Python theme={null}
  import os
  import requests
  from eth_account import Account
  from x402 import x402ClientSync
  from x402.http.clients import wrapRequestsWithPayment
  from x402.mechanisms.evm.exact import register_exact_evm_client
  from x402.mechanisms.evm.signers import EthAccountSigner

  account = Account.from_key(os.environ["WALLET_PRIVATE_KEY"])
  client = x402ClientSync()
  register_exact_evm_client(
      client,
      EthAccountSigner(account),
      networks="eip155:*",
  )
  session = wrapRequestsWithPayment(requests.Session(), client)

  response = session.post("https://api.exa.ai/search", json={
      "query": "best machine learning frameworks",
      "numResults": 5,
  })

  data = response.json()
  for result in data["results"]:
      print(result["url"], result["title"])
  print("Payment response:", response.headers.get("PAYMENT-RESPONSE"))
  ```

  ```bash cURL theme={null}
  # Шаг 1: обнаружение — получение информации о ценах
  curl -s -o /dev/null -w "%{http_code}" -D - \
    -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # Возвращает 402 с header PAYMENT-REQUIRED, содержащим цены в кодировке base64

  # Шаг 2: подпишите платёж своим кошельком (используйте для этого SDK)
  # Шаг 3: повторите запрос с подписью платежа
  curl -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "PAYMENT-SIGNATURE: <base64-encoded-payment>" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # Возвращает 200 с результатами и header PAYMENT-RESPONSE (квитанция о расчёте)
  ```
</CodeGroup>

<Info>
  В случае cURL платёж нужно подписывать вручную. В продакшене используйте SDK для JavaScript или Python — он автоматически выполняет весь цикл 402 &gt; подпись &gt; повторный запрос.
</Info>

<div id="discovery-mode-no-wallet-needed">
  ### Режим обнаружения (кошелёк не нужен)
</div>

Узнать стоимость можно без кошелька — достаточно отправить запрос без аутентификации:

<CodeGroup>
  ```typescript JavaScript theme={null}
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "test query", numResults: 3 }),
  });

  // res.status === 402
  const paymentRequired = JSON.parse(
    atob(res.headers.get("PAYMENT-REQUIRED")!)
  );
  console.log(
    paymentRequired.accepts.map(({ network, amount }) => ({
      network,
      amount,
    }))
  );
  ```

  ```python Python theme={null}
  import base64, json, requests

  res = requests.post("https://api.exa.ai/search", json={
      "query": "test query",
      "numResults": 3,
  })

  # res.status_code == 402
  pricing = json.loads(base64.b64decode(res.headers["PAYMENT-REQUIRED"]))
  print([(accept["network"], accept["amount"]) for accept in pricing["accepts"]])
  ```

  ```bash cURL theme={null}
  curl -s -D - -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "test query", "numResults": 3}'
  # Найдите header PAYMENT-REQUIRED в ответе 402
  # Декодируйте его: echo "<header-value>" | base64 -d
  ```
</CodeGroup>

<div id="payment-networks">
  ## Платёжные сети
</div>

Exa перечисляет все поддерживаемые на данный момент сети в массиве `accepts`. Выберите запись, соответствующую вашему кошельку и зарегистрированной схеме x402-клиента.

| Сеть               | Идентификатор                             | Токен | Актив                                          |
| ------------------ | ----------------------------------------- | ----- | ---------------------------------------------- |
| Base (Ethereum L2) | `eip155:8453`                             | USDC  | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`   |
| Solana mainnet     | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | USDC  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

Обе сети используют USDC с 6 знаками после запятой (`1000000` = $1.00) и проводят расчёты ончейн через фасилитатор x402.

<div id="rate-limits">
  ## Лимиты запросов
</div>

У x402 собственные лимиты запросов, не связанные с лимитами API key:

| Лимит                                  | Порог               | Окно      |
| -------------------------------------- | ------------------- | --------- |
| Неоплаченные discovery-запросы (на IP) | 5 запросов          | 60 секунд |
| Оплаченные запросы (на кошелёк)        | 10 запросов/секунду | 1 секунда |

После 5 неаутентифицированных discovery-запросов с кодом `402` с одного IP за 60 секунд последующие запросы возвращают `429 Too Many Requests`. Успешный оплаченный запрос уменьшает счётчик.

Лимит QPS на кошелёк действует для всех оплаченных запросов с одного и того же адреса кошелька.

<div id="headers-reference">
  ## Справочник по header
</div>

<div id="request-headers">
  ### Заголовки запроса
</div>

| header              | Описание                                       |
| ------------------- | ---------------------------------------------- |
| `PAYMENT-SIGNATURE` | Платёжный payload в кодировке Base64 (x402 v2) |
| `payment-signature` | Псевдоним (также принимается)                  |
| `x-payment`         | Устаревший псевдоним (совместимость с v1)      |

<div id="response-headers">
  ### Заголовки ответа
</div>

| header             | Когда                                  | Описание                                                                       |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------ |
| `PAYMENT-REQUIRED` | ответы `402`                           | Объект `PaymentRequired` в кодировке Base64 с ценами и инструкциями по оплате  |
| `PAYMENT-RESPONSE` | `200` или `402` (после попытки оплаты) | Результат расчёта в кодировке Base64 с хешем транзакции или ошибкой |

<div id="error-codes">
  ## Коды ошибок
</div>

| Статус | Тег                        | Описание                                                              |
| ------ | -------------------------- | --------------------------------------------------------------------- |
| `402`  | `X402_PAYMENT_REQUIRED`    | Платёж не предоставлен. Стоимость указана в header `PAYMENT-REQUIRED` |
| `402`  | `X402_VERIFICATION_FAILED` | Подпись платежа не прошла проверку у фасилитатора                     |
| `400`  | `X402_INVALID_SIGNATURE`   | Некорректная или нечитаемая подпись платежа                           |
| `429`  | `X402_TOO_MANY_UNPAID`     | Слишком много неоплаченных discovery-запросов с этого IP        |
| `429`  | `X402_WALLET_RATE_LIMITED` | Кошелёк превысил лимит в 10 запросов в секунду                        |
| `500`  | `X402_INTERNAL_ERROR`      | Ошибка на стороне сервера при формировании платёжных требований       |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="Можно ли использовать x402 и API key одновременно?">
    Если запрос содержит header `x-api-key` или токен `Authorization: Bearer`, приоритет отдаётся схеме с API key, а x402 не применяется. Они не комбинируются — в каждом запросе работает что-то одно.
  </Accordion>

  <Accordion title="Что произойдёт, если расчёт не пройдёт уже после обработки запроса?">
    Ответ будет заблокирован. Вы получите `402` сразу с двумя заголовками: `PAYMENT-RESPONSE` (с описанием ошибки) и `PAYMENT-REQUIRED` (чтобы клиент мог повторить попытку). Результаты не возвращаются, пока расчёт не пройдёт успешно.
  </Accordion>

  <Accordion title="Почему numResults ограничен значением 10?">
    Для запросов x402 действует ограничение — не более 10 результатов на один search. Если нужно больше, используйте схему с API key и платный тариф.
  </Accordion>

  <Accordion title="Какие кошельки поддерживаются?">
    Любой EVM-совместимый кошелёк, способный подписывать типизированные данные EIP-712 в сети Base, либо кошелёк Solana, поддерживаемый клиентом x402 SVM для `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`. x402 SDK поддерживает `viem`, `ethers`, подписанты Coinbase Wallet и подписанты Solana SVM. Для ИИ-агентов на базе EVM [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) предлагают управление ключами с изоляцией в TEE, поэтому ваш агент никогда не работает напрямую с «сырыми» приватными ключами.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ресурсы
</div>

* [Документация протокола x402](https://docs.x402.org): полная спецификация протокола
* [x402 на GitHub](https://github.com/coinbase/x402): SDK и примеры с открытым исходным кодом
* [@x402/fetch на npm](https://www.npmjs.com/package/@x402/fetch): обёртка над fetch для автоматической обработки платежей
* [@x402/svm на npm](https://www.npmjs.com/package/@x402/svm): поддержка точных платежей в Solana/SVM
* [Руководство по Exa Search API](/ru/docs/search/quickstart): полный справочник параметров поиска
* [Руководство по Exa Contents API](/ru/docs/contents/quickstart): полный справочник параметров contents