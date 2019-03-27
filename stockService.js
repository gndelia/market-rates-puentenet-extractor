const fs = require('fs');
const moment = require('moment');
const request = require('./request');

const MAX_INTERVAL_RANGE = 90;

module.exports = {
    add,
    remove,
    download,
    writeToFs,
}

function add(stock) {
    console.log(`Adding ${stock} to puente.net export`);
    const url = `!agregarInstrumento.action?seleccionInstrumentoDTO.idInstrumento=ACCION_${stock}`;
    return request(url);
}

function remove(stock) {
    console.log(`Removing ${stock} from puente.net export`);
    const url = `!quitarInstrumento.action?seleccionInstrumentoDTO.idInstrumento=ACCION_${stock}`;
    return request(url);
}

function download(stock, from, to) {
    let promises = [];
    while (from < to) {
        promises.push(sendDownloadRequest(stock, from, to));
        from.add(MAX_INTERVAL_RANGE, 'days');
    }
    return Promise.all(promises);
}

function writeToFs(responses) {
    let data = responses.reverse().map(({ body }) => {
        return body
            .split('\n')
            .slice(2, -1) // skip two lines of header and last line that should be empty
            .map(line => {
                let [ firstPart, price ] = line.split('"');
                let [ stock, date ] = firstPart.split(',');
                return `${stock}, ${date}, "${price}"`;
            }).join('\n');
    }).join('\n');
    return new Promise((resolve, reject) => {
        fs.writeFile('cotizaciones.csv', data, 'utf8', err => {
            if(err) {
                return reject(err);
            }
            return resolve();
        });
    });
}

function sendDownloadRequest(stock, from, to) {
    const dateFormat = 'DD/MM/YYYY';
    // prevent going to the future - max date is yesterday
    const toLimited = moment.min(to, from.clone().add(MAX_INTERVAL_RANGE, 'days'));
    console.log(`Requesting information for ${stock} from ${from} to ${toLimited}`);
    const url = `!exportarSeleccionadoCsv.action?fechaInicio=${from.format(dateFormat)}&fechaFin=${toLimited.format(dateFormat)}`;
    return request(url);
}