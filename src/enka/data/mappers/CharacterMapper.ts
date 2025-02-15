import type { AvatarList } from "../../api/EnkaResponse"
import { Avatar } from "../types/Avatar"
import type { Character } from "../types/Character"
import { DriveDisk } from "../types/DriveDisk"
import { ValueProperty } from "../types/Property"
import { Weapon } from "../types/Weapon"
import { getAvatar, pickBaseAvatar } from "./AvatarMapper"
import { getDriveDisksSet, mapDriveDisk } from "./DriveDiskMapper"
import { getProperty } from "./PropertyMapper"
import { getSkin } from "./SkinMapper"
import { mapWeaponData } from "./WeaponMapper"

function applyDriveDiskProp(propId: number, baseValue: number, disks: DriveDisk[]) {
    let result = 0

    const sets = getDriveDisksSet(disks)

    for (let disk of disks) {
        if (Math.abs(disk.MainStat.Id - propId) < 3) {
            result += disk.MainStat.Value
        }

        for (let subStat of disk.SubStats) {
            // STAT%
            if (Math.abs(subStat.Id - propId) === 1) {
                result += baseValue * ((subStat.Value * subStat.Level) / 100 / 100)
            }

            // Flat STAT
            if (Math.abs(subStat.Id - propId) === 2) {
                result += subStat.Value * subStat.Level
            }
        }
    }

    for(let set of sets) {
        const bonusProp = set.Set.SetBonusProps[0]

        if (bonusProp) {
            if (Math.abs(bonusProp.Id - propId) === 1) {
                result += baseValue * (bonusProp.Value / 100 / 100) 
            }

            if (Math.abs(bonusProp.Id - propId) === 2) {
                result += bonusProp.Value
            }
        }
    }

    return Math.floor(result)
}

function getCharacterBaseProps(avatar: Avatar, level: number, promLevel: number, coreEnhancement: number): ValueProperty[] {
    return avatar.BaseProps.map(prop => {
        const 
            growthProp = avatar.GrowthProps.find(p => p.Id === prop.Id)?.Value ?? 0,
            growthValue = Math.floor((growthProp * (level - 1)) / 10000),

            promotionValue = avatar.PromotionProps[promLevel - 1].find(p => p.Id === prop.Id)?.Value ?? 0,
            
            coreEnhancementValue = avatar.CoreEnhancementProps[coreEnhancement].find(p => p.Id === prop.Id)?.Value ?? 0

        let basePropValue = prop.Value + growthValue + promotionValue + coreEnhancementValue

        return ValueProperty.fromProp(prop, Math.floor(basePropValue))
    })
}

function mapStats(raw: Avatar, char: AvatarList, disks: DriveDisk[], weapon: Weapon | null): ValueProperty[] {
    // Get the base props
    const baseProps = getCharacterBaseProps(raw, char.Level, char.PromotionLevel, char.CoreSkillEnhancement)

    // Add weapon main stat to the base props
    if (weapon) {
        const idx = baseProps.findIndex(p => p.Id === weapon.MainStat.Id)
        if (idx !== -1) {
            baseProps[idx].Value += weapon.MainStat.Value
        }
    }

    // Apply Drive Disk stats
    for (let prop of baseProps) {
        const diskValue = applyDriveDiskProp(prop.Id, prop.Value, disks)
        prop.Value += diskValue
    }

    // add secondary weapon stat
    // id type is different from main stat
    if (weapon) {
        const idx = baseProps.findIndex(p => [p.Id + 1, p.Id + 2].indexOf(weapon.SecondaryStat.Id) !== -1)
        if (idx !== -1) {
            baseProps[idx].Value += weapon.SecondaryStat.Value
        }
    }

    return baseProps
}

export function calculateCritValue(char: Character): number {
    // crit_rate * 2 + crit_damage
    // taken only from drive disk' sub stats

    const crDiskProp = getProperty(20103),
        cdDiskProp = getProperty(21103)

    let critRate = char.DriveDisks
        .map(dd => dd.SubStats.find(ss => ss.Id === crDiskProp.Id))
        .filter(ss => ss !== undefined)
        .reduce((res, cr) => res + (cr.Value * cr.Level), 0)

    let critDamage = char.DriveDisks
        .map(dd => dd.SubStats.find(ss => ss.Id === cdDiskProp.Id))
        .filter(ss => ss !== undefined)
        .reduce((res, cd) => res + (cd.Value * cd?.Level), 0)

    if (char.DriveDisks[3]?.MainStat.Id === crDiskProp.Id) {
        critRate += char.DriveDisks[3].MainStat.Value
    }

    if (char.DriveDisks[3]?.MainStat.Id === cdDiskProp.Id) {
        critDamage += char.DriveDisks[3].MainStat.Value
    }

    // add weapon crit stats if available
    // if (char.Weapon) {
    //     if (char.Weapon.SecondaryStat.Id === crDiskProp.Id) {
    //         critRate += char.Weapon.SecondaryStat.Value
    //     }
        
    //     if (char.Weapon.SecondaryStat.Id === cdDiskProp.Id) {
    //         critDamage += char.Weapon.SecondaryStat.Value
    //     }
    // }

    // const sets = getDriveDisksSet(char.DriveDisks)

    // for (let set of sets) {
    //     const bonusProp = set.Set.SetBonusProps[0]

    //     if (bonusProp) {
    //         if (bonusProp.Id === crDiskProp.Id) {
    //             critRate += bonusProp.Value
    //         }

    //         if (bonusProp.Id === cdDiskProp.Id) {
    //             critDamage += bonusProp.Value
    //         }
    //     }
    // }

    return (critRate * 2 + critDamage) / 100
}

export function mapCharacter(raw: AvatarList): Character {
    const avatar = getAvatar(raw.Id),
        weapon = mapWeaponData(raw.Weapon) ?? null,
        disks = raw.EquippedList.map(mapDriveDisk)

    return {
        ...pickBaseAvatar(avatar),
        Id: raw.Id,
        Level: raw.Level,
        PromotionLevel: raw.PromotionLevel,
        Skin: getSkin(avatar, raw.SkinId) ?? null,
        MindscapeLevel: raw.TalentLevel,
        CoreSkillEnhancement: raw.CoreSkillEnhancement,
        Weapon: weapon,
        WeaponEffect: { 0: null, 1: false, 2: true }[raw.WeaponEffectState] ?? null,
        IsHidden: raw.IsHidden,
        DriveDisks: disks,
        Stats: mapStats(avatar, raw, disks, weapon)
    }
}