> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Billing and Rate Limits

> Manage Exa credits, invoices, and API rate limits.

Exa offers a Free tier, pay-as-you-go billing, and custom Enterprise plans. API usage draws from your team's credit balance, while rate limits control how quickly the team can make requests.

<Columns cols={3}>
  <Card title="Billing dashboard" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="Manage billing" arrow="true">
    Add credits, configure auto recharge, and view invoices.
  </Card>

  <Card title="API keys" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Manage API keys" arrow="true">
    Review usage and set a lower limit for an individual key.
  </Card>

  <Card title="Pricing" icon="tag" href="/docs/admin/pricing" cta="View pricing" arrow="true">
    Compare current rates across Exa products.
  </Card>
</Columns>

## Plans at a glance

| Plan              | Billing                                                              | Rate limit                                       | Agent concurrency |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------------ | ----------------- |
| **Free**          | \$20 in introductory credits, then \$10 in credits refreshed monthly | 10 QPS                                           | 50 active runs    |
| **Pay as you go** | Prepaid credits with no subscription or minimum spend                | 10 QPS, [up to 25 QPS](#25-qps-on-pay-as-you-go) | 50 active runs    |
| **Enterprise**    | Custom volume pricing and optional postpaid invoicing                | Custom                                           | Custom            |

<Card title="Contact Us" icon="headset" href="https://exa.ai/contact/sales" cta="Contact sales" arrow="true">
  We'll advise on the best set up to handle latency, scale, ZDR, and more.
</Card>

## Billing basics

Requests are charged against prepaid credits at the rates in [Pricing](/docs/admin/pricing) or under your Enterprise contract. Team owners can add credits from the [Billing dashboard](https://dashboard.exa.ai/billing); payments are processed through Stripe.

If your team exhausts its credits, requests return `402 Payment Required`. An API key that reaches its assigned budget also returns `402`. Add credits or ask a team administrator to adjust the key's budget. See [Error codes](/docs/admin/error-codes).

For historical usage by API key, use [Get API key usage](/docs/reference/team-management/get-api-key-usage).

## Rate limits

Rate limits are measured in queries per second (QPS) and apply to your team as a whole, across all of its API keys. You can give an individual key a lower limit from the [API Keys](https://dashboard.exa.ai/api-keys) page, but its traffic still counts toward the team limit.

| Endpoint                                                       | Default limit            |
| -------------------------------------------------------------- | ------------------------ |
| `/search`, `/answer`, `/chat/completions`                      | 10 QPS                   |
| `/search` with `type` `deep-lite`, `deep`, or `deep-reasoning` | 5 QPS                    |
| `/contents`                                                    | 100 QPS                  |
| `/agent/runs`, `/responses`                                    | 5 QPS and 50 active runs |
| `/websets/*`                                                   | 20 QPS                   |

Some endpoints share rate limit capacity. Limits are subject to change and can vary by plan; Websets searches also have plan-based concurrency limits, which you can check with [Get Team Info](/docs/websets/api/teams/get-team-info).

When you exceed a limit, requests return `429 Too Many Requests`. Wait for the `Retry-After` header when present, or retry with exponential backoff. See [Error codes](/docs/admin/error-codes).

### Agent limits

Agent limits are two separate controls: how many runs can be in progress at once, and how fast you can start new ones.

* **Concurrency**: 50 Agent runs can be in progress at a time. This limit is separate from your QPS and does not change when your QPS is raised. Starting a run past the limit returns `429` with error code `CONCURRENCY_LIMIT_REACHED`; wait for a run to finish or contact us to raise your concurrency limit.
* **Starting runs**: `POST /agent/runs` draws from your account QPS, and each run start counts as two requests. You can start runs at half your QPS, so an account with the default 10 QPS can start 5 runs per second, and 25 QPS allows 12 per second.
* **Polling**: `GET` requests for run status, events, and run lists do not count against your QPS and never block dispatch, so poll running Agents independently of how fast you start new ones.

### 25 QPS on pay as you go

Add \$1,000 in credits within any 30-day window and your team's rate limit rises to **25 QPS for 90 days**, automatically. The threshold counts credits you purchase, not credits you spend, and requalifying resets the 90 days. Track your progress on the [Billing dashboard](https://dashboard.exa.ai/billing).

Need more than 25 QPS? [Talk to sales](https://exa.ai/contact/sales).

## Auto recharge

Auto recharge purchases credits when your balance reaches a threshold you choose. Configure it from the [Billing dashboard](https://dashboard.exa.ai/billing).

| Setting                | Description                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Recharge amount**    | Credits purchased each time auto recharge triggers, from \$5 to \$10,000.                                     |
| **Recharge threshold** | The balance at which the recharge triggers.                                                                   |
| **Monthly maximum**    | Optional cap on auto-recharge purchases during the billing cycle. Set it to \$0 or leave it blank for no cap. |

For example, a \$100 recharge amount, \$10 threshold, and \$500 monthly maximum purchases \$100 whenever the balance reaches \$10, up to \$500 in automatic purchases during the cycle.

For an upcoming launch or other high-volume workload, add enough credits in advance and set an auto-recharge amount that avoids many small payment attempts.

## Receipts and invoices

Exa emails receipts for credit purchases and auto recharges from [billing@exa.ai](mailto:billing@exa.ai). Add the address to your allow list if needed. Your full invoice history is available in the [Billing dashboard](https://dashboard.exa.ai/billing).

Postpaid invoice billing is available with an Enterprise plan.

## Get help

<Columns cols={2}>
  <Card title="Increase your limits" icon="gauge" href="https://exa.ai/contact/sales" cta="Contact sales" arrow="true">
    Request more than 25 QPS, custom concurrency, volume pricing, or postpaid billing.
  </Card>

  <Card title="Billing support" icon="mail" href="mailto:billing@exa.ai" cta="Email billing" arrow="true">
    Get help with payments, credits, invoices, or account billing questions.
  </Card>
</Columns>
