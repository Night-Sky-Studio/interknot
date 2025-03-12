import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "@mantine/hooks"
import { Localizations } from "../localization/Localization"

export enum Unit {
    CritValue = "CV",
    RollValue = "RV"
}
export const Units: Unit[] = [Unit.CritValue, Unit.RollValue]

type InterknotSettings = {
    units: Unit,
    decimalPlaces: number,
    language: string,
    setUnits: (value: Unit) => void,
    setDecimalPlaces: (value: number) => void,
    setLanguage: (value: string) => void,
    getLocalString: (value: string) => string
}

const defaultSettings: InterknotSettings = {
    units: Unit.CritValue,
    decimalPlaces: 2,
    language: "en",
    setUnits: () => {},
    setDecimalPlaces: () => {},
    setLanguage: () => {},
    getLocalString: () => ""
}

export const SettingsContext = createContext(defaultSettings)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useLocalStorage<InterknotSettings>({ key: "settings", defaultValue: defaultSettings })

    const [units, setUnits] = useState<Unit>(settings.units)
    const [decimalPlaces, setDecimalPlaces] = useState<number>(settings.decimalPlaces)
    const [language, setLanguage] = useState<string>(settings.language)

    useEffect(() => {
        setSettings((prev) => { return {
            ...prev,
            units: units, 
            decimalPlaces: decimalPlaces,
            language: language
        }})
        console.log(units, decimalPlaces, language)
    }, [units, decimalPlaces, language])

    const getLocalString = useCallback((value: string) => {
        return Localizations[language][value]
    }, [language])

    return (
        <SettingsContext.Provider value={{ 
            ...settings, 
            setUnits, 
            setDecimalPlaces, 
            setLanguage, 
            getLocalString 
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => useContext(SettingsContext)