<template>
  <div class="video-player">
    <video ref="videoEl" :muted="muted" :autoplay="autoplay" controls playsinline></video>

    <div v-if="loading" class="mask">加载中…</div>
    <div v-else-if="error" class="mask error-text">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import flvjs from 'flv.js'
import Hls from 'hls.js'

const props = defineProps({
  serial: { type: String, required: true },   // 设备编码（GB28181 20位）
  code: { type: String, required: true },     // 通道编码（GB28181 20位）
  type: { type: String, default: 'stream' },  // stream=实时 / playback=回放
  starttime: { type: String, default: '' },   // 回放开始时间 yyyy-MM-dd HH:mm:ss
  endtime: { type: String, default: '' },     // 回放结束时间
  autoplay: { type: Boolean, default: true },
  muted: { type: Boolean, default: false },   // 浏览器自动播放需静音
  apiBase: { type: String, default: '' },     // 后端地址前缀，走 vite 代理可留空
  token: { type: String, default: '' },       // 登录 token，会加进 Authorization 头
})

const emit = defineEmits(['ready', 'error'])

const videoEl = ref(null)
const loading = ref(false)
const error = ref('')

let player = null
const http = axios.create({ baseURL: props.apiBase, timeout: 30000 })

// 后端 TokenInterceptor 校验 Authorization 头，有 token 就带上（裸 JWT，不带 Bearer）
http.interceptors.request.use(config => {
  if (props.token) config.headers.Authorization = props.token
  return config
})

// 调后端拿播放地址（后端会返回经 Nginx 代理的 http-flv / hls 地址）
async function fetchPlayUrl() {
  const isPlayback = props.type === 'playback'
  const params = { serial: props.serial, code: props.code }
  if (isPlayback) {
    params.starttime = props.starttime
    params.endtime = props.endtime
  }
  const res = await http.get(isPlayback ? '/video/getPlaybackUrl' : '/video/getPlayUrl', { params })
  const body = res.data || {}
  const data = body.data || {}
  const url = data.recommended || data.flv || data.hls || data.wsFlv
  if (!url) throw new Error(body.message || '未获取到播放地址')
  return url
}

function destroyPlayer() {
  if (player) {
    try { player.destroy() } catch (e) {}
    player = null
  }
}

function play(url) {
  destroyPlayer()
  const el = videoEl.value

  // 回放 / m3u8 走 HLS（可拖进度）
  if (props.type === 'playback' || /\.m3u8($|\?)/.test(url)) {
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(el)
      hls.on(Hls.Events.MANIFEST_PARSED, () => { if (props.autoplay) el.play().catch(() => {}) })
      hls.on(Hls.Events.ERROR, (_e, data) => { if (data.fatal) error.value = '视频流中断' })
      player = hls
    } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
      el.src = url
      el.play().catch(() => {})
    } else {
      throw new Error('浏览器不支持 HLS')
    }
    return
  }

  // 实时走 http-flv
  if (flvjs.isSupported()) {
    const flv = flvjs.createPlayer({ type: 'flv', url, isLive: true }, { enableStashBuffer: true })
    flv.attachMediaElement(el)
    flv.load()
    if (props.autoplay) flv.play().catch(() => {})
    player = flv
  } else {
    throw new Error('浏览器不支持 flv.js')
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const url = await fetchPlayUrl()
    play(url)
    emit('ready', url)
  } catch (e) {
    error.value = e.message || '播放失败'
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

// 暴露 reload，供"重新播放"按钮调用（on-demand 流过期后重新取地址）
defineExpose({ reload: load })

onMounted(load)
watch(() => [props.serial, props.code, props.type, props.starttime, props.endtime], load)
onBeforeUnmount(destroyPlayer)
</script>

<style scoped>
.video-player { position: relative; width: 100%; height: 100%; background: #000; }
.video-player video { width: 100%; height: 100%; display: block; }
.mask { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; background: rgba(0, 0, 0, .6); font-size: 14px; }
.error-text { color: #ff6b6b; }
</style>
