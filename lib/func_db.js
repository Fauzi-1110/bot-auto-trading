const fs = require("fs")
<<<<<<< HEAD
const process = require("process")

class dbSystem {
    static dbUser = JSON.parse(fs.readFileSync(process.cwd()+"/database/user.json"))
    static dbGlobal = JSON.parse(fs.readFileSync(process.cwd()+"/database/global.json"))
    
    static loadDB(){
        dbSystem.dbUser = JSON.parse(fs.readFileSync(process.cwd()+"/database/user.json"))
        dbSystem.dbGlobal = JSON.parse(fs.readFileSync(process.cwd()+"/database/global.json"))
=======

class dbSystem {
    static dbUser = JSON.parse(fs.readFileSync("./database/user.json"))
    static dbGlobal = JSON.parse(fs.readFileSync("./database/global.json"))
    
    static loadDB(){
        dbSystem.dbUser = JSON.parse(fs.readFileSync("./database/user.json"))
        dbSystem.dbGlobal = JSON.parse(fs.readFileSync("./database/global.json"))
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
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
<<<<<<< HEAD
        fs.writeFileSync(process.cwd()+"/database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
=======
        fs.writeFileSync("./database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
    }
    
    static setUserKey(id, key, value){
        const keys = key.split(".")
        let obj = dbSystem.dbUser[id]
        
        for(let i = 0; i < keys.length-1; i++){
            obj = obj[keys[i]]
        }
        
        obj[keys[keys.length-1]] = value
<<<<<<< HEAD
        fs.writeFileSync(process.cwd()+"/database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
=======
        fs.writeFileSync("./database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
    }
    
    static deleteUserKey(id, key){
        const keys = key.split(".")
        let obj = dbSystem.dbUser[id]
        
        for(let i = 0; i < keys.length-1; i++){
            obj = obj[keys[i]]
        }
        
        delete obj[keys[keys.length-1]]
<<<<<<< HEAD
        fs.writeFileSync(process.cwd()+"/database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
=======
        fs.writeFileSync("./database/user.json", JSON.stringify(dbSystem.dbUser, null, 4))
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
    }
    
    static getGlobal(){
        return dbSystem.dbGlobal
    }
    
    static getGlobalKey(key){
<<<<<<< HEAD
        const keys = key.split(".")
        let obj = dbSystem.dbGlobal
        
        for(let i = 0; i < keys.length; i++){
            obj = obj[keys[i]]
        }
        return obj
    }
    
    static addGlobalKey(key, value){
        const keys = key.split(".")
        let obj = dbSystem.dbGlobal
        
        for(let i = 0; i < keys.length-1; i++){
            obj = obj[keys[i]]
        }
        
        obj[keys[keys.length-1]] = (obj[keys[keys.length-1]] || 0) + value
        fs.writeFileSync(process.cwd()+"/database/global.json", JSON.stringify(dbSystem.dbGlobal, null, 4))
    }
    
    static setGlobalKey(key, value){
        const keys = key.split(".")
        let obj = dbSystem.dbGlobal
        
        for(let i = 0; i < keys.length-1; i++){
             obj = obj[keys[i]]
        }
        
        obj[keys[keys.length-1]] = value
        fs.writeFileSync(process.cwd()+"/database/global.json", JSON.stringify(dbSystem.dbGlobal, null, 4))
=======
        return dbSystem.dbGlobal[key]
    }
    
    static addGlobalKey(key, value){
        dbSystem.dbGlobal[key] += Number(value)
        fs.writeFileSync("./database/global.json", JSON.stringify(dbSystem.dbGlobal, null, 4))
    }
    
    static setGlobalKey(key, value){
        dbSystem.dbGlobal[key] = value
        fs.writeFileSync("./database/global.json", JSON.stringify(dbSystem.dbGlobal, null, 4))
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
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
<<<<<<< HEAD
            type: nama.includes("bot") ? "bot" : "user",
=======
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
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
            
<<<<<<< HEAD
            pekerjaan: {
                pekerjaan: "pengangguran",
                pengalaman: 0,
                last_kerja: 0,
            },
            
=======
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
            top_kaya: 0,
            top_artis: 0,
            jumlah_trading: 0,
        
            lastHarga: 0
        }
    
        readDB[id] = {
            ...def,
            ...readDB[id]
        }
    
<<<<<<< HEAD
        fs.writeFileSync(process.cwd()+"/database/user.json", JSON.stringify(readDB, null, 4))
=======
        fs.writeFileSync("./database/user.json", JSON.stringify(readDB, null, 4))
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
        await dbSystem.loadDB()
        return dbSystem.getUser(id)
    }
    
    static async createDBGlobal(){
        let readDB = dbSystem.getGlobal()
    
        const def = {
            season: 0,
<<<<<<< HEAD
            item_reset_season: ["perak", "emas", "palatinum", "diamond", 
                                "balaceCoin", "roadaCoin", "flagCoin", "timenCoin", "loyaliCoin",
                                "jumlah_trading", "lastHarga", "total_profit",
                                "profit.perak", "profit.emas", "profit.platinum", "profit.diamond",
                                "profit.balaceCoin", "profit.roadaCoin", "profit.flagCoin", "profit.timenCoin", "profit.loyaliCoin",
                                "profit.perak_modal", "profit.emas_modal", "profit.platinum_modal", "profit.diamond_modal",
                                "profit.balaceCoin_modal", "profit.roadaCoin_modal", "profit.flagCoin_modal", "profit.timenCoin_modal", "profit.loyaliCoin_modal"],
=======
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
            last_season: Date.now(),
            last_season_top: [],
            hargaPerak: 0,
            hargaEmas: 0,
            hargaPlatinum: 0,
            hargaDiamond: 0,
<<<<<<< HEAD
            perak_volume: {
                beli_genap: 0,
                jual_genap: 0,
                beli_ganjil: 0,
                jual_ganjil: 0
            },
            emas_volume: {
                beli_genap: 0,
                jual_genap: 0,
                beli_ganjil: 0,
                jual_ganjil: 0
            },
            platinum_volume: {
                beli_genap: 0,
                jual_genap: 0,
                beli_ganjil: 0,
                jual_ganjil: 0
            },
            diamond_volume: {
                beli_genap: 0,
                jual_genap: 0,
                beli_ganjil: 0,
                jual_ganjil: 0
            },
=======
            perak_volume: [[0, 0,], [0, 0]],
            emas_volume: [[0, 0,], [0, 0]],
            platinum_volume: [[0, 0,], [0, 0]],
            diamond_volume: [[0, 0,], [0, 0]],
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
            
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
<<<<<<< HEAD
            
            pekerjaan: {
                pengangguran: [{pekerjaan: "pengangguran", gaji: -5, minimum: 0, cooldown: 0}],
                ojek: [{pekerjaan: "ojek", gaji: 5, minimum: 0, cooldown: 10*60}],
                guru: [{pekerjaan: "guru", gaji: 8, minimum: 5, cooldown: 8*60}],
                ob: [{pekerjaan: "ob", gaji: 10, minimum: 8, cooldown: 10*60}],
                karyawan_swasta: [{pekerjaan: "karyawan_swasta", gaji: 15, minimum: 15, cooldown: 10*60}],
                karyawan_negeri: [{pekerjaan: "karyawan_negeri", gaji: 18, minimum: 20, cooldown: 7*60}],
                tambang: [{pekerjaan: "tambang", gaji: 100, minimum: 30, cooldown: 23*60}],
                pedagang: [{pekerjaan: "pedagang", gaji: 120, minimum: 50, cooldown: 20*60}],
                pembisnis: [{pekerjaan: "pembisnis", gaji: 200, minimum: 80, cooldown: 25*60}],
                ceo: [{pekerjaan: "ceo", gaji: 500, minimum: 250, cooldown: 20*60}],
            }
=======
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
        }
    
        readDB = {
            ...def,
            ...readDB
        }
    
<<<<<<< HEAD
        fs.writeFileSync(process.cwd()+"/database/global.json", JSON.stringify(readDB, null, 4))
=======
        fs.writeFileSync("./database/global.json", JSON.stringify(readDB, null, 4))
>>>>>>> e0287652c3d978f1316f472fde1500d270f4abd1
        await dbSystem.loadDB()
    }
}

module.exports = dbSystem 