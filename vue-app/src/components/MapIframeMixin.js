/**
 * map.html 子页面通信 Mixin（Composables 风格）
 *
 * 用法：在 App.vue 的 <script setup> 中：
 *   import { useMapIframe } from '@/components/MapIframeMixin'
 *   const { isInIframe, map, doSearch } = useMapIframe({ searchFn })
 *
 * 自动在 window 上注册 _show、_hide、_destroy、ShowPage、GetMap 等方法，
 * 和现有老页面的通信接口完全兼容。
 */

import { ref } from 'vue'

export function useMapIframe({ onShow, onHide, onDestroy, onGetMap }) {
  const isInIframe = ref(window.self !== window.top)
  const map = ref(null)

  window._show = () => {
    console.log('[Vue子页面] _show 被调用')
    onShow?.()
  }

  window._hide = () => {
    console.log('[Vue子页面] _hide 被调用')
    onHide?.()
  }

  window._destroy = () => {
    console.log('[Vue子页面] _destroy 被调用')
    onDestroy?.()
  }

  window.ShowPage = () => {
    console.log('[Vue子页面] ShowPage 被调用')
    onShow?.()
  }

  window.GetMap = (mapObj, ...args) => {
    console.log('[Vue子页面] GetMap 被调用', args)
    map.value = mapObj
    onGetMap?.(mapObj, ...args)
  }

  window.TimeShowYT = () => {
    console.log('[Vue子页面] TimeShowYT 被调用')
  }

  return { isInIframe, map }
}
