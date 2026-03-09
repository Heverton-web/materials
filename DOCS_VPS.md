# 🖧 Deploy em VPS (Contabo / Ubuntu) — Interactive Builder

## Pré-requisitos

- VPS com **Ubuntu 22.04 LTS** ou superior (mínimo: 2 vCPU, 4 GB RAM)
- Acesso SSH à VPS
- Domínio apontado para o IP da VPS (recomendado)
- Conta no [Supabase](https://supabase.com/) com banco configurado
- Chave de API do [Google AI Studio](https://aistudio.google.com/) (Gemini)

---

## 1. Conecte-se à VPS via SSH

```bash
ssh root@IP_DA_SUA_VPS
```

---

## 2. Atualize o Sistema e Instale o Node.js

```bash
# Atualiza pacotes do sistema
apt update && apt upgrade -y

# Instala o Node.js 20 (versão LTS) via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verifica a instalação
node -v   # Deve exibir v20.x.x
npm -v    # Deve exibir 10.x.x
```

---

## 3. Instale o Nginx e o Certbot (SSL)

```bash
apt install -y nginx certbot python3-certbot-nginx

# Habilita o Nginx na inicialização
systemctl enable nginx
systemctl start nginx
```

---

## 4. Configure o Banco de Dados (Supabase)

No [Supabase Dashboard](https://supabase.com/dashboard):

1. Crie ou abra seu projeto
2. Acesse **SQL Editor** → **New Query**
3. Cole o conteúdo do arquivo `database.sql` e clique em **Run**

---

## 5. Clone o Repositório no Servidor

```bash
# Navega para o diretório de sites
cd /var/www

# Clona o repositório
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git interactive-builder
cd interactive-builder
```

---

## 6. Configure as Variáveis de Ambiente

```bash
# Copia o arquivo de exemplo
cp .env.example .env

# Edita o arquivo com suas credenciais
nano .env
```

Preencha os valores no editor:

```env
VITE_SUPABASE_URL="https://SEU_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="SUA_ANON_KEY"
GEMINI_API_KEY="SUA_GEMINI_KEY"
APP_URL="https://seudominio.com"
```

Salve com `Ctrl+O`, `Enter`, depois `Ctrl+X`.

---

## 7. Instale as Dependências e Gere o Build

```bash
npm install
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`.

---

## 8. Configure o Nginx

Crie o arquivo de configuração do Nginx:

```bash
nano /etc/nginx/sites-available/interactive-builder
```

Cole o conteúdo abaixo (substitua `seudominio.com`):

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    root /var/www/interactive-builder/dist;
    index index.html;

    # SPA: redireciona todas as rotas para o index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets estáticos (JS, CSS, imagens)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Bloqueia acesso a arquivos sensíveis
    location ~ /\.(env|git) {
        deny all;
    }
}
```

Salve e ative a configuração:

```bash
# Habilita o site
ln -s /etc/nginx/sites-available/interactive-builder /etc/nginx/sites-enabled/

# Remove o site padrão
rm -f /etc/nginx/sites-enabled/default

# Testa a configuração
nginx -t

# Reinicia o Nginx
systemctl reload nginx
```

---

## 9. Configure o SSL com Certbot (HTTPS)

```bash
certbot --nginx -d seudominio.com -d www.seudominio.com
```

Siga as instruções interativas. O Certbot configurará o HTTPS automaticamente e renovará o certificado a cada 90 dias.

---

## 10. Configure a URL no Supabase

1. Acesse o **Supabase Dashboard** → seu projeto
2. **Authentication** → **URL Configuration**
3. **Site URL:** `https://seudominio.com`
4. **Redirect URLs:** adicione `https://seudominio.com/**`

---

## 11. Configure o Firewall (ufw)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## Atualizando a Aplicação (Deploy de Novas Versões)

Quando houver uma nova versão do código:

```bash
cd /var/www/interactive-builder

# Puxa as atualizações do Git
git pull origin main

# Instala novas dependências (se houver)
npm install

# Regera o build
npm run build

# Nginx serve os arquivos automaticamente, sem reiniciar
echo "✅ Deploy concluído!"
```

> **Dica:** Você pode criar um script `deploy.sh` com esses comandos para automatizar o processo.

---

## Monitoramento Básico

```bash
# Status do Nginx
systemctl status nginx

# Logs de acesso
tail -f /var/log/nginx/access.log

# Logs de erro
tail -f /var/log/nginx/error.log

# Uso de disco e memória
df -h && free -h
```

---

## Solução de Problemas

**Página não carrega após configurar o Nginx:**

- Execute `nginx -t` para verificar erros de sintaxe.
- Verifique se o build foi gerado: `ls /var/www/interactive-builder/dist/`

**Erro 502 Bad Gateway:**

- Não se aplica a SPAs estáticas. Verifique o `root` no Nginx.

**Erro de autenticação Supabase:**

- Confirme que o domínio está nas Redirect URLs do Supabase.
- Certifique-se que o HTTPS está funcionando (o Supabase exige HTTPS em produção).

**Certificado SSL não renova:**

```bash
certbot renew --dry-run
```
