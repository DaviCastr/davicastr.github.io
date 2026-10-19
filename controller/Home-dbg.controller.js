sap.ui.define(["./BaseController", "../model/constants"], function (__BaseController, ___model_constants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const Route = ___model_constants["Route"];
  /** Pagina inicial: hero, destaques e atalhos para as demais secoes. */
  const HomeController = BaseController.extend("webapp.controller.HomeController", {
    /** Certificados e repositorios em destaque abrem a pagina oficial. */clickableCards: function _clickableCards() {
      return ".pf-repo, .pf-cert";
    },
    onSkillsPress: function _onSkillsPress() {
      this.navigate(Route.SKILLS);
    },
    onProjectsPress: function _onProjectsPress() {
      this.navigate(Route.PROJECTS);
    },
    onCertificatesPress: function _onCertificatesPress() {
      this.navigate(Route.CERTIFICATES);
    },
    onLinkedinPress: function _onLinkedinPress() {
      this.openLink(this.content().profile.links?.find(link => link.id === "linkedin")?.url);
    },
    /** "Ver curriculo em PDF". */onDownloadCvPress: function _onDownloadCvPress() {
      this.onDownloadPress();
    }
  });
  return HomeController;
});
//# sourceMappingURL=Home-dbg.controller.js.map
