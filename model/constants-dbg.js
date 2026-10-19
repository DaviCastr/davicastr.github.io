sap.ui.define([], function () {
  "use strict";

  /**
   * Nomes fixos da app num lugar so (como o `constants/` do projeto CAP).
   *
   * Trocar o nome de um model, rota ou filtro passa a ser uma mudanca de uma
   * linha, e o compilador acusa qualquer uso errado (os tipos derivados abaixo
   * aceitam so os valores declarados).
   */

  /** Models do componente (ver Component.ts / model/models.ts). */
  const Model = {
    /** Documento do portfolio + dados derivados das views. Tambem e o model padrao. */
    CONTENT: "content",
    /** Estado da interface (tema, idioma, filtros ativos, rota). */
    UI: "ui",
    DEVICE: "device"
  };
  /** Rotas do manifest.json (sap.ui5/routing/routes). */
  const Route = {
    HOME: "home",
    ABOUT: "about",
    EXPERIENCE: "experience",
    SKILLS: "skills",
    PROJECTS: "projects",
    CERTIFICATES: "certificates",
    EDUCATION: "education",
    CV: "cv"
  };
  /** Valores dos filtros das telas (ver model/content/filters.ts). */
  const Filter = {
    /** Sem filtro. */
    ALL: "all",
    /** Certificacoes: todas menos as vencidas. */
    VALID: "valid",
    /** Experiencia: vinculos (experiences.json). */
    JOB: "job",
    /** Experiencia: projetos (projects.json). */
    PROJECT: "project"
  };
  var __exports = {
    __esModule: true
  };
  __exports.Model = Model;
  __exports.Route = Route;
  __exports.Filter = Filter;
  return __exports;
});
//# sourceMappingURL=constants-dbg.js.map
