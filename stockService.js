const request = require('./request');

module.exports = {
    add,
    remove,
    download,
    writeToFs,
}

function add(stock) {
    // example of url 'https://www.puentenet.com/puente/researchAction!agregarInstrumento.action?seleccionInstrumentoDTO.idInstrumento=ACCION_GGAL&windowName=0.14893527100190673&r=0.2847972687867404&_=1553532261048'
}

function remove(stock) {
    
}

function download(stock, from, to) {
    // example of url https://www.puentenet.com/puente/researchAction!exportarSeleccionadoCsv.action?fechaInicio=04/03/2019&fechaFin=07/03/2019
}

function writeToFs(data) {

}