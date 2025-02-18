## Tópicos a serem revisados
    [ X ] Array.from()
    [ X ] querySelectorAll
    [ X ] innerHTML
    [ X ] innerText
    [ X ] textContent
    [ X ] Array.trim()

## Tasks 
    [  ] Pesquisar mais sites que me retornam uma cotação
    [ X ] Testar o arquivo finally2.js
    [  ] Revisar JS async
    [  ] Revisar partes do código
    [ X ] Adicionar interatividade quanto à qual site que vai ser utilizado 
    [ X ] Publicar no github
    


    -> Sugestão 
        ##Pegar pelos ul li do site só as cotações que eu quero.


recomendação de código:
const puppeteer = require("puppeteer");

// Configurações para cada commodity
const commoditiesConfig = {
  milho: {
    url: "https://www.noticiasagricolas.com.br/cotacoes/milho",
    tabelaSelector: ".cot-fisicas tbody",
  },
  soja: {
    url: "https://www.noticiasagricolas.com.br/cotacoes/soja",
    tabelaSelector: ".cot-fisicas tbody",
  },
  // Adicione outras commodities aqui
};

async function getCotacao(commodity) {
  const config = commoditiesConfig[commodity];
  if (!config) {
    console.error(`Commodity "${commodity}" não encontrada.`);
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(config.url, { waitUntil: "domcontentloaded" });

  const cotacao = await page.evaluate((tabelaSelector) => {
    const tabela = document.querySelector(tabelaSelector);
    if (!tabela) return null;

    const primeiraLinha = tabela.querySelector("tr");
    if (!primeiraLinha) return null;

    const colunas = primeiraLinha.querySelectorAll("td");
    if (colunas.length < 3) return null;

    return {
      preco: colunas[1].textContent.trim(),
      variacao: colunas[2].textContent.trim(),
    };
  }, config.tabelaSelector);

  await browser.close();
  return cotacao;
}

(async () => {
  // Pegar cotação do milho
  const milhoCotacao = await getCotacao("milho");
  console.log("Milho:", milhoCotacao);

  // Pegar cotação da soja
  const sojaCotacao = await getCotacao("soja");
  console.log("Soja:", sojaCotacao);

  // Você pode adicionar mais chamadas para outras commodities
})();
