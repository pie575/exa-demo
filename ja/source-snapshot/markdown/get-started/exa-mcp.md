> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="exa-mcp">
  # Exa MCP
</div>

> ChatGPT、Codex、Claude、Grok、Cursor をはじめ、あらゆる MCP クライアントを Exa のウェブ検索、ページ取得、Exa Agent、Exa Connect の各ツールに接続できます。

Exa MCP を使うと、ChatGPT、Claude、その他の MCP 対応ツールに組み込まれたウェブ検索を、Exa の検索機能で強化できます。利用できる機能には、ウェブ検索、コード検索、[Exa Agent](/ja/docs/agent/quickstart)、[Exa Connect](/ja/docs/agent/connect/overview) があります。

Exa は、どの MCP クライアントでも利用できるホスト型サーバーを提供しています。

```text theme={null}
https://mcp.exa.ai/mcp
```

API キーがなくてもすぐに使い始められます。Exa MCP はオープンソースで、[GitHub](https://github.com/exa-labs/exa-mcp-server) で公開されています。

<div id="install">
  ## インストール
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT & Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa は OpenAI のプラグインディレクトリに掲載されている公式プラグインで、ホスト型の MCP サーバーと、Exa の `search` および `exa-agent` スキルが含まれています。

      <Steps>
        <Step title="プラグインを開く">
          [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app) にアクセスします。OpenAI のプラグインディレクトリで **Exa** のページが開きます。このディレクトリは ChatGPT と Codex で共通です。
        </Step>

        <Step title="インストールする">
          プラスボタンを選択してインストールします。インストール中、または Codex や ChatGPT が初めてプラグインを使用する際にサインインを求められたら、Exa にサインインしてください。

          <Frame caption="Codex でプラグインを開き、Exa を追加してアクセスを承認する">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Codex でプラグインを開き、Exa プラグインを表示してアクセスを承認する" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="新しいセッションを開始する">
          スキルはインストール後に開始したチャットや CLI セッションでのみ読み込まれます。新しいセッションを開き、Web の情報が必要な内容を依頼してみてください。
        </Step>
      </Steps>

      これで完了です。このプラグインには Exa の MCP インテグレーションとスキルの両方が含まれているため、MCP やスキルを別途設定する必要はありません。

      セットアップとワークフローの詳細については、[Codex と ChatGPT での Exa](/ja/docs/integrations/chatgpt-codex) を参照してください。
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      ### Claude Code CLI

      <Steps>
        <Step title="プラグインをインストールする">
          ターミナルから Exa をインストールします。

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Claude Code で `/plugin` と入力し、**Exa** を検索してインストールすることもできます。
        </Step>

        <Step title="Exa を使う">
          新しい Claude Code セッションを開始し、Web の情報が必要な依頼をしてみてください。
        </Step>
      </Steps>

      ### Desktop、Web &amp; Cowork

      Claude Desktop、Web、Cowork はいずれも Exa の公式コネクタを使用します。

      <Steps>
        <Step title="コネクタディレクトリを開く">
          新しいチャットでプラスボタンを選択し、**Add connector** を選んで **Exa** を検索します。
        </Step>

        <Step title="Exa を接続する">
          Exa を開いて **Connect to Claude** を選択し、求められたらアクセスを許可します。

          <Frame caption="Claude でコネクタディレクトリを開き、Exa を見つけて接続し、アクセスを許可する様子">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Claude でコネクタディレクトリを開き、Exa を見つけて接続し、アクセスを許可する様子" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Exa を使う">
          新しいチャットを開始し、Web 上の最新情報が必要な依頼をしてみてください。
        </Step>
      </Steps>

      セットアップ手順とワークフローの詳細なガイドについては、[Claude Code、Web、Desktop での Exa](/ja/docs/integrations/claude-web-desktop) を参照してください。

      Claude Team および Enterprise の管理者は、ID プロバイダーを通じて全員にコネクタを一括でプロビジョニングすることもできます。詳しくは [Enterprise Managed Auth](/ja/docs/admin/mcp-enterprise-managed-auth) を参照してください。
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa は [Grok Build](https://docs.x.ai/build/overview) のマーケットプレイスで利用できます。

      <Steps>
        <Step title="マーケットプレイスを開く">
          Grok Build で `/marketplace` を実行します。
        </Step>

        <Step title="Exa をインストールする">
          一覧から **exa** を探して `i` を押します。
        </Step>

        <Step title="サインインする">
          `/mcp` を実行して **exa** を選択し、`i` を押すと、ブラウザで Exa アカウントにサインインできます。
        </Step>
      </Steps>

      新規アカウントには、登録時に無料クレジットが付与されます。
    </Tab>

    <Tab title="Cursor" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      [Cursor マーケットプレイス](https://cursor.com/marketplace/exa)から Exa MCP をインストールするか、`~/.cursor/mcp.json` に以下を追加します。

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="VS Code" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/vscode.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9828a7b963d47467df217a38c716fea2" width="24" height="24" data-path="images/mcp-clients/vscode.svg">
      [ワンクリックインストール](https://vscode.dev/redirect/mcp/install?name=exa\&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D)を使用するか、プロジェクトの `.vscode/mcp.json` に次の内容を追加します：

      ```json theme={null}
      {
        "servers": {
          "exa": {
            "type": "http",
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="その他のクライアント" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/other-clients.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=187e423022b8fc3ed950a967a10ff700" width="24" height="24" data-path="images/mcp-clients/other-clients.svg">
      ほとんどのクライアントでは、標準的な `mcpServers` 形式を使用します：

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```

      設定の記述場所と URL キーの名前は、クライアントによって異なります。

      | クライアント                                       | 追加する場所                                                                                        | URL キー      |
      | -------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------- |
      | [fx by Vercel](/ja/docs/integrations/vercel/fx) | fx シェルで `/mcp add --transport http exa https://mcp.exa.ai/mcp` を実行 (`~/.fx/mcp.json` に保存されます) | `url`       |
      | OpenCode                                     | `opencode.json` (`mcp` の下に `"type": "remote"` を指定)                                            | `url`       |
      | Kiro                                         | `~/.kiro/settings/mcp.json` (`mcpServers` の下)                                                 | `url`       |
      | Windsurf                                     | `~/.codeium/windsurf/mcp_config.json` (`mcpServers` の下)                                       | `serverUrl` |
      | Google Antigravity                           | Agent パネル → Manage MCP Servers → View Raw config (`mcpServers` の下)                            | `serverUrl` |
      | Zed                                          | Zed の `settings.json` (`context_servers` の下)                                                  | `url`       |
      | Gemini CLI                                   | `~/.gemini/settings.json` (`mcpServers` の下)                                                   | `httpUrl`   |
      | Warp                                         | Settings → MCP Servers → Add MCP Server (トップレベルの `exa`)                                       | `url`       |
      | v0 by Vercel                                 | Prompt Tools → Add MCP                                                                        | URL を直接貼り付け |

      お使いのクライアントがリモート MCP サーバーに対応していない場合は、`mcp-remote` ブリッジを使用してください。

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
          }
        }
      }
      ```

      または、[Exa APIキー](https://dashboard.exa.ai/api-keys)を使ってローカルの[npmパッケージ](https://www.npmjs.com/package/exa-mcp-server)を実行します。

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "exa-mcp-server"],
            "env": {
              "EXA_API_KEY": "your_api_key"
            }
          }
        }
      }
      ```
    </Tab>
  </Tabs>
</div>

<div id="authentication">
  ## 認証
</div>

Exa MCP は 3 つの認証モードをサポートしています。

| モード    | 用途                                    | セットアップ                                                                           |
| ------ | ------------------------------------- | -------------------------------------------------------------------------------- |
| キーレス   | サインインや API キーなしで利用できる無料枠 (レート制限あり)    | `https://mcp.exa.ai/mcp` に接続します                                                  |
| OAuth  | 対話型クライアント、マーケットプレイスからのインストール、本番環境での利用 | `https://mcp.exa.ai/mcp?login` に接続し、ブラウザで Exa にサインインします。利用量はお使いの Exa チームに計上されます。 |
| API キー | MCP OAuth に対応していないクライアント              | `x-api-key` ヘッダーに API キーを設定し、`https://mcp.exa.ai/mcp` に接続します                     |

<div id="sign-in-with-oauth">
  ### OAuthでサインイン
</div>

ChatGPT、Claude、その他のマーケットプレイスからインストールした場合は、必要に応じてサインインを求められます。MCP OAuthに対応している任意のクライアントでは、次のURLに接続すると同じフローを利用できます。

```text theme={null}
https://mcp.exa.ai/mcp?login
```

クライアントが Exa の認可サーバーを検出し、ブラウザでサインイン画面を開いて、アクセスを管理します。

<div id="use-an-api-key">
  ### API キーを使用する
</div>

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

MCP サーバーの設定に `x-api-key` ヘッダーを追加します。

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

<div id="available-tools">
  ## 利用可能なツール
</div>

| ツール                       | 利用条件               | 用途                                    |
| ------------------------- | ------------------ | ------------------------------------- |
| `web_search_exa`          | デフォルトで有効           | ウェブを検索し、関連性が高くすぐに使えるコンテンツを取得する        |
| `web_fetch_exa`           | デフォルトで有効           | 指定した1つ以上のURLからクリーンなコンテンツを読み取る         |
| `web_search_advanced_exa` | オプトイン時に利用可能        | 高度なフィルターや制御オプションを使ってウェブ検索を設定する        |
| `agent_run`               | OAuthまたはAPIキーで利用可能 | 複数ステップのリサーチ、リスト作成、エンリッチメント、構造化出力を実行する |

`tools` URLパラメーターを使用すると、クライアントに表示するツールを選択できます。たとえば、すべてのツールを有効にするには次のようにします。

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  `tools` リストを明示的に指定するとデフォルトの設定は上書きされます。ウェブ検索やフェッチも含め、有効にしたいツールをすべて指定してください。
</Tip>

<div id="exa-agent">
  ## Exa Agent
</div>

複数回の検索が必要なリサーチには [Exa Agent](/ja/docs/agent/quickstart) を使用してください。たとえば、リストを作成する、各アイテムが条件を満たすか確認する、構造化された結果を返すといった用途に適しています。

Agent の実行は従量課金制のため、`agent_run` を使用するには OAuth または API キーが必要です。次の URL で OAuth を開始すると、デフォルトのツールに加えて Agent が追加されます。

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

API キーを使用する場合は、`login` を省略し、[認証](#authentication)の説明に従ってキーを追加してください。

<Steps>
  <Step title="必要な内容を伝える">
    リサーチしたい内容を普段の言葉で依頼します。アシスタントがリクエストを `query` として `agent_run` に渡すと、Exa Agent が検索すべき内容を判断してソースを読み込み、見つけた情報がリクエストに合っているかを確認します。

    アプリケーションで調査結果を一貫した JSON 形式で扱う必要がある場合に限り、Agent に `outputSchema` を指定するよう依頼してください。スキーマはシステムプロンプトでアシスタントに渡すことも、アシスタントに生成させることもできます。
  </Step>

  <Step title="結果を受け取る">
    リサーチが完了すると、ツール呼び出しを通じてリサーチ結果一式がアシスタントに返されます。

    * 文章でまとめた調査結果
    * その根拠となるソース
    * `outputSchema` を指定した場合は検証済みの JSON
    * 使用量とコスト

    アシスタントはこの結果一式をもとに返答を作成するため、出力をどう扱ってほしいかを伝えてください。調査結果の要約や比較、ファイルへの保存など、自由に指示できます。
  </Step>

  <Step title="時間がかかる場合は継続する">
    1 回の MCP 呼び出しで終わらないリサーチでも、失敗扱いにはなりません。実行が Exa 上で継続している間、ツールは `id` とともに `status: "running"` を返します。アシスタントはその `id` を `runId` に指定して `agent_run` を再度呼び出し、同じ実行を再開します。
  </Step>
</Steps>

<Accordion title="オプションの設定" icon="sliders-horizontal">
  | フィールド             | 用途                                                            |
  | ----------------- | ------------------------------------------------------------- |
  | `systemPrompt`    | リサーチ方法や結果の判断について、Agent に追加のガイダンスを与える                          |
  | `outputSchema`    | 回答を特定の JSON 形式で返す                                             |
  | `input.data`      | 手元にある行やエンティティを補完する                                            |
  | `input.exclusion` | 既知の結果を除外する                                                    |
  | `dataSources`     | [Exa Connect](/ja/docs/agent/connect/overview) プロバイダーを最大 5 つ追加する |
  | `previousRunId`   | 完了済みのリサーチをもとに新しいリクエストを作成する                                    |
  | `effort`          | Agent が行うリサーチの量を選択する                                          |
</Accordion>

<Tip>
  進行中の処理の完了を引き続き待つには `runId` を使用します。完了済みの処理をもとに新たなフォローアップを依頼するには `previousRunId` を使用します。
</Tip>

出力スキーマのパターン、effort モード、データソース、料金については、[Exa Agent ガイド](/ja/docs/agent/quickstart)を参照してください。

<div id="advanced-search">
  ## Advanced search
</div>

カテゴリやドメインの明示的なフィルター、日付範囲、テキスト制約、地域ターゲティング、クエリ拡張、要約、ハイライト、鮮度の制御、サブページのクロールが必要なリクエストには、`web_search_advanced_exa` を使用してください。通常の検索では引き続き `web_search_exa` を使用します。モデルに公開するツールが少なく、必要な設定も少なくて済みます。

Advanced Search に認証は不要ですが、認証済みの接続ではご自身のプランとレート制限が適用されます。デフォルトのツールとあわせて有効にするには、次のように設定します。

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

MCP ツールは、[Search API](/ja/docs/reference/search) の主要なオプションを、`includeDomains`、`startPublishedDate`、`enableHighlights`、`maxAgeHours` など、ツールから扱いやすいフィールドとして公開しています。正確なフィールド名は、お使いのクライアントでツールスキーマを参照してください。

<div id="troubleshooting">
  ## トラブルシューティング
</div>

<AccordionGroup>
  <Accordion title="レート制限エラー (429)">
    現在の接続では Exa の無料レート制限が適用されています。OAuth でサインインするか独自の API キーを追加してから再接続すると、リクエストにチームのプランと制限が適用されます。

    <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Accordion>

  <Accordion title="Agent が表示されない、または認証を求められる">
    `agent_run` はデフォルトでは有効になっておらず、無料レート制限では使用できません。`tools` URL パラメーターに追加したうえで、`?login` で接続するか API キーを設定してください。完全な URL については [Exa Agent](#exa-agent) を参照してください。
  </Accordion>

  <Accordion title="OAuth サインイン画面が開かない">
    クライアントが MCP OAuth に対応していることを確認し、`https://mcp.exa.ai/mcp?login` に接続してください。URL を変更した後はクライアントを再起動します。クライアントで MCP OAuth を完了できない場合は、代わりに API キーを使用してください。
  </Accordion>

  <Accordion title="ツールが表示されない">
    `tools` パラメーターを明示的に指定すると、デフォルトのツール一覧は置き換えられます。必要なツールがすべて URL に含まれていることを確認し、MCP クライアントを再起動してツール一覧を再取得させてください。
  </Accordion>

  <Accordion title="Claude Desktop が接続できない">
    組み込みのコネクタを使用してください。**+**(または **Add connectors**)→ **Connectors** タブ → **Exa** を検索 → **+** を選択します。
  </Accordion>

  <Accordion title="設定ファイルが見つからない">
    主な設定ファイルの場所:

    * Cursor: `~/.cursor/mcp.json`
    * fx: `~/.fx/mcp.json`
    * VS Code: `.vscode/mcp.json`(プロジェクトのルート)
    * Claude Desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
    * Claude Desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## リソース
</div>

<Columns cols={2}>
  <Card title="GitHub" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="ソースを表示" arrow="true">
    Exa MCP のソースコードです。
  </Card>

  <Card title="npm" icon="package" href="https://www.npmjs.com/package/exa-mcp-server" cta="パッケージを開く" arrow="true">
    npm パッケージで Exa MCP をローカル環境で実行できます。
  </Card>

  <Card title="エージェントスキル" icon="wrench" href="/ja/docs/get-started/agent-skills/overview" cta="スキルを見る" arrow="true">
    Exa MCP と組み合わせて使える、ポータブルなスキルです。
  </Card>

  <Card title="Codex と ChatGPT で Exa を使う" icon="messages-square" href="/ja/docs/integrations/chatgpt-codex" cta="ガイドを開く" arrow="true">
    Exa プラグインのセットアップ方法とワークフローを網羅したガイドです。
  </Card>
</Columns>