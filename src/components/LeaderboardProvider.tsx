import { getLeaderboards, getUserCharacterLeaderboards } from "@/api/data"
import { BaseLeaderboardEntry, LeaderboardList } from "@interknot/types"
import { Center, Loader } from "@mantine/core"
import { createContext, useContext, useMemo } from "react"
import { useAsync } from "react-use"

type LeaderboardContextType = {
    entries: BaseLeaderboardEntry[]
    leaderboards: LeaderboardList[]
    highlightId?: number
}

const defaultValue: LeaderboardContextType = {
    entries: [],
    leaderboards: [],
    highlightId: undefined
}

export const LeaderboardContext = createContext(defaultValue)

export interface ILeaderboardProviderProps {
    uid: number
    characterId: number
    children: React.ReactNode
}

export default function LeaderboardProvider({ uid, characterId, children }: ILeaderboardProviderProps) {
    const entriesState = useAsync(async () => await getUserCharacterLeaderboards(uid, characterId))
    const leaderboardsState = useAsync(async () => await getLeaderboards({ filter: { characterId: characterId.toString() } }, true), [characterId])

    const entries = useMemo(() => entriesState.value?.data ?? [], [entriesState.value])
    const leaderboards = useMemo(() => leaderboardsState.value?.data ?? [], [leaderboardsState.value])
    
    const isLoading = useMemo(() => entriesState.loading || leaderboardsState.loading, [entriesState.loading, leaderboardsState.loading])
    // This is stupid and I hate it, but god bless lazy evaluation
    const highlightId = useMemo(() => entries.toSorted((a, b) => b.TotalValue - a.TotalValue)
        .find(e => e.Type === 0 || e.Type === 1 || e.Type === 2)?.Leaderboard.Id, [entries])

    const value = useMemo(() => ({
        entries,
        leaderboards,
        highlightId
    } satisfies LeaderboardContextType), [entries, leaderboards, highlightId])

    return (
        <LeaderboardContext.Provider value={value}>
            {isLoading 
                ? <Center><Loader /></Center>
                : children}
        </LeaderboardContext.Provider>
    )
}

export const useLeaderboards = () => useContext(LeaderboardContext)