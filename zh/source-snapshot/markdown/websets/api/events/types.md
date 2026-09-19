> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="event-types">
  # 事件类型
</div>

> 了解 Webset API 中会发生的各类事件

Websets API 通过事件来通知你 Websets 中发生的变更。你可以通过我们的[事件端点](/zh/docs/websets/api/events/list-all-events)或配置 [webhook](/zh/docs/websets/api/webhooks/create-a-webhook) 来监控这些事件。

事件会保留 60 天，之后将被自动删除。

<div id="webset">
  ## Webset
</div>

* `webset.created` - 创建新的 Webset 时触发。
* `webset.deleted` - 删除 Webset 时触发。
* `webset.paused` - Webset 的操作被暂停时触发。
* `webset.idle` - Webset 没有正在运行的操作时触发。

<div id="search">
  ## Search
</div>

* `webset.search.created` - 发起新的 Search 时触发。
* `webset.search.updated` - Search 进度更新时触发。
* `webset.search.completed` - Search 查找完所有项目时触发。
* `webset.search.canceled` - 手动取消 Search 时触发。

<div id="item">
  ## 项目
</div>

* `webset.item.created` - 当有新项目添加到 Webset 时触发。
* `webset.item.enriched` - 当某个项目的 Enrichment 完成时触发。

<div id="import">
  ## Import
</div>

* `import.created` - 发起新的 import 时触发。
* `import.completed` - import 完成时触发。

<div id="export">
  ## 导出
</div>

* `webset.export.created` - 发起新的导出时触发。
* `webset.export.completed` - 导出完成时触发。

<div id="monitor">
  ## Monitor
</div>

* `monitor.created` - 创建新的 monitor 时触发。
* `monitor.updated` - 更新 monitor 配置时触发。
* `monitor.deleted` - 删除 monitor 时触发。
* `monitor.run.created` - monitor 运行开始时触发。
* `monitor.run.completed` - monitor 运行结束时触发。

每个事件都包含：

* 唯一的 `id`
* 事件 `type`
* `data` 对象，其中包含触发该事件的完整资源
* `createdAt` 时间戳

你可以利用这些事件：

* 跟踪 search 和 enrichment 的进度
* 构建实时仪表板
* 在发现新项目时触发工作流
* 监控导出任务的状态