> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳細を調べる前に、このファイルで利用可能なすべてのページを確認してください。

# x402で支払う {#pay-with-x402}

> APIキーなしでExaのSearch APIとContents APIを利用できます。x402プロトコルを使用して、BaseまたはSolana上のUSDCでリクエストごとに支払います。

## x402とは? {#what-is-x402}

[x402](https://x402.org)は、HTTPの`402 Payment Required`ステータスコードをベースにしたオープンな決済標準です。クライアントはBaseまたはSolana上のUSDCステーブルコインを使って、APIアクセスの料金をリクエストごとに支払えます。アカウント、API キー、サブスクリプションは一切不要です。

Exaは、**`/search`**と**`/contents`**の2つのエンドポイントでx402をサポートしています。API キーも決済ヘッダーも含めずにリクエストを送信すると、Exaは`402`とともに`PAYMENT-REQUIRED`ヘッダーを返します。このヘッダーには、料金の詳細と対応する決済ネットワークが含まれています。クライアントはUSDCによる支払いに署名し、`PAYMENT-SIGNATURE`ヘッダーを付けてリクエストを再送信します。オンチェーンで決済が確定すると、結果が返されます。

事前にプロビジョニングされた認証情報を持たずに、ウェブ検索の料金を自律的に支払う必要がある**AIエージェント**に最適な仕組みです。

<Info>
  x402とAPI キーによるアクセスは互いに独立しています。リクエストに`x-api-key`または`Authorization: Bearer`ヘッダーが含まれている場合は、通常のAPI キー課金フローが適用され、x402は一切使用されません。
</Info>

## 対応エンドポイント {#supported-endpoints}

| エンドポイント     | メソッド | 説明                                                                                 |
| ----------- | ---- | ---------------------------------------------------------------------------------- |
| `/search`   | POST | ウェブ検索 (すべての検索タイプに対応: `instant`、`auto`、`fast`、`deep`、`deep-lite`、`deep-reasoning`)  |
| `/contents` | POST | URL またはドキュメント ID を指定したコンテンツ取得                                                      |

上記以外のエンドポイントは、x402 では**利用できません**。

## 仕組み {#how-it-works}

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/payments/x402/payment-flow.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a560d80bb84828e03dfacd61351e9fb" alt="x402 支払いフローのシーケンス図: クライアントがサーバーにリクエストを送信し、PAYMENT-REQUIRED ヘッダー付きの 402 を受け取ります。クライアントは支払いペイロードを作成し、PAYMENT-SIGNATURE を付けてリクエストを再試行します。サーバーはファシリテーターを介して検証し、処理を実行してオンチェーンで決済した後、結果と PAYMENT-RESPONSE を含む 200 を返します" width="4224" height="2720" data-path="images/integrations/payments/x402/payment-flow.png" />
</Frame>

### ステップ 1: Discovery {#step-1-discovery}

API キーや支払いヘッダーを付けずに、対応しているエンドポイントへリクエストを送信します。

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "best machine learning frameworks", "numResults": 5}'
```

base64 でエンコードされた `PAYMENT-REQUIRED` ヘッダーを含む `402` レスポンスが返されます。デコードすると次のようになります。

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

`amount` は USDC atomic 単位 (小数点以下 6 桁) で表されるため、`"7000"` は $0.007 に相当します。
クライアントは、提示された `accepts` エントリのうち、自身がサポートする任意のエントリを使って支払いを行えます。Solana のエントリには、`extra.feePayer` などファシリテーターが提供するフィールドが含まれます。支払いを作成する際は、`PAYMENT-REQUIRED` ヘッダーに含まれるエントリを変更せずにそのまま使用してください。

### ステップ 2: 支払いと再試行 {#step-2-pay-and-retry}

ウォレットで支払いに署名し、base64 でエンコードした支払いペイロードを `PAYMENT-SIGNATURE` ヘッダーに含めてリクエストを再送信します。x402 クライアント SDK を使用すると、この処理は自動的に行われます。

### ステップ 3: 決済の確定 (settlement) {#step-3-settlement}

Exa はファシリテーターでお客様の支払い署名を検証し、リクエストの処理と**並行して**オンチェーンでの決済確定を開始します。レスポンスは決済確定が完了するまで保留されます。成功すると、次のものが返されます。

* 結果を含む HTTP `200`
* 決済確定レシート (base64 エンコード、オンチェーンのトランザクションハッシュを含む) を格納した `PAYMENT-RESPONSE` ヘッダー

決済確定に失敗した場合は、`402` が返されます。このレスポンスには `PAYMENT-RESPONSE` (エラーの詳細) と `PAYMENT-REQUIRED` (再試行用) の両方が含まれます。

## 料金 {#pricing}

x402 には、API キーによる課金と同じバンドル料金が適用されます。料金は実際に返された結果ではなく、リクエストのパラメーターに基づいて事前に算出されます。

### Search (`/search`) {#search-search}

| 検索タイプ                     | 基本料金 (結果10件まで)  | 10件を超える結果1件あたり |
| ------------------------- | --------------- | -------------- |
| `instant`, `auto`, `fast` | $0.007 / リクエスト  | 該当なし (上限10件)   |
| `deep-lite`               | $0.012 / リクエスト  | 該当なし (上限10件)   |
| `deep`                    | $0.012 / リクエスト  | 該当なし (上限10件)   |
| `deep-reasoning`          | $0.015 / リクエスト  | 該当なし (上限10件)   |

`contents.summary` を追加すると、**結果1件あたり $0.001** が追加で課金されます。

<Warning>
  x402 のリクエストでは、取得できる結果は**最大10件**です。10件を超えてリクエストした場合、`numResults` は通知なしに10に切り詰められ、料金も10件分として計算されます。
</Warning>

### Contents (`/contents`) {#contents-contents}

各コンテンツタイプは、ページ/URL ごとに課金されます。

| コンテンツタイプ     | ページあたりの料金 |
| ------------ | --------- |
| `text`       | $0.001    |
| `highlights` | $0.001    |
| `summary`    | $0.001    |

コンテンツタイプを1つもリクエストしない場合 (`text`、`highlights`、`summary` のいずれも指定しない場合) は、デフォルトで `text` が有効になります。

### 例 {#examples}

| リクエスト                                     | 料金     | USDC atomic |
| ----------------------------------------- | ------ | ----------- |
| `/search` (結果 10 件、`type: "auto"`)        | $0.007 | 7000        |
| `/search` (結果 5 件、`type: "fast"`)         | $0.007 | 7000        |
| `/search` (結果 3 件 + 要約、`type: "auto"`)    | $0.010 | 10000       |
| `/search` (結果 10 件、`type: "deep-lite"`)   | $0.012 | 12000       |
| `/search` (結果 10 件、`type: "deep"`)        | $0.012 | 12000       |
| `/contents` (URL 2 件、`text: true`)        | $0.002 | 2000        |
| `/contents` (URL 1 件、`text` + `summary`)  | $0.002 | 2000        |

## クイックスタート {#quickstart}

### 依存関係のインストール {#install-dependencies}

<CodeGroup>
  ```bash JavaScript theme={null}
  npm install @x402/fetch @x402/core @x402/evm viem
  # Solana をサポートする場合は、以下もインストールします:
  npm install @x402/svm @solana/kit @scure/base
  ```

  ```bash Python theme={null}
  pip install "x402[requests,evm]"
  # Solana をサポートする場合は、以下もインストールします:
  pip install "x402[svm]" "solana<0.40"
  ```
</CodeGroup>

<Note>
  cURL の場合はインストール不要ですが、402 チャレンジと支払いの署名を手動で処理する必要があります。本番環境では SDK の利用を推奨します。
</Note>

<Tip>
  秘密鍵を自分で管理したくない場合は、[Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) を利用できます。AI エージェント向けに、TEE で隔離された鍵管理を提供するサービスです。エージェントが秘密鍵に触れることはありません。このウォレットは viem 互換のため、`@x402/fetch` でそのまま使用できます。
</Tip>

### 有料の検索リクエストを送信する {#make-a-paid-search-request}

<CodeGroup>
  ```typescript JavaScript theme={null}
  import { wrapFetchWithPayment } from "@x402/fetch";
  import { x402Client, x402HTTPClient } from "@x402/core/client";
  import { ExactEvmScheme } from "@x402/evm/exact/client";
  // Solana に対応する場合は、以下もインポートします:
  // import { ExactSvmScheme } from "@x402/svm/exact/client";
  import { privateKeyToAccount } from "viem/accounts";

  const signer = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(signer));
  // `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` などの Solana の accept エントリを
  // クライアントで使用する場合は、Solana の署名者も登録します:
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

  // 決済レシートを確認する
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
  # ステップ 1: Discovery（料金情報を取得）
  curl -s -o /dev/null -w "%{http_code}" -D - \
    -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # 402 が返され、PAYMENT-REQUIRED ヘッダーに base64 エンコードされた料金情報が含まれる

  # ステップ 2: ウォレットで支払いに署名する（SDK の使用を推奨）
  # ステップ 3: 支払い署名を付けて再試行する
  curl -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "PAYMENT-SIGNATURE: <base64-encoded-payment>" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # 200 が返され、結果と PAYMENT-RESPONSE ヘッダー（決済レシート）が含まれる
  ```
</CodeGroup>

<Info>
  cURL では支払いの署名を手動で行う必要があります。本番環境では、402 &gt; 署名 &gt; 再試行のフロー全体を自動で処理する JavaScript または Python の SDK を使用してください。
</Info>

### Discovery モード (ウォレット不要) {#discovery-mode-no-wallet-needed}

認証なしでリクエストを送信すれば、ウォレットがなくても料金を確認できます。

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
  # 402 レスポンスに含まれる PAYMENT-REQUIRED ヘッダーを確認します
  # デコードするには: echo "<header-value>" | base64 -d
  ```
