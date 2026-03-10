
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements
content = content.replace(/amber-500/g, 'accent');
content = content.replace(/amber-400/g, 'accent-hover');
content = content.replace(/amber-600/g, 'accent');
content = content.replace(/shadow-amber-500\/20/g, 'shadow-accent-shadow');

fs.writeFileSync(filePath, content);
console.log('Replacements done in App.tsx');
