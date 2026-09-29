> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="import-from-csv">
  # CSVからインポート
</div>

> 手持ちのCSVデータからWebsetを作成します

<br />

<div id="overview">
  ## 概要
</div>

CSVからインポート機能を使うと、URL を含む既存の CSV ファイルを、すぐに活用できる Webset に変換できます。ウェブサイト、企業、リソースのリストがすでに手元にあり、それらを追加データで補完したい場合や、検索条件を適用して絞り込みたい場合に最適です。

<br />

<div id="how-it-works">
  ## 仕組み
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/import-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=6cf23e9e291fe7811942d18c3aa08b33" alt="CSV インポートによる Webset 作成の流れ" width="1512" height="857" data-path="images/websets/import-flow.png" />

1. 「Start from CSV」をクリックして CSV ファイルを選択します
2. 分析したい URL を含む列を選択します
3. 次に進む前に、データのインポート内容を確認します
4. URL が、エンリッチメントとメタデータ付きの Webset に変換されます

<br />

<div id="csv-preparation">
  ## CSVの準備
</div>

CSVファイルにURL列が含まれていることを確認してください

* 人物検索の場合: URLはLinkedInのプロフィールURLである必要があります (例: [https://linkedin.com/in/username](https://linkedin.com/in/username))
* 企業検索の場合: URLは企業のホームページURLである必要があります (例: [https://example.com](https://example.com))
* その他の検索の場合: 任意の種類のURLを使用できます

URLがない場合、WebsetsはCSVの各行の情報と、追加で指定した情報をもとにURLの推定を試みます。

インポートできる結果の最大数は、ご利用のプランによって異なります。

<div id="what-happens-next">
  ## 次のステップ
</div>

インポートが完了すると、CSV は通常の Webset と同じように扱えるようになり、次のことが行えます。

<div id="enrich-with-custom-columns">
  ### カスタム列で補完する
</div>

各 URL について、必要な情報を自由に追加できます。

* 連絡先情報 (メールアドレス、電話番号)
* 企業指標 (売上高、従業員数)
* コンテンツ分析 (センチメント、トピック、要約)
* ユースケースに応じた独自データ

<div id="apply-search-criteria">
  ### 検索条件を適用する
</div>

インポートしたURLを、特定の条件で絞り込みます。

* 企業のステージや規模
* 業界や分野
* 所在地 (地域)
* コンテンツの種類やトピック