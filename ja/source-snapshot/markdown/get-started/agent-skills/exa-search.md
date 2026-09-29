> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 個別のページを参照する前に、このファイルで利用可能なすべてのページを確認してください。

<div id="exa-search-skill">
  # Exa Search スキル
</div>

> Exa Search を使うと、関連するウェブページを検索し、統合されたコンテンツを 2 秒未満で返せます。

このスキルを使って、cURL または raw HTTP で Exa Search を呼び出す方法をベストプラクティスとともにエージェントに教えましょう。

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

<Note>
  エージェントの環境で、キーを `EXA_API_KEY` として設定してください。
</Note>

<div id="setup">
  ## セットアップ
</div>

**オプション A：このスキルを直接インストールする：**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-search"
```

**オプション B: 次のプロンプトをコーディングエージェントに貼り付けます。**

次のプロンプトを使うと、スキルがインストールされ、API キーを画面に出力せずに検証できます。

```text Copy this setup prompt into your agent theme={null}
このマシンに Exa の exa-search エージェントスキルをセットアップしてください。

目的:
- exa-search スキルをインストールし、私のコーディングエージェントが cURL または raw HTTP で Exa Search を直接呼び出せるようにする。
- キーを一度も露出・出力させず、このチャットに貼り付けることもなく、Exa API キーを使える状態にする。

対象エージェント:
- Claude Code、Codex、Cursor、または Agent Skills に対応した任意のエージェント
- グローバルのインストール先ディレクトリ: ~/.claude/skills (Claude Code)、~/.codex/skills (Codex)、~/.agents/skills (Cursor / その他)
- プロジェクトローカルのインストール先ディレクトリ: .claude/skills (Claude Code)、.agents/skills (Codex / Cursor / その他)

スキルの取得元:
- SKILL.md URL: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md

手順:
1. キーの設定より前に、まずスキルをインストールしてください。リポジトリ内で作業している場合はプロジェクトローカルへのインストールを優先し、それ以外の場合は上記の該当するグローバルディレクトリを使用してください。選択したスキルディレクトリを作成し、スキルをダウンロードします:
   mkdir -p <skills-dir>/exa-search && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" -o <skills-dir>/exa-search/SKILL.md
   続いて、<skills-dir>/exa-search/SKILL.md が存在することを確認してください。
2. Exa API キーがすでに利用可能かどうかを、あなた自身がコマンドを実行する環境から確認してください。私に echo を頼むのではなく、スキルの実行に使うのと同じツール/シェルで確認してください。スキルはまず EXA_API_KEY からキーを解決し、次にファイル ~/.config/exa/key から解決するため、値を一切出力せずに両方を確認してください:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   あなたのシェルはおそらく非対話型で、~/.zshrc や ~/.bashrc などの対話型プロファイルを自動では source しません。そのため、私がそこで設定したキーは、私の側では存在していても、あなたの側では空に見えることがあります。どちらも表示されない場合でも、あなたのシェルが読み込まない対話型プロファイルにキーが設定されている可能性があります。`grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` を使い、値を出力せずに該当ファイルを特定してください (ファイル名のみが表示されます。`export EXA_API_KEY=...` の行からシークレットがチャットに漏洩するおそれがあるため、プロファイルに対して単純な `grep`/`cat`/`echo` は絶対に実行しないでください)。次に、コマンド内でそのファイルを `source` し、上記の存在確認を再実行してください。表示された場合は、以降キーを必要とするすべてのコマンドの先頭に同じ `source ...;` を付けてください。
3. どこからもキーを解決できない場合に限り、シェルプロファイルを手動で編集せず、このチャットにキーを貼り付けることもなく、キーを設定してください。https://dashboard.exa.ai/api-keys でキーを作成/コピーし、私自身のターミナルで EXA_API_KEY を export するか、モード 600 で ~/.config/exa/key に書き込むよう私に指示してください。チャットにキーを貼り付けるよう求めることは絶対にしないでください。その後、私が完了を伝えるまで待ってから続行してください。
4. あなた自身のシェルからキーのスモークテストを行ってください。環境変数またはファイルからキーを解決し、ステータスコードのみを出力します:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   エンドポイント、ヘッダー、ボディは記載どおりのまま変更しないでください (スキーマを推測しないこと)。401/429 ではなく 200 が返ることを確認してください。手順 2 で環境変数のキーを参照するために `source ...;` を前置する必要があった場合は、ここでも同様に付けてください。
5. エージェントがスキルを認識できるよう、エージェントを再起動または再スキャンする方法を教えてください。

全体を通じた厳守事項: キーはシークレットです。確認は存在/長さのチェック (`${EXA_API_KEY:+set}`、`[ -s ~/.config/exa/key ]`) または HTTP ステータスコードでのみ行ってください。キーを含む可能性のあるファイルや変数を出力したり、`echo`、`cat`、出力を伴う `grep` で表示したりすることは絶対にせず、正規表現でキーファイルを「マスク」しようとすることもしないでください。キーが露出した場合は、https://dashboard.exa.ai/api-keys でキーをローテーションするよう私に伝えてください。
```

<div id="view-source">
  ## ソースを表示
</div>

<Card title="exa-search/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" cta="ソースを表示" arrow="true">
  インストールする前に、exa-search スキルの定義をご確認ください。
</Card>

<div id="related">
  ## 関連項目
</div>

<Columns cols={2}>
  <Card title="すべてのエージェントスキル" icon="layers" href="/ja/docs/get-started/agent-skills/overview" cta="スキル一覧を見る" arrow="true">
    Exa のすべてのスキルを確認し、まとめてインストールできます。
  </Card>

  <Card title="スキルのリポジトリ" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="ソースを表示" arrow="true">
    全スキルのソースコードです。`SKILL.md` ファイルの原本も含まれます。
  </Card>
</Columns>