# react-fro
### [English document](/README.md)
一个有趣的`react`数据管理库，它使用虚拟数据技术和链式逻辑调用技术。
## `fro`的意思是`function return object`。
- 使用虚拟数据进行计算，在恰当的时候应用到真实世界
- 把逻辑封装为一个个函数，通过调用不同的函数组合来实现程序
- 使用链式调用和巧妙的功能函数，让组合函数的过程变得美妙
- 使用`log`函数随时查看程序运行数据
- 依赖`Immutable.js`和`pmfl`
- 需要`HOOKS`API，目前只支持`React v16.8.1`
---
# 示例程序
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.delimit("count").delimit("countPlus").delimit("step")
  .set(fro.constant.step,1)
  .involve(fro.constant.count, useState(0))
  .add((data, constant, state) => {
      return { [constant.count]: state.count + state.step }
    },fro.constant.countPlus)

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={() => { fro.logic.countPlus(null,true,5).apply(true,"count")}}>plus 5</button>
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
- fro.constant
- fro.logic
- fro.mixing
- fro.state
- fro.effect
- fro.ref
- fro.add(func, other_name)
- fro.affect(func, other_name)
- fro.involve(str, data_array)
- fro.set(str, set_data)
- fro.delimit(str, const_data)
- fro.link(str, dom)
- fro.mark(str)
- fro.uninstall(str)
- fro.log(str?)
---
### fro.constant
##### 装载常量数据的对象，由`fro.delimit(str, const_data)`函数进行数据初始化，对象中数据的值无法被更改。
---
### fro.logic
##### 逻辑函数对象，调用`fro.add(func, other_name)`方法可向此对象添加逻辑函数。
#### 包含
- fro.logic.apply(condition, ...args)
- fro.logic.back()
---
### fro.mixing
##### 逻辑函数和副作用函数都包含的对象，调用`fro.mix(func, other_name)`方法可向此对象添加函数。
#### 包含
- fro.mixing.apply(condition, ...args)
- fro.mixing.back()
---
### fro.state
##### 装载所有`react`渲染所需的真实数据，由`fro.involve(str, data_array)`方法初始化此对象的数据，由`fro.logic.apply(condition, ...args)`方法同步虚拟数据到此对象。
---
### fro.effect
##### 副作用函数对象，调用`fro.affect(func, other_name)`方法可向此对象添加包含副作用的函数。
#### 包含
- fro.effect.back()
---
### fro.ref
##### 装载`react`特有的`ref`数据，此对象由`fro.link(str, dom)`方法初始化。
---
## 方法
---
### fro.add(func, other_name)
##### 给`fro.logic`对象添加一个自定义的业务函数。
#### 参数
- `func: Function` 此函数是给`fro.logic`对象添加的自定义业务的函数。在`fro`内部有两个数据对象，分别是虚拟数据和真实数据。而此函数有3个参数，`data`、`constant`（等同于`fro.constant`）和`state`（此参数是`fro`对象中的虚拟数据对象`virtual_state`）。此参数的返回值有两种形式，数组或者对象。当返回值为数组时，数组的偶数序号的元素作为虚拟数据的key，奇数序号的元素作为虚拟数据的value，提供给fro的virtual_state对象。当返回值为对象时，直接将此对象提供给virtual_state对象。
- `other_name: String` 此参数可选。当此参数存在时会覆盖`func: Function`参数的函数名，如果`func: Function`是匿名函数，则此参数必须存在。
#### 额外说明
##### 给`fro.logic`对象添加的函数包含3个参数，分别是`data`、`condition`、`times`。
- `data: Any` 传给`fro.logic`中函数的第一个参数，代表用户自定义数据，通常为对象或数组类型。
- `condition: Function/Boolean` 传给`fro.logic`中函数的第二个参数，此参数为`true`或此函数的返回值为`true`，则函数可执行预定义的逻辑；反之，函数直接返回不执行逻辑。当参数不存在则默认执行函数逻辑。
- `times: Number` 传给`fro.logic`中函数的第三个参数，代表逻辑函数执行次数，当此参数小于1时，只执行一次；当此参数为小数时，执行整数部分次数。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add(count_plus)
    .add((data, constant, state)=>["count2",data], "set_count")
    .involve("count1",useState(0)).involve("count2", useState(0))

    function count_plus(data, constant, state) {
      return { count1: state.count1 + 1 }
    }

    return <div>
      <p>{fro.state.count1}</p>
      <button onClick={()=>{fro.logic.set_count(10).count_plus(null,true,5).apply()}}>count2 to be 10 and count1 plus 5</button>
      <p>{fro.state.count2}</p>
      <button onClick={()=>{fro.logic.set_count(101).apply()}}>set_count</button>
    </div>
}
export default App;
```
---
### fro.mix(func, other_name)
##### 给`fro.mixing`对象添加一个既可以执行副作用，又可修改虚拟数据的业务函数。此函数用于既需要产生副作用，又需要修改虚拟数据时使用。
#### 参数
- `func: Function` 此函数是给`fro.mixing`对象添加的自定义业务的函数。在`fro`内部有两个数据对象，分别是虚拟数据和真实数据。而此函数有3个参数，`data`、`constant`（等同于`fro.constant`）和`state`（此参数是`fro`对象中的虚拟数据对象`virtual_state`）。此参数的返回值有两种形式，数组或者对象。当返回值为数组时，数组的偶数序号的元素作为虚拟数据的key，奇数序号的元素作为虚拟数据的value，提供给fro的virtual_state对象。当返回值为对象时，直接将此对象提供给virtual_state对象。
- `other_name: String` 此参数可选。当此参数存在时会覆盖`func: Function`参数的函数名，如果`func: Function`是匿名函数，则此参数必须存在。
#### 额外说明
##### 给`fro.mixing`对象添加的函数包含3个参数，分别是`data`、`condition`、`times`。
- `data: Any` 传给`fro.mixing`中函数的第一个参数，代表用户自定义数据，通常为对象或数组类型。
- `condition: Function/Boolean` 传给`fro.mixing`中函数的第二个参数，此参数为`true`或此函数的返回值为`true`，则函数可执行预定义的逻辑；反之，函数直接返回不执行逻辑。当参数不存在则默认执行函数逻辑。
- `times: Number` 传给`fro.mixing`中函数的第三个参数，代表逻辑函数执行次数，当此参数小于1时，只执行一次；当此参数为小数时，执行整数部分次数。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.mix(count_plus)
    .mix((data, constant, state)=>["count2",data], "set_count")
    .involve("count1",useState(0)).involve("count2", useState(0))

    function count_plus(data, constant, state) {
      console.log("it's cool~")
      return { count1: state.count1 + 1 }
    }

    return <div>
      <p>{fro.state.count1}</p>
      <button onClick={()=>{fro.mixing.set_count(10).count_plus(null,true,5).apply()}}>count2 to be 10 and count1 plus 5</button>
      <p>{fro.state.count2}</p>
      <button onClick={()=>{fro.mixing.set_count(101).apply()}}>set_count</button>
    </div>
}
export default App;
```
---
### fro.affect(func, other_name)
##### 给`fro.effect`对象添加一个用于执行副作用的函数。
#### 参数
- `func: Function` 此函数是给`fro.effect`对象添加的用于执行副作用的函数。在`fro`内部有两个数据对象，分别是虚拟数据和真实数据。而此函数有3个参数，`data`、`constant`（等同于`fro.constant`）和`state`（此参数是`fro`对象中的虚拟数据对象`virtual_state`）。此参数无返回值，用于执行副作用。
- `other_name: String` 此参数可选。当此参数存在时会覆盖`func: Function`参数的函数名，如果`func: Function`是匿名函数，则此参数必须存在。
#### 额外说明
##### 给`fro.effect`对象添加的函数包含3个参数，分别是`data`、`condition`、`times`。
- `data: Any` 传给`fro.effect`中函数的第一个参数，代表用户自定义数据，通常为对象或数组类型。
- `condition: Function/Boolean` 传给`fro.effect`中函数的第二个参数，此参数为`true`或此函数的返回值为`true`，则函数可执行预定义的逻辑；反之，函数直接返回不执行逻辑。当参数不存在则默认执行函数逻辑。
- `times: Number` 传给`fro.effect`中函数的第三个参数，代表逻辑函数执行次数，当此参数小于1时，只执行一次；当此参数为小数时，执行整数部分次数。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.delimit("open_baidu")
  .affect((data, constant, state)=>{ window.open("https:\/\/www.baidu.com")}, fro.constant.open_baidu)

  return <div>
    <button onClick={()=>{fro.effect.open_baidu([], true, 2)}}>open baidu 2 times</button>
  </div>

}
export default App;
```
---
### fro.involve(str, data_array)
##### 双向绑定`react`渲染所需数据到`fro`中的真实数据对象，并把数据复制到`fro`中的虚拟数据对象。
#### 参数
- `str: String` 要绑定的数据变量名称（key）。
- `data_array: Array` `react`的API`useState()`函数的返回值，第一个数据是要绑定的值，第二个数据是可改变此值的函数。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add((data, constant, state)=>["count",state.count + 1], "count_plus")
  .involve("count", useState(20))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.count_plus().apply()}}>plus 1</button>
  </div>

}
export default App;
```
---
### fro.set(str, set_data)
##### 设置'fro'中虚拟数据变量的初始值，注意，如果此变量已经存在于虚拟数据对象中了，那调用此函数无效（仅对不存在的数据有效）,虚拟数据需要使用`fro.logic`对象中的函数改变。
#### 参数
- `str: String` 要设置的虚拟数据变量的key。
- `set_data: Any` 要设置的虚拟数据变量的value。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.set("num",10)
  .add((data, constant, state)=>["count", state.num], "set_count")
  .involve("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.set_count().apply()}}>to be 10</button>
  </div>

}
export default App;
```
---
### fro.delimit(str, const_data?)
##### 定义`fro.constant`对象中的数据，此对象中的所有数据都是常量，无法改变。
#### 参数
- `str: String` 要定义的常量名。
- `const_data: Any` 可选参数，要定义的常量的值，当此参数不存在时，常量名和常量值均为`str`参数。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.delimit("count").delimit("count_plus")
  .delimit("condition_func", (constant, state) => {
    if(state.count === 5){
      return false
    }
    else{
      return true
    }
  })
  .add((data, constant, state) => {
      return [constant.count, state.count + 1]
  }, fro.constant.count_plus)
  .involve(fro.constant.count, useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.count_plus({}, fro.constant.condition_func, 1).apply()}}>count plus 1 until 5</button>
  </div>

}
export default App;
```
---
### fro.link(str, dom)
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

  fro.delimit("input")

  return <div>
    <button onClick={()=>{fro.ref.input.focus()}}>focus input</button>
    <input type="text" ref={(input)=>fro.link(fro.constant.input, input)}/>
  </div>

}
export default App;
```
---
### fro.mark(str)
##### 标记一组`fro`所属函数的执行，用于防止`react`组件销毁时造成内存泄漏。
#### 参数
- `str: String` 要标记的名称，一般与组件名相同。
#### 返回值：`marked_fro`
---
### fro.uninstall(str)
##### 销毁所有被`fro.mark(str)`函数标记的数据，用于防止`react`组件销毁时造成内存泄漏。
#### 参数
- `str: String` 要销毁的数据组名称，一般与组件名相同。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState, useEffect } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.mark("App").add(count_plus)
    .add((data, constant, state)=>["count2",data], "set_count")
    .involve("count1",useState(0)).involve("count2", useState(0))

    function count_plus(data, constant, state) {
      return { count1: state.count1 + 1 }
    }

    useEffect(() => {
      return function clean_up() {
        fro.uninstall("App")
      }
    }, [])

    return <div>
      <p>{fro.state.count1}</p>
      <button onClick={()=>{fro.logic.set_count(10).count_plus(null,true,5).apply()}}>count2 to be 10 and count1 plus 5</button>
      <p>{fro.state.count2}</p>
      <button onClick={()=>{fro.logic.set_count(101).apply()}}>set_count</button>
    </div>

}
export default App;
```
---
### fro.log(str?)
##### 输出当前fro对象中的数据。
#### 参数
- `str: String` 可选参数。其值为`constant`、`ref`、`logic`、`mixing`、`effect`、`state`、`virtual_state`、`marked_data`时，分别输出这七个对象的数据，其值为其他或者不存在时，会输出所有对象的数据。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.delimit("input").set("count", 20).involve("count2", useState(0))
  .add((data, constant, state)=>{}, "test_func")
  .affect((data, constant, state) => {}, "test_effect")

  return <div>
    <button onClick={()=>{
      fro.log()
    }}>show log</button>
    <input type="text" ref={(input)=>fro.link(fro.constant.input,input)}/>
  </div>

}
export default App;
```
---
### fro.logic.apply(condition, ...args)
##### 取得所有，上一次`apply`之后，虚拟数据对象和真实数据对象共有的变量，用虚拟数据覆盖真实数据，并触发`react`页面的重新渲染。
#### 参数
- `condition?: Function/Boolean` 可选参数，用来决定此函数是否真正执行。当此参数的类型为`Function`时，包含两个参数，分别是`constant`（等同于`fro.constant`）和`state`（此参数是`fro`对象中的虚拟数据对象`virtual_state`），返回一个`Boolean`类型的值。当此参数为真或者返回值为真时，`fro.logic.apply(condition, ...args)`函数运行，当此参数为空时，默认执行此函数。
- `args?: Array<String>` 可选参数，装载需要用虚拟数据覆盖到真实数据的数据变量名。当`args`的`length`为0时，将所有改变了的虚拟数据都覆盖到真实数据；其他情况下，只覆盖特定数据。
#### 返回值：`fro.logic`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.add((data, constant, state)=>["count",state.count + 1], "set_count")
  .involve("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.set_count().apply()}}>plus 1</button>
    <button onClick={()=>{fro.logic.set_count().apply(null)}}>no change</button>
    <button onClick={()=>{fro.logic.set_count().apply((constant, state)=>true, "count")}}>plus 1 too</button>
  </div>
  //If the apply function is not called here, the page will not change.
}
export default App;
```
---
### fro.logic.back()
##### 返回`fro`对象。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {
  fro.set("num",10)
  .add((data, constant, state)=>["count", state.num], "set_count")
  .involve("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.logic.set_count().apply().back().log()}}>to be 10 and show log</button>
  </div>
}
export default App;
```
---
### fro.mixing.apply(condition, ...args)
##### 取得所有，上一次`apply`之后，虚拟数据对象和真实数据对象共有的变量，用虚拟数据覆盖真实数据，并触发`react`页面的重新渲染。
#### 参数
- `condition?: Function/Boolean` 可选参数，用来决定此函数是否真正执行。当此参数的类型为`Function`时，包含两个参数，分别是`constant`（等同于`fro.constant`）和`state`（此参数是`fro`对象中的虚拟数据对象`virtual_state`），返回一个`Boolean`类型的值。当此参数为真或者返回值为真时，`fro.mixing.apply(condition, ...args)`函数运行，当此参数为空时，默认执行此函数。
- `args?: Array<String>` 可选参数，装载需要用虚拟数据覆盖到真实数据的数据变量名。当`args`的`length`为0时，将所有改变了的虚拟数据都覆盖到真实数据；其他情况下，只覆盖特定数据。
#### 返回值：`fro.mixing`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {

  fro.mix((data, constant, state)=>["count",state.count + 1], "set_count")
  .involve("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.mixing.set_count().apply()}}>plus 1</button>
    <button onClick={()=>{fro.mixing.set_count().apply(null)}}>no change</button>
    <button onClick={()=>{fro.mixing.set_count().apply((constant, state)=>true, "count")}}>plus 1 too</button>
  </div>
  //If the apply function is not called here, the page will not change.
}
export default App;
```
---
### fro.mixing.back()
##### 返回`fro`对象。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {
  fro.set("num",10)
  .add((data, constant, state)=>["count", state.num], "set_count")
  .involve("count", useState(0))

  return <div>
    <p>{fro.state.count}</p>
    <button onClick={()=>{fro.mixing.set_count().apply().back().log()}}>to be 10 and show log</button>
  </div>
}
export default App;
```
---
### fro.effect.back()
##### 返回`fro`对象。
#### 返回值：`fro`
#### 例子
```javascript
import React from 'react';
import { useState } from 'react';
import fro from 'react-fro'
function App(props) {
  fro.delimit("open_baidu")
  .affect((data, constant, state)=>{ window.open("https:\/\/www.baidu.com")}, fro.constant.open_baidu)

  return <div>
    <button onClick={()=>{fro.effect.open_baidu([], true, 2).back().log()}}>open baidu 2 times and show log</button>
  </div>
}
export default App;
```
# 许可证
MIT
