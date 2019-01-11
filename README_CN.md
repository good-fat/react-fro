# react-fro
### [English document](/README.md)
一个有趣的`react`数据管理库，它使用虚拟数据技术和链式逻辑调用技术。
## `fro`的意思是`function return object`。
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

  fro.setId("count").setId("countPlus").setId("step")
  .set(fro.id.step,1)
  .link(fro.id.count, useState(0))
  .add((id, state) => {
      return { [id.count]: state.count + state.step }
    },fro.id.countPlus)

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={() => { fro.logic.repeat(5).countPlus().apply("count")}}>plus 5</button>
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
- fro.log(str?)
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
export default App;
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
export default App;
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
export default App;
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
export default App;
```
---
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
export default App;
```
---
### fro.setId(...args)
##### 设置`fro.id`对象数据的函数。
#### 参数
- `args: Array<String>` 包含要设置的id数据的数组。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.setId("count","setCount")
  .add((id, state)=>[id.count, state.count + 1], fro.id.setCount)
  .link(fro.id.count, useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.setCount().apply()}}>plus 1</button>
  </div>

}
export default App;
```
---
### fro.removeId(...args)
##### 移除`fro.id`对象数据的函数。
#### 参数
- `args: Array<String>` 包含要移除的id数据的数组。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.setId("count","setCount")
  .removeId("count")
  .add((id, state)=>["count", state.count + 1], fro.id.setCount)
  .link("count", useState(0))
  //Cannot use id.count because it has been removed
  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.setCount().apply()}}>plus 1</button>
  </div>

}
export default App;
```
---
### fro.clearId()
##### 清空`fro.id`对象数据的函数（慎用）。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.setId("count","setCount")
  .clearId()
  .add((id, state)=>["count", state.count + 1], "setCount")
  .link("count", useState(0))
  //Cannot use id.count and id.setCount because they have been removed
  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.setCount().apply()}}>plus 1</button>
  </div>

}
export default App;
```
---
### fro.setRef(str, dom)
##### 绑定`react`的`ref`数据到`fro.ref`对象。
#### 参数
- `str: String` 绑定`ref`的变量名。
- `dom：Ref` `ref`数据。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.setId("input")

  return <div>
    <button onClick={()=>{fro.ref.input.focus()}}>focus input</button>
    <input type="text" ref={(input)=>fro.setRef(fro.id.input,input)}/>
  </div>

}
export default App;
```
---
### fro.removeRef(str)
##### 移除`fro.ref`对象中的数据。
#### 参数
- `str: String` 要移除的`ref`的变量名。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.setId("input")

  return <div>
    <button onClick={()=>{
      if(fro.ref.hasOwnProperty(fro.id.input))
        fro.ref.input.focus()
      fro.removeRef(fro.id.input)
    }}>focus input</button>
    <input type="text" ref={(input)=>fro.setRef(fro.id.input,input)}/>
  </div>

}
export default App;
```
---
### fro.clearRef()
##### 清空`fro.ref`对象中的数据（慎用）。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.setId("input")

  return <div>
    <button onClick={()=>{
      if(fro.ref.hasOwnProperty(fro.id.input))
        fro.ref.input.focus()
      fro.clearRef()
    }}>focus input</button>
    <input type="text" ref={(input)=>fro.setRef(fro.id.input,input)}/>
  </div>

}
export default App;
```
---
### fro.log(str?)
##### 输出当前fro对象中的数据
#### 参数
- `str: String` 可选参数。其值为`id`、`ref`、`logic`、`state`、`virtualState`时，分别输出这五个对象的数据，其值为其他或者不存在时，会输出所有对象的数据。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.setId("input").set("count",20).link("count2",useState(0))
  .add((id,state)=>{},"testFunc")

  return <div>
    <button onClick={()=>{
      if(fro.ref.hasOwnProperty(fro.id.input))
        fro.ref.input.focus()
      fro.log()
    }}>focus input</button>
    <input type="text" ref={(input)=>fro.setRef(fro.id.input,input)}/>
  </div>

}
export default App;
```
---
### fro.logic.apply(...args)
##### 取得所有，上一次`apply`之后，虚拟数据对象和真实数据对象共有的变量，用虚拟数据覆盖真实数据，并触发`react`页面的重新渲染。
#### 参数
- `args: Array<String>` 可选参数，装载需要用虚拟数据覆盖到真实数据的数据变量名。当`args`的`length`为0时，将所有改变了的虚拟数据都覆盖到真实数据；其他情况下，只覆盖特定数据。
#### 返回值：`fro.logic`
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
  //If the apply function is not called here, the page will not change.
}
export default App;
```
---
### fro.logic.ifonly(condition)
##### 逻辑函数。当参数`condition`为真时，此函数后面链式调用的下一个自定义函数会执行，否则就不执行。
#### 参数
- `condition: Boolean` 当`condition`为真，后面的下一个自定义链式调用函数会执行；当`condition`为假，后面的下一个自定义链式调用函数不会执行。
#### 返回值：`fro.logic`
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add((id, state)=>["count",state.count + 1], "setCount")
  .link("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.ifonly(true).setCount().apply()}}>plus 1</button>
    <button onClick={()=>{fro.logic.ifonly(false).setCount().apply()}}>no change</button>
  </div>

}
export default App;
```
---
### fro.logic.ifelse(condition)
##### 逻辑函数。当参数`condition`为真时，此函数后面链式调用的下一个自定义函数会执行，此函数后面链式调用的第二个自定义函数不会执行；否则会进行相反的操作。
#### 参数
- `condition: Boolean` 当`condition`为真，后面的第一个自定义链式调用函数会执行，后面的第二个自定义链式调用函数不会执行；当`condition`为假，后面的第一个自定义链式调用函数不会执行，后面的第二个自定义链式调用函数会执行。整个逻辑函数运行步骤就像三元运算符。
#### 返回值：`fro.logic`
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add((id, state)=>["count",state.count + 1], "plusCount")
  .add((id, state, num)=>["count",num], "setCount")
  .link("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.ifelse(true).plusCount().setCount(10).apply()}}>plus 1</button>
    <button onClick={()=>{fro.logic.ifelse(false).plusCount().setCount(10).apply()}}>set 10</button>
  </div>

}
export default App;
```
---
### fro.logic.ifall(condition) & fro.logic.endif()
##### 成对出现的逻辑函数。当参数`condition`为真时，fro.logic.ifall(condition)之后，fro.logic.endif()之前的所有自定义链式调用函数都会执行；反之，则都不执行。
#### 参数
- `condition: Boolean` 当`condition`为真，fro.logic.ifall(condition)之后，fro.logic.endif()之前的所有自定义链式调用函数都会执行；当`condition`为假，fro.logic.ifall(condition)之后，fro.logic.endif()之前的所有自定义链式调用函数都不会执行。
#### 返回值：`fro.logic`
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add((id, state)=>["count",state.count + 1], "plusCount")
  .add((id, state, num)=>["count",num], "setCount")
  .link("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.ifall(true).plusCount().setCount(10).endif().apply()}}>plus 1 & set 10</button>
    <button onClick={()=>{fro.logic.ifall(false).plusCount().setCount(10).endif().apply()}}>no change</button>
  </div>

}
export default App;
```

### fro.logic.repeat(times)
##### 逻辑函数。此函数之后出现的第一个将会执行的自定义链式调用函数会连续执行`times`次。注意，尽量不要与其他逻辑函数混用。
#### 参数
- `times: Number` 此函数后第一个将会执行的自定义链式调用函数重复执行的次数。
#### 返回值：`fro.logic`
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add((id, state)=>["count",state.count + 1], "plusCount")
  .add((id, state, num)=>["count",num], "setCount")
  .link("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.repeat(20).plusCount().apply()}}>plus 20</button>
    <button onClick={()=>{fro.logic.ifelse(false).repeat(5).setCount(10).plusCount().apply()}}>plus 5</button>
  </div>

}
export default App;
```
# 许可证
MIT
