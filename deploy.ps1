# Verificar se os schemas do Prisma existem
Write-Host "Verificando schemas do Prisma..."
if (-not (Test-Path -Path "prisma/schema.prisma")) {
    Write-Error "Erro: schema.prisma não encontrado em prisma/schema.prisma"
    exit 1
}
if (-not (Test-Path -Path "modules/core/prisma/schema.prisma")) {
    Write-Error "Erro: schema.prisma não encontrado em modules/core/prisma/schema.prisma"
    exit 1
}

# Stop and remove existing containers
Write-Host "Parando containers existentes..."
docker-compose down

# Remove old images
Write-Host "Removendo imagens antigas..."
docker rmi vacancy-service_app -f

# Build and start services
Write-Host "Construindo e iniciando serviços..."
docker-compose up -d --build

# Wait for services to be healthy
Write-Host "Aguardando serviços ficarem saudáveis..."
Start-Sleep -Seconds 30

# Run database migrations
Write-Host "Executando migrações do banco de dados..."
docker-compose exec app npx prisma migrate deploy --schema=/app/prisma/schema.prisma
docker-compose exec app sh -c "cd modules/core && npx prisma migrate deploy --schema=/app/modules/core/prisma/schema.prisma"

# Show logs
Write-Host "Exibindo logs..."
docker-compose logs -f app 