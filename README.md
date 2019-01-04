# react-fro
A interesting data management library of react that uses virtual data technology and chained logic calling technology.
## fro means function return object.
- 使用虚拟数据进行计算，在恰当的时候应用到真实世界
- 把逻辑封装为一个个函数，通过调用不同的函数组合来实现程序
- 使用链式调用和巧妙的功能函数，让组合函数的过程变得美妙
- 使用`log`函数随时查看程序运行数据
- 依赖`Immutable.js`和`pmfl`
- 目前只支持`React v16.7.0-alpha`
---
# 示例程序
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.setId("count")
  .link(fro.id.count, useState(0))
  .add(countPlus)

  function countPlus(id, state) {
    return { [id.count]: state.count + 1 }
  }
  return <div>
    <p>每次点击按钮，数字就增加五--{fro.state.count}</p>
    <button onClick={() => { fro.logic.repeat(5).countPlus().apply("count")}}>点击我</button>
  </div >
}
export default App;
```
---
# 安装
推荐使用yarn进行安装
```
yarn add react-fro
```
或者
```
npm i react-fro --save
```
---
# API
---
## 对象
### fro
##### 装载所有方法和对象的对象。
#### 包含
- fro.id
- fro.logic
- fro.state
- fro.ref
- fro.add(func, otherName)
- fro.remove(...args)
- fro.clear()
- fro.set(str, data)
- fro.link(str, dataArray)
- fro.setId(...args)
- fro.removeId(...args)
- fro.clearId()
- fro.setRef(str, dom)
- fro.removeRef(str)
- fro.clearRef()
- fro.log()
- fro.log(str)
---
### fro.id
##### 装载关键字数据的对象，`fro.setId(...args)`，`fro.removeId(...args)`，`fro.clearId()`方法可以改变此对象的值。
---
### fro.logic
##### 装载所有`fro.add(func, otherName)`方法添加的逻辑函数，和`fro.logic`对象自带的逻辑功能函数，`fro.remove(...args)`，`fro.clear()`方法也可作用于此对象。
#### 包含
- fro.logic.apply(...args)
- fro.logic.ifonly(condition)
- fro.logic.ifelse(condition)
- fro.logic.ifall(condition)
- fro.logic.endif()
- fro.logic.repeat(times)
---
### fro.state
##### 装载所有`react`渲染所需的真实数据，由`fro.link(str, dataArray)`方法初始化此对象的数据，由`fro.logic.apply(...args)`方法同步虚拟数据到此对象。
---
### fro.ref
##### 装载`react`特有的`ref`数据，此对象由`fro.setRef(str, dom)`，`fro.removeRef(str)`，`fro.clearRef()`方法管理。
---
## 方法
---
### fro.add(func, otherName)
##### 给`fro.logic`对象添加一个自定义的业务函数。
#### 参数
- `func: Function` 此函数是给`fro.logic`对象添加的自定义业务的函数。在`fro`内部有两个数据对象，分别是虚拟数据和真实数据。而此函数至少要有2个参数，`id`（等同于`fro.id`）和`state`（此参数是`fro`对象中的虚拟数据对象，而`fro.state`是真实数据对象），除此之外还可添加任意数量的其他参数。此函数的返回值有两种形式，数组或者对象。当返回值为数组时，数组的偶数序号的元素作为虚拟数据的key，奇数序号的元素作为虚拟数据的value，提供给fro的虚拟数据装载对象。当返回值为对象时，直接将此对象提供给`fro`的虚拟数据对象。
- `otherName: String` 此参数可选。当此参数存在时会覆盖`func: Function`参数的函数名，如果`func: Function`是匿名函数，则此参数必须存在。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add(countPlus)
    .add((id, state, count)=>["count2",count], "setCount") //Add function to add custom business functions
    .link("count1",useState(0)).link("count2", useState(0)) //The link function binds data to both virtual data objects and real data objects.

    function countPlus(id, state) {
      return { count1: state.count1 + 1 }
    }

    return <div>
      <p>{fro.state.count1}</p>
      //Calling a custom business function
      <button onClick={()=>{fro.logic.countPlus().apply()}}>countPlus</button>
      <p>{fro.state.count2}</p>
      <button onClick={()=>{fro.logic.setCount(101).apply()}}>setCount</button>
    </div>
}
```
---
### fro.remove(...args)
##### 移除`fro.logic`对象中存在的`fro.add(func, otherName)`函数添加的自定义业务函数。
#### 参数
- `args: Array<String>` String类型，包含自定义业务函数的函数名的数组。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add(countPlus)
    .add((id, state, count)=>["count2",count], "setCount")
    .link("count1",useState(0)).link("count2", useState(0))
    .remove("setCount")

    function countPlus(id, state) {
      return { count1: state.count1 + 1 }
    }

    return <div>
      <p>{fro.state.count1}</p>
      <button onClick={()=>{fro.logic.countPlus().apply()}}>countPlus</button>
    </div>

    //can't call setCount function because it does not exist in fro.logic object.
}
```
---
### fro.clear()
##### 清空`fro.logic`中所有的自定义业务函数（慎用）。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add((id, state, count)=>["count",count], "setCount")
    .link("count", useState(0))
    .clear()

    return <div>
      <p>{fro.state.count}</p>
    </div>

    //can't call setCount function because it does not exist in fro.logic object.
}
```
---
### fro.set(str, data)
##### 设置'fro'中虚拟数据变量的初始值，注意，如果此变量已经存在于虚拟数据对象中了，那调用此函数无效（仅对不存在的数据有效）。
#### 参数
- `str: String` 要设置的虚拟数据变量的key。
- `data: Any` 要设置的虚拟数据变量的value。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.set("num",10)
  .add((id, state)=>["count",state.num], "setCount")
  .link("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.setCount().apply()}}>equal 10</button>
  </div>

    //can't call setCount function because it does not exist in fro.logic object.
}
```
### fro.link(str, dataArray)
##### 双向绑定`react`渲染所需数据到`fro`中的真实数据对象，并把数据复制到`fro`中的虚拟数据对象。
#### 参数
- `str: String` 要绑定的数据变量名称（key）。
- `dataArray: Array` `react`的API`useState()`函数的返回值，第一个数据是要绑定的值，第二个数据是可改变此值的函数。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add((id, state)=>["count",state.count + 1], "setCount")
  .link("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.setCount().apply()}}>plus 1</button>
  </div>

}
```
