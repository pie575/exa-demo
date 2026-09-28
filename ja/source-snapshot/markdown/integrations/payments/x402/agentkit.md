> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# World AgentKit {#world-agentkit}

> World AgentKit を使うと、認証済みの人間が裏付ける AI エージェントに Exa への無料アクセスを許可できます。USDC は不要です。

## AgentKitとは？ {#what-is-agentkit}

[World AgentKit](https://docs.world.org/agents/agent-kit)は、AIエージェントが[World ID](https://world.org)を通じて、実在する認証済みの人間に裏付けられていることを証明できるツールキットです。[x402](/ja/docs/integrations/payments/x402/quickstart)と組み合わせると、**無料トライアル**を利用できるようになります。Worldの[AgentBook](https://docs.world.org/agents/agent-kit/integrate)に登録されたエージェントは、USDCを支払わずにExaの`/search`および`/contents`エンドポイントにアクセスできます。

この仕組みは標準のx402 決済フローと併用できます。認証済みの人間1人につき、その人が裏付けるすべてのエージェントの合計で**月100件の無料リクエスト**が付与されます。上限に達すると、エージェントは通常のUSDC支払いにフォールバックします。カウンターは毎月1日 (UTC) にリセットされます。

<Info>
  リクエストに`x-api-key`または`Authorization: Bearer`ヘッダーが含まれている場合、AgentKitの無料トライアルとx402 決済はどちらも適用されません。通常のAPIキー課金フローが優先されます。
</Info>

## 仕組み {#how-it-works}

クライアントが API キーなしで `/search` または `/contents` にリクエストを送信すると、Exa は `402 Payment Required` を返します。このレスポンスの `PAYMENT-REQUIRED` ヘッダーには `agentkit` 拡張が含まれており、その中に [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md)(Sign-In with Ethereum)のチャレンジが格納されています。

エージェントは登録済みのウォレットでこのチャレンジに署名し、Exa は次の項目を検証します。

1. **署名チェック** — SIWE 署名をウォレットアドレスと照合して検証します(EIP-191 による EOA と、ERC-1271 によるスマートコントラクトウォレットの両方に対応)
2. **AgentBook の照会** — World Chain(`eip155:480`)上の AgentBook コントラクトを通じてウォレットを匿名の `humanId` に解決し、認証済みの人間 1 人が自身の ID をこのエージェントに委任していることを確認します
3. **利用状況チェック** — その人間に無料トライアルの利用回数が残っていればアクセスが許可されます。残っていない場合は、USDC による支払いが必要になります

## クイックスタート {#quickstart}

### 1. AgentBook にエージェントを登録する {#1-register-your-agent-in-agentbook}

この設定は初回のみ必要です。本人確認済みの [World App](https://world.org/download) を用意してください。

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

CLI は World App での本人確認フローを開始し、続いて World Chain 上で登録トランザクションを送信します。完了すると、AgentKit を利用するサーバーであればどれでもあなたのウォレットを照会し、そのウォレットが実在の人物に裏付けられていることを確認できます。

### 2. リクエストを送信する (チャレンジを取得) {#2-send-a-request-get-the-challenge}

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

`402` レスポンスでは、デコードされた `PAYMENT-REQUIRED` ペイロード内に `agentkit` 拡張が含まれます。

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

### 3. チャレンジに署名して再送信する {#3-sign-the-challenge-and-resubmit}

`info` のフィールド (domain、uri、nonce、statement など) から [SIWE メッセージ](https://eips.ethereum.org/EIPS/eip-4361)を作成し、`supportedChains` のいずれかのタイプを使って、登録済みのエージェントウォレットで署名します。署名したメッセージは、`agentkit` ヘッダー (base64 エンコードされた JSON) に設定して送信します。

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

エージェントが検証済みで、無料トライアルの利用回数が残っている場合、Exa は `200` と検索結果を返します。この場合、支払いは不要です。

### AgentKit x402 スキルを使用する {#using-the-agentkit-x402-skill}

チャレンジ・レスポンスのフローを手動で実装する代わりに、[agentkit-x402 スキル](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md)を AI エージェントに追加できます。

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

このスキルは、エージェントが AgentKit 拡張を含む `402` レスポンスを受け取ると、一連のフロー全体を自動で処理します。

## 無料トライアルの詳細 {#free-trial-details}

* 認証済みの人間 1 人につき、その人が後ろ盾となるすべてのエージェントの合計で**月 100 回の無料リクエスト**が付与されます
* 使用量カウンターは毎月初め (UTC) にリセットされます
* 使用量は人間ごと・エンドポイントごとに集計されます (`/search` と `/contents` は別々にカウントされます)
* 同じ人間が後ろ盾となる 2 つのエージェントは、同じカウンターを共有します
* その月の無料トライアル利用回数を使い切ると、エージェントは標準の [x402 決済フロー](/ja/docs/integrations/payments/x402/quickstart)に切り替わります
* `/search` への無料トライアルリクエストにも、同じ[結果 10 件の上限](/ja/docs/integrations/payments/x402/quickstart#pricing)が適用されます
* 無料トライアルのカウンターは現在、API レスポンスには含まれていません。利用回数を使い切ると、サーバーは無料アクセスを付与せず、標準の `402` を返します

## 対応エンドポイント {#supported-endpoints}

| エンドポイント     | x402 決済 | AgentKit 無料トライアル |
| ----------- | :-----: | :--------------: |
| `/search`   |    対応   |        対応        |
| `/contents` |    対応   |        対応        |

上記以外の Exa エンドポイントは、x402 決済および AgentKit 無料トライアルには対応していません。

## ネットワークの詳細 {#network-details}

| プロパティ            | 値                                           |
| ---------------- | ------------------------------------------- |
| AgentBook チェーン   | World Chain                                 |
| チェーン ID (CAIP-2) | `eip155:480`                                |
| 検証               | World Chain 上の AgentBook コントラクト             |
| 対応ウォレットの種類       | EOA (EIP-191) およびスマートコントラクトウォレット (ERC-1271) |

## よくある質問 {#faq}

<AccordionGroup>
  <Accordion title="x402 決済と AgentKit は併用できますか？">
    はい。`PAYMENT-REQUIRED` レスポンスには、決済の料金情報と AgentKit のチャレンジの両方が含まれています。クライアントはどちらの方法でも選択できます。無料トライアルの利用回数を使い切った場合は、エージェントは USDC での支払いに切り替えることができます。
  </Accordion>

  <Accordion title="エージェントが AgentBook に登録されていない場合はどうなりますか？">
    AgentKit の検証はエラーを返さずに失敗し、リクエストは通常の `402` として扱われます。この場合でも、エージェントは通常の x402 フローで USDC による支払いを行えます。
  </Accordion>

  <Accordion title="同じ人物に紐づく 2 つのエージェントには、それぞれ別の無料トライアル枠が割り当てられますか？">
    いいえ。利用状況はウォレット単位ではなく、人物単位で追跡されます (AgentBook の匿名の `humanId` を使用) 。同じ World ID に紐づく 2 つのエージェントは、同じカウンターを共有します。
  </Accordion>

  <Accordion title="どのブロックチェーンネットワークが使用されますか？">
    標準の x402 USDC 決済は、**Base** (`eip155:8453`) または **Solana mainnet** (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`) で決済されます。AgentKit の検証では、AgentBook の参照に **World Chain** (`eip155:480`) を使用します。これらは互いに独立しており、AgentKit ではオンチェーンでの支払いは一切必要ありません。
  </Accordion>

  <Accordion title="どのウォレットタイプがサポートされていますか？">
    EIP-191 署名を使用する EOA (外部所有アカウント) と、ERC-1271 を使用するスマートコントラクトウォレット (Coinbase Smart Wallet、Safe など) の両方がサポートされています。詳細は [World AgentKit SDK リファレンス](https://docs.world.org/agents/agent-kit/sdk-reference)を参照してください。
  </Accordion>
</AccordionGroup>

## リソース {#resources}

* [x402 決済ガイド](/ja/docs/integrations/payments/x402/quickstart): 標準的な USDC 決済フロー
* [World AgentKit ドキュメント](https://docs.world.org/agents/agent-kit): AgentKit の全ドキュメント
* [World AgentKit インテグレーションガイド](https://docs.world.org/agents/agent-kit/integrate): AgentBook への登録
* [World AgentKit SDK リファレンス](https://docs.world.org/agents/agent-kit/sdk-reference): SDK の API リファレンス
* [AgentKit x402 スキル](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md): AI エージェント向けのビルド済みスキル
* [x402 プロトコルドキュメント](https://docs.x402.org): x402 の完全な仕様