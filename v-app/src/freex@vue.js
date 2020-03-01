// // Freex v0.0.0

// const Freex = (() => {
//   /**
//    * sync callback
//    */
//   function callbackSync() {
//     const syncCallback = localStorage.getItem('syncCallback')
//     if (syncCallback) {
//       const { methodName, path, param } = JSON.parse(syncCallback)
//       return this[methodName](path, param)
//     }
//   }

//   /**
//    * 建立 _modulesMap 資料
//    *
//    * @param {*} stateKey (string) _rootModules.state.key
//    */
//   function add(stateKey) {
//     const curStore = this._rootModules[stateKey]
//     const mapKeys = mapsKey => {
//       let keys = []
//       for (let k in curStore[mapsKey]) {
//         keys.push(k)
//       }
//       return keys
//     }
//     const mapModules = mapsKey => {
//       let keys = []
//       for (let k in curStore[mapsKey]) {
//         const path = `${stateKey}/${k}`
//         keys.push(path)
//       }
//       return keys
//     }
//     this._modulesMap[stateKey] = {}
//     const mapsStore = this._modulesMap[stateKey]
//     mapsStore.state = curStore.state ? Object.keys(curStore.state) : []
//     mapsStore.getters = mapKeys('getters')
//     mapsStore.actions = mapKeys('actions')
//     mapsStore.mutations = mapKeys('mutations')
//     if (curStore.modules) {
//       mapsStore.modules = mapModules('modules')
//     }
//   }

//   /**
//    * 取出相應的 _rootModules 模塊
//    *
//    * @param {*} storeModules ({ storeName: storeKeys<String>[] || ['*'] }) _rootModules module
//    * @param {*} fn (Function) vuex 方法，mapState, mapActions...
//    * @param {*} mapsKey (string) _modulesMap 的 key
//    * @returns
//    */
//   // function maps(storeModules, fn, mapsKey) {
//   //   let keys = {}
//   //   const recursiveMaps = (key, isSet, customData) => {
//   //     const mapsStore = _modulesMap[key]
//   //     const mapsStoreModules = mapsStore.modules
//   //     if (mapsStore) {
//   //       if (isSet) {
//   //         const customLen = customData.length
//   //         const mapsData =
//   //           customLen && customData[0] !== '*' ? customData : mapsStore[mapsKey]
//   //         keys = {
//   //           ...keys,
//   //           ...fn(key, mapsData),
//   //         }
//   //         if (mapsStoreModules && customLen === 0) {
//   //           mapsStoreModules.forEach(path => {
//   //             recursiveMaps(path, isSet, customData)
//   //           })
//   //         }
//   //       }
//   //     }
//   //   }
//   //   for (let k in storeModules) {
//   //     const curModule = storeModules[k]
//   //     let storeKeys
//   //     let customData = []
//   //     if (Array.isArray(curModule)) {
//   //       storeKeys = {}
//   //       curModule.forEach(e => {
//   //         storeKeys[e] = true
//   //       })
//   //     } else {
//   //       storeKeys = curModule
//   //       customData = curModule[mapsKey]
//   //     }
//   //     recursiveMaps(k, storeKeys['*'] || storeKeys[mapsKey], customData)
//   //   }
//   //   return keys
//   // }

//   /**
//    * 注入要儲存的資料到 storage 裡
//    */
//   function setStorageData() {
//     if (Object.keys(this._saves).length === 0) {
//       let watchState = {}
//       for (let k in this._rootModules) {
//         const curStore = this._rootModules[k]
//         const saves = curStore.saves
//         if (Array.isArray(saves)) {
//           const state = curStore.state || {}
//           let newState = {}
//           if (saves.length === 1 && saves[0] === '*') {
//             newState = state
//           } else {
//             saves.forEach(k => {
//               Object.defineProperty(watchState, k, {
//                 get() {
//                   return state[k]
//                 },
//                 enumerable: true,
//               })
//             })
//             newState = watchState
//           }
//           this._saves[k] = newState
//         }
//       }
//     }
//     localStorage.setItem('freex', JSON.stringify(this._saves))
//   }

