import {
  login,
  getInfo
} from '@/api/user'
import {
  setName,
  removeName
} from '@/utils/user'
import {
  resetRouter
} from '@/router'

import {
  getModelDevice
} from "@/api/common.js";
import {getAllModelDevicesByHefei} from "@/api/hefei.js"

import Layout from '@/layout'

// const token = localStorage.getItem('token')

const getDefaultState = () => {
  return {
    name: localStorage.getItem('name'),
    // name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username
    } = userInfo
    return new Promise((resolve, reject) => {
      // login({ username: username.trim(), password: password }).then(res => {
      //   // 保存token
      //   commit('SET_TOKEN', res.token)
      //   // 页面刷新 vuex的数据会丢失，使用 localStorage
      //   localStorage.setItem('token', res.token)
      //   commit('SET_NAME', res.result.username)
      //   setName(res.token)
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      // 保存token
      // commit('SET_TOKEN', username)
      // 页面刷新 vuex的数据会丢失，使用 localStorage
      localStorage.setItem('name', username)
      commit('SET_NAME', username)
      setName(username)
      resolve()
    })
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response

  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      // console.log('=--------------')
      // logout(state.token).then(() => {
      // removeName() // must remove  token  first
      // commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      localStorage.removeItem('name')
      localStorage.removeItem('roles')
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove name
  resetName({
    commit
  }) {
    return new Promise(resolve => {
      removeName() // must remove  token  first
      commit('SET_NAME', '')
      localStorage.removeItem('name')
      commit('RESET_STATE')
      resolve()
    })
  },

  // 获取环境菜单信息
  getMenuInfo({
    commit,
    state
  }) {
    // 动态路由  合肥
    return new Promise((resolve, reject) => {
      getAllModelDevicesByHefei().then((res) => {
        const data = res.data
        // const transformedData = [];
        const catalog1Dict = {};
        // 保存一级的子路由 即二级
        const modelDeviceRouter = []
        for (const item of data) {
          if (item.Category1 === 'Electricity') {
            item.Category1 = "电"
          } else if (item.Category1 === 'Gas') {
            item.Category1  = "气"
          }
          const catalog1 = item.Category1;
          const catalog2 = item.Category2;
          const obj = {
            ID: item.Id,
            Name: item.Name,
            Building: item.Building
          };
          if (!catalog1Dict[catalog1]) {
            catalog1Dict[catalog1] = {};
          }
          if (!catalog1Dict[catalog1][catalog2]) {
            catalog1Dict[catalog1][catalog2] = [];
          }
          catalog1Dict[catalog1][catalog2].push(obj);
        }
        // const catalog1Keys = Object.keys(catalog1Dict);

        // for (let i = 0; i < catalog1Keys.length; i++) {
        //   const catalog1 = catalog1Keys[i];
        //   console.log('Catalog1:', catalog1);
        //   console.log('Index:', i);
        // }

        let catalog1Num = 0;
        let catalog2Num = 0;
        let buildingNum = 0;
        let totalNum = 0;
        // console.log("catalog1Dict=>",catalog1Dict);
        for (const catalog1 in catalog1Dict) {
          // 电
          const routeConfig = {
            path: "/catalog1" + catalog1Num,
            name: "catalog1" + catalog1Num++,
            component:Layout,
            // component: {
            //   render(c) {
            //     return c('router-view')
            //   }
            // }, // 假设路由数据中包含组件名
            meta: {
              title: catalog1,
              icon: 'dashboard'
            },
          }
          let resChildrenRouter = [];
          for (const catalog2 in catalog1Dict[catalog1]) {
            // 照明
            const objConfig = {
              path: "catalog2-" + catalog1Num + "-" + catalog2Num,
              name: "catalog2-" + catalog1Num + "-" + catalog2Num++,
              component: {
                render(c) {
                  return c('router-view')
                }
              }, // 假设路由数据中包含组件名
              meta: {
                title: catalog2,
                icon: 'dashboard'
              }
            };
            const objList = catalog1Dict[catalog1][catalog2];
            
            let resChildrenRouter2 = []
            for (const obj in objList) {
            
              const objConfig2 = {
                path: "building" + "-" + buildingNum,
                name: "building" + "-" + buildingNum++,
                component: () => import('@/mallManager/report/hefei/dong/dong'),
                meta: {
                  title: objList[obj].Building + " " + objList[obj].Name,
                  ID: objList[obj].ID,
                  Name: objList[obj].Name,
                  Building: objList[obj].Building,

                  icon: 'dashboard'
                },
                children: []
              }
              resChildrenRouter2.push(objConfig2)
            }
            objConfig.children = resChildrenRouter2
            resChildrenRouter.push(objConfig)
            
          }
       
          const totoDeviceType = {
            path: "totalcatalog1" + totalNum,
            name: "totalcatalog1" + totalNum++,
            component: () => import('@/mallManager/report/hefei/total/total'),
            meta: {
              title: '汇总',
              Name: catalog1,
              icon: 'dashboard'
            },
          };
          console.log("totoDeviceType=>", totoDeviceType);
             resChildrenRouter.push(totoDeviceType)
            routeConfig.children = resChildrenRouter;
          modelDeviceRouter.push(routeConfig)
        }
        // console.log("modelDeviceRouter=>", modelDeviceRouter);
        let menu = [
        //   {
        //   path: '/devices',
        //   component: Layout,
        //   name: 'Device',
        //   meta: {
        //     title: '设备节点',
        //     icon: 'dashboard'
        //   },
        //   children: modelDeviceRouter
        // }
        ]
        modelDeviceRouter.forEach((item) => {
          menu.push(item);
        })

        commit('SET_ROLES', menu)
        // localStorage.setItem('roles', menu)
        resolve(menu)
      }).catch(function (err) {
        reject(err);
      });
    })
    // return new Promise((resolve, reject) => {
    //   getModelDevice().then((res) => {
    //     // console.log('res =>', res)
    //     const data = res.data
    //     // const transformedData = [];
    //     const catalog1Dict = {};
    //     // 保存一级的子路由 即二级
    //     const modelDeviceRouter = []
    //     for (const item of data) {
    //       const catalog1 = item.Catalog1;
    //       const catalog2 = item.Catalog2;
    //       const obj = {
    //         ID: item.ID,
    //         Name: item.Name,
    //         Building: item.Building
    //       };
    //       if (!catalog1Dict[catalog1]) {
    //         catalog1Dict[catalog1] = {};
    //       }
    //       if (!catalog1Dict[catalog1][catalog2]) {
    //         catalog1Dict[catalog1][catalog2] = [];
    //       }
    //       catalog1Dict[catalog1][catalog2].push(obj);
    //     }
    //     // const catalog1Keys = Object.keys(catalog1Dict);

    //     // for (let i = 0; i < catalog1Keys.length; i++) {
    //     //   const catalog1 = catalog1Keys[i];
    //     //   console.log('Catalog1:', catalog1);
    //     //   console.log('Index:', i);
    //     // }

    //     let catalog1Num = 0;
    //     let catalog2Num = 0;
    //     let buildingNum = 0;
    //     let totalNum = 0;
    //     for (const catalog1 in catalog1Dict) {
        

    //       // 电
    //       const routeConfig = {
    //         path: "/catalog1" + catalog1Num,
    //         name: "catalog1" + catalog1Num++,
    //         component:Layout,
    //         // component: {
    //         //   render(c) {
    //         //     return c('router-view')
    //         //   }
    //         // }, // 假设路由数据中包含组件名
    //         meta: {
    //           title: catalog1,
    //           icon: 'dashboard'
    //         },
    //       }
    //       let resChildrenRouter = [];
    //       for (const catalog2 in catalog1Dict[catalog1]) {
    //         // 照明
    //         const objConfig = {
    //           path: "catalog2-" + catalog1Num + "-" + catalog2Num,
    //           name: "catalog2-" + catalog1Num + "-" + catalog2Num++,
    //           component: {
    //             render(c) {
    //               return c('router-view')
    //             }
    //           }, // 假设路由数据中包含组件名
    //           meta: {
    //             title: catalog2,
    //             icon: 'dashboard'
    //           }
    //         };
    //         const objList = catalog1Dict[catalog1][catalog2];
            
    //         let resChildrenRouter2 = []
    //         for (const obj in objList) {
            
    //           const objConfig2 = {
    //             path: "building" + "-" + buildingNum,
    //             name: "building" + "-" + buildingNum++,
    //             component: () => import('@/mallManager/report/device/dong/dong'),
    //             meta: {
    //               title: objList[obj].Building + " " + objList[obj].Name,
    //               ID: objList[obj].ID,
    //               Name: objList[obj].Name,
    //               Building: objList[obj].Building,

    //               icon: 'dashboard'
    //             },
    //             children: []
    //           }
    //           resChildrenRouter2.push(objConfig2)
    //         }
    //         objConfig.children = resChildrenRouter2
    //         resChildrenRouter.push(objConfig)
            
    //       }
       
    //       const totoDeviceType = {
    //         path: "totalcatalog1" + totalNum,
    //         name: "totalcatalog1" + totalNum++,
    //         component: () => import('@/mallManager/report/device/total/total'),
    //         meta: {
    //           title: '汇总',
    //           Name: catalog1,
    //           icon: 'dashboard'
    //         },
    //       };
    //       console.log("totoDeviceType=>", totoDeviceType);
    //          resChildrenRouter.push(totoDeviceType)
    //         routeConfig.children = resChildrenRouter;
    //       modelDeviceRouter.push(routeConfig)
    //     }
    //     // console.log("modelDeviceRouter=>", modelDeviceRouter);
    //     let menu = [
    //     //   {
    //     //   path: '/devices',
    //     //   component: Layout,
    //     //   name: 'Device',
    //     //   meta: {
    //     //     title: '设备节点',
    //     //     icon: 'dashboard'
    //     //   },
    //     //   children: modelDeviceRouter
    //     // }
    //     ]
    //     modelDeviceRouter.forEach((item) => {
    //       menu.push(item);
    //     })

    //     commit('SET_ROLES', menu)
    //     // localStorage.setItem('roles', menu)
    //     resolve(menu)
    //   }).catch(function (err) {
    //     reject(err);
    //   });
    // })

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
