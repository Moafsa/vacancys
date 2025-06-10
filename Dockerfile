# --- BUILDER STAGE ---
# Usa uma imagem Node.js para construir a aplicação
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
# Isso ajuda a otimizar o cache do Docker, rodando npm install apenas se esses arquivos mudarem
COPY package.json package-lock.json ./
COPY modules/core/package.json modules/core/package-lock.json ./modules/core/
COPY components ./components
COPY components/dashboard/FreelancerLayout.jsx ./components/dashboard/FreelancerLayout.jsx
COPY components/dashboard/TestComponent.jsx ./components/dashboard/TestComponent.jsx

# Instala as dependências. Usa npm ci para instalações limpas e consistentes.
# Isso instalará tanto devDependencies quanto dependencies.
RUN npm ci
RUN cd modules/core && npm ci

# Copia o restante do código fonte da aplicação
COPY . .

# Debug: listar arquivos da pasta components/dashboard
RUN ls -l /app/components/dashboard

# Gera o cliente Prisma.
# IMPORTANTE: Este comando deve ser executado na raiz do WORKDIR (/app)
# e apontar para o schema.prisma na raiz.
RUN npx prisma generate --schema=./prisma/schema.prisma

# Constrói a aplicação (Next.js build)
# Isso criará o output .next e potencialmente outros artefatos
RUN npm run build


# --- PRODUCTION STAGE ---
# Usa uma imagem Node.js mais leve para a imagem final de produção
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala OpenSSL, que pode ser necessário para conexões SSL (como com Supabase)
RUN apk add --no-cache openssl

# Copia APENAS os arquivos package.json e package-lock.json
COPY package.json package-lock.json ./
COPY modules/core/package.json modules/core/package-lock.json ./modules/core/

# Instala APENAS as dependências de produção
RUN npm ci --only=production
RUN cd modules/core && npm ci --only=production

# Copia os artefatos construídos e o cliente Prisma gerado do builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/modules ./modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client


# Cria o diretório de uploads (garante que ele exista)
# Alternativamente, você pode gerenciar uploads via volume mount externo
RUN mkdir -p uploads

# Define variáveis de ambiente padrão (podem ser sobrescritas pelo .env ou docker-compose.yml)
ENV NODE_ENV=production
ENV PORT=3000

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação em produção
CMD ["npm", "start"]