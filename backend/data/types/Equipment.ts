import type { ValueProperty } from "./Property"

export interface Equipment {
    Id: number
    Name: string
    Rarity: number
    IconUrl: string
    SetBonusProps: ValueProperty[]
}