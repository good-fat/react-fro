# react-fro
### [中文文档](/README_CN.md)
A interesting data management library of react that uses virtual data technology and chained logic calling technology.
## fro means function return object.
- Use virtual data for calculations and apply to the real world at the right time
- Encapsulate the logic into functions, and implement the program by calling different combinations of functions
- Make the process of combining functions wonderful with chained calls and clever function functions
- View program run data at any time using the `log` function
- Rely on `Immutable.js` and `pmfl`
- Currently only supports `React v16.7.0-alpha`
---
# Example
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
##### The object that loads the keyword data, `fro.setId(...args)`, `fro.removeId(...args)`, `fro.clearId()`, can change the value of this object.
---
### fro.logic
##### Load all the logical functions added by the `fro.add(func, otherName)` method, and the logical functions that come with the `fro.logic` object, `fro.remove(...args)`,`fro.clear() The `method can also be applied to this object.
#### Contain
- fro.logic.apply(...args)
- fro.logic.ifonly(condition)
- fro.logic.ifelse(condition)
- fro.logic.ifall(condition)
- fro.logic.endif()
- fro.logic.repeat(times)
---
### fro.state
##### Load all the real data needed for `react` rendering, initialize the data of this object by `fro.link(str, dataArray)` method, synchronize the virtual data to this by `fro.logic.apply(...args)` Object.
---
### fro.ref
##### Load `react` specific `ref` data, which is managed by `fro.setRef(str, dom)`, `fro.removeRef(str)`, `fro.clearRef()` methods.
---
## Methods
---
### fro.add(func, otherName)
##### Add a custom business function to the `fro.logic` object.
#### Parameter
- `func: Function` This function is a function of the custom business added to the `fro.logic` object. There are two data objects inside `fro`, which are virtual data and real data. And this function must have at least 2 parameters, `id` (equivalent to `fro.id`) and `state` (this parameter is a virtual data object in the `fro` object, and `fro.state` is a real data object. ), in addition to adding any number of other parameters. The return value of this function has two forms, an array or an object. When the return value is an array, the even-numbered element of the array is used as the key of the virtual data, and the odd-numbered element is used as the value of the virtual data, and is supplied to the virtual data loading object of the fro. When the return value is an object, this object is directly supplied to the virtual data object of `fro`.
- `otherName: String` This parameter is optional. The function name of the `func: Function` parameter is overwritten when this parameter is present. If `func: Function` is an anonymous function, this parameter must exist.
#### Return：`fro`
#### Example
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
##### Remove the custom business function added by the `fro.add(func, otherName)` function that exists in the `fro.logic` object.
#### Parameter
- `args: Array<String>` String type, an array containing the function names of the custom business functions.
#### Return：`fro`
#### Example
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
##### Clear all custom business functions in `fro.logic` (use with caution).
#### Return：`fro`
#### Example
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
##### Set the initial value of the virtual data variable in 'fro'. Note that if this variable already exists in the virtual data object, then calling this function is invalid (only valid for non-existing data).
#### Parameter
- `str: String` The key of the virtual data variable to be set.
- `data: Any` The value of the virtual data variable to be set.
#### Return：`fro`
#### Example
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
##### Two-way binding `react` renders the required data to the real data object in `fro` and copies the data to the virtual data object in `fro`.
#### Parameter
- `str: String` The name of the data variable to be bound (key).
- `dataArray: Array The return value of the `react` API `useState()` function, the first data is the value to be bound, and the second data is a function that can change this value.
#### Return：`fro`
#### Example
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
##### Set the function of the `fro.id` object data.
#### 参数
- `args: Array<String>` An array containing the id data to be set.
#### Return：`fro`
#### Example
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
##### A function that removes the `fro.id` object data.
#### 参数
- `args: Array<String>` An array containing the id data to be removed.
#### Return：`fro`
#### Example
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
##### Clear the function of the `fro.id` object data (use with caution).
#### Return：`fro`
#### Example
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
##### Bind the `ref` data of `react` to the `fro.ref` object.
#### Parameter
- `str: String` Bind the variable name of `ref`.
- `dom：Ref` `ref` data.
#### Return：`fro`
#### Example
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
##### Remove the data from the `fro.ref` object.
#### Parameter
- `str: String` The variable name of the `ref` to be removed.
#### Return：`fro`
#### Example
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
##### Clear the data in the `fro.ref` object (use with caution).
#### Return：`fro`
#### Example
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
##### Output data in the current fro object.
#### Parameter
- `str: String` Optional parameters. When the values are `id`, `ref`, `logic`, `state`, `virtualState`, the data of these five objects are output separately. When the value is other or non-existent, the data of all objects is output.
#### Return：`fro`
#### Example
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
##### Get all, after the last `apply`, the variables shared by the virtual data object and the real data object, overwrite the real data with the virtual data, and trigger the re-rendering of the `react` page.
#### Parameter
- `args: Array<String>` An optional parameter that loads the name of the data variable that needs to be overwritten with virtual data to the real data. When `lengths` of `args` is 0, all changed virtual data is overwritten to real data; in other cases, only specific data is overwritten.
#### Return：`fro.logic`
#### Example
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
##### Logical function. When the parameter `condition` is true, the next custom function called by the chain after this function will be executed, otherwise it will not be executed.
#### Parameter
- `condition: Boolean` When `condition` is true, the next custom chained call function will be executed later; when `condition` is false, the next custom chained call function will not be executed.
#### Return：`fro.logic`
#### Example
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
##### Logical function. When the parameter `condition` is true, the next custom function called by the chain after this function will be executed. The second custom function of the chain call after this function will not be executed; otherwise, the opposite operation will be performed.
#### 参数
- `condition: Boolean` When `condition` is true, the first custom chained call function will be executed, and the second custom chained call function will not be executed; when `condition` is false, the first custom is followed. The chained calling function will not be executed, and the second custom chained calling function will be executed later. The entire logic function runs like a ternary operator.
#### Return：`fro.logic`
#### Example
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
##### Logical functions that appear in pairs. When the parameter `condition` is true, after fro.logic.ifall(condition), all custom chained calling functions before fro.logic.endif() are executed; otherwise, they are not executed.
#### Parameter
- `condition: Boolean` When `condition` is true, after fro.logic.ifall(condition), all custom chained calling functions before fro.logic.endif() will be executed; when `condition` is false, fro.logic.ifall(condition After that, all custom chained calling functions before fro.logic.endif() will not be executed.
#### Return：`fro.logic`
#### Example
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
##### Logical function. The first custom chained call function that will be executed after this function will execute `times` times consecutively. Note that try not to mix with other logic functions.
#### Parameter
- `times: Number` The number of times the custom chained call function that will be executed after this function is executed repeatedly.
#### Return：`fro.logic`
#### Example
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
# License
MIT
