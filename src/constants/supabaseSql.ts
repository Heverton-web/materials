export const SUPABASE_TABLES_SQL = `-- 1. Profiles (Tabela de usuários)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. API Keys (Chaves de IA)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL, -- 'gemini', 'openai', 'claude', 'groq'
  key_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Branding Configs (Configurações de Marca e Supabase)
CREATE TABLE IF NOT EXISTS branding_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  primary_blue TEXT DEFAULT '#004a8e',
  primary_gold TEXT DEFAULT '#c5a059',
  description TEXT,
  pdf_name TEXT,
  system_prompt TEXT,
  supabase_url TEXT,
  supabase_anon_key TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. Generated Materials (Histórico de Materiais)
CREATE TABLE IF NOT EXISTS generated_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Prompt Library (Biblioteca de Prompts)
CREATE TABLE IF NOT EXISTS prompt_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_library ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (Apenas o dono pode ver/editar seus dados)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can manage own api keys') THEN
        CREATE POLICY "Users can manage own api keys" ON api_keys FOR ALL USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can manage own branding') THEN
        CREATE POLICY "Users can manage own branding" ON branding_configs FOR ALL USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can manage own materials') THEN
        CREATE POLICY "Users can manage own materials" ON generated_materials FOR ALL USING (auth.uid() = user_id);
    END IF;
    -- Remover política antiga se existir
    DROP POLICY IF EXISTS "Users can manage own prompts" ON prompt_library;

    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can select own or default prompts') THEN
        CREATE POLICY "Users can select own or default prompts" ON prompt_library FOR SELECT USING (is_default = true OR auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can insert own prompts') THEN
        CREATE POLICY "Users can insert own prompts" ON prompt_library FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can update own prompts') THEN
        CREATE POLICY "Users can update own prompts" ON prompt_library FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can delete own prompts') THEN
        CREATE POLICY "Users can delete own prompts" ON prompt_library FOR DELETE USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Script para adicionar colunas se a tabela já existir sem elas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='branding_configs' AND column_name='pdf_name') THEN
        ALTER TABLE branding_configs ADD COLUMN pdf_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='branding_configs' AND column_name='system_prompt') THEN
        ALTER TABLE branding_configs ADD COLUMN system_prompt TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='branding_configs' AND column_name='supabase_url') THEN
        ALTER TABLE branding_configs ADD COLUMN supabase_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='branding_configs' AND column_name='supabase_anon_key') THEN
        ALTER TABLE branding_configs ADD COLUMN supabase_anon_key TEXT;
    END IF;

    -- Migração para prompt_library (renomear colunas se necessário)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prompt_library' AND column_name='name') THEN
        ALTER TABLE prompt_library RENAME COLUMN name TO title;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prompt_library' AND column_name='prompt_text') THEN
        ALTER TABLE prompt_library RENAME COLUMN prompt_text TO content;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prompt_library' AND column_name='description') THEN
        ALTER TABLE prompt_library ADD COLUMN description TEXT;
    END IF;
END
$$;
`;
