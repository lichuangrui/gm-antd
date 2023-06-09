---
category: Components
cols: 1
type: 业务
title: TableFilter
subtitle: 过滤查询
cover: https://gw.alipayobjects.com/zos/alicdn/f-SbcX2Lx/Table.svg
tag: New
---

筛选查询提供两种交互模式：触发式查询、实时查询

**触发式查询**
带查询按钮，当用户对数据查询范围有明确针对性，满足需要对数据进行一系列筛选过滤的使用场景。按照预设的条件，选择多个查询条件后，使用「查询按钮」或「键盘Enter回车」触发后查询。

**实时查询**
选中选项时直接查询：当数据查询范围较为随机，用户需要反复、多次修改条件时，可通过实时显示查询结果，提高查询效率，与触发查询的区别是没有全局的查询按钮。


## API

### TableFilter

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| id | 唯一 ID | string | 默认使用当前路由字符串作为 id，如果同一路由下使用了多个，需要手动指定唯一 id |  |
| fields | 字段配置 | [FieldItem]\[],不同`type`的`field`的配置不相同，见类型声明或代码提示 | [] |  |
| paginationResult | `usePagination`的返回值, `{ run: (params)=>Promise<void> }` | { run: (params)=>Promise<void> } | - |  |
| immediate | 是否就绪后即刻提交一次查询 | boolean | `false` |  |
| trigger | 触发类型,触发搜索的方式；`manual` 点击“查询”按钮后才查询；`onChange` 字段表单变化后查询，且查询和重置按钮会被隐藏； `both` 字段表单变化后查询，点击“查询”按钮后查询； | string | `manual` |  |

### TableFilter 实例

`TableFilter.get(id)`获取到的实例包含以下 api：

| 方法       | 说明                           | 类型 | 默认值 | 版本 |
| ---------- | ------------------------------ | ---- | ------ | ---- |
| .get(key)  | 获取指定字段的值               |      |        |      |
| .set(key)  | 设置指定字段的值               |      |        |
| .search()  | 提交查询请求                   |      |        |      |
| .toPrams() | 返回表单内容转换的 json 键值对 |      |        |      |
| .reset()   | 清空                           |      |        |      |
