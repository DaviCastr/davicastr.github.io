sap.ui.define(["./BaseController", "../model/constants", "../model/content/filters"], function (__BaseController, ___model_constants, ___model_content_filters) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const Model = ___model_constants["Model"];
  const ALL = ___model_content_filters["ALL"];
  const filterProjects = ___model_content_filters["filterProjects"];
  const filterRepos = ___model_content_filters["filterRepos"];
  const repoLanguages = ___model_content_filters["repoLanguages"];
  /**
   * Projetos + repositorios do GitHub.
   *
   * Dois conjuntos independentes na mesma tela:
   *   1. projects.json - projetos com historia, papel e stack (filtro por tag);
   *   2. github.json   - repositorios reais da conta, gravados pelo
   *      `npm run sync:github` (filtro por linguagem, paginado).
   */
  const ProjectsController = BaseController.extend("webapp.controller.ProjectsController", {
    onInit: function _onInit() {
      this.model(Model.CONTENT)?.setProperty("/repoLanguages", repoLanguages(this.repos()));
      this.applyProjectFilter(ALL);
      this.applyRepoFilter(ALL);
    },
    /** O cartao de repositorio inteiro abre o GitHub. */clickableCards: function _clickableCards() {
      return ".pf-repo";
    },
    // --------------------------------------------------------------- projetos
    onAllPress: function _onAllPress() {
      this.applyProjectFilter(ALL);
    },
    onTagPress: function _onTagPress(event) {
      this.applyProjectFilter(this.sourceProperty(event, "tag") ?? ALL);
    },
    // ----------------------------------------------------------- repositorios
    onAllReposPress: function _onAllReposPress() {
      this.applyRepoFilter(ALL);
    },
    onRepoLanguagePress: function _onRepoLanguagePress(event) {
      this.applyRepoFilter(this.sourceProperty(event, "language") ?? ALL);
    },
    onShowAllReposPress: function _onShowAllReposPress() {
      this.applyRepoFilter(this.model(Model.UI)?.getProperty("/repoLanguageFilter") ?? ALL, true);
    },
    onGitHubPress: function _onGitHubPress() {
      this.openLink(this.content().github?.profileUrl);
    },
    // ---------------------------------------------------------------- interno
    repos: function _repos() {
      return this.content().github?.repos ?? [];
    },
    applyProjectFilter: function _applyProjectFilter(tag) {
      this.model(Model.CONTENT)?.setProperty("/filteredProjects", filterProjects(this.content().projects, tag));
      this.model(Model.UI)?.setProperty("/projectFilter", tag);
    },
    applyRepoFilter: function _applyRepoFilter(language, showAll = false) {
      const {
        visible,
        hidden
      } = filterRepos(this.repos(), language, showAll ? undefined : ProjectsController.REPO_PAGE);
      const content = this.model(Model.CONTENT);
      content?.setProperty("/filteredRepos", visible);
      // O botao "Mostrar todos (N)" some quando nao ha nada escondido.
      content?.setProperty("/hiddenRepoCount", hidden);
      this.model(Model.UI)?.setProperty("/repoLanguageFilter", language);
    }
  });
  /** Repositorios visiveis antes de "Mostrar todos" (a conta tem dezenas). */
  ProjectsController.REPO_PAGE = 9;
  return ProjectsController;
});
//# sourceMappingURL=Projects-dbg.controller.js.map
