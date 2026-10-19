sap.ui.define(["../data/StaticJsonDataSource", "../errors", "./ContentService", "./viewData"], function (___data_StaticJsonDataSource, ___errors, ___ContentService, ___viewData) {
  "use strict";

  const browserFetcher = ___data_StaticJsonDataSource["browserFetcher"];
  const createDataSource = ___data_StaticJsonDataSource["createDataSource"];
  const loadSourceConfig = ___data_StaticJsonDataSource["loadSourceConfig"];
  const ContentLoadError = ___errors["ContentLoadError"];
  const ContentService = ___ContentService["ContentService"];
  const buildViewData = ___viewData["buildViewData"];
  /** Pasta dos JSON do portfolio (relativa a webapp/). */
  const CONTENT_BASE_URL = "content";

  /** Resultado do carregamento: o que vai para o model "content" + titulos das secoes. */

  /**
   * Carrega o portfolio no navegador: escolhe a fonte (content/source.json),
   * valida, traduz para `locale` e calcula os dados derivados das views.
   *
   * Falha de rede/arquivo vira `ContentLoadError` (ver model/errors.ts).
   *
   * E o unico ponto de entrada de dados da app - o App.controller so chama esta
   * funcao e publica o resultado. Trocar JSON por um backend (CAP) e trocar a
   * fonte em `source.json`, sem tocar em controller nem view.
   */
  async function loadPortfolio(locale) {
    let service;
    try {
      const source = await loadSourceConfig(CONTENT_BASE_URL, browserFetcher);
      const dataSource = createDataSource(source, {
        baseUrl: CONTENT_BASE_URL,
        fetcher: browserFetcher
      });
      service = await ContentService.boot({
        dataSource,
        locale
      });
    } catch (error) {
      // Rede fora, JSON ausente ou invalido: um erro so, com mensagem para o usuario.
      throw new ContentLoadError(error);
    }
    return {
      // Um unico objeto: dois setData seguidos apagariam o documento e
      // deixariam so as derivacoes.
      modelData: {
        ...service.content,
        ...buildViewData(service)
      },
      // `nav` e LocalizedText no tipo, mas ja chega traduzido aqui.
      sectionTitles: Object.fromEntries(service.activeSections.map(section => [section.route, String(section.nav ?? "")]))
    };
  }
  var __exports = {
    __esModule: true
  };
  __exports.loadPortfolio = loadPortfolio;
  return __exports;
});
//# sourceMappingURL=ContentLoader-dbg.js.map
