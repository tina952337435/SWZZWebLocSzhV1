import axios from 'axios'

// 后端接口地址 —— 走 vite 代理（见 vite.config.js 的 proxy）
const http = axios.create({
  baseURL: '',
  timeout: 30000,
})

/**
 * 查询视频监控点列表
 * @param {string} token 登录 token（会放进 Authorization 头，后端 TokenInterceptor 校验）
 * @param {Object} params { kwtxt=名称关键字, pattem=分类, pageindex, pagesize }
 */
export async function fetchVideoList(token, params = {}) {
  const res = await http.post(
    '/SWZZ_RTSQ_myvideo/findResult',
    {
      kwtxt: params.kwtxt || '',
      pattem: params.pattem || '',
      pageindex: params.pageindex || '1',
      pagesize: params.pagesize || '100',
    },
    {
      headers: token ? { Authorization: token } : {},
    },
  )
  return res.data
}
