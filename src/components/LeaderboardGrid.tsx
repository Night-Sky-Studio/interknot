import { BaseWeapon, Character, LeaderboardProfile } from "@interknot/types"
import { Center, Title } from "@mantine/core"
import { LeaderboardButton } from "./LeaderboardButton"
import "./styles/LeaderboardGrid.css"
import { memo } from "react"

export const shouldShowLeaderboards = (p?: LeaderboardProfile) => 
    p?.Agents?.some(a => a.Total > 20) ?? false

export function LeaderboardGrid({ profile, characters }: { profile?: LeaderboardProfile, characters: Character[] }) {
    const buttonType = (c: Character, w: BaseWeapon): number => {
        if (c.Weapon?.Id == w.Id) {
            return 0 // matches weapon
        }
        if (c.Weapon?.SecondaryStat.Id == w.SecondaryStat.Id) {
            return 1 // matches secondary-stat
        }
        return 2 // doesn't match
    }

    return (<>
        {
            shouldShowLeaderboards(profile) ?
            <div className="lb-grid">
                {
                    profile?.Agents.map(a => {
                        return <LeaderboardButton key={a.Agent.Id} 
                        agent={a.Agent} 
                        weapon={a.Weapon} 
                        name={a.LeaderboardName}
                        rank={a.Rank}
                        total={a.Total}
                        type={buttonType(characters.find(c => c.Id === a.Agent.Id)!, a.Weapon)} />
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