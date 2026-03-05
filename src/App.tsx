/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Key,
  FileText,
  Code,
  Eye,
  Sparkles,
  Download,
  FileUp,
  X,
  Zap,
  ShieldCheck,
  Activity,
  Layers,
  Info,
  CheckCircle2,
  ArrowRightLeft,
  Loader2,
  Copy,
  Check,
  ChevronRight,
  Settings,
  Wand2,
  Save,
  Trash2,
  ExternalLink,
  History,
  LogIn,
  LogOut,
  User,
  Pencil,
  AlertTriangle,
  Plus,
  LayoutTemplate,
  FolderOpen,
  FileCode,
  Lock
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import OnboardingWizard from './components/OnboardingWizard';
import StylePreview from './components/StylePreview';
import MaterialPreviewModal from './components/MaterialPreviewModal';
import { SEED_PROMPTS_SQL } from './constants/seedSql';
import { SUPABASE_TABLES_SQL } from './constants/supabaseSql';

// --- Types & Constants ---

type ViewType = 'keys' | 'supabase' | 'branding' | 'converter' | 'editor' | 'preview' | 'materials';
type ComponentType = 'hero' | 'grid' | 'comparison' | 'callout' | 'list';

interface MetadataItem {
  title: string;
  filename: string;
  description: string;
  tags: string[];
}

interface SuggestedMetadata {
  pt: MetadataItem;
  en: MetadataItem;
  es: MetadataItem;
}

interface GeneratedMaterial {
  id: string;
  name: string;
  html: string;
  timestamp: number;
  metadata?: MetadataItem;
}

interface PageSection {
  id: string;
  type: ComponentType;
  title?: string;
  subtitle?: string;
  content?: any;
}

interface PageData {
  title: string;
  subtitle: string;
  sections: PageSection[];
}

interface BrandConfig {
  primaryBlue: string;
  primaryGold: string;
  description: string;
  pdfBase64?: string;
  pdfName?: string;
  systemPrompt?: string;
}

interface ApiKeys {
  gemini: string;
  openai: string;
  claude: string;
  groq: string;
}

interface PromptLibraryEntry {
  id: string;
  title: string;
  content: string;
  description?: string;
}

