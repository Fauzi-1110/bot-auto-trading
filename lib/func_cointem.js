const dbSystem = require("./func_db.js")
const moment_tz = require("moment-timezone")
const {
    addHistoryPerubahanHarga
} = require("./func_other.js")

/*
const { randItem,
    randCoin
} = require("./func_cointem")
*/
module.exports = {
    randItem,
    randCoin,
    buyVolume,
    sellVolume,
    tempPerubahan
}


let lastGenapBuy, lastGanjilBuy, lastGenapSell, lastGanjilSell
function buyVolume(item_name, jumlah){
    const now = Math.floor(Date.now() / 60000)
    
    if(now % 2 === 0){
        if(lastGenapBuy !== now) dbSystem.setGlobalKey(`${item_name}_volume.beli_genap`, 0)
        lastGenapBuy = now
        
        dbSystem.addGlobalKey(`${item_name}_volume.beli_genap`, jumlah)
    } else {
        if(lastGanjilBuy !== now) dbSystem.setGlobalKey(`${item_name}_volume.beli_ganjil`, 0)
        lastGanjilBuy = now
        
        dbSystem.addGlobalKey(`${item_name}_volume.beli_ganjil`, jumlah)
    }
}

function sellVolume(item_name, jumlah){
    const now = Math.floor(Date.now() / 60000)
    
    if(now % 2 === 0){
        if(lastGenapSell !== now) dbSystem.setGlobalKey(`${item_name}_volume.jual_genap`, 0)
        lastGenapSell = now
        
        dbSystem.addGlobalKey(`${item_name}_volume.jual_genap`, jumlah)
    } else {
        if(lastGanjilSell !== now) dbSystem.setGlobalKey(`${item_name}_volume.jual_ganjil`, 0)
        lastGanjilSell = now
        
        dbSystem.addGlobalKey(`${item_name}_volume.jual_ganjil`, jumlah)
    }
}

function tempPerubahan(nama){
    const now = Math.floor(Date.now()/60000)
    let volume_beli, volume_jual, pengaruh
    if(now % 2 === 0){
        volume_beli =  dbSystem.getGlobalKey(`${nama}_volume.beli_ganjil`)
        volume_jual = dbSystem.getGlobalKey(`${nama}_volume.jual_ganjil`)
    } else {
        volume_beli =  dbSystem.getGlobalKey(`${nama}_volume.beli_genap`)
        volume_jual =  dbSystem.getGlobalKey(`${nama}_volume.jual_genap`)
    }
    pengaruh = Math.floor((volume_beli - volume_jual) * 0.5)
        
    return pengaruh
}

 function randItem(){
    async function gantiHarga(nama, Gitem, min, max){
        /*
        min = 20 
        max = 40
        now = 34
        
        scope = 40 - 20 = 20
        harga range = 34 - 20 = 14
        persen = 14 / 20 = 0,7
        persenNum = 0,7 * 100 = 70
        
        */
        const nowPrice = dbSystem.getGlobalKey(Gitem)
        const scope = max-min
        let hargaRange = nowPrice - min
        const persen = hargaRange/scope
        const persenNum = persen*100
        
        //dapetin berbagai opsi untuk perubahan hargga
        let effect_posisi_1, effect_posisi_2, effect_volume, effect_random
        effect_posisi_2 = 0
        
        
        //dari posisi dekat dengan min/max
        if(persenNum <= 15) effect_posisi_1 = Math.ceil(Math.random() * 3 ) + 2
        else if(persenNum >= 90) effect_posisi_1 = -(Math.ceil(Math.random() * 3 ) + 2)
        else effect_posisi_1 = 0
        
        //dari volume 
        const now = Math.floor(Date.now()/60000)
        let volume_beli, volume_jual, pengaruh
        if(now % 2 === 0){
            volume_beli = await dbSystem.getGlobalKey(`${nama}_volume.beli_genap`)
            volume_jual = await dbSystem.getGlobalKey(`${nama}_volume.jual_genap`)
        } else {
            volume_beli = await dbSystem.getGlobalKey(`${nama}_volume.beli_ganjil`)
            volume_jual = await dbSystem.getGlobalKey(`${nama}_volume.jual_ganjil`)
        }
        pengaruh = Math.floor((volume_beli - volume_jual) * 0.5)
        if(pengaruh >= 500) effect_volume = Math.floor(Math.random() * 3) + 5
        else if(pengaruh <= -500) effect_volume = -(Math.floor(Math.random() * 3) + 5)
        else {
            effect_volume = Math.round(Math.random() * (Math.abs(pengaruh) * 0.01))
            if(pengaruh <= -500) effect_volume *= -1
        }
        
        //dari random
        const naik = Math.random() > 0.5
        effect_random = Math.round(Math.random() * 3)
        if(!naik) effect_random *= -1
        
        const total_effect = effect_posisi_1 + effect_posisi_2 + effect_volume + effect_random
        let tarif_perubahan = Math.floor(nowPrice * (Math.abs(total_effect) / 100))
        if(total_effect < 0) tarif_perubahan *= -1
        
        if(nowPrice + tarif_perubahan <= 0) dbSystem.setGlobalKey(Gitem, min)
        else dbSystem.addGlobalKey(Gitem, tarif_perubahan)
        
        const sendToHistory = {
            harga_saat_ini: nowPrice,
            harga_terbaru: dbSystem.getGlobalKey(Gitem),
            effect_posisi_1: effect_posisi_1,
            effect_posisi_2: effect_posisi_2,
            effect_volume: effect_volume,
            effect_random: effect_random,
            total_effect: total_effect,
            tarif_perubahan: tarif_perubahan
        }
        addHistoryPerubahanHarga(sendToHistory, nama)
    }
    
    const itemList = [
        { nama: "perak", Gitem: "hargaPerak", min: 120, max: 300},
        { nama: "emas", Gitem: "hargaEmas", min: 450, max: 800},
        { nama: "platinum", Gitem: "hargaPlatinum", min: 1200, max: 2600},
        { nama: "diamond", Gitem: "hargaDiamond", min: 3000, max: 5000},
    ]
    
    itemList.forEach((k) => gantiHarga(k.nama, k.Gitem, k.min, k.max))
}

