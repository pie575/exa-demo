> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Claude向けEnterprise Managed Auth {#enterprise-managed-auth-for-claude}

> Enterprise Managed Auth(EMA)を設定して、Okta Cross App Access(XAA)などのID プロバイダー経由でClaudeがExa MCPに接続できるようにします。

デフォルトでは、各メンバーがOAuthでExaに一度サインインし、Claudeで[Exaコネクタ](/ja/docs/get-started/exa-mcp)を接続します。**Enterprise Managed Auth(EMA)** を使用すると、この手順が不要になり、Oktaを通じてバックグラウンドでアクセスが付与されます。Exaのログイン画面や同意のプロンプトは表示されず、APIキーを配布する必要もありません。

アクセス権はディレクトリの設定に連動します。Oktaでユーザーのプロビジョニングを解除すると、そのユーザーがClaude経由でExaにアクセスすることもできなくなります。EMAは、MCPの[enterprise managed authorization拡張機能](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization)に基づいています。

## 始める前に {#before-you-start}

* ID プロバイダー (IdP) が接続された Claude の Team または Enterprise の組織と、その組織の管理者アクセス権。
* SSO とディレクトリ同期が設定された Exa の**組織** (個人用のチームは不可) と、その組織の管理者アクセス権。
* ID プロバイダーとして Okta を使用し、Okta Identity Engine 上で [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm) が有効になっていること、およびテナントの Super Admin アクセス権。現在サポートされている ID プロバイダーは Okta のみです。

## 必要なExaの設定値 {#exa-values-youll-need}

| 項目                     | 値                        |
| ---------------------- | ------------------------ |
| Issuer URL(Exaの認可サーバー) | `https://auth.exa.ai`    |
| Resource / MCPサーバーのURL | `https://mcp.exa.ai/mcp` |
| スコープ                   | `mcp:tools`              |

## EMA をセットアップする {#set-up-ema}

<Steps>
  <Step title="Exa でメンバーをプロビジョニングする">
    コネクタを使用するすべてのメンバーは、事前に Exa に登録され、Exa organization 内のチームに所属している必要があります。また、Okta がアサートするメールアドレスと同じアドレスを使用し、そのドメインが organization で検証済みである必要があります。EMA がアカウントを作成することはありません。ディレクトリ同期を使用するか、[メンバーをチームに招待](/ja/docs/admin/team-management)してください。
  </Step>

  <Step title="Exa に ID プロバイダーを登録する">
    Exa ダッシュボードで [Organization](https://dashboard.exa.ai/organization) を開き、**Enterprise-managed auth (Claude MCP)** の **Register identity provider** をクリックします。Okta の SSO / アプリ埋め込み URL (`https://your-org.okta.com/app/.../sso/saml`) を貼り付けます。URL は登録時に Exa によって検証されます。

    登録は、プロビジョニング済みのメンバーが初めて Okta 経由で Claude の接続に成功するまで **Pending verification** のままとなり、その後自動的に **Active** に切り替わります。追加の操作は不要です。Exa が代わりに設定した issuer は **Managed by Exa** と表示されます。これらを変更する場合はサポートにお問い合わせください。Exa が URL を認識しない場合は、[support@exa.ai](mailto:support@exa.ai) までご連絡ください。
  </Step>

  <Step title="Okta で Cross App Access を設定する">
    [Claude EMA 向けの Okta の Cross App Access ガイド](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide)に従って設定します。Exa 固有の手順は次のとおりです。

    1. Okta 管理コンソールで Exa アプリケーションを開き、**Resource Server** に移動して XAA を有効にし、Resource URL と Issuer URL を `https://auth.exa.ai` に設定します。Audience/tenant ID は空欄のままにします。
    2. Exa アプリがカスタム SAML アプリの場合は、**Name ID Format** が `EmailAddress` になっていることを確認してください。Exa はアサートされたメールアドレスをもとにメンバーの Exa アカウントを照合します。
    3. **Directory → AI Agents** で Claude AI Agent を登録し、Anthropic から提供された公開鍵を追加します。続いて Claude アプリを委任呼び出し元として追加し、Anthropic から提供された Client ID を使用して Exa を **Resource Connection** として追加します。
  </Step>

  <Step title="Claude で管理型認可を有効にする">
    Claude で **Organization settings → Connectors** に移動し、Exa コネクタを選択して、**Configuration** タブで Managed authorization の横にある **Set up** をクリックします。IdP 接続を確認してテストを実行し、コネクタを継承するロールを選択して保存します。ロールとスコープのオプションについては、[Anthropic の管理者ガイド](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization)を参照してください。
  </Step>
</Steps>

メンバーは次回サインイン時からコネクタを利用できます。管理型認可と併せて、ブラウザでのサインインを有効にしておくことも可能です。Claude はまず管理型認可を試し、失敗した場合は通常の OAuth ログインにフォールバックします。

<Note>
  Claude 経由の使用量は、チームで実行する他の処理と同様に、メンバーの Exa チームに対し、そのチームのプランとレート制限に基づいて請求されます。
</Note>

## アクセスの取り消し {#revoking-access}

* **特定のメンバー:** Okta でそのメンバーを削除するか、Exa でそのメンバーをチームから外します。いずれの方法でも、Claude 経由のアクセスは無効になります。
* **全員:** Organization ページで issuer を削除するか、Claude で管理型認可をオフにします。新規接続は直ちにブロックされ、すでに開いているセッションもその後まもなく終了します。issuer はいつでも再登録できます。

## トラブルシューティング {#troubleshooting}

<AccordionGroup>
  <Accordion title="一部のメンバーでは動作するが、他のメンバーでは動作しない">
    失敗しているメンバーを Exa 側で特定できていません。そのメンバーが Okta がアサートするメールアドレスと完全に一致する形で Exa に存在していること、そのメールアドレスが組織で検証済みのドメインに属していること、そしてその組織内のいずれかのチームに所属していることを確認してください。原因の多くは、ディレクトリ同期のグループマッピングです。
  </Accordion>

  <Accordion title="誰も利用できない">
    Organization ページで issuer のステータスを確認してください。**Pending verification** のままであれば、まだ一度も接続に成功していません。主な原因は、Okta の設定が完了していない、Exa アプリの Issuer URL が `https://auth.exa.ai` と一致していない、接続を試みたメンバーが Exa にプロビジョニングされていない、のいずれかです。問題を修正したうえで、プロビジョニング済みのメンバーとして再度接続してください。
  </Accordion>

  <Accordion title="登録時に ID プロバイダーが既に登録済みと表示される">
    1 つの issuer が属することができる Exa 組織は 1 つだけです。Organization ページに表示されていない場合は、[support@exa.ai](mailto:support@exa.ai) までお問い合わせください。
  </Accordion>
</AccordionGroup>

<Note>
  その他の問題については、Exa 組織名、影響を受けたメンバーのメールアドレス、試行したおおよその日時を添えて [support@exa.ai](mailto:support@exa.ai) までお問い合わせください。
</Note>