> ## ドキュメントインデックス
>
> ドキュメントインデックスの完全版は https://exa.ai/docs/llms.txt から取得できます。
> 詳細を調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="highlights">
  # ハイライト
</div>

> コンテキストサイズとレイテンシを抑えつつ、Exa Search の結果からクエリに関連する抜粋を返します。

ハイライトは、各結果からクエリに関連するパッセージを抽出して返します。全文取得のトークンコストをかけずに、ページからエビデンスを得たいアプリケーションで活用してください。

各結果で選択されたパッセージは `results[].highlights` に格納されて返されます。

<div id="why-highlights-instead-of-full-text">
  ## フルテキストではなくハイライトを使う理由
</div>

ハイライトは Exa が独自に開発した抽出モデルによって生成されます。このモデルはリクエストのたびに各結果をクエリと照らし合わせて読み取り、クエリへの回答となるパッセージのみを返します。ページ全文のごく一部のトークン数で済み、下流の回答品質は同等以上に保たれます。

| 評価             | 結果                                                                           |
| -------------- | ---------------------------------------------------------------------------- |
| 精度 (SimpleQA)  | 500 文字のハイライトで、ページテキストの先頭 8,000 文字と同等の精度を 16 分の 1 のトークン数で実現                   |
| より大きなバジェットでの品質 | 4,000 文字のハイライトが 32,000 文字のフルテキストを上回るスコアを記録                                   |
| 長い技術ドキュメント     | 500 文字のバジェットで、API リファレンス、SDK ドキュメント、仕様書、論文に対してハイライトは 60% の精度を達成 (フルテキストは 6%) |
| 検索トークンの使用量     | ハイライトにより検索トークンを平均 5 分の 1 に削減                                                 |

この削減効果が特に大きいのはエージェントループです。検索結果が返されるたびに、推論トレースとコンテキストを奪い合うことになるためです。

<Tip>
  手法と全結果については [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)
  をご覧ください。
</Tip>

<div id="add-highlights-to-search">
  ## Search にハイライトを追加する
</div>

推奨されるデフォルト設定として、`contents` 内で `highlights: true` を指定してください。Exa はクエリとの関連度に基づいて各結果から返すテキスト量を自動で決定するため、文字数上限を調整する必要はありません。`maxCharacters` は、アプリケーションでページごとに固定の上限が必要な場合にのみ設定してください。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "How are inference providers reducing transformer latency?",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "How are inference providers reducing transformer latency?",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "How are inference providers reducing transformer latency?",
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

<div id="dynamic-highlights">
  ## Dynamic Highlights
</div>

Dynamic Highlights は、クエリにとって何が最も有用かに応じて、各結果から抽出するテキスト量を調整します。質の高いソースからは多く、重複する、または無関係なソースからは少なく抽出するため、返されるトークンの総数を抑えられます。

複数の結果を同じエージェントやコンテキストウィンドウに渡す場合に使用してください。ページごとに個別の抜粋が必要な場合や、ページごとの上限を予測可能にしたい場合は、通常の `highlights: true` を使用してください。

Exa の評価では、Dynamic Highlights はページ全文と比べてトークンを平均 95% 削減しました。文字数上限 12,000 文字の条件では通常の highlights を上回り、トークン効率が平均 40%、品質が 3.8% 向上しました。Exa Agent 内では、BrowseComp や WideSearch などのベンチマークにおいて、エージェント全体のトークン使用量を 30% 削減し、品質も平均 2.1% 向上しました。

<Tip>
  結果をまたいだハイライト選択の評価結果と設計については、[Dynamic Highlights](https://exa.ai/blog/dynamic-highlights) を参照してください。
</Tip>

`dynamic: true` を指定して有効化します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py.api import DYNAMIC_HIGHLIGHTS_BETA

  result = exa.search(
      "How did US household solar installation costs change over the past five years?",
      contents={
          "highlights": {
              "dynamic": True,
          }
      },
      betas=[DYNAMIC_HIGHLIGHTS_BETA],
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa, { DYNAMIC_HIGHLIGHTS_BETA } from "exa-js";

  const result = await exa.search(
    "How did US household solar installation costs change over the past five years?",
    {
      contents: {
        highlights: {
          dynamic: true
        }
      },
      betas: [DYNAMIC_HIGHLIGHTS_BETA]
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: dynamic-highlights-2026-08-28" \
    -d '{
      "query": "How did US household solar installation costs change over the past five years?",
      "contents": {
        "highlights": {
          "dynamic": true
        }
      }
    }'
  ```
</CodeGroup>

<Info>
  Dynamic Highlights はリサーチプレビューのため、
  `Exa-Beta: dynamic-highlights-2026-08-28` リクエストヘッダーが必要です。SDK では、
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) または `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript) を渡すと、このヘッダーが自動的に送信されます。

  レスポンスは、通常の highlights と同じ
  `results[].highlights` 形式です。
</Info>

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="Search API ガイド" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを開く" arrow="true">
    Search リクエストを作成し、用途に合った出力形式を選びます。
  </Card>

  <Card title="Search のベストプラクティス" icon="sparkles" href="/ja/docs/search/best-practices" cta="ガイドを読む" arrow="true">
    検索品質、レイテンシ、鮮度、コンテキストサイズを最適化します。
  </Card>
</Columns>