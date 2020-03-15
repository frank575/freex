export let store = null
export const sync = () => {}
export const handler = (moduleName, key) => {
  return {
    get() {
      return store ? store[moduleName][key] : null
    },
    set(val) {
      store[moduleName][key] = val
    },
  }
}
export const mapd = (moduleName, keys = []) => {
  return maps(
    keys,
    key =>
      function() {
        return this.$fx[moduleName][key]
      },
  )
}
export const mapf = (moduleName, keys = []) => {
  return maps(
    keys,
    key =>
      function(...args) {
        const module = this.$fx[moduleName]
        return module[key].apply(module, args)
      },
  )
}
export default modules => Vue => {
  const _store = {}
  const saves = {}
  for (const key in modules) {
    const module = modules[key]
    const isSave = module.save
    let curStore
    _store[key] = { $fx: _store }
    curStore = _store[key]
    isSave && (saves[key] = modules[key].data)
    for (const moduleKey in module) {
      if (moduleKey !== 'save') {
        const curModule = module[moduleKey]
        for (const contentKey in curModule) {
          const curContnet = curModule[contentKey]
          if (moduleKey === 'computed') {
            Object.defineProperty(curStore, contentKey, {
              get() {
                return curContnet.call(curStore)
              },
              enumerable: true,
            })
          } else {
            curStore[contentKey] = curContnet
            if (isSave && moduleKey === 'data') {
              Object.defineProperty(curStore, contentKey, {
                get() {
                  return curContnet
                },
                set(val) {
                  curContnet = val
                  curModule[contentKey] = val
                  console.log(val)
                  setItem()
                },
                enumerable: true,
              })
            }
          }
        }
      }
    }
  }
  // 登入注入資料
  if (Object.keys(saves).length) {
    const storage = localStorage.fx
    if (storage) {
      const compileStorage = JSON.parse(storage)
      for (let moduleKey in compileStorage) {
        const module = compileStorage[moduleKey]
        for (let key in module) {
          const value = module[key]
          _store[moduleKey] = value
        }
      }
    } else {
      setItem()
    }
  } else {
    localStorage.removeItem('fx')
  }
  new Vue({
    data() {
      return {
        $$: _store,
      }
    },
  })
  store = _store
  Vue.prototype.$fx = _store
  function setItem() {
    console.log(7)
    const saveData = {}
    for (let k in saves) {
      saveData[k] = saves[k]
    }
    localStorage.setItem('fx', JSON.stringify(saveData))
  }
}

function maps(keys, fn) {
  let result = {}
  if (keys.length) {
    keys.forEach(key => {
      const spk = key.split(/\sas\s/i)
      const fspk = spk[0]
      const lspk = spk[1]
      let fk, lk
      spk.length > 1 ? ((fk = lspk), (lk = fspk)) : ((fk = fspk), (lk = fspk))
      result[fk] = fn(lk)
    })
  }
  return result
}