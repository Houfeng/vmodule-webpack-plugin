const store = require('./store');
const utils = require('ntils');

module.exports = function (name) {
  let opts = store[name];
  let result = opts.handler();
  if (!opts.code) {
    result = `module.exports=${JSON.stringify(result)};`;
  }
  return result;
};