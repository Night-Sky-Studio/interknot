import { CardCustomization } from "@interknot/types"
import React, { createContext, useContext, useState } from "react"

const CUSTOMIZATIONS_KEY = "customizations"
const SCHEMA_VERSION = 2

interface ICustomizationStorage {
    Version: number
    Entries: Record<number, CardCustomization | undefined>
}

type LegacyCustomizationStorage = Record<number, CardCustomization | undefined>

function isVersioned(data: unknown): data is ICustomizationStorage {
    return typeof data === "object" && data !== null
        && typeof (data as ICustomizationStorage).Version === "number"
}

function migrate(legacy: LegacyCustomizationStorage): ICustomizationStorage {
    const entries: Record<number, CardCustomization | undefined> = {}

    for (const [buildId, customization] of Object.entries(legacy)) {
        if (!customization) continue

        const transform = customization.CharacterTransform
        entries[Number(buildId)] = {
            ...customization,
            CharacterTransform: transform
                ? { Flipped: transform.Flipped, Rotation: transform.Rotation }
                : undefined
        }
    }

    return { Version: SCHEMA_VERSION, Entries: entries }
}

function writeStorage(storage: ICustomizationStorage) {
    try {
        localStorage.setItem(CUSTOMIZATIONS_KEY, JSON.stringify(storage))
    } catch (e) {
        console.error("Failed to write card customizations", e)
    }
}

function readStorage(): ICustomizationStorage {
    try {
        const localData = localStorage.getItem(CUSTOMIZATIONS_KEY)
        if (!localData) return { Version: SCHEMA_VERSION, Entries: {} }

        const data: unknown = JSON.parse(localData)
        if (isVersioned(data)) return data

        const migrated = migrate(data as LegacyCustomizationStorage)
        writeStorage(migrated)
        console.log("Migrated card customizations to schema", SCHEMA_VERSION)
        return migrated
    } catch (e) {
        console.error("Failed to read card customizations", e)
        return { Version: SCHEMA_VERSION, Entries: {} }
    }
}

type CardSettingsContextType = {
    showSubstatsBreakdown: boolean
    showBuildName: boolean
    showUserInfo: boolean
    showGraph: boolean
    showRanking: boolean
    showCritValue: boolean
    selectedLeaderboardId?: number
    cardCustomization?: CardCustomization
    isEditing: boolean
    cardScale: number

    setShowSubstatsBreakdown: (value: boolean) => void
    setShowBuildName: (value: boolean) => void
    setShowUserInfo: (value: boolean) => void
    setShowGraph: (value: boolean) => void
    setShowRanking: (value: boolean) => void
    setShowCritValue: (value: boolean) => void
    setSelectedLeaderboardId: (value?: number) => void
    setCardCustomization: (value?: CardCustomization) => void
    setIsEditing: (value: boolean) => void
    setCardScale: (value: number) => void

    getLocalCustomization: (buildId: number) => CardCustomization | undefined
    setLocalCustomization: (buildId: number, customization: CardCustomization | undefined) => void

    cardRef?: React.RefObject<HTMLDivElement | null>
    setCardRef: (ref: React.RefObject<HTMLDivElement | null>) => void
}

const defaultValue: CardSettingsContextType = {
    showSubstatsBreakdown: true,
    showBuildName: true,
    showUserInfo: true,
    showGraph: true,
    showRanking: true,
    showCritValue: false,
    selectedLeaderboardId: undefined,
    cardCustomization: undefined,
    isEditing: false,
    cardScale: 1,

    setShowSubstatsBreakdown: () => {},
    setShowBuildName: () => {},
    setShowUserInfo: () => {},
    setShowGraph: () => {},
    setShowRanking: () => {},
    setShowCritValue: () => {},
    setSelectedLeaderboardId: () => {},
    setCardCustomization: () => {},
    setIsEditing: () => {},
    setCardScale: () => {},

    getLocalCustomization: () => undefined,
    setLocalCustomization: () => {},

    cardRef: undefined,
    setCardRef: () => {}
}

const CardSettingsContext = createContext<CardSettingsContextType | undefined>(undefined)

interface ICardSettingsProviderProps {
    children: React.ReactNode
}

export default function CardSettingsProvider({ children }: ICardSettingsProviderProps) {
    const [settings, setSettings] = useState<CardSettingsContextType>(defaultValue)

    const setShowSubstatsBreakdown = (showSubstatsBreakdown: boolean) => {
        setSettings((prev) => ({ ...prev, showSubstatsBreakdown }))
    }
    const setShowBuildName = (showBuildName: boolean) => {
        setSettings((prev) => ({ ...prev, showBuildName }))
    }
    const setShowUid = (showUid: boolean) => {
        setSettings((prev) => ({ ...prev, showUserInfo: showUid }))
    }
    const setShowGraph = (showGraph: boolean) => {
        setSettings((prev) => ({ ...prev, showGraph }))
    }
    const setShowRanking = (showRanking: boolean) => {
        setSettings((prev) => ({ ...prev, showRanking }))
    }
    const setShowCritValue = (showCritValue: boolean) => {
        setSettings((prev) => ({ ...prev, showCritValue }))
    }
    const setSelectedLeaderboardId = (selectedLeaderboardId?: number) => {
        setSettings((prev) => ({ ...prev, selectedLeaderboardId }))
    }
    const setCardCustomization = (cardCustomization?: CardCustomization) => {
        setSettings((prev) => ({ ...prev, cardCustomization }))
    }
    const setIsEditing = (isEditing: boolean) => {
        setSettings((prev) => ({ ...prev, isEditing }))
    }
    const setCardScale = (cardScale: number) => {
        setSettings((prev) => ({ ...prev, cardScale }))
    }

    const getLocalCustomization = (buildId: number): CardCustomization | undefined => {
        return readStorage().Entries[buildId]
    }

    const setLocalCustomization = (buildId: number, customization: CardCustomization | undefined) => {
        const storage = readStorage()
        storage.Entries[buildId] = customization
        writeStorage(storage)
    }

    const setCardRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        setSettings((prev) => ({ ...prev, cardRef: ref }))
    }

    return (
        <CardSettingsContext.Provider value={{
            ...settings,
            setShowSubstatsBreakdown,
            setShowBuildName,
            setShowUserInfo: setShowUid,
            setShowGraph,
            setShowRanking,
            setShowCritValue,
            setSelectedLeaderboardId,
            setCardCustomization,
            setIsEditing,
            setCardScale,

            getLocalCustomization,
            setLocalCustomization,

            setCardRef
        }}>
            {children}
        </CardSettingsContext.Provider>
    )
}

export function useCardSettings() {
    const context = useContext(CardSettingsContext)
    const contextAvailable = context !== undefined
    return { context, contextAvailable }
}