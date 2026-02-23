# Valorant Tracker


Aplicação web para Acompanhar estatísticas de jogadores de Valorant:
rank, histórico de partidas, K/D ratio e evolução ao longo do tempo.

> Projeto desenvolvido para a disciplina de Desenvolvimento Web · 2025

---

# Stack MVP

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Frontend     | React + Vite + React Router         |
| Backend      | Node.js + Express                   |
| Banco        | MySQL (XAMPP local)                 |
| Dados        | Henrik-3 Valorant API               |


# Stack COMPLETA - Não é definitiva

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Frontend     | React + Vite + React Router         |
| Backend      | Node.js + Express                   |
| Banco        | MySQL (Railway)                     |
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
routes → controllers → services → repositories → database

```
React + Vite
        ↕ REST / JSON
Node.js + Express
     ↙                     ↘
 MySQL (XAMPP local)      Henrik Valorant API
```

---

## Equipe

| Nome       | Responsabilidade                           |
|------------|--------------------------------------------|
| Adrian     | Backend, Banco, CRUD, Integração API       |
| Gustavo    | Frontend, React, Integração com Backend    |


Docs: https://docs.google.com/document/d/1-yCVvP6SBHHICZifo500qebVi1UDs7VO67UM2AOzxxQ/edit?usp=sharing
