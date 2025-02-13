import { getProperty, getPropertyByName } from "../mappers/PropertyMapper"
import type { BaseAvatar } from "./Avatar"
import { CritValue } from "./CritValue"
import type { DriveDisk } from "./DriveDisk"
import { ValueProperty } from "./Property"
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

// export function calculateCharacterStats(c: Character): number {
// }

export function getCharacterCritValue(c: Character): CritValue {
    const crProp = getProperty(20103),
        cdProp = getProperty(21103)

    // 20103 - DriveDisk CR id
    const CritRate = c.DriveDisks
        .map(dd => dd.SubStats.find(ss => ss.Id == crProp.Id))
        .reduce((res, cr) => res + (cr?.Value ?? 0), 0)

    // 21103 - DriveDisk CR id
    const CritDmg = c.DriveDisks
        .map(dd => dd.SubStats.find(ss => ss.Id == cdProp.Id))
        .reduce((res, cr) => res + (cr?.Value ?? 0), 0)

    return {
        CritRate: ValueProperty.fromProp(crProp, CritRate + 500), 
        CritDamage: ValueProperty.fromProp(cdProp, CritDmg + 5000),
        Value: (CritRate * 2 + CritDmg) / 100
    }
}