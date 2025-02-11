import path from "node:path"
import { mapAvatars } from "./mappers/Avatars"
import { setLocale } from "./mappers/Localization"
import { mapUserProfile } from "../UserProfile"
import Uber from "../../mock/Uber.json"

function updateEnkaDefinitions() {
    let urls = [
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/avatars.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/equipments.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/locs.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/medals.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/namecards.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/pfps.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/property.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/titles.json",
        "https://raw.githubusercontent.com/EnkaNetwork/API-docs/refs/heads/master/store/zzz/weapons.json"
    ]

    urls.forEach(async (url) => {
        const result = await fetch(url)
        const file = path.join(import.meta.dir, "mappers", "source", path.basename(url))
        await Bun.write(file, result, { createPath: true })
    })
}

function remapEnkaDefinitions() {
    setLocale("en")
    console.log(JSON.stringify(mapAvatars()))
}

if (process.argv.indexOf("--remap") !== -1)
    remapEnkaDefinitions()

if (process.argv.indexOf("--update") !== -1)
    updateEnkaDefinitions()

console.log(JSON.stringify(mapUserProfile(Uber)))