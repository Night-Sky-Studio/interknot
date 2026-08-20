import { type CardCustomization } from "@interknot/types"

export type CharacterArtOverride = {
    base?: Partial<CardCustomization>
    [skinId: number]: Partial<CardCustomization> | undefined
}

const DEFAULTS: Record<number, CharacterArtOverride> = { 
    // Anby
    1011: {
        base: { CharacterTransform: { X: -0.15 } }
    },
    // Corin
    1061: {
        base: { CharacterTransform: { X: -0.1 } }
    },
    // Caesar
    1071: {
        base: { CharacterTransform: { X: -0.1 } }
    },
    // Ben
    1121: {
        base: { CharacterTransform: { X: 0.08, Y: -0.06 } },
    },
    // Soukaku
    1131: {
        base: { CharacterTransform: { X: -0.05 } },
    },
    // Lucy
    1151: {
        base: { CharacterTransform: { X: -0.08 } },
        3111511: { CharacterTransform: { X: -0.08, Scale: 1.1 } }
    },
    // Burnice
    1171: {
        base: { CharacterTransform: { Scale: 1.2, X: -0.075, Y: -0.05 } }
    },
    // Ellen
    1191: {
        base: { CharacterTransform: { X: -0.1 } },
        3111911: { CharacterTransform: { X: 0.12 } }
    },
    // Harumasa
    1201: {
        base: { CharacterTransform: { X: -0.07 } }
    },
    // Rina
    1211: {
        base: { CharacterTransform: { X: 0.08 } }
    },
    // Yanagi
    1221: { 
        base: { CharacterTransform: { X: 0.10 } } 
    },
    // Jane
    1261: {
        3112611: { CharacterTransform: { X: -0.10 } }
    },
    // Piper
    1281: {
        base: { CharacterTransform: { X: 0.1 } }
    },
    // Hugo
    1291: {
        base: { CharacterTransform: { X: -0.08 } },
    },
    // Astra Yao
    1311: {
        base: { CharacterTransform: { Y: -0.03 } },
        3113111: { CharacterTransform: { Y: -0.05 } }
    },
    // Evelyn
    1321: {
        base: { CharacterTransform: { X: -0.07 } }
    },
    // Vivian
    1331: {
        base:  { CharacterTransform: { X: -0.07, Y: -0.15 } },
        3113311: { CharacterTransform: { Y: -0.1 } }
    },
    // Pulchra
    1351: {
        base: { CharacterTransform: { Y: -0.08 } }
    },
    // Trigger
    1361: {
        base: { CharacterTransform: { X: 0.05 } }
    },
    // Yixuan
    1371: {
        base: { CharacterTransform: { X: -0.07 } }
    },
    // Ju Fufu
    1391: {
        base: { CharacterTransform: { X: 0.1 } },
    },
    // Alice
    1401: {
        base: { CharacterTransform: { X: 0.08 } },
        3114011: { CharacterTransform: { X: -0.1 } }
    },
    // Yuzuha
    1411: {
        base: { CharacterTransform: { Y: -0.15 } }
    },
    // Ye Shunguang
    1431: {
        3114311: { CharacterTransform: { X: -0.1 } }
    },
    // Manato
    1441: {
        base: { CharacterTransform: { X: 0.06 } },
        3114411: { CharacterTransform: { X: 0.06 } }
    },
    // Lucia
    1451: {
        base: { CharacterTransform: { X: 0.06, Y: -0.04 } },
    },
    // Seed
    1461: {
        base: { CharacterTransform: { X: -0.08 } }
    },
    // Banyue
    1471: {
        base: { CharacterTransform: { Y: -0.1 } }
    },
    // Silly
    1531: {
        base: { CharacterTransform: { X: -0.02, Y: -0.06 } }
    },
    // Pyrois
    1551: {
        base: { CharacterTransform: { X: -0.1, Y: -0.02 } }
    },
    // Remielle - wings
    1581: {
        base: { CharacterTransform: { X: -0.05 } }, 
        3115812: { CharacterTransform: { X: 0.05 } }, // swimsuit
        3115811: { CharacterTransform: { X: -0.12 } }, // no mask
        3115813: { CharacterTransform: { X: -0.12 } } // mask
    },
    // Sigrid
    1591: {
        base: { CharacterTransform: { X: 0.15, Y: -0.05, Scale: 1.2 } },
        3115911: { CharacterTransform: { X: -0.03, Y: -0.35 } }
    }
}

export function getDefaultCustomization(characterId: number, skinId?: number): Partial<CardCustomization> | undefined {
    const character = DEFAULTS[characterId]
    if (!character) return undefined

    return skinId !== undefined ? character[skinId] : character.base
}
