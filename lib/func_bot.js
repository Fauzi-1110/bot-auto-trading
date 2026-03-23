const fs = require("fs")
const moment = require("moment-timezone")
const dbSystem = require("./func_db.js")
const {
    formatNumber,
<<<<<<< HEAD
    getHargarata,
    kerjaBot
} = require("./func_other.js")
const {
    buyVolume,
    sellVolume,
    tempPerubahan
=======
    getHargarata
} = require("./func_other.js")
const {
    buyVolume,
    sellVolume
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
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
<<<<<<< HEAD
    //data utama
    const global_object = await dbSystem.getGlobal()
    const item_list = [
        {nama: "perak", nama_global: "hargaPerak"},
        {nama: "emas", nama_global: "hargaEmas"},
        {nama: "platinum", nama_global: "hargaPlatinum"},
        {nama: "diamond", nama_global: "hargaDiamond"},
        {nama: "balaceCoin", nama_global: "balaceCoin"},
        {nama: "roadaCoin", nama_global: "roadaCoin"},
        {nama: "flagCoin", nama_global: "flagCoin"},
        {nama: "timenCoin", nama_global: "timenCoin"},
        {nama: "loyaliCoin", nama_global: "loyaliCoin"},
    ]
    
    item_list.forEach((k, i) => {
        item_list[i].harga = global_object[k.nama_global]
    })
=======
    async function savedbUser(data){
        fs.writeFileSync("./database/user.json", JSON.stringify(data, null, 4))
        await dbSystem.loadDB()
    }
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
    
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
        
<<<<<<< HEAD
        //mendeteksi apakah bot udah punya item
        const bot_data = dbSystem.getUser(id)
        const haved = item_list.some((k) => bot_data[k.nama] > 0)
        
        if(haved){
            //mencari item yang dimikiki
            const item_sell_data = item_list.filter((k) => bot_data[k.nama] > 0)[0]
            
            //menjual item yang telah dimiliki
            let jumlah = bot_data[item_sell_data.nama]
            let totalHarga = Math.round(jumlah * item_sell_data.harga)
            
            if((bot_data.role == "smart" || bot_data.role === "super") && bot_data.lastHarga > item_sell_data.harga) continue
            if((bot_data.lastHarga < item_sell_data.harga || bot_data.lastHarga - item_sell_data.harga > 5) && jumlah >= 100){
                jumlah = Math.floor(jumlah * 0.65)
                totalHarga =Math.floor(jumlah * item_sell_data.harga)
            }
            
            //tambah profit ke bot
            const modal = bot_data.profit[item_sell_data.nama+"_modal"]
            const hargaRata = modal / bot_data[item_sell_data.nama]
            const totalProfit = Math.round((item_sell_data.harga - hargaRata) * jumlah)
            const updateModal = modal - Math.floor(hargaRata*jumlah)
            dbSystem.setUserKey(id, `profit.${item_sell_data.nama}_modal`, updateModal)
            dbSystem.addUserKey(id, `profit.${item_sell_data.nama}`, totalProfit)
            if(bot_data[item_sell_data.nama] - jumlah === 0) dbSystem.setUserKey(id, `profit.${item_sell_data.nama}_modal`, 0)
            
            //totsl.profit
            const totalProfitFinal = bot_data.profit.perak + bot_data.profit.emas +
                                     bot_data.profit.platinum + bot_data.profit.diamond +
                                     bot_data.profit.balaceCoin + bot_data.profit.roadaCoin +
                                     bot_data.profit.flagCoin + bot_data.profit.timenCoin +
                                     bot_data.profit.loyaliCoin
            if(totalProfitFinal > bot_data.high_profit) dbSystem.setUserKey(id, "high_profit", totalProfitFinal)
            dbSystem.setUserKey(id, "total_profit", totalProfitFinal)
                
            if(["perak", "emas", "platinum", "diamond"].includes(item_sell_data.nama)) sellVolume(item_sell_data.nama, jumlah)
            dbSystem.addUserKey(id, "uang", totalHarga)
            dbSystem.addUserKey(id, item_sell_data.nama, -jumlah)
            dbSystem.addUserKey(id, "jumlah_trading", 1)
        } else {
            if(bot_data.role === "super"){
                smartBuy(id)
                continue
            }
            
            //mengambil barang" yang sesuai dengan modal
            const item_buy_list = item_list.filter((k, i) => bot_data.uang >= k.harga)
            
            if(item_buy_list.length === 0)continue
            //buat nge random item apa yang bakal dibeli bot
            const randomBuy = Math.floor(Math.random() * item_buy_list.length)
            const item_buy_fix = item_buy_list[randomBuy]
            
            //ambil data terkait buat beli
            const jumlah = Math.floor(bot_data.uang / item_buy_fix.harga) > 150 ? Math.floor((bot_data.uang / item_buy_fix.harga) * 0.80) : Math.floor(bot_data.uang / item_buy_fix.harga)
            const totalHarga = jumlah * item_buy_fix.harga
            
            //tambah ke database modal
            dbSystem.addUserKey(id, `profit.${item_buy_fix.nama}_modal`, totalHarga)
            
            //beli item
            if(["perak", "emas", "platinum", "diamond"].includes(item_buy_fix.nama)) buyVolume(item_buy_fix.nama, jumlah)
            dbSystem.setUserKey(id, "lastHarga", item_buy_fix.harga)
            dbSystem.addUserKey(id, item_buy_fix.nama, jumlah)
            dbSystem.addUserKey(id, "uang", totalHarga*-1)
        }
        
        //membiarkan setiap bot bekerja
        kerjaBot(id)
=======
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
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
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

<<<<<<< HEAD
async function smartBuy(id){
    const global_object = await dbSystem.getGlobal()
    
    //dapetin item yang rekomended buat dibeli
    const item_list = [
        {nama: "perak", nama_global: "hargaPerak"},
        {nama: "emas", nama_global: "hargaEmas"},
        {nama: "platinum", nama_global: "hargaPlatinum"},
        {nama: "diamond", nama_global: "hargaDiamond"},
    ]
    
    item_list.forEach((k, i) => {
        item_list[i].harga = global_object[k.nama_global]
        item_list[i].volume = tempPerubahan(k.nama)
    })
    
    //cari yang akan ada kemungkinan naik dan turun dari data
    const itemBuy = []
    for(let data of item_list){
        if(data.volume >= 500) itemBuy.push({nama: data.nama, global: data.nama_global, harga: data.harga})
    }
    
    // dapetin coin recomended buat beli
    const coin_list = [
        { nama: "balaceCoin", nama_chart: "balaceChart" },
        { nama: "roadaCoin", nama_chart: "roadaChart" },
        { nama: "flagCoin", nama_chart: "flagChart" },
        { nama: "timenCoin", nama_chart: "timenChart" },
        { nama: "loyaliCoin", nama_chart: "loyaliChart" }
    ]
    
    coin_list.forEach((k, i) => {
        coin_list[i].chart = global_object[k.nama_chart]
        coin_list[i].harga = global_object[k.nama]
    })
    
    const coinBuy = []
=======
function smartBuy(id){
    const coinBuy = []
    const coinList = Object.keys(dbSystem.getGlobal()).filter((key) => key.endsWith("Coin"))
    const coinChartName = coinList.map((c) => c.replace("Coin", "Chart"))
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
    const chartPola = [
        ["0", "0", "0", "0", "0"],
        ["0", "0", "1", "0", "0"],
        ["0", "1", "0", "1", "0"],
    ]
    
<<<<<<< HEAD
    for(let data of coin_list){
        let same = false
        const chart = data.chart
        
        //nyamain chart saat ini dengan pola
        chartPola.forEach((full_pola) => {
            if(full_pola.every((pola_satuan, i) => pola_satuan === chart[i])){
                coinBuy.push({nama: data.nama, global: data.nama, harga: data.harga})
            }
        })
    }
    
    const bot_data = await dbSystem.getUser(id)
    const buyKomendedAll = [...itemBuy, ...coinBuy]
    const buyRekomended = buyKomendedAll.filter((key) => bot_data.uang > key.harga )
    
    if(buyRekomended.length > 0){
        const take_random = Math.floor(Math.random() * buyRekomended.length)
        const data = buyRekomended[take_random]
        
        const jumlah = Math.floor(bot_data.uang / data.harga)
        const total_harga = jumlah * data.harga
        
        dbSystem.addUserKey(id, `profit.${data.nama}_modal`, total_harga)
        dbSystem.addUserKey(id, data.nama, jumlah)
        dbSystem.addUserKey(id, "uang", -total_harga)
        dbSystem.setUserKey(id, "lastHarga", data.harga)
    } else {
        
=======
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
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
    }
}