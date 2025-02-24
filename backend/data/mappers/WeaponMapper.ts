import { BASE_URL } from "../../api/Enka"
import type { Weapon as WeaponData } from "../../api/EnkaResponse"
import { isNullOrUndefined, type Nullable } from "../../Nullable"
import weapons from "../raw/weapons.json"
import { getLocalString } from "../types/Localization"
import { Property } from "../types/Property"
import type { BaseWeapon, Weapon } from "../types/Weapon"
import { mapValueProperty } from "./PropertyMapper"
import { getWeaponMainStatMultiplier, getWeaponSecondaryStatMultiplier, getWeaponStarMultiplier } from "./RawDataTablesMapper"

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

const Weapons = weapons as Record<string, RawWeapon>

function mapWeapon(id: number, weapon: RawWeapon): BaseWeapon {
    return {
        Id: id,
        Name: getLocalString(weapon.ItemName),
        Rarity: weapon.Rarity,
        ProfessionType: weapon.ProfessionType,
        ImageUrl: BASE_URL + weapon.ImagePath,
        MainStat: mapValueProperty(weapon.MainStat.PropertyId, weapon.MainStat.PropertyValue),
        SecondaryStat: mapValueProperty(weapon.SecondaryStat.PropertyId, weapon.SecondaryStat.PropertyValue)
    }
}

export function mapWeaponData(data: Nullable<WeaponData>): Nullable<Weapon> {
    if (isNullOrUndefined(data)) return null
    data = data as WeaponData
    const raw = getWeapon(data.Id),
        mainStatMul = (getWeaponMainStatMultiplier(raw.Rarity, data.Level) ?? 0) / 10000,
        starMul = (getWeaponStarMultiplier(raw.Rarity, data.BreakLevel) ?? 0) / 10000,
        secStatMul = (getWeaponSecondaryStatMultiplier(raw.Rarity, data.BreakLevel) ?? 0) / 10000,

        mainStatValue = Math.floor(raw.MainStat.Value * (1 + mainStatMul + starMul)),
        secStatValue = raw.SecondaryStat.Value * (1 + secStatMul)

    return {
        ...raw,
        MainStat: new Property(raw.MainStat.Id, mainStatValue),
        SecondaryStat: new Property(raw.SecondaryStat.Id, secStatValue),
        Uid: data.Uid,
        Level: data.Level,
        BreakLevel: data.BreakLevel,
        UpgradeLevel: data.UpgradeLevel,
        IsAvailable: data.IsAvailable,
        IsLocked: data.IsLocked,
    }
}

export function getWeapon(id: number): BaseWeapon {
    return mapWeapon(id, Weapons[id])
}