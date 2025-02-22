import { BASE_URL } from "../../api/Enka"
import type { Avatar } from "../types/Avatar"
import type { Skin } from "../types/Skin"

export type RawSkin = {
    Image: string
    CircleIcon: string
}

export function mapSkin(r: RawSkin): Skin {
    return {
        Id: parseInt(Object.keys(r)[0]),
        ImageUrl: BASE_URL + r.Image,
        CircleIconUrl: BASE_URL + r.CircleIcon,
        IsActive: false
    }
}

export function getSkin(avatar: Avatar, id: number): Skin | undefined {
    return avatar.Skins.find(s => s.Id === id)
}