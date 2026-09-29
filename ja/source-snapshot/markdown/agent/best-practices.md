> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="agent-best-practices">
  # Agent のベストプラクティス
</div>

> 本番環境での Exa Agent 統合に向けて、クエリの品質、構造化出力、effort、コストを最適化します。

[Exa Agent クイックスタート](/ja/docs/agent/quickstart)を終えたら、このガイドを参考にクエリの品質を高め、出力を構造化し、実行時間とコストを管理してください。リクエストの完全な例は、まず [Agent の例](/ja/docs/agent/examples)をご覧ください。

<div id="core-principles">
  ## 基本原則
</div>

`query` はタスク仕様として扱ってください。Agent に何を見つけてほしいのか、作業のスコープ、必要な根拠、そしてどのような結果であれば完了とみなすのかを明記します。

<CodeGroup>
  ```python Python theme={null}
  run = exa.agent.runs.create(
      query="Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources.",
  )
  ```

  ```javascript JavaScript theme={null}
  const run = await exa.agent.runs.create({
    query:
      "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
    }'
  ```
</CodeGroup>

`outputSchema` を指定しない場合、Agent は `output.text` に文章を、`output.grounding` に引用を返します。その他のフィールドは、明確な用途がある場合にのみ追加してください。

| フィールド                   | 使用する場面                                                            |
| ----------------------- | ----------------------------------------------------------------- |
| `outputSchema`          | 後続の処理コードで構造化されたフィールドが必要な場合                                        |
| `input.data`            | 補完したい行がすでにある場合                                                    |
| `input.exclusion`       | 既知のレコードを結果から除外したい場合                                               |
| `dataSources`           | フィールドを [Exa Connect](/ja/docs/agent/connect/overview) のパートナーから取得する場合 |
| `previousRunId`         | 完了済みの実行を引き継ぐリクエストの場合                                              |
| `effort`                | コストやリサーチの深さを明示的に設定する必要がある場合                                       |
| `budget.maxCostDollars` | `auto` または `max` の実行に厳格なコスト上限を設けたい場合                              |

行、除外対象、レスポンスの形式は `query` に埋め込まず、それぞれ専用のフィールドで指定してください。

<div id="writing-list-building-and-enrichment-queries">
  ## リスト作成およびエンリッチメント用クエリの書き方
</div>

リスト作成では、対象エンティティ、目標件数、適格性の条件、除外対象、根拠の基準を定義します。エンリッチメントでは、既存のレコードを `input.data` に格納し、Agent にリサーチして追加させたい内容だけを記述します。

適格かどうかの判断が必要な場合は、その理由の説明も求めてください。例を示すのは、条件の解釈が複数考えられる場合に限ります。

<CodeGroup>
  ```text Query theme={null}
  Find up to 20 current engineering leaders at US-based AI infrastructure companies
  that announced a Series A or B between March 1 and August 31, 2026.

  Include CTOs, VPs of Engineering, and Heads of Engineering. Exclude founders without
  an operating engineering role and anyone whose current employment cannot be verified.
  For each person, return their name, current title, company, company website, funding
  announcement date, and a short explanation of why they qualify. Verify employment on
  the company website or another current source, and verify funding from the company
  announcement or a reputable business publication.
  ```
</CodeGroup>

