# RainstormArea.html 改动说明

> 文件路径：`WebUI/page/yq/RainstormArea.html`
> 改动日期：2026-07-01

---

## 一、功能概述

暴雨等值线面分析页面。基于 ArcGIS JS API 3.31，实现雨量站点数据查询、站点打点、等值面生成、降水笼罩面积统计等功能。

---

## 二、改动清单

### 1. 查询与绘制的流程拆分

**改动前**：点击"统计"→ 查数据 → 打点 → 自动生成等值面（一气呵成）

**改动后**：拆为两步
- 点击 **"查询"** → 调接口 `SWZZ_RTSQ_ST_PPTN_R/queryDRPList` → 存数据 → `addYQMarker()` 打点（不生成等值面）
- 点击 **"绘制等值面"** → `drawIsosurface()` → `refreshRainfallStr()` → `MapRainfall()` → 调接口 `/dzxmTrae/multi-regions/isosurfaces`

**关键函数**：
```javascript
function drawIsosurface() {
    // 校验数据存在 → 显示遮罩 → 调用 refreshRainfallStr()
}
```

**注意**：`addYQMarker()` 中原来的 `RainfallStr` 构建逻辑已移除，统一由 `refreshRainfallStr()` 负责。

---

### 2. 站点排除功能（不参与等值面计算）

**全局状态**：
```javascript
var excludedStations = new Set();  // 存储被排除站点的 stcd
```

**交互方式**：
| 方式 | 操作 |
|------|------|
| 弹窗面板 | 点击右侧"站点筛选"按钮 → 勾选/取消勾选站点 |
| 地图快捷 | 按住 **Ctrl** + 点击地图上的站点标记 |
| 批量操作 | 弹窗中的全选 / 取消全选 / 反选（仅影响当前可见站点） |

**数据传递**：
- 被排除站点仍然传给等值面接口（`/dzxmTrae/multi-regions/isosurfaces`），但 `value` 设为 `0`
- 这样插值算法有完整的空间参考点，不会报错

```javascript
// refreshRainfallStr() 中的关键逻辑
var value = excludedStations.has(item.stcd) ? 0 : f;
RainfallStr.push({ lon: item.lgtd, lat: item.lttd, value: value });
```

**视觉区分**：
- 被排除站点在地图上以 **opacity: 0.2** 半透明显示
- 透明度通过 `graphic.getNode().style.opacity` 设置（DOM 层面）

---

### 3. 站点选择弹窗

**触发按钮**：右侧面板"站点筛选"（橙色按钮）

**弹窗内容**：
```
┌─ 站点选择（参与等值面计算）── ✕ ─┐
│ 全选  取消全选  反选  Ctrl+...   │
│ [输入站名或站码筛选...]           │  ← 文本搜索
│ [全部区域 ▾]                     │  ← 行政分区下拉（addvnm）
│ ☑ 徐家汇站  63420100   12.5     │
│ ☐ 练塘站    63422650    8.2     │
│                        [关闭]   │
└─────────────────────────────────┘
```

**筛选功能**：
- 文本搜索：按站名/站码实时过滤
- 区域下拉：按 `addvnm`（接口返回的行政分区）过滤，选项自动从数据中提取去重
- 两个筛选条件为 **AND** 关系（取交集）
- 批量操作（全选/取消全选/反选）**仅影响当前可见（筛选后）的站点**

**关键函数**：
```javascript
function getVisibleStationItems()   // 获取未被筛选隐藏的列表项
function buildStationList(data)     // 构建列表 + 填充区域下拉 + data-addvnm 属性
function filterStationList()        // 文本 + 区域 双重筛选
```

---

### 4. 透明度持久化（修复缩放后透明度丢失的 Bug）

**Bug 原因**：ArcGIS 缩放/平移时会销毁并重建 marker 的 DOM 节点，之前通过 `graphic.getNode().style.opacity` 设置的透明度随旧节点一起被销毁。

**修复方案**：监听地图 `update-end` 事件，每次重绘后自动重新设置排除站点的透明度。

```javascript
var _refreshOpacityTimer = null;
function applyExcludedMarkerOpacity() { /* 遍历所有 graphic，给排除站点设 opacity:0.2 */ }
function scheduleRefreshOpacity() {     /* 150ms 防抖 */ }

// 初始化时注册
map.on('update-end', scheduleRefreshOpacity);
```

