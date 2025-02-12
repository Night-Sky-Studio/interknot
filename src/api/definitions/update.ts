import path from "node:path"
import { setLocale } from "./mappers/Localization"
import { mapCharacter } from "../Character"
import Users from "../../mock/MockUsers"

async function updateEnkaDefinitions() {
    let urls = [
        // Enka data
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/avatars.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/equipments.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/locs.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/medals.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/namecards.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/pfps.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/property.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/titles.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/weapons.json",
        
        // Raw game data
        "https://git.mero.moe/dimbreath/ZenlessData/raw/branch/master/FileCfg/WeaponLevelTemplateTb.json",
        "https://git.mero.moe/dimbreath/ZenlessData/raw/branch/master/FileCfg/WeaponStarTemplateTb.json",
        "https://git.mero.moe/dimbreath/ZenlessData/raw/branch/master/FileCfg/EquipmentLevelTemplateTb.json"
    ]

    for (let url of urls) {
        const result = await fetch(url)
        let json = await result.json()
        const file = path.join(import.meta.dir, "mappers", "source", path.basename(url))

        if (file.indexOf("WeaponLevelTemplateTb") !== -1) {
            let recTransformed = json[Object.keys(json)[0]] as Record<string, number>[]

            json = recTransformed.map(o => {
                let keys = Object.keys(o)
                return {
                    Rarity: o[keys[0]],
                    Level: o[keys[1]],
                    MainStatMultiplier: o[keys[2]]
                }
            })

        }

        if (file.indexOf("WeaponStarTemplateTb") !== -1) {
            let recTransformed = json[Object.keys(json)[0]] as Record<string, number>[]

            json = recTransformed.map(o => {
                let keys = Object.keys(o)
                return {
                    Rarity: o[keys[0]],
                    Level: o[keys[1]],
                    // Value1: o[keys[2]],
                    // Value2: o[keys[3]],
                    MainStatMultiplier: o[keys[4]],
                    SecondaryStatMultiplier: o[keys[5]],
                    // Value5: o[keys[6]],
                    // Value6: o[keys[7]], 
                    // Value7: o[keys[8]],
                    // Value8: o[keys[9]]
                }
            })
        }

        if (file.indexOf("EquipmentLevelTemplateTb") !== -1) {
            let recTransformed = json[Object.keys(json)[0]] as Record<string, number>[]

            json = recTransformed.map(o => {
                let keys = Object.keys(o)
                return {
                    Rarity: o[keys[0]],
                    Level: o[keys[1]],
                    MainStatMultiplier: o[keys[2]]
                }
            })

        }

        await Bun.write(file, JSON.stringify(json), { createPath: true })
    }
}

if (process.argv.indexOf("--update") !== -1)
    await updateEnkaDefinitions()

if (process.argv.indexOf("--map") !== -1) 
    console.log(JSON.stringify(Users[0].PlayerInfo.ShowcaseDetail.AvatarList.map(mapCharacter)))

// console.log(JSON.stringify(mapUserProfile(Uber)))