# react-fro
A interesting data management library of react that uses virtual data technology and chained logic calling technology.
#### fro means function return object.
- 使用虚拟数据进行计算，在恰当的时候应用到真实世界
- 把逻辑封装为一个个函数，通过调用不同的函数组合来实现程序
- 使用链式调用和巧妙的功能函数，让组合函数的过程变得美妙
- 使用log函数随时查看程序运行数据
- 依赖Immutable.js和pmfl
- 目前只支持React v16.7.0-alpha
## 示例程序
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
    <p>每次点击按钮，数字就增加5-----{fro2.state.count}</p>
    <button onClick={() => { fro2.logic.repeat(5).countPlus().apply("count")}}>点击我</button>
  </div >
}
export default App;
```
## 安装
推荐使用yarn进行安装
```
yarn add react-fro
```
```
npm i react-fro --save
```
