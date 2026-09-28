> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Tempo MPP GTM エンリッチメントクックブック {#tempo-mpp-gtm-enrichment-cookbook}

> Tempo MPP を使って、Exa の search リクエストと contents リクエストごとに支払う GTM エンリッチメントワークフローを構築します。API キーは不要です。

このクックブックでは、Exa の `/search` および `/contents` エンドポイントを基盤に、
Machine Payments Protocol (MPP) を通じてリクエスト単位で支払う GTM エンリッチメントエージェントやパイプラインを
構築する方法を紹介します。MPP は複数の支払い方法に対応していますが、
ここでは [Tempo](https://tempo.xyz) 上のステーブルコインを使用する例を示します。月額サブスクリプション、
API キー、シート単位の料金はいずれも不要です。ウォレットに USDC.e を入金すれば、リードや企業を
エンリッチした分だけ支払えます。

<Info>
  現在、MPP に対応しているのは Exa の `/search` および `/contents` エンドポイントのみです。
  Agent API (`/agent/runs`) と `/answer` を利用するには Exa API キーが必要で、
  通常の API キー課金フローが適用されます。
</Info>

## 作成するもの {#what-youll-build}

企業名またはターゲットの説明のリストを入力として受け取り、次の処理を行う軽量なエンリッチメントパイプラインです。

1. Exa の `/search` で `type: "deep"` と `outputSchema` を指定し、
   企業の公式ページを特定して主要なメタデータを抽出します。
2. 返された結果に `contents.highlights` を使用し、資金調達、本社所在地、
   従業員数、製品に関するソースのスニペットを取得します。
3. 入力ごとに CSV または JSON 形式のエンリッチメントレコードを出力します。

このパターンは、リードリストのエンリッチメント、アカウントリサーチ、アウトバウンドの
パーソナライズに活用できます。個別の `/search` と `/contents` の
呼び出しで構成されているため、すべてのステップを MPP で支払えます。

## 前提条件 {#prerequisites}

* Tempo mainnet 上の **USDC.e** で資金を入金済みの、Tempo 対応ウォレット。
* 実行時にウォレットの秘密鍵を安全に読み込む手段 (下記参照。キーをコミットしたり、
  ソースコードに記述したりしないでください) 。
* `mppx` (TypeScript) または `pympp` (Python) がインストールされていること。

<Info>
  秘密鍵を直接扱わずにコマンドラインでセットアップする場合は、[Tempo Wallet CLI](/ja/docs/integrations/payments/mpp/quickstart#pay-from-the-command-line) を使用してください。`tempo wallet login` を実行すると、ウォレットを作成または接続できます。新規登録時には無料の MPP Credits が付与される場合があります。
</Info>

## MPP のセットアップ {#mpp-setup}

### クライアントのインストール {#install-the-client}

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

### 秘密鍵を安全に読み込む {#load-your-private-key-safely}

秘密鍵は決してハードコードしないでください。以下の例では、ローカル開発に限って実行環境の
`WALLET_PRIVATE_KEY` を読み込んでいます。本番環境では、1Password、AWS Secrets Manager、HashiCorp Vault などの
シークレットマネージャーから読み込んでください。

<CodeGroup>
  ```bash TypeScript theme={null}
  # シェルまたは CI のシークレットストアで設定し、この値は絶対にコミットしないでください
  export WALLET_PRIVATE_KEY="0x..."
  ```

  ```bash Python theme={null}
  # シェルまたは CI のシークレットストアで設定し、この値は絶対にコミットしないでください
  export WALLET_PRIVATE_KEY="0x..."
  ```
</CodeGroup>

### 有料の検索リクエストを送信する {#make-a-paid-search-request}

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  // 本番環境ではシークレットマネージャーから読み込んでください。生の値は絶対にコミットしないでください。
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
      # 本番環境ではシークレットマネージャーから読み込んでください。生の値は絶対にコミットしないでください。
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

リクエストが成功すると、Exa の検索結果とともに、オンチェーンのトランザクションハッシュを含む
`Payment-Receipt` ヘッダーが返されます。

### 有料の contents リクエストを送信する {#make-a-paid-contents-request}

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

## GTM エンリッチメントのレシピ {#gtm-enrichment-recipe}

### 企業リストをエンリッチする {#enrich-a-list-of-companies}

企業名のリストをもとに各企業のページを検索し、
構造化された詳細情報を抽出します。

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

### 人物プロフィールをエンリッチする {#enrich-a-person-profile}

このレシピでは、`type: "deep"`、`contents.highlights`、`outputSchema` を使って
人物を調査し、構造化されたプロフィールを返します。

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
  ここでは、より深い推論を行うために `type: "deep"` を、レスポンスの構造を定義するために
  `outputSchema` を使用しています。Deep search の料金は 1 リクエストあたり $0.012 で、
  `contents.highlights` を使用すると結果 1 件につき $0.001 が追加されます。
</Note>

### 構造化出力 {#structured-output}

生のテキストではなく JSON のフィールドで結果を受け取りたい場合は、検索リクエストで `outputSchema` を指定します。Exa は、スキーマに沿った形式の `output` オブジェクトを返します。

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
  `outputSchema` は、検索タイプ `deep-lite` または `deep` と組み合わせると最も効果的です。Exa 側で LLM の呼び出しが追加で発生するため、料金は `deep-lite`/`deep` と同じ扱いになります。
</Note>

## 料金と制限 {#pricing-and-limits}

MPP には、API キーによる課金と同じリクエスト単位の料金が適用されます。MPP の検索リクエストで返される結果は
最大 10 件です。

| 操作                                              | 料金                |
| ----------------------------------------------- | ----------------- |
| `/search`(`type` が `instant`、`auto`、`fast` の場合) | 1 リクエストあたり $0.007 |
| `/search`(`type` が `deep-lite`、`deep` の場合)      | 1 リクエストあたり $0.012 |
| `/search`(`type` が `deep-reasoning` の場合)        | 1 リクエストあたり $0.015 |
| `contents.text`                                 | 1 URL あたり $0.001  |
| `contents.highlights`                           | 1 URL あたり $0.001  |
| `contents.summary`                              | 1 結果あたり $0.001    |

レート制限、ネットワークの詳細、支払いヘッダーなどの詳しいリファレンスについては、[Pay with MPP (Tempo)](/ja/docs/integrations/payments/mpp/quickstart) を
参照してください。

## 本番運用のヒント {#production-tips}

* **ウォレットには USDC.e のみを入金してください。** Tempo のネットワーク手数料は Exa が負担するため、
  ガス代用のトークンを別途ウォレットに用意する必要はありません。
* **`402` レスポンスを処理してください。** MPP SDK は自動的にリトライしますが、カスタム
  クライアントでは `402` を受け取った際に `WWW-Authenticate: Payment` チャレンジを使ってリトライする必要があります。
* **`/contents` の結果をキャッシュしてください。** Contents は URL 単位で課金されます。URL ごとにキャッシュし、
  同じ企業ページに対して二重に支払わないようにしてください。
* **結果数の上限 (10 件) に注意してください。** MPP の search では `numResults` の上限が 10 に制限されます。
* **秘密鍵は絶対にコミットしないでください。** `WALLET_PRIVATE_KEY` はソース管理からではなく、シークレット
  マネージャーから読み込んでください。

## よくある質問 {#faq}

<AccordionGroup>
  <Accordion title="Exa Agent API で MPP を使用できますか？">
    いいえ。Exa のコードベースでは、MPP は `/search` と `/contents` にのみ対応しています。
    `/agent/runs` と `/answer` には Exa API キーが必要で、通常の API キーによる課金が適用されます。
  </Accordion>

  <Accordion title="同じリクエストで MPP と Exa API キーを併用できますか？">
    いいえ。リクエストに `x-api-key` または `Authorization: Bearer` が含まれている場合は
    API キーのフローが優先され、MPP は使用されません。
  </Accordion>

  <Accordion title="MPP の決済確定に失敗した場合はどうなりますか？">
    Exa は新しい `WWW-Authenticate: Payment` チャレンジを含む `402` を返し、結果は返しません。
    クライアントは新たに支払いを行ってリトライできます。決済確定が成功するまで結果は返されません。
  </Accordion>

  <Accordion title="環境ごとに別々の Tempo ウォレットが必要ですか？">
    同じウォレットを使い回すこともできますが、開発環境と本番環境ではウォレットを分けることを推奨します。
    ウォレットごとの QPS は、そのウォレットからのすべてのリクエストの合計で 10 リクエスト/秒です。
  </Accordion>
</AccordionGroup>

## 次のステップ {#next-steps}

* [MPP (Tempo) で支払う](/ja/docs/integrations/payments/mpp/quickstart): MPP の詳細なリファレンス
* [Exa Search API ガイド](/ja/docs/search/quickstart): search のパラメーターリファレンス
* [Exa Contents API ガイド](/ja/docs/contents/quickstart): contents のパラメーターリファレンス
* [Tempo MPP ドキュメント](https://mpp.dev/protocol): プロトコルと SDK の詳細