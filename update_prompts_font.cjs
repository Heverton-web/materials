const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Update Branding prompt piece 1
const oldBrandingPiece = `        Diretrizes de Branding:
        \${brandConfig.description}
        Cores: Azul (\${brandConfig.primaryBlue}), Dourado (\${brandConfig.primaryGold})

        IDIOMA DA PÁGINA: \${langNames[lang]}`;

const newBrandingPiece = `        Diretrizes de Branding:
        \${brandConfig.description}
        Cores: Primária (\${brandConfig.primaryBlue}), Secundária (\${brandConfig.primaryGold})
        Tipografia Base: \${brandConfig.fontFamily}

        IDIOMA DA PÁGINA: \${langNames[lang]}`;

if (content.includes(oldBrandingPiece)) {
    content = content.replace(oldBrandingPiece, newBrandingPiece);
} else if (content.includes(oldBrandingPiece.replace(/\\n/g, '\\r\\n'))) {
    content = content.replace(oldBrandingPiece.replace(/\\n/g, '\\r\\n'), newBrandingPiece.replace(/\\n/g, '\\r\\n'));
}

// Update Typograpy instruction piece 2
const oldTypoPiece = `        2. TIPOGRAFIA:
        - Títulos: 'Roboto', 'Inter', 'Montserrat', sans-serif (Peso 700/900).
        - Corpo: 'Roboto', 'Inter', sans-serif (Peso 300/400).
        - Use fontes SANS-SERIF modernas e limpas.
        3. COMPONENTES DE IMPACTO:`;

const newTypoPiece = `        2. TIPOGRAFIA:
        - Família Principal Obrigatória: '\${brandConfig.fontFamily}', sans-serif.
        - Títulos: Use '\${brandConfig.fontFamily}' (Peso 700/900).
        - Corpo: Use '\${brandConfig.fontFamily}' (Peso 300/400).
        - Use APENAS a fonte principal definida acima em toda a página. Importe via Google Fonts se necessário.
        3. COMPONENTES DE IMPACTO:`;

if (content.includes(oldTypoPiece)) {
    content = content.replace(oldTypoPiece, newTypoPiece);
} else if (content.includes(oldTypoPiece.replace(/\\n/g, '\\r\\n'))) {
    content = content.replace(oldTypoPiece.replace(/\\n/g, '\\r\\n'), newTypoPiece.replace(/\\n/g, '\\r\\n'));
}

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx prompts updated with brandConfig.fontFamily!');
