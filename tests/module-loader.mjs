import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Load the application's TypeScript while replacing only external boundaries.
// Each invocation has an isolated module cache so fixtures cannot leak between tests.
export function loadTs(filename, mocks = {}) {
  const cache = new Map();
  function load(target) {
    const absolute = path.resolve(target);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const mod = { exports: {} };
    cache.set(absolute, mod);
    const nativeRequire = createRequire(absolute);
    const requireModule = (specifier) => {
      if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
      if (specifier === 'server-only') return {};
      if (specifier.startsWith('@/') || specifier.startsWith('.')) {
        const base = specifier.startsWith('@/')
          ? path.resolve(process.cwd(), specifier.slice(2))
          : path.resolve(path.dirname(absolute), specifier);
        const resolved = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`]
          .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
        if (resolved && /\.tsx?$/.test(resolved)) return load(resolved);
      }
      return nativeRequire(specifier);
    };
    const { outputText } = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: absolute,
    });
    const wrapper = vm.runInThisContext(`(function(require,module,exports,__filename,__dirname){${outputText}\n})`, { filename: absolute });
    wrapper(requireModule, mod, mod.exports, absolute, path.dirname(absolute));
    return mod.exports;
  }
  return load(filename);
}
