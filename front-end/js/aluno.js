
const listaAlunos = document.getElementById("lista-alunos");
const mensagemAlunos = document.getElementById("mensagem-alunos");
const mensagemBusca = document.getElementById("mensagem-busca");

const formularioAluno = document.getElementById("form-aluno");
const formularioEdicao = document.getElementById("form-editar-aluno");
const cartaoEdicao = document.getElementById("cartao-edicao");

// Indicadores da visão geral
const totalAlunosElemento = document.getElementById("total-alunos");
const alunosAtivosElemento = document.getElementById("alunos-ativos");
const alunosInativosElemento = document.getElementById("alunos-inativos");

// Guarda a lista completa recebida da API.
let todosOsAlunos = [];

// Converte a resposta da API em uma lista.
// A busca por ID pode retornar um único objeto.
function normalizarAlunos(resultado) {
    if (Array.isArray(resultado)) {
        return resultado;
    }

    if (resultado && typeof resultado === "object") {
        return [resultado];
    }

    return [];
}

// Atualiza os números da visão geral.
function atualizarIndicadores(alunos) {
    const total = alunos.length;

    const ativos = alunos.filter((aluno) => {
        return aluno.ativo === true || aluno.ativo === 1;
    }).length;

    const inativos = total - ativos;

    totalAlunosElemento.textContent = total;
    alunosAtivosElemento.textContent = ativos;
    alunosInativosElemento.textContent = inativos;
}

// Exibe mensagens na tela.
function mostrarMensagem(elemento, texto) {
    elemento.textContent = texto;
}

function limparMensagens() {
    mensagemAlunos.textContent = "";
    mensagemBusca.textContent = "";
}

// LISTAR TODOS OS ALUNOS
async function listarAlunos() {
    listaAlunos.textContent = "Carregando alunos...";
    mensagemAlunos.textContent = "";

    try {
        const resultado = await requisicaoAPI("/alunos/");
        const alunos = normalizarAlunos(resultado);

        // Guarda a lista completa para calcular os indicadores.
        todosOsAlunos = alunos;

        // Atualiza os indicadores com todos os registros.
        atualizarIndicadores(todosOsAlunos);

        // Atualiza a tabela.
        renderizarAlunos(alunos);
    } catch (erro) {
        listaAlunos.textContent = "";

        mostrarMensagem(
            mensagemAlunos,
            `Não foi possível carregar os alunos: ${erro.message}`
        );
    }
}

// DESENHAR A TABELA
function renderizarAlunos(alunos) {
    listaAlunos.replaceChildren();

    if (alunos.length === 0) {
        listaAlunos.textContent = "Nenhum aluno encontrado.";
        return;
    }

    const tabela = document.createElement("table");

    tabela.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Idade</th>
                <th>Plano</th>
                <th>Status</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const corpoTabela = tabela.querySelector("tbody");

    alunos.forEach((aluno) => {
        const linha = document.createElement("tr");

        [
            aluno.id_aluno,
            aluno.nome,
            aluno.idade,
            aluno.plano,
            aluno.ativo ? "Ativo" : "Inativo"
        ].forEach((valor) => {
            const celula = document.createElement("td");
            celula.textContent = valor ?? "-";
            linha.appendChild(celula);
        });

        const celulaAcoes = document.createElement("td");

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", () => {
            abrirEdicaoAluno(aluno);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("botao-excluir");

        botaoExcluir.addEventListener("click", () => {
            excluirAluno(aluno);
        });

        const botaoStatus = document.createElement("button");
        botaoStatus.type = "button";

        if (aluno.ativo) {
            botaoStatus.textContent = "Desativar";

            botaoStatus.addEventListener("click", () => {
                alterarStatusAluno(aluno, false);
            });
        } else {
            botaoStatus.textContent = "Ativar";

            botaoStatus.addEventListener("click", () => {
                alterarStatusAluno(aluno, true);
            });
        }

        celulaAcoes.append(
            botaoEditar,
            botaoStatus,
            botaoExcluir
        );

        linha.appendChild(celulaAcoes);
        corpoTabela.appendChild(linha);
    });

    listaAlunos.appendChild(tabela);
}

