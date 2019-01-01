'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function() { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _pmfl = require('pmfl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var create = function create() {

  var fro = {};
  fro.id = {};
  fro.logic = {};
  fro.state = {};
  fro.ref = {};
  var changeId = _immutable2.default.List([]);
  var virtualData = _immutable2.default.Map({});
  var realData = _immutable2.default.Map({});
  var realDataFunc = _immutable2.default.Map({});
  var logicList = _immutable2.default.List([]);
  var repeatCount = 1;
  var add = function add(func, otherName) {
    var tempFunc = function tempFunc() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (logicList.size !== 0) {
        var condition = logicList.first();
        logicList = logicList.shift();
        if (condition === false) {
          return fro.logic;
        }
      }
      if (repeatCount <= 1) {
        repeatCount = 1;
      } else {
        var tempCount = repeatCount;
        repeatCount = 1;
        for (var i = 0; i <= tempCount - 2; i++) {
          var _result = func.apply(undefined, [fro.id, virtualData.toJS()].concat(args));
          _pmfl.pmfl.make2().add([_pmfl.type.array], function(data) {
            for (var _i = 0; _i < data.length; _i += 2) {
              if (data[_i] !== undefined && data[_i + 1] !== undefined) {
                virtualData = virtualData.set(data[_i], data[_i + 1]);
                if (!changeId.includes(data[_i])) changeId = changeId.push(data[_i]);
              }
            }
          }).add([_pmfl.type.object], function(data) {
            var changeData = _immutable2.default.Map(data);
            virtualData = virtualData.mergeDeep(changeData);
            changeData.map(function(value, key) {
              if (!changeId.includes(key)) changeId = changeId.push(key);
              return value;
            });
          }).match([_pmfl.type.of(_result)], _result);
        }
      }
      var result = func.apply(undefined, [fro.id, virtualData.toJS()].concat(args));
      _pmfl.pmfl.make2().add([_pmfl.type.array], function(data) {
        for (var _i2 = 0; _i2 < data.length; _i2 += 2) {
          if (data[_i2] !== undefined && data[_i2 + 1] !== undefined) {
            virtualData = virtualData.set(data[_i2], data[_i2 + 1]);
            if (!changeId.includes(data[_i2])) changeId = changeId.push(data[_i2]);
          }
        }
      }).add([_pmfl.type.object], function(data) {
        var changeData = _immutable2.default.Map(data);
        virtualData = virtualData.mergeDeep(changeData);
        changeData.map(function(value, key) {
          if (!changeId.includes(key)) changeId = changeId.push(key);
          return value;
        });
      }).match([_pmfl.type.of(result)], result);
      return fro.logic;
    };
    //undefined
    _pmfl.pmfl.make2().add(function(data) {
      if (data[0] === undefined) return true;
    }, function(data) {
      var _data = _slicedToArray(data, 4),
        logic = _data[0],
        func = _data[1],
        tempFunc = _data[3];

      logic[func.name] = tempFunc;
    }).neither(function(data) {
      var _data2 = _slicedToArray(data, 4),
        logic = _data2[0],
        otherName = _data2[2],
        tempFunc = _data2[3];

      logic[otherName] = tempFunc;
    }).match([otherName], [fro.logic, func, otherName, tempFunc]);
    return fro;
  };
  var remove = function remove() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.map(function(str) {
      fro.logic[str] = undefined;
      return;
    });
    return fro;
  };
  var clear = function clear() {
    fro.logic = {};
    return fro;
  };
  var set = function set(str, data) {
    _pmfl.pmfl.make2().add([false], function(data) {
      var _data3 = _slicedToArray(data, 2),
        str1 = _data3[0],
        data1 = _data3[1];

      virtualData = virtualData.set(str1, data1);
    }).match([virtualData.has(str)], [str, data]);
    return fro;
  };
  var link = function link(str, dataArray) {
    virtualData = virtualData.set(str, dataArray[0]);
    realData = realData.set(str, dataArray[0]);
    realDataFunc = realDataFunc.set(str, dataArray[1]);
    fro.state = realData.toJS();
    return fro;
  };
  var setId = function setId() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    args.map(function(str) {
      fro.id[str] = str;
    });
    return fro;
  };
  var removeId = function removeId() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    args.map(function(str) {
      fro.id[str] = undefined;
    });
    return fro;
  };
  var clearId = function clearId() {
    fro.id = {};
    return fro;
  };
  var setRef = function setRef(str, dom) {
    fro.ref[str] = dom;
    return fro;
  };
  var removeRef = function removeRef(str) {
    fro.ref[str] = undefined;
    return fro;
  };
  var clearRef = function clearRef() {
    fro.ref = {};
    return fro;
  };
  var log = function log() {
    console.info("id", fro.id);
    console.info("ref", fro.ref);
    console.info("logic", fro.logic);
    console.info("state", fro.state);
    return fro;
  };
  var apply = function apply() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    _pmfl.pmfl.make2().add([0], function() {
      changeId.map(function(value) {
        if (realDataFunc.has(value)) {
          realDataFunc.get(value)(virtualData.get(value));
        }
      });
    }).neither(function(data) {
      data.map(function(arg) {
        return realDataFunc.has(arg) ? realDataFunc.get(arg)(virtualData.get(arg)) : {};
      });
    }).match([args.length], args);
    fro.state = realData.toJS();
    return fro.logic;
  };
  var ifonly = function ifonly(condition) {
    if (condition) {
      logicList = logicList.push(true);
    } else {
      logicList = logicList.push(false);
    }
    return fro.logic;
  };
  var ifelse = function ifelse(condition) {
    if (condition) {
      logicList = logicList.push(true, false);
    } else {
      logicList = logicList.push(false, true);
    }
    return fro.logic;
  };
  var ifall = function ifall(condition) {
    var tempArray = [];
    if (condition) {
      for (var i = 0; i < 1024; i++) {
        tempArray.push(true);
      }
    } else {
      for (var _i3 = 0; _i3 < 1024; _i3++) {
        tempArray.push(false);
      }
    }
    logicList = _immutable2.default.List(tempArray);
    return fro.logic;
  };
  var endif = function endif() {
    logicList = _immutable2.default.List([]);
    return fro.logic;
  };
  var repeat = function repeat(times) {
    if (_pmfl.type.of(times) === _pmfl.type.number) repeatCount = times;
    return fro.logic;
  };
  fro.add = add;
  fro.remove = remove;
  fro.clear = clear;
  fro.set = set;
  fro.link = link;
  fro.setId = setId;
  fro.removeId = removeId;
  fro.clearId = clearId;
  fro.setRef = setRef;
  fro.removeRef = removeRef;
  fro.clearRef = clearRef;
  fro.log = log;
  fro.logic.apply = apply;
  fro.logic.ifonly = ifonly;
  fro.logic.ifelse = ifelse;
  fro.logic.ifall = ifall;
  fro.logic.endif = endif;
  fro.logic.repeat = repeat;
  return fro;
};
var fro = create();
fro.create = create;
exports.default = fro;
