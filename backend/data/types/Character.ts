import type { BaseAvatar } from "./Avatar"
import type { DriveDisk, DriveDiskSet } from "./DriveDisk"
import { Property } from "./Property"
import type { Skin } from "./Skin"
import type { Weapon } from "./Weapon"

export interface Talents {
    BasicAttack: number
    SpecialAttack: number
    Dash: number
    Ultimate: number
    CoreSkill: number
    Assist: number
}

export interface Character extends BaseAvatar {
    Id: number
    Name: string
    Level: number
    PromotionLevel: number
    Skin: Skin | null
    MindscapeLevel: number
    CoreSkillEnhancement: number
    SkillLevels: Talents
    Weapon: Weapon | null
    WeaponEffect: boolean | null
    IsHidden: boolean
    DriveDisks: DriveDisk[]
    DriveDisksSet: DriveDiskSet[]
    BaseStats: Property[]
    CritValue: number
}