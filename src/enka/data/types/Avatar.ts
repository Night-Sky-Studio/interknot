// !== Character

import type { IValueProperty } from "./Property"
import type { Skin } from "./Skin"

export interface BaseAvatar {
    Id: number
    Name: string
    Rarity: number
    ProfessionType: string
    ElementTypes: string[]
    ImageUrl: string
    CircleIconUrl: string
    Colors: {
        Accent: string
        Mindscape: string
    }
}

export interface Avatar extends BaseAvatar {
    Skins: Skin[]
    BaseProps: IValueProperty[]
    GrowthProps: IValueProperty[]
    PromotionProps: IValueProperty[][]
    CoreEnhancementProps: IValueProperty[][]
}