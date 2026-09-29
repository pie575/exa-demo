> ## ドキュメントインデックス
>
> ドキュメントインデックスの完全版は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="exa-for-google-sheets">
  # Exa for Google Sheets
</div>

> Google Sheets 内で Exa Agent と Exa の数式を利用できます。

<Warning>
  **複数の Google アカウントを使用している場合:** アドオンは、ブラウザプロファイルの最初の (デフォルトの) Google アカウントで実行する必要があります。複数のアカウントにログインしていると、API キーを保存または読み込めないことがあります。この問題を解決するには、1 つのアカウントのみでログインしたシークレットウィンドウで Sheets を開くか、不要なアカウントからログアウトして、使用したいアカウントがデフォルトになるようにしてください。[詳細はこちら](https://developers.google.com/apps-script/guides/projects#fix_issues_with_multiple_google_accounts)。
</Warning>

Google Sheets 内で Exa を使えば、ウェブでのリサーチ、表の生成、不足データの補完が行えます。

アドオンには 2 つの使い方があります。

* **Exa Agent**: 表全体の作成や複数セルにまたがるタスク向け
* **`=EXA(...)`**: 1 つのセルで 1 つの回答を得たい場合向け

<div id="install">
  ## インストール
</div>

<Steps>
  <Step title="アドオンをインストールする">
    Google Workspace Marketplace の [Exa AI アドオン](https://workspace.google.com/marketplace/app/exa_ai/465545439521)を開き、**Install** をクリックします。
  </Step>

  <Step title="Google スプレッドシートを開く">
    新規または既存のスプレッドシートを開きます。
  </Step>

  <Step title="サイドバーを開く">
    **Extensions → Exa AI → Open Sidebar** を選択します。
  </Step>

  <Step title="API キーを追加する">
    <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
    </Card>

    サイドバーにキーを貼り付けます。
  </Step>

  <Step title="Exa を使い始める">
    **Exa Agent** を開くと、シート上で Exa を使えるようになります。
  </Step>
</Steps>

<div id="exa-agent">
  ## Exa Agent
</div>

Exa Agent を使うと、Google Sheets の複数のセルにまたがって Exa を利用できます。

次のような場合に便利です。

* 1 つのプロンプトから表全体を生成する
* 既存の表の空白セルを埋める
* 新しい行を追加して表の続きを作成する
* Web データでリストを補完する

<div id="generate-a-table">
  ### 表を生成する
</div>

Exa に新しい表を作成させたい場合は、**Generate table** を使用します。

1. サイドバーを開きます。
2. **Exa Agent** に移動します。
3. **Generate table** を選択します。
4. 作成したい内容を入力します。
5. **Generate table** をクリックします。

プロンプトの例：

```text theme={null}
AI企業の上位40社を探し、企業名、ウェブサイトのURL、CEO、設立日、本社所在地、簡単な説明を返してください。
```

Exa がウェブをリサーチし、結果を表としてシートに書き込みます。

デフォルトでは、表は選択中のセルを起点に作成されます。開始セルは **More options** で変更できます。

<div id="fill-cells">
  ### Fill cells
</div>

既存の表で不足しているデータを Exa に埋めてもらいたい場合は、**Fill cells** を使用します。

1. シート内の空白セルを選択します。
2. **Exa Agent** を開きます。
3. **Fill cells** を選択します。
4. **Fill selected cells** をクリックします。

Exa は選択範囲の周囲にある表の内容を参照して、空白セルを埋めます。

**Fill cells** を使用する前に、わかりやすいヘッダーが設定された表内の空白セルを選択してください。

例:

| Company | Website                                  | CEO           | Headquarters  |
| ------- | ---------------------------------------- | ------------- | ------------- |
| Apple   | [https://apple.com](https://apple.com)   |               |               |
| Google  | [https://google.com](https://google.com) | Sundar Pichai | Mountain View |

Apple の行の空白セルを選択し、**Fill selected cells** をクリックします。Exa は会社名と周辺の行をコンテキストとして使用します。

<div id="continue-rows">
  ### 行の続きを生成する
</div>

表の下にある空白行を選択することもできます。

たとえば表が 55 位で終わっている場合、その下の空白行を 2 行選択すると、Exa が 56 位と 57 位を追加して表の続きを作成できます。

Exa は既存の行を例として参照し、同じ列構成を保ちながら、表にすでにある項目と重複しないように生成します。

<div id="exa">
  ## `=EXA(...)`
</div>

1つのセルに1つの回答を返したい場合は、`=EXA(...)` を使用します。Web を検索して上位の結果を読み込み、簡潔な回答を返します。

```text theme={null}
=EXA("what you want", cell)
```

| パラメーター    | 必須  | 説明                                          |
| --------- | --- | ------------------------------------------- |
| `prompt`  | はい  | 取得したい情報 (例: `"Return only the CEO name"`) 。 |
| `context` | いいえ | 補完対象のセル参照またはテキスト (例: `A2` に入力された企業名) 。      |

例:

```text theme={null}
=EXA("Return only the company website URL", A2)
=EXA("Return only the CEO name", A2)
=EXA("Return only the headquarters", A2)
=EXA("Return the Amazon rating of this product", A2)
```

2番目の引数はコンテキストです。数式を列の下方向へドラッグすると、複数の行にまとめて適用できます。

1つのセルで完結するシンプルな回答には `=EXA(...)` を使用します。表全体を作成したりデータを入力したりしたい場合は、**Exa Agent** を使用してください。

<div id="exa_answer">
  ## `=EXA_ANSWER(...)`
</div>

出力形式を細かく制御できる高度な AI 回答関数です。システムプロンプト、構造化された JSON 出力、引用、特定の検索タイプなどが必要な場合に使用します。

```text theme={null}
=EXA_ANSWER(prompt, [prefix], [suffix], [includeCitations], [systemPrompt], [outputSchema], [returnRawJson], [type])
```

| パラメーター              | 必須  | デフォルト    | 説明                                                                               |
| ------------------ | --- | -------- | -------------------------------------------------------------------------------- |
| `prompt`           | はい  | —        | メインとなる質問またはプロンプト。                                                                |
| `prefix`           | いいえ | `""`     | プロンプトの前に付加するテキスト。                                                                |
| `suffix`           | いいえ | `""`     | プロンプトの後に付加するテキスト。                                                                |
| `includeCitations` | いいえ | `FALSE`  | `TRUE` の場合、番号付きのソース引用を末尾に追加します。                                                  |
| `systemPrompt`     | いいえ | `""`     | 出力形式を制御するためのシステム指示 (例: `"only return a number"`) 。                               |
| `outputSchema`     | いいえ | `""`     | 構造化出力用の JSON スキーマ。[スキーマはこちらで生成できます](https://dashboard.exa.ai/playground/answer)。 |
| `returnRawJson`    | いいえ | `FALSE`  | `TRUE` かつ `outputSchema` が設定されている場合、値を抽出せずに JSON 全体を返します。                        |
| `type`             | いいえ | `"deep"` | 検索タイプ: `"auto"`、`"neural"`、`"fast"`、`"deep"` のいずれか。                              |

例:

```text theme={null}
=EXA_ANSWER("OpenAI CEO", "", "", FALSE, "only return a name")
=EXA_ANSWER("Modal AI headcount", "", "", FALSE, "only return a number")
=EXA_ANSWER("ceo of exa.ai", "", "", FALSE, "", "{""type"":""object"",""properties"":{""name"":{""type"":""string""}}}")
```

<div id="exa_search">
  ## `=EXA_SEARCH(...)`
</div>

Web を検索し、URL のリストを縦方向に返します。ドメインやカテゴリによるフィルタリング、コンテンツのハイライト、`outputSchema` による合成出力に対応しています。

```text theme={null}
=EXA_SEARCH(query, [numResults], [searchType], [prefix], [suffix], [includeDomainsStr], [excludeDomainsStr], [category], [highlightsMaxChars], [outputSchemaJson])
```

| パラメーター               | 必須  | デフォルト    | 説明                                                                                                                      |
| -------------------- | --- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `query`              | はい  | —        | 検索クエリ。                                                                                                                  |
| `numResults`         | いいえ | `1`      | 取得する結果の件数 (1～10) 。                                                                                                      |
| `searchType`         | いいえ | `"auto"` | `"auto"`、`"neural"`、`"keyword"` のいずれか。                                                                                  |
| `prefix`             | いいえ | `""`     | クエリの前に付加するテキスト。                                                                                                         |
| `suffix`             | いいえ | `""`     | クエリの後に付加するテキスト。                                                                                                         |
| `includeDomainsStr`  | いいえ | `""`     | 対象に含めるドメイン (カンマ区切り、例: `"linkedin.com,crunchbase.com"`) 。                                                                |
| `excludeDomainsStr`  | いいえ | `""`     | 除外するドメイン (カンマ区切り) 。                                                                                                     |
| `category`           | いいえ | `""`     | 種類による絞り込み: `"company"`、`"publication"`、`"news"`、`"personal site"`、`"financial report"`、`"people"`。                      |
| `highlightsMaxChars` | いいえ | `0`      | 0 より大きい値を指定すると、結果ごとにこの文字数を上限としてコンテンツのハイライトを取得します。                                                                       |
| `outputSchemaJson`   | いいえ | `""`     | `outputSchema` 用の JSON 文字列 (例: `"{""type"":""text"",""description"":""summarize""}"`) 。指定すると、URL の代わりに合成された出力テキストを返します。 |

例:

```text theme={null}
=EXA_SEARCH("AI startups", 5, "auto", "", "", "linkedin.com,crunchbase.com")
=EXA_SEARCH("transformer architecture", 5, "auto", "", "", "", "", "publication")
```

<div id="exa_contents">
  ## `=EXA_CONTENTS(...)`
</div>

URLからテキストコンテンツを抽出します。

```text theme={null}
=EXA_CONTENTS(url)
```

| パラメーター | 必須 | 説明                                           |
| ------ | -- | -------------------------------------------- |
| `url`  | はい | 完全なURL (`http` または `https` で始まっている必要があります) 。 |

<div id="exa_findsimilar">
  ## `=EXA_FINDSIMILAR(...)`
</div>

基準となる URL に類似した URL を検索します。必要に応じて、ドメインやテキストによるフィルターも指定できます。

```text theme={null}
=EXA_FINDSIMILAR(url, [numResults], [includeDomainsStr], [excludeDomainsStr], [includeTextStr], [excludeTextStr])
```

| パラメーター              | 必須  | デフォルト | 説明                     |
| ------------------- | --- | ----- | ---------------------- |
| `url`               | はい  | —     | 基準となる URL。             |
| `numResults`        | いいえ | `1`   | 結果の件数 (1〜10)。          |
| `includeDomainsStr` | いいえ | `""`  | 対象に含めるドメイン (カンマ区切り)。   |
| `excludeDomainsStr` | いいえ | `""`  | 対象から除外するドメイン (カンマ区切り)。 |
| `includeTextStr`    | いいえ | `""`  | 結果に必ず含まれるべきフレーズ。       |
| `excludeTextStr`    | いいえ | `""`  | 結果に含まれてはならないフレーズ。      |

<div id="batch">
  ## Batch
</div>

多数の Exa 数式セルをまとめて操作したい場合は、**Batch** を使用します。

Batch では次の操作ができます。

* Exa 数式を含む選択したセルを更新する
* 選択した Exa 数式を通常の値に変換する

現在の結果をそのまま残し、数式が再実行されないようにしたい場合は、数式を値に変換してください。

<div id="when-to-use-what">
  ## 用途別の使い分け
</div>

| タスク                        | 使用するもの                     |
| -------------------------- | -------------------------- |
| プロンプトから表全体を作成する         | Exa Agent → Generate table |
| 表内の空白セルを埋める             | Exa Agent → Fill cells     |
| 表に新しい行を追加して続きを作成する      | Exa Agent → Fill cells     |
| 1 つのセルに 1 つの値を取得する         | `=EXA(...)`                |
| システムプロンプトや構造化出力を使って回答を取得する | `=EXA_ANSWER(...)`         |
| 検索して URL のリストを取得する         | `=EXA_SEARCH(...)`         |
| URL からテキストを抽出する            | `=EXA_CONTENTS(...)`       |
| URL に類似したページを検索する          | `=EXA_FINDSIMILAR(...)`    |
| 多数の Exa 数式をまとめて更新する        | Batch                      |
| 数式の結果をプレーンテキストとして保存する      | Batch → Convert to values  |

<div id="notes">
  ## 注意事項
</div>

* Exa API のリクエストは使用量のクォータとしてカウントされます。**Batch → Convert to values** を使うと、結果を固定して数式が再計算されないようにできます。
* レート制限 (HTTP 429) に達した場合、アドオンは指数バックオフを用いて最大 3 回まで自動で再試行します。
* 数百行規模に拡大する前に、まずは小さなバッチ (10〜20 行) から始めてください。

<div id="links">
  ## リンク
</div>

* [Exa AI for Google Sheets をインストール](https://workspace.google.com/marketplace/app/exa_ai/465545439521)
* [Exa API キーを取得](https://dashboard.exa.ai/api-keys)
* [GitHub リポジトリ](https://github.com/exa-labs/exa-for-sheets)
* [プライバシーポリシー](https://exa.ai/exa-for-sheets/privacy-policy)