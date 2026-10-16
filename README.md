# 🏋️ Sistema de Academia

Projeto de desenvolvimento de uma API REST para gerenciamento de uma academia, utilizando Python, FastAPI e PostgreSQL.

Este é um projeto de aprendizado prático com foco no desenvolvimento backend, na organização do código em camadas e na comunicação com um banco de dados relacional.

## 🚀 Tecnologias utilizadas

- **Python** — linguagem de programação.
- **FastAPI** — criação das rotas e desenvolvimento da API REST.
- **PostgreSQL** — banco de dados relacional.
- **Psycopg 3** — conexão e execução de operações no PostgreSQL.
- **Pydantic** — definição de schemas e validação dos dados.
- **Git e GitHub** — controle de versão e compartilhamento do código.

## 📌 Funcionalidades implementadas

### 👤 Alunos
- Rotas para operações de gerenciamento de alunos.
- Validação dos dados recebidos.
- Tratamento de erros nas operações implementadas.

### 🏋️ Treinos
- Rotas para operações de gerenciamento de treinos.
- Integração com o banco de dados.
- Validação de dados e tratamento de erros.

### 💪 Exercícios
- Rotas para criar, listar, atualizar e excluir exercícios.
- Associação dos exercícios aos treinos.
- Validação dos dados recebidos.
- Tratamento de erros nas operações implementadas.

### 🗄️ Banco de dados
- Utilização do PostgreSQL.
- Persistência dos dados por meio do repositório.
- Revisão da estrutura e dos relacionamentos necessários para o projeto.

## 🧱 Organização do projeto

O código está organizado em camadas para separar as responsabilidades da aplicação:

- **Routers:** definem os endpoints e recebem as requisições HTTP.
- **Schemas:** definem os formatos e as validações dos dados.
- **Services:** concentram a lógica das operações.
- **Repositories:** realizam as operações de acesso ao banco de dados.
- **Entidades:** representam os objetos utilizados na lógica do sistema.

A estrutura busca facilitar a leitura, a manutenção e a evolução do código.

## ⚙️ Como executar o projeto

### 1. Pré-requisitos

- Python instalado.
- PostgreSQL instalado e em execução.
- Banco de dados criado e configurado conforme as necessidades da aplicação.
- Git instalado.

### 2. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd SISTEMA-ACADEMIA
```

Substitua `URL_DO_REPOSITORIO` pelo endereço real do repositório no GitHub.

### 3. Criar e ativar um ambiente virtual

No macOS ou Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 4. Instalar as dependências

Se o projeto possui um arquivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

Caso as dependências ainda não estejam registradas nesse arquivo, instale as que o projeto utiliza conforme a configuração atual.

### 5. Configurar o banco de dados

Configure as credenciais e os parâmetros de conexão do PostgreSQL de acordo com o método utilizado pela aplicação.

Não compartilhe senhas ou outras credenciais no repositório.

### 6. Iniciar a API

A partir da pasta raiz do projeto:

```bash
PYTHONPATH="$(pwd)" fastapi dev apps/main.py
```

### 7. Acessar a documentação

Com a aplicação em execução, acesse:

- **Swagger UI:** http://127.0.0.1:8000/docs
- **OpenAPI:** http://127.0.0.1:8000/openapi.json

A documentação permite consultar os endpoints e realizar requisições manualmente.

## 🧪 Testes

Durante o desenvolvimento, as rotas e os tratamentos de erro são verificados manualmente, utilizando a documentação interativa da API.

A implementação de testes automatizados será considerada em projetos futuros, com uma arquitetura definida previamente para essa finalidade.

## 🔜 Próximas etapas

- [ ] Desenvolver o frontend.
- [ ] Integrar a interface com a API.
- [ ] Realizar testes manuais do fluxo completo da aplicação.
- [ ] Preparar e configurar o ambiente de produção.
- [ ] Publicar a aplicação por meio de deploy.

## 🎯 Objetivo do projeto

Consolidar conhecimentos práticos de desenvolvimento backend, construção de APIs REST, validação de dados, tratamento de erros, organização em camadas e integração com bancos de dados relacionais.

O projeto também serve como base de aprendizado para aplicações futuras, nas quais será possível definir previamente uma arquitetura mais consistente e incorporar testes automatizados desde o início.

---

**Status:** Backend implementado; frontend e deploy planejados.