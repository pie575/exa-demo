> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は、次のURLから取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# AI SDK by Vercel {#ai-sdk-by-vercel}

> @exalabs/ai-sdk パッケージを使用して、AI SDK アプリケーションに Exa のウェブ検索を追加します。

`@exalabs/ai-sdk` パッケージを使用すると、AI SDK by Vercel で構築したアプリケーションに Exa のウェブ検索を追加できます。Exa API キーを指定するだけで、モデルからの検索リクエストは `webSearch()` ツールが処理します。

## インストール {#install}

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

## クイックスタート {#quick-start}

```typescript quickstart.ts theme={null}
import { generateText, stepCountIs } from 'ai';
import { webSearch } from '@exalabs/ai-sdk';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Tell me the latest developments in AI',
  system: 'Only use web search once per turn. Answer based on the information you have.',
  tools: {
    webSearch: webSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<Card title="Exa APIキーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

<Info>
  サンプルを実行する前に、キーを `EXA_API_KEY` として設定してください。パッケージはこの環境変数を自動的に読み込みます。
</Info>

## デフォルト {#defaults}

`webSearch()` では以下のデフォルト値が使用されます。

* `type`: `auto`
* `numResults`: `10`
* `contents.text`: 結果 1 件あたり `3000` 文字
* `maxAgeHours`: デフォルトのキャッシュフォールバック。より厳密な鮮度が必要な場合は、このオプションを設定してください

## 検索の設定 {#configure-search}

以下のオプションで、検索とコンテンツ抽出を調整できます。

```typescript configuration.ts theme={null}
const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Find the top AI companies in Europe founded after 2018',
  tools: {
    webSearch: webSearch({
      type: 'auto',
      numResults: 6,
      category: 'company',
      contents: {
        text: { maxCharacters: 1000 },
        maxAgeHours: 1,
        summary: true,
      },
    }),
  },
  stopWhen: stepCountIs(5),
});

console.log(text);
```

### 検索オプション {#search-options}

| オプション                                     | 説明                                                                                            |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `type`                                    | 検索モード: `auto`、`fast`、`instant`、`deep-lite`、`deep`、`deep-reasoning` のいずれか。                     |
| `category`                                | コンテンツのカテゴリ: `company`、`publication`、`news`、`personal site`、`people`、`financial report` のいずれか。 |
| `numResults`                              | 返す結果の件数。                                                                                      |
| `includeDomains` / `excludeDomains`       | 特定のドメインを対象に含めるか、除外します。                                                                        |
| `startPublishedDate` / `endPublishedDate` | 公開日で結果を絞り込みます (ISO 8601 形式)。                                                                  |
| `includeText` / `excludeText`             | 指定したテキストを含む結果に限定するか、除外します。                                                                    |
| `userLocation`                            | 地域に応じた検索に使用する 2 文字の国コード。                                                                      |

### コンテンツオプション {#content-options}

| オプション                                                  | 説明                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| `contents.text`                                        | 抽出したテキストを返します。`maxCharacters` と `includeHtmlTags` を指定できます。 |
| `contents.summary`                                     | AI が生成した要約を返します。`query` を指定できます。                           |
| `contents.maxAgeHours`                                 | キャッシュ済みコンテンツが指定した経過時間内であればそれを使用し、そうでなければ livecrawl を使用します。 |
| `contents.livecrawlTimeout`                            | livecrawl のタイムアウトを設定します。                                   |
| `contents.subpages` / `contents.subpageTarget`         | サブページをクロールします。必要に応じて対象とするサブページを指定できます。                     |
| `contents.extras.links` / `contents.extras.imageLinks` | 結果に含まれるリンクまたは画像リンクを返します。                                   |

## TypeScript のサポート {#typescript-support}

このパッケージには TypeScript の型定義が含まれています。

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

## 関連ページ {#related-pages}

<Columns cols={2}>
  <Card title="Vercel AI Gatewayを使用する" icon="cloud" href="/ja/docs/integrations/vercel/ai-gateway" cta="ガイドを開く" arrow="true">
    VercelのAI Gatewayを経由すれば、Exa APIキーなしでExaのウェブ検索を利用できます。
  </Card>

  <Card title="AI SDKパッケージを見る" icon="git-branch" href="https://github.com/exa-labs/ai-sdk" cta="ソースを表示" arrow="true">
    GitHubでソースコードとパッケージの詳細を確認できます。
  </Card>
</Columns>

パッケージは[npm](https://www.npmjs.com/package/@exalabs/ai-sdk)でも公開されています。あわせて[Vercel AI SDKのウェブ検索ガイド](https://ai-sdk.dev/cookbook/node/web-search-agent#exa)もご覧ください。