const fs = require('fs');
const path = require('path');
const utils = require('ntils');
const chokidar = require('chokidar');
const md5 = require('md5');

const ENV = process.env;
const TMPDIR = ENV.TMPDIR || ENV.TEMP || ENV.TMP || ENV.HOME ||
  ENV.APPDATA || ENV.HOME || EVN.HOMEPATH;

function VModulePlugin(opts) {
  opts = opts || {};
  this.moduleType = opts.type || 'json';
  this.moduleName = opts.name;
  this.moduleId = md5(`${process.cwd()}/${this.moduleName}`);
  this.moduleFile = opts.file || this.createFile(opts);
  this.watch(opts);
}

VModulePlugin.prototype.watch = function (opts) {
  if (!opts.watch) return;
  chokidar.watch(opts.watch, {
    ignoreInitial: true
  }).on('all', () => {
    this.createFile(opts);
    console.log('[VModule]:', `${this.moduleName} updated`);
  });
};

VModulePlugin.prototype.createFile = function (opts) {
  let content = opts.content || opts.handler || {};
  if (utils.isFunction(content)) content = content();
  if (!utils.isString(content)) content = JSON.stringify(content);
  let filename = path.normalize(
    `${TMPDIR}/${this.moduleId}.${this.moduleType}`
  );
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