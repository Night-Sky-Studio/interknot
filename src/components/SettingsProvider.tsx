import { createContext, useCallback, useContext, useEffect } from "react"
import { useLocalStorage } from "@mantine/hooks"
import { Localizations, AdditionalProps, AvailableLocs } from "../localization/Localization"

type InterknotSettingsBase = {
    decimalPlaces: number,
    language: string,
    lbButtonVariant: number,
}

type InterknotSettings = InterknotSettingsBase & {
    setDecimalPlaces: (value: number) => void,
    setLanguage: (value: string) => void,
    getLocalString: (value: string) => string,
    setLbButtonVariant: (value: number) => void
}

const navigatorLanguage = navigator.language.split("-")[0]

const defaultSettings: InterknotSettingsBase = {
    decimalPlaces: 1,
    language: AvailableLocs.includes(navigatorLanguage) ? navigatorLanguage : "en",
    lbButtonVariant: 0
}

const defaultCallbacks: InterknotSettings = {
    ...defaultSettings,
    setDecimalPlaces: () => {},
    setLanguage: () => {},
    getLocalString: () => "",
    setLbButtonVariant: () => {}
}

export const SettingsContext = createContext(defaultCallbacks)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useLocalStorage<InterknotSettingsBase>({ key: "settings", defaultValue: defaultSettings })

    const setDecimalPlaces = (decimalPlaces: number) => setSettings((prev) => ({ ...prev, decimalPlaces }))
    const setLanguage = (language: string) => setSettings((prev) => ({ ...prev, language }))
    const setLbButtonVariant = (lbButtonVariant: number) => setSettings((prev => ({ ...prev, lbButtonVariant })))

    useEffect(() => {
        if (!AvailableLocs.includes(settings.language)) {
            setLanguage(navigatorLanguage)
            return
        }
        document.documentElement.setAttribute("lang", settings.language)
    }, [settings.language])

    const getLocalString = useCallback((value: string) => {
        const str = Localizations[settings.language][value]
        if (!str) { // additionalProp?
            const fallback = AdditionalProps[value]
            if (!fallback) {
                return value
            }
            return fallback
        }
        return Localizations[settings.language][value]
    }, [settings.language])

    return (
        <SettingsContext.Provider value={{ 
            ...settings, 
            setDecimalPlaces, 
            setLanguage, 
            getLocalString,
            setLbButtonVariant
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => useContext(SettingsContext)