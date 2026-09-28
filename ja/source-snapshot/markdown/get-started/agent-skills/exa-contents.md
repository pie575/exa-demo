> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Exa Contents スキル {#exa-contents-skill}

> URL がすでに手元にある場合は、Exa Contents でページコンテンツを抽出できます。

このスキルを使うと、cURL または raw HTTP で Exa Contents を呼び出す方法を、ベストプラクティスに沿ってエージェントに習得させることができます。

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

<Note>
  エージェントの環境で、キーを `EXA_API_KEY` として設定してください。
</Note>

## セットアップ {#setup}

**オプション A：このスキルを直接インストールする：**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-contents"
```

**オプション B: 次のプロンプトをコーディングエージェントに貼り付けます。**

次のプロンプトを使うと、スキルをインストールし、API キーを表示せずに検証できます。

```text Copy this setup prompt into your agent theme={null}
このマシンに Exa の exa-contents エージェントスキルをセットアップしてください。

目的:
- exa-contents スキルをインストールし、私のコーディングエージェントが cURL または raw HTTP で Exa Contents を直接呼び出せるようにする。
- キーをこのチャットで公開、出力、貼り付けすることは一切せずに、Exa API キーを使える状態にする。

対象エージェント:
- Claude Code、Codex、Cursor、または Agent Skills 対応の任意のエージェント
- グローバルのインストール先ディレクトリ: ~/.claude/skills (Claude Code)、~/.codex/skills (Codex)、~/.agents/skills (Cursor / その他)
- プロジェクトローカルのインストール先ディレクトリ: .claude/skills (Claude Code)、.agents/skills (Codex / Cursor / その他)

スキルのソース:
- SKILL.md URL: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

手順:
1. キーを設定する前に、まずスキルをインストールしてください。リポジトリ内で作業している場合はプロジェクトローカルへのインストールを優先し、それ以外の場合は上記の該当するグローバルディレクトリを使用してください。選択したスキルディレクトリを作成し、スキルをダウンロードします:
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   その後、<skills-dir>/exa-contents/SKILL.md が存在することを確認してください。
2. Exa API キーがすでに利用可能かどうかを、あなた自身のコマンド実行環境で確認してください。私に echo を頼むのではなく、スキルの実行に使うのと同じツール/シェルで確認してください。スキルはまず EXA_API_KEY を、次にファイル ~/.config/exa/key を参照してキーを取得するため、値を一切出力せずに両方を確認してください:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   あなたのシェルはおそらく非対話型で、~/.zshrc や ~/.bashrc などの対話型プロファイルを自動では読み込みません。そのため、私がそこに設定したキーは、私からは見えていても、あなたからは空に見えることがあります。どちらも表示されない場合でも、シェルが読み込まない対話型プロファイルにキーが設定されている可能性があります。`grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` を使って、値を出力せずにどのファイルかを特定してください (ファイル名のみが表示されます。`export EXA_API_KEY=...` の行からシークレットがチャットに漏えいするため、プロファイルに対して単純な `grep`/`cat`/`echo` は絶対に実行しないでください)。次に、コマンド内でそのファイルを `source` し、上記の存在確認を再実行してください。表示された場合は、以降キーを必要とするすべてのコマンドの先頭に同じ `source ...;` を付けてください。
3. どこからもキーを取得できない場合に限り、シェルプロファイルを手動で編集せず、キーをこのチャットに貼り付けることもなく設定してください。https://dashboard.exa.ai/api-keys でキーを作成/コピーし、私自身のターミナルで EXA_API_KEY を export するか、モード 600 で ~/.config/exa/key に書き込むよう私に伝えてください。キーをチャットに貼り付けるよう求めることは絶対にしないでください。その後、私が完了を伝えるまで待ってから続行してください。
4. あなた自身のシェルでキーのスモークテストを行ってください。環境変数またはファイルからキーを取得し、ステータスコードのみを出力します:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   エンドポイント、ヘッダー、ボディは記載どおりのまま変更しないでください (スキーマを推測しないでください)。401/429 ではなく 200 が返ってくれば成功です。手順 2 で環境変数のキーを参照するために `source ...;` を付ける必要があった場合は、ここでも先頭に付けてください。
5. エージェントがスキルを認識できるよう、エージェントを再起動または再スキャンする方法を教えてください。

全体を通じた厳守事項: キーはシークレットです。キーの確認は、存在/長さのチェック (`${EXA_API_KEY:+set}`、`[ -s ~/.config/exa/key ]`) または HTTP ステータスコードでのみ行ってください。キーを含む可能性のあるファイルや変数を、出力、`echo`、`cat`、または出力を伴う `grep` で表示することは絶対にせず、正規表現でキーファイルを「秘匿化」しようとすることも絶対にしないでください。万一キーが漏えいした場合は、https://dashboard.exa.ai/api-keys でローテーションするよう私に伝えてください。
```

## ソースを表示 {#view-source}

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="ソースを表示" arrow="true">
  インストール前に exa-contents スキルの定義を確認してください。
</Card>

## 関連情報 {#related}

<Columns cols={2}>
  <Card title="すべてのエージェントスキル" icon="layers" href="/ja/docs/get-started/agent-skills/overview" cta="スキルを見る" arrow="true">
    Exa のすべてのスキルを確認し、まとめてインストールできます。
  </Card>

  <Card title="スキルのリポジトリ" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="ソースを表示" arrow="true">
    すべてのスキルのソースコードです。未加工の `SKILL.md` ファイルも含まれます。
  </Card>
</Columns>