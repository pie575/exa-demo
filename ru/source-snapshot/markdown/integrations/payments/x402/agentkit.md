> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжать изучение.

<div id="world-agentkit">
  # World AgentKit
</div>

> Предоставьте верифицированным ИИ-агентам, за которыми стоит реальный человек, бесплатный доступ к Exa через World AgentKit — без USDC.

<div id="what-is-agentkit">
  ## Что такое AgentKit?
</div>

[World AgentKit](https://docs.world.org/agents/agent-kit) — это набор инструментов, который позволяет ИИ-агентам подтвердить, что за ними стоит реальный верифицированный человек, с помощью [World ID](https://world.org). В связке с [x402](/ru/docs/integrations/payments/x402/quickstart) он открывает возможность **бесплатного пробного доступа**: агенты, зарегистрированные в [AgentBook](https://docs.world.org/agents/agent-kit/integrate) от World, могут обращаться к эндпоинтам Exa `/search` и `/contents` без оплаты в USDC.

Это работает параллельно со стандартным платёжным потоком x402. Каждый верифицированный человек получает **100 бесплатных запросов в месяц** суммарно на всех агентов, которых он подтверждает. Когда лимит исчерпан, агент переходит на обычную оплату в USDC. Счётчики сбрасываются в начале каждого календарного месяца (UTC).

<Info>
  Бесплатный пробный доступ AgentKit и оплата через x402 не применяются, если запрос содержит header `x-api-key` или `Authorization: Bearer`. Приоритет имеет обычная схема тарификации по API key.
</Info>

<div id="how-it-works">
  ## Как это работает
</div>

Когда клиент обращается к `/search` или `/contents` без API key, Exa возвращает `402 Payment Required`. Ответ содержит расширение `agentkit` в header `PAYMENT-REQUIRED` с challenge по стандарту [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) (Sign-In with Ethereum).

Agent подписывает этот challenge своим зарегистрированным кошельком, а Exa проверяет:

1. **Проверка подписи** — подпись SIWE сверяется с адресом кошелька (поддерживаются как EOA через EIP-191, так и смарт-контрактные кошельки через ERC-1271)
2. **Поиск в AgentBook** — кошелёк сопоставляется с анонимным `humanId` через контракт AgentBook в World Chain (`eip155:480`), что подтверждает: уникальный верифицированный человек делегировал свою личность этому агенту
3. **Проверка использования** — если у человека остались бесплатные пробные запросы, доступ предоставляется; иначе потребуется оплата в USDC

<div id="quickstart">
  ## Быстрый старт
</div>

<div id="1-register-your-agent-in-agentbook">
  ### 1. Зарегистрируйте агента в AgentBook
</div>

Это разовая настройка. Вам понадобится [World App](https://world.org/download) с подтверждённой личностью.

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

CLI запускает процесс верификации в World App, а затем отправляет транзакцию регистрации в сети World Chain. После её завершения любой сервис, использующий AgentKit, сможет найти ваш кошелёк и убедиться, что за ним стоит реальный человек.

<div id="2-send-a-request-get-the-challenge">
  ### 2. Отправьте запрос (получите challenge)
</div>

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

Ответ `402` содержит расширение `agentkit` внутри декодированного payload `PAYMENT-REQUIRED`:

```json theme={null}
{
  "x402Version": 2,
  "accepts": [ ... ],
  "extensions": {
    "agentkit": {
      "info": {
        "version": "1",
        "statement": "Verify your agent is backed by a real human to access Exa",
        "domain": "api.exa.ai",
        "uri": "https://api.exa.ai/search",
        "nonce": "abc123...",
        "issuedAt": "2026-04-11T01:30:00.000Z",
        "resources": ["https://api.exa.ai/search"]
      },
      "supportedChains": [
        { "chainId": "eip155:480", "type": "eip191" },
        { "chainId": "eip155:480", "type": "eip1271" }
      ],
      "schema": { ... },
      "_options": {
        "statement": "Verify your agent is backed by a real human to access Exa",
        "mode": { "type": "free-trial", "uses": 100 },
        "network": "eip155:480"
      }
    }
  }
}
```

<div id="3-sign-the-challenge-and-resubmit">
  ### 3. Подпишите challenge и отправьте запрос повторно
</div>

Сформируйте [SIWE-сообщение](https://eips.ethereum.org/EIPS/eip-4361) из полей `info` (domain, uri, nonce, statement и т. д.), подпишите его зарегистрированным кошельком агента, используя один из типов `supportedChains`, и передайте его в header `agentkit` (JSON в кодировке base64):

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

Если агент верифицирован и у него остались бесплатные пробные запросы, Exa вернёт `200` с результатами поиска — оплата не потребуется.

<div id="using-the-agentkit-x402-skill">
  ### Использование навыка AgentKit x402
</div>

Вместо того чтобы реализовывать механизм «запрос — ответ» вручную, добавьте [навык agentkit-x402](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md) в свой ИИ-агент:

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

Этот навык автоматически выполняет весь процесс, когда агент получает ответ `402` с расширением AgentKit.

<div id="free-trial-details">
  ## Подробности о бесплатном пробном периоде
</div>

* Каждый верифицированный человек получает **100 бесплатных запросов в месяц** на всех агентов, которых он поддерживает
* Счётчики использования сбрасываются в начале каждого календарного месяца (UTC)
* Использование учитывается отдельно для каждого человека и каждого эндпоинта (`/search` и `/contents` считаются раздельно)
* Два агента, поддерживаемые одним и тем же человеком, используют общий счётчик
* Когда бесплатные запросы на месяц исчерпаны, агент переходит к стандартному [платёжному потоку x402](/ru/docs/integrations/payments/x402/quickstart)
* К бесплатным пробным запросам к `/search` применяется то же [ограничение в 10 результатов](/ru/docs/integrations/payments/x402/quickstart#pricing)
* Счётчик бесплатного пробного периода пока не возвращается в ответе API — когда запросы исчерпаны, сервер отвечает стандартным `402`, не предоставляя бесплатный доступ

<div id="supported-endpoints">
  ## Поддерживаемые эндпоинты
</div>

| Эндпоинт    | Оплата x402 | Бесплатный пробный период AgentKit |
| ----------- | :---------: | :--------------------------------: |
| `/search`   |      Да     |                 Да                 |
| `/contents` |      Да     |                 Да                 |

Остальные эндпоинты Exa не поддерживаются ни через x402, ни в рамках бесплатного пробного периода AgentKit.

<div id="network-details">
  ## Параметры сети
</div>

| Свойство                      | Значение                                                |
| ----------------------------- | ------------------------------------------------------- |
| Блокчейн AgentBook            | World Chain                                             |
| Chain ID (CAIP-2)             | `eip155:480`                                            |
| Проверка                      | Контракт AgentBook в сети World Chain                   |
| Поддерживаемые типы кошельков | EOA (EIP-191) и кошельки на смарт-контрактах (ERC-1271) |

<div id="faq">
  ## Частые вопросы
</div>

<AccordionGroup>
  <Accordion title="Можно ли использовать оплату через x402 и AgentKit одновременно?">
    Да. Ответ `PAYMENT-REQUIRED` содержит и стоимость оплаты, и challenge AgentKit. Клиент может выбрать любой из вариантов. Если бесплатные пробные запросы исчерпаны, агент может перейти на оплату в USDC.
  </Accordion>

  <Accordion title="Что произойдёт, если мой агент не зарегистрирован в AgentBook?">
    Проверка AgentKit завершится неудачей без уведомления, и запрос будет обработан как обычный `402` — агент по-прежнему сможет заплатить в USDC через стандартный процесс x402.
  </Accordion>

  <Accordion title="Получают ли два агента одного и того же человека отдельные квоты бесплатного использования?">
    Нет. Использование учитывается по человеку (через анонимный `humanId` из AgentBook), а не по кошельку. У двух агентов, за которыми стоит один World ID, счётчик общий.
  </Accordion>

  <Accordion title="Какие блокчейн-сети задействованы?">
    Стандартные платежи x402 в USDC могут проводиться в **Base** (`eip155:8453`) или **Solana mainnet** (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`). Проверка AgentKit использует **World Chain** (`eip155:480`) для поиска в AgentBook. Эти механизмы независимы — AgentKit не требует никаких ончейн-платежей.
  </Accordion>

  <Accordion title="Какие типы кошельков поддерживаются?">
    Как EOA (внешние аккаунты) с подписями EIP-191, так и смарт-контрактные кошельки (например, Coinbase Smart Wallet, Safe) с ERC-1271. Подробнее см. в [справочнике по World AgentKit SDK](https://docs.world.org/agents/agent-kit/sdk-reference).
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ресурсы
</div>

* [Руководство по оплате x402](/ru/docs/integrations/payments/x402/quickstart): стандартный процесс оплаты в USDC
* [Документация World AgentKit](https://docs.world.org/agents/agent-kit): полная документация AgentKit
* [Руководство по интеграции World AgentKit](https://docs.world.org/agents/agent-kit/integrate): регистрация в AgentBook
* [Справочник по SDK World AgentKit](https://docs.world.org/agents/agent-kit/sdk-reference): справочник по API SDK
* [Навык AgentKit x402](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md): готовый навык для ИИ-агентов
* [Документация протокола x402](https://docs.x402.org): полная спецификация x402