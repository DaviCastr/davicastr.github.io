sap.ui.define([], function () {
  "use strict";

  /**
   * Cartoes clicaveis sem botao dentro (certificados, repositorios...).
   *
   * Um unico listener delegado na raiz da view cuida de todos os cartoes que
   * casam com `selector`: o fragmento continua declarativo e funciona igual em
   * qualquer tela que o reutilize. O cartao nao carrega a URL no DOM; ela vem do
   * campo `url` do contexto de binding do controle (o `id` do elemento DOM de um
   * controle UI5 e o proprio id dele).
   *
   * Uso no controller (ver BaseController.onAfterRendering):
   *   private readonly cards = new ClickableCards(".pf-cert", (url) => open(url));
   *   onAfterRendering() { this.cards.attach(viewDomRef); }
   */
  class ClickableCards {
    boundRoots = new WeakSet();
    constructor(selector, open) {
      this.selector = selector;
      this.open = open;
    }

    /**
     * Instala os listeners (uma vez por raiz) e sincroniza a acessibilidade.
     * Chamar a cada render: os cartoes nascem e morrem com os filtros.
     */
    attach(root) {
      if (!root) {
        return;
      }
      if (!this.boundRoots.has(root)) {
        this.boundRoots.add(root);
        root.addEventListener("click", this.handleClick);
        root.addEventListener("keydown", this.handleKeydown);
      }
      this.syncAccessibility(root);
    }

    /** `role="link"` + foco por teclado apenas nos cartoes que tem destino. */
    syncAccessibility(root) {
      root.querySelectorAll(this.selector).forEach(card => {
        if (this.urlOf(card)) {
          card.setAttribute("role", "link");
          card.setAttribute("tabindex", "0");
        } else {
          card.removeAttribute("role");
          card.removeAttribute("tabindex");
        }
      });
    }
    urlOf(card) {
      const control = card?.id ? sap.ui.getCore().byId(card.id) : null;
      const url = control?.getBindingContext()?.getProperty("url");
      return typeof url === "string" ? url : "";
    }
    activate(card, event) {
      const url = this.urlOf(card);
      if (url) {
        event.preventDefault();
        this.open(url);
      }
    }
    handleClick = event => {
      const target = event.target;
      // Link/botao dentro do cartao continua sendo acao propria dele.
      if (target?.closest("a, button")) {
        return;
      }
      this.activate(target?.closest(this.selector) ?? null, event);
    };
    handleKeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        const target = event.target;
        this.activate(target?.closest(this.selector) ?? null, event);
      }
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.ClickableCards = ClickableCards;
  return __exports;
});
//# sourceMappingURL=ClickableCards-dbg.js.map
