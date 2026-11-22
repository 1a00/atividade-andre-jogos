(function () {
  const paginaAtual = document.body.dataset.page;
  if (paginaAtual) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (link.dataset.page === paginaAtual) {
        link.classList.add("is-active");
      }
    });
  }
})();
