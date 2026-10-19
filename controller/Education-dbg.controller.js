sap.ui.define(["./BaseController"], function (__BaseController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /** Formacao. "Ver documento" (diploma em PDF) abre o `url` do item. */
  const EducationController = BaseController.extend("webapp.controller.EducationController", {
    onDocumentPress: function _onDocumentPress(event) {
      this.onLinkPress(event);
    }
  });
  return EducationController;
});
//# sourceMappingURL=Education-dbg.controller.js.map
