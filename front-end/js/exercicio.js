
document.addEventListener("DOMContentLoaded", () => {
    const formExercicio = document.getElementById("form-exercicio");
    const formBusca = document.getElementById("form-busca-exercicio");
    const formEdicao = document.getElementById("form-editar-exercicio");

    const nomeExercicio = document.getElementById("nome-exercicio");
    const seriesExercicio = document.getElementById("series-exercicio");
    const repeticoesExercicio = document.getElementById("repeticoes-exercicio");
    const idTreinoExercicio = document.getElementById("id-treino-exercicio");

    const buscaIdTreino = document.getElementById("busca-id-treino-exercicio");
    const listaExercicios = document.getElementById("lista-exercicios");
    const mensagemExercicios = document.getElementById("mensagem-exercicios");

    const cartaoEdicao = document.getElementById("cartao-edicao-exercicio");
    const editarId = document.getElementById("editar-id-exercicio");
    const editarNome = document.getElementById("editar-nome-exercicio");
    const editarSeries = document.getElementById("editar-series-exercicio");
    const editarRepeticoes = document.getElementById("editar-repeticoes-exercicio");
    const mensagemEdicao = document.getElementById("mensagem-edicao-exercicio");

    const btnListar = document.getElementById("btn-listar-exercicios");
    const btnLimparBusca = document.getElementById("btn-limpar-busca-exercicio");
    const btnCancelarEdicao = document.getElementById("btn-cancelar-edicao-exercicio");

    let exerciciosCarregados = [];

    function exibirMensagem(elemento, texto, tipo = "info") {
        if (!elemento) return;
        elemento.textContent = texto;
        elemento.className = `mensagem mensagem-${tipo}`;
    }

    function limparMensagem(elemento) {
        if (!elemento) return;
        elemento.textContent = "";
        elemento.className = "mensagem";
    }

    function obterLista(dados) {
        if (Array.isArray(dados)) return dados;
        if (Array.isArray(dados?.exercicios)) return dados.exercicios;
        return dados ? [dados] : [];
    }

    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]);
    }

    function renderizarExercicios(exercicios) {
        if (!listaExercicios) return;

        if (!exercicios.length) {
            listaExercicios.innerHTML = `
                <p class="estado-vazio">Nenhum exercício encontrado.</p>
            `;
            return;
        }

        listaExercicios.innerHTML = exercicios.map(exercicio => `
            <article class="registro-exercicio">
                <div>
                    <span class="etiqueta-secao">
                        EXERCÍCIO #${escaparHTML(exercicio.id_exercicio ?? exercicio.id)}
                    </span>
                    <h3>${escaparHTML(exercicio.nome)}</h3>
                    <p><strong>Séries:</strong> ${escaparHTML(exercicio.series)}</p>
                    <p><strong>Repetições:</strong> ${escaparHTML(exercicio.repeticoes)}</p>
                    <p><strong>ID do treino:</strong> ${escaparHTML(exercicio.id_treino)}</p>
                </div>
                <div class="acoes-registro">
                    <button type="button" class="botao botao-secundario"
                        data-acao="editar"
                        data-id-exercicio="${escaparHTML(exercicio.id_exercicio ?? exercicio.id)}">
                        Editar
                    </button>
                    <button type="button" class="botao botao-perigo"
                        data-acao="excluir"
                        data-id-exercicio="${escaparHTML(exercicio.id_exercicio ?? exercicio.id)}">
                        Excluir
                    </button>
                </div>
            </article>
        `).join("");
    }

    async function listarExercicios(idTreino) {
        if (!listaExercicios) return;

        limparMensagem(mensagemExercicios);
        listaExercicios.innerHTML = `
            <p class="estado-vazio">Carregando exercícios...</p>
        `;

        try {
            const dados = await requisicaoAPI(
                `/exercicios/${encodeURIComponent(idTreino)}`
            );

            exerciciosCarregados = obterLista(dados);
            renderizarExercicios(exerciciosCarregados);

            exibirMensagem(
                mensagemExercicios,
                `${exerciciosCarregados.length} exercício(s) encontrado(s) para o treino ${idTreino}.`,
                "info"
            );
        } catch (erro) {
            listaExercicios.innerHTML = `
                <p class="estado-vazio">Não foi possível carregar os exercícios.</p>
            `;
            exibirMensagem(
                mensagemExercicios,
                `Erro ao listar: ${erro.message}`,
                "erro"
            );
        }
    }

    if (formExercicio) {
        formExercicio.addEventListener("submit", async evento => {
            evento.preventDefault();
            limparMensagem(mensagemExercicios);

            const nome = nomeExercicio.value.trim();
            const series = Number(seriesExercicio.value);
            const repeticoes = Number(repeticoesExercicio.value);
            const idTreino = Number(idTreinoExercicio.value);

            if (nome.length < 5 || nome.length > 100 ||
                !Number.isInteger(series) || series <= 0 ||
                !Number.isInteger(repeticoes) || repeticoes <= 0 ||
                !Number.isInteger(idTreino) || idTreino <= 0) {
                exibirMensagem(
                    mensagemExercicios,
                    "Informe nome com 5 a 100 caracteres e valores inteiros positivos para séries, repetições e ID do treino.",
                    "erro"
                );
                return;
            }

            try {
                await requisicaoAPI("/exercicios/", {
                    method: "POST",
                    body: JSON.stringify({
                        nome,
                        series,
                        repeticoes,
                        id_treino: idTreino
                    })
                });

                exibirMensagem(
                    mensagemExercicios,
                    "Exercício cadastrado com sucesso!",
                    "sucesso"
                );

                formExercicio.reset();
                await listarExercicios(idTreino);
            } catch (erro) {
                exibirMensagem(
                    mensagemExercicios,
                    `Não foi possível cadastrar: ${erro.message}`,
                    "erro"
                );
            }
        });
    }

    if (formBusca) {
        formBusca.addEventListener("submit", async evento => {
            evento.preventDefault();

            const idTreino = Number(buscaIdTreino.value);

            if (!Number.isInteger(idTreino) || idTreino <= 0) {
                exibirMensagem(
                    mensagemExercicios,
                    "Informe um ID de treino válido.",
                    "erro"
                );
                return;
            }

            await listarExercicios(idTreino);
        });
    }

    if (btnListar) {
        btnListar.addEventListener("click", () => {
            const idTreino = Number(buscaIdTreino?.value || idTreinoExercicio?.value);

            if (!Number.isInteger(idTreino) || idTreino <= 0) {
                exibirMensagem(
                    mensagemExercicios,
                    "Informe o ID do treino para listar os exercícios.",
                    "erro"
                );
                return;
            }

            listarExercicios(idTreino);
        });
    }

    if (btnLimparBusca) {
        btnLimparBusca.addEventListener("click", () => {
            formBusca?.reset();
            limparMensagem(mensagemExercicios);

            if (listaExercicios) {
                listaExercicios.innerHTML = `
                    <p class="estado-vazio">Informe o ID de um treino para consultar os exercícios.</p>
                `;
            }
        });
    }

    function abrirEdicao(exercicio) {
        if (!cartaoEdicao) return;

        editarId.value = exercicio.id_exercicio ?? exercicio.id;
        editarNome.value = exercicio.nome ?? "";
        editarSeries.value = exercicio.series ?? "";
        editarRepeticoes.value = exercicio.repeticoes ?? "";

        limparMensagem(mensagemEdicao);
        cartaoEdicao.hidden = false;
        cartaoEdicao.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (formEdicao) {
        formEdicao.addEventListener("submit", async evento => {
            evento.preventDefault();
            limparMensagem(mensagemEdicao);

            const id = Number(editarId.value);
            const nome = editarNome.value.trim();
            const series = Number(editarSeries.value);
            const repeticoes = Number(editarRepeticoes.value);

            if (!Number.isInteger(id) || id <= 0 ||
                nome.length < 3 || nome.length > 100 ||
                !Number.isInteger(series) || series <= 0 ||
                !Number.isInteger(repeticoes) || repeticoes <= 0) {
                exibirMensagem(
                    mensagemEdicao,
                    "Preencha corretamente todos os campos.",
                    "erro"
                );
                return;
            }

            try {
                await requisicaoAPI(`/exercicios/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({ nome, series, repeticoes })
                });

                exibirMensagem(
                    mensagemEdicao,
                    "Exercício atualizado com sucesso!",
                    "sucesso"
                );

                const exercicioAtualizado = exerciciosCarregados.find(
                    item => String(item.id_exercicio ?? item.id) === String(id)
                );

                const idTreino = exercicioAtualizado?.id_treino;

                cartaoEdicao.hidden = true;

                if (idTreino) {
                    await listarExercicios(idTreino);
                }
            } catch (erro) {
                exibirMensagem(
                    mensagemEdicao,
                    `Não foi possível atualizar: ${erro.message}`,
                    "erro"
                );
            }
        });
    }

    if (btnCancelarEdicao) {
        btnCancelarEdicao.addEventListener("click", () => {
            formEdicao?.reset();
            if (cartaoEdicao) cartaoEdicao.hidden = true;
            limparMensagem(mensagemEdicao);
        });
    }

    if (listaExercicios) {
        listaExercicios.addEventListener("click", async evento => {
            const botao = evento.target.closest("button[data-acao]");
            if (!botao) return;

            const id = botao.dataset.idExercicio;
            const exercicio = exerciciosCarregados.find(
                item => String(item.id_exercicio ?? item.id) === String(id)
            );

            if (!exercicio) {
                exibirMensagem(
                    mensagemExercicios,
                    "Não foi possível identificar o exercício selecionado.",
                    "erro"
                );
                return;
            }

            if (botao.dataset.acao === "editar") {
                abrirEdicao(exercicio);
                return;
            }

            if (botao.dataset.acao === "excluir") {
                const confirmou = window.confirm(
                    `Deseja excluir o exercício "${exercicio.nome}"?`
                );

                if (!confirmou) return;

                try {
                    await requisicaoAPI(`/exercicios/${encodeURIComponent(id)}`, {
                        method: "DELETE"
                    });

                    exibirMensagem(
                        mensagemExercicios,
                        "Exercício excluído com sucesso!",
                        "sucesso"
                    );

                    if (String(editarId?.value) === String(id) && cartaoEdicao) {
                        cartaoEdicao.hidden = true;
                    }

                    await listarExercicios(exercicio.id_treino);
                } catch (erro) {
                    exibirMensagem(
                        mensagemExercicios,
                        `Não foi possível excluir: ${erro.message}`,
                        "erro"
                    );
                }
            }
        });
    }
});
