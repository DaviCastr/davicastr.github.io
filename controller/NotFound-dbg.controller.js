sap.ui.define(["./BaseController", "../model/constants"], function (__BaseController, ___model_constants) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const Route = ___model_constants["Route"];
  /** Pagina 404. */
  const NotFoundController = BaseController.extend("webapp.controller.NotFoundController", {
    onHomePress: function _onHomePress() {
      this.navigate(Route.HOME);
    },
    onContactPress: function _onContactPress() {
      this.onEmailPress();
    }
  });
  return NotFoundController;
});
//# sourceMappingURL=NotFound-dbg.controller.js.map
