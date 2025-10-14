import { CardCustomization } from "@interknot/types"
import { createContext, useContext, useState } from "react"

type CardSettingsContextType = {
    showSubstatsBreakdown: boolean
    showBuildName: boolean
    showUserInfo: boolean
    showGraph: boolean
    showRanking: boolean
    showCritValue: boolean
    selectedLeaderboardId?: number
    cardCustomization?: CardCustomization
    setShowSubstatsBreakdown: (value: boolean) => void
    setShowBuildName: (value: boolean) => void
    setShowUserInfo: (value: boolean) => void
    setShowGraph: (value: boolean) => void
    setShowRanking: (value: boolean) => void
    setShowCritValue: (value: boolean) => void
    setSelectedLeaderboardId: (value?: number) => void
    setCardCustomization: (value?: CardCustomization) => void

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
    setShowSubstatsBreakdown: () => {},
    setShowBuildName: () => {},
    setShowUserInfo: () => {},
    setShowGraph: () => {},
    setShowRanking: () => {},
    setShowCritValue: () => {},
    setSelectedLeaderboardId: () => {},
    setCardCustomization: () => {},

    cardRef: undefined,
    setCardRef: () => {}
}

export const CardSettingsContext = createContext(defaultValue)

export interface ICardSettingsProviderProps {
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

            setCardRef
        }}>
            {children}
        </CardSettingsContext.Provider>
    )
}

export const useCardSettings = () => useContext(CardSettingsContext)