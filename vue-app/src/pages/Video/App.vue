<template>
  <div class="page">
    <!-- 左侧：监控点列表 -->
    <div class="left">
      <div class="panel-title">视频监控点（{{ list.length }}）</div>
      <div class="search">
        <el-input v-model="kw" placeholder="搜索名称" clearable @input="doSearch" />
      </div>
      <ul class="video-list">
        <li
          v-for="item in list"
          :key="item.id"
          :class="{ active: item.id === currentId }"
          @click="select(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>

    <!-- 右侧：播放器 -->
    <div class="right">
      <template v-if="currentId">
        <div class="panel-title">{{ current.name }}</div>
        <div class="player-box">
          <VideoPlayer
            :key="currentId"
            :serial="current.serial"
            :code="current.channels"
            :token="token"
            muted
            @error="onError"
          />
        </div>
      </template>
      <div v-else class="empty">请选择左侧监控点</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import { fetchVideoList } from '@/api/video.js'

// 登录 token：优先取 localStorage，为空时用默认密钥
const token = localStorage.getItem('token') || '768ADC6A9E72BFEE4891F1F98650FEEE'

const list = ref([])
const kw = ref('')
const currentId = ref('')
const current = ref({})

function select(item) {
  currentId.value = item.id
  current.value = item
}

function onError(e) {
  console.error('播放出错：', e)
}

async function doSearch() {
  const body = await fetchVideoList(token, { kwtxt: kw.value })
  list.value = body.data || []
}

onMounted(async () => {
  await doSearch()
  if (list.value.length) select(list.value[0])
})
</script>

<style scoped>
.page { display: flex; height: 100vh; padding: 16px; box-sizing: border-box; }
.left { width: 260px; border-right: 1px solid #eee; padding-right: 12px; display: flex; flex-direction: column; }
.right { flex: 1; padding-left: 16px; display: flex; flex-direction: column; }
.panel-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; }
.search { margin-bottom: 10px; }
.video-list { flex: 1; overflow: auto; list-style: none; padding: 0; margin: 0; }
.video-list li { padding: 8px 10px; cursor: pointer; border-radius: 4px; margin-bottom: 2px; font-size: 14px; }
.video-list li:hover { background: #f0f4ff; }
.video-list li.active { background: #409eff; color: #fff; }
.player-box { flex: 1; background: #000; border-radius: 4px; overflow: hidden; }
.empty { flex: 1; display: flex; align-items: center; justify-content: center; color: #999; }
</style>
