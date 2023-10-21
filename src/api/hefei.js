import request from '@/utils/request'
// 合肥

// 动态路由 22栋
export function getAllModelDevicesByHefei(data) {
  return request({
    url: '/getAllModelDevices',
    method: 'post',
    data
  })
}

// 获取当前设备信息
export function getDevicesByID(data) {
  return request({
    url: '/getModelDevicesByID',
    method: 'post',
    data
  })
}


/*================汇总================*/

/*===========月报表============*/
                    // 电
// 月报表  总的 数据展示 获取对应月份得设备用电数据
export function getAllDevicesMonthReportToElectricityDetail(data) {
  return request({
    url: '/getAllModelDevicesMonthReportToElectricityDetail',
    method: 'post',
    data
  })
}

// 月报表 总的 获取对应月份的电的使用量
export function getAllDevicesMonthReportToElectricity(data) {
  return request({
    url: '/getAllModelDevicesMonthReportToElectricity',
    method: 'post',
    data
  })
}

// 月报表 总的 对应月份设备用电排序
export function getSortDevicesMonthReportToElectricity(data) {
  return request({
    url: '/getSortModelDevicesMonthReportToElectricity',
    method: 'post',
    data
  })
}

// 月报表 总的， 用电成分图 比例
export function getIngredientDevicesMonthReportToElectricity(data) {
  return request({
    url: '/getIngredientModelDevicesMonthReportToElectricity',
    method: 'post',
    data
  })
}

// 气
// 月报表  总的 数据展示 获取对应月份得设备用气数据
export function getAllDevicesMonthReportToGasDetail(data) {
  return request({
    url: '/getAllDevicesMonthReportToGasDetail',
    method: 'post',
    data
  })
}

// 月报表 总的 获取对应月份的气的使用量
export function getAllDevicesMonthReportToGas(data) {
  return request({
    url: '/getAllDevicesMonthReportToGas',
    method: 'post',
    data
  })
}

// 月报表 总的 对应月份设备用气排序
export function getSortDevicesMonthReportToGas(data) {
  return request({
    url: '/getSortDevicesMonthReportToGas',
    method: 'post',
    data
  })
}

// 月报表 总的， 用气成分图 比例
export function getIngredientDevicesMonthReportToGas(data) {
  return request({
    url: '/getIngredientDevicesMonthReportToGas',
    method: 'post',
    data
  })
}

                    /*===========周报表============*/
// 周报表  总的 数据展示 获取对应周得设备用电数据
export function getAllDevicesWeekReportToElectricityDetail(data) {
  return request({
    url: '/getAllModelDevicesWeekReportToElectricityDetail',
    method: 'post',
    data
  })
}

// 周报表 总的 获取对应周的电的使用量
export function getAllDevicesWeekReportToElectricity(data) {
  return request({
    url: "/getAllModelDevicesWeekReportToElectricity",
    method: 'post',
    data
  })
}

// 周报表 总的， 用电成分图 比例
export function getIngredientDevicesWeekReportToElectricity(data) {
  return request({
    url: '/getIngredientModelDevicesWeekReportToElectricity',
    method: 'post',
    data
  })
}

// 周报表 总的 对应月份设备用电排序
export function getSortDevicesWeekReportToElectricity(data) {
  return request({
    url: '/getSortModelDevicesWeekReportToElectricity',
    method: 'post',
    data
  })
}

// 周报表  总的 数据展示 获取对应周得设备用气数据
export function getAllDevicesWeekReportToGasDetail(data) {
  return request({
    url: '/getAllDevicesWeekReportToGasDetail',
    method: 'post',
    data
  })
}

// 周报表 总的 获取对应周的气的使用量
export function getAllDevicesWeekReportToGas(data) {
  return request({
    url: "/getAllDevicesWeekReportToGas",
    method: 'post',
    data
  })
}

// 周报表 总的， 用气成分图 比例
export function getIngredientDevicesWeekReportToGas(data) {
  return request({
    url: '/getIngredientDevicesWeekReportToGas',
    method: 'post',
    data
  })
}

// 周报表 总的 对应月份设备用气排序
export function getSortDevicesWeekReportToGas(data) {
  return request({
    url: '/getSortDevicesWeekReportToGas',
    method: 'post',
    data
  })
}
                  /*===========日报表============*/
// 日报表  总的 数据展示 获取对应日得设备用电数据
export function getAllDevicesDayReportToElectricityDetail(data) {
  return request({
    url: '/getAllModelDevicesDayReportToElectricityDetail',
    method: 'post',
    data
  })
}

