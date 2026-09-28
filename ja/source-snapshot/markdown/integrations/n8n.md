> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 個別のページを参照する前に、このファイルで利用可能なすべてのページを確認してください。

# n8n {#n8n}

> n8n のワークフロー内で Exa の search と contents を使用します。

公式の [n8n 向け Exa ノード](https://github.com/exa-labs/n8n-integration)を使うと、ウェブ検索、コンテンツ抽出、根拠に基づく回答、Exa Agent の実行をビジュアルワークフローに組み込めます。通常のワークフローステップとして使うことも、ツールとして n8n の AI Agent に接続することもできます。

## Exa ノードをインストールする {#install-the-exa-node}

パッケージ名は `n8n-nodes-exa-official` です。

<Steps>
  <Step title="コミュニティノードを追加する">
    n8n のノードピッカーで **Exa** を検索します。お使いのインスタンスで表示されない場合は、インスタンスのオーナーが n8n の[コミュニティノードのインストールガイド](https://docs.n8n.io/integrations/community-nodes/installation/)に従って `n8n-nodes-exa-official` をインストールできます。

    このノードを使用するには、n8n 1.60 以降および Node.js 20.15 以降が必要です。
  </Step>

  <Step title="Exa API キーを作成する">
    <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Step>

  <Step title="Exa の認証情報を追加する">
    n8n で **Exa API** の認証情報を追加し、キーを貼り付けます。このアカウントを使用する各 Exa ノードで、追加した認証情報を選択します。
  </Step>
</Steps>

## 検索を実行する {#run-a-search}

1. ワークフローにトリガーを追加します。
2. **Exa** ノードを追加します。
3. **Search** を選択します。
4. クエリを入力し、検索タイプを選択します。
5. レスポンス形式を選択します。
   * **Results**: ランク付けされたページを返します
   * **Text**: 情報を統合した回答を返します
   * **Structured**: スキーマに準拠した JSON を返します
6. ノードを実行し、その出力をワークフローの次のステップに渡します。

Search では、各結果のテキスト、ハイライト、要約、リンク、画像も取得できます。ドメインフィルター、公開日、カテゴリー、`maxAgeHours`、サブページのクロールは、ノードのオプションフィールドで設定できます。

## 利用可能なリソース {#available-resources}

| リソース         | 操作                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| **Search**   | `auto`、`instant`、`fast`、`deep-lite`、`deep`、`deep-reasoning` のいずれかのモードでウェブを検索します。オプションで回答の合成や構造化出力も利用できます。 |
| **Contents** | 指定した URL のリストから、クリーンアップ済みのテキスト、ハイライト、要約、リンク、画像を取得します。                                                     |
| **Answer**   | 引用付きで根拠に基づいた回答を生成します。オプションで構造化出力も利用できます。                                                                  |
| **Agent**    | 複数ステップからなる Agent の実行を作成、確認、一覧表示、ストリーミング、ポーリング、キャンセルします。                                                   |

## n8n の AI Agent で Exa を使用する {#use-exa-with-an-n8n-ai-agent}

Exa ノードを **AI Agent** ノードのツール入力に接続します。モデルに値を指定させるパラメーターには、n8n の `$fromAI()` 式を使用できます。

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search と Answer は、グラウンディング用のツールとして適しています。複数ステップのリサーチ、リスト作成、構造化されたエンリッチメント、またはプレミアムな [Exa Connect](/ja/docs/agent/connect/overview) データを必要とするタスクには、Agent リソースを使用してください。

## Agent の実行を待機する {#wait-for-an-agent-run}

Agent の実行を作成する際、**Wait for Completion** では次のモードを選択できます。

* **Stream**: 実行が完了するまで、server-sent events の接続を 1 つ開いたまま維持します
* **Poll**: 一定の間隔で実行の状態を確認します

長時間かかるワークフローや非同期のワークフローでは、**Wait for Completion** をオフにして、返された実行の `id` を保存し、後で **Get Run** を使用してください。n8n のステップが終了しても、実行は Exa 上で継続します。

## トラブルシューティング {#troubleshooting}

<AccordionGroup>
  <Accordion title="ノードピッカーに Exa ノードが表示されない">
    インスタンスのオーナーに、検証済みのコミュニティパッケージ `n8n-nodes-exa-official` をインストールするよう依頼してください。コミュニティノードを利用できるかどうかは、n8n インスタンスのホスティング方法によって異なる場合があります。
  </Accordion>

  <Accordion title="Exa の認証情報が拒否される">
    選択した認証情報に [Exa ダッシュボード](https://dashboard.exa.ai/api-keys) で発行した有効なキーが設定されていること、およびそのキーに利用可能なクレジットが残っていることを確認してください。
  </Accordion>

  <Accordion title="Agent のワークフローがタイムアウトする">
    **Wait for Completion** を無効にして、返された実行の `id` を保存し、後続のステップで **Get Run** を使って結果を取得してください。
  </Accordion>
</AccordionGroup>

## リソース {#resources}

<Columns cols={3}>
  <Card title="公式 Exa ノード" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="リポジトリを見る" arrow="true">
    現在サポートされている操作、互換性、ソースコードを確認できます。
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/ja/docs/agent/quickstart" cta="ガイドを読む" arrow="true">
    複数ステップのリサーチやエンリッチメントを行うワークフローを構築できます。
  </Card>

  <Card title="検索のベストプラクティス" icon="search" href="/ja/docs/search/best-practices" cta="ガイドを読む" arrow="true">
    効果的なクエリの書き方と、適切な検索モードの選び方を解説します。
  </Card>
</Columns>