//   /**
//    * 將 forever 的值塞到 vuex 裡
//    *
//    * @param {*} data
//    */
//   function setForeverDataToState(data) {
//     for (let k in data) {
//       const curData = data[k]
//       for (let sk in curData) {
//         this._rootModules[k].state[sk] = curData[sk]
//       }
//     }
//   }

//   /**
//    * 刷新頁面儲存 state 資料
//    */
//   function saveForever() {
//     const storageData = localStorage.getItem('freex')
//     const compileData = storageData ? JSON.parse(storageData) : {}
//     const refreshFuncs = () => {
//       setStorageData.call(this)
//       localStorage.removeItem('syncCallback')
//     }
//     let setForeverDataToStateTimer = null
//     let isSet = false
//     let isFirst = true
//     if (this._isPrivate) {
//       Object.defineProperty(this._mounted, '$$is', {
//         get() {
//           return this._mounted.is
//         },
//         set(reslove) {
//           this._mounted.$reslove = reslove
//           return
//         },
//       })
//     } else if (this._isPublic) {
//       this._mounted.is = true
//     }
//     if (Object.keys(compileData).length) {
//       isFirst = false
//       this._mounted.is = true
//       setForeverDataToState.call(this, compileData)
//       if (this._isPrivate) {
//         localStorage.removeItem('freex')
//       }
//     } else {
//       localStorage.setItem('fcall', new Date())
//       localStorage.removeItem('fcall')
//     }
//     if (this._isPrivate) {
//       window.addEventListener(`storage`, e => {
//         if (e.key === 'freex' && e.newValue !== null) {
//           if (setForeverDataToStateTimer === null) {
//             const set = () => {
//               const data = JSON.parse(e.newValue)
//               setForeverDataToState.call(this, data)
//               setForeverDataToStateTimer = null
//               isSet = false
//               localStorage.removeItem('freex')
//               callbackSync.call(this)
//             }
//             if (isFirst) {
//               isFirst = false
//               set()
//               if (this._mounted.is === false) {
//                 this._mounted.is = true
//                 this._mounted.$reslove()
//               }
//             } else {
//               setForeverDataToStateTimer = setTimeout(set, 0)
//             }
//           }
//         }
//         if (e.key === 'fcall') {
//           if (!isSet) {
//             isSet = true
//             setStorageData.call(this)
//           }
//         }
//       })
//     } else if (this._isPublic) {
//       window.addEventListener(`storage`, e => {
//         if (e.key === 'syncPublic' && e.newValue !== null) {
//           const storage = localStorage.getItem('freex')
//           const data = storage ? JSON.parse(storage) : {}
//           setForeverDataToState.call(this, data)
//           callbackSync.call(this)
//         }
//       })
//     }
//     window.addEventListener(`beforeunload`, refreshFuncs)
//   }

//   /**
//    * 塞 _rootGetters 值進去
//    *
//    * @param {*} _path (string) "modules/值"路徑
//    * @param {*} getters (Object) getters
//    * @returns
//    */
//   function setRootGetters(_path, getters) {
//     const curStore = this._rootModules[_path]
//     const state = curStore.state
//     let curGetters = curStore.getters
//     let curModulesGetters = this._modulesGetters[_path]
//     let modulesGetters
//     if (!curModulesGetters) {
//       this._modulesGetters[_path] = {}
//     }
//     modulesGetters = this._modulesGetters[_path]
//     for (let k in getters) {
//       if (!modulesGetters[k]) {
//         const path = `${_path}/${k}`
//         Object.defineProperty(modulesGetters, k, {
//           get() {
//             return curGetters[k](state, modulesGetters)
//           },
//           enumerable: true,
//         })
//         Object.defineProperty(this._rootGetters, path, {
//           get() {
//             return modulesGetters[k]
//           },
//           enumerable: true,
//         })
//       }
//     }
//   }

//   /**
//    * 塞 _rootState 值進去，傳地址而已
//    *
//    * @param {*} moduleKey (string)
//    * @param {*} state (Object)
//    * @returns
//    */
//   function setRootState(parentPath, moduleKey, state) {
//     if (parentPath === '') {
//       return (this._rootState[moduleKey] = state)
//     } else {
//       return (this._rootState[parentPath][moduleKey] = state)
//     }
//   }

