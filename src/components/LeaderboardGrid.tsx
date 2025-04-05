import { BaseWeapon, Character, LeaderboardProfile } from "@interknot/types"
import { Center, Title } from "@mantine/core"
import { LeaderboardButton } from "./LeaderboardButton"
import "./styles/LeaderboardGrid.css"
import { memo, useMemo } from "react"

export const shouldShowLeaderboards = (p?: LeaderboardProfile) => 
    p?.Agents?.some(a => a.Total > 20) ?? false

interface ILeaderboardGridProps {
    profile?: LeaderboardProfile
    characters: Character[]
    onProfileClick?: (agentId: number) => void
}

export function LeaderboardGrid({ profile, characters, onProfileClick }: ILeaderboardGridProps) {
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
            const character = characters.find(c => c.Id === agent.Agent.Id)
            if (!character) return groups
            
            const type = buttonType(character, agent.Weapon)
            const agentId = agent.Agent.Id
            
            if (!groups[agentId] || type < groups[agentId].type) {
                groups[agentId] = { agent, type }
            }
            
            return groups
        }, {} as Record<string, { agent: typeof profile.Agents[0], type: number }>)
        
        // Extract only the highest priority agent for each ID
        return Object.values(agentGroups).map(g => g.agent)
    }, [profile?.Agents, characters])

    return (<>
        {
            shouldShowLeaderboards(profile) ?
            <div className="lb-grid">
                {
                    prioritizedAgents.map(a => {
                        return <LeaderboardButton key={a.LeaderboardId} 
                            id={a.LeaderboardId}
                            agent={a.Agent} 
                            weapon={a.Weapon} 
                            name={a.LeaderboardName}
                            rank={a.Rank}
                            total={a.Total}
                            type={buttonType(characters.find(c => c.Id === a.Agent.Id)!, a.Weapon)}
                            onClick={() => {
                                onProfileClick?.(a.Agent.Id)
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