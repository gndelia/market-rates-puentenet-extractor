const moment = require('moment');
const stocksService = require('./stockService');
// list of stocks to be downloaded
const stocks = ["AGRO","ALUA","APBR","AUSO","BHIP","BMA","BOLT","BPAT","BRIO","BRIO6","BYMA","CADO","CAPU","CAPX","CARC","CECO2","CELU","CEPU","CGPA2","COLO","COME","CRES","CTGM","CTIO","CVH","DGCU2","DYCA","EDN","ESME","FERR","FIPL","FRAN","GARO","GBAN","GCLA","GGAL","GRIM","HARG","HAVA","INAG","INDU","INTR","INVJ","IRCP","IRSA","LEDE","LOMA","LONG","MERA","METR","MIRG","MOLA","MOLI","MORI","OEST","PAMP","PATA","PATY","PESA","PGR","POLL","PSUR","REP","RICH","RIGO","ROSE","SAMI","SEMI","STD","SUPV","TECO2","TEF","TGLT","TGNO4","TGSU2","TRAN","TS","TXAR","VALO","YPFD"];
const bonds = ["A2E2","A2E2D","A2E3","A2E3D","A2E7","A2E7D","A2E8","A2E8D","A2J9","A2J9D","A2M2","AA19","AA19D","AA21","AA21D","AA22","AA25","AA25D","AA26","AA26D","AA37","AA37D","AA46","AA46D","AC17","AC17D","AE48","AE48D","AF20","AF20D","AL36","AM20","AMX9","AO20","AO20D","AY24","AY24D","BD2C9","BDC19","BDC20","BDC22","BP21","BP28","BPLD","BPLDD","BPLE","BPMD","BPMDD","BPME","CEDI","CH24D","CHSG1","CHSG2","CO26","CO26D","CUAP","DIA0","DIA0D","DICA","DICAD","DICE","DICP","DICY","DICYD","DIP0","DIY0","DIY0D","FORM3","NO20","ONCTG_6","PAA0","PAA0D","PAP0","PARA","PARAD","PARP","PARY","PARYD","PAY0","PAY0D","PBA25","PBF23","PBJ21","PBJ27","PBM24","PBY22","PF23D","PMJ21","PR13","PR15","PUL26","PUM21","PUO19","RHC20","SA24D","SUC1P","TC20","TC21","TC23","TC25P","TJ20","TN20","TO21","TO23","TO26","TVPA","TVPE","TVPP","TVPY","TVPYD","TVY0"];

let to = moment().subtract(1, 'days');
let from = to.clone().subtract(100, 'months');

stocksService.openStream();
let promises = stocks.map(stock => ({ type: 'ACCION', name: stock }))
    .concat(bonds.map(bond => ({ type: 'BONO', name: bond })))
    .map(async ticket => {
        try {
            let service = stocksService.newInstance();
            await service.add(ticket);
            await service.download(ticket.name, from.clone(), to.clone());
            // I do not really need to remove the ticket, because by dropping the request
            // I cannot get access again to the ones I have added. 
            // await service.remove(ticket);
        } catch (e) {
            console.log(e);
            console.log(`ticket ${ticket.name} failed`);
            // throw e;
        }
});

Promise
    .all(promises)
    .then(stocksService.closeStream);
