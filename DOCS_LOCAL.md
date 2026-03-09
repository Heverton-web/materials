# 🖥️ Rodando o Interactive Builder Localmente

## Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9+
- Conta no [Supabase](https://supabase.com/) (gratuita)
- Chave de API do [Google AI Studio](https://aistudio.google.com/) (Gemini)

---

## 1. Clone o Repositório

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

---

## 2. Instale as Dependências

```bash
npm install
```

---

## 3. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Abra o `.env` e preencha os valores:

| Variável | Onde obter |
|---|---|
| `VITE_SUPABASE_URL` | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Mesmo local acima (anon/public key) |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `APP_URL` | Deixar como `http://localhost:3000` |

---

## 4. Configure o Banco de Dados (Supabase)

No [Supabase Dashboard](https://supabase.com/dashboard):

1. Acesse seu projeto → **SQL Editor**
2. Clique em **New Query**
3. Cole o conteúdo do arquivo `database.sql` (na raiz do projeto)
4. Clique em **Run** para executar

> **Nota:** Este script cria todas as tabelas, políticas de segurança (RLS) e triggers necessários.

---

## 5. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

---

## Comandos Úteis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção na pasta `dist/` |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | Verifica erros de TypeScript |
| `npm run test` | Executa os testes automatizados |

---

## Solução de Problemas

**Erro de CORS ou autenticação Supabase:**
- Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretos no `.env`.
- No Supabase Dashboard → Authentication → URL Configuration, adicione `http://localhost:3000` nas **Redirect URLs** e **Site URL**.

**Erro 401/403 nas chamadas à API Gemini:**
- Confirme que `GEMINI_API_KEY` está correta e ativa no Google AI Studio.
