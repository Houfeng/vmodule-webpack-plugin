const fs = require('fs');
const path = require('path');
const store = require('./store');

const ENV = process.env;

function VModulePlugin(opts) {
  this.opts = opts || {};
  let tmpDir = ENV.TMPDIR || ENV.TEMP || ENV.TMP || ENV.HOME ||
    ENV.APPDATA || ENV.HOME || EVN.HOMEPATH;
  this.proxyFile = path.normalize(`${tmpDir}/${this.opts.name}.vmodule`);
  fs.writeFileSync(this.proxyFile, this.opts.name);
  store[this.opts.name] = this.opts;
}

VModulePlugin.prototype.apply = function (compiler) {
  compiler.plugin("entry-option", (params, callback) => {
    let config = compiler.options;
    //添加别名
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias[this.opts.name] = this.proxyFile;
    //添加 loader
    config.module.loaders.push({
      test: /\.vmodule$/,
      loader: require.resolve('./loader'),
    });
  });
};

module.exports = VModulePlugin;