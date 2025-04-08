import { createContext, useCallback, useContext, useEffect } from "react"
import { useLocalStorage } from "@mantine/hooks"
import { Localizations } from "../localization/Localization"

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

const defaultSettings: InterknotSettingsBase = {
    decimalPlaces: 1,
    language: navigator.language.split("-")[0],
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
        document.documentElement.setAttribute("lang", settings.language)
    }, [settings.language])

    const getLocalString = useCallback((value: string) => {
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