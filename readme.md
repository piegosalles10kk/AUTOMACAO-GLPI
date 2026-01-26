# MCP Bug - Sistema de Gestão de Service Desk com IA

Sistema integrado de gestão de chamados com automação via IA, utilizando n8n, Evolution API e GLPI.

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Requisitos do Sistema](#requisitos-do-sistema)
3. [Instalação](#instalação)
4. [Configuração](#configuração)
5. [Documentação da API](#documentação-da-api)
6. [Documentação dos Agentes](#documentação-dos-agentes)
7. [Interface de Gerenciamento](#interface-de-gerenciamento)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema MCP Bug é uma solução completa para automação de service desk que integra:

- **API de Gerenciamento**: Backend Node.js com Express e MongoDB
- **n8n**: Plataforma de automação de workflows
- **Evolution API**: Integração com WhatsApp
- **GLPI**: Sistema de gestão de chamados
- **3 Agentes IA**:
  - **BUGBOT**: Atendimento automatizado via WhatsApp
  - **GESTOR SERVICE DESK**: Distribuição inteligente de chamados
  - **GESTOR CATEGORIA**: Classificação automática de tickets

---

## 💻 Requisitos do Sistema

### Software Necessário

- **Node.js**: v20.19.0 ou superior
- **MongoDB**: v6.0 ou superior
- **PM2**: Para gerenciamento de processos
- **Git**: Para controle de versão
- **PostgreSQL**: v15 ou superior (para n8n)
- **Redis**: v7 (para Evolution API)
- **RabbitMQ**: v3 (para Evolution API)

### Portas Utilizadas

- **2500**: API de Gerenciamento
- **5678**: n8n
- **8081**: Evolution API
- **5432**: PostgreSQL
- **6379**: Redis
- **5672/15672**: RabbitMQ

---

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd N8N-PROD
```

### 2. Instale as Dependências

#### API de Gerenciamento
```bash
npm install
```

#### n8n
```bash
cd n8n-local
npm install
cd ..
```

#### Evolution API
```bash
cd evolution-api
npm install
cd ..
```

### 3. Configure o MongoDB

```bash
# Inicie o MongoDB
mongod --dbpath /caminho/para/dados

# Ou usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Configure o Docker (PostgreSQL, Redis, RabbitMQ)

```bash
docker-compose up -d
```

Este comando iniciará:
- PostgreSQL (para n8n)
- Redis (para Evolution API)
- RabbitMQ (para Evolution API)

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/MCP

# Servidor
PORT=2500

# GLPI
GLPI_API_URL=https://chamados.bugbusters.me/apirest.php/
GLPI_APP_TOKEN=seu_token_aqui
GLPI_USER_LOGIN=seu_usuario
GLPI_USER_PASSWORD=sua_senha

# n8n
N8N_ENCRYPTION_KEY=b7a9f82d3e1c4b5a6d7e8f90a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
N8N_SECURE_COOKIE=false
NODE_FUNCTION_ALLOW_EXTERNAL=*

# PostgreSQL (n8n)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=evolution_db
DB_POSTGRESDB_USER=evolution_user
DB_POSTGRESDB_PASSWORD=evolution_password

# Evolution API
EVOLUTION_API_URL=http://localhost:8081
EVOLUTION_API_KEY=sua_chave_api
```

### 2. Configuração do n8n

```bash
cd n8n-local
# O n8n usará as variáveis de ambiente definidas no ecosystem.config.js
```

### 3. Configuração da Evolution API

Configure a Evolution API através do arquivo de configuração ou variáveis de ambiente conforme documentação oficial.

### 4. Importar Workflows n8n

1. Acesse: `http://localhost:5678`
2. Importe os workflows da pasta `n8n-automations/`:
   - `BUGBOT.json`
   - `GESTOR SERVICE DESK.json`
   - `GESTOR CATEGORIA SERVICE DESK.json`

---

## 🎮 Inicialização

### Modo Desenvolvimento (Janelas Separadas)

```bash
# Windows
start-local.bat

# Ou manualmente:
# Terminal 1 - API
npm start

# Terminal 2 - n8n
cd n8n-local
node node_modules/n8n/bin/n8n

# Terminal 3 - Evolution API
cd evolution-api
npm run start:prod
```

### Modo Produção (PM2)

```bash
# Windows
start.bat

# Ou manualmente:
pm2 start ecosystem.config.js
pm2 save
```

Para visualizar logs:
```bash
pm2 logs
```

Para parar os serviços:
```bash
pm2 stop all
```

---

## 📚 Documentação da API

### Base URL
```
http://localhost:2500/api
```

### Endpoints

#### 👥 Usuários (Técnicos)

##### GET `/users`
Retorna todos os técnicos cadastrados com seus cargos e competências.

**Resposta:**
```json
[
  {
    "_id": 123,
    "nome": "João Silva",
    "userNameGlpi": "joao.silva",
    "entidade": "BugBusters",
    "telefone": "11999999999",
    "cargo": {
      "_id": "64abc...",
      "nome": "Analista N1",
      "competencias": [...]
    }
  }
]
```

##### POST `/users`
Cria um novo técnico vinculado a um cargo.

**Body:**
```json
{
  "_id": 123,
  "nome": "João Silva",
  "userNameGlpi": "joao.silva",
  "entidade": "BugBusters",
  "cargo": "64abc..."
}
```

##### GET `/users/:id`
Retorna detalhes de um técnico específico.

##### PUT `/users/:id`
Atualiza dados de um técnico.

**Body:**
```json
{
  "nome": "João Silva Jr",
  "telefone": "11988888888",
  "cargo": "64xyz..."
}
```

##### DELETE `/users/:id`
Remove um técnico do sistema.

---

#### 💼 Cargos

##### GET `/cargos`
Lista todos os cargos com competências vinculadas.

**Resposta:**
```json
[
  {
    "_id": "64abc...",
    "nome": "Analista N1",
    "descricao": "Suporte técnico nível 1",
    "competencias": [
      {
        "_id": 114,
        "name": "Service Desk Antivirus",
        "completename": "Service Desk > Antivirus > Falha/Erro"
      }
    ]
  }
]
```

##### POST `/cargos`
Cria um novo cargo.

**Body:**
```json
{
  "nome": "Analista N2",
  "descricao": "Suporte técnico nível 2",
  "competencias": [114, 115, 116]
}
```

##### PUT `/cargos/:id`
Atualiza um cargo existente.

##### DELETE `/cargos/:id`
Remove um cargo.

---

#### 🎯 Competências (Categorias GLPI)

##### GET `/competencias`
Lista competências filtradas (níveis 1 e 2).

##### GET `/competencias/sync`
Sincroniza categorias do GLPI com o banco local.

**Resposta:**
```json
{
  "message": "Sincronização concluída!",
  "total_processado": 150
}
```

##### DELETE `/competencias/:id`
Remove uma competência.

---

#### 🏢 Entidades (Matriz de Prioridade)

##### GET `/entidades-config`
Lista todas as configurações de prioridade salvas.

**Resposta:**
```json
[
  {
    "_id": 59,
    "nome": "SOLAIA",
    "prioridade": 5,
    "matriz_config": "Cliente VIP - SLA 30min"
  }
]
```

##### POST `/entidades-config`
Salva ou atualiza configuração de prioridade.

**Body:**
```json
{
  "_id": 59,
  "nome": "SOLAIA",
  "prioridade": 5,
  "matriz_config": "Cliente VIP - SLA 30min"
}
```

##### DELETE `/entidades-config/:id`
Remove configuração de uma entidade.

---

#### 🔌 GLPI (Proxy)

##### GET `/glpi/tecnicos`
Consulta técnicos diretamente do GLPI.

**Resposta:**
```json
[
  {
    "id": 123,
    "login": "joao.silva",
    "nome": "João",
    "sobrenome": "Silva",
    "email": "joao@empresa.com",
    "entidade": "BugBusters",
    "is_technician": true
  }
]
```

##### GET `/glpi/categorias`
Consulta categorias ITIL do GLPI.

##### GET `/glpi/entidades`
Consulta entidades do GLPI.

---

## 🤖 Documentação dos Agentes

### 1. BUGBOT - Agente de Atendimento WhatsApp

**Arquivo**: `n8n-automations/BUGBOT.json`

#### Funcionalidade
Atendimento automatizado de primeiro nível via WhatsApp, realizando:
- Identificação do usuário por e-mail
- Triagem técnica de problemas
- Criação automática de chamados
- Consulta de chamados existentes

#### Fluxo de Operação

```
1. Recebe Mensagem (Webhook)
   ↓
2. Extrai e Formata Dados
   ↓
3. Valida Telefone
   ↓
4. Autentica no GLPI
   ↓
5. Carrega Lista de Empresas
   ↓
6. IA Processa Mensagem
   ↓
7. Decide Ação:
   - Responder (continua conversação)
   - Verificar Conta (cria/busca usuário)
   - Consultar Chamado (lista tickets)
```

#### Configuração

**Nó "Autenticação"**:
```javascript
{
  "urlAPI": "https://seu-glpi.com/apirest.php",
  "APP_TOKEN_GLPI": "seu_token",
  "Login_GLPI": "usuario",
  "Senha_GLPI": "senha",
  "Status": "10", // Status dos chamados
  "NomeDaInstanciaEvolution": "nome_instancia",
  "linkEvolution": "http://localhost:8081",
  "APIKeyEvolution": "sua_chave"
}
```

#### Webhook URL
```
POST http://localhost:5678/webhook/d6e7c929-eeea-49a7-9d2b-b5ecccef2724
```

#### Prompts da IA

**System Prompt Principal**:
```
Você é o motor de IA de suporte Nível 1 da Bugbusters.

FLUXO DE TRIAGEM:
1. Identificação: Peça o e-mail primeiro
2. Unidade: Pergunte unidade se empresa for SOLAIA, PILLOWTEX, JAMAICA ou ROA
3. Investigação: Perguntas obrigatórias:
   - "Isso afeta apenas você ou mais alguém?"
   - "Aparece mensagem de erro?"
4. Fechamento: Mude status para "verificar-conta"

FORMATO DE SAÍDA (JSON):
{
  "tipoDeMensagem": "responder | verificar-conta | consultar-chamado",
  "empresa": ID_NUMERICO | null,
  "conteudoDaMenssagem": "string",
  "email": "string" | null,
  "caso": "HTML" | null
}
```

#### Modelo de IA Usado
- **GPT-4.1** (OpenAI)
- Memória conversacional em PostgreSQL

---

### 2. GESTOR SERVICE DESK - Distribuidor Inteligente

**Arquivo**: `n8n-automations/GESTOR SERVICE DESK.json`

#### Funcionalidade
Distribui chamados automaticamente para técnicos com base em:
- Competências técnicas
- Carga de trabalho atual
- Prioridade da entidade
- Urgência do chamado
- Tempo em fila

#### Fluxo de Operação

```
1. Busca Chamados Não Solucionados
   ↓
2. Carrega Matriz de Prioridade
   ↓
3. Consulta Técnicos e Competências
   ↓
4. Calcula Fila de Cada Técnico
   ↓
5. Organiza Chamados por Prioridade/Urgência
   ↓
6. Algoritmo de Atribuição
   ↓
7. Atribui ao Técnico Adequado
```

#### Configuração

**Nó "Autenticação"**:
```javascript
{
  "urlAPI": "https://seu-glpi.com/apirest.php",
  "APP_TOKEN_GLPI": "seu_token",
  "Login_GLPI": "usuario",
  "Senha_GLPI": "senha",
  "Status": "10",
  "urlMCP": "http://localhost:2500/api"
}
```

#### Algoritmo de Atribuição

**Código JavaScript** (nó "Matriz de atribuição"):
```javascript
// Configurações de Tempo
const TEMPO_URG_PRIO_5 = 10; // 10 minutos
const TEMPO_URG_PRIO_4 = 30; // 30 minutos

// Ordenação: Nível (Prio/Urg) + Antiguidade
novosChamados.sort((a, b) => {
    const nivelA = Math.max(a.prioridade, a.urgencia_num);
    const nivelB = Math.max(b.prioridade, b.urgencia_num);
    if (nivelB !== nivelA) return nivelB - nivelA;
    return new Date(a.data_abertura) - new Date(b.data_abertura);
});

// Regra de Atribuição:
// - Técnico com 0 chamados: atribui imediatamente
// - Técnico com <2 chamados: só se nível 4/5 estiver atrasado
```

#### Critérios de Priorização

| Nível | Descrição | Tempo SLA |
|-------|-----------|-----------|
| 5 | Crítica | 10 minutos |
| 4 | Alta | 30 minutos |
| 3 | Média | 2 horas |
| 2 | Baixa | 4 horas |
| 1 | Muito Baixa | 8 horas |

#### Execução Automática
Configure trigger para executar a cada 5 minutos:
```javascript
// Schedule Trigger
"0 */5 * * * *" // A cada 5 minutos
```

---

### 3. GESTOR CATEGORIA - Classificador Automático

**Arquivo**: `n8n-automations/GESTOR CATEGORIA SERVICE DESK.json`

#### Funcionalidade
Classifica automaticamente chamados "sujos" (sem categoria ou abertos por e-mail) usando IA.

#### Fluxo de Operação

```
1. Busca Chamados Sem Categoria
   ↓
2. Carrega Base de Categorias GLPI
   ↓
3. IA Analisa Título e Descrição
   ↓
4. Identifica Categoria Adequada
   ↓
5. Atualiza Chamado no GLPI
```

#### Configuração

Mesma estrutura do GESTOR SERVICE DESK.

#### Prompt da IA

**System Prompt**:
```
Você é um Analista de Suporte TI nível 1, especialista em ITIL.

MISSÃO: Normalizar chamados que chegaram sem categoria.

REGRAS:
1. Analise "titulo" e "descricao_inicial"
2. Identifique categoria do banco de dados
3. Substitua campo "categoria" pelo nome correto
4. Adicione "categoria_id" com o ID

SAÍDA: JSON puro, sem markdown
{
  "totalNovos": 0,
  "novosGeral": [
    {
      "id": 123,
      "categoria": "Service Desk Rede",
      "categoria_id": 195,
      ...
    }
  ]
}
```

#### Modelo de IA Usado
- **GPT-4.1** (OpenAI)
- Sem memória conversacional

#### Exemplos de Classificação

| Descrição do Chamado | Categoria Identificada |
|----------------------|------------------------|
| "TOKEN não funciona" | Desenvolvimento Infiniti > V-Card |
| "Internet caiu" | Service Desk > Rede > Falha/Erro |
| "Impressora travou" | Service Desk > Impressora > Falha/Erro |
| "Outlook não abre" | Service Desk > Email > Falha/Erro |

#### Execução Automática
Configure trigger para executar a cada 10 minutos:
```javascript
// Schedule Trigger
"0 */10 * * * *" // A cada 10 minutos
```

---

## 🖥️ Interface de Gerenciamento

### Dashboard Principal

Acesse: `http://localhost:2500`

#### Funcionalidades

**1. Dashboard**
- Resumo de técnicos, cargos e competências
- Visão geral do sistema

**2. Gestão de Técnicos**
- Importar técnicos do GLPI
- Vincular a cargos internos
- Editar dados de contato
- Remover técnicos

**3. Cargos e Competências**
- Criar cargos personalizados
- Vincular competências (categorias GLPI)
- Editar e remover cargos
- Visualizar árvore de competências

**4. Matriz de Prioridade**
- Configurar prioridade por entidade (1-5)
- Adicionar notas sobre SLA
- Visualizar configurações ativas

**5. Importar GLPI**
- Sincronizar categorias ITIL
- Consultar técnicos em tempo real
- Importar novos técnicos

### Fluxo de Uso Recomendado

```
1º Sincronizar Competências
   (Seção: Importar GLPI → Sincronizar Categorias)
   ↓
2º Criar Cargos Internos
   (Seção: Cargos → Criar Cargo → Vincular Competências)
   ↓
3º Importar Técnicos do GLPI
   (Seção: Importar GLPI → Selecionar Técnico → Vincular Cargo)
   ↓
4º Configurar Prioridades
   (Seção: Entidades → Configurar por Cliente)
   ↓
5º Ativar Agentes n8n
   (Acessar n8n → Ativar Workflows)
```

---

## 🔧 Troubleshooting

### Problema: API não inicia

**Erro:** `EADDRINUSE: address already in use`

**Solução:**
```bash
# Windows
netstat -ano | findstr :2500
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:2500 | xargs kill -9
```

---

### Problema: MongoDB não conecta

**Erro:** `MongoServerError: Authentication failed`

**Solução:**
1. Verifique se o MongoDB está rodando:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```

2. Verifique a URI no `.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/MCP
   ```

---

### Problema: n8n não salva workflows

**Erro:** `Database connection error`

**Solução:**
1. Verifique se o PostgreSQL está rodando:
   ```bash
   docker ps | grep postgres
   ```

2. Reinicie o container:
   ```bash
   docker-compose restart postgres
   ```

---

### Problema: Evolution API não envia mensagens

**Erro:** `Instance not connected`

**Solução:**
1. Acesse `http://localhost:8081/manager`
2. Reconecte a instância usando QR Code
3. Verifique se Redis e RabbitMQ estão ativos:
   ```bash
   docker ps
   ```

---

### Problema: BUGBOT não responde

**Possíveis Causas:**
1. Webhook não configurado no Evolution
2. Workflow não está ativo no n8n
3. Credenciais GLPI incorretas

**Solução:**
1. Verifique webhook na Evolution API
2. Ative o workflow no n8n
3. Teste autenticação GLPI:
   ```bash
   curl -X POST https://seu-glpi.com/apirest.php/initSession \
     -H "App-Token: SEU_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"login":"usuario","password":"senha"}'
   ```

---

### Problema: Agentes não atribuem chamados

**Erro:** Chamados ficam sem técnico

**Solução:**
1. Verifique se técnicos têm competências vinculadas
2. Confirme se entidades têm prioridade configurada
3. Execute manualmente o workflow no n8n
4. Verifique logs:
   ```bash
   pm2 logs n8n
   ```

---

## 📊 Monitoramento

### Logs da API
```bash
# Se usando PM2
pm2 logs mcp-api

# Se rodando direto
npm start
```

### Logs do n8n
```bash
pm2 logs n8n
```

### Logs da Evolution API
```bash
pm2 logs evolution-api
```

### Status dos Serviços
```bash
pm2 status
```

---

## 🔐 Segurança

### Recomendações

1. **Troque as senhas padrão**:
   - GLPI
   - MongoDB
   - PostgreSQL
   - Evolution API

2. **Use HTTPS em produção**:
   ```bash
   # Configure certificado SSL
   # Exemplo com Let's Encrypt
   certbot --nginx -d seu-dominio.com
   ```

3. **Restrinja acesso à API**:
   ```javascript
   // Adicione middleware de autenticação
   app.use('/api', authMiddleware);
   ```

4. **Configure firewall**:
   ```bash
   # Permita apenas portas necessárias
   ufw allow 2500/tcp
   ufw allow 5678/tcp
   ufw allow 8081/tcp
   ```

---

## 📈 Performance

### Otimizações Recomendadas

1. **Índices MongoDB**:
   ```javascript
   db.users.createIndex({ userNameGlpi: 1 })
   db.competencias.createIndex({ name: 1 })
   ```

2. **Cache Redis** (opcional):
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   ```

3. **Pool de Conexões**:
   ```javascript
   mongoose.connect(MONGO_URI, {
     maxPoolSize: 10,
     minPoolSize: 5
   });
   ```

---

## 🆘 Suporte

Para problemas ou dúvidas:

1. Verifique os logs dos serviços
2. Consulte a seção Troubleshooting
3. Revise as configurações de autenticação
4. Teste conexões manualmente

---

## 📝 Notas Adicionais

### Backup

Recomenda-se backup diário do MongoDB:
```bash
mongodump --db MCP --out /backup/$(date +%Y%m%d)
```

### Atualizações

Para atualizar o sistema:
```bash
git pull origin main
npm install
pm2 restart all
```

### Estrutura de Pastas

```
N8N-PROD/
├── node_modules/          # Dependências Node.js
├── n8n-local/            # Instalação local n8n
│   └── .n8n/            # Dados e workflows n8n
├── evolution-api/        # API WhatsApp
├── n8n-automations/      # Workflows exportados
│   ├── BUGBOT.json
│   ├── GESTOR SERVICE DESK.json
│   └── GESTOR CATEGORIA.json
├── src/                  # Código fonte API
│   ├── config/          # Configurações
│   ├── controllers/     # Controladores
│   ├── models/          # Modelos MongoDB
│   ├── routes/          # Rotas Express
│   └── services/        # Serviços auxiliares
├── view/                # Interface web
│   ├── index.html
│   ├── script.js
│   └── style.css
├── app.js               # Servidor principal
├── package.json
├── docker-compose.yml   # Serviços Docker
└── ecosystem.config.js  # Configuração PM2
```

---

**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2026  
**Desenvolvido por:** BugBusters