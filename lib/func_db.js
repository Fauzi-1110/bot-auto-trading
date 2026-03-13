const fs = require("fs")

class dbSystem {
    static dbUser = JSON.parse(fs.readFileSync("./database/user.json"))
    static dbGlobal = JSON.parse(fs.readFileSync("./database/global.json"))
    
    static loadDB(){
        dbSystem.dbUser = JSON.parse(fs.readFileSync("./database/user.json"))
        dbSystem.dbGlobal = JSON.parse(fs.readFileSync("./database/global.json"))
    }
    
    static getAllUser(){
        return dbSystem.dbUser
    }
    
    static getUser(id){
        if(!dbSystem.dbUser[id]) throw new Error("Database user tidak ditemukan!")
        else return dbSystem.dbUser[id]
    }
    
    static getUserKey(id, key){
        const keys = key.split(".")
        let objTemp = dbSystem.dbUser[id]
        
        for(let i = 0; i < keys.length; i++){
            objTemp = objTemp[keys[i]]
        }
            
        return objTemp
    }
    
    static addUserKey(id, key, value){
        const keys = key.split(".")
        let obj = dbSystem.dbUser[id]
        
        for(let i = 0; i < keys.length-1; i++){
            obj = obj[keys[i]]
        }
        
        obj[keys[keys.length-1]] = (obj[keys[keys.length-1]] || 0) + value
        fs.writeFileSync("./database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
    }
    
    static setUserKey(id, key, value){
        const keys = key.split(".")
        let obj = dbSystem.dbUser[id]
        
        for(let i = 0; i < keys.length-1; i++){
            obj = obj[keys[i]]
        }
        
        obj[keys[keys.length-1]] = value
        fs.writeFileSync("./database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
    }
    
    static deleteUserKey(id, key){
        const keys = key.split(".")
        let obj = dbSystem.dbUser[id]
        
        for(let i = 0; i < keys.length-1; i++){
            obj = obj[keys[i]]
        }
        
        delete obj[keys[keys.length-1]]
        fs.writeFileSync("./database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
    }
    
    static getGlobal(){
        return dbSystem.dbGlobal
    }
    
    static getGlobalKey(key){
        return dbSystem.dbGlobal[key]
    }
    
    static addGlobalKey(key, value){
        dbSystem.dbGlobal[key] += Number(value)
        fs.writeFileSync("./database/global.json", JSON.stringify(dbSystem.dbGlobal, null, 4))
    }
    
    static setGlobalKey(key, value){
        dbSystem.dbGlobal[key] = value
        fs.writeFileSync("./database/global.json", JSON.stringify(dbSystem.dbGlobal, null, 4))
    }
    
    //buat db
    static async createDBUser(type, data){
        const readDB = dbSystem.getAllUser()
        let nama, id, idObj
    
        if(type == "bot"){
            let toKey = Object.keys(readDB)
                        .map((k) => {
                            if(!dbSystem.getUserKey(k, "nama").includes("bot"))return
                            else return k
                        })
            nama = "bot-"+(toKey.length+1)
            id = data || toKey.length+1
        } else {
            nama = data.from.username || data.from.first_name || "undefined name"
            id = data.from.id
        }
    
        const def = {
            nama: nama,
            id: id,
            role: "normal",
            points: 0,
            profit: {
                perak: 0,
                perak_modal:0,
                emas: 0,
                emas_modal:0,
                platinum: 0,
                platinum_modal:0,
                diamond: 0,
                diamond_modal:0,
                balaceCoin: 0,
                balaceCoin_modal:0,
                roadaCoin: 0,
                roadaCoin_modal:0,
                flagCoin: 0,
                flagCoin_modal:0,
                timenCoin: 0,
                timenCoin_modal:0,
                loyaliCoin: 0,
                loyaliCoin_modal:0
            },
            total_profit: 0,
            high_profit: 0,
        
            uang: 100,
            perak: 0,
            emas: 0,
            platinum: 0,
            diamond: 0,
            
            balaceCoin: 0,
            roadaCoin: 0,
            flagCoin: 0,
            timenCoin: 0,
            loyaliCoin: 0,
            
            top_kaya: 0,
            top_artis: 0,
            jumlah_trading: 0,
        
            lastHarga: 0
        }
    
        readDB[id] = {
            ...def,
            ...readDB[id]
        }
    
        fs.writeFileSync("./database/user.json", JSON.stringify(readDB, null, 4))
        await dbSystem.loadDB()
        return dbSystem.getUser(id)
    }
    
    static async createDBGlobal(){
        let readDB = dbSystem.getGlobal()
    
        const def = {
            season: 0,
            last_season: Date.now(),
            last_season_top: [],
            hargaPerak: 0,
            hargaEmas: 0,
            hargaPlatinum: 0,
            hargaDiamond: 0,
            perak_volume: [[0, 0,], [0, 0]],
            emas_volume: [[0, 0,], [0, 0]],
            platinum_volume: [[0, 0,], [0, 0]],
            diamond_volume: [[0, 0,], [0, 0]],
            
            balaceCoin: 0,
            balaceChart: [],
            roadaCoin: 0,
            roadaChart: [],
            flagCoin: 0,
            flagChart: [],
            timenCoin: 0,
            timenChart: [],
            loyaliCoin: 0,
            loyaliChart: [],
        }
    
        readDB = {
            ...def,
            ...readDB
        }
    
        fs.writeFileSync("./database/global.json", JSON.stringify(readDB, null, 4))
        await dbSystem.loadDB()
    }
}

module.exports = dbSystem 