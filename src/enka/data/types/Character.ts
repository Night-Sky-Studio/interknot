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
    const crDiskProp = getProperty(20103),
        cdDiskProp = getProperty(21103)

    // 20103 - DriveDisk CR id
    const CritRate = c.DriveDisks
        .map(dd => dd.SubStats.find(ss => ss.Id == crDiskProp.Id))
        .reduce((res, cr) => res + (cr?.Value ?? 0), 0)

    // 21103 - DriveDisk CR id
    const CritDmg = c.DriveDisks
        .map(dd => dd.SubStats.find(ss => ss.Id == cdDiskProp.Id))
        .reduce((res, cr) => res + (cr?.Value ?? 0), 0)

    let weaponCr = 0, weaponCd = 0

    if (c.Weapon?.SecondaryStat.Id === crDiskProp.Id) {
        weaponCr += c.Weapon.SecondaryStat.Value
    }

    if (c.Weapon?.SecondaryStat.Id === cdDiskProp.Id) {
        weaponCd += c.Weapon.SecondaryStat.Value
    }

    return {
        CritRate: ValueProperty.fromProp(crDiskProp, CritRate + 500 + weaponCr), 
        CritDamage: ValueProperty.fromProp(cdDiskProp, CritDmg + 5000 + weaponCd),
        Value: (CritRate * 2 + CritDmg) / 100
    }
}