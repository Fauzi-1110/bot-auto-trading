const parser = require("uzi_telegram-parser")
const fs = require("fs")
const c = require("chalk")
const os = require("os")
const process = require("process")
const path = require("path")
const dbSystem = require("../lib/func_db.js")
const {
    formatNumber,
    getHargarata
} = require("../lib/func_other.js")
const { randomBotTrading,
    updateBotName,
    addBotEffect,
    clearBotEffect 
} = require("../lib/func_bot.js")
const { tempPerubahan } = require("../lib/func_cointem.js")

module.exports = async (Client, m) => {
try{
    if(Math.floor(Date.now()/1000) - m.date > 60 ){
        console.log(c.red(`\nPesan lampau diabaikan!Detail:\nPengirim: ${m.from.first_name} || ${m.from.id}\nPesan: ${m.text || m.caption || "tanpa pesan"}`))
        return
    }
    
    
    await dbSystem.createDBUser("user", m)
    const fc = await parser.mParsing(Client, m)
    if(fc.chatType !== "private" && fc.message.text.startsWith("/"))return parser.reply(Client, m, "Bot hanya bisa digunkanan pada private chat!")
    const args = fc.message.text.split(" ")
                 .slice(1)
    const text = args.join(" ")
    const command = fc.message.text.split(" ")[0].slice(1).toLowerCase()
    
    switch(command){
        case "menu": {
            function getTime(t){
                t = parseInt(t)
                let sisa, hari, jam, menit, detik
                hari = parseInt(t / (1*24*60*60))
                sisa = t % (1*24*60*60)
                jam = Math.floor(sisa / (1*60*60))
                sisa = sisa % (1*60*60)
                menit = Math.floor(sisa / (1*60))
                detik = sisa % 60
                        
                return `${hari > 0? hari+" hari ":""}${jam > 0? jam+" jam ":""}${menit > 0? menit+" menit ":""} ${detik > 0? detik+" detik":""}`
            }
            //dapetin info panel dan vps
            const [vpsUptime, nodeUptime] = [os.uptime(), process.uptime()]
            
            let teks = "===================="
                teks+= "\nvps uptime: " + getTime(vpsUptime)
                teks+= "\nserver uptime: " + getTime(nodeUptime)
                teks+= "\n===================="
                teks+= "\n---menu:"
                teks+= "\n• /ping"
                teks+= "\n• /money"
                teks+= "\n• /tradingitem"
                teks+= "\n• /tradingcoin"
                teks+= "\n• /leaderboard"
                teks+= "\n===================="
                
            Client.sendMessage(m.from.id, teks, {
                reply_to_message_id: m.message_id,
                entities: [
                    {
                        offset: 0,
                        length: teks.length,
                        type: "pre"
                    }
                ]
            })
        } break
        
        case "ping": {
            parser.reply(Client, m, "Pong!\nBot masih on!")
        } break
        
        case "cekbot": {
            if(!args[0])return parser.reply(Client, m, "Masukan id bot yang akan di cek!")
            
            const botId = Number(args[0])
            
            try{
                const botDB = dbSystem.getUser(botId)
                
                parser.reply(Client, m, "Ini dia isi database dari "+ botId+":\n"+JSON.stringify(botDB, null, 4))
            } catch(e){
                parser.reply(Client, m, "Bot tidak ada di dalam database!")
            }
        } break
        
        case "addbot": {
            if(!text)return parser.reply(Client, m, "Masukan jumlah bot yang akan ditambah!")
            
            const jumlah = Number(args[0])
            for(let i = 0; i < jumlah; i++){
                dbSystem.createDBUser("bot")
            }
            
            parser.reply(Client, m, "Berhasil membuat bot baru sebanyak "+jumlah)
        } break
        
        
        case "addbotsmart": {
            clearBotEffect("smart")
            const respon = await addBotEffect("smart", 5+dbSystem.getGlobalKey("season"))
            parser.reply(Client, m, respon)
        } break
        case "addbotfast": {
             clearBotEffect("fast")
            const respon = await addBotEffect("fast", 8)
            parser.reply(Client, m, respon)
        } break
        
        
        case "botreset": {
            if(args.length < 2)return
            
            const [key, value, type] = args
            const allDB = dbSystem.getAllUser()
            const keyDB = Object.keys(allDB)
            let berhasil = 0
            let gagal = 0
            
            for(let id of keyDB){
                if(!allDB[id].nama.includes("bot")) continue
                try{
                    if(type === "string") dbSystem.setUserKey(id, key, value)
                    else if(type === "int") dbSystem.setUserKey(id, key, Number(value))
                    else if(type === "add") dbSystem.addUserKey(id, key, Number(value))
                    else if(type === "delete") dbSystem.deleteUserKey(id, key)
                    berhasil+= 1
                } catch {
                    gagal += 1
                    continue
                }
            }
            
            Client.sendMessage(m.from.id, `Berhasil memproses reset ${key} menjadi ${value} pada semua bot.\nberhasil di reset: ${berhasil}\ngagal di reset: ${gagal}`)
        } break 
        
        
        case "tradingitem": {
            const getPrice = await dbSystem.getGlobal()
            try {
                var getUser = dbSystem.getUser(fc.user.id)
            } catch {
                await dbSystem.createDBUser("user", m)
                var getUser = dbSystem.getUser(fc.user.id)
            }
            
            let teks = "===================="
                teks+= "\nperak: " + formatNumber(getPrice.hargaPerak) + ` (${tempPerubahan("perak")})`
                teks+= "\nemas: " + formatNumber(getPrice.hargaEmas) + ` (${tempPerubahan("emas")})`
                teks+= "\nplatinum: " + formatNumber(getPrice.hargaPlatinum) + ` (${tempPerubahan("platinum")})`
                teks+= "\ndiamond: " + formatNumber(getPrice.hargaDiamond) + ` (${tempPerubahan("diamond")})`
                teks+= "\n===== dimiliki ========"
                teks+= "\nperak: " + formatNumber(getUser.perak)
                teks+= "\nemas: " + formatNumber(getUser.emas)
                teks+= "\nplatinum: " + formatNumber(getUser.platinum)
                teks+= "\ndiamond: " + formatNumber(getUser.diamond)
                teks+= "\n===================="
                
            Client.sendMessage(fc.from, teks, {
                reply_to_message_id: fc.message.id,
                reply_markup: {
                    inline_keyboard: [
                        [{text: "beli", callback_data: "buyitem"}, {text: "jual", callback_data: "sellitem"}],
                        [{text: "cancel", callback_data: "cancel"}]
                    ]
                },
                entities: [
                    {
                        offset: 0,
                        length: teks.length,
                        type: "pre"
                    }
                ]
            })
        } break
        
        case "tradingcoin": {
            const { balaceCoin, balaceChart,
                    roadaCoin, roadaChart,
                    flagCoin, flagChart,
                    timenCoin, timenChart,
                    loyaliCoin, loyaliChart
            } = dbSystem.getGlobal()
                  
            const { 
                balaceCoin: balace, roadaCoin: roada, flagCoin: flag, timenCoin: timen, loyaliCoin: loyali
            } = dbSystem.getUser(m.from.id)
            
            //📉📈
            let teks = "==============================="
                teks+= "\nbalaceCoin: "+formatNumber(balaceCoin)
                teks+= "\nroadaCoin : "+formatNumber(roadaCoin)
                teks+= "\nflagCoin  : "+formatNumber(flagCoin)
                teks+= "\ntimenCoin : "+formatNumber(timenCoin)
                teks+= "\nloyaliCoin: "+formatNumber(loyaliCoin)
                teks+= "\n\n============ chart ============"
                teks+= `\nbalaceCoin: [${balaceChart.join(", ").replace(/1/g, "📈").replace(/0/g, "📉")}]`
                teks+= `\nroadaCoin : [${roadaChart.join(", ").replace(/1/g, "📈").replace(/0/g, "📉")}]`
                teks+= `\nflagCoin  : [${flagChart.join(", ").replace(/1/g, "📈").replace(/0/g, "📉")}]`
                teks+= `\ntimenCoin : [${timenChart.join(", ").replace(/1/g, "📈").replace(/0/g, "📉")}]`
                teks+= `\nloyaliCoin: [${loyaliChart.join(", ").replace(/1/g, "📈").replace(/0/g, "📉")}]`
                teks+= "\n\n=========== dimiliki ==========="
                teks+= "\nbalaceCoin: "+formatNumber(balace)
                teks+= "\nroadaCoin : "+formatNumber(roada)
                teks+= "\nflagCoin  : "+formatNumber(flag)
                teks+= "\ntimenCoin : "+formatNumber(timen)
                teks+= "\nloyaliCoin: "+formatNumber(loyali)
                
            Client.sendMessage(fc.from, teks, {
                reply_to_message_id: fc.message.id,
                reply_markup: {
                    inline_keyboard: [
                        [{text: "beli", callback_data: "buycoin"}, {text: "jual", callback_data: "sellcoin"}],
                        [{text: "cancel", callback_data: "cancel"}]
                    ]
                },
                entities: [
                    {
                        offset: 0,
                        length: teks.length,
                        type: "pre"
                    }
                ]
            })
        } break
        
        case "lb":
        case "leaderboard": {
            if(Date.now() - dbSystem.getGlobalKey("last_season") < 1*24*60*60*1000){
                Client.sendMessage(fc.from, "Leaderboard akan tersedia setelah 1 hari dari season")
                return
            }
            
            Client.sendMessage(fc.from, "Pilih menu leaderboard", {
                reply_to_message_id: fc.message.id,
                reply_markup: {
                    inline_keyboard: [
                        [{text: "sultan", callback_data: "leaderboard sultan"}],
                        [{text: "top trader", callback_data: "leaderboard trader"}],
                        [{text: "points", callback_data: "leaderboard points"}],
                        [{text: "profit (daily)", callback_data: "leaderboard profit_daily"}],
                        [{text: "profit high", callback_data: "leaderboard profit_high"}],
                        [{text: "pekerjaan", callback_data: "leaderboard pekerjaan"}],
                        [{text: "cancel", callback_data: "cancel"}],
                    ]
                }
            })
        } break
        
        case "uang":
        case "money": {
            Client.sendMessage(fc.from, `Uangmu: \n=> ${formatNumber(dbSystem.getUserKey(fc.from, "uang"))}`, {reply_to_message_id: fc.message.id})
        } break
        
        case "total-trading": {
            Client.sendMessage(fc.from, `total trading mu: ${formatNumber(dbSystem.getUserKey(fc.from, "jumlah_trading"))}`, {reply_to_message_id: fc.message.id})
        } break
        
        case "season-new": {
            const allUser = dbSystem.getAllUser()
            const keyUser = Object.keys(allUser)
            let points
            
            //ngambil urutan top sultan
            let urutan = Object.values(allUser).sort((a, b) => {
                const totalA = a.uang +
                               (dbSystem.getGlobalKey("hargaPerak") * a.perak)+
                               (dbSystem.getGlobalKey("hargaEmas") * a.emas)+
                               (dbSystem.getGlobalKey("hargaPlatinum") * a.platinum)+
                               (dbSystem.getGlobalKey("hargaDiamond") * a.diamond)+
                               (dbSystem.getGlobalKey("balaceCoin") * a.balaceCoin)+
                               (dbSystem.getGlobalKey("roadaCoin") * a.roadaCoin)+
                               (dbSystem.getGlobalKey("flagCoin") * a.flagCoin)+
                               (dbSystem.getGlobalKey("timenCoin") * a.timenCoin)+
                               (dbSystem.getGlobalKey("loyaliCoin") * a.loyaliCoin)
                               
                const totalb = b.uang +
                               (dbSystem.getGlobalKey("hargaPerak") * b.perak)+
                               (dbSystem.getGlobalKey("hargaEmas") * b.emas)+
                               (dbSystem.getGlobalKey("hargaPlatinum") * b.platinum)+
                               (dbSystem.getGlobalKey("hargaDiamond") * b.diamond)+
                               (dbSystem.getGlobalKey("balaceCoin") * b.balaceCoin)+
                               (dbSystem.getGlobalKey("roadaCoin") * b.roadaCoin)+
                               (dbSystem.getGlobalKey("flagCoin") * b.flagCoin)+
                               (dbSystem.getGlobalKey("timenCoin") * b.timenCoin)+
                               (dbSystem.getGlobalKey("loyaliCoin") * b.loyaliCoin)
                               
                return totalb - totalA
            })
            points = 3
            urutan = urutan.slice(0, 3)
            const a  = []
            urutan.forEach((k) => {
                a.push(k.id)
                dbSystem.addUserKey(k.id, "top_kaya", 1)
                dbSystem.addUserKey(k.id, "points", points)
                points -= 1
            })
            dbSystem.setGlobalKey("last_season_top", a)
            
            // ngambil urutan top trading
            points = 3
            const getTopTrading = Object.values(allUser).sort((a, b) => b.jumlah_trading - a.jumlah_trading).slice(0, 3)
            for(let k of getTopTrading ){
                dbSystem.addUserKey(k.id, "top_artis", 1)
                dbSystem.addUserKey(k.id, "points", points)
                points -= 1
            }
            
            //ambil 3 user super dan buat baru
             clearBotEffect("super")
            await addBotEffect("super", 3)
            
            
            //reset dta user
            const listReset = await dbSystem.getGlobalKey("item_reset_season")
            for(let id of keyUser){
                const user = allUser[id]
                
                dbSystem.setUserKey(id, "uang", 500)
                listReset.forEach((k) => {
                    dbSystem.setUserKey(id, k, 0)
                })
            }
            
            dbSystem.setGlobalKey("last_season", Date.now())
            dbSystem.addGlobalKey("season", 1)
            parser.reply(Client, m, "Berhasil membuat season baru ("+dbSystem.getGlobalKey("season")+")!")
        } break
        
        case "backup": {
            await Client.sendDocument(fc.from, path.join(process.cwd(), "database", "user.json"), {
                caption: "Berikut adalah backup user.json",
                reply_to_message_id: m.message_id
            })
            
            await Client.sendDocument(fc.from, path.join(process.cwd(), "database", "global.json"), {
                caption: "Berikut adalah backup global.json",
                reply_to_message_id: m.message_id
            })
        } break
    }
} catch(e){
    console.log(c.red(e.stack))
}
}
