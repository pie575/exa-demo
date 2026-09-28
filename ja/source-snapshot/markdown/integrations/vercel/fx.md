> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# fx by Vercel Labs {#fx-by-vercel-labs}

> ホスト型の Exa MCP サーバーを使って、Vercel Labs のネイティブなコーディングエージェントである fx に Exa ウェブ検索を追加します。

[fx](https://fx.sh) は、Vercel Labs が提供するネイティブなコーディングエージェント兼 CLI で、MCP クライアントとしても動作します。Exa のホスト型 MCP サーバーを追加すると、fx でリアルタイムのウェブ検索とページの読み取りが行えるようになります。

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/vercel/fx/install-exa.gif?s=2e331148abdf5bdf083e6f651e3b8b75" alt="fx をインストールし、/mcp add で Exa MCP サーバーを追加して、リアルタイムの Exa ウェブ検索を実行する様子" style={{width: "100%", height: "auto"}} width="800" height="393" data-path="images/integrations/vercel/fx/install-exa.gif" />
</Frame>

## インストール {#installation}

<Steps>
  <Step title="fx をインストールする">
    ```bash theme={null}
    curl -fsSL https://fx.sh/setup.sh | bash
    ```

    続いて、`fx login` でサインインします。利用できるプロバイダーについては [fx のドキュメント](https://fx.sh/docs)を参照してください。
  </Step>

  <Step title="Exa を追加する">
    `fx` を実行して fx を起動し、対話型シェルから Exa MCP サーバーを追加します。

    ```text theme={null}
    /mcp add --transport http exa https://mcp.exa.ai/mcp
    ```

    サーバーの設定は `~/.fx/mcp.json` に保存され、MCP が再読み込みされます。
  </Step>

  <Step title="接続を確認する">
    ```text theme={null}
    /mcp list
    ```
  </Step>
</Steps>

## 手動で設定する {#configure-by-hand}

fx は `~/.fx/mcp.json` からのみ MCP サーバーを読み込むため、このファイルに Exa を直接追加することもできます。

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp"
    }
  }
}
```

fx を再起動せずに変更を反映するには、`/mcp reload` を実行します。

ちょっとした利用であれば無料プランで十分です。レート制限を緩和するには、API キーを作成して設定に追加します。

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
</Card>

```json ~/.fx/mcp.json theme={null}
{
  "mcp": {
    "exa": {
      "type": "http",
      "url": "https://mcp.exa.ai/mcp",
      "header_env": {
        "x-api-key": "EXA_API_KEY"
      }
    }
  }
}
```

`header_env` はヘッダー名を環境変数に対応付けます。これにより、キーを設定ファイルに直接記述せずに済みます。

## ツールの検出 {#tool-discovery}

fx は MCP ツールを遅延検出します。サーバーのツールは、ターンで必要になるまでモデルのコンテキストに読み込まれません。そのため、Exa を追加しても、ウェブ検索を行わないターンでは追加のコストは発生しません。

<Card title="Exa MCP" icon="plug" href="/ja/docs/get-started/exa-mcp" cta="ガイドを開く" arrow="true">
  利用可能なツール、設定オプション、その他のクライアントを確認できます。
</Card>