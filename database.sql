-- SCRIPT SQL COMPLETO PARA INTERACTIVE BUILDER
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. TABELA DE PERFIS DE USUÁRIO (PROFILES)
-- Armazena informações básicas do usuário (Nome)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE CONFIGURAÇÕES DE BRANDING
CREATE TABLE IF NOT EXISTS public.branding_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    primary_blue TEXT DEFAULT '#004a8e',
    primary_gold TEXT DEFAULT '#b38e5d',
    description TEXT,
    pdf_name TEXT,
    system_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 3. TABELA DE CHAVES DE API
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL, -- 'gemini', 'openai', 'claude', 'groq'
    key_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, service_name)
);

-- 4. TABELA DE MATERIAIS GERADOS
CREATE TABLE IF NOT EXISTS public.generated_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    html_content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE BIBLIOTECA DE PROMPTS
CREATE TABLE IF NOT EXISTS public.prompt_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Pode ser nulo para estilos padrão
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false, -- Identifica se é um estilo global da plataforma
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONFIGURAÇÃO DE SEGURANÇA (RLS)
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branding_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_library ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA PROFILES
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- POLÍTICAS PARA BRANDING_CONFIGS
DROP POLICY IF EXISTS "Usuários podem gerenciar seu próprio branding" ON public.branding_configs;
CREATE POLICY "Usuários podem gerenciar seu próprio branding" 
ON public.branding_configs FOR ALL 
USING (auth.uid() = user_id);

-- POLÍTICAS PARA API_KEYS
DROP POLICY IF EXISTS "Usuários podem gerenciar suas próprias chaves" ON public.api_keys;
CREATE POLICY "Usuários podem gerenciar suas próprias chaves" 
ON public.api_keys FOR ALL 
USING (auth.uid() = user_id);

-- POLÍTICAS PARA GENERATED_MATERIALS
DROP POLICY IF EXISTS "Usuários podem gerenciar seus próprios materiais" ON public.generated_materials;
CREATE POLICY "Usuários podem gerenciar seus próprios materiais" 
ON public.generated_materials FOR ALL 
USING (auth.uid() = user_id);

-- POLÍTICAS PARA PROMPT_LIBRARY
DROP POLICY IF EXISTS "Usuários podem ver estilos padrão e os seus próprios" ON public.prompt_library;
CREATE POLICY "Usuários podem ver estilos padrão e os seus próprios" 
ON public.prompt_library FOR SELECT 
USING (is_default = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem gerenciar sua própria biblioteca" ON public.prompt_library;
CREATE POLICY "Usuários podem gerenciar sua própria biblioteca" 
ON public.prompt_library FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar sua própria biblioteca" ON public.prompt_library;
CREATE POLICY "Usuários podem atualizar sua própria biblioteca" 
ON public.prompt_library FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar sua própria biblioteca" ON public.prompt_library;
CREATE POLICY "Usuários podem deletar sua própria biblioteca" 
ON public.prompt_library FOR DELETE 
USING (auth.uid() = user_id);

-- 7. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_materials_user_id ON public.generated_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompt_library(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_is_default ON public.prompt_library(is_default);

-- 8. TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE (Opcional, mas recomendado)
-- Cria um registro na tabela profiles toda vez que um novo usuário se cadastra no auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
