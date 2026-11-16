/**
 * Tela de consulta por ID (GET /jogos/:id).
 */
(function () {
  const { buscarJogoPorId, ApiError } = window.jogosApi;

  const feedback = document.getElementById("feedback");
  const inputBuscaId = document.getElementById("busca-id");
  const btnBuscar = document.getElementById("btn-buscar");
  const btnLimparBusca = document.getElementById("btn-limpar-busca");
  const resultadoBusca = document.getElementById("resultado-busca");

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

  function exibirResultado(jogo) {
    resultadoBusca.classList.remove("hidden");
    resultadoBusca.innerHTML = `
      <h2 style="font-size: var(--text-subheading); margin-bottom: var(--spacing-16)">
        #${jogo.id} — ${escaparHtml(jogo.titulo)}
      </h2>
      <dl class="detail-grid">
        <div><dt>Plataforma</dt><dd>${escaparHtml(jogo.plataforma)}</dd></div>
        <div><dt>Gênero</dt><dd>${escaparHtml(jogo.genero)}</dd></div>
        <div><dt>Ano de lançamento</dt><dd>${jogo.anoLancamento}</dd></div>
      </dl>
      <div class="form-actions">
        <a class="btn btn-outline" href="../edicao/editar.html?id=${jogo.id}">Editar este jogo</a>
        <a class="btn btn-danger" href="../exclusao/excluir.html?id=${jogo.id}">Excluir este jogo</a>
      </div>
    `;
  }

  function exibirNaoEncontrado(id) {
    resultadoBusca.classList.remove("hidden");
    resultadoBusca.innerHTML = `<p style="margin:0;color:var(--color-alert-red);font-weight:600;">
      Nenhum jogo encontrado com o ID ${escaparHtml(id)}.
    </p>`;
  }

  btnBuscar.addEventListener("click", async () => {
    feedback.classList.add("hidden");
    const id = inputBuscaId.value.trim();

    if (!id) {
      mostrarFeedback("Informe um ID para buscar.", "error");
      return;
    }

    resultadoBusca.classList.add("hidden");
    btnBuscar.disabled = true;

    try {
      const jogo = await buscarJogoPorId(id);
      exibirResultado(jogo);
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 404) {
        exibirNaoEncontrado(id);
      } else {
        mostrarFeedback(mensagemDeErro(erro), "error");
      }
    } finally {
      btnBuscar.disabled = false;
    }
  });

  btnLimparBusca.addEventListener("click", () => {
    inputBuscaId.value = "";
    resultadoBusca.classList.add("hidden");
    resultadoBusca.innerHTML = "";
    feedback.classList.add("hidden");
  });

  // Se a tela for aberta com ?id=, já preenche e busca automaticamente.
  const idNaUrl = new URLSearchParams(window.location.search).get("id");
  if (idNaUrl) {
    inputBuscaId.value = idNaUrl;
    btnBuscar.click();
  }
})();
