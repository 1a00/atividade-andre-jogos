/**
 * Camada de comunicação com a API REST de jogos.
 * Mapeamento de funcionalidades -> método HTTP + endpoint:
 *   listarJogos()        -> GET    /jogos
 *   buscarJogoPorId(id)  -> GET    /jogos/:id
 *   criarJogo(dados)     -> POST   /jogos
 *   atualizarJogo(id, d) -> PUT    /jogos/:id
 *   excluirJogo(id)      -> DELETE /jogos/:id
 *
 * O back-end (Express + SQLite) ainda não foi implementado nesta etapa.
 * Esta camada já está pronta para apontar para a API real assim que ela
 * estiver no ar em API_BASE_URL.
 */

const API_BASE_URL = "http://localhost:3000";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (erroRede) {
    throw new ApiError(
      `Não foi possível conectar à API em ${API_BASE_URL}. Verifique se o servidor está em execução.`,
      0
    );
  }

  if (resposta.status === 204) {
    return null;
  }

  let corpo = null;
  const texto = await resposta.text();
  if (texto) {
    try {
      corpo = JSON.parse(texto);
    } catch (erroJson) {
      corpo = null;
    }
  }

  if (!resposta.ok) {
    const mensagem = corpo?.erro || `Erro inesperado (status ${resposta.status})`;
    throw new ApiError(mensagem, resposta.status);
  }

  return corpo;
}

/** GET /jogos - lista todos os jogos cadastrados */
function listarJogos() {
  return request("/jogos", { method: "GET" });
}

/** GET /jogos/:id - busca um jogo específico */
function buscarJogoPorId(id) {
  return request(`/jogos/${encodeURIComponent(id)}`, { method: "GET" });
}

/** POST /jogos - cadastra um novo jogo */
function criarJogo(dados) {
  return request("/jogos", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

/** PUT /jogos/:id - atualiza um jogo existente */
function atualizarJogo(id, dados) {
  return request(`/jogos/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

/** DELETE /jogos/:id - remove um jogo */
function excluirJogo(id) {
  return request(`/jogos/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Verificação simples de disponibilidade da API, usada só para status visual */
async function verificarStatusApi() {
  try {
    await fetch(`${API_BASE_URL}/jogos`, { method: "GET" });
    return true;
  } catch (erro) {
    return false;
  }
}

window.jogosApi = {
  API_BASE_URL,
  ApiError,
  listarJogos,
  buscarJogoPorId,
  criarJogo,
  atualizarJogo,
  excluirJogo,
  verificarStatusApi,
};
