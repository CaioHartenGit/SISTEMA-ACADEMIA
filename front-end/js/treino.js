
/* =========================================================
   TREINO.JS — GERENCIAMENTO DE TREINOS
   Endpoints:
   GET    /treinos/
   POST   /treinos/
   GET    /treinos/{id_aluno}
   PUT    /treinos/{id_aluno}
   DELETE /treinos/{id_treino}
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "https://sistema-academia-7w5d.onrender.com";

  // Formulários
  const formTreino = document.getElementById("form-treino");
  const formBuscaTreino = document.getElementById(
    "form-busca-treino-aluno"
  );
  const formEditarTreino = document.getElementById(
    "form-editar-treino"
  );

  // Campos do cadastro
  const nomeTreino = document.getElementById("nome-treino");
  const idAlunoTreino = document.getElementById("id-aluno-treino");
  const diaSemanaTreino = document.getElementById("dia-semana-treino");

  // Campos de busca
  const buscaIdAlunoTreino = document.getElementById(
    "busca-id-aluno-treino"
  );

  // Campos de edição
  const cartaoEdicao = document.getElementById("cartao-edicao-treino");
  const editarIdTreino = document.getElementById("editar-id-treino");
  const editarNomeTreino = document.getElementById("editar-nome-treino");
  const editarIdAlunoTreino = document.getElementById(
    "editar-id-aluno-treino"
  );
  const editarDiaSemanaTreino = document.getElementById(
    "editar-dia-semana-treino"
  );

  // Listagem e mensagens
  const listaTreinos = document.getElementById("lista-treinos");
  const mensagemTreinos = document.getElementById("mensagem-treinos");
  const mensagemEdicao = document.getElementById(
    "mensagem-edicao-treino"
  );
  const btnListarTreinos = document.getElementById("btn-listar-treinos");
  const btnLimparBusca = document.getElementById("btn-limpar-busca-treino");
  const btnCancelarEdicao = document.getElementById(
    "btn-cancelar-edicao-treino"
  );

  let treinosCarregados = [];

  /* =====================================================
     NORMALIZAR DIA DA SEMANA
     Ex.: "Terça-feira" -> "terca"
     ===================================================== */
  function normalizarDiaSemana(dia) {
    return String(dia ?? "")
      .trim()
      .toLowerCase()
      .replace(/-feira$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* REQUISIÇÕES À API */
  async function requisicaoAPI(endpoint, opcoes = {}) {
    const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...opcoes,
      headers: {
        "Content-Type": "application/json",
        ...opcoes.headers,
      },
    });

    if (!resposta.ok) {
      let detalhe = "";

      try {
        const erro = await resposta.json();
        detalhe = erro.detail || erro.message || JSON.stringify(erro);
      } catch {
        detalhe = await resposta.text();
      }

      throw new Error(detalhe || `Erro HTTP ${resposta.status}`);
    }

    if (resposta.status === 204) {
      return null;
    }

    const texto = await resposta.text();
    return texto ? JSON.parse(texto) : null;
  }

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
    if (Array.isArray(dados?.treinos)) return dados.treinos;
    if (Array.isArray(dados?.items)) return dados.items;

    return dados ? [dados] : [];
  }

  function obterIdTreino(treino) {
    return treino.id_treino ?? treino.id;
  }

  function obterIdAluno(treino) {
    return treino.id_aluno ?? treino.aluno_id;
  }

  function obterNomeTreino(treino) {
    return treino.nome ?? treino.nome_treino ?? "Treino sem nome";
  }

  function obterDiaTreino(treino) {
    return treino.dia_semana ?? treino.dia ?? "Não informado";
  }

  function escaparHTML(valor) {
    return String(valor ?? "").replace(
      /[&<>"']/g,
      (caractere) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[caractere]
    );
  }

  /* =====================================================
     LISTAR E EXIBIR TREINOS
     GET /treinos/
     ===================================================== */
  async function listarTreinos() {
    if (!listaTreinos) return;

    listaTreinos.innerHTML = `
      <p class="estado-vazio">Carregando treinos...</p>
    `;

    limparMensagem(mensagemTreinos);

    try {
      const dados = await requisicaoAPI("/treinos/");
      treinosCarregados = obterLista(dados);

      renderizarTreinos(treinosCarregados);
      atualizarResumo(treinosCarregados);
    } catch (erro) {
      listaTreinos.innerHTML = `
        <p class="estado-vazio">
          Não foi possível carregar os treinos.
        </p>
      `;

      exibirMensagem(
        mensagemTreinos,
        `Erro ao listar treinos: ${erro.message}`,
        "erro"
      );
    }
  }

  function renderizarTreinos(treinos) {
    if (!listaTreinos) return;

    if (!treinos.length) {
      listaTreinos.innerHTML = `
        <p class="estado-vazio">
          Nenhum treino encontrado.
        </p>
      `;
      return;
    }

    listaTreinos.innerHTML = treinos
      .map((treino) => {
        const idTreino = obterIdTreino(treino);
        const idAluno = obterIdAluno(treino);
        const nome = obterNomeTreino(treino);
        const dia = obterDiaTreino(treino);

        return `
          <article class="registro-treino">
            <div class="registro-treino-informacoes">
              <span class="etiqueta-secao">
                TREINO #${escaparHTML(idTreino ?? "—")}
              </span>

              <h3>${escaparHTML(nome)}</h3>

              <p>
                <strong>ID do aluno:</strong>
                ${escaparHTML(idAluno ?? "Não informado")}
              </p>

              <p>
                <strong>Dia:</strong>
                ${escaparHTML(dia)}
              </p>
            </div>

            <div class="acoes-registro">
              <button
                type="button"
                class="botao botao-secundario"
                data-acao="editar"
                data-id-treino="${escaparHTML(idTreino ?? "")}"
              >
                Editar
              </button>

              <button
                type="button"
                class="botao botao-perigo"
                data-acao="excluir"
                data-id-treino="${escaparHTML(idTreino ?? "")}"
              >
                Excluir
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function atualizarResumo(treinos) {
    const total = document.getElementById("total-treinos");
    const comAluno = document.getElementById("treinos-com-aluno");
    const semAluno = document.getElementById("treinos-sem-aluno");

    const vinculados = treinos.filter(
      (treino) => obterIdAluno(treino) != null
    ).length;

    if (total) total.textContent = treinos.length;
    if (comAluno) comAluno.textContent = vinculados;
    if (semAluno) semAluno.textContent = treinos.length - vinculados;
  }

  /* =====================================================
     CADASTRAR TREINO
     POST /treinos/
     ===================================================== */
  if (formTreino) {
    formTreino.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagem(mensagemTreinos);

      const nome = nomeTreino?.value.trim();
      const idAluno = Number(idAlunoTreino?.value);

      // Converte "Terça-feira" para "terca", por exemplo.
      const dia = normalizarDiaSemana(diaSemanaTreino?.value);

      if (!nome || !idAluno || idAluno <= 0 || !dia) {
        exibirMensagem(
          mensagemTreinos,
          "Preencha corretamente todos os campos.",
          "erro"
        );
        return;
      }

      const dados = {
        nome: nome,
        dia_semana: dia,
        id_aluno: idAluno,
      };

      try {
        await requisicaoAPI("/treinos/", {
          method: "POST",
          body: JSON.stringify(dados),
        });

        exibirMensagem(
          mensagemTreinos,
          "Treino cadastrado com sucesso!",
          "sucesso"
        );

        formTreino.reset();
        await listarTreinos();
      } catch (erro) {
        exibirMensagem(
          mensagemTreinos,
          `Não foi possível cadastrar: ${erro.message}`,
          "erro"
        );
      }
    });
  }

  /* =====================================================
     BUSCAR TREINOS POR ID DO ALUNO
     GET /treinos/{id_aluno}
     ===================================================== */
  if (formBuscaTreino) {
    formBuscaTreino.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagem(mensagemTreinos);

      const idAluno = Number(buscaIdAlunoTreino?.value);

      if (!idAluno || idAluno <= 0) {
        exibirMensagem(
          mensagemTreinos,
          "Informe um ID de aluno válido.",
          "erro"
        );
        return;
      }

      if (listaTreinos) {
        listaTreinos.innerHTML = `
          <p class="estado-vazio">Buscando treinos...</p>
        `;
      }

      try {
        const dados = await requisicaoAPI(
          `/treinos/${encodeURIComponent(idAluno)}`
        );

        const treinos = obterLista(dados);
        treinosCarregados = treinos;

        renderizarTreinos(treinos);
        atualizarResumo(treinos);

        exibirMensagem(
          mensagemTreinos,
          treinos.length
            ? `${treinos.length} treino(s) encontrado(s) para o aluno ${idAluno}.`
            : `Nenhum treino encontrado para o aluno ${idAluno}.`,
          "info"
        );
      } catch (erro) {
        if (listaTreinos) {
          listaTreinos.innerHTML = `
            <p class="estado-vazio">
              Não foi possível realizar a busca.
            </p>
          `;
        }

        exibirMensagem(
          mensagemTreinos,
          `Erro na busca: ${erro.message}`,
          "erro"
        );
      }
    });
  }

  /* LIMPAR BUSCA */
  if (btnLimparBusca) {
    btnLimparBusca.addEventListener("click", () => {
      if (formBuscaTreino) formBuscaTreino.reset();

      limparMensagem(mensagemTreinos);
      listarTreinos();
    });
  }

  /* BOTÃO LISTAR TODOS */
  if (btnListarTreinos) {
    btnListarTreinos.addEventListener("click", () => {
      if (formBuscaTreino) formBuscaTreino.reset();

      listarTreinos();
    });
  }

  /* =====================================================
     PREPARAR EDIÇÃO
     ===================================================== */
  function abrirEdicao(treino) {
    if (!cartaoEdicao || !treino) return;

    const idTreino = obterIdTreino(treino);
    const idAluno = obterIdAluno(treino);

    /*
     * O endpoint PUT recebe o ID DO ALUNO na URL.
     * Se houver mais de um treino para esse aluno,
     * o backend poderá atualizar mais de um registro.
     */
    const treinosDoAluno = treinosCarregados.filter(
      (item) => String(obterIdAluno(item)) === String(idAluno)
    );

    if (treinosDoAluno.length > 1) {
      exibirMensagem(
        mensagemTreinos,
        "Este aluno possui mais de um treino. A API atual atualiza pelo ID do aluno, então editar pode afetar outros treinos dele.",
        "erro"
      );
      return;
    }

    if (editarIdTreino) {
      editarIdTreino.value = idTreino ?? "";
    }

    if (editarNomeTreino) {
      editarNomeTreino.value = obterNomeTreino(treino);
    }

    if (editarIdAlunoTreino) {
      editarIdAlunoTreino.value = idAluno ?? "";
    }

    if (editarDiaSemanaTreino) {
      /*
       * Normaliza o valor retornado pelo banco para
       * corresponder ao value da opção no <select>.
       */
      editarDiaSemanaTreino.value = normalizarDiaSemana(
        obterDiaTreino(treino)
      );
    }

    limparMensagem(mensagemEdicao);

    cartaoEdicao.hidden = false;
    cartaoEdicao.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  /* =====================================================
     EDITAR TREINO
     PUT /treinos/{id_aluno}
     ===================================================== */
  if (formEditarTreino) {
    formEditarTreino.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagem(mensagemEdicao);

      const idAluno = Number(editarIdAlunoTreino?.value);
      const nome = editarNomeTreino?.value.trim();

      // Converte "Quarta-feira" para "quarta", por exemplo.
      const novoDia = normalizarDiaSemana(
        editarDiaSemanaTreino?.value
      );

      if (!idAluno || idAluno <= 0 || !nome || !novoDia) {
        exibirMensagem(
          mensagemEdicao,
          "Preencha corretamente todos os campos.",
          "erro"
        );
        return;
      }

      const dados = {
        nome: nome,
        novo_dia_semana: novoDia,
      };

      try {
        await requisicaoAPI(
          `/treinos/${encodeURIComponent(idAluno)}`,
          {
            method: "PUT",
            body: JSON.stringify(dados),
          }
        );

        exibirMensagem(
          mensagemEdicao,
          "Treino atualizado com sucesso!",
          "sucesso"
        );

        cartaoEdicao.hidden = true;
        await listarTreinos();
      } catch (erro) {
        exibirMensagem(
          mensagemEdicao,
          `Não foi possível atualizar: ${erro.message}`,
          "erro"
        );
      }
    });
  }

  /* CANCELAR EDIÇÃO */
  if (btnCancelarEdicao) {
    btnCancelarEdicao.addEventListener("click", () => {
      if (formEditarTreino) formEditarTreino.reset();
      if (cartaoEdicao) cartaoEdicao.hidden = true;

      limparMensagem(mensagemEdicao);
    });
  }

  /* =====================================================
     EXCLUIR TREINO
     DELETE /treinos/{id_treino}
     ===================================================== */
  if (listaTreinos) {
    listaTreinos.addEventListener("click", async (evento) => {
      const botao = evento.target.closest("button[data-acao]");
      if (!botao) return;

      const acao = botao.dataset.acao;
      const idTreino = botao.dataset.idTreino;

      const treino = treinosCarregados.find(
        (item) => String(obterIdTreino(item)) === String(idTreino)
      );

      if (!treino || !idTreino) {
        exibirMensagem(
          mensagemTreinos,
          "Não foi possível identificar o treino selecionado.",
          "erro"
        );
        return;
      }

      if (acao === "editar") {
        abrirEdicao(treino);
        return;
      }

      if (acao === "excluir") {
        const confirmou = window.confirm(
          `Deseja realmente excluir o treino "${obterNomeTreino(treino)}" (ID ${idTreino})?`
        );

        if (!confirmou) return;

        try {
          await requisicaoAPI(
            `/treinos/${encodeURIComponent(idTreino)}`,
            {
              method: "DELETE",
            }
          );

          exibirMensagem(
            mensagemTreinos,
            "Treino excluído com sucesso!",
            "sucesso"
          );

          if (
            cartaoEdicao &&
            String(editarIdTreino?.value) === String(idTreino)
          ) {
            cartaoEdicao.hidden = true;
          }

          await listarTreinos();
        } catch (erro) {
          exibirMensagem(
            mensagemTreinos,
            `Não foi possível excluir: ${erro.message}`,
            "erro"
          );
        }
      }
    });
  }

  /* INICIALIZAÇÃO */
  listarTreinos();
});
