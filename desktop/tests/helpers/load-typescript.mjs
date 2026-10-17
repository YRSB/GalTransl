import { existsSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);

export function createTypeScriptLoader(globals = {}, mocks = {}) {
  const modules = new Map();
  function load(input) {
    let file = input instanceof URL ? fileURLToPath(input) : input;
    if (!existsSync(file) || statSync(file).isDirectory()) file = ['.ts', '.tsx', '.json', '/index.ts'].map((extension) => file + extension).find(existsSync);
    if (!file) throw new Error(`Missing test module: ${input}`);
    if (modules.has(file)) return modules.get(file);
    if (file.endsWith('.json')) return JSON.parse(readFileSync(file, 'utf8'));
    const exports = {};
    modules.set(file, exports);
    const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      transformers: {
        before: [(context) => {
          const visit = (node) => ts.isMetaProperty(node)
            ? ts.factory.createIdentifier('__importMeta')
            : ts.visitEachChild(node, visit, context);
          return (node) => ts.visitNode(node, visit);
        }],
      },
    });
    vm.runInNewContext(outputText, {
      exports, console, Error, Intl, Date, URL, AbortController, setTimeout, clearTimeout,
      __importMeta: { env: { DEV: true } },
      ...globals,
      require(name) {
        if (Object.hasOwn(mocks, name)) return mocks[name];
        return name.startsWith('.') ? load(resolve(dirname(file), name)) : require(name);
      },
    }, { filename: file });
    return exports;
  }
  return load;
}
