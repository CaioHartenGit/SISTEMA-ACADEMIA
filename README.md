# 🏋️ FORMA — Sistema de Gestão de Academia

O **FORMA** é um sistema de gestão de academia desenvolvido para facilitar o gerenciamento de alunos, treinos e exercícios em um único ambiente. O projeto utiliza uma API REST desenvolvida em Python com FastAPI, integrada a um banco de dados PostgreSQL, e uma interface web construída com HTML, CSS e JavaScript.

O projeto foi desenvolvido com foco na organização do código, na separação de responsabilidades e na integração entre frontend e backend, aplicando conceitos importantes do desenvolvimento de software.

## 🌐 Acesse o projeto

- **Aplicação web:** https://projetosistemaacademia.netlify.app/
- **API — Backend:** https://sistema-academia-7w5d.onrender.com/
- **Documentação interativa da API (Swagger):** https://sistema-academia-7w5d.onrender.com/docs
- **Repositório GitHub:** https://github.com/CaioHartenGit/Sistema-Academia

## ✨ Funcionalidades

### 👤 Gerenciamento de alunos

- Cadastro de alunos.
- Consulta e visualização de alunos cadastrados.
- Atualização dos dados dos alunos.
- Exclusão de registros.
- Integração com o backend para persistência das informações.

### 💪 Gerenciamento de treinos

- Cadastro de treinos associados aos alunos.
- Consulta dos treinos de um aluno.
- Edição dos treinos cadastrados.
- Exclusão de treinos.
- Exibição de mensagens de erro relacionadas à exclusão dentro do card do treino correspondente, facilitando a identificação de problemas.
- Integração com a API para realizar as operações de gerenciamento.

### 🏃 Gerenciamento de exercícios

- Cadastro de exercícios.
- Consulta dos exercícios cadastrados.
- Atualização e exclusão de registros, conforme as operações disponibilizadas pelo backend.
- Integração entre a interface web e a API.

> **Observação:** as funcionalidades disponíveis dependem das operações implementadas e configuradas em cada módulo do projeto.

## 🛠️ Tecnologias utilizadas

### Frontend

- **HTML5:** estrutura das páginas.
- **CSS3:** estilização e organização visual da interface.
- **JavaScript:** interatividade, validações e comunicação com a API.
- **Fetch API:** realização de requisições HTTP ao backend.

### Backend

- **Python:** linguagem utilizada no desenvolvimento da aplicação.
- **FastAPI:** framework para criação da API REST.
- **Pydantic:** validação e estruturação dos dados recebidos e enviados pela API.
- **Psycopg:** conexão e comunicação com o banco de dados PostgreSQL.

### Banco de dados e infraestrutura

- **PostgreSQL:** armazenamento persistente dos dados.
- **Neon:** hospedagem do banco de dados PostgreSQL.
- **Render:** hospedagem do backend.
- **Netlify:** publicação do frontend.
- **Git e GitHub:** versionamento e gerenciamento do código-fonte.

## 🏗️ Arquitetura do projeto

O backend está organizado em camadas, separando as responsabilidades de cada parte da aplicação. Essa organização facilita a manutenção, a leitura e a evolução do código.

| Camada | Responsabilidade |
|---|---|
| `entities` | Representação das entidades do sistema. |
| `schemas` | Estruturação e validação dos dados de entrada e saída. |
| `repositories` | Acesso e operações relacionadas ao banco de dados. |
| `services` | Implementação das regras de negócio. |
| `routers` | Definição das rotas e dos endpoints da API. |
| `database` | Configuração da conexão com o banco de dados. |

O frontend é responsável pela interface com o usuário e se comunica com o backend por meio de requisições HTTP.

## 📁 Estrutura de pastas

```text
Sistema-Academia/
│
├── apps/
│   ├── database/
│   │   └── conexao.py
│   │
│   ├── entities/
│   │   ├── aluno.py
│   │   ├── treino.py
│   │   └── exercicio.py
│   │
│   ├── repositories/
│   │   ├── aluno_repository.py
│   │   ├── treino_repository.py
│   │   └── exercicio_repository.py
│   │
│   ├── routers/
│   │   ├── alunos_routers.py
│   │   ├── treinos_routers.py
│   │   └── exercicios_routers.py
│   │
│   ├── schemas/
│   │   ├── alunos_schemas.py
│   │   ├── treino_schemas.py
│   │   └── exercicios_schemas.py
│   │
│   ├── services/
│   │   ├── aluno_service.py
│   │   ├── treino_service.py
│   │   └── exercicio_service.py
│   │
│   └── main.py
│
├── front-end/
│   ├── css/
│   ├── js/
│   │   ├── api.js
│   │   ├── aluno.js
│   │   ├── treino.js
│   │   └── exercicio.js
│   └── index.html
│
├── .env.example
├── .gitignore
├── pyproject.toml
├── requirements.txt
└── README.md
```

## ⚙️ Como executar o projeto localmente

### 1. Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Python compatível com as dependências do projeto.
- Git.
- Um navegador atualizado.
- Acesso a uma instância PostgreSQL configurada para a aplicação.

