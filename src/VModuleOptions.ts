
export interface VModuleOptions {
  type?: "json" | "js";
  name?: string;
  watch?: string | string[];
  file?: string;
  content?: string | JSON | Object | (() => string);
}