// ATUALIZAR LISTA
document
    .getElementById("btn-listar-alunos")
    .addEventListener("click", () => {
        limparMensagens();
        listarAlunos();
    });

// CADASTRAR ALUNO
formularioAluno.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const mensagem = document.getElementById("mensagem-cadastro");
    const botao = document.getElementById("btn-cadastrar-aluno");

    const dadosAluno = {
        nome: document.getElementById("nome-aluno").value.trim(),
        idade: Number(document.getElementById("idade-aluno").value),
        plano: document.getElementById("plano-aluno").value
    };

    mensagem.textContent = "";
    botao.disabled = true;
    botao.textContent = "Cadastrando...";

    try {
        await requisicaoAPI("/alunos/", {
            method: "POST",
            body: JSON.stringify(dadosAluno)
        });

        mensagem.textContent = "Aluno cadastrado com sucesso!";
        formularioAluno.reset();

        // Recarrega a tabela e os indicadores.
        await listarAlunos();
    } catch (erro) {
        mensagem.textContent =
            `Erro ao cadastrar aluno: ${erro.message}`;
    } finally {
        botao.disabled = false;
        botao.innerHTML = 'Cadastrar aluno <span aria-hidden="true">+</span>';
    }
});

// BUSCAR POR ID
document
    .getElementById("form-busca-id")
    .addEventListener("submit", async (evento) => {
        evento.preventDefault();
        limparMensagens();

        const id = document.getElementById("busca-id").value;

        if (!id) {
            mensagemBusca.textContent = "Digite o ID do aluno.";
            return;
        }

        try {
            const resultado = await requisicaoAPI(
                `/alunos/${encodeURIComponent(id)}`
            );

            renderizarAlunos(normalizarAlunos(resultado));
            mensagemBusca.textContent = "Busca por ID concluída.";
        } catch (erro) {
            listaAlunos.replaceChildren();

            mensagemBusca.textContent =
                `Não foi possível buscar o aluno: ${erro.message}`;
        }
    });

// BUSCAR POR NOME
document
    .getElementById("form-busca-nome")
    .addEventListener("submit", async (evento) => {
        evento.preventDefault();
        limparMensagens();

        const nome = document.getElementById("busca-nome").value.trim();

        if (!nome) {
            mensagemBusca.textContent = "Digite o nome do aluno.";
            return;
        }

        try {
            const resultado = await requisicaoAPI(
                `/alunos/nome/${encodeURIComponent(nome)}`
            );

            renderizarAlunos(normalizarAlunos(resultado));
            mensagemBusca.textContent = "Busca por nome concluída.";
        } catch (erro) {
            listaAlunos.replaceChildren();

            mensagemBusca.textContent =
                `Não foi possível buscar por nome: ${erro.message}`;
        }
    });

// BUSCAR POR PLANO
document
    .getElementById("form-busca-plano")
    .addEventListener("submit", async (evento) => {
        evento.preventDefault();
        limparMensagens();

        const plano = document.getElementById("busca-plano").value;

        if (!plano) {
            mensagemBusca.textContent = "Selecione um plano.";
            return;
        }

        try {
            const resultado = await requisicaoAPI(
                `/alunos/plano/${encodeURIComponent(plano)}`
            );

            renderizarAlunos(normalizarAlunos(resultado));
            mensagemBusca.textContent = "Filtro por plano concluído.";
        } catch (erro) {
            listaAlunos.replaceChildren();

            mensagemBusca.textContent =
                `Não foi possível filtrar por plano: ${erro.message}`;
        }
    });

