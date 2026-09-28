> ## ドキュメントインデックス
>
> 完全なドキュメントインデックスは次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="truefoundry">
  # TrueFoundry
</div>

> Exa を TrueFoundry MCP Gateway に接続すると、アクセス制御、ツール管理、使用状況の監視を一元的に行えます。

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) は、アプリケーションと LLM プロバイダーや MCP サーバーの間に位置する、エンタープライズグレードのプロキシレイヤーです。1,000 を超える LLM への統一的なアクセスに加え、一元化されたオブザーバビリティとガバナンスを提供します。

TrueFoundry は、[MCP Gateway](https://www.truefoundry.com/mcp-gateway) で Exa を公式リモートサーバーとして提供しています。Exa MCP サーバーを接続すれば、Web 検索、コンテンツ取得、エージェント型リサーチを、チーム全体で単一のマネージドエンドポイントから利用できるようになります。

<Frame caption="TrueFoundry の公式リモート MCP サーバーカタログに掲載されている Exa">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="TrueFoundry の公式リモート MCP カタログ内の Exa サーバー" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

<div id="add-exa-to-truefoundry">
  ## TrueFoundry に Exa を追加する
</div>

1. TrueFoundry のサイドバーで **MCP Servers** を開き、**Add new MCP Server** を選択します。
2. **Connect Official Remote MCP Servers** を選択します。

<Frame caption="公式リモート MCP サーバーのカタログを選択する">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="Connect Official Remote MCP Servers が選択された TrueFoundry の Add MCP Server 選択画面" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. カタログで **Exa** を見つけ、**+ Add** を選択します。
4. あらかじめ入力されているサーバー情報を確認します。

| フィールド          | 値                                                                 |
| -------------- | ----------------------------------------------------------------- |
| Name           | `exa`                                                             |
| Description    | Search Engine made for AIs by Exa                                 |
| URL            | `https://mcp.exa.ai/mcp`                                          |
| Authentication | 任意 (MCP サーバーは認証なしで動作します。Exa API キーが必要になるのは、無料枠のレート制限に達した場合のみです。)  |

5. サーバーを管理または使用するユーザーやチームを追加します。**Auth Data** はオフのままにして、**Update MCP Server** を選択します。

<Frame caption="Exa サーバーと共同作業者を設定する">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="名前、URL、共同作業者、認証設定を含む Exa MCP サーバーの登録フォーム" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  **Tools** タブを開き、Exa の検索、コンテンツ取得、エージェント型リサーチの各ツールが利用できることを確認します。
</Check>

<div id="configure-the-exa-server">
  ## Exa サーバーを設定する
</div>

あらかじめ入力されている URL では、Exa のデフォルトのツールセットが公開されます。この URL を変更する必要があるのは、利用可能なツールを制限する場合や、独自の API キーを使用する場合のみです。

<div id="choose-which-tools-are-available">
  ### 利用可能なツールを選択する
</div>

`tools` クエリパラメーターに、ツール名をカンマ区切りで指定します。

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

URLはサーバーフォームに入力するか、**Apply using YAML** を使用して設定できます。

```yaml theme={null}
url: >-
  https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
name: exa
type: mcp-server/remote
description: Search Engine made for AIs by Exa
collaborators:
  - role_id: mcp-server-manager
    subject: user:you@your-company.com
```

<Tip>
  利用可能なツール名は、[Exa MCP ドキュメント](/ja/docs/get-started/exa-mcp)で確認できます。
</Tip>

<div id="use-your-exa-api-key-to-bypass-the-free-rate-limit">
  ### Exa API キーを使用して無料枠のレート制限を回避する
</div>

無料枠のレート制限に達した場合は、サーバー URL に Exa API キーを追加してください。

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

<div id="connect-an-mcp-client">
  ## MCP クライアントを接続する
</div>

Exa サーバーの **How To Use** タブを開き、使用するクライアントを選択します。TrueFoundry が、テナント固有のエンドポイントと、Cursor、Claude Code、VS Code、Windsurf、Codex などの MCP クライアント向けにそのまま貼り付けて使える設定を生成します。

<Frame caption="MCP クライアント用の設定をコピーする">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="TrueFoundry に表示される、Exa MCP サーバーのクライアント別セットアップ手順" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

<div id="test-a-tool">
  ## ツールをテストする
</div>

Exa のツールの横にある **Try** を選択し、入力値を指定してから **Execute Tool** を選択します。プレイグラウンドに JSON レスポンスが表示されるので、エージェントで使用する前にツールの動作を確認できます。

<Frame caption="TrueFoundry のプレイグラウンドで Exa のツールを実行する">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="TrueFoundry のツールプレイグラウンドで Exa のツールをテストしている様子" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

<div id="manage-and-monitor-tools">
  ## ツールの管理と監視
</div>

* ツールを個別にオン/オフして、MCP クライアントが呼び出せるツールを制御します
* **Tool Metrics** でトラフィック、レイテンシ、エラーを確認します
* OpenTelemetry を使用して、呼び出しトレースをオブザーバビリティ基盤にエクスポートします

<Frame caption="MCP クライアントに公開する Exa ツールの管理">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="TrueFoundry MCP サーバーで利用可能な Exa ツール" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

<div id="resources">
  ## リソース
</div>

<Columns cols={3}>
  <Card title="TrueFoundry セットアップガイド" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="ガイドを開く" arrow="true">
    TrueFoundry が提供する Exa MCP サーバーのガイドを参照してください。
  </Card>

  <Card title="Exa MCP ドキュメント" icon="search" href="/ja/docs/get-started/exa-mcp" cta="ガイドを開く" arrow="true">
    Exa のツール、設定、使用例を確認できます。
  </Card>

  <Card title="Exa MCP サーバー" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="ソースを表示" arrow="true">
    GitHub でサーバーのソースコードとリリースを確認できます。
  </Card>
</Columns>