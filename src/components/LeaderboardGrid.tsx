import { LeaderboardProfile } from "@interknot/types"
import { Center, Title } from "@mantine/core"
import { LeaderboardButton } from "./LeaderboardButton"
import "./styles/LeaderboardGrid.css"
import { memo } from "react"

export const shouldShowLeaderboards = (p?: LeaderboardProfile) => true
    // p?.Agents.some(a => a.Weapons.some(w => w.Players > 100)) ?? false

export function LeaderboardGrid({ profile }: { profile: LeaderboardProfile }) {
    return (<>
        {
            shouldShowLeaderboards(profile) ?
            <div className="lb-grid">
                {
                    profile.Agents.map(a => 
                        a.Weapons.map(w => 
                            <LeaderboardButton key={a.Agent.Id} agent={a.Agent} weapon={w} />
                        )
                    )
                }
            </div>
            : <Center>
                <Title m="xl" p="md" order={6} className="lb-data-collection">Data is being collected, please be patient...</Title>
            </Center>
        }
    </>)
}

export const LeaderboardGridMemorized = memo(LeaderboardGrid)