//   function setMutations(_path, mutations) {
//     for (let k in mutations) {
//       const path = `${_path}/${k}`
//       this._mutations[path] = mutations[k]
//     }
//   }

//   function setModulesState(_path, state) {
//     this._modulesState[_path] = state
//   }

//   function setActions(_path, actions) {
//     for (let k in actions) {
//       const path = `${_path}/${k}`
//       const rootModules = this._rootModules[_path]
//       const state = rootModules.state
//       const getters = this._modulesGetters[_path]
//       const ctx = {
//         state,
//         getters,
//         commit: (path, param) => this.commit(path, param),
//         rootGetters: this._rootGetters,
//         rootState: this._rootState,
//       }
//       this._actions[path] = param =>
//         new Promise(async reslove => {
//           const resData = await actions[k](ctx, param)
//           reslove(resData)
//         })
//     }
//   }

//   return class Freex {
//     constructor(modules, isSaveForever = false) {
//       this._modules = {}
//       this._modulesMap = {}
//       this._modulesGetters = {}
//       this._modulesState = {}
//       this._rootModules = {}
//       this._rootGetters = {}
//       this._rootState = {}
//       this._actions = {}
//       this._mutations = {}
//       this._reg = new RegExp('[_$A-z]*/', 'g')
//       this._useFncs = []
//       this._saves = {}
//       this._isPublic = false
//       this._isPrivate = false
//       this._mounted = {
//         is: false,
//         $reslove: null,
//       }

//       this.init(modules, isSaveForever)
//     }

//     /**
//      * 取得 state，用法同 vuex.$_rootModules.state
//      *
//      * @readonly
//      * @memberof Freex
//      */
//     get state() {
//       return this._rootState
//     }

//     /**
//      * 取得 getters，用法同 vuex.$_rootModules.getters
//      *
//      * @readonly
//      * @memberof Freex
//      */
//     get getters() {
//       return this._rootGetters
//     }

//     /**
//      * 實例化 freex
//      *
//      * @param {*} modules (modules{}) modules
//      * @param {*} isSaveForever (String | Boolean) 是否永久儲存 'public' | 'private', default false
//      */
//     init(modules, isSaveForever) {
//       const recursiveAdd = (modules, parentPath) => {
//         for (let k in modules) {
//           const curModules = modules[k]
//           const path = parentPath === '' ? k : `${parentPath}/${k}`
//           this._rootModules[path] = curModules
//           add.call(this, path)
//           setModulesState.call(this, path, curModules.state)
//           setMutations.call(this, path, curModules.mutations)
//           setRootGetters.call(this, path, curModules.getters || {})
//           setActions.call(this, path, curModules.actions)
//           setRootState.call(this, parentPath, k, curModules.state || {})
//           if (curModules.modules) {
//             recursiveAdd(curModules.modules, path, false)
//           }
//         }
//       }
//       this._modules = modules
//       recursiveAdd(modules, '')

//       if (isSaveForever) {
//         this._isPrivate = isSaveForever === 'private'
//         this._isPublic = isSaveForever === 'public'
//         saveForever.call(this)
//       }
//     }

//     /**
//      * 等到資料注入完成再渲染 vue，private 用
//      *
//      * @returns
//      * @memberof Freex
//      */
//     $mounted() {
//       return new Promise(reslove => {
//         if (this._mounted.is === false) {
//           this._mounted.$$is = reslove
//         } else {
//           reslove()
//         }
//       })
//     }

//     use(fn) {
//       this._useFncs.push(fn)
//     }

//     callUseFuncs() {
//       this._useFncs.forEach(e => {
//         e()
//       })
//     }

//     /**
//      * 需要混合的 _rootModules module name
//      *
//      * @param {*} storeModules ({ storeName: storeKeys<String>[] || ['*'] }) _rootModules module
//      * @returns mixinsData
//      */
//     // mixins(storeModules) {
//     //   return {
//     //     computed: {
//     //       ...maps(storeModules, mapState, 'state'),
//     //       ...maps(storeModules, mapGetters, 'getters'),
//     //     },
//     //     methods: {
//     //       ...maps(storeModules, mapMutations, 'mutations'),
//     //       ...maps(storeModules, mapActions, 'actions'),
//     //     },
//     //   }
//     // }

