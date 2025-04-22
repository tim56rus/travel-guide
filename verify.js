// verify-all.js
const fs   = require('fs');
const path = require('path');

const FILES = [
  path.join(__dirname, 'server.js'),
];

const DIRS = [
  path.join(__dirname, 'backend'),
  path.join(__dirname, 'frontend', 'src', 'pages'),
  path.join(__dirname, 'frontend', 'src', 'components'),
];

function requireFile(file) {
  if (!fs.existsSync(file)) return console.warn(`⚠️ Not found: ${file}`);
  try {
    require(file);
    console.log(`✓ ${file}`);
  } catch (err) {
    console.error(`✗ Error in ${file}:\n`, err);
    process.exit(1);
  }
}

function requireAll(dir) {
  if (!fs.existsSync(dir)) return console.warn(`⚠️ Not found: ${dir}`);
  fs.readdirSync(dir).forEach(name => {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      requireAll(filePath);
    } else if (/\.jsx?$/.test(name)) {
      requireFile(filePath);
    }
  });
}

FILES.forEach(requireFile);
DIRS.forEach(requireAll);

console.log('\n🎉 All JS/JSX files loaded OK.');

