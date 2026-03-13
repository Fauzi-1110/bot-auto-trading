const fs = require("fs")
const moment = require("moment-timezone")
const dbSystem = require("./func_db.js")
const {
    formatNumber,
    getHargarata
} = require("./func_other.js")
const {
    buyVolume,
    sellVolume
} = require("./func_cointem.js")

/*
const { randomBotTrading,
    updateBotName,
    addBotEffect,
    clearBotEffect 
} = require("./func_bot.js")
*/

module.exports = {
    randomBotTrading,
    updateBotName,
    addBotEffect,
    clearBotEffect
}

async function randomBotTrading(){
    async function savedbUser(data){
        fs.writeFileSync("./database/user.json", JSON.stringify(data, null, 4))
        await dbSystem.loadDB()
    }
    
    //dapetin semua user bot
    const getdb = dbSystem.getAllUser()
    const allBot = Object.entries(getdb).filter(([k, v]) => v.nama.includes("bot"))
    
    //membuat bot random mana saja yang akan imvestasi
    const botOn = []
    for(let [id, data] of allBot){
        let pickOne = Math.random() > 0.5
        if(data.role === "fast") pickOne = Math.random() > 0.3
        if(data.role == "super") pickOne = Math.random() > 0.2
        if(pickOne) botOn.push(id)
    }
    
    console.log(`\n===============\nBot On saat ini: ${botOn.join(", ")}\n===============`)
    //menjalankan tiap" bot
    for(let id of botOn){
        updateBotName(id)
        await dbSystem.createDBUser("bot", id); 
        
        const botData = dbSystem.getUser(id)
        const listItem = ["perak", "emas", "platinum", "diamond",
                          "balaceCoin", "roadaCoin", "flagCoin", "timenCoin", "loyaliCoin"]
        const listItemGlobal = ["hargaPerak", "hargaEmas", "hargaPlatinum", "hargaDiamond", ...listItem.slice(4)]
        
        //mendeteksi apakah bot udah punya item
        const haved = Object.entries(botData).filter(([key, value]) => listItem.includes(key) && value > 0)
        
        if(haved.length > 0){
            //mencari item yang dimikiki
            const itemHave = listItem.filter((k) => botData[k] > 0)
            
            //menjual item yang telah dimiliki
            const itemName = itemHave[0]
            const hSatuan = dbSystem.getGlobalKey(itemName) || dbSystem.getGlobalKey(`harga${itemName[0].toUpperCase()}${itemName.slice(1)}`)
            let jumlah = botData[itemName]
            let totalHarga = Math.round(jumlah * hSatuan)
            
            if(!hSatuan){
                continue
                console.log("BAHAYA! at randomBotTrading, hSatuan tidak ditemukan! ("+itemName+", "+`harga${itemName[0].toUpperCase()}${itemName.slice(1)}`+")")
            }
            if (dbSystem.getUserKey(id, itemName) < jumlah)continue
            if((botData.role == "smart" || botData.role === "super") && botData.lastHarga > hSatuan) continue
            if((botData.lastHarga < hSatuan || botData.lastHarga-hSatuan > 5) && jumlah >= 100){
                jumlah = Math.round(jumlah * 0.50)
                totalHarga =Math.round(jumlah * hSatuan)
            }
            
            //tambah profit ke bot
            const modal = botData.profit[itemName+"_modal"]
            const hargaRata = modal / botData[itemName]
            const totalProfit = Math.round((hSatuan - hargaRata) * jumlah)
            const updateModal = modal - (hargaRata*jumlah)
            dbSystem.setUserKey(id, `profit.${itemName}_modal`, updateModal)
            dbSystem.addUserKey(id, `profit.${itemName}`, totalProfit)
            if(botData[itemName] - jumlah === 0) dbSystem.setUserKey(id, `profit.${itemName}_modal`, 0)
            
            //totsl.profit
            const totalProfitFinal = dbSystem.getUserKey(id, "profit.perak") + 
                                dbSystem.getUserKey(id, "profit.emas") + 
                                dbSystem.getUserKey(id, "profit.platinum") + 
                                dbSystem.getUserKey(id, "profit.diamond") + 
                                dbSystem.getUserKey(id, "profit.balaceCoin") + 
                                dbSystem.getUserKey(id, "profit.roadaCoin") + 
                                dbSystem.getUserKey(id, "profit.flagCoin") + 
                                dbSystem.getUserKey(id, "profit.timenCoin") + 
                                dbSystem.getUserKey(id, "profit.loyaliCoin") 
            if(totalProfitFinal > dbSystem.getUserKey(id, "high_profit")) dbSystem.setUserKey(id, "high_profit", totalProfitFinal)
            dbSystem.setUserKey(id, "total_profit", totalProfitFinal)
                
            if(["perak", "emas", "platinum", "diamond"].includes(itemName)) sellVolume(itemName, jumlah)
            dbSystem.addUserKey(id, "uang", totalHarga)
            dbSystem.addUserKey(id, itemName, -jumlah)
            dbSystem.addUserKey(id, "jumlah_trading", 1)
        } else {
            if(dbSystem.getUserKey(id, "role") === "super"){
                smartBuy(id)
                continue
            }
            //buat nge random item apa yang bakal dibeli bot
            const randomBuy = Math.floor(Math.random() * listItem.length)
            const itemName = listItem[randomBuy]
            const itemGlobal = listItemGlobal[randomBuy]
            
            //ambil data terkait buat beli
            const hSatu = dbSystem.getGlobalKey(itemGlobal) || 1
            const jumlah = Math.floor((dbSystem.getUserKey(id, "uang") / hSatu) * 0.80)
            const totalHarga = jumlah*hSatu
            
            //scope kecil bug
            if(botData.uang < totalHarga){
                continue; console.log("bot dgn id: "+id+" gagal melakukan transaksi!")
            }
            
            //tambah ke database modal
            dbSystem.addUserKey(id, `profit.${itemName}_modal`, totalHarga)
            
            //beli item
            if(["perak", "emas", "platinum", "diamond"].includes(itemName)) buyVolume(itemName, jumlah)
            dbSystem.setUserKey(id, "lastHarga", hSatu)
            dbSystem.addUserKey(id, itemName, jumlah)
            dbSystem.addUserKey(id, "uang", totalHarga*-1)
        }
    }
    console.log(`diakhiri bot id: ${botOn[botOn.length-1]} waktu: ${moment().tz("Asia/Jakarta").format("HH:mm:ss")}`)
}

