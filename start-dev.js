// Script alternativo para iniciar o servidor de desenvolvimento
const { exec } = require('child_process');
const path = require('path');

// Definir variáveis de ambiente
process.env.JWT_SECRET = process.env.JWT_SECRET || 'umasecretfortedev123456';

console.log('Iniciando o servidor Next.js...');

// Iniciar o servidor Next.js diretamente
const nextProcess = exec('npx next dev', {
  env: process.env
});

nextProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

nextProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

nextProcess.on('exit', (code) => {
  console.log(`Processo Next.js encerrado com código ${code}`);
});

console.log('Servidor iniciado! Pressione Ctrl+C para encerrar.'); 