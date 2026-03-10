
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const injection = `
    // Dynamic Style for Scrollbars
    const styleId = 'aura-scrollbar-dynamic';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = \`
      *::-webkit-scrollbar-thumb { background-color: \${appAccentColor} !important; }
      *::-webkit-scrollbar-thumb:hover { background-color: \${appAccentColor}ee !important; }
    \`;
`;

content = content.replace("root.style.setProperty('--accent-hover', appAccentColor + 'ee');", "root.style.setProperty('--accent-hover', appAccentColor + 'ee');" + injection);

fs.writeFileSync(filePath, content);
console.log('Scrollbar injection added to App.tsx');