探索リクエストの例については [Find all GTM members](/ja/docs/agent/examples#find-all-code) を、対応する行エンリッチメントのパターンについては [Enrich input rows](/ja/docs/agent/examples#enrich-input-rows-code) を参照してください。

<div id="handle-asynchronous-runs">
  ## 非同期の実行を処理する
</div>

Agent の実行では検索、読み取り、推論が行われるため、完了までに数秒から数分かかることがあります。アプリケーションのリクエストを開いたまま待機させるのではなく、実行のライフサイクルを前提に設計してください。

<Steps>
  <Step title="作成して保存する">
    実行を作成し、返された `id` をリクエストのメタデータとともに保存します。作成時のレスポンスは最終結果ではありません。
  </Step>

  <Step title="終了状態まで待機する">
    SDK のポーリングヘルパーを使用するか、`GET /agent/runs/{id}` をポーリングするか、SSE ストリームを受信します。実行が `queued` または `running` の間は待機を続けます。
  </Step>

  <Step title="結果を保存する">
    `completed`、`failed`、`cancelled` のいずれかになったら待機を終了し、終了時のレスポンスとグラウンディングを保存します。
  </Step>
</Steps>

実行 ID を保存しておけば、アプリケーションの再起動後の復旧、ストリームへの再接続、失敗原因の調査が可能になります。レイテンシを抑えるには、スコープを絞り込む、結果の件数を制限する、スキーマを必要最小限にとどめる、といった工夫が有効です。網羅性より速度を重視する場合は `minimal` または `low` を選択してください。

バッチ処理では、同時実行数を見積もる前や、Agent を同期的な UI の処理経路に組み込む前に、代表的なタスクでベンチマークを行ってください。実行時間は、アイテム数、スキーマの複雑さ、ソースの可用性、effort によって変動します。

Zero Data Retention を利用しているチームでは、ライブストリームを受信するか、保持期間内にポーリングしてください。`previousRunId` と Connect の `dataSources` は利用できません。詳しくは [Zero Data Retention](/ja/docs/admin/security/zero-data-retention) を参照してください。

<div id="write-custom-json-schemas-for-structured-output">
  ## 構造化出力用のカスタムJSONスキーマを作成する
</div>

下流のコードで機械可読なフィールド、正規化された値、表の行、またはエンリッチメントレコードが必要な場合は、`outputSchema` を使用してください。文章での回答で十分な場合は指定せずに `output.text` を参照してください。構造化出力は整形処理が加わるため、レイテンシが増加する可能性があります。

リサーチの指示は `query` に、レスポンスの構造は `outputSchema` に記述してください。プロパティ名と説明は明確にし、型は用途を満たす範囲で最も限定的なものを選び、配列には `maxItems` で上限を設けてください。

<CodeGroup>
  ```json Output schema expandable theme={null}
  {
    "type": "object",
    "properties": {
      "people": {
        "type": "array",
        "maxItems": 10,
        "description": "Current engineering leaders who satisfy every criterion in the query.",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The person's full name."
            },
            "job_title": {
              "type": "string",
              "description": "Their current title at the qualifying company."
            },
            "company": {
              "type": "string",
              "description": "The qualifying company's canonical name."
            },
            "qualification_rationale": {
              "type": "string",
              "description": "A concise explanation of how the person satisfies the query criteria."
            }
          },
          "required": ["name", "job_title", "company", "qualification_rationale"]
        }
      }
    },
    "required": ["people"]
  }
  ```
</CodeGroup>

スキーマへの準拠で検証されるのは構造であり、事実ではありません。送信したスキーマで必須または非nullableと指定されていても、フィールドを裏付ける根拠がない場合、Agent は `null` を返すことがあります。`stopReason: schema_satisfied` は、それらのnullを許容したうえで、期待される構造が揃ったと Agent が判断したことを意味します。送信したスキーマに対して厳密に検証されたことを保証するものではありません。

Exa に組み込まれている引用や信頼度をスキーマ内で重複して定義しないでください。根拠フィールドは、各 item が条件を満たす理由を説明させたい場合にのみ追加し、`output.grounding` は構造化された結果とあわせて保存してください。重要な主張は情報源と照合し、スキーマを変更した場合はリリース前に代表的な入力でテストしてください。

リスト作成、KYB、求人情報、除外、継続実行の各スキーマを比較するには、[構造化 Agent の例](/ja/docs/agent/examples)を参照してください。

<div id="agent-vs-search">
  ## Agent と Search の使い分け
</div>

| 用途                             | おすすめ                                    |
| ------------------------------ | --------------------------------------- |
| LLM に渡す Web 検索結果               | [Search](/ja/docs/search/quickstart)       |
| 高速なリサーチと統合                     | [Deep Search](/ja/docs/search/deep-search) |
| 非同期のリスト作成、マルチホップのリサーチ、エンリッチメント | [Agent](/ja/docs/agent/quickstart)         |

複数の検索ステップ、エンティティごとの検証、既知のレコードに対するエンリッチメントが必要な場合は Agent を使用します。ページをすばやく取得し、以降の推論をアプリケーション側で行う場合は Search を使用します。

<div id="tips-for-common-use-cases">
  ## 一般的なユースケースのヒント
</div>

| 目的                    | 推奨                                                              | 避けるべき方法                                   |
| --------------------- | --------------------------------------------------------------- | ----------------------------------------- |
| 件数が不明なリストをリサーチで作成する   | `auto` と上限を設けた `outputSchema`                                   | 低コストの固定 effort と上限のない配列                   |
| 既存レコードのエンリッチメント       | `input.data` と追加するフィールド                                         | テーブルを `query` に貼り付ける                      |
| 直前の結果セットに対するフォローアップ   | `previousRunId`                                                 | 前回の出力全体を再送信する                             |
| 同じレコードを再び返さないようにする    | `input.exclusion` と下流での重複排除                                     | 除外で同一性が厳密に保証されると想定する                      |
| プレミアムプロバイダーのデータ       | `dataSources` を指定した [Exa Connect](/ja/docs/agent/connect/overview) | プロバイダー限定のフィールドをオープンウェブから推測するよう Agent に求める |
| リクエストあたりのコストを予測しやすくする | 固定の `effort`                                                    | 予算を設定せずに `auto` や `max` を使う               |
| レイテンシやコストよりも網羅性を優先する  | `xhigh` または `max`                                               | クエリを絞り込む前に effort を引き上げる                  |

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="Agent クイックスタート" icon="bot" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    実行の作成、イベントのストリーミング、effort の設定、構造化出力の読み取り方法を学びます。
  </Card>

  <Card title="Agent の例" icon="layers" href="/ja/docs/agent/examples" cta="例を見る" arrow="true">
    リスト作成、エンリッチメント、KYB、除外、フォローアップの完全なリクエスト例をコピーして使えます。
  </Card>

  <Card title="Exa Connect" icon="database" href="/ja/docs/agent/connect/overview" cta="データパートナーを見る" arrow="true">
    企業、人物、トラフィック、コンプライアンス、金融など、プロバイダーのプレミアムデータを追加できます。
  </Card>

  <Card title="Search のベストプラクティス" icon="sparkles" href="/ja/docs/search/best-practices" cta="ガイドを読む" arrow="true">
    Search で十分な場合の検索品質、レイテンシ、統合について解説します。
  </Card>
</Columns>