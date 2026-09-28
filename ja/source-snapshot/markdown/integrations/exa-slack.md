> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳細を確認する前に、このファイルで利用可能なすべてのページを把握してください。

# Exa in Slack {#exa-in-slack}

> Slack に Exa をインストールし、任意のチャンネルやスレッドで @Exa をメンションすると、リサーチ、リスト作成、エンリッチメントについて出典付きの回答を得られます。

Exa をチームの Slack に導入しましょう。任意のチャンネルやスレッドで **@Exa** をメンションし、リサーチに関する質問、リスト作成タスク、エンリッチメントのリクエストを送ります。Exa が Web を検索して情報源を読み込み、出典付きの回答をスレッド内で返します。

## 利用を開始する {#get-started}

### インストール {#installation}

1. [Dashboard &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack) に移動し、**Install** をクリックします。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="Exa ダッシュボードの Exa in Slack ページと Install ボタン" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. Slack の OAuth フローが開きます。Exa を追加するワークスペースを選択し、**Allow** をクリックします。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="Exa app の Slack OAuth 承認画面。&#x22;App is not approved by Slack&#x22; の通知、ワークスペースの選択欄、要求される権限、Allow ボタンが表示されている" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  赤色の **&quot;App is not approved by Slack&quot;** という通知が表示されますが、これは想定どおりの動作であり、無視して問題ありません。
  Exa が公開の Slack Marketplace に掲載されていないことを示しているだけで、不具合ではありません。
</Note>

3. インストールが完了したら、@Exa をチャンネルに招待する (または直接 DM を送る) だけで、すぐに質問を始められます。

## Slack から Exa を使う方法 {#how-to-use-exa-from-slack}

Exa を追加したチャンネルで、@Exa をメンションして質問します。

```text theme={null}
@Exa サンフランシスコにあるシリーズAのフィンテックスタートアップをすべて探して
```

Exa が質問にスレッドで返信します。

### フォローアップ {#follow-ups}

Exa がスレッド内で回答したら、そのスレッドに返信するだけで会話を続けられます。改めて @Exa をメンションする必要はありません。Exa は会話の内容を記憶しているため、フォローアップでは前の回答を踏まえて応答します。スレッドに参加していれば、誰でもフォローアップできます。

### ダイレクトメッセージ {#direct-messages}

DM で Exa に直接メッセージを送ることもできます。DM ではメンションは一切不要です。送信したメッセージはそれぞれ新しいリクエストとして扱われ、そのメッセージのスレッドに回答が返されます。会話を続けるには、そのスレッド内で返信してください。

### 実行のキャンセル {#cancelling-a-run}

実行中にキャンセルしたい場合は、スレッドに返信して Exa に実行の停止を依頼してください。メンションは不要です。

```text theme={null}
現在の実行を停止してください
```

### Exa Connect のプロバイダー {#exa-connect-providers}

Exa は、質問に関連する [Exa Connect](/ja/docs/agent/connect/overview) のデータプロバイダーを自動的に利用します。特定のプロバイダーを使いたい場合は、メッセージ内でそのプロバイダー名を指定してください。

```text theme={null}
@Exa Fiber.ai を使って、今四半期に資金調達した AI インフラ系スタートアップをすべて探して
```

利用可能なデータプロバイダーの一覧は、Exa に尋ねればすぐに確認できます。

## 使用例 {#examples}

### ニュースと時事 {#news-and-current-events}

あらゆる話題の最新情報を入手できます。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Slack のスレッドで、あるトピックの最新ニュースに関する質問に Exa が回答し、日付付きの結果を表にまとめて示している様子" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

### 大規模なリスト作成 {#large-list-building}

網羅的なリストを作成するには、リクエストの先頭に `!max` を付けます。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Slack のスレッドで Exa が !max のリスト作成リクエストを実行し、結果を表形式で返している様子" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

## キーワード {#keywords}

Exa が参加しているスレッド内で使用します。コマンドは `@Exa` メンションの後に続けても、メッセージの先頭に直接記述してもかまいません。

