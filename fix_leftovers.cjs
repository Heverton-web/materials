
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements for leftovers
content = content.replace(/accent\/20/g, 'accent-shadow');
content = content.replace(/accent-hover\/20/g, 'accent-shadow');
content = content.replace(/accent\/50/g, 'accent-shadow'); // Focus borders usually use /50, I'll mapped to a slightly stronger shadow anyway or just leave it if it works

fs.writeFileSync(filePath, content);
console.log('Leftover replacements done in App.tsx');
