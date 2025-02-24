import type { EquippedList } from "../../api/EnkaResponse"
import type { DriveDisk, DriveDiskSet } from "../types/DriveDisk"
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

export function mapDriveDisk(raw: EquippedList): DriveDisk {
    const entry = raw.Equipment,
        equipment = getEquipment(entry.Id),

        mainStatProp = mapDriveDiskProperty(entry.MainPropertyList[0]),

        // Result = MainStat.PropertyValue * (1 + EquipmentLevel.Field_XXX / 10000)
        statMultiplier = (getEquipmentLevelStatMultiplier(equipment.Rarity, entry.Level) ?? 0) / 10000,
        mainStatValue = mainStatProp.Value * (1 + statMultiplier)
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
        MainStat: {
            ...mainStatProp,
            Value: mainStatValue
        },
        SubStats: entry.RandomPropertyList.map(p => {
            return {
                ...mapDriveDiskProperty(p),
                Value: p.PropertyValue
            }
        })
    }
}