import { readFileSync } from 'fs';
const r = JSON.parse(readFileSync('./test262/results.json', 'utf8'));
let skips = [];
try {
  skips = readFileSync('./test262/investigated_skips.txt', 'utf8')
    .split('\n')
    .filter(l => l && l[0] !== '#')
    .map(l => l.trim());
} catch {}

const fails = r.fails.filter(t => !skips.some(s => t.includes(s)));
console.log('Total remaining fails:', fails.length);

// Group by top-level category
const categories = {};
for (const f of fails) {
  const parts = f.split('/');
  const cat = parts[0] + '/' + parts[1];
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(f);
}

const sorted = Object.entries(categories).sort((a, b) => b[1].length - a[1].length);
console.log('\nTop failure categories:');
sorted.slice(0, 25).forEach(([cat, tests]) => {
  console.log(`  ${cat}: ${tests.length}`);
});

// Look at TypedArray specifically
console.log('\n--- TypedArray sub-categories ---');
const taFails = fails.filter(t => t.includes('TypedArray'));
const taCats = {};
for (const f of taFails) {
  const parts = f.split('/');
  const cat = parts.slice(0, 4).join('/');
  if (!taCats[cat]) taCats[cat] = [];
  taCats[cat].push(f);
}
Object.entries(taCats).sort((a,b) => b[1].length - a[1].length).slice(0, 15).forEach(([cat, tests]) => {
  console.log(`  ${cat}: ${tests.length}`);
});

// Look at Promise specifically
console.log('\n--- Promise sub-categories ---');
const promFails = fails.filter(t => t.includes('Promise/'));
const promCats = {};
for (const f of promFails) {
  const parts = f.split('/');
  const cat = parts.slice(0, 4).join('/');
  if (!promCats[cat]) promCats[cat] = [];
  promCats[cat].push(f);
}
Object.entries(promCats).sort((a,b) => b[1].length - a[1].length).slice(0, 15).forEach(([cat, tests]) => {
  console.log(`  ${cat}: ${tests.length}`);
});
