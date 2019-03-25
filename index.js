const stocksService = require('./stockService');

// list of stocks to be downloaded
const stocks = [
    'GGAL',
];

let from = new Date();
let to = new Date();

stocks.forEach(stock => {
    stocksService
        .add(stock)
        .then(() => stocks.download(stock, from, to))
        .then((response) => Promise.all([
            stocks.remove(stock),
            stocks.writeToFs(response),
        ]));
});