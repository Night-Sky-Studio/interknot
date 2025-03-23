import { SkillTag } from "@interknot/types"
import locs from "./locs.json"

export const Localizations = locs as Record<string, Record<string, string>>
export const AvailableLocs = Object.keys(Localizations)

export let currentLocale = "en"

export function setLocale(loc: string) {
    if (AvailableLocs.indexOf(loc) === -1) 
        throw new Error(`Unknown locale: ${loc}. Available locales: ${AvailableLocs.join(", ")}`)
    currentLocale = loc
}

export function getLocalString(key: string): string {
    return Localizations[currentLocale][key]
}

const tagNameMap: Record<SkillTag, string> = {
    [SkillTag.BasicAtk]: "Basic Attack",
    [SkillTag.Dash]: "Dash",
    [SkillTag.Counter]: "Counter",
    [SkillTag.QuickAssist]: "Quick Assist",
    [SkillTag.DefensiveAssist]: "Def Assist",
    [SkillTag.EvasiveAssist]: "Evasive Assist",
    [SkillTag.FollowUpAssist]: "Follow-up Assist",
    [SkillTag.Special]: "Special",
    [SkillTag.ExSpecial]: "Ex Special",
    [SkillTag.Chain]: "Chain",
    [SkillTag.Ultimate]: "Ultimate",
    [SkillTag.AttributeAnomaly]: "Attribute Anomaly",
    [SkillTag.Aftershock]: "Aftershock"
}

const tagShortNameMap: Record<SkillTag, string> = {
    [SkillTag.BasicAtk]: "BA",
    [SkillTag.Dash]: "Dash",
    [SkillTag.Counter]: "Counter",
    [SkillTag.QuickAssist]: "QA",
    [SkillTag.DefensiveAssist]: "DA",
    [SkillTag.EvasiveAssist]: "EA",
    [SkillTag.FollowUpAssist]: "FuA",
    [SkillTag.Special]: "SP",
    [SkillTag.ExSpecial]: "EX",
    [SkillTag.Chain]: "Chain",
    [SkillTag.Ultimate]: "Ultimate",
    [SkillTag.AttributeAnomaly]: "AA",
    [SkillTag.Aftershock]: "AS"
}

export function getTagName(tag: SkillTag): string {
    const enumValue = SkillTag[tag as unknown as keyof typeof SkillTag]
    return tagNameMap[enumValue]
}

export function getTagShortName(tag: SkillTag): string {
    const enumValue = SkillTag[tag as unknown as keyof typeof SkillTag]
    return tagShortNameMap[enumValue]
}