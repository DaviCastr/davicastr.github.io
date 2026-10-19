sap.ui.define([], function () {
  "use strict";

  /**
   * Erros da app (como o `errors/` do projeto CAP): cada falha conhecida tem um
   * tipo proprio, com mensagem tecnica (log) e mensagem para o usuario.
   */

  /** Base: `userMessage` e o texto seguro para mostrar na tela. */
  class PortfolioError extends Error {
    constructor(name, message, cause) {
      super(message);
      // Nome explicito: `new.target` quebra o analisador do UI5 no build e o
      // nome da classe some na minificacao.
      this.cause = cause;
      this.name = name;
    }
  }

  /** Acesso ao conteudo antes do carregamento terminar (erro de programacao). */
  class ContentNotLoadedError extends PortfolioError {
    constructor() {
      super("ContentNotLoadedError", "ContentService.boot() precisa ser chamado antes do primeiro acesso.");
    }
    userMessage(locale) {
      return locale === "en" ? "The portfolio is still loading." : "O portfólio ainda está carregando.";
    }
  }

  /** Nao foi possivel buscar/validar os JSON do portfolio (rede, arquivo ausente...). */
  class ContentLoadError extends PortfolioError {
    constructor(cause) {
      super("ContentLoadError", `Falha ao carregar o conteudo do portfolio: ${cause instanceof Error ? cause.message : String(cause)}`, cause);
    }
    userMessage(locale) {
      return locale === "en" ? "Could not load the portfolio content. Please check your connection and reload the page." : "Não foi possível carregar o conteúdo do portfólio. Verifique a conexão e recarregue a página.";
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.PortfolioError = PortfolioError;
  __exports.ContentNotLoadedError = ContentNotLoadedError;
  __exports.ContentLoadError = ContentLoadError;
  return __exports;
});
//# sourceMappingURL=errors-dbg.js.map
