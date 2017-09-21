const fs = require('fs');
const path = require('path');
const utils = require('ntils');

const ENV = process.env;
const TMPDIR = ENV.TMPDIR || ENV.TEMP || ENV.TMP || ENV.HOME ||
  ENV.APPDATA || ENV.HOME || EVN.HOMEPATH;

function VModulePlugin(opts) {
  opts = opts || {};
  this.moduleType = opts.type || 'json';
  this.moduleName = opts.name;
  this.moduleFile = opts.file || this.createFile(opts);
}

VModulePlugin.prototype.createFile = function (opts) {
  let filename = path.normalize(
    `${TMPDIR}/${this.moduleName}-${utils.newGuid()}.${this.moduleType}`
  );
  let content = opts.content || opts.handler || {};
  if (utils.isFunction(content)) content = content();
  if (!utils.isString(content)) content = JSON.stringify(content);
  fs.writeFileSync(filename, content);
  return filename;
};

VModulePlugin.prototype.apply = function (compiler) {
  compiler.plugin("entry-option", (params, callback) => {
    let config = compiler.options;
    //添加别名
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias[this.moduleName] = this.moduleFile;
  });
};

module.exports = VModulePlugin;