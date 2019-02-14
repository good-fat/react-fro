"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = _interopRequireDefault(require("immutable"));

var _pmfl = require("pmfl");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var create = function create() {
  var fro = {};

  var changed_data = _immutable.default.List([]);

  var virtual_data = _immutable.default.Map({});

  var real_data = _immutable.default.Map({});

  var real_data_set = _immutable.default.Map({});

  var constant_data = _immutable.default.Map({});

  var ref_data = _immutable.default.Map({});

  var marked_data = _immutable.default.Map({});

  var virtual_state = {};
  fro.constant = {};
  fro.logic = {};
  fro.effect = {};
  fro.state = {};
  fro.ref = {};

  var add = function add(func, other_name) {
    var temp_func = function temp_func(data, condition, times) {
      var run_flag;

      _pmfl.pmfl.make2().add([_pmfl.type.undefined], function () {
        run_flag = true;
      }).add([_pmfl.type.function], function (match_data) {
        if (match_data(fro.constant, virtual_state)) {
          run_flag = true;
        } else {
          run_flag = false;
        }
      }).neither(function (match_data) {
        if (match_data) {
          run_flag = true;
        } else {
          run_flag = false;
        }
      }).match([_pmfl.type.of(condition)], condition);

      if (!run_flag) {
        return fro.logic;
      }

      var loop_times;

      _pmfl.pmfl.make2().add([_pmfl.type.number], function (match_data) {
        var temp_num = Math.floor(match_data);

        if (temp_num < 1) {
          loop_times = 1;
        } else {
          loop_times = temp_num;
        }
      }).neither(function () {
        loop_times = 1;
      }).match([_pmfl.type.of(times)], times);

      for (var i = 0; i < loop_times; i++) {
        var result = func(data, fro.constant, virtual_state);

        _pmfl.pmfl.make2().add([_pmfl.type.array], function (match_data) {
          for (var _i = 0; _i < match_data.length; _i += 2) {
            if (match_data[_i] !== undefined && match_data[_i + 1] !== undefined) {
              virtual_data = virtual_data.set(match_data[_i], match_data[_i + 1]);
              virtual_state = virtual_data.toJS();
              if (!changed_data.includes(match_data[_i])) changed_data = changed_data.push(match_data[_i]);
            }
          }
        }).add([_pmfl.type.object], function (match_data) {
          var temp_data = _immutable.default.Map(match_data);

          virtual_data = virtual_data.mergeDeep(temp_data);
          virtual_state = virtual_data.toJS();
          temp_data.map(function (value, key) {
            if (!changed_data.includes(key)) changed_data = changed_data.push(key);
            return value;
          });
        }).match([_pmfl.type.of(result)], result);
      }

      return fro.logic;
    };

    _pmfl.pmfl.make2().add(function (condition_data) {
      if (condition_data[0] === undefined) return true;
    }, function (match_data) {
      var _match_data = _slicedToArray(match_data, 4),
          logic = _match_data[0],
          func = _match_data[1],
          temp_func = _match_data[3];

      logic[func.name] = temp_func;
    }).neither(function (match_data) {
      var _match_data2 = _slicedToArray(match_data, 4),
          logic = _match_data2[0],
          other_name = _match_data2[2],
          temp_func = _match_data2[3];

      logic[other_name] = temp_func;
    }).match([other_name], [fro.logic, func, other_name, temp_func]);

    return fro;
  };

  var affect = function affect(func, other_name) {
    var temp_func = function temp_func(data, condition, times) {
      var run_flag;

      _pmfl.pmfl.make2().add([_pmfl.type.undefined], function () {
        run_flag = true;
      }).add([_pmfl.type.function], function (match_data) {
        if (match_data(fro.constant, virtual_state)) {
          run_flag = true;
        } else {
          run_flag = false;
        }
      }).neither(function (match_data) {
        if (match_data) {
          run_flag = true;
        } else {
          run_flag = false;
        }
      }).match([_pmfl.type.of(condition)], condition);

      if (!run_flag) {
        return fro.effect;
      }

      var loop_times;

      _pmfl.pmfl.make2().add([_pmfl.type.number], function (match_data) {
        var temp_num = Math.floor(match_data);

        if (temp_num < 1) {
          loop_times = 1;
        } else {
          loop_times = temp_num;
        }
      }).neither(function () {
        loop_times = 1;
      }).match([_pmfl.type.of(times)], times);

      for (var i = 0; i < loop_times; i++) {
        func(data, fro.constant, virtual_state);
      }

      return fro.effect;
    };

    _pmfl.pmfl.make2().add(function (condition_data) {
      if (condition_data[0] === undefined) return true;
    }, function (match_data) {
      var _match_data3 = _slicedToArray(match_data, 4),
          effect = _match_data3[0],
          func = _match_data3[1],
          temp_func = _match_data3[3];

      effect[func.name] = temp_func;
    }).neither(function (match_data) {
      var _match_data4 = _slicedToArray(match_data, 4),
          effect = _match_data4[0],
          other_name = _match_data4[2],
          temp_func = _match_data4[3];

      effect[other_name] = temp_func;
    }).match([other_name], [fro.effect, func, other_name, temp_func]);

    return fro;
  };

  var involve = function involve(str, data_array) {
    virtual_data = virtual_data.set(str, data_array[0]);
    real_data = real_data.set(str, data_array[0]);
    real_data_set = real_data_set.set(str, data_array[1]);
    fro.state = real_data.toJS();
    virtual_state = virtual_data.toJS();
    return fro;
  };

  var set = function set(str, set_data) {
    _pmfl.pmfl.make2().add([false], function (match_data) {
      var _match_data5 = _slicedToArray(match_data, 2),
          other_str = _match_data5[0],
          other_data = _match_data5[1];

      virtual_data = virtual_data.set(other_str, other_data);
    }).match([virtual_data.has(str)], [str, set_data]);

    virtual_state = virtual_data.toJS();
    return fro;
  };

  var delimit = function delimit(str, const_data) {
    _pmfl.pmfl.make2().add([false], function (match_data) {
      var _match_data6 = _slicedToArray(match_data, 2),
          other_str = _match_data6[0],
          other_data = _match_data6[1];

      if (other_data !== undefined) {
        constant_data = constant_data.set(other_str, other_data);
      } else {
        constant_data = constant_data.set(other_str, other_str);
      }
    }).match([constant_data.has(str)], [str, const_data]);

    fro.constant = constant_data.toJS();
    return fro;
  };

  var link = function link(str, dom) {
    ref_data = ref_data.set(str, dom);
    fro.ref = ref_data.toJS();
    return fro;
  };

  var mark = function mark(str_data) {
    if (_pmfl.type.of(str_data) !== _pmfl.type.string) {
      console.log(str_data, " not string, marking failure");
      return fro;
    }

    marked_data = marked_data.set(str_data, []);
    var temp_obj = {};

    temp_obj.add = function (func, other_name) {
      if (other_name === undefined) marked_data.get(str_data).push(["add", func.name]);else {
        marked_data.get(str_data).push(["add", other_name]);
      }
      add(func, other_name);
      return temp_obj;
    };

    temp_obj.affect = function (func, other_name) {
      if (other_name === undefined) marked_data.get(str_data).push(["affect", func.name]);else {
        marked_data.get(str_data).push(["affect", other_name]);
      }
      affect(func, other_name);
      return temp_obj;
    };

    temp_obj.involve = function (str, data_array) {
      marked_data.get(str_data).push(["involve", str]);
      involve(str, data_array);
      return temp_obj;
    };

    temp_obj.set = function (str, set_data) {
      marked_data.get(str_data).pushF(["set", str]);
      set(str, set_data);
      return temp_obj;
    };

    temp_obj.delimit = function (str, const_data) {
      marked_data.get(str_data).pushF(["delimit", str]);
      delimit(str, const_data);
      return temp_obj;
    };

    temp_obj.link = function (str, dom) {
      marked_data.get(str_data).pushF(["link", str]);
      link(str, dom);
      return temp_obj;
    };

    temp_obj.log = function (str) {
      log(str);
      return temp_obj;
    };

    return temp_obj;
  };

  var uninstall = function uninstall(str_data) {
    if (_pmfl.type.of(str_data) !== _pmfl.type.string) {
      console.log(str_data, " not string, uninstall failure");
      return fro;
    }

    if (!marked_data.has(str_data)) {
      console.log(str_data, " is invalid parameter, uninstall failure");
      return fro;
    }

    marked_data.get(str_data).map(function (value) {
      _pmfl.pmfl.make2().add(["add"], function (match_data) {
        delete fro.logic[match_data];
      }).add(["affect"], function (match_data) {
        delete fro.effect[match_data];
      }).add(["involve"], function (match_data) {
        if (virtual_data.has(match_data)) virtual_data = virtual_data.delete(match_data);
        real_data = real_data.delete(match_data);
        real_data_set = real_data_set.delete(match_data);
        if (changed_data.includes(match_data)) changed_data = changed_data.delete(changed_data.findIndex(function (value) {
          return value === match_data;
        }));
        fro.state = real_data.toJS();
        virtual_state = virtual_data.toJS();
      }).add(["set"], function (match_data) {
        if (virtual_data.has(match_data)) virtual_data = virtual_data.delete(match_data);
        if (changed_data.includes(match_data)) changed_data = changed_data.delete(changed_data.findIndex(function (value) {
          return value === match_data;
        }));
        virtual_state = virtual_data.toJS();
      }).add(["delimit"], function (match_data) {
        constant_data = constant_data.delete(match_data);
        fro.constant = constant_data.toJS();
      }).add(["link"], function (match_data) {
        ref_data = ref_data.delete(match_data);
        fro.ref = ref_data.toJS();
      }).match([value[0]], value[1]);
    });
    marked_data = marked_data.delete(str_data);
    return fro;
  };

  var log = function log(str) {
    if (str === "constant") {
      console.info("constant", constant_data.toJS());
    } else if (str === "ref") {
      console.info("ref", ref_data.toJS());
    } else if (str === "logic") {
      console.info("logic", fro.logic);
    } else if (str === "effect") {
      console.info("effect", fro.effect);
    } else if (str === "state") {
      console.info("state", real_data.toJS());
    } else if (str === "virtual_state") {
      console.info("virtual_state", virtual_data.toJS());
    } else if (str === "marked_data") {
      console.info("marked_data", marked_data.toJS());
    } else {
      console.info("constant", constant_data.toJS());
      console.info("ref", ref_data.toJS());
      console.info("logic", fro.logic);
      console.info("effect", fro.effect);
      console.info("state", real_data.toJS());
      console.info("virtual_state", virtual_data.toJS());
      console.info("marked_data", marked_data.toJS());
    }

    return fro;
  };

  var apply = function apply(condition) {
    if (condition !== undefined) {
      if (_pmfl.type.of(condition) === _pmfl.type.function) {
        if (!condition(fro.constant, virtual_state)) {
          return fro.logic;
        }
      } else {
        if (!condition) {
          return fro.logic;
        }
      }
    }

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _pmfl.pmfl.make2().add([0], function () {
      changed_data.map(function (value) {
        if (real_data_set.has(value)) {
          real_data_set.get(value)(virtual_data.get(value));
        }
      });
      changed_data = _immutable.default.List([]);
    }).neither(function (match_data) {
      match_data.map(function (arg) {
        if (changed_data.includes(arg) && real_data_set.has(arg)) {
          real_data_set.get(arg)(virtual_data.get(arg));
          changed_data = changed_data.delete(changed_data.findIndex(function (value) {
            return value === arg;
          }));
        } else {
          console.warn("Invalid variable name: ", arg);
        }

        return;
      });
    }).match([args.length], args);

    fro.state = real_data.toJS();
    return fro.logic;
  };

  var back = function back() {
    return fro;
  };

  fro.add = add;
  fro.affect = affect;
  fro.set = set;
  fro.involve = involve;
  fro.delimit = delimit;
  fro.link = link;
  fro.log = log;
  fro.create = create;
  fro.mark = mark;
  fro.uninstall = uninstall;
  fro.logic.apply = apply;
  fro.logic.back = back;
  fro.effect.back = back;
  return fro;
};

var fro = create();
var _default = fro;
exports.default = _default;
