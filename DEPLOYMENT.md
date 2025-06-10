# 🚀 Deployment Quick Start - Vacancy.service

## Configuração Rápida

### 1. Crie o arquivo `.env` na raiz do projeto:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?schema=public&pgbouncer=true&connection_limit=1"

# JWT Secret (mínimo 32 caracteres)
JWT_SECRET="sua-chave-secreta-super-forte-aqui-32-chars-min"

# Redis Configuration  
REDIS_URL="redis://default:[password]@[host]:[port]"

# Application
NODE_ENV="production"
PORT="3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 2. Deploy no Docker Local

```powershell
# Windows PowerShell
.\scripts\docker-build.ps1

# Ou manualmente
docker-compose -f docker-compose.production.yml up -d
```

### 3. Deploy na Vercel

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Deploy
.\scripts\deploy-vercel.ps1

# Ou manualmente
vercel --prod
```

## Links Importantes

- **Supabase**: https://supabase.com (para PostgreSQL)
- **Upstash**: https://upstash.com (para Redis gratuito)
- **Vercel**: https://vercel.com (para hosting)

## Verificar Deploy

- Health Check: `/api/health`
- Logs Docker: `docker-compose -f docker-compose.production.yml logs -f`
- Logs Vercel: Dashboard > Functions > Logs

Para mais detalhes, veja [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) 