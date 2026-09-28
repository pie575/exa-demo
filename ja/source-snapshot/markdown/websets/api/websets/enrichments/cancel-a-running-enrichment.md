> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# 実行中の enrichment をキャンセルする {#cancel-a-running-enrichment}

> 実行中のすべての enrichment がキャンセルされます。一度キャンセルした Enrichment は再開できません。

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /v0/websets/{webset}/enrichments/{id}/cancel
openapi: 3.1.0
info:
  title: Exa Public API
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /v0/websets/{webset}/enrichments/{id}/cancel:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Enrichments
      summary: 実行中のEnrichmentをキャンセルする
      description: >-
        実行中のすべてのEnrichmentがキャンセルされます。キャンセルしたEnrichmentは再開できません。
      operationId: websets-enrichments-cancel
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          description: WebsetのidまたはexternalId
          required: true
        - in: path
          name: id
          schema:
            type: string
          description: Enrichmentのid
          required: true
      responses:
        '200':
          description: Enrichmentがキャンセルされました
          headers:
            X-Request-Id:
              schema:
                type: string
              description: リクエストの一意の識別子。
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebsetEnrichment'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    WebsetEnrichment:
      properties:
        id:
          description: Enrichmentの一意の識別子
          type: string
        object:
          const: webset_enrichment
          default: webset_enrichment
          type: string
        status:
          enum:
            - pending
            - canceled
            - completed
          description: Enrichmentのステータス
          title: WebsetEnrichmentStatus
          type: string
        websetId:
          description: このEnrichmentが属するWebsetの一意の識別子。
          type: string
        title:
          type: string
          description: >-
            Enrichmentのタイトル。


            descriptionとformatに基づいて自動生成されます。
          nullable: true
        description:
          description: >-
            Enrichmentの作成時に指定されたタスクの説明。
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
          description: Enrichmentのレスポンスの形式。
          nullable: true
        options:
          items:
            properties:
              label:
                description: オプションのラベル
                type: string
            required:
              - label
            type: object
          type: array
          description: >-
            formatがoptionsの場合に、Enrichmentエージェントが選択肢として使用するオプション。
          title: WebsetEnrichmentOptions
          nullable: true
        instructions:
          type: string
          description: >-
            Enrichment Agentへの指示。


            descriptionとformatに基づいて自動生成されます。
          nullable: true
        metadata:
          default: {}
          description: Enrichmentのメタデータ
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: Enrichmentの作成日時
          type: string
        updatedAt:
          format: date-time
          description: Enrichmentの更新日時
          type: string
      required:
        - id
        - object
        - status
        - websetId
        - title
        - description
        - format
        - options
        - instructions
        - createdAt
        - updatedAt
      type: object
    WebsetEnrichmentFormat:
      enum:
        - text
        - date
        - number
        - options
        - email
        - phone
        - url
      type: string
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Exa API keyはx-api-keyヘッダーで渡してください。Authorization: Bearer <key> で認証することもできます。
    bearer:
      type: http
      scheme: bearer
      description: >-
        Exa API keyはx-api-keyヘッダーで渡してください。Authorization: Bearer <key> で認証することもできます。

```