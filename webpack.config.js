const { VModulePlugin } = require('./lib');
const fs = require('fs');
const path = require('path');

module.exports = {
  mode: "development",
  entry: './demo/index.js',
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new VModulePlugin({
      name: "test1",
      content: {
        id: 'test1'
      }
    }),
    new VModulePlugin({
      name: "test2",
      content: () => {
        return fs.readFileSync(`${__dirname}/test.txt`).toString();
      },
      watch: './test.txt'
    })
  ]
};
