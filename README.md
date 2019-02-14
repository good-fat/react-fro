# react-fro
### [中文文档](/README_CN.md)
A interesting data management library of react that uses virtual data technology and chained logic calling technology.
## fro means function return object.
- Use virtual data for calculations and apply to the real world at the right time
- Encapsulate the logic into functions, and implement the program by calling different combinations of functions
- Make the process of combining functions wonderful with chained calls and clever function functions
- View program run data at any time using the `log` function
- Rely on `Immutable.js` and `pmfl`
- Need `HOOKS` API, currently only supports `React v16.8.1`
---
# Example
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
    <button onClick={() => { fro.logic.countPlus(null,true,5).apply(true, "count")}}>plus 5</button>
  </div >
}
export default App;
```
---
# Installation
It is recommended to use yarn for installation.
```
yarn add react-fro
```
Or
```
npm i react-fro --save
```
---
# API
---
## Object
### fro
##### An object that loads all methods and objects.
#### Contain
- fro.constant
- fro.logic
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
##### The object that loads the constant data is initialized by the `fro.delimit(str, const_data)` function, and the value of the data in the object cannot be changed.
---
### fro.logic
##### A logical function object that calls the `fro.add(func, other_name)` method to add a logical function to this object.
#### contain
- fro.logic.apply(condition, ...args)
- fro.logic.back()
---
### fro.state
##### Load all the real data needed for `react` rendering, initialize the data of this object by `fro.involve(str, data_array)` method, and synchronize the virtual data by `fro.logic.apply(condition, ...args)` method. Object.
---
### fro.effect
##### A side-effect function object that calls the `fro.affect(func, other_name)` method to add a function containing side effects to this object.
#### contain
- fro.effect.back()
---
### fro.ref
##### Load `react` specific `ref` data, which is initialized by the `fro.link(str, dom)` method.
---
## Methods
---
### fro.add(func, other_name)
##### Add a custom business function to the `fro.logic` object.
#### parameter
- `func: Function` This function is a function of the custom business added to the `fro.logic` object. There are two data objects inside `fro`, which are virtual data and real data. This function has three parameters, `data`, `constant` (equivalent to `fro.constant`) and `state` (this parameter is the virtual data object `virtual_state` in the `fro` object). The return value of this parameter can take two forms, an array or an object. When the return value is an array, the even-numbered element of the array is used as the key of the virtual data, and the odd-numbered element is used as the value of the virtual data, and is supplied to the virtual_state object of the fro. This object is provided directly to the virtual_state object when the return value is an object.
- `other_name: String` This parameter is optional. The function name of the `func: Function` parameter is overridden when this parameter is present. If `func: Function` is an anonymous function, this parameter must exist.
#### Additional instructions
##### The function added to the `fro.logic` object contains three parameters, `data`, `condition`, `times`.
- `data: Any` The first argument passed to the function in `fro.logic` represents user-defined data, usually an object or array type.
- `condition: Function/Boolean` The second argument passed to the function in `fro.logic`, which is `true` or the return value of this function is `true`, the function can execute the predefined logic; otherwise, the function returns directly without executing logic. The function logic is executed by default when the parameter does not exist.
- `times: Number` The third parameter passed to the function in `fro.logic` represents the number of executions of the logic function. When this parameter is less than 1, it is executed only once; when this parameter is a decimal, the number of integer parts is executed.
#### return：`fro`
#### example
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
### fro.affect(func, other_name)
##### Add a function to the `fro.effect` object to perform side effects.
#### parameter
- `func: Function` This function is a function added to the `fro.effect` object to perform side effects. There are two data objects inside `fro`, which are virtual data and real data. This function has three parameters, `data`, `constant` (equivalent to `fro.constant`) and `state` (this parameter is the virtual data object `virtual_state` in the `fro` object). This parameter has no return value and is used to perform side effects.
- `other_name: String` This parameter is optional. The function name of the `func: Function` parameter is overridden when this parameter is present. If `func: Function` is an anonymous function, this parameter must exist.
#### Additional instructions
##### The function added to the `fro.effect` object contains three parameters, `data`, `condition`, `times`.
- `data: Any` The first argument passed to the function in `fro.effect` represents user-defined data, usually an object or array type.
- `condition: Function/Boolean` The second argument passed to the function in `fro.effect`, which is `true` or the return value of this function is `true`, the function can execute the predefined logic; otherwise, the function returns directly without executing logic. The function logic is executed by default when the parameter does not exist.
- `times: Number` The third parameter passed to the function in `fro.logic` represents the number of executions of the logic function. When this parameter is less than 1, it is executed only once; when this parameter is a decimal, the number of integer parts is executed.
#### return：`fro`
#### example
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
##### Two-way binding `react` renders the required data to the real data object in `fro` and copies the data to the virtual data object in `fro`.
#### parameter
- `str: String` The name of the data variable to be bound (key).
- `data_array: Array` The return value of the ``actState()` function of `react`, the first data is the value to be bound, and the second data is the function that can change this value.
#### return：`fro`
#### example
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
##### Set the initial value of the virtual data variable in 'fro'. Note that if this variable already exists in the virtual data object, then calling this function is invalid (only valid for non-existing data), virtual data needs to use `fro.logic` The function in the object changes.
#### parameter
- `str: String` The key of the virtual data variable to be set.
- `set_data: Any` The value of the virtual data variable to be set.
#### return：`fro`
#### example
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
##### Define the data in the `fro.constant` object. All data in this object is constant and cannot be changed.
#### parameter
- `str: String` The name of the constant to be defined.
- `const_data: Any` Optional parameter, the value of the constant to be defined. When this parameter does not exist, the constant name and constant value are both `str` parameters.
#### return：`fro`
#### example
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
##### Bind the `ref` data of `react` to the `fro.ref` object.
#### parameter
- `str: String` Bind the variable name of `ref`.
- `dom：Ref` `ref` data.
#### return：`fro`
#### example
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
##### Marks the execution of a set of `fro`-owned functions to prevent memory leaks when the `react` component is destroyed.
#### parameter
- `str: String` The name to be tagged is generally the same as the component name.
#### return：`marked_fro`
---
### fro.uninstall(str)
##### Destroys all data marked by the `fro.mark(str)` function to prevent memory leaks when the `react` component is destroyed.
#### parameter
- `str: String`The name of the data group to be destroyed, generally the same as the component name.
#### return：`fro`
#### example
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
    })

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
##### Output the data in the current fro object.
#### parameter
- `str: String` Optional parameters. When the values are `constant`, `ref`, `logic`, `effect`, `state`, `virtual_state`, `marked_data`, the data of these seven objects are output separately. When the value is other or non-existent, all objects are output. The data.
#### return：`fro`
#### example
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
##### Get all, after the last `apply`, the variables shared by the virtual data object and the real data object, overwrite the real data with the virtual data, and trigger the re-rendering of the `react` page.
#### parameter
- `condition? :Function / Boolean` An optional parameter that determines whether this function is actually executed. When the type of this parameter is `function`, it contains two parameters, `constant` (equivalent to `fro.constant`) and `state` (this parameter is the virtual data object `virtual_state` in the `fro` object. ), returns a value of type `Boolean`. When this parameter is true or the return value is true, the `fro.logic.apply (condition,... args)` function runs. When this parameter is empty, this function is executed by default.
- `args?: Array<String>` An optional parameter that loads the data variable name that needs to be overwritten with virtual data to the real data. When the `lengths` of `args` is 0, all the changed virtual data is overwritten to the real data; in other cases, only the specific data is overwritten.
#### return：`fro.logic`
#### example
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
##### Returns the `fro` object.
#### return：`fro`
#### example
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
### fro.effect.back()
##### Returns the `fro` object.
#### return：`fro`
#### example
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
# License
MIT
