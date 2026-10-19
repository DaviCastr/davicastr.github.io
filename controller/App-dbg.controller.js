sap.ui.define(["sap/base/Log", "sap/m/SegmentedButtonItem", "./BaseController", "../model/constants", "../model/content/ContentLoader", "../model/errors", "../util/ThemeService"], function (Log, SegmentedButtonItem, __BaseController, ___model_constants, ___model_content_ContentLoader, ___model_errors, ___util_ThemeService) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const Model = ___model_constants["Model"];
  const Route = ___model_constants["Route"];
  const loadPortfolio = ___model_content_ContentLoader["loadPortfolio"];
  const PortfolioError = ___model_errors["PortfolioError"];
  const ThemeService = ___util_ThemeService["ThemeService"];
  /**
   * Abaixo desta largura as abas da barra mostram so o icone: marca + 7 abas com
   * rotulo + acoes precisam de ~1077px e estouravam a viewport.
   */
  const COMPACT_NAV_QUERY = "(max-width: 1199px)";

  /**
   * Controller do shell (App.view.xml): topo, barra de secao, rodape e router.
   *
   * Fluxo de inicializacao:
   *   1. onInit: escuta as rotas e dispara o carregamento do conteudo;
   *   2. conteudo carregado: publica no model "content" e preenche o tema;
   *   3. router inicia so quando o shell JA renderizou (NavContainer existe) E o
   *      conteudo JA carregou - ver `startRouterWhenReady`;
   *   4. remove o splash do index.html.
   */
  const AppController = BaseController.extend("webapp.controller.AppController", {
    constructor: function constructor() {
      BaseController.prototype.constructor.apply(this, arguments);
      this.routerStarted = false;
      this.shellRendered = false;
      this.contentLoaded = false;
      /** route -> titulo traduzido, para a barra de secao. */
      this.sectionTitles = {};
      this.compactMedia = window.matchMedia(COMPACT_NAV_QUERY);
      /** Publica no model "ui" se a barra esta em modo compacto (so icones). */
      this.applyCompactNav = () => {
        this.model(Model.UI)?.setProperty("/compactNav", this.compactMedia.matches);
      };
    },
    onInit: function _onInit() {
      this.applyCompactNav();
      this.compactMedia.addEventListener("change", this.applyCompactNav);

      // Antes do router iniciar: a rota inicial tambem precisa passar por aqui.
      this.component().getRouter().attachRouteMatched(event => {
        const route = event.getParameter("name") ?? "";
        this.model(Model.UI)?.setProperty("/activeRoute", route);
        this.syncSectionTitle(route);
      });
      void this.start();
    },
    /** O router so pode iniciar depois que o NavContainer da view raiz existe. */onAfterRendering: function _onAfterRendering() {
      this.shellRendered = true;
      this.startRouterWhenReady();
    },
    /**
     * Inicia o router so com as duas condicoes: NavContainer criado (primeiro
     * render do shell) e conteudo carregado.
     *
     * Iniciar so no render fazia o link direto (".../#/certificates") criar a
     * view antes do JSON chegar: o onInit da tela lia o conteudo e quebrava com
     * "ContentService.boot() precisa ser chamado antes do primeiro acesso".
     */
    startRouterWhenReady: function _startRouterWhenReady() {
      if (this.routerStarted || !this.shellRendered || !this.contentLoaded) {
        return;
      }
      this.routerStarted = true;
      this.component().getRouter().initialize();
    },
    // ------------------------------------------------------------- handlers
    /** Aba da barra superior. */
    onNavPress: function _onNavPress(event) {
      // `route` vem do sections.json, validado contra o manifest no carregamento.
      const route = this.sourceProperty(event, "route");
      if (route) {
        this.navigate(route);
      }
    },
    /**
     * Tema claro/escuro (SegmentedButton do rodape). A key vem do controle: no
     * UI5 1.153 o selectionChange chega sem parametros.
     */
    onThemeChange: function _onThemeChange(event) {
      const mode = event.getSource()?.getSelectedKey() || "light";
      ThemeService.apply(mode);
      this.model(Model.UI)?.setProperty("/theme", mode);
    },
    // ------------------------------------------------------------- interno
    /** Carrega o conteudo e libera a interface. */
    start: async function _start() {
      let loaded;
      try {
        loaded = await loadPortfolio(this.locale());
      } catch (error) {
        this.showStartupError(error);
        return;
      }
      const {
        modelData,
        sectionTitles
      } = loaded;
      this.model(Model.CONTENT)?.setData(modelData);
      // Titulos antes do router: a primeira rota ja sai com o titulo certo.
      this.sectionTitles = sectionTitles;
      this.contentLoaded = true;
      this.startRouterWhenReady();
      await this.fillThemeToggle();
      this.model(Model.UI)?.setProperty("/busy", false);
      this.hideSplash();
    },
    /** Titulo da barra de secao; vazio na home (e o vazio que esconde a barra). */syncSectionTitle: function _syncSectionTitle(route) {
      // Na home o hero ja da o contexto: titulo vazio esconde a barra.
      const title = route === Route.HOME ? "" : this.sectionTitles[route] ?? "";
      this.model(Model.UI)?.setProperty("/currentSectionTitle", title);
    },
    /**
     * Opcoes "Claro/Escuro" do rodape.
     *
     * Criadas via API porque o SegmentedButton ignora template XML em `items`,
     * e o selectedKey e setado direto: em two-way binding o controle gravava
     * string vazia no model durante o boot e o tema voltava para claro.
     */
    fillThemeToggle: async function _fillThemeToggle() {
      const view = this.getView();
      const toggle = view?.byId("themeToggle");
      if (!toggle) {
        Log.warning("SegmentedButton 'themeToggle' nao encontrado");
        return;
      }
      // O manifest declara asyncSupport: o bundle pode chegar como Promise.
      const bundle = await view?.getModel("i18n")?.getResourceBundle();
      const text = key => bundle?.getText(key) ?? key;
      toggle.removeAllItems();
      toggle.addItem(new SegmentedButtonItem({
        key: "light",
        text: text("theme.light")
      }));
      toggle.addItem(new SegmentedButtonItem({
        key: "dark",
        text: text("theme.dark")
      }));
      toggle.setSelectedKey(ThemeService.getMode());
    },
    /**
     * Falha no carregamento: registra o detalhe tecnico e troca o texto do
     * splash pela mensagem para o usuario, na hora (sem esperar a rede de
     * seguranca por tempo do index.html).
     */
    showStartupError: function _showStartupError(error) {
      Log.error(error instanceof Error ? error.message : String(error), undefined, "davi.portfolio");
      const message = error instanceof PortfolioError ? error.userMessage(this.locale()) : this.locale() === "en" ? "Something went wrong while starting the portfolio." : "Algo deu errado ao iniciar o portfólio.";
      const splash = document.getElementById("pf-splash");
      if (splash) {
        splash.innerHTML = "";
        const title = document.createElement("div");
        title.className = "pf-splash__name";
        title.textContent = message;
        splash.appendChild(title);
      }
    },
    /** Remove o splash do index.html com um fade curto. */hideSplash: function _hideSplash() {
      const splash = document.getElementById("pf-splash");
      if (splash) {
        splash.classList.add("is-hidden");
        window.setTimeout(() => splash.remove(), 400);
      }
    }
  });
  return AppController;
});
//# sourceMappingURL=App-dbg.controller.js.map
