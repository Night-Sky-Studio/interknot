import type { EquippedList } from "../../api/EnkaResponse"
import type { DriveDisk } from "../types/DriveDisk"
import { getEquipment } from "./EquipmentMapper"
import { mapDriveDiskProperty, mapValueProperty } from "./PropertyMapper"
import { getEquipmentLevelStatMultiplier } from "./RawDataTablesMapper"

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
                Value: p.PropertyValue * (1 + statMultiplier)
            }
        })
    }
}