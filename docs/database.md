# 💾 Esquema de Dados: Supabase

O Interactive Builder utiliza o Supabase para armazenamento persistente, autenticação e segurança via RLS (Row Level Security).

---

## 📋 Tabelas Principais

### 1. `generated_materials`

Armazena todos os HTMLs e metadados gerados pela IA.

- `id`: UUID (PK)
- `user_id`: UUID (FK)
- `name`: Text (Nome do arquivo)
- `html_content`: Text (Código gerado)
- `metadata`: JSONB (Título, Descrição, Tags, **Estilo Utilizado**)
- `created_at`: Timestamptz

### 2. `brand_presets`

Configurações de identidade visual para os materiais.

- `id`: UUID (PK)
- `user_id`: UUID (FK)
- `name`: Text
- `primary_color`: Text (HEX)
- `secondary_color`: Text (HEX)
- `font_family`: Text
- `description`: Text (Tom de voz/Estratégia)
- `is_active`: Boolean

### 3. `api_keys`

Credenciais para os provedores de LLM.

- `id`: UUID (PK)
- `user_id`: UUID (FK)
- `service_name`: Text (gemini, openai, claude, groq)
- `key_value`: Text (Encriptado em trânsito)

---

## 🔒 Segurança (RLS)

Todas as tabelas possuem políticas de RLS ativadas:

- **SELECT**: `auth.uid() = user_id`
- **INSERT**: `auth.uid() = user_id`
- **UPDATE**: `auth.uid() = user_id`
- **DELETE**: `auth.uid() = user_id`

Isso garante que um usuário nunca tenha acesso aos materiais ou chaves de API de outro usuário.

---

## 🛠️ Manutenção

Para atualizar o esquema do banco, utilize o script SQL disponível na aba **"Infra & Tema"** dentro da aplicação ou consulte o arquivo `src/constants/supabaseSql.ts`.
