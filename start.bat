@echo off
:: Navega para a nova pasta
cd /d "C:\Docker\N8N-PROD"

:: Mata processos antigos para evitar o erro EPERM
call pm2 kill
taskkill /f /im node.exe 2>nul

:: Inicia usando o novo caminho
call pm2 start ecosystem.config.js

:: Salva para garantir
call pm2 save --force