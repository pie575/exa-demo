> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Pydantic AI {#pydantic-ai}

> Exa Search API を基盤とした Web リサーチツールを Pydantic AI エージェントに組み込みます。

<Card title="コーディングエージェント クイックスタート" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa を初めて使う方も、1分以内で始められます。
</Card>

***

[Pydantic AI](https://pydantic.dev/docs/ai/) は、Pydantic の開発チームが手がける Python 向けエージェントフレームワークです。その [ハーネス](https://pydantic.dev/docs/ai/harness/exa-search/) には、公式の Exa インテグレーションが、組み合わせて使える2つのケイパビリティとして同梱されています。

* **`ExaSearch`**: Exa Search API を基盤とした Web リサーチツールです。`web_search`(上位の結果と、それぞれの最も関連性の高い抜粋を返します。合成されたテキスト要約もオプションで取得できます)、`get_page`(指定した URL のページ全体を取得します)、オプトインで有効化できる `deep_search`(1回の呼び出しで、引用付きの合成された回答を返します)を提供します。
* **`ExaAgent`**: 長時間にわたるリサーチを、遅延ツール呼び出しとして [Exa Agent API](/ja/docs/agent/quickstart) に委任します。

ケイパビリティは、ツール、ツールごとの出力上限、システムプロンプトに含める簡潔なリサーチガイダンスをひとまとめにしたものです。そのため、検索 API とページ取得処理を自分でつなぎ込んだり、体系的にリサーチするようエージェントにプロンプトで指示したりする必要はありません。

<Info> Pydantic による完全なリファレンスは[こちら](https://pydantic.dev/docs/ai/harness/exa-search/)をご覧ください。 </Info>

<Card title="Exa を使ったリサーチエージェントの構築に関する Pydantic の記事を読む" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/pydantic-ai/logo.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=aee1bf45859bf6a3debf4177d0aefb3f" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/integrations/pydantic-ai/logo.svg">
  Pydantic AI と Exa で構築した、コピー&amp;ペーストですぐに使える3つのリサーチエージェントを順を追って解説します。
</Card>

***

## はじめに {#get-started}

<Steps>
  <Step title="前提条件とインストール">
    Exa エクストラを指定してハーネスをインストールし、環境変数 `EXA_API_KEY` を設定します。

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Step>

  <Step title="エージェントに ExaSearch を追加する">
    `capabilities` パラメーターで `ExaSearch` を `Agent` に渡します。認証にはデフォルトで `EXA_API_KEY` が使用されます。

    ```Python Python theme={null}
    from pydantic_ai import Agent
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch()])

    result = agent.run_sync('What changed in the latest stable Python release?')
    print(result.output)
    ```

    `ExaSearch` はエージェントに 2 つのツールを追加します。

    | ツール          | 用途                                                                    |
    | ------------ | --------------------------------------------------------------------- |
    | `web_search` | Web を検索し、上位 `num_results` 件のページを、それぞれのタイトル、URL、最も関連性の高い抜粋とともに返します。    |
    | `get_page`   | 特定の URL 1 件の全文を取得します。対象は `web_search` で見つかった有望なページや、ユーザーが指定した URL です。 |

    `web_search` はページの全文ではなく短い抜粋 (Exa のハイライト) を返すため、複数のソースを低コストで確認できます。エージェントはその中から選んだページを `get_page` で読み込みます。コンテンツが返されない URL や質問、レート制限、一時的な障害は `ModelRetry` としてモデルに通知されるため、実行を継続して回復できます。認証の失敗 (401/403) は設定エラーとして送出されます。
  </Step>

  <Step title="ディープサーチを有効にする (任意)">
    `deep_search` は Exa の多段階の[ディープサーチ](/ja/docs/search/quickstart) (`type='deep'`) を実行します。Exa が質問を複数のクエリに展開して検索し、1 回のツール呼び出しで引用に基づく回答を返します。`web_search` よりも時間がかかり、より深く検索するため、デフォルトでは無効になっています。使用する場合は明示的に有効にしてください。

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    有効にすると、ケイパビリティの指示により、モデルは `deep_search` を `web_search` の代わりではなく、`web_search` で不十分な場合の次の手段として扱います。
  </Step>
</Steps>

***

## 設定 {#configuration}

`ExaSearch` の全フィールドとデフォルト値は以下のとおりです:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # web_search の 1 回の呼び出しあたりの結果数（1〜100）
    max_text_chars=10_000,     # get_page で取得するテキストの上限文字数（1〜10,000）
    text_summary=False,        # web_search で統合されたテキスト要約もあわせて返す
    include_deep_search=False, # deep_search ツールも公開する
    include_domains=[],        # 指定したドメインのみを検索（許可リスト）
    exclude_domains=[],        # 指定したドメインは検索しない（拒否リスト）
    guidance=None,             # None = デフォルトの指示、'' = 指示なし、str = カスタム指示
    client=None,               # ExaClient -- None の場合は EXA_API_KEY から exa_py.AsyncExa を生成
)
```

`include_domains` と `exclude_domains` は `web_search` と `deep_search` に適用され、同時に指定することはできません。範囲外の上限値を指定した場合や、両方のドメインリストを設定した場合は、インスタンス生成時に例外が発生します。

### テキスト要約 {#text-summary}

`text_summary` を設定すると、各 `web_search` 呼び出しで、検索結果をまとめたプレーンテキストの要約もあわせてリクエストされます。形式を指定しない要約が必要な場合は `True` を、特定の形式で出力したい場合はその形式を説明する文字列を渡します。

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

ツールの戻り値の形式に変更はありません。Exa がサマリーを返した場合は、`Summary:` 行として先頭に付加されます。

### 構造化された引用 {#structured-citations}

すべてのツールは `ToolReturn` を返します。`return_value` にはモデルが参照する可読テキスト (`Sources:` ブロックを含む) が格納され、`metadata` には `'sources'` キーの下に、ソースが構造化された `ExaSource` レコード (`{'url': ..., 'title': ...}`) として格納されます。メタデータはモデルに送信されないため、テキストを解析しなくても引用をレンダリングできます。

```Python Python theme={null}
from pydantic_ai.messages import ModelRequest, ToolReturnPart

for message in result.all_messages():
    if isinstance(message, ModelRequest):
        for part in message.parts:
            if isinstance(part, ToolReturnPart) and part.metadata is not None:
                for source in part.metadata.get('sources', []):
                    print(source['url'], source['title'])
```

### カスタムクライアント {#custom-client}

デフォルトのクライアントは `exa_py.AsyncExa` で、`EXA_API_KEY` を使って設定されます。認証やベース URL を明示的に設定したい場合や、テスト時にフェイクへ差し替えたい場合は、`ExaClient` プロトコルを満たす任意のオブジェクトを渡します：

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

## Exa Agent の実行 {#exa-agent-runs}

[Exa Agent API](/ja/docs/agent/quickstart) は、オープンエンドなリサーチタスクを非同期で実行します。`ExaAgent` ケイパビリティは、このライフサイクルを Pydantic AI の[遅延ツール呼び出し (deferred tool calls) ](https://pydantic.dev/docs/ai/deferred-tools/)に対応付けます。`exa_agent` ツールは run を作成したうえで処理を遅延させ、Exa の run ID を遅延呼び出しのメタデータに格納して引き渡します。

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

デフォルト (`execution='inline'`) では、ケイパビリティは Exa の run が完了するまでポーリングし、遅延された自身の呼び出しを agent run 内で解決します。そのため、この tool は通常の tool と同じように動作します (ただし時間はかかります) 。`execution='external'` を指定すると、呼び出しは `DeferredToolRequests` 出力として上位に渡され、ホストアプリケーションが別経路で解決します。

`ExaAgent` の全フィールドとそのデフォルト値:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None = API のデフォルト
    execution='inline',   # 'inline' は完了までポーリング、'external' は DeferredToolRequests を上位に返す
    output_schema=None,   # 構造化出力用の BaseModel クラスまたは dict スキーマ
    system_prompt=None,   # Exa のエージェント実行にそのまま渡される
    poll_interval=1000,   # インラインで解決する場合のポーリング間隔（ミリ秒）
    timeout_ms=3_600_000, # インラインで解決する場合の実行完了までの最大待機時間（ミリ秒）
    guidance=None,        # None = デフォルトの指示、'' = 指示なし、str = カスタム指示
    runs=None,            # ExaAgentRuns -- None の場合は EXA_API_KEY を使って AsyncExa().agent.runs を生成
)
```

***

## エージェントスペック (YAML/JSON) {#agent-spec-yamljson}

どちらのケイパビリティも Pydantic AI の [エージェントスペック](https://pydantic.dev/docs/ai/agents/#agent-spec) に対応しているため、Python コードではなく設定ファイルで宣言できます。

```yaml agent.yaml theme={null}
model: anthropic:claude-sonnet-4-6
capabilities:
  - ExaSearch:
      num_results: 3
      include_deep_search: true
  - ExaAgent:
      effort: low
```

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent, ExaSearch

agent = Agent.from_file('agent.yaml', custom_capability_types=[ExaSearch, ExaAgent])
```

スペックローダーがケイパビリティのインスタンス化方法を認識できるよう、`custom_capability_types` を渡してください。スペックから読み込まれたインスタンスは、常に `EXA_API_KEY` を使用してデフォルトのクライアントを構築します。

***

## 次のステップ {#next}

* [**Search API**](/ja/docs/search/quickstart) - ハイライト、要約、ディープサーチに対応したセマンティック検索
* [**Agent API**](/ja/docs/agent/quickstart) - 自由度の高い非同期リサーチの実行
* [**MCP のセットアップ**](/ja/docs/get-started/exa-mcp) - Exa がホストする MCP サーバー
* [**SDKs**](/ja/docs/sdks/quickstart) - Python および JavaScript SDK のドキュメント