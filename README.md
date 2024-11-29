# Project Management API

![project-board](https://github.com/user-attachments/assets/2aa96e04-cd1c-4034-8bd2-bb60d4c3d290)

Este é um projeto de **API de Gerenciamento de Projetos** que permite criar, listar e gerenciar tarefas, usuários e projetos. A API fornece endpoints para autenticação de usuários, gerenciamento de tarefas, e acompanhamento de projetos.

## Funcionalidades

- **Autenticação**: Criação de novos usuários e login para autenticação via token JWT.
- **Gerenciamento de Tarefas**: Criação, atualização e exclusão de tarefas, com funcionalidades de filtro e busca.
- **Gerenciamento de Projetos**: Criação e gestão de projetos, incluindo vinculação de tarefas aos projetos.
- **Atribuição de Tarefas**: Possibilidade de atribuir e alterar responsáveis pelas tarefas.

## Tecnologias Utilizadas

#### FRONT-END

- **Next.js**: Framework React para construção de aplicações full-stack com renderização do lado do servidor (SSR) e geração de sites estáticos (SSG).
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática, melhorando a manutenção e a segurança do código.
- **Tailwind CSS**: Framework utilitário para criar interfaces de usuário altamente customizáveis de forma rápida e eficiente.
- **Material UI**: Biblioteca de componentes React para interfaces de usuário com design material.
- **Redux**: Biblioteca para gerenciamento de estado global da aplicação, facilitando a comunicação entre os componentes.

#### BACK-END

- **Node.js** com **Express** para a criação da API.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática, melhorando a manutenção e a segurança do código.
- **Prisma** para interação com o banco de dados.
- **JWT** para autenticação de usuários.
- **Swagger** para documentação da API.

## Inicialização do Projeto

Siga os passos abaixo para rodar o projeto localmente:

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/project-management-api.git
cd project-management-api
```

### 2. Instale as dependências

Dentro do diretório do projeto, execute o seguinte comando para instalar as dependências necessárias:

```
npm install
```

### 3. Configuração do Banco de Dados

Antes de iniciar o servidor, configure as variáveis de ambiente para o seu banco de dados. Crie um arquivo .env na raiz do projeto e adicione a seguinte configuração:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
JWT_SECRET="sua_chave_secreta"
```

### 4. Rodar as Migrações

Para configurar o banco de dados, execute as migrações com o Prisma:

```
npx prisma migrate deploy
```

### 5. Iniciar o Servidor

Para rodar o servidor localmente, execute:

```
cd server/
npm run dev
```

E para popular o seu database com alguns dados, execute:

```
npm run seed
```

### 6. Abrir a Aplicação

Com o servidor rodando acesse o link: https://project-management-tascherer.vercel.app/sign-in

Ou para rodar o client localmente, execute:

```
cd client/
npm run dev
```

### Como Acessar a Documentação da API

A documentação da API gerada automaticamente com Swagger pode ser acessada em:

```
http://localhost:8000/api-docs
```
