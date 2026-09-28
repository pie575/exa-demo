> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="openhuman">
  # OpenHuman
</div>

> Exa を使って、OpenHuman のエージェントでリアルタイムのウェブ検索を利用できるようにします。マネージド版を使うか、独自の Exa API キーを使うかを選べます。

TinyHumans が提供する [OpenHuman](https://tinyhumans.gitbook.io/openhuman) は、エージェントが自律的に呼び出すネイティブのウェブ検索ツールを備えたデスクトップ AI アシスタントです。このツールの検索プロバイダーには Exa が使われています。

| 方式                    | セットアップ           | 実行場所                                                   |
| --------------------- | ---------------- | ------------------------------------------------------ |
| **OpenHuman Managed** | 不要               | OpenHuman のバックエンド (Exa を利用)。API キーは不要です。               |
| **Exa provider**      | Exa API キーを貼り付ける | お使いのマシン。ご自身の Exa アカウントで `https://api.exa.ai` に直接接続します。 |

<div id="openhuman-managed">
  ## OpenHuman Managed
</div>

デフォルトではマネージド検索が使われます。オンボーディング時に **Simple** を選択すれば、エージェントはすぐにウェブを検索できます。

<Frame caption="Exa を活用したマネージド検索を使うには、オンボーディング時に Simple を選択します">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/onboarding-runtime-choice.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=bc4395e75a47554bf741c39bc23a9b36" alt="OpenHuman の実行方法を尋ねるオンボーディング画面で、Simple オプションが選択されている様子" style={{width: "700px", height: "auto", margin: "0 auto"}} width="1180" height="700" data-path="images/integrations/openhuman/onboarding-runtime-choice.png" />
</Frame>

<Tip>
  **Exa の検索結果を最も手早く得られるのがマネージドです。** キーの作成、保管、ローテーションは不要で、マシン上に認証情報を置く必要もありません。検索料金は OpenHuman のサブスクリプションで請求されます。
</Tip>

<div id="exa-provider">
  ## Exa provider
</div>

Exa を直接設定すると、ご自身の Exa アカウントで検索を実行でき、エージェントに Exa の検索ツールとページコンテンツ取得ツールを提供できます。

<div id="get-your-exa-api-key">
  ### Exa API キーを取得する
</div>

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
</Card>

<div id="add-exa-in-openhuman">
  ### OpenHuman に Exa を追加する
</div>

1. **Connections** を開き、**API keys** の下にある **Search engine** を選択します。

<Frame caption="Connections → API keys → Search engine">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/connections-search.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=fade0adb98ff41285546365851f79df7" alt="OpenHuman の Connections ページで API keys の下の Search engine が選択され、OpenHuman Managed が有効になった検索エンジン一覧が表示されている" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/connections-search.png" />
</Frame>

2. **Exa** を選択します。

<Frame caption="Exa を選択し、キーの入力を待っている状態">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/select-exa.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=3b6a9f492b89da38097bb243730aed70" alt="OpenHuman の Search engine パネルで Exa エンジンが選択され、Needs API key バッジが表示されている" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/select-exa.png" />
</Frame>

3. **Exa API key** にキーを貼り付け、**Save** を選択します。

<Frame caption="Exa API キーを保存する">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/enter-api-key.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=1a5f91044b2b020317ce9705f76cf1a4" alt="OpenHuman の Exa API key フィールドにキーが入力され、Save ボタンが表示されている" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/enter-api-key.png" />
</Frame>

<Frame caption="Exa が有効な検索エンジンとして設定された状態">
  <img src="https://mintcdn.com/exa-52/lBRUht3CpNlQPh4p/images/integrations/openhuman/configured.png?fit=max&auto=format&n=lBRUht3CpNlQPh4p&q=85&s=b3c8df585a06a31daa8bba6c2a516722" alt="OpenHuman の Search engine パネルで Exa が選択され、Configured と表示されている" style={{width: "800px", height: "auto", margin: "0 auto"}} width="1180" height="820" data-path="images/integrations/openhuman/configured.png" />
</Frame>

<div id="configuration">
  ### 設定
</div>

このパネルでの設定は OpenHuman の `config.toml` に書き込まれます。同じ値をファイルや環境変数で直接設定することもできます。

<Tabs>
  <Tab title="config.toml">
    ```toml config.toml theme={null}
    [search]
    engine = "exa"        # 必須
    max_results = 5       # 任意、1～20
    timeout_secs = 15     # 任意

    [search.exa]
    api_key = "your-exa-api-key"   # 必須
    ```
  </Tab>

  <Tab title="環境変数">
    ```bash theme={null}
    OPENHUMAN_SEARCH_ENGINE=exa
    EXA_API_KEY=your-exa-api-key
    ```

    <Note>
      `EXA_API_KEY` と `OPENHUMAN_EXA_API_KEY` はどちらも `search.exa.api_key` を上書きします。両方が設定されている場合は `OPENHUMAN_EXA_API_KEY` が優先されます。
    </Note>
  </Tab>
</Tabs>

<div id="tools-the-agent-gets">
  ### エージェントが利用できるツール
</div>

| ツール                | 返される内容                                     |
| ------------------ | ------------------------------------------ |
| `web_search_tool`  | Exa によるウェブ検索。                              |
| `exa_search`       | タイトル、URL、公開日、およびオプションでテキストを含む、ランク付けされたページ。 |
| `exa_get_contents` | 指定した URL の全文コンテンツ。オプションで要約やハイライトも含められます。   |

エージェントは呼び出しごとに Exa の[検索パラメータ](/ja/docs/search/quickstart)を設定します。そのため、検索モード、ドメイン、日付、カテゴリは、普通の言葉で指示するだけで制御できます。

<div id="troubleshooting">
  ## トラブルシューティング
</div>

<AccordionGroup>
  <Accordion title="Exa search unavailable: no API key configured">
    **Search engine** パネル、`EXA_API_KEY` および `OPENHUMAN_EXA_API_KEY` 変数、`search.exa.api_key` のいずれにも、OpenHuman がキーを見つけられませんでした。いずれかにキーを設定してください。OpenHuman の実行中に `config.toml` を編集した場合は、OpenHuman を再起動してください。
  </Accordion>

  <Accordion title="Exa rejected the configured API key (HTTP 401)">
    キーが無効であるか、失効しています。[Exa ダッシュボード](https://dashboard.exa.ai/api-keys)でキーを確認し、保存済みのキーを **Clear** してから正しいキーを保存してください。貼り付けた際に空白文字が混入していないかも確認してください。
  </Accordion>

  <Accordion title="Exa returned non-2xx status">
    `429` は、レート制限に達したかクォータを使い切ったことを示します。[ダッシュボード](https://dashboard.exa.ai)で使用量を確認してください。`5xx` の場合は再試行し、それでも解決しない場合は[エラーコード](/ja/docs/admin/error-codes)を参照してください。
  </Accordion>

  <Accordion title="OpenHuman Managed is missing from the engine list">
    ローカル専用セッションではマネージド検索を利用できません。ご自身のキーで Exa provider を設定してください。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## リソース
</div>

<Columns cols={3}>
  <Card title="OpenHuman のウェブ検索ドキュメント" icon="book-open" href="https://tinyhumans.gitbook.io/openhuman/features/native-tools/web-search" cta="ガイドを開く" arrow="true">
    OpenHuman 公式の検索エンジンに関するリファレンスを確認できます。
  </Card>

  <Card title="Exa Search API" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを読む" arrow="true">
    Exa ツールを支える検索モード、フィルター、コンテンツオプションについて説明します。
  </Card>

  <Card title="検索のベストプラクティス" icon="sparkles" href="/ja/docs/search/best-practices" cta="ガイドを読む" arrow="true">
    クエリごとに、より精度の高い結果を得るためのヒントを紹介します。
  </Card>
</Columns>