//     /**
//      * 雙向綁定 vuex 數據
//      *
//      * @param {*} modulePath (string) modulePath
//      * @returns state getter, setter
//      */
//     // handler(path) {
//     //   return {
//     //     get() {
//     //       return _rootModules[modulePath].state[keyName]
//     //     },
//     //     set(value) {
//     //       return (_rootModules[modulePath].state[keyName] = value)
//     //     },
//     //   }
//     // }

//     /**
//      * 同步所有分頁的資料，必須啟用 saveForever
//      *
//      * @param {*} methodName (string) 'commit' | 'dispatch'
//      * @param {*} path (string) module path
//      * @param {*} param (func 以外) 不接受 function, 其他參數皆可
//      * @memberof Freex
//      */
//     sync(methodName, path, param) {
//       if (methodName && path) {
//         localStorage.setItem(
//           'syncCallback',
//           JSON.stringify({
//             methodName,
//             path,
//             param,
//           }),
//         )
//       }
//       if (this._isPrivate || this._isPublic) {
//         setStorageData.call(this)
//         if (this._isPublic) {
//           localStorage.setItem('syncPublic', '1')
//           localStorage.removeItem('syncPublic')
//         }
//       }
//     }

//     /**
//      * 更改 state
//      *
//      * @param {*} path (string) "modules/值"路徑
//      * @param {*} value (any) 預改變的值
//      * @returns
//      */
//     set(_path, value) {
//       const key = _path.replace(this._reg, '')
//       const path = _path.replace(key, '')
//       const newPath = path.substr(0, path.length - 1)
//       if (newPath) {
//         const state = this._modulesState[newPath]
//         if (state) {
//           return (state[key] = value)
//         } else {
//           return console.error(`Freex [set error] ${_path} not found!`)
//         }
//       } else {
//         return console.error(`Freex [set error] ${_path} not found!`)
//       }
//     }

//     /**
//      * 同 $_rootModules.commit
//      *
//      * @param {*} path (string) "modules/值"路徑
//      * @param {*} param (any) commit param
//      * @returns
//      */
//     commit(_path, param) {
//       const fn = this._mutations[_path]
//       if (fn) {
//         const key = _path.replace(this._reg, '')
//         const path = _path.replace(key, '')
//         const newPath = path.substr(0, path.length - 1)
//         this.callUseFuncs()
//         return fn(this._modulesState[newPath], param)
//       } else {
//         console.error(`Freex [commit error] ${path} not found!`)
//       }
//     }

//     /**
//      * 同 $_rootModules.dispatch
//      *
//      * @param {*} path (string) "modules/值"路徑
//      * @param {*} param (any) commit param
//      * @returns
//      * @memberof Freex
//      */
//     dispatch(path, param) {
//       const fn = this._actions[path]
//       if (fn) {
//         this.callUseFuncs()
//         return this._actions[path](param)
//       } else {
//         console.error(`Freex [dispatch error] ${path} not found!`)
//       }
//     }
//   }
// })()

// // export default Freex

// Freex v0.0.0

let $$freex = null
let Vue = null

/**
 * sync callback
 */
function callbackSync() {
  const freexCbSync = localStorage.getItem('freexCbSync')
  if (freexCbSync) {
    const { methodName, path, param } = JSON.parse(freexCbSync)
    return this[methodName](path, param)
  }
}

/**
 * 注入要儲存的資料到 storage 裡
 */
function setStorageData() {
  if (Object.keys(this._saves).length === 0) {
    let watchState = {}
    for (let k in this._rootModules) {
      const curStore = this._rootModules[k]
      const saves = curStore.saves
      if (saves) {
        const state = curStore.state || {}
        watchState[k] = {}
        saves.forEach(sk => {
          Object.defineProperty(watchState[k], sk, {
            get() {
              return state[sk] || ''
            },
            enumerable: true,
          })
        })
        this._saves = watchState
      }
    }
  }
  localStorage.setItem('freex', JSON.stringify(this._saves))
}

/**
 * 將 forever 的值塞到 vuex 裡
 *
 * @param {*} data
 */
