sap.ui.define(["./BaseController", "../model/constants", "../model/content/filters"], function (__BaseController, ___model_constants, ___model_content_filters) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  const Model = ___model_constants["Model"];
  const Filter = ___model_constants["Filter"];
  const ALL = ___model_content_filters["ALL"];
  const experienceTimeline = ___model_content_filters["experienceTimeline"];
  /** Experiencia: linha do tempo de vinculos e projetos (filtro tudo / vinculos / projetos). */
  const ExperienceController = BaseController.extend("webapp.controller.ExperienceController", {
    onInit: function _onInit() {
      this.applyFilter(ALL);
    },
    onAllPress: function _onAllPress() {
      this.applyFilter(ALL);
    },
    onJobPress: function _onJobPress() {
      this.applyFilter(Filter.JOB);
    },
    onProjectPress: function _onProjectPress() {
      this.applyFilter(Filter.PROJECT);
    },
    applyFilter: function _applyFilter(kind) {
      this.model(Model.CONTENT)?.setProperty("/filteredExperiences", experienceTimeline(this.content().experiences, this.content().projects, kind));
      this.model(Model.UI)?.setProperty("/experienceKind", kind);
    }
  });
  return ExperienceController;
});
//# sourceMappingURL=Experience-dbg.controller.js.map
