### Configurar o Banco de Dados:

Clique em Shell e use: 
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

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro de usuário |
| POST | `/api/auth/login` | Login e geração de token JWT |

### Jogador

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/player/:region/:name/:tag` | Busca dados do jogador na Henrik API |

###
Para testes rapidos de funcionamento:
Utilizar a extensão Thunder Client