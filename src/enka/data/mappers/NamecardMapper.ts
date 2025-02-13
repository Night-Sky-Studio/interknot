import { BASE_URL } from "../../api/Enka"
import namecards from "../raw/namecards.json"

const Namecards = namecards as Record<string, Record<string, string>>

export function getNamecardUrl(id: number) {
    return BASE_URL + Namecards[id]["Icon"]
}