# 🎨 Identidade Visual — Hub Conexão Interactive Builder

> Documento de referência completo: tokens de design, componentes, efeitos, estilos e diretrizes visuais da plataforma.

---

## 1. Visão Geral

O **Interactive Builder** é a plataforma interna da **Conexão Sistemas de Prótese** para geração de materiais de marketing e apresentações técnicas com IA. A interface do builder adota um **Design System Dark Premium** com fundo deep-space, tons de azul profundo e acentos dourados — transmitindo sofisticação, tecnologia e confiança.

---

## 2. Paleta de Cores

### 2.1 Tokens do Shell da Aplicação (interface do builder)

| Token | Hex | Uso |
|---|---|---|
| `--bg-dark` | `#020617` | Background raiz da aplicação |
| `--bg-card` | `#0f172a` | Cards e painéis principais |
| `bg-slate-900` | `#0f172a` | Painéis internos, sidebar |
| `bg-slate-800` | `#1e293b` | Inputs, controles, hover states |
| `bg-slate-800/50` | `#1e293b80` | Sub-containers, row items |
| `bg-slate-800/30` | `#1e293b4d` | API key cards |
| `border-slate-800` | `#1e293b` | Bordas de painéis primários |
| `border-slate-700` | `#334155` | Bordas de inputs e controles |
| `text-white` | `#ffffff` | Títulos principais |
| `text-slate-200` | `#e2e8f0` | Texto primário em cards |
| `text-slate-400` | `#94a3b8` | Texto secundário, descrições |
| `text-slate-500` | `#64748b` | Labels, placeholders, ícones inativos |
| `text-slate-600` | `#475569` | Placeholder de textarea |

### 2.2 Tokens de Branding da Marca (configuráveis pelo usuário)

| Token | Valor Padrão | Hex Padrão | Uso |
|---|---|---|---|
| `--primary-blue` / `primaryBlue` | Brand Blue | `#004a8e` | Botões primários, bordas de destaque, badges |
| `--primary-gold` / `primaryGold` | Accent Gold | `#c5a059` | Acentos dourados, coluna de destaque em tabelas |

> **Nota:** Ambos os tokens são configuráveis via painel de Branding e são injetados dinamicamente nos HTMLs gerados pela IA.

### 2.3 Cores de Acento dos Serviços (API Keys)

| Serviço | Cor | Classe TailwindCSS |
|---|---|---|
| Google Gemini | Azul | `text-blue-400` / `bg-blue-400/10` / `border-blue-400/20` |
| OpenAI (GPT-4) | Verde | `text-green-400` / `bg-green-400/10` / `border-green-400/20` |
| Anthropic Claude | Âmbar | `text-amber-400` / `bg-amber-400/10` / `border-amber-400/20` |
| Groq (Llama 3) | Roxo | `text-purple-400` / `bg-purple-400/10` / `border-purple-400/20` |

### 2.4 Cores Funcionais dos Ícones de Navegação (Sidebar)

| Ação/Seção | Cor do Ícone |
|---|---|
| Branding / Identidade Visual | `text-blue-500` (Palette) |
| API Keys | `text-emerald-500` (Key) |
| Estratégia & Voz | `text-amber-500` (FileText) |
| Conversor Inteligente | `text-purple-500` (Wand2) |
| Editor de Páginas | `text-indigo-500` |
| Materiais Salvos | `text-rose-500` |
| Supabase Config | `text-cyan-500` |

### 2.5 Scrollbar Customizada

```css
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: #0f172a; }
::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #eab308; }
/* Firefox */
* { scrollbar-width: thin; scrollbar-color: #3b82f6 #0f172a; }
```

---

## 3. Tipografia

### 3.1 Famílias de Fontes

| Família | CDN / Import | Uso |
|---|---|---|
| **Inter** | Google Fonts — pesos 300, 400, 500, 600, 700, 800, 900 | Fonte principal da interface e do corpo |
| **JetBrains Mono** | Google Fonts — pesos 400, 500 | Código, teclas de API, valores hexadecimais, nomes de arquivo |

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Tokens Tailwind:**
```css
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
```

### 3.2 Escala Tipográfica da Interface

| Elemento | Classes TailwindCSS | Peso |
|---|---|---|
| Títulos de seção (H1 do shell) | `text-3xl font-black text-white` | 900 |
| Títulos de painéis | `text-2xl font-black` / `text-xl font-black` | 900 |
| Labels de campos | `text-[10px] font-black text-slate-500 uppercase tracking-widest` | 900 |
| Texto de corpo | `text-sm text-slate-400 leading-relaxed` | 400 |
| Valores de input | `font-mono text-sm font-bold` | 700 |
| Badges/chips de código | `text-xs font-mono border border-slate-700` | 400 |
| Texto secundário | `text-slate-400 text-sm mt-1` | 400 |

