import { type CardCustomization } from "@interknot/types"

export type CharacterArtOverride = {
    base?: Partial<CardCustomization>
    [skinId: number]: Partial<CardCustomization> | undefined
}

const DEFAULTS: Record<number, CharacterArtOverride> = { }

export function getDefaultCustomization(characterId: number, skinId?: number): Partial<CardCustomization> | undefined {
    const character = DEFAULTS[characterId]
    if (!character) return undefined

    return skinId !== undefined ? character[skinId] : character.base
}