const DEFAULT_PROMPTS = [
  {
    title: "Padrão",
    description: "Estilo que utiliza as cores do branding",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design:
Gere um ÚNICO arquivo HTML autônomo contendo HTML, CSS (use Tailwind via CDN: https://cdn.tailwindcss.com) e JS (use Lucide Icons via CDN: https://unpkg.com/lucide@latest).

NÃO inclua cabeçalhos ou rodapés externos do construtor.
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.

Aplique o branding fornecido de forma elegante e profissional.

Use animações suaves (pode usar CSS puro ou bibliotecas via CDN se necessário).

O arquivo deve ser auto-contido e pronto para ser aberto em qualquer navegador.

Retorne APENAS o código HTML completo, sem blocos de código markdown (html)`
  },
  {
    title: "Neobrutalismo + Pastel Pop",
    description: "Estilo de alto contraste com bordas pretas espessas, sombras sólidas (Shadow-Pop) e paleta pastel vibrante. Ideal para fintechs e ferramentas modernas.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Neobrutalista: Utilize bordas pretas sólidas e espessas (border-2 ou border-4 border-black). Remova arredondamentos excessivos em favor de cantos vivos ou levemente arredondados (rounded-none ou rounded-lg).
- Sombras Hard-Edge: Implemente o efeito 'Shadow-Pop'. Em vez de sombras suaves e esfumaçadas, use sombras sólidas e deslocadas (box-shadow: 8px 8px 0px 0px #000;) que não possuem desfoque.
- Paleta Pastel Pop: Combine um fundo off-white (bg-[#f4f4f0]) com elementos em cores pastéis vibrantes e saturadas (Amarelo #FFD100, Rosa #FF90E8, Verde Menta #B1F1CB).
- Tipografia e Peso: Use a fonte 'Inter' ou 'Lexend' via Google Fonts. Títulos devem ter peso font-black (900) e letras levemente comprimidas (tracking-tighter).
- Interatividade: Use GSAP para criar animações de 'mola' (spring). Ao passar o mouse (hover), os elementos devem se deslocar na direção oposta da sombra, simulando um clique físico real.
- Estrutura: Layout estilo 'Service Grid' ou 'Feature List', com ícones Lucide grandes, sempre dentro de containers com bordas pretas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Bento Grid + Glassmorphism",
    description: "Organização modular inspirada na Apple com efeitos de vidro, desfoque e profundidade. Layout assimétrico e moderno.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estrutura Bento Grid: Utilize um layout grid de 4 ou 6 colunas com auto-rows. Os cards devem ter tamanhos variados (col-span-1, col-span-2, row-span-2) para criar um ritmo visual assimétrico e moderno.
- Estética Glassmorphism: Aplique backdrop-blur-xl e fundos semi-transparentes (bg-white/5 ou bg-white/10). O segredo está na borda: use uma borda fina de 1px com transparência (border-white/20) para simular a quina de um vidro lapidado.
- Profundidade Visual: Use camadas de sombras muito suaves e amplas (shadow-[0_20px_50px_rgba(0,0,0,0.3)]). Os cards devem parecer flutuar sobre o fundo.
- Liquid Background Animado: Crie um fundo escuro profundo (bg-[#0a0a0c]) com pelo menos dois 'blobs' de gradiente orgânico (um ciano e um violeta) que se movam lentamente usando animate-pulse ou Keyframes CSS personalizados com blur(100px).
- Tipografia e Ícones: Use a fonte 'Plus Jakarta Sans' via Google Fonts. Os títulos devem ser font-bold e os ícones Lucide devem estar dentro de círculos ou quadrados de vidro com opacidade reduzida.
- Interatividade: Use GSAP para uma animação de 'Stagger' (entrada em cascata) onde os cards aparecem um após o outro com um leve movimento de baixo para cima e escala.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Aurora UI + Minimalismo Orgânico",
    description: "Elegância etérea com fundos dinâmicos de gradiente suave e tipografia serifada premium.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Aurora: Crie um fundo dinâmico usando 3 ou 4 esferas de gradiente (blur-[120px]) com cores análogas (ex: Índigo, Violeta e fúcsia) que se movem lentamente em órbitas irregulares via CSS Keyframes. O fundo base deve ser um cinza quase preto (bg-[#050505]).
- Minimalismo Orgânico: Use tipografia serifada premium para títulos (Google Fonts 'Playfair Display' ou 'Instrument Serif') e sans-serif para corpo ('Inter'). Garanta um letter-spacing negativo nos títulos (tracking-tighter).
- Contraste de Superfície: O conteúdo principal deve flutuar em um container central com bg-white/[0.02] e backdrop-blur-3xl. As bordas devem ser quase invisíveis (border-white/5).
- Interatividade & Animações: Use GSAP para um efeito de 'Reveal' suave no carregamento (opacity 0 para 1 com deslocamento de 20px no eixo Y). Adicione um cursor personalizado que reage ao passar sobre elementos clicáveis (escala e mudança de mix-blend-mode).
- Estrutura: Layout de 'Landing Page Hero' ultra-clean, com um CTA central minimalista e ícones Lucide com traço fino (stroke-width: 1px).

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Claymorphism + Soft 3D",
    description: "Interfaces táteis e amigáveis que parecem feitas de argila ou plástico macio, com cores pastéis.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Claymorphism: Os elementos devem parecer feitos de argila ou plástico macio. Utilize border-radius extremo (rounded-[3rem]) e uma combination de box-shadow externa suave com duas sombras internas (inset) — uma clara no topo esquerdo e uma escura no canto inferior direito — para criar volume 3D tátil.
- Paleta de Cores: Use tons pastéis "doces" (ex: Azul bebê #A5D8FF, Rosa chiclete #FFD6E8, Lilás #E5DBFF). O fundo deve ser um gradiente radial muito suave entre duas cores pastéis próximas.
- Profundidade e Camadas: Implemente o efeito de flutuação. Use GSAP para criar uma animação de 'Floating' contínua (bobbing) nos elementos principais, fazendo-os subir e descer levemente em tempos diferentes.
- Tipografia: Use a fonte 'Outfit' ou 'Quicksand' via Google Fonts para manter o aspecto amigável e arredondado. Títulos em font-bold e cores de texto em tons de cinza azulado escuro (text-slate-700).
- Interatividade: Adicione um efeito de 'Squeeze' (compressão) no clique via CSS active:scale-95 e transições de hover:scale-105 extremamente suaves.
- Estrutura: Layout estilo 'Onboarding Cards' ou 'Feature Showcase' com ícones Lucide estilizados com traços grossos e cores vibrantes.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Retro-Futurismo Synthwave + Clean Cyberpunk",
    description: "Nostalgia tecnológica com acabamento premium, luzes neon refinadas e tipografia monospace.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Retro-Futurista Clean: Combine o estilo noir tecnológico com elegância moderna. Utilize um fundo sólido ultra-escuro (bg-[#020205]) com uma grade de perspectiva (CSS grid floor) no rodapé que desaparece no horizonte com mask-image linear-gradient.
- Neon Refinado: Evite o excesso de brilho. Use cores neon (Ciano #00f3ff e Magenta #ff00ff) apenas como luzes de contorno (border com drop-shadow de 5px) e detalhes em pequenos LEDs indicadores.
- Tipografia Monospace & Display: Use a fonte 'Space Mono' para dados e labels, e 'Syncopate' ou 'Orbitron' via Google Fonts para títulos principais. Aplique um efeito sutil de 'flicker' (piscar) via CSS Keyframes em elementos de destaque.
- Interatividade & Efeitos de Vidro Negro: Utilize containers com bg-black/60 e backdrop-blur-lg. Ao passar o mouse, a borda neon do elemento deve aumentar de intensidade e o texto deve ganhar um efeito de 'glitch' controlado e rápido.
- Animações: Use GSAP para criar uma linha de 'scanline' que percorre a tela verticalmente e animações de entrada estilo 'terminal boot' (texto surgindo caractere por caractere).
- Estrutura: Layout de 'Command Center' ou 'Tech Dashboard', com ícones Lucide estilizados em modo duotone usando as cores neon da paleta.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Skeuomorph Moderno (Neuomorphism 2.0)",
    description: "Realismo tátil minimalista com sombras duplas precisas e sofisticação monocromática.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Neuomorphism 2.0: Diferente da primeira versão, esta deve ser refinada. Utilize uma cor de base única para fundo e elementos (ex: Cinza Suave #E0E5EC ou Azul Gelo #E2E8F0). Crie volume usando sombras duplas precisas: uma sombra clara (white) no topo/esquerda e uma sombra escura (rgba(163,177,198,0.6)) na base/direita.
- Textura e Material: Adicione uma leve curvatura côncava ou convexa aos cards usando gradientes lineares quase imperceptíveis que seguem a direção da luz.
- Acentos de Cor: Escolha uma única cor de destaque vibrante (ex: Azul Elétrico ou Verde Esmeralda) apenas para estados ativos, indicadores de Toggle ou ícones principais, quebrando a monocromia.
- Tipografia: Use a fonte 'Inter' ou 'Satoshi' com pesos variados. Títulos devem ter baixo contraste de cor com o fundo para manter a estética minimalista, mas com font-bold para legibilidade.
- Interatividade & Micro-animações: Use GSAP para animar a transição entre estados. Quando um botão for clicado, ele deve trocar as sombras externas por sombras internas (inset), simulando o movimento físico de ser pressionado para dentro do material.
- Estrutura: Layout de 'Smart Home Controller' ou 'Music Player', com botões circulares, sliders personalizados e ícones Lucide que parecem gravados na superfície.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Maximalismo Tipográfico + Dark Mode",
    description: "Impacto visual extremo através de fontes gigantes, alto contraste e composições dinâmicas.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Maximalista: O texto deve ser o elemento estrutural. Utilize fontes 'Display' de impacto (Google Fonts 'Syne' ou 'Bricolage Grotesque'). Títulos principais devem ser gigantes (text-7xl ou text-8xl), com letter-spacing extremamente reduzido (tracking-tighter) e pesos variando entre font-black e font-thin.
- Dark Mode de Alto Contraste: Fundo preto absoluto (bg-[#000000]) com texto em branco puro (text-white). Intercale frases com o efeito text-transparent e -webkit-text-stroke: 1px white para criar camadas de profundidade visual apenas com glifos.
- Composição Dinâmica: Quebre o alinhamento padrão. Use textos rotacionados (-rotate-90), textos que se repetem em faixas horizontais (estilo marquee) e sobreposições ousadas onde o texto passa por trás ou pela frente de ícones e botões.
- Animações de Scroll & Reveal: Use GSAP e ScrollTrigger (via CDN) para criar animações de texto que deslizam de direções opostas conforme o usuário rola a página. Adicione um efeito de 'Staggered Letter Reveal' no carregamento inicial.
- Interatividade: Implemente um 'Magnetic Button' para o CTA principal: o botão deve ser atraído sutilmente pelo cursor do mouse usando JS suave.
- Estrutura: Layout de 'Digital Agency Portfolio' ou 'Event Editorial', focado em impacto visual imediato com ícones Lucide agindo apenas como acentos minimalistas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Grainy Textures + Mono-Chrome",
    description: "Visual analógico, editorial e cinematográfico com texturas de ruído e tipografia clássica.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Grainy (Ruído): Aplique um overlay de textura de ruído analógico em toda a página. Use um filtro de ruído SVG feTurbulence dentro de um rect absoluto com opacidade baixa (opacity-20) e pointer-events-none. O visual deve remeter a papel impresso ou fotografia de grão fino.
- Paleta Monocromática Sofisticada: Use uma escala rigorosa de cinzas e pretos, fugindo do branco puro. Fundo em cinza médio-quente (bg-[#1a1a1a]) e elementos em tons contrastantes. Utilize mix-blend-mode (como difference ou overlay) para criar interações visuais ricas entre o texto e o fundo.
- Minimalismo Editorial: Use tipografia serifada de alta classe (Google Fonts 'Cormorant Garamond' ou 'Fraunces') para corpo de texto e uma sans-serif geométrica ('Inter') para metadados. Mantenha grandes margens e muito respiro (whitespace).
- Profundidade Cinematográfica: Utilize imagens ou placeholders com filtros grayscale(100%) e contrast(120%). As transições entre seções devem ser suaves, simulando um 'fade out' de cinema.
- Interatividade & Animações: Use GSAP para criar um efeito de 'Lens Blur' ou 'Focus In' (o conteúdo começa desfocado e ganha nitidez ao entrar no viewport). O cursor deve ser um círculo simples que inverte as cores do que está por baixo.
- Estrutura: Layout estilo 'Luxury Lookbook' ou 'Architecture Portfolio', com grid ortogonal e ícones Lucide com stroke-width: 0.75px para máxima elegância.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Bauhaus Modernizado",
    description: "Geometria pura, funcionalismo histórico e paleta primária sobre fundo papel.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Bauhaus Contemporânea: Baseie o design em formas geométricas puras (círculos, quadrados e triângulos perfeitos). Utilize um grid ortogonal rigoroso com divisórias sólidas de 1px (border-slate-900/10).
- Paleta Primária Sofisticada: Use a tríade clássica (Amarelo #F4D03F, Vermelho #E74C3C, Azul #2E86C1), mas aplicadas sobre um fundo 'Papel' (bg-[#FDFCF5]) para evitar um visual infantil. Use o preto (#1A1A1A) apenas para tipografia e formas estruturais.
- Assimetria Equilibrada: Posicione elementos de forma assimétrica, mas mantendo o equilíbrio de pesos visuais. Use flex e grid do Tailwind para criar composições onde o texto e as formas se interceptam.
- Tipografia Funcional: Use exclusivamente fontes sem serifa geométricas (Google Fonts 'Archivio' ou 'Montserrat'). Títulos devem ser em caixa alta (uppercase) com font-bold e alinhamentos variados (esquerda e direita alternados).
- Animações Construtivistas: Use GSAP para animar a montagem da página: formas geométricas devem deslizar de fora da tela e se encaixar em suas posições como um quebra-cabeça técnico. Adicione rotações de 90° ou 180° em ícones Lucide no hover.
- Estrutura: Layout de 'Design Studio Concept' ou 'Portfolio de Engenharia', com seções numeradas (01, 02, 03) em fontes grandes e ícones Lucide simplificados.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Holographic / Iridescent Design",
    description: "Visual Web3 futurista com refração de luz, gradientes complexos e efeitos 3D de inclinação.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Holográfica: Crie superfícies que simulem a refração de luz metálica. Utilize gradientes lineares e radiais complexos com múltiplos stops de cor (azul ciano, rosa choque, lavanda e verde limão). Aplique um efeito de 'shimmer' (brilho móvel) usando background-size: 200% e uma animação infinita de deslocamento de background.
- Refração e Brilho: Use containers com bg-white/10 e um backdrop-blur-2xl. Adicione uma borda iridescente fina usando border-image-source com um gradiente colorido. Aplique um drop-shadow colorido que mude de matiz (hue-rotate) continuamente.
- Profundidade Espacial: O fundo deve ser um 'Dark Space' profundo (bg-[#030308]) para que as superfícies holográficas saltem aos olhos. Use pequenas partículas ou pontos de luz sutis flutuando no fundo.
- Tipografia Futurista: Use a fonte 'Outfit' ou 'Space Grotesk' via Google Fonts. Títulos devem ter um leve efeito de brilho externo (text-shadow) e cores de gradiente que acompanham a paleta holográfica.
- Interatividade & Animações: Use GSAP para criar um efeito de 'Tilt 3D' baseado no movimento do mouse: os cards devem rotacionar levemente e o gradiente interno deve se deslocar conforme o cursor se move, simulando a mudança de reflexo da luz.
- Estrutura: Layout de 'Web3 Dashboard' ou 'NFT Marketplace Concept', com botões de ação que possuem um brilho intenso no hover e ícones Lucide com acabamento metálico.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Swiss Design + Grid Brutalism",
    description: "Precisão suíça com estrutura industrial aparente, tipografia radical e grid modular visível.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Swiss Design (Estilo Internacional): Foque em clareza absoluta e funcionalidade. Utilize um grid modular matemático e rigoroso, visível através de linhas de divisão finas (border-slate-200). O fundo deve ser um 'Paper White' limpo (bg-[#f8f8f8]).
- Grids Brutalistas: Use um layout de colunas fixas que não se escondem. Exiba o esqueleto do site com bordas sólidas. Crie seções com tamanhos variados que se encaixam como um sistema de prateleiras.
- Tipografia Suíça Clássica: Use exclusivamente a fonte 'Inter' ou 'Plus Jakarta Sans' (como alternativa moderna à Helvetica). Aplique uma hierarquia tipográfica drástica: use text-xs uppercase tracking-[0.2em] para labels e text-6xl font-black para títulos principais, sempre com alinhamento à esquerda.
- Uso Estratégico do Vermelho Suíço: Mantenha a interface quase inteiramente em preto, branco e cinza, utilizando o vermelho vibrante (bg-[#ff0000]) apenas para elementos de ação (CTAs) ou pontos de foco extremamente específicos.
- Interatividade & Animações: Use GSAP para criar transições de 'Grid Reveal' (as linhas do grid se desenham primeiro e o conteúdo preenche depois). As animações devem ser secas e rápidas (sem elasticidade), enfatizando a precisão técnica.
- Estrutura: Layout de 'Index' ou 'Product Catalog', com numeração técnica para cada seção e ícones Lucide pequenos e precisos (stroke-width: 1.5px), sempre alinhados ao topo dos seus respectivos grids.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Minimalismo Japonês (Zen Design)",
    description: "Foco no vazio (Ma), tipografia sutil, cores naturais e assimetria equilibrada.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Zen: Muito espaço em branco (whitespace), respiro entre os elementos. Fundo em tons de papel de arroz (bg-[#F9F6F0]).
- Cores Naturais: Acentos em tons de bambu, chá verde, ou tinta nanquim (preto suave).
- Tipografia: Fontes sans-serif muito limpas e finas (ex: 'Inter' com font-light). Títulos com espaçamento generoso.
- Estrutura: Layouts assimétricos, mas perfeitamente balanceados. Linhas divisórias extremamente finas e discretas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Dark Academia",
    description: "Atmosfera acadêmica vintage, tons terrosos escuros, tipografia serifada clássica.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Dark Academia: Fundos em tons de marrom escuro, verde musgo profundo ou bordô (bg-[#2C241B]).
- Tipografia Clássica: Uso predominante de fontes serifadas elegantes (ex: 'Playfair Display' ou 'Merriweather') para evocar livros antigos.
- Detalhes: Bordas duplas, ornamentos sutis (usando CSS borders), paleta de cores que remete a bibliotecas antigas e luz de velas (textos em creme ou dourado envelhecido).
- Estrutura: Layouts que lembram páginas de enciclopédias ou jornais antigos, com colunas de texto bem definidas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Y2K Cyber Web",
    description: "Nostalgia dos anos 2000, cores metálicas, rosa choque, gradientes iridescentes e estética tech-pop.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Y2K: Cores vibrantes como rosa chiclete, azul ciano e prata metálico. Fundos com gradientes radiais intensos.
- Elementos Visuais: Caixas com bordas arredondadas grossas, sombras duras coloridas, e efeitos que lembram plástico translúcido ou metal brilhante.
- Tipografia: Fontes que remetem à tecnologia do início do milênio (ex: 'Space Grotesk' ou fontes pixeladas/arredondadas).
- Animações: Efeitos de marquee (texto rolando), piscar rápido, e cursores personalizados (via CSS).

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Eco-Brutalismo",
    description: "Mistura do brutalismo de concreto com elementos orgânicos e verdes vibrantes.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Eco-Brutalista: Fundo cinza concreto (bg-[#D1D5DB] ou texturas de ruído) contrastando fortemente com tons de verde neon ou verde folha vibrante.
- Estrutura: Grids expostos, linhas pretas grossas dividindo seções, ausência de sombras suaves (uso de sombras duras ou nenhuma).
- Tipografia: Fontes grotescas pesadas e grandes, muitas vezes em caixa alta, misturadas com ícones de natureza (folhas, sol) em estilo flat.
- Contraste: O contraste entre o "frio" do cinza/preto e o "vivo" do verde é o ponto central do design.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Cyber-Glass (Neon + Glassmorphism)",
    description: "Painéis de vidro translúcido flutuando sobre luzes neon intensas e fundos escuros.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Cyber-Glass: Fundo quase preto (bg-[#09090b]). Elementos contidos em painéis com backdrop-blur-2xl e bg-white/5.
- Iluminação Neon: Sombras externas coloridas (box-shadow com cores neon como ciano, magenta, lima) simulando LEDs por trás dos painéis de vidro.
- Tipografia: Fontes modernas e limpas, com títulos brilhantes (text-shadow neon).
- Animações: Pulsação suave das luzes neon de fundo, dando vida ao ambiente escuro.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Retro 70s Groovy",
    description: "Cores quentes (laranja, mostarda, marrom), formas fluidas e tipografia arredondada e espessa.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética 70s: Paleta de cores terrosas e quentes (Laranja queimado, Amarelo mostarda, Marrom, Verde abacate).
- Formas: Uso intenso de bordas arredondadas (pill-shapes), ondas SVG dividindo seções, e formas orgânicas.
- Tipografia: Fontes grossas, arredondadas e com personalidade (ex: 'Cooper Black' ou equivalentes do Google Fonts como 'Fraunces' em peso black).
- Vibração: Um design alegre, nostálgico e acolhedor, sem linhas retas duras.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Geometria Lúdica (Modern Memphis)",
    description: "Padrões geométricos, cores primárias brilhantes, confetes visuais e design divertido.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Memphis: Fundo claro com padrões de bolinhas, zigue-zagues ou rabiscos sutis.
- Cores e Formas: Blocos de cores sólidas e vibrantes (Ciano, Amarelo, Rosa, Roxo). Elementos flutuantes como círculos, triângulos e squiggles.
- Tipografia: Fontes sans-serif amigáveis e geométricas ('Poppins' ou 'Quicksand').
- Estrutura: Layouts não convencionais, onde os elementos parecem ter sido "espalhados" de forma divertida, mas legível.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Digital Scrapbook",
    description: "Visual de colagem, texturas de papel rasgado, fitas adesivas e sobreposições caóticas controladas.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Scrapbook: Elementos devem parecer colados na tela. Use rotações leves (rotate-2, -rotate-3) nos containers.
- Texturas: Fundos que simulam papel pardo ou quadriculado. Efeitos de sombra dura para simular recortes de papel.
- Detalhes: Adicione elementos visuais que lembram fita adesiva (washi tape) usando divs semi-transparentes sobrepondo as bordas dos cards.
- Tipografia: Mistura de fontes que parecem máquina de escrever ('Courier Prime') com fontes manuscritas ('Caveat' ou 'Permanent Marker').

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "High-Fashion Editorial",
    description: "Elegância extrema, margens imensas, tipografia fina e contraste dramático.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Editorial: Inspirado em revistas de alta costura (Vogue, Harper's Bazaar). Fundo branco puro ou off-white muito sofisticado.
- Tipografia: Títulos gigantescos em fontes serifadas ultra-finas ou itálicas elegantes. Textos de corpo muito pequenos e espaçados.
- Layout: Uso dramático do espaço em branco. Linhas divisórias finíssimas (1px, cinza muito claro).
- Alinhamento: Mistura de alinhamentos justificados para blocos de texto e centralizados para grandes citações.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Vaporwave Aesthetic",
    description: "Nostalgia dos anos 80/90, gradientes rosa e ciano, estátuas clássicas (implícitas) e grids de perspectiva.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Vaporwave: Paleta de cores focada em magenta, ciano, lavanda e pêssego. Gradientes lineares do pôr do sol.
- Elementos Visuais: Janelas estilo Windows 95 (bordas cinzas com relevo), grids de perspectiva no fundo.
- Tipografia: Fontes serifadas espaçadas (V A P O R W A V E style) misturadas com fontes pixeladas de sistema antigo.
- Atmosfera: Um visual surreal, nostálgico e levemente "glitchy".

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Monocromático Vibrante",
    description: "Uso de uma única cor forte em várias tonalidades para criar uma experiência visual imersiva.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Monocromática: Escolha uma cor base vibrante (ex: Azul Klein, Laranja Neon, ou Roxo Profundo) e use apenas variações de luminosidade e saturação dessa cor.
- Contraste: O texto deve ser da mesma cor, mas em tons extremamente escuros ou extremamente claros para garantir a leitura.
- Profundidade: Use opacidades (bg-blue-500/20) e sombras tonais (shadow-blue-900) em vez de sombras pretas ou cinzas.
- Impacto: Um design ousado que banha o usuário em uma única atmosfera de cor.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Soft UI Clássico (Neumorphism 1.0)",
    description: "Elementos que parecem extrudados do próprio fundo, com sombras suaves e baixo contraste.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Neumórfica: Fundo e elementos na exata mesma cor (geralmente um cinza muito claro ou azul pálido, ex: #e0e5ec).
- Sombras: O efeito é criado inteiramente por duas sombras em cada elemento: uma clara no canto superior esquerdo e uma escura no canto inferior direito.
- Suavidade: Bordas arredondadas, ausência de linhas duras ou bordas coloridas. Tudo parece macio e tátil.
- Tipografia: Fontes limpas, com cores de texto em tons de cinza médio para manter o baixo contraste elegante.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Industrial Tech Wear",
    description: "Design utilitário, preto fosco, acentos em laranja segurança, tipografia técnica e códigos de barras.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Industrial: Fundo preto fosco ou cinza asfalto (bg-[#111111]). Acentos em cores de alerta (Laranja Segurança #FF6600 ou Amarelo Cuidado).
- Elementos Técnicos: Uso de linhas diagonais, padrões de hachura (stripes), e cantos chanfrados (usando clip-path).
- Tipografia: Fontes monospace ou grotescas muito rígidas. Inclusão de pequenos textos técnicos, números de série falsos ou coordenadas para compor o visual.
- Estrutura: Layout que lembra a interface de um equipamento militar ou maquinário pesado.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Gothic / Dark Fantasy",
    description: "Atmosfera sombria, elegante e misteriosa, com vermelhos profundos, dourados envelhecidos e preto.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Gótica: Fundo preto absoluto ou texturas de veludo escuro. Cores de destaque em vermelho sangue, roxo profundo ou ouro envelhecido.
- Tipografia: Fontes serifadas dramáticas, com alto contraste entre traços finos e grossos (ex: 'Cinzel' ou 'Cormorant').
- Ornamentos: Linhas divisórias elegantes, bordas finas douradas, e um layout que evoca a diagramação de um grimório ou convite de luxo obscuro.
- Iluminação: Efeitos de gradiente radial sutis que parecem luz de velas iluminando o centro da tela.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Pop Art / Comic Book",
    description: "Estilo história em quadrinhos, padrões de retícula (halftone), cores primárias estouradas e bordas grossas.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Comic Book: Bordas pretas muito grossas e irregulares. Uso de padrões de pontos (halftone) no fundo ou em sombras.
- Cores: Paleta CMYK pura (Ciano, Magenta, Amarelo, Preto). Cores sólidas sem gradientes suaves.
- Tipografia: Fontes em itálico pesado, caixa alta, que lembram letreiros de quadrinhos (ex: 'Bangers' ou 'Komika').
- Elementos Visuais: Caixas de texto que lembram balões de fala ou quadros de HQ, com sombras pretas sólidas e deslocadas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Abstract Fluid Gradients",
    description: "Formas orgânicas derretidas, gradientes complexos em movimento e visual onírico.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Fluida: O design é dominado por gradientes de malha (mesh gradients) com cores suaves e misturadas (ex: pêssego, lavanda, azul claro).
- Formas: Ausência total de cantos retos. Tudo usa border-radius extremos ou clip-paths orgânicos (blobs).
- Tipografia: Fontes sans-serif muito limpas e arredondadas, em branco ou preto translúcido para não brigar com o fundo colorido.
- Atmosfera: Um visual calmante, moderno e altamente estético, focado na transição suave de cores.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Terminal / Hacker UI",
    description: "Visual de linha de comando, texto verde brilhante sobre fundo preto, estética de código puro.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Terminal: Fundo preto absoluto (bg-black). Todo o texto e bordas em verde neon (text-[#00FF00]) ou âmbar.
- Tipografia: Exclusivamente fontes Monospace ('Courier New', 'Fira Code').
- Estrutura: Layout em blocos de texto alinhados à esquerda, simulando o output de um console. Uso de caracteres ASCII para criar divisórias (ex: ===, ---, ou +--+).
- Animações: Efeito de digitação (typewriter) no carregamento e cursores retangulares piscantes.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Surrealist Web",
    description: "Layouts oníricos, proporções distorcidas, elementos flutuantes e quebra de expectativas.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Surreal: Paletas de cores inusitadas (ex: céu laranja, chão roxo). Elementos que parecem desafiar a gravidade.
- Tipografia: Mistura caótica mas esteticamente agradável de fontes gigantes e minúsculas, serifadas e sem serifa.
- Estrutura: Quebra total do grid tradicional. Textos sobrepostos a formas, elementos parcialmente cortados fora da tela.
- Atmosfera: Um design que parece um sonho ou uma obra de arte moderna, priorizando a expressão visual sobre a estrutura rígida.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Art Deco Luxuoso",
    description: "Glamour dos anos 1920, simetria geométrica, preto profundo e detalhes em dourado metálico.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Art Deco: Fundo preto rico ou azul marinho muito escuro. Todos os acentos, bordas e ícones em tom de ouro metálico (ex: #D4AF37).
- Formas: Padrões geométricos repetitivos, linhas retas combinadas com arcos perfeitos, simetria central estrita.
- Tipografia: Fontes altas, finas e elegantes, em caixa alta (ex: 'Oswald' ou fontes estilo Gatsby).
- Estrutura: Layouts emoldurados com bordas duplas ou triplas, criando uma sensação de convite VIP ou arquitetura de luxo.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Space Age / Atomic 60s",
    description: "Retro-futurismo dos anos 60, formas de estrelas, órbitas, cores pastéis espaciais e design otimista.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

Diretrizes de Design & Sofisticação:
- Estética Space Age: Inspirado em Os Jetsons e na corrida espacial. Cores como azul celeste, coral, menta e branco estelar.
- Formas: Uso de formas de bumerangue, estrelas de quatro pontas (sparkles), ovais inclinados simulando órbitas planetárias.
- Tipografia: Fontes geométricas com um toque retrô (ex: 'Jost' ou 'Futura').
- Atmosfera: Um design limpo, otimista, com muito espaço em branco e elementos que parecem flutuar em gravidade zero.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  }
];

const SUPABASE_SQL = SUPABASE_TABLES_SQL;

const LIBRARY_CSS = `/* Estilos Base da Biblioteca Interactive Builder */
:root {
  --primary-blue: #004a8e;
  --primary-gold: #c5a059;
  --bg-dark: #020617;
  --bg-card: #0f172a;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-dark);
  color: #f8fafc;
}

.card {
  background-color: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--primary-blue);
  box-shadow: 0 10px 30px -10px rgba(0, 74, 142, 0.3);
}

.btn-primary {
  background-color: var(--primary-blue);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: #005bb3;
  transform: translateY(-2px);
}

.text-gold {
  color: var(--primary-gold);
}

.gradient-text {
  background: linear-gradient(to right, #fff, var(--primary-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`;

// --- Components ---

const HeroSection = ({ title, subtitle, colors }: { title: string, subtitle: string, colors: BrandConfig }) => (
  <section className="text-center mb-16 animate-fade-in">
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border"
      style={{ backgroundColor: `${colors.primaryBlue}20`, color: colors.primaryBlue, borderColor: `${colors.primaryBlue}40` }}
    >
      <Sparkles size={14} /> Hub Conexão Digital
    </div>
    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
      {title}
    </h1>
    <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
      {subtitle}
    </p>
  </section>
);

const GridSection = ({ title, items, colors }: { title?: string, items: any[], colors: BrandConfig }) => (
  <div className="mb-20">
    {title && <h3 className="text-2xl font-bold mb-8 text-center text-white">{title}</h3>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items?.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/40 transition-all duration-500 group"
          style={{ borderLeft: item.color === 'gold' ? `4px solid ${colors.primaryGold}` : '1px solid #1e293b' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 text-white"
            style={{ backgroundColor: item.color === 'gold' ? colors.primaryGold : item.color === 'blue' ? colors.primaryBlue : '#0f172a' }}
          >
            {item.icon === 'zap' && <Zap />}
            {item.icon === 'shield-check' && <ShieldCheck />}
            {item.icon === 'activity' && <Activity />}
            {item.icon === 'layers' && <Layers />}
            {item.icon === 'info' && <Info />}
            {!item.icon && <ChevronRight />}
          </div>
          <h4 className="text-xl font-bold mb-3 text-white">{item.title}</h4>
          <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const ComparisonSection = ({ title, headers, rows, colors }: { title?: string, headers: string[], rows: string[][], colors: BrandConfig }) => (
  <div className="mb-20">
    {title && <h3 className="text-2xl font-bold mb-8 text-center text-white">{title}</h3>}
    <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-lg shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800 bg-slate-950/50">
              {headers?.map((h, i) => (
                <th key={i} className="px-8 py-6" style={{ color: i > 0 && headers.length > 2 && i === headers.length - 1 ? colors.primaryGold : undefined }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows?.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                {row?.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-8 py-6 text-sm ${j === 0 ? 'font-bold text-slate-200' : 'text-slate-400'}`}
                    style={{
                      color: j > 0 && headers.length > 2 && j === headers.length - 1 ? colors.primaryGold : undefined,
                      backgroundColor: j > 0 && headers.length > 2 && j === headers.length - 1 ? `${colors.primaryGold}10` : undefined,
                      fontWeight: j > 0 && headers.length > 2 && j === headers.length - 1 ? '900' : undefined
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const CalloutSection = ({ title, text, accent, colors }: { title: string, text: string, accent: 'gold' | 'blue', colors: BrandConfig }) => (
  <section
    className="rounded-[3rem] overflow-hidden text-white mb-20 shadow-2xl shadow-black/40"
    style={{ backgroundColor: accent === 'gold' ? '#0f172a' : colors.primaryBlue }}
  >
    <div className="flex flex-col lg:flex-row">
      <div className="p-10 lg:p-16 lg:w-3/5">
        <span
          className="font-bold text-[11px] uppercase tracking-[0.4em] mb-6 block"
          style={{ color: accent === 'gold' ? colors.primaryGold : '#bfdbfe' }}
        >
          Destaque Técnico
        </span>
        <h3 className="text-3xl md:text-4xl font-black mb-8 leading-tight text-white">{title}</h3>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed">{text}</p>
      </div>
      <div
        className="lg:w-2/5 flex flex-col items-center justify-center p-16 text-center relative overflow-hidden"
        style={{ backgroundColor: accent === 'gold' ? colors.primaryGold : '#2563eb' }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]"></div>
        </div>
        <div className="relative z-10">
          <ShieldCheck size={64} className="text-white/40 mb-4 mx-auto" />
          <div className="text-xl font-black uppercase tracking-[0.2em] text-white">Qualidade Conexão</div>
        </div>
      </div>
    </div>
  </section>
);

// --- Main App ---

interface LoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed';
}

export default function App() {
  // State
  const [view, setView] = useState<ViewType>('keys');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [authEmail, setAuthEmail] = useState('conexaosistemasdeprotese@gmail.com');
  const [authPassword, setAuthPassword] = useState('@#1984198720042009@#');

  // Data State
  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
    primaryBlue: '#004a8e',
    primaryGold: '#c5a059',
    description: 'A Conexão Sistemas de Prótese é líder em inovação para implantodontia...',
    systemPrompt: `Gere um ÚNICO arquivo HTML autônomo contendo HTML, CSS (use Tailwind via CDN: https://cdn.tailwindcss.com) e JS (use Lucide Icons via CDN: https://unpkg.com/lucide@latest).
NÃO inclua cabeçalhos ou rodapés externos do construtor.
Aplique o branding fornecido de forma elegante e profissional.
Use animações suaves (pode usar CSS puro ou bibliotecas via CDN se necessário).
O arquivo deve ser auto-contido e pronto para ser aberto em qualquer navegador.
Retorne APENAS o código HTML completo, sem blocos de código markdown (\`\`\`html).`
  });

  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    gemini: '',
    openai: '',
    claude: '',
    groq: ''
  });

  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    anonKey: ''
  });

  const [rawText, setRawText] = useState<string>('');
  const [markdownText, setMarkdownText] = useState<string>(`# Diferenças entre os Implantes: Flex Gold, Flash e Torque

As diferenças entre os implantes Flex Gold, Flash e Torque estão principalmente na sua indicação para diferentes tipos de densidade óssea.

## Modelos Principais

- **Flash**: Excelente travamento na maxila (osso macio) e alvéolo imediato. Design com rosca fina e cortante.
- **Torque**: Performance em mandíbula (osso duro). Macroestrutura focada em torque.
- **Flex Gold**: A solução 2 em 1. Híbrido universal que une os benefícios do Flash e Torque.

## Comparativo Técnico

| Característica | Flash | Torque | Flex Gold |
| :--- | :--- | :--- | :--- |
| Foco Principal | Maxila | Mandíbula | Universal |
| Ação Óssea | Compactante | Estabilidade | Corte + Compactação |
| Complexidade | Alta em osso duro | Fluida em mandíbula | Simplificada |

O Flex Gold é a tendência atual para clínicas que buscam um implante para tudo.`);

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [selectedApi, setSelectedApi] = useState<keyof ApiKeys>('gemini');
  const [selectedLang, setSelectedLang] = useState<'pt' | 'en' | 'es' | 'all'>('pt');
  const [filename, setFilename] = useState<string>('minha-pagina');
  const [filenameEn, setFilenameEn] = useState<string>('my-page');
  const [filenameEs, setFilenameEs] = useState<string>('mi-pagina');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [materials, setMaterials] = useState<GeneratedMaterial[]>([]);
  const [promptLibrary, setPromptLibrary] = useState<PromptLibraryEntry[]>([]);
  const [viewingMaterial, setViewingMaterial] = useState<GeneratedMaterial | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editorTab, setEditorTab] = useState<'content' | 'style' | 'metadata'>('content');
  const [suggestedMetadata, setSuggestedMetadata] = useState<SuggestedMetadata | null>(null);
  const [metadataLang, setMetadataLang] = useState<'pt' | 'en' | 'es'>('pt');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Supabase Integration ---

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadUserData();
      setShowLoginModal(false);
    } else {
      setMaterials([]);
      setApiKeys({ gemini: '', openai: '', claude: '', groq: '' });
      setSupabaseConfig({ url: '', anonKey: '' });
      setBrandConfig({
        primaryBlue: '#004a8e',
        primaryGold: '#c5a059',
        description: 'A Conexão Sistemas de Prótese é líder em inovação para implantodontia...',
        systemPrompt: `Gere um ÚNICO arquivo HTML autônomo contendo HTML, CSS (use Tailwind via CDN: https://cdn.tailwindcss.com) e JS (use Lucide Icons via CDN: https://unpkg.com/lucide@latest).
NÃO inclua cabeçalhos ou rodapés externos do construtor.
Aplique o branding fornecido de forma elegante e profissional.
Use animações suaves (pode usar CSS puro ou bibliotecas via CDN se necessário).
O arquivo deve ser auto-contido e pronto para ser aberto em qualquer navegador.
Retorne APENAS o código HTML completo, sem blocos de código markdown (\`\`\`html).`
      });
      loadDefaultPrompts();
    }
  }, [session]);

  const loadDefaultPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_library')
        .select('*')
        .eq('is_default', true)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setPromptLibrary(data);
      }
    } catch (err) {
      console.error('Erro ao carregar prompts padrão:', err);
    }
  };

  const loadUserData = async () => {
    if (!session) return;

    const steps: LoadingStep[] = [
      { id: 'branding', label: 'Configurações de Branding', status: 'loading' },
      { id: 'keys', label: 'Chaves de API', status: 'pending' },
      { id: 'materials', label: 'Biblioteca de Materiais', status: 'pending' },
      { id: 'prompts', label: 'Modelos de Design', status: 'pending' }
    ];

    setLoading(true);
    setLoadingMsg('Sincronizando Dados');
    setLoadingSteps(steps);

    try {
      // Load Branding
      const { data: branding, error: bError } = await supabase
        .from('branding_configs')
        .select('*')
        .single();

      if (branding && !bError) {
        setBrandConfig({
          primaryBlue: branding.primary_blue,
          primaryGold: branding.primary_gold,
          description: branding.description,
          pdfName: branding.pdf_name,
          systemPrompt: branding.system_prompt || brandConfig.systemPrompt
        });

        setSupabaseConfig({
          url: branding.supabase_url || '',
          anonKey: branding.supabase_anon_key || ''
        });
      }

      setLoadingSteps(prev => prev.map(s => s.id === 'branding' ? { ...s, status: 'completed' } : s.id === 'keys' ? { ...s, status: 'loading' } : s));

      // Load API Keys
      const { data: keys, error: kError } = await supabase
        .from('api_keys')
        .select('*');

      if (keys && !kError) {
        const newKeys = { ...apiKeys };
        keys.forEach(k => {
          if (k.service_name in newKeys) {
            (newKeys as any)[k.service_name] = k.key_value;
          }
        });
        setApiKeys(newKeys);
      }

      setLoadingSteps(prev => prev.map(s => s.id === 'keys' ? { ...s, status: 'completed' } : s.id === 'materials' ? { ...s, status: 'loading' } : s));

      // Load Materials
      const { data: mats, error: mError } = await supabase
        .from('generated_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (mats && !mError) {
        setMaterials(mats.map(m => ({
          id: m.id,
          name: m.name,
          html: m.html_content,
          timestamp: new Date(m.created_at).getTime(),
          metadata: m.metadata
        })));
      }

      setLoadingSteps(prev => prev.map(s => s.id === 'materials' ? { ...s, status: 'completed' } : s.id === 'prompts' ? { ...s, status: 'loading' } : s));

      // Load Prompt Library
      const { data: prompts, error: pError } = await supabase
        .from('prompt_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (prompts && !pError) {
        setPromptLibrary(prompts);
      }

      setLoadingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const loadMaterial = (material: GeneratedMaterial) => {
    setGeneratedHtml(material.html);
    setFilename(material.name.replace('.html', ''));
    setView('preview');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMsg('Entrando...');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) throw error;
    } catch (error: any) {
      alert(`Erro na autenticação: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveSupabaseConfig = async () => {
    if (!session) return alert('Você precisa estar logado para salvar.');
    setLoading(true);
    setLoadingMsg('Salvando configurações do Supabase...');

    try {
      const { error } = await supabase
        .from('branding_configs')
        .upsert({
          user_id: session.user.id,
          supabase_url: supabaseConfig.url,
          supabase_anon_key: supabaseConfig.anonKey
        });

      if (error) throw error;
      alert('Configurações do Supabase salvas com sucesso!');
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveBranding = async () => {
    if (!session) return alert('Você precisa estar logado para salvar.');
    setLoading(true);
    setLoadingMsg('Salvando branding no Supabase...');

    try {
      const { error } = await supabase
        .from('branding_configs')
        .upsert({
          user_id: session.user.id,
          primary_blue: brandConfig.primaryBlue,
          primary_gold: brandConfig.primaryGold,
          description: brandConfig.description,
          pdf_name: brandConfig.pdfName,
          system_prompt: brandConfig.systemPrompt
        });

      if (error) throw error;
      alert('Branding salvo com sucesso!');
    } catch (error: any) {
      alert(`Erro ao salvar branding: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKeys = async () => {
    if (!session) return alert('Você precisa estar logado para salvar.');
    setLoading(true);
    setLoadingMsg('Salvando chaves de API no Supabase...');

    try {
      const keysToSave = Object.entries(apiKeys).map(([service, value]) => ({
        user_id: session.user.id,
        service_name: service,
        key_value: value
      }));

      const { error } = await supabase
        .from('api_keys')
        .upsert(keysToSave, { onConflict: 'user_id,service_name' });

      if (error) throw error;
      alert('Chaves de API salvas com sucesso!');
    } catch (error: any) {
      alert(`Erro ao salvar chaves: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const savePromptToLibrary = async () => {
    if (!session) return alert('Você precisa estar logado.');
    const title = prompt('Dê um título para este prompt na biblioteca:');
    if (!title) return;
    const description = prompt('Dê uma breve descrição para este estilo:');

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prompt_library')
        .insert({
          user_id: session.user.id,
          title,
          content: brandConfig.systemPrompt,
          description
        })
        .select();

      if (error) throw error;
      if (data) {
        setPromptLibrary(prev => [data[0], ...prev]);
        setSelectedPromptId(data[0].id);
      }
      alert('Prompt salvo na biblioteca!');
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seedPromptLibrary = async () => {
    if (!session) return alert('Você precisa estar logado.');
    if (!confirm('Deseja importar os estilos de design padrão para sua biblioteca?')) return;

    const steps: LoadingStep[] = [
      { id: 'prepare', label: 'Preparando modelos', status: 'loading' },
      { id: 'import', label: 'Importando para o Supabase', status: 'pending' },
      { id: 'refresh', label: 'Atualizando biblioteca local', status: 'pending' }
    ];

    setLoading(true);
    setLoadingMsg('Importação de Estilos');
    setLoadingSteps(steps);

    try {
      setLoadingSteps(prev => prev.map(s => s.id === 'prepare' ? { ...s, status: 'completed' } : s.id === 'import' ? { ...s, status: 'loading' } : s));

      const promptsToInsert = DEFAULT_PROMPTS.map(p => ({
        user_id: session.user.id,
        title: p.title,
        content: p.content,
        description: p.description
      }));

      const { data, error } = await supabase
        .from('prompt_library')
        .insert(promptsToInsert)
        .select();

      if (error) throw error;

      setLoadingSteps(prev => prev.map(s => s.id === 'import' ? { ...s, status: 'completed' } : s.id === 'refresh' ? { ...s, status: 'loading' } : s));

      if (data) {
        setPromptLibrary(prev => [...data, ...prev]);
      }

      setLoadingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      alert('Biblioteca de estilos importada com sucesso!');
    } catch (err: any) {
      alert(`Erro ao importar: ${err.message}`);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // --- Logic ---

  const downloadHtml = (html: string, name: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\.[^/.]+$/, "")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteMaterial = async (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    setLoading(true);
    setLoadingMsg('Excluindo material...');

    try {
      if (session) {
        const { error } = await supabase
          .from('generated_materials')
          .delete()
          .eq('id', deleteConfirmId)
          .eq('user_id', session.user.id);
        if (error) throw error;
      }
      setMaterials(prev => prev.filter(m => m.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error: any) {
      alert(`Erro ao excluir: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const previewMaterial = (material: GeneratedMaterial) => {
    setGeneratedHtml(material.html);
    setFilename(material.name);
    setView('preview');
  };

  const updateMaterialName = async (id: string) => {
    const nameToSave = editName.trim();
    if (!nameToSave) {
      setEditingId(null);
      return;
    }

    // Guardar estado anterior para rollback em caso de erro
    const previousMaterials = [...materials];

    // 1. Atualização Otimista (Front-end reflete na hora)
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, name: nameToSave } : m));
    setEditingId(null);
    setEditName('');

    // 2. Persistência no Back-end (Supabase)
    if (session) {
      try {
        // Incluímos o user_id para garantir que o RLS do Supabase valide a permissão de escrita
        const { data, error } = await supabase
          .from('generated_materials')
          .update({ name: nameToSave })
          .eq('id', id)
          .eq('user_id', session.user.id)
          .select();

        if (error) throw error;

        // Se data estiver vazio, significa que nenhuma linha foi atualizada (ID não encontrado ou RLS bloqueou)
        if (!data || data.length === 0) {
          throw new Error("O registro não foi encontrado ou você não tem permissão para editá-lo.");
        }

        console.log("Sucesso ao atualizar no Supabase:", data);
      } catch (error: any) {
        alert('Erro ao salvar no banco de dados: ' + error.message);
        // Reverter se falhar para o usuário não achar que salvou
        setMaterials(previousMaterials);
      }
    }
  };

  const convertToMarkdown = async () => {
    if (!rawText.trim()) return;

    const steps: LoadingStep[] = [
      { id: 'analyze', label: 'Analisando texto bruto', status: 'loading' },
      { id: 'structure', label: 'Estruturando Markdown', status: 'pending' },
      { id: 'clean', label: 'Limpando formatação', status: 'pending' }
    ];

    setLoading(true);
    setLoadingMsg('Conversor Inteligente');
    setLoadingSteps(steps);

    try {
      const apiKey = apiKeys.gemini || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key do Gemini não encontrada.");

      const ai = new GoogleGenAI({ apiKey });

      setLoadingSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'completed' } : s.id === 'structure' ? { ...s, status: 'loading' } : s));

      const contents: any[] = [
        { text: `Transforme o seguinte texto em um Markdown bem estruturado, com títulos, listas e tabelas se necessário:\n\n${rawText}` }
      ];

      if (brandConfig.pdfBase64) {
        contents.push({
          inlineData: {
            mimeType: "application/pdf",
            data: brandConfig.pdfBase64
          }
        });
        contents[0].text += "\n\nUse o PDF de branding anexado como referência para o tom de voz e estrutura.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: { parts: contents },
        config: {
          systemInstruction: "Você é um assistente especializado em estruturação de conteúdo técnico em Markdown."
        }
      });

      if (!response.text) throw new Error("Sem resposta do modelo.");

      setLoadingSteps(prev => prev.map(s => s.id === 'structure' ? { ...s, status: 'completed' } : s.id === 'clean' ? { ...s, status: 'loading' } : s));

      let text = response.text;
      // Limpar blocos de código markdown se o modelo retornar
      text = text.replace(/^```markdown\n?/, '').replace(/```$/, '').trim();

      setMarkdownText(text);
      setEditorTab('content');
      setView('editor');

      setLoadingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const generateMetadataSuggestions = async () => {
    if (!markdownText.trim()) return;

    const steps: LoadingStep[] = [
      { id: 'analyze', label: 'Analisando conteúdo', status: 'loading' },
      { id: 'creative', label: 'Criando títulos e slugs', status: 'pending' },
      { id: 'translate', label: 'Traduzindo para 3 idiomas', status: 'pending' }
    ];

    setLoading(true);
    setLoadingMsg('Gerador de Metadados');
    setLoadingSteps(steps);

    try {
      const apiKey = apiKeys.gemini || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key do Gemini não encontrada.");

      const ai = new GoogleGenAI({ apiKey });

      setLoadingSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'completed' } : s.id === 'creative' ? { ...s, status: 'loading' } : s));

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Analise o seguinte Markdown e sugira metadados estratégicos para uma landing page.
        Retorne APENAS um JSON válido seguindo exatamente esta estrutura:
        {
          "pt": { "title": "...", "filename": "...", "description": "...", "tags": ["...", "..."] },
          "en": { "title": "...", "filename": "...", "description": "...", "tags": ["...", "..."] },
          "es": { "title": "...", "filename": "...", "description": "...", "tags": ["...", "..."] }
        }
        
        Regras:
        - filename deve ser um slug (ex: meu-produto-novo) sem extensão.
        - description deve ser curta e persuasiva (máx 160 caracteres).
        - tags devem ser relevantes para SEO.
        
        Markdown:
        ${markdownText}`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "Você é um especialista em SEO e Copywriting multilíngue."
        }
      });

      setLoadingSteps(prev => prev.map(s => s.id === 'creative' ? { ...s, status: 'completed' } : s.id === 'translate' ? { ...s, status: 'loading' } : s));

      if (!response.text) throw new Error("Sem resposta do modelo.");
      const data = JSON.parse(response.text);
      setSuggestedMetadata(data);
      setEditorTab('metadata');

      setLoadingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    } catch (error: any) {
      alert(`Erro ao gerar metadados: ${error.message}`);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const generateSinglePage = async (lang: 'pt' | 'en' | 'es', customFilename: string) => {
    const apiKey = apiKeys[selectedApi] || (selectedApi === 'gemini' ? process.env.GEMINI_API_KEY : '');
    if (!apiKey) throw new Error(`API Key para ${selectedApi.toUpperCase()} não encontrada na aba API Keys.`);

    const ai = new GoogleGenAI({ apiKey: selectedApi === 'gemini' ? apiKey : (apiKeys.gemini || process.env.GEMINI_API_KEY || '') });

    setLoadingSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'completed' } : s.id === 'style' ? { ...s, status: 'loading' } : s));

    const langNames = { pt: 'Português (Brasil)', en: 'Inglês (EN-US)', es: 'Espanhol (ES-ES)' };

    const parts: any[] = [
      {
        text: `
        Markdown de entrada:
        ${markdownText}

        Diretrizes de Branding:
        ${brandConfig.description}
        Cores: Azul (${brandConfig.primaryBlue}), Dourado (${brandConfig.primaryGold})

        IDIOMA DA PÁGINA: ${langNames[lang]}
        TRADUÇÃO: Traduza todo o conteúdo do Markdown fielmente para o idioma ${langNames[lang]}, mantendo a precisão técnica.

        INSTRUÇÃO DE GERAÇÃO:
        ${brandConfig.systemPrompt}
      ` }
    ];

    if (brandConfig.pdfBase64) {
      parts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: brandConfig.pdfBase64
        }
      });
      parts[0].text += "\n\nIMPORTANTE: Siga rigorosamente a identidade visual e diretrizes contidas no PDF de branding anexado.";
    }

    setLoadingSteps(prev => prev.map(s => s.id === 'style' ? { ...s, status: 'completed' } : s.id === 'branding' ? { ...s, status: 'loading' } : s));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: { parts },
      config: {
        systemInstruction: "Você é um desenvolvedor front-end sênior e tradutor técnico especializado em criar páginas de destino (landing pages) de alta conversão."
      }
    });

    setLoadingSteps(prev => prev.map(s => s.id === 'branding' ? { ...s, status: 'completed' } : s.id === 'generate' ? { ...s, status: 'loading' } : s));

    let html = response.text || '';
    html = html.replace(/^```html/, '').replace(/```$/, '').trim();

    setLoadingSteps(prev => prev.map(s => s.id === 'generate' ? { ...s, status: 'completed' } : s.id === 'finalize' ? { ...s, status: 'loading' } : s));

    if (session) {
      const { data, error } = await supabase
        .from('generated_materials')
        .insert({
          user_id: session.user.id,
          name: customFilename,
          html_content: html,
          metadata: suggestedMetadata ? suggestedMetadata[lang] : null
        })
        .select()
        .single();

      if (data && !error) {
        const newMaterial: GeneratedMaterial = {
          id: data.id,
          name: data.name,
          html: data.html_content,
          timestamp: new Date(data.created_at).getTime(),
          metadata: data.metadata
        };
        setMaterials(prev => [newMaterial, ...prev]);
      }
    } else {
      const newMaterial: GeneratedMaterial = {
        id: Math.random().toString(36).substr(2, 9),
        name: customFilename,
        html: html,
        timestamp: Date.now(),
        metadata: suggestedMetadata ? suggestedMetadata[lang] : undefined
      };
      setMaterials(prev => [newMaterial, ...prev]);
    }

    setLoadingSteps(prev => prev.map(s => s.id === 'finalize' ? { ...s, status: 'completed' } : s));

    return html;
  };

  const generatePage = async () => {
    if (!markdownText.trim()) return;

    const steps: LoadingStep[] = [
      { id: 'analyze', label: 'Analisando Markdown', status: 'loading' },
      { id: 'style', label: 'Aplicando Direção de Arte', status: 'pending' },
      { id: 'branding', label: 'Injetando Branding', status: 'pending' },
      { id: 'generate', label: 'Gerando Código HTML', status: 'pending' },
      { id: 'finalize', label: 'Finalizando Material', status: 'pending' }
    ];

    setLoading(true);
    setLoadingMsg('Gerador de Páginas');
    setLoadingSteps(steps);

    try {
      if (selectedLang === 'all') {
        const langs: ('pt' | 'en' | 'es')[] = ['pt', 'en', 'es'];
        const names: Record<'pt' | 'en' | 'es', string> = { pt: filename, en: filenameEn, es: filenameEs };
        let lastHtml = '';
        for (const lang of langs) {
          setLoadingMsg(`Gerando versão ${lang.toUpperCase()}...`);
          // Reset steps for each language to show progress
          setLoadingSteps(steps.map(s => s.id === 'analyze' ? { ...s, status: 'loading' } : { ...s, status: 'pending' }));
          lastHtml = await generateSinglePage(lang, names[lang]);
        }
        setGeneratedHtml(lastHtml);
        setFilename(filenameEs); // Show the last one in preview
      } else {
        const html = await generateSinglePage(selectedLang, filename);
        setGeneratedHtml(html);
      }

      setView('preview');
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, envie apenas arquivos PDF.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setBrandConfig({
          ...brandConfig,
          pdfBase64: base64,
          pdfName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePdf = () => {
    setBrandConfig({
      ...brandConfig,
      pdfBase64: undefined,
      pdfName: undefined
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20" style={{ backgroundColor: brandConfig.primaryBlue }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase text-white">
                Interactive <span style={{ color: brandConfig.primaryGold }}>Builder</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <User size={16} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Usuário</p>
                  <p className="text-xs font-bold text-slate-300 truncate max-w-[180px]">{session.user.email}</p>
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
              >
                <LogIn size={16} /> Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <nav className="bg-[#0f172a]/60 backdrop-blur-md border-b border-slate-800 sticky top-[73px] z-40 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1 overflow-x-auto max-w-full">
          {[
            { id: 'keys', icon: Key, label: 'API Keys' },
            { id: 'supabase', icon: ShieldCheck, label: 'Supabase' },
            { id: 'branding', icon: Palette, label: 'Branding' },
            { id: 'editor', icon: Code, label: 'Editor' },
            { id: 'preview', icon: Eye, label: 'Preview' },
            { id: 'materials', icon: History, label: 'Materiais' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as ViewType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${view === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 rounded-[3rem] p-12 text-center w-full max-w-xl shadow-2xl shadow-blue-900/20 border border-slate-800 relative overflow-hidden"
              >
                {/* Animated Background Scanner */}
                <motion.div
                  animate={{
                    top: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none"
                />

                <div className="relative z-10">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-500/30">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={40} className="text-blue-400" />
                    </motion.div>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                    {loadingMsg || 'Processando...'}
                  </h3>
                  <p className="text-slate-500 text-sm mb-10">Isso pode levar alguns segundos enquanto nossa IA refina seu conteúdo.</p>

                  <div className="space-y-3 text-left max-w-sm mx-auto">
                    {loadingSteps.map((step, idx) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${step.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                            step.status === 'loading' ? 'bg-blue-500/20 border-blue-500 animate-pulse' :
                              'border-slate-700'
                          }`}>
                          {step.status === 'completed' ? (
                            <Check size={12} className="text-white" />
                          ) : step.status === 'loading' ? (
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          ) : null}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${step.status === 'completed' ? 'text-emerald-400' :
                            step.status === 'loading' ? 'text-blue-400' :
                              'text-slate-600'
                          }`}>
                          {step.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-12 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${(loadingSteps.filter(s => s.status === 'completed').length / loadingSteps.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* 1. Supabase Tab */}
          {view === 'supabase' && (
            <motion.div key="supabase" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-lg shadow-black/20">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                      <ShieldCheck className="text-blue-500" /> Projeto Supabase
                    </h2>
                    <p className="text-slate-400 mt-2">Configure as credenciais do seu projeto Supabase para persistência de dados.</p>
                  </div>
                  <button onClick={saveSupabaseConfig} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95 text-sm">
                    <Save size={16} /> Salvar Configuração
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/30">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Supabase URL</label>
                    <div className="relative">
                      <ExternalLink size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={supabaseConfig.url}
                        onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                        placeholder="https://your-project.supabase.co"
                        className="w-full pl-12 pr-4 py-4 border border-slate-700 bg-slate-900 text-white rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/30">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Supabase Anon Key</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        value={supabaseConfig.anonKey}
                        onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full pl-12 pr-4 py-4 border border-slate-700 bg-slate-900 text-white rounded-xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SQL Scripts & Library Styles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SQL Scripts */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-lg shadow-black/20 flex flex-col h-[600px]">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <FileCode className="text-emerald-500" /> Scripts SQL
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Execute estes scripts no SQL Editor do Supabase.</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(SUPABASE_SQL, 'sql')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${copiedId === 'sql' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {copiedId === 'sql' ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar SQL</>}
                    </button>
                  </div>
                  <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative">
                    <pre className="p-6 text-xs font-mono text-slate-300 overflow-auto h-full custom-scrollbar leading-relaxed">
                      {SUPABASE_SQL}
                    </pre>
                  </div>
                </div>

                {/* Seed Prompts */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-lg shadow-black/20 flex flex-col h-[600px]">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Palette className="text-purple-500" /> Modelos de Design (Seed)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">SQL para popular sua biblioteca com 31 estilos exclusivos.</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(SEED_PROMPTS_SQL, 'seed')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${copiedId === 'seed' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {copiedId === 'seed' ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar Seed SQL</>}
                    </button>
                  </div>
                  <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative">
                    <pre className="p-6 text-xs font-mono text-slate-300 overflow-auto h-full custom-scrollbar leading-relaxed">
                      {SEED_PROMPTS_SQL}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pb-12">
                <button onClick={() => setView('branding')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold">
                  Ir para Branding <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. Branding Tab */}
          {view === 'branding' && (
            <motion.div key="branding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Panel: Visual Identity */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-lg shadow-black/20 h-full">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                      <Palette className="text-blue-500" /> Identidade Visual
                    </h2>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cor Primária (Azul)</label>
                        <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
                          <input
                            type="color"
                            value={brandConfig.primaryBlue}
                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}
                            className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none p-0"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandConfig.primaryBlue}
                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-sm font-bold outline-none uppercase"
                            />
                            <p className="text-[10px] text-slate-500">Brand Blue</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cor Secundária (Dourado)</label>
                        <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-2xl border border-slate-800">
                          <input
                            type="color"
                            value={brandConfig.primaryGold}
                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}
                            className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none p-0"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandConfig.primaryGold}
                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-sm font-bold outline-none uppercase"
                            />
                            <p className="text-[10px] text-slate-500">Accent Gold</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Brand Strategy */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-lg shadow-black/20 h-full flex flex-col">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                      <FileText className="text-amber-500" /> Estratégia & Voz
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                      <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição da Marca</label>
                        <textarea
                          value={brandConfig.description}
                          onChange={(e) => setBrandConfig({ ...brandConfig, description: e.target.value })}
                          className="flex-1 w-full p-4 border border-slate-700 bg-slate-800 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-600 resize-none text-sm leading-relaxed"
                          placeholder="Descreva o tom de voz, valores e diretrizes da marca..."
                        />
                      </div>

                      <div className="space-y-2 flex flex-col">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manual da Marca (PDF)</label>
                        {!brandConfig.pdfName ? (
                          <label className="flex-1 flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all group bg-slate-800/20">
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <FileUp className="w-6 h-6 text-slate-500 group-hover:text-blue-400" />
                              </div>
                              <p className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Upload PDF</p>
                              <p className="text-[10px] text-slate-600 mt-1">Arraste ou clique (Max 10MB)</p>
                            </div>
                            <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfUpload} />
                          </label>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 relative group">
                            <FileText size={48} className="text-red-500/50 mb-4" />
                            <p className="text-sm font-bold text-white text-center break-all px-4">{brandConfig.pdfName}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Documento Carregado</p>
                            <button
                              onClick={removePdf}
                              className="absolute top-4 right-4 p-2 bg-slate-700 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-4">
                      <button onClick={() => setView('keys')} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm">
                        Pular para API Keys
                      </button>
                      <button onClick={saveBranding} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95 text-sm">
                        <Save size={16} /> Salvar Configurações
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. API Keys Tab */}
          {view === 'keys' && (
            <motion.div key="keys" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-lg shadow-black/20">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                      <Key className="text-emerald-500" /> Chaves de API
                    </h2>
                    <p className="text-slate-400 mt-2">Gerencie as conexões com os modelos de inteligência artificial.</p>
                  </div>
                  <button onClick={saveApiKeys} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 text-sm">
                    <Save size={16} /> Salvar Todas
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: 'gemini', label: 'Google Gemini', icon: Sparkles, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
                    { id: 'openai', label: 'OpenAI (GPT-4)', icon: Zap, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
                    { id: 'claude', label: 'Anthropic Claude', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
                    { id: 'groq', label: 'Groq (Llama 3)', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' }
                  ].map((service) => (
                    <div key={service.id} className={`p-6 rounded-2xl border ${service.border} bg-slate-800/30 hover:bg-slate-800/50 transition-all group`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${service.bg} ${service.color}`}>
                          <service.icon size={20} />
                        </div>
                        <span className="font-bold text-slate-200">{service.label}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          value={(apiKeys as any)[service.id]}
                          onChange={(e) => setApiKeys({ ...apiKeys, [service.id]: e.target.value })}
                          placeholder={`Cole sua chave ${service.label} aqui...`}
                          className="w-full px-4 py-3 border border-slate-700 bg-slate-900 text-white rounded-xl font-mono text-xs outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-600 transition-all"
                        />
                        {(apiKeys as any)[service.id] && (
                          <div className="absolute right-3 top-3 text-emerald-500">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button onClick={() => setView('converter')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold">
                    Ir para Conversor <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. Converter Tab */}
          {view === 'converter' && (
            <motion.div key="converter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-6">
              <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-lg shadow-black/20 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 backdrop-blur-md">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                      <Wand2 className="text-purple-500" /> Conversor Inteligente
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Transforme textos brutos, anotações ou PDFs em Markdown estruturado.</p>
                  </div>
                  <button
                    onClick={convertToMarkdown}
                    disabled={!rawText.trim()}
                    className="w-full md:w-auto bg-purple-600 text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-purple-500 shadow-xl shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
                  >
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>CONVERTER AGORA</span>
                  </button>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-h-[500px]">
                  {/* Input */}
                  <div className="flex flex-col p-6">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} /> Entrada de Texto
                      </label>
                      <div className="flex items-center gap-4">
                        {rawText && (
                          <button
                            onClick={() => setRawText('')}
                            className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
                          >
                            Limpar
                          </button>
                        )}
                        <button
                          onClick={convertToMarkdown}
                          disabled={!rawText.trim()}
                          className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors disabled:opacity-30"
                        >
                          <Sparkles size={10} /> Converter
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Cole aqui suas anotações, e-mails, rascunhos ou conteúdo de PDF..."
                      className="flex-1 w-full p-6 border border-slate-700 bg-slate-800/50 text-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 resize-none placeholder:text-slate-600 font-mono text-sm leading-relaxed"
                    />
                  </div>

                  {/* Info / Output Placeholder */}
                  <div className="flex flex-col p-6 bg-slate-900/50">
                    {markdownText && markdownText.length > 100 ? (
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500" /> Último Resultado Convertido
                          </label>
                          <button
                            onClick={() => setView('editor')}
                            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                          >
                            Abrir no Editor <ChevronRight size={10} />
                          </button>
                        </div>
                        <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-y-auto custom-scrollbar prose prose-invert prose-slate prose-xs max-w-none">
                          <ReactMarkdown>{markdownText}</ReactMarkdown>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(markdownText);
                              alert('Markdown copiado!');
                            }}
                            className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            <Copy size={12} /> Copiar Markdown
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/20">
                          <ArrowRightLeft size={40} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Pronto para Processar</h3>
                        <p className="text-slate-500 max-w-sm leading-relaxed">
                          Nossa IA irá analisar seu texto, identificar títulos, listas e tabelas, e gerar um Markdown limpo para uso no Editor.
                        </p>
                        <div className="mt-8 flex gap-2">
                          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-500 text-xs font-mono border border-slate-700">Estruturação</span>
                          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-500 text-xs font-mono border border-slate-700">Limpeza</span>
                          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-500 text-xs font-mono border border-slate-700">Formatação</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. Editor Tab */}
          {view === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[72px] bg-slate-950 flex flex-col overflow-hidden"
            >
              {/* Main Workspace */}
              <div className="flex-1 flex overflow-hidden">
                {/* Expanded Left Sidebar */}
                <div className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-4 border-b border-slate-800">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Editor</p>
                  </div>

                  {/* Nav Tabs */}
                  <div className="flex flex-col gap-1 p-3">
                    <button
                      onClick={() => setEditorTab('converter')}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${editorTab === 'converter' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                    >
                      <ArrowRightLeft size={15} className="shrink-0" />
                      Conversor Rápido
                    </button>
                    <button
                      onClick={() => setEditorTab('content')}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${editorTab === 'content' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                    >
                      <Pencil size={15} className="shrink-0" />
                      Markdown Editor
                    </button>
                    <button
                      onClick={() => setEditorTab('style')}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${editorTab === 'style' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                    >
                      <Palette size={15} className="shrink-0" />
                      Biblioteca de Estilos
                    </button>
                    <button
                      onClick={() => setEditorTab('metadata')}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${editorTab === 'metadata' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                    >
                      <LayoutTemplate size={15} className="shrink-0" />
                      Metadados & SEO
                    </button>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Generate Section */}
                  <div className="border-t border-slate-800 p-4 space-y-4">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Wand2 size={10} /> Gerar Página
                    </p>

                    {/* IA selector */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">IA</label>
                      <select
                        value={selectedApi}
                        onChange={(e) => setSelectedApi(e.target.value as keyof ApiKeys)}
                        className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer [&>option]:text-slate-900"
                      >
                        <option value="gemini">Google Gemini</option>
                        <option value="openai">OpenAI (GPT-4o)</option>
                        <option value="claude">Anthropic Claude</option>
                        <option value="groq">Groq (Llama 3)</option>
                      </select>
                      {selectedApi !== 'gemini' && (
                        <p className="text-[9px] text-amber-400">⚠️ Usa Gemini internamente</p>
                      )}
                    </div>

                    {/* Idioma selector */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Idioma</label>
                      <select
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value as any)}
                        className="w-full px-2.5 py-2 bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer [&>option]:text-slate-900"
                      >
                        <option value="pt">🇧🇷 Português (BR)</option>
                        <option value="en">🇺🇸 Inglês (US)</option>
                        <option value="es">🇪🇸 Espanhol (ES)</option>
                        <option value="all">🌐 Todos (3 langs)</option>
                      </select>
                    </div>

                    {/* Arquivo input(s) */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Arquivo</label>
                      {selectedLang !== 'all' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="nome-do-arquivo"
                            className="flex-1 px-2.5 py-2 bg-slate-800 border border-slate-700 text-white text-xs font-mono rounded-lg outline-none focus:ring-1 focus:ring-blue-500 min-w-0"
                          />
                          <span className="text-slate-500 text-[10px] font-mono shrink-0">.html</span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-blue-400 w-5 shrink-0">PT</span>
                            <input
                              type="text"
                              value={filename}
                              onChange={(e) => setFilename(e.target.value)}
                              placeholder="minha-pagina"
                              className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700 text-white text-[10px] font-mono rounded-lg outline-none focus:ring-1 focus:ring-blue-500 min-w-0"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-emerald-400 w-5 shrink-0">EN</span>
                            <input
                              type="text"
                              value={filenameEn}
                              onChange={(e) => setFilenameEn(e.target.value)}
                              placeholder="my-page"
                              className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700 text-white text-[10px] font-mono rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 min-w-0"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black text-purple-400 w-5 shrink-0">ES</span>
                            <input
                              type="text"
                              value={filenameEs}
                              onChange={(e) => setFilenameEs(e.target.value)}
                              placeholder="mi-pagina"
                              className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700 text-white text-[10px] font-mono rounded-lg outline-none focus:ring-1 focus:ring-purple-500 min-w-0"
                            />
                          </div>
                          <span className="text-slate-500 text-[9px] font-mono">.html cada</span>
                        </div>
                      )}
                    </div>

                    {/* Generate button */}
                    <button
                      onClick={generatePage}
                      disabled={!markdownText.trim() || !filename.trim() || (selectedLang === 'all' && (!filenameEn.trim() || !filenameEs.trim()))}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                      <Wand2 size={13} /> Gerar Página Interativa
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative bg-slate-950">
                  {editorTab === 'content' ? (
                    <div className="flex h-full divide-x divide-slate-800">
                      {/* Editor Pane */}
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="h-10 bg-slate-900/50 flex items-center px-4 justify-between border-b border-slate-800">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Markdown Editor</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setMarkdownText('')} className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors">Limpar</button>
                          </div>
                        </div>
                        <textarea
                          value={markdownText}
                          onChange={(e) => setMarkdownText(e.target.value)}
                          placeholder="# Comece a escrever seu conteúdo aqui..."
                          className="flex-1 w-full p-8 bg-transparent text-slate-200 outline-none font-mono text-sm resize-none leading-relaxed custom-scrollbar"
                        />
                      </div>

                      {/* Preview Pane */}
                      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/20">
                        <div className="h-10 bg-slate-900/50 flex items-center px-4 justify-between border-b border-slate-800">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Preview</span>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar prose prose-invert prose-slate prose-sm max-w-none">
                          <ReactMarkdown>{markdownText}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ) : editorTab === 'style' ? (
                    <div className="h-full flex divide-x divide-slate-800">
                      {/* Style Settings Pane */}
                      <div className="w-96 flex flex-col shrink-0 bg-slate-900/30">
                        <div className="h-10 bg-slate-900/50 flex items-center px-4 border-b border-slate-800">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biblioteca de Estilos</span>
                        </div>
                        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Selecionar Template Visual</label>
                            <select
                              value={selectedPromptId}
                              onChange={(e) => {
                                const id = e.target.value;
                                setSelectedPromptId(id);
                                const prompt = promptLibrary.find(p => p.id === id);
                                if (prompt) {
                                  setBrandConfig({ ...brandConfig, systemPrompt: prompt.content });
                                }
                              }}
                              className="w-full px-4 py-3 border border-slate-700 bg-slate-800 text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer appearance-none"
                            >
                              <option value="">Selecione um estilo...</option>
                              {promptLibrary.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                            </select>
                          </div>

                          {/* Style Preview Component */}
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Preview do Estilo Aplicado</label>
                            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/40">
                              <StylePreview
                                styleTitle={promptLibrary.find(p => p.id === selectedPromptId)?.title || 'Branding Padrão'}
                                brandConfig={{
                                  primaryBlue: brandConfig.primaryBlue,
                                  primaryGold: brandConfig.primaryGold
                                }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed italic">
                              * Este é um componente modelo demonstrando como o estilo visual será interpretado pela IA.
                            </p>
                          </div>

                          <div className="pt-6 border-t border-slate-800">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Cores da Marca</label>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-[10px] text-slate-500">Primária</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg border border-slate-700" style={{ backgroundColor: brandConfig.primaryBlue }} />
                                  <span className="text-[10px] font-mono text-slate-400 uppercase">{brandConfig.primaryBlue}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <span className="text-[10px] text-slate-500">Destaque</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg border border-slate-700" style={{ backgroundColor: brandConfig.primaryGold }} />
                                  <span className="text-[10px] font-mono text-slate-400 uppercase">{brandConfig.primaryGold}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={seedPromptLibrary}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all flex items-center justify-center gap-2"
                          >
                            <Download size={12} /> Importar Padrões
                          </button>
                        </div>
                      </div>

                      {/* Prompt Editor Pane */}
                      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/10">
                        <div className="h-10 bg-slate-900/50 flex items-center px-4 justify-between border-b border-slate-800">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Prompt (Direção de Arte)</span>
                          <button
                            onClick={savePromptToLibrary}
                            className="text-[10px] font-black text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-widest"
                          >
                            <Plus size={12} /> Salvar na Biblioteca
                          </button>
                        </div>
                        <textarea
                          value={brandConfig.systemPrompt}
                          onChange={(e) => setBrandConfig({ ...brandConfig, systemPrompt: e.target.value })}
                          className="flex-1 w-full p-8 bg-transparent text-slate-300 outline-none font-mono text-xs resize-none leading-relaxed custom-scrollbar"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col overflow-hidden">
                      <div className="h-10 bg-slate-900/50 flex items-center px-4 justify-between border-b border-slate-800">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sugestões de Metadados & SEO</span>
                        <button
                          onClick={generateMetadataSuggestions}
                          className="text-[10px] font-black text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-widest"
                        >
                          <Wand2 size={12} /> Atualizar IA
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-4xl mx-auto">
                          {!suggestedMetadata ? (
                            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-[2rem] p-16 text-center">
                              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <LayoutTemplate size={40} className="text-slate-600" />
                              </div>
                              <h4 className="text-xl font-black text-white mb-2">Nenhuma sugestão gerada</h4>
                              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">Nossa IA pode analisar seu conteúdo e sugerir os melhores textos para SEO.</p>
                              <button
                                onClick={generateMetadataSuggestions}
                                className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all"
                              >
                                Gerar Sugestões Agora
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-8">
                              {/* Language Switcher */}
                              <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
                                {(['pt', 'en', 'es'] as const).map(lang => (
                                  <button
                                    key={lang}
                                    onClick={() => setMetadataLang(lang)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${metadataLang === lang ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                                  >
                                    {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                                  </button>
                                ))}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                    <div className="flex justify-between items-center mb-4">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Título da Página</label>
                                      <button onClick={() => copyToClipboard(suggestedMetadata[metadataLang].title, 'meta-title')} className="text-slate-500 hover:text-white transition-colors">
                                        {copiedId === 'meta-title' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                      </button>
                                    </div>
                                    <p className="text-xl font-black text-white leading-tight">{suggestedMetadata[metadataLang].title}</p>
                                  </div>

                                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                    <div className="flex justify-between items-center mb-4">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome do Arquivo (Slug)</label>
                                      <div className="flex items-center gap-4">
                                        <button
                                          onClick={() => setFilename(suggestedMetadata[metadataLang].filename)}
                                          className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest"
                                        >
                                          Aplicar
                                        </button>
                                        <button onClick={() => copyToClipboard(suggestedMetadata[metadataLang].filename, 'meta-file')} className="text-slate-500 hover:text-white transition-colors">
                                          {copiedId === 'meta-file' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-blue-400 font-mono text-sm">{suggestedMetadata[metadataLang].filename}.html</p>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                    <div className="flex justify-between items-center mb-4">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Meta Descrição</label>
                                      <button onClick={() => copyToClipboard(suggestedMetadata[metadataLang].description, 'meta-desc')} className="text-slate-500 hover:text-white transition-colors">
                                        {copiedId === 'meta-desc' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                      </button>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">{suggestedMetadata[metadataLang].description}</p>
                                  </div>

                                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Tags Sugeridas</label>
                                    <div className="flex flex-wrap gap-2">
                                      {suggestedMetadata[metadataLang].tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-700">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. Preview Tab */}
          {view === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-[calc(100vh-200px)] min-h-[600px] flex flex-col">
              {generatedHtml ? (
                <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl shadow-black/40 flex flex-col h-full overflow-hidden">
                  {/* Browser Toolbar */}
                  <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>

                    <div className="flex-1 bg-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 border border-slate-700/50 mx-4">
                      <Lock size={12} className="text-emerald-500" />
                      <span className="text-xs font-mono text-slate-400 truncate">
                        https://interactive-builder.app/preview/{filename || 'untitled'}.html
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadHtml(generatedHtml, filename)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Baixar HTML"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => setView('editor')}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Voltar para Editor"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Iframe Container */}
                  <div className="flex-1 bg-white relative">
                    <iframe
                      srcDoc={generatedHtml}
                      className="absolute inset-0 w-full h-full border-none"
                      title="Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900 rounded-[2rem] border border-slate-800 border-dashed">
                  <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <LayoutTemplate size={40} className="text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nenhuma Preview Disponível</h3>
                  <p className="text-slate-500 max-w-sm mb-8">
                    Gere uma página na aba Editor para visualizar o resultado aqui.
                  </p>
                  <button
                    onClick={() => setView('editor')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                  >
                    Ir para o Editor
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* 6. Materials Tab */}
          {view === 'materials' && (
            <motion.div key="materials" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-white flex items-center gap-3">
                    <FolderOpen className="text-amber-500" /> Meus Materiais
                  </h2>
                  <p className="text-slate-400 mt-2">Gerencie, baixe ou edite suas páginas criadas anteriormente.</p>
                </div>
                <div className="hidden md:flex gap-2">
                  <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold text-slate-400">
                    {materials.length} Arquivos
                  </div>
                </div>
              </div>

              {materials.length === 0 ? (
                <div className="bg-slate-900 rounded-[2.5rem] p-16 border border-slate-800 border-dashed flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                    <FolderOpen size={48} className="text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Sua biblioteca está vazia</h3>
                  <p className="text-slate-500 max-w-md mb-8">
                    Comece convertendo um texto ou criando um prompt para gerar sua primeira página interativa.
                  </p>
                  <button
                    onClick={() => setView('converter')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                  >
                    <Plus size={18} className="inline mr-2" /> Criar Novo Material
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map((material) => (
                    <motion.div
                      key={material.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group bg-slate-900 rounded-[2rem] border border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-900/10 overflow-hidden flex flex-col"
                    >
                      <div className="h-40 bg-slate-800/50 relative p-6 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                        <FileCode size={48} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-blue-500/30">
                            HTML
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 truncate" title={material.name}>
                            {material.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono mb-4">
                            {new Date(material.timestamp).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: 'long', year: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800">
                          <button
                            onClick={() => setViewingMaterial(material)}
                            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                            title="Visualizar"
                          >
                            <Eye size={16} />
                            <span className="text-[10px] font-bold uppercase">Ver</span>
                          </button>
                          <button
                            onClick={() => loadMaterial(material)}
                            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                            title="Editar"
                          >
                            <Pencil size={16} />
                            <span className="text-[10px] font-bold uppercase">Editar</span>
                          </button>
                          <button
                            onClick={() => downloadHtml(material.html, material.name)}
                            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Baixar"
                          >
                            <Download size={16} />
                            <span className="text-[10px] font-bold uppercase">Baixar</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(material.id)}
                            className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                            <span className="text-[10px] font-bold uppercase">Excluir</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirmId(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl shadow-red-900/20 border border-slate-800"
              >
                <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-900/10">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Excluir Material?</h3>
                <p className="text-slate-400 mb-8">
                  Esta ação não pode ser desfeita. O arquivo será removido permanentemente do seu histórico e do banco de dados.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all"
                  >
                    Confirmar Exclusão
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Login Modal */}
        <AnimatePresence>
          {showLoginModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLoginModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-slate-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl shadow-blue-900/20 border border-slate-800"
              >
                <div className="w-16 h-16 bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/10 mx-auto">
                  <LogIn size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 text-center">Acesso Restrito</h3>
                <p className="text-slate-400 mb-8 text-center text-sm">
                  Utilize as credenciais mestre para acessar a plataforma.
                </p>

                <form onSubmit={handleAuth} className="space-y-4">
                  <input
                    type="email" placeholder="E-mail" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-700 bg-slate-800 text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-600" required
                  />
                  <input
                    type="password" placeholder="Senha" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-700 bg-slate-800 text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-600" required
                  />
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      className="w-full px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn size={18} /> Entrar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginModal(false);
                        setShowOnboarding(true);
                      }}
                      className="w-full px-6 py-3 rounded-xl font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <User size={18} /> Criar Nova Conta
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(false)}
                      className="w-full py-2 text-slate-500 hover:text-slate-300 text-xs transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
          {showOnboarding && (
            <OnboardingWizard
              onComplete={() => {
                setShowOnboarding(false);
                loadUserData();
              }}
              onCancel={() => setShowOnboarding(false)}
            />
          )}
        </AnimatePresence>
      </main>
      <MaterialPreviewModal
        material={viewingMaterial}
        onClose={() => setViewingMaterial(null)}
      />
    </div>
  );
}