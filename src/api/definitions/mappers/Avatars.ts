import { getLocalString } from "./Localization"
import getProperty, { formatProperty } from "./Properties"
import avatars from "./source/avatars.json"

interface AvatarProperty {
    Id: number
    Name: string
    Value: string
}

interface AvatarSkin {
    Id: number
    // Name: string
    Image: string
    CircleIcon: string
}

interface Avatar {
    Id: number
    Name: string
    Rarity: number
    ProfessionType: string
    ElementTypes: string[]
    Image: string
    CircleIcon: string
    Colors: {
        Accent: string,
        Mindscape: string
    } | {},
    Skins: AvatarSkin[]
    BaseProps: AvatarProperty[]
    GrowthProps: AvatarProperty[]
    PromotionProps: AvatarProperty[][]
    CoreEnhancementProps: AvatarProperty[][]
}

type RawAvatar = {
    Name: string;
    Rarity: number;
    ProfessionType: string;
    ElementTypes: string[];
    Image: string;
    CircleIcon: string;
    Colors: Record<string, string>;
    Skins: Record<string, { Image: string; CircleIcon: string }>;
    BaseProps: Record<string, number>;
    GrowthProps: Record<string, number>;
    PromotionProps: Record<string, number>[];
    CoreEnhancementProps: Record<string, number>[];
};

type RawAvatarData = Record<string, RawAvatar>;

export enum MainCharacter {
    "Wise" = 2011,
    "Belle" = 2021
}

function mapSkins(data: Record<string, { Image: string; CircleIcon: string }>): AvatarSkin[] {
    let result: AvatarSkin[] = []
    for (let id in data) {
        let skin: AvatarSkin = {
            Id: parseInt(id),
            Image: data[id].Image,
            CircleIcon: data[id].CircleIcon
        }
        result.push(skin)
    }
    return result
}

function mapAvatarProps(data: Record<string, number>): AvatarProperty[] {
    let result: AvatarProperty[] = []
    for (let id in data) {
        let p = getProperty(id)
        let prop: AvatarProperty = {
            Id: parseInt(id),
            Name: p.Name,
            Value: formatProperty(p.Format, data[id])
        }
        result.push(prop)
    }
    return result
}

export function mapAvatars(): Avatar[] {
    const raw: RawAvatarData = avatars 
    let result: Avatar[] = []
    for (let id in raw) {
        let rawAvatar = raw[id]
        let avatar: Avatar = {
            Id: parseInt(id),
            Name: getLocalString(rawAvatar.Name),
            Rarity: rawAvatar.Rarity,
            ProfessionType: rawAvatar.ProfessionType,
            ElementTypes: rawAvatar.ElementTypes,
            Image: rawAvatar.Image,
            CircleIcon: rawAvatar.CircleIcon,
            Colors: rawAvatar.Colors,
            Skins: mapSkins(rawAvatar.Skins),
            BaseProps: mapAvatarProps(rawAvatar.BaseProps),
            GrowthProps: mapAvatarProps(rawAvatar.GrowthProps),
            PromotionProps: rawAvatar.PromotionProps.map(pp => mapAvatarProps(pp)),
            CoreEnhancementProps: rawAvatar.CoreEnhancementProps.map(cep => mapAvatarProps(cep))
        }
        result.push(avatar)
    }
    return result
}