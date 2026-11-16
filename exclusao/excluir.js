/**
 * Tela de exclusão: GET /jogos/:id para confirmar o registro,
 * DELETE /jogos/:id para excluir de fato.
 */
(function () {
  const { buscarJogoPorId, excluirJogo, ApiError } = window.jogosApi;

  const feedback = document.getElementById("feedback");
  const inputBuscaId = document.getElementById("busca-id");
  const btnBuscar = document.getElementById("btn-buscar");

  const confirmPanel = document.getElementById("confirm-panel");
  const confirmDetalhes = document.getElementById("confirm-detalhes");
  const btnConfirmarExclusao = document.getElementById("btn-confirmar-exclusao");
  const btnCancelarExclusao = document.getElementById("btn-cancelar-exclusao");

  let jogoAtual = null;

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

  function exibirConfirmacao(jogo) {
    jogoAtual = jogo;
    confirmPanel.classList.remove("hidden");
    confirmDetalhes.innerHTML = `
      <div><dt>ID</dt><dd>${jogo.id}</dd></div>
      <div><dt>Título</dt><dd>${escaparHtml(jogo.titulo)}</dd></div>
      <div><dt>Plataforma</dt><dd>${escaparHtml(jogo.plataforma)}</dd></div>
      <div><dt>Gênero</dt><dd>${escaparHtml(jogo.genero)}</dd></div>
    `;
  }

  function esconderConfirmacao() {
    jogoAtual = null;
    confirmPanel.classList.add("hidden");
    confirmDetalhes.innerHTML = "";
  }

  async function buscarParaExcluir(id) {
    feedback.classList.add("hidden");
    esconderConfirmacao();

    if (!id) {
      mostrarFeedback("Informe um ID para buscar.", "error");
      return;
    }

    btnBuscar.disabled = true;
    try {
      const jogo = await buscarJogoPorId(id);
      exibirConfirmacao(jogo);
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 404) {
        mostrarFeedback(`Nenhum jogo encontrado com o ID ${id}.`, "error");
      } else {
        mostrarFeedback(mensagemDeErro(erro), "error");
      }
    } finally {
      btnBuscar.disabled = false;
    }
  }

  btnBuscar.addEventListener("click", () => buscarParaExcluir(inputBuscaId.value.trim()));
  btnCancelarExclusao.addEventListener("click", esconderConfirmacao);

  btnConfirmarExclusao.addEventListener("click", async () => {
    if (!jogoAtual) return;
    const id = jogoAtual.id;
    btnConfirmarExclusao.disabled = true;

    try {
      await excluirJogo(id);
      mostrarFeedback(`Jogo #${id} excluído com sucesso.`, "success");
      esconderConfirmacao();
      inputBuscaId.value = "";
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 404) {
        mostrarFeedback(`O jogo #${id} já não existe mais.`, "error");
        esconderConfirmacao();
      } else {
        mostrarFeedback(mensagemDeErro(erro), "error");
      }
    } finally {
      btnConfirmarExclusao.disabled = false;
    }
  });

  // Se a tela for aberta com ?id=, já busca automaticamente.
  const idNaUrl = new URLSearchParams(window.location.search).get("id");
  if (idNaUrl) {
    inputBuscaId.value = idNaUrl;
    buscarParaExcluir(idNaUrl);
  }
})();
