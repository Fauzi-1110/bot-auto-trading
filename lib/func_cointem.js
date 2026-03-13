const dbSystem = require("./func_db.js")
const moment_tz = require("moment-timezone")

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

function noww(){
    return moment_tz().tz("Asia/Jakarta").format("mm")
}

let lastGenap, lastGanjil
function buyVolume(item_name, jumlah){
    const now = Number(noww())
    const history = dbSystem.getGlobalKey(item_name+"_volume")
    
    /*
    contoh: [[tempat veli], [tempat jyal]]
    dalem: [genap, ganjil]
    */
    if(now % 2 === 0){
        if(lastGenap !== now) history[0][0] = 0
        lastGenap = now
        history[0][0] += jumlah
    } else {
        if(lastGanjil !== now) history[0][1] = 0
        lastGanjil = now
        history[0][1] += jumlah
    }
    
    dbSystem.setGlobalKey(item_name+"_volume", history)
}

function sellVolume(item_name, jumlah){
    const now = Number(noww())
    const history = dbSystem.getGlobalKey(item_name+"_volume")
    
    /*
    contoh: [[tempat veli], [tempat jyal]]
    dalem: [genap, ganjil]
    */
    if(now % 2 === 0){
        if(lastGenap !== now) history[1][0] = 0
        lastGenap = now
        history[1][0] += jumlah
    } else {
        if(lastGanjil !== now) history[1][1] = 0
        lastGanjil = now
        history[1][1] += jumlah
    }
    dbSystem.setGlobalKey(item_name+"_volume", history)
}

function tempPerubahan(item_name){
    let Gitem = item_name
    const now = Number(noww())
    const getHistory = dbSystem.getGlobalKey(Gitem+"_volume")
    let pengaruh
    if(now % 2 === 0) pengaruh = getHistory[0][1] - getHistory[1][1]
    else pengaruh = getHistory[0][0] - getHistory[1][0]
    return pengaruh
}

function randItem(){
    function gantiHarga(Gitem, min, max){
        const nowPrice = dbSystem.getGlobalKey(Gitem)
        const scope = max-min
        let hargaRange = nowPrice - min
        const persen = hargaRange/scope
        const persenNum = persen*100
        
        // menganalisis dari volume
        const now = noww()
        const getHistory = dbSystem.getGlobalKey(`${Gitem.split("harga")[1].toLowerCase()}_volume`)
        let pengaruh
        if(now % 2 === 0) pengaruh = getHistory[0][0] - getHistory[1][0]
        else pengaruh = getHistory[0][1] - getHistory[1][1]
        
        
        if(hargaRange < 0) hargaRange = Math.abs(hargaRange)
        let persenAdd, nambah
        if(persenNum < 15 || persenNum > 88) {
            persenAdd = Math.round(Math.random() * 10) + 10
            nambah = Math.round(nowPrice*(persenAdd/100))
            if(persenNum > 88) nambah *= -1
        } else if(pengaruh >= 500 || pengaruh <= -500){
            persenAdd = Math.round(Math.random() * 12) + 5
            nambah = Math.round(nowPrice*(persenAdd/100))
            if(pengaruh <= -500) nambah *= -1
        } else {
            const ntr = Math.random() > 0.5
            persenAdd = Math.round(Math.random() * 8) + 2
            nambah = Math.round(nowPrice*(persenAdd/100))
            if(!ntr) nambah *= -1
        }
        
        dbSystem.addGlobalKey(Gitem, Math.round(nambah))
        if(nowPrice+nambah <= 0)dbSystem.setGlobalKey(Gitem, 20)
    }
    
    const itemList = [
        { Gitem: "hargaPerak", min: 20, max: 120},
        { Gitem: "hargaEmas", min: 150, max: 230},
        { Gitem: "hargaPlatinum", min: 400, max: 1000},
        { Gitem: "hargaDiamond", min: 1000, max: 2000},
    ]
    
    itemList.forEach((k) => gantiHarga(k.Gitem, k.min, k.max))
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