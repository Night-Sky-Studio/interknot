import type { AvatarList } from "../../api/EnkaResponse"
import { Avatar } from "../types/Avatar"
import type { Character } from "../types/Character"
import { DriveDisk } from "../types/DriveDisk"
import { Property, PropertyType } from "../types/Property"
import { Weapon } from "../types/Weapon"
import { getAvatar, pickBaseAvatar } from "./AvatarMapper"
import { getDriveDisksSet, mapDriveDisk } from "./DriveDiskMapper"
import { getSkin } from "./SkinMapper"
import { mapWeaponData } from "./WeaponMapper"

function applyDriveDiskProp(prop: Property, baseValue: number, disks: DriveDisk[]) {
    let result = 0

    const sets = getDriveDisksSet(disks)

    for (let disk of disks) {
        if (prop.simpleName.includes(disk.MainStat.simpleName) && !(prop.simpleName === "CritDmg" && disk.MainStat.simpleName === "Crit")) {
            if (prop.FormatType === PropertyType.Delta && disk.MainStat.FormatType === PropertyType.Ratio) {
                result += baseValue * (disk.MainStat.Value / 100 / 100)
            } else if (prop.simpleName.includes("Sp") && disk.MainStat.simpleName.includes("Sp")) {
                result += baseValue * (disk.MainStat.Value / 100 / 100)
            }else {
                result += disk.MainStat.Value
            }
        }

        for (let subStat of disk.SubStats) {
            if (prop.simpleName.includes(subStat.simpleName) && !(prop.simpleName === "CritDmg" && subStat.simpleName === "Crit")) {
                if (prop.FormatType === PropertyType.Delta && subStat.FormatType === PropertyType.Ratio) {
                    result += baseValue * (subStat.Value / 100 / 100)
                } else {
                    result += subStat.Value
                }
            }
        } 
    }

    for (let set of sets) {
        const bonusProp = set.Set.SetBonusProps[0]

        if (bonusProp && prop.simpleName.includes(bonusProp.simpleName) && !(prop.simpleName === "CritDmg" && bonusProp.simpleName === "Crit")) {
            if (prop.FormatType === PropertyType.Delta && bonusProp.FormatType === PropertyType.Ratio) {
                result += baseValue * (bonusProp.Value / 100 / 100) 
            } else {
                result += bonusProp.Value
            }
        }
    }

    return Math.floor(result)
}

function getCharacterBaseProps(avatar: Avatar, level: number, promLevel: number, coreEnhancement: number): Property[] {
    return avatar.BaseProps.map(prop => {
        const 
            growthProp = avatar.GrowthProps.find(p => p.Id === prop.Id)?.Value ?? 0,
            growthValue = Math.floor((growthProp * (level - 1)) / 10000),

            promotionValue = avatar.PromotionProps[promLevel - 1].find(p => p.Id === prop.Id)?.Value ?? 0,
            
            coreEnhancementValue = avatar.CoreEnhancementProps[coreEnhancement].find(p => p.Id === prop.Id)?.Value ?? 0

        let basePropValue = prop.Value + growthValue + promotionValue + coreEnhancementValue

        return new Property(prop.Id, Math.floor(basePropValue))
    })
}

function mapStats(raw: Avatar, char: AvatarList, disks: DriveDisk[], weapon: Weapon | null): Property[] {
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
        const diskValue = applyDriveDiskProp(prop, prop.Value, disks)
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

export function calculateCritValue(driveDisks: DriveDisk[]): number {
    // crit_rate * 2 + crit_damage
    // taken only from drive disk' sub stats

    const crDiskPropId = 20103,
        cdDiskPropId = 21103

    let critRate = driveDisks
        .map(dd => dd.SubStats.find(ss => ss.Id === crDiskPropId))
        .filter(ss => ss !== undefined)
        .reduce((res, cr) => res + cr.Value, 0)

    let critDamage = driveDisks
        .map(dd => dd.SubStats.find(ss => ss.Id === cdDiskPropId))
        .filter(ss => ss !== undefined)
        .reduce((res, cd) => res + cd.Value, 0)

    if (driveDisks[3]?.MainStat.Id === crDiskPropId) {
        critRate += driveDisks[3].MainStat.Value
    }

    if (driveDisks[3]?.MainStat.Id === cdDiskPropId) {
        critDamage += driveDisks[3].MainStat.Value
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
        SkillLevels: raw.SkillLevelList.sort(s => s.Index).map(s => s.Level),
        Weapon: weapon,
        WeaponEffect: { 0: null, 1: false, 2: true }[raw.WeaponEffectState] ?? null,
        IsHidden: raw.IsHidden,
        DriveDisks: disks,
        DriveDisksSet: getDriveDisksSet(disks),
        BaseStats: mapStats(avatar, raw, disks, weapon),
        CritValue: calculateCritValue(disks)
    }
}