import medals from "../raw/medals.json"
import { BASE_URL } from "../../api/Enka"
import type { MedalList } from "../../api/EnkaResponse"
import { getLocalString } from "../types/Localization"

type RawMedal = {
    Name: string, 
    Icon: string, 
    TipNum: string
}

const Medals = medals as Record<string, RawMedal>

import type { Medal, MedalIcon } from "../types/Medal"

function getMedalIcon(id: number): MedalIcon {
    return {
        Id: id,
        Name: getLocalString(Medals[id].Name),
        IconUrl: BASE_URL + Medals[id].Icon,
        LevelFormat: getLocalString(Medals[id].TipNum)
    }
}

export function mapMedal(r: MedalList): Medal {
    return {
        MedalType: r.MedalType,
        MedalIcon: getMedalIcon(r.MedalIcon),
        Value: r.Value
    }
}