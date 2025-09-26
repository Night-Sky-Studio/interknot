import { BaseLeaderboardEntry } from "@interknot/types";
import { createContext, useContext, useMemo, useState } from "react";

type LeaderboardContextType = {
    agents: Omit<BaseLeaderboardEntry, "RotationValue">[]
    setProfiles: (profiles: Omit<BaseLeaderboardEntry, "RotationValue">[]) => void
}

export const LeaderboardContext = createContext({} as LeaderboardContextType);

export default function LeaderboardProvider({ children }: { children: React.ReactNode }) {
    const [profiles, setProfiles] = useState<Omit<BaseLeaderboardEntry, "RotationValue">[]>([])

    const value = useMemo(() => ({
        agents: profiles,
        setProfiles
    }), [profiles])

    return (
        <LeaderboardContext.Provider value={value}>
            {children}
        </LeaderboardContext.Provider>
    )
}

export const useLeaderboards = () => useContext(LeaderboardContext)