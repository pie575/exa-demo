> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# MPP (Tempo) で支払う {#pay-with-mpp-tempo}

> Tempo 上の USDC.e でリクエストごとに支払えば、API キーなしで Exa の Search API と Contents API を呼び出せます。

## MPP とは？ {#what-is-mpp}

MPP (Machine Payments Protocol) は、`402 Payment Required` ステータスコードをベースにした、HTTP ネイティブのオープンな決済標準です。クライアントは [Tempo](https://tempo.xyz) 上のステーブルコインをはじめとする複数の決済手段を使い、API へのアクセス料金をリクエスト単位で支払えます。アカウント、API キー、サブスクリプションは一切不要です。このページの例では Tempo を使用しています。現在、Exa は MPP 決済を Tempo mainnet 上の USDC.e で精算しています。

Exa は **`/search`** と **`/contents`** の 2 つのエンドポイントで MPP をサポートしています。API キーや決済クレデンシャルを付けずにリクエストを送信すると、Exa は `402` を返し、価格と支払い方法を記載した `WWW-Authenticate: Payment` チャレンジを提示します。クライアントは支払いに署名し、`Authorization: Payment` クレデンシャルを付けてリクエストを再送します。支払いがオンチェーンで確定すると、結果が返されます。

この仕組みは、事前にクレデンシャルをプロビジョニングせずに、ウェブ検索の料金を自律的に支払う必要がある **AI エージェント** に最適です。

<Info>
  MPP と API キーによるアクセスは互いに独立しています。リクエストに `x-api-key` ヘッダーが含まれている場合は、通常の API キー課金フローが適用され、MPP は完全にスキップされます。
</Info>

## 対応エンドポイント {#supported-endpoints}

| エンドポイント     | メソッド | 説明                                                                                 |
| ----------- | ---- | ---------------------------------------------------------------------------------- |
| `/search`   | POST | すべての検索タイプ (`instant`、`auto`、`fast`、`deep`、`deep-lite`、`deep-reasoning`) に対応したウェブ検索 |
| `/contents` | POST | URL またはドキュメント ID を指定したコンテンツ取得                                                      |

その他の Exa エンドポイントは、*現時点では* MPP による支払いに対応していません。

## はじめに {#get-started}

USDC.e を入金済みの Tempo 対応ウォレットが必要です。サンプルを実行する前に、ウォレットの秘密鍵をエクスポートしてください:

```bash theme={null}
export WALLET_PRIVATE_KEY="0x..."
```

### クライアントのインストール {#install-the-client}

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

### 有料の検索リクエストを送信する {#make-a-paid-search-request}

MPP クライアントを使用して、検索リクエストの支払いに署名し、送信します。

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

実行に成功すると、検索結果と、オンチェーンのトランザクションハッシュを含む `Payment-Receipt` ヘッダーが出力されます。

## コマンドラインから支払う {#pay-from-the-command-line}

秘密鍵を直接管理したくない場合は、代わりに Tempo Wallet CLI を使用してください。`tempo wallet login` を実行すると、Tempo ウォレットの作成または接続とローカルのアクセスキーの承認が行われます。新規登録の場合は、無料の MPP クレジットが付与されることもあります。

### インストールと認証 {#install-and-authenticate}

```bash theme={null}
curl -fsSL https://tempo.xyz/install | bash
tempo add wallet
tempo add request
tempo wallet login
```

ローカルブラウザを使えないリモートホストでは、`tempo wallet login --no-browser` を実行し、表示された URL を手元のデバイスで開いて CLI を承認してください。

### 残高とクレジットを確認する {#check-balances-and-credits}

```bash theme={null}
tempo wallet whoami
tempo wallet whoami --credits
```

### 有料リクエストを送信する {#make-a-paid-request}

```bash theme={null}
tempo request --max-spend 1.00 https://api.exa.ai/search \
  --json '{"query": "Series A fintech companies", "numResults": 5}'
```

`tempo request` は `402 Payment Required` のチャレンジを受け取ると、支払いを行い、自動的にリトライします。

CLI の詳細なリファレンスについては、[Tempo Wallet CLI のドキュメント](https://tempo.xyz/developers/docs/cli/wallet)および [`tempo request` のドキュメント](https://tempo.xyz/developers/docs/cli/request)を参照してください。

## ガス代 {#gas-fees}

Exa は Tempo ネットワークの手数料を負担し、USDC.e で支払います。ウォレットには API 料金分の USDC.e があれば十分で、pathUSD やその他のガストークンの残高は不要です。手数料の支払者を設定する必要もありません。スポンサーシップは、Exa の支払いチャレンジと MPP SDK によって自動的に処理されます。

## 料金 {#pricing}

MPP には、API キーによる課金と同じバンドル料金が適用されます。Exa はリクエストを処理する前に、リクエストパラメーターから料金を算出します。

### Search {#search}

| 検索タイプ                     | 料金 (結果10件まで)     |
| ------------------------- | ---------------- |
| `instant`, `auto`, `fast` | 1リクエストあたり $0.007 |
| `deep-lite`, `deep`       | 1リクエストあたり $0.012 |
| `deep-reasoning`          | 1リクエストあたり $0.015 |

`contents.summary` を追加すると、**結果1件あたり $0.001** が別途かかります。

<Warning>
  MPP の検索リクエストで取得できる結果は最大10件です。`numResults` に10より大きい値を指定した場合、Exa は10件として処理し、10件分の料金を請求します。10件を超える結果が必要な場合は、[API キーによる課金](/ja/docs/search/quickstart)をご利用ください。
</Warning>

### Contents {#contents}

リクエストしたコンテンツタイプごとに、URL あたり $0.001 の料金がかかります。

| コンテンツタイプ     | URL あたりの料金 |
| ------------ | ---------- |
| `text`       | $0.001     |
| `highlights` | $0.001     |
| `summary`    | $0.001     |

`text`、`highlights`、`summary` のいずれもリクエストしない場合、Exa はデフォルトで `text` を有効にします。

### 料金の例 {#pricing-examples}

| リクエスト                                           | 料金     |
| ----------------------------------------------- | ------ |
| `type: "auto"` を指定した `/search`                  | $0.007 |
| 結果3件で `contents.summary` を指定した `/search`        | $0.010 |
| `type: "deep"` を指定した `/search`                  | $0.012 |
| 2件のURLに対して `text: true` を指定した `/contents`       | $0.002 |
| 1件のURLに対して `text` と `summary` を指定した `/contents` | $0.002 |

## 決済フローの仕組み {#how-the-payment-flow-works}

このフローは SDK が自動で処理しますが、HTTP で直接確認することもできます。

1. API キーや決済クレデンシャルを付けずにリクエストを送信します。Exa は `402` とともに、価格、トークン、受取人、ネットワーク、スポンサーシップの詳細を含む `WWW-Authenticate: Payment` チャレンジを返します。
2. チャレンジに署名し、`Authorization: Payment <credential>` を付けてリクエストを再送します。
3. Exa は決済と並行してリクエストを処理します。決済が確定すると、Exa は `Payment-Receipt` ヘッダーを付けて結果を返します。決済に失敗した場合、Exa は結果を返さず、新しいチャレンジとともに `402` を返します。

### 支払いチャレンジを確認する {#inspect-a-payment-challenge}

ウォレットがなくても、料金と支払いの詳細を確認できます。

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "numResults": 3}'
```

`402` レスポンスに `WWW-Authenticate: Payment` ヘッダーが含まれていることを確認してください。支払いを伴わないディスカバリーリクエストにはレート制限があるため、この方法はポーリングではなくデバッグ用途で使用してください。

## 支払いリファレンス {#payment-reference}

Exa は、Tempo mainnet 上の USDC.e による MPP 支払いに対応しています。

| ネットワーク        | 識別子           | トークン   | アセット                                         |
| ------------- | ------------- | ------ | -------------------------------------------- |
| Tempo mainnet | `eip155:4217` | USDC.e | `0x20c000000000000000000000b9537d11c60e8b50` |

USDC.e の小数点以下の桁数は 6 桁です。チャレンジでは価格が最小単位で表されるため、`7000` は $0.007、`1000000` は $1.00 を意味します。

<Note>
  Exa は同じエンドポイントで MPP と [x402](/ja/docs/integrations/payments/x402/quickstart) の両方をサポートしています。認証されていない `402` レスポンスには、MPP の `WWW-Authenticate: Payment` チャレンジと x402 の `PAYMENT-REQUIRED` ヘッダーの両方が含まれる場合があります。クライアントが対応している支払いプロトコルのヘッダーを使用してください。
</Note>

### ヘッダー {#headers}

| ヘッダー                                  | 方向          | 説明                             |
| ------------------------------------- | ----------- | ------------------------------ |
| `Authorization: Payment <credential>` | リクエスト       | MPP の決済クレデンシャル                |
| `WWW-Authenticate: Payment`           | `402` レスポンス | リクエストの料金と支払い方法の案内              |
| `Payment-Receipt`                     | 成功時のレスポンス   | 決済レシート(オンチェーンのトランザクションハッシュを含む) |

### エラー {#errors}

| ステータス | 説明                                        |
| ----- | ----------------------------------------- |
| `402` | 決済クレデンシャルがないか、無効です。レスポンスには新しいチャレンジが含まれます |
| `402` | 支払い金額がリクエストの価格と一致しないか、決済に失敗しました           |
| `429` | このIPからの未払いのディスカバリーリクエストが多すぎます             |
| `429` | このウォレットが有料リクエストのレート制限を超えました               |

### レート制限 {#rate-limits}

MPP のレート制限は x402 と共通で、API キーの制限とは別に適用されます。

| 制限                     | しきい値     | 期間   |
| ---------------------- | -------- | ---- |
| IP あたりの未払いディスカバリーリクエスト | 5 リクエスト  | 60 秒 |
| ウォレットあたりの支払い済みリクエスト    | 10 リクエスト | 1 秒  |

## よくある質問 {#faq}

<AccordionGroup>
  <Accordion title="MPP と API キーを併用できますか？">
    リクエストに `x-api-key` ヘッダーが含まれている場合は API キーによるフローが優先され、MPP はスキップされます。両者を併用することはできず、リクエストごとにどちらか一方のみが適用されます。
  </Accordion>

  <Accordion title="リクエストの処理後に決済の確定が失敗した場合はどうなりますか？">
    レスポンスはブロックされます。クライアントが再試行できるよう、新しい `WWW-Authenticate: Payment` チャレンジを含む `402` が返されます。決済が確定するまで、結果は返されません。
  </Accordion>

  <Accordion title="どのウォレットがサポートされていますか？">
    クライアント SDK で署名できる Tempo 互換の EVM ウォレットであれば、どれでも利用できます。たとえば、`viem` アカウントと `mppx` (TypeScript) の組み合わせや、`eth-account` のキーと `pympp` (Python) の組み合わせです。AI エージェントで利用する場合は、リクエストの料金をまかなえる USDC.e 残高を Tempo 上に持つウォレットを使用してください。
  </Accordion>
</AccordionGroup>

## リソース {#resources}

* [MPP プロトコルドキュメント](https://mpp.dev/protocol): プロトコルの詳細と認証フォーマット
* [mppx ドキュメント](https://mpp.dev/sdk/typescript): MPP TypeScript SDK リファレンス
* [pympp ドキュメント](https://mpp.dev/sdk/python): MPP Python SDK リファレンス
* [Tempo](https://tempo.xyz): Tempo ネットワークのドキュメント
* [x402 で支払う](/ja/docs/integrations/payments/x402/quickstart): 同じエンドポイントを x402 で支払って利用する
* [Exa Search API ガイド](/ja/docs/search/quickstart): search パラメーターの完全なリファレンス
* [Exa Contents API ガイド](/ja/docs/contents/quickstart): contents パラメーターの完全なリファレンス