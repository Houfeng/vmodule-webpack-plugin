# VModule webpack plugin

VModule 是一个用于创建虚拟模块 webpack 插件。

大约有如下使用场景:
- 需要在构建阶段将动态计算后结果生成一个模块
- 构建后的运行时代码需要引用一些构建阶段的环境变量或其它数据

## 安装

```sh
$ npm i vmodule-webpack-plugin --save
```

## 使用

在 webpack.config.js 中配置 VModule 
```js
const webpack = require('webpack');
const VModulePlugin = require('vmodule-webapck-plugin');

module.exports = {
  ...
  plugins: [
    //返回对象的虚拟模块
    new VModulePlugin({
      name: 'demo-module1',
      handler: function() {
        return { name: 'demo', env: process.env.NODE_ENV };
      }
    }),
    //返回代码的虚拟模块
    new VModulePlugin({
      name: 'demo-module2',
      code: true
      handler: function() {
        reutrn `
          exports.say = function(text) {
            console.log('say:', text);
          };
        `;
      }
    })
  ]
  ...
};
```

在代码中使用虚拟模块
```js
const module1 = require('demo-module1');
const module2 = requrie('demo-module2');

module2.say(JSON.stringify(module1));

//打印
//say: { "name": "demo", "env": "NODE_ENV 的值" }

```