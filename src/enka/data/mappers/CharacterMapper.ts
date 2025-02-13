import type { AvatarList } from "../../api/EnkaResponse"
import type { BaseAvatar } from "../types/Avatar"
import type { Character } from "../types/Character"
import { getAvatar, pickBaseAvatar } from "./AvatarMapper"
import { mapDriveDisk } from "./DriveDiskMapper"
import { getSkin } from "./SkinMapper"
import { mapWeaponData } from "./WeaponMapper"


export function mapCharacter(raw: AvatarList): Character {
    const avatar = getAvatar(raw.Id)
    return {
        ...pickBaseAvatar(avatar),
        Id: raw.Id,
        Level: raw.Level,
        PromotionLevel: raw.PromotionLevel,
        Skin: getSkin(avatar, raw.SkinId) ?? null,
        MindscapeLevel: raw.TalentLevel,
        CoreSkillEnhancement: raw.CoreSkillEnhancement,
        Weapon: mapWeaponData(raw.Weapon) ?? null,
        WeaponEffect: { 0: null, 1: false, 2: true }[raw.WeaponEffectState] ?? null,
        IsHidden: raw.IsHidden,
        DriveDisks: raw.EquippedList.map(mapDriveDisk)
    }
}