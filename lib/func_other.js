const dbSystem = require(process.cwd()+"/lib/func_db")
/*
const = {
    formatNumber,
    getHargarata
} = require("./func_other.js")
*/

module.exports = {
    formatNumber,
    getHargarata,
    kerjaBot
}

function formatNumber(uang){
    return `${uang >= 1e21 ? Number(uang) : uang.toLocaleString("id")}`
}

function getHargarata(jumlahModal, jumlahBarang){
    return Math.round(jumlahModal/jumlahBarang)
}

async function kerjaBot(id){
    const user = await dbSystem.getUser(id)
    const pekerjaan_data_user = user.pekerjaan
    const pekerjaan_data_global = await dbSystem.getGlobalKey("pekerjaan")[pekerjaan_data_user.pekerjaan][0]
    
    const now = Math.floor(Date.now() / 1000)
    if(now - pekerjaan_data_user.last_kerja <= pekerjaan_data_global.cooldown) return
    
    if(pekerjaan_data_user.pekerjaan === "pengangguran"){
        //dapetin semua kerjaan 
        const pekerjaan_all = dbSystem.getGlobalKey("pekerjaan")
        const pekerjaan_list = Object.keys(await dbSystem.getGlobalKey("pekerjaan"))
        const pekerjaan_dapat_dilamar = []
        
        for(let job_key of pekerjaan_list){
            const job_data = pekerjaan_all[job_key][0]
            if(pekerjaan_data_user.pengalaman >= job_data.minimum) pekerjaan_dapat_dilamar.push(job_key)
        }
        
        const pekerjaan_lamar = pekerjaan_dapat_dilamar[pekerjaan_dapat_dilamar.length-1]
        const pekerjaan_lamar_data = pekerjaan_all[pekerjaan_lamar][0]
        
        dbSystem.setUserKey(id, "pekerjaan.pekerjaan", pekerjaan_lamar_data.pekerjaan)
        return
    }
    
    let gaji
    if(["pedagang", "pembisnis", "ceo"].includes(pekerjaan_data_user.pekerjaan)){
        const untung = Math.random() > 0.25
        const close = Math.random() < 0.1
        gaji = Math.floor(Math.random() * pekerjaan_data_global.gaji)
        if(!untung) gaji *= -1
        if(close) dbSystem.setUserKey(id, "pekerjaan.pekerjaan", "pengangguran")
    } else {
        const dipecat = Math.random() < 0.15
        gaji = pekerjaan_data_global.gaji + Math.round(Math.random() * (pekerjaan_data_global.gaji * 0.03))
        if(dipecat) dbSystem.setUserKey(id, "pekerjaan.pekerjaan", "pengangguran")
    }
    
    dbSystem.setUserKey(id, `pekerjaan.last_kerja`, now)
    dbSystem.addUserKey(id, "uang", gaji)
    dbSystem.addUserKey(id, `pekerjaan.pengalaman`, 1)
}
