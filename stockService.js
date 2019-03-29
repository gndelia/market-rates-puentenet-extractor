const fs = require('fs');
const moment = require('moment');

const MAX_INTERVAL_RANGE = 90;

let stream;

module.exports = {
    openStream,
    newInstance,
    closeStream,
}

function openStream() {
    stream = fs.createWriteStream('cotizaciones.csv', { flags:'a', autoClose: false });
}

function closeStream() {
    if (stream !== null) {
        stream.end();
    }
}


function newInstance() {
    const request = require('./request')();

    return {
        add,
        remove,
        download,
        writeToFs,
    };

    function add({ type, name }) {
        console.log(`Adding ${name} to puente.net export`);
        const url = `!agregarInstrumento.action?seleccionInstrumentoDTO.idInstrumento=${type}_${name}`;
        return request(url);
    }
    
    function remove({ type, name }) {
        console.log(`Removing ${name} from puente.net export`);
        const url = `!quitarInstrumento.action?seleccionInstrumentoDTO.idInstrumento=${type}_${name}`;
        return request(url);
    }
    
    async function download(selected, from, to) {
        while (from < to) {
            let response = await sendDownloadRequest(selected, from, to)
            await writeToFs(response);
            from.add(MAX_INTERVAL_RANGE, 'days');
        }
        return Promise.resolve();
    }
    
    function writeToFs({ body, headers }) {
        if (body.includes('No hay precios para exportar') || headers['content-type'] !== 'text/csv') {
            return;
        }
        let data = body
            .split('\n')
            .slice(2, -1) // skip two lines of header and last line that should be empty
            .map(line => {
                let [ firstPart, price ] = line.split('"');
                let [ stock, date ] = firstPart.split(',');
                return `${stock}, ${date}, "${price}"`;
            })
            .filter(line => line !== '')
            .join('\n');
        // is this necessary ? review
        return new Promise(r => stream.write(data + '\n', 'utf8', r));
    }
    
    function sendDownloadRequest(stock, from, to) {
        const dateFormat = 'DD/MM/YYYY';
        // prevent going to the future - max date is yesterday
        const toLimited = moment.min(to, from.clone().add(MAX_INTERVAL_RANGE, 'days'));
        console.log(`Requesting information for ${stock} from ${from} to ${toLimited}`);
        const url = `!exportarSeleccionadoCsv.action?fechaInicio=${from.format(dateFormat)}&fechaFin=${toLimited.format(dateFormat)}`;
        return request(url);
    }
}