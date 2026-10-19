sap.ui.define(["./BaseController", "../model/constants", "../model/content/filters"], function (__BaseController, ___model_constants, ___model_content_filters) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const Model = ___model_constants["Model"];
  const Filter = ___model_constants["Filter"];
  const ALL = ___model_content_filters["ALL"];
  const filterCertificates = ___model_content_filters["filterCertificates"];
  /** Galeria de certificacoes com filtro por ano e por validade. */
  const CertificatesController = BaseController.extend("webapp.controller.CertificatesController", {
    onInit: function _onInit() {
      this.applyFilter(ALL);
    },
    /** Cada cartao abre a credencial oficial (Credly). */clickableCards: function _clickableCards() {
      return ".pf-cert";
    },
    onAllPress: function _onAllPress() {
      this.applyFilter(ALL);
    },
    onValidPress: function _onValidPress() {
      this.applyFilter(Filter.VALID);
    },
    onYearPress: function _onYearPress(event) {
      this.applyFilter(this.sourceProperty(event, "year") ?? ALL);
    },
    applyFilter: function _applyFilter(filter) {
      this.model(Model.CONTENT)?.setProperty("/filteredCertificates", filterCertificates(this.content().certificates, filter));
      this.model(Model.UI)?.setProperty("/certificateFilter", filter);
    }
  });
  return CertificatesController;
});
//# sourceMappingURL=Certificates-dbg.controller.js.map
