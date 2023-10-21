import request from '@/utils/request'
// 获取轮播图
export function getCarouselImageList() {
  return request({
    url: '/api/system/carouselImageList',
    method: 'get'
  })
}
// 获取类目
export function getCategoryList() {
  return request({
    url: '/api/system/categoryList',
    method: 'get'
  })
}
// 获取属性
export function getAttributeList() {
  return request({
    url: '/api/system/attributeList',
    method: 'get'
  })
}
// 获取所有用户
export function getUserList() {
  return request({
    url: '/api/system/userList',
    method: 'get'
  })
}




// 获取动态路由 12、13栋
export function getModelDevice(data) {
  return request({
    url: '/getAllDevices',
    method: 'post',
    data
  })
}


// 获取当前设备信息
export function getDevicesByID(data) {
  return request({
    url: '/getDevicesByID',
    method: 'post',
    data
  })
}
// 月报表
// 月报表 获取当前的设备对应月份的水的使用量
export function getDevicesMonthReportToWater(data) {
  return request({
    url: '/getDevicesMonthReportToWater',
    method: 'post',
    data
  })
}

// 月报表 获取当前的设备对应月份的电的使用量
export function getDevicesMonthReportToElectricity(data) {
  return request({
    url: '/getDevicesMonthReportToElectricity',
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



// 月报表 总的 获取当前的设备对应月份的水的使用量
export function getAllDevicesMonthReportToWater(data) {
  return request({
    url: '/getAllDevicesMonthReportToWater',
    method: 'post',
    data
  })
}

// 月报表 总的 获取对应月份的电的使用量
export function getAllDevicesMonthReportToElectricity(data) {
  return request({
    url: '/getAllDevicesMonthReportToElectricity',
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


// 月报表 总的 对应月份设备用水排序
export function getSortDevicesMonthReportToWater(data) {
  return request({
    url: '/getSortDevicesMonthReportToWater',
    method: 'post',
    data
  })
}

// 月报表 总的 对应月份设备用电排序
export function getSortDevicesMonthReportToElectricity(data) {
  return request({
    url: '/getSortDevicesMonthReportToElectricity',
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


// 月报表 总的， 用水成分图 比例
export function getIngredientDevicesMonthReportToWater(data) {
  return request({
    url: '/getIngredientDevicesMonthReportToWater',
    method: 'post',
    data
  })
}

// 月报表 总的， 用电成分图 比例
export function getIngredientDevicesMonthReportToElectricity(data) {
  return request({
    url: '/getIngredientDevicesMonthReportToElectricity',
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


// 周报表
// 周报表 获取当前的设备对应周的水的使用量
export function getDevicesWeekReportToWater(data) {
  return request({
    url: '/getDevicesWeekReportToWater',
    method: 'post',
    data
  })
}

// 周报表 获取当前的设备对应周的电的使用量
export function getDevicesWeekReportToElectricity(data) {
  return request({
    url: '/getDevicesWeekReportToElectricity',
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

// 周报表 总的 获取对应周的水的使用量
export function getAllDevicesWeekReportToWater(data) {
  return request({
    url: "/getAllDevicesWeekReportToWater",
    method: 'post',
    data
  })
}

// 周报表 总的 获取对应周的水电的使用量
export function getAllDevicesWeekReportToElectricity(data) {
  return request({
    url: "/getAllDevicesWeekReportToElectricity",
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

// 周报表 总的 对应月份设备用水排序
export function getSortDevicesWeekReportToWater(data) {
  return request({
    url: '/getSortDevicesWeekReportToWater',
    method: 'post',
    data
  })
}

// 周报表 总的 对应月份设备用电排序
export function getSortDevicesWeekReportToElectricity(data) {
  return request({
    url: '/getSortDevicesWeekReportToElectricity',
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


// 周报表 总的， 用水成分图 比例
export function getIngredientDevicesWeekReportToWater(data) {
  return request({
    url: '/getIngredientDevicesWeekReportToWater',
    method: 'post',
    data
  })
}

// 周报表 总的， 用电成分图 比例
export function getIngredientDevicesWeekReportToElectricity(data) {
  return request({
    url: '/getIngredientDevicesWeekReportToElectricity',
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

// 日报表 设备 获取所在日期得水得使用量
export function getDevicesDayReportToWater(data) {
  return request({
    url: '/getDevicesDayReportToWater',
    method: 'post',
    data
  })
}
// 日报表 设备 获取所在日期得电得使用量
export function getDevicesDayReportToElectricity(data) {
  return request({
    url: '/getDevicesDayReportToElectricity',
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


// 日报表 总的  获取所在日期得水得使用量
export function getAllDevicesDayReportToWater(data) {
  return request({
    url: '/getAllDevicesDayReportToWater',
    method: 'post',
    data
  })
}
// 日报表 总的 获取所在日期得电得使用量
export function getAllDevicesDayReportToElectricity(data) {
  return request({
    url: '/getAllDevicesDayReportToElectricity',
    method: 'post',
    data
  })
}
// 日报表 总的  获取所在日期得气得使用量
export function getAllDevicesDayReportToGas(data) {
  return request({
    url: '/getAllDevicesDayReportToGas',
    method: 'post',
    data
  })
}

// 日报表 总的 对应日期设备用水排序 
export function getSortDevicesDayReportToWater(data) {
  return request({
    url: '/getSortDevicesDayReportToWater',
    method: 'post',
    data
  })
}

// 日报表 总的 对应日期设备用电排序
export function getSortDevicesDayReportToElectricity(data) {
  return request({
    url: '/getSortDevicesDayReportToElectricity',
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

// 日报表 总的， 用水成分图 比例
export function getIngredientDevicesDayReportToWater(data) {
  return request({
    url: '/getIngredientDevicesDayReportToWater',
    method: 'post',
    data
  })
}

// 日报表 总的， 用电成分图 比例
export function getIngredientDevicesDayReportToElectricity(data) {
  return request({
    url: '/getIngredientDevicesDayReportToElectricity',
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



// 月报表 总的 数据展示 获取对应月份得设备用水数据
export function getAllDevicesMonthReportToWaterDetail(data) {
  return request({
    url: '/getAllDevicesMonthReportToWaterDetail',
    method: 'post',
    data
  })
}
// 月报表  总的 数据展示 获取对应月份得设备用电数据
export function getAllDevicesMonthReportToElectricityDetail(data) {
  return request({
    url: '/getAllDevicesMonthReportToElectricityDetail',
    method: 'post',
    data
  })
}
// 月报表  总的 数据展示 获取对应月份得设备用气数据
export function getAllDevicesMonthReportToGasDetail(data) {
  return request({
    url: '/getAllDevicesMonthReportToGasDetail',
    method: 'post',
    data
  })
}

// 周报表  总的 数据展示 获取对应周得设备用水数据
export function getAllDevicesWeekReportToWaterDetail(data) {
  return request({
    url: '/getAllDevicesWeekReportToWaterDetail',
    method: 'post',
    data
  })
}

// 周报表  总的 数据展示 获取对应周得设备用电数据
export function getAllDevicesWeekReportToElectricityDetail(data) {
  return request({
    url: '/getAllDevicesWeekReportToElectricityDetail',
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


// 日报表  总的 数据展示 获取对应日得设备用水数据
export function getAllDevicesDayReportToWaterDetail(data) {
  return request({
    url: '/getAllDevicesDayReportToWaterDetail',
    method: 'post',
    data
  })
}

// 日报表  总的 数据展示 获取对应日得设备用电数据
export function getAllDevicesDayReportToElectricityDetail(data) {
  return request({
    url: '/getAllDevicesDayReportToElectricityDetail',
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



// 月报表   数据展示 获取对应月对应设备得用水数据
export function getDevicesMonthReportToWaterDetail(data) {
  return request({
    url: '/getDevicesMonthReportToWaterDetail',
    method: 'post',
    data
  })
}

// 月报表   数据展示 获取对应月对应设备得用电数据
export function getDevicesMonthReportToElectricityDetail(data) {
  return request({
    url: '/getDevicesMonthReportToElectricityDetail',
    method: 'post',
    data
  })
}
// 月报表   数据展示 获取对应月对应设备得用气数据
export function getDeviceMonthReportToGasDetail(data) {
  return request({
    url: '/getDeviceMonthReportToGasDetail',
    method: 'post',
    data
  })
}

// 周报表   数据展示 获取对应周对应设备得用水数据
export function getDevicesWeekReportToWaterDetail(data) {
  return request({
    url: '/getDevicesWeekReportToWaterDetail',
    method: 'post',
    data
  })
}

// 周报表   数据展示 获取对应周对应设备得用电数据
export function getDevicesWeekReportToElectricityDetail(data) {
  return request({
    url: '/getDevicesWeekReportToElectricityDetail',
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



// 日报表   数据展示 获取对应日对应设备得用水数据
export function getDevicesDayReportToWaterDetail(data) {
  return request({
    url: '/getDevicesDayReportToWaterDetail',
    method: 'post',
    data
  })
}

// 日报表   数据展示 获取对应日对应设备得用电数据
export function getDevicesDayReportToElectricityDetail(data) {
  return request({
    url: '/getDevicesDayReportToElectricityDetail',
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