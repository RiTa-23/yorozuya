// wrangler.jsonc で設定した bindings を、TypeScriptに教えるための型
export type Bindings = {
  DB: D1Database
}