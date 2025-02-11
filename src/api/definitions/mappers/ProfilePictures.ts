import { BASE_URL } from "../../Enka"
import pfps from "./source/pfps.json"

const profilePictures = pfps as Record<string, Record<string, string>>

export function getProfilePictureUrl(id: number): string {
    return BASE_URL + profilePictures[id]["Icon"]
}