> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="agent-skills">
  # Agent Skills
</div>

> Claude Code、Codex などのコーディングエージェントに Exa のスキルをインストールします。

Exa のスキルを使うと、コーディングエージェントが検索やコンテンツの取得を行い、Exa の API を使って開発できるようになります。スキルはオープンソースの [exa-labs/agent-skills](https://github.com/exa-labs/agent-skills) リポジトリで公開されています。

各スキルは、オープンな [Agent Skills](https://agentskills.io) 標準に準拠した Markdown ファイルで構成されています。そのため、同じファイルを互換性のあるどのエージェントにもインストールできます。

<div id="install">
  ## インストール
</div>

Exa のすべてのスキルを一括でインストールします:

```bash theme={null}
npx skills add exa-labs/agent-skills
```

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

<Note>
  エージェントの環境変数 `EXA_API_KEY` にキーを設定してください。
</Note>

または、以下のスキルページを開き、セットアッププロンプトをコピーしてエージェントに貼り付けてください。このプロンプトによってスキルがインストールされ、API キーを出力することなく検証が行われます。

<div id="skills">
  ## スキル
</div>

各スキルのページには、1行の説明、コピーして使えるセットアッププロンプト、および `SKILL.md` の生ソースへのリンクが掲載されています。

<Columns cols={3}>
  <Card title="Exa で構築する" icon="rocket" href="/ja/docs/get-started/agent-skills/build-with-exa" cta="スキルを開く" arrow="true">
    Exa の API プラットフォーム全体を活用して、アプリケーションやエージェントを構築します。
  </Card>

  <Card title="Exa Search" icon="search" href="/ja/docs/get-started/agent-skills/exa-search" cta="スキルを開く" arrow="true">
    cURL または raw HTTP で Exa Search を直接呼び出します。
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/ja/docs/get-started/agent-skills/exa-contents" cta="スキルを開く" arrow="true">
    cURL または raw HTTP で Exa Contents を直接呼び出します。
  </Card>
</Columns>

<div id="related">
  ## 関連項目
</div>

<Columns cols={2}>
  <Card title="スキルリポジトリ" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="ソースを表示" arrow="true">
    すべてのスキルのソースコードです。未加工の `SKILL.md` ファイルも含まれます。
  </Card>

  <Card title="Exa MCP" icon="plug" href="/ja/docs/get-started/exa-mcp" cta="ガイドを開く" arrow="true">
    Claude、Cursor、VS Code などのクライアントを MCP 経由で Exa に接続できます。
  </Card>
</Columns>