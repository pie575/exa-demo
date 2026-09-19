<div id="verification-against-exa-production">
  # 对照 Exa 生产环境的验证
</div>

生产环境快照：2026 年 9 月 18 日。本地预览：http://localhost:3000/docs。

| 检查项            | 结果                                            | 证据                                   |
| -------------- | --------------------------------------------- | ------------------------------------ |
| 源文件清单与导航       | 159 个页面全部覆盖；无缺失或多余页面                          | [内容审计](content-audit.json)           |
| HTTP 页面渲染      | 159 条路由全部渲染成功                                 | [路由审计](route-audit.json)             |
| 完整渲染的 API 内容   | 空白字符归一化后，69 项全部与生产环境一致                        | [API 对比](api-content-audit.json)     |
| 内部链接与 API 引用   | 378 条编写的链接及全部 69 个 schema 路径/方法均通过            | [内容审计](content-audit.json)           |
| 已发布的下载资源       | 受测的 9 个 Markdown、LLM 与 schema 导出文件均可正常获取，负载一致 | [导出审计](exports-report.json)          |
| 交互行为           | 11 项浏览器检查全部通过，无页面错误                           | [交互审计](interaction-audit.json)       |
| 桌面端布局          | 159 条路由的实测几何尺寸与完整内容高度均匹配；无运行时错误，无可见图片损坏       | [视觉汇总](visual-summary.json)          |
| 移动端与深色模式       | 覆盖 5 条代表性路由的 10 组对比；实测布局一致，无横向溢出，无可见图片损坏      | [移动端/主题对比](mobile-theme/report.json) |
| Mintlify 构建与链接 | `pnpm validate` 与 `pnpm check:links` 通过       | 可复现命令见下文                             |

交互检查涵盖首页的全部示例选择器、本地全文
search 与键盘导航、空结果、Escape、剪贴板复制、主题
切换、API schema 渲染、Agent 表格的全部七个标签页，以及移动端
导航与 search。

<div id="blind-visual-review">
  ## 盲评视觉审查
</div>

[打开 159 页的 A/B 对比图库](blind/index.html)。每个页面的两张
截图均独立打乱顺序。图库会在浏览器中保存 A/B/平局的偏好选择。
四组具有代表性的桌面端/移动端配对也在未查阅身份对照 key 的情况下进行了审查：[最终审查](blind/final-review.md)。
更早的独立审查及对应截图归档于
`blind/review-round-2/`。

最终的代表性审查未发现任一版本在美观上具有实质优势。
其中两组代表性配对的位图完全一致；另外两组在所记录的阈值下分别仅有 8 个和 1 个像素存在差异
 ([像素测量数据](representative-pixel-comparison.json)) 。这些仅是对所捕获视口的检查，
并不代表全局像素一致或托管服务等效。
全部 159 个页面中，有 158 个页面的正文文本完全一致；
唯一的差异来自实时状态页面的检查时间戳。

<div id="fidelity-details">
  ## 保真细节
</div>

此次导入保留了生产环境的主题、导航、自定义样式与脚本、字体、页面元数据、API 规范以及原始 MDX 组件。
同时补回了 Markdown 导出中缺失的 Agent Examples 表格，以及本地渲染器遗漏的 85 个已发布修改标签。
原始响应与校验和保存在 `source-snapshot/` 中。

Exa 托管的 AI 助手在 Mintlify 本地预览中不可用，其本地控件改为打开一个可正常使用的文档搜索。外部控制台与 API playground 的跳转目标仍指向外部站点。Markdown 与 schema 的下载链接通过重定向指向内容完全相同的 `.txt` 负载，因为原生开发服务器不会直接提供这些扩展名的文件。实时状态时间戳与动态媒体在不同抓取之间可能存在差异。

<div id="reproduce">
  ## 复现
</div>

```sh
pnpm validate
pnpm check:links
pnpm audit:content
pnpm dev
# 保持预览运行，在另一个终端中执行：
python3 verification/audit-content.py --url http://localhost:3000 --output verification/route-audit.json
python3 verification/check-exports.py
node verification/audit-interactions.mjs
node verification/audit-api-content.mjs
node verification/compare-all.mjs
node verification/mobile-theme-check.mjs
node verification/build-blind-gallery.mjs
```

浏览器检查需要 Google Chrome，并使用已安装的 Playwright 包。
全页截图是本地生成的产物，不纳入 Git 版本控制；
在全新检出的代码库中使用图库前，请先重新生成这些截图。