| キーワード             | 機能                                                             |
| ----------------- | -------------------------------------------------------------- |
| `!max <message>`  | このリクエストを最大の effort で実行します。非常に大規模なリストの作成を想定しています。               |
| `mute`            | スレッド内のメンションなしの返信に Exa が応答しないようにします。明示的な @Exa メンションには引き続き応答します。 |
| `unmute`          | `mute` で停止したスレッド内のフォローアップへの応答を再開します。                           |
| `sleep`           | スレッド内での Exa の動作を完全に停止します。再開するには @Exa をメンションしてください。             |
| `aside <message>` | Exa に無視させるサイドコメントを投稿します。Exa が追跡しているスレッドでチームメンバーと会話したいときに便利です。  |
| `help`            | 使い方を表示します。                                                     |

## 権限 {#permissions}

Slack 向け Exa アプリは、次のスコープを要求します。

| 権限                     | Slack でのアクセス                   | Exa が必要とする理由                                                    |
| ---------------------- | ------------------------------ | --------------------------------------------------------------- |
| `app_mentions:read`    | @Exa を直接メンションしたメッセージの閲覧        | チャンネルまたはスレッドで Exa がメンションされたときにリクエストを開始する                        |
| `assistant:write`      | Slack で App Agent として動作        | Slack のエージェント機能を利用し、DM やチャンネルのスレッドに回答をストリーミングする                 |
| `channels:history`     | Exa が追加されたパブリックチャンネルのメッセージの閲覧  | パブリックチャンネルのスレッド返信を受信し、再度メンションしなくてもフォローアップできるようにする               |
| `channels:read`        | パブリックチャンネルの基本情報の閲覧             | Web セッションの同期先を選択する際に、Exa がすでに参加しているパブリックチャンネルを見つける              |
| `chat:write`           | Exa アプリとしてのメッセージ送信             | スレッドの起点メッセージ、回答、進捗状況、確認メッセージ、Web から同期されたメッセージを投稿する              |
| `chat:write.customize` | アプリが投稿するメッセージの名前とアバターのカスタマイズ   | Web アプリから同期されたメッセージに、Web 参加者の名前とプロフィール画像を表示する                   |
| `files:read`           | Exa が追加された会話で共有されたファイルの閲覧      | 質問に添付されたファイルを読み取る                                               |
| `files:write`          | Exa アプリとしてのファイルのアップロード、編集、削除   | エクスポートした表などの結果ファイルを回答に添付する                                      |
| `groups:history`       | Exa が追加されたプライベートチャンネルのメッセージの閲覧 | プライベートチャンネルのスレッド返信を受信し、再度メンションしなくてもフォローアップできるようにする              |
| `groups:read`          | Exa が追加されたプライベートチャンネルの基本情報の閲覧  | Web セッションの同期先を選択する際に、選択可能なプライベートチャンネルを見つけ、メンバーシップを確認する          |
| `im:history`           | Exa とのダイレクトメッセージの閲覧            | DM でのリクエストとフォローアップの返信を受信する                                      |
| `im:write`             | ダイレクトメッセージの開始                  | 確認済みユーザーが Web セッションの同期先として Exa との DM を選択した際に、その DM を開く          |
| `users:read`           | ユーザーとその基本的な Slack プロフィールの閲覧    | メンションをユーザー名に変換し、同期されたメッセージで Web 参加者の Slack プロフィール画像を使用する        |
| `users:read.email`     | ワークスペースメンバーのメールアドレスの閲覧         | Slack と Exa のアカウントを照合し、チームへの紐付けや Web メッセージのプロフィール画像のカスタマイズに使用する |

<Note>
  `channels:read`、`groups:read`、`im:write` により、Web から Slack への同期で同期先を検出できるようになります。
  既存のインストールでは、これらのスコープがなくても現在の Slack スレッドを引き続き使用できますが、
  該当する同期先を使用するには再接続が必要です。`chat:write.customize` は実行時には
  任意です。このスコープがない場合、Web から同期されたメッセージは標準の Exa アプリとして表示され、
  メッセージ本文に参加者の名前が含まれます。
</Note>

Exa がメッセージを受信するのは、明示的に招待されたチャンネルと Exa との DM のみです。

## 料金 {#pricing}

Slack から開始した実行は、お使いの Exa チームに課金されます。詳細は[料金ページ](https://exa.ai/pricing)をご覧ください。

## プライバシー {#privacy}

Exa によるデータの取り扱いについて詳しくは、[Exa のプライバシーポリシー](https://exa.ai/privacy-policy)をご覧ください。