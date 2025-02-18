const puppeteer = require("puppeteer");

const commoditiesConfig = {
  milho: {
    url: "https://www.noticiasagricolas.com.br/cotacoes/milho",
    tabelaSelector: ".cot-fisicas tbody",
  },
  soja: {
    url: "https://www.noticiasagricolas.com.br/cotacoes/soja",
    tabelaSelector: ".cot-fisicas tbody",
  },
  boiGordo: {
    url: "https://www.noticiasagricolas.com.br/cotacoes/boi-gordo",
    tabelaSelector: ".cot-fisicas tbody",
  },
};

async function getCotacao(commodity) {
  const config = commoditiesConfig[commodity];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(config.url);

  const firstCotacao = await page.evaluate((tabelaSelector) => {
    const tabela = document.querySelector(tabelaSelector);

    const primeiraLinha = tabela.querySelector("tr"); // Pega a primeira linha da tabela

    const values = primeiraLinha.querySelectorAll("td");

    if (!tabela || !primeiraLinha || values.length < 3) return null;

    return {
      preco: values[1].textContent.trim(),
      variacao: values[2].textContent.trim(),
    };
  }, config.tabelaSelector);
  await browser.close();
  return firstCotacao;
}

(async () => {
  // Pegar cotação do milho
  const milhoCotacao = await getCotacao("milho");
  console.log("Milho:", milhoCotacao);

  // Pegar cotação da soja
  const sojaCotacao = await getCotacao("soja");
  console.log("Soja:", sojaCotacao);

  const boiGordoCotacao = await getCotacao("boiGordo");
  console.log("Arroba do gado: ", boiGordoCotacao);
})();
