# MCP BugBusters - Sistema Integrado de Gestão de Service Desk com IA

Sistema enterprise completo de automação e gestão de chamados técnicos, integrando IA, WhatsApp e GLPI com distribuição inteligente de tickets.

---

## 📋 Sumário

1. [Visão Geral](#-visão-geral)
2. [Arquitetura do Sistema](#️-arquitetura-do-sistema)
3. [Requisitos do Sistema](#-requisitos-do-sistema)
4. [Instalação](#-instalação)
5. [Sistema de Autenticação](#-sistema-de-autenticação)
6. [API REST](#-api-rest)
7. [Agentes Inteligentes](#-agentes-inteligentes)
8. [Interface Web](#-interface-web)
9. [Estrutura do Projeto](#-estrutura-do-projeto)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

O **MCP BugBusters** é uma plataforma enterprise de automação de service desk que combina:

### Componentes Principais

- **API REST**: Backend Node.js/Express com MongoDB
- **Sistema de Autenticação**: Login seguro com criptografia SHA-256
- **n8n**: Orquestração de workflows com 3 agentes IA
- **Evolution API**: Gateway WhatsApp para atendimento automatizado
- **GLPI Integration**: Sincronização bidirecional com sistema ITSM
- **Dashboard Web**: Interface moderna com gestão completa

### Diferenciais

✅ Atendimento IA 24/7 via WhatsApp com memória conversacional  
✅ Distribuição inteligente baseada em competências e carga  
✅ Classificação automática de tickets usando GPT-4  
✅ Matriz de prioridade configurável por cliente  
✅ Gestão de competências e cargos técnicos  
✅ Interface web moderna e responsiva

---

## 🏗️ Arquitetura do Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                  CAMADA DE APRESENTAÇÃO                       │
├──────────────────────────────────────────────────────────────┤
│  Dashboard Web              WhatsApp (Evolution API)         │
│  - Login/Autenticação      - QR Code Pairing                │
│  - Gestão de Técnicos      - Recebimento de Mensagens       │
│  - Matriz de Prioridade    - Envio Automático               │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                 CAMADA DE APLICAÇÃO                           │
├──────────────────────────────────────────────────────────────┤
│  API REST (Express.js)                                       │
│  ├─ Autenticação (SHA-256)                                   │
│  ├─ CRUD Usuários/Cargos/Competências                       │
│  ├─ Sincronização GLPI                                       │
│  └─ Configuração de Prioridades                              │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  CAMADA DE AUTOMAÇÃO                          │
├──────────────────────────────────────────────────────────────┤
│  n8n Workflows + Agentes IA                                  │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐         │
│  │  BUGBOT    │  │   GESTOR    │  │   GESTOR     │         │
│  │  (GPT-4.1) │  │SERVICE DESK │  │  CATEGORIA   │         │
│  │ Atendimento│  │Distribuição │  │Classificação │         │
│  │  Triagem   │  │Inteligente  │  │  Automática  │         │
│  └────────────┘  └─────────────┘  └──────────────┘         │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   CAMADA DE DADOS                             │
├──────────────────────────────────────────────────────────────┤
│  MongoDB          PostgreSQL         Redis      RabbitMQ     │
│  - Users         - n8n Data         - Cache    - Queue       │
│  - Cargos        - Workflows        - Session  - Events      │
│  - Competências  - Chat Memory                               │
│  - Entidades                                                 │
│  - Configs                                                   │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                 INTEGRAÇÕES EXTERNAS                          │
├──────────────────────────────────────────────────────────────┤
│  GLPI API             OpenAI API                             │
│  - Tickets            - GPT-4.1 (Atendimento)               │
│  - Users              - GPT-5-mini (Classificação)          │
│  - Categories         - GPT-4.1-mini (Distribuição)         │
└──────────────────────────────────────────────────────────────┘
```

### Fluxo de Atendimento Completo

```
1. Cliente envia mensagem → WhatsApp
2. Evolution API recebe → Webhook para n8n
3. BUGBOT (IA) processa → Triagem e coleta de dados
4. Sistema cria → Chamado no GLPI
5. GESTOR CATEGORIA → Classifica automaticamente
6. GESTOR SERVICE DESK → Distribui para técnico adequado
7. Técnico é notificado → Inicia resolução
8. Sistema envia → Feedback ao cliente via WhatsApp
```

---

## 💻 Requisitos do Sistema

### Software Necessário

| Software | Versão Mínima | Descrição |
|----------|---------------|-----------|
| **Node.js** | v20.19.0 | Runtime JavaScript |
| **MongoDB** | v6.0+ | Banco de dados principal |
| **PostgreSQL** | v15+ | Banco de dados n8n |
| **Redis** | v7+ | Cache e sessões |
| **RabbitMQ** | v3+ | Fila de mensagens |
| **PM2** | Latest | Gerenciador de processos |
| **Git** | Latest | Controle de versão |

### Portas Utilizadas

| Porta | Serviço | Descrição |
|-------|---------|-----------|
| **2500** | API REST | Backend principal |
| **5678** | n8n | Interface de workflows |
| **8081** | Evolution API | Gateway WhatsApp |
| **5432** | PostgreSQL | Banco n8n |
| **6379** | Redis | Cache |
| **5672** | RabbitMQ | Mensageria |
| **15672** | RabbitMQ UI | Interface web |
| **27017** | MongoDB | Banco principal |

---

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/piegosalles10kk/AUTOMACAO-GLPI
cd N8N-PROD
```

### 2. Instale as Dependências

```bash
# API Principal
npm install

# n8n
cd n8n-local
npm install
cd ..

# Evolution API
cd evolution-api
npm install
cd ..
```

### 3. Configure Serviços Docker

```bash
# Inicia PostgreSQL, Redis e RabbitMQ
docker-compose up -d

# Verificar se todos subiram
docker ps
```

### 4. Configure MongoDB

```bash
# Se usar Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou instale localmente
mongod --dbpath /caminho/para/dados
```

---

## 🔐 Sistema de Autenticação

### Arquitetura de Segurança

O sistema implementa autenticação baseada em:
- **Hash SHA-256** para senhas
- **Tokens de sessão** armazenados no localStorage
- **Middleware de autenticação** em todas as rotas protegidas

### Estrutura de Dados (MongoDB)

```javascript
// src/models/admin.js
{
  username: String,      // Único
  password: String,      // SHA-256 hash
  nome: String,          // Nome completo
  role: String          // "admin"
}
```

### Credenciais Padrão

```
Usuário: admin
Senha: Bug*0000
```

**⚠️ IMPORTANTE**: Altere a senha padrão no primeiro acesso via Dashboard → Configurações

### Endpoints de Autenticação

#### POST `/api/auth/login`
Realiza autenticação do usuário.

**Request:**
```json
{
  "username": "admin",
  "password": "Bug*0000"
}
```

**Response (200 OK):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "abc123...",
  "user": {
    "username": "admin",
    "nome": "Administrador",
    "role": "admin"
  }
}
```

#### POST `/api/auth/init-admin`
Inicializa admin padrão (executar apenas uma vez).

#### GET `/api/auth/validate`
Valida token de sessão.

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT `/api/auth/change-password`
Altera senha do usuário.

**Request:**
```json
{
  "username": "admin",
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

---

## 📡 API REST

### Base URL

```
http://localhost:2500/api
```

### Autenticação nas Requisições

Todas as requisições (exceto login) devem incluir:

```javascript
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

---

### 👥 Usuários (Técnicos)

#### GET `/users`
Lista todos os técnicos com cargos e competências.

**Response:**
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
      "competencias": [
        {
          "_id": 114,
          "name": "Service Desk Antivirus",
          "completename": "Service Desk > Antivirus > Falha/Erro"
        }
      ]
    }
  }
]
```

#### POST `/users`
Importa técnico do GLPI vinculando a cargo interno.

**Request:**
```json
{
  "_id": 123,
  "nome": "João Silva",
  "userNameGlpi": "joao.silva",
  "entidade": "BugBusters",
  "cargo": "64abc..."
}
```

#### GET `/users/:id`
Retorna detalhes de um técnico específico.

#### PUT `/users/:id`
Atualiza dados do técnico.

**Request:**
```json
{
  "nome": "João Silva Jr",
  "telefone": "11988888888",
  "cargo": "64xyz..."
}
```

#### DELETE `/users/:id`
Remove técnico do sistema local.

---

### 💼 Cargos

#### GET `/cargos`
Lista todos os cargos com competências.

**Response:**
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

#### POST `/cargos`
Cria novo cargo interno.

**Request:**
```json
{
  "nome": "Analista N2",
  "descricao": "Suporte técnico nível 2",
  "competencias": [114, 115, 116]
}
```

#### PUT `/cargos/:id`
Atualiza cargo (nome, descrição ou competências).

#### DELETE `/cargos/:id`
Remove cargo do sistema.

---

### 🎯 Competências (Categorias GLPI)

#### GET `/competencias`
Lista competências filtradas (níveis 1 e 2).

**Response:**
```json
[
  {
    "_id": 114,
    "name": "Service Desk Antivirus",
    "completename": "Service Desk > Antivirus > Falha/Erro"
  }
]
```

#### GET `/competencias/sync`
Sincroniza categorias do GLPI com banco local.

**Response:**
```json
{
  "message": "Sincronização concluída!",
  "total_processado": 150
}
```

#### DELETE `/competencias/:id`
Remove competência do banco local.

---

### 🏢 Entidades (Matriz de Prioridade)

#### GET `/entidades-config`
Lista configurações de prioridade salvas.

**Response:**
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

#### POST `/entidades-config`
Salva ou atualiza configuração de prioridade.

**Request:**
```json
{
  "_id": 59,
  "nome": "SOLAIA",
  "prioridade": 5,
  "matriz_config": "Cliente VIP - SLA 30min"
}
```

**Níveis de Prioridade:**
- **1**: Muito Baixa (8 horas)
- **2**: Baixa (4 horas)
- **3**: Média (2 horas)
- **4**: Alta (30 minutos)
- **5**: Crítica (10 minutos)

#### DELETE `/entidades-config/:id`
Remove configuração de prioridade.

---

### 🔌 GLPI (Proxy)

#### GET `/glpi/tecnicos`
Consulta técnicos diretamente do GLPI.

**Response:**
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

#### GET `/glpi/categorias`
Consulta categorias ITIL em tempo real.

#### GET `/glpi/entidades`
Consulta entidades do GLPI.

---

### ⚙️ Configurações

#### GET `/config/glpi`
Busca configurações GLPI salvas.

**Response:**
```json
{
  "glpi_url": "https://chamados.empresa.com/apirest.php",
  "glpi_app_token": "token...",
  "glpi_user_login": "api_user",
  "glpi_user_password": "senha",
  "ativo": true
}
```

#### POST `/config/glpi`
Salva configurações GLPI.

**Request:**
```json
{
  "glpi_url": "https://chamados.empresa.com/apirest.php",
  "glpi_app_token": "token...",
  "glpi_user_login": "api_user",
  "glpi_user_password": "senha"
}
```

#### POST `/config/glpi/test`
Testa conexão com GLPI.

**Response:**
```json
{
  "success": true,
  "message": "Conexão estabelecida com sucesso!"
}
```

---

## 🤖 Agentes Inteligentes

### 1. BUGBOT - Atendimento WhatsApp

**Arquivo**: `n8n-automations/BUGBOT.json`

#### Características
- **Modelo IA**: GPT-4.1 (OpenAI)
- **Memória**: PostgreSQL (20 mensagens de contexto)
- **Trigger**: Webhook Evolution API
- **Linguagem**: Português BR

#### Funcionalidades

✅ Identificação automática de usuário por e-mail  
✅ Triagem técnica de problemas  
✅ Criação automática de chamados no GLPI  
✅ Consulta de status de tickets existentes  
✅ Verificação de duplicidade de chamados  

#### Fluxo de Operação

```
1. Recebe Mensagem WhatsApp
   ↓
2. Extrai e Formata Dados (nome, telefone, mensagem)
   ↓
3. Valida Telefone Autorizado
   ↓
4. Autentica no GLPI
   ↓
5. Carrega Lista de Empresas Ativas
   ↓
6. IA Processa Mensagem com Contexto
   ↓
7. Decide Ação:
   - responder → Continua conversação
   - verificar-conta → Cria/busca usuário + abre chamado
   - consultar-chamado → Lista tickets do usuário
```

#### Configuração

**Nó "Autenticação":**
```javascript
{
  "urlAPI": "https://seu-glpi.com/apirest.php",
  "APP_TOKEN_GLPI": "seu_token",
  "Login_GLPI": "usuario",
  "Senha_GLPI": "senha",
  "Status": "10",
  "NomeDaInstanciaEvolution": "nome_instancia",
  "linkEvolution": "http://localhost:8081",
  "APIKeyEvolution": "sua_chave"
}
```

#### Webhook URL

```
POST http://localhost:5678/webhook/d6e7c929-eeea-49a7-9d2b-b5ecccef2724
```

Configure este webhook na Evolution API em:
```
Settings → Webhooks → Message Received
```

#### System Prompt Resumido

```
Você é o motor de IA de suporte Nível 1 da Bugbusters.

FLUXO OBRIGATÓRIO:
1. Identificação: Peça o e-mail primeiro
2. Unidade Seletiva: Pergunte unidade APENAS se:
   - SOLAIA, PILLOWTEX, JAMAICA ou ROA
3. Investigação:
   - "Isso afeta apenas você ou mais alguém?"
   - "Aparece mensagem de erro?"
4. Fechamento: Mude para "verificar-conta"

FORMATO SAÍDA (JSON puro):
{
  "tipoDeMensagem": "responder|verificar-conta|consultar-chamado",
  "empresa": ID_NUMERICO|null,
  "conteudoDaMenssagem": "string",
  "email": "string"|null,
  "caso": "HTML"|null
}
```

---

### 2. GESTOR SERVICE DESK - Distribuidor Inteligente

**Arquivo**: `n8n-automations/GESTOR SERVICE DESK.json`

#### Características
- **Modelo IA**: GPT-4.1-mini
- **Execução**: A cada 5 minutos (Schedule Trigger)
- **Critérios**: Competências + Carga + Prioridade + Urgência + Tempo

#### Algoritmo de Distribuição

```javascript
// Tempos de SLA (minutos)
const TEMPO_URG_PRIO_5 = 10;  // Crítica
const TEMPO_URG_PRIO_4 = 30;  // Alta

// Ordenação por prioridade e tempo
chamados.sort((a, b) => {
  const nivelA = Math.max(a.prioridade, a.urgencia_num);
  const nivelB = Math.max(b.prioridade, b.urgencia_num);
  if (nivelB !== nivelA) return nivelB - nivelA;
  return new Date(a.data_abertura) - new Date(b.data_abertura);
});

// Regra de atribuição
- Técnico com 0 chamados → Atribui imediatamente
- Técnico com <2 chamados → Só se nível 4/5 estiver atrasado
- Filtro por competência e entidade
```

#### Matriz de Priorização

| Nível | Descrição | Tempo SLA | Cor |
|-------|-----------|-----------|-----|
| **5** | Crítica | 10 min | 🔴 Vermelho |
| **4** | Alta | 30 min | 🟠 Laranja |
| **3** | Média | 2 horas | 🟡 Amarelo |
| **2** | Baixa | 4 horas | 🟢 Verde Claro |
| **1** | Muito Baixa | 8 horas | 🟢 Verde |

#### Fluxo de Operação

```
1. Busca Chamados Novos (Status: Novo)
   ↓
2. Carrega Matriz de Prioridade (API /entidades-config)
   ↓
3. Consulta Técnicos e Competências (API /users)
   ↓
4. Calcula Fila Atual de Cada Técnico
   ↓
5. Organiza Chamados por Prioridade+Urgência+Antiguidade
   ↓
6. Algoritmo de Atribuição Inteligente
   ↓
7. Atribui Chamado ao Técnico via GLPI API
```

---

### 3. GESTOR CATEGORIA - Classificador Automático

**Arquivo**: `n8n-automations/GESTOR CATEGORIA SERVICE DESK.json`

#### Características
- **Modelo IA**: GPT-4.1
- **Execução**: A cada 10 minutos
- **Objetivo**: Classificar chamados sem categoria ou "abertos por e-mail"

#### Filtros de Classificação

Chamados classificados como "sujos":
- Categoria: "Sem categoria"
- Categoria: "Aberto por e-mail"
- Categoria: "null" ou vazio

#### System Prompt

```
Você é Analista de Suporte TI nível 1, especialista em ITIL.

MISSÃO: Normalizar chamados sem categoria.

ENTRADAS:
- Banco de Categorias: { id, nome, tipo }
- Lista de Chamados: { titulo, descricao_inicial, categoria }

REGRAS:
1. Analise "titulo" e "descricao_inicial"
2. Identifique categoria adequada no banco
3. Substitua campo "categoria" pelo nome correto
4. Adicione campo "categoria_id"

SAÍDA (JSON puro, sem markdown):
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

#### Exemplos de Classificação

| Descrição do Chamado | Categoria Identificada |
|----------------------|------------------------|
| "TOKEN não funciona" | Desenvolvimento Infiniti > V-Card |
| "Internet caiu" | Service Desk > Rede > Falha/Erro |
| "Impressora travou" | Service Desk > Impressora > Falha/Erro |
| "Outlook não abre" | Service Desk > Email > Falha/Erro |
| "Sistema lento" | Service Desk > Sistema > Desempenho |

---

## 🖥️ Interface Web

### Acesso

```
URL: http://localhost:2500
Login: admin
Senha: Bug*0000
```

### Telas e Funcionalidades

#### 1. Login (login.html)
- Autenticação segura
- Toggle de senha
- Mensagens de erro dinâmicas
- Design moderno com gradiente

#### 2. Dashboard Principal
- **Resumo Geral**: Total de técnicos, cargos e competências
- **Cards Informativos**: Estatísticas em tempo real
- **Navegação Lateral**: Menu fixo com ícones

#### 3. Gestão de Técnicos
**Funcionalidades:**
- ✅ Visualizar todos os técnicos cadastrados
- ✅ Editar nome, telefone e cargo
- ✅ Remover técnicos do sistema local
- ✅ Importar técnicos do GLPI
- ✅ Vincular a cargos internos

**Campos Exibidos:**
- Nome completo
- Login GLPI (badge azul)
- Cargo atual
- Telefone/Ramal
- Ações (Editar/Excluir)

#### 4. Cargos e Competências
**Funcionalidades:**
- ✅ Criar cargos personalizados
- ✅ Vincular múltiplas competências (categorias GLPI)
- ✅ Editar nome, descrição e competências
- ✅ Visualizar competências em badges coloridos
- ✅ Remover cargos

**Layout:**
- Grid responsivo de cards
- Cada card mostra nome, descrição e lista de competências
- Botões de edição e exclusão no header do card

#### 5. Matriz de Prioridade
**Funcionalidades:**
- ✅ Listar todas as entidades do GLPI
- ✅ Configurar prioridade de 1 a 5
- ✅ Adicionar notas sobre SLA/contrato
- ✅ Visualizar prioridades com badges coloridos

**Interface:**
- Tabela com ID, Nome, Prioridade e Ações
- Modal com slider de prioridade (1-5)
- Campo de texto para observações
- Badges coloridos por nível de prioridade

#### 6. Configurações
**Seções:**

**a) Configurações GLPI:**
- URL da API
- App Token
- Login de usuário
- Senha
- Botão "Testar Conexão"
- Botão "Salvar Configurações"

**b) Alterar Senha:**
- Senha atual
- Nova senha
- Confirmar nova senha

#### 7. Importar GLPI
**Funcionalidades:**
- ✅ Sincronizar categorias ITIL do GLPI
- ✅ Consultar técnicos em tempo real
- ✅ Importar técnicos selecionados
- ✅ Vincular a cargo durante importação

**Tabela de Técnicos:**
- Nome completo
- Email
- Entidade
- Botão "Importar"

---

## 📁 Estrutura do Projeto

```
N8N-PROD/
├── node_modules/              # Dependências Node.js
├── n8n-local/                # Instalação local n8n
│   ├── .n8n/                # Dados e workflows n8n
│   └── package.json
│
├── evolution-api/            # API WhatsApp
│   ├── dist/
│   └── package.json
│
├── n8n-automations/          # Workflows exportados
│   ├── BUGBOT.json          # Agente de atendimento
│   ├── GESTOR SERVICE DESK.json
│   └── GESTOR CATEGORIA SERVICE DESK.json
│
├── src/                      # Código fonte API
│   ├── config/
│   │   └── dbConnect.js     # Conexão MongoDB
│   │
│   ├── controllers/
│   │   ├── authController.js        # Autenticação
│   │   ├── userController.js        # Usuários
│   │   ├── cargoController.js       # Cargos
│   │   ├── competenciaController.js # Competências
│   │   ├── entidadeController.js    # Entidades
│   │   ├── glpiController.js        # Proxy GLPI
│   │   └── configController.js      # Configurações
│   │
│   ├── models/
│   │   ├── admin.js         # Schema Admin
│   │   ├── user.js          # Schemas User/Cargo/Competencia/Entidade
│   │   └── config.js        # Schema Config
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── cargoRoutes.js
│   │   ├── competenciaRoutes.js
│   │   ├── entidadeRoutes.js
│   │   ├── glpiRoutes.js
│   │   └── configRoutes.js
│   │
│   └── services/
│       └── glpiAuthService.js   # Autenticação GLPI
│
├── view/                     # Interface web
│   ├── index.html           # Dashboard principal
│   ├── login.html           # Tela de login
│   ├── style.css            # Estilos principais
│   ├── login.css            # Estilos login
│   ├── script.js            # Lógica dashboard
│   └── login.js             # Lógica login
│
├── app.js                    # Servidor Express
├── package.json
├── docker-compose.yml        # Serviços Docker
├── ecosystem.config.js       # Configuração PM2
├── init-admin.js            # Script inicialização admin
├── start.bat                # Iniciar produção (Windows)
├── start-local.bat          # Iniciar desenvolvimento (Windows)
├── .gitignore
└── README.md
```

---

## ⚙️ Configuração Completa

### 1. Variáveis de Ambiente

Crie `.env` na raiz:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/MCP

# Servidor
PORT=2500

# GLPI (será configurado via dashboard)
GLPI_API_URL=https://chamados.empresa.com/apirest.php/
GLPI_APP_TOKEN=
GLPI_USER_LOGIN=
GLPI_USER_PASSWORD=

# n8n
N8N_ENCRYPTION_KEY=b7a9f82d3e1c4b5a6d7e8f90a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
N8N_SECURE_COOKIE=false
NODE_FUNCTION_ALLOW_EXTERNAL=*
N8N_USER_FOLDER=C:/Docker/N8N-PROD/n8n-local/.n8n

# PostgreSQL (n8n)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=evolution_db
DB_POSTGRESDB_USER=evolution_user
DB_POSTGRESDB_PASSWORD=evolution_password

# Evolution API
EVOLUTION_API_URL=http://localhost:8081
EVOLUTION_API_KEY=
```

### 2. Docker Compose

O arquivo `docker-compose.yml` configura:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: evolution_user
      POSTGRES_PASSWORD: evolution_password
      POSTGRES_DB: evolution_db

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports: ["5672:5672", "15672:15672"]
    environment:
      RABBITMQ_DEFAULT_USER: evolution_user
      RABBITMQ_DEFAULT_PASS: evolution_password
```

### 3. PM2 Ecosystem

`ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "n8n",
      script: "C:/Docker/N8N-PROD/n8n-local/node_modules/n8n/bin/n8n",
      env: {
        N8N_ENCRYPTION_KEY: "...",
        N8N_SECURE_COOKIE: "false",
        NODE_FUNCTION_ALLOW_EXTERNAL: "*",
        N8N_USER_FOLDER: "C:/Docker/N8N-PROD/n8n-local/.n8n"
      }
    },
    {
      name: "evolution-api",
      script: "C:/Docker/N8N-PROD/evolution-api/dist/main.js",
      cwd: "C:/Docker/N8N-PROD/evolution-api"
    }
  ]
}
```

---

## 🔄 Inicialização

### Modo Desenvolvimento (Janelas Separadas)

**Windows:**
```bash
start-local.bat
```

Ou manualmente:
```bash
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

**Windows:**
```bash
start.bat
```

Ou manualmente:
```bash
pm2 start ecosystem.config.js
pm2 save
```

**Comandos úteis:**
```bash
# Visualizar logs
pm2 logs

# Parar serviços
pm2 stop all

# Reiniciar
pm2 restart all

# Status
pm2 status
```

---

## 🛠️ Troubleshooting

### 1. API não inicia

**Erro**: `EADDRINUSE: address already in use :::2500`

**Solução:**
```bash
# Windows
netstat -ano | findstr :2500
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:2500 | xargs kill -9
```

### 2. MongoDB não conecta

**Erro**: `MongoServerError: Authentication failed`

**Solução:**
```bash
# Verificar se está rodando
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Verificar URI no .env
MONGO_URI=mongodb://localhost:27017/MCP
```

### 3. n8n não salva workflows

**Erro**: `Database connection error`

**Solução:**
```bash
# Verificar PostgreSQL
docker ps | grep postgres

# Reiniciar container
docker-compose restart postgres
```

### 4. Evolution API não envia mensagens

**Erro**: `Instance not connected`

**Solução:**
1. Acesse: `http://localhost:8081/manager`
2. Reconecte instância com QR Code
3. Verifique Redis e RabbitMQ:
```bash
docker ps
```

### 5. BUGBOT não responde

**Possíveis causas:**
- Webhook não configurado
- Workflow não ativo
- Credenciais GLPI incorretas

**Solução:**
1. Configure webhook na Evolution API
2. Ative workflow no n8n
3. Teste autenticação GLPI:
```bash
curl -X POST https://seu-glpi.com/apirest.php/initSession \
  -H "App-Token: SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"login":"usuario","password":"senha"}'
```

### 6. Agentes não atribuem chamados

**Solução:**
1. Verifique se técnicos têm competências vinculadas
2. Confirme se entidades têm prioridade configurada
3. Execute workflow manualmente no n8n
4. Verifique logs:
```bash
pm2 logs n8n
```

---

## 🔐 Segurança

### Recomendações Obrigatórias

#### 1. Trocar Senhas Padrão

```javascript
// Admin padrão
Usuário: admin
Senha: Bug*0000 → Alterar no primeiro acesso

// MongoDB (se autenticado)
// PostgreSQL
// Redis (opcional)
```

#### 2. Usar HTTPS em Produção

```bash
# Instalar Let's Encrypt
certbot --nginx -d seu-dominio.com
```

#### 3. Configurar Firewall

```bash
# Permitir apenas portas necessárias
ufw allow 2500/tcp  # API
ufw allow 5678/tcp  # n8n
ufw allow 8081/tcp  # Evolution
ufw deny 27017/tcp  # MongoDB (não expor)
```

#### 4. Limitar Acesso à API

```javascript
// Adicionar middleware de autenticação
// Já implementado - verificar token em todas as rotas
```

---

## 📊 Monitoramento

### Logs da API
```bash
pm2 logs mcp-api
```

### Logs do n8n
```bash
pm2 logs n8n
```

### Logs da Evolution API
```bash
pm2 logs evolution-api
```

### Status de Todos os Serviços
```bash
pm2 status
```

---

## 🔄 Backup e Manutenção

### Backup MongoDB

```bash
# Backup diário
mongodump --db MCP --out /backup/$(date +%Y%m%d)

# Restore
mongorestore --db MCP /backup/20260126/MCP
```

### Atualizar Sistema

```bash
git pull origin main
npm install
cd n8n-local && npm install && cd ..
cd evolution-api && npm install && cd ..
pm2 restart all
```

---

## 📝 Notas Finais

### Credenciais Importantes

```
# Dashboard Web
URL: http://localhost:2500
Login: admin
Senha: Bug*0000 (ALTERAR!)

# n8n
URL: http://localhost:5678

# RabbitMQ UI
URL: http://localhost:15672
Login: evolution_user
Senha: evolution_password
```

### Links Úteis

- **API Docs**: Documentação completa neste README
- **GLPI API Docs**: https://github.com/glpi-project/glpi/blob/master/apirest.md
- **n8n Docs**: https://docs.n8n.io
- **Evolution API**: Documentação fornecida pelo desenvolvedor

---

## 🤝 Suporte

Para problemas ou dúvidas:

1. ✅ Consultar seção Troubleshooting
2. ✅ Verificar logs dos serviços
3. ✅ Revisar configurações de autenticação
4. ✅ Testar conexões manualmente

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2026  
**Desenvolvido por**: Piego

---

## 📜 Licença

Este é um sistema proprietário desenvolvido para por piego.