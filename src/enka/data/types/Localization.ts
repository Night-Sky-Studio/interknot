import locs from "../raw/locs.json"

const Localizations = locs as Record<string, Record<string, string>>
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