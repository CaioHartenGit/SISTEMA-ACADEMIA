
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

            corpoTabela.appendChild(linha);
        });

        lista.replaceChildren(tabela);

    } catch (erro) {
        lista.textContent = "";
        mensagem.textContent = `Não foi possível carregar os alunos: ${erro.message}`;
    }
}

document
    .getElementById("btn-listar-alunos")
    .addEventListener("click", listarAlunos);

document.addEventListener("DOMContentLoaded", listarAlunos);


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
        mensagem.textContent = `Erro ao cadastrar aluno: ${erro.message}`;
    } finally {
        botao.disabled = false;
        botao.textContent = "Cadastrar aluno";
    }
});
