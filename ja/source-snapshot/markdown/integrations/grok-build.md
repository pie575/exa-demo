> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="grok-build">
  # Grok Build
</div>

> Grok BuildでExaのウェブ検索を利用できます。Grok BuildのマーケットプレイスからExaプラグインをインストールし、Exaアカウントでサインインしてください。

Exaは、[Grok Build](https://docs.x.ai/build/overview)のマーケットプレイスでプラグインとして提供されています。このプラグインを使うと、Grokでリアルタイムのウェブ検索、ページの読み取り、ディープリサーチスキルを利用できます。

<div id="installation">
  ## インストール
</div>

<Steps>
  <Step title="Grok Build をインストールする">
    Grok CLI をインストールします(詳細は [Grok Build のドキュメント](https://docs.x.ai/build/overview)を参照してください)。

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    次に、xAI アカウントにサインインします。

    ```bash theme={null}
    grok login
    ```
  </Step>

  <Step title="マーケットプレイスを開く">
    `grok` を実行して Grok Build を起動し、マーケットプレイスを開きます。

    ```text theme={null}
    /marketplace
    ```
  </Step>

  <Step title="Exa プラグインをインストールする">
    一覧から **exa** を探し、`i` を押してインストールします。
  </Step>

  <Step title="Exa にサインインする">
    `/mcp` で MCP サーバータブを開き、**exa** を選択して `i` を押すとサインインできます。ブラウザで Exa のサインインページが開きます。新規アカウントには登録時に無料クレジットが付与されます。
  </Step>
</Steps>

exa の表示が **ready** になったら、Web 上の情報が必要な質問を Grok に何でも尋ねてみましょう。

<div id="what-you-get">
  ## 利用できる機能
</div>

* **web&#95;search&#95;exa**: リアルタイムのウェブ検索です。自然言語クエリに対応しており、ニュース、企業、人物、研究論文、GitHub などのカテゴリで絞り込めます。
* **web&#95;fetch&#95;exa**: 任意の URL を読み込み、ページのコンテンツをクリーンな Markdown で返します。
* **exa-search skill**: ディープリサーチスキルです。Grok にトピックを深く掘り下げるよう依頼すると、複数の検索を実行し、質の高い情報源を読み込んだうえで、引用付きで回答します。

<div id="example-prompts">
  ## プロンプトの例
</div>

* 「xAI に関する最新ニュースを検索して」
* 「[https://exa.ai](https://exa.ai) を読んで要約して」
* 「オープンソースの推論エンジンについて詳しく調べて」