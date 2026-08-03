import { createContext, useCallback, useContext, useEffect } from "react"
import { useLocalStorage } from "@mantine/hooks"
import { Localizations, AdditionalProps, AvailableLocs, AssaultLocalizations } from "../localization/Localization"

type InterknotSettingsBase = {
    decimalPlaces: number,
    language: string,
    lbButtonVariant: number,
    cvEnabled?: boolean
}

type InterknotSettings = InterknotSettingsBase & {
    setDecimalPlaces: (value: number) => void,
    setCvEnabled: (value: boolean) => void,
    setLanguage: (value: string) => void,
    getLocalString: (value: string, lang?: string) => string,
    getLevel: (level: number) => string,
    setLbButtonVariant: (value: number) => void
}

const navigatorLanguage = navigator.language.split("-")[0]

const defaultSettings: InterknotSettingsBase = {
    decimalPlaces: 1,
    language: AvailableLocs.includes(navigatorLanguage) ? navigatorLanguage : "en",
    lbButtonVariant: 0,
    cvEnabled: false
}

const defaultCallbacks: InterknotSettings = {
    ...defaultSettings,
    setDecimalPlaces: () => {},
    setCvEnabled: () => {},
    setLanguage: () => {},
    getLocalString: () => "",
    getLevel: () => "",
    setLbButtonVariant: () => {}
}

export const SettingsContext = createContext(defaultCallbacks)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useLocalStorage<InterknotSettingsBase>({ key: "settings", defaultValue: defaultSettings })

    const setDecimalPlaces = (decimalPlaces: number) => setSettings((prev) => ({ ...prev, decimalPlaces }))
    const setCvEnabled = (cvEnabled: boolean) => setSettings((prev) => ({ ...prev, cvEnabled }))
    const setLanguage = (language: string) => setSettings((prev) => ({ ...prev, language }))
    const setLbButtonVariant = (lbButtonVariant: number) => setSettings((prev => ({ ...prev, lbButtonVariant })))

    useEffect(() => {
        if (!AvailableLocs.includes(settings.language)) {
            setLanguage(navigatorLanguage)
            return
        }
        document.documentElement.setAttribute("lang", settings.language)
    }, [settings.language])

    const getLocalString = useCallback((value: string, lang?: string) => {
        const str = Localizations[lang ?? settings.language][value]
        if (!str) { 
            const assault = AssaultLocalizations[lang ?? settings.language][value]
            if (assault !== undefined && assault !== "") {
                return assault
            }

            // additionalProp?
            const fallback = AdditionalProps[value]
            if (fallback !== undefined && fallback !== "") {
                return fallback
            }

            return value
        }
        return str
    }, [settings.language])

    const getLevel = (level: number) => {
        const str = getLocalString("UI_Level")
        if (!str) {
            return `Lv. ${level}`
        }

        return str.replace("{0}", level.toString())
    }

    return (
        <SettingsContext.Provider value={{ 
            ...settings, 
            setDecimalPlaces, 
            setCvEnabled,
            setLanguage, 
            getLocalString,
            getLevel,
            setLbButtonVariant
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => useContext(SettingsContext)