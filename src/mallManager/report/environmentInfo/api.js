import request from '@/utils/request'

// 获取某个设备的温度
export function getModelDeviceByNameAndByDeviceID(data) {
  return request({
    url: '/getModelDeviceByNameAndByDeviceID',
      method: 'post',
      data
  })
}
// 根据设备名 + 设备编号  年月 查询某月数据
export function getModelHistoryData(data) {
  return request({
    url: '/getModelHistoryData',
      method: 'post',
      data
  })
}
// 每日温度
export function queryValueDay(data) {
  return request({
    url: '/queryValueDay',
      method: 'post',
      data
  })
}

// 每周温度
export function queryValueWeek(data) {
  return request({
    url: '/queryValueWeek',
    method: 'post',
    data
  })
}


// 每月温度
export function queryValueMonth(data) {
  return request({
    url: '/queryValueMonth',
    method: 'post',
    data
  })
}
