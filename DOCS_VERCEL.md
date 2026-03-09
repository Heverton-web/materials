# ▲ Deploy na Vercel — Interactive Builder

## Pré-requisitos

- Conta gratuita na [Vercel](https://vercel.com/)
- Repositório no GitHub (ou GitLab / Bitbucket)
- Conta no [Supabase](https://supabase.com/) com banco configurado
- Chave de API do [Google AI Studio](https://aistudio.google.com/) (Gemini)

---

## 1. Prepare o Repositório no GitHub

Se ainda não fez isso, publique o projeto:

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

---

## 2. Configure o Banco de Dados (Supabase)

No [Supabase Dashboard](https://supabase.com/dashboard):

1. Crie ou abra seu projeto
2. Acesse **SQL Editor** → **New Query**
3. Cole o conteúdo do arquivo `database.sql` e clique em **Run**
4. Vá em **Authentication** → **URL Configuration** e adicione a URL da Vercel nas **Redirect URLs** (você vai obter a URL no passo 4)

---

## 3. Importe o Projeto na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e faça login
2. Clique em **Import Git Repository**
3. Selecione seu repositório e clique em **Import**
4. Na tela de configuração:
   - **Framework Preset:** Vite (detectado automaticamente)
   - **Root Directory:** `./` (raiz do projeto)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

---

## 4. Configure as Variáveis de Ambiente na Vercel

Ainda na tela de importação (ou após, em **Settings → Environment Variables**), adicione:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon/public do Supabase |
| `GEMINI_API_KEY` | Sua chave do Google AI Studio |
| `APP_URL` | URL da sua aplicação Vercel (ex: `https://meuapp.vercel.app`) |

> **Como obter as credenciais do Supabase:**
> Dashboard → Settings → API → Project URL e anon key

---

## 5. Faça o Deploy

Clique em **Deploy**. A Vercel irá:

1. Instalar dependências (`npm install`)
2. Executar o build (`npm run build`)
3. Publicar os arquivos estáticos da pasta `dist/`

Ao final, você receberá uma URL no formato `https://seu-projeto.vercel.app`.

---

## 6. Configure a URL no Supabase

Após obter sua URL da Vercel, volte ao Supabase:

1. **Authentication** → **URL Configuration**
2. **Site URL:** `https://seu-projeto.vercel.app`
3. **Redirect URLs:** adicione `https://seu-projeto.vercel.app/**`

---

## 7. Deploys Automáticos (CI/CD)

A Vercel detecta commits automaticamente. Toda vez que você fizer `git push` na branch `main`, um novo deploy será disparado automaticamente. ✅

---

## Domínio Customizado (Opcional)

1. Acesse **Settings → Domains** no painel da Vercel
2. Adicione seu domínio (ex: `meuapp.com.br`)
3. Siga as instruções para configurar os registros DNS no seu provedor de domínio
4. Atualize o **Site URL** e **Redirect URLs** no Supabase com o novo domínio

---

## Solução de Problemas

**Build falhou com erro de variável de ambiente:**

- Certifique-se que todas as variáveis com prefixo `VITE_` estão configuradas na Vercel.
- Variáveis `VITE_*` são expostas no frontend pelo Vite em tempo de build.

**Erro de autenticação após o deploy:**

- Verifique se a URL da Vercel está corretamente adicionada nas Redirect URLs do Supabase.
