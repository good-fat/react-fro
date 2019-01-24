import Immutable from 'immutable'
import { pmfl, type } from 'pmfl'
const create = () => {
  let fro = {}
  let changed_data = Immutable.List([])
  let virtual_data = Immutable.Map({})
  let real_data = Immutable.Map({})
  let real_data_set = Immutable.Map({})
  let constant_data = Immutable.Map({})
  let ref_data = Immutable.Map({})
  let marked_data = Immutable.Map({})
  let virtual_state = {}

  fro.constant = {}
  fro.logic = {}
  fro.effect = {}
  fro.state = {}
  fro.ref = {}
  const add = (func, other_name) => {
    const temp_func = (data, condition, times) => {

      let run_flag
      pmfl.make2().add([type.undefined], () => {
        run_flag = true
      }).add([type.function], (match_data) => {
        if (match_data(fro.constant, virtual_state)) {
          run_flag = true
        }
        else {
          run_flag = false
        }
      }).neither((match_data) => {
        if (match_data) {
          run_flag = true
        }
        else {
          run_flag = false
        }
      }).match([type.of(condition)], condition)

      if (!run_flag) {
        return fro.logic
      }

      let loop_times
      pmfl.make2().add([type.number], (match_data) => {
        const temp_num = Math.floor(match_data)
        if (temp_num < 1) {
          loop_times = 1
        }
        else {
          loop_times = temp_num
        }
      }).neither(() => {
        loop_times = 1
      }).match([type.of(times)], times)

      for (let i = 0; i < loop_times; i++) {
        let result = func(data, fro.constant, virtual_state)
        pmfl.make2().add([type.array], (match_data) => {
          for (let i = 0; i < match_data.length; i += 2) {
            if (match_data[i] !== undefined && match_data[i + 1] !== undefined) {
              virtual_data = virtual_data.set(match_data[i], match_data[i + 1])
              virtual_state = virtual_data.toJS()
              if (!changed_data.includes(match_data[i]))
                changed_data = changed_data.push(match_data[i])
            }
          }
        }).add([type.object], (match_data) => {
          let temp_data = Immutable.Map(match_data)
          virtual_data = virtual_data.mergeDeep(temp_data)
          virtual_state = virtual_data.toJS()
          temp_data.map((value, key) => {
            if (!changed_data.includes(key))
              changed_data = changed_data.push(key)
            return value
          })
        }).match([type.of(result)], result)
      }
      return fro.logic
    }

    pmfl.make2().add((condition_data) => {
      if (condition_data[0] === undefined)
        return true
    }, (match_data) => {
      let [logic, func, , temp_func] = match_data
      logic[func.name] = temp_func
    }).neither((match_data) => {
      let [logic, , other_name, temp_func] = match_data
      logic[other_name] = temp_func
    }).match([other_name], [fro.logic, func, other_name, temp_func])

    return fro
  }

  const affect = (func, other_name) => {
    const temp_func = (data, condition, times) => {

      let run_flag
      pmfl.make2().add([type.undefined], () => {
        run_flag = true
      }).add([type.function], (match_data) => {
        if (match_data(fro.constant, virtual_state)) {
          run_flag = true
        }
        else {
          run_flag = false
        }
      }).neither((match_data) => {
        if (match_data) {
          run_flag = true
        }
        else {
          run_flag = false
        }
      }).match([type.of(condition)], condition)

      if (!run_flag) {
        return fro.effect
      }

      let loop_times
      pmfl.make2().add([type.number], (match_data) => {
        const temp_num = Math.floor(match_data)
        if (temp_num < 1) {
          loop_times = 1
        }
        else {
          loop_times = temp_num
        }
      }).neither(() => {
        loop_times = 1
      }).match([type.of(times)], times)

      for (let i = 0; i < loop_times; i++) {
        func(data, fro.constant, virtual_state)
      }

      return fro.effect
    }

    pmfl.make2().add((condition_data) => {
      if (condition_data[0] === undefined)
        return true
    }, (match_data) => {
      let [effect, func, , temp_func] = match_data
      effect[func.name] = temp_func
    }).neither((match_data) => {
      let [effect, , other_name, temp_func] = match_data
      effect[other_name] = temp_func
    }).match([other_name], [fro.effect, func, other_name, temp_func])

    return fro
  }

  const involve = (str, data_array) => {
    virtual_data = virtual_data.set(str, data_array[0])
    real_data = real_data.set(str, data_array[0])
    real_data_set = real_data_set.set(str, data_array[1])
    fro.state = real_data.toJS()
    virtual_state = virtual_data.toJS()
    return fro
  }

  const set = (str, set_data) => {
    pmfl.make2().add([false], (match_data) => {
      let [other_str, other_data] = match_data
      virtual_data = virtual_data.set(other_str, other_data)
    }).match([virtual_data.has(str)], [str, set_data])
    virtual_state = virtual_data.toJS()
    return fro
  }

  const delimit = (str, const_data) => {
    pmfl.make2().add([false], (match_data) => {
      let [other_str, other_data] = match_data
      if (other_data !== undefined) {
        constant_data = constant_data.set(other_str, other_data)
      }
      else {
        constant_data = constant_data.set(other_str, other_str)
      }
    }).match([constant_data.has(str)], [str, const_data])
    fro.constant = constant_data.toJS()

    return fro
  }

  const link = (str, dom) => {
    ref_data = ref_data.set(str, dom)
    fro.ref = ref_data.toJS()

    return fro
  }
  const mark = (str_data) => {
    if (type.of(str_data) !== type.string) {
      console.log(str_data, " not string, marking failure")
      return fro
    }
    marked_data = marked_data.set(str_data, [])
    let temp_obj = {}
    temp_obj.add = (func, other_name) => {
      if (other_name === undefined)
        marked_data.get(str_data).push(["add", func.name])
      else {
        marked_data.get(str_data).push(["add", other_name])
      }
      add(func, other_name)
      return temp_obj
    }
    temp_obj.affect = (func, other_name) => {
      if (other_name === undefined)
        marked_data.get(str_data).push(["affect", func.name])
      else {
        marked_data.get(str_data).push(["affect", other_name])
      }
      affect(func, other_name)
      return temp_obj
    }
    temp_obj.involve = (str, data_array) => {
      marked_data.get(str_data).push(["involve", str])
      involve(str, data_array)
      return temp_obj
    }
    temp_obj.set = (str, set_data) => {
      marked_data.get(str_data).pushF(["set", str])
      set(str, set_data)
      return temp_obj
    }
    temp_obj.delimit = (str, const_data) => {
      marked_data.get(str_data).pushF(["delimit", str])
      delimit(str, const_data)
      return temp_obj
    }
    temp_obj.link = (str, dom) => {
      marked_data.get(str_data).pushF(["link", str])
      link(str, dom)
      return temp_obj
    }
    temp_obj.log = (str) => {
      log(str)
      return temp_obj
    }
    return temp_obj
  }
  const uninstall = (str_data) => {
    if (type.of(str_data) !== type.string) {
      console.log(str_data, " not string, uninstall failure")
      return fro
    }
    if (!marked_data.has(str_data)) {
      console.log(str_data, " is invalid parameter, uninstall failure")
      return fro
    }
    marked_data.get(str_data).map((value) => {
      pmfl.make2().add(["add"], (match_data) => {
        delete fro.logic[match_data]
      }).add(["affect"], (match_data) => {
        delete fro.effect[match_data]
      }).add(["involve"], (match_data) => {
        if (virtual_data.has(match_data))
          virtual_data = virtual_data.delete(match_data)
        real_data = real_data.delete(match_data)
        real_data_set = real_data_set.delete(match_data)
        if (changed_data.includes(match_data))
          changed_data = changed_data.delete(changed_data.findIndex((value) => value === match_data))
        fro.state = real_data.toJS()
        virtual_state = virtual_data.toJS()
      }).add(["set"], (match_data) => {
        if (virtual_data.has(match_data))
          virtual_data = virtual_data.delete(match_data)
        if (changed_data.includes(match_data))
          changed_data = changed_data.delete(changed_data.findIndex((value) => value === match_data))
        virtual_state = virtual_data.toJS()
      }).add(["delimit"], (match_data) => {
        constant_data = constant_data.delete(match_data)
        fro.constant = constant_data.toJS()
      }).add(["link"], (match_data) => {
        ref_data = ref_data.delete(match_data)
        fro.ref = ref_data.toJS()
      }).match([value[0]], value[1])
    })
    marked_data = marked_data.delete(str_data)
    return fro
  }
  const log = (str) => {
    if (str === "constant") {
      console.info("constant", constant_data.toJS())
    }
    else if (str === "ref") {
      console.info("ref", ref_data.toJS())
    }
    else if (str === "logic") {
      console.info("logic", fro.logic)
    }
    else if (str === "effect") {
      console.info("effect", fro.effect)
    }
    else if (str === "state") {
      console.info("state", real_data.toJS())
    }
    else if (str === "virtual_state") {
      console.info("virtual_state", virtual_data.toJS())
    }
    else if (str === "marked_data") {
      console.info("marked_data", marked_data.toJS())
    }
    else {
      console.info("constant", constant_data.toJS())
      console.info("ref", ref_data.toJS())
      console.info("logic", fro.logic)
      console.info("effect", fro.effect)
      console.info("state", real_data.toJS())
      console.info("virtual_state", virtual_data.toJS())
      console.info("marked_data", marked_data.toJS())
    }

    return fro
  }

  const apply = (...args) => {
    pmfl.make2().add([0], () => {
      changed_data.map((value) => {
        if (real_data_set.has(value)) {
          real_data_set.get(value)(virtual_data.get(value))
        }
      })
      changed_data = Immutable.List([])
    }).neither((match_data) => {
      match_data.map((arg) => {
        if (changed_data.includes(arg) && real_data_set.has(arg)) {
          real_data_set.get(arg)(virtual_data.get(arg))
          changed_data = changed_data.delete(changed_data.findIndex((value) => value === arg))
        }
        else {
          console.warn("Invalid variable name: ", arg)
        }
        return
      })
    }).match([args.length], args)

    fro.state = real_data.toJS()
    return fro.logic
  }

  const back = () => fro

  fro.add = add
  fro.affect = affect
  fro.set = set
  fro.involve = involve
  fro.delimit = delimit
  fro.link = link
  fro.log = log
  fro.create = create
  fro.mark = mark
  fro.uninstall = uninstall
  fro.logic.apply = apply
  fro.logic.back = back
  fro.effect.back = back

  return fro
}
const fro = create()
export default fro
