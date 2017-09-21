const VModule = require('./lib/index');

module.exports = function (webpackConf) {
  webpackConf.plugins.push(new VModule({
    name: "test1",
    content: {
      id: 'test1'
    }
  }));
  webpackConf.plugins.push(new VModule({
    name: "test2",
    handler: () => ({
      id: 'test2'
    })
  }));
};