### 3.3 Tipografia dos Materiais Gerados (padrão)

> Para o HTML gerado pela IA, o sistema injeta as seguintes diretrizes:

- **Títulos:** Sans-serif moderna, peso `Black` (900) ou `ExtraBold` (800), `tracking-tight`
- **Corpo de texto:** `Inter`, priorizando legibilidade técnica
- **Hero h1:** `text-4xl md:text-6xl font-black text-white tracking-tight leading-tight`

---

## 4. Espaçamento e Bordas

### 4.1 Border Radius

| Elemento | Valor |
|---|---|
| Cards principais / painéis grandes | `rounded-[2.5rem]` (40px) |
| Cards médios (branding, keys) | `rounded-[2rem]` (32px) |
| Cards de grid de conteúdo | `rounded-[2.5rem]` (40px) |
| Botões primários | `rounded-xl` (12px) |
| Inputs padrão | `rounded-xl` (12px) |
| Inputs especiais / color picker | `rounded-2xl` (16px) |
| Tags / badges monoespaço | `rounded-lg` (8px) |
| Ícones de serviço | `rounded-xl` ou `rounded-full` |
| Callout Section | `rounded-[3rem]` (48px) |
| Barra de Topo do Editor | `rounded-2xl` |

### 4.2 Padding

| Contexto | Valor |
|---|---|
| Painéis principais | `p-8` a `p-10` |
| Cards de conteúdo gerado | `p-8` |
| Cards da grid de API Keys | `p-6` |
| Inputs de texto | `px-4 py-3` (padrão) / `p-6` (textarea grande) |
| Color picker container | `p-3` |
| Barra de topo do editor | `p-4` |
| Controles inline (selects) | `px-3 py-2` |

### 4.3 Gap

| Contexto | Valor |
|---|---|
| Grid de API Keys (2 col) | `gap-6` |
| Grid do Editor (12 col) | `gap-6` |
| Grid de cards de conteúdo | `gap-8` |
| Espaços verticais entre seções | `space-y-6` |

---

## 5. Sombras

| Contexto | Classe |
|---|---|
| Cards principais | `shadow-lg shadow-black/20` |
| Cards com hover (elevados) | `hover:shadow-xl hover:shadow-black/40` |
| Callout hero | `shadow-2xl shadow-black/40` |
| Botão Salvar (Save CTA) | `shadow-lg shadow-blue-900/20` |
| Botão Converter | `shadow-lg shadow-purple-900/20` |
| Botão Emerald (API Keys) | `shadow-lg shadow-emerald-900/20` |
| Card hover com brand color | `box-shadow: 0 10px 30px -10px rgba(0,74,142,0.3)` |

---

## 6. Componentes do Shell (Interface do Builder)

### 6.1 Sidebar / Navegação

A sidebar usa uma lista vertical de botões com ícones `lucide-react`. O estado ativo é marcado com cor de fundo `bg-blue-600/10` e borda `border-l-2 border-blue-500`.

**Padrão de item inativo:**
```jsx
className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/50 transition-all text-sm font-bold"
```

**Padrão de item ativo:**
```jsx
className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-400 bg-blue-600/10 border-l-2 border-blue-500 font-bold text-sm"
```

### 6.2 Cards de Painel

```jsx
className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-lg shadow-black/20"
```

> Com hover elevado (content cards):
```jsx
className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/40 transition-all duration-500 group"
```

### 6.3 Inputs de Texto

**Input padrão:**
```jsx
className="w-full px-4 py-3 border border-slate-700 bg-slate-900 text-white rounded-xl font-mono text-xs outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-600 transition-all"
```

**Textarea:**
```jsx
className="flex-1 w-full p-4 border border-slate-700 bg-slate-800 text-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-600 resize-none text-sm leading-relaxed"
```

**Input de nome de arquivo (monospace):**
```jsx
className="w-full px-4 py-2 border border-slate-700 bg-slate-800 text-white rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600"
```

**Focus ring padrão:** `focus:ring-2 focus:ring-blue-600`

### 6.4 Botões

#### Botão Primário (Azul — salvar, principal CTA)
```jsx
className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95 text-sm"
```

#### Botão Emerald (Salvar API Keys)
```jsx
className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 text-sm"
```

#### Botão Purple (Converter / IA)
```jsx
className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-500 shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
```

#### Botão Ghost / Texto (Link navegacional)
```jsx
className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold"
```

