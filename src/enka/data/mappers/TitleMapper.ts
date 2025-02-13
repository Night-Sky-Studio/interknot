import titles from "../raw/titles.json"
import { getLocalString } from "../types/Localization"
import type { Title } from "../types/Title"

type RawTitle = {
    TitleText: string, 
    ColorA: string, 
    ColorB: string
}

const Titles = titles as Record<string, RawTitle>

export function mapTitle(id: number, title: RawTitle): Title {
    return {
        Id: id,
        Text: getLocalString(title.TitleText),
        ColorA: title.ColorA,
        ColorB: title.ColorB
    }
}

export function getTitle(id: number) {
    return mapTitle(id, Titles[id])
}