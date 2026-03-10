# 📑 Changelog: Aura 2026

## [Versão 2.1.0] - 2026-03-10

### Adicionado

- **Exportação Massiva**: Novo sistema de seleção múltipla de materiais com download em arquivo **ZIP** via `JSZip`.
- **Identificação de Estilo**: Metadados de cada material agora rastreiam e exibem o arquétipo de design utilizado para sua criação diretamente no card.
- **Personalização de Interface**: Adicionado seletor de cor global na plataforma, permitindo que o operador escolha seu tema de trabalho (Orange, Blue, Green, etc.) de forma autônoma.
- **Persistência de Tema**: O tema escolhido pelo usuário é salvo no `localStorage` para ser lembrado entre as sessões.
- **Injeção Dinâmica de Estilo**: Sistema de estilo injetado via JS para garantir que scrollbars e elementos de sistema respondam instantaneamente às trocas de cor.

### Alterado

- **Arquitetura de Cores**: Isolamento completo entre `AppAccentColor` (Interface) e `BrandingConfig` (Material Gerado).
- **Interface de Apoio**: A aba "API Keys" foi reestruturada para **"Infra & Tema"**, consolidando configurações de infraestrutura e estética da plataforma.
- **Labels de Branding**: Atualizados para reforçar que as cores de branding afetam apenas o material gerado para os clientes.

### Corrigido

- Sincronização de scrollbars em navegadores Chrome/Edge durante a troca de temas dinâmicos.
- Consistência de seleção: materiais deletados são automaticamente removidos da lista de seleção para download.

---

## [Versão 2.0.0] - 2026-03-03

### Adicionado

- Integração profunda com **Supabase** (Auth, DB, RLS).
- Suporte multilingue para nomes de arquivos e metadados.
- Novo Editor de Conteúdo com suporte a Markdown.

---

## [Versão 1.0.0] - 2026-02-18

- Lançamento inicial do Interactive Builder Aura.
- Suporte a Gemini e arquétipos de design base.
