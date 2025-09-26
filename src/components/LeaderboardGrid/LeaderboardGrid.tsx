import { BaseLeaderboardEntry} from "@interknot/types"
import { LeaderboardButton } from "@components/LeaderboardButton/LeaderboardButton"
import "./LeaderboardGrid.css"
import { memo, useEffect } from "react"
import { useLeaderboards } from "@components/LeaderboardProvider"

interface ILeaderboardGridProps {
    entries?: Omit<BaseLeaderboardEntry, "RotationValue">[]
    onProfileClick?: (agentId: number) => void
}

export function LeaderboardGrid({ entries, onProfileClick }: ILeaderboardGridProps) {
    const leaderboards = useLeaderboards()

    useEffect(() => {
        leaderboards.setProfiles(entries ?? [])
    }, [entries])

    return (<>
        {
            <div className="lb-grid">
                {
                    entries?.sort((a, b) => a.Rank / a.Leaderboard.Total - b.Rank / b.Leaderboard.Total)
                        .map(a => {
                            return <LeaderboardButton key={a.Leaderboard.Id} 
                                id={a.Leaderboard.Id}
                                agent={a.Leaderboard.Character} 
                                weapon={a.Leaderboard.Weapon} 
                                name={a.Leaderboard.Name}
                                rank={a.Rank}
                                total={a.Leaderboard.Total}
                                type={a.Type}
                                onClick={() => {
                                    onProfileClick?.(a.Leaderboard.Character.Id)
                                }} />
                        })
                }
            </div>
            // <Center>
            //     <Title m="xl" p="md" order={6} className="lb-data-collection">No characters are available for existing leaderboards</Title>
            // </Center>
        }
    </>)
}

export const LeaderboardGridMemorized = memo(LeaderboardGrid)