#### Botão Ghost Painel (Pular/Cancelar)
```jsx
className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
```

#### Botão de ação hover destrutivo (Deletar — visível no grupo)
```jsx
className="p-2 bg-slate-700 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
```

**Micro-animação universal de press:** `active:scale-95`

### 6.5 Labels de Campo

```jsx
className="text-[10px] font-black text-slate-500 uppercase tracking-widest"
```

### 6.6 Color Picker Container

```jsx
className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-2xl border border-slate-800"
```

### 6.7 Select / Dropdown

```jsx
className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
// Wrapper:
className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-xl border border-slate-700"
```

### 6.8 Badge / Tag Monospace

```jsx
className="px-3 py-1 rounded-lg bg-slate-800 text-slate-500 text-xs font-mono border border-slate-700"
```

### 6.9 Badge de Serviço Ativo (indicador de campo preenchido)

```jsx
// Ícone CheckCircle2 verde dentro de input preenchido
className="absolute right-3 top-3 text-emerald-500"
```

### 6.10 Upload Zone (Drag & Drop)

```jsx
className="flex-1 flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-800/50 transition-all group bg-slate-800/20"
```

### 6.11 Divisor de Seção com Ação

```jsx
className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-4"
```

### 6.12 Barra de Topo com Backdrop Blur

```jsx
className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md"
```

---

## 7. Componentes dos Materiais Gerados (Conteúdo HTML)

Esses componentes React são utilizados internamente pelo builder para montar previews de página. Eles também definem a linguagem visual dos arquivos HTML exportados.

### 7.1 `HeroSection`

- **Badge superior:** pill com `Sparkles` icon, fundo `${primaryBlue}20`, texto e borda na cor primária, fonte `10px` uppercase bold
- **H1:** `text-4xl md:text-6xl font-black text-white tracking-tight leading-tight`
- **Subtítulo:** `text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed`

### 7.2 `GridSection`

- **Grid:** `grid-cols-1 md:grid-cols-3 gap-8`
- **Card:** `bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/40 transition-all duration-500 group`
- **Destaque de borda (Gold):** `borderLeft: 4px solid ${primaryGold}`
- **Contenedor do ícone:** `w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110`
- **Título:** `text-xl font-bold mb-3 text-white`
- **Descrição:** `text-sm text-slate-400 leading-relaxed`
- **Animação:** `motion.div` com `initial={{ opacity:0, y:20 }}`, `whileInView={{ opacity:1, y:0 }}`, `viewport={{ once:true }}`, delay escalonado por índice (`i * 0.1`)

### 7.3 `ComparisonSection` (Tabela Comparativa)

- **Container:** `bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-lg shadow-black/20`
- **Cabeçalho da tabela:** `text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800 bg-slate-950/50`, padding `px-8 py-6`
- **Última coluna (Gold highlight):** texto na cor `primaryGold`
- **Linha hover:** `hover:bg-slate-800/50 transition-colors`
- **Célula de dados destacada (última col):** `backgroundColor: ${primaryGold}10`, `color: primaryGold`, `fontWeight: 900`

### 7.4 `CalloutSection` (Destaque em Bloco)

- **Container:** `rounded-[3rem] overflow-hidden text-white mb-20 shadow-2xl shadow-black/40`
- **Background:** `#0f172a` (acento Gold) ou `primaryBlue` (acento Blue)
- **Layout:** `flex flex-col lg:flex-row`
- **Painel esquerdo (texto):** `p-10 lg:p-16 lg:w-3/5`
- **Label topo:** `font-bold text-[11px] uppercase tracking-[0.4em]`, cor em `primaryGold` ou `#bfdbfe`
- **H3:** `text-3xl md:text-4xl font-black mb-8 leading-tight text-white`
- **Corpo:** `text-slate-300 text-base md:text-lg leading-relaxed`
- **Painel direito (visual):** `lg:w-2/5`, background `primaryGold` ou `#2563eb`, com radial gradient branco central `opacity-20`
- **Ícone decorativo:** `ShieldCheck size={64} className="text-white/40"`

---

## 8. Animações e Efeitos

### 8.1 Framework de Animação

- **Biblioteca:** `motion/react` (Framer Motion)
- **Uso:** todas as transições de views, entrada de cards e feedback de interação

### 8.2 Transições de View (Animação de Rota)

```jsx
// Wrapped com <AnimatePresence>
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
```

### 8.3 Animação de Cards (Stagger)

```jsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ delay: i * 0.1 }}
```

### 8.4 Micro-animações CSS

