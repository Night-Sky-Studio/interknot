import locs from "./source/locs.json"

const localizations = locs as Record<string, Record<string, string>>
export const availableLocales = Object.keys(localizations)

export let currentLocale = "en"

export function setLocale(loc: string) {
    if (availableLocales.indexOf(loc) === -1) 
        throw new Error(`Unknown locale: ${loc}. Available locales: ${availableLocales.join(", ")}`)
    currentLocale = loc
}

export function getLocalString(key: string): string {
    return localizations[currentLocale][key]
}