function randCoin(){
    function updateChart(chartBaru, chartName){
        const chartLama = dbSystem.getGlobalKey(chartName) || []
        if(chartLama.length < 5) chartLama.push(chartBaru)
        else {
            chartLama.shift()
            chartLama.push(chartBaru)
        }
        dbSystem.setGlobalKey(chartName, chartLama)
    }
    
    function updatePrice(coin, max, min, status){
        const lama = dbSystem.getGlobalKey(coin)
        const chart = coin.replace("Coin", "Chart")
        
        //random berapa persennbakaln diambil
        const rand = (Math.random() * (max-min)) +min
        const persen = Math.round(lama * (rand/100))
        
        if(status == "naik")dbSystem.addGlobalKey(coin, persen)
        else if(status == "random"){
            const abc = Math.random() > 0.4
            if(abc) dbSystem.addGlobalKey(coin, persen)
            else dbSystem.addGlobalKey(coin, -persen)
        }
        else dbSystem.addGlobalKey(coin, -persen)
        if(dbSystem.getGlobalKey(coin) <= 0) dbSystem.setGlobalKey(coin, 10)
        
        let intruksi
        const baru = dbSystem.getGlobalKey(coin)
        if(baru > lama) intruksi = "1"
        else intruksi = "0"
        
        updateChart(intruksi, chart)
    }
    
    const coinList = Object.keys(dbSystem.getGlobal()).filter((key) => key.endsWith("Coin"))
    const coinChart = coinList.map((c) => c.replace("Coin", "Chart"))
    
    const chartPola = [
        { //pola 1
            pola: ["1", "1", "0", "1", "1"],
            max: 20, min: 15, kondisi: "turun",
            min2: 10, max2: 12
        },
        { // pola 2
            pola: ["1", "1", "1", "1", "1"],
            max: 28, min: 12, kondisi: "turun",
            min2: 7, max2:10
        },
        { // pola 3
            pola: ["0", "0", "0", "0", "0"],
            max: 45, min: 20, kondisi: "naik",
            min2: 15, max2:20
        },
        { // pola 4
            pola: ["0", "0", "1", "0", "0"],
            max: 30, min: 10, kondisi: "naik",
            min2: 12, max2:15
        },
        { //pola 5
            pola: ["1", "0", "1", "0", "0"],
            max: 20, min: 5, kondisi: "random",
            min2: 5, max2:8
        },
        {
            pola: ["1", "0", "1", "0", "1"],
            max: 12, min: 8, kondisi: "turun",
            min2: 6, max2:8
        },
        {
            pola: ["0", "1", "0", "1", "0"],
            max: 15, min: 10, kondisi: "naik",
            min2: 7, max2:10
        },
    ]
    
    coinList.forEach((coin, i) => {
        if(dbSystem.getGlobalKey(coin) <= 0) dbSystem.setGlobalKey(coin, 10)
        const coinPriceNow = dbSystem.getGlobalKey(coin)
        const chart = dbSystem.getGlobalKey(coinChart[i])
        let cocok = false
        
        for(let data of chartPola){
            if(chart.every((k, i) => k === data.pola[i])){
                const tpakai = Math.random() < 0.3
                if(tpakai) break
                
                coinPriceNow > 1000 ? updatePrice(coin, data.max2, data.min2, data.kondisi) : updatePrice(coin, data.max, data.min, data.kondisi)
                
                cocok = true
                break
            } 
        }
        
        if(!cocok) coinPriceNow > 1000 ? updatePrice(coin, 4, 2, "random") : updatePrice(coin, 10, 2, "random") 
    })
}