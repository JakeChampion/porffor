import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';

// Load investigated skips - tests that have been investigated and determined to be unfixable
// Supports both exact file paths (ending in .js) and substring patterns
const loadInvestigatedSkips = (test262Path) => {
  try {
    const content = readFileSync(join(dirname(test262Path), 'investigated_skips.txt'), 'utf8');
    const exactSkips = new Set();
    const patternSkips = [];
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        if (trimmed.endsWith('.js')) {
          exactSkips.add(trimmed);
        } else {
          patternSkips.push(trimmed);
        }
      }
    }
    return { exactSkips, patternSkips };
  } catch {
    return { exactSkips: new Set(), patternSkips: [] };
  }
};

export default async (test262Path, filter, preludes, first = []) => {
  if (filter.startsWith('test/')) filter = filter.slice(5);
  const testPath = join(test262Path, 'test');
  const { exactSkips, patternSkips } = loadInvestigatedSkips(test262Path);

  const alwaysPrelude = preludes['assert.js'] + preludes['sta.js'] + preludes['compareArray.js'];

  const tests = [];
  const scan = async x => {
    const dir = await fs.readdir(x);

    const promises = [];
    for (const file of dir) {
      if (file.endsWith('.js')) {
        if (file.includes('_FIXTURE')) continue;
        promises.push(read(join(x, file)));
        continue;
      }

      promises.push(scan(join(x, file)).catch(() => {}));
      continue;
    }

    await Promise.all(promises);
  };

  const done = {};
  const read = async file => {
    if (done[file]) return;
    done[file] = true;

    // Skip tests in investigated_skips.txt (exact match or pattern match)
    const relPath = file.replace(testPath + '/', '');
    if (exactSkips.has(relPath) || patternSkips.some(p => relPath.includes(p))) {
      return;
    }

    let contents = await fs.readFile(file, 'utf8');

    const flags = {};
    let flagsRaw = contents.match(/^flags: \[(.*)\]$/m)?.[1];
    if (!flagsRaw && contents.includes('flags:')) {
      // check for md style list as fallback
      flagsRaw = contents.match(/^flags:\n(  - .*\s*\n)+/m);
      if (flagsRaw) flagsRaw = flagsRaw[0].replaceAll('\n  - ',',').slice(7, -1);
    }
    if (flagsRaw) {
      for (const x of flagsRaw.split(',')) {
        flags[x.trim()] = true;
      }
    }

    const includes = (contents.match(/^includes: \[(.*)\]$/m)?.[1] ?? '').split(',');

    // Parse features
    let featuresRaw = contents.match(/^features: \[(.*)\]$/m)?.[1];
    if (!featuresRaw && contents.includes('features:')) {
      // check for md style list as fallback
      featuresRaw = contents.match(/^features:\n(  - .*\s*\n)+/m);
      if (featuresRaw) featuresRaw = featuresRaw[0].replaceAll('\n  - ', ',').slice(10, -1);
    }
    const features = featuresRaw ? featuresRaw.split(',').map(x => x.trim()) : [];

    // Skip tests requiring unsupported features
    const unsupportedFeatures = [
      // Parser/syntax features not supported
      'decorators',
      'explicit-resource-management',
      'import-defer',
      'source-phase-imports',
      'source-phase-imports-module-source',
      // Runtime features not yet implemented
      'Temporal',
      'Intl.DateTimeFormat',
      'Intl.DisplayNames',
      'Intl.DurationFormat',
      'Intl.ListFormat',
      'Intl.Locale',
      'Intl.NumberFormat',
      'Intl.PluralRules',
      'Intl.RelativeTimeFormat',
      'Intl.Segmenter',
      'Intl-enumeration',
      'Proxy',
      'iterator-helpers',
      'ShadowRealm',
      'FinalizationRegistry',
      'WeakRef',
      'resizable-arraybuffer',
      'ArrayBuffer-transfer',
      'SharedArrayBuffer',
      'Atomics',
      'Atomics.waitAsync',
      'Atomics.pause',
      'tail-call-optimization',
      'regexp-lookbehind',
      'regexp-named-groups',
      'regexp-unicode-property-escapes',
      'regexp-v-flag',
      'regexp-duplicate-named-groups',
      'regexp-modifiers',
      'symbols-as-weakmap-keys',
      'promise-try',
      'import-attributes',
      'json-modules',
      'top-level-await',
      'Symbol.iterator', 
      'destructuring-binding',
      'cross-realm',
      'dynamic-import',
    ];
    if (features.some(f => unsupportedFeatures.includes(f))) {
      return; // Skip this test
    }

    // Skip annexB tests (non-standard legacy features)
    if (file.includes('/annexB/')) {
      return;
    }

    // Skip noStrict tests (non-strict mode only)
    if (flags.noStrict) {
      return;
    }

    // Skip module tests (ES modules not supported)
    if (flags.module) {
      return;
    }

    // Skip Intl - they have an esid which starts with sec-intl
    if (contents.match(/^esid:\s*sec-intl\./m)) {
      return;
    }

    // Skip Intl - they have files which contain the path /intl402/
    if (file.includes('/intl402/')) {
      return;
    }

    // Skip Unicode 17.0.0 tests (acorn doesn't support it yet)
    if (contents.includes('Unicode v17.0.0')) {
      return;
    }

    // Skip tests with pending esid (not yet standardized)
    if (contents.match(/^esid:\s*pending\s*$/m)) {
      return;
    }

    // skip es5id: 12.2.1-9-s
    if (contents.match(/^es5id:\s*12\.2\.1-9-s\s*$/m)) {
      return;
    }

    // skip eval tests - they all have a file path containing /language/eval-code
    if (file.includes('/language/eval-code/')) {
      return;
    }

    if (!flags.raw) {
      contents = (flags.onlyStrict ? '"use strict";\n' : '') +
        (flags.async ? preludes['doneprintHandle.js'] : '') +
        (includes.reduce((acc, x) => acc + (preludes[x.trim()] ?? ''), '')) +
        alwaysPrelude + contents;
    }

    let negative = contents.match(/^negative:\s*\n\s*phase:\s*(.*)\s*\n\s*type:\s*(.*)\s*$/m);
    if (negative) negative = {
      phase: negative[1],
      type: negative[2]
    };
    if (flags.negative && !negative) negative = true;

    tests.push({
      file: file.replace(testPath + '/', ''),
      contents,
      flags,
      negative
    });
  };

  if (filter) {
    if (filter.endsWith('.js')) await read(join(testPath, filter));
      else await scan(join(testPath, filter));
  } else {
    let wait = [];
    for (const x of first) wait.push(read(join(testPath, x)));
    await Promise.all(wait);
    await scan(testPath);
  }

  return tests;
};