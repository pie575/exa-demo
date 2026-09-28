> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは次のURLから取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="security-overview">
  # セキュリティの概要
</div>

> Exa のセキュリティ、コンプライアンス、および地域ごとのアクセスに関する情報です。

***

Exa はデータのセキュリティとプライバシーを重視しています。Exa は SOC 2 Type II 認証を取得しており、厳格な情報セキュリティの運用と管理体制の維持に努めています。

[ゼロデータ保持](/ja/docs/admin/security/zero-data-retention)、[HIPAA 準拠](/ja/docs/admin/security/hipaa)、その他のカスタマイズされたデータセキュリティソリューションをご検討の場合は、[sales@exa.ai](mailto:sales@exa.ai) までお問い合わせください。Enterprise プランについてご案内いたします。

SOC 2 レポート、データ処理契約 (Data Processing Agreement)、その他のセキュリティ関連ドキュメントは、[Trust Center](https://trust.exa.ai) でご確認いただけます。

<div id="regional-access-restrictions">
  ## 地域によるアクセス制限
</div>

Exa は制裁および貿易制限を遵守するため、制裁対象国・地域およびその他の制限対象国・地域からの API アクセスをブロックしています。対象にはクリミア、キューバ、イラン、北朝鮮、ロシア、シリア、ウクライナ、ベネズエラが含まれます。

これらの地域からのリクエストは、Exa に到達する前に Cloudflare によってブロックされる場合があります。その場合、レスポンスは標準の Exa API エラー JSON ではなく、Ray ID が記載された Cloudflare WAF のブロックページになることがあります。

トラフィックの位置情報が誤って判定されていると思われる場合は、送信元 IP アドレス、国または地域、リクエストのタイムスタンプ、Cloudflare Ray ID を添えて [hello@exa.ai](mailto:hello@exa.ai) までお問い合わせください。