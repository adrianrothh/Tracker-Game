# Valorant Tracker

Aplicação web para Acompanhar estatísticas de jogadores de Valorant:
rank, histórico de partidas, K/D ratio e evolução ao longo do tempo.
O objetivo é permitir que jogadores analisem sua performance individual e coletiva ao longo do tempo.

---

# Stack Atual (MVP)

| Camada       | Tecnologia                          | Justificativas                   |
|--------------|-------------------------------------|----------------------------------|
| Frontend     | React + Vite + React Router         | Componentes reutilizaveis, SPA   |
| Backend      | Node.js + Express                   | Ambiente JS + Framework API REST |
| Banco        | MySQL (XAMPP local)                 | BD relacional                    |
| Dados        | Henrik-3 Valorant API               | API externa                      |

---
## Documentação
Docs: https://docs.google.com/document/d/10zyYRMdJ-1-PjafNZCO0_HPoKCHyt4fspAqVL9izmyI/edit?usp=sharing



---
# RF

RF01 – O sistema deve permitir que o usuário realize cadastro informando nome, e-mail e senha.

RF02 – O sistema deve validar se o e-mail informado já está cadastrado na base de dados.

RF03 – O sistema deve permitir que o usuário realize login utilizando e-mail e senha.

RF04 – O sistema deve autenticar o usuário utilizando JWT.

RF05 – O sistema deve permitir que o usuário realize logout.

RF06 – O sistema deve permitir que o usuário visualize seus dados cadastrais.

RF07 – O sistema deve permitir que o usuário exclua sua conta.

RF08 – O sistema deve permitir que usuários autenticados favoritem perfis de jogadores.

RF09 – O sistema deve impedir que usuários não autenticados favoritem perfis de jogadores.

RF10 – O sistema deve permitir que o usuário remova perfis da lista de favoritos.

RF11 – O sistema deve listar todos os perfis favoritados pelo usuário autenticado.

RF12 – O sistema não deve permitir que um mesmo perfil seja favoritado mais de uma vez pelo mesmo usuário.

RF13 – O sistema deve permitir a busca de jogadores pelo Riot ID (nickname + tag).

RF14 – O sistema deve consumir dados da API externa Henrik-3 Valorant API para obtenção das estatísticas.

RF15 – O sistema deve exibir as seguintes informações do jogador: rank atual, histórico de partidas, K/D Ratio e estatísticas gerais.

RF16 – O sistema deve exibir a evolução de desempenho do jogador ao longo do tempo.

RF17 – O sistema deve permitir a visualização detalhada de partidas individuais.

RF18 – O sistema deve apresentar os dados estatísticos de forma gráfica.

RF19 – O sistema deve permitir navegação entre páginas por meio de rotas no frontend.

RF20 – O sistema deve exibir mensagens de erro apropriadas quando ocorrerem falhas, como jogador não encontrado, indisponibilidade da API ou credenciais inválidas.

RF21 – O sistema deve armazenar localmente os dados dos jogadores consultados.

RF22 – O sistema deve verificar se os dados do jogador estão atualizados antes de consultar a API externa.

RF23 – O sistema deve permitir atualização manual dos dados do jogador.

RF24 – O sistema deve armazenar o histórico de partidas no banco de dados.

RF25 – O sistema deve impedir o armazenamento duplicado de partidas.

# RNF

RNF01 – O sistema deve responder às requisições em até 3 segundos em condições normais de rede.

RNF02 – O sistema deve implementar mecanismo de cache para reduzir chamadas repetidas à API externa.

RNF03 – As senhas dos usuários devem ser armazenadas de forma criptografada utilizando algoritmo de hash seguro.

RNF04 – O token JWT deve possuir tempo de expiração configurado.

RNF05 – As rotas privadas devem ser protegidas por middleware de autenticação.

RNF06 – O sistema deve utilizar HTTPS em ambiente de produção.

RNF07 – O sistema deve validar entradas de dados para prevenir ataques como SQL Injection e XSS.

RNF08 – O backend deve seguir arquitetura em camadas no padrão MVC.

RNF09 – O sistema deve utilizar ORM para abstração do acesso ao banco de dados na versão completa do projeto.

RNF10 – A API deve seguir o padrão REST utilizando comunicação via JSON.

RNF11 – O código-fonte deve ser versionado utilizando Git.

RNF12 – O sistema deve ser compatível com os navegadores Google Chrome, Microsoft Edge e Mozilla Firefox.

RNF13 – O sistema deve possuir interface responsiva para desktop.

RNF14 – O sistema deve possuir testes unitários automatizados.

RNF15 – O sistema deve possuir monitoramento de erros em ambiente de produção.

RNF16 – O sistema deve permitir deploy em ambiente de nuvem para frontend e backend.

RNF17 – O sistema deve implementar estratégia de cache baseada em data de atualização.

RNF18 – O sistema deve garantir integridade referencial entre usuários, jogadores e partidas.

RNF19 – O sistema deve evitar requisições desnecessárias à API externa para reduzir latência e risco de rate limit.

---
## Diagramas

# Diagrama DER
![image](https://github.com/adrianrothh/Tracker-Game/blob/main/Docs/Diagrama%20DER.png)

# Diagrama C4
![image](https://github.com/adrianrothh/Tracker-Game/blob/main/Docs/Diagrama%20DER.png)

---
## Equipe

| Nome       | Responsabilidade                           |
|------------|--------------------------------------------|
| Adrian     | Backend, Banco, CRUD, Integração API       |
| Gustavo    | Frontend, React, Integração com Backend    |
