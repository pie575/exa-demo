> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Claude Code、Web、Desktop で Exa を使う {#exa-in-claude-code-web-and-desktop}

> Claude から直接 Exa でウェブを検索し、あらゆるページを読み取れます

Claude Code に Exa をインストールするか、Claude Web、Desktop、Cowork に接続すると、Claude がウェブ上の最新情報にアクセスできるようになります。Claude は自然言語で検索し、必要なページを読み取り、それらのソースを活用しながら作業を進めます。

## Exa をインストールする {#install-exa}

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web, Desktop & Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="コネクタディレクトリを開く">
          Claude で新しいチャットを開き、プラスボタンから **Add connector** を選択して、**Exa** を検索します。
        </Step>

        <Step title="Exa を接続する">
          Exa を開いて **Connect to Claude** を選択し、確認画面が表示されたらアクセスを承認します。

          <Frame caption="Claude でコネクタディレクトリを開き、Exa を見つけて接続し、アクセスを承認する様子">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Claude でコネクタディレクトリを開き、Exa を見つけて接続し、アクセスを承認する様子" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Exa を使う">
          新しいチャットを開始し、Web 上の最新情報が必要な質問をしてみましょう。
        </Step>
      </Steps>
    </Tab>

    <Tab title="Claude Code CLI" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude-code.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=f7f017b187974c56e5822d7baf8272fa" width="16" height="16" data-path="images/mcp-clients/claude-code.svg">
      <Steps>
        <Step title="プラグインをインストールする">
          ターミナルから Exa をインストールします。

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Claude Code で `/plugin` と入力し、**Exa** を検索してインストールすることもできます。
        </Step>

        <Step title="新しいセッションを開始する">
          新しい Claude Code セッションを開いてプラグインを読み込み、Web 検索が必要な質問をしてみましょう。

          <Frame caption="新しい Claude Code セッションを開き、Web 検索が必要な質問をする様子">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="新しい Claude Code セッションを開き、Web 検索が必要な質問をする様子" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

どちらの方法でも、MCP 設定ファイルを編集することなく Exa を利用できます。

## Web上の最新情報を活用する {#work-with-whats-on-the-web-right-now}

Claude Codeでは、リポジトリでの作業中にExaで最新のドキュメント、issue、変更履歴、実際のコード例を検索できます。同じインテグレーションにより、Claude Web、Desktop、Coworkでも、最新ニュース、リサーチ、企業情報、製品の詳細など、まだコンテキストに含まれていない可能性のある情報源を利用できます。

```text theme={null}
現在 Tailwind v3 を使っています。Exa で公式の Tailwind v4
アップグレードガイドを探して読み、このプロジェクトを v4 に移行してください。
```

Claude Code は、見つけた情報をもとにコードベースに変更を加えることができます。その他の Claude クライアントでは、同じソースを回答、アーティファクト、Cowork タスクに活用できます。

回答が最新のウェブソースや特定のウェブソースに左右される場合は、いつでも同じ方法が使えます。

* &quot;この依存関係の最新リリースノートを探して、破壊的変更を要約して。&quot;
* &quot;推論時スケーリングに関する最近の一次リサーチを検索して、各手法を比較して。&quot;
* &quot;Stripe の webhook に関する最新のドキュメントを読んで、推奨されるリトライ動作を説明して。&quot;
* &quot;これらの製品の公式料金ページを探して、エントリープランを比較して。&quot;

## 検索、読み取り、リサーチ {#search-read-and-research}

Exa インテグレーションを使うと、Claude はウェブの検索や読み取りを行うツールを利用できます。これらのツールを組み合わせることで、より長いリサーチタスクにも対応できます。

<Columns cols={3}>
  <Card title="検索" icon="search">
    自然言語で検索し、リンクの一覧だけでなく、関連するページコンテンツも取得できます。
  </Card>

  <Card title="読み取り" icon="file-text">
    ドキュメント、リサーチ資料、変更履歴、Issue、記事など、指定したページを読み取ります。
  </Card>

  <Card title="リサーチ" icon="compass">
    複数の検索を実行して有用なページを確認し、得られた根拠をまとめて出典付きのレスポンスを作成します。
  </Card>
</Columns>

## Claude 上でそのままリサーチする {#research-without-leaving-claude}

求める結果を依頼し、重視すべき情報源の種類を Claude に伝えます。

```text theme={null}
主要なオープンソースのベクトルデータベースについて、マネージドサービス、
ライセンス、料金を比較してください。最新の一次情報源を使い、出典を明記してください。
```

Claude は会話の中でいつでも Exa を使って、タスクに必要な情報源を検索し、読み込むことができます。技術リサーチ、競合分析、市場マッピング、企業リサーチをはじめ、答えがウェブ上に散らばっているあらゆる問いに活用してください。

## Cowork で Exa を使う {#use-exa-in-cowork}

同じコネクタは Cowork でも利用できます。外部の情報が必要なタスクを Claude に依頼すると、Claude はファイルや接続済みの他のツールを使って作業しながら、Web を検索したりページを読み取ったりできます。

```text theme={null}
この競合分析資料を確認し、価格に関する記載をすべて Exa で各ベンダーの
最新のページと照合したうえで、引用を付けて資料を更新してください。
```

## MCP を直接使いたい場合 {#prefer-mcp-directly}

Claude を手動で設定する場合や、他の MCP クライアントを使用する場合は、Exa がホストする MCP サーバーに直接接続できます。

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

その他のクライアント、設定オプション、利用可能なツールについては、[Exa MCP](/ja/docs/get-started/exa-mcp) を参照してください。

<Card title="Exa コネクタを開く" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Claude のコネクタディレクトリから Exa を追加します。
</Card>