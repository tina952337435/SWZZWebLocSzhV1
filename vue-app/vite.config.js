import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

/**
 * 多页面配置：
 * 每加一个新页面，在这里加一个 entry。
 * 产物输出到 ../WebUI/vue/ 目录，直接打进 WAR 包。
 */
const pages = {
  WaterList: resolve(__dirname, 'src/pages/WaterList/index.html'),
  Video: resolve(__dirname, 'src/pages/Video/index.html'),
  // 以后加页面只需加一行：
  // RainList: resolve(__dirname, 'src/pages/RainList/index.html'),
}

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // 自动导入 Vue/Element Plus API，不用手动 import
      imports: ['vue', '@vueuse/core'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      // 自动注册 Element Plus 组件，不用手动 import
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@c': resolve(__dirname, 'src/components'),
      '@a': resolve(__dirname, 'src/api'),
    },
  },

  // ===== 多页面构建入口 =====
  build: {
    // 输出到 WebUI/vue/，打包后直接打进 WAR
    outDir: resolve(__dirname, '../WebUI/vue'),
    emptyOutDir: true,
    rollupOptions: {
      input: pages,
    },
  },

  server: {
    port: 5173,
    // 开发时代理后端接口，解决跨域
    proxy: {
      // 视频接口，转发到后端（端口 8808）
      '/video': {
        target: 'http://localhost:8808',
        changeOrigin: true,
      },
      // 水情等原有接口
      '/GetWaterViewNew': {
        target: 'http://localhost:8808',
        changeOrigin: true,
      },
      // swzzrtsq 数据（视频列表等）
      '/SWZZ_RTSQ': {
        target: 'http://localhost:8808',
        changeOrigin: true,
      },
    },
  },
})
