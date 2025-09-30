const fs = require('fs');
const path = require('path');

// Build script: copies a small set of static files from the repo root into build/
// Keeps things intentionally simple so it works in CI and locally without extra deps.

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'build');
const filesToCopy = [
  'index.html',
  'artccs.json',
  'overrides.json'
];

function cleanDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (e) {
    // ignore
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFiles() {
  filesToCopy.forEach((file) => {
    const src = path.join(root, file);
    const dest = path.join(outDir, path.basename(file));
    if (!fs.existsSync(src)) {
      console.warn(`Skipping missing file: ${file}`);
      return;
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> ${path.relative(root, dest)}`);
  });
}

function main() {
  console.log('Building static output into', outDir);
  cleanDir(outDir);
  ensureDir(outDir);
  copyFiles();
  console.log('Build finished.');
}

if (require.main === module) main();
