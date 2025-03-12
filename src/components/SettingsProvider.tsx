import { createContext, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "@mantine/hooks"

export enum Unit {
    CritValue = "CV",
    RollValue = "RV"
}
export const Units: Unit[] = [Unit.CritValue, Unit.RollValue]

type InterknotSettings = {
    units: Unit,
    decimalPlaces: number,
    setUnits: (value: Unit) => void
    setDecimalPlaces: (value: number) => void
}

const defaultSettings: InterknotSettings = {
    units: Unit.CritValue,
    decimalPlaces: 2,
    setUnits: () => {},
    setDecimalPlaces: () => {}
}

export const SettingsContext = createContext(defaultSettings)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useLocalStorage<InterknotSettings>({ key: "settings", defaultValue: defaultSettings })

    const [units, setUnits] = useState<Unit>(settings.units)
    const [decimalPlaces, setDecimalPlaces] = useState<number>(settings.decimalPlaces)

    useEffect(() => {
        setSettings((prev) => { return {
            ...prev,
            units: units, 
            decimalPlaces: decimalPlaces
        }})
    }, [units, decimalPlaces])

    return (
        <SettingsContext.Provider value={{ ...settings, setUnits, setDecimalPlaces }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => useContext(SettingsContext)