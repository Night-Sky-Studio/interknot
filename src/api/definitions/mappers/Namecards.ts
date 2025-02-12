import { BASE_URL } from "../../Enka"
import namecards from "./source/namecards.json"

const RawNamecards = namecards as Record<string, Record<string, string>>

export function getNamecardUrl(id: number): string {
    return BASE_URL + RawNamecards[id]["Icon"]
}