import Immutable from 'immutable'
import { pmfl, type } from 'pmfl'

const create = () => {

  let fro = {}
  fro.id = {}
  fro.logic = {}
  fro.state = {}
  fro.ref = {}
  let changeId = Immutable.List([])
  let virtualData = Immutable.Map({})
  let realData = Immutable.Map({})
  let realDataFunc = Immutable.Map({})
  let logicList = Immutable.List([])
  let repeatCount = 1
  const add = (func, otherName) => {
    const tempFunc = (...args) => {
      if (logicList.size !== 0) {
        let condition = logicList.first()
        logicList = logicList.shift()
        if (condition === false) {
          return fro.logic
        }
      }
      if (repeatCount <= 1) {
        repeatCount = 1
      }
      else {
        let tempCount = repeatCount
        repeatCount = 1
        for (let i = 0; i <= tempCount - 2; i++) {
          let result = func(fro.id, virtualData.toJS(), ...args)
          pmfl.make2().add([type.array], (data) => {
            for (let i = 0; i < data.length; i += 2) {
              if (data[i] !== undefined && data[i + 1] !== undefined) {
                virtualData = virtualData.set(data[i], data[i + 1])
                if (!changeId.includes(data[i]))
                  changeId = changeId.push(data[i])
              }
            }
          }).add([type.object], (data) => {
            let changeData = Immutable.Map(data)
            virtualData = virtualData.mergeDeep(changeData)
            changeData.map((value, key) => {
              if (!changeId.includes(key))
                changeId = changeId.push(key)
              return value
            })
          }).match([type.of(result)], result)
        }
      }
      let result = func(fro.id, virtualData.toJS(), ...args)
      pmfl.make2().add([type.array], (data) => {
        for (let i = 0; i < data.length; i += 2) {
          if (data[i] !== undefined && data[i + 1] !== undefined) {
            virtualData = virtualData.set(data[i], data[i + 1])
            if (!changeId.includes(data[i]))
              changeId = changeId.push(data[i])
          }
        }
      }).add([type.object], (data) => {
        let changeData = Immutable.Map(data)
        virtualData = virtualData.mergeDeep(changeData)
        changeData.map((value, key) => {
          if (!changeId.includes(key))
            changeId = changeId.push(key)
          return value
        })
      }).match([type.of(result)], result)
      return fro.logic
    }
    //undefined
    pmfl.make2().add((data) => {
      if (data[0] === undefined)
        return true
    }, (data) => {
      let [logic, func, , tempFunc] = data
      logic[func.name] = tempFunc
    }).neither((data) => {
      let [logic, , otherName, tempFunc] = data
      logic[otherName] = tempFunc
    }).match([otherName], [fro.logic, func, otherName, tempFunc])
    return fro
  }
  const remove = (...args) => {
    args.map((str) => {
      fro.logic[str] = undefined
      return
    })
    return fro
  }
  const clear = () => {
    fro.logic = {}
    return fro
  }
  const set = (str, data) => {
    pmfl.make2().add([false], (data) => {
      let [str1, data1] = data
      virtualData = virtualData.set(str1, data1)
    }).match([virtualData.has(str)], [str, data])
    return fro
  }
  const link = (str, dataArray) => {
    virtualData = virtualData.set(str, dataArray[0])
    realData = realData.set(str, dataArray[0])
    realDataFunc = realDataFunc.set(str, dataArray[1])
    fro.state = realData.toJS()
    return fro
  }
  // const linkClass = (str, data, func) => {
  //   virtualData = virtualData.set(str, data)
  //   realData = realData.set(str, data)
  //   realDataFunc = realDataFunc.set(str, func)
  //   fro.state = realData.toJS()
  //   return fro
  // }
  const setId = (...args) => {
    args.map((str) => {
      fro.id[str] = str
    })
    return fro
  }
  const removeId = (...args) => {
    args.map((str) => {
      fro.id[str] = undefined
    })
    return fro
  }
  const clearId = () => {
    fro.id = {}
    return fro
  }
  const setRef = (str, dom) => {
    fro.ref[str] = dom
    return fro
  }
  const removeRef = (str) => {
    fro.ref[str] = undefined
    return fro
  }
  const clearRef = () => {
    fro.ref = {}
    return fro
  }
  const log = () => {
    console.info("id", fro.id)
    console.info("ref", fro.ref)
    console.info("logic", fro.logic)
    console.info("state", fro.state)
    return fro
  }
  const apply = (...args) => {
    pmfl.make2().add([0], (data) => {
      changeId.map((value) => {
        if (realDataFunc.has(value)) {
          realDataFunc.get(value)(virtualData.get(value))
        }
      })
    }).neither((data) => {
      data.map((arg) => {
        return realDataFunc.has(arg) ? realDataFunc.get(arg)(virtualData.get(arg)) : {}
      })
    }).match([args.length], args)
    fro.state = realData.toJS()
    return fro.logic
  }
  const ifonly = (condition) => {
    if (condition) {
      logicList = logicList.push(true)
    }
    else {
      logicList = logicList.push(false)
    }
    return fro.logic
  }
  const ifelse = (condition) => {
    if (condition) {
      logicList = logicList.push(true, false)
    }
    else {
      logicList = logicList.push(false, true)
    }
    return fro.logic
  }
  const ifAll = (condition) => {
    let tempArray = []
    if (condition) {
      for (let i = 0; i < 1024; i++) {
        tempArray.push(true)
      }
    }
    else {
      for (let i = 0; i < 1024; i++) {
        tempArray.push(false)
      }
    }
    logicList = Immutable.List(tempArray)
    return fro.logic
  }
  const endIf = () => {
    logicList = Immutable.List([])
    return fro.logic
  }
  const repeat = (times) => {
    if (type.of(times) === type.number)
      repeatCount = times
    return fro.logic
  }

  fro.add = add
  fro.remove = remove
  fro.clear = clear
  fro.set = set
  fro.link = link
  // fro.linkClass = linkClass
  fro.setId = setId
  fro.removeId = removeId
  fro.clearId = clearId
  fro.setRef = setRef
  fro.removeRef = removeRef
  fro.clearRef = clearRef
  fro.log = log
  fro.logic.apply = apply
  fro.logic.ifonly = ifonly
  fro.logic.ifelse = ifelse
  fro.logic.ifAll = ifAll
  fro.logic.endIf = endIf
  fro.logic.repeat = repeat

  return fro
}
let fro = create()
fro.create = create
export default fro
