import { BASE_URL } from "../../Enka"
import namecards from "./source/namecards.json"

const Namecards = namecards as Record<string, Record<string, string>>

export function getNamecardUrl(id: number): string {
    return BASE_URL + Namecards[id]["Icon"]
}