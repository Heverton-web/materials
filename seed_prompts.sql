-- SCRIPT PARA INSERIR OS 31 MODELOS DE DESIGN NA BIBLIOTECA
-- Estrutura de Prompt Engineering Otimizada (Tags XML)
-- Substitua NULL pelo seu ID de usuário do Supabase (encontrado em Authentication > Users)

INSERT INTO public.prompt_library (user_id, title, description, content, is_default)
VALUES 
(
    NULL, 
    'Padrão', 
    'Estilo que utiliza as cores do branding',
    '<role>
Atue como um Desenvolvedor Front-end Sênior especialista em UI/UX, focado em criar experiências web fluidas e de alta retenção.
</role>

<task>
Gere uma página web interativa completa contida em um ÚNICO arquivo HTML autônomo. O arquivo deve mesclar HTML5, Tailwind CSS e JavaScript nativo sem dependências de build.
</task>

<technical_stack>
- CSS: Tailwind CSS (via CDN: https://cdn.tailwindcss.com)
- Ícones: Lucide Icons (via CDN: https://unpkg.com/lucide@latest)
- Fontes: Google Fonts (importadas no <head>)
- Interatividade: Vanilla JavaScript (incorporado antes do fechamento do <body>)
</technical_stack>

<strict_rules>
1. ISOLAMENTO TOTAL: NENHUMA tag <a> com atributo href apontando para URLs externas.
2. ZERO ROTAS DE FUGA: Proibida a criação de cabeçalhos de navegação, rodapés com links ou botões de redirecionamento.
3. MÍDIA: Não inclua tags de <video>, <img> ou <iframe>. Use apenas formas, cores, tipografia e os ícones do Lucide para o design.
4. TIPO DE INTERATIVIDADE: Toda a interação do usuário deve acontecer exclusivamente na mesma página, manipulando o DOM via JavaScript localmente.
</strict_rules>

<design_guidelines>
- Estilo: Elegante, limpo e profissional.
- Animações: Use transições suaves do Tailwind (ex: duration-300, ease-in-out) para hover, focus e mudanças de estado. Se necessário, use CSS puro ou bibliotecas via CDN.
- Responsividade: A página deve funcionar perfeitamente em mobile (default), tablet e desktop.
- Branding: Aplique o branding fornecido de forma rigorosa. [INSERIR DIRETRIZES DE BRANDING AQUI]
- Conteúdo: [INSERIR AQUI O TEXTO/TEMA DA PÁGINA]
</design_guidelines>

<output_format>
Retorne APENAS o código fonte raw completo e pronto para execução.
NÃO envolva a resposta em blocos de código markdown (como ```html). Inicie diretamente com <!DOCTYPE html> e termine com </html>. Não inclua explicações antes ou depois do código.
</output_format>',
    true
),
(
    NULL, 
    'Neobrutalismo + Pastel Pop', 
    'Estilo de alto contraste com bordas pretas espessas, sombras sólidas (Shadow-Pop) e paleta pastel vibrante. Ideal para fintechs e ferramentas modernas.',
    '<role>
Atue como um Desenvolvedor Front-end Sênior especialista em UI/UX, focado em criar experiências web fluidas e de alta retenção.
</role>

<task>
Gere uma página web interativa completa contida em um ÚNICO arquivo HTML autônomo. O arquivo deve mesclar HTML5, Tailwind CSS e JavaScript nativo sem dependências de build.
</task>

<technical_stack>
- CSS: Tailwind CSS (via CDN: [https://cdn.tailwindcss.com](https://cdn.tailwindcss.com))
- Ícones: Lucide Icons (via CDN: [https://unpkg.com/lucide@latest](https://unpkg.com/lucide@latest))
- Fontes: Google Fonts (importadas no <head>)
- Interatividade: Vanilla JavaScript (incorporado antes do fechamento do <body>)
</technical_stack>

<strict_rules>
1. ISOLAMENTO TOTAL: NENHUMA tag <a> com atributo href apontando para URLs externas.
2. ZERO ROTAS DE FUGA: Proibida a criação de cabeçalhos de navegação, rodapés com links ou botões de redirecionamento.
3. MÍDIA: Não inclua tags de <video>, <img> ou <iframe>. Use apenas formas, cores, tipografia e os ícones do Lucide para o design.
4. TIPO DE INTERATIVIDADE: Toda a interação do usuário deve acontecer exclusivamente na mesma página, manipulando o DOM via JavaScript localmente.
</strict_rules>

<design_guidelines>
- Estética Neobrutalista: Utilize bordas pretas sólidas e espessas (border-2 ou border-4 border-black). Remova arredondamentos excessivos em favor de cantos vivos ou levemente arredondados (rounded-none ou rounded-lg).
- Sombras Hard-Edge: Implemente o efeito ''Shadow-Pop''. Em vez de sombras suaves e esfumaçadas, use sombras sólidas e deslocadas (box-shadow: 8px 8px 0px 0px #000;) que não possuem desfoque.
- Paleta Pastel Pop: Combine um fundo off-white (bg-[#f4f4f0]) com elementos em cores pastéis vibrantes e saturadas (Amarelo #FFD100, Rosa #FF90E8, Verde Menta #B1F1CB).
- Tipografia e Peso: Use a fonte ''Inter'' ou ''Lexend'' via Google Fonts. Títulos devem ter peso font-black (900) e letras levemente comprimidas (tracking-tighter).
- Interatividade: Use GSAP (via CDN) para criar animações de ''mola'' (spring). Ao passar o mouse (hover), os elementos devem se deslocar na direção oposta da sombra, simulando um clique físico real.
- Estrutura: Layout estilo ''Service Grid'' ou ''Feature List'', com ícones Lucide grandes, sempre dentro de containers com bordas pretas.
- Conteúdo: [INSERIR AQUI O TEXTO/TEMA DA PÁGINA]
</design_guidelines>

<output_format>
Retorne APENAS o código fonte raw completo e pronto para execução.
NÃO envolva a resposta em blocos de código markdown (como ```html). Inicie diretamente com <!DOCTYPE html> e termine com </html>. Não inclua explicações antes ou depois do código.
</output_format>',
    true
),
(
    NULL, 
    'Bento Grid + Glassmorphism', 
    'Organização modular inspirada na Apple com efeitos de vidro, desfoque e profundidade. Layout assimétrico e moderno.',
    '<role>
Atue como um Desenvolvedor Front-end Sênior especialista em UI/UX, focado em criar experiências web fluidas e de alta retenção.
</role>

<task>
Gere uma página web interativa completa contida em um ÚNICO arquivo HTML autônomo. O arquivo deve mesclar HTML5, Tailwind CSS e JavaScript nativo sem dependências de build.
</task>

<technical_stack>
- CSS: Tailwind CSS (via CDN: https://cdn.tailwindcss.com)
- Ícones: Lucide Icons (via CDN: https://unpkg.com/lucide@latest)
- Fontes: Google Fonts (importadas no <head>)
- Interatividade: Vanilla JavaScript (incorporado antes do fechamento do <body>)
</technical_stack>

<strict_rules>
1. ISOLAMENTO TOTAL: NENHUMA tag <a> com atributo href apontando para URLs externas.
2. ZERO ROTAS DE FUGA: Proibida a criação de cabeçalhos de navegação, rodapés com links ou botões de redirecionamento.
3. MÍDIA: Não inclua tags de <video>, <img> ou <iframe>. Use apenas formas, cores, tipografia e os ícones do Lucide para o design.
4. TIPO DE INTERATIVIDADE: Toda a interação do usuário deve acontecer exclusivamente na mesma página, manipulando o DOM via JavaScript localmente.
</strict_rules>

<design_guidelines>
- Estrutura Bento Grid: Utilize um layout grid de 4 ou 6 colunas com auto-rows. Os cards devem ter tamanhos variados (col-span-1, col-span-2, row-span-2) para criar um ritmo visual assimétrico e moderno.
- Estética Glassmorphism: Aplique backdrop-blur-xl e fundos semi-transparentes (bg-white/5 ou bg-white/10). O segredo está na borda: use uma borda fina de 1px com transparência (border-white/20) para simular a quina de um vidro lapidado.
- Profundidade Visual: Use camadas de sombras muito suaves e amplas (shadow-[0_20px_50px_rgba(0,0,0,0.3)]). Os cards devem parecer flutuar sobre o fundo.
- Liquid Background Animado: Crie um fundo escuro profundo (bg-[#0a0a0c]) com pelo menos dois ''blobs'' de gradiente orgânico (um ciano e um violeta) que se movam lentamente usando animate-pulse ou Keyframes CSS personalizados com blur(100px).
- Tipografia e Ícones: Use a fonte ''Plus Jakarta Sans'' via Google Fonts. Os títulos devem ser font-bold e os ícones Lucide devem estar dentro de círculos ou quadrados de vidro com opacidade reduzida.
- Interatividade: Use GSAP (via CDN) para uma animação de ''Stagger'' (entrada em cascata) onde os cards aparecem um após o outro com um leve movimento de baixo para cima e escala.
- Conteúdo: [INSERIR AQUI O TEXTO/TEMA DA PÁGINA]
</design_guidelines>

<output_format>
Retorne APENAS o código fonte raw completo e pronto para execução.
NÃO envolva a resposta em blocos de código markdown (como ```html). Inicie diretamente com <!DOCTYPE html> e termine com </html>. Não inclua explicações antes ou depois do código.
</output_format>',
    true
),
(
    NULL, 
    'Aurora UI + Minimalismo Orgânico', 
    'Elegância etérea com fundos dinâmicos de gradiente suave e tipografia serifada premium.',
    '<role>
Atue como um Desenvolvedor Front-end Sênior especialista em UI/UX.
</role>

<task>
Gere uma página web interativa completa contida em um ÚNICO arquivo HTML autônomo com Tailwind CSS e JS nativo.
</task>

<technical_stack>
- CSS: Tailwind CSS via CDN
- Ícones: Lucide Icons via CDN
- Fontes: Google Fonts
- Interatividade: Vanilla JavaScript
</technical_stack>

<strict_rules>
1. ISOLAMENTO TOTAL: NENHUMA tag <a> com href para fora.
2. ZERO ROTAS DE FUGA: Sem cabeçalhos/rodapés de navegação ou redirecionamentos.
3. MÍDIA: Sem <video>, <img> ou <iframe>.
4. TIPO DE INTERATIVIDADE: DOM via JS localmente.
</strict_rules>

<design_guidelines>
- Estética Aurora: Crie um fundo dinâmico usando 3 ou 4 esferas de gradiente (blur-[120px]) com cores análogas (ex: Índigo, Violeta e fúcsia) que se movem lentamente via CSS Keyframes. O fundo base deve ser cinza quase preto (bg-[#050505]).
- Minimalismo Orgânico: Use tipografia serifada premium (Google Fonts ''Playfair Display'' ou ''Instrument Serif'') para títulos e sans-serif (''Inter'') para corpo. Letras com tracking-tighter nos títulos.
- Contraste de Superfície: Conteúdo flutuando em container central com bg-white/[0.02] e backdrop-blur-3xl. Bordas quase invisíveis (border-white/5).
- Interatividade & Animações: Efeito de ''Reveal'' suave no carregamento (opacity 0 para 1 com Y:20px). Cursor personalizado que reage (escala/mix-blend-mode) em elementos interativos.
- Estrutura: Layout ''Landing Page Hero'' ultra-clean, CTA central minimalista, ícones Lucide com traço fino (stroke-width: 1px).
- Conteúdo: [INSERIR AQUI O TEXTO/TEMA DA PÁGINA]
</design_guidelines>

<output_format>
Retorne APENAS o código HTML completo. Sem markdown (```html).
</output_format>',
    true
),
(
    NULL, 
    'Claymorphism + Soft 3D', 
    'Interfaces táteis e amigáveis que parecem feitas de argila ou plástico macio, com cores pastéis.',
    '<role>
Atue como um Desenvolvedor Front-end Sênior especialista em UI/UX.
</role>

<task>
Gere uma página web interativa completa contida em um ÚNICO arquivo HTML autônomo.
</task>

<technical_stack>
- CSS: Tailwind CSS via CDN
- Ícones: Lucide Icons via CDN
- Fontes: Google Fonts
- Interatividade: Vanilla JavaScript
</technical_stack>

<strict_rules>
1. ISOLAMENTO TOTAL: NENHUMA tag <a> com href para fora.
2. ZERO ROTAS DE FUGA: Sem cabeçalhos/rodapés de navegação ou redirecionamentos.
3. MÍDIA: Sem <video>, <img> ou <iframe>.
4. TIPO DE INTERATIVIDADE: Manipulação do DOM via JS localmente.
</strict_rules>

<design_guidelines>
- Estética Claymorphism: Elementos parecem argila/plástico macio. Utilize border-radius extremo (rounded-[3rem]) e combinação de box-shadow externa suave com duas sombras internas (inset) — clara no topo/esquerda e escura na base/direita.
- Paleta de Cores: Tons pastéis ''doces'' (Azul bebê #A5D8FF, Rosa chiclete #FFD6E8, Lilás #E5DBFF). Fundo gradiente radial muito suave.
- Profundidade e Camadas: Efeito de flutuação (bobbing) contínua nos elementos principais via CSS/JS.
- Tipografia: Fonte ''Outfit'' ou ''Quicksand''. Títulos font-bold, texto cinza azulado escuro (text-slate-700).
- Interatividade: Efeito de ''Squeeze'' no clique (active:scale-95) e hover suave (hover:scale-105).
- Estrutura: Layout estilo ''Onboarding Cards'', ícones Lucide estilizados com traços grossos.
- Conteúdo: [INSERIR AQUI O TEXTO/TEMA DA PÁGINA]
</design_guidelines>

<output_format>
Retorne APENAS o código HTML completo. Sem markdown (```html).
</output_format>',
    true
),
(
    NULL, 
    'Retro-Futurismo Synthwave + Clean Cyberpunk', 
    'Nostalgia tecnológica com acabamento premium, luzes neon refinadas e tipografia monospace.',
    '<role>
Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.
</role>
<task>
Gere HTML único e autônomo com Tailwind e JS nativo.
</task>
<technical_stack>
Tailwind CSS CDN, Lucide Icons CDN, Google Fonts, Vanilla JS.
</technical_stack>
<strict_rules>
SEM tags <a> externas. SEM navegação ou rodapés. SEM <img>, <video> ou <iframe>. Interação APENAS via DOM local.
</strict_rules>
<design_guidelines>
- Estética Retro-Futurista Clean: Fundo sólido ultra-escuro (bg-[#020205]) com grade de perspectiva (CSS grid floor) no rodapé desaparecendo no horizonte via mask-image.
- Neon Refinado: Cores neon (Ciano #00f3ff, Magenta #ff00ff) apenas como luzes de contorno (border com drop-shadow de 5px) e LEDs.
- Tipografia Monospace: ''Space Mono'' para dados, ''Syncopate'' ou ''Orbitron'' para títulos. Efeito sutil de ''flicker'' via CSS.
- Vidro Negro & Interatividade: Containers bg-black/60 com backdrop-blur-lg. Hover intensifica a borda neon e causa glitch rápido no texto.
- Animações: Linha de scanline vertical, animação estilo ''terminal boot'' na entrada.
- Estrutura: Layout ''Command Center'', ícones Lucide duotone neon.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>
Apenas HTML puro, sem markdown (```html).
</output_format>',
    true
),
(
    NULL, 
    'Skeuomorph Moderno (Neuomorphism 2.0)', 
    'Realismo tátil minimalista com sombras duplas precisas e sofisticação monocromática.',
    '<role>
Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.
</role>
<task>
Gere HTML único e autônomo com Tailwind e JS nativo.
</task>
<technical_stack>
Tailwind CSS CDN, Lucide Icons CDN, Google Fonts, Vanilla JS.
</technical_stack>
<strict_rules>
SEM tags <a> externas. SEM navegação ou rodapés. SEM <img>, <video> ou <iframe>. Interação APENAS via DOM local.
</strict_rules>
<design_guidelines>
- Estética Neuomorphism 2.0: Cor de base única para fundo e elementos (ex: Cinza Suave #E0E5EC). Volume com sombras duplas: clara topo/esquerda, escura (rgba(163,177,198,0.6)) base/direita.
- Textura: Leve curvatura (gradientes lineares quase imperceptíveis) simulando direção da luz.
- Acentos: Única cor vibrante (Azul Elétrico ou Verde Esmeralda) apenas para estados ativos.
- Tipografia: ''Inter'' ou ''Satoshi''. Baixo contraste com o fundo, mas font-bold para leitura.
- Interatividade: Clique troca sombras externas por internas (inset) simulando botão físico.
- Estrutura: Layout ''Smart Home Controller'', botões circulares, ícones parecendo gravados na superfície.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>
Apenas HTML puro, sem markdown.
</output_format>',
    true
),
(
    NULL, 
    'Maximalismo Tipográfico + Dark Mode', 
    'Impacto visual extremo através de fontes gigantes, alto contraste e composições dinâmicas.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML único e autônomo com Tailwind e JS nativo.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons CDN, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM tags <a> externas. SEM navegação. SEM mídia. Interação via DOM.</strict_rules>
<design_guidelines>
- Estética Maximalista: Texto é a estrutura. Fontes Display (''Syne'' ou ''Bricolage Grotesque''). Títulos gigantes (text-7xl/8xl), tracking-tighter, pesos entre font-black e font-thin.
- Dark Mode: bg-[#000000] absoluto, text-white. Efeito text-transparent com -webkit-text-stroke: 1px white.
- Composição Dinâmica: Quebre alinhamentos. Textos rotacionados (-rotate-90), faixas repetitivas (marquee), sobreposições.
- Animações: Animações de Scroll & Reveal de direções opostas. Staggered Letter Reveal na entrada.
- Interatividade: CTA funciona como ''Magnetic Button'' (atraído pelo cursor).
- Estrutura: Editorial de impacto, ícones Lucide agem apenas como acentos mínimos.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Grainy Textures + Mono-Chrome', 
    'Visual analógico, editorial e cinematográfico com texturas de ruído e tipografia clássica.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML único e autônomo com Tailwind e JS nativo.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons CDN, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos. SEM cabeçalho/rodapé. SEM mídia externa. Interação via DOM.</strict_rules>
<design_guidelines>
- Estética Grainy: Overlay de ruído analógico (filtro SVG feTurbulence em rect absoluto, opacity-20, pointer-events-none). Remete a papel/fotografia analógica.
- Paleta Monocromática: Fundo cinza médio-quente (bg-[#1a1a1a]), elementos em tons contrastantes usando mix-blend-mode (difference/overlay).
- Minimalismo Editorial: Tipografia serifada premium (''Cormorant Garamond'') para corpo, sans-serif (''Inter'') para dados. Muito whitespace.
- Profundidade Cinematográfica: Elementos simulando escala de cinza de alto contraste. Transições suaves simulando fade de cinema.
- Interatividade: Efeito ''Lens Blur'' (começa desfocado, ganha nitidez). Cursor invertendo cores do fundo.
- Estrutura: Layout ''Luxury Lookbook'', grid ortogonal, ícones Lucide ultra-finos (0.75px).
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Bauhaus Modernizado', 
    'Geometria pura, funcionalismo histórico e paleta primária sobre fundo papel.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML único e autônomo com Tailwind e JS nativo.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons CDN, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos. SEM navegação externa. SEM mídia. Interação no próprio DOM.</strict_rules>
<design_guidelines>
- Estética Bauhaus: Formas geométricas puras (círculos, quadrados, triângulos). Grid ortogonal rigoroso com divisórias sólidas de 1px (border-slate-900/10).
- Paleta Primária: Fundo ''Papel'' (bg-[#FDFCF5]). Cores base: Amarelo #F4D03F, Vermelho #E74C3C, Azul #2E86C1. Preto #1A1A1A para textos/linhas.
- Assimetria: Posições assimétricas equilibradas. Flex/grid para interceptar textos e formas.
- Tipografia Funcional: Apenas sans-serif geométricas (''Archivio'' ou ''Montserrat''). Títulos uppercase font-bold, alinhamentos variados.
- Animações Construtivistas: Formas deslizam e se encaixam como quebra-cabeça na entrada. Rotações em ícones no hover.
- Estrutura: Layout ''Design Studio'', seções numeradas grandes (01, 02).
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Holographic / Iridescent Design', 
    'Visual Web3 futurista com refração de luz, gradientes complexos e efeitos 3D de inclinação.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML único e autônomo com Tailwind e JS nativo.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons CDN, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos. SEM navegação externa. SEM mídia. Interação no próprio DOM.</strict_rules>
<design_guidelines>
- Estética Holográfica: Superfícies simulando refração. Gradientes complexos (ciano, rosa, lavanda, lima). Efeito ''shimmer'' em movimento infinito.
- Refração e Brilho: Containers bg-white/10, backdrop-blur-2xl. Borda iridescente fina. Drop-shadow mudando de matiz (hue-rotate).
- Profundidade Espacial: Fundo ''Dark Space'' (bg-[#030308]). Partículas sutis.
- Tipografia Futurista: ''Outfit'' ou ''Space Grotesk''. Títulos com leve text-shadow e cores holográficas.
- Interatividade: Efeito ''Tilt 3D'' com mouse: cards rotacionam e o gradiente interno desloca simulando reflexo.
- Estrutura: Layout ''Web3 Dashboard'', botões brilhantes, ícones Lucide metálicos.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Swiss Design + Grid Brutalism', 
    'Precisão suíça com estrutura industrial aparente, tipografia radical e grid modular visível.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML único e autônomo com Tailwind e JS nativo.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons CDN, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos. SEM navegação externa. SEM mídia. Interação no próprio DOM.</strict_rules>
<design_guidelines>
- Estética Swiss Design: Clareza absoluta. Grid modular visível (border-slate-200). Fundo ''Paper White'' (bg-[#f8f8f8]).
- Grids Brutalistas: Colunas fixas visíveis. Seções como prateleiras.
- Tipografia Suíça: Apenas ''Inter'' ou ''Plus Jakarta Sans''. Hierarquia drástica: labels em text-xs uppercase tracking-[0.2em], títulos text-6xl font-black alinhados à esquerda.
- Uso Estratégico do Vermelho: Interface P/B/Cinza, com vermelho vibrante (bg-[#ff0000]) APENAS para CTAs ou focos.
- Interatividade: Animações ''Grid Reveal'' (linhas desenham, depois o conteúdo). Secas e rápidas.
- Estrutura: Layout ''Index/Catalog'', numeração técnica, ícones precisos (1.5px) alinhados ao topo.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Minimalismo Japonês (Zen Design)', 
    'Foco no vazio (Ma), tipografia sutil, cores naturais e assimetria equilibrada.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rodapé/cabeçalho de navegação. SEM imagens/vídeos.</strict_rules>
<design_guidelines>
- Estética Zen: Abundância de espaço em branco (vazio/Ma). Fundo papel de arroz (bg-[#F9F6F0]).
- Cores Naturais: Acentos em tons de bambu, chá verde ou nanquim suave.
- Tipografia: Sans-serif ultra limpa (''Inter'' font-light). Espaçamento generoso.
- Estrutura: Assimetria perfeitamente balanceada, divisórias finíssimas.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Dark Academia', 
    'Atmosfera acadêmica vintage, tons terrosos escuros, tipografia serifada clássica.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Dark Academia: Fundo marrom escuro, verde musgo profundo ou bordô (bg-[#2C241B]).
- Tipografia Clássica: Serifadas elegantes (''Playfair Display'', ''Merriweather'') evocando livros antigos.
- Detalhes: Bordas duplas (CSS borders), tons de creme ou dourado envelhecido para texto, imitando biblioteca/luz de velas.
- Estrutura: Layouts de enciclopédia clássica ou jornal antigo com colunas.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Y2K Cyber Web', 
    'Nostalgia dos anos 2000, cores metálicas, rosa choque, gradientes iridescentes e estética tech-pop.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Y2K: Rosa chiclete, azul ciano, prata metálico. Fundos com gradiente radial intenso.
- Elementos Visuais: Caixas com bordas arredondadas grossas, sombras duras coloridas, simulando plástico translúcido/metal.
- Tipografia: ''Space Grotesk'' ou fontes pixeladas/arredondadas.
- Animações: Marquee (texto rolando), cursores personalizados, piscar rápido (blink).
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Eco-Brutalismo', 
    'Mistura do brutalismo de concreto com elementos orgânicos e verdes vibrantes.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Eco-Brutalista: Fundo cinza concreto (bg-[#D1D5DB]) com texturas, alto contraste com verde neon/folha vibrante.
- Estrutura: Grids expostos, linhas pretas grossas, sombras duras (shadow-solid) ou nenhuma.
- Tipografia: Grotescas pesadas e gigantes, caixa alta. Ícones orgânicos (folhas) flat via Lucide.
- Contraste: Frio (cinza) contra Vivo (verde) como guia visual principal.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Cyber-Glass (Neon + Glassmorphism)', 
    'Painéis de vidro translúcido flutuando sobre luzes neon intensas e fundos escuros.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Cyber-Glass: Fundo quase preto (bg-[#09090b]). Painéis contendo backdrop-blur-2xl e bg-white/5.
- Iluminação Neon: Sombras externas coloridas (box-shadow neon: ciano, magenta, lima) simulando LEDs ocultos atrás dos vidros.
- Tipografia: Modernas e limpas, títulos brilhantes (text-shadow neon).
- Animações: Pulsação suave (pulse) dos LEDs de fundo.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Retro 70s Groovy', 
    'Cores quentes (laranja, mostarda, marrom), formas fluidas e tipografia arredondada e espessa.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética 70s: Paleta quente (Laranja queimado, Mostarda, Marrom, Verde abacate).
- Formas: Bordas pill-shaped (arredondamento máximo), divisórias em ondas orgânicas (SVG inline).
- Tipografia: Fontes grossas com personalidade (ex: ''Fraunces'' Black/Cooper Black style).
- Vibração: Alegre, nostálgico, ausência de cantos duros.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Geometria Lúdica (Modern Memphis)', 
    'Padrões geométricos, cores primárias brilhantes, confetes visuais e design divertido.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Memphis: Fundo claro com patterns sutis (bolinhas, zigue-zague via CSS).
- Cores e Formas: Blocos sólidos vibrantes (Ciano, Amarelo, Rosa). Elementos flutuantes independentes (triângulos, círculos).
- Tipografia: Amigável e geométrica (''Poppins'', ''Quicksand'').
- Estrutura: Layout "espalhado" ludicamente, mas com legibilidade impecável.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Digital Scrapbook', 
    'Visual de colagem, texturas de papel rasgado, fitas adesivas e sobreposições caóticas controladas.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Scrapbook: Rotações leves em elementos (rotate-2, -rotate-3) simulando colagem.
- Texturas: Fundos papel pardo/quadriculado via CSS. Sombras duras estilo recorte.
- Detalhes: Divs semi-transparentes simulando washi tape (fita adesiva) prendendo os cards.
- Tipografia: Mistura de fonte máquina de escrever (''Courier Prime'') com manuscrita (''Caveat'').
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'High-Fashion Editorial', 
    'Elegância extrema, margens imensas, tipografia fina e contraste dramático.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Editorial: Estilo revista Vogue. Fundo branco puro ou off-white sofisticado.
- Tipografia: Títulos gigantes serifados ultra-finos/itálicos. Corpo de texto pequeno, hiper espaçado.
- Layout: Espaço em branco dramático. Linhas divisórias finíssimas em cinza claro.
- Alinhamento: Mistura blocos justificados e grandes citações centralizadas.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Vaporwave Aesthetic', 
    'Nostalgia dos anos 80/90, gradientes rosa e ciano, grids de perspectiva.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Vaporwave: Magenta, ciano, lavanda. Gradientes de pôr do sol sintético.
- Elementos Visuais: Janelas Win95 (bordas cinzas com relevo em inset shadows), grids de perspectiva em SVG no fundo.
- Tipografia: Serifadas espaçadas (V A P O R W A V E) misturadas com monospace retro.
- Atmosfera: Surreal, nostálgica, "glitchy".
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Monocromático Vibrante', 
    'Uso de uma única cor forte em várias tonalidades para criar uma experiência visual imersiva.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Monocromática: Cor base única e intensa (ex: Azul Klein, Laranja Neon). Variações apenas via luminosidade.
- Contraste: Textos na mesma cor base, mas forçando contraste (ultra claros/ultra escuros).
- Profundidade: Sombras e fundos com opacidade tonal da mesma cor (shadow-blue-900), nunca preto puro.
- Impacto: Interface "banhada" na atmosfera colorida.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Soft UI Clássico (Neumorphism 1.0)', 
    'Elementos que parecem extrudados do próprio fundo, com sombras suaves e baixo contraste.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Neumórfica: Fundo e elementos possuem A MESMA COR (ex: #e0e5ec).
- Sombras: O elemento "surge" via dupla box-shadow (luz branca topo-esquerda, sombra escura base-direita).
- Suavidade: Bordas arredondadas macias, nada de hard lines.
- Tipografia: Fontes limpas, textos em cinza médio para manter contraste baixo e elegante.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Industrial Tech Wear', 
    'Design utilitário, preto fosco, acentos em laranja segurança, tipografia técnica e códigos de barras.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Industrial: Preto fosco/Asfalto (bg-[#111111]). Acentos vibrantes (Laranja #FF6600).
- Elementos Técnicos: Linhas diagonais, listras de aviso (stripes), cantos cortados (clip-path chanfrado).
- Tipografia: Monospace ou grotesca rígida. Uso de labels técnicos falsos (coordenadas, serial numbers) como UI ornament.
- Estrutura: HUD tático ou console militar.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Gothic / Dark Fantasy', 
    'Atmosfera sombria, elegante e misteriosa, com vermelhos profundos, dourados envelhecidos e preto.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Gótica: Fundo preto profundo. Destaques em vermelho sangue, roxo ou dourado escuro.
- Tipografia: Serifadas dramáticas de alto contraste (''Cinzel'', ''Cormorant'').
- Ornamentos: Linhas elegantes, emulação de bordas de grimório antigo, layout centralizado luxuoso.
- Iluminação: Gradiente radial ao centro emulando luz de velas no breu.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Pop Art / Comic Book', 
    'Estilo história em quadrinhos, padrões de retícula (halftone), cores primárias estouradas e bordas grossas.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Comic Book: Bordas pretas irregulares e grossas. Padrões halftone (pontilhados) em fundos via CSS.
- Cores: Paleta CMYK saturada. Cores flat sem degradê liso.
- Tipografia: Itálicos pesados, uppercase (''Bangers''). Letreiros estilo HQ.
- Elementos Visuais: Containers simulando quadros de HQ ou balões de fala, sombras pretas sólidas duras.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Abstract Fluid Gradients', 
    'Formas orgânicas derretidas, gradientes complexos em movimento e visual onírico.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Fluida: Mesh gradients suaves e misturados (pêssego, lavanda).
- Formas: Sem cantos retos. Elementos em blobs (clip-paths orgânicos) ou bordas circulares totais.
- Tipografia: Sans-serif arredondada branca/translúcida, integrada ao mar de cores fluídas.
- Atmosfera: Onírica, calmante e em constante movimento suave.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Terminal / Hacker UI', 
    'Visual de linha de comando, texto verde brilhante sobre fundo preto, estética de código puro.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Terminal: bg-black puro. Texto, bordas e ícones EXCLUSIVAMENTE em verde neon (#00FF00).
- Tipografia: 100% Monospace (''Courier New'', ''Fira Code'').
- Estrutura: Blocos de console alinhados à esquerda. Divisórias feitas em ASCII (===, ---).
- Animações: Typewriter effect na inicialização, cursor text block piscando.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Surrealist Web', 
    'Layouts oníricos, proporções distorcidas, elementos flutuantes e quebra de expectativas.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Surreal: Paletas ilógicas (céu laranja, chão roxo). Elementos quebrando a gravidade física via posições absolutas.
- Tipografia: Caos belo. Mistura de fontes gigantes e minúsculas.
- Estrutura: Quebra total de grids. Sobreposição intencional de textos sobre formas, partes vazadas fora da viewport.
- Atmosfera: Obra de arte moderna desconstruída.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Art Deco Luxuoso', 
    'Glamour dos anos 1920, simetria geométrica, preto profundo e detalhes em dourado metálico.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Art Deco: Preto profundo (ou marinho escuro). Bordas, textos e ícones em ouro metálico (ex: #D4AF37).
- Formas: Geometria repetitiva, arcos perfeitos sobrepondo linhas retas, simetria central rígida.
- Tipografia: Fontes altas, finas e elegantes, uppercase (''Oswald'').
- Estrutura: Molduras com bordas múltiplas, evocando convite VIP Gatsby.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
),
(
    NULL, 
    'Space Age / Atomic 60s', 
    'Retro-futurismo dos anos 60, formas de estrelas, órbitas, cores pastéis espaciais e design otimista.',
    '<role>Atue como Desenvolvedor Front-end Sênior especialista em UI/UX.</role>
<task>Gere HTML autônomo único.</task>
<technical_stack>Tailwind CSS CDN, Lucide Icons, Google Fonts, Vanilla JS.</technical_stack>
<strict_rules>SEM links externos, SEM rotas de fuga. SEM mídia.</strict_rules>
<design_guidelines>
- Estética Space Age: Retro-futurismo otimista dos Jetsons. Azul celeste, coral, menta, branco estelar.
- Formas: Bumerangues, estrelas 4 pontas (sparkles SVG), ovais em rotação simulando órbitas.
- Tipografia: Geométrica retrô (''Jost'', ''Futura'').
- Atmosfera: Gravidade zero, clean, muito espaço em branco, flutuação lúdica.
- Conteúdo: [INSERIR TEMA AQUI]
</design_guidelines>
<output_format>Apenas HTML puro, sem markdown.</output_format>',
    true
);