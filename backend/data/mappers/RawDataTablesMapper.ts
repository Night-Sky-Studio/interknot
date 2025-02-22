import weaponLevelTable from "../raw/WeaponLevelTemplateTb.json"
import weaponStarTable from "../raw/WeaponStarTemplateTb.json"
import equipmentLevelTable from "../raw/EquipmentLevelTemplateTb.json"

type WeaponLevelTableEntry = {
    Rarity: number
    Level: number
    MainStatMultiplier: number
}

type WeaponStarTableEntry = WeaponLevelTableEntry & {
    SecondaryStatMultiplier: number
}

type EquipmentLevelTableEntry = WeaponLevelTableEntry

const WeaponLevelTable = weaponLevelTable as WeaponLevelTableEntry[]
const WeaponStarTable = weaponStarTable as WeaponStarTableEntry[]
const EquipmentLevelTable = equipmentLevelTable as EquipmentLevelTableEntry[]

export function getWeaponMainStatMultiplier(rarity: number, level: number) {
    return WeaponLevelTable.find(w => w.Level === level && w.Rarity === rarity)?.MainStatMultiplier
}

export function getWeaponStarMultiplier(rarity: number, level: number) {
    return WeaponStarTable.find(w => w.Level === level && w.Rarity === rarity)?.MainStatMultiplier
}

export function getWeaponSecondaryStatMultiplier(rarity: number, level: number) {
    return WeaponStarTable.find(w => w.Level === level && w.Rarity === rarity)?.SecondaryStatMultiplier
}

export function getEquipmentLevelStatMultiplier(rarity: number, level: number) {
    return EquipmentLevelTable.find(e => e.Level === level && e.Rarity === rarity)?.MainStatMultiplier
}