# 🎯 Valorant Tracker

![CI](https://github.com/seu-user/valorant-tracker/actions/workflows/ci.yml/badge.svg)
![Deploy](https://img.shields.io/badge/deploy-Railway-purple)
![License](https://img.shields.io/badge/license-MIT-green)

Aplicação web para acompanhar estatísticas de jogadores de Valorant:
rank, histórico de partidas, K/D ratio e evolução ao longo do tempo.

> Projeto desenvolvido para a disciplina de Desenvolvimento Web · 2025

---

# Stack

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Frontend     | React + Vite + React Router         |
| Backend      | Node.js + Express                   |
| Banco        | MySQL (XAMPP local / Railway prod)  |
| ORM          | Prisma                              |
| Auth         | JWT (jsonwebtoken + bcryptjs)       |
| Deploy       | Railway (backend) + Vercel (front)  |
| CI/CD        | GitHub Actions                      |
| Dados        | Henrik-3 Valorant API               |
| Testes       | Jest                                |
| Observab.    | Sentry + morgan + endpoint /health  |

---

## 📐 Arquitetura

Arquitetura monolítica com separação em camadas (MVC):
routes → controllers → services → repositories → Prisma

```
React + Vite (Vercel)
        ↕ REST / JSON
Node.js + Express (Railway)
     ↙           ↘
  MySQL      Henrik Valorant API
(Railway)
        ↓
       Sentry (observabilidade)
```

---

##  Requisitos Acadêmicos

- [x] CRUD completo (módulo de favoritos)
- [x] Transação atômica (Favorite + RankSnapshot)
- [x] REST API com arquitetura MVC
- [x] Autenticação com JWT
- [x] Arquitetura monolítica com módulos
- [x] Repositório Git com README e Wiki
- [x] CI/CD (GitHub Actions → Railway)
- [x] TDD (testes unitários com Jest)
- [x] Deploy em produção (online e acessível)
- [x] Observabilidade (Sentry + morgan + /health)

---

##  Como rodar localmente

**Pré-requisitos:** Node.js 18+, XAMPP com MySQL rodando

```bash
# Clone o repositório
git clone https://github.com/seu-user/valorant-tracker
cd valorant-tracker

# Backend
cd backend
cp .env.example .env
# Edite .env: DATABASE_URL, JWT_SECRET, HENRIK_API_KEY
npm install
npx prisma migrate dev
npm run dev        # http://localhost:3000

# Frontend (outro terminal)
cd frontend
cp .env.example .env
# Edite .env: VITE_API_URL=http://localhost:3000
npm install
npm run dev        # http://localhost:5173
```

---

##  Testes

```bash
cd backend
npm test           # roda todos os testes
npm run test:watch # modo watch durante desenvolvimento
```

---

## Equipe

| Nome       | Responsabilidade                       |
|------------|----------------------------------------|
| Pessoa 1   | Backend, Prisma, Auth, CI/CD, Sentry   |
| Pessoa 2   | Frontend, React, Integração de APIs    |

---

## Wiki

Consulte a [Wiki](../../wiki) para:
- Decisões arquiteturais (ADRs)
- Diagrama ER do banco de dados
- Documentação dos endpoints REST
- Guia de contribuição e fluxo de branches
