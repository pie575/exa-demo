> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="exclude-results">
  # Exclude Results
</div>

> 以前の Webset や CSV ファイルに含まれる URL を除外して、新しい検索での結果の重複を防ぎます。

<br />

<div id="overview">
  ## 概要
</div>

Exclude Results 機能を使うと、新しい検索を作成する際に重複した結果が返されるのを防げます。過去の Websets やアップロードした CSV ファイルをもとに除外する URL を指定することで、既存のデータを補完する、新しく重複のない結果の発見に集中できます。

<br />

<div id="how-it-works">
  ## 仕組み
</div>

<img src="https://mintcdn.com/exa-52/tmzyKnsgpKLGddKC/images/websets/exclude-flow.png?fit=max&auto=format&n=tmzyKnsgpKLGddKC&q=85&s=b28ac0441991bc4543571ffc2a900963" alt="Webset作成時の結果除外オプション" width="1466" height="857" data-path="images/websets/exclude-flow.png" />

1. 新しいWebsetの作成を開始します
2. サイドパネルの条件の下にある「Exclude」をクリックします
3. 過去のWebsetから選択するか、除外するURLを記載したCSVをアップロードします。除外元となるソースは複数選択できます。
4. 検索を開始します。除外設定に一致しない新しい結果のみが返されます

除外できる結果の上限数は、ご利用のプランによって異なります。

<br />

<div id="when-to-use-exclusions">
  ## 除外を使用するケース
</div>

* CRM に未登録の見込み顧客を見つけたい場合
* 以前の検索結果を踏まえ、条件を絞り込んで再検索したい場合
* すでに把握している結果を除外したい場合