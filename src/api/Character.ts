import { AvatarSkin, getAvatar, getSkin, FormattedStatProperty } from "./definitions/mappers/Avatars"
import { getLocalString } from "./definitions/mappers/Localization"
import { formatProperty } from "./definitions/mappers/Properties"
import { getWeaponMainStatMultiplier, getWeaponSecondaryStatMultiplier, getWeaponStarMultiplier } from "./definitions/mappers/RawDataTables"
import { getWeaponData, WeaponData } from "./definitions/mappers/Weapons"
import { AvatarList } from "./EnkaResponse"

export interface Character {
    Id: number
    Name: string
    Level: number
    PromotionLevel: number
    Exp: number
    Skin: AvatarSkin | undefined
    TalentLevel: number
    CoreSkillEnhancement: number
    Weapon: Weapon
    
    WeaponEffect: boolean | null
    IsHidden: boolean
}

type RawWeapon = {
    IsAvailable: boolean
    IsLocked: boolean
    Id: number
    Uid: number
    Level: number
    BreakLevel: number
    Exp: number
    UpgradeLevel: number
}

interface Weapon {
    Id: number
    Uid: number             // multiple weapons of the same type
    Name: string
    Level: number
    BreakLevel: number
    IsAvailable: boolean
    IsLocked: boolean
    Exp: number
    UpgradeLevel: number
    MainStat: FormattedStatProperty
    SecondaryStat: FormattedStatProperty
}

function mapWeapon(w: WeaponData, r: RawWeapon): Weapon {
    const 
        mainStatMul = getWeaponMainStatMultiplier(w.Rarity, r.Level) ?? 0,
        starMul = getWeaponStarMultiplier(w.Rarity, r.BreakLevel) ?? 0,
        secStatMul = getWeaponSecondaryStatMultiplier(w.Rarity, r.BreakLevel) ?? 0,

        mainStatValue = Math.floor(w.MainStat.Value * (1 + mainStatMul / 10000 + starMul / 10000)),
        secStatValue = w.SecondaryStat.Value * (1 + secStatMul / 10000)
    return {
        Id: w.Id,
        Uid: r.Uid,
        Name: w.Name,
        Level: r.Level,
        BreakLevel: r.BreakLevel,
        IsAvailable: r.IsAvailable,
        IsLocked: r.IsLocked,
        Exp: r.Exp,
        UpgradeLevel: r.UpgradeLevel,
        MainStat: {
            Id: w.MainStat.Id,
            Name: w.MainStat.Name,
            RawValue: mainStatValue,
            Value: formatProperty(w.MainStat.Format, mainStatValue)
        },
        SecondaryStat: {
            Id: w.SecondaryStat.Id,
            Name: w.SecondaryStat.Name,
            RawValue: secStatValue,
            Value: formatProperty(w.SecondaryStat.Format, secStatValue)
        }
    }
}

export function mapCharacter(r: AvatarList): Character {
    const avatar = getAvatar(r.Id)
    return {
        Id: r.Id,
        Name: avatar.Name,
        Level: r.Level,
        PromotionLevel: r.PromotionLevel,
        Exp: r.Exp,
        Skin: getSkin(r.SkinId),
        TalentLevel: r.TalentLevel,
        CoreSkillEnhancement: r.CoreSkillEnhancement,
        Weapon: mapWeapon(getWeaponData(r.Weapon.Id), r.Weapon),
        WeaponEffect: { 0: null, 1: false, 2: true }[r.WeaponEffectState] ?? null,
        IsHidden: r.IsHidden,
    }
}