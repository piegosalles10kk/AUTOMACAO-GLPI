@echo off
title Sistema Integrado - n8n + Evolution (PROD)
color 0b

:: --- CONFIGURAÇÕES DE AMBIENTE ---
set N8N_ENCRYPTION_KEY=b7a9f82d3e1c4b5a6d7e8f90a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
set N8N_SECURE_COOKIE=false
set NODE_FUNCTION_ALLOW_EXTERNAL=*

:: Define onde o banco de dados do n8n será salvo (na nova pasta PROD)
set N8N_USER_FOLDER=C:\Docker\N8N-PROD\n8n-local\.n8n

echo =======================================================
echo    INICIANDO SERVICOS (Modo Local - Janelas Abertas)
echo    Caminho: C:\Docker\N8N-PROD
echo =======================================================

:: 1. Inicia o n8n
echo [1/2] Iniciando n8n...
start "SERVICO: n8n" cmd /k "cd /d C:\Docker\N8N-PROD\n8n-local && node node_modules\n8n\bin\n8n"

:: 2. Inicia a Evolution API
echo [2/2] Iniciando Evolution API...
start "SERVICO: Evolution API" cmd /k "cd /d C:\Docker\N8N-PROD\evolution-api && npm run start:prod"

echo.
echo =======================================================
echo    TUDO PRONTO!
echo    - n8n: http://localhost:5678
echo    - Evolution: Porta 8081
echo.
echo    Mantenha as janelas abertas para os servicos funcionarem.
echo =======================================================
pause