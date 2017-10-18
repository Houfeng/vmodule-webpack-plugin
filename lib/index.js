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
  this.moduleFile = this.createFile(opts);
  this.opts = opts;
}

VModulePlugin.prototype.watch = function (opts) {
  if (this.watching || !opts.watch) return;
  chokidar.watch(opts.watch, {
    ignoreInitial: true
  }).on('all', () => {
    this.createFile(opts);
    console.log('[VModule]:', `${this.moduleName} updated`);
  });
  this.watching = true;
};

VModulePlugin.prototype.createFile = function (opts) {
  if (opts.file) return opts.file;
  let content = opts.content || opts.handler || {};
  if (utils.isFunction(content)) content = content();
  if (!utils.isString(content)) content = JSON.stringify(content);
  let moduleId = md5(`${process.cwd()}/${this.moduleName}`);
  let filename = path.normalize(
    `${TMPDIR}/${moduleId}.${this.moduleType}`
  );
  fs.writeFileSync(filename, content);
  return filename;
};

VModulePlugin.prototype.apply = function (compiler) {
  compiler.plugin('entry-option', (params, callback) => {
    let config = compiler.options;
    //添加别名
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias[this.moduleName] = this.moduleFile;
  });
  compiler.plugin('watch-run', (watching, callback) => {
    this.watch(this.opts);
    callback();
  });
};

module.exports = VModulePlugin;