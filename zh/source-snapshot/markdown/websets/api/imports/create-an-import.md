> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="create-an-import">
  # 创建导入
</div>

> 创建一个新的导入，将你的数据上传到 Websets。导入可用于：

* **Enrich**：借助我们基于 AI 的 enrichment 引擎，为数据补充更多信息
* **Search**：使用 Websets 的智能体式 search，通过自然语言筛选条件查询数据
* **Exclude**：避免重复或已知的结果出现在 search 结果中

导入创建完成后，你可以在 `uploadValidUntil` 之前 (默认 1 小时) 将数据上传到返回的 `uploadUrl`。

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml POST /v0/imports
openapi: 3.1.0
info:
  title: Exa 公共 API
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /v0/imports:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Imports
      summary: 创建导入
      description: >-
        创建一个新的导入，将您的数据上传到 Websets。导入可用于：


        - **Enrich（丰富）**：使用我们的 AI 驱动的丰富引擎，为您的数据补充更多信息

        - **Search（搜索）**：使用 Websets 的智能体搜索和自然语言过滤器查询您的数据

        - **Exclude（排除）**：防止重复或已知的结果出现在您的搜索中


        导入创建后，您可以在 `uploadValidUntil`（默认 1 小时）之前将数据上传到返回的
        `uploadUrl`。
      operationId: imports-create
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateImportParameters'
      responses:
        '201':
          description: 导入创建成功
          headers:
            X-Request-Id:
              schema:
                type: string
              description: 请求的唯一标识符。
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateImportResponse'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    CreateImportParameters:
      discriminator:
        propertyName: format
      oneOf:
        - properties:
            size:
              maximum: 50000000
              description: 文件大小（字节）。最大为 50 MB。
              type: number
            count:
              description: 要导入的记录数量
              type: number
            title:
              description: 导入的标题
              type: string
            format:
              enum:
                - csv
              description: >-
                当导入为 CSV 格式时，我们要求包含一列作为实体的关键标识符——目前为 URL。如果未提供，导入将无法处理。
              type: string
            metadata:
              description: 您希望与此对象关联的一组键值对。
              propertyNames:
                type: string
              additionalProperties:
                type: string
                maxLength: 1000
              type: object
            entity:
              description: >-
                导入内容包含的实体类型（例如人物、公司等），并据此尝试进行解析。
              oneOf:
                - $ref: '#/components/schemas/CompanyEntity'
                - $ref: '#/components/schemas/PersonEntity'
                - $ref: '#/components/schemas/ArticleEntity'
                - $ref: '#/components/schemas/ResearchPaperEntity'
                - $ref: '#/components/schemas/CustomEntity'
            csv:
              description: 当格式为 `csv` 时，这些是具体的导入参数。
              properties:
                identifier:
                  description: >-
                    包含实体关键标识符的列（例如 URL、名称等）。如果未提供，我们将尝试从文件中推断。
                  minimum: 0
                  type: integer
              type: object
          required:
            - size
            - count
            - format
            - entity
          type: object
    CreateImportResponse:
      properties:
        id:
          description: 导入的唯一标识符
          type: string
        object:
          enum:
            - import
          description: 对象类型
          type: string
        status:
          enum:
            - pending
            - processing
            - completed
            - failed
            - canceled
          description: 导入的状态
          type: string
        format:
          enum:
            - csv
            - webset
          description: 导入的格式。
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: 导入内容包含的实体类型。
          nullable: true
        title:
          description: 导入的标题
          type: string
        count:
          description: 导入中的实体数量
          type: number
        metadata:
          description: 您希望与此对象关联的一组键值对。
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        failedReason:
          enum:
            - invalid_format
            - invalid_file_content
            - missing_identifier
          type: string
          description: 导入失败的原因
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: 导入失败的时间
          nullable: true
        failedMessage:
          type: string
          description: 导入失败的可读信息
          nullable: true
        createdAt:
          format: date-time
          description: 导入创建的时间
          type: string
        updatedAt:
          format: date-time
          description: 导入最后更新的时间
          type: string
        uploadUrl:
          description: 用于上传文件的 URL
          type: string
        uploadValidUntil:
          description: >-
            上传 URL 的有效截止日期和时间。上传 URL 的有效期为 1 小时。
          type: string
      required:
        - id
        - object
        - status
        - format
        - entity
        - title
        - count
        - metadata
        - failedReason
        - failedAt
        - failedMessage
        - createdAt
        - updatedAt
        - uploadUrl
        - uploadValidUntil
      description: >-
        成功导入的响应。包含上传 URL 和上传有效截止日期。
      type: object
    CompanyEntity:
      properties:
        type:
          type: string
          const: company
          default: company
      required:
        - type
      title: 公司
      type: object
    PersonEntity:
      properties:
        type:
          type: string
          const: person
          default: person
      required:
        - type
      title: 人物
      type: object
    ArticleEntity:
      properties:
        type:
          type: string
          const: article
          default: article
      required:
        - type
      title: 文章
      type: object
    ResearchPaperEntity:
      properties:
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
      title: 研究论文
      type: object
    CustomEntity:
      properties:
        description:
          minLength: 2
          maxLength: 200
          type: string
        type:
          type: string
          const: custom
          default: custom
      required:
        - type
        - description
      title: 自定义
      type: object
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        在 x-api-key 请求头中传入您的 Exa API 密钥。您也可以使用 Authorization: Bearer <key>
        进行身份验证。
    bearer:
      type: http
      scheme: bearer
      description: >-
        在 x-api-key 请求头中传入您的 Exa API 密钥。您也可以使用 Authorization: Bearer <key>
        进行身份验证。
```