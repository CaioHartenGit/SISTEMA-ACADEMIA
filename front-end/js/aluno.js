
async function listarAlunos() {
    const lista = document.getElementById("lista-alunos");
    const mensagem = document.getElementById("mensagem-alunos");

    lista.textContent = "Carregando alunos...";
    mensagem.textContent = "";

    try {
        const alunos = await requisicaoAPI("/alunos/");

        if (alunos.length === 0) {
            lista.textContent = "Nenhum aluno cadastrado.";
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

            const valores = [
                aluno.id_aluno,
                aluno.nome,
                aluno.idade,
                aluno.plano,
                aluno.ativo ? "Ativo" : "Inativo"
            ];

            valores.forEach((valor) => {
                const celula = document.createElement("td");
                celula.textContent = valor ?? "-";
                linha.appendChild(celula);
            });

            const celulaAcoes = document.createElement("td");

            // Botão EDITAR
            const botaoEditar = document.createElement("button");
            botaoEditar.type = "button";
            botaoEditar.textContent = "Editar";

            botaoEditar.addEventListener("click", () => {
                abrirEdicaoAluno(aluno);
            });

            // Botão EXCLUIR
            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.textContent = "Excluir";
            botaoExcluir.classList.add("botao-excluir");

            botaoExcluir.addEventListener("click", () => {
                excluirAluno(aluno);
            });

            celulaAcoes.appendChild(botaoEditar);
            celulaAcoes.appendChild(botaoExcluir);

            linha.appendChild(celulaAcoes);
            corpoTabela.appendChild(linha);
        });

        lista.replaceChildren(tabela);

    } catch (erro) {
        lista.textContent = "";
        mensagem.textContent =
            `Não foi possível carregar os alunos: ${erro.message}`;
    }
}


// Atualiza a lista
document
    .getElementById("btn-listar-alunos")
    .addEventListener("click", listarAlunos);

document.addEventListener("DOMContentLoaded", listarAlunos);


// CADASTRAR ALUNO
const formularioAluno = document.getElementById("form-aluno");

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

        await listarAlunos();

    } catch (erro) {
        mensagem.textContent =
            `Erro ao cadastrar aluno: ${erro.message}`;
    } finally {
        botao.disabled = false;
        botao.textContent = "Cadastrar aluno";
    }
});


// ABRIR EDIÇÃO
function abrirEdicaoAluno(aluno) {
    document.getElementById("editar-id-aluno").value = aluno.id_aluno;
    document.getElementById("editar-nome-aluno").value = aluno.nome;
    document.getElementById("editar-idade-aluno").value = aluno.idade;
    document.getElementById("editar-plano-aluno").value = aluno.plano;

    document.getElementById("mensagem-edicao").textContent = "";

    const cartaoEdicao = document.getElementById("cartao-edicao");
    cartaoEdicao.hidden = false;

    cartaoEdicao.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// SALVAR ALTERAÇÕES
const formularioEdicao = document.getElementById("form-editar-aluno");

formularioEdicao.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const idAluno = document.getElementById("editar-id-aluno").value;
    const mensagem = document.getElementById("mensagem-edicao");
    const botao = document.getElementById("btn-salvar-edicao");
    const cartaoEdicao = document.getElementById("cartao-edicao");

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

        await listarAlunos();

        formularioEdicao.reset();
        cartaoEdicao.hidden = true;

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
        document.getElementById("cartao-edicao").hidden = true;
        document.getElementById("mensagem-edicao").textContent = "";
    });


// EXCLUIR ALUNO
async function excluirAluno(aluno) {
    const confirmar = window.confirm(
        `Tem certeza que deseja excluir o aluno ${aluno.nome} (ID ${aluno.id_aluno})?`
    );

    if (!confirmar) {
        return;
    }

    const mensagem = document.getElementById("mensagem-alunos");

    mensagem.textContent = `Excluindo aluno ${aluno.nome}...`;

    try {
        await requisicaoAPI(`/alunos/${aluno.id_aluno}`, {
            method: "DELETE"
        });

        mensagem.textContent = `Aluno ${aluno.nome} excluído com sucesso!`;

        // Fecha a edição caso o aluno excluído estivesse selecionado
        const idEmEdicao = document.getElementById("editar-id-aluno").value;

        if (String(idEmEdicao) === String(aluno.id_aluno)) {
            formularioEdicao.reset();
            document.getElementById("cartao-edicao").hidden = true;
            document.getElementById("mensagem-edicao").textContent = "";
        }

        await listarAlunos();

        // Mantém a confirmação visível depois de atualizar a tabela
        mensagem.textContent = `Aluno ${aluno.nome} excluído com sucesso!`;

    } catch (erro) {
        mensagem.textContent =
            `Erro ao excluir aluno: ${erro.message}`;
    }
}
