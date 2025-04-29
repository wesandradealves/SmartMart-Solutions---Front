# SmartMart Frontend

APP para gerenciamento interno de produtos, categorias e vendas da SmartMart Solutions.

- Frontend [https://github.com/wesandradealves/SmartMart-Solutions---Front](https://github.com/wesandradealves/SmartMart-Solutions---Front) 

- Backend [https://github.com/wesandradealves/SmartMart-Solutions](https://github.com/wesandradealves/SmartMart-Solutions) 

## Como Fazer Login
1. Acesse a página de login em `/login`.
2. Insira seu e-mail e senha cadastrados.
3. Clique no botão "Entrar".
4. Caso as credenciais estejam corretas, você será redirecionado para o dashboard.

## Informações dos Serviços Consumidos
O frontend consome os seguintes serviços da API:
- **Autenticação**: Gerencia login e logout dos usuários.
- **Usuários**: Gerencia informações de usuários, como criação, edição e listagem.
- **Produtos**: Permite visualizar, criar, editar e excluir produtos.
- **Vendas**: Gerencia o histórico de vendas e relatórios.
- **Categorias**: Gerencia categorias de produtos.

Os serviços são configurados no diretório `src/services` e utilizam a biblioteca `axios` para requisições HTTP.

## Funcionalidades Importantes
- **Autenticação**: Proteção de rotas com middleware e redirecionamento de usuários não autenticados.
- **Dashboard**: Exibe informações resumidas e permite navegação para diferentes seções, como produtos, vendas e usuários.
- **Gerenciamento de Produtos**: Criação, edição e exclusão de produtos.
- **Gerenciamento de Usuários**: Controle de permissões e gerenciamento de contas.
- **Relatórios de Vendas**: Visualização de histórico e relatórios detalhados.

## Dependências Necessárias
Certifique-se de instalar as seguintes dependências antes de rodar o projeto:
- Node.js (versão 18 ou superior)
- Docker e Docker Compose

As dependências do projeto estão listadas no arquivo `package.json` e incluem bibliotecas como:
- `react`
- `next`
- `axios`
- `tailwindcss`
- `styled-components`

## Como Rodar com o Docker
1. Certifique-se de que o Docker e o Docker Compose estão instalados.
2. Configure as variáveis de ambiente no arquivo `.env`.
3. Execute o comando abaixo para iniciar o container:
   ```bash
   docker-compose up --build
   ```
4. Acesse o aplicativo no navegador em `http://localhost:3000`.

## Scripts Disponíveis
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run start`: Inicia o servidor em modo de produção.
- `npm run lint`: Executa o linter para verificar problemas no código.

## Estrutura do Projeto
- **src/app/login**: Contém a página de login.
- **src/app/dashboard**: Contém o dashboard principal e suas subpáginas.
- **src/services**: Configuração dos serviços consumidos pela API.
- **src/hooks**: Hooks customizados, como `useAuthActions` para autenticação.
- **src/middleware.ts**: Middleware para proteção de rotas e controle de acesso.
