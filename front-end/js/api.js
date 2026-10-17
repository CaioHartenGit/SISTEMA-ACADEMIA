const API_URL = "http://127.0.0.1:8000";

async function requisicaoAPI(endpoint, opcoes = {}) {
    const resposta = await fetch(`${API_URL}${endpoint}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...opcoes.headers
        }
    });

    if (!resposta.ok) {
        const mensagem = await resposta.text();

        throw new Error(
            mensagem || `Erro HTTP: ${resposta.status}`
        );
    }

    if (resposta.status === 204) {
        return null;
    }

    return resposta.json();
}
