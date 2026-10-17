# 🏋️ FORMA — Sistema de Gestão de Academia

Sistema web para gerenciamento de academias, desenvolvido para centralizar o cadastro de alunos, a organização de treinos e o gerenciamento de exercícios em uma única interface administrativa.

O projeto utiliza uma API REST desenvolvida em Python com FastAPI, banco de dados PostgreSQL e uma interface construída com HTML, CSS e JavaScript.

**Repositório:** [CaioHartenGit/Sistema-Academia](https://github.com/CaioHartenGit/Sistema-Academia)

## 📌 Funcionalidades

### 👤 Gerenciamento de alunos

- Cadastro de alunos com nome completo, idade e plano contratado.
- Listagem dos alunos cadastrados em uma tabela dinâmica.
- Consulta individual por identificador (ID).
- Pesquisa por nome.
- Filtragem por plano contratado.
- Edição dos dados cadastrais.
- Exclusão de registros.
- Ativação e desativação de alunos.
- Indicadores com o total de alunos cadastrados, ativos e inativos.
- Atualização da listagem e dos indicadores após as operações.

### 🏋️ Gerenciamento de treinos

- Cadastro de treinos vinculados a alunos.
- Definição do nome e do dia da semana.
- Listagem de todos os treinos cadastrados.
- Consulta dos treinos associados a um aluno por ID.
- Atualização dos dados de um treino.
- Exclusão de treinos.
- Exibição dos dados dos treinos em registros organizados na interface.

### 💪 Gerenciamento de exercícios

- Cadastro de exercícios com nome, número de séries e repetições.
- Associação de exercícios a treinos por meio do ID.
- Consulta dos exercícios de um treino específico.
- Listagem dos exercícios cadastrados no contexto de consulta.
- Edição das informações de um exercício.
- Exclusão de exercícios.
- Validação dos campos dos formulários.

## 🎨 Interface e experiência de uso

A interface administrativa **Forma | Gestão de Academia** foi desenvolvida para oferecer uma experiência organizada e intuitiva.

Entre os recursos implementados estão:

- Navegação entre os módulos de alunos, treinos e exercícios.
- Identidade visual própria para o sistema.
- Layouts e estilos CSS separados por módulo.
- Formulários para cadastro, consulta e edição.
- Tabelas e registros gerados dinamicamente com JavaScript.
- Mensagens de sucesso e erro nas operações.
- Confirmação antes de operações destrutivas ou alterações de status.
- Indicadores administrativos para acompanhamento dos cadastros.
- Campos com validações HTML e restrições de preenchimento.
- Integração entre a interface e a API por meio de requisições HTTP.

## 🛠️ Tecnologias utilizadas

### Front-end

- **HTML5:** estruturação das páginas e formulários.
- **CSS3:** identidade visual, layouts e estilização dos módulos.
- **JavaScript:** interatividade, validação, manipulação do DOM e comunicação com a API.

### Back-end

- **Python:** linguagem utilizada na implementação da lógica da aplicação.
- **FastAPI:** construção da API REST e definição dos endpoints.
- **Pydantic:** validação e estruturação dos dados de entrada e saída.
- **Psycopg 3:** comunicação com o PostgreSQL.

### Banco de dados e ferramentas

- **PostgreSQL:** banco de dados relacional para persistência das informações.
- **Git:** controle de versão.
- **GitHub:** hospedagem e compartilhamento do código-fonte.

## 🧱 Arquitetura do projeto

O back-end está organizado em camadas, separando as responsabilidades da aplicação:

- **Routers:** recebem as requisições HTTP e definem os endpoints.
- **Schemas:** definem os formatos e as validações dos dados.
- **Services:** concentram as regras e operações da aplicação.
- **Repositories:** executam as operações de acesso ao banco de dados.
- **Entities:** representam os objetos utilizados pelo sistema.
- **Database:** concentra a configuração de conexão com o PostgreSQL.

Essa organização facilita a manutenção, a compreensão do código e a evolução das funcionalidades.

## 📂 Estrutura do projeto

```text
Sistema-Academia/
├── apps/
│   ├── database/
│   │   └── conexao.py
│   ├── entities/
│   │   ├── aluno.py
│   │   ├── treino.py
│   │   └── exercicio.py
│   ├── repositories/
│   │   ├── aluno_repository.py
│   │   ├── treino_repository.py
│   │   └── exercicio_repository.py
│   ├── routers/
│   │   ├── alunos_routers.py
│   │   ├── treinos_routers.py
│   │   └── exercicios_routers.py
│   ├── schemas/
│   │   ├── alunos_schemas.py
│   │   ├── treino_schemas.py
│   │   └── exercicios_schemas.py
│   ├── services/
│   │   ├── aluno_service.py
│   │   ├── treino_service.py
│   │   └── exercicio_service.py
│   └── main.py
├── front-end/
│   ├── css/
│   │   ├── style.css
│   │   ├── treinos.css
│   │   └── exercicio.css
│   ├── js/
│   │   ├── api.js
│   │   ├── aluno.js
│   │   ├── treino.js
│   │   └── exercicio.js
│   └── index.html
├── .env.example
├── .gitignore
├── pyproject.toml
└── README.md
```

## ⚙️ Como executar o projeto localmente

### 1. Pré-requisitos

Antes de iniciar, instale:

- Python 3.10 ou superior.
- PostgreSQL.
- Git.
- Um navegador atualizado.

### 2. Clonar o repositório

```bash
git clone https://github.com/CaioHartenGit/Sistema-Academia.git
cd Sistema-Academia
```

### 3. Criar um ambiente virtual

No macOS ou Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

No Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

### 4. Instalar as dependências

```bash
pip install -e .
pip install python-dotenv
```

O projeto utiliza as dependências declaradas no `pyproject.toml` e o pacote `python-dotenv` para carregar as variáveis de ambiente.

### 5. Configurar o banco de dados

Crie o banco de dados PostgreSQL e configure as credenciais utilizadas pela aplicação.

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=academia
DB_USER=postgres
DB_PASSWORD=sua_senha
```

Substitua os valores pelos dados do seu ambiente.

**Importante:** as tabelas e os relacionamentos necessários devem estar configurados no banco de dados antes de executar a aplicação.

Não compartilhe o arquivo `.env` nem publique credenciais reais no GitHub.

### 6. Iniciar o back-end

Com o ambiente virtual ativado e o PostgreSQL em execução, inicie a API a partir da raiz do projeto:

```bash
uvicorn apps.main:app --reload
```

Esse comando pressupõe que os imports dos routers estejam ajustados à estrutura de pacotes do projeto e que todos os routers necessários estejam registrados na aplicação FastAPI.

### 7. Iniciar o front-end

Em outro terminal, na raiz do projeto, execute:

```bash
python3 -m http.server 5500 --directory front-end
```

Abra o endereço abaixo no navegador:

http://127.0.0.1:5500

O front-end precisa estar configurado para se comunicar com o endereço da API em execução.

### 8. Acessar a documentação da API

Com o back-end iniciado, acesse:

- **Swagger UI:** http://127.0.0.1:8000/docs
- **OpenAPI:** http://127.0.0.1:8000/openapi.json

A documentação interativa permite consultar os endpoints e testar as requisições da API.

## 🔌 Principais endpoints da API

Os routers do projeto definem operações para os seguintes recursos:

| Método | Endpoint | Operação |
|---|---|---|
| GET | `/alunos/` | Listar alunos |
| POST | `/alunos/` | Cadastrar aluno |
| GET | `/alunos/{id_aluno}` | Buscar aluno por ID |
| GET | `/alunos/nome/{nome}` | Buscar alunos por nome |
| GET | `/alunos/plano/{plano}` | Filtrar alunos por plano |
| PUT | `/alunos/{id_aluno}` | Atualizar aluno |
| DELETE | `/alunos/{id_aluno}` | Excluir aluno |
| PATCH | `/alunos/{id_aluno}/ativar` | Ativar aluno |
| PATCH | `/alunos/{id_aluno}/desativar` | Desativar aluno |
| GET | `/treinos/` | Listar treinos |
| POST | `/treinos/` | Cadastrar treino |
| GET | `/treinos/{id_aluno}` | Consultar treinos de um aluno |
| PUT | `/treinos/{id_aluno}` | Atualizar treino conforme a implementação atual |
| DELETE | `/treinos/{id_treino}` | Excluir treino |
| POST | `/exercicios/` | Cadastrar exercício |
| GET | `/exercicios/{id_treino}` | Consultar exercícios de um treino |
| PUT | `/exercicios/{id_exercicio}` | Atualizar exercício |
| DELETE | `/exercicios/{id_exercicio}` | Excluir exercício |

**Observação:** a disponibilidade efetiva dos endpoints depende de seus respectivos routers estarem registrados na aplicação FastAPI.

## 🔒 Validação e tratamento de erros

O projeto utiliza schemas para validar dados recebidos pela API e implementa tratamento de erros nas operações de gerenciamento.

No front-end, as requisições são realizadas por JavaScript, que interpreta as respostas da API e apresenta mensagens de retorno ao usuário.

As validações dos formulários também ajudam a evitar o envio de campos obrigatórios vazios e valores fora dos limites definidos.

## 🚀 Preparação para deploy

Antes de publicar o sistema em um ambiente de produção, é necessário:

- Configurar o banco de dados em um serviço acessível pelo back-end.
- Definir as variáveis de ambiente no ambiente de hospedagem.
- Ajustar o endereço da API utilizado pelo front-end.
- Configurar o CORS para permitir as origens autorizadas.
- Confirmar que todos os routers estão registrados na aplicação.
- Garantir que os imports funcionem no ambiente de produção.
- Verificar a instalação de todas as dependências.
- Testar os fluxos de cadastro, consulta, edição e exclusão.
- Evitar a exposição de credenciais e informações sensíveis.
- Utilizar HTTPS e configurações adequadas para produção.

## 🎯 Objetivo do projeto

O Sistema Forma foi desenvolvido para colocar em prática conhecimentos de desenvolvimento web, construção de APIs REST, programação em Python, manipulação do DOM, integração entre front-end e back-end e persistência de dados em bancos relacionais.

Além de servir como ferramenta de gerenciamento de academia, o projeto representa uma experiência prática de desenvolvimento full stack, organização de código e trabalho com tecnologias utilizadas no desenvolvimento de aplicações web.

---

**Projeto:** Sistema Forma | Gestão de Academia  
**Repositório:** [GitHub — Sistema-Academia](https://github.com/CaioHartenGit/Sistema-Academia)  
**Status:** funcionalidades de gerenciamento implementadas; configuração e validação do ambiente de produção pendentes.
