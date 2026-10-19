sap.ui.define(["./BaseController"], function (__BaseController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * Curriculo (mesmo desenho do PDF, ver pdf/cvPdf.ts).
   *
   * "Ver PDF" e "Imprimir" ficam na barra de secao (App.view.xml) e usam os
   * handlers do BaseController.
   */
  const CvController = BaseController.extend("webapp.controller.CvController", {
    /** Cartoes das certificacoes SAP abrem a credencial. */clickableCards: function _clickableCards() {
      return ".pf-cvcert";
    }
  });
  return CvController;
});
//# sourceMappingURL=Cv-dbg.controller.js.map
