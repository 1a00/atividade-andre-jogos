/**
 * Lógica compartilhada do cabeçalho: marca o link ativo no menu e
 * atualiza o indicador de status da API em todas as telas.
 */
(function () {
  const paginaAtual = document.body.dataset.page;
  if (paginaAtual) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.dataset.page === paginaAtual) {
        link.classList.add("is-active");
      }
    });
  }

  const statusEl = document.getElementById("topbar-status");
  const statusTexto = document.getElementById("topbar-status-texto");

  async function atualizarStatus() {
    if (!statusEl || !window.jogosApi) return;
    statusEl.dataset.state = "checking";
    statusTexto.textContent = "Verificando API...";
    const online = await window.jogosApi.verificarStatusApi();
    statusEl.dataset.state = online ? "online" : "offline";
    statusTexto.textContent = online ? "API conectada" : "API indisponível";
  }

  atualizarStatus();
})();
