import { BASE_URL } from "../../Enka"
import { getLocalString } from "./Localization"
import medals from "./source/medals.json"

type RawMedal = { Name: string, Icon: string, TipNum: string }

const Medals = medals as Record<string, RawMedal>

export interface MedalIcon {
    Id: number
    Name: string,
    IconUrl: string,
    LevelFormat: string
}

export enum MedalType {
    "Shiyu Defence" = 1,
    "Simulated Battle Tower" = 2,
    "Deadly Assault" = 3,
    "Simulated Battle Tower - Last Stand" = 4
}

export function getMedalIcon(id: number): MedalIcon {
    return {
        Id: id,
        Name: getLocalString(Medals[id]["Name"]),
        IconUrl: BASE_URL + Medals[id]["Icon"],
        LevelFormat: getLocalString(Medals[id]["TipNum"])
    }
}