</CodeGroup>

## 決済ネットワーク {#payment-networks}

Exa は、現在サポートしているすべてのネットワークを `accepts` 配列で提示します。お使いのウォレットと登録済みの x402 クライアントのスキームに合ったエントリを選択してください。

| ネットワーク             | 識別子                                       | トークン | アセット                                           |
| ------------------ | ----------------------------------------- | ---- | ---------------------------------------------- |
| Base (Ethereum L2) | `eip155:8453`                             | USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`   |
| Solana メインネット      | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

どちらも小数点以下 6 桁の USDC (`1000000` = $1.00) を使用し、x402 ファシリテーター経由でオンチェーン決済されます。

## レート制限 {#rate-limits}

x402 には、API キーの制限とは別に独自のレート制限があります。

| 制限                          | しきい値       | 期間   |
| --------------------------- | ---------- | ---- |
| 支払いなしのDiscoveryリクエスト (IP ごと)  | 5 リクエスト    | 60 秒 |
| 支払い済みリクエスト (ウォレットごと)        | 10 リクエスト/秒 | 1 秒  |

同一 IP から 60 秒以内に認証なしの `402` Discoveryリクエストを 5 回送信すると、それ以降のリクエストには `429 Too Many Requests` が返されます。支払い済みリクエストが成功すると、カウンターが 1 つ減ります。

ウォレットごとの QPS 制限は、同一ウォレットアドレスからのすべての支払い済みリクエストを合算して適用されます。

## ヘッダーリファレンス {#headers-reference}

### リクエストヘッダー {#request-headers}

| ヘッダー                | 説明                                 |
| ------------------- | ---------------------------------- |
| `PAYMENT-SIGNATURE` | Base64 エンコードされた支払いペイロード (x402 v2)  |
| `payment-signature` | エイリアス (こちらも使用可能)                   |
| `x-payment`         | 旧形式のエイリアス (v1 互換)                  |

### レスポンスヘッダー {#response-headers}

| ヘッダー               | タイミング                   | 説明                                                     |
| ------------------ | ----------------------- | ------------------------------------------------------ |
| `PAYMENT-REQUIRED` | `402` レスポンス時            | 料金情報と支払い手順を含む、Base64 エンコードされた `PaymentRequired` オブジェクト |
| `PAYMENT-RESPONSE` | `200` または `402`(支払い試行後) | トランザクションハッシュまたはエラーを含む、Base64 エンコードされた決済結果              |

## エラーコード {#error-codes}

| ステータス | タグ                         | 説明                                              |
| ----- | -------------------------- | ----------------------------------------------- |
| `402` | `X402_PAYMENT_REQUIRED`    | 支払いが含まれていません。`PAYMENT-REQUIRED` ヘッダーに料金情報が含まれます |
| `402` | `X402_VERIFICATION_FAILED` | 支払い署名がファシリテーターの検証に失敗しました                        |
| `400` | `X402_INVALID_SIGNATURE`   | 支払い署名の形式が不正であるか、解析できません                         |
| `429` | `X402_TOO_MANY_UNPAID`     | この IP からの未払いのDiscoveryリクエストが多すぎます                 |
| `429` | `X402_WALLET_RATE_LIMITED` | ウォレットが上限の毎秒 10 リクエストを超えました                      |
| `500` | `X402_INTERNAL_ERROR`      | 支払い要件の生成中にサーバー側でエラーが発生しました                      |

## FAQ {#faq}

<AccordionGroup>
  <Accordion title="x402 と API キーを併用できますか？">
    リクエストに `x-api-key` ヘッダーまたは `Authorization: Bearer` トークンが含まれている場合、API キーによるフローが優先され、x402 はスキップされます。両者を組み合わせることはできず、リクエストごとにどちらか一方のみが適用されます。
  </Accordion>

  <Accordion title="リクエストの処理後に決済の確定に失敗した場合はどうなりますか？">
    レスポンスはブロックされます。`PAYMENT-RESPONSE` (エラー内容を含む) と `PAYMENT-REQUIRED` (クライアントが再試行できるようにするため) の両方を含む `402` が返されます。決済の確定が成功するまで、結果は返されません。
  </Accordion>

  <Accordion title="numResults の上限が 10 なのはなぜですか？">
    x402 リクエストでは、1 回の検索で返される結果は最大 10 件に制限されています。それ以上必要な場合は、有料プランで API キーによるフローを使用してください。
  </Accordion>

  <Accordion title="どのウォレットに対応していますか？">
    Base 上で EIP-712 型付きデータに署名できる EVM 互換ウォレット、または `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` 向けの x402 SVM クライアントが対応している Solana ウォレットであれば使用できます。x402 SDK は `viem`、`ethers`、Coinbase Wallet の署名者、Solana SVM の署名者に対応しています。EVM ベースの AI エージェントの場合、[Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) を使えば TEE で分離されたキー管理が可能になり、エージェントが生の秘密鍵を直接扱う必要がなくなります。
  </Accordion>
</AccordionGroup>

## リソース {#resources}

* [x402 プロトコルドキュメント](https://docs.x402.org): プロトコルの完全な仕様
* [x402 GitHub](https://github.com/coinbase/x402): オープンソースの SDK とサンプル
* [npm の @x402/fetch](https://www.npmjs.com/package/@x402/fetch): 支払いを自動で処理する fetch ラッパー
* [npm の @x402/svm](https://www.npmjs.com/package/@x402/svm): Solana/SVM の exact 支払いに対応
* [Exa Search API ガイド](/ja/docs/search/quickstart): search パラメーターの完全なリファレンス
* [Exa Contents API ガイド](/ja/docs/contents/quickstart): contents パラメーターの完全なリファレンス