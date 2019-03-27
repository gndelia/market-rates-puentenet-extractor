const moment = require('moment');
const stocksService = require('./stockService');

// list of stocks to be downloaded
const stocks = [
    'GGAL',
];

let to = moment().subtract(2, 'days');
let from = to.clone().subtract(90*2, 'days');

stocks.forEach(stock => {
    stocksService
        .add(stock)
        .then(() => stocksService.download(stock, from, to))
        .then(responses => Promise.all([
            stocksService.remove(stock),
            ...responses.map(response => stocksService.writeToFs(response.body)),
        ]));
});