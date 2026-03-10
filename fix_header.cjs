
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Logo background and shadow
content = content.replace(/shadow-blue-500\/20" style={{ backgroundColor: brandConfig\.primaryBlue }}/g, 'shadow-accent-shadow" style={{ backgroundColor: appAccentColor }}');

// "Builder" text color
content = content.replace(/Interactive <span style={{ color: brandConfig\.primaryGold }}>Builder<\/span>/g, 'Interactive <span style={{ color: appAccentColor }}>Builder</span>');

fs.writeFileSync(filePath, content);
console.log('Header colors updated via script');
