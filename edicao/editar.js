/**
 * Tela de edição: GET /jogos/:id para carregar, PUT /jogos/:id para salvar.
 */
(function () {
  const { buscarJogoPorId, atualizarJogo, ApiError } = window.jogosApi;

  const feedback = document.getElementById("feedback");
  const inputBuscaId = document.getElementById("busca-id");
  const btnCarregar = document.getElementById("btn-carregar");

  const form = document.getElementById("jogo-form");
  const campoTitulo = document.getElementById("campo-titulo");
  const campoPlataforma = document.getElementById("campo-plataforma");
  const campoGenero = document.getElementById("campo-genero");
  const campoAno = document.getElementById("campo-ano");
  const btnSalvar = document.getElementById("btn-salvar");
  const camposForm = [campoTitulo, campoPlataforma, campoGenero, campoAno];

  let idEmEdicao = null;

  function mostrarFeedback(mensagem, tipo = "info") {
    feedback.textContent = mensagem;
    feedback.dataset.type = tipo;
    feedback.classList.remove("hidden");
  }

  function mensagemDeErro(erro) {
    return erro instanceof ApiError ? erro.message : "Ocorreu um erro inesperado.";
  }

  function limparErros() {
    form.querySelectorAll(".field").forEach((campo) => campo.classList.remove("has-error"));
  }

  function marcarErro(input, mensagem) {
    const wrapper = input.closest(".field");
    wrapper.classList.add("has-error");
    wrapper.querySelector(".field__error").textContent = mensagem;
  }

  function habilitarFormulario(habilitado) {
    camposForm.forEach((campo) => (campo.disabled = !habilitado));
    btnSalvar.disabled = !habilitado;
  }

  async function carregarJogo(id) {
    feedback.classList.add("hidden");
    limparErros();

    if (!id) {
      mostrarFeedback("Informe um ID para carregar.", "error");
      return;
    }

    btnCarregar.disabled = true;
    try {
      const jogo = await buscarJogoPorId(id);
      idEmEdicao = jogo.id;
      campoTitulo.value = jogo.titulo;
      campoPlataforma.value = jogo.plataforma;
      campoGenero.value = jogo.genero;
      campoAno.value = jogo.anoLancamento;
      habilitarFormulario(true);
      mostrarFeedback(`Jogo #${jogo.id} carregado. Edite os campos e salve.`, "info");
    } catch (erro) {
      habilitarFormulario(false);
      idEmEdicao = null;
      if (erro instanceof ApiError && erro.status === 404) {
        mostrarFeedback(`Nenhum jogo encontrado com o ID ${id}.`, "error");
      } else {
        mostrarFeedback(mensagemDeErro(erro), "error");
      }
    } finally {
      btnCarregar.disabled = false;
    }
  }

  btnCarregar.addEventListener("click", () => carregarJogo(inputBuscaId.value.trim()));

  function lerDados() {
    return {
      titulo: campoTitulo.value,
      plataforma: campoPlataforma.value,
      genero: campoGenero.value,
      anoLancamento: Number.parseInt(campoAno.value, 10),
    };
  }

  function validar(dados) {
    limparErros();
    let valido = true;

    if (!dados.titulo.trim()) {
      marcarErro(campoTitulo, "Informe o título do jogo.");
      valido = false;
    }
    if (!dados.plataforma.trim()) {
      marcarErro(campoPlataforma, "Informe a plataforma.");
      valido = false;
    }
    if (!dados.genero.trim()) {
      marcarErro(campoGenero, "Informe o gênero.");
      valido = false;
    }
    if (!Number.isInteger(dados.anoLancamento)) {
      marcarErro(campoAno, "Informe um ano de lançamento válido.");
      valido = false;
    }

    return valido;
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (!idEmEdicao) {
      mostrarFeedback("Carregue um jogo pelo ID antes de salvar.", "error");
      return;
    }

    const dados = lerDados();
    if (!validar(dados)) {
      mostrarFeedback("Corrija os campos destacados antes de continuar.", "error");
      return;
    }

    btnSalvar.disabled = true;
    try {
      await atualizarJogo(idEmEdicao, dados);
      mostrarFeedback(`Jogo #${idEmEdicao} atualizado com sucesso.`, "success");
    } catch (erro) {
      mostrarFeedback(mensagemDeErro(erro), "error");
    } finally {
      btnSalvar.disabled = false;
    }
  });

  // Se a tela for aberta com ?id=, carrega automaticamente.
  const idNaUrl = new URLSearchParams(window.location.search).get("id");
  if (idNaUrl) {
    inputBuscaId.value = idNaUrl;
    carregarJogo(idNaUrl);
  }
})();
