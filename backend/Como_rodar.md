### Configurar o Banco de Dados:

Entre no xamp inicie o mysql e abra o cmd:
`mysql -u root`
Dentro do MySQL, crie o banco:

```sql
CREATE DATABASE valorant_tracker;
USE valorant_tracker;
```
Importa o schema: 
```bash
mysql -u root valorant_tracker < database/schema.sql
```

### Para rodar o backend no XAMPP(BD):
Clique em Start na linha do Mysql.
Aguarda ficar com status Running e verde.
Sem o MySQL rodando o servidor vai retornar erro de conexão.

### Dependências instaladas no terminal (VSCODE)

| Pacote | Comando | Finalidade |
|---|---|---|
| express | `npm install express` | Framework HTTP |
| mysql2 | `npm install mysql2` | Conexão com MySQL |
| dotenv | `npm install dotenv` | Variáveis de ambiente |
| cors | `npm install cors` | Liberar acesso do frontend |
| bcryptjs | `npm install bcryptjs` | Criptografia de senhas |
| jsonwebtoken | `npm install jsonwebtoken` | Geração de tokens JWT |
| node-fetch | `npm install node-fetch@2` | Chamadas HTTP para API externa |

---

### Rodando o Servidor (VSCode):

Abre o terminal no VSCode dentro da pasta `backend` e roda:
`node app.js`
Se aparecer erro de módulo não encontrado, rode primeiro:
`npm install`

### Para encerrar o servidor:
No terminal pressiona **Ctrl + C** para parar o servidor.

Depois volta no XAMPP e clica em **Stop** no MySQL.

### Rotas disponíveis

### Autenticação

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | publico | Cadastro de usuário |
| POST | `/api/auth/login` | publico | Login e geração de token JWT |

### Usuário
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/user/profile` | Privado | Ver perfil do usuário |
| DELETE | `/api/user` | Privado | Excluir conta |

### Jogador

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/player/:region/:name/:tag` | Publico | Busca dados do jogador |
| POST | `/api/player/update/:region/:name/:tag` | Publico | Força atualização dos dados |
| GET | `/api/player/rank-history/:region/:name/:tag` | Publico | Histórico de rank |

### Favoritos
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/favorites` | Privado | Favoritar jogador |
| GET | `/api/favorites` | Privado | Listar favoritos |
| DELETE | `/api/favorites/:id` | Privado | Remover favorito |

### Regiões disponíveis
`br` `na` `eu` `ap` `latam` `kr

### Testes backend
Para testes rapidos de funcionamento:
Utilizar a extensão Thunder Client