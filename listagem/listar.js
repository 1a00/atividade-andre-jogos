/**
 * Tela de listagem (GET /jogos).
 * Carrega todos os jogos, renderiza a tabela e oferece um filtro local
 * por título (não faz nova chamada à API — filtra os dados já carregados).
 */
(function () {
  const { listarJogos, excluirJogo, ApiError } = window.jogosApi;

  const feedback = document.getElementById("feedback");
  const corpoTabela = document.getElementById("jogos-tbody");
  const estadoCarregando = document.getElementById("estado-carregando");
  const estadoVazio = document.getElementById("estado-vazio");
  const estadoErroLista = document.getElementById("estado-erro-lista");
  const btnAtualizarLista = document.getElementById("btn-atualizar-lista");
  const filtroTitulo = document.getElementById("filtro-titulo");

  let jogosCarregados = [];

  function mostrarFeedback(mensagem, tipo = "info") {
    feedback.textContent = mensagem;
    feedback.dataset.type = tipo;
    feedback.classList.remove("hidden");
  }

  function mensagemDeErro(erro) {
    return erro instanceof ApiError ? erro.message : "Ocorreu um erro inesperado.";
  }

  function escaparHtml(valor) {
    const div = document.createElement("div");
    div.textContent = String(valor ?? "");
    return div.innerHTML;
  }

  function renderizarLinha(jogo) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${jogo.id}</td>
      <td>${escaparHtml(jogo.titulo)}</td>
      <td><span class="pill">${escaparHtml(jogo.plataforma)}</span></td>
      <td><span class="pill">${escaparHtml(jogo.genero)}</span></td>
      <td>${jogo.anoLancamento}</td>
      <td>
        <div class="row-actions">
          <a class="btn btn-outline" style="padding:6px 12px;font-size:12px" href="../edicao/editar.html?id=${jogo.id}">Editar</a>
          <a class="btn btn-danger" style="padding:6px 12px;font-size:12px" href="../exclusao/excluir.html?id=${jogo.id}">Excluir</a>
        </div>
      </td>
    `;
    return linha;
  }

  function renderizarLista(lista) {
    corpoTabela.innerHTML = "";
    estadoVazio.classList.add("hidden");

    if (!lista || lista.length === 0) {
      estadoVazio.classList.remove("hidden");
      return;
    }

    const fragmento = document.createDocumentFragment();
    lista.forEach((jogo) => fragmento.appendChild(renderizarLinha(jogo)));
    corpoTabela.appendChild(fragmento);
  }

  async function carregarLista() {
    estadoErroLista.classList.add("hidden");
    estadoVazio.classList.add("hidden");
    estadoCarregando.classList.remove("hidden");
    corpoTabela.innerHTML = "";

    try {
      jogosCarregados = (await listarJogos()) || [];
      estadoCarregando.classList.add("hidden");
      renderizarLista(jogosCarregados);
    } catch (erro) {
      estadoCarregando.classList.add("hidden");
      estadoErroLista.classList.remove("hidden");
      estadoErroLista.textContent = mensagemDeErro(erro);
    }
  }

  btnAtualizarLista.addEventListener("click", carregarLista);

  filtroTitulo.addEventListener("input", () => {
    const termo = filtroTitulo.value.trim().toLowerCase();
    if (!termo) {
      renderizarLista(jogosCarregados);
      return;
    }
    const filtrados = jogosCarregados.filter((jogo) =>
      jogo.titulo.toLowerCase().includes(termo)
    );
    renderizarLista(filtrados);
  });

  carregarLista();
})();
