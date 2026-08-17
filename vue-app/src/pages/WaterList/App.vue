<template>
  <div class="page-container">

    <!-- ===== 搜索工具栏 ===== -->
    <SearchToolbar
      v-model:query="query"
      :loading="loading"
      @search="doSearch"
      @export="doExport"
      @reset="doReset"
    />

    <!-- ===== 数据表格 ===== -->
    <div class="table-wrap">
      <div class="table-header">
        <span class="title">
          水情信息 <span class="unit">(单位：m)</span>
        </span>
        <span class="count">共 {{ totalCount }} 条记录</span>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        highlight-current-row
        @row-click="onRowClick"
        style="width: 100%"
        :height="tableHeight"
        empty-text="暂无数据"
      >
        <el-table-column prop="stnm" label="站名" width="120" align="center">
          <template #default="{ row }">
            <el-link type="primary" @click.stop="goDetail(row)">
              {{ row.stnm }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="upz" label="水位" width="100" align="center">
          <template #default="{ row }">
            <span :class="row.upz > row.wrz ? 'warn' : 'normal'">
              {{ row.upz }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="wrz" label="警戒值" width="80" align="center" />
        <el-table-column prop="tm" label="时间" width="160" align="center" />
        <el-table-column prop="stcd" label="站号" width="100" align="center" />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click.stop="locOnMap(row)">
              定位
            </el-button>
            <el-button link type="primary" size="small" @click.stop="goDetail(row)">
              过程线
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- ===== 分页 ===== -->
      <div class="footer-bar">
        <span>提示：点击站名查看过程线，点击"定位"在地图上高亮站点</span>
        <el-pagination
          v-model:current-page="pager.pageIndex"
          v-model:page-size="pager.pageSize"
          :page-sizes="[15, 20, 30, 50, 100]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          small
          @current-change="onPageChange"
          @size-change="onPageChange"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
// ==================== Vue 单文件组件（方式B） ====================
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import SearchToolbar from './components/SearchToolbar.vue'
import { fetchWaterData } from './api/water'

// ========== map.html 子页面通信 ==========
const isInIframe = ref(window.self !== window.top)
const map = ref(null)

// 暴露给父页面的接口 —— 和现有 Water.html 完全一致
window._show    = () => { console.log('[Vue] 激活'); doSearch() }
window._hide    = () => { console.log('[Vue] 隐藏') }
window._destroy = () => { console.log('[Vue] 销毁'); tableData.value = [] }
window.ShowPage = () => { console.log('[Vue] ShowPage'); doSearch() }
window.GetMap   = (mapObj) => { console.log('[Vue] 收到地图对象'); map.value = mapObj }

// ========== 状态 ==========
const loading = ref(false)
const tableData = ref([])
const totalCount = ref(0)
const tableHeight = ref(400)

const query = reactive({
  endDate: new Date().toISOString().slice(0, 10),
  endHour: new Date().getHours() + 1,
  typeId: 'all',
})

const pager = reactive({
  pageIndex: 1,
  pageSize: 15,
})

let allData = []

// ========== 数据请求 ==========
async function doSearch() {
  loading.value = true
  try {
    const res = await fetchWaterData(query)
    allData = res.data || []
    totalCount.value = allData.length
    doPage()
  } catch (e) {
    ElMessage.error('数据加载失败：' + e.message)
  } finally {
    loading.value = false
  }
}

function doPage() {
  const start = (pager.pageIndex - 1) * pager.pageSize
  tableData.value = allData.slice(start, start + pager.pageSize)
}

function onPageChange() { doPage() }
function doReset() {
  query.typeId = 'all'
  query.endDate = new Date().toISOString().slice(0, 10)
  query.endHour = new Date().getHours() + 1
  doSearch()
}

// ========== 地图交互 ==========
function locOnMap(row) {
  if (map.value?.centerAndZoom) {
    map.value.centerAndZoom([row.lgtd, row.lttd], 12)
  }
  if (!isInIframe.value) {
    ElMessage.info(`定位站号：${row.stcd}（独立模式，无地图对象）`)
  }
}

function onRowClick(row) { locOnMap(row) }

// ========== 跳转过程线 ==========
function goDetail(row) {
  const url = `../DanZhan/DanZHanMain.html?stcd=${row.stcd}&stnm=${encodeURIComponent(row.stnm)}`
  if (isInIframe.value && window.parent?.openChart) {
    window.parent.openChart(url, row.stnm + '水位过程线', '1200@620')
  } else {
    window.open(url)
  }
}

// ========== 导出 ==========
function doExport() {
  ElMessage.info('导出功能 — 对接后端导出接口')
}

// ========== 生命周期 ==========
function resizeTable() {
  tableHeight.value = window.innerHeight - 260
}

onMounted(() => {
  resizeTable()
  window.addEventListener('resize', resizeTable)
  doSearch()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeTable)
})
</script>

<style scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  overflow: hidden;
}

/* ===== 表格区域 ===== */
.table-wrap {
  flex: 1;
  margin: 12px 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}
.table-header .title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
.table-header .unit {
  font-size: 12px;
  color: #999;
  font-weight: normal;
}
.table-header .count {
  font-size: 12px;
  color: #999;
}

/* ===== 水位预警 ===== */
.warn { color: #f56c6c; font-weight: bold; }
.normal { color: #333; }

/* ===== 分页 ===== */
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #f0f0f0;
}
</style>