// LIMPAR FILTROS E MOSTRAR TODOS
document
    .getElementById("btn-limpar-busca")
    .addEventListener("click", () => {
        document.getElementById("form-busca-id").reset();
        document.getElementById("form-busca-nome").reset();
        document.getElementById("form-busca-plano").reset();

        limparMensagens();
        listarAlunos();
    });

// ABRIR EDIÇÃO
function abrirEdicaoAluno(aluno) {
    document.getElementById("editar-id-aluno").value = aluno.id_aluno;
    document.getElementById("editar-nome-aluno").value = aluno.nome;
    document.getElementById("editar-idade-aluno").value = aluno.idade;
    document.getElementById("editar-plano-aluno").value = aluno.plano;

    document.getElementById("mensagem-edicao").textContent = "";
    cartaoEdicao.hidden = false;

    cartaoEdicao.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// SALVAR ALTERAÇÕES
formularioEdicao.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const idAluno = document.getElementById("editar-id-aluno").value;
    const mensagem = document.getElementById("mensagem-edicao");
    const botao = document.getElementById("btn-salvar-edicao");

    const dadosAtualizados = {
        idade: Number(document.getElementById("editar-idade-aluno").value),
        plano: document.getElementById("editar-plano-aluno").value
    };

    mensagem.textContent = "";
    botao.disabled = true;
    botao.textContent = "Salvando...";

    try {
        await requisicaoAPI(`/alunos/${idAluno}`, {
            method: "PUT",
            body: JSON.stringify(dadosAtualizados)
        });

        mensagem.textContent = "Aluno atualizado com sucesso!";

        formularioEdicao.reset();
        cartaoEdicao.hidden = true;

        // Recarrega a lista e os indicadores.
        await listarAlunos();
    } catch (erro) {
        mensagem.textContent =
            `Erro ao atualizar aluno: ${erro.message}`;
    } finally {
        botao.disabled = false;
        botao.textContent = "Salvar alterações";
    }
});

// CANCELAR EDIÇÃO
document
    .getElementById("btn-cancelar-edicao")
    .addEventListener("click", () => {
        formularioEdicao.reset();
        cartaoEdicao.hidden = true;
        document.getElementById("mensagem-edicao").textContent = "";
    });

// EXCLUIR ALUNO
async function excluirAluno(aluno) {
    const confirmar = window.confirm(
        `Tem certeza que deseja excluir ${aluno.nome} (ID ${aluno.id_aluno})?`
    );

    if (!confirmar) {
        return;
    }

    try {
        await requisicaoAPI(`/alunos/${aluno.id_aluno}`, {
            method: "DELETE"
        });

        if (
            String(document.getElementById("editar-id-aluno").value) ===
            String(aluno.id_aluno)
        ) {
            formularioEdicao.reset();
            cartaoEdicao.hidden = true;
        }

        await listarAlunos();

        mensagemAlunos.textContent =
            `Aluno ${aluno.nome} excluído com sucesso!`;
    } catch (erro) {
        mensagemAlunos.textContent =
            `Erro ao excluir aluno: ${erro.message}`;
    }
}

// ATIVAR OU DESATIVAR ALUNO
async function alterarStatusAluno(aluno, ativar) {
    const acao = ativar ? "ativar" : "desativar";

    const confirmar = window.confirm(
        `Deseja ${acao} o aluno ${aluno.nome}?`
    );

    if (!confirmar) {
        return;
    }

    try {
        await requisicaoAPI(
            `/alunos/${aluno.id_aluno}/${acao}`,
            { method: "PATCH" }
        );

        await listarAlunos();

        mensagemAlunos.textContent =
            `Aluno ${aluno.nome} ${
                ativar ? "ativado" : "desativado"
            } com sucesso!`;
    } catch (erro) {
        mensagemAlunos.textContent =
            `Erro ao ${acao} aluno: ${erro.message}`;
    }
}

// CARREGAR ALUNOS QUANDO A PÁGINA INICIAR
listarAlunos();