| Elemento | Efeito |
|---|---|
| Ícones em cards de grid | `group-hover:scale-110` (transition) |
| Botões primários | `hover:translateY(-2px)` (Library CSS) |
| Botões de ação | `active:scale-95` (press feedback) |
| Upload zone icon | `group-hover:scale-110` |
| Botão de deletar | `opacity-0 group-hover:opacity-100` |

### 8.5 Efeitos de Foco

- **Todos os inputs/textareas:** `focus:ring-2 focus:ring-blue-600`
- Sem `outline` nativo (`outline-none`)

### 8.6 Efeitos de Glassmorphism (Header do Editor)

```css
background: rgba(15, 23, 42, 0.5);  /* bg-slate-900/50 */
backdrop-filter: blur(12px);         /* backdrop-blur-md */
```

---

## 9. Ícones

**Biblioteca:** `lucide-react` (tree-shaken imports individuais)

### Ícones em Uso na Interface

| Ícone | Contexto |
|---|---|
| `Palette` | Branding / Identidade Visual |
| `Key` | API Keys |
| `FileText` | Estratégia, Biblioteca de Prompts |
| `Code` | Código HTML gerado |
| `Eye` | Visualizar preview |
| `Sparkles` | Badge da plataforma / Gemini API |
| `Download` | Download de material |
| `FileUp` | Upload de PDF |
| `X` | Fechar modal / remover item |
| `Zap` | OpenAI / ação rápida |
| `ShieldCheck` | Qualidade / Callout decoration |
| `Activity` | Claude / métricas |
| `Layers` | Groq / agrupamentos |
| `Info` | Informação supplementar |
| `CheckCircle2` | Validação (field preenchido) |
| `ArrowRightLeft` | Conversor / troca de idioma |
| `Loader2` | Estado de carregamento (spin) |
| `Copy` / `Check` | Copiar para clipboard |
| `ChevronRight` | Navegação sequencial |
| `Settings` | Configurações |
| `Wand2` | Conversor / IA |
| `Save` | Salvar configurações |
| `Trash2` | Deletar material |
| `ExternalLink` | Abrir em nova aba |
| `History` | Histórico / materiais |
| `LogIn` / `LogOut` | Autenticação |
| `User` | Perfil do usuário |
| `Pencil` | Editar nome de material |
| `AlertTriangle` | Confirmação de exclusão |
| `Plus` | Adicionar novo item |
| `LayoutTemplate` | Templates |
| `FolderOpen` | Pasta de materiais |
| `FileCode` | Arquivo de código |
| `Lock` | Acesso restrito |

**Tamanhos padrão:** `size={14}` (labels), `size={16}` (botões), `size={18}–20` (controles), `size={40}` (empty states), `size={48–64}` (decorativos)

---

## 10. Estilos de Design dos Materiais Gerados (Biblioteca de Prompts)

A plataforma oferece **26 estilos de design pré-configurados** para geração de materiais HTML com IA. Todos geram arquivos HTML autônomos com Tailwind CDN + Lucide CDN.

