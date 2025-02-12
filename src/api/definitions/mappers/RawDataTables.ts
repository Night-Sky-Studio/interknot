import weaponLevelTb from "./source/WeaponLevelTemplateTb.json"
import weaponStarTb from "./source/WeaponStarTemplateTb.json"
import equipmentLevelTb from "./source/EquipmentLevelTemplateTb.json"

type WeaponLevelTableEntry = {
    Rarity: number
    Level: number
    MainStatMultiplier: number
}

type WeaponStarTableEntry = WeaponLevelTableEntry & {
    SecondaryStatMultiplier: number
}

type EquipmentLevelTableEntry = WeaponLevelTableEntry

const WeaponLevelTable = weaponLevelTb as WeaponLevelTableEntry[]
const WeaponStarTable = weaponStarTb as WeaponStarTableEntry[]
const EquipmentLevelTable = equipmentLevelTb as EquipmentLevelTableEntry[]

export function getWeaponMainStatMultiplier(rarity: number, level: number) {
    return WeaponLevelTable.find(i => i.Level === level && i.Rarity === rarity)?.MainStatMultiplier
}

export function getWeaponStarMultiplier(rarity: number, level: number) {
    return WeaponStarTable.find(i => i.Level === level && i.Rarity === rarity)?.MainStatMultiplier
}

export function getWeaponSecondaryStatMultiplier(rarity: number, level: number) {
    return WeaponStarTable.find(i => i.Level === level && i.Rarity === rarity)?.SecondaryStatMultiplier
}

export function getEquipmentMainStatMultiplier(rarity: number, level: number) {
    return EquipmentLevelTable.find(i => i.Level === level && i.Rarity === rarity)?.MainStatMultiplier
}