# Inmeta API - Gerenciamento de Documentação

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![NestJS](https://img.shields.io/badge/NestJS-10+-red)
![Prisma](https://img.shields.io/badge/Prisma-6+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)

🟢 **Live API / Swagger (Ambiente de Produção):** 👉 **[https://inmeta-api.onrender.com/docs](https://inmeta-api.onrender.com/docs)**

## 📌 Visão Geral

A **Inmeta API** é um sistema robusto focado no **Ciclo de Vida da Obrigação Documental**. Mais do que um simples CRUD, o sistema garante a integridade de vinculações de documentos a colaboradores, gerencia o histórico de versionamento de envios e fornece estatísticas agregadas de _compliance_ em tempo real. Tudo isso construído sob rigorosas práticas de engenharia de software para suportar ambientes de alta concorrência.

---

## 🏛️ Padrão Arquitetural

O projeto foi desenhado sob a arquitetura de **Monolito Modular (Modular Monolith)**, aplicando conceitos de **Clean Architecture** e **Domain-Driven Design (DDD)** (Bounded Contexts).

A aplicação prioriza a **separação de responsabilidades**: as regras de negócio puras (Domain) não conhecem o banco de dados; a orquestração (Use Cases) não conhece o protocolo HTTP; e a camada de entrada (Controllers) atua apenas como um roteador de tráfego.

### Módulos do Sistema (Bounded Contexts)

A separação não foi feita por tipo de arquivo (todos os controllers juntos), mas sim por **Contexto de Negócio**:

- **`employees` (Colaboradores):** O _Core Domain_ de pessoas. Existe para gerenciar a identidade de quem sofrerá as exigências documentais.
- **`document-types` (Tipos de Documento):** O Catálogo. Existe para padronizar as obrigações (ex: CPF, ASO), garantindo que os dados não fiquem soltos ou duplicados através de _Unique Constraints_.
- **`documents` (Vinculações e Envios):** O Coração do sistema. Existe para isolar a complexidade de regras de negócio de obrigatoriedade, concorrência de múltiplos envios (Race Conditions) e versionamento lógico.
- **`dashboard` (Estatísticas):** O módulo analítico. Existe de forma isolada aplicando o padrão CQRS (apenas leitura), focado em extrair métricas de _compliance_ usando o poder computacional do banco de dados (Agregações) em vez do Node.js.

---

## 🛠️ Stack Tecnológica Base

- **Linguagem:** TypeScript (Node.js)
- **Framework API:** NestJS (SWC Compiler para builds ultra-rápidos)
- **ORM / Database:** Prisma ORM (Modo WASM/Driverless) + PostgreSQL
- **Testes:** Jest + Supertest (Unitários e E2E)
- **Documentação:** OpenAPI (Swagger)

---

## 🧠 Decisões Arquiteturais e Justificativas

Abaixo documentamos as escolhas técnicas e o porquê descartamos as alternativas.

### 1. Framework: Por que NestJS?

- **Alternativas consideradas:** Express.js, Fastify puro, TS.ED.
- **Justificativa:** O NestJS foi escolhido por fornecer uma infraestrutura nativa e robusta de Injeção de Dependências (DI) e Modularidade. O Express é demasiadamente minimalista, exigindo a criação manual de toda a arquitetura de roteamento e injeção, o que aumenta a carga cognitiva. O Fastify é excelente em performance, mas o NestJS permite utilizá-lo por baixo dos panos caso necessário, unindo a velocidade do Fastify com a arquitetura Enterprise do Nest.

### 2. ORM: Por que Prisma ao invés de TypeORM?

- **Alternativas consideradas:** TypeORM, Sequelize, Kysely.
- **Justificativa:** O TypeORM, embora popular, depende fortemente de Decorators que poluem as entidades de domínio, ferindo a Clean Architecture (vazamento de infraestrutura no domínio). Além disso, o gerenciamento de migrações do TypeORM é frágil em projetos grandes. O Prisma oferece um Schema declarativo, _Type Safety_ extremo e, na versão 6+, suporta o modo _Driverless_ (WASM), removendo binários em Rust e aumentando drasticamente a performance em ambientes serverless/cloud.

### 3. Organização de Pastas: Clean Architecture vs Padrão NestJS

- **Alternativas consideradas:** Estrutura flat padrão do CLI do Nest (Controller, Service e Module na mesma pasta).
- **Justificativa:** O padrão flat do NestJS escala mal quando regras de negócio complexas surgem, gerando "Fat Services" (Serviços gigantes com milhares de linhas). Adotamos uma estrutura baseada em _Ports and Adapters_ (`api`, `application/use-cases`, `domain`, `infra/repositories`). Isso garante o Princípio da Responsabilidade Única (SRP) e facilita a extração futura de qualquer módulo para um microsserviço independente.

### 4. Concorrência: Tratamento de Envios Simultâneos

- **Alternativas consideradas:** Bloqueio Pessimista (`SELECT ... FOR UPDATE`), Locks Distribuídos (Redis/Redlock).
- **Justificativa:** Adotamos o **Optimistic Locking** ancorado no banco de dados. Usamos uma _Unique Constraint_ (`@@unique([requirementId, version])`) combinada com uma Transação Interativa (`$transaction`) no Prisma.
  - _Por que não Pessimistic?_ Degrada a performance sob alto volume e pode gerar _Deadlocks_.
  - _Por que não Redis?_ Adicionar uma dependência de infraestrutura extra (Redis) apenas para resolver lock de documentos seria "over-engineering". Confiamos nas propriedades ACID do PostgreSQL.

### 5. Histórico e Versionamento de Documentos

- **Alternativas consideradas:** Tabelas de Sombra (Shadow/History Tables), Event Sourcing.
- **Justificativa:** Adotamos o modelo **Append-Only** na tabela `document_submissions`, onde cada reenvio é inserido como uma nova linha com versão incrementada e flag `isActive`, sem modificar (UPDATE) a linha anterior.
  - _Por que não Tabela de Histórico?_ Adiciona complexidade de schema e exige _triggers_ de banco que são difíceis de rastrear no código.
  - _Por que não Event Sourcing?_ Requer infraestrutura de mensageria complexa (Kafka/RabbitMQ) desnecessária para o escopo delimitado deste desafio.

### 6. Agregações (Estatísticas): Por que CQRS?

- **Alternativas consideradas:** Buscar todos os dados na memória do Node.js e usar `array.reduce()`.
- **Justificativa:** Fazer agregações em memória causa vazamento de memória (Memory Leak) e lentidão catastrófica em produção (Complexidade O(N)). Isolamos a leitura no `DashboardRepository`, utilizando instruções nativas do Postgres (`GROUP BY`, `COUNT`) via Prisma. Isso garante resposta em milissegundos independente do tamanho do banco.

### 7. Qualidade de Código e Integração Contínua (CI)

- **Ferramentas Adotadas:** Husky, Commitlint, Semantic Release e Conventional Commits.
- **Alternativas consideradas:** Configuração manual de hooks do Git ou delegar toda a validação exclusivamente para a esteira de CI na nuvem (GitHub Actions/GitLab CI).
- **Justificativa:** Para garantir que a integração contínua não seja poluída com código quebrado, adotamos a estratégia de _Shift-Left Testing_:
  - O **Husky** foi configurado para interceptar os _hooks_ locais do Git de forma automatizada (instalado via script `prepare` no `package.json`).
  - No _hook_ de `pre-push`, nós garantimos a resiliência do sistema bloqueando qualquer push caso os testes unitários (`npm run test`) ou de integração E2E (`npm run test:e2e`) falhem.
  - No _hook_ de `commit-msg`, o **Commitlint** assegura que o desenvolvedor siga o padrão _Conventional Commits_.
  - A automação de release é gerenciada pelo **Semantic Release**, que avalia o histórico padronizado de commits para atualizar o `CHANGELOG.md`, criar as _tags_ de versão, e orquestrar as branches de publicação (como a `main` e a `develop` em formato de _prerelease_).

---

## 🎯 Checklist de Execução

- [x] **Fase 0:** Setup, Configuração do SWC, Docker (Postgres), Filtros de Exceção Globais.
- [x] **Fase 1:** Implementação de Hooks (Husky) para garantir Qualidade (Testes no pre-push) e Padronização (Commitlint).
- [x] **Automação:** Configuração de Versionamento Semântico e Changelog dinâmico (Semantic Release) integrado às branches `main` e `develop`.
- [x] **Fase 2:** Módulo de Colaboradores (CRUD, Paginação, Soft Delete, Domain Entities).
- [x] **Fase 3:** Módulo de Tipos de Documentos (Validação de Unicidade, Paginação).
- [x] **Fase 4:** Módulo de Documentos (Vinculação, Histórico, Optimistic Locking, Transações ACID).
- [x] **Fase 5:** Módulo de Dashboard (CQRS, Agregações avançadas no ORM).
- [x] **Fase 6:** Documentação e Swagger.
- [x] **Fase 7:** CI/CD para produção.
- [x] **Testes Automatizados:** Cobertura de Testes Unitários (Regras de Negócio) e E2E (Integração e Concorrência) em cada fase.

---

## ⚠️ Requisitos Não Cumpridos (Conscientes)

Visando entregar "um escopo menor bem executado a um escopo maior incompleto e frágil" (conforme orientação do teste), priorizamos fortemente a Arquitetura, Atomicidade e Concorrência. Os itens abaixo ficaram de fora por decisão técnica consciente:

1.  **Logs Estruturados Avançados (Pino/Winston):** Adicionamos tratamento e logs nativos no `ExceptionFilter`, mas não adicionamos bibliotecas de terceiros para não inflar as dependências (Regra do Zero Utility Belts).
2.  **Endpoint explícito de Health Check (`/health`):** Focamos o tempo nas lógicas de concorrência. Adicionaríamos facilmente usando o pacote `@nestjs/terminus` caso o escopo de infraestrutura o exigisse.

---

## 📚 Dicionário de Conceitos e Siglas (Glossário)

Para facilitar o _onboarding_, listamos abaixo os principais conceitos e jargões técnicos aplicados neste projeto:

- **DDD (Domain-Driven Design):** Abordagem de modelagem de software cujo foco principal é o domínio do negócio. Nosso código reflete as regras reais da empresa (ex: `Requirement`, `Submission`).
- **Bounded Context (Contexto Delimitado):** Conceito do DDD. Representa as fronteiras dos nossos módulos (`employees`, `documents`, etc.). Um contexto não interfere nas regras internas do outro.
- **CQRS (Command Query Responsibility Segregation):** Padrão arquitetural que separa as operações de leitura (Queries) das operações de escrita (Commands). Usado no nosso módulo `dashboard` para focar 100% em extração rápida de dados, ignorando repositórios tradicionais.
- **Optimistic Locking (Bloqueio Otimista):** Estratégia de concorrência onde não travamos a linha no banco de dados previamente. Assumimos que colisões são raras e, se ocorrerem (dois envios na mesma "versão"), o banco aborta a transação disparando um erro (`HTTP 409 Conflict`).
- **Race Condition (Condição de Corrida):** Falha de software que ocorre quando dois processos tentam alterar o mesmo dado simultaneamente. Nossa arquitetura blinda o sistema contra isso.
- **Soft Delete (Exclusão Lógica):** Prática de nunca apagar um registro fisicamente do banco (`DELETE`). Em vez disso, preenchemos o campo `deletedAt` com a data atual. Mantém o histórico e a integridade referencial.
- **Shift-Left Testing:** Prática de mover os testes e validações para o "início" (esquerda) do ciclo de desenvolvimento. Exemplo: rodar os testes localmente no _pre-push_ via Husky, em vez de esperar a esteira de CI/CD falhar na nuvem.
- **Driverless / WASM (WebAssembly):** Novo motor do Prisma ORM (v6+). Ele roda nativamente via JavaScript/WASM sem precisar baixar os antigos binários pesados em Rust, deixando a aplicação muito mais rápida e leve em ambientes Serverless/Docker.
- **Zero Utility Belts:** Nossa diretriz interna que proíbe o uso de bibliotecas genéricas (como `lodash` ou `moment`) quando o JavaScript/Node.js nativo é capaz de resolver o problema. Mantém nosso bundle final enxuto e seguro.
- **E2E (End-to-End):** Testes de Ponta a Ponta. Testam a aplicação desde a chamada HTTP (Controller) até a persistência no Banco de Dados (PostgreSQL).

---

## 🚀 Guia do Desenvolvedor

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v20 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose

### 2. Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com a seguinte variável:

```env
DATABASE_URL="postgresql://root:rootpassword@localhost:5432/inmeta_db?schema=public"
```

### 3. Instalação e Inicialização

Execute os comandos abaixo no terminal:

```bash
# 1. Instalar dependências (Isso engatilhará o script 'prepare', instalando os hooks do Husky automaticamente)
npm install

# 2. Subir o banco de dados (PostgreSQL)
docker-compose up -d

# 3. Gerar tipagens do Prisma e rodar migrações

npm run prisma:generate
npx prisma migrate dev

# 4. Iniciar a aplicação em modo de desenvolvimento (Hot Reload com SWC)

npm run start:dev

```

### 4. Documentação da API (Swagger)

A aplicação expõe uma documentação interativa (OpenAPI 3.0) permitindo testar todos os endpoints diretamente pelo navegador. Você pode acessá-la de duas formas:

- 🟢 **Produção (Recomendado):** 👉 **[https://inmeta-api.onrender.com/docs](https://inmeta-api.onrender.com/docs)** (Sempre atualizado via CI/CD)
- 💻 **Desenvolvimento Local:** 👉 **[http://localhost:3000/docs](http://localhost:3000/docs)** (Requer execução do passo 3)

### 5. Testes Automatizados

O projeto conta com rigorosos testes automatizados, incluindo simulação de condições de corrida (Race Conditions) contra o banco de dados real.

```bash
# Rodar testes unitários (Casos de Uso e Domínio)
npm run test

# Rodar testes de integração/E2E (Banco de Dados e Controllers)
npm run test:e2e
```

---

## 🔄 CI/CD e Fluxo de Produção (GitOps)

O projeto possui uma esteira automatizada de Integração e Implantação Contínua (CI/CD) integrada ao **Render.com** e validada localmente por ferramentas de qualidade de código.

### O Ciclo de Vida do Deploy

1. **Desenvolvimento Local e Shift-Left Testing:**
   - O desenvolvedor implementa a funcionalidade seguindo os padrões de Commit Convencional (_Conventional Commits_).
   - O **Husky** intercepta os comandos do Git localmente:
     - No `commit-msg`, o **Commitlint** valida se a estrutura da mensagem está padronizada.
     - No `pre-push`, a suíte completa de testes unitários e de integração (`npm run test` e `npm run test:e2e`) é executada. Caso qualquer teste falhe, o envio para o repositório remoto é bloqueado instantaneamente.

2. **Aprovação de Pull Request para a `main` (O Gatilho de Produção):**
   - Ao abrir e aprovar um PR (Pull Request) direcionado à branch `main`, o webhook do **Render.com** é disparado automaticamente.

3. **Build e Migrações Automatizadas em Produção:**
   - O Render executa o comando de build da aplicação:
     ```bash
     npm install && npm run prisma:generate && npm run build
     ```
   - Antes de colocar a nova versão da API no ar, o comando de _Start_ executa as migrações do banco de dados relacional de forma segura:
     ```bash
     npx prisma migrate deploy && npm run start:prod
     ```
   - **Zero Downtime:** Se a build ou as migrações sucederem, o tráfego é alternado para a nova versão. Caso ocorra qualquer falha, o deploy é abortado automaticamente, mantendo a versão anterior estável intacta.

4. **Versionamento Semântico e Changelog Automático:**
   - O **Semantic Release** gerencia o versionamento da aplicação de forma autônoma com base nos prefixos dos commits aprovados (`fix:`, `feat:`, `BREAKING CHANGE`), atualizando dinamicamente o arquivo `CHANGELOG.md` e gerando as tags de release correspondentes.
