> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Vercel AI Gateway {#vercel-ai-gateway}

> AI SDK を使い、Vercel AI Gateway 経由で Exa のウェブ検索を利用します。

`ai` パッケージの `gateway.tools.exaSearch()` を使うと、[Vercel AI Gateway](https://vercel.com/docs/ai-gateway) 経由で Exa のウェブ検索を利用できます。Exa API キーは不要で、これらのリクエストの料金は AI Gateway を通じて Vercel から請求されます。詳細なリファレンスについては、Vercel の[ウェブ検索ドキュメント](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)を参照してください。

## インストール {#install}

AI SDK 5 以降をインストールします：

```bash install.sh theme={null}
npm install ai
```

## 認証 {#authentication}

<Info>
  AI Gateway を利用するには、API キーまたは OIDC トークンが必要です。Vercel ダッシュボードの **AI Gateway &gt; API Keys** で `AI_GATEWAY_API_KEY` を作成し、環境変数に設定してください。
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

Vercel にアプリケーションをデプロイする場合は、代わりに自動で提供される `VERCEL_OIDC_TOKEN` を使用できます。詳しくは Vercel の[認証と BYOK に関するドキュメント](https://vercel.com/docs/ai-gateway/authentication-and-byok)を参照してください。

## クイックスタート {#quick-start}

Exa 検索は、サポートされている任意のモデルで使用できます。

```typescript quickstart.ts theme={null}
import { gateway, generateText, stepCountIs } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

## ストリーミング {#streaming}

`streamText` を使用すると、生成されたテキストや検索ツールのイベントを、受信したそばから処理できます。

```typescript stream.ts theme={null}
import { gateway, streamText } from 'ai';

const result = streamText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
});

for await (const part of result.fullStream) {
  if (part.type === 'text-delta') {
    process.stdout.write(part.text);
  } else if (part.type === 'tool-call') {
    console.log('Tool call:', part.toolName);
  } else if (part.type === 'tool-result') {
    console.log('Search results received');
  }
}
```

Next.js のルートハンドラーでは、`return result.toUIMessageStreamResponse()` でストリームをクライアントに返します。

## 設定 {#configuration}

検索の動作を調整するには、`gateway.tools.exaSearch()` にオプションを渡します。

```typescript configuration.ts theme={null}
tools: {
  exa_search: gateway.tools.exaSearch({
    type: 'fast',
    numResults: 5,
    category: 'news',
    includeDomains: ['reuters.com', 'bbc.com', 'nytimes.com'],
    contents: {
      highlights: true,
      maxAgeHours: 24,
    },
  }),
},
```

利用可能なオプションは次のとおりです。

| オプション                                                  | 説明                                            |
| ------------------------------------------------------ | --------------------------------------------- |
| `type`                                                 | 検索モード。`auto`(デフォルト)、`fast`、`instant` のいずれかです。 |
| `numResults`                                           | 返す結果の数(1〜100)。デフォルトは 10 です。                   |
| `category`                                             | コンテンツのカテゴリ。                                   |
| `includeDomains` / `excludeDomains`                    | 特定のドメインを対象に含める、または除外します。                      |
| `startPublishedDate` / `endPublishedDate`              | 公開日で結果を絞り込みます。                                |
| `userLocation`                                         | 地域を考慮した検索に使用する 2 文字の ISO 国コード。                |
| `contents.text`                                        | 抽出したページのテキストを返します。                            |
| `contents.highlights`                                  | ページ内の関連するハイライトを返します。                          |
| `contents.maxAgeHours`                                 | キャッシュされたコンテンツの最大経過時間を設定します。                   |
| `contents.livecrawlTimeout`                            | ライブクロールのタイムアウトを設定します。                         |
| `contents.subpages` / `contents.subpageTarget`         | サブページをクロールします。必要に応じて対象のサブページを指定できます。          |
| `contents.extras.links` / `contents.extras.imageLinks` | 結果に含まれるリンクまたは画像リンクを返します。                      |

パラメータの完全な一覧と各パラメータの動作については、Vercel の [Exa ウェブ検索リファレンス](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)を参照してください。

## Vercel eve のエージェント {#vercel-eve-agents}

[eve](https://eve.dev) で構築したエージェントには組み込みの `web_search` ツールが用意されており、AI Gateway のモデルはデフォルトで Exa を使ってこのツールを実行します。設定や Exa API キーは必要ありません。プロバイダーを明示的に固定するには、`agent/tools/web_search.ts` からエクスポートしてください。

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

AI Gateway を経由せず、プロバイダーから直接呼び出されるモデルは、ネイティブのウェブ検索を引き続き使用します。ツールの全一覧については、eve の[ハーネスのドキュメント](https://eve.dev/docs/concepts/default-harness#built-in-tools)を参照してください。

## 料金 {#pricing}

<Tip>
  Exa のウェブ検索は AI Gateway と eve で **8 月 31 日まで無料**で利用できます。今すぐ無料で構築を始めましょう。
</Tip>

無料期間の終了後は、AI Gateway 経由のリクエストに対して、Vercel の[ウェブ検索ドキュメント](https://vercel.com/docs/ai-gateway/models-and-providers/web-search)に記載された料金で Vercel から課金されます。

<Note>
  このインテグレーションは現在、Exa の標準検索モードとコンテンツ抽出の制御に対応しています。Deep 合成モードと生成された要約にはまだ対応していません。
</Note>

<Columns cols={2}>
  <Card title="Exa AI SDK を使用する" icon="code" href="/ja/docs/integrations/vercel/ai-sdk" cta="ガイドを開く" arrow="true">
    `@exalabs/ai-sdk` を使用して、Exa API キーで Exa を直接呼び出します。
  </Card>

  <Card title="Vercel のウェブ検索リファレンスを読む" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="リファレンスを開く" arrow="true">
    AI Gateway の設定と料金に関する完全なリファレンスを確認できます。
  </Card>
</Columns>