sap.ui.define(["../constants", "../dates", "../data/liveSources", "./ordering"], function (___constants, ___dates, ___data_liveSources, ___ordering) {
  "use strict";

  const Filter = ___constants["Filter"];
  const isExpired = ___dates["isExpired"];
  const orderCertificates = ___data_liveSources["orderCertificates"];
  const sortProjectsByRecency = ___ordering["sortProjectsByRecency"];
  /**
   * Filtros das telas, como funcoes puras.
   *
   * O controller so le a escolha do usuario e publica o resultado no model; a
   * regra ("o que e uma certificacao vigente", "em que ordem os projetos
   * aparecem") mora aqui, onde pode ser testada sem UI5.
   */
  /** Valor de filtro que significa "sem filtro" (alias de Filter.ALL). */
  const ALL = Filter.ALL;

  /** Experiencias por natureza: "job", "project" ou ALL. Sem `kind` conta como "job". */
  function filterExperiences(items, kind) {
    return kind === ALL ? items : items.filter(item => (item.kind ?? Filter.JOB) === kind);
  }

  /**
   * Projeto como item da linha do tempo de experiencia: o nome vira o titulo, a
   * empresa fica na linha de baixo e o papel ao lado (no lugar do "Remoto").
   */
  function projectAsExperience(project) {
    return {
      id: `project-${project.id}`,
      company: project.company ?? "",
      role: project.name,
      workplace: project.role,
      period: project.period ?? {
        from: "",
        to: null
      },
      summary: project.description,
      highlights: project.highlights ?? [],
      highlightsItems: project.highlightsItems,
      stack: project.stack,
      stackItems: project.stackItems,
      kind: "project",
      current: project.current
    };
  }

  /**
   * Linha do tempo da tela de Experiencia.
   *
   * - "job": os vinculos (experiences.json);
   * - "project": os projetos (projects.json), do mais recente ao mais antigo;
   * - ALL: os dois juntos - em andamento primeiro, depois pela data de fim.
   *
   * Antes o filtro "Projetos" procurava `kind: "project"` em experiences.json, e
   * como os projetos moram em projects.json a lista ficava vazia.
   */
  function experienceTimeline(experiences, projects, kind) {
    const jobs = filterExperiences(experiences, Filter.JOB);
    const projectItems = sortProjectsByRecency(projects).map(projectAsExperience);
    if (kind === Filter.JOB) {
      return jobs;
    }
    if (kind === Filter.PROJECT) {
      return projectItems;
    }
    // 0 = em andamento, 1 = datado, 2 = sem data (vai para o fim).
    const rank = item => item.current || item.period?.from && !item.period.to ? 0 : item.period?.from ? 1 : 2;
    const end = item => item.period?.to ?? "";
    const start = item => item.period?.from ?? "";
    // Sort estavel: empates mantem vinculos antes de projetos.
    return [...jobs, ...projectItems].sort((a, b) => rank(a) - rank(b) || end(b).localeCompare(end(a)) || start(b).localeCompare(start(a)));
  }

  /** Projetos com a tag (ou todos), sempre do mais recente para o mais antigo. */
  function filterProjects(items, tag) {
    return sortProjectsByRecency(tag === ALL ? items : items.filter(item => item.tags?.includes(tag)));
  }

  /**
   * Certificacoes: ALL, "valid" (todas menos as vencidas) ou um ano ("2025").
   * Credencial sem `expiresAt` nao expira, entao conta como vigente - mesma
   * regra do card "Vigentes" (metrics.validCertificates).
   */
  function filterCertificates(items, filter, now = new Date()) {
    // Sempre na ordem de exibicao (SAP Certified, depois as mais recentes):
    // entradas manuais ficam no fim do JSON e sem isto apareceriam por ultimo.
    const ordered = orderCertificates(items);
    if (filter === ALL) {
      return ordered;
    }
    if (filter === Filter.VALID) {
      return ordered.filter(item => !isExpired(item.expiresAt, now));
    }
    return ordered.filter(item => (item.issuedAt ?? "").startsWith(filter));
  }

  /** Repositorios por linguagem, paginados: `visible` + quantos ficaram de fora. */
  function filterRepos(repos, language, limit = Number.POSITIVE_INFINITY) {
    const matching = language === ALL ? repos : repos.filter(repo => repo.language === language);
    const visible = matching.slice(0, limit);
    return {
      visible,
      hidden: matching.length - visible.length
    };
  }

  /** Icone SAP por linguagem (o SAP-icons nao tem marcas de linguagem). */
  const LANGUAGE_ICONS = {
    TypeScript: "javascript",
    JavaScript: "javascript",
    HTML: "code",
    CSS: "code",
    "Jupyter Notebook": "source-code",
    ABAP: "log"
  };

  /** Linguagens dos repositorios para os chips de filtro: "TypeScript (12)", da mais usada. */
  function repoLanguages(repos) {
    const counter = new Map();
    repos.forEach(repo => {
      if (repo.language) {
        counter.set(repo.language, (counter.get(repo.language) ?? 0) + 1);
      }
    });
    return [...counter.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([language, count]) => ({
      language,
      count,
      label: `${language} (${count})`,
      icon: LANGUAGE_ICONS[language] ?? "source-code"
    }));
  }
  var __exports = {
    __esModule: true
  };
  __exports.ALL = ALL;
  __exports.filterExperiences = filterExperiences;
  __exports.projectAsExperience = projectAsExperience;
  __exports.experienceTimeline = experienceTimeline;
  __exports.filterProjects = filterProjects;
  __exports.filterCertificates = filterCertificates;
  __exports.filterRepos = filterRepos;
  __exports.repoLanguages = repoLanguages;
  return __exports;
});
//# sourceMappingURL=filters-dbg.js.map
