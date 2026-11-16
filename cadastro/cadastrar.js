/**
 * Tela de cadastro (POST /jogos).
 */
(function () {
  const { criarJogo, ApiError } = window.jogosApi;

  const form = document.getElementById("jogo-form");
  const campoTitulo = document.getElementById("campo-titulo");
  const campoPlataforma = document.getElementById("campo-plataforma");
  const campoGenero = document.getElementById("campo-genero");
  const campoAno = document.getElementById("campo-ano");
  const btnSalvar = document.getElementById("btn-salvar");
  const btnLimpar = document.getElementById("btn-limpar");
  const feedback = document.getElementById("feedback");

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
    feedback.classList.add("hidden");

    const dados = lerDados();
    if (!validar(dados)) {
      mostrarFeedback("Corrija os campos destacados antes de continuar.", "error");
      return;
    }

    btnSalvar.disabled = true;
    try {
      const criado = await criarJogo(dados);
      mostrarFeedback(
        `Jogo "${criado?.titulo ?? dados.titulo}" cadastrado com sucesso (ID ${criado?.id ?? "?"}).`,
        "success"
      );
      form.reset();
      limparErros();
    } catch (erro) {
      mostrarFeedback(mensagemDeErro(erro), "error");
    } finally {
      btnSalvar.disabled = false;
    }
  });

  btnLimpar.addEventListener("click", () => {
    form.reset();
    limparErros();
    feedback.classList.add("hidden");
  });
})();
