
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

  // Listagem
  const listaTreinos = document.getElementById("lista-treinos");

  // Mensagens separadas por área
  const mensagemTreinos = document.getElementById("mensagem-treinos");
  const mensagemConsultaTreinos = document.getElementById(
    "mensagem-consulta-treinos"
  );
  const mensagemEdicao = document.getElementById(
    "mensagem-edicao-treino"
  );

  // Botões
  const btnListarTreinos = document.getElementById("btn-listar-treinos");
  const btnLimparBusca = document.getElementById(
    "btn-limpar-busca-treino"
  );
  const btnCancelarEdicao = document.getElementById(
    "btn-cancelar-edicao-treino"
  );

  let treinosCarregados = [];

  // Guarda erros de exclusão por ID do treino.
  const errosExclusaoTreinos = new Map();

  // Guarda mensagens de sucesso da exclusão.
  const sucessosExclusaoTreinos = new Map();
  /* =====================================================
     NORMALIZAR DIA DA SEMANA
     ===================================================== */
  function normalizarDiaSemana(dia) {
    return String(dia ?? "")
      .trim()
      .toLowerCase()
      .replace(/-feira$/, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  /* =====================================================
     REQUISIÇÕES À API
     ===================================================== */
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
  /* =====================================================
     MENSAGENS
     ===================================================== */
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
  /* =====================================================
     FUNÇÕES AUXILIARES
     ===================================================== */
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
  /* LISTAR E EXIBIR TREINOS */
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
        mensagemConsultaTreinos,
        `Erro ao listar treinos: ${erro.message}`,
        "erro"
      );
    }
  }
  /* =====================================================
     RENDERIZAR CARDS DOS TREINOS
     A mensagem de exclusão aparece dentro do card.
     ===================================================== */
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
        const chaveId = String(idTreino);
        const erroExclusao = errosExclusaoTreinos.get(chaveId);
        const sucessoExclusao = sucessosExclusaoTreinos.get(chaveId);
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
            ${
              erroExclusao
                ? `
                  <p
                    class="mensagem mensagem-erro"
                    role="alert"
                    aria-live="assertive"
                  >
                    ${escaparHTML(erroExclusao)}
                  </p>
                `
                : ""
            }
            ${
              sucessoExclusao
                ? `
                  <p
                    class="mensagem mensagem-sucesso"
                    role="status"
                    aria-live="polite"
                  >
                    ${escaparHTML(sucessoExclusao)}
                  </p>
                `
                : ""
            }

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
  /* ATUALIZAR RESUMO */
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
     ===================================================== */
  if (formTreino) {
    formTreino.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagem(mensagemTreinos);
      const nome = nomeTreino?.value.trim();
      const idAluno = Number(idAlunoTreino?.value);
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
        nome,
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
     ===================================================== */
  if (formBuscaTreino) {
    formBuscaTreino.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagem(mensagemConsultaTreinos);
      const idAluno = Number(buscaIdAlunoTreino?.value);
      if (!idAluno || idAluno <= 0) {
        exibirMensagem(
          mensagemConsultaTreinos,
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
          mensagemConsultaTreinos,
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
          mensagemConsultaTreinos,
          `Erro na busca: ${erro.message}`,
          "erro"
        );
      }
    });
  }
  /* =====================================================
     LIMPAR BUSCA
     ===================================================== */
  if (btnLimparBusca) {
    btnLimparBusca.addEventListener("click", () => {
      if (formBuscaTreino) formBuscaTreino.reset();
      limparMensagem(mensagemConsultaTreinos);
      listarTreinos();
    });
  }
  /* =====================================================
     LISTAR TODOS OS TREINOS
     ===================================================== */
  if (btnListarTreinos) {
    btnListarTreinos.addEventListener("click", () => {
      if (formBuscaTreino) formBuscaTreino.reset();

      limparMensagem(mensagemConsultaTreinos);
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
    // Mantém a validação da versão atual da edição.
    const treinosDoAluno = treinosCarregados.filter(
      (item) => String(obterIdAluno(item)) === String(idAluno)
    );
    if (treinosDoAluno.length > 1) {
      exibirMensagem(
        mensagemConsultaTreinos,
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
      const diaNormalizado = normalizarDiaSemana(
        obterDiaTreino(treino)
      );
      const opcaoCorrespondente = Array.from(
        editarDiaSemanaTreino.options
      ).find(
        (opcao) =>
          normalizarDiaSemana(opcao.value) === diaNormalizado
      );
      editarDiaSemanaTreino.value = opcaoCorrespondente
        ? opcaoCorrespondente.value
        : "";
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
     Mantido conforme a implementação enviada.
     ===================================================== */
  if (formEditarTreino) {
    formEditarTreino.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      limparMensagem(mensagemEdicao);
      const idAluno = Number(editarIdAlunoTreino?.value);
      const nome = editarNomeTreino?.value.trim();
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
        nome,
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
        cartaoEdicao.hidden = true;
        await listarTreinos();
        exibirMensagem(
          mensagemEdicao,
          "Treino atualizado com sucesso!",
          "sucesso"
        );
      } catch (erro) {
        exibirMensagem(
          mensagemEdicao,
          `Não foi possível atualizar: ${erro.message}`,
          "erro"
        );
      }
    });
  }
  /* =====================================================
     CANCELAR EDIÇÃO
     ===================================================== */
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

     Erros e sucessos aparecem dentro do card
     correspondente ao treino.
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
          mensagemConsultaTreinos,
          "Não foi possível identificar o treino selecionado.",
          "erro"
        );
        return;
      }
      if (acao === "editar") {
        abrirEdicao(treino);
        return;
      }
      if (acao !== "excluir") return;
      const confirmou = window.confirm(
        `Deseja realmente excluir o treino "${obterNomeTreino(treino)}" (ID ${idTreino})?`
      );
      if (!confirmou) return;
      const chaveId = String(idTreino);
      // Limpa mensagens anteriores deste treino.
      errosExclusaoTreinos.delete(chaveId);
      sucessosExclusaoTreinos.delete(chaveId);
      limparMensagem(mensagemConsultaTreinos);
      // Atualiza o card para remover mensagens antigas.
      renderizarTreinos(treinosCarregados);
      try {
        await requisicaoAPI(
          `/treinos/${encodeURIComponent(idTreino)}`,
          {
            method: "DELETE",
          }
        );
        errosExclusaoTreinos.delete(chaveId);
        sucessosExclusaoTreinos.set(
          chaveId,
          "Treino excluído com sucesso!"
        );
        if (
          cartaoEdicao &&
          String(editarIdTreino?.value) === chaveId
        ) {
          cartaoEdicao.hidden = true;
        }
        await listarTreinos();
        // A exclusão deu certo, mas o treino já não existe na lista.
        // Por isso, a confirmação é exibida na área geral de consulta.
        sucessosExclusaoTreinos.delete(chaveId);
        exibirMensagem(
          mensagemConsultaTreinos,
          "Treino excluído com sucesso!",
          "sucesso"
        );
      } catch (erro) {
        sucessosExclusaoTreinos.delete(chaveId);
        errosExclusaoTreinos.set(
          chaveId,
          `Não foi possível excluir: ${erro.message}`
        );
        // Recria os cards com o erro dentro do treino correspondente.
        renderizarTreinos(treinosCarregados);
      }
    });
  }
  /* INICIALIZAÇÃO */
  listarTreinos();
});