### 2. Clone o repositório

```bash
git clone https://github.com/CaioHartenGit/Sistema-Academia.git
```

Entre na pasta do projeto:

```bash
cd Sistema-Academia
```

### 3. Crie um ambiente virtual

```bash
python -m venv .venv
```

Ative o ambiente virtual.

**macOS ou Linux:**

```bash
source .venv/bin/activate
```

**Windows (PowerShell):**

```powershell
.venv\Scripts\Activate.ps1
```

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

### 5. Configure as variáveis de ambiente

Crie um arquivo `.env` com as configurações necessárias para conectar a aplicação ao PostgreSQL.

Utilize o arquivo `.env.example` como referência e preencha os valores de acordo com a configuração utilizada no projeto.

> **Importante:** nunca envie senhas, credenciais ou outras informações sensíveis para o GitHub. O arquivo `.env` deve permanecer fora do controle de versão.

### 6. Inicie o backend

Na raiz do projeto, execute:

```bash
uvicorn apps.main:app --reload
```

Se a configuração estiver correta, a API ficará disponível localmente em:

- **API:** http://127.0.0.1:8000
- **Swagger:** http://127.0.0.1:8000/docs

### 7. Inicie o frontend

Em outro terminal, na raiz do projeto, execute:

```bash
python -m http.server 5500 --directory front-end
```

Depois, abra:

http://127.0.0.1:5500

**Atenção:** confirme se o frontend está configurado para utilizar o endereço local da API (`http://127.0.0.1:8000`) durante os testes. Caso esteja apontando para o backend publicado, ajuste a configuração de acordo com o ambiente.

## 🔌 API REST

O backend disponibiliza endpoints para as operações dos módulos de alunos, treinos e exercícios.

A documentação interativa do FastAPI permite consultar as rotas disponíveis, verificar os parâmetros necessários e testar as requisições diretamente pelo navegador.

**Documentação:** https://sistema-academia-7w5d.onrender.com/docs

Entre os métodos HTTP utilizados em APIs REST estão:

| Método | Finalidade comum |
|---|---|
| `GET` | Consultar informações. |
| `POST` | Criar registros. |
| `PUT` | Atualizar um recurso. |
| `PATCH` | Atualizar parcialmente um recurso. |
| `DELETE` | Excluir registros. |

Os endpoints, parâmetros e métodos efetivamente disponíveis devem ser consultados na documentação Swagger da aplicação.

## ☁️ Deploy e hospedagem

O projeto utiliza serviços de hospedagem separados para cada parte da aplicação:

- **Frontend — Netlify:** disponibiliza a interface web.
- **Backend — Render:** executa a API desenvolvida em Python com FastAPI.
- **Banco de dados — Neon:** fornece o PostgreSQL utilizado para armazenar os dados.

Essa separação permite que a interface, a API e o banco de dados sejam configurados e mantidos de forma independente.

Para que a aplicação funcione corretamente em produção, é necessário garantir que:

- O frontend esteja apontando para a URL correta da API.
- As variáveis de ambiente do backend estejam configuradas no serviço de hospedagem.
- O backend consiga estabelecer conexão com o PostgreSQL.
- As configurações de CORS permitam as requisições originadas do domínio do frontend.
- As credenciais e demais dados sensíveis sejam armazenados de forma segura.

## 🔒 Boas práticas adotadas

A organização do projeto busca favorecer:

- Separação de responsabilidades entre as camadas.
- Centralização do acesso ao banco de dados nos repositórios.
- Organização das regras de negócio nos serviços.
- Validação de dados por meio de schemas.
- Separação entre interface web e API.
- Versionamento do código com Git e GitHub.
- Uso de variáveis de ambiente para configurações sensíveis.

## 🚀 Melhorias futuras

Algumas possibilidades para a evolução do projeto incluem:

- Implementação de autenticação e autorização de usuários.
- Criação de testes automatizados para os serviços e endpoints.
- Melhorias na validação e no tratamento de erros.
- Paginação e filtros para consultas com muitos registros.
- Aprimoramento da responsividade e da acessibilidade da interface.
- Monitoramento e registro de erros em produção.
- Expansão das funcionalidades de gerenciamento de alunos, treinos e exercícios.

## 🎯 Objetivo do projeto

O FORMA tem como objetivo desenvolver uma solução web para gerenciamento de academia, colocando em prática conhecimentos de desenvolvimento frontend, criação de APIs REST, integração com bancos de dados relacionais, organização de código e publicação de aplicações na internet.

Além de atender à proposta funcional, o projeto representa uma oportunidade de aprendizado prático sobre o desenvolvimento de sistemas completos, desde a interface do usuário até a persistência dos dados.

## 👨‍💻 Desenvolvedores

Projeto desenvolvido como iniciativa prática de desenvolvimento de software, com colaboração entre seus participantes.

**Repositório:** https://github.com/CaioHartenGit/Sistema-Academia

---

<p align="center">
  Desenvolvido com dedicação, aprendizado e tecnologia. 💙
</p>