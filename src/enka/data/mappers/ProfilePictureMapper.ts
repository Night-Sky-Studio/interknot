import { BASE_URL } from "../../api/Enka"
import pfps from "../raw/pfps.json"

const ProfilePictures = pfps as Record<string, Record<string, string>>

export function getProfilePictureUrl(id: number): string {
    return BASE_URL + ProfilePictures[id]["Icon"]
}