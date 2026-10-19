sap.ui.define(["sap/ui/core/mvc/Controller", "../model/content/ContentService", "../model/formatter", "../model/constants", "../util/LocaleService", "./support/ClickableCards", "./support/CvPdfAction"], function (Controller, ___model_content_ContentService, __formatter, ___model_constants, ___util_LocaleService, ___support_ClickableCards, ___support_CvPdfAction) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ContentService = ___model_content_ContentService["ContentService"];
  const formatter = _interopRequireDefault(__formatter);
  const Route = ___model_constants["Route"];
  const LocaleService = ___util_LocaleService["LocaleService"];
  const ClickableCards = ___support_ClickableCards["ClickableCards"];
  const openCvPdf = ___support_CvPdfAction["openCvPdf"];
  /**
   * Base de todos os controllers.
   *
   * Fica aqui apenas o que TODA tela usa: acesso ao componente, aos models e ao
   * router, abertura de links e os formatadores. Comportamentos maiores vivem em
   * `controller/support/` (cartoes clicaveis, PDF) e a regra de negocio em
   * `model/` - o controller so liga a view a eles.
   */
  const BaseController = Controller.extend("webapp.controller.BaseController", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      /** Formatadores das views: `formatter: '.formatter.date'` (ver model/formatter.ts). */
      this.formatter = formatter;
    },
    // ------------------------------------------------------------------ acesso
    /**
     * Componente dono deste controller.
     *
     * Metodo, e nao getter: o Babel transforma a classe em `.extend()`, e um
     * getter viraria um "setting" do UI5 que o `applySettings` executaria sem
     * componente - quebrando o carregamento.
     */
    component: function _component() {
      return this.getOwnerComponent();
    },
    /** Model do componente ("ui", "content", "device"). No UI5 1.153 o Controller nao tem getModel. */model: function _model(name) {
      return this.component()?.getModel(name);
    },
    /** Conteudo ja validado e traduzido para o idioma ativo. */content: function _content() {
      return ContentService.get().content;
    },
    locale: function _locale() {
      return LocaleService.getActive();
    },
    /** Contexto de binding do controle que disparou o evento (item de uma lista). */sourceContext: function _sourceContext(event) {
      return event.getSource()?.getBindingContext();
    },
    /** Propriedade do item clicado (ex.: `this.sourceProperty(event, "url")`). */sourceProperty: function _sourceProperty(event, path) {
      return this.sourceContext(event)?.getProperty(path);
    },
    // ------------------------------------------------------------- navegacao
    /** Vai para uma rota do manifest.json (sem empilhar historico). */
    navigate: function _navigate(route) {
      this.component().getRouter().navTo(route, undefined, true);
    },
    /**
     * Abre um link: `mailto:` no proprio cliente de e-mail (o navegador barra
     * `window.open` com mailto) e o resto numa nova aba.
     */
    openLink: function _openLink(url) {
      if (!url) {
        return;
      }
      if (url.startsWith("mailto:")) {
        window.location.href = url;
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    },
    // ------------------------------------------- handlers dos fragments comuns
    // Topbar, Footer, ProjectCard e cartao de contato sao reutilizados por
    // varias views; os handlers ficam aqui para funcionarem em qualquer uma.
    /** Item com `url` (link de perfil, site do projeto, documento). */
    onLinkPress: function _onLinkPress(event) {
      this.openLink(this.sourceProperty(event, "url"));
    },
    /** Alias usado pelo ProjectCard ("Site"). */onUrlPress: function _onUrlPress(event) {
      this.onLinkPress(event);
    },
    /** Site publicado do repositorio (GitHub Pages ou homepage, campo `siteUrl`). */onSitePress: function _onSitePress(event) {
      this.openLink(this.sourceProperty(event, "siteUrl"));
    },
    /** Repositorio do projeto (campo `repo`). */onRepoPress: function _onRepoPress(event) {
      this.openLink(this.sourceProperty(event, "repo"));
    },
    /** E-mail do perfil no cliente de e-mail. */onEmailPress: function _onEmailPress() {
      this.openLink(`mailto:${this.content().profile.email}`);
    },
    /** Pagina do curriculo. */onCvPress: function _onCvPress() {
      this.navigate(Route.CV);
    },
    // ------------------------------------------------------- cartoes clicaveis
    /**
     * Seletor dos cartoes clicaveis desta view (abrem o `url` do binding).
     * Views sem cartao clicavel devolvem "" e nada e instalado.
     */
    clickableCards: function _clickableCards() {
      return "";
    },
    onAfterRendering: function _onAfterRendering() {
      const selector = this.clickableCards();
      if (!selector) {
        return;
      }
      this.cards ??= new ClickableCards(selector, url => this.openLink(url));
      const view = this.getView();
      this.cards.attach(view?.getDomRef?.() ?? null);
    },
    // ----------------------------------------------------- acoes do curriculo
    /** "Ver PDF": gera no navegador e abre a pre-visualizacao (support/CvPdfAction). */
    onDownloadPress: function _onDownloadPress() {
      void openCvPdf(this.content(), this.locale());
    },
    /** Imprime a pagina (print.css remove menus e ajusta para A4). */onPrintPress: function _onPrintPress() {
      window.print();
    }
  });
  return BaseController;
});
//# sourceMappingURL=BaseController-dbg.js.map
