import { getLocalString } from "./Localization"
import getProperty, { formatProperty } from "./Properties"
import avatars from "./source/avatars.json"

export interface StatProperty {
    Id: number
    Name: string
    Format: string
    Value: number
}

export interface FormattedStatProperty {
    Id: number
    Name: string
    RawValue: number
    Value: string
}

export interface AvatarSkin {
    Id: number
    // Name: string
    Image: string
    CircleIcon: string
}

interface AvatarData {
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
    BaseProps: FormattedStatProperty[]
    GrowthProps: FormattedStatProperty[]
    PromotionProps: FormattedStatProperty[][]
    CoreEnhancementProps: FormattedStatProperty[][]
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

function mapAvatarProps(data: Record<string, number>): FormattedStatProperty[] {
    let result: FormattedStatProperty[] = []
    for (let id in data) {
        let p = getProperty(id)
        let prop: FormattedStatProperty = {
            Id: parseInt(id),
            Name: p.Name,
            RawValue: data[id],
            Value: formatProperty(p.Format, data[id])
        }
        result.push(prop)
    }
    return result
}

export function mapAvatar(id: number, r: RawAvatar): AvatarData {
    return {
        Id: id,
        Name: getLocalString(r.Name),
        Rarity: r.Rarity,
        ProfessionType: r.ProfessionType,
        ElementTypes: r.ElementTypes,
        Image: r.Image,
        CircleIcon: r.CircleIcon,
        Colors: r.Colors,
        Skins: mapSkins(r.Skins),
        BaseProps: mapAvatarProps(r.BaseProps),
        GrowthProps: mapAvatarProps(r.GrowthProps),
        PromotionProps: r.PromotionProps.map(pp => mapAvatarProps(pp)),
        CoreEnhancementProps: r.CoreEnhancementProps.map(cep => mapAvatarProps(cep))
    }
}

export function mapAvatars(): AvatarData[] {
    const raw: RawAvatarData = avatars 
    let result: AvatarData[] = []
    for (let id in raw) {
        let rawAvatar = raw[id]
        let avatar = mapAvatar(parseInt(id), rawAvatar)
        result.push(avatar)
    }
    return result
}

const RawAvatars = avatars as Record<string, RawAvatar>

export function getAvatar(id: number): AvatarData {
    return mapAvatar(id, RawAvatars[id])
}

export function getSkin(id: number): AvatarSkin | undefined {
    var avatar = Object.values(RawAvatars)
        .find(val => Object.keys(val.Skins).indexOf(id.toString()) !== -1)
    
    if (!avatar) return undefined

    return {
        Id: id,
        ...avatar.Skins[id]
    }
}