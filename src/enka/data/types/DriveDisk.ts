import type { Equipment } from "./Equipment"
import type { DriveDiskProperty, ValueProperty } from "./Property"

export interface DriveDisk extends Equipment {
    Id: number
    Uid: number
    Slot: number
    IsAvailable: boolean
    IsTrash: boolean
    Rarity: number
    Level: number
    BreakLevel: number
    MainStat: ValueProperty
    SubStats: DriveDiskProperty[]
}