// 日报表 总的 获取所在日期得电得使用量
export function getAllDevicesDayReportToElectricity(data) {
  return request({
    url: '/getAllModelDevicesDayReportToElectricity',
    method: 'post',
    data
  })
}
// 日报表 总的 对应日期设备用电排序
export function getSortDevicesDayReportToElectricity(data) {
  return request({
    url: '/getSortModelDevicesDayReportToElectricity',
    method: 'post',
    data
  })
}

// 日报表 总的， 用电成分图 比例
export function getIngredientDevicesDayReportToElectricity(data) {
  return request({
    url: '/getIngredientModelDevicesDayReportToElectricity',
    method: 'post',
    data
  })
}

// 日报表  总的 数据展示 获取对应日得设备用气数据
export function getAllDevicesDayReportToGasDetail(data) {
  return request({
    url: '/getAllDevicesDayReportToGasDetail',
    method: 'post',
    data
  })
}

// 日报表 总的 获取所在日期得气得使用量
export function getAllDevicesDayReportToGas(data) {
  return request({
    url: '/getAllDevicesDayReportToGas',
    method: 'post',
    data
  })
}
// 日报表 总的 对应日期设备用气排序
export function getSortDevicesDayReportToGas(data) {
  return request({
    url: '/getSortDevicesDayReportToGas',
    method: 'post',
    data
  })
}

// 日报表 总的， 用气成分图 比例
export function getIngredientDevicesDayReportToGas(data) {
  return request({
    url: '/getIngredientDevicesDayReportToGas',
    method: 'post',
    data
  })
}
/*================设备================*/

                   /*===========月报表============*/
// 月报表   数据展示 获取对应月对应设备得用电数据
export function getDevicesMonthReportToElectricityDetail(data) {
  return request({
    url: '/getModelDevicesMonthReportToElectricityDetail',
    method: 'post',
    data
  })
}

// 月报表 获取当前的设备对应月份的电的使用量
export function getDevicesMonthReportToElectricity(data) {
  return request({
    url: '/getModelDevicesMonthReportToElectricity',
    method: 'post',
    data
  })
}

// 月报表   数据展示 获取对应月对应设备得用气数据
export function getDevicesMonthReportToGasDetail(data) {
  return request({
    url: '/getDevicesMonthReportToGasDetail',
    method: 'post',
    data
  })
}

// 月报表 获取当前的设备对应月份的气的使用量
export function getDevicesMonthReportToGas(data) {
  return request({
    url: '/getDevicesMonthReportToGas',
    method: 'post',
    data
  })
}
                   /*===========周报表============*/
// 周报表   数据展示 获取对应周对应设备得用电数据
export function getDevicesWeekReportToElectricityDetail(data) {
  return request({
    url: '/getModelDevicesWeekReportToElectricityDetail',
    method: 'post',
    data
  })
}

// 周报表 获取当前的设备对应周的电的使用量
export function getDevicesWeekReportToElectricity(data) {
  return request({
    url: '/getModelDevicesWeekReportToElectricity',
    method: 'post',
    data
  })
}

// 周报表   数据展示 获取对应周对应设备得用气数据
export function getDevicesWeekReportToGasDetail(data) {
  return request({
    url: '/getDevicesWeekReportToGasDetail',
    method: 'post',
    data
  })
}

// 周报表 获取当前的设备对应周的气的使用量
export function getDevicesWeekReportToGas(data) {
  return request({
    url: '/getDevicesWeekReportToGas',
    method: 'post',
    data
  })
}

                    /*===========日报表============*/
// 日报表   数据展示 获取对应日对应设备得用电数据
export function getDevicesDayReportToElectricityDetail(data) {
  return request({
    url: '/getModelDevicesDayReportToElectricityDetail',
    method: 'post',
    data
  })
}

// 日报表 设备 获取所在日期得电得使用量
export function getDevicesDayReportToElectricity(data) {
  return request({
    url: '/getModelDevicesDayReportToElectricity',
    method: 'post',
    data
  })
}

// 日报表   数据展示 获取对应日对应设备得用气数据
export function getDevicesDayReportToGasDetail(data) {
  return request({
    url: '/getDevicesDayReportToGasDetail',
    method: 'post',
    data
  })
}

// 日报表 设备 获取所在日期得气得使用量
export function getDevicesDayReportToGas(data) {
  return request({
    url: '/getDevicesDayReportToGas',
    method: 'post',
    data
  })
}