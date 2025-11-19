import { SkillTag } from "@interknot/types"
import locs from "./locs.json"
import additionalProps from "./additionalProps.json"

export const Localizations = locs as Record<string, Record<string, string>>
export const AdditionalProps = additionalProps as Record<string, string>
export const AvailableLocs = Object.keys(Localizations)

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

const ShortPropertyNameMap: Record<number, string> = {
    11101: "HP",
    11102: "HP%",
    11103: "HP",
    12101: "ATK",
    12102: "ATK%",
    12103: "ATK",
    12201: "Impact",
    12202: "Impact%",
    13101: "DEF",
    13102: "DEF%",
    13103: "DEF",
    20101: "CRIT Rate",
    20103: "CRIT Rate",
    21101: "CRIT DMG",
    21103: "CRIT DMG",
    23101: "PEN%",
    23103: "PEN%",
    23201: "PEN",
    23203: "PEN",
    30501: "ER",
    30502: "ER%",
    30503: "ER",
    31201: "AP",
    31203: "AP",
    31401: "AM",
    31402: "AM%",
    31403: "AM",
    31501: "Physical DMG",
    31503: "Physical DMG",
    31601: "Fire DMG",
    31603: "Fire DMG",
    31701: "Ice DMG",
    31703: "Ice DMG",
    31801: "Electric DMG",
    31803: "Electric DMG",
    31901: "Ether DMG",
    31903: "Ether DMG",
    12301: "Sheer"
}

export function getShortPropertyName(id: number): string {
    return ShortPropertyNameMap[id] ?? id.toString()
}