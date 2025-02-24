// !== Character

import type { Property } from "./Property"
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
    BaseProps: Property[]
    GrowthProps: Property[]
    PromotionProps: Property[][]
    CoreEnhancementProps: Property[][]
}