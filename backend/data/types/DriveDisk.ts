import { CritValue } from "./CritValue"
import type { Equipment } from "./Equipment"
import { Property } from "./Property"

export type DriveDiskSet = {
    Count: number,
    Set: Equipment
}

export interface DriveDisk extends Equipment {
    Id: number
    Uid: number
    SetId: number
    Slot: number
    IsAvailable: boolean
    IsTrash: boolean
    Rarity: number
    Level: number
    BreakLevel: number
    MainStat: Property
    SubStats: Property[],
    CritValue: CritValue
}