function setForeverDataToState(data) {
  for (let k in data) {
    const curData = data[k]
    for (let sk in curData) {
      this._rootModules[k].state[sk] = curData[sk]
    }
  }
}

/**
 * 刷新頁面儲存 state 資料
 */
function saveForever() {
  const storageData = localStorage.getItem('freex')
  const compileData = storageData ? JSON.parse(storageData) : {}
  const refreshFuncs = () => {
    setStorageData.call(this)
    localStorage.removeItem('freexCbSync')
  }
  if (Object.keys(compileData).length) {
    setForeverDataToState.call(this, compileData)
  }
  window.addEventListener(`storage`, e => {
    if (e.key === 'freexCallSync' && e.newValue !== null) {
      const storage = localStorage.getItem('freex')
      const data = storage ? JSON.parse(storage) : {}
      setForeverDataToState.call(this, data)
      callbackSync.call(this)
    }
  })
  window.addEventListener(`beforeunload`, refreshFuncs)
}

/**
 * 塞 _rootGetters 值進去
 *
 * @param {*} _path (string) "modules/值"路徑
 * @param {*} getters (Object) getters
 * @returns
 */
function setRootGetters(_path, getters) {
  const vm = this
  const curStore = this._rootModules[_path]
  let curGetters = curStore.getters
  let curModulesGetters = this._modulesGetters[_path]
  let modulesGetters
  if (!curModulesGetters) {
    this._modulesGetters[_path] = {}
  }
  modulesGetters = this._modulesGetters[_path]
  for (let k in getters) {
    if (!modulesGetters[k]) {
      const path = `${_path}/${k}`
      Object.defineProperty(modulesGetters, k, {
        get() {
          return curGetters[k].call(vm._freexModules[_path])
        },
        enumerable: true,
      })
      Object.defineProperty(this._rootGetters, path, {
        get() {
          return modulesGetters[k]
        },
        enumerable: true,
      })
    }
  }
}

/**
 * 塞 _rootState 值進去，傳地址而已
 *
 * @param {*} moduleKey (string)
 * @param {*} state (Object)
 * @returns
 */
function setRootState(parentPath, moduleKey, state) {
  if (parentPath === '') {
    return (this._rootState[moduleKey] = state)
  } else {
    return (this._rootState[parentPath][moduleKey] = state)
  }
}

function setMutations(_path, mutations) {
  for (let k in mutations) {
    const path = `${_path}/${k}`
    this._mutations[path] = mutations[k]
  }
}

function setModulesState(_path, state) {
  this._modulesState[_path] = state
}

function setActions(_path, actions) {
  for (let k in actions) {
    const path = `${_path}/${k}`
    this._actions[path] = _params =>
      new Promise(async reslove => {
        const resData = await actions[k].apply(
          this._freexModules[_path],
          _params,
        )
        reslove(resData)
      })
  }
}

function callUseFunc() {
  const { _useFnc } = this
  _useFnc && _useFnc()
}

export function get () {
    return $$freex
}

class Freex {
  constructor(modules, options = {}) {
    this._modules = {}
    this._modulesGetters = {}
    this._modulesState = {}
    this._rootModules = {}
    this._rootGetters = {}
    this._rootState = {}
    this._freexModules = {}
    this._actions = {}
    this._mutations = {}
    this._reg = /.*\//g
    this._useFnc = null
    this._saves = {}
    this._vm = {}

    this.init(modules, options.save ? true : false)
  }

  /**
   * 取得 state，用法同 vuex.$_rootModules.state
   *
   * @readonly
   * @memberof Freex
   */
  get state() {
    return this._vm._data.$$state
  }

  /**
   * 取得 getters，用法同 vuex.$_rootModules.getters
   *
   * @readonly
   * @memberof Freex
   */
  get getters() {
    return this._modulesGetters
  }

