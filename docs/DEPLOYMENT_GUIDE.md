# Guia de Deploy - Vacancy.service

Este guia detalha o processo de deploy do Vacancy.service, primeiro em Docker local e depois na Vercel.

## 📋 Pré-requisitos

### Para Docker Local
- Docker Desktop instalado e rodando
- PowerShell (Windows) ou Terminal (Linux/Mac)
- Arquivo `.env` configurado com as variáveis necessárias

### Para Vercel
- Conta na Vercel (https://vercel.com)
- Vercel CLI instalado: `npm i -g vercel`
- Conta no Supabase com banco PostgreSQL criado
- Servidor Redis configurado e acessível

## 🔧 Configuração das Variáveis de Ambiente

### 1. Criar arquivo `.env` na raiz do projeto

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?schema=public&pgbouncer=true&connection_limit=1"

# JWT Secret (gere uma chave forte)
JWT_SECRET="sua-chave-secreta-super-forte-aqui"

# Redis Configuration
REDIS_URL="redis://default:[password]@[host]:[port]"

# Application
NODE_ENV="production"
PORT="3000"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 2. Obter as URLs do Supabase

1. Acesse seu projeto no Supabase
2. Vá em Settings > Database
3. Copie a "Connection string" (use a versão "Pooling" para Vercel)
4. Adicione `?pgbouncer=true&connection_limit=1` ao final da URL

### 3. Configurar Redis

Se você não tem um servidor Redis, algumas opções:
- **Upstash**: https://upstash.com (grátis até 10k comandos/dia)
- **Redis Cloud**: https://redis.com/try-free/
- **Seu próprio servidor**: Configure com senha forte

## 🐳 Deploy no Docker Local

### 1. Preparar o ambiente

```powershell
# Verificar se o Docker está rodando
docker --version

# Clonar o repositório (se ainda não tiver)
git clone https://github.com/seu-usuario/vacancy.service.git
cd vacancy.service
```

### 2. Executar o script de build

```powershell
# No PowerShell
.\scripts\docker-build.ps1
```

O script irá:
- Validar as variáveis de ambiente
- Construir a imagem Docker otimizada
- Perguntar se deseja iniciar o container
- Verificar o health check dos serviços

### 3. Verificar se está funcionando

- Acesse: http://localhost:3000
- Verifique o health check: http://localhost:3000/api/health
- Veja os logs: `docker-compose -f docker-compose.production.yml logs -f`

### 4. Comandos úteis do Docker

```powershell
# Parar o container
docker-compose -f docker-compose.production.yml down

# Ver logs
docker-compose -f docker-compose.production.yml logs -f

# Reiniciar
docker-compose -f docker-compose.production.yml restart

# Limpar tudo (cuidado!)
docker-compose -f docker-compose.production.yml down -v
```

## 🚀 Deploy na Vercel

### 1. Preparar o projeto

```powershell
# Instalar dependências
npm install

# Testar build local
npm run build
```

### 2. Configurar variáveis no Vercel

1. Acesse: https://vercel.com/dashboard
2. Crie um novo projeto ou selecione o existente
3. Vá em Settings > Environment Variables
4. Adicione as seguintes variáveis:
   - `DATABASE_URL` (Supabase connection string)
   - `REDIS_URL` (Redis connection string)
   - `JWT_SECRET` (sua chave secreta)
   - `NODE_ENV` = "production"

### 3. Deploy via CLI

```powershell
# No PowerShell
.\scripts\deploy-vercel.ps1
```

Ou manualmente:

```bash
# Login na Vercel (primeira vez)
vercel login

# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

### 4. Configurar Prisma para Edge Runtime

Se encontrar erros do Prisma na Vercel, adicione ao `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## 🔍 Troubleshooting

### Erro: "Can't resolve 'prisma'"
- Execute: `npm install @prisma/client prisma`
- Depois: `npx prisma generate`

### Erro: "ECONNREFUSED" no Redis
- Verifique se a URL do Redis está correta
- Teste a conexão: `redis-cli -u $REDIS_URL ping`

### Erro: "SSL connection required" (Supabase)
- Adicione `?sslmode=require` à DATABASE_URL
- Para Vercel, use a connection string "Pooling"

### Build falha no Docker
- Verifique se todas as dependências estão no `package.json`
- Limpe o cache: `docker system prune -a`
- Reconstrua: `docker-compose build --no-cache`

### Deploy falha na Vercel
- Verifique os logs em: https://vercel.com/dashboard
- Certifique-se que todas as variáveis estão configuradas
- Teste localmente primeiro: `vercel dev`

## 📊 Monitoramento

### Health Check
- Local: http://localhost:3000/api/health
- Produção: https://seu-app.vercel.app/api/health

### Logs
- Docker: `docker-compose logs -f`
- Vercel: Dashboard > Functions > Logs

### Métricas
- Vercel: Dashboard > Analytics
- Supabase: Dashboard > Database > Metrics
- Redis: Depende do provedor

## 🔒 Segurança

1. **JWT_SECRET**: Use uma chave forte (mínimo 32 caracteres)
2. **Database**: Use connection pooling e SSL
3. **Redis**: Configure senha forte e SSL se possível
4. **CORS**: Configure adequadamente no `vercel.json`
5. **Rate Limiting**: Já configurado nas API routes

## 📝 Checklist de Deploy

- [ ] Arquivo `.env` criado e configurado
- [ ] Banco de dados Supabase criado e acessível
- [ ] Redis configurado e acessível
- [ ] Build local testado com sucesso
- [ ] Docker local funcionando corretamente
- [ ] Variáveis configuradas no Vercel Dashboard
- [ ] Deploy de preview testado
- [ ] Health check retornando "ok"
- [ ] Funcionalidades principais testadas

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs detalhadamente
2. Confirme todas as variáveis de ambiente
3. Teste cada serviço individualmente
4. Consulte a documentação dos serviços externos

---

**Nota**: Este guia assume que você está usando Windows com PowerShell. Para Linux/Mac, adapte os comandos conforme necessário. 