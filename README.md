# Valorant Tracker

![Deploy](https://img.shields.io/badge/deploy-Railway-purple)
![License](https://img.shields.io/badge/license-MIT-green)

Aplicação web para Acompanhar estatísticas de jogadores de Valorant:
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

## Equipe

| Nome       | Responsabilidade                       |
|------------|----------------------------------------|
| Adrian     | Backend, Prisma, Auth, CI/CD, Sentry   |
| Gustavo    | Frontend, React, Integração de APIs    |
