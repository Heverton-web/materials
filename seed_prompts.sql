-- SCRIPT PARA INSERIR OS 31 MODELOS DE DESIGN NA BIBLIOTECA
-- Substitua 'SEU_USER_ID_AQUI' pelo seu ID de usuário do Supabase (encontrado em Authentication > Users)

INSERT INTO public.prompt_library (user_id, title, description, content)
VALUES 
(
    'SEU_USER_ID_AQUI', 
    'Padrão', 
    'Estilo que utiliza as cores do branding',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design
"Gere um ÚNICO arquivo HTML autônomo contendo HTML, CSS (use Tailwind via CDN: https://cdn.tailwindcss.com) e JS (use Lucide Icons via CDN: https://unpkg.com/lucide@latest).

NÃO inclua cabeçalhos ou rodapés externos do construtor.
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.

Aplique o branding fornecido de forma elegante e profissional.

Use animações suaves (pode usar CSS puro ou bibliotecas via CDN se necessário).

O arquivo deve ser auto-contido e pronto para ser aberto em qualquer navegador.

Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).'
),
(
    'SEU_USER_ID_AQUI', 
    'Neobrutalismo + Pastel Pop', 
    'Estilo de alto contraste com bordas pretas espessas, sombras sólidas (Shadow-Pop) e paleta pastel vibrante. Ideal para fintechs e ferramentas modernas.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Neobrutalista: Utilize bordas pretas sólidas e espessas (border-2 ou border-4 border-black). Remova arredondamentos excessivos em favor de cantos vivos ou levemente arredondados (rounded-none ou rounded-lg).
- Sombras Hard-Edge: Implemente o efeito ''Shadow-Pop''. Em vez de sombras suaves e esfumaçadas, use sombras sólidas e deslocadas (box-shadow: 8px 8px 0px 0px #000;) que não possuem desfoque.
- Paleta Pastel Pop: Combine um fundo off-white (bg-[#f4f4f0]) com elementos em cores pastéis vibrantes e saturadas (Amarelo #FFD100, Rosa #FF90E8, Verde Menta #B1F1CB).
- Tipografia e Peso: Use a fonte ''Inter'' ou ''Lexend'' via Google Fonts. Títulos devem ter peso font-black (900) e letras levemente comprimidas (tracking-tighter).
- Interatividade: Use GSAP para criar animações de ''mola'' (spring). Ao passar o mouse (hover), os elementos devem se deslocar na direção oposta da sombra, simulando um clique físico real.
- Estrutura: Layout estilo ''Service Grid'' ou ''Feature List'', com ícones Lucide grandes, sempre dentro de containers com bordas pretas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Bento Grid + Glassmorphism', 
    'Organização modular inspirada na Apple com efeitos de vidro, desfoque e profundidade. Layout assimétrico e moderno.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estrutura Bento Grid: Utilize um layout grid de 4 ou 6 colunas com auto-rows. Os cards devem ter tamanhos variados (col-span-1, col-span-2, row-span-2) para criar um ritmo visual assimétrico e moderno.
- Estética Glassmorphism: Aplique backdrop-blur-xl e fundos semi-transparentes (bg-white/5 ou bg-white/10). O segredo está na borda: use uma borda fina de 1px com transparência (border-white/20) para simular a quina de um vidro lapidado.
- Profundidade Visual: Use camadas de sombras muito suaves e amplas (shadow-[0_20px_50px_rgba(0,0,0,0.3)]). Os cards devem parecer flutuar sobre o fundo.
- Liquid Background Animado: Crie um fundo escuro profundo (bg-[#0a0a0c]) com pelo menos dois ''blobs'' de gradiente orgânico (um ciano e um violeta) que se movam lentamente usando animate-pulse ou Keyframes CSS personalizados com blur(100px).
- Tipografia e Ícones: Use a fonte ''Plus Jakarta Sans'' via Google Fonts. Os títulos devem ser font-bold e os ícones Lucide devem estar dentro de círculos ou quadrados de vidro com opacidade reduzida.
- Interatividade: Use GSAP para uma animação de ''Stagger'' (entrada em cascata) onde os cards aparecem um após o outro com um leve movimento de baixo para cima e escala.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Aurora UI + Minimalismo Orgânico', 
    'Elegância etérea com fundos dinâmicos de gradiente suave e tipografia serifada premium.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Aurora: Crie um fundo dinâmico usando 3 ou 4 esferas de gradiente (blur-[120px]) com cores análogas (ex: Índigo, Violeta e fúcsia) que se movem lentamente em órbitas irregulares via CSS Keyframes. O fundo base deve ser um cinza quase preto (bg-[#050505]).
- Minimalismo Orgânico: Use tipografia serifada premium para títulos (Google Fonts ''Playfair Display'' ou ''Instrument Serif'') e sans-serif para corpo (''Inter''). Garanta um letter-spacing negativo nos títulos (tracking-tighter).
- Contraste de Superfície: O conteúdo principal deve flutuar em um container central com bg-white/[0.02] e backdrop-blur-3xl. As bordas devem ser quase invisíveis (border-white/5).
- Interatividade & Animações: Use GSAP para um efeito de ''Reveal'' suave no carregamento (opacity 0 para 1 com deslocamento de 20px no eixo Y). Adicione um cursor personalizado que reage ao passar sobre elementos clicáveis (escala e mudança de mix-blend-mode).
- Estrutura: Layout de ''Landing Page Hero'' ultra-clean, com um CTA central minimalista e ícones Lucide com traço fino (stroke-width: 1px).

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Claymorphism + Soft 3D', 
    'Interfaces táteis e amigáveis que parecem feitas de argila ou plástico macio, com cores pastéis.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Claymorphism: Os elementos devem parecer feitos de argila ou plástico macio. Utilize border-radius extremo (rounded-[3rem]) e uma combinação de box-shadow externa suave com duas sombras internas (inset) — uma clara no topo esquerdo e uma escura no canto inferior direito — para criar volume 3D tátil.
- Paleta de Cores: Use tons pastéis ''doces'' (ex: Azul bebê #A5D8FF, Rosa chiclete #FFD6E8, Lilás #E5DBFF). O fundo deve ser um gradiente radial muito suave entre duas cores pastéis próximas.
- Profundidade e Camadas: Implemente o efeito de flutuação. Use GSAP para criar uma animação de ''Floating'' contínua (bobbing) nos elementos principais, fazendo-os subir e descer levemente em tempos diferentes.
- Tipografia: Use a fonte ''Outfit'' ou ''Quicksand'' via Google Fonts para manter o aspecto amigável e arredondado. Títulos em font-bold e cores de texto em tons de cinza azulado escuro (text-slate-700).
- Interatividade: Adicione um efeito de ''Squeeze'' (compressão) no clique via CSS active:scale-95 e transições de hover:scale-105 extremamente suaves.
- Estrutura: Layout estilo ''Onboarding Cards'' ou ''Feature Showcase'' com ícones Lucide estilizados com traços grossos e cores vibrantes.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Retro-Futurismo Synthwave + Clean Cyberpunk', 
    'Nostalgia tecnológica com acabamento premium, luzes neon refinadas e tipografia monospace.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Retro-Futurista Clean: Combine o estilo noir tecnológico com elegância moderna. Utilize um fundo sólido ultra-escuro (bg-[#020205]) com uma grade de perspectiva (CSS grid floor) no rodapé que desaparece no horizonte com mask-image linear-gradient.
- Neon Refinado: Evite o excesso de brilho. Use cores neon (Ciano #00f3ff e Magenta #ff00ff) apenas como luzes de contorno (border com drop-shadow de 5px) e detalhes em pequenos LEDs indicadores.
- Tipografia Monospace & Display: Use a fonte ''Space Mono'' para dados e labels, e ''Syncopate'' ou ''Orbitron'' via Google Fonts para títulos principais. Aplique um efeito sutil de ''flicker'' (piscar) via CSS Keyframes em elementos de destaque.
- Interatividade & Efeitos de Vidro Negro: Utilize containers com bg-black/60 e backdrop-blur-lg. Ao passar o mouse, a borda neon do elemento deve aumentar de intensidade e o texto deve ganhar um efeito de ''glitch'' controlado e rápido.
- Animações: Use GSAP para criar uma linha de ''scanline'' que percorre a tela verticalmente e animações de entrada estilo ''terminal boot'' (texto surgindo caractere por caractere).
- Estrutura: Layout de ''Command Center'' ou ''Tech Dashboard'', com ícones Lucide estilizados em modo duotone usando as cores neon da paleta.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Skeuomorph Moderno (Neuomorphism 2.0)', 
    'Realismo tátil minimalista com sombras duplas precisas e sofisticação monocromática.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Neuomorphism 2.0: Diferente da primeira versão, esta deve ser refinada. Utilize uma cor de base única para fundo e elementos (ex: Cinza Suave #E0E5EC ou Azul Gelo #E2E8F0). Crie volume usando sombras duplas precisas: uma sombra clara (white) no topo/esquerda e uma sombra escura (rgba(163,177,198,0.6)) na base/direita.
- Textura e Material: Adicione uma leve curvatura côncava ou convexa aos cards usando gradientes lineares quase imperceptíveis que seguem a direção da luz.
- Acentos de Cor: Escolha uma única cor de destaque vibrante (ex: Azul Elétrico ou Verde Esmeralda) apenas para estados ativos, indicadores de Toggle ou ícones principais, quebrando a monocromia.
- Tipografia: Use a fonte ''Inter'' ou ''Satoshi'' com pesos variados. Títulos devem ter baixo contraste de cor com o fundo para manter a estética minimalista, mas com font-bold para legibilidade.
- Interatividade & Micro-animações: Use GSAP para animar a transição entre estados. Quando um botão for clicado, ele deve trocar as sombras externas por sombras internas (inset), simulando o movimento físico de ser pressionado para dentro do material.
- Estrutura: Layout de ''Smart Home Controller'' ou ''Music Player'', com botões circulares, sliders personalizados e ícones Lucide que parecem gravados na superfície.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Maximalismo Tipográfico + Dark Mode', 
    'Impacto visual extremo através de fontes gigantes, alto contraste e composições dinâmicas.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Maximalista: O texto deve ser o elemento estrutural. Utilize fontes ''Display'' de impacto (Google Fonts ''Syne'' ou ''Bricolage Grotesque''). Títulos principais devem ser gigantes (text-7xl ou text-8xl), com letter-spacing extremamente reduzido (tracking-tighter) e pesos variando entre font-black e font-thin.
- Dark Mode de Alto Contraste: Fundo preto absoluto (bg-[#000000]) com texto em branco puro (text-white). Intercale frases com o efeito text-transparent e -webkit-text-stroke: 1px white para criar camadas de profundidade visual apenas com glifos.
- Composição Dinâmica: Quebre o alinhamento padrão. Use textos rotacionados (-rotate-90), textos que se repetem em faixas horizontais (estilo marquee) e sobreposições ousadas onde o texto passa por trás ou pela frente de ícones e botões.
- Animações de Scroll & Reveal: Use GSAP e ScrollTrigger (via CDN) para criar animações de texto que deslizam de direções opostas conforme o usuário rola a página. Adicione um efeito de ''Staggered Letter Reveal'' no carregamento inicial.
- Interatividade: Implemente um ''Magnetic Button'' para o CTA principal: o botão deve ser atraído sutilmente pelo cursor do mouse usando JS suave.
- Estrutura: Layout de ''Digital Agency Portfolio'' ou ''Event Editorial'', focado em impacto visual imediato com ícones Lucide agindo apenas como acentos minimalistas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Grainy Textures + Mono-Chrome', 
    'Visual analógico, editorial e cinematográfico com texturas de ruído e tipografia clássica.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Grainy (Ruído): Aplique um overlay de textura de ruído analógico em toda a página. Use um filtro de ruído SVG feTurbulence dentro de um rect absoluto com opacidade baixa (opacity-20) e pointer-events-none. O visual deve remeter a papel impresso ou fotografia de grão fino.
- Paleta Monocromática Sofisticada: Use uma escala rigorosa de cinzas e pretos, fugindo do branco puro. Fundo em cinza médio-quente (bg-[#1a1a1a]) e elementos em tons contrastantes. Utilize mix-blend-mode (como difference ou overlay) para criar interações visuais ricas entre o texto e o fundo.
- Minimalismo Editorial: Use tipografia serifada de alta classe (Google Fonts ''Cormorant Garamond'' ou ''Fraunces'') para corpo de texto e uma sans-serif geométrica (''Inter'') para metadados. Mantenha grandes margens e muito respiro (whitespace).
- Profundidade Cinematográfica: Utilize imagens ou placeholders com filtros grayscale(100%) e contrast(120%). As transições entre seções devem ser suaves, simulando um ''fade out'' de cinema.
- Interatividade & Animações: Use GSAP para criar um efeito de ''Lens Blur'' ou ''Focus In'' (o conteúdo começa desfocado e ganha nitidez ao entrar no viewport). O cursor deve ser um círculo simples que inverte as cores do que está por baixo.
- Estrutura: Layout estilo ''Luxury Lookbook'' ou ''Architecture Portfolio'', com grid ortogonal e ícones Lucide com stroke-width: 0.75px para máxima elegância.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Bauhaus Modernizado', 
    'Geometria pura, funcionalismo histórico e paleta primária sobre fundo papel.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Bauhaus Contemporânea: Baseie o design em formas geométricas puras (círculos, quadrados e triângulos perfeitos). Utilize um grid ortogonal rigoroso com divisórias sólidas de 1px (border-slate-900/10).
- Paleta Primária Sofisticada: Use a tríade clássica (Amarelo #F4D03F, Vermelho #E74C3C, Azul #2E86C1), mas aplicadas sobre um fundo ''Papel'' (bg-[#FDFCF5]) para evitar um visual infantil. Use o preto (#1A1A1A) apenas para tipografia e formas estruturais.
- Assimetria Equilibrada: Posicione elementos de forma assimétrica, mas mantendo o equilíbrio de pesos visuais. Use flex e grid do Tailwind para criar composições onde o texto e as formas se interceptam.
- Tipografia Funcional: Use exclusivamente fontes sem serifa geométricas (Google Fonts ''Archivio'' ou ''Montserrat''). Títulos devem ser em caixa alta (uppercase) com font-bold e alinhamentos variados (esquerda e direita alternados).
- Animações Construtivistas: Use GSAP para animar a montagem da página: formas geométricas devem deslizar de fora da tela e se encaixar em suas posições como um quebra-cabeça técnico. Adicione rotações de 90° ou 180° em ícones Lucide no hover.
- Estrutura: Layout de ''Design Studio Concept'' ou ''Portfolio de Engenharia'', com seções numeradas (01, 02, 03) em fontes grandes e ícones Lucide simplificados.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Holographic / Iridescent Design', 
    'Visual Web3 futurista com refração de luz, gradientes complexos e efeitos 3D de inclinação.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Holográfica: Crie superfícies que simulem a refração de luz metálica. Utilize gradientes lineares e radiais complexos com múltiplos stops de cor (azul ciano, rosa choque, lavanda e verde limão). Aplique um efeito de ''shimmer'' (brilho móvel) usando background-size: 200% e uma animação infinita de deslocamento de background.
- Refração e Brilho: Use containers com bg-white/10 e um backdrop-blur-2xl. Adicione uma borda iridescente fina usando border-image-source com um gradiente colorido. Aplique um drop-shadow colorido que mude de matiz (hue-rotate) continuamente.
- Profundidade Espacial: O fundo deve ser um ''Dark Space'' profundo (bg-[#030308]) para que as superfícies holográficas saltem aos olhos. Use pequenas partículas ou pontos de luz sutis flutuando no fundo.
- Tipografia Futurista: Use a fonte ''Outfit'' ou ''Space Grotesk'' via Google Fonts. Títulos devem ter um leve efeito de brilho externo (text-shadow) e cores de gradiente que acompanham a paleta holográfica.
- Interatividade & Animações: Use GSAP para criar um efeito de ''Tilt 3D'' baseado no movimento do mouse: os cards devem rotacionar levemente e o gradiente interno deve se deslocar conforme o cursor se move, simulando a mudança de reflexo da luz.
- Estrutura: Layout de ''Web3 Dashboard'' ou ''NFT Marketplace Concept'', com botões de ação que possuem um brilho intenso no hover e ícones Lucide com acabamento metálico.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Swiss Design + Grid Brutalism', 
    'Precisão suíça com estrutura industrial aparente, tipografia radical e grid modular visível.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Swiss Design (Estilo Internacional): Foque em clareza absoluta e funcionalidade. Utilize um grid modular matemático e rigoroso, visível através de linhas de divisão finas (border-slate-200). O fundo deve ser um ''Paper White'' limpo (bg-[#f8f8f8]).
- Grids Brutalistas: Use um layout de colunas fixas que não se escondem. Exiba o esqueleto do site com bordas sólidas. Crie seções com tamanhos variados que se encaixam como um sistema de prateleiras.
- Tipografia Suíça Clássica: Use exclusivamente a fonte ''Inter'' ou ''Plus Jakarta Sans'' (como alternativa moderna à Helvetica). Aplique uma hierarquia tipográfica drástica: use text-xs uppercase tracking-[0.2em] para labels e text-6xl font-black para títulos principais, sempre com alinhamento à esquerda.
- Uso Estratégico do Vermelho Suíço: Mantenha a interface quase inteiramente em preto, branco e cinza, utilizando o vermelho vibrante (bg-[#ff0000]) apenas para elementos de ação (CTAs) ou pontos de foco extremamente específicos.
- Interatividade & Animações: Use GSAP para criar transições de ''Grid Reveal'' (as linhas do grid se desenham primeiro e o conteúdo preenche depois). As animações devem ser secas e rápidas (sem elasticidade), enfatizando a precisão técnica.
- Estrutura: Layout de ''Index'' ou ''Product Catalog'', com numeração técnica para cada seção e ícones Lucide pequenos e precisos (stroke-width: 1.5px), sempre alinhados ao topo dos seus respectivos grids.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Minimalismo Japonês (Zen Design)', 
    'Foco no vazio (Ma), tipografia sutil, cores naturais e assimetria equilibrada.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Zen: Muito espaço em branco (whitespace), respiro entre os elementos. Fundo em tons de papel de arroz (bg-[#F9F6F0]).
- Cores Naturais: Acentos em tons de bambu, chá verde, ou tinta nanquim (preto suave).
- Tipografia: Fontes sans-serif muito limpas e finas (ex: ''Inter'' com font-light). Títulos com espaçamento generoso.
- Estrutura: Layouts assimétricos, mas perfeitamente balanceados. Linhas divisórias extremamente finas e discretas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Dark Academia', 
    'Atmosfera acadêmica vintage, tons terrosos escuros, tipografia serifada clássica.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Dark Academia: Fundos em tons de marrom escuro, verde musgo profundo ou bordô (bg-[#2C241B]).
- Tipografia Clássica: Uso predominante de fontes serifadas elegantes (ex: ''Playfair Display'' ou ''Merriweather'') para evocar livros antigos.
- Detalhes: Bordas duplas, ornamentos sutis (usando CSS borders), paleta de cores que remete a bibliotecas antigas e luz de velas (textos em creme ou dourado envelhecido).
- Estrutura: Layouts que lembram páginas de enciclopédias ou jornais antigos, com colunas de texto bem definidas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Y2K Cyber Web', 
    'Nostalgia dos anos 2000, cores metálicas, rosa choque, gradientes iridescentes e estética tech-pop.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Y2K: Cores vibrantes como rosa chiclete, azul ciano e prata metálico. Fundos com gradientes radiais intensos.
- Elementos Visuais: Caixas com bordas arredondadas grossas, sombras duras coloridas, e efeitos que lembram plástico translúcido ou metal brilhante.
- Tipografia: Fontes que remetem à tecnologia do início do milênio (ex: ''Space Grotesk'' ou fontes pixeladas/arredondadas).
- Animações: Efeitos de marquee (texto rolando), piscar rápido, e cursores personalizados (via CSS).

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Eco-Brutalismo', 
    'Mistura do brutalismo de concreto com elementos orgânicos e verdes vibrantes.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Eco-Brutalista: Fundo cinza concreto (bg-[#D1D5DB] ou texturas de ruído) contrastando fortemente com tons de verde neon ou verde folha vibrante.
- Estrutura: Grids expostos, linhas pretas grossas dividindo seções, ausência de sombras suaves (uso de sombras duras ou nenhuma).
- Tipografia: Fontes grotescas pesadas e grandes, muitas vezes em caixa alta, misturadas com ícones de natureza (folhas, sol) em estilo flat.
- Contraste: O contraste entre o "frio" do cinza/preto e o "vivo" do verde é o ponto central do design.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Cyber-Glass (Neon + Glassmorphism)', 
    'Painéis de vidro translúcido flutuando sobre luzes neon intensas e fundos escuros.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Cyber-Glass: Fundo quase preto (bg-[#09090b]). Elementos contidos em painéis com backdrop-blur-2xl e bg-white/5.
- Iluminação Neon: Sombras externas coloridas (box-shadow com cores neon como ciano, magenta, lima) simulando LEDs por trás dos painéis de vidro.
- Tipografia: Fontes modernas e limpas, com títulos brilhantes (text-shadow neon).
- Animações: Pulsação suave das luzes neon de fundo, dando vida ao ambiente escuro.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Retro 70s Groovy', 
    'Cores quentes (laranja, mostarda, marrom), formas fluidas e tipografia arredondada e espessa.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética 70s: Paleta de cores terrosas e quentes (Laranja queimado, Amarelo mostarda, Marrom, Verde abacate).
- Formas: Uso intenso de bordas arredondadas (pill-shapes), ondas SVG dividindo seções, e formas orgânicas.
- Tipografia: Fontes grossas, arredondadas e com personalidade (ex: ''Cooper Black'' ou equivalentes do Google Fonts como ''Fraunces'' em peso black).
- Vibração: Um design alegre, nostálgico e acolhedor, sem linhas retas duras.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Geometria Lúdica (Modern Memphis)', 
    'Padrões geométricos, cores primárias brilhantes, confetes visuais e design divertido.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Memphis: Fundo claro com padrões de bolinhas, zigue-zagues ou rabiscos sutis.
- Cores e Formas: Blocos de cores sólidas e vibrantes (Ciano, Amarelo, Rosa, Roxo). Elementos flutuantes como círculos, triângulos e squiggles.
- Tipografia: Fontes sans-serif amigáveis e geométricas (''Poppins'' ou ''Quicksand'').
- Estrutura: Layouts não convencionais, onde os elementos parecem ter sido "espalhados" de forma divertida, mas legível.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Digital Scrapbook', 
    'Visual de colagem, texturas de papel rasgado, fitas adesivas e sobreposições caóticas controladas.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Scrapbook: Elementos devem parecer colados na tela. Use rotações leves (rotate-2, -rotate-3) nos containers.
- Texturas: Fundos que simulam papel pardo ou quadriculado. Efeitos de sombra dura para simular recortes de papel.
- Detalhes: Adicione elementos visuais que lembram fita adesiva (washi tape) usando divs semi-transparentes sobrepondo as bordas dos cards.
- Tipografia: Mistura de fontes que parecem máquina de escrever (''Courier Prime'') com fontes manuscritas (''Caveat'' ou ''Permanent Marker'').

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'High-Fashion Editorial', 
    'Elegância extrema, margens imensas, tipografia fina e contraste dramático.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Editorial: Inspirado em revistas de alta costura (Vogue, Harper''s Bazaar). Fundo branco puro ou off-white muito sofisticado.
- Tipografia: Títulos gigantescos em fontes serifadas ultra-finas ou itálicas elegantes. Textos de corpo muito pequenos e espaçados.
- Layout: Uso dramático do espaço em branco. Linhas divisórias finíssimas (1px, cinza muito claro).
- Alinhamento: Mistura de alinhamentos justificados para blocos de texto e centralizados para grandes citações.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Vaporwave Aesthetic', 
    'Nostalgia dos anos 80/90, gradientes rosa e ciano, estátuas clássicas (implícitas) e grids de perspectiva.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Vaporwave: Paleta de cores focada em magenta, ciano, lavanda e pêssego. Gradientes lineares do pôr do sol.
- Elementos Visuais: Janelas estilo Windows 95 (bordas cinzas com relevo), grids de perspectiva no fundo.
- Tipografia: Fontes serifadas espaçadas (V A P O R W A V E style) misturadas com fontes pixeladas de sistema antigo.
- Atmosfera: Um visual surreal, nostálgico e levemente "glitchy".

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Monocromático Vibrante', 
    'Uso de uma única cor forte em várias tonalidades para criar uma experiência visual imersiva.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Monocromática: Escolha uma cor base vibrante (ex: Azul Klein, Laranja Neon, ou Roxo Profundo) e use apenas variações de luminosidade e saturação dessa cor.
- Contraste: O texto deve ser da mesma cor, mas em tons extremamente escuros ou extremamente claros para garantir a leitura.
- Profundidade: Use opacidades (bg-blue-500/20) e sombras tonais (shadow-blue-900) em vez de sombras pretas ou cinzas.
- Impacto: Um design ousado que banha o usuário em uma única atmosfera de cor.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Soft UI Clássico (Neumorphism 1.0)', 
    'Elementos que parecem extrudados do próprio fundo, com sombras suaves e baixo contraste.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Neumórfica: Fundo e elementos na exata mesma cor (geralmente um cinza muito claro ou azul pálido, ex: #e0e5ec).
- Sombras: O efeito é criado inteiramente por duas sombras em cada elemento: uma clara no canto superior esquerdo e uma escura no canto inferior direito.
- Suavidade: Bordas arredondadas, ausência de linhas duras ou bordas coloridas. Tudo parece macio e tátil.
- Tipografia: Fontes limpas, com cores de texto em tons de cinza médio para manter o baixo contraste elegante.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Industrial Tech Wear', 
    'Design utilitário, preto fosco, acentos em laranja segurança, tipografia técnica e códigos de barras.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Industrial: Fundo preto fosco ou cinza asfalto (bg-[#111111]). Acentos em cores de alerta (Laranja Segurança #FF6600 ou Amarelo Cuidado).
- Elementos Técnicos: Uso de linhas diagonais, padrões de hachura (stripes), e cantos chanfrados (usando clip-path).
- Tipografia: Fontes monospace ou grotescas muito rígidas. Inclusão de pequenos textos técnicos, números de série falsos ou coordenadas para compor o visual.
- Estrutura: Layout que lembra a interface de um equipamento militar ou maquinário pesado.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Gothic / Dark Fantasy', 
    'Atmosfera sombria, elegante e misteriosa, com vermelhos profundos, dourados envelhecidos e preto.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Gótica: Fundo preto absoluto ou texturas de veludo escuro. Cores de destaque em vermelho sangue, roxo profundo ou ouro envelhecido.
- Tipografia: Fontes serifadas dramáticas, com alto contraste entre traços finos e grossos (ex: ''Cinzel'' ou ''Cormorant'').
- Ornamentos: Linhas divisórias elegantes, bordas finas douradas, e um layout que evoca a diagramação de um grimório ou convite de luxo obscuro.
- Iluminação: Efeitos de gradiente radial sutis que parecem luz de velas iluminando o centro da tela.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Pop Art / Comic Book', 
    'Estilo história em quadrinhos, padrões de retícula (halftone), cores primárias estouradas e bordas grossas.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Comic Book: Bordas pretas muito grossas e irregulares. Uso de padrões de pontos (halftone) no fundo ou em sombras.
- Cores: Paleta CMYK pura (Ciano, Magenta, Amarelo, Preto). Cores sólidas sem gradientes suaves.
- Tipografia: Fontes em itálico pesado, caixa alta, que lembram letreiros de quadrinhos (ex: ''Bangers'' ou ''Komika'').
- Elementos Visuais: Caixas de texto que lembram balões de fala ou quadros de HQ, com sombras pretas sólidas e deslocadas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Abstract Fluid Gradients', 
    'Formas orgânicas derretidas, gradientes complexos em movimento e visual onírico.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Fluida: O design é dominado por gradientes de malha (mesh gradients) com cores suaves e misturadas (ex: pêssego, lavanda, azul claro).
- Formas: Ausência total de cantos retos. Tudo usa border-radius extremos ou clip-paths orgânicos (blobs).
- Tipografia: Fontes sans-serif muito limpas e arredondadas, em branco ou preto translúcido para não brigar com o fundo colorido.
- Atmosfera: Um visual calmante, moderno e altamente estético, focado na transição suave de cores.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Terminal / Hacker UI', 
    'Visual de linha de comando, texto verde brilhante sobre fundo preto, estética de código puro.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Terminal: Fundo preto absoluto (bg-black). Todo o texto e bordas em verde neon (text-[#00FF00]) ou âmbar.
- Tipografia: Exclusivamente fontes Monospace (''Courier New'', ''Fira Code'').
- Estrutura: Layout em blocos de texto alinhados à esquerda, simulando o output de um console. Uso de caracteres ASCII para criar divisórias (ex: ===, ---, ou +--+).
- Animações: Efeito de digitação (typewriter) no carregamento e cursores retangulares piscantes.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Surrealist Web', 
    'Layouts oníricos, proporções distorcidas, elementos flutuantes e quebra de expectativas.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Surreal: Paletas de cores inusitadas (ex: céu laranja, chão roxo). Elementos que parecem desafiar a gravidade.
- Tipografia: Mistura caótica mas esteticamente agradável de fontes gigantes e minúsculas, serifadas e sem serifa.
- Estrutura: Quebra total do grid tradicional. Textos sobrepostos a formas, elementos parcialmente cortados fora da tela.
- Atmosfera: Um design que parece um sonho ou uma obra de arte moderna, priorizando a expressão visual sobre a estrutura rígida.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Art Deco Luxuoso', 
    'Glamour dos anos 1920, simetria geométrica, preto profundo e detalhes em dourado metálico.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Art Deco: Fundo preto rico ou azul marinho muito escuro. Todos os acentos, bordas e ícones em tom de ouro metálico (ex: #D4AF37).
- Formas: Padrões geométricos repetitivos, linhas retas combinadas com arcos perfeitos, simetria central estrita.
- Tipografia: Fontes altas, finas e elegantes, em caixa alta (ex: ''Oswald'' ou fontes estilo Gatsby).
- Estrutura: Layouts emoldurados com bordas duplas ou triplas, criando uma sensação de convite VIP ou arquitetura de luxo.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
),
(
    'SEU_USER_ID_AQUI', 
    'Space Age / Atomic 60s', 
    'Retro-futurismo dos anos 60, formas de estrelas, órbitas, cores pastéis espaciais e design otimista.',
    'Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Space Age: Inspirado em Os Jetsons e na corrida espacial. Cores como azul celeste, coral, menta e branco estelar.
- Formas: Uso de formas de bumerangue, estrelas de quatro pontas (sparkles), ovais inclinados simulando órbitas planetárias.
- Tipografia: Fontes geométricas com um toque retrô (ex: ''Jost'' ou ''Futura'').
- Atmosfera: Um design limpo, otimista, com muito espaço em branco e elementos que parecem flutuar em gravidade zero.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (```html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.'
);
