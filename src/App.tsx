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
  Lock,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Clock
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
import JSZip from 'jszip';
import { Square, CheckSquare } from 'lucide-react';

// --- Types & Constants ---

type ViewType = 'keys' | 'supabase' | 'branding' | 'editor' | 'preview' | 'materials';
type ComponentType = 'hero' | 'grid' | 'comparison' | 'callout' | 'list';

interface MetadataItem {
  title: string;
  filename: string;
  description: string;
  tags: string[];
  style?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  fontFamily?: string;
  model?: string;
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
  id?: string;
  name?: string;
  primaryBlue: string;
  primaryGold: string;
  description: string;
  fontFamily: string;
  pdfBase64?: string;
  pdfName?: string;
  systemPrompt?: string;
  // Perfil Estratégico
  mainRole?: string;
  audienceGuidelines?: string;
  targetAudienceFoco?: string;
  targetAudienceTom?: string;
  targetAudienceRegra?: string;
  goldenRule?: string;
}

interface BrandPreset {
  id: string;
  user_id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  description?: string;
  main_role?: string;
  audience_guidelines?: string;
  target_foco?: string;
  target_tom?: string;
  target_regra?: string;
  golden_rule?: string;
  is_active: boolean;
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
    title: "Liquid Glass / Aurora Glass (Padrão)",
    description: "Estética de luxo digital premium focada em profundidade, transparência e elegância extrema. Tons de ouro metálico, azul profundo e vidros refinados.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head>:
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Inter:wght@400;700&family=Playfair+Display:ital@1&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

DIRETRIZES DE DESIGN & ESTRUTURA (LIQUID GLASS PREMIUM):
- CONCEITO: Luxo digital com profundidade líquida e brilho metálico.
- PALETA: Base #010409 (Deep Space). Destaque #f3c677 (Metallic Gold). Apoio #000814 e #1e3a8a para iluminação ambiente (blooms).
- TIPOGRAFIA: Headlines Montserrat 900 com tracking-tighter e gradiente metálico (White to Gold). Corpo Inter. Playfair Display Italic para detalhes.
- BOTÕES: Use botões Ghost (border-1px-gold) com texto branco ou gold, ou botões sólidos com brilho interno.
- GRID: Estrutura Bento Grid com cards de vidro lapidado (backdrop-blur-3xl, border-white/10).
- ILUMINAÇÃO: Efeito "Aura Flow" no fundo com blobs orgânicos que se movem lentamente via GSAP.
- INTERATIVIDADE: Cursor magnético sutil e animações de entrada fluidas (opacity + scale suaves).

RESTRIÇÕES:
Retorne APENAS o código HTML. Sem links reais ou interações de navegação.`
  },
  {
    title: "Neobrutalismo + Pastel Pop",
    description: "Estilo de alto contraste com bordas pretas espessas, sombras sólidas (Shadow-Pop) e paleta pastel vibrante. Ideal para fintechs e ferramentas modernas.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Neobrutalista: Utilize bordas pretas sólidas e espessas (border-2 ou border-4 border-black). Remova arredondamentos excessivos em favor de cantos vivos ou levemente arredondados (rounded-none ou rounded-lg).
- Sombras Hard-Edge: Implemente o efeito 'Shadow-Pop'. Em vez de sombras suaves e esfumaçadas, use sombras sólidas e deslocadas (box-shadow: 8px 8px 0px 0px #000;) que não possuem desfoque.
- Paleta Pastel Pop: Combine um fundo off-white (bg-[#f4f4f0]) com elementos em cores pastéis vibrantes e saturadas (Amarelo #FFD100, Rosa #FF90E8, Verde Menta #B1F1CB).
- Tipografia e Peso: Use a fonte 'Inter' ou 'Lexend' via Google Fonts. Títulos devem ter peso font-black (900) e letras levemente comprimidas (tracking-tighter).
- Interatividade: Escreva o script JS para usar GSAP e criar animações de 'mola' (spring). Ao passar o mouse (hover), os elementos devem se deslocar na direção oposta da sombra, simulando um clique físico real.
- Estrutura: Layout estilo 'Service Grid' ou 'Feature List', com ícones Lucide grandes, sempre dentro de containers com bordas pretas.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Bento Grid + Glassmorphism",
    description: "Organização modular inspirada na Apple com efeitos de vidro, desfoque e profundidade. Layout assimétrico e moderno.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estrutura Bento Grid: Utilize um layout grid de 4 ou 6 colunas com auto-rows. Os cards devem ter tamanhos variados (col-span-1, col-span-2, row-span-2) para criar um ritmo visual assimétrico e moderno.
- Estética Glassmorphism: Aplique backdrop-blur-xl e fundos semi-transparentes (bg-white/5 ou bg-white/10). O segredo está na borda: use uma borda fina de 1px com transparência (border-white/20) para simular a quina de um vidro lapidado.
- Profundidade Visual: Use camadas de sombras muito suaves e amplas (shadow-[0_20px_50px_rgba(0,0,0,0.3)]). Os cards devem parecer flutuar sobre o fundo.
- Liquid Background Animado: Crie um fundo escuro profundo (bg-[#0a0a0c]) com pelo menos dois 'blobs' de gradiente orgânico (um ciano e um violeta) que se movam lentamente usando animate-pulse ou Keyframes CSS personalizados com blur(100px).
- Tipografia e Ícones: Use a fonte 'Plus Jakarta Sans' via Google Fonts. Os títulos devem ser font-bold e os ícones Lucide devem estar dentro de círculos ou quadrados de vidro com opacidade reduzida.
- Interatividade: Escreva o script JS para usar GSAP para uma animação de 'Stagger' (entrada em cascata) onde os cards aparecem um após o outro com um leve movimento de baixo para cima e escala.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Aurora UI + Minimalismo Orgânico",
    description: "Elegância etérea com fundos dinâmicos de gradiente suave e tipografia serifada premium.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Aurora: Crie um fundo dinâmico usando 3 ou 4 esferas de gradiente (blur-[120px]) com cores análogas (ex: Índigo, Violeta e fúcsia) que se movem lentamente em órbitas irregulares via CSS Keyframes. O fundo base deve ser um cinza quase preto (bg-[#050505]).
- Minimalismo Orgânico: Use tipografia sans-serif premium para títulos (Google Fonts 'Roboto' ou 'Inter') e sans-serif para corpo ('Inter'). Garanta um letter-spacing negativo nos títulos (tracking-tighter).
- Contraste de Superfície: O conteúdo principal deve flutuar em um container central com bg-white/[0.02] e backdrop-blur-3xl. As bordas devem ser quase invisíveis (border-white/5).
- Interatividade & Animações: Escreva o script JS para usar GSAP para um efeito de 'Reveal' suave no carregamento (opacity 0 para 1 com deslocamento de 20px no eixo Y). Adicione um cursor personalizado que reage ao passar sobre elementos clicáveis (escala e mudança de mix-blend-mode).
- Estrutura: Layout de 'Landing Page Hero' ultra-clean, com um CTA central minimalista e ícones Lucide com traço fino (stroke-width: 1px).

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Claymorphism + Soft 3D",
    description: "Interfaces táteis e amigáveis que parecem feitas de argila ou plástico macio, com cores pastéis.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Claymorphism: Os elementos devem parecer feitos de argila ou plástico macio. Utilize border-radius extremo (rounded-[3rem]) e uma combination de box-shadow externa suave com duas sombras internas (inset) — uma clara no topo esquerdo e uma escura no canto inferior direito — para criar volume 3D tátil.
- Paleta de Cores: Use tons pastéis "doces" (ex: Azul bebê #A5D8FF, Rosa chiclete #FFD6E8, Lilás #E5DBFF). O fundo deve ser um gradiente radial muito suave entre duas cores pastéis próximas.
- Profundidade e Camadas: Implemente o efeito de flutuação. Escreva o script JS para usar GSAP para criar uma animação de 'Floating' contínua (bobbing) nos elementos principais, fazendo-os subir e descer levemente em tempos diferentes.
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

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Retro-Futurista Clean: Combine o estilo noir tecnológico com elegância moderna. Utilize um fundo sólido ultra-escuro (bg-[#020205]) com uma grade de perspectiva (CSS grid floor) no rodapé que desaparece no horizonte com mask-image linear-gradient.
- Neon Refinado: Evite o excesso de brilho. Use cores neon (Ciano #00f3ff e Magenta #ff00ff) apenas como luzes de contorno (border com drop-shadow de 5px) e detalhes em pequenos LEDs indicadores.
- Tipografia Monospace & Display: Use a fonte 'Space Mono' para dados e labels, e 'Syncopate' ou 'Orbitron' via Google Fonts para títulos principais. Aplique um efeito sutil de 'flicker' (piscar) via CSS Keyframes em elementos de destaque.
- Interatividade & Efeitos de Vidro Negro: Utilize containers com bg-black/60 e backdrop-blur-lg. Ao passar o mouse, a borda neon do elemento deve aumentar de intensidade e o texto deve ganhar um efeito de 'glitch' controlado e rápido.
- Animações: Escreva o script JS para usar GSAP para criar uma linha de 'scanline' que percorre a tela verticalmente e animações de entrada estilo 'terminal boot' (texto surgindo caractere por caractere).
- Estrutura: Layout de 'Command Center' ou 'Tech Dashboard', com ícones Lucide estilizados em modo duotone usando as cores neon da paleta.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Skeuomorph Moderno (Neuomorphism 2.0)",
    description: "Realismo tátil minimalista com sombras duplas precisas e sofisticação monocromática.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Neuomorphism 2.0: Diferente da primeira versão, esta deve ser refinada. Utilize uma cor de base única para fundo e elementos (ex: Cinza Suave #E0E5EC ou Azul Gelo #E2E8F0). Crie volume usando sombras duplas precisas: uma sombra clara (white) no topo/esquerda e uma sombra escura (rgba(163,177,198,0.6)) na base/direita.
- Textura e Material: Adicione uma leve curvatura côncava ou convexa aos cards usando gradientes lineares quase imperceptíveis que seguem a direção da luz.
- Acentos de Cor: Escolha uma única cor de destaque vibrante (ex: Azul Elétrico ou Verde Esmeralda) apenas para estados ativos, indicadores de Toggle ou ícones principais, quebrando a monocromia.
- Tipografia: Use a fonte 'Inter' ou 'Satoshi' com pesos variados. Títulos devem ter baixo contraste de cor com o fundo para manter a estética minimalista, mas com font-bold para legibilidade.
- Interatividade & Micro-animações: Escreva o script JS para usar GSAP para animar a transição entre estados. Quando um botão for clicado, ele deve trocar as sombras externas por sombras internas (inset), simulando o movimento físico de ser pressionado para dentro do material.
- Estrutura: Layout de 'Smart Home Controller' ou 'Music Player', com botões circulares, sliders personalizados e ícones Lucide que parecem gravados na superfície.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Maximalismo Tipográfico + Dark Mode",
    description: "Impacto visual extremo através de fontes gigantes, alto contraste e composições dinâmicas.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Maximalista: O texto deve ser o elemento estrutural. Utilize fontes 'Display' de impacto (Google Fonts 'Syne' ou 'Bricolage Grotesque'). Títulos principais devem ser gigantes (text-7xl ou text-8xl), com letter-spacing extremamente reduzido (tracking-tighter) e pesos variando entre font-black e font-thin.
- Dark Mode de Alto Contraste: Fundo preto absoluto (bg-[#000000]) com texto em branco puro (text-white). Intercale frases com o efeito text-transparent e -webkit-text-stroke: 1px white para criar camadas de profundidade visual apenas com glifos.
- Composição Dinâmica: Quebre o alinhamento padrão. Use textos rotacionados (-rotate-90), textos que se repetem em faixas horizontais (estilo marquee) e sobreposições ousadas onde o texto passa por trás ou pela frente de ícones e botões.
- Animações de Scroll & Reveal: Escreva o script JS para usar GSAP e ScrollTrigger para criar animações de texto que deslizam de direções opostas conforme o usuário rola a página. Adicione um efeito de 'Staggered Letter Reveal' no carregamento inicial.
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

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Grainy (Ruído): Aplique um overlay de textura de ruído analógico em toda a página. Use um filtro de ruído SVG feTurbulence dentro de um rect absoluto com opacidade baixa (opacity-20) e pointer-events-none. O visual deve remeter a papel impresso ou fotografia de grão fino.
- Paleta Monocromática Sofisticada: Use uma escala rigorosa de cinzas e pretos, fugindo do branco puro. Fundo em cinza médio-quente (bg-[#1a1a1a]) e elementos em tons contrastantes. Utilize mix-blend-mode (como difference ou overlay) para criar interações visuais ricas entre o texto e o fundo.
- Minimalismo Editorial: Use tipografia serifada de alta classe (Google Fonts 'Cormorant Garamond' ou 'Fraunces') para corpo de texto e uma sans-serif geométrica ('Inter') para metadados. Mantenha grandes margens e muito respiro (whitespace).
- Profundidade Cinematográfica: Utilize imagens ou placeholders com filtros grayscale(100%) e contrast(120%). As transições entre seções devem ser suaves, simulando um 'fade out' de cinema.
- Interatividade & Animações: Escreva o script JS para usar GSAP para criar um efeito de 'Lens Blur' ou 'Focus In' (o conteúdo começa desfocado e ganha nitidez ao entrar no viewport). O cursor deve ser um círculo simples que inverte as cores do que está por baixo.
- Estrutura: Layout estilo 'Luxury Lookbook' ou 'Architecture Portfolio', com grid ortogonal e ícones Lucide com stroke-width: 0.75px para máxima elegância.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Bauhaus Modernizado",
    description: "Geometria pura, funcionalismo histórico e paleta primária sobre fundo papel.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Bauhaus Contemporânea: Baseie o design em formas geométricas puras (círculos, quadrados e triângulos perfeitos). Utilize um grid ortogonal rigoroso com divisórias sólidas de 1px (border-slate-900/10).
- Paleta Primária Sofisticada: Use a tríade clássica (Amarelo #F4D03F, Vermelho #E74C3C, Azul #2E86C1), mas aplicadas sobre um fundo 'Papel' (bg-[#FDFCF5]) para evitar um visual infantil. Use o preto (#1A1A1A) apenas para tipografia e formas estruturais.
- Assimetria Equilibrada: Posicione elementos de forma assimétrica, mas mantendo o equilíbrio de pesos visuais. Use flex e grid do Tailwind para criar composições onde o texto e as formas se interceptam.
- Tipografia Funcional: Use exclusivamente fontes sem serifa geométricas (Google Fonts 'Archivio' ou 'Montserrat'). Títulos devem ser em caixa alta (uppercase) com font-bold e alinhamentos variados (esquerda e direita alternados).
- Animações Construtivistas: Escreva o script JS para usar GSAP para animar a montagem da página: formas geométricas devem deslizar de fora da tela e se encaixar em suas posições como um quebra-cabeça técnico. Adicione rotações de 90° ou 180° em ícones Lucide no hover.
- Estrutura: Layout de 'Design Studio Concept' ou 'Portfolio de Engenharia', com seções numeradas (01, 02, 03) em fontes grandes e ícones Lucide simplificados.

Restrições Técnicas:
NÃO inclua cabeçalhos/rodapés externos. O arquivo deve ser 100% auto-contido. Retorne APENAS o código HTML completo, sem blocos de código markdown (html).
As páginas interativas criadas NÃO terão botões, ícones no estilo href que precisam ser clicados para levar para algum lugar, NÃO terão vídeos nem imagens.`
  },
  {
    title: "Holographic / Iridescent Design",
    description: "Visual Web3 futurista com refração de luz, gradientes complexos e efeitos 3D de inclinação.",
    content: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

OBRIGATÓRIO INCLUIR NO <head> OU ANTES DO fechamento do <body>:
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

Diretrizes de Design & Sofisticação:
- Estética Holográfica: Crie superfícies que simulem a refração de luz metálica. Utilize gradientes lineares e radiais complexos com múltiplos stops de cor (azul ciano, rosa choque, lavanda e verde limão). Aplique um efeito de 'shimmer' (brilho móvel) usando background-size: 200% e uma animação infinita de deslocamento de background.
- Refração e Brilho: Use containers com bg-white/10 e um backdrop-blur-2xl. Adicione uma borda iridescente fina usando border-image-source com um gradiente colorido. Aplique um drop-shadow colorido que mude de matiz (hue-rotate) continuamente.
- Profundidade Espacial: O fundo deve ser um 'Dark Space' profundo (bg-[#030308]) para que as superfícies holográficas saltem aos olhos. Use pequenas partículas ou pontos de luz sutis flutuando no fundo.
- Tipografia Futurista: Use a fonte 'Outfit' ou 'Space Grotesk' via Google Fonts. Títulos devem ter um leve efeito de brilho externo (text-shadow) e cores de gradiente que acompanham a paleta holográfica.
- Interatividade & Animações: Escreva o script JS para usar GSAP para criar um efeito de 'Tilt 3D' baseado no movimento do mouse: os cards devem rotacionar levemente e o gradiente interno deve se deslocar conforme o cursor se move, simulando a mudança de reflexo da luz.
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

const LIBRARY_CSS = `/* Estilos Base Interactive Builder - Premium Liquid Glass */
:root {
  --primary-blue: #0f172a;
  --primary-gold: #f3c677;
  --bg-dark: #010409;
  --bg-card: rgba(255, 255, 255, 0.03);
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-dark);
  color: #f1f5f9;
  -webkit-font-smoothing: antialiased;
}

.heading-display {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #fff 0%, var(--primary-gold) 50%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-serif {
  font-family: 'Playfair Display', serif;
  font-style: italic;
}

.card {
  background-color: var(--bg-card);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  padding: 2.5rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.card:hover {
  border-color: rgba(243, 198, 119, 0.3);
  box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(243, 198, 119, 0.1);
  transform: translateY(-5px);
}

.btn-primary {
  border: 1px solid var(--primary-gold);
  color: var(--primary-gold);
  background: transparent;
  padding: 0.8rem 2rem;
  border-radius: 9999px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  background: var(--primary-gold);
  color: #010409;
  box-shadow: 0 0 30px rgba(243, 198, 119, 0.4);
}

.text-gold {
  color: var(--primary-gold);
  filter: drop-shadow(0 0 5px rgba(243, 198, 119, 0.2));
}

.gradient-text {
  background: linear-gradient(to right, #fff, var(--primary-gold));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}`;

// --- Components ---

const HeroSection = ({ title, subtitle, colors }: { title: string, subtitle: string, colors: BrandConfig }) => (
  <section className="text-center mb-24 animate-fade-in py-16">
    <div
      className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 glass-card border-white/20"
      style={{ color: colors.primaryGold }}
    >
      <Sparkles size={14} /> Hub Conexão Digital Elite v1.5
    </div>
    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none font-display">
      {title}
    </h1>
    <p className="text-stone-400 max-w-3xl mx-auto text-lg md:text-2xl leading-relaxed font-light">
      {subtitle}
    </p>
  </section>
);

const GridSection = ({ title, items, colors }: { title?: string, items: any[], colors: BrandConfig }) => (
  <div className="mb-24">
    {title && <h3 className="text-3xl font-bold mb-12 text-center text-stone-200 tracking-tight">{title}</h3>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items?.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
          className="glass-card-dark rounded-none p-10 border-l-4 group transition-all duration-500"
          style={{ borderLeftColor: item.color === 'gold' ? colors.primaryGold : colors.primaryBlue }}
        >
          <div
            className="w-16 h-16 rounded-none flex items-center justify-center mb-8 shadow-2xl transition-transform group-hover:scale-110 text-white border border-white/10"
            style={{ backgroundColor: item.color === 'gold' ? colors.primaryGold : item.color === 'blue' ? colors.primaryBlue : 'transparent' }}
          >
            {item.icon === 'zap' && <Zap size={28} />}
            {item.icon === 'shield-check' && <ShieldCheck size={28} />}
            {item.icon === 'activity' && <Activity size={28} />}
            {item.icon === 'layers' && <Layers size={28} />}
            {item.icon === 'info' && <Info size={28} />}
            {!item.icon && <ChevronRight size={28} />}
          </div>
          <h4 className="text-2xl font-bold mb-4 text-white font-mono tracking-tight">{item.title}</h4>
          <p className="text-base text-stone-400 leading-relaxed font-light">{item.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const ComparisonSection = ({ title, headers, rows, colors }: { title?: string, headers: string[], rows: string[][], colors: BrandConfig }) => (
  <div className="mb-24">
    {title && <h3 className="text-3xl font-bold mb-12 text-center text-stone-200 tracking-tight">{title}</h3>}
    <div className="glass-card-dark rounded-none border border-white/10 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-stone-500 uppercase tracking-[0.4em] border-b border-white/10 bg-black/40">
              {headers?.map((h, i) => (
                <th key={i} className="px-10 py-8" style={{ color: i > 0 && headers.length > 2 && i === headers.length - 1 ? colors.primaryGold : undefined }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows?.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                {row?.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-10 py-8 text-base ${j === 0 ? 'font-bold text-stone-200 font-mono' : 'text-stone-400 font-light'}`}
                    style={{
                      color: j > 0 && headers.length > 2 && j === headers.length - 1 ? colors.primaryGold : undefined,
                      backgroundColor: j > 0 && headers.length > 2 && j === headers.length - 1 ? `${colors.primaryGold}05` : undefined,
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
    className="rounded-none overflow-hidden text-white mb-24 glass-card-dark border-white/10 shadow-2xl"
  >
    <div className="flex flex-col lg:flex-row">
      <div className="p-12 lg:p-20 lg:w-3/5">
        <span
          className="font-bold text-[11px] uppercase tracking-[0.5em] mb-8 block text-stone-500"
        >
          Destaque Técnico Elite
        </span>
        <h3 className="text-4xl md:text-5xl font-black mb-10 leading-tight text-white font-mono tracking-tighter">{title}</h3>
        <p className="text-stone-400 text-lg md:text-xl leading-relaxed font-light">{text}</p>
      </div>
      <div
        className="lg:w-2/5 flex flex-col items-center justify-center p-20 text-center relative overflow-hidden"
        style={{ backgroundColor: accent === 'gold' ? `${colors.primaryGold}20` : `${colors.primaryBlue}20` }}
      >
        <div className="absolute inset-0 liquid-gradient opacity-10"></div>
        <div className="relative z-10">
          <ShieldCheck size={80} className="mb-6 mx-auto opacity-50" style={{ color: colors.primaryGold }} />
          <div className="text-2xl font-black uppercase tracking-[0.3em] text-white">Hub Elite</div>
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
    primaryBlue: '#1C1917',
    primaryGold: '#CA8A04',
    fontFamily: 'Inter',
    description: 'Plataforma multisetorial de geração de materiais de elite.',
    mainRole: 'Você é um Consultor de Elite e Diretor de Arte focado em soluções premium para o mercado de implantodontia.',
    audienceGuidelines: 'Proprietários de clínicas de alto padrão, médicos implantodontistas e dentistas que buscam tecnologia de ponta.',
    targetAudienceFoco: 'Tecnologia, Precisão, Autoridade e Luxo Técnico.',
    targetAudienceTom: 'Altamente profissional, sofisticado, sóbrio e voltado para resultados clínicos.',
    targetAudienceRegra: 'Nunca use termos infantis. Trate o paciente como um investidor em saúde.',
    goldenRule: 'Mantenha o padrão Conexão Digital - A excelência não é negociável.',
    systemPrompt: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e Lucide Icons).

DIRETRIZES DE DESIGN & ESTRUTURA (ESTILO LIQUID GLASS):
- ESTRUTURA: Seções py-32 com margens técnicas.
- HERO: Tipografia massiva text-8xl, font-black, tracking-tighter.
- CARDS: Estilo Glassmorphism (bg-white/5, backdrop-blur-xl).
- CORES: Fundo #0C0A09, acento Ouro #CA8A04.
- TIPOGRAFIA: Fira Sans e Fira Code.`
  });

  const [brandPresets, setBrandPresets] = React.useState<BrandPreset[]>([]);
  const [activeBrandId, setActiveBrandId] = React.useState<string | null>(null);
  const [isExtractingColors, setIsExtractingColors] = React.useState(false);
  const [showNewBrandModal, setShowNewBrandModal] = React.useState(false);
  const [newBrandName, setNewBrandName] = React.useState('');
  const [newBrandPrimaryColor, setNewBrandPrimaryColor] = React.useState('#004a8e');
  const [newBrandSecondaryColor, setNewBrandSecondaryColor] = React.useState('#b38e5d');
  const [newBrandFontFamily, setNewBrandFontFamily] = React.useState('Inter');
  const [newBrandDescription, setNewBrandDescription] = React.useState('');

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
  const [markdownText, setMarkdownText] = useState<string>(`# Ecossistema Digital: Soluções Elite 2026

A arquitetura de sistemas do Hub Conexão foi redesenhada para escalabilidade extrema em múltiplos setores, unindo alta performance e estética Liquid Glass.

## Pilares da Plataforma

- **Aura Engine**: Motor de inteligência generativa para automação de design e copy.
- **Titanium Cloud**: Infraestrutura redundante com 99.9% de uptime garantido.
- **Glass Core**: Sistema de design proprietário focado em clareza técnica e luxo visual.

## Performance Comparativa

| Métrica | Legado | Hub 2026 | Impacto |
| :--- | :--- | :--- | :--- |
| Renderização | 1.8s | 0.4s | +75% Vel. |
| Conversão | 4.2% | 12.8% | +3x ROI |
| Retenção | Baixa | Alta | Fidelidade |

O Futuro é agora. O Hub Conexão é a ferramenta definitiva para quem não aceita o comum.`);

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [selectedApi, setSelectedApi] = useState<keyof ApiKeys>('gemini');
  const [selectedLang, setSelectedLang] = useState<'pt' | 'en' | 'es' | 'all'>('pt');
  const [filename, setFilename] = useState<string>('minha-pagina');
  const [filenameEn, setFilenameEn] = useState<string>('my-page');
  const [filenameEs, setFilenameEs] = useState<string>('mi-pagina');
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [materials, setMaterials] = useState<GeneratedMaterial[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [promptLibrary, setPromptLibrary] = useState<PromptLibraryEntry[]>([]);
  const [viewingMaterial, setViewingMaterial] = useState<GeneratedMaterial | null>(null);
  const [viewingTechSheet, setViewingTechSheet] = useState<GeneratedMaterial | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [editorTab, setEditorTab] = useState<'converter' | 'content' | 'style' | 'metadata'>('converter');
  const [suggestedMetadata, setSuggestedMetadata] = useState<SuggestedMetadata | null>(null);
  const [metadataLang, setMetadataLang] = useState<'pt' | 'en' | 'es'>('pt');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appAccentColor, setAppAccentColor] = useState<string>(() => localStorage.getItem('app_accent_color') || '#ca954e');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMaterialSelection = (id: string) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMaterials.length === materials.length) {
      setSelectedMaterials([]);
    } else {
      setSelectedMaterials(materials.map(m => m.id));
    }
  };

  const downloadSelectedAsZip = async () => {
    if (selectedMaterials.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("materiais_aura");

    selectedMaterials.forEach(id => {
      const material = materials.find(m => m.id === id);
      if (material) {
        // Ensure name is safe for file system
        const safeName = material.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        folder?.file(`${safeName}.html`, material.html);
      }
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `materiais_aura_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    const root = document.documentElement;
    root.style.setProperty('--accent-color', appAccentColor);
    localStorage.setItem('app_accent_color', appAccentColor);

    // Create a shadow color with opacity
    let shadowColor = appAccentColor;
    if (shadowColor.startsWith('#')) {
      if (shadowColor.length === 7) shadowColor += '33';
      else if (shadowColor.length === 9) shadowColor = shadowColor.substring(0, 7) + '33';
    } else {
      shadowColor = 'rgba(245, 158, 11, 0.2)'; // Fallback
    }
    root.style.setProperty('--accent-shadow', shadowColor);

    // Create a hover color
    root.style.setProperty('--accent-hover', appAccentColor + 'ee');
    // Dynamic Style for Scrollbars
    const styleId = 'aura-scrollbar-dynamic';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `
      *::-webkit-scrollbar-thumb { background-color: ${appAccentColor} !important; }
      *::-webkit-scrollbar-thumb:hover { background-color: ${appAccentColor}ee !important; }
    `;

  }, [appAccentColor]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [loading]);

  useEffect(() => {
    if (session) {
      loadUserData();
      setShowLoginModal(false);
    } else {
      setMaterials([]);
      setApiKeys({ gemini: '', openai: '', claude: '', groq: '' });
      setSupabaseConfig({ url: '', anonKey: '' });
      setBrandConfig({
        primaryBlue: '#001775ff',
        primaryGold: '#CA8A04',
        description: 'Hub Conexão Digital: Plataforma Elite de Automação e Design Multisetorial.',
        fontFamily: 'Inter',
        systemPrompt: `Gere um ÚNICO arquivo HTML autônomo e responsivo (HTML5, Tailwind CSS via CDN e bibliotecas modernas).
        
ESTILO LIQUID GLASS (DARK PREMIUN):
  - PALETA: Fundo stone-950, acentos accent/gold, texto stone-100.
  - COMPONENTES: Use .glass-card e .glass-card-dark (backdrop-blur-xl, background com baixa opacidade stone-900/40, bordas brancas/5).
  - BORDAS: Cantos sharp (rounded-none) para estética técnica elite.
  - GRADIENTES: Use .liquid-gradient para fundos de destaque.
  - ESTRUTURA: Landing page com seções clean, tipografia Mono para dados técnicos (Fira Code) e Sans para leitura (Fira Sans).
  - ANIMAÇÕES: GSAP para transições fluidas e micro-interações técnicas.`
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
      // Load Brand Presets (new system)
      let presetsLoaded = false;
      try {
        const { data: presets } = await supabase
          .from('presets_branding')
          .select('*')
          .order('created_at', { ascending: true });

        if (presets && presets.length > 0) {
          setBrandPresets(presets as BrandPreset[]);
          const active = (presets as BrandPreset[]).find(p => p.is_active) || (presets as BrandPreset[])[0];
          setActiveBrandId(active.id);
          setBrandConfig(prev => ({
            ...prev,
            id: active.id,
            name: active.name,
            primaryBlue: active.primary_color || prev.primaryBlue,
            primaryGold: active.secondary_color || prev.primaryGold,
            fontFamily: active.font_family || 'Inter',
            description: active.description || '',
          }));
          presetsLoaded = true;
        }
      } catch (_) { }

      // Try legacy brand_presets if presets_branding is empty
      if (!presetsLoaded) {
        try {
          const { data: legacyPresets } = await supabase
            .from('brand_presets')
            .select('*')
            .order('created_at', { ascending: true });

          if (legacyPresets && legacyPresets.length > 0) {
            setBrandPresets(legacyPresets as BrandPreset[]);
            const active = (legacyPresets as BrandPreset[]).find(p => p.is_active) || (legacyPresets as BrandPreset[])[0];
            setActiveBrandId(active.id);
            setBrandConfig(prev => ({
              ...prev,
              id: active.id,
              name: active.name,
              primaryBlue: active.primary_color,
              primaryGold: active.secondary_color,
              fontFamily: active.font_family,
              description: active.description || '',
            }));
            presetsLoaded = true;
          }
        } catch (_) { }
      }

      // Fallback: Load legacy branding_configs
      if (!presetsLoaded) {
        const { data: branding, error: bError } = await supabase
          .from('branding_configs')
          .select('*')
          .single();

        if (branding && !bError) {
          setBrandConfig(prev => ({
            ...prev,
            primaryBlue: branding.primary_blue || prev.primaryBlue,
            primaryGold: branding.primary_gold || prev.primaryGold,
            description: branding.description || prev.description,
            pdfName: branding.pdf_name,
            systemPrompt: branding.system_prompt || prev.systemPrompt,
            fontFamily: 'Inter',
          }));

          setSupabaseConfig({
            url: branding.supabase_url || '',
            anonKey: branding.supabase_anon_key || ''
          });
        }
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

  // ---- BRAND PRESET CRUD ----

  const createBrandPreset = async () => {
    if (!supabase || !session || !newBrandName.trim()) return;
    try {
      // Deactivate existing
      await supabase.from('presets_branding').update({ is_active: false }).eq('user_id', session.user.id);
      const { data, error } = await supabase.from('presets_branding').insert({
        user_id: session.user.id,
        name: newBrandName.trim(),
        primary_color: newBrandPrimaryColor,
        secondary_color: newBrandSecondaryColor,
        font_family: newBrandFontFamily,
        description: newBrandDescription,
        is_active: true,
      }).select().single();

      if (error) throw error;
      const newPreset: BrandPreset = data;
      setBrandPresets(prev => [...prev, newPreset]);
      setActiveBrandId(newPreset.id);
      setBrandConfig(prev => ({
        ...prev,
        id: newPreset.id,
        name: newPreset.name,
        primaryBlue: newPreset.primary_color,
        primaryGold: newPreset.secondary_color,
        fontFamily: newPreset.font_family,
        description: newPreset.description || '',
      }));
      setShowNewBrandModal(false);

      // Reset fields
      setNewBrandName('');
      setNewBrandPrimaryColor('#004a8e');
      setNewBrandSecondaryColor('#b38e5d');
      setNewBrandFontFamily('Inter');
      setNewBrandDescription('');
    } catch (err: any) { alert('Erro ao criar preset: ' + err.message); }
  };

  const switchBrandPreset = async (presetId: string) => {
    const preset = brandPresets.find(p => p.id === presetId);
    if (!preset) return;
    setBrandPresets(prev => prev.map(p => ({ ...p, is_active: p.id === presetId })));
    setActiveBrandId(presetId);
    setBrandConfig(prev => ({
      ...prev,
      id: preset.id,
      name: preset.name,
      primaryBlue: preset.primary_color,
      primaryGold: preset.secondary_color,
      fontFamily: preset.font_family,
      description: preset.description || '',
      mainRole: preset.main_role || '',
      audienceGuidelines: preset.audience_guidelines || '',
      targetAudienceFoco: preset.target_foco || '',
      targetAudienceTom: preset.target_tom || '',
      targetAudienceRegra: preset.target_regra || '',
      goldenRule: preset.golden_rule || '',
    }));
    if (supabase && session) {
      await supabase.from('presets_branding').update({ is_active: false }).eq('user_id', session.user.id);
      await supabase.from('presets_branding').update({ is_active: true }).eq('id', presetId);
    }
  };

  const deleteBrandPreset = async (presetId: string) => {
    if (!supabase || !session) return;
    if (brandPresets.length <= 1) { alert('Você precisa ter pelo menos um preset de branding.'); return; }
    try {
      const { error } = await supabase.from('presets_branding').delete().eq('id', presetId);
      if (error) throw error;
      const remaining = brandPresets.filter(p => p.id !== presetId);
      setBrandPresets(remaining);
      if (activeBrandId === presetId && remaining.length > 0) {
        await switchBrandPreset(remaining[0].id);
      }
    } catch (err: any) { alert('Erro ao excluir preset: ' + err.message); }
  };

  const callApiProvider = async (provider: string, apiKeys: any, systemPrompt: string, userPrompt: string, isJson: boolean, fileBase64?: string, fileMimeType?: string) => {
    const apiKey = apiKeys[provider] || (provider === 'gemini' ? process.env.GEMINI_API_KEY : '');
    if (!apiKey) throw new Error(`API Key para ${provider.toUpperCase()} não encontrada.`);

    if (provider === 'gemini') {
      const ai = new GoogleGenAI({ apiKey });
      const contents: any[] = [{ text: userPrompt }];
      if (fileBase64 && fileMimeType) {
        contents.push({ inlineData: { mimeType: fileMimeType, data: fileBase64 } });
      }
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: contents },
        config: {
          systemInstruction: systemPrompt,
          ...(isJson ? { responseMimeType: "application/json" } : {})
        }
      });
      if (!response.text) throw new Error("Sem resposta do modelo.");
      return response.text;
    } else if (provider === 'openai') {
      const messages: any[] = [{ role: "system", content: systemPrompt }];
      if (fileBase64 && fileMimeType?.startsWith('image/')) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: `data:${fileMimeType};base64,${fileBase64}` } }
          ]
        });
      } else {
        messages.push({ role: "user", content: userPrompt });
      }
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o",
          messages,
          ...(isJson ? { response_format: { type: "json_object" } } : {})
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices[0].message.content;
    } else if (provider === 'claude') {
      const content: any[] = [{ type: "text", text: userPrompt }];
      if (fileBase64 && fileMimeType) {
        if (fileMimeType === 'application/pdf') {
          content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: fileBase64 } });
        } else if (fileMimeType.startsWith('image/')) {
          content.push({ type: "image", source: { type: "base64", media_type: fileMimeType, data: fileBase64 } });
        }
      }
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.content[0].text;
    } else if (provider === 'groq') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          ...(isJson ? { response_format: { type: "json_object" } } : {})
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices[0].message.content;
    }
    throw new Error(`Provedor ${provider} não suportado.`);
  };

  const extractColorsFromBranding = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const provider = selectedApi;
    const apiKey = apiKeys[provider] || (provider === 'gemini' ? process.env.GEMINI_API_KEY : '');

    if (!file || !apiKey) { alert(`Configure a chave da API ${provider.toUpperCase()} primeiro.`); return; }
    setIsExtractingColors(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        const mimeType = file.type;
        const systemPrompt = "Você é um especialista em design de marca. Responda APENAS em JSON estruturado.";
        const userPrompt = 'Analise esta imagem/documento e extraia: 1) A cor primária principal (hex), 2) A cor de destaque/secundária (hex), 3) Nome da marca (se visível), 4) Família tipográfica sugerida (apenas: Inter, Roboto, Montserrat, Poppins, Outfit, Raleway, Lato, Open Sans, Nunito, Lexend, Playfair Display ou DM Sans). Responda APENAS em JSON: {"primary":"#hex","secondary":"#hex","name":"string ou null","fontFamily":"FontName"}';

        try {
          const text = await callApiProvider(provider, apiKeys, systemPrompt, userPrompt, true, base64, mimeType);
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const extracted = JSON.parse(jsonMatch[0]);
            setBrandConfig(prev => ({
              ...prev,
              primaryBlue: extracted.primary || prev.primaryBlue,
              primaryGold: extracted.secondary || prev.primaryGold,
              fontFamily: extracted.fontFamily || prev.fontFamily,
              name: extracted.name || prev.name,
              pdfName: file.name,
              pdfBase64: base64,
            }));
            if (extracted.name && window.confirm(`Nome detectado: "${extracted.name}". Renomear este preset?`)) {
              setBrandConfig(prev => ({ ...prev, name: extracted.name }));
            }
          }
        } catch (apiError: any) {
          alert('Erro ao extrair cores: ' + apiError.message);
        }
        setIsExtractingColors(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert('Erro ao carregar arquivo: ' + err.message);
      setIsExtractingColors(false);
    }
  };

  const saveBranding = async () => {
    if (!session || !activeBrandId) { alert('Selecione ou crie um preset de branding primeiro.'); return; }
    setLoading(true);
    setLoadingMsg('Salvando branding no Supabase...');

    try {
      const { error } = await supabase
        .from('presets_branding')
        .update({
          name: brandConfig.name || 'Meu Branding',
          primary_color: brandConfig.primaryBlue,
          secondary_color: brandConfig.primaryGold,
          font_family: brandConfig.fontFamily || 'Inter',
          description: brandConfig.description || '',
          main_role: brandConfig.mainRole || '',
          audience_guidelines: brandConfig.audienceGuidelines || '',
          target_foco: brandConfig.targetAudienceFoco || '',
          target_tom: brandConfig.targetAudienceTom || '',
          target_regra: brandConfig.targetAudienceRegra || '',
          golden_rule: brandConfig.goldenRule || '',
        })
        .eq('id', activeBrandId);

      if (error) throw error;
      setBrandPresets(prev => prev.map(p => p.id === activeBrandId
        ? {
          ...p,
          name: brandConfig.name || p.name,
          primary_color: brandConfig.primaryBlue,
          secondary_color: brandConfig.primaryGold,
          font_family: brandConfig.fontFamily || 'Inter',
          description: brandConfig.description || '',
          main_role: brandConfig.mainRole || '',
          audience_guidelines: brandConfig.audienceGuidelines || '',
          target_foco: brandConfig.targetAudienceFoco || '',
          target_tom: brandConfig.targetAudienceTom || '',
          target_regra: brandConfig.targetAudienceRegra || '',
          golden_rule: brandConfig.goldenRule || '',
        }
        : p
      ));
      setTimeout(() => alert('Preset de branding salvo com sucesso!'), 300);
    } catch (error: any) {
      setTimeout(() => alert(`Erro ao salvar branding: ${error.message}`), 300);
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
      setSelectedMaterials(prev => prev.filter(id => id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error: any) {
      alert(`Erro ao excluir: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteSelectedMaterials = async () => {
    if (selectedMaterials.length === 0) return;

    if (!window.confirm(`Deseja excluir ${selectedMaterials.length} materiais selecionados? Esta ação é irreversível.`)) {
      return;
    }

    setLoading(true);
    setLoadingMsg('Expurgando Registros selecionados');

    try {
      if (session) {
        const { error } = await supabase
          .from('generated_materials')
          .delete()
          .in('id', selectedMaterials)
          .eq('user_id', session.user.id);

        if (error) throw error;
      }

      setMaterials(prev => prev.filter(m => !selectedMaterials.includes(m.id)));
      setSelectedMaterials([]);
    } catch (error: any) {
      alert(`Erro ao excluir em massa: ${error.message}`);
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
      const provider = selectedApi;
      const apiKey = apiKeys[provider] || (provider === 'gemini' ? process.env.GEMINI_API_KEY : '');
      if (!apiKey) throw new Error(`API Key para ${provider.toUpperCase()} não encontrada.`);

      setLoadingSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'completed' } : s.id === 'structure' ? { ...s, status: 'loading' } : s));

      const systemInstruction = "Você é um assistente especializado em estruturação de conteúdo técnico e estratégico em Markdown Elite.";
      let userPrompt = `Transforme o seguinte texto em um Markdown bem estruturado, com títulos, listas e tabelas se necessário:\n\n${rawText}`;

      let base64 = undefined;
      let mimeType = undefined;

      if (brandConfig.pdfBase64) {
        base64 = brandConfig.pdfBase64;
        mimeType = "application/pdf";
        userPrompt += "\n\nUse o PDF/documento de branding anexado como referência para o tom de voz e estrutura.";
      }

      try {
        const responseText = await callApiProvider(provider, apiKeys, systemInstruction, userPrompt, false, base64, mimeType);

        if (!responseText) throw new Error("Sem resposta do modelo.");

        setLoadingSteps(prev => prev.map(s => s.id === 'structure' ? { ...s, status: 'completed' } : s.id === 'clean' ? { ...s, status: 'loading' } : s));

        let text = responseText;
        // Limpar blocos de código markdown se o modelo retornar
        text = text.replace(/^```markdown\n?/, '').replace(/```$/, '').trim();

        setMarkdownText(text);
        setEditorTab('content');
        setView('editor');

        setLoadingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));

        // Autogerar metadados após conversão
        setTimeout(() => {
          generateMetadataSuggestions();
        }, 1000);
      } catch (apiError: any) {
        if (apiError.message?.includes('429') || apiError.message?.toLowerCase().includes('quota')) {
          throw new Error(`Limite de quota do ${provider.toUpperCase()} excedido. Por favor, configure sua própria API Key na aba 'Configurações' para continuar testando sem interrupções.`);
        }
        throw apiError;
      }
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
      const provider = selectedApi;
      const apiKey = apiKeys[provider] || (provider === 'gemini' ? process.env.GEMINI_API_KEY : '');
      if (!apiKey) throw new Error(`API Key para ${provider.toUpperCase()} não encontrada.`);

      setLoadingSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'completed' } : s.id === 'creative' ? { ...s, status: 'loading' } : s));

      try {
        const systemInstruction = "Você é um Diretor de SEO e Copywriting Estratégico com 20 anos de experiência em marketing digital de luxo e alta performance.";
        const userPrompt = `Você é um Diretor de SEO e Especialista em Branding de Elite. Sua missão é gerar metadados estratégicos (Título, Slug, Descrição e Tags) para uma página baseada estritamente no CONTEÚDO fornecido.

INFORMAÇÃO FUNDAMENTAL:
O assunto da página é definido ÚNICA E EXCLUSIVAMENTE pelo "CONTEÚDO MARKDOWN" abaixo. 
O "BRANDING" deve ser usado apenas para definir o TOM DE VOZ, ESTILO e SOFISTICAÇÃO da escrita.

REGRA CRÍTICA: JAMais mencione "Interactive Builder", "Aura AI", "Hub Conexão" ou qualquer termo relacionado à plataforma de geração nos metadados, a menos que o conteúdo Markdown trate explicitamente sobre esses sistemas.

CONTEÚDO MARKDOWN (FONTE PRIMÁRIA):
${markdownText}

BRANDING (DIRETRIZES DE ESTRATÉGIA E TOM DE VOZ):
Descrição: ${brandConfig.description}
Papel Principal (Persona): ${brandConfig.mainRole}
Audiência: ${brandConfig.audienceGuidelines}
Foco: ${brandConfig.targetAudienceFoco}
Tom: ${brandConfig.targetAudienceTom}
Regra de Ouro: ${brandConfig.goldenRule}

REGRAS DE OURO PARA OS METADADOS:
1. Protocolo_Título (title): Título magnético e profissional focado na solução descrita no Markdown (50-60 chars).
2. Aura_ID (Slug) (filename): URL amigável (slug) derivado do título em português. Use apenas minúsculas, hífens, sem acentos (ex: "tratamento-regenerativo-elite").
3. Heurística_Aura (Description) (description): Resumo persuasivo focado em cliques (CTR). Resuma os benefícios reais descritos no Markdown (Máx 160 chars).
4. Heurística_Tags (tags): Lista de pelo menos 10 palavras-chave semânticas relevantes ao nicho do Markdown.

Retorne INTEGRALMENTE em JSON válido na estrutura:
{
  "pt": {"title": "...", "filename": "...", "description": "...", "tags": ["tag1", "tag2", ...] },
  "en": {"title": "...", "filename": "...", "description": "...", "tags": ["tag1", "tag2", ...] },
  "es": {"title": "...", "filename": "...", "description": "...", "tags": ["tag1", "tag2", ...] }
}`;

        const responseText = await callApiProvider(provider, apiKeys, systemInstruction, userPrompt, true);

        setLoadingSteps(prev => prev.map(s => s.id === 'creative' ? { ...s, status: 'completed' } : s.id === 'translate' ? { ...s, status: 'loading' } : s));

        if (!responseText) throw new Error("Sem resposta do modelo.");
        let cleanedText = responseText;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleanedText = jsonMatch[0];

        const data = JSON.parse(cleanedText);
        setSuggestedMetadata(data);

        // Preencher automaticamente os nomes dos arquivos
        if (data.pt?.filename) setFilename(data.pt.filename);
        if (data.en?.filename) setFilenameEn(data.en.filename);
        if (data.es?.filename) setFilenameEs(data.es.filename);

        setEditorTab('metadata');

        setLoadingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      } catch (apiError: any) {
        if (apiError.message?.includes('429') || apiError.message?.toLowerCase().includes('quota')) {
          throw new Error(`Limite de quota do ${provider.toUpperCase()} excedido. Por favor, aguarde um momento ou configure sua própria API Key na aba 'Configurações'.`);
        }
        throw apiError;
      }
    } catch (error: any) {
      alert(`Erro ao gerar metadados: ${error.message}`);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const generateSinglePage = async (lang: 'pt' | 'en' | 'es', customFilename: string, templateHtml?: string) => {
    const apiKey = apiKeys[selectedApi] || (selectedApi === 'gemini' ? process.env.GEMINI_API_KEY : '');
    if (!apiKey) throw new Error(`API Key para ${selectedApi.toUpperCase()} não encontrada na aba API Keys.`);

    setLoadingSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'completed' } : s.id === 'style' ? { ...s, status: 'loading' } : s));

    const langNames = { pt: 'Português (Brasil)', en: 'Inglês (EN-US)', es: 'Espanhol (ES-ES)' };
    const currentMetadata = suggestedMetadata ? suggestedMetadata[lang] : null;

    let promptText = "";

    if (templateHtml) {
      promptText = `
        VOCÊ DEVE ATUAR COMO UM TRADUTOR TÉCNICO DE ELITE.
        
        OBJETIVO: Traduzir o conteúdo de um HTML Master para o idioma ${langNames[lang]}.
        
        REGRAS DE OURO (NÃO NEGOCIÁVEIS):
        1. MANTENHA A ESTRUTURA HTML EXATAMENTE IGUAL. Não adicione, remova ou altere nenhuma tag, classe CSS, ID ou script.
        2. TRADUZA APENAS OS TEXTOS VISÍVEIS (conteúdo de tags, placeholders, títulos, etc).
        3. MANTENHA A CONSISTÊNCIA: Se um ícone Lucide foi usado no Master, ele deve permanecer exatamente o mesmo.
        4. NÃO ADICIONE LINKS OU BOTÕES: Se o Master não tem links (e não deve ter), a tradução também não deve ter.
        5. OUTPUT: Retorne APENAS o código HTML completo traduzido.
        
        HTML MASTER PARA TRADUÇÃO:
        ${templateHtml}
      `;
    } else {
      promptText = `
        Markdown de entrada:
        ${markdownText}

        METADADOS DA PÁGINA (Use no <head> e no conteúdo se apropriado):
        Título: ${currentMetadata?.title || 'Landing Page'}
        Descrição: ${currentMetadata?.description || ''}
        Tags: ${currentMetadata?.tags?.join(', ') || ''}
        Slug/Arquivo: ${customFilename}

        Diretrizes de Branding & Estratégia:
        Core: ${brandConfig.description}
        Persona: ${brandConfig.mainRole}
        Audiência: ${brandConfig.audienceGuidelines}
        Foco de Audiência: ${brandConfig.targetAudienceFoco}
        Tom de Audiência: ${brandConfig.targetAudienceTom}
        Regra de Ouro Inegociável: ${brandConfig.goldenRule}
        Cores: Primária (${brandConfig.primaryBlue}), Destaque (${brandConfig.primaryGold})
        Tipografia Base: ${brandConfig.fontFamily}

        IDIOMA DA PÁGINA: ${langNames[lang]}
        
        INSTRUÇÃO DE GERAÇÃO:
        ${brandConfig.systemPrompt}

        MUITO IMPORTANTE: O seu output DEVE ser EXCLUSIVAMENTE o código HTML completo da página.
        Não inclua NENHUM texto antes ou depois do código HTML.
        Não responda com o nome do arquivo, apenas o código.
    `;
    }

    const systemInstruction = `Você é um Diretor de Arte e Desenvolvedor Front-end de elite, especializado em Landing Pages de LUXO para o mercado médico/odontológico.

    SUA MISSÃO:
    Transformar o conteúdo fornecido em uma EXPERIÊNCIA DIGITAL de altíssimo padrão. Não gere apenas um site; gere uma peça de design que transmita autoridade, tecnologia e sofisticação.

    REGRAS CRÍTICAS DE NAVEGAÇÃO:
    - É TERMINANTEMENTE PROIBIDO o uso de tags <a> (links) ou <button> (botões).
      - A página deve ser puramente contemplativa e informativa.
      - Para chamadas de ação (CTAs), use elementos visuais como <div> ou <span> estilizados com bordas douradas, gradientes e sombras para atrair o olhar, mas eles NÃO devem ser clicáveis nem levar a lugar nenhum.
        - Não use atributos 'href', 'onclick' ou qualquer forma de navegação.

        DESIGN SYSTEM OBRIGATÓRIO:
        1. PALETA DE CORES:
        - Primária: ${brandConfig.primaryBlue}
        - Secundária/Acento: ${brandConfig.primaryGold}
        - Backgrounds: Use tonalidades que harmonizem com o branding (ex: Off-white #FDFDFD ou Slate-950 #020617) e variações de Glassmorphism.
        2. TIPOGRAFIA:
        - Use a família principal: '${brandConfig.fontFamily}', sans-serif.
        - Títulos: Peso 700/900, tracking-tighter.
        - Corpo: Peso 300/400.
        3. COMPONENTES DE IMPACTO:
        - HERO: Layout 50/50 ou Centralizado com tipografia massiva (text-7xl+), gradientes sutis e animação de entrada.
        - BENTO GRIDS: Use grids assimétricos para seções de benefícios.
        - GLASSMORPHISM: Cards com 'backdrop-blur-xl' e bordas semi-transparentes 'border-white/10'.
        - RAIL TEXT: Use textos verticais decorativos nas laterais das seções.
        - DIVIDERS: Use linhas finas (1px) com opacidade baixa.

        REGRAS TÉCNICAS:
        1. ANIMAÇÕES (GSAP): Você DEVE incluir a CDN do GSAP e ScrollTrigger. Adicione scripts para animar seções conforme o scroll (fade-in, slide-up, stagger).
        - IMPORTANTE: Garanta que os elementos fiquem visíveis (opacity: 1) caso o JS falhe ou o scroll passe rápido demais. Use 'gsap.set' para estados iniciais e 'gsap.to' com ScrollTrigger.
        2. ÍCONES: Use Lucide React (via CDN). Escolha ícones que remetam a tecnologia e precisão.
        3. RESPONSIVIDADE: Mobile-first impecável.
        4. SEO: Injetar título, descrição e tags nos locais corretos do <head>.
        5. RODAPÉ OBRIGATÓRIO (REDE DE PROTEÇÃO): Toda página DEVE terminar com o seguinte rodapé exatamente como escrito: "© 2026 Conexão Digital Implant. Todos os direitos reservados. Tecnologia a serviço da implantodontia desde 1990".

          ESTRUTURA DE SEÇÕES:
- Hero -> Prova Social -> Benefícios (Bento Grid) -> Detalhes Técnicos (Acordeões ou Tabs) -> Tabela de Comparação (Luxury Style) -> CTA Final (Visual, não clicável) -> Rodapé Fixo.

          NUNCA gere um layout linear ou genérico. Use a Cor Secundária/Acento para elementos de destaque e bordas finas.`;

    let html = '';

    if (selectedApi === 'gemini') {
      const ai = new GoogleGenAI({ apiKey });
      const parts: any[] = [{ text: promptText }];


      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: { parts },
          config: { systemInstruction }
        });
        html = response.text || '';
      } catch (apiError: any) {
        if (apiError.message?.includes('429') || apiError.message?.toLowerCase().includes('quota')) {
          throw new Error("Limite de quota do Gemini excedido. Por favor, aguarde um momento ou configure sua própria API Key na aba 'Configurações'.");
        }
        throw apiError;
      }
    } else if (selectedApi === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: promptText }
          ]
        })
      });
      const data = await response.json();
      html = data.choices[0].message.content;
    } else if (selectedApi === 'claude') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 4096,
          system: systemInstruction,
          messages: [{ role: "user", content: promptText }]
        })
      });
      const data = await response.json();
      html = data.content[0].text;
    } else if (selectedApi === 'groq') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: promptText }
          ]
        })
      });
      const data = await response.json();
      html = data.choices[0].message.content;
    }

    setLoadingSteps(prev => prev.map(s => s.id === 'style' ? { ...s, status: 'completed' } : s.id === 'branding' ? { ...s, status: 'loading' } : s));

    let cleanedHtml = html;
    const htmlMatch = html.match(/```html\s*([\s\S]*?)\s*```/i);
    if (htmlMatch) {
      cleanedHtml = htmlMatch[1];
    } else {
      cleanedHtml = html.replace(/^```html/i, '').replace(/```$/i, '').trim();
    }

    setLoadingSteps(prev => prev.map(s => s.id === 'generate' ? { ...s, status: 'completed' } : s.id === 'finalize' ? { ...s, status: 'loading' } : s));

    const selectedPrompt = promptLibrary.find(p => p.id === selectedPromptId);
    const currentStyle = selectedPrompt?.title || 'Aura Base';

    if (session) {
      const materialMetadata: MetadataItem = {
        ...(suggestedMetadata ? suggestedMetadata[lang] : { title: customFilename, filename: customFilename, description: '', tags: [] }),
        style: currentStyle,
        colors: {
          primary: brandConfig.primaryBlue,
          secondary: brandConfig.primaryGold
        },
        fontFamily: brandConfig.fontFamily,
        model: selectedApi === 'gemini' ? 'Google Gemini 2.5 Flash' :
          selectedApi === 'openai' ? 'OpenAI GPT-4o' :
            selectedApi === 'claude' ? 'Claude 3.5 Sonnet' : 'Groq Llama 3'
      };

      const { data, error } = await supabase
        .from('generated_materials')
        .insert({
          user_id: session.user.id,
          name: customFilename,
          html_content: cleanedHtml,
          metadata: materialMetadata
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
      const materialMetadata: MetadataItem = {
        ...(suggestedMetadata ? suggestedMetadata[lang] : { title: customFilename, filename: customFilename, description: '', tags: [] }),
        style: currentStyle,
        colors: {
          primary: brandConfig.primaryBlue,
          secondary: brandConfig.primaryGold
        },
        fontFamily: brandConfig.fontFamily,
        model: selectedApi === 'gemini' ? 'Google Gemini 2.5 Flash' :
          selectedApi === 'openai' ? 'OpenAI GPT-4o' :
            selectedApi === 'claude' ? 'Claude 3.5 Sonnet' : 'Groq Llama 3'
      };

      const newMaterial: GeneratedMaterial = {
        id: Math.random().toString(36).substr(2, 9),
        name: customFilename,
        html: cleanedHtml,
        timestamp: Date.now(),
        metadata: materialMetadata
      };
      setMaterials(prev => [newMaterial, ...prev]);
    }

    setLoadingSteps(prev => prev.map(s => s.id === 'finalize' ? { ...s, status: 'completed' } : s));

    return cleanedHtml;
  };

  const generatePage = async () => {
    if (!markdownText.trim()) return;

    const steps: LoadingStep[] = [
      { id: 'analyze', label: 'Mapeando DNA do Markdown (Etapa 1)', status: 'loading' },
      { id: 'style', label: 'Carregando Arquétipo Visual (Etapa 2)', status: 'pending' },
      { id: 'branding', label: 'Sincronizando Branding Elite (Etapa 0)', status: 'pending' },
      { id: 'metadata', label: 'Integrando Metadados Heurísticos (Etapa 3)', status: 'pending' },
      { id: 'generate', label: 'Transmutando Código HTML', status: 'pending' },
      { id: 'finalize', label: 'Finalizando Material Aura', status: 'pending' }
    ];

    setLoading(true);
    setLoadingMsg('Gerador de Páginas');
    setLoadingSteps(steps);

    try {
      if (selectedLang === 'all') {
        const langs: ('pt' | 'en' | 'es')[] = ['pt', 'en', 'es'];
        const names: Record<'pt' | 'en' | 'es', string> = { pt: filename, en: filenameEn, es: filenameEs };
        let masterHtml = '';

        for (const lang of langs) {
          setLoadingMsg(`Gerando versão ${lang.toUpperCase()}...`);
          // Reset steps for each language to show progress
          setLoadingSteps(steps.map(s => s.id === 'analyze' ? { ...s, status: 'loading' } : { ...s, status: 'pending' }));

          if (lang === 'pt') {
            masterHtml = await generateSinglePage(lang, names[lang]);
          } else {
            await generateSinglePage(lang, names[lang], masterHtml);
          }
        }
        setGeneratedHtml(masterHtml); // Keep master in preview
        setFilename(filename);
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
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="bg-slate-950/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent-shadow" style={{ backgroundColor: appAccentColor }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase text-white font-sans">
                Interactive <span style={{ color: appAccentColor }}>Builder</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                  <User size={16} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Operador</p>
                  <p className="text-xs font-bold text-slate-300 truncate max-w-[180px]">{session.user.email}</p>
                </div>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 text-slate-500 hover:text-accent transition-colors"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-xs font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
              >
                <LogIn size={16} /> Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <nav className="bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 sticky top-[73px] z-40 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 overflow-x-auto max-w-full">
          {[
            { id: 'keys', icon: Key, label: 'Infra & Tema' },
            { id: 'supabase', icon: ShieldCheck, label: 'Suporte' },
            { id: 'branding', icon: Palette, label: 'Branding IA' },
            { id: 'editor', icon: Code, label: 'Editor' },
            { id: 'preview', icon: Eye, label: 'Preview' },
            { id: 'materials', icon: History, label: 'Materiais' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as ViewType)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-bold transition-all whitespace-nowrap ${view === tab.id ? 'bg-accent text-black shadow-lg shadow-accent-shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
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
              className="fixed inset-0 bg-[#020617]/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-900/80 backdrop-blur-3xl rounded-3xl p-12 text-center w-full max-w-xl border border-white/5 relative overflow-hidden shadow-2xl"
              >
                {/* Animated Background Scanner */}
                <motion.div
                  animate={{ top: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-48 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none"
                />

                <div className="relative z-10">
                  <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={48} className="text-accent" />
                    </motion.div>
                  </div>

                  <h3 className="text-4xl font-sans font-black text-white mb-2 tracking-tighter uppercase">
                    {loadingMsg || 'Sincronizando'}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold mb-10 uppercase tracking-widest leading-relaxed">Arquitetando sua visão através do Aura AI.</p>

                  <div className="space-y-4 text-left max-w-sm mx-auto">
                    {loadingSteps.map((step, idx) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${step.status === 'completed' ? 'bg-accent border-accent' :
                          step.status === 'loading' ? 'bg-blue-500/20 border-blue-500 animate-pulse' :
                            'border-slate-800'
                          }`}>
                          {step.status === 'completed' ? (
                            <Check size={12} className="text-black font-bold" />
                          ) : step.status === 'loading' ? (
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          ) : null}
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${step.status === 'completed' ? 'text-accent' :
                          step.status === 'loading' ? 'text-white' :
                            'text-slate-600'
                          }`}>
                          {step.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-12 h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-accent shadow-[0_0_15px_rgba(59,130,246,0.5)]"
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
            <motion.div key="supabase" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto space-y-8 p-1">
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-10 border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
                  <div>
                    <h2 className="text-4xl font-sans font-black text-white flex items-center gap-4 tracking-tighter uppercase">
                      <Key className="text-accent" size={32} /> Infra & Interface
                    </h2>
                    <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest">Configure as chaves de acesso e a estética da plataforma.</p>
                  </div>
                  <button onClick={saveSupabaseConfig} className="bg-accent text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-accent-hover transition-all uppercase tracking-widest text-xs shadow-lg shadow-accent-shadow">
                    <Save size={18} /> Estabelecer Conexão
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ponto de Extremidade (URL)</label>
                    <div className="relative">
                      <ExternalLink size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="text"
                        value={supabaseConfig.url}
                        onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 text-slate-200 font-mono text-sm outline-none focus:border-accent-shadow transition-colors rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Token de Acesso (Anon Key)</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="password"
                        value={supabaseConfig.anonKey}
                        onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                        placeholder="eyJhbGciOiJIUzI1Ni..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 text-slate-200 font-mono text-sm outline-none focus:border-accent-shadow transition-colors rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
                {/* PLATFORM THEME PICKER */}
                <div className="mt-12 pt-8 border-t border-white/5">
                  <h3 className="text-base font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <Palette size={18} className="text-accent" /> Personalização da Plataforma
                  </h3>
                  <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={appAccentColor}
                        onChange={(e) => setAppAccentColor(e.target.value)}
                        className="w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden"
                      />
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cor Global Aura</p>
                        <p className="text-xs font-mono text-white mt-1 uppercase">{appAccentColor}</p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-tighter">
                        Esta cor altera os estados visuais do Interactive Builder (botões, ícones, estados de hover), permitindo que você trabalhe no ambiente que desejar sem afetar o branding dos materiais gerados.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                        <button
                          key={c}
                          onClick={() => setAppAccentColor(c)}
                          className={`w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-125 ${appAccentColor === c ? 'ring-2 ring-white/20 scale-125' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* SQL Scripts & Library Styles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SQL Scripts */}
                <div className="bg-slate-900/50 backdrop-blur-3xl p-10 border border-white/5 flex flex-col h-[600px] rounded-3xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-sans font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                        <FileCode className="text-accent" /> Esquema SQL
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Definição de Tabelas e RLS.</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(SUPABASE_SQL, 'sql')}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${copiedId === 'sql' ? 'bg-accent text-black' : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'}`}
                    >
                      {copiedId === 'sql' ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar Schema</>}
                    </button>
                  </div>
                  <div className="flex-1 bg-slate-950/50 border border-white/5 overflow-hidden relative rounded-2xl">
                    <pre className="p-6 text-[11px] font-mono text-slate-400 overflow-auto h-full custom-scrollbar leading-relaxed">
                      {SUPABASE_SQL}
                    </pre>
                  </div>
                </div>

                {/* Seed Prompts */}
                <div className="bg-slate-900/50 backdrop-blur-3xl p-10 border border-white/5 flex flex-col h-[600px] rounded-3xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-sans font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                        <Palette className="text-accent" /> Biblioteca Seed
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Injeção de 31 estilos Premium.</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(SEED_PROMPTS_SQL, 'seed')}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${copiedId === 'seed' ? 'bg-accent text-black' : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'}`}
                    >
                      {copiedId === 'seed' ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar Seed SQL</>}
                    </button>
                  </div>
                  <div className="flex-1 bg-slate-950/50 border border-white/5 overflow-hidden relative rounded-2xl">
                    <pre className="p-6 text-[11px] font-mono text-slate-400 overflow-auto h-full custom-scrollbar leading-relaxed">
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

              {/* PRESET SELECTOR BAR */}
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl px-6 py-5 border border-white/5 shadow-2xl">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 block">Preset de Branding Ativo</label>
                <div className="flex items-center gap-3">
                  {/* Select */}
                  <div className="relative flex-1">
                    <select
                      value={activeBrandId || ''}
                      onChange={(e) => switchBrandPreset(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-accent text-sm font-black rounded-xl outline-none focus:border-accent-shadow cursor-pointer appearance-none uppercase tracking-widest transition-all h-[46px]"
                    >
                      <option value="" disabled>Selecione um Preset</option>
                      {brandPresets.map(preset => (
                        <option key={preset.id} value={preset.id}>{preset.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>
                  {/* Buttons - same height as select */}
                  <button
                    onClick={() => { setNewBrandName(''); setShowNewBrandModal(true); }}
                    className="flex items-center gap-2 px-5 h-[46px] bg-accent/10 border border-accent/30 text-accent rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all whitespace-nowrap shrink-0"
                  >
                    <Plus size={14} /> Novo
                  </button>
                  {brandPresets.length > 1 && (
                    <button
                      onClick={() => activeBrandId && window.confirm('Excluir este preset permanentemente?') && deleteBrandPreset(activeBrandId)}
                      className="flex items-center gap-2 px-5 h-[46px] bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all whitespace-nowrap shrink-0"
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  )}
                </div>
              </div>

              {/* NEW BRAND PRESET MODAL */}
              {showNewBrandModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowNewBrandModal(false)}>
                  <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Plus size={24} className="text-accent" /> Novo Branding Elite
                      </h3>
                      <button onClick={() => setShowNewBrandModal(false)} className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Nome da Marca</label>
                          <input type="text" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} placeholder="Ex: TRC Odontologia" className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-white text-sm font-bold rounded-xl outline-none focus:border-accent-shadow transition-colors" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Cor Primária</label>
                            <div className="flex items-center gap-2 bg-slate-950 p-2 border border-white/5 rounded-xl">
                              <input type="color" value={newBrandPrimaryColor} onChange={(e) => setNewBrandPrimaryColor(e.target.value)} className="w-8 h-8 cursor-pointer rounded-lg overflow-hidden bg-transparent border-none" />
                              <input type="text" value={newBrandPrimaryColor} onChange={(e) => setNewBrandPrimaryColor(e.target.value)} className="w-full bg-transparent text-[10px] text-white font-mono outline-none uppercase" />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Cor Destaque</label>
                            <div className="flex items-center gap-2 bg-slate-950 p-2 border border-white/5 rounded-xl">
                              <input type="color" value={newBrandSecondaryColor} onChange={(e) => setNewBrandSecondaryColor(e.target.value)} className="w-8 h-8 cursor-pointer rounded-lg overflow-hidden bg-transparent border-none" />
                              <input type="text" value={newBrandSecondaryColor} onChange={(e) => setNewBrandSecondaryColor(e.target.value)} className="w-full bg-transparent text-[10px] text-white font-mono outline-none uppercase" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Tipografia</label>
                          <select value={newBrandFontFamily} onChange={(e) => setNewBrandFontFamily(e.target.value)} className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-white text-sm font-bold rounded-xl outline-none focus:border-accent-shadow cursor-pointer appearance-none transition-all">
                            {["Inter", "Roboto", "Montserrat", "Poppins", "Outfit", "Raleway", "Lato", "Open Sans", "Nunito", "Lexend", "Playfair Display", "DM Sans"].map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-6 flex flex-col">
                        <div className="flex-1 flex flex-col">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Descrição Sistêmica Corporativa</label>
                          <textarea value={newBrandDescription} onChange={(e) => setNewBrandDescription(e.target.value)} className="flex-1 w-full p-4 bg-slate-950/80 border border-white/10 text-slate-300 rounded-xl outline-none focus:border-accent-shadow placeholder:text-slate-700 resize-none text-xs font-bold leading-relaxed" placeholder="Ex: Boutique odontológica focada em implantes de alta complexidade. Tom de voz institucional, elegante e tecnológico." />
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                      <button onClick={() => setShowNewBrandModal(false)} className="flex-1 py-4 bg-white/5 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors">Cancelar</button>
                      <button onClick={createBrandPreset} disabled={!newBrandName.trim()} className="flex-[2] py-4 bg-accent text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent-shadow disabled:opacity-40 disabled:cursor-not-allowed">Salvar Preset de Branding</button>
                    </div>
                  </div>
                </div>
              )}

              {/* MAIN BRANDING EDITOR */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Panel: Visual Identity */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 h-full shadow-2xl">
                    <h2 className="text-xl font-sans font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                      <Palette className="text-accent" /> Identidade Visual
                    </h2>

                    <div className="space-y-6">
                      {/* Nome */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nome do Preset</label>
                        <input
                          type="text"
                          value={brandConfig.name || ''}
                          onChange={(e) => setBrandConfig({ ...brandConfig, name: e.target.value })}
                          placeholder="Ex: TRC Odontologia"
                          className="w-full px-4 py-3 bg-slate-950/50 border border-white/5 text-white text-sm font-bold rounded-xl outline-none focus:border-accent-shadow transition-colors"
                        />
                      </div>

                      {/* Primary color */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cor Primária</label>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-4 border border-white/5 rounded-2xl">
                          <input
                            type="color"
                            value={brandConfig.primaryBlue}
                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}
                            className="w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandConfig.primaryBlue}
                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryBlue: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-xs font-bold outline-none uppercase"
                            />
                            <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase">HEX CODE</p>
                          </div>
                        </div>
                      </div>

                      {/* Secondary color */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center justify-between">
                          Cor Secundária / Destaque
                          <span className="text-[8px] opacity-40">(Usada nos Materiais)</span>
                        </label>
                        <div className="flex items-center gap-4 bg-slate-950/50 p-4 border border-white/5 rounded-2xl">
                          <input
                            type="color"
                            value={brandConfig.primaryGold}
                            onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}
                            className="w-12 h-12 cursor-pointer bg-transparent border-none p-0 rounded-lg overflow-hidden"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandConfig.primaryGold}
                              onChange={(e) => setBrandConfig({ ...brandConfig, primaryGold: e.target.value })}
                              className="w-full bg-transparent text-white font-mono text-xs font-bold outline-none uppercase"
                            />
                            <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase">HEX CODE</p>
                          </div>
                        </div>
                      </div>

                      {/* Color preview bar */}
                      <div className="h-4 rounded-full overflow-hidden flex">
                        <div className="flex-1 transition-all" style={{ backgroundColor: brandConfig.primaryBlue }} />
                        <div className="flex-1 transition-all" style={{ backgroundColor: brandConfig.primaryGold }} />
                      </div>

                      {/* Font Family */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Família Tipográfica</label>
                        <div className="relative">
                          <select
                            value={brandConfig.fontFamily || 'Inter'}
                            onChange={(e) => setBrandConfig({ ...brandConfig, fontFamily: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-white text-sm font-bold rounded-xl outline-none focus:border-accent-shadow cursor-pointer appearance-none transition-all"
                          >
                            {['Inter', 'Roboto', 'Montserrat', 'Poppins', 'Outfit', 'Raleway', 'Lato', 'Open Sans', 'Nunito', 'Lexend', 'Playfair Display', 'DM Sans'].map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold" style={{ fontFamily: brandConfig.fontFamily || 'Inter' }}>
                          Preview: Aa Bb Cc — {brandConfig.fontFamily || 'Inter'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Strategy + AI Upload */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 h-full flex flex-col shadow-2xl">
                    <h2 className="text-xl font-sans font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                      <FileText className="text-accent" /> Estratégia de Marca
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
                      <div className="space-y-4 flex flex-col md:col-span-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                          <ShieldCheck size={14} className="text-accent" /> Perfil Estratégico & Audiência
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/30 p-6 rounded-2xl border border-white/5">
                          <div className="space-y-3">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Papel Principal (IA Persona)</label>
                            <input
                              type="text"
                              value={brandConfig.mainRole || ''}
                              onChange={(e) => setBrandConfig({ ...brandConfig, mainRole: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900/50 border border-white/5 text-slate-300 text-xs font-bold rounded-xl outline-none focus:border-accent-shadow transition-all"
                              placeholder="Ex: Consultor de Elite..."
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Diretrizes de Audiência</label>
                            <input
                              type="text"
                              value={brandConfig.audienceGuidelines || ''}
                              onChange={(e) => setBrandConfig({ ...brandConfig, audienceGuidelines: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900/50 border border-white/5 text-slate-300 text-xs font-bold rounded-xl outline-none focus:border-accent-shadow transition-all"
                              placeholder="Ex: Proprietários de clínicas..."
                            />
                          </div>

                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Público ALVO - Foco</label>
                              <input
                                type="text"
                                value={brandConfig.targetAudienceFoco || ''}
                                onChange={(e) => setBrandConfig({ ...brandConfig, targetAudienceFoco: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-white/5 text-slate-300 text-xs font-bold rounded-xl outline-none focus:border-accent-shadow transition-all"
                                placeholder="Foco..."
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Público ALVO - Tom</label>
                              <input
                                type="text"
                                value={brandConfig.targetAudienceTom || ''}
                                onChange={(e) => setBrandConfig({ ...brandConfig, targetAudienceTom: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-white/5 text-slate-300 text-xs font-bold rounded-xl outline-none focus:border-accent-shadow transition-all"
                                placeholder="Tom..."
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Público ALVO - Regra</label>
                              <input
                                type="text"
                                value={brandConfig.targetAudienceRegra || ''}
                                onChange={(e) => setBrandConfig({ ...brandConfig, targetAudienceRegra: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-white/5 text-slate-300 text-xs font-bold rounded-xl outline-none focus:border-accent-shadow transition-all"
                                placeholder="Regra..."
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2 space-y-3">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                              <Flame size={12} className="text-accent" /> Regra de Ouro Inegociável
                            </label>
                            <input
                              type="text"
                              value={brandConfig.goldenRule || ''}
                              onChange={(e) => setBrandConfig({ ...brandConfig, goldenRule: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 text-accent text-xs font-black rounded-xl outline-none focus:border-accent shadow-inner transition-all"
                              placeholder="A regra máxima da marca..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Descrição Sistêmica Core</label>
                        <textarea
                          value={brandConfig.description || ''}
                          onChange={(e) => setBrandConfig({ ...brandConfig, description: e.target.value })}
                          className="flex-1 w-full p-4 bg-slate-950/50 border border-white/5 text-slate-300 rounded-2xl outline-none focus:border-accent-shadow placeholder:text-slate-700 resize-none font-sans text-xs font-bold leading-relaxed min-h-[120px]"
                          placeholder="Defina o core business e tom de voz..."
                        />
                      </div>

                      <div className="space-y-4 flex flex-col">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Análise de Guia Visual via IA</label>
                          {isExtractingColors && <RefreshCw className="animate-spin text-accent" size={12} />}
                        </div>

                        {!brandConfig.pdfName ? (
                          <label className={`flex-1 flex flex-col items-center justify-center w-full border border-dashed border-slate-800 rounded-2xl cursor-pointer hover:bg-blue-500/5 transition-all group bg-slate-950/30 ${isExtractingColors ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                              <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:border-accent/30 transition-all">
                                {isExtractingColors ? <RefreshCw className="w-6 h-6 text-accent animate-spin" /> : <Sparkles className="w-6 h-6 text-slate-600 group-hover:text-accent" />}
                              </div>
                              <p className="text-xs font-black text-slate-500 group-hover:text-white transition-colors uppercase">
                                {isExtractingColors ? 'Extraindo Cores & Nome...' : 'Dropar Logo/PDF'}
                              </p>
                              <p className="text-[9px] text-slate-700 mt-2 uppercase tracking-widest font-bold">A Gemini IA extrai o Preset</p>
                            </div>
                            <input type="file" className="hidden" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={extractColorsFromBranding} disabled={isExtractingColors} />
                          </label>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center w-full bg-slate-950/50 border border-white/5 rounded-2xl p-8 relative group">
                            <div className="w-16 h-16 bg-accent/10 border border-accent-shadow rounded-2xl flex items-center justify-center mb-4">
                              <FileText size={32} className="text-accent" />
                            </div>
                            <p className="text-xs font-bold text-white text-center break-all px-4 uppercase tracking-tighter">{brandConfig.pdfName}</p>
                            <p className="text-[9px] text-accent font-black mt-2 uppercase tracking-[0.2em]">Guia Integrado</p>
                            <button
                              onClick={(e) => { e.preventDefault(); setBrandConfig({ ...brandConfig, pdfName: undefined, pdfBase64: undefined }); }}
                              className="absolute top-4 right-4 p-2 bg-white/5 rounded-xl text-slate-500 hover:bg-accent hover:text-black transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex justify-end gap-6">
                      <button onClick={saveBranding} disabled={loading} className={`bg-accent text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-accent-hover transition-all uppercase tracking-widest text-xs shadow-lg shadow-accent-shadow ${loading ? 'opacity-50' : ''}`}>
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Salvar Preset Atual
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. API Keys Tab */}
          {view === 'keys' && (
            <motion.div key="keys" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto p-1">
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-10 border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
                  <div>
                    <h2 className="text-4xl font-sans font-black text-white flex items-center gap-4 tracking-tighter uppercase">
                      <Key className="text-accent" size={32} /> Chaves Aura
                    </h2>
                    <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest">Gerencie as conexões neurais com modelos de IA.</p>
                  </div>
                  <button onClick={saveApiKeys} className="bg-accent text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-accent-hover transition-all uppercase tracking-widest text-xs shadow-lg shadow-accent-shadow">
                    <Save size={18} /> Validar Credenciais
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { id: 'gemini', label: 'Google Gemini 2.5 Flash', icon: Sparkles },
                    { id: 'openai', label: 'OpenAI GPT-4o', icon: Zap },
                    { id: 'claude', label: 'Anthropic Claude 3.5', icon: Activity },
                    { id: 'groq', label: 'Groq Llama 3 (70B)', icon: Layers }
                  ].map((service) => (
                    <div key={service.id} className="p-6 bg-slate-950/50 border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden rounded-2xl shadow-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-accent">
                          <service.icon size={20} />
                        </div>
                        <span className="font-bold text-[10px] text-slate-300 uppercase tracking-widest leading-none">{service.label}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          value={(apiKeys as any)[service.id]}
                          onChange={(e) => setApiKeys({ ...apiKeys, [service.id]: e.target.value })}
                          placeholder={`SECRET_KEY_${service.id.toUpperCase()}`}
                          className="w-full px-4 py-4 bg-slate-900/50 border border-white/5 text-slate-200 font-mono text-xs outline-none focus:border-accent-shadow placeholder:text-slate-800 transition-all rounded-xl"
                        />
                        {(apiKeys as any)[service.id] && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
                            <CheckCircle2 size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. Editor Tab Aura */}
          {view === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Top Navigation Bento */}
              <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl p-4 border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                  {[
                    { id: 'converter', label: '1. Fluxo Bruto', icon: ArrowRightLeft },
                    { id: 'content', label: '2. Markdown', icon: Pencil },
                    { id: 'style', label: '3. Estilo Visual', icon: Palette },
                    { id: 'metadata', label: '4. Heurística', icon: LayoutTemplate }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setEditorTab(tab.id as any)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${editorTab === tab.id ? 'bg-accent text-black shadow-lg shadow-accent-shadow' : 'bg-slate-950/50 text-slate-500 hover:text-white hover:bg-white/5 border border-white/5'
                        }`}
                    >
                      <tab.icon size={16} className={`${editorTab === tab.id ? 'text-black' : 'text-slate-600'}`} />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 hidden lg:block">
                  Ambiente de Transmutação Aura
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Workspace Column */}
                <div className="xl:col-span-9 bg-slate-900/50 backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
                  {editorTab === 'converter' ? (
                    <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                      {/* Input Aura */}
                      <div className="flex-1 flex flex-col bg-slate-950/40">
                        <div className="h-16 flex items-center px-8 justify-between border-b border-white/5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <FileText size={16} className="text-accent" /> Fluxo Bruto
                          </label>
                          <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">{rawText.length} Bytes</span>
                        </div>
                        <div className="flex-1 relative group w-full min-h-[400px]">
                          <textarea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Insira dados brutos para processamento..."
                            className="absolute inset-0 w-full h-full p-8 bg-transparent text-slate-300 outline-none font-mono text-xs resize-none leading-loose custom-scrollbar transition-all"
                          />
                          {!rawText && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                              <div className="text-center">
                                <Download size={64} className="mx-auto mb-4 text-slate-600" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Buffer_Aura_Vazio</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Panel Aura */}
                      <div className="flex-1 flex flex-col p-12 items-center justify-center text-center relative overflow-hidden bg-[#020617] min-h-[400px]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                        <div className="relative z-10 max-w-sm">
                          {!rawText.trim() ? (
                            <div className="space-y-8">
                              <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-110">
                                <ArrowRightLeft size={40} className="text-slate-600" />
                              </div>
                              <div>
                                <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Espera Aura</h4>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                  O motor está pronto para receber conteúdo. Otimize seu fluxo de trabalho através da automação inteligente.
                                </p>
                              </div>
                              <div className="flex justify-center gap-3">
                                <div className="px-5 py-2 rounded-lg bg-slate-900 border border-white/5 text-slate-600 text-[9px] font-black uppercase tracking-widest">Aura_Active</div>
                                <div className="px-5 py-2 rounded-lg bg-slate-900 border border-white/5 text-slate-600 text-[9px] font-black uppercase tracking-widest">V.2026</div>
                              </div>
                            </div>
                          ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 max-w-sm">
                              <div className="w-28 h-28 rounded-3xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto transition-all shadow-2xl">
                                <Sparkles size={48} className="text-accent animate-pulse" />
                              </div>
                              <div>
                                <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">DNA_Mapeado</h4>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                  Conteúdo identificado. A estrutura Aura está pronta para a transmutação em formato Markdown Elite.
                                </p>
                              </div>

                              <button
                                onClick={convertToMarkdown}
                                className="w-full bg-accent hover:bg-accent-hover text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-lg shadow-accent-shadow active:scale-[0.98]"
                              >
                                <Wand2 size={24} /> Executar Síntese
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : editorTab === 'content' ? (
                    <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 bg-[#020617]">
                      {/* Editor Pane Aura */}
                      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/40">
                        <div className="h-16 flex items-center px-8 justify-between border-b border-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Manuscrito Markdown</span>
                          <button onClick={() => setMarkdownText('')} className="text-[10px] font-black text-slate-600 hover:text-accent transition-colors uppercase tracking-widest">Limpar_Buffer</button>
                        </div>
                        <div className="flex-1 relative w-full p-8 min-h-[400px]">
                          <textarea
                            value={markdownText}
                            onChange={(e) => setMarkdownText(e.target.value)}
                            placeholder="# Arquitetura_de_Dados..."
                            className="absolute inset-0 w-full h-full p-8 bg-transparent text-slate-300 outline-none font-mono text-xs resize-none leading-loose custom-scrollbar selection:bg-accent/30"
                          />
                        </div>
                      </div>

                      {/* Preview Pane */}
                      <div className="flex-1 flex flex-col min-w-0 bg-black/40">
                        <div className="h-16 flex items-center px-8 justify-between border-b border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] font-mono">Renderização Heurística</span>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar prose prose-invert prose-slate prose-sm max-w-none font-sans bg-[radial-gradient(circle_at_top_right,rgba(202,138,4,0.02),transparent)] min-h-[400px]">
                          <ReactMarkdown>{markdownText}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ) : editorTab === 'style' ? (
                    <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5 bg-[#020617]">
                      {/* Style Settings Pane Aura */}
                      <div className="flex-1 lg:max-w-md flex flex-col shrink-0 bg-slate-950/40">
                        <div className="h-16 flex items-center px-8 border-b border-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Arquétipos Aura (Design DNA)</span>
                        </div>
                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] block">Assinatura Visual IA</label>
                            <div className="relative">
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
                                className="w-full px-5 py-4 bg-slate-900 border border-white/10 text-slate-200 rounded-2xl text-[10px] outline-none focus:border-accent-shadow cursor-pointer appearance-none uppercase tracking-widest font-black transition-all"
                              >
                                <option value="">SELECIONAR ARQUÉTIPO...</option>
                                {promptLibrary.map(p => (
                                  <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                            </div>
                            <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl space-y-2">
                              <div className="flex items-center gap-2">
                                <Palette size={12} className="text-accent" />
                                <span className="text-[8px] font-black text-accent uppercase tracking-widest">Branding Sincronizado</span>
                              </div>
                              <div className="flex gap-2">
                                <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: brandConfig.primaryBlue }} title="Primária" />
                                <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: brandConfig.primaryGold }} title="Acento" />
                                <span className="text-[8px] font-bold text-slate-500 uppercase flex items-center">{brandConfig.fontFamily}</span>
                              </div>
                            </div>
                            <p className="text-[9px] text-slate-600 font-black leading-relaxed uppercase tracking-tighter">
                              * Define o tom de voz e a sofisticação da interface, fundindo o DNA visual do estilo com o Branding da Etapa 0.
                            </p>
                          </div>

                          {/* Style Preview Component Aura */}
                          <div className="space-y-4 flex-1">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] block">Telemetria Visual</label>
                            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative group bg-slate-900">
                              <StylePreview
                                styleTitle={promptLibrary.find(p => p.id === selectedPromptId)?.title || 'Aura Base'}
                                brandConfig={{
                                  primaryBlue: brandConfig.primaryBlue,
                                  primaryGold: brandConfig.primaryGold
                                }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={seedPromptLibrary}
                            className="w-full py-4 bg-white/5 border border-white/5 text-slate-500 hover:text-accent rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-sm"
                          >
                            <Download size={14} /> Importar Padrões Aura
                          </button>
                        </div>
                      </div>

                      {/* Prompt Editor / System Info Aura */}
                      <div className="flex-1 flex flex-col bg-black/40 min-h-[400px]">
                        <div className="h-16 flex items-center px-8 justify-between border-b border-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cérebro Aura (System Prompt)</span>
                          <button
                            onClick={savePromptToLibrary}
                            className="text-[10px] font-black text-accent hover:text-accent-hover flex items-center gap-2 uppercase tracking-widest transition-all font-sans"
                          >
                            <Save size={14} className="text-accent" /> Salvar Prompt
                          </button>
                        </div>
                        <div className="flex-1 p-8 relative w-full h-full">
                          <textarea
                            value={brandConfig.systemPrompt}
                            onChange={(e) => setBrandConfig({ ...brandConfig, systemPrompt: e.target.value })}
                            className="absolute inset-0 w-full h-full p-8 bg-transparent text-slate-400 font-mono text-[11px] leading-relaxed resize-none outline-none focus:border-accent/30 custom-scrollbar selection:bg-accent-shadow"
                            placeholder="Defina as diretrizes lógicas para a criação das interfaces Aura..."
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col bg-[#020617] relative min-h-[600px]">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(202,138,4,0.03),transparent)] pointer-events-none" />

                      <div className="h-16 flex items-center px-8 justify-between border-b border-white/5 shrink-0 z-10 bg-slate-950/40">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Heurística Aura (SEO & Metadata)</span>
                        <button
                          onClick={generateMetadataSuggestions}
                          className="text-[10px] font-black text-accent hover:text-accent-hover flex items-center gap-2 uppercase tracking-[0.3em] font-sans transition-all"
                        >
                          <Sparkles size={14} /> Computar Sugestões_Aura
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar z-10 relative">
                        <div className="max-w-4xl mx-auto h-full space-y-8">
                          {!suggestedMetadata ? (
                            <div className="max-w-md mx-auto text-center py-20 space-y-10">
                              <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-110">
                                <LayoutTemplate size={40} className="text-slate-600" />
                              </div>
                              <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Espera Estrutural Aura</h4>
                              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto mb-10 leading-relaxed">
                                A IA aguarda análise estrutural para definir os padrões de visibilidade e SEO.
                              </p>
                              <button
                                onClick={generateMetadataSuggestions}
                                className="bg-accent text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-accent-hover transition-all shadow-lg shadow-accent-shadow active:scale-[0.98]"
                              >
                                Computar Sugestões_Aura
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-8 pb-12">
                              {/* Language Switcher Aura */}
                              <div className="flex flex-wrap gap-4 p-2 bg-slate-900/50 border border-white/5 rounded-2xl w-fit mx-auto backdrop-blur-3xl">
                                {(['pt', 'en', 'es'] as const).map(lang => (
                                  <button
                                    key={lang}
                                    onClick={() => setMetadataLang(lang)}
                                    className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all ${metadataLang === lang ? 'bg-accent text-black shadow-lg shadow-accent-shadow' : 'text-slate-500 hover:text-white hover:bg-white/5'} `}
                                  >
                                    {lang === 'pt' ? '🇧🇷 PT-BR' : lang === 'en' ? '🇺🇸 EN-US' : '🇪🇸 ES-ES'}
                                  </button>
                                ))}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                  <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 relative backdrop-blur-3xl">
                                    <div className="flex justify-between items-center mb-6">
                                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Protocolo_Título</label>
                                      <button onClick={() => copyToClipboard(suggestedMetadata[metadataLang].title, 'meta-title')} className="text-slate-600 hover:text-accent transition-colors">
                                        {copiedId === 'meta-title' ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={suggestedMetadata[metadataLang].title}
                                      onChange={(e) => {
                                        const newMeta = { ...suggestedMetadata };
                                        newMeta[metadataLang].title = e.target.value;
                                        setSuggestedMetadata(newMeta);
                                      }}
                                      className="w-full bg-transparent border-b border-white/10 focus:border-accent-shadow outline-none text-xl font-black text-slate-200 tracking-tight pb-4 transition-all"
                                    />
                                  </div>

                                  <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 backdrop-blur-3xl">
                                    <div className="flex justify-between items-center mb-6">
                                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Aura_ID (Slug)</label>
                                      <div className="flex items-center gap-6">
                                        <button
                                          onClick={() => setFilename(suggestedMetadata[metadataLang].filename)}
                                          className="text-[9px] font-black text-accent hover:text-accent-hover uppercase tracking-[0.3em]"
                                        >
                                          Aplicar_Ao_Motor
                                        </button>
                                        <button onClick={() => copyToClipboard(suggestedMetadata[metadataLang].filename, 'meta-file')} className="text-slate-600 hover:text-accent transition-colors">
                                          {copiedId === 'meta-file' ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                                        </button>
                                      </div>
                                    </div>
                                    <input
                                      type="text"
                                      value={suggestedMetadata[metadataLang].filename}
                                      onChange={(e) => {
                                        const newMeta = { ...suggestedMetadata };
                                        newMeta[metadataLang].filename = e.target.value;
                                        setSuggestedMetadata(newMeta);
                                      }}
                                      className="w-full bg-transparent border-b border-white/10 focus:border-accent-shadow outline-none text-accent font-mono text-[10px] font-black pb-4"
                                    />
                                  </div>

                                  <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 backdrop-blur-3xl relative">
                                    <div className="flex justify-between items-center mb-6">
                                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Heurística_Tags</label>
                                      <button onClick={() => copyToClipboard(suggestedMetadata[metadataLang].tags?.join(', '), 'meta-tags')} className="text-slate-600 hover:text-accent transition-colors">
                                        {copiedId === 'meta-tags' ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                                      </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {suggestedMetadata[metadataLang].tags?.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                    <input
                                      type="text"
                                      value={suggestedMetadata[metadataLang].tags?.join(', ') || ''}
                                      onChange={(e) => {
                                        const newMeta = { ...suggestedMetadata };
                                        if (newMeta[metadataLang]) {
                                          newMeta[metadataLang].tags = e.target.value.split(',').map(t => t.trim());
                                        }
                                        setSuggestedMetadata(newMeta);
                                      }}
                                      placeholder="tag1, tag2, tag3"
                                      className="w-full bg-transparent border-b border-white/10 focus:border-accent-shadow outline-none text-slate-500 font-mono text-[9px] font-black pb-2"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-8 flex flex-col">
                                  <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 h-full flex flex-col backdrop-blur-3xl flex-1 min-h-[200px]">
                                    <div className="flex justify-between items-center mb-6">
                                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Heurística_Aura (Description)</label>
                                      <button onClick={() => copyToClipboard(suggestedMetadata[metadataLang].description, 'meta-desc')} className="text-slate-600 hover:text-accent transition-colors">
                                        {copiedId === 'meta-desc' ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
                                      </button>
                                    </div>
                                    <textarea
                                      value={suggestedMetadata[metadataLang].description}
                                      onChange={(e) => {
                                        const newMeta = { ...suggestedMetadata };
                                        newMeta[metadataLang].description = e.target.value;
                                        setSuggestedMetadata(newMeta);
                                      }}
                                      className="flex-1 w-full bg-transparent border border-white/5 p-6 rounded-xl focus:border-accent/30 outline-none text-slate-400 text-xs leading-relaxed resize-none custom-scrollbar transition-all"
                                    />
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

                {/* Sidebar Column: Settings & Engine */}
                <div className="xl:col-span-3 space-y-6">
                  {/* Generate Section Aura */}
                  <div className="bg-slate-900/50 backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl xl:sticky top-[100px] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-slate-950/40">
                      <p className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                        <Wand2 size={16} className="text-accent" /> Motor de Geração
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* IA selector */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cérebro AI</label>
                        <div className="relative">
                          <select
                            value={selectedApi}
                            onChange={(e) => setSelectedApi(e.target.value as keyof ApiKeys)}
                            className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-black rounded-xl outline-none focus:border-accent-shadow cursor-pointer appearance-none uppercase tracking-widest transition-all"
                          >
                            {(apiKeys.gemini || (typeof process !== 'undefined' && process.env.GEMINI_API_KEY)) ? <option value="gemini">Google Gemini 2.5 Flash</option> : null}
                            {apiKeys.openai ? <option value="openai">OpenAI GPT-4o</option> : null}
                            {apiKeys.claude ? <option value="claude">Anthropic Claude</option> : null}
                            {apiKeys.groq ? <option value="groq">Groq Llama 3</option> : null}
                            {!apiKeys.gemini && !apiKeys.openai && !apiKeys.claude && !apiKeys.groq && (typeof process === 'undefined' || !process.env.GEMINI_API_KEY) && (
                              <option value="gemini">Gemini Default</option>
                            )}
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                      </div>

                      {/* Idioma selector Aura */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Localização</label>
                        <div className="relative">
                          <select
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value as any)}
                            className="w-full px-5 py-4 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-black rounded-xl outline-none focus:border-accent-shadow cursor-pointer appearance-none uppercase tracking-widest transition-all"
                          >
                            <option value="pt">🇧🇷 PT-BR Português</option>
                            <option value="en">🇺🇸 EN-US English</option>
                            <option value="es">🇪🇸 ES-ES Spanish</option>
                            <option value="all">🌐 Multilingual</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                      </div>

                      {/* Identificadores Aura */}
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Identificador (Slug)</label>
                        {selectedLang === 'all' ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-slate-500 w-8">🇧🇷 PT</span>
                              <input
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="pt-page"
                                className="flex-1 w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-mono rounded-xl outline-none focus:border-accent-shadow transition-all font-bold"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-slate-500 w-8">🇺🇸 EN</span>
                              <input
                                type="text"
                                value={filenameEn}
                                onChange={(e) => setFilenameEn(e.target.value)}
                                placeholder="en-page"
                                className="flex-1 w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-mono rounded-xl outline-none focus:border-accent-shadow transition-all font-bold"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-slate-500 w-8">🇪🇸 ES</span>
                              <input
                                type="text"
                                value={filenameEs}
                                onChange={(e) => setFilenameEs(e.target.value)}
                                placeholder="es-page"
                                className="flex-1 w-full px-4 py-3 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-mono rounded-xl outline-none focus:border-accent-shadow transition-all font-bold"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={filename}
                              onChange={(e) => setFilename(e.target.value)}
                              placeholder="page-id"
                              className="flex-1 w-full px-5 py-4 bg-slate-950/80 border border-white/10 text-slate-200 text-[10px] font-mono rounded-xl outline-none focus:border-accent-shadow transition-all font-bold min-w-[50px]"
                            />
                            <span className="text-slate-500 text-[9px] font-black uppercase">.html</span>
                          </div>
                        )}
                      </div>

                      {/* Final Action button Aura */}
                      <button
                        onClick={generatePage}
                        disabled={!markdownText.trim() || !filename.trim()}
                        className={`w-full mt-4 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-xl active:scale-[0.98] ${!markdownText.trim() || !filename.trim()
                          ? 'bg-slate-900 border border-white/5 text-slate-600 cursor-not-allowed'
                          : 'bg-accent text-black hover:bg-accent-hover shadow-accent-shadow'
                          }`}
                      >
                        <Flame size={18} fill="currentColor" /> Transmutar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* 5. Preview Tab */}
          {view === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-[calc(100vh-220px)] min-h-[600px] flex flex-col bg-stone-950 border border-white/5 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,138,4,0.02),transparent)] pointer-events-none" />
              {generatedHtml ? (
                <div className="flex flex-col h-full overflow-hidden relative z-10">
                  {/* Browser Toolbar Aura */}
                  <div className="bg-slate-950/90 px-8 py-5 border-b border-white/5 flex items-center gap-8 backdrop-blur-3xl">
                    <div className="flex gap-3">
                      <div className="w-3 h-3 rounded-full bg-slate-800 border border-white/5" />
                      <div className="w-3 h-3 rounded-full bg-slate-800 border border-white/5" />
                      <div className="w-3 h-3 rounded-full bg-slate-800 border border-white/5" />
                    </div>

                    <div className="flex-1 bg-slate-900/50 border border-white/10 px-6 py-2.5 rounded-xl flex items-center gap-4 mx-4 group backdrop-blur-xl">
                      <Lock size={14} className="text-accent-shadow group-hover:text-accent transition-colors" />
                      <span className="text-[10px] font-mono text-slate-500 truncate uppercase tracking-widest font-black">
                        aura_protocol://render.live/view/{filename || 'unnamed'}.aura
                      </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => downloadHtml(generatedHtml, filename)}
                        className="p-3 text-slate-500 hover:text-accent transition-all hover:bg-white/5 rounded-xl"
                        title="Exportar Aura"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={() => setView('editor')}
                        className="p-3 text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-xl"
                        title="Fechar Visualizador"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Iframe Viewport */}
                  <div className="flex-1 bg-white relative">
                    <iframe
                      srcDoc={generatedHtml}
                      className="absolute inset-0 w-full h-full border-none shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                      title="Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-blue-500/5">
                  <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mb-8 shadow-2xl">
                    <LayoutTemplate size={40} className="text-slate-600" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Vácuo de Visualização Aura</h3>
                  <p className="text-slate-500 max-w-sm mb-10 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    Nenhum código heurístico foi gerado para visualização no momento.
                  </p>
                  <button
                    onClick={() => setView('editor')}
                    className="bg-accent text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-accent-hover transition-all shadow-lg shadow-accent-shadow active:scale-[0.98]"
                  >
                    Abrir Operador Editor
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* 6. Materials Tab */}
          {view === 'materials' && (
            <motion.div key="materials" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12 pb-20">
              <div className="flex justify-between items-end border-b border-white/5 pb-10">
                <div>
                  <h2 className="text-4xl font-black text-white flex items-center gap-6 uppercase tracking-tighter">
                    <FolderOpen className="text-accent" size={40} /> Repositório Aura
                  </h2>
                  <p className="text-slate-500 mt-2 font-black text-[10px] uppercase tracking-widest leading-relaxed">Acesso ao registro histórico de transmutações heuísticas do sistema.</p>
                </div>
                <div className="hidden md:flex gap-4">
                  {selectedMaterials.length > 0 && (
                    <>
                      <button
                        onClick={downloadSelectedAsZip}
                        className="px-8 py-3 bg-accent text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-accent-shadow active:scale-95 transition-all flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500"
                      >
                        <Download size={16} /> Baixar_Zip ({selectedMaterials.length})
                      </button>
                      <button
                        onClick={deleteSelectedMaterials}
                        className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-900/40 active:scale-95 transition-all flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500"
                      >
                        <Trash2 size={16} /> Excluir_Massa ({selectedMaterials.length})
                      </button>
                    </>
                  )}
                  <button
                    onClick={toggleSelectAll}
                    className="px-8 py-3 bg-slate-900 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest shadow-xl backdrop-blur-3xl transition-all flex items-center gap-3"
                  >
                    {selectedMaterials.length === materials.length && materials.length > 0 ? <CheckSquare size={16} className="text-accent" /> : <Square size={16} />}
                    {selectedMaterials.length === materials.length && materials.length > 0 ? 'Desmarcar_Todos' : 'Selecionar_Todos'}
                  </button>
                  <div className="px-8 py-3 bg-slate-900 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-xl backdrop-blur-3xl">
                    {materials.length}_REGISTROS_ATIVOS
                  </div>
                </div>
              </div>

              {materials.length === 0 ? (
                <div className="bg-blue-500/5 border border-white/5 rounded-3xl p-24 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-3xl">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full" />
                  <div className="relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center mx-auto mb-10 group transition-all shadow-2xl">
                      <FolderOpen size={56} className="text-slate-600 group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Vácuo de Registros Aura</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-12 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                      Seu repositório central está em standby. Inicie o fluxo de transmutação para forjar novas instâncias de interface.
                    </p>
                    <button
                      onClick={() => { setView('editor'); setEditorTab('converter'); }}
                      className="bg-accent text-black px-12 py-5 rounded-2xl font-black hover:bg-accent-hover transition-all shadow-lg shadow-accent-shadow text-[10px] uppercase tracking-[0.3em]"
                    >
                      <Plus size={20} className="inline mr-3" /> Nova_Transmutação_Aura
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {materials.map((material) => (
                    <motion.div
                      key={material.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`group bg-slate-900/40 border rounded-3xl transition-all overflow-hidden flex flex-col relative backdrop-blur-3xl shadow-2xl ${selectedMaterials.includes(material.id) ? 'border-accent-shadow ring-1 ring-accent-shadow shadow-accent/5' : 'border-white/10 hover:border-accent/30'
                        }`}
                    >
                      {/* Checkbox Aura */}
                      <button
                        onClick={() => toggleMaterialSelection(material.id)}
                        className={`absolute top-6 left-6 z-20 p-2 rounded-lg transition-all ${selectedMaterials.includes(material.id) ? 'bg-accent text-black shadow-lg shadow-accent-shadow' : 'bg-slate-950/50 text-slate-600 hover:text-white border border-white/5'
                          }`}
                        title={selectedMaterials.includes(material.id) ? 'Desmarcar' : 'Selecionar'}
                      >
                        {selectedMaterials.includes(material.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>

                      {/* Actions Aura Top Right */}
                      <div className="absolute top-6 right-6 z-20 flex gap-2">
                        <button
                          onClick={() => setViewingTechSheet(material)}
                          className="p-2 bg-slate-950/50 text-slate-500 hover:text-accent border border-white/5 rounded-lg transition-all"
                          title="Ficha Técnica"
                        >
                          <Settings size={18} />
                        </button>
                      </div>

                      <div className="h-auto bg-slate-950/50 relative p-6 flex flex-col group-hover:bg-slate-950/80 transition-all border-b border-white/5 mx-4 mt-4 rounded-2xl">
                        <div className="flex justify-center mb-6">
                          <FileCode size={48} className="text-slate-800 group-hover:text-accent/40 transition-colors" />
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">{(material.html.length / 1024).toFixed(1)} KB</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">
                            {new Date(material.timestamp).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: '2-digit', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex-1 mb-10">
                          <h3 className="text-base font-black text-slate-200 mb-1 truncate uppercase tracking-tighter" title={material.name}>
                            {material.name}
                          </h3>
                        </div>

                        <div className="grid grid-cols-4 gap-4 pb-4">
                          <button
                            onClick={() => setViewingMaterial(material)}
                            className="flex items-center justify-center p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-accent/30 text-slate-500 hover:text-accent transition-all shadow-xl"
                            title="Visualizar Aura"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            onClick={() => loadMaterial(material)}
                            className="flex items-center justify-center p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-accent/30 text-slate-500 hover:text-accent transition-all shadow-xl"
                            title="Editar Material"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => downloadHtml(material.html, material.name)}
                            className="flex items-center justify-center p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-accent/30 text-slate-500 hover:text-accent transition-all shadow-xl"
                            title="Descarregar Buffer"
                          >
                            <Download size={20} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(material.id)}
                            className="flex items-center justify-center p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-rose-500/30 text-slate-500 hover:text-rose-500 transition-all shadow-xl"
                            title="Purgar Registro"
                          >
                            <Trash2 size={20} />
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
      </main >

      <MaterialPreviewModal
        material={viewingMaterial}
        onClose={() => setViewingMaterial(null)}
      />

      {/* Modais Globais Aura */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900/40 border border-white/10 p-12 max-w-md w-full rounded-3xl shadow-2xl backdrop-blur-3xl text-center"
            >
              <div className="w-24 h-24 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mb-10 mx-auto shadow-xl">
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Purgar Registro Aura?</h3>
              <p className="text-slate-500 mb-12 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Esta ação de purga é irreversível. O registro será removido permanentemente dos servidores Aura e do buffer local.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-8 py-5 rounded-2xl font-black text-[10px] text-slate-500 uppercase tracking-widest hover:text-white transition-all bg-white/5 border border-white/5 hover:border-white/10"
                >
                  Abortar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-8 py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98]"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {viewingTechSheet && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingTechSheet(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900/60 border border-white/10 p-10 max-w-lg w-full rounded-3xl shadow-2xl backdrop-blur-3xl"
            >
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <Settings className="text-accent" size={24} /> Ficha Técnica Aura
                </h3>
                <button
                  onClick={() => setViewingTechSheet(null)}
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estilo Base</span>
                    <span className="text-xs font-bold text-white uppercase">{viewingTechSheet.metadata?.style || 'AURAV.01'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Paleta de Cores</span>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: viewingTechSheet.metadata?.colors?.primary }} />
                        <span className="text-[10px] font-mono text-slate-300 uppercase">{viewingTechSheet.metadata?.colors?.primary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: viewingTechSheet.metadata?.colors?.secondary }} />
                        <span className="text-[10px] font-mono text-slate-300 uppercase">{viewingTechSheet.metadata?.colors?.secondary}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipografia</span>
                    <span className="text-xs font-bold text-white">{viewingTechSheet.metadata?.fontFamily || 'Inter'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modelo de IA</span>
                    <span className="text-xs font-bold text-white">{viewingTechSheet.metadata?.model || 'Desconhecido'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data de Geração</span>
                    <span className="text-xs font-bold text-white">{new Date(viewingTechSheet.timestamp).toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Metadados & SEO</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-bold mb-4">{viewingTechSheet.metadata?.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingTechSheet.metadata?.tags?.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => setViewingTechSheet(null)}
                  className="w-full py-4 bg-accent text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-accent-hover transition-all shadow-lg shadow-accent-shadow"
                >
                  Fechar Protocolo
                </button>
              </div>
            </motion.div>
          </div>
        )}


        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900/40 border border-white/5 p-12 max-w-md w-full rounded-3xl shadow-2xl overflow-hidden backdrop-blur-3xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent-shadow to-transparent" />

              <div className="w-24 h-24 rounded-2xl bg-accent/10 text-accent border border-accent-shadow flex items-center justify-center mb-8 mx-auto shadow-2xl">
                <LogIn size={40} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 text-center uppercase tracking-tighter">Terminal Aura</h3>
              <p className="text-slate-500 mb-10 text-center text-[10px] font-black uppercase tracking-[0.2em]">
                Autenticação Mandatória via Stream Aura
              </p>

              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email" placeholder="IDENTIFICADOR_USUÁRIO" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                      className="w-full px-6 py-5 border border-white/5 bg-slate-950/50 text-slate-200 text-xs font-black rounded-xl outline-none focus:border-accent/30 transition-all placeholder:text-slate-800" required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="password" placeholder="CHAVE_DE_ACESSO" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                      className="w-full px-6 py-5 border border-white/5 bg-slate-950/50 text-slate-200 text-xs font-black rounded-xl outline-none focus:border-accent/30 transition-all placeholder:text-slate-800" required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-5 bg-accent text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-accent-hover rounded-2xl transition-all shadow-lg shadow-accent-shadow flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <LogIn size={20} /> INICIAR_SESSÃO_AURA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowOnboarding(true);
                    }}
                    className="w-full px-8 py-5 border border-white/5 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white hover:bg-white/5 rounded-2xl transition-all flex items-center justify-center gap-3"
                  >
                    <User size={20} /> NOVO_REGISTRO_AURA
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="w-full py-4 text-slate-700 hover:text-slate-500 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    CANCELAR_PROTOCOLO
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
    </div >
  );
}
