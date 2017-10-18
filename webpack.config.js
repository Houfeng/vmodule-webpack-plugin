const VModule = require('./lib/index');
const fs = require('fs');

module.exports = function (webpackConf) {
  webpackConf.plugins.push(new VModule({
    name: "test1",
    content: {
      id: 'test1'
    }
  }));
  webpackConf.plugins.push(new VModule({
    name: "test2",
    handler: () => {
      return fs.readFileSync(`${__dirname}/test.txt`).toString();
    },
    watch: './test.txt'
  }));
};