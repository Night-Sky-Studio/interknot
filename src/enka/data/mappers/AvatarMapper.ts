import { BASE_URL } from "../../api/Enka"
import avatars from "../raw/avatars.json"
import type { Avatar, BaseAvatar } from "../types/Avatar"
import { mapValueProperty, valuePropertyMapper } from "./PropertyMapper"
import { mapSkin, type RawSkin } from "./SkinMapper"
import "../../extensions"
import { getLocalString } from "../types/Localization"

type RawAvatar = {
    Name: string
    Rarity: number
    ProfessionType: string
    ElementTypes: string[]
    Image: string
    CircleIcon: string
    Colors: Record<string, string>
    Skins: Record<string, RawSkin>
    BaseProps: Record<string, number>
    GrowthProps: Record<string, number>
    PromotionProps: Record<string, number>[]
    CoreEnhancementProps: Record<string, number>[]
}

export const Avatars = avatars as Record<string, RawAvatar>

function mapAvatar(id: number, a: RawAvatar): Avatar {
    return {
        Id: id,
        Name: getLocalString(a.Name),
        Rarity: a.Rarity,
        ProfessionType: a.ProfessionType,
        ElementTypes: a.ElementTypes,
        ImageUrl: BASE_URL + a.Image,
        CircleIconUrl: BASE_URL + a.CircleIcon,
        Colors: a.Colors,
        Skins: Object.values(a.Skins).map(mapSkin),
        BaseProps: a.BaseProps.toMap().map(valuePropertyMapper),
        GrowthProps: a.GrowthProps.toMap().map(valuePropertyMapper),
        PromotionProps: a.PromotionProps.map(p => p.toMap().map(valuePropertyMapper)),
        CoreEnhancementProps: a.CoreEnhancementProps.map(p => p.toMap().map(valuePropertyMapper))
    }
}

export function pickBaseAvatar(avatar: Avatar): BaseAvatar {
    const { Id, Name, Rarity, ProfessionType, ElementTypes, ImageUrl, CircleIconUrl, Colors } = avatar;
    return { Id, Name, Rarity, ProfessionType, ElementTypes, ImageUrl, CircleIconUrl, Colors };
}

export function getAvatar(id: number): Avatar {
    return mapAvatar(id, Avatars[id])
}