import type { Equipment } from "../types/Equipment"
import equipments from "../raw/equipments.json"
import { getLocalString } from "../types/Localization"
import { BASE_URL } from "../../api/Enka"
import { valuePropertyMapper } from "./PropertyMapper"
import "../../extensions"
import { map, recordToMap } from "../../extensions"

type RawItem = {
    Rarity: number,
    SuitId: number
}

const Items = equipments.Items as Record<string, RawItem>

type RawSuit = {
    Icon: string,
    Name: string,
    SetBonusProps: Record<string, number>
}

const Suits = equipments.Suits as Record<string, RawSuit>

function mapEquipment(item: RawItem): Equipment {
    const suit = Suits[item.SuitId]
    return {
        Id: item.SuitId,
        Name: getLocalString(Suits[item.SuitId].Name),
        Rarity: item.Rarity,
        IconUrl: BASE_URL + Suits[item.SuitId].Icon,
        SetBonusProps: map(recordToMap(suit.SetBonusProps), valuePropertyMapper)
    }
}

export function getEquipment(id: number): Equipment {
    return mapEquipment(Items[id])
}