import { BASE_URL } from "../../Enka"
import { StatProperty } from "./Avatars"
import { getLocalString } from "./Localization"
import getProperty from "./Properties"
import weapons from "./source/weapons.json"

type RawProperty = {
    PropertyId: number
    PropertyValue: number
}

type RawWeapon = {
    ItemName: string,
    Rarity: number
    ProfessionType: string
    ImagePath: string
    MainStat: RawProperty
    SecondaryStat: RawProperty
}

const RawWeapons = weapons as Record<string, RawWeapon>

export interface WeaponData {
    Id: number
    Name: string
    Rarity: number
    ProfessionType: string
    ImageUrl: string
    MainStat: StatProperty
    SecondaryStat: StatProperty
}

export default function mapWeapon(id: number, r: RawWeapon): WeaponData {
    const mainStatProp = getProperty(r.MainStat.PropertyId.toString()),
        secStatProp = getProperty(r.SecondaryStat.PropertyId.toString())
    return {
        Id: id,
        Name: getLocalString(r.ItemName),
        Rarity: r.Rarity,
        ProfessionType: r.ProfessionType,
        ImageUrl: BASE_URL + r.ImagePath,
        MainStat: {
            Id: r.MainStat.PropertyId,
            Name: mainStatProp.Name,
            Format: mainStatProp.Format,
            Value: r.MainStat.PropertyValue,
        },
        SecondaryStat: {
            Id: r.SecondaryStat.PropertyId,
            Name: secStatProp.Name,
            Format: secStatProp.Format,
            Value: r.SecondaryStat.PropertyValue,
        }
    }
}

export function getWeaponData(id: number): WeaponData {
    return mapWeapon(id, RawWeapons[id])
}