function updateBotName(id){
    const botRole = dbSystem.getUserKey(id, "role")
    
    //⚡️, ⭐️, ✨, 
    if(botRole === "fast") dbSystem.setUserKey(id, "nama", "⚡ bot-"+dbSystem.getUserKey(id, "id"))
    else if(botRole === "smart") dbSystem.setUserKey(id, "nama", "⭐ bot-"+dbSystem.getUserKey(id, "id"))
    else if(botRole === "super") dbSystem.setUserKey(id, "nama", "✨ bot-"+dbSystem.getUserKey(id, "id"))
    else if(botRole === "normal") dbSystem.setUserKey(id, "nama", "bot-"+dbSystem.getUserKey(id, "id"))
    
    if(dbSystem.getGlobalKey("last_season_top").includes(dbSystem.getUserKey(id, "id"))) dbSystem.setUserKey(id, "nama", "👑 bot-"+dbSystem.getUserKey(id, "id"))
}

async function addBotEffect(type, max){
    const time = moment().tz("Asia/Jakarta").format("HH:mm:ss")
    console.log(`Memperbarui ${type}! (${time})`)
    
    // dapetin semua bot yang ada & filter
    const allBot = Object.values(dbSystem.getAllUser()).filter((k) => k.nama.includes("bot-") && (k.role === "normal" || k.role === type))
    const countBotHas = allBot.filter((k) => k.role == type)
    const sudah = []
    
    //deteksi kalau bot udah lebih
    if(countBotHas.length >= max)return `bot dengan role ${type} telah mencapai maximum!`
    if(countBotHas.length > 0) max -= countBotHas.length
    
    let botId, takeRandomBot
    for(let i = 0; i < max; i++){
        takeRandomBot = Math.floor(Math.random() * allBot.length)
        botId = allBot[takeRandomBot].id
        
        while(sudah.includes(botId)){
            if(type !== "super") break
            else {
                takeRandomBot = Math.floor(Math.random() * allBot.length)
                botId = allBot[takeRandomBot].id
            }
        }
        if(sudah.includes(botId)) continue
        sudah.push(botId)
        dbSystem.setUserKey(botId, "role", type)
    }
    
    console.log(`${sudah.length} telah menjadi ${type}, yaitu: ${sudah}`.magenta)
    return `Berhasil menambahkan ${sudah.length} bot ke dalam role ${type} (${sudah}) `
}

function clearBotEffect(type){
    function clearEffect(d){
        const allBotSmart = Object.values(dbSystem.getAllUser()).filter((k) => k.role == d)
        allBotSmart.forEach((k) => dbSystem.setUserKey(k.id, "role", "normal"))
        console.log(`Selesai membersihkan user ${d} (${allBotSmart})`.magenta)
    }
    
    if(type == "smart") clearEffect("smart")
    else if(type == "fast") clearEffect("fast")
    else if(type == "super")clearEffect("super")
    else { clearEffect("fast"); clearEffect("smart") }
}

function smartBuy(id){
    const coinBuy = []
    const coinList = Object.keys(dbSystem.getGlobal()).filter((key) => key.endsWith("Coin"))
    const coinChartName = coinList.map((c) => c.replace("Coin", "Chart"))
    const chartPola = [
        ["0", "0", "0", "0", "0"],
        ["0", "0", "1", "0", "0"],
        ["0", "1", "0", "1", "0"],
    ]
    
    let i = 0
    for(let cc of coinChartName){
        const coinChart = dbSystem.getGlobalKey(cc)
        
        chartPola.forEach((k, i) => {
            const coinCek = coinChart.every((t, index) => t === k[index])
            if(coinCek) coinBuy.push(cc)
        })
    }
    
    if(coinBuy.length > 0){
        const dibeli = coinBuy[0].replace("Chart", "Coin")
        
        const hSatu = dbSystem.getGlobalKey(dibeli)
        const jumlah = Math.floor(dbSystem.getUserKey(id, "uang") / hSatu)
        const totalHarga = jumlah*hSatu
        
        dbSystem.addUserKey(id, `profit.${dibeli}_modal`, totalHarga)
        dbSystem.setUserKey(id, "lastHarga", hSatu)
        dbSystem.addUserKey(id, dibeli, jumlah)
        dbSystem.addUserKey(id, "uang", -totalHarga)
    } else {
        const dibeli = coinList[Math.floor(Math.random()*coinList.length)]
        
        const hSatu = dbSystem.getGlobalKey(dibeli)
        const jumlah = Math.floor(dbSystem.getUserKey(id, "uang") / hSatu)
        const totalHarga = jumlah*hSatu
        
        dbSystem.addUserKey(id, `profit.${dibeli}_modal`, totalHarga)
        dbSystem.setUserKey(id, "lastHarga", hSatu)
        dbSystem.addUserKey(id, dibeli, jumlah)
        dbSystem.addUserKey(id, "uang", -totalHarga)
    }
}