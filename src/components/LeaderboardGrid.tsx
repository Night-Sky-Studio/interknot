import { BaseWeapon, Character, LeaderboardProfile } from "@interknot/types"
import { Center, Title } from "@mantine/core"
import { LeaderboardButton } from "./LeaderboardButton"
import "./styles/LeaderboardGrid.css"
import { memo, useMemo } from "react"
import { useLeaderboards } from "./LeaderboardProvider"

export const shouldShowLeaderboards = (p?: LeaderboardProfile) => 
    p?.Agents?.some(a => a.Total > 20) ?? false

interface ILeaderboardGridProps {
    profile?: LeaderboardProfile
    characters: Character[]
    onProfileClick?: (agentId: number) => void
}

export function LeaderboardGrid({ profile, characters, onProfileClick }: ILeaderboardGridProps) {
    const leaderboards = useLeaderboards()

    const buttonType = (c: Character, w: BaseWeapon): number => {
        if (c.Weapon?.Id == w.Id) {
            return 0 // matches weapon
        }
        if (c.Weapon?.SecondaryStat.Id == w.SecondaryStat.Id) {
            return 1 // matches secondary-stat
        }
        return 2 // doesn't match
    }

    // Filter agents to show only the highest priority one for each agent ID
    const prioritizedAgents = useMemo(() => {
        if (!profile?.Agents?.length) return []
        
        // Group agents by their Agent.Id
        const agentGroups = profile.Agents.reduce((groups, agent) => {
            const character = characters.find(c => c.Id === agent.Leaderboard.Character.Id)
            if (!character) return groups
            
            const type = buttonType(character, agent.Leaderboard.Weapon)
            const agentId = agent.Leaderboard.Character.Id
            
            if (!groups[agentId]) {
                groups[agentId] = {}
            }
            
            // Group by button type first
            if (!groups[agentId][type]) {
                groups[agentId][type] = agent
            } else {
                // If we already have an agent of this type, keep the one with the higher rank (lower number)
                if (agent.Rank < groups[agentId][type].Rank) {
                    groups[agentId][type] = agent
                }
            }
            
            return groups
        }, {} as Record<string, Record<number, typeof profile.Agents[0]>>)
        
        const result = Object.entries(agentGroups).map(([_, typeGroups]) => {
            // Get the lowest type number (highest priority) available
            const bestType = Math.min(...Object.keys(typeGroups).map(Number))
            return typeGroups[bestType]
        })

        leaderboards.setProfiles(result)
        
        return result
    }, [profile?.Agents, characters])

    return (<>
        {
            shouldShowLeaderboards(profile) ?
            <div className="lb-grid">
                {
                    prioritizedAgents.map(a => {
                        return <LeaderboardButton key={a.Leaderboard.Id} 
                            id={a.Leaderboard.Id}
                            agent={a.Leaderboard.Character} 
                            weapon={a.Leaderboard.Weapon} 
                            name={a.Leaderboard.Name}
                            rank={a.Rank}
                            total={a.Total}
                            type={buttonType(characters.find(c => c.Id === a.Leaderboard.Character.Id)!, a.Leaderboard.Weapon)}
                            onClick={() => {
                                onProfileClick?.(a.Leaderboard.Character.Id)
                            }} />
                    })
                }
            </div>
            : <Center>
                <Title m="xl" p="md" order={6} className="lb-data-collection">Data is being collected, please be patient...</Title>
            </Center>
        }
    </>)
}

export const LeaderboardGridMemorized = memo(LeaderboardGrid)