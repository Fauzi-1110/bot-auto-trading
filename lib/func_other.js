<<<<<<< HEAD
const dbSystem = require(process.cwd()+"/lib/func_db")
const moment = require("moment-timezone")
const fs = require("fs")
=======
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1

/*
const = {
    formatNumber,
    getHargarata
} = require("./func_other.js")
*/

module.exports = {
    formatNumber,
<<<<<<< HEAD
    getHargarata,
    kerjaBot,
    addHistoryPerubahanHarga,
    getLogHistoryPerubahanHarga,
    sleep
}

async function sleep(second){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, second*1000)
    })
=======
    getHargarata
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
}

function formatNumber(uang){
    return `${uang >= 1e21 ? Number(uang) : uang.toLocaleString("id")}`
}

function getHargarata(jumlahModal, jumlahBarang){
    return Math.round(jumlahModal/jumlahBarang)
}
<<<<<<< HEAD

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

function addHistoryPerubahanHarga(data, item_name){
    function saveHistory(data){ fs.writeFileSync(process.cwd()+"/database/logHistory.json", JSON.stringify(data, null, 4)) }
    function getHistory(){
        try{
            return JSON.parse(fs.readFileSync(process.cwd()+"/database/logHistory.json")) || {} 
        } catch (e) {
            return {}
        }
    }
    
    const history_all = getHistory()
    if(!history_all[item_name]) history_all[item_name] = []
    const history = history_all[item_name]
    if(history.length >= 25) history_all[item_name].shift()
    
    const time = moment().tz("Asia/Jakarta").format("DD-MMMM-YYYY HH:mm")
    data.waktu = time
    
    history_all[item_name].push(data)
    saveHistory(history_all)
}

async function getLogHistoryPerubahanHarga(Client, fc, item_name){
    if(item_name){
        
    } else if(!item_name || ["perak", "emas", "platinum", "diamond", "balaceCoin", "roadaCoin", "flagCoin", "timenCoin", "loyaliCoin"].includes(item_name)){
        const all_history = JSON.parse(fs.readFileSync(process.cwd()+"/database/logHistory.json"))
        const keys = Object.keys(all_history)
        let teks = "History (hanya 10 perubahan harga yang diambil!)"
        
        //looping item
        for(let data_keys of keys){
            const data_history = all_history[data_keys]
            
            teks+= "\n\n\n============================="
            teks+= "\n----- "+data_keys
            teks+= "\n============================="
            
            //loping semua history
            for(let datanya of data_history){
                teks+= "\n"
                const keyskeys = Object.keys(datanya)
                
                //looping isi tiap" history
                for(let data of keyskeys ){
                    teks+= "\n"+data+": "+datanya[data]
                }
            }
        }
        
        fs.writeFileSync("./log.txt", teks)
        Client.sendDocument(fc.from, "./log.txt", {
            caption: "ini dia file log historynya",
            reply_to_message_id: fc.msg.id
        })
    }
}
=======
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