| # | Estilo | Palavras-chave Visuais |
|---|---|---|
| 1 | **Padrão (Conexão Brand)** | Cores do branding, animações suaves, autônomo |
| 2 | **Neobrutalismo + Pastel Pop** | Bordas pretas espessas, Shadow-Pop sólido, pastéis vibrantes, GSAP spring |
| 3 | **Bento Grid + Glassmorphism** | Grid assimétrico, backdrop-blur, blobs animados, entrada em stagger |
| 4 | **Aurora UI + Minimalismo Orgânico** | Esferas de gradiente orbitando, tipografia serifada premium, reveal GSAP |
| 5 | **Claymorphism + Soft 3D** | Border-radius extremo, sombras inset duplas, floating animation, pastéis |
| 6 | **Retro-Futurismo Synthwave + Clean Cyberpunk** | Neon refinado (ciano + magenta), scanline, boot terminal, Space Mono |
| 7 | **Skeuomorph Moderno (Neuomorphism 2.0)** | Sombras duplas precisas, textura côncava/convexa, press button GSAP |
| 8 | **Maximalismo Tipográfico + Dark Mode** | Fontes 8xl, text-stroke, marquee, Magnetic Button JS |
| 9 | **Grainy Textures + Mono-Chrome** | feTurbulence SVG noise, mix-blend-mode, serifada editorial, cursor invertido |
| 10 | **Bauhaus Modernizado** | Grid ortogonal, tríade primária, sans-serif geométrica caixa alta, montagem GSAP |
| 11 | **Holographic / Iridescent Design** | Gradientes iridescentes, shimmer infinito, Tilt 3D GSAP, Dark Space |
| 12 | **Swiss Design + Grid Brutalism** | Helvetica/Inter, grid modular visível, Vermelho Suíço seletivo, Grid Reveal |
| 13 | **Minimalismo Japonês (Zen Design)** | Papel de arroz `#F9F6F0`, whitespace, cores naturais, linhas finíssimas |
| 14 | **Dark Academia** | Marrom escuro `#2C241B`, Playfair Display, bordas duplas, pergaminho |
| 15 | **Y2K Cyber Web** | Rosa chiclete, prata metálica, marquee, cursores personalizados |
| 16 | **Eco-Brutalismo** | Cinza concreto + verde neon, grids expostos, grotescas pesadas |
| 17 | **Cyber-Glass (Neon + Glassmorphism)** | `#09090b` fundo, painéis backdrop-blur, LEDs coloridos pulsating |
| 18 | **Retro 70s Groovy** | Laranja queimado, amarelo mostarda, pill-shapes, ondas SVG |
| 19 | **Geometria Lúdica (Modern Memphis)** | Bolinhas, triângulos flutuantes, Poppins/Quicksand, layout não-convencional |
| 20 | **Digital Scrapbook** | Rotações leves, fita adesiva (washi tape), Courier Prime + Caveat |
| 21 | **High-Fashion Editorial** | Branco, serifadas ultra-finas, espaço dramático, texto justificado |
| 22 | **Vaporwave Aesthetic** | Magenta + lavanda + pêssego, janelas Windows 95, grid de perspectiva |
| 23 | **Monocromático Vibrante** | Uma cor dominante em variações de luminosidade, sombras tonais |
| 24 | **Soft UI Clássico (Neumorphism 1.0)** | Sombras claras/escuras, tudo no mesmo tom base, textura macia |
| 25 | **Industrial Tech Wear** | Fosco `#111111`, laranja segurança, diagonais, clip-path chanfrado |
| 26 | **Gothic / Dark Fantasy** | Veludo preto, vermelho sangue, Cinzel, gradiente radial velas |
| 27 | **Pop Art / Comic Book** | Bordas grossas, halftone dots, Bangers font, balões de fala |
| 28 | **Abstract Fluid Gradients** | Mesh gradients pêssego/lavanda, clip-path orgânico (blobs) |
| 29 | **Terminal / Hacker UI** | `bg-black`, `#00FF00`, Fira Code, typewriter animation, ASCII art |
| 30 | **Surrealist Web** | Proporções distorcidas, grids quebrados, tipografia caótica organizada |
| 31 | **Art Deco Luxuoso** | `#D4AF37` dourado, fundo marinho, simetria central, convite VIP |
| 32 | **Space Age / Atomic 60s** | Jetsons aesthetic, bumerangues, órbitas, Jost/Futura, gravidade zero |

---

## 11. CSS Base da Biblioteca de Materiais

Este snippet é injetado como referência para os HTMLs gerados pela plataforma (padrão Conexão):

```css
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
}
```

---

## 12. Stack Tecnológico

| Tecnologia | Versão/Config | Uso |
|---|---|---|
| React | 18+ | Framework de UI |
| TypeScript | ✅ | Tipagem estática |
| Vite | ✅ | Build tool + Dev server |
| TailwindCSS v4 | via `@import "tailwindcss"` | Estilos utilitários |
| Framer Motion | `motion/react` | Animações declarativas |
| Lucide React | tree-shaken | Ícones SVG |
| Supabase JS | ✅ | Auth + banco de dados |
| Google Gemini SDK | `@google/genai` | Geração de conteúdo IA |
| ReactMarkdown | ✅ | Renderização de markdown |

---

## 13. Diretrizes de Tom Visual

1. **Profissional e tecnológico:** O design deve transmitir expertise técnica e inovação.
2. **Dark First:** Toda a interface principal opera em dark mode profundo (`#020617` de base).
3. **Dourado como distinção:** O acento dourado (`#c5a059`) é reservado para elementos de alta qualidade/destaque — não deve ser usado indiscriminadamente.
4. **Azul como ação/trust:** O azul primário (`#004a8e` / `blue-600`) define ações primárias e elementos de confiança.
5. **Animações suaves:** Transições de `300ms–500ms` no padrão. Nada abrupto.
6. **Tipografia hierárquica:** Labels em `10px uppercase tracking-widest`, títulos em `font-black`, corpo em peso regular.
7. **Espaçamento generoso:** Estilo bento-grid/editorial para facilitar leitura de dados técnicos.

---

*Documento gerado automaticamente a partir da análise do código-fonte do Interactive Builder — `src/App.tsx`, `src/index.css`, `BRANDING_GUIDE.md`.*
*Última atualização: 2026-03-02*
