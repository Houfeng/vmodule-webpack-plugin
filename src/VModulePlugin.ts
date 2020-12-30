import { isArray, isFunction, isString } from "ntils";

import { Compiler } from "webpack";
import { VModuleOptions } from './VModuleOptions';
import chokidar from "chokidar";
import md5 from "md5";
import { normalize } from "path";
import { tmpdir } from "os";
import { writeFileSync } from "fs";

export class VModulePlugin {

  protected options: VModuleOptions;
  protected moduleType: string;
  protected moduleName: string;
  protected moduleFile: string;
  protected watching: boolean;

  constructor(options: VModuleOptions) {
    this.options = Object.assign({
      type: "json"
    }, options);
    this.moduleType = this.options.type;
    this.moduleName = this.options.name;
    this.moduleFile = this.createFile(this.options);
  }

  protected createFile(opts: VModuleOptions) {
    if (opts.file) return opts.file;
    let content = opts.content || {};
    if (isFunction(content)) content = content();
    if (!isString(content)) content = JSON.stringify(content);
    const moduleId = md5(`${process.cwd()}/${this.moduleName}`);
    const filename = normalize(
      `${tmpdir()}/${moduleId}.${this.moduleType}`
    );
    writeFileSync(filename, String(content));
    return filename;
  };

  protected watch(opts: VModuleOptions) {
    if (this.watching || !opts.watch) return;
    chokidar.watch(opts.watch, {
      ignoreInitial: true
    }).on('all', () => {
      this.createFile(opts);
    });
    this.watching = true;
  };

  protected apply4Legacy(compiler: any) {
    compiler.plugin('entry-option', () => {
      const config = compiler.options;
      //添加别名
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      const { alias } = config.resolve;
      if (isArray(alias)) {
        alias.push({
          "name": this.moduleFile,
          "alias": this.moduleName
        })
      } else {
        alias[this.moduleName] = this.moduleFile;
      }
    });
    compiler.plugin('watch-run', (_watching: any, callback: any) => {
      this.watch(this.options);
      if (callback) callback();
    });
  }

  public apply(compiler: Compiler) {
    const { hooks } = compiler;
    if (!hooks || !hooks.entryOption || !hooks.watchRun) {
      return this.apply4Legacy(compiler);
    }
    compiler.hooks.entryOption.tap('entry-option', () => {
      const config = compiler.options;
      //添加别名
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      const { alias } = config.resolve;
      if (isArray(alias)) {
        alias.push({
          "name": this.moduleFile,
          "alias": this.moduleName
        })
      } else {
        alias[this.moduleName] = this.moduleFile;
      }
      return undefined;
    });
    compiler.hooks.watchRun.tap('watch-run', () => {
      this.watch(this.options);
    });
  }

}