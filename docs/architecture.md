# 🏛️ Arquitetura do Sistema: Aura 2026

Este documento descreve as decisões arquiteturais e o fluxo de dados do Interactive Builder.

---

## 🏗️ Visão Geral

A aplicação segue uma arquitetura **Client-Side Heavy** usando React, onde a lógica de negócio e integração com LLMs reside majoritariamente no frontend para garantir latência mínima e interatividade fluida.

### Fluxo de Transmutação (Geração de Conteúdo)

1. **Input**: O usuário fornece um prompt ou base de conhecimento.
2. **Contextualização**: O sistema injeta as diretrizes de **Branding IA** (Cores, Fontes) e o **Arquétipo de Design** selecionado.
3. **Orquestração LLM**: A requisição é enviada ao provedor selecionado (Gemini/OpenAI/etc).
4. **Finalização**: O HTML gerado é processado, limpo e persistido no Supabase.

---

## 🎨 Sistema de Design

A plataforma utiliza um sistema de design híbrido:

- **Tailwind CSS v4**: Para utilitários de layout e estilização rápida.
- **CSS Variables (Dynamic Theme)**: Variáveis injetadas via JavaScript no `:root` para permitir que a interface da plataforma mude de cor sem recarregar e sem interferir nos materiais gerados.
- **Glassmorphism**: Efeitos de desfoque e transparência aplicados em camadas (`backdrop-blur`).

---

## 🔄 Gerenciamento de Estado

- **React States**: Utilizados para estados efêmeros e controle de UI (abas, modais).
- **LocalStorage**: Utilizado para persistir o tema de preferência do operador da plataforma.
- **Supabase Realtime**: Utilizado para sincronização de dados entre sessões.

---

## 🧩 Componentes Chave

| Pasta/Arquivo | Responsabilidade |
|---------------|------------------|
| `src/App.tsx` | Orquestrador Principal, Roteamento de Abas e Estados Globais. |
| `src/lib/supabase.ts` | Configuração do cliente e conectividade. |
| `src/constants/` | Contém prompts de sistema, esquemas SQL e sementes de design. |
| `src/index.css` | Definição do tema base e utilitários de scrollbar/glass. |

---

## 🛠️ Decisões de Engenharia RECENTES

### ADR-001: Isolamento de Temas (App vs Branding)

**Status**: Aceito.
**Contexto**: O usuário precisava mudar a cor da plataforma por preferência pessoal sem que isso sobrescrevesse as cores de branding do material do cliente.
**Decisão**: Criamos o `appAccentColor` no `localStorage` e variáveis CSS específicas para a UI (`--accent-color`), separadas do `brandConfig`.
**Consequência**: Maior flexibilidade para o operador.
