import axios from 'axios'

// 后端接口地址 —— 根据实际 API 路径修改
const http = axios.create({
  baseURL: '',
  timeout: 30000,
})

/**
 * 查询水情数据
 * @param {Object} query - { endDate, endHour, typeId }
 */
export async function fetchWaterData(query) {
  const res = await http.post('/GetWaterViewNew/queryBySWNew', {
    pid: query.typeId,
    stime: `${query.endDate} 00:00:00`,
    etime: `${query.endDate} ${String(query.endHour).padStart(2, '0')}:00:00`,
  })
  return res.data
}