  /**
   * 實例化 freex
   *
   * @param {*} modules (modules{}) modules
   * @param {*} isSaveForever (Boolean)
   */
  init(modules, isSaveForever) {
    const recursiveAdd = (modules, parentPath) => {
      for (let k in modules) {
        const curModules = modules[k]
        const path = parentPath === '' ? k : `${parentPath}/${k}`
        this._rootModules[path] = curModules
        setModulesState.call(this, path, curModules.state)
        setMutations.call(this, path, curModules.mutations)
        setRootGetters.call(this, path, curModules.getters || {})
        setActions.call(this, path, curModules.actions)
        setRootState.call(this, parentPath, k, curModules.state || {})
        this._freexModules[path] = new FreexModule(path, k, this)
        if (curModules.modules) {
          recursiveAdd(curModules.modules, path, false)
        }
      }
    }
    this._modules = modules
    recursiveAdd(modules, '')

    if (isSaveForever) {
      saveForever.call(this)
    }

    this._vm = new Vue({
      data: {
        $$state: this._rootState,
      },
    })
  }

  use(fn) {
    if (typeof fn !== 'function') {
      return console.error(`Freex [use 錯誤提示] 參數只能是方法`)
    }
    this._useFnc = fn.bind(this)
  }

  /**
   * 同步所有分頁的資料，必須啟用 saveForever
   *
   * @param {*} methodName (string) 'commit' | 'dispatch'
   * @param {*} path (string) module path
   * @param {*} param (func 以外) 不接受 function, 其他參數皆可
   * @memberof Freex
   */
  sync(methodName, path, param) {
    setStorageData.call(this)
    if (methodName && path) {
      localStorage.setItem(
        'freexCbSync',
        JSON.stringify({
          methodName,
          path,
          param,
        }),
      )
      localStorage.setItem('freexCallSync', '1')
      localStorage.removeItem('freexCallSync')
    }
  }

  /**
   * 更改 state
   *
   * @param {*} path (string) "modules/值"路徑
   * @param {*} value (any) 預改變的值
   * @returns
   */
  set(_path, value) {
    const key = _path.replace(this._reg, '')
    const path = _path.replace(key, '')
    const newPath = path.substr(0, path.length - 1)
    if (newPath) {
      const state = this._modulesState[newPath]
      if (state) {
        return (state[key] = value)
      } else {
        return console.error(`Freex [set 錯誤提示] ${_path} 找不到路徑，請確認`)
      }
    } else {
      return console.error(`Freex [set 錯誤提示] ${_path} 找不到路徑，請確認`)
    }
  }

  /**
   * 同 $_rootModules.commit
   *
   * @param {*} path (string) "modules/值"路徑
   * @param {*} param (any) commit param
   * @returns
   */
  commit(_path, ..._params) {
    const fn = this._mutations[_path]
    if (fn) {
      const key = _path.replace(this._reg, '')
      const path = _path.replace(key, '')
      const newPath = path.substr(0, path.length - 1)
      callUseFunc.call(this)
      return fn.apply(this._freexModules[newPath], _params)
    } else {
      console.error(`Freex [commit 錯誤提示] ${_path} 找不到路徑，請確認`)
    }
  }

  /**
   * 同 $_rootModules.dispatch
   *
   * @param {*} path (string) "modules/值"路徑
   * @param {*} param (any) commit param
   * @returns
   * @memberof Freex
   */
  dispatch(path, ...params) {
    const fn = this._actions[path]
    if (fn) {
      callUseFunc.call(this)
      return this._actions[path](params)
    } else {
      console.error(`Freex [dispatch 錯誤提示] ${path} 找不到路徑，請確認`)
    }
  }
}

class FreexModule {
  constructor(_rootPath, _curPath, freex) {
    this._curPath = _curPath
    this._rootPath = _rootPath + '/'
    this.$fx = freex
  }
  get state() {
    return this.$fx._rootModules[this._curPath].state
  }
  get getters() {
    return this.$fx._modulesGetters[this._curPath]
  }
  get $parent() {
    const path = this._rootPath.replace(`/${this._curPath}/`, '')
    if (this._rootPath === path) {
      // return this.$fx
      return null
    } else {
      return this.$fx._freexModules[path]
    }
  }
  commit(path, param) {
    return this.$fx.commit(this._rootPath + path, param)
  }
  dispatch(path, param) {
    return this.$fx.dispatch(this._rootPath + path, param)
  }
}

export default (() => {
  return (_Vue, { store, name = 'fx' }) => {
    Vue = _Vue
    const freex = new Freex(store)
    $$freex = freex
    _Vue.prototype['$' + name] = freex
  }
})()
