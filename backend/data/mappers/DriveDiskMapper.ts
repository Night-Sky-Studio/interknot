import type { EquippedList } from "../../api/EnkaResponse"
import { CritValue } from "../types/CritValue"
import type { DriveDisk, DriveDiskSet } from "../types/DriveDisk"
import { Property } from "../types/Property"
import { getEquipment } from "./EquipmentMapper"
import { mapDriveDiskProperty } from "./PropertyMapper"
import { getEquipmentLevelStatMultiplier } from "./RawDataTablesMapper"

export function getDriveDisksSet(disks: DriveDisk[]): DriveDiskSet[] {
    // find unique sets in disks and count them
    const set = new Map<string, number>()
    disks.forEach(d => {
        const key = d.Name
        if (set.has(key)) {
            set.set(key, (set.get(key) ?? 0) + 1)
        } else {
            set.set(key, 1)
        }
    })

    // convert map to array
    return Array.from(set.entries()).map(([key, value]) => {
        return {
            Count: value,
            Set: getEquipment(disks.find(d => d.Name === key)?.Id ?? 0)
        }
    })
}

export function getSubStatsCritValue(subStats: Property[]): CritValue {
    const crDiskPropId = 20103,
        cdDiskPropId = 21103

    let critRate = subStats
        .filter(ss => ss.Id === crDiskPropId)
        .reduce((res, cr) => res + cr.Value, 0)

    let critDamage = subStats
        .filter(ss => ss.Id === cdDiskPropId)
        .reduce((res, cr) => res + cr.Value, 0)

    return {
        CritRate: new Property(crDiskPropId, critRate),
        CritDamage: new Property(cdDiskPropId, critDamage),
        Value: critRate * 2 + critDamage
    }
}

export function mapDriveDisk(raw: EquippedList): DriveDisk {
    const entry = raw.Equipment,
        equipment = getEquipment(entry.Id),

        mainStatProp = mapDriveDiskProperty(entry.MainPropertyList[0]),

        // Result = MainStat.PropertyValue * (1 + EquipmentLevel.Field_XXX / 10000)
        statMultiplier = (getEquipmentLevelStatMultiplier(equipment.Rarity, entry.Level) ?? 0) / 10000,
        mainStatValue = mainStatProp.Value * (1 + statMultiplier),
        subStats = entry.RandomPropertyList.map(mapDriveDiskProperty)
    return {
        ...equipment,
        Id: entry.Id,
        Uid: entry.Uid,
        SetId: equipment.Id,
        Slot: raw.Slot,
        IsAvailable: entry.IsAvailable,
        IsTrash: entry.IsTrash,
        Level: entry.Level,
        BreakLevel: entry.BreakLevel,
        MainStat: new Property(mainStatProp.Id, mainStatValue),
        SubStats: subStats,
        CritValue: getSubStatsCritValue(subStats)
    }
}