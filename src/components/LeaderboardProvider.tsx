import { getLeaderboards, getUserCharacterLeaderboards } from "@/api/data"
import { LeaderboardEntry, LeaderboardList } from "@interknot/types"
import { Center, Loader } from "@mantine/core"
import { createContext, useContext, useMemo } from "react"
import { useAsync } from "react-use"

type LeaderboardContextType = {
    isAvailable: boolean
    entries: Omit<LeaderboardEntry, "Build">[]
    leaderboards: LeaderboardList[]
    highlightId?: number
}

const defaultValue: LeaderboardContextType = {
    isAvailable: false,
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

    const isAvailable = useMemo(() => leaderboards.length > 0, [leaderboards])

    const isLoading = useMemo(() => entriesState.loading || leaderboardsState.loading, [entriesState.loading, leaderboardsState.loading])
    const highlightId = useMemo(() => {
        if (entries.length === 0) return undefined
        
        const sorted = entries.toSorted((a, b) => a.Rank - b.Rank)
        const best = 
            sorted.find(e => e.Type === 0) ?? 
            sorted.find(e => e.Type === 1) ?? 
            sorted.find(e => e.Type === 2)
        
        return best?.Leaderboard.Id
    }, [entries])

    const value = useMemo(() => ({
        isAvailable,
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