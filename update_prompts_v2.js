const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const newRest = `RESTRIÇÕES:
NÃO inclua cabeçalhos, rodapés, nem botões ou ícones interativos com links externos reais. Elementos visuais como botões SÃO permitidos, mas NÃO podem ser clicáveis com caminhos externos (hrefs reais). O arquivo deve apresentar um layout estático 100% autônomo. Retorne APENAS o código HTML completo.`;

// Replace type 1
const oldRest1 = `RESTRIÇÕES:
Retorne APENAS o código HTML. Sem links reais ou interações de navegação.`;
content = content.replace(oldRest1, newRest);

// Replace type 2
const oldRest2 = `Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`;

// Use replace all for type 2 since it appears multiple times
content = content.replace(new RegExp(`Restrições Técnicas:\\nNÃO inclua cabeçalhos/rodapés externos\\. O arquivo deve ser 100% auto-contido\\. Retorne APENAS o código HTML completo, sem blocos de código markdown \\(html\\)\\.\\nAs páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens\\.`, 'g'), newRest);

// Also replace inside initial brandConfig state
content = content.replace(
    `- CORES: Fundo #0C0A09, acento Ouro #CA8A04.
- TIPOGRAFIA: Fira Sans e Fira Code.\``,
    `- CORES: Fundo #0C0A09, acento Ouro #CA8A04.
- TIPOGRAFIA: Fira Sans e Fira Code.

\${newRest}\``
);

// Also replace inside fallback reset state
content = content.replace(
    `  - ANIMAÇÕES: GSAP para transições fluidas e micro-interações técnicas.\``,
    `  - ANIMAÇÕES: GSAP para transições fluidas e micro-interações técnicas.

\${newRest}\``
);


fs.writeFileSync('src/App.tsx', content);
console.log('Done replacing constraints in App.tsx');
