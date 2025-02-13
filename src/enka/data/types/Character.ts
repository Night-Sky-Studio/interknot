import type { BaseAvatar } from "./Avatar"
import type { DriveDisk } from "./DriveDisk"
import type { Skin } from "./Skin"
import type { Weapon } from "./Weapon"

export interface Character extends BaseAvatar {
    Id: number
    Name: string
    Level: number
    PromotionLevel: number
    Skin: Skin | null
    MindscapeLevel: number
    CoreSkillEnhancement: number
    Weapon: Weapon | null
    WeaponEffect: boolean | null
    IsHidden: boolean
    DriveDisks: DriveDisk[]
}