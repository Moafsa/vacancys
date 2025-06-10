#!/bin/bash

# Script para implantação do módulo Core em diferentes ambientes
# Uso: ./deploy.sh [ambiente]
# Onde [ambiente] pode ser: dev, staging, production

set -e

ENVIRONMENT=${1:-dev}
TIMESTAMP=$(date +%Y%m%d%H%M%S)
DOCKER_REPO="vacancy/core-module"

echo "Iniciando implantação para ambiente: $ENVIRONMENT"

# Validação do ambiente
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  echo "Ambiente inválido. Use: dev, staging ou production"
  exit 1
fi

# Carregando variáveis de ambiente específicas
if [ -f ".env.$ENVIRONMENT" ]; then
  echo "Carregando variáveis de ambiente de .env.$ENVIRONMENT"
  source .env.$ENVIRONMENT
else
  echo "Arquivo .env.$ENVIRONMENT não encontrado. Usando variáveis de ambiente padrão."
fi

# Funções específicas para cada ambiente
deploy_dev() {
  echo "Implantando em ambiente de desenvolvimento..."
  npm run build
  npm run start:dev
}

deploy_staging() {
  echo "Implantando em ambiente de staging..."
  
  # Build da imagem Docker
  docker build -t $DOCKER_REPO:staging-$TIMESTAMP .
  docker tag $DOCKER_REPO:staging-$TIMESTAMP $DOCKER_REPO:staging-latest
  
  # Autenticação no Docker Hub (requer variáveis de ambiente DOCKER_USERNAME e DOCKER_PASSWORD)
  if [ -n "$DOCKER_USERNAME" ] && [ -n "$DOCKER_PASSWORD" ]; then
    echo "Fazendo login no Docker Hub..."
    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
    
    # Push da imagem
    docker push $DOCKER_REPO:staging-$TIMESTAMP
    docker push $DOCKER_REPO:staging-latest
  else
    echo "Variáveis DOCKER_USERNAME e/ou DOCKER_PASSWORD não definidas. Pulando push para o Docker Hub."
  fi
  
  # Implantação no servidor de staging (exemplo com ssh)
  if [ -n "$STAGING_SERVER" ] && [ -n "$STAGING_SSH_KEY" ]; then
    echo "Implantando no servidor de staging..."
    ssh -i $STAGING_SSH_KEY $STAGING_SERVER "docker pull $DOCKER_REPO:staging-latest && \
      docker-compose -f docker-compose.staging.yml up -d"
  else
    echo "Variáveis STAGING_SERVER e/ou STAGING_SSH_KEY não definidas. Pulando implantação remota."
  fi
}

deploy_production() {
  echo "Implantando em ambiente de produção..."
  
  # Build da imagem Docker
  docker build -t $DOCKER_REPO:production-$TIMESTAMP .
  docker tag $DOCKER_REPO:production-$TIMESTAMP $DOCKER_REPO:production-latest
  
  # Autenticação no Docker Hub
  if [ -n "$DOCKER_USERNAME" ] && [ -n "$DOCKER_PASSWORD" ]; then
    echo "Fazendo login no Docker Hub..."
    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
    
    # Push da imagem
    docker push $DOCKER_REPO:production-$TIMESTAMP
    docker push $DOCKER_REPO:production-latest
  else
    echo "Variáveis DOCKER_USERNAME e/ou DOCKER_PASSWORD não definidas. Pulando push para o Docker Hub."
  fi
  
  # Implantação no servidor de produção (exemplo com ssh)
  if [ -n "$PRODUCTION_SERVER" ] && [ -n "$PRODUCTION_SSH_KEY" ]; then
    echo "Implantando no servidor de produção..."
    ssh -i $PRODUCTION_SSH_KEY $PRODUCTION_SERVER "docker pull $DOCKER_REPO:production-latest && \
      docker-compose -f docker-compose.production.yml up -d"
  else
    echo "Variáveis PRODUCTION_SERVER e/ou PRODUCTION_SSH_KEY não definidas. Pulando implantação remota."
  fi
}

# Executando a função de implantação apropriada
case "$ENVIRONMENT" in
  dev)
    deploy_dev
    ;;
  staging)
    deploy_staging
    ;;
  production)
    deploy_production
    ;;
esac

echo "Implantação para $ENVIRONMENT concluída com sucesso!" 