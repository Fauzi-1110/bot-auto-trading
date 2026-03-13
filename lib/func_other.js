
/*
const = {
    formatNumber,
    getHargarata
} = require("./func_other.js")
*/

module.exports = {
    formatNumber,
    getHargarata
}

function formatNumber(uang){
    return `${uang >= 1e21 ? Number(uang) : uang.toLocaleString("id")}`
}

function getHargarata(jumlahModal, jumlahBarang){
    return Math.round(jumlahModal/jumlahBarang)
}
