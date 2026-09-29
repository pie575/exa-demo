> ## ドキュメントインデックス
>
> 完全なドキュメントインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="faqs">
  # よくある質問
</div>

> Exa の製品、検索インデックス、コンテンツの鮮度、グラウンディング、セキュリティ、料金に関するよくある質問と回答です。

<AccordionGroup>
  <Accordion title="Exaとは何ですか？">
    Exaは、AIアプリケーション向けのウェブ検索およびリサーチ基盤を提供します。独自の検索インデックスに、コンテンツ抽出とエージェント型リサーチのAPIを組み合わせているため、アプリケーションはソースを見つけてその内容を取得し、根拠に基づいた出力を生成できます。
  </Accordion>

  <Accordion title="どのExa製品を使えばよいですか？">
    * ランク付けされたウェブ検索結果を取得し、必要に応じてハイライト、全文、要約も返すには、[Search API](/ja/docs/search/quickstart)を使用します。
    * URLがすでに手元にあり、そのコンテンツを抽出したい場合は、[Contents API](/ja/docs/contents/quickstart)を使用します。
    * 非同期で複数ステップにわたるリサーチ、リスト作成、構造化されたエンリッチメントには、[Agent API](/ja/docs/agent/quickstart)を使用します。
    * 検索を定期的に実行し、新たに見つかった結果を受け取るには、[Monitors](/ja/docs/monitors/quickstart)を使用します。
  </Accordion>

  <Accordion title="Exa Connectとは何ですか？">
    [Exa Connect](/ja/docs/agent/connect/overview)を使うと、Exa Agentは1回の実行の中で、ウェブ検索に加えてプレミアムなデータプロバイダーにもアクセスできます。`dataSources`でプロバイダーを追加すると、各ソースに問い合わせるタイミングはExa Agentが判断し、パートナーのデータとウェブリサーチを組み合わせて、根拠に基づいた1つの構造化された出力を生成します。

    セルフサービス型のプロバイダーでは、プロバイダーの認証と利用料金の課金をExaが担うため、個別の連携を構築したり、プロバイダーのアカウントを別途作成したりする必要はありません。
  </Accordion>

  <Accordion title="Exa Searchは何が違うのですか？">
    Exa Searchは、広告収益型のブラウジングではなく、プログラムからの情報取得を前提に設計されています。意味に基づく検索に対応し、自然言語のクエリを受け付け、同じリクエストでページの内容も返せます。検索モードは、低レイテンシーの取得から、構造化出力を伴う複数ステップのリサーチまで揃っています。

    利用可能な検索タイプとレスポンス形式については、[Searchクイックスタート](/ja/docs/search/quickstart)を参照してください。
  </Accordion>

  <Accordion title="Exaのインデックスの規模はどのくらいですか？">
    2026年8月時点で、Exaのインデックスは1.4兆件のURLを追跡し、公開ウェブ全体から1,000億ページを提供しています。インデックスは、ページの発見、更新、削除に応じて常に変化しています。
  </Accordion>

  <Accordion title="Exaの結果はどのくらい新しいですか？">
    Exaはページの発見と更新を継続的に行っており、そのタイミングはソースやページの更新頻度によって異なります。インデックス済みのコピーより新しいコンテンツが必要な場合は、Contents APIの[`maxAgeHours`](/ja/docs/contents/quickstart#content-freshness)オプションで、キャッシュの許容期間とライブ取得を制御してください。
  </Accordion>

  <Accordion title="Exaはクローラーを運用していますか？">
    はい。Exaは、検索と取得のために公開ウェブ上のページを発見・更新する`ExaSearchBot`を運用しています。Robots Exclusion Protocolを遵守し、サイトごとのリクエスト頻度を制限しており、ログイン、ペイウォール、CAPTCHAの回避は試みません。

    クロールは`robots.txt`で制御できます。すでにインデックスされたページを削除するには、`noindex`のrobotsメタタグまたは`X-Robots-Tag: noindex`レスポンスヘッダーを使用してください。次回の再取得後に、Exaがそのページを削除します。ユーザーエージェント、暗号学的検証の手順、クローラーの制御方法については、[Exa Search Crawler](https://crawler.exa.ai/)を参照してください。
  </Accordion>

  <Accordion title="ExaはLLMの応答の根拠付けにどう役立ちますか？">
    Exaは、取得に使用したソースURLとウェブコンテンツを返すため、アプリケーションは引用付きの回答を生成し、裏付けとなるエビデンスを確認できます。検索品質とソースによる根拠付けによって裏付けのない主張は減らせますが、取得した情報をどう解釈し提示するかは、引き続きアプリケーションとその言語モデルの責任となります。
  </Accordion>

  <Accordion title="Exaが検索するソースを制限できますか？">
    はい。`includeDomains`でSearchの対象を特定のドメインに限定したり、`excludeDomains`で不要なソースを除外したりできます。また、企業、人物、ニュース、コードなど、ソース別の取得に使えるデータカテゴリも用意しています。[Searchのベストプラクティス](/ja/docs/search/best-practices)と[Data](/ja/docs/search/data/overview)を参照してください。
  </Accordion>

  <Accordion title="どのようなセキュリティおよびデータ保持のオプションがありますか？">
    Exaは、本番環境やエンタープライズ用途に向けたセキュリティとコンプライアンスの制御を提供しています。対象となるEnterpriseのお客様には、[Zero Data Retention](/ja/docs/admin/security/zero-data-retention)や[HIPAA準拠](/ja/docs/admin/security/hipaa)もご用意しています。詳細は[Security &amp; Compliance](/ja/docs/admin/security/overview)を参照してください。
  </Accordion>

  <Accordion title="Exaの料金体系はどうなっていますか？">
    API利用料金は、使用したエンドポイントとオプションに応じて、アカウントのクレジットから差し引かれます。新規アカウントには無料クレジットが付与されます。組織がエンタープライズ契約を結んでいない限り、有料利用は従量課金制です。[Pricing](/ja/docs/admin/pricing)と[Billing](/ja/docs/admin/billing)を参照してください。
  </Accordion>
</AccordionGroup>