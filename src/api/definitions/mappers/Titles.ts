import { getLocalString } from "./Localization"
import titles from "./source/titles.json"

type RawTitle = { TitleText: string, ColorA: string, ColorB: string }

const RawTitles = titles as Record<string, RawTitle>

export interface Title {
    Id: number
    Text: string
    ColorA: string
    ColorB: string
}

export function mapTitle(id: number, title: RawTitle): Title {
    return {
        Id: id,
        Text: getLocalString(title.TitleText),
        ColorA: title.ColorA,
        ColorB: title.ColorB
    }
}

export function getTitle(id: number): Title {
    return mapTitle(id, RawTitles[id])
}