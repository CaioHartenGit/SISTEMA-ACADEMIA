/* API.JS — CONEXÃO COM O BACKEND: Sistema Forma | Gestão de Academia */

// URL base da API
const API_URL = "http://127.0.0.1:8000";

/* FUNÇÃO COMPARTILHADA DE REQUISIÇÕES */
async function requisicaoAPI(endpoint, opcoes = {}) {
  try {
    const resposta = await fetch(`${API_URL}${endpoint}`, {
      ...opcoes,
      headers: {
        "Content-Type": "application/json",
        ...opcoes.headers,
      },
    });
    // Trata respostas de erro do backend
    if (!resposta.ok) {
      const mensagem = await resposta.text();
      throw new Error(mensagem || `Erro HTTP: ${resposta.status}`);
    }
    // Resposta sem conteúdo
    if (resposta.status === 204) {
      return null;
    }
    // Respostas sem corpo
    if (resposta.status === 205) {
      return null;
    }
    // Algumas respostas podem não possuir conteúdo
    const texto = await resposta.text();
    if (!texto) {
      return null;
    }
    // Converte a resposta JSON em objeto JavaScript
    try {
      return JSON.parse(texto);
    } catch {
      throw new Error(
        "O servidor retornou uma resposta que não é um JSON válido.",
      );
    }
  } catch (erro) {
    // Diferencia falhas de conexão de erros HTTP/JSON
    if (erro instanceof TypeError) {
      throw new Error(
        "Não foi possível conectar à API. Verifique se o backend está rodando e se o CORS está configurado.",
      );
    }
    throw erro;
  }
}
