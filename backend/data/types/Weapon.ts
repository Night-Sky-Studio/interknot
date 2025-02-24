import type { Property } from "./Property"

export interface BaseWeapon {
    Id: number
    Name: string
    Rarity: number
    ProfessionType: string
    ImageUrl: string
    MainStat: Property
    SecondaryStat: Property
}

export interface Weapon extends BaseWeapon {
    Uid: number
    Level: number
    BreakLevel: number
    UpgradeLevel: number    // (P)hase Level / Refinement
    IsAvailable: boolean
    IsLocked: boolean
}