---

### 5. 统计面板（降水笼罩面积）

**位置**：地图左上角，默认隐藏

**显示内容**：等级 / 面积(km²) / 占比(%)

**计算逻辑**（`calculationArea()`）：
- 使用 ArcGIS `geometryEngine` 计算每个等值面 polygon 面积
- 处理嵌套关系：父级面积 = 自身面积 - 子级面积
- 总面积基准：太湖流域 36,900 km²

---

## 三、新增/修改的函数

| 函数 | 类型 | 说明 |
|------|------|------|
| `drawIsosurface()` | 新增 | 绘制等值面入口，校验数据后调 refreshRainfallStr |
| `excludedStations` | 新增变量 | Set 类型，存储被排除站点的 stcd |
| `ctrlKeyPressed` | 新增变量 | 跟踪 Ctrl 键状态 |
| `openStationModal()` | 新增 | 打开站点选择弹窗 |
| `closeStationModal()` | 新增 | 关闭站点选择弹窗 |
| `buildStationList(data)` | 新增 | 构建站点列表 + 填充区域下拉 |
| `filterStationList()` | 新增 | 文本 + 区域双重筛选 |
| `getVisibleStationItems()` | 新增 | 获取当前可见的列表项 |
| `selectAllStations()` | 修改 | 改为仅操作可见站点 |
| `deselectAllStations()` | 修改 | 改为仅操作可见站点 |
| `invertStationSelection()` | 修改 | 改为仅操作可见站点 |
| `onStationCheckChange(stcd, checked)` | 新增 | 单个站点复选框变化处理 |
| `updateExcludedCount()` | 新增 | 更新排除数量显示 |
| `setMarkerOpacity(graphic, opacity)` | 新增 | DOM 层面设置标记透明度 |
| `applyExcludedMarkerOpacity()` | 新增 | 重绘后重新应用透明度 |
| `scheduleRefreshOpacity()` | 新增 | 防抖版本的透明度刷新 |
| `refreshRainfallStr()` | 新增 | 重建 RainfallStr（排除站点 value=0） |
| `addYQMarker()` | 修改 | 移除 RainfallStr 构建和 MapRainfall 调用 |
| `onYQClick(evt)` | 修改 | 新增 Ctrl+点击切换排除 |
| `loadDZM()` | 不变 | 查询接口，只负责获取数据+打点 |

---

## 四、接口依赖

| 接口 | 调用位置 | 说明 |
|------|----------|------|
| `SWZZ_RTSQ_ST_PPTN_R/queryDRPList` | `loadDZM()` | 查询雨量站点数据 |
| `POST /dzxmTrae/multi-regions/isosurfaces` | `MapRainfall()` | 三角插值生成等值面 |
| `POST /dzxmTrae/multi-regions/image` | `loadDZMPIC()` | 导出等值面图片 |

**等值面接口参数**：
```json
{
    "interpolation_method": "trigonometric",
    "levels": [5, 10, 25, 50, 100, 200],
    "resolution": 1000,
    "stations": [
        { "lon": 121.4, "lat": 31.2, "value": 12.5 }
    ],
    "boundary": false
}
```

**注意**：接口返回数据中需包含 `addvnm`（行政分区）字段，用于站点筛选。

---

## 五、CSS 新增样式

```css
/* 站点选择弹窗 */
.station-list-item        /* 列表项 flex 布局 */
.station-list-item:hover  /* hover 高亮 */
.excluded-count           /* 排除数量红色提示 */
```

---

## 六、注意事项

1. **ArcGIS 版本**：使用 3.31，`PictureMarkerSymbol` 不支持 `setOpacity()` 和 `.set('opacity', ...)` 方法，必须通过 `getNode().style.opacity` 设置
2. **DOM 被重建**：地图缩放/平移后 marker 的 DOM 节点会被重建，需通过 `map.on('update-end')` 重新应用透明度
3. **排除站点 value=0**：被排除站点仍传给等值面接口，value 置 0，保证插值算法有完整空间参考点
4. **批量操作仅可见**：全选/取消全选/反选只影响当前筛选条件下可见的站点
5. **边角插值点**：站点 63422650、63422480、X1160101 有对应的硬编码边角插值坐标，排除